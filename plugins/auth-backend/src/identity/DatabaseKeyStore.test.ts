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

import Knex from 'knex';
import { DatabaseKeyStore } from './DatabaseKeyStore';
import { DateTime } from 'luxon';

function createDB() {
  const knex = Knex({
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  });
  knex.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
    resource.run('PRAGMA foreign_keys = ON', () => {});
  });
  return knex;
}

const keyBase = {
  use: 'sig',
  kty: 'plain',
  alg: 'Base64',
} as const;

describe('DatabaseKeyStore', () => {
  it('should store a key', async () => {
    const database = createDB();
    const store = await DatabaseKeyStore.create({ database });

    const key = {
      kid: '123',
      ...keyBase,
    };

    await expect(store.listKeys()).resolves.toEqual({ items: [] });
    await store.addKey(key);

    const { items } = await store.listKeys();
    expect(items).toEqual([{ createdAt: expect.anything(), key }]);
    expect(
      Math.abs(
        DateTime.fromJSDate(items[0].createdAt).diffNow('seconds').seconds,
      ),
    ).toBeLessThan(10);
  });

  it('should remove stored keys', async () => {
    const database = createDB();
    const store = await DatabaseKeyStore.create({ database });

    const key1 = { kid: '1', ...keyBase };
    const key2 = { kid: '2', ...keyBase };
    const key3 = { kid: '3', ...keyBase };

    await store.addKey(key1);
    await store.addKey(key2);
    await store.addKey(key3);

    await expect(store.listKeys()).resolves.toEqual({
      items: [
        { key: key1, createdAt: expect.anything() },
        { key: key2, createdAt: expect.anything() },
        { key: key3, createdAt: expect.anything() },
      ],
    });

    store.removeKeys(['1']);

    await expect(store.listKeys()).resolves.toEqual({
      items: [
        { key: key2, createdAt: expect.anything() },
        { key: key3, createdAt: expect.anything() },
      ],
    });

    store.removeKeys(['1', '2']);

    await expect(store.listKeys()).resolves.toEqual({
      items: [{ key: key3, createdAt: expect.anything() }],
    });

    store.removeKeys([]);

    await expect(store.listKeys()).resolves.toEqual({
      items: [{ key: key3, createdAt: expect.anything() }],
    });

    store.removeKeys(['3', '4']);

    await expect(store.listKeys()).resolves.toEqual({
      items: [],
    });

    await store.addKey(key1);
    await store.addKey(key2);
    await store.addKey(key3);

    await expect(store.listKeys()).resolves.toEqual({
      items: [
        { key: key1, createdAt: expect.anything() },
        { key: key2, createdAt: expect.anything() },
        { key: key3, createdAt: expect.anything() },
      ],
    });

    store.removeKeys(['1', '2', '3']);

    await expect(store.listKeys()).resolves.toEqual({
      items: [],
    });
  });
});
