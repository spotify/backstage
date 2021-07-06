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

import { CatalogClient } from '@backstage/catalog-client';
import { CatalogClientWrapper } from './CatalogClientWrapper';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

jest.mock('@backstage/catalog-client');
const MockedCatalogClient = CatalogClient as jest.Mock<CatalogClient>;

const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';
const discoveryApi: DiscoveryApi = {
  async getBaseUrl(_pluginId) {
    return mockBaseUrl;
  },
};
const identityApi: IdentityApi = {
  getUserId() {
    return 'jane-fonda';
  },
  getProfile() {
    return { email: 'jane-fonda@spotify.com' };
  },
  async getIdToken() {
    return Promise.resolve('fake-id-token');
  },
  async signOut() {
    return Promise.resolve();
  },
};
const guestIdentityApi: IdentityApi = {
  getUserId() {
    return 'guest';
  },
  getProfile() {
    return {};
  },
  async getIdToken() {
    return Promise.resolve(undefined);
  },
  async signOut() {
    return Promise.resolve();
  },
};

describe('CatalogClientWrapper', () => {
  beforeEach(() => {
    MockedCatalogClient.mockClear();
  });

  describe('getEntities', () => {
    it('injects authorization token', async () => {
      const client = new CatalogClientWrapper({
        client: new MockedCatalogClient({ discoveryApi }),
        identityApi,
      });
      await client.getEntities();
      const getEntities = MockedCatalogClient.mock.instances[0].getEntities;
      expect(getEntities).toHaveBeenCalledWith(undefined, {
        token: 'fake-id-token',
      });
      expect(getEntities).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLocationById', () => {
    it('omits authorization token when guest', async () => {
      const client = new CatalogClientWrapper({
        client: new MockedCatalogClient({ discoveryApi }),
        identityApi: guestIdentityApi,
      });
      await client.getLocationById('42');
      const getLocationById =
        MockedCatalogClient.mock.instances[0].getLocationById;
      expect(getLocationById).toHaveBeenCalledWith('42', {});
      expect(getLocationById).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEntityByName', () => {
    const name = {
      kind: 'kind',
      namespace: 'namespace',
      name: 'name',
    };
    it('injects authorization token', async () => {
      const client = new CatalogClientWrapper({
        client: new MockedCatalogClient({ discoveryApi }),
        identityApi,
      });
      await client.getEntityByName(name);
      const getEntityByName =
        MockedCatalogClient.mock.instances[0].getEntityByName;
      expect(getEntityByName).toHaveBeenCalledWith(name, {
        token: 'fake-id-token',
      });
      expect(getEntityByName).toHaveBeenCalledTimes(1);
    });
  });

  describe('addLocation', () => {
    const location = { target: 'target' };
    it('injects authorization token', async () => {
      const client = new CatalogClientWrapper({
        client: new MockedCatalogClient({ discoveryApi }),
        identityApi,
      });
      await client.addLocation(location);
      const addLocation = MockedCatalogClient.mock.instances[0].addLocation;
      expect(addLocation).toHaveBeenCalledWith(location, {
        token: 'fake-id-token',
      });
      expect(addLocation).toHaveBeenCalledTimes(1);
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
      const client = new CatalogClientWrapper({
        client: new MockedCatalogClient({ discoveryApi }),
        identityApi,
      });
      await client.getLocationByEntity(entity);
      const getLocationByEntity =
        MockedCatalogClient.mock.instances[0].getLocationByEntity;
      expect(getLocationByEntity).toHaveBeenCalledWith(entity, {
        token: 'fake-id-token',
      });
      expect(getLocationByEntity).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeEntityByUid', () => {
    it('injects authorization token', async () => {
      const uid = 'uid';
      const client = new CatalogClientWrapper({
        client: new MockedCatalogClient({ discoveryApi }),
        identityApi,
      });
      await client.removeEntityByUid(uid);
      const removeEntityByUid =
        MockedCatalogClient.mock.instances[0].removeEntityByUid;
      expect(removeEntityByUid).toHaveBeenCalledWith(uid, {
        token: 'fake-id-token',
      });
      expect(removeEntityByUid).toHaveBeenCalledTimes(1);
    });
  });
});
