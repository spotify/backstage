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
import { MultiTenantServiceLocator } from './MultiTenantServiceLocator';

describe('MultiTenantConfigClusterLocator', () => {
  it('empty clusters returns empty cluster details', async () => {
    const sut = new MultiTenantServiceLocator([]);

    const result = await sut.getClustersByServiceId('ignored');

    expect(result).toStrictEqual([]);
  });

  it('one clusters returns one cluster details', async () => {
    const sut = new MultiTenantServiceLocator([
      {
        name: 'cluster1',
        url: 'http://localhost:8080',
        authProvider: 'serviceAccount',
        serviceAccountToken: '12345',
      },
    ]);

    const result = await sut.getClustersByServiceId('ignored');

    expect(result).toStrictEqual([
      {
        name: 'cluster1',
        serviceAccountToken: '12345',
        url: 'http://localhost:8080',
        authProvider: 'serviceAccount',
      },
    ]);
  });

  it('two clusters returns two cluster details', async () => {
    const sut = new MultiTenantServiceLocator([
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
    ]);

    const result = await sut.getClustersByServiceId('ignored');

    expect(result).toStrictEqual([
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
    ]);
  });
});
