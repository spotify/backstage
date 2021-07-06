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

import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { getCombinedClusterDetails } from '../cluster-locator';
import { MultiTenantServiceLocator } from '../service-locator/MultiTenantServiceLocator';
import {
  ClusterDetails,
  KubernetesClustersSupplier,
  KubernetesServiceLocator,
  ServiceLocatorMethod,
  CustomResource,
} from '../types/types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
import { KubernetesClientProvider } from './KubernetesClientProvider';
import { KubernetesFanOutHandler } from './KubernetesFanOutHandler';
import { KubernetesClientBasedFetcher } from './KubernetesFetcher';

export interface RouterOptions {
  logger: Logger;
  config: Config;
  clusterSupplier?: KubernetesClustersSupplier;
}

const getServiceLocator = (
  config: Config,
  clusterDetails: ClusterDetails[],
): KubernetesServiceLocator => {
  const serviceLocatorMethod = config.getString(
    'kubernetes.serviceLocatorMethod.type',
  ) as ServiceLocatorMethod;

  switch (serviceLocatorMethod) {
    case 'multiTenant':
      return new MultiTenantServiceLocator(clusterDetails);
    case 'http':
      throw new Error('not implemented');
    default:
      throw new Error(
        `Unsupported kubernetes.clusterLocatorMethod "${serviceLocatorMethod}"`,
      );
  }
};

export const makeRouter = (
  logger: Logger,
  kubernetesFanOutHandler: KubernetesFanOutHandler,
  clusterDetails: ClusterDetails[],
): express.Router => {
  const router = Router();
  router.use(express.json());

  router.post('/services/:serviceId', async (req, res) => {
    const serviceId = req.params.serviceId;
    const requestBody: KubernetesRequestBody = req.body;
    try {
      const response = await kubernetesFanOutHandler.getKubernetesObjectsByEntity(
        requestBody,
      );
      res.json(response);
    } catch (e) {
      logger.error(
        `action=retrieveObjectsByServiceId service=${serviceId}, error=${e}`,
      );
      res.status(500).json({ error: e.message });
    }
  });

  router.get('/clusters', async (_, res) => {
    res.json({
      items: clusterDetails.map(cd => ({
        name: cd.name,
        authProvider: cd.authProvider,
      })),
    });
  });
  return router;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const logger = options.logger;

  logger.info('Initializing Kubernetes backend');

  const customResources: CustomResource[] = (
    options.config.getOptionalConfigArray('kubernetes.customResources') ?? []
  ).map(
    c =>
      ({
        group: c.getString('group'),
        apiVersion: c.getString('apiVersion'),
        plural: c.getString('plural'),
      } as CustomResource),
  );

  logger.info(
    `action=LoadingCustomResources numOfCustomResources=${customResources.length}`,
  );

  const fetcher = new KubernetesClientBasedFetcher({
    kubernetesClientProvider: new KubernetesClientProvider(),
    logger,
  });

  let clusterDetails: ClusterDetails[];

  if (options.clusterSupplier) {
    clusterDetails = await options.clusterSupplier.getClusters();
  } else {
    clusterDetails = await getCombinedClusterDetails(options.config);
  }

  logger.info(
    `action=loadClusterDetails numOfClustersLoaded=${clusterDetails.length}`,
  );

  const serviceLocator = getServiceLocator(options.config, clusterDetails);

  const kubernetesFanOutHandler = new KubernetesFanOutHandler(
    logger,
    fetcher,
    serviceLocator,
    customResources,
  );

  return makeRouter(logger, kubernetesFanOutHandler, clusterDetails);
}
