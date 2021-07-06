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
  UrlReaders,
  useHotMemoize,
} from '@backstage/backend-common';
import { Server } from 'http';
import { Logger } from 'winston';
import { DatabaseManager } from '../database';
import { CatalogBuilder } from './CatalogBuilder';
import { createRouter } from './router';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'catalog-backend' });
  const config = await loadBackendConfig({ logger, argv: process.argv });
  const reader = UrlReaders.default({ logger, config });
  const db = useHotMemoize(module, () =>
    DatabaseManager.createInMemoryDatabaseConnection(),
  );

  logger.debug('Creating application...');
  const builder = new CatalogBuilder({
    logger,
    database: { getClient: () => db },
    config,
    reader,
  });
  const {
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
  } = await builder.build();

  logger.debug('Starting application server...');
  const router = await createRouter({
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    logger,
    config,
  });
  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/catalog', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }
  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
