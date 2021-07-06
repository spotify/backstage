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
import * as winston from 'winston';
import request from 'supertest';
import { createStatusCheckRouter } from './createStatusCheckRouter';

describe('createStatusCheckRouter', () => {
  const logger = winston.createLogger();

  it('gives status 200 when using default path', async () => {
    const app = express();
    app.use('', await createStatusCheckRouter({ logger }));

    const response = await request(app).get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.text).toBe(JSON.stringify({ status: 'ok' }));
  });

  it('gives status 200 when using custom path', async () => {
    const app = express();
    app.use('', await createStatusCheckRouter({ logger, path: '/ready' }));

    const response = await request(app).get('/ready');

    expect(response.status).toBe(200);
    expect(response.text).toBe(JSON.stringify({ status: 'ok' }));
  });

  it('gives status 500 when status check throws an error', async () => {
    const app = express();
    const statusCheck = () => {
      throw Error('error!');
    };
    app.use('', await createStatusCheckRouter({ logger, statusCheck }));

    const response = await request(app).get('/healthcheck');

    expect(response.status).toBe(500);
  });
});
