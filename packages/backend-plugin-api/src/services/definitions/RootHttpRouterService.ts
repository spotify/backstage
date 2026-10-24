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

import type { Handler } from 'express';
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';

/**
 * Options for root-level WebSocket upgrades. Authentication is the handler's
 * responsibility. Plugins should use the authenticated plugin router instead.
 *
 * @public
 */
export interface RootHttpRouterServiceWebSocketOptions {
  path: string;
  handler(context: {
    request: IncomingMessage;
    socket: Duplex;
    head: Buffer;
  }): void | Promise<void>;
}

/**
 * HTTP route registration for root services.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/root-http-router | service documentation} for more details.
 *
 * @public
 */
export interface RootHttpRouterService {
  /**
   * Registers a handler at the root of the backend router.
   * The path is required and may not be empty.
   */
  use(path: string, handler: Handler): void;

  /**
   * Registers a WebSocket upgrade handler at an exact absolute path. Matching
   * follows {@link HttpRouterService.addWebSocketHandler}.
   *
   * The handler owns authentication, origin checks, and the handshake or
   * forwarding. HTTP middleware and auth policies do not apply.
   */
  addWebSocketHandler(options: RootHttpRouterServiceWebSocketOptions): void;
}
