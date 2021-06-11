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

import { Config, ConfigReader } from '@backstage/config';
import { getCombinedClusterDetails } from './index';

describe('getCombinedClusterDetails', () => {
  it('should retrieve cluster details from config', async () => {
    const config: Config = new ConfigReader(
      {
        kubernetes: {
          clusterLocatorMethods: [
            {
              type: 'config',
              clusters: [
                {
                  name: 'cluster1',
                  serviceAccountToken: 'token',
                  url: 'http://localhost:8080',
                  authProvider: 'serviceAccount',
                },
                {
                  name: 'cluster2',
                  url: 'http://localhost:8081',
                  authProvider: 'google',
                },
              ],
            },
          ],
        },
      },
      'ctx',
    );

    const result = await getCombinedClusterDetails(config);

    expect(result).toStrictEqual([
      {
        name: 'cluster1',
        serviceAccountToken: 'token',
        url: 'http://localhost:8080',
        authProvider: 'serviceAccount',
        skipTLSVerify: false,
      },
      {
        name: 'cluster2',
        serviceAccountToken: undefined,
        url: 'http://localhost:8081',
        authProvider: 'google',
        skipTLSVerify: false,
      },
    ]);
  });

  it('throws an error when using an unsupported cluster locator', async () => {
    const config: Config = new ConfigReader(
      {
        kubernetes: {
          clusterLocatorMethods: [
            {
              type: 'config',
              clusters: [
                {
                  name: 'cluster1',
                  serviceAccountToken: 'token',
                  url: 'http://localhost:8080',
                  authProvider: 'serviceAccount',
                },
                {
                  name: 'cluster2',
                  url: 'http://localhost:8081',
                  authProvider: 'google',
                },
              ],
            },
            {
              type: 'magic',
            },
          ],
        },
      },
      'ctx',
    );

    await expect(getCombinedClusterDetails(config)).rejects.toStrictEqual(
      new Error('Unsupported kubernetes.clusterLocatorMethods: "magic"'),
    );
  });
});
