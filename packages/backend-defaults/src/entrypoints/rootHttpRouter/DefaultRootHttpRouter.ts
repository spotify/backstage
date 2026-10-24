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

import {
  RootHttpRouterServiceWebSocketOptions,
  LoggerService,
  RootHttpRouterService,
} from '@backstage/backend-plugin-api';
import type { Server } from 'node:http';
import type { Duplex } from 'node:stream';
import { Handler, Router } from 'express';
import trimEnd from 'lodash/trimEnd';

function normalizePath(path: string): string {
  return `${trimEnd(path, '/')}/`.toLowerCase();
}

/**
 * Options for the {@link DefaultRootHttpRouter} class.
 *
 * @public
 */
export interface DefaultRootHttpRouterOptions {
  /**
   * The path to forward all unmatched requests to. Defaults to '/api/app' if
   * not given. Disables index path behavior if false is given.
   */
  indexPath?: string | false;
}

/**
 * The default implementation of the {@link @backstage/backend-plugin-api#RootHttpRouterService} interface for
 * {@link @backstage/backend-plugin-api#coreServices.rootHttpRouter}.
 *
 * @public
 */
export class DefaultRootHttpRouter implements RootHttpRouterService {
  #indexPath?: string;
  #webSocketHandlers = new Map<
    string,
    RootHttpRouterServiceWebSocketOptions['handler']
  >();
  #webSockets = new Set<Duplex>();
  #webSocketServer?: Server;
  #webSocketLogger?: LoggerService;
  #webSocketsStopped = false;

  #router = Router();
  #namedRoutes = Router();
  #indexRouter = Router();
  #existingPaths = new Array<string>();

  static create(options?: DefaultRootHttpRouterOptions) {
    let indexPath;
    if (options?.indexPath === false) {
      indexPath = undefined;
    } else if (options?.indexPath === undefined) {
      indexPath = '/api/app';
    } else if (options?.indexPath === '') {
      throw new Error('indexPath option may not be an empty string');
    } else {
      indexPath = options.indexPath;
    }
    return new DefaultRootHttpRouter(indexPath);
  }

  private constructor(indexPath?: string) {
    this.#indexPath = indexPath;
    this.#router.use(this.#namedRoutes);

    // Any request with a /api/ prefix will skip the index router, even if no named router matches
    this.#router.use('/api/', (_req, _res, next) => {
      next('router');
    });

    if (this.#indexPath) {
      this.#router.use(this.#indexRouter);
    }
  }

  use(path: string, handler: Handler) {
    if (path.match(/^[/\s]*$/)) {
      throw new Error(`Root router path may not be empty`);
    }
    const conflictingPath = this.#findConflictingPath(path);
    if (conflictingPath) {
      throw new Error(
        `Path ${path} conflicts with the existing path ${conflictingPath}`,
      );
    }
    this.#existingPaths.push(path);
    this.#namedRoutes.use(path, handler);

    if (this.#indexPath === path) {
      this.#indexRouter.use(handler);
    }
  }

  addWebSocketHandler({
    path,
    handler,
  }: RootHttpRouterServiceWebSocketOptions): void {
    if (
      !path.startsWith('/') ||
      /[?#\\]/.test(path) ||
      new URL(path, 'http://localhost').pathname !== path
    ) {
      throw new Error(
        'WebSocket path must be an absolute pathname without a query or fragment',
      );
    }
    if (this.#webSocketsStopped) {
      throw new Error('Cannot register WebSocket handlers after shutdown');
    }
    if (this.#webSocketHandlers.has(path)) {
      throw new Error(`WebSocket handler already registered for ${path}`);
    }
    if (!this.#webSocketServer) {
      throw new Error('WebSocket server is not attached');
    }
    if (this.#webSocketHandlers.size === 0) {
      if (this.#webSocketServer.listenerCount('upgrade') > 0) {
        throw new Error(
          'WebSocket routes cannot be combined with server-level upgrade listeners',
        );
      }
      this.#webSocketServer.on('upgrade', (request, socket, head) => {
        // Node does not handle rejected promises from event listeners.
        const onError = (error: Error) => {
          this.#webSocketLogger?.warn('WebSocket upgrade failed', error);
          socket.destroy();
        };
        socket.on('error', onError);
        socket.once('close', () => {
          this.#webSockets.delete(socket);
          socket.off('error', onError);
        });
        this.#webSockets.add(socket);
        if (this.#webSocketsStopped) {
          socket.destroy();
          return;
        }
        const pathName = request.url?.split('?')[0];
        const matchedHandler =
          pathName && this.#webSocketHandlers.get(pathName);
        if (
          request.headers.upgrade?.toLowerCase() !== 'websocket' ||
          !matchedHandler
        ) {
          socket.end(
            'HTTP/1.1 404 Not Found\r\nConnection: close\r\nContent-Length: 0\r\n\r\n',
            () => socket.destroy(),
          );
          return;
        }
        Promise.resolve()
          .then(() => matchedHandler({ request, socket, head }))
          .catch(onError);
      });
    }
    this.#webSocketHandlers.set(path, handler);
  }

  /**
   * Attaches the HTTP server before registering WebSocket handlers. The router
   * installs its upgrade listener when the first handler is registered.
   */
  attachWebSocketServer(server: Server, logger: LoggerService): void {
    if (this.#webSocketServer) {
      throw new Error('WebSocket server is already attached');
    }
    this.#webSocketServer = server;
    this.#webSocketLogger = logger;
  }

  /**
   * Stops accepting upgrades and destroys tracked sockets before the HTTP
   * server is closed.
   */
  closeWebSockets(): void {
    this.#webSocketsStopped = true;
    for (const socket of this.#webSockets) {
      socket.destroy();
    }
    this.#webSockets.clear();
  }

  handler(): Handler {
    return this.#router;
  }

  #findConflictingPath(newPath: string): string | undefined {
    const normalizedNewPath = normalizePath(newPath);
    for (const path of this.#existingPaths) {
      const normalizedPath = normalizePath(path);
      if (normalizedPath.startsWith(normalizedNewPath)) {
        return path;
      }
      if (normalizedNewPath.startsWith(normalizedPath)) {
        return path;
      }
    }
    return undefined;
  }
}
