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
import { createDatabaseClient, ensureDatabaseExists } from './connection';
import { SingleConnectionDatabaseManager } from './SingleConnection';

jest.mock('./connection', () => ({
  ...jest.requireActual('./connection'),
  createDatabaseClient: jest.fn(),
  ensureDatabaseExists: jest.fn(),
}));

describe('SingleConnectionDatabaseManager', () => {
  const defaultConfigOptions = {
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
  };
  const defaultConfig = () => new ConfigReader(defaultConfigOptions);

  // This is similar to the ts-jest `mocked` helper.
  const mocked = (f: Function) => f as jest.Mock;

  afterEach(() => jest.resetAllMocks());

  describe('SingleConnectionDatabaseManager.fromConfig', () => {
    it('accesses the backend.database key', () => {
      const config = defaultConfig();
      const getConfig = jest.spyOn(config, 'getConfig');

      SingleConnectionDatabaseManager.fromConfig(config);

      expect(getConfig.mock.calls[0][0]).toEqual('backend.database');
    });
  });

  describe('SingleConnectionDatabaseManager.forPlugin', () => {
    const manager = SingleConnectionDatabaseManager.fromConfig(defaultConfig());

    it('connects to a database scoped to the plugin', async () => {
      const pluginId = 'test1';
      await manager.forPlugin(pluginId).getClient();

      expect(mocked(createDatabaseClient)).toHaveBeenCalledTimes(1);

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const callArgs = mockCalls[0];
      expect(callArgs[1].connection.database).toEqual(
        `backstage_plugin_${pluginId}`,
      );
    });

    it('provides different plugins different databases', async () => {
      const plugin1Id = 'test1';
      const plugin2Id = 'test2';
      await manager.forPlugin(plugin1Id).getClient();
      await manager.forPlugin(plugin2Id).getClient();

      expect(mocked(createDatabaseClient)).toHaveBeenCalledTimes(2);

      const mockCalls = mocked(createDatabaseClient).mock.calls;
      const plugin1CallArgs = mockCalls[0];
      const plugin2CallArgs = mockCalls[1];
      expect(plugin1CallArgs[1].connection.database).not.toEqual(
        plugin2CallArgs[1].connection.database,
      );
    });

    it('ensure plugin database is created', async () => {
      await manager.forPlugin('test').getClient();
      const mockCalls = mocked(ensureDatabaseExists).mock.calls.splice(-1);
      const [_, database] = mockCalls[0];

      expect(database).toEqual('backstage_plugin_test');
    });
  });
});
