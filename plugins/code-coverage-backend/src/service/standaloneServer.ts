/*
 * Copyright 2021 The Backstage Authors
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
  UrlReaders,
  useHotMemoize,
} from '@backstage/backend-common';
import { Server } from 'http';
import knexFactory from 'knex';
import { Logger } from 'winston';
import { createRouter } from './router';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'code-coverage-backend' });
  const config = await loadBackendConfig({ logger, argv: process.argv });

  const db = useHotMemoize(module, () => {
    const knex = knexFactory({
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
    database: { getClient: async () => db },
    config,
    discovery: SingleHostDiscovery.fromConfig(config),
    urlReader: UrlReaders.default({ logger, config }),
    logger,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/code-coverage', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
