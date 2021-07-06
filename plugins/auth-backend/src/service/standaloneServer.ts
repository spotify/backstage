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
  createServiceBuilder,
  loadBackendConfig,
  SingleHostDiscovery,
  useHotMemoize,
} from '@backstage/backend-common';
import { Server } from 'http';
import Knex from 'knex';
import { Logger } from 'winston';
import { createRouter } from './router';

export interface ServerOptions {
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'auth-backend' });
  const config = await loadBackendConfig({ logger, argv: process.argv });
  const discovery = SingleHostDiscovery.fromConfig(config);

  const database = useHotMemoize(module, () => {
    const knex = Knex({
      client: 'sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });
    knex.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
      resource.run('PRAGMA foreign_keys = ON', () => {});
    });
    return knex;
  });

  logger.debug('Starting application server...');
  const router = await createRouter({
    logger,
    config,
    database: {
      async getClient() {
        return database;
      },
    },
    discovery,
  });

  const service = createServiceBuilder(module)
    .enableCors({ origin: 'http://localhost:3000', credentials: true })
    .addRouter('/auth', router);

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}
