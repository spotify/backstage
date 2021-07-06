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
import { statusCheckHandler } from './statusCheckHandler';

describe('statusCheckHandler', () => {
  it('gives status 200 when using default', async () => {
    const app = express();
    app.use('/healthcheck', await statusCheckHandler());

    const response = await request(app).get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.text).toBe(JSON.stringify({ status: 'ok' }));
  });

  it('gives status 200 when status function returns true', async () => {
    const app = express();
    const status = { foo: 'bar' };
    const statusCheck = () => Promise.resolve(status);
    app.use('/healthcheck', await statusCheckHandler({ statusCheck }));

    const response = await request(app).get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.text).toBe(JSON.stringify(status));
  });

  it('gives status 500 when status check throws an error', async () => {
    const app = express();
    const statusCheck = () => {
      throw Error('error!');
    };
    app.use('/healthcheck', await statusCheckHandler({ statusCheck }));

    const response = await request(app).get('/healthcheck');

    expect(response.status).toBe(500);
  });
});
