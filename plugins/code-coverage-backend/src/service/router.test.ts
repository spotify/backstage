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

import express from 'express';
import request from 'supertest';
import {
  getVoidLogger,
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  DatabaseManager,
  UrlReaders,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { createRouter } from './router';

function createDatabase(): PluginDatabaseManager {
  return DatabaseManager.fromConfig(
    new ConfigReader({
      backend: {
        database: {
          client: 'sqlite3',
          connection: ':memory:',
        },
      },
    }),
  ).forPlugin('code-coverage');
}

const testDiscovery: jest.Mocked<PluginEndpointDiscovery> = {
  getBaseUrl: jest
    .fn()
    .mockResolvedValue('http://localhost:7000/api/code-coverage'),
  getExternalBaseUrl: jest.fn(),
};
const mockUrlReader = UrlReaders.default({
  logger: getVoidLogger(),
  config: new ConfigReader({}),
});

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      config: new ConfigReader({}),
      database: createDatabase(),
      discovery: testDiscovery,
      urlReader: mockUrlReader,
      logger: getVoidLogger(),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
