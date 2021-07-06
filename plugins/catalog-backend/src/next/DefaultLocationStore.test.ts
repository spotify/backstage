/*
 * Copyright 2021 The Backstage Authors
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
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { v4 as uuid } from 'uuid';
import { DatabaseManager } from './database/DatabaseManager';
import { DefaultLocationStore } from './DefaultLocationStore';

describe('DefaultLocationStore', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createLocationStore(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await DatabaseManager.createDatabase(knex);
    const connection = { applyMutation: jest.fn() };
    const store = new DefaultLocationStore(knex);
    await store.connect(connection);
    return { store, connection };
  }

  it.each(databases.eachSupportedId())(
    'should do a full sync with the locations on connect, %p',
    async databaseId => {
      const { connection } = await createLocationStore(databaseId);

      expect(connection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [],
      });
    },
    60_000,
  );

  describe('listLocations', () => {
    it.each(databases.eachSupportedId())(
      'lists empty locations when there is no locations, %p',
      async databaseId => {
        const { store } = await createLocationStore(databaseId);
        expect(await store.listLocations()).toEqual([]);
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'lists locations that are added to the db, %p',
      async databaseId => {
        const { store } = await createLocationStore(databaseId);
        await store.createLocation({
          target:
            'https://github.com/backstage/demo/blob/master/catalog-info.yml',
          type: 'url',
        });

        const listLocations = await store.listLocations();
        expect(listLocations).toHaveLength(1);
        expect(listLocations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              target:
                'https://github.com/backstage/demo/blob/master/catalog-info.yml',
              type: 'url',
            }),
          ]),
        );
      },
      60_000,
    );
  });

  describe('createLocation', () => {
    it.each(databases.eachSupportedId())(
      'throws when the location already exists, %p',
      async databaseId => {
        const { store } = await createLocationStore(databaseId);
        const spec = {
          target:
            'https://github.com/backstage/demo/blob/master/catalog-info.yml',
          type: 'url',
        };
        await store.createLocation(spec);
        await expect(() => store.createLocation(spec)).rejects.toThrow(
          new RegExp(`Location ${spec.type}:${spec.target} already exists`),
        );
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'calls apply mutation when adding a new location, %p',
      async databaseId => {
        const { store, connection } = await createLocationStore(databaseId);
        await store.createLocation({
          target:
            'https://github.com/backstage/demo/blob/master/catalog-info.yml',
          type: 'url',
        });

        expect(connection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          removed: [],
          added: expect.arrayContaining([
            {
              entity: expect.objectContaining({
                spec: {
                  target:
                    'https://github.com/backstage/demo/blob/master/catalog-info.yml',
                  type: 'url',
                },
              }),
              locationKey:
                'url:https://github.com/backstage/demo/blob/master/catalog-info.yml',
            },
          ]),
        });
      },
      60_000,
    );
  });

  describe('deleteLocation', () => {
    it.each(databases.eachSupportedId())(
      'throws if the location does not exist, %p',
      async databaseId => {
        const { store } = await createLocationStore(databaseId);
        const id = uuid();
        await expect(() => store.deleteLocation(id)).rejects.toThrow(
          new RegExp(`Found no location with ID ${id}`),
        );
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'calls apply mutation when adding a new location, %p',
      async databaseId => {
        const { store, connection } = await createLocationStore(databaseId);

        const location = await store.createLocation({
          target:
            'https://github.com/backstage/demo/blob/master/catalog-info.yml',
          type: 'url',
        });

        await store.deleteLocation(location.id);

        expect(connection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [],
          removed: [
            {
              entity: expect.objectContaining({
                spec: {
                  target:
                    'https://github.com/backstage/demo/blob/master/catalog-info.yml',
                  type: 'url',
                },
              }),
              locationKey:
                'url:https://github.com/backstage/demo/blob/master/catalog-info.yml',
            },
          ],
        });
      },
      60_000,
    );
  });
});
