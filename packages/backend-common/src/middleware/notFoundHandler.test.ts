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
import { notFoundHandler } from './notFoundHandler';

describe('notFoundHandler', () => {
  it('handles only missing routes', async () => {
    const app = express();
    app.use('/exists', (_, res) => res.status(200).send());
    app.use(notFoundHandler());

    const existsResponse = await request(app).get('/exists');
    const doesNotExistResponse = await request(app).get('/doesNotExist');

    expect(existsResponse.status).toBe(200);
    expect(doesNotExistResponse.status).toBe(404);
  });
});
