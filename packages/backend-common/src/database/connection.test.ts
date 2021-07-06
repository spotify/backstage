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

import { ConfigReader } from '@backstage/config';
import {
  createDatabaseClient,
  createNameOverride,
  parseConnectionString,
} from './connection';

describe('database connection', () => {
  describe('createDatabaseClient', () => {
    it('returns a postgres connection', () => {
      expect(
        createDatabaseClient(
          new ConfigReader({
            client: 'pg',
            connection: {
              host: 'acme',
              user: 'foo',
              password: 'bar',
              database: 'foodb',
            },
          }),
        ),
      ).toBeTruthy();
    });

    it('returns an sqlite connection', () => {
      expect(
        createDatabaseClient(
          new ConfigReader({
            client: 'sqlite3',
            connection: ':memory:',
          }),
        ),
      ).toBeTruthy();
    });

    it('returns a mysql connection', () => {
      expect(() =>
        createDatabaseClient(
          new ConfigReader({
            client: 'mysql2',
            connection: {
              host: '127.0.0.1',
              user: 'foo',
              password: 'bar',
              database: 'dbname',
            },
          }),
        ),
      ).toBeTruthy();
    });

    it('accepts overrides', () => {
      expect(
        createDatabaseClient(
          new ConfigReader({
            client: 'pg',
            connection: {
              host: 'acme',
              user: 'foo',
              password: 'bar',
              database: 'foodb',
            },
          }),
          {
            connection: {
              database: 'foo',
            },
          },
        ),
      ).toBeTruthy();
    });

    it('throws an error without a client', () => {
      expect(() =>
        createDatabaseClient(
          new ConfigReader({
            connection: '',
          }),
        ),
      ).toThrowError();
    });

    it('throws an error without a connection', () => {
      expect(() =>
        createDatabaseClient(
          new ConfigReader({
            client: 'pg',
          }),
        ),
      ).toThrowError();
    });
  });

  describe('createNameOverride', () => {
    it('returns Knex config for postgres', () => {
      expect(createNameOverride('pg', 'testpg')).toHaveProperty(
        'connection.database',
        'testpg',
      );
    });

    it('returns Knex config for sqlite', () => {
      expect(createNameOverride('sqlite3', 'testsqlite')).toHaveProperty(
        'connection.filename',
        'testsqlite',
      );
    });

    it('returns Knex config for mysql', () => {
      expect(createNameOverride('mysql', 'testmysql')).toHaveProperty(
        'connection.database',
        'testmysql',
      );
    });

    it('throws an error for unknown connection', () => {
      expect(() => createNameOverride('unknown', 'testname')).toThrowError();
    });
  });

  describe('parseConnectionString', () => {
    it('returns parsed Knex.StaticConnectionConfig for postgres', () => {
      expect(
        parseConnectionString('postgresql://foo:bar@acme:5432/foodb', 'pg'),
      ).toHaveProperty('database', 'foodb');
    });

    it('returns parsed Knex.StaticConnectionConfig for mysql2', () => {
      expect(
        parseConnectionString('mysql://foo:bar@acme:3306/foodb', 'mysql2'),
      ).toHaveProperty('database', 'foodb');
    });

    it('throws an error if client hint is not provided', () => {
      expect(() => parseConnectionString('sqlite://')).toThrow();
    });
  });
});
