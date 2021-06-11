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
import { Config } from '@backstage/config';
import { UrlPatternDiscovery } from '@backstage/core';
import { TechDocsStorageClient } from './client';

const mockEntity = {
  kind: 'Component',
  namespace: 'default',
  name: 'test-component',
};

describe('TechDocsStorageClient', () => {
  const mockBaseUrl = 'http://backstage:9191/api/techdocs';
  const configApi = {
    getOptionalString: () => 'http://backstage:9191/api/techdocs',
  } as Partial<Config>;
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);

  it('should return correct base url based on defined storage', async () => {
    // @ts-ignore Partial<Config> not assignable to Config.
    const storageApi = new TechDocsStorageClient({ configApi, discoveryApi });

    await expect(
      storageApi.getBaseUrl('test.js', mockEntity, ''),
    ).resolves.toEqual(
      `${mockBaseUrl}/static/docs/${mockEntity.namespace}/${mockEntity.kind}/${mockEntity.name}/test.js`,
    );
  });

  it('should return base url with correct entity structure', async () => {
    // @ts-ignore Partial<Config> not assignable to Config.
    const storageApi = new TechDocsStorageClient({ configApi, discoveryApi });

    await expect(
      storageApi.getBaseUrl('test/', mockEntity, ''),
    ).resolves.toEqual(
      `${mockBaseUrl}/static/docs/${mockEntity.namespace}/${mockEntity.kind}/${mockEntity.name}/test/`,
    );
  });
});
