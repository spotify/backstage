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

import { ConfigReader } from '@backstage/config';
import cors from 'cors';
import { Router, RequestHandler } from 'express';
import { Server } from 'http';
import { Logger } from 'winston';
import { HttpsSettings } from './lib/config';

export type ServiceBuilder = {
  /**
   * Sets the service parameters based on configuration.
   *
   * @param config The configuration to read
   */
  loadConfig(config: ConfigReader): ServiceBuilder;

  /**
   * Sets the port to listen on.
   *
   * If no port is specified, the service will first look for an environment
   * variable named PORT and use that if present, otherwise it picks a default
   * port (7000).
   *
   * @param port The port to listen on
   */
  setPort(port: number): ServiceBuilder;

  /**
   * Sets the host to listen on.
   *
   * '' is express default, which listens to all interfaces.
   *
   * @param host The host to listen on
   */
  setHost(host: string): ServiceBuilder;

  /**
   * Sets the logger to use for service-specific logging.
   *
   * If no logger is given, the default root logger is used.
   *
   * @param logger A winston logger
   */
  setLogger(logger: Logger): ServiceBuilder;

  /**
   * Enables CORS handling using the given settings.
   *
   * If this method is not called, the resulting service will not have any
   * built in CORS handling.
   *
   * @param options Standard CORS options
   */
  enableCors(options: cors.CorsOptions): ServiceBuilder;

  /**
   * Configure self-signed certificate generation options.
   *
   * If this method is not called, the resulting service will use sensible defaults
   *
   * @param options Standard certificate options
   */
  setHttpsSettings(settings: HttpsSettings): ServiceBuilder;

  /**
   * Adds a router (similar to the express .use call) to the service.
   *
   * @param root The root URL to bind to (e.g. "/api/function1")
   * @param router An express router
   */
  addRouter(root: string, router: Router | RequestHandler): ServiceBuilder;

  /**
   * Starts the server using the given settings.
   */
  start(): Promise<Server>;
};
