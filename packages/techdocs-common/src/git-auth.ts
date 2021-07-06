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
import parseGitUrl from 'git-url-parse';
import { Config } from '@backstage/config';
import {
  readGitHubIntegrationConfigs,
  readGitLabIntegrationConfigs,
  readAzureIntegrationConfigs,
  GitHubIntegrationConfig,
  GitLabIntegrationConfig,
  AzureIntegrationConfig,
} from '@backstage/integration';

export function getGitHost(url: string): string {
  const { resource } = parseGitUrl(url);
  return resource;
}

export function getGitRepoType(url: string): string {
  const typeMapping = [
    { url: /github*/g, type: 'github' },
    { url: /gitlab*/g, type: 'gitlab' },
    { url: /azure*/g, type: 'azure/api' },
  ];

  const type = typeMapping.filter(item => item.url.test(url))[0]?.type;

  return type;
}

export const getGitHubIntegrationConfig = (
  config: Config,
  host: string,
): GitHubIntegrationConfig => {
  const allGitHubConfigs = readGitHubIntegrationConfigs(
    config.getOptionalConfigArray('integrations.github') ?? [],
  );
  const gitHubIntegrationConfig = allGitHubConfigs.find(v => v.host === host);
  if (!gitHubIntegrationConfig) {
    throw new Error(`Unable to locate GitHub integration for the host ${host}`);
  }
  return gitHubIntegrationConfig;
};

export const getGitLabIntegrationConfig = (
  config: Config,
  host: string,
): GitLabIntegrationConfig => {
  const allGitLabConfigs = readGitLabIntegrationConfigs(
    config.getOptionalConfigArray('integrations.gitlab') ?? [],
  );
  const gitLabIntegrationConfig = allGitLabConfigs.find(v => v.host === host);
  if (!gitLabIntegrationConfig) {
    throw new Error(`Unable to locate GitLab integration for the host ${host}`);
  }
  return gitLabIntegrationConfig;
};

export const getAzureIntegrationConfig = (
  config: Config,
  host: string,
): AzureIntegrationConfig => {
  const allAzureIntegrationConfig = readAzureIntegrationConfigs(
    config.getOptionalConfigArray('integrations.azure') ?? [],
  );
  const azureIntegrationConfig = allAzureIntegrationConfig.find(
    v => v.host === host,
  );
  if (!azureIntegrationConfig) {
    throw new Error(`Unable to locate Azure integration for the host ${host}`);
  }
  return azureIntegrationConfig;
};

export const getTokenForGitRepo = async (
  repositoryUrl: string,
  config: Config,
): Promise<string | undefined> => {
  const host = getGitHost(repositoryUrl);
  const type = getGitRepoType(repositoryUrl);

  try {
    switch (type) {
      case 'github':
        return getGitHubIntegrationConfig(config, host).token;
      case 'gitlab':
        return getGitLabIntegrationConfig(config, host).token;
      case 'azure/api':
        return getAzureIntegrationConfig(config, host).token;
      default:
        throw new Error('Failed to get repository type');
    }
  } catch (error) {
    throw error;
  }
};
