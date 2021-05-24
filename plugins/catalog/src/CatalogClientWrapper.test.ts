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

import { CatalogClient } from '@backstage/catalog-client';
import { DiscoveryApi, IdentityApi } from '@backstage/core';
import { CatalogClientWrapper } from './CatalogClientWrapper';

jest.mock('@backstage/catalog-client');
jest.mock('@backstage/core');

describe('CatalogClientWrapper', () => {
  let catalogClient: jest.Mocked<CatalogClient>;
  let identityApi: jest.Mocked<IdentityApi>;
  let client: CatalogClientWrapper;

  beforeEach(() => {
    jest.resetAllMocks();

    const discoveryApi: jest.Mocked<DiscoveryApi> = {
      getBaseUrl: jest.fn(),
    };
    catalogClient = (new CatalogClient({
      discoveryApi,
    }) as unknown) as jest.Mocked<CatalogClient>;
    identityApi = {
      getUserId: jest.fn(),
      getProfile: jest.fn(),
      getIdToken: jest.fn(),
      signOut: jest.fn(),
    };
    identityApi.getUserId.mockReturnValue('jane-fonda');
    identityApi.getProfile.mockReturnValue({ email: 'jane-fonda@spotify.com' });
    identityApi.getIdToken.mockResolvedValue('fake-id-token');

    client = new CatalogClientWrapper({
      client: catalogClient,
      identityApi,
    });
  });

  describe('getEntities', () => {
    it('injects authorization token', async () => {
      await client.getEntities();
      expect(catalogClient.getEntities).toHaveBeenCalledWith(undefined, {
        token: 'fake-id-token',
      });
      expect(catalogClient.getEntities).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLocationById', () => {
    it('omits authorization token when guest', async () => {
      identityApi.getUserId.mockReturnValue('guest');
      identityApi.getProfile.mockReturnValue({});
      identityApi.getIdToken.mockResolvedValue(undefined);

      await client.getLocationById('42');
      expect(catalogClient.getLocationById).toHaveBeenCalledWith('42', {});
      expect(catalogClient.getLocationById).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEntityByName', () => {
    const name = {
      kind: 'kind',
      namespace: 'namespace',
      name: 'name',
    };

    it('injects authorization token', async () => {
      await client.getEntityByName(name);
      expect(catalogClient.getEntityByName).toHaveBeenCalledWith(name, {
        token: 'fake-id-token',
      });
      expect(catalogClient.getEntityByName).toHaveBeenCalledTimes(1);
    });
  });

  describe('addLocation', () => {
    const location = { target: 'target' };

    it('injects authorization token', async () => {
      await client.addLocation(location);
      expect(catalogClient.addLocation).toHaveBeenCalledWith(location, {
        token: 'fake-id-token',
      });
      expect(catalogClient.addLocation).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLocationByEntity', () => {
    const entity = {
      apiVersion: 'apiVersion',
      kind: 'kind',
      metadata: {
        name: 'name',
      },
    };

    it('injects authorization token', async () => {
      await client.getLocationByEntity(entity);
      expect(catalogClient.getLocationByEntity).toHaveBeenCalledWith(entity, {
        token: 'fake-id-token',
      });
      expect(catalogClient.getLocationByEntity).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeEntityByUid', () => {
    it('injects authorization token', async () => {
      await client.removeEntityByUid('uid');
      expect(catalogClient.removeEntityByUid).toHaveBeenCalledWith('uid', {
        token: 'fake-id-token',
      });
      expect(catalogClient.removeEntityByUid).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAttachment', () => {
    const name = {
      kind: 'kind',
      namespace: 'namespace',
      name: 'name',
    };
    const key = 'backstage.io/attachment-key';

    it('injects authorization token', async () => {
      await client.getAttachment(name, key);

      expect(catalogClient.getAttachment).toHaveBeenCalledWith(name, key, {
        token: 'fake-id-token',
      });
      expect(catalogClient.getAttachment).toHaveBeenCalledTimes(1);
    });
  });
});
