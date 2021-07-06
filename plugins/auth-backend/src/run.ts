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

import { getRootLogger } from '@backstage/backend-common';
import { startStandaloneServer } from './service/standaloneServer';

const logger = getRootLogger();

startStandaloneServer({ logger }).catch(err => {
  logger.error(err);
  process.exit(1);
});

process.on('SIGINT', () => {
  logger.info('CTRL+C pressed; exiting.');
  process.exit(0);
});

module.hot?.accept();
