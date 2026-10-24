/*
 * Copyright 2023 The Backstage Authors
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

import express from 'express';
import Router from 'express-promise-router';
import {
  AuthService,
  HttpRouterService,
  LifecycleService,
  LoggerService,
  RootInstanceMetadataService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { IncomingMessage } from 'node:http';
import { SignalManager } from './SignalManager';
import { EventsService } from '@backstage/plugin-events-node';
import { WebSocketServer } from 'ws';
import { Config } from '@backstage/config';

export interface RouterOptions {
  logger: LoggerService;
  events: EventsService;
  httpRouter: HttpRouterService;
  config: Config;
  lifecycle: LifecycleService;
  instanceMetadata: RootInstanceMetadataService;
  userInfo: UserInfoService;
  auth: AuthService;
}

export function createRouter(options: RouterOptions): express.Router {
  const { logger, httpRouter, auth, userInfo, lifecycle } = options;
  const manager = SignalManager.create(options);
  const authenticatedProtocols = new WeakMap<IncomingMessage, string>();
  const server = new WebSocketServer({
    noServer: true,
    clientTracking: false,
    handleProtocols: (_, request) =>
      authenticatedProtocols.get(request) ?? false,
  });
  server.on('error', error => logger.error(`WebSocket server error: ${error}`));
  lifecycle.addShutdownHook(() => {
    server.close();
  });

  httpRouter.addWebSocketHandler({
    path: '/',
    authPolicy: 'user',
    async handler({ request, socket, head, credentials, authProtocol }) {
      if (!auth.isPrincipal(credentials, 'user')) {
        throw new Error('Signals requires user credentials');
      }
      const identity = await userInfo.getUserInfo(credentials);
      if (socket.destroyed) {
        return;
      }
      if (authProtocol) {
        authenticatedProtocols.set(request, authProtocol);
      }
      try {
        server.handleUpgrade(request, socket, head, connection =>
          manager.addConnection(connection, identity),
        );
      } catch (error) {
        logger.error(`Failed to handle WebSocket upgrade: ${error}`);
        socket.end(
          'HTTP/1.1 500 Internal Server Error\r\nConnection: close\r\nContent-Length: 0\r\n\r\n',
          () => socket.destroy(),
        );
      }
    },
  });

  const router = Router();
  router.get('/health', (_, response) => response.json({ status: 'ok' }));
  return router;
}
