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
import * as winston from 'winston';
import { requestLoggingHandler } from './requestLoggingHandler';

describe('requestLoggingHandler', () => {
  it('emits logs for each request', async () => {
    const logger = winston.createLogger();
    jest.spyOn(logger, 'info').mockReturnValue(logger);

    const app = express();
    app.use(requestLoggingHandler(logger));
    app.use('/exists1', (_, res) => res.status(200).send());
    app.use('/exists2', (_, res) => res.status(201).send());

    const r = request(app);
    await r.get('/exists1');
    await r.get('/exists2');

    expect(logger.info).toHaveBeenCalledTimes(2);
    expect(logger.info).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('200'),
    );
    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('201'),
    );
  });
});
