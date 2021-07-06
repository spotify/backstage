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
import fetch from 'cross-fetch';
import parseGitUrl from 'git-url-parse';
import { Config } from '@backstage/config';
import {
  getGitHubRequestOptions,
  getGitLabRequestOptions,
  getAzureRequestOptions,
} from '@backstage/integration';
import {
  getGitHost,
  getGitRepoType,
  getGitHubIntegrationConfig,
  getGitLabIntegrationConfig,
  getAzureIntegrationConfig,
} from './git-auth';

interface IGitlabBranch {
  name: string;
  merged: boolean;
  protected: boolean;
  default: boolean;
  developers_can_push: boolean;
  developers_can_merge: boolean;
  can_push: boolean;
  web_url: string;
  commit: {
    author_email: string;
    author_name: string;
    authored_date: string;
    committed_date: string;
    committer_email: string;
    committer_name: string;
    id: string;
    short_id: string;
    title: string;
    message: string;
    parent_ids: string[];
  };
}

function getGithubApiUrl(config: Config, url: string): URL {
  const { resource, owner, name } = parseGitUrl(url);
  const providerConfigs =
    config.getOptionalConfigArray('integrations.github') ?? [];

  const hostConfig = providerConfigs.filter(
    providerConfig => providerConfig.getOptionalString('host') === resource,
  );

  const apiBaseUrl =
    hostConfig[0]?.getOptionalString('apiBaseUrl') ?? 'https://api.github.com';
  const apiRepos = 'repos';

  return new URL(`${apiBaseUrl}/${apiRepos}/${owner}/${name}`);
}

function getGitlabApiUrl(url: string): URL {
  const { protocol, resource, full_name: fullName } = parseGitUrl(url);
  const apiProjectsBasePath = 'api/v4/projects';
  const project = encodeURIComponent(fullName);
  const branches = 'repository/branches';

  return new URL(
    `${protocol}://${resource}/${apiProjectsBasePath}/${project}/${branches}`,
  );
}

function getAzureApiUrl(url: string): URL {
  const { protocol, resource, organization, owner, name } = parseGitUrl(url);
  const apiRepoPath = '_apis/git/repositories';
  const apiVersion = 'api-version=6.0';

  return new URL(
    `${protocol}://${resource}/${organization}/${owner}/${apiRepoPath}/${name}?${apiVersion}`,
  );
}

async function getGithubDefaultBranch(
  repositoryUrl: string,
  config: Config,
): Promise<string> {
  const path = getGithubApiUrl(config, repositoryUrl).toString();
  const host = getGitHost(repositoryUrl);

  const integrationConfig = getGitHubIntegrationConfig(config, host);
  const options = getGitHubRequestOptions(integrationConfig);

  try {
    const raw = await fetch(path, options);

    if (!raw.ok) {
      throw new Error(
        `Failed to load url: ${raw.status} ${raw.statusText}. Make sure you have permission to repository: ${repositoryUrl}`,
      );
    }

    const { default_branch: branch } = await raw.json();

    if (!branch) {
      throw new Error('Not found github default branch');
    }

    return branch;
  } catch (error) {
    throw new Error(`Failed to get github default branch: ${error}`);
  }
}

async function getGitlabDefaultBranch(
  repositoryUrl: string,
  config: Config,
): Promise<string> {
  const path = getGitlabApiUrl(repositoryUrl).toString();
  const host = getGitHost(repositoryUrl);

  const integrationConfig = getGitLabIntegrationConfig(config, host);
  const options = getGitLabRequestOptions(integrationConfig);

  try {
    const raw = await fetch(path, options);

    if (!raw.ok) {
      throw new Error(
        `Failed to load url: ${raw.status} ${raw.statusText}. Make sure you have permission to repository: ${repositoryUrl}`,
      );
    }

    const result = await raw.json();
    const { name } = (result || []).find(
      (branch: IGitlabBranch) => branch.default === true,
    );

    if (!name) {
      throw new Error('Not found gitlab default branch');
    }

    return name;
  } catch (error) {
    throw new Error(`Failed to get gitlab default branch: ${error}`);
  }
}

async function getAzureDefaultBranch(
  repositoryUrl: string,
  config: Config,
): Promise<string> {
  const path = getAzureApiUrl(repositoryUrl).toString();
  const host = getGitHost(repositoryUrl);

  const integrationConfig = getAzureIntegrationConfig(config, host);
  const options = getAzureRequestOptions(integrationConfig);

  try {
    const urlResponse = await fetch(path, options);
    if (!urlResponse.ok) {
      throw new Error(
        `Failed to load url: ${urlResponse.status} ${urlResponse.statusText}. Make sure you have permission to repository: ${repositoryUrl}`,
      );
    }
    const urlResult = await urlResponse.json();

    const idResponse = await fetch(urlResult.url, options);
    if (!idResponse.ok) {
      throw new Error(
        `Failed to load url: ${idResponse.status} ${idResponse.statusText}. Make sure you have permission to repository: ${urlResult.repository.url}`,
      );
    }
    const idResult = await idResponse.json();
    const name = idResult.defaultBranch;

    if (!name) {
      throw new Error('Not found Azure DevOps default branch');
    }

    return name;
  } catch (error) {
    throw new Error(`Failed to get Azure DevOps default branch: ${error}`);
  }
}

export const getDefaultBranch = async (
  repositoryUrl: string,
  config: Config,
): Promise<string> => {
  const type = getGitRepoType(repositoryUrl);

  try {
    switch (type) {
      case 'github':
        return await getGithubDefaultBranch(repositoryUrl, config);
      case 'gitlab':
        return await getGitlabDefaultBranch(repositoryUrl, config);
      case 'azure/api':
        return await getAzureDefaultBranch(repositoryUrl, config);

      default:
        throw new Error('Failed to get repository type');
    }
  } catch (error) {
    throw error;
  }
};
