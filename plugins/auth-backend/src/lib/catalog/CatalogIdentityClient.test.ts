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

import { CatalogApi } from '@backstage/catalog-client';
import { UserEntity } from '@backstage/catalog-model';
import { CatalogIdentityClient } from './CatalogIdentityClient';

describe('CatalogIdentityClient', () => {
  const catalogApi: jest.Mocked<CatalogApi> = {
    getLocationById: jest.fn(),
    getEntityByName: jest.fn(),
    getEntities: jest.fn(),
    addLocation: jest.fn(),
    removeLocationById: jest.fn(),
    getOriginLocationByEntity: jest.fn(),
    getLocationByEntity: jest.fn(),
    removeEntityByUid: jest.fn(),
    getAttachment: jest.fn(),
  };

  afterEach(() => jest.resetAllMocks());

  it('passes through the correct search params', async () => {
    catalogApi.getEntities.mockResolvedValueOnce({ items: [{} as UserEntity] });
    const client = new CatalogIdentityClient({
      catalogApi: catalogApi as CatalogApi,
    });

    client.findUser({ annotations: { key: 'value' } });

    expect(catalogApi.getEntities).toBeCalledWith(
      {
        filter: {
          kind: 'user',
          'metadata.annotations.key': 'value',
        },
      },
      undefined,
    );
  });
});
