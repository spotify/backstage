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
import { isValidHost } from '../helpers';

const GITHUB_HOST = 'github.com';
const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_RAW_BASE_URL = 'https://raw.githubusercontent.com';

/**
 * The configuration parameters for a single GitHub integration.
 */
export type GitHubIntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "github.com"
   */
  host: string;

  /**
   * The base URL of the API of this provider, e.g. "https://api.github.com",
   * with no trailing slash.
   *
   * May be omitted specifically for GitHub; then it will be deduced.
   *
   * The API will always be preferred if both its base URL and a token are
   * present.
   */
  apiBaseUrl?: string;

  /**
   * The base URL of the raw fetch endpoint of this provider, e.g.
   * "https://raw.githubusercontent.com", with no trailing slash.
   *
   * May be omitted specifically for GitHub; then it will be deduced.
   *
   * The API will always be preferred if both its base URL and a token are
   * present.
   */
  rawBaseUrl?: string;

  /**
   * The authorization token to use for requests to this provider.
   *
   * If no token is specified, anonymous access is used.
   */
  token?: string;

  /**
   * The GitHub Apps configuration to use for requests to this provider.
   *
   * If no apps are specified, token or anonymous is used.
   */
  apps?: GithubAppConfig[];
};

/**
 * The configuration parameters for authenticating a GitHub Application.
 * A Github Apps configuration can be generated using the `backstage-cli create-github-app` command.
 */
export type GithubAppConfig = {
  /**
   * Unique app identifier, found at https://github.com/organizations/$org/settings/apps/$AppName
   */
  appId: number;
  /**
   * The private key is used by the GitHub App integration to authenticate the app.
   * A private key can be generated from the app at https://github.com/organizations/$org/settings/apps/$AppName
   */
  privateKey: string;
  /**
   * Webhook secret can be configured at https://github.com/organizations/$org/settings/apps/$AppName
   */
  webhookSecret: string;
  /**
   * Found at https://github.com/organizations/$org/settings/apps/$AppName
   */
  clientId: string;
  /**
   * Client secrets can be generated at https://github.com/organizations/$org/settings/apps/$AppName
   */
  clientSecret: string;
};

/**
 * Reads a single GitHub integration config.
 *
 * @param config The config object of a single integration
 */
export function readGitHubIntegrationConfig(
  config: Config,
): GitHubIntegrationConfig {
  const host = config.getOptionalString('host') ?? GITHUB_HOST;
  let apiBaseUrl = config.getOptionalString('apiBaseUrl');
  let rawBaseUrl = config.getOptionalString('rawBaseUrl');
  const token = config.getOptionalString('token');
  const apps = config.getOptionalConfigArray('apps')?.map(c => ({
    appId: c.getNumber('appId'),
    clientId: c.getString('clientId'),
    clientSecret: c.getString('clientSecret'),
    webhookSecret: c.getString('webhookSecret'),
    privateKey: c.getString('privateKey'),
  }));

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid GitHub integration config, '${host}' is not a valid host`,
    );
  }

  if (apiBaseUrl) {
    apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
  } else if (host === GITHUB_HOST) {
    apiBaseUrl = GITHUB_API_BASE_URL;
  }

  if (rawBaseUrl) {
    rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');
  } else if (host === GITHUB_HOST) {
    rawBaseUrl = GITHUB_RAW_BASE_URL;
  }

  return { host, apiBaseUrl, rawBaseUrl, token, apps };
}

/**
 * Reads a set of GitHub integration configs, and inserts some defaults for
 * public GitHub if not specified.
 *
 * @param configs All of the integration config objects
 */
export function readGitHubIntegrationConfigs(
  configs: Config[],
): GitHubIntegrationConfig[] {
  // First read all the explicit integrations
  const result = configs.map(readGitHubIntegrationConfig);

  // If no explicit github.com integration was added, put one in the list as
  // a convenience
  if (!result.some(c => c.host === GITHUB_HOST)) {
    result.push({
      host: GITHUB_HOST,
      apiBaseUrl: GITHUB_API_BASE_URL,
      rawBaseUrl: GITHUB_RAW_BASE_URL,
    });
  }

  return result;
}
