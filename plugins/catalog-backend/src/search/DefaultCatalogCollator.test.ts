/*
 * Copyright 2021 Spotify AB
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

import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { DefaultCatalogCollator } from './DefaultCatalogCollator';

const expectedEntities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-entity',
      description: 'The expected description',
    },
    spec: {
      type: 'some-type',
      lifecycle: 'experimental',
      owner: 'someone',
    },
  },
];

jest.mock('cross-fetch', () => ({
  __esModule: true,
  default: async () => {
    return {
      json: async () => {
        return expectedEntities;
      },
    };
  },
}));

describe('DefaultCatalogCollator', () => {
  let mockDiscoveryApi: jest.Mocked<PluginEndpointDiscovery>;
  let collator: DefaultCatalogCollator;

  beforeEach(() => {
    mockDiscoveryApi = {
      getBaseUrl: jest.fn().mockResolvedValueOnce('http://localhost:7000'),
      getExternalBaseUrl: jest.fn(),
    };
    collator = new DefaultCatalogCollator({ discovery: mockDiscoveryApi });
  });

  it('fetches from the configured catalog service', async () => {
    const documents = await collator.execute();
    expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('catalog');
    expect(documents).toHaveLength(expectedEntities.length);
  });

  it('maps a returned entity to an expected CatalogEntityDocument', async () => {
    const documents = await collator.execute();
    expect(documents[0]).toMatchObject({
      title: expectedEntities[0].metadata.name,
      location: '/catalog/default/component/test-entity',
      text: expectedEntities[0].metadata.description,
      namespace: 'default',
      componentType: expectedEntities[0]!.spec!.type,
      lifecycle: expectedEntities[0]!.spec!.lifecycle,
      owner: expectedEntities[0]!.spec!.owner,
    });
  });

  it('maps a returned entity with a custom locationTemplate', async () => {
    // Provide an alternate location template.
    collator = new DefaultCatalogCollator({
      discovery: mockDiscoveryApi,
      locationTemplate: '/software/:name',
    });

    const documents = await collator.execute();
    expect(documents[0]).toMatchObject({
      location: '/software/test-entity',
    });
  });
});
