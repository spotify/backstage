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

import { Config, ConfigReader } from '@backstage/config';
import {
  createPgDatabaseClient,
  buildPgDatabaseConfig,
  getPgConnectionConfig,
  parsePgConnectionString,
} from './postgres';

describe('postgres', () => {
  const createMockConnection = () => ({
    host: 'acme',
    user: 'foo',
    password: 'bar',
    database: 'foodb',
  });

  const createMockConnectionString = () =>
    'postgresql://foo:bar@acme:5432/foodb';

  const createConfig = (connection: any): Config =>
    new ConfigReader({ client: 'pg', connection });

  describe('buildPgDatabaseConfig', () => {
    it('builds a postgres config', () => {
      const mockConnection = createMockConnection();

      expect(buildPgDatabaseConfig(createConfig(mockConnection))).toEqual({
        client: 'pg',
        connection: mockConnection,
        useNullAsDefault: true,
      });
    });

    it('builds a connection string config', () => {
      const mockConnectionString = createMockConnectionString();

      expect(buildPgDatabaseConfig(createConfig(mockConnectionString))).toEqual(
        {
          client: 'pg',
          connection: mockConnectionString,
          useNullAsDefault: true,
        },
      );
    });

    it('overrides the database name', () => {
      const mockConnection = createMockConnection();

      expect(
        buildPgDatabaseConfig(createConfig(mockConnection), {
          connection: { database: 'other_db' },
        }),
      ).toEqual({
        client: 'pg',
        connection: {
          ...mockConnection,
          database: 'other_db',
        },
        useNullAsDefault: true,
      });
    });

    it('adds additional config settings', () => {
      const mockConnection = createMockConnection();

      expect(
        buildPgDatabaseConfig(createConfig(mockConnection), {
          connection: { database: 'other_db' },
          pool: { min: 0, max: 7 },
          debug: true,
        }),
      ).toEqual({
        client: 'pg',
        connection: {
          ...mockConnection,
          database: 'other_db',
        },
        useNullAsDefault: true,
        pool: { min: 0, max: 7 },
        debug: true,
      });
    });

    it('overrides the database from connection string', () => {
      const mockConnectionString = createMockConnectionString();
      const mockConnection = createMockConnection();

      expect(
        buildPgDatabaseConfig(createConfig(mockConnectionString), {
          connection: { database: 'other_db' },
        }),
      ).toEqual({
        client: 'pg',
        connection: {
          ...mockConnection,
          port: '5432',
          database: 'other_db',
        },
        useNullAsDefault: true,
      });
    });
  });

  describe('getPgConnectionConfig', () => {
    it('returns the connection object back', () => {
      const mockConnection = createMockConnection();
      const config = createConfig(mockConnection);

      expect(getPgConnectionConfig(config)).toEqual(mockConnection);
    });

    it('does not parse the connection string', () => {
      const mockConnection = createMockConnection();
      const config = createConfig(mockConnection);

      expect(getPgConnectionConfig(config, true)).toEqual(mockConnection);
    });

    it('automatically parses the connection string', () => {
      const mockConnection = createMockConnection();
      const mockConnectionString = createMockConnectionString();
      const config = createConfig(mockConnectionString);

      expect(getPgConnectionConfig(config)).toEqual({
        ...mockConnection,
        port: '5432',
      });
    });

    it('parses the connection string', () => {
      const mockConnection = createMockConnection();
      const mockConnectionString = createMockConnectionString();
      const config = createConfig(mockConnectionString);

      expect(getPgConnectionConfig(config, true)).toEqual({
        ...mockConnection,
        port: '5432',
      });
    });
  });

  describe('createPgDatabaseClient', () => {
    it('creates a postgres knex instance', () => {
      expect(
        createPgDatabaseClient(
          createConfig({
            host: 'acme',
            user: 'foo',
            password: 'bar',
            database: 'foodb',
          }),
        ),
      ).toBeTruthy();
    });

    it('attempts to read an ssl cert', () => {
      expect(() =>
        createPgDatabaseClient(
          createConfig(
            'postgresql://postgres:pass@localhost:5432/dbname?sslrootcert=/path/to/file',
          ),
        ),
      ).toThrowError(/no such file or directory/);
    });
  });

  describe('parsePgConnectionString', () => {
    it('parses a connection string uri', () => {
      expect(
        parsePgConnectionString(
          'postgresql://postgres:pass@foobar:5432/dbname?ssl=true',
        ),
      ).toEqual({
        host: 'foobar',
        user: 'postgres',
        password: 'pass',
        port: '5432',
        database: 'dbname',
        ssl: true,
      });
    });
  });
});
