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

import { Config } from '@backstage/config';
import compression from 'compression';
import cors from 'cors';
import express, { Router } from 'express';
import helmet from 'helmet';
import * as http from 'http';
import stoppable from 'stoppable';
import { Logger } from 'winston';
import { useHotCleanup } from '../../hot';
import { getRootLogger } from '../../logging';
import {
  errorHandler,
  notFoundHandler,
  requestLoggingHandler,
} from '../../middleware';
import { ServiceBuilder } from '../types';
import {
  CspOptions,
  HttpsSettings,
  readBaseOptions,
  readCorsOptions,
  readCspOptions,
  readHttpsSettings,
} from './config';
import { createHttpServer, createHttpsServer } from './hostFactory';

export const DEFAULT_PORT = 7000;
// '' is express default, which listens to all interfaces
const DEFAULT_HOST = '';
// taken from the helmet source code - don't seem to be exported
const DEFAULT_CSP = {
  'default-src': ["'self'"],
  'base-uri': ["'self'"],
  'block-all-mixed-content': [],
  'font-src': ["'self'", 'https:', 'data:'],
  'frame-ancestors': ["'self'"],
  'img-src': ["'self'", 'data:'],
  'object-src': ["'none'"],
  'script-src': ["'self'", "'unsafe-eval'"],
  'script-src-attr': ["'none'"],
  'style-src': ["'self'", 'https:', "'unsafe-inline'"],
  'upgrade-insecure-requests': [] as string[],
};

export class ServiceBuilderImpl implements ServiceBuilder {
  private port: number | undefined;
  private host: string | undefined;
  private logger: Logger | undefined;
  private corsOptions: cors.CorsOptions | undefined;
  private cspOptions: Record<string, string[] | false> | undefined;
  private httpsSettings: HttpsSettings | undefined;
  private routers: [string, Router][];
  // Reference to the module where builder is created - needed for hot module
  // reloading
  private module: NodeModule;

  constructor(moduleRef: NodeModule) {
    this.routers = [];
    this.module = moduleRef;
  }

  loadConfig(config: Config): ServiceBuilder {
    const backendConfig = config.getOptionalConfig('backend');
    if (!backendConfig) {
      return this;
    }

    const baseOptions = readBaseOptions(backendConfig);
    if (baseOptions.listenPort) {
      this.port =
        typeof baseOptions.listenPort === 'string'
          ? parseInt(baseOptions.listenPort, 10)
          : baseOptions.listenPort;
    }
    if (baseOptions.listenHost) {
      this.host = baseOptions.listenHost;
    }

    const corsOptions = readCorsOptions(backendConfig);
    if (corsOptions) {
      this.corsOptions = corsOptions;
    }

    const cspOptions = readCspOptions(backendConfig);
    if (cspOptions) {
      this.cspOptions = cspOptions;
    }

    const httpsSettings = readHttpsSettings(backendConfig);
    if (httpsSettings) {
      this.httpsSettings = httpsSettings;
    }

    return this;
  }

  setPort(port: number): ServiceBuilder {
    this.port = port;
    return this;
  }

  setHost(host: string): ServiceBuilder {
    this.host = host;
    return this;
  }

  setLogger(logger: Logger): ServiceBuilder {
    this.logger = logger;
    return this;
  }

  setHttpsSettings(settings: HttpsSettings): ServiceBuilder {
    this.httpsSettings = settings;
    return this;
  }

  enableCors(options: cors.CorsOptions): ServiceBuilder {
    this.corsOptions = options;
    return this;
  }

  setCsp(options: CspOptions): ServiceBuilder {
    this.cspOptions = options;
    return this;
  }

  addRouter(root: string, router: Router): ServiceBuilder {
    this.routers.push([root, router]);
    return this;
  }

  async start(): Promise<http.Server> {
    const app = express();
    const {
      port,
      host,
      logger,
      corsOptions,
      httpsSettings,
      helmetOptions,
    } = this.getOptions();

    app.use(helmet(helmetOptions));
    if (corsOptions) {
      app.use(cors(corsOptions));
    }
    app.use(compression());
    app.use(requestLoggingHandler(logger));
    for (const [root, route] of this.routers) {
      app.use(root, route);
    }
    app.use(notFoundHandler());
    app.use(errorHandler());

    const server: http.Server = httpsSettings
      ? await createHttpsServer(app, httpsSettings, logger)
      : createHttpServer(app, logger);

    return new Promise((resolve, reject) => {
      app.on('error', e => {
        logger.error(`Failed to start up on port ${port}, ${e}`);
        reject(e);
      });

      const stoppableServer = stoppable(
        server.listen(port, host, () => {
          logger.info(`Listening on ${host}:${port}`);
        }),
        0,
      );

      useHotCleanup(this.module, () =>
        stoppableServer.stop((e: any) => {
          if (e) console.error(e);
        }),
      );

      resolve(stoppableServer);
    });
  }

  private getOptions() {
    return {
      port: this.port ?? DEFAULT_PORT,
      host: this.host ?? DEFAULT_HOST,
      logger: this.logger ?? getRootLogger(),
      corsOptions: this.corsOptions,
      httpsSettings: this.httpsSettings,
      helmetOptions: {
        contentSecurityPolicy: {
          directives: applyCspDirectives(this.cspOptions),
        },
      },
    };
  }
}

export function applyCspDirectives(
  directives: Record<string, string[] | false> | undefined,
): CspOptions | undefined {
  const result: CspOptions = { ...DEFAULT_CSP };

  if (directives) {
    for (const [key, value] of Object.entries(directives)) {
      if (value === false) {
        delete result[key];
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}
