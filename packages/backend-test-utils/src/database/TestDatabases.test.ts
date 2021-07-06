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

import knexFactory from 'knex';
import { isDockerDisabledForTests } from '../util/isDockerDisabledForTests';
import { startMysqlContainer } from './startMysqlContainer';
import { startPostgresContainer } from './startPostgresContainer';
import { TestDatabases } from './TestDatabases';

const itIfDocker = isDockerDisabledForTests() ? it.skip : it;

describe('TestDatabases', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('each', () => {
    const dbs = TestDatabases.create();

    it.each(dbs.eachSupportedId())(
      'creates distinct %p databases',
      async databaseId => {
        if (!dbs.supports(databaseId)) {
          return;
        }
        const db1 = await dbs.init(databaseId);
        const db2 = await dbs.init(databaseId);
        await db1.schema.createTable('a', table => table.string('x').primary());
        await db2.schema.createTable('a', table => table.string('y').primary());
        await expect(db1.select({ a: db1.raw('1') })).resolves.toEqual([
          { a: 1 },
        ]);
      },
      60_000,
    );
  });

  itIfDocker(
    'obeys a provided connection string for postgres 13',
    async () => {
      const dbs = TestDatabases.create();
      const { host, port, user, password, stop } = await startPostgresContainer(
        'postgres:13',
      );

      try {
        // Leave a mark
        process.env.BACKSTAGE_TEST_DATABASE_POSTGRES13_CONNECTION_STRING = `postgresql://${user}:${password}@${host}:${port}`;
        const input = await dbs.init('POSTGRES_13');
        await input.schema.createTable('a', table =>
          table.string('x').primary(),
        );
        await input.insert({ x: 'y' }).into('a');

        // Look for the mark
        const database = 'backstage_plugin_db0';
        const output = knexFactory({
          client: 'pg',
          connection: { host, port, user, password, database },
        });
        // eslint-disable-next-line jest/no-standalone-expect
        await expect(output.select('x').from('a')).resolves.toEqual([
          { x: 'y' },
        ]);
      } finally {
        await stop();
      }
    },
    60_000,
  );

  itIfDocker(
    'obeys a provided connection string for postgres 9',
    async () => {
      const dbs = TestDatabases.create();
      const { host, port, user, password, stop } = await startPostgresContainer(
        'postgres:9',
      );

      try {
        // Leave a mark
        process.env.BACKSTAGE_TEST_DATABASE_POSTGRES9_CONNECTION_STRING = `postgresql://${user}:${password}@${host}:${port}`;
        const input = await dbs.init('POSTGRES_9');
        await input.schema.createTable('a', table =>
          table.string('x').primary(),
        );
        await input.insert({ x: 'y' }).into('a');

        // Look for the mark
        const database = 'backstage_plugin_db0';
        const output = knexFactory({
          client: 'pg',
          connection: { host, port, user, password, database },
        });
        // eslint-disable-next-line jest/no-standalone-expect
        await expect(output.select('x').from('a')).resolves.toEqual([
          { x: 'y' },
        ]);
      } finally {
        await stop();
      }
    },
    60_000,
  );

  itIfDocker(
    'obeys a provided connection string for mysql 8',
    async () => {
      const dbs = TestDatabases.create();
      const { host, port, user, password, stop } = await startMysqlContainer(
        'mysql:8',
      );

      try {
        // Leave a mark
        process.env.BACKSTAGE_TEST_DATABASE_MYSQL8_CONNECTION_STRING = `mysql://${user}:${password}@${host}:${port}/ignored`;
        const input = await dbs.init('MYSQL_8');
        await input.schema.createTable('a', table =>
          table.string('x').primary(),
        );
        await input.insert({ x: 'y' }).into('a');

        // Look for the mark
        const database = 'backstage_plugin_db0';
        const output = knexFactory({
          client: 'mysql2',
          connection: { host, port, user, password, database },
        });
        // eslint-disable-next-line jest/no-standalone-expect
        await expect(output.select('x').from('a')).resolves.toEqual([
          { x: 'y' },
        ]);
      } finally {
        await stop();
      }
    },
    60_000,
  );
});
