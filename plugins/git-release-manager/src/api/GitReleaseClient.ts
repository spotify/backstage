/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Octokit } from '@octokit/rest';
import { GitHubIntegration, ScmIntegrations } from '@backstage/integration';
import { DISABLE_CACHE } from '../constants/constants';

import { Project } from '../contexts/ProjectContext';
import { UnboxArray, UnboxReturnedPromise } from '../types/helpers';
import { GitReleaseManagerError } from '../errors/GitReleaseManagerError';
import { ConfigApi, OAuthApi } from '@backstage/core-plugin-api';

export class GitReleaseClient implements GitReleaseApi {
  private readonly githubAuthApi: OAuthApi;
  private readonly apiBaseUrl: string;
  readonly host: string;

  constructor({
    configApi,
    githubAuthApi,
  }: {
    configApi: ConfigApi;
    githubAuthApi: OAuthApi;
  }) {
    this.githubAuthApi = githubAuthApi;

    const gitHubIntegrations = ScmIntegrations.fromConfig(
      configApi,
    ).github.list();
    const { host, apiBaseUrl } = this.getGithubIntegrationConfig({
      gitHubIntegrations,
    });

    this.host = host;
    this.apiBaseUrl = apiBaseUrl;
  }

  private getGithubIntegrationConfig({
    gitHubIntegrations,
  }: {
    gitHubIntegrations: GitHubIntegration[];
  }) {
    const defaultIntegration = gitHubIntegrations.find(
      ({ config: { host } }) => host === 'github.com',
    );
    const enterpriseIntegration = gitHubIntegrations.find(
      ({ config: { host } }) => host !== 'github.com',
    );

    const host =
      enterpriseIntegration?.config.host ?? defaultIntegration?.config.host;
    const apiBaseUrl =
      enterpriseIntegration?.config.apiBaseUrl ??
      defaultIntegration?.config.apiBaseUrl;

    if (!host) {
      throw new GitReleaseManagerError(
        'Invalid API configuration: missing host',
      );
    }

    if (!apiBaseUrl) {
      throw new GitReleaseManagerError(
        'Invalid API configuration: missing apiBaseUrl',
      );
    }

    return {
      host,
      apiBaseUrl,
    };
  }

  private async getOctokit() {
    const token = await this.githubAuthApi.getAccessToken(['repo']);

    return {
      octokit: new Octokit({
        auth: token,
        baseUrl: this.apiBaseUrl,
      }),
    };
  }

  public getHost: GitReleaseApi['getHost'] = () => {
    return this.host;
  };

  public getRepoPath: GitReleaseApi['getRepoPath'] = ({ owner, repo }) => {
    return `${owner}/${repo}`;
  };

  getOwners: GitReleaseApi['getOwners'] = async () => {
    const { octokit } = await this.getOctokit();
    const orgListResponse = await octokit.paginate(
      octokit.orgs.listForAuthenticatedUser,
      { per_page: 100 },
    );

    return {
      owners: orgListResponse.map(organization => organization.login),
    };
  };

  getRepositories: GitReleaseApi['getRepositories'] = async ({ owner }) => {
    const { octokit } = await this.getOctokit();

    const repositoryResponse = await octokit
      .paginate(octokit.repos.listForOrg, { org: owner, per_page: 100 })
      .catch(async error => {
        // `owner` is not an org, try listing a user's repositories instead
        if (error.status === 404) {
          const userRepositoryResponse = await octokit.paginate(
            octokit.repos.listForUser,
            { username: owner, per_page: 100 },
          );
          return userRepositoryResponse;
        }

        throw error;
      });

    return {
      repositories: repositoryResponse.map(repository => repository.name),
    };
  };

  getUser: GitReleaseApi['getUser'] = async () => {
    const { octokit } = await this.getOctokit();
    const userResponse = await octokit.users.getAuthenticated();

    return {
      user: {
        username: userResponse.data.login,
        email: userResponse.data.email ?? undefined,
      },
    };
  };

  getRecentCommits: GitReleaseApi['getRecentCommits'] = async ({
    owner,
    repo,
    releaseBranchName,
  }) => {
    const { octokit } = await this.getOctokit();
    const recentCommitsResponse = await octokit.repos.listCommits({
      owner,
      repo,
      ...(releaseBranchName ? { sha: releaseBranchName } : {}),
      ...DISABLE_CACHE,
    });

    return {
      recentCommits: recentCommitsResponse.data.map(commit => ({
        htmlUrl: commit.html_url,
        sha: commit.sha,
        author: {
          htmlUrl: commit.author?.html_url,
          login: commit.author?.login,
        },
        commit: {
          message: commit.commit.message,
        },
        firstParentSha: commit.parents?.[0]?.sha,
      })),
    };
  };

  getLatestRelease: GitReleaseApi['getLatestRelease'] = async ({
    owner,
    repo,
  }) => {
    const { octokit } = await this.getOctokit();
    const { data: latestReleases } = await octokit.repos.listReleases({
      owner,
      repo,
      per_page: 1,
      ...DISABLE_CACHE,
    });

    if (latestReleases.length === 0) {
      return {
        latestRelease: null,
      };
    }

    const latestRelease = latestReleases[0];

    return {
      latestRelease: {
        targetCommitish: latestRelease.target_commitish,
        tagName: latestRelease.tag_name,
        prerelease: latestRelease.prerelease,
        id: latestRelease.id,
        htmlUrl: latestRelease.html_url,
        body: latestRelease.body,
      },
    };
  };

  getRepository: GitReleaseApi['getRepository'] = async ({ owner, repo }) => {
    const { octokit } = await this.getOctokit();
    const { data: repository } = await octokit.repos.get({
      owner,
      repo,
      ...DISABLE_CACHE,
    });

    return {
      repository: {
        pushPermissions: repository.permissions?.push,
        defaultBranch: repository.default_branch,
        name: repository.name,
      },
    };
  };

  getCommit: GitReleaseApi['getCommit'] = async ({ owner, repo, ref }) => {
    const { octokit } = await this.getOctokit();
    const { data: commit } = await octokit.repos.getCommit({
      owner,
      repo,
      ref,
      ...DISABLE_CACHE,
    });

    return {
      commit: {
        sha: commit.sha,
        htmlUrl: commit.html_url,
        commit: {
          message: commit.commit.message,
        },
        createdAt: commit.commit.committer?.date,
      },
    };
  };

  getBranch: GitReleaseApi['getBranch'] = async ({ owner, repo, branch }) => {
    const { octokit } = await this.getOctokit();

    const { data: branchData } = await octokit.repos.getBranch({
      owner,
      repo,
      branch,
      ...DISABLE_CACHE,
    });

    return {
      branch: {
        name: branchData.name,
        links: {
          html: branchData._links.html,
        },
        commit: {
          sha: branchData.commit.sha,
          commit: {
            tree: {
              sha: branchData.commit.commit.tree.sha,
            },
          },
        },
      },
    };
  };

  createRef: GitReleaseApi['createRef'] = async ({ owner, repo, sha, ref }) => {
    const { octokit } = await this.getOctokit();
    const createRefResponse = await octokit.git.createRef({
      owner,
      repo,
      ref,
      sha,
    });

    return {
      reference: {
        ref: createRefResponse.data.ref,
        objectSha: createRefResponse.data.object.sha,
      },
    };
  };

  getComparison: GitReleaseApi['getComparison'] = async ({
    owner,
    repo,
    base,
    head,
  }) => {
    const { octokit } = await this.getOctokit();
    const compareCommitsResponse = await octokit.repos.compareCommits({
      owner,
      repo,
      base,
      head,
    });

    return {
      comparison: {
        htmlUrl: compareCommitsResponse.data.html_url,
        aheadBy: compareCommitsResponse.data.ahead_by,
      },
    };
  };

  createRelease: GitReleaseApi['createRelease'] = async ({
    owner,
    repo,
    tagName,
    name,
    targetCommitish,
    body,
  }) => {
    const { octokit } = await this.getOctokit();
    const createReleaseResponse = await octokit.repos.createRelease({
      owner,
      repo,
      tag_name: tagName,
      name: name,
      target_commitish: targetCommitish,
      body,
      prerelease: true,
    });

    return {
      release: {
        name: createReleaseResponse.data.name,
        htmlUrl: createReleaseResponse.data.html_url,
        tagName: createReleaseResponse.data.tag_name,
      },
    };
  };

  createTagObject: GitReleaseApi['createTagObject'] = async ({
    owner,
    repo,
    tag,
    object,
    taggerName,
    taggerEmail,
    message,
  }) => {
    const { octokit } = await this.getOctokit();
    const { data: createdTagObject } = await octokit.git.createTag({
      owner,
      repo,
      message,
      tag,
      object,
      type: 'commit',
      ...(taggerEmail
        ? {
            tagger: {
              date: new Date().toISOString(),
              email: taggerEmail,
              name: taggerName,
            },
          }
        : {}),
    });

    return {
      tagObject: {
        tagName: createdTagObject.tag,
        tagSha: createdTagObject.sha,
      },
    };
  };

  createCommit: GitReleaseApi['createCommit'] = async ({
    owner,
    repo,
    message,
    tree,
    parents,
  }) => {
    const { octokit } = await this.getOctokit();
    const { data: commit } = await octokit.git.createCommit({
      owner,
      repo,
      message,
      tree,
      parents,
    });

    return {
      commit: {
        message: commit.message,
        sha: commit.sha,
      },
    };
  };

  updateRef: GitReleaseApi['updateRef'] = async ({
    owner,
    repo,
    ref,
    sha,
    force,
  }) => {
    const { octokit } = await this.getOctokit();
    const { data: updatedRef } = await octokit.git.updateRef({
      owner,
      repo,
      ref,
      sha,
      force,
    });

    return {
      reference: {
        ref: updatedRef.ref,
        object: {
          sha: updatedRef.object.sha,
        },
      },
    };
  };

  merge: GitReleaseApi['merge'] = async ({ owner, repo, base, head }) => {
    const { octokit } = await this.getOctokit();
    const { data: merge } = await octokit.repos.merge({
      owner,
      repo,
      base,
      head,
    });

    return {
      merge: {
        htmlUrl: merge.html_url,
        commit: {
          message: merge.commit.message,
          tree: {
            sha: merge.commit.tree.sha,
          },
        },
      },
    };
  };

  updateRelease: GitReleaseApi['updateRelease'] = async ({
    owner,
    repo,
    releaseId,
    tagName,
    body,
    prerelease,
  }) => {
    const { octokit } = await this.getOctokit();
    const { data: updatedRelease } = await octokit.repos.updateRelease({
      owner,
      repo,
      release_id: releaseId,
      tag_name: tagName,
      body,
      prerelease,
    });

    return {
      release: {
        name: updatedRelease.name,
        tagName: updatedRelease.tag_name,
        htmlUrl: updatedRelease.html_url,
      },
    };
  };

  getAllTags: GitReleaseApi['getAllTags'] = async ({ owner, repo }) => {
    const { octokit } = await this.getOctokit();

    const tags = await octokit.paginate(octokit.git.listMatchingRefs, {
      owner,
      repo,
      ref: 'tags',
      per_page: 100,
      ...DISABLE_CACHE,
    });

    return {
      tags: tags
        .map(tag => ({
          tagName: tag.ref.replace('refs/tags/', ''),
          tagSha: tag.object.sha,
          tagType: tag.object.type as 'tag' | 'commit',
        }))
        .reverse(),
    };
  };

  getAllReleases: GitReleaseApi['getAllReleases'] = async ({ owner, repo }) => {
    const { octokit } = await this.getOctokit();

    const releases = await octokit.paginate(octokit.repos.listReleases, {
      owner,
      repo,
      per_page: 100,
      ...DISABLE_CACHE,
    });

    return {
      releases: releases.map(release => ({
        id: release.id,
        name: release.name,
        tagName: release.tag_name,
        createdAt: release.published_at,
        htmlUrl: release.html_url,
      })),
    };
  };

  getTag: GitReleaseApi['getTag'] = async ({ owner, repo, tagSha }) => {
    const { octokit } = await this.getOctokit();
    const singleTag = await octokit.git.getTag({
      owner,
      repo,
      tag_sha: tagSha,
    });

    return {
      tag: {
        date: singleTag.data.tagger.date,
        username: singleTag.data.tagger.name,
        userEmail: singleTag.data.tagger.email,
        objectSha: singleTag.data.object.sha,
      },
    };
  };
}

type OwnerRepo = {
  owner: Project['owner'];
  repo: Project['repo'];
};

export interface GitReleaseApi {
  getHost: () => string;

  getRepoPath: (args: OwnerRepo) => string;

  getOwners: () => Promise<{
    owners: string[];
  }>;

  getRepositories: (args: {
    owner: OwnerRepo['owner'];
  }) => Promise<{
    repositories: string[];
  }>;

  getUser: (
    args: OwnerRepo,
  ) => Promise<{
    user: {
      username: string;
      email?: string;
    };
  }>;

  getRecentCommits: (
    args: {
      releaseBranchName?: string;
    } & OwnerRepo,
  ) => Promise<{
    recentCommits: {
      htmlUrl: string;
      sha: string;
      author: {
        htmlUrl?: string;
        login?: string;
      };
      commit: {
        message: string;
      };
      firstParentSha?: string;
    }[];
  }>;

  getLatestRelease: (
    args: OwnerRepo,
  ) => Promise<{
    latestRelease: {
      targetCommitish: string;
      tagName: string;
      prerelease: boolean;
      id: number;
      htmlUrl: string;
      body?: string | null;
    } | null;
  }>;

  getRepository: (
    args: OwnerRepo,
  ) => Promise<{
    repository: {
      pushPermissions: boolean | undefined;
      defaultBranch: string;
      name: string;
    };
  }>;

  getCommit: (
    args: {
      ref: string;
    } & OwnerRepo,
  ) => Promise<{
    commit: {
      sha: string;
      htmlUrl: string;
      commit: {
        message: string;
      };
      createdAt?: string;
    };
  }>;

  getBranch: (
    args: {
      branch: string;
    } & OwnerRepo,
  ) => Promise<{
    branch: {
      name: string;
      links: {
        html: string;
      };
      commit: {
        sha: string;
        commit: {
          tree: {
            sha: string;
          };
        };
      };
    };
  }>;

  createRef: (
    args: {
      ref: string;
      sha: string;
    } & OwnerRepo,
  ) => Promise<{
    reference: {
      ref: string;
      objectSha: string;
    };
  }>;

  getComparison: (
    args: {
      base: string;
      head: string;
    } & OwnerRepo,
  ) => Promise<{
    comparison: {
      htmlUrl: string;
      aheadBy: number;
    };
  }>;

  createRelease: (
    args: {
      tagName: string;
      name: string;
      targetCommitish: string;
      body: string;
    } & OwnerRepo,
  ) => Promise<{
    release: {
      name: string | null;
      htmlUrl: string;
      tagName: string;
    };
  }>;

  createTagObject: (
    args: {
      tag: string;
      taggerEmail?: string;
      message: string;
      object: string;
      taggerName: string;
    } & OwnerRepo,
  ) => Promise<{
    tagObject: {
      tagName: string;
      tagSha: string;
    };
  }>;

  createCommit: (
    args: {
      message: string;
      tree: string;
      parents: string[];
    } & OwnerRepo,
  ) => Promise<{
    commit: {
      message: string;
      sha: string;
    };
  }>;

  updateRef: (
    args: {
      sha: string;
      ref: string;
      force: boolean;
    } & OwnerRepo,
  ) => Promise<{
    reference: {
      ref: string;
      object: {
        sha: string;
      };
    };
  }>;

  merge: (
    args: {
      base: string;
      head: string;
    } & OwnerRepo,
  ) => Promise<{
    merge: {
      htmlUrl: string;
      commit: {
        message: string;
        tree: {
          sha: string;
        };
      };
    };
  }>;

  updateRelease: (
    args: {
      releaseId: number;
      tagName: string;
      body?: string;
      prerelease?: boolean;
    } & OwnerRepo,
  ) => Promise<{
    release: {
      name: string | null;
      tagName: string;
      htmlUrl: string;
    };
  }>;

  /**
   * Get all tags in descending order
   */
  getAllTags: (
    args: OwnerRepo,
  ) => Promise<{
    tags: Array<{
      tagName: string;
      tagSha: string;
      tagType: 'tag' | 'commit';
    }>;
  }>;

  getAllReleases: (
    args: OwnerRepo,
  ) => Promise<{
    releases: Array<{
      id: number;
      name: string | null;
      tagName: string;
      createdAt: string | null;
      htmlUrl: string;
    }>;
  }>;

  getTag: (
    args: {
      tagSha: string;
    } & OwnerRepo,
  ) => Promise<{
    tag: {
      date: string;
      username: string;
      userEmail: string;
      objectSha: string;
    };
  }>;
}

export type GetOwnersResult = UnboxReturnedPromise<GitReleaseApi['getOwners']>;
export type GetRepositoriesResult = UnboxReturnedPromise<
  GitReleaseApi['getRepositories']
>;
export type GetUserResult = UnboxReturnedPromise<GitReleaseApi['getUser']>;
export type GetRecentCommitsResult = UnboxReturnedPromise<
  GitReleaseApi['getRecentCommits']
>;
export type GetRecentCommitsResultSingle = UnboxArray<
  GetRecentCommitsResult['recentCommits']
>;
export type GetLatestReleaseResult = UnboxReturnedPromise<
  GitReleaseApi['getLatestRelease']
>;
export type GetRepositoryResult = UnboxReturnedPromise<
  GitReleaseApi['getRepository']
>;
export type GetCommitResult = UnboxReturnedPromise<GitReleaseApi['getCommit']>;
export type GetBranchResult = UnboxReturnedPromise<GitReleaseApi['getBranch']>;
export type CreateRefResult = UnboxReturnedPromise<GitReleaseApi['createRef']>;
export type GetComparisonResult = UnboxReturnedPromise<
  GitReleaseApi['getComparison']
>;
export type CreateReleaseResult = UnboxReturnedPromise<
  GitReleaseApi['createRelease']
>;
export type MergeResult = UnboxReturnedPromise<GitReleaseApi['merge']>;
export type CreateTagObjectResult = UnboxReturnedPromise<
  GitReleaseApi['createTagObject']
>;
export type UpdateReleaseResult = UnboxReturnedPromise<
  GitReleaseApi['updateRelease']
>;
export type GetAllTagsResult = UnboxReturnedPromise<
  GitReleaseApi['getAllTags']
>;
export type GetAllReleasesResult = UnboxReturnedPromise<
  GitReleaseApi['getAllReleases']
>;
export type GetTagResult = UnboxReturnedPromise<GitReleaseApi['getTag']>;
