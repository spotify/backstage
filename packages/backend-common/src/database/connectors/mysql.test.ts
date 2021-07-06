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
  buildMysqlDatabaseConfig,
  createMysqlDatabaseClient,
  getMysqlConnectionConfig,
  parseMysqlConnectionString,
} from './mysql';

describe('mysql', () => {
  const createMockConnection = () => ({
    host: 'acme',
    user: 'foo',
    password: 'bar',
    database: 'foodb',
  });

  const createMockConnectionString = () => 'mysql://foo:bar@acme:3306/foodb';

  const createConfig = (connection: any): Config =>
    new ConfigReader({ client: 'mysql2', connection });

  describe('buildMysqlDatabaseConfig', () => {
    it('builds a mysql config', () => {
      const mockConnection = createMockConnection();

      expect(buildMysqlDatabaseConfig(createConfig(mockConnection))).toEqual({
        client: 'mysql2',
        connection: mockConnection,
        useNullAsDefault: true,
      });
    });

    it('builds a connection string config', () => {
      const mockConnectionString = createMockConnectionString();

      expect(
        buildMysqlDatabaseConfig(createConfig(mockConnectionString)),
      ).toEqual({
        client: 'mysql2',
        connection: mockConnectionString,
        useNullAsDefault: true,
      });
    });

    it('overrides the database name', () => {
      const mockConnection = createMockConnection();

      expect(
        buildMysqlDatabaseConfig(createConfig(mockConnection), {
          connection: { database: 'other_db' },
        }),
      ).toEqual({
        client: 'mysql2',
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
        buildMysqlDatabaseConfig(createConfig(mockConnection), {
          connection: { database: 'other_db' },
          pool: { min: 0, max: 7 },
          debug: true,
        }),
      ).toEqual({
        client: 'mysql2',
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
        buildMysqlDatabaseConfig(createConfig(mockConnectionString), {
          connection: { database: 'other_db' },
        }),
      ).toEqual({
        client: 'mysql2',
        connection: {
          ...mockConnection,
          port: 3306,
          database: 'other_db',
        },
        useNullAsDefault: true,
      });
    });
  });

  describe('getMysqlConnectionConfig', () => {
    it('returns the connection object back', () => {
      const mockConnection = createMockConnection();
      const config = createConfig(mockConnection);

      expect(getMysqlConnectionConfig(config)).toEqual(mockConnection);
    });

    it('does not parse the connection string', () => {
      const mockConnection = createMockConnection();
      const config = createConfig(mockConnection);

      expect(getMysqlConnectionConfig(config, true)).toEqual(mockConnection);
    });

    it('automatically parses the connection string', () => {
      const mockConnection = createMockConnection();
      const mockConnectionString = createMockConnectionString();
      const config = createConfig(mockConnectionString);

      expect(getMysqlConnectionConfig(config)).toEqual({
        ...mockConnection,
        port: 3306,
      });
    });

    it('parses the connection string', () => {
      const mockConnection = createMockConnection();
      const mockConnectionString = createMockConnectionString();
      const config = createConfig(mockConnectionString);

      expect(getMysqlConnectionConfig(config, true)).toEqual({
        ...mockConnection,
        port: 3306,
      });
    });
  });

  describe('createMysqlDatabaseClient', () => {
    it('creates a mysql knex instance', () => {
      expect(
        createMysqlDatabaseClient(
          createConfig({
            host: 'acme',
            user: 'foo',
            password: 'bar',
            database: 'foodb',
          }),
        ),
      ).toBeTruthy();
    });
  });

  describe('parseMysqlConnectionString', () => {
    it('parses a connection string uri', () => {
      expect(
        parseMysqlConnectionString(
          'mysql://u:pass@foobar:3307/dbname?ssl=require',
        ),
      ).toEqual({
        host: 'foobar',
        user: 'u',
        password: 'pass',
        port: 3307,
        database: 'dbname',
        ssl: 'require',
      });
    });
  });
});
