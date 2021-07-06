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

import {
  errorHandler,
  notFoundHandler,
  requestLoggingHandler,
} from '@backstage/backend-common';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { Logger } from 'winston';
import { createRouter } from './router';
import { ConfigReader } from '@backstage/config';

export interface ApplicationOptions {
  enableCors: boolean;
  logger: Logger;
}

export async function createStandaloneApplication(
  options: ApplicationOptions,
): Promise<express.Application> {
  const { enableCors, logger } = options;
  const config = new ConfigReader({});
  const app = express();

  app.use(helmet());
  if (enableCors) {
    app.use(cors());
  }
  app.use(compression());
  app.use(express.json());
  app.use(requestLoggingHandler());
  app.use('/', await createRouter({ logger, config }));
  app.use(notFoundHandler());
  app.use(errorHandler());

  return app;
}
