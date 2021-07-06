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

const AZURE_HOST = 'dev.azure.com';

/**
 * The configuration parameters for a single Azure provider.
 */
export type AzureIntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "dev.azure.com".
   *
   * Currently only "dev.azure.com" is supported.
   */
  host: string;

  /**
   * The authorization token to use for requests.
   *
   * If no token is specified, anonymous access is used.
   */
  token?: string;
};

/**
 * Reads a single Azure integration config.
 *
 * @param config The config object of a single integration
 */
export function readAzureIntegrationConfig(
  config: Config,
): AzureIntegrationConfig {
  const host = config.getOptionalString('host') ?? AZURE_HOST;
  const token = config.getOptionalString('token');

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid Azure integration config, '${host}' is not a valid host`,
    );
  }

  return { host, token };
}

/**
 * Reads a set of Azure integration configs, and inserts some defaults for
 * public Azure if not specified.
 *
 * @param configs All of the integration config objects
 */
export function readAzureIntegrationConfigs(
  configs: Config[],
): AzureIntegrationConfig[] {
  // First read all the explicit integrations
  const result = configs.map(readAzureIntegrationConfig);

  // If no explicit dev.azure.com integration was added, put one in the list as
  // a convenience
  if (!result.some(c => c.host === AZURE_HOST)) {
    result.push({ host: AZURE_HOST });
  }

  return result;
}
