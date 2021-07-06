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

export interface Config {
  /**
   * A list of forwarding-proxies. Each key is a route to match,
   * below the prefix that the proxy plugin is mounted on. It must
   * start with a '/'.
   */
  proxy?: {
    [key: string]:
      | string
      | {
          /**
           * Target of the proxy. Url string to be parsed with the url module.
           */
          target: string;
          /**
           * Object with extra headers to be added to target requests.
           */
          headers?: { [key: string]: string };
          /**
           * Changes the origin of the host header to the target URL. Default: true.
           */
          changeOrigin?: boolean;
          /**
           * Rewrite target's url path. Object-keys will be used as RegExp to match paths.
           * If pathRewrite is not specified, it is set to a single rewrite that removes the entire prefix and route.
           */
          pathRewrite?: { [regexp: string]: string };
          /**
           * Limit the forwarded HTTP methods, for example allowedMethods: ['GET'] to enforce read-only access.
           */
          allowedMethods?: string[];
          /**
           * Limit the forwarded HTTP methods. By default, only the headers that are considered safe for CORS
           * and headers that are set by the proxy will be forwarded.
           */
          allowedHeaders?: string[];
        };
  };
}
