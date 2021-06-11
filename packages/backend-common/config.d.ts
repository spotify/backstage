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

export interface Config {
  app: {
    baseUrl: string; // defined in core, but repeated here without doc
  };

  backend: {
    baseUrl: string; // defined in core, but repeated here without doc

    /** Address that the backend should listen to. */
    listen:
      | string
      | {
          /** Address of the interface that the backend should bind to. */
          address?: string;
          /** Port that the backend should listen to. */
          port?: string | number;
        };

    /**
     * HTTPS configuration for the backend. If omitted the backend will serve HTTP.
     *
     * Setting this to `true` will cause self-signed certificates to be generated, which
     * can be useful for local development or other non-production scenarios.
     */
    https?:
      | true
      | {
          /** Certificate configuration */
          certificate?: {
            /** PEM encoded certificate. Use $file to load in a file */
            cert: string;
            /**
             * PEM encoded certificate key. Use $file to load in a file.
             * @visibility secret
             */
            key: string;
          };
        };

    /** Database connection configuration, select database type using the `client` field */
    database:
      | {
          client: 'sqlite3';
          connection: ':memory:' | string | { filename: string };
        }
      | {
          client: 'pg';
          /**
           * PostgreSQL connection string or knex configuration object.
           * @secret
           */
          connection: string | object;
        };

    /** Cache connection configuration, select cache type using the `store` field */
    cache?:
      | {
          store: 'memory';
        }
      | {
          store: 'memcache';
          /**
           * A memcache connection string in the form `user:pass@host:port`.
           * @secret
           */
          connection: string;
        };

    cors?: {
      origin?: string | string[];
      methods?: string | string[];
      allowedHeaders?: string | string[];
      exposedHeaders?: string | string[];
      credentials?: boolean;
      maxAge?: number;
      preflightContinue?: boolean;
      optionsSuccessStatus?: number;
    };

    /**
     * Configuration related to URL reading, used for example for reading catalog info
     * files, scaffolder templates, and techdocs content.
     */
    reading?: {
      /**
       * A list of targets to allow outgoing requests to. Users will be able to make
       * requests on behalf of the backend to the targets that are allowed by this list.
       */
      allow?: Array<{
        /**
         * A host to allow outgoing requests to, being either a full host or
         * a subdomain wildcard pattern with a leading `*`. For example `example.com`
         * and `*.example.com` are valid values, `prod.*.example.com` is not.
         * The host may also contain a port, for example `example.com:8080`.
         */
        host: string;
      }>;
    };

    /**
     * Content Security Policy options.
     *
     * The keys are the plain policy ID, e.g. "upgrade-insecure-requests". The
     * values are on the format that the helmet library expects them, as an
     * array of strings. There is also the special value false, which means to
     * remove the default value that Backstage puts in place for that policy.
     */
    csp?: { [policyId: string]: string[] | false };
  };
}
