import {
  DockerContainerRunner,
  SingleHostDiscovery,
} from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import {
  CookieCutter,
  CreateReactAppTemplater,
  createRouter,
  Preparers,
  Publishers,
  Templaters,
} from '@backstage/plugin-scaffolder-backend';
import Docker from 'dockerode';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
  database,
  reader,
}: PluginEnvironment): Promise<Router> {
  const dockerClient = new Docker();
  const containerRunner = new DockerContainerRunner({ dockerClient });

  const cookiecutterTemplater = new CookieCutter({ containerRunner });
  const craTemplater = new CreateReactAppTemplater({ containerRunner });
  const templaters = new Templaters();

  templaters.register('cookiecutter', cookiecutterTemplater);
  templaters.register('cra', craTemplater);

  const preparers = await Preparers.fromConfig(config, { logger });
  const publishers = await Publishers.fromConfig(config, { logger });

  const discovery = SingleHostDiscovery.fromConfig(config);
  const catalogClient = new CatalogClient({ discoveryApi: discovery });

  return await createRouter({
    preparers,
    templaters,
    publishers,
    logger,
    config,
    database,
    catalogClient,
    reader,
  });
}
