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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { resolve as resolvePath } from 'path';
import request from 'supertest';
import { createRouter } from './router';

jest.mock('../lib/config', () => ({
  injectConfig: jest.fn(),
  readConfigs: jest.fn(),
}));

global.__non_webpack_require__ = {
  /* eslint-disable-next-line no-restricted-syntax */
  resolve: () => resolvePath(__dirname, '__fixtures__/app-dir/package.json'),
};

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      config: new ConfigReader({}),
      appPackageName: 'example-app',
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns index.html', async () => {
    const response = await request(app).get('/index.html');

    expect(response.status).toBe(200);
    expect(response.text.trim()).toBe('this is index.html');
  });

  it('returns other.html', async () => {
    const response = await request(app).get('/other.html');

    expect(response.status).toBe(200);
    expect(response.text.trim()).toBe('this is other.html');
  });

  it('returns index.html if missing', async () => {
    const response = await request(app).get('/missing.html');

    expect(response.status).toBe(200);
    expect(response.text.trim()).toBe('this is index.html');
  });

  it.each(['/index.html', '/other.html', '/missing.html'])(
    'returns %s with no-store Cache-Control header',
    async file => {
      const response = await request(app).get(file);
      expect(response.header['cache-control']).toBe('no-store, max-age=0');
    },
  );

  it.each(['/static/main.txt'])(
    'returns %s with default Cache-Control header',
    async file => {
      const response = await request(app).get(file);
      expect(response.header['cache-control']).toBe('public, max-age=0');
    },
  );
});

describe('createRouter with static fallback handler', () => {
  it('uses static fallback handler', async () => {
    const staticFallbackHandler = Router();

    staticFallbackHandler.get('/test.txt', (_req, res) => {
      res.end('this is test.txt');
    });

    const router = await createRouter({
      logger: getVoidLogger(),
      config: new ConfigReader({}),
      appPackageName: 'example-app',
      staticFallbackHandler,
    });

    const app = express().use(router);

    const response1 = await request(app).get('/static/main.txt');
    expect(response1.status).toBe(200);
    expect(response1.text.trim()).toBe('this is main.txt');

    const response2 = await request(app).get('/static/test.txt');
    expect(response2.status).toBe(200);
    expect(response2.text.trim()).toBe('this is test.txt');

    const response3 = await request(app).get('/static/missing.txt');
    expect(response3.status).toBe(404);
  });
});
