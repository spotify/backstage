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
import type { BackstageCredentials } from './AuthService';

/**
 * Handles an authenticated WebSocket upgrade or forwards it upstream.
 * The request retains its full URL.
 *
 * The handler must take ownership of the socket or close it before resolving.
 * Express middleware and path-based HTTP auth policies do not apply.
 *
 * @public
 */
export type HttpRouterServiceWebSocketHandler = (
  context: HttpRouterServiceWebSocketContext,
) => void | Promise<void>;

/**
 * Request, transport, and credentials available to a WebSocket upgrade handler.
 *
 * @public
 */
export interface HttpRouterServiceWebSocketContext {
  request: IncomingMessage;
  socket: Duplex;
  head: Buffer;
  credentials: BackstageCredentials;
  /** The offered protocol value that authenticated the caller, if any. */
  authProtocol?: string;
}

/**
 * Options for {@link HttpRouterService.addWebSocketHandler}.
 *
 * @public
 */
export interface HttpRouterServiceWebSocketOptions {
  /** An exact path relative to the plugin base URL. Use `/` for the base URL. */
  path: string;
  handler: HttpRouterServiceWebSocketHandler;
  /**
   * Defaults to `authenticated`, accepting user and service tokens.
   * `user` accepts only full user tokens. `user-cookie` also accepts limited
   * user tokens and the Backstage auth cookie. Cookie requests require an
   * Origin matching the app URL or configured CORS origins.
   * `unauthenticated` supplies none credentials without authenticating tokens.
   */
  authPolicy?: 'authenticated' | 'user' | 'user-cookie' | 'unauthenticated';
}

/**
 * Options for {@link HttpRouterService.addAuthPolicy}.
 *
 * @public
 */
export interface HttpRouterServiceAuthPolicy {
  path: string;
  allow: 'unauthenticated' | 'user-cookie';
}

/**
 * Allows plugins to register HTTP routes.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/http-router | service documentation} for more details.
 *
 * @public
 */
export interface HttpRouterService {
  /**
   * Registers an Express request handler under the plugin's base router. This
   * typically makes its base path `/api/<plugin-id>`.
   */
  use(handler: Handler): void;

  /**
   * Registers a WebSocket upgrade handler at an exact plugin-relative path.
   * Paths must start with `/`. Matching is case-sensitive, ignores the query
   * string, and treats a trailing slash as significant. Patterns are not supported.
   *
   * The handler receives the raw upgrade request, socket, and buffered data.
   * The framework authenticates before invoking the handler. The handler owns
   * the handshake or forwarding, including protocol selection. HTTP middleware
   * and path-based auth policies do not apply.
   * The framework destroys upgraded sockets when the backend shuts down.
   */
  addWebSocketHandler(options: HttpRouterServiceWebSocketOptions): void;

  /**
   * Adds an auth policy to the router. This is used to allow unauthenticated or
   * cookie based access to parts of a plugin's API.
   *
   * @remarks
   *
   * The paths given follow the same pattern as the routers given to the `use`
   * method, that is, they are relative to the plugin's base URL, and can
   * contain placeholders.
   *
   * @example
   *
   * ```ts
   * http.addAuthPolicy({
   *   path: '/static/:id',
   *   allow: 'user-cookie',
   * });
   * ```
   *
   * This allows limited access tokens via cookies on the
   * `/api/<plugin-id>/static/*` paths, but not unauthenticated access.
   */
  addAuthPolicy(policy: HttpRouterServiceAuthPolicy): void;
}
