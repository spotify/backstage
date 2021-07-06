/*
 * Copyright 2020 The Backstage Authors
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

import { CatalogApi } from '@backstage/catalog-client';
import { EntityName } from '@backstage/catalog-model';
import {
  GitHubIntegrationConfig,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { Base64 } from 'js-base64';
import { Octokit } from '@octokit/rest';
import { PartialEntity } from '../types';
import { AnalyzeResult, CatalogImportApi } from './CatalogImportApi';
import { getGithubIntegrationConfig } from './GitHub';
import {
  DiscoveryApi,
  IdentityApi,
  OAuthApi,
} from '@backstage/core-plugin-api';

export class CatalogImportClient implements CatalogImportApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly githubAuthApi: OAuthApi;
  private readonly scmIntegrationsApi: ScmIntegrationRegistry;
  private readonly catalogApi: CatalogApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    githubAuthApi: OAuthApi;
    identityApi: IdentityApi;
    scmIntegrationsApi: ScmIntegrationRegistry;
    catalogApi: CatalogApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.githubAuthApi = options.githubAuthApi;
    this.identityApi = options.identityApi;
    this.scmIntegrationsApi = options.scmIntegrationsApi;
    this.catalogApi = options.catalogApi;
  }

  async analyzeUrl(url: string): Promise<AnalyzeResult> {
    if (url.match(/\.ya?ml$/)) {
      const location = await this.catalogApi.addLocation({
        type: 'url',
        target: url,
        dryRun: true,
      });

      return {
        type: 'locations',
        locations: [
          {
            target: location.location.target,
            entities: location.entities.map(e => ({
              kind: e.kind,
              namespace: e.metadata.namespace ?? 'default',
              name: e.metadata.name,
            })),
          },
        ],
      };
    }

    const ghConfig = getGithubIntegrationConfig(this.scmIntegrationsApi, url);
    if (!ghConfig) {
      const other = this.scmIntegrationsApi.byUrl(url);
      if (other) {
        throw new Error(
          `The ${other.title} integration only supports full URLs to catalog-info.yaml files. Did you try to pass in the URL of a directory instead?`,
        );
      }
      throw new Error(
        'This URL was not recognized as a valid GitHub URL because there was no configured integration that matched the given host name. You could try to paste the full URL to a catalog-info.yaml file instead.',
      );
    }

    // TODO: this could be part of the analyze-location endpoint
    const locations = await this.checkGitHubForExistingCatalogInfo({
      ...ghConfig,
      url,
    });

    if (locations.length > 0) {
      return {
        type: 'locations',
        locations,
      };
    }

    return {
      type: 'repository',
      integrationType: 'github',
      url: url,
      generatedEntities: await this.generateEntityDefinitions({
        repo: url,
      }),
    };
  }

  async submitPullRequest({
    repositoryUrl,
    fileContent,
    title,
    body,
  }: {
    repositoryUrl: string;
    fileContent: string;
    title: string;
    body: string;
  }): Promise<{ link: string; location: string }> {
    const ghConfig = getGithubIntegrationConfig(
      this.scmIntegrationsApi,
      repositoryUrl,
    );

    if (ghConfig) {
      return await this.submitGitHubPrToRepo({
        ...ghConfig,
        fileContent,
        title,
        body,
      });
    }

    throw new Error('unimplemented!');
  }

  // TODO: this could be part of the catalog api
  private async generateEntityDefinitions({
    repo,
  }: {
    repo: string;
  }): Promise<PartialEntity[]> {
    const idToken = await this.identityApi.getIdToken();
    const response = await fetch(
      `${await this.discoveryApi.getBaseUrl('catalog')}/analyze-location`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(idToken && { Authorization: `Bearer ${idToken}` }),
        },
        method: 'POST',
        body: JSON.stringify({
          location: { type: 'url', target: repo },
        }),
      },
    ).catch(e => {
      throw new Error(`Failed to generate entity definitions, ${e.message}`);
    });
    if (!response.ok) {
      throw new Error(
        `Failed to generate entity definitions. Received http response ${response.status}: ${response.statusText}`,
      );
    }

    const payload = await response.json();
    return payload.generateEntities.map((x: any) => x.entity);
  }

  // TODO: this response should better be part of the analyze-locations response and scm-independent / implemented per scm
  private async checkGitHubForExistingCatalogInfo({
    url,
    owner,
    repo,
    githubIntegrationConfig,
  }: {
    url: string;
    owner: string;
    repo: string;
    githubIntegrationConfig: GitHubIntegrationConfig;
  }): Promise<
    Array<{
      target: string;
      entities: EntityName[];
    }>
  > {
    const token = await this.githubAuthApi.getAccessToken(['repo']);
    const octo = new Octokit({
      auth: token,
      baseUrl: githubIntegrationConfig.apiBaseUrl,
    });
    const catalogFileName = 'catalog-info.yaml';
    const query = `repo:${owner}/${repo}+filename:${catalogFileName}`;

    const searchResult = await octo.search.code({ q: query }).catch(e => {
      throw new Error(
        formatHttpErrorMessage(
          "Couldn't search repository for metadata file.",
          e,
        ),
      );
    });
    const exists = searchResult.data.total_count > 0;
    if (exists) {
      const repoInformation = await octo.repos.get({ owner, repo }).catch(e => {
        throw new Error(formatHttpErrorMessage("Couldn't fetch repo data", e));
      });
      const defaultBranch = repoInformation.data.default_branch;

      return await Promise.all(
        searchResult.data.items
          .map(
            i => `${url.replace(/[\/]*$/, '')}/blob/${defaultBranch}/${i.path}`,
          )
          .map(
            async i =>
              ({
                target: i,
                entities: (
                  await this.catalogApi.addLocation({
                    type: 'url',
                    target: i,
                    dryRun: true,
                  })
                ).entities.map(e => ({
                  kind: e.kind,
                  namespace: e.metadata.namespace ?? 'default',
                  name: e.metadata.name,
                })),
              } as {
                target: string;
                entities: EntityName[];
              }),
          ),
      );
    }

    return [];
  }

  // TODO: extract this function and implement for non-github
  private async submitGitHubPrToRepo({
    owner,
    repo,
    title,
    body,
    fileContent,
    githubIntegrationConfig,
  }: {
    owner: string;
    repo: string;
    title: string;
    body: string;
    fileContent: string;
    githubIntegrationConfig: GitHubIntegrationConfig;
  }): Promise<{ link: string; location: string }> {
    const token = await this.githubAuthApi.getAccessToken(['repo']);

    const octo = new Octokit({
      auth: token,
      baseUrl: githubIntegrationConfig.apiBaseUrl,
    });

    const branchName = 'backstage-integration';
    const fileName = 'catalog-info.yaml';

    const repoData = await octo.repos
      .get({
        owner,
        repo,
      })
      .catch(e => {
        throw new Error(formatHttpErrorMessage("Couldn't fetch repo data", e));
      });

    const parentRef = await octo.git
      .getRef({
        owner,
        repo,
        ref: `heads/${repoData.data.default_branch}`,
      })
      .catch(e => {
        throw new Error(
          formatHttpErrorMessage("Couldn't fetch default branch data", e),
        );
      });

    await octo.git
      .createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: parentRef.data.object.sha,
      })
      .catch(e => {
        throw new Error(
          formatHttpErrorMessage(
            `Couldn't create a new branch with name '${branchName}'`,
            e,
          ),
        );
      });

    await octo.repos
      .createOrUpdateFileContents({
        owner,
        repo,
        path: fileName,
        message: title,
        content: Base64.encode(fileContent),
        branch: branchName,
      })
      .catch(e => {
        throw new Error(
          formatHttpErrorMessage(
            `Couldn't create a commit with ${fileName} file added`,
            e,
          ),
        );
      });

    const pullRequestResponse = await octo.pulls
      .create({
        owner,
        repo,
        title,
        head: branchName,
        body,
        base: repoData.data.default_branch,
      })
      .catch(e => {
        throw new Error(
          formatHttpErrorMessage(
            `Couldn't create a pull request for ${branchName} branch`,
            e,
          ),
        );
      });

    return {
      link: pullRequestResponse.data.html_url,
      location: `https://${githubIntegrationConfig.host}/${owner}/${repo}/blob/${repoData.data.default_branch}/${fileName}`,
    };
  }
}

function formatHttpErrorMessage(
  message: string,
  error: { status: number; message: string },
) {
  return `${message}, received http response status code ${error.status}: ${error.message}`;
}
