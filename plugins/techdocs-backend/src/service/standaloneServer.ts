/*
 * Copyright 2020 Spotify AB
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
  DockerContainerRunner,
  SingleHostDiscovery,
  UrlReader,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import {
  DirectoryPreparer,
  Generators,
  Preparers,
  Publisher,
  TechdocsGenerator,
} from '@backstage/techdocs-common';
import Docker from 'dockerode';
import { Server } from 'http';
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
  const logger = options.logger.child({ service: 'techdocs-backend' });
  const config = new ConfigReader({
    techdocs: {
      publisher: {
        type: 'local',
      },
    },
  });
  const discovery = SingleHostDiscovery.fromConfig(config);
  const mockUrlReader: jest.Mocked<UrlReader> = {
    read: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  logger.debug('Creating application...');
  const preparers = new Preparers();
  const directoryPreparer = new DirectoryPreparer(
    config,
    logger,
    mockUrlReader,
  );
  preparers.register('dir', directoryPreparer);

  const dockerClient = new Docker();
  const containerRunner = new DockerContainerRunner({ dockerClient });

  const generators = new Generators();
  const techdocsGenerator = new TechdocsGenerator({
    logger,
    containerRunner,
    config,
  });
  generators.register('techdocs', techdocsGenerator);

  const publisher = await Publisher.fromConfig(config, { logger, discovery });

  logger.debug('Starting application server...');
  const router = await createRouter({
    preparers,
    generators,
    logger,
    publisher,
    config,
    discovery,
  });
  const service = createServiceBuilder(module)
    .enableCors({ origin: 'http://localhost:3000' })
    .addRouter('/techdocs', router);
  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
