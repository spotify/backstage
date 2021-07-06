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

import { Logger } from 'winston';
import Router from 'express-promise-router';
import express from 'express';
import { errorHandler, statusCheckHandler, StatusCheck } from '../middleware';

export interface StatusCheckRouterOptions {
  logger: Logger;
  path?: string;
  statusCheck?: StatusCheck;
}

export async function createStatusCheckRouter(
  options: StatusCheckRouterOptions,
): Promise<express.Router> {
  const router = Router();
  const { path = '/healthcheck', statusCheck } = options;

  router.use(path, await statusCheckHandler({ statusCheck }));
  router.use(errorHandler());

  return router;
}
