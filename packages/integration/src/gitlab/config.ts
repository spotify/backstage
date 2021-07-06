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
import { isValidHost, isValidUrl } from '../helpers';

const GITLAB_HOST = 'gitlab.com';
const GITLAB_API_BASE_URL = 'https://gitlab.com/api/v4';

/**
 * The configuration parameters for a single GitLab integration.
 */
export type GitLabIntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "gitlab.com".
   */
  host: string;

  /**
   * The base URL of the API of this provider, e.g.
   * "https://gitlab.com/api/v4", with no trailing slash.
   *
   * May be omitted specifically for public GitLab; then it will be deduced.
   */
  apiBaseUrl: string;

  /**
   * The authorization token to use for requests to this provider.
   *
   * If no token is specified, anonymous access is used.
   */
  token?: string;

  /**
   * The baseUrl of this provider, e.g. "https://gitlab.com", which is passed
   * into the GitLab client.
   *
   * If no baseUrl is provided, it will default to https://${host}
   */
  baseUrl: string;
};

/**
 * Reads a single GitLab integration config.
 *
 * @param config The config object of a single integration
 */
export function readGitLabIntegrationConfig(
  config: Config,
): GitLabIntegrationConfig {
  const host = config.getString('host');
  let apiBaseUrl = config.getOptionalString('apiBaseUrl');
  const token = config.getOptionalString('token');
  let baseUrl = config.getOptionalString('baseUrl');

  if (apiBaseUrl) {
    apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
  } else if (host === GITLAB_HOST) {
    apiBaseUrl = GITLAB_API_BASE_URL;
  }

  if (baseUrl) {
    baseUrl = baseUrl.replace(/\/+$/, '');
  } else {
    baseUrl = `https://${host}`;
  }

  if (host.includes(':')) {
    throw new Error(
      `Invalid GitLab integration config, host '${host}' should just be the host name (e.g. "github.com"), not a URL`,
    );
  } else if (!isValidHost(host)) {
    throw new Error(
      `Invalid GitLab integration config, '${host}' is not a valid host`,
    );
  } else if (!apiBaseUrl || !isValidUrl(apiBaseUrl)) {
    throw new Error(
      `Invalid GitLab integration config, '${apiBaseUrl}' is not a valid apiBaseUrl`,
    );
  } else if (!isValidUrl(baseUrl)) {
    throw new Error(
      `Invalid GitLab integration config, '${baseUrl}' is not a valid baseUrl`,
    );
  }

  return { host, token, apiBaseUrl, baseUrl };
}

/**
 * Reads a set of GitLab integration configs, and inserts some defaults for
 * public GitLab if not specified.
 *
 * @param configs All of the integration config objects
 */
export function readGitLabIntegrationConfigs(
  configs: Config[],
): GitLabIntegrationConfig[] {
  // First read all the explicit integrations
  const result = configs.map(readGitLabIntegrationConfig);

  // As a convenience we always make sure there's at least an unauthenticated
  // reader for public gitlab repos.
  if (!result.some(c => c.host === GITLAB_HOST)) {
    result.push({
      host: GITLAB_HOST,
      apiBaseUrl: GITLAB_API_BASE_URL,
      baseUrl: `https://${GITLAB_HOST}`,
    });
  }

  return result;
}
