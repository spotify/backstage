/*
 * Copyright 2022 The Backstage Authors
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

import { Handler } from 'express';
import PromiseRouter from 'express-promise-router';
import {
  coreServices,
  createServiceFactory,
  HttpRouterServiceAuthPolicy,
  HttpRouterServiceWebSocketOptions,
} from '@backstage/backend-plugin-api';
import {
  createAuthIntegrationRouter,
  createCookieAuthRefreshMiddleware,
  createCredentialsBarrier,
  createLifecycleMiddleware,
} from './http';
import { MiddlewareFactory } from '../rootHttpRouter';
import { authenticateWebSocket } from './http/authenticateWebSocket';
import { createRateLimitMiddleware } from './http/createRateLimitMiddleware.ts';

/**
 * HTTP route registration for plugins.
 *
 * See {@link @backstage/code-plugin-api#HttpRouterService}
 * and {@link https://backstage.io/docs/backend-system/core-services/http-router | the service docs}
 * for more information.
 *
 * @public
 */
export const httpRouterServiceFactory = createServiceFactory({
  service: coreServices.httpRouter,
  initialization: 'always',
  deps: {
    plugin: coreServices.pluginMetadata,
    config: coreServices.rootConfig,
    lifecycle: coreServices.lifecycle,
    rootHttpRouter: coreServices.rootHttpRouter,
    auth: coreServices.auth,
    httpAuth: coreServices.httpAuth,
    logger: coreServices.logger,
  },
  async factory({
    auth,
    httpAuth,
    config,
    plugin,
    rootHttpRouter,
    lifecycle,
    logger,
  }) {
    const router = PromiseRouter();

    router.use(createRateLimitMiddleware({ pluginId: plugin.getId(), config }));

    rootHttpRouter.use(`/api/${plugin.getId()}`, router);

    const credentialsBarrier = createCredentialsBarrier({
      httpAuth,
      config,
    });

    router.use(createAuthIntegrationRouter({ auth }));
    router.use(createLifecycleMiddleware({ config, lifecycle }));
    router.use(credentialsBarrier.middleware);
    router.use(createCookieAuthRefreshMiddleware({ auth, httpAuth }));

    const pluginRoutes = PromiseRouter();
    router.use(pluginRoutes);

    const middleware = MiddlewareFactory.create({ config, logger });
    router.use(middleware.error());

    return {
      use(handler: Handler): void {
        pluginRoutes.use(handler);
      },
      addWebSocketHandler({
        path,
        handler,
        authPolicy = 'authenticated',
      }: HttpRouterServiceWebSocketOptions): void {
        if (!path.startsWith('/')) {
          throw new Error('WebSocket path must start with /');
        }
        rootHttpRouter.addWebSocketHandler({
          path: `/api/${plugin.getId()}${path === '/' ? '' : path}`,
          async handler({ request, socket, head }) {
            let context;
            try {
              context = await authenticateWebSocket({
                auth,
                config,
                request,
                authPolicy,
              });
            } catch (error) {
              const status =
                error.name === 'NotAllowedError'
                  ? '403 Forbidden'
                  : '401 Unauthorized';
              socket.end(
                `HTTP/1.1 ${status}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`,
                () => socket.destroy(),
              );
              return;
            }
            if (!socket.destroyed) {
              await handler({ request, socket, head, ...context });
            }
          },
        });
      },
      addAuthPolicy(policy: HttpRouterServiceAuthPolicy): void {
        credentialsBarrier.addAuthPolicy(policy);
      },
    };
  },
});
