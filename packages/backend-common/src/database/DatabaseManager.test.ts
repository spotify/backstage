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
import { ConfigReader } from '@backstage/config';
import { omit } from 'lodash';
import { createDatabaseClient, ensureDatabaseExists } from './connection';
import { DatabaseManager } from './DatabaseManager';

jest.mock('./connection', () => ({
  ...jest.requireActual('./connection'),
  createDatabaseClient: jest.fn(),
  ensureDatabaseExists: jest.fn(),
}));

describe('DatabaseManager', () => {
  // This is similar to the ts-jest `mocked` helper.
  const mocked = (f: Function) => f as jest.Mock;

  afterEach(() => jest.resetAllMocks());

  describe('DatabaseManager.fromConfig', () => {
    it('accesses the backend.database key', () => {
      const config = new ConfigReader({
        backend: {
          database: {
            client: 'pg',
            connection: {
              host: 'localhost',
              user: 'foo',
              password: 'bar',
              database: 'foodb',
            },
          },
        },
      });
      const getConfigSpy = jest.spyOn(config, 'getConfig');
      DatabaseManager.fromConfig(config);

      expect(getConfigSpy).toHaveBeenCalledWith('backend.database');
    });
  });

  describe('DatabaseManager.forPlugin', () => {
    const config = {
      backend: {
        database: {
          client: 'pg',
          prefix: 'test_prefix_',
          connection: {
            host: 'localhost',
            user: 'foo',
            password: 'bar',
            database: 'foodb',
          },
          plugin: {
            testdbname: {
              connection: {
                database: 'database_name_overriden',
              },
            },
            differentclient: {
              client: 'sqlite3',
              connection: {
                filename: 'plugin_with_different_client',
              },
            },
            differentclientconnstring: {
              client: 'sqlite3',
              connection: ':memory:',
            },
            stringoverride: {
              connection: 'postgresql://testuser:testpass@acme:5432/userdbname',
            },
          },
        },
      },
    };
    const manager = DatabaseManager.fromConfig(new ConfigReader(config));

    it('connects to a plugin database using default config', async () => {
      const pluginId = 'pluginwithoutconfig';

      await manager.forPlugin(pluginId).getClient();
      expect(mocked(createDatabaseClient)).toHaveBeenCalledTimes(1);

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      // default config should be passed through to underlying connector
      expect(baseConfig.get()).toMatchObject({
        client: 'pg',
        connection: omit(config.backend.database.connection, ['database']),
      });

      // override using database name generated from pluginId and prefix
      expect(overrides).toMatchObject({
        connection: {
          database: `${config.backend.database.prefix}${pluginId}`,
        },
      });
    });

    it('provides a plugin db which uses components from top level connection string', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'pg',
              connection: 'postgresql://foo:bar@acme:5432/foodb',
            },
          },
        }),
      );

      await testManager.forPlugin('pluginwithoutconfig').getClient();
      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      // parsed connection string **without** db name should be passed through
      expect(baseConfig.get()).toMatchObject({
        connection: {
          host: 'acme',
          user: 'foo',
          password: 'bar',
          port: '5432',
        },
      });

      // we expect a pg database name override with ${prefix} followed by pluginId
      expect(overrides).toHaveProperty(
        'connection.database',
        expect.stringContaining('pluginwithoutconfig'),
      );
    });

    it('uses top level sqlite database filename if plugin config is not present', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'sqlite3',
              connection: 'some-file-path',
            },
          },
        }),
      );

      await testManager.forPlugin('pluginwithoutconfig').getClient();
      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [_, overrides] = mockCalls[0];

      expect(overrides).toHaveProperty(
        'connection.filename',
        expect.stringContaining('some-file-path'),
      );
    });

    it('provides an inmemory sqlite database if top level is also inmemory and plugin config is not present', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'sqlite3',
              connection: ':memory:',
            },
          },
        }),
      );

      await testManager.forPlugin('pluginwithoutconfig').getClient();
      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [_, overrides] = mockCalls[0];

      expect(overrides).toHaveProperty(
        'connection.filename',
        expect.stringContaining(':memory:'),
      );
    });

    it('connects to a plugin database using a specific database name', async () => {
      // testdbname.connection.database is set in config
      await manager.forPlugin('testdbname').getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [_baseConfig, overrides] = mockCalls[0];

      // simple case where only database name is overriden
      expect(overrides).toMatchObject({
        connection: {
          database: 'database_name_overriden',
        },
      });
    });

    it('ensure plugin specific database is created', async () => {
      const pluginId = 'testdbname';
      // testdbname.connection.database is set in config
      await manager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(ensureDatabaseExists).mock.calls.splice(-1);
      const [_, dbname] = mockCalls[0];

      expect(dbname).toEqual(
        config.backend.database.plugin[pluginId].connection.database,
      );
    });

    it('provides different plugins with their own databases', async () => {
      await manager.forPlugin('plugin1').getClient();
      await manager.forPlugin('plugin2').getClient();

      expect(mocked(createDatabaseClient)).toHaveBeenCalledTimes(2);

      const mockCalls = mocked(createDatabaseClient).mock.calls;
      const [plugin1CallArgs, plugin2CallArgs] = mockCalls;

      // database name overrides should be different
      expect(plugin1CallArgs[1].connection.database).not.toEqual(
        plugin2CallArgs[1].connection.database,
      );
    });

    it('uses plugin connection as base if default client is different from plugin client', async () => {
      const pluginId = 'differentclient';
      await manager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, _overrides] = mockCalls[0];

      // plugin connection should be used as base config, client is different
      expect(baseConfig.get()).toMatchObject({
        client: 'sqlite3',
        connection: config.backend.database.plugin[pluginId].connection,
      });
    });

    it('provides database client specific base and override when client set under plugin', async () => {
      const pluginId = 'differentclient';
      await manager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      // plugin client should be sqlite3
      expect(baseConfig.get().client).toEqual('sqlite3');

      // sqlite3 uses 'filename' instead of 'database'
      expect(overrides).toHaveProperty('connection.filename');
    });

    it('provides database client specific base from plugin connection string when client set under plugin', async () => {
      const pluginId = 'differentclientconnstring';
      await manager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      expect(baseConfig.get().client).toEqual('sqlite3');

      expect(overrides).toHaveProperty('connection.filename', ':memory:');
    });

    it('generates a database name override when prefix is not explicitly set', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'pg',
              connection: {
                host: 'localhost',
                user: 'foo',
                password: 'bar',
                database: 'foodb',
              },
            },
          },
        }),
      );

      await testManager.forPlugin('testplugin').getClient();
      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [_baseConfig, overrides] = mockCalls[0];

      expect(overrides).toHaveProperty(
        'connection.database',
        expect.stringContaining('backstage_plugin_'),
      );
    });

    it('uses values from plugin connection string if top level client should be used', async () => {
      const pluginId = 'stringoverride';
      await manager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      // plugin client should be pg
      expect(baseConfig.get().client).toEqual('pg');

      expect(overrides).toHaveProperty(
        'connection.database',
        expect.stringContaining('userdbname'),
      );
    });
  });
});
