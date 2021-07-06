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

import { Config } from '@backstage/config';

/**
 * The configuration parameters for a single GitHub API provider.
 */
export type ProviderConfig = {
  /**
   * The prefix of the target that this matches on, e.g. "https://github.com",
   * with no trailing slash.
   */
  target: string;

  /**
   * The base URL of the API of this provider, e.g. "https://api.github.com",
   * with no trailing slash.
   *
   * May be omitted specifically for GitHub; then it will be deduced.
   */
  apiBaseUrl?: string;

  /**
   * The authorization token to use for requests to this provider.
   *
   * If no token is specified, anonymous access is used.
   */
  token?: string;
};

// TODO(freben): Break out common code and config from here and GithubReaderProcessor
export function readGithubConfig(config: Config): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  const providerConfigs =
    config.getOptionalConfigArray('catalog.processors.githubOrg.providers') ??
    [];

  // First read all the explicit providers
  for (const providerConfig of providerConfigs) {
    const target = providerConfig.getString('target').replace(/\/+$/, '');
    let apiBaseUrl = providerConfig.getOptionalString('apiBaseUrl');
    const token = providerConfig.getOptionalString('token');

    if (apiBaseUrl) {
      apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
    } else if (target === 'https://github.com') {
      apiBaseUrl = 'https://api.github.com';
    }

    if (!apiBaseUrl) {
      throw new Error(
        `Provider at ${target} must configure an explicit apiBaseUrl`,
      );
    }

    providers.push({ target, apiBaseUrl, token });
  }

  // If no explicit github.com provider was added, put one in the list as
  // a convenience
  if (!providers.some(p => p.target === 'https://github.com')) {
    providers.push({
      target: 'https://github.com',
      apiBaseUrl: 'https://api.github.com',
    });
  }

  return providers;
}

/**
 * The configuration parameters for a multi-org GitHub processor.
 */
export type GithubMultiOrgConfig = Array<{
  /**
   * The name of the GitHub org to process.
   */
  name: string;
  /**
   * The namespace of the group created for this org.
   */
  groupNamespace: string;
}>;

export function readGithubMultiOrgConfig(config: Config): GithubMultiOrgConfig {
  const orgConfigs = config.getOptionalConfigArray('orgs') ?? [];
  return orgConfigs.map(c => ({
    name: c.getString('name'),
    groupNamespace: (
      c.getOptionalString('groupNamespace') ?? c.getString('name')
    ).toLowerCase(),
  }));
}
