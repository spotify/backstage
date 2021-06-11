/*
 * Copyright 2020 Spotify AB
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

import { PublisherBase, PublisherOptions, PublisherResult } from './types';
import {
  enableBranchProtectionOnDefaultRepoBranch,
  initRepoAndPush,
} from './helpers';
import {
  GitHubIntegrationConfig,
  GithubCredentialsProvider,
} from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import { Octokit } from '@octokit/rest';
import path from 'path';

export type RepoVisibilityOptions = 'private' | 'internal' | 'public';

/** @deprecated use createPublishGithubAction instead */
export class GithubPublisher implements PublisherBase {
  static async fromConfig(
    config: GitHubIntegrationConfig,
    { repoVisibility }: { repoVisibility: RepoVisibilityOptions },
  ) {
    if (!config.token && !config.apps) {
      return undefined;
    }

    const credentialsProvider = GithubCredentialsProvider.create(config);

    return new GithubPublisher({
      credentialsProvider,
      repoVisibility,
      apiBaseUrl: config.apiBaseUrl,
    });
  }

  constructor(
    private readonly config: {
      credentialsProvider: GithubCredentialsProvider;
      repoVisibility: RepoVisibilityOptions;
      apiBaseUrl: string | undefined;
    },
  ) {}

  async publish({
    values,
    workspacePath,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const { owner, name } = parseGitUrl(values.storePath);

    const { token } = await this.config.credentialsProvider.getCredentials({
      url: values.storePath,
    });

    if (!token) {
      throw new Error(
        `No token could be acquired for URL: ${values.storePath}`,
      );
    }

    const client = new Octokit({
      auth: token,
      baseUrl: this.config.apiBaseUrl,
      previews: ['nebula-preview'],
    });

    const description = values.description as string;
    const access = values.access as string;
    const remoteUrl = await this.createRemote({
      client,
      description,
      access,
      name,
      owner,
    });

    await initRepoAndPush({
      dir: path.join(workspacePath, 'result'),
      remoteUrl,
      auth: {
        username: 'x-access-token',
        password: token,
      },
      logger,
    });

    const catalogInfoUrl = remoteUrl.replace(
      /\.git$/,
      '/blob/master/catalog-info.yaml',
    );

    try {
      await enableBranchProtectionOnDefaultRepoBranch({
        owner,
        client,
        repoName: name,
        logger,
      });
    } catch (e) {
      throw new Error(`Failed to add branch protection to '${name}', ${e}`);
    }

    return { remoteUrl, catalogInfoUrl };
  }

  private async createRemote(opts: {
    client: Octokit;
    access: string;
    name: string;
    owner: string;
    description: string;
  }) {
    const { client, access, description, owner, name } = opts;

    const user = await client.users.getByUsername({
      username: owner,
    });

    const repoCreationPromise =
      user.data.type === 'Organization'
        ? client.repos.createInOrg({
            name,
            org: owner,
            private: this.config.repoVisibility !== 'public',
            visibility: this.config.repoVisibility,
            description,
          })
        : client.repos.createForAuthenticatedUser({
            name,
            private: this.config.repoVisibility === 'private',
            description,
          });

    const { data: newRepo } = await repoCreationPromise;

    try {
      if (access?.startsWith(`${owner}/`)) {
        const [, team] = access.split('/');
        await client.teams.addOrUpdateRepoPermissionsInOrg({
          org: owner,
          team_slug: team,
          owner,
          repo: name,
          permission: 'admin',
        });
        // no need to add access if it's the person who owns the personal account
      } else if (access && access !== owner) {
        await client.repos.addCollaborator({
          owner,
          repo: name,
          username: access,
          permission: 'admin',
        });
      }
    } catch (e) {
      throw new Error(
        `Failed to add access to '${access}'. Status ${e.status} ${e.message}`,
      );
    }

    return newRepo.clone_url;
  }
}
