/*
 * Copyright 2025 The Backstage Authors
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
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { DefaultActionsRegistryService } from './DefaultActionsRegistryService';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';

/**
 * @public
 */
export const actionsRegistryServiceFactory = createServiceFactory({
  service: actionsRegistryServiceRef,
  deps: {
    metadata: coreServices.pluginMetadata,
    httpRouter: coreServices.httpRouter,
    httpAuth: coreServices.httpAuth,
    logger: coreServices.logger,
    auth: coreServices.auth,
    config: coreServices.rootConfig,
    permissions: coreServices.permissions,
    permissionsRegistry: coreServices.permissionsRegistry,
    discovery: coreServices.discovery,
  },
  factory: ({
    metadata,
    httpRouter,
    httpAuth,
    logger,
    auth,
    config,
    permissions,
    permissionsRegistry,
    discovery,
  }) => {
    const actionsRegistryService = DefaultActionsRegistryService.create({
      httpAuth,
      logger,
      auth,
      config,
      metadata,
      permissions,
      permissionsRegistry,
      discovery,
    });

    httpRouter.use(actionsRegistryService.createRouter());

    return actionsRegistryService;
  },
});
