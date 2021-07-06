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

import '@backstage/backend-common';
import { ConfigReader, Config } from '@backstage/config';
import { ConfigClusterLocator } from './ConfigClusterLocator';

describe('ConfigClusterLocator', () => {
  it('empty clusters returns empty cluster details', async () => {
    const config: Config = new ConfigReader({
      clusters: [],
    });

    const sut = ConfigClusterLocator.fromConfig(config);

    const result = await sut.getClusters();

    expect(result).toStrictEqual([]);
  });

  it('one clusters returns one cluster details', async () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster1',
          url: 'http://localhost:8080',
          authProvider: 'serviceAccount',
        },
      ],
    });

    const sut = ConfigClusterLocator.fromConfig(config);

    const result = await sut.getClusters();

    expect(result).toStrictEqual([
      {
        name: 'cluster1',
        serviceAccountToken: undefined,
        url: 'http://localhost:8080',
        authProvider: 'serviceAccount',
        skipTLSVerify: false,
      },
    ]);
  });

  it('two clusters returns two cluster details', async () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster1',
          serviceAccountToken: 'token',
          url: 'http://localhost:8080',
          authProvider: 'serviceAccount',
          skipTLSVerify: false,
        },
        {
          name: 'cluster2',
          url: 'http://localhost:8081',
          authProvider: 'google',
          skipTLSVerify: true,
        },
      ],
    });

    const sut = ConfigClusterLocator.fromConfig(config);

    const result = await sut.getClusters();

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
        skipTLSVerify: true,
      },
    ]);
  });
});
