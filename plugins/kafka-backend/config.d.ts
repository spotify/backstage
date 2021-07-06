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
  kafka?: {
    /**
     * Client ID used to Backstage uses to identify when connecting to the Kafka cluster.
     */
    clientId: string;
    clusters: Array<{
      name: string;
      /**
       * List of brokers in the Kafka cluster to connect to.
       */
      brokers: string[];
      /**
       * Optional SSL connection parameters to connect to the cluster. Passed directly to Node tls.connect.
       * See https://nodejs.org/dist/latest-v8.x/docs/api/tls.html#tls_tls_createsecurecontext_options
       */
      ssl?:
        | {
            ca: string[];
            /** @visibility secret */
            key: string;
            cert: string;
          }
        | boolean;
      /**
       * Optional SASL connection parameters.
       */
      sasl?: {
        mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
        username: string;
        /** @visibility secret */
        password: string;
      };
    }>;
  };
}
