/*
 * Copyright 2021 The Backstage Authors
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
  /** Configuration options for the search plugin */
  search?: {
    /**
     * Options for ElasticSearch
     */
    elasticsearch?: {
      /**
       * Prefix to be used for all index creation. Value will be put in front of the index as is.
       */
      indexPrefix?: string;
      /**
       * Batch size for elastic search indexing tasks. Defaults to 1000.
       */
      batchSize?: number;
      /**
       * Time to wait, in milliseconds, after each batch has been indexed and
       * before the next batch is accepted. Spacing batches out lowers the peak
       * CPU usage of collation at the cost of a longer total indexing time.
       *
       * Defaults to 0 (no delay).
       */
      batchDelay?: number;
      /**
       * Defines the name of the field in each document that will be used to identify documents during a batch upload.
       * If not provided, a custom ID will be generated for each document.
       */
      batchKeyField?: string;
      /**
       * Options for configuring highlight settings
       * See https://www.elastic.co/guide/en/elasticsearch/reference/8.19/highlighting.html
       */
      highlightOptions?: {
        /**
         * The size of the highlighted fragment in characters. Defaults to 1000.
         */
        fragmentSize?: number;
        /**
         * Number of result fragments to extract. Fragments will be concatenated with `fragmentDelimiter`. Defaults to 1.
         */
        numFragments?: number;
        /**
         * Delimiter string used to concatenate fragments. Defaults to " ... ".
         */
        fragmentDelimiter?: string;
      };
      queryOptions?: {
        /**
         * Fuzziness allows you to define the maximum Levenshtein distance for fuzzy queries,
         * which determines how many single-character edits (insertions, deletions, substitutions)
         * are allowed for a term to be considered a match.
         *
         * - 'AUTO': Automatically determines the fuzziness level based on the length of the term.
         *           This is the default and widely accepted standard.
         * - number: Specifies a fixed fuzziness level. For example, a value of 1 allows for one edit.
         *
         * Example:
         * - For a term "apple" with fuzziness set to 1, queries like "aple" or "apply" would match.
         */

        fuzziness?: 'AUTO' | number;
        /**
         * Minimum number of characters that must match exactly at the beginning of the query. Defaults to 0.
         */
        prefixLength?: number;
      };

      /** Elasticsearch specific index template bodies */
      indexTemplates?: Array<{
        name: string;
        body: {
          /**
           * Array of wildcard (*) expressions used to match the names of data streams and indices during creation.
           */
          index_patterns: string[];

          /**
           * An ordered list of component template names.
           * Component templates are merged in the order specified,
           * meaning that the last component template specified has the highest precedence.
           */
          composed_of?: string[];

          /**
           * See available properties of template
           * https://www.elastic.co/guide/en/elasticsearch/reference/8.19/indices-put-template.html#put-index-template-api-request-body
           */
          template?: {
            [key: string]: unknown;
          };
        };
      }>;

      /** Miscellaneous options for the client */
      clientOptions?: {
        ssl?: {
          /**
           * If true the server will reject any connection which is not
           * authorized with the list of supplied CAs.
           * @default true
           */
          rejectUnauthorized?: boolean;
        };
      };
    } & (
      | {
          // elastic = Elastic.co ElasticSearch provider
          provider: 'elastic';

          /**
           * Elastic.co CloudID
           * See: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-connecting.html#authentication
           */
          cloudId: string;

          auth: {
            username: string;

            /**
             * @visibility secret
             */
            password: string;
          };
        }

      /**
       *  AWS = Amazon Elasticsearch Service provider
       *
       *  Authentication is handled using the default AWS credentials provider chain
       */
      | {
          provider: 'aws';

          /**
           * Node configuration.
           * URL AWS ES endpoint to connect to.
           * Eg. https://my-es-cluster.eu-west-1.es.amazonaws.com
           */
          node: string;

          /**
           * The AWS region.
           * Only needed if using a custom DNS record.
           */
          region?: string;

          /**
           * The AWS service used for request signature.
           * Either 'es' for "Managed Clusters" or 'aoss' for "Serverless".
           * Only needed if using a custom DNS record.
           */
          service?: 'es' | 'aoss';
        }

      /**
       * Standard ElasticSearch
       *
       * Includes self-hosted clusters and others that provide direct connection via an endpoint
       * and authentication method (see possible authentication options below)
       */
      | {
          /**
           * Node configuration.
           * URL/URLS to ElasticSearch node to connect to.
           * Either direct URL like 'https://localhost:9200' or with credentials like 'https://username:password@localhost:9200'
           */
          node: string | string[];

          /**
           * Authentication credentials for ElasticSearch
           * If both ApiKey/Bearer token and username+password is provided, tokens take precedence
           */
          auth?:
            | {
                username: string;

                /**
                 * @visibility secret
                 */
                password: string;
              }
            | {
                /**
                 * Base64 Encoded API key to be used to connect to the cluster.
                 * See: https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html
                 *
                 * @visibility secret
                 */
                apiKey: string;
              };
        }

      /**
       *  AWS = In house hosting Open Search
       */
      | {
          provider: 'opensearch';
          /**
           * Node configuration.
           * URL/URLS to OpenSearch node to connect to.
           * Either direct URL like 'https://localhost:9200' or with credentials like 'https://username:password@localhost:9200'
           */
          node: string | string[];

          /**
           * Authentication credentials for OpenSearch
           * If both ApiKey/Bearer token and username+password is provided, tokens take precedence
           */
          auth?:
            | {
                username: string;

                /**
                 * @visibility secret
                 */
                password: string;
              }
            | {
                /**
                 * @visibility secret
                 */
                apiKey: string;
              };
        }
    );
  };
}
