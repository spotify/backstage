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
 * The configuration parameters for a single Google Cloud Storage provider.
 */
export type GoogleGcsIntegrationConfig = {
  /**
   * Service account email used to authenticate requests.
   */
  clientEmail?: string;
  /**
   * Service account private key used to authenticate requests.
   */
  privateKey?: string;
};

/**
 * Reads a single Google GCS integration config.
 *
 * @param config The config object of a single integration
 */
export function readGoogleGcsIntegrationConfig(
  config: Config,
): GoogleGcsIntegrationConfig {
  if (!config) {
    return {};
  }

  if (!config.has('clientEmail') && !config.has('privateKey')) {
    return {};
  }

  const privateKey = config.getString('privateKey').split('\\n').join('\n');

  const clientEmail = config.getString('clientEmail');
  return { clientEmail: clientEmail, privateKey: privateKey };
}
