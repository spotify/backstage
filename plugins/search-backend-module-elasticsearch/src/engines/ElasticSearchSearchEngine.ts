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

import {
  IndexableDocument,
  IndexableResult,
  IndexableResultSet,
  SearchQuery,
} from '@backstage/plugin-search-common';
import { SearchEngine } from '@backstage/plugin-search-backend-node';
import { isEmpty, isNumber, isNaN as nan } from 'lodash';

import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { RequestSigner } from 'aws4';
import { Config } from '@backstage/config';
import {
  ElasticSearchClientOptions,
  OpenSearchElasticSearchClientOptions,
} from './ElasticSearchClientOptions';
import { ElasticSearchClientWrapper } from './ElasticSearchClientWrapper';
import { ElasticSearchCustomIndexTemplate } from './types';
import { ElasticSearchSearchEngineIndexer } from './ElasticSearchSearchEngineIndexer';
import { MissingIndexError } from '@backstage/plugin-search-backend-node';
import esb from 'elastic-builder';
import { randomUUID as uuid } from 'node:crypto';
import {
  AwsCredentialProvider,
  DefaultAwsCredentialsManager,
} from '@backstage/integration-aws-node';
import { LoggerService } from '@backstage/backend-plugin-api';
import { ElasticSearchAuthProvider } from '../auth';
import {
  createOpenSearchAuthTransport,
  createElasticSearchAuthTransport,
} from './ElasticSearchAuthTransport';

export type { ElasticSearchClientOptions };

/**
 * Search query that the elasticsearch engine understands.
 * @public
 */
export type ElasticSearchConcreteQuery = {
  documentTypes?: string[];
  elasticSearchQuery: Object;
  pageSize: number;
};

/**
 * Options available for the Elasticsearch specific query translator.
 * @public
 */
export type ElasticSearchQueryTranslatorOptions = {
  highlightOptions?: ElasticSearchHighlightConfig;
  queryOptions?: ElasticSearchQueryConfig;
};

/**
 * Elasticsearch specific query translator.
 * @public
 */
export type ElasticSearchQueryTranslator = (
  query: SearchQuery,
  options?: ElasticSearchQueryTranslatorOptions,
) => ElasticSearchConcreteQuery;

/**
 * Options for instantiate ElasticSearchSearchEngine
 * @public
 */
export type ElasticSearchOptions = {
  logger: LoggerService;
  config: Config;
  aliasPostfix?: string;
  indexPrefix?: string;
  translator?: ElasticSearchQueryTranslator;
  /**
   * An optional authentication provider for dynamic authentication.
   *
   * @remarks
   *
   * When provided, this auth provider will be used to inject authentication
   * headers into each request to Elasticsearch/OpenSearch. This is useful
   * for scenarios requiring dynamic tokens (e.g., bearer tokens with rotation).
   *
   * The auth provider takes precedence over static authentication configured
   * in app-config.yaml.
   */
  authProvider?: ElasticSearchAuthProvider;
};

/**
 * @public
 */
export type ElasticSearchHighlightOptions = {
  fragmentDelimiter?: string;
  fragmentSize?: number;
  numFragments?: number;
};

/**
 * @public
 */
export type ElasticSearchQueryConfig = {
  fuzziness?: string | number;
  prefixLength?: number;
};

/**
 * @public
 */
export type ElasticSearchHighlightConfig = {
  fragmentDelimiter: string;
  fragmentSize: number;
  numFragments: number;
  preTag: string;
  postTag: string;
};

type ElasticSearchResult = {
  _index: string;
  _type: string;
  _score: number;
  _source: IndexableDocument;
  highlight?: {
    [field: string]: string[];
  };
};

function isBlank(str: string) {
  return (isEmpty(str) && !isNumber(str)) || nan(str);
}

const DEFAULT_INDEXER_BATCH_SIZE = 1000;
const DEFAULT_INDEXER_BATCH_DELAY = 0;

/**
 * @public
 */
export class ElasticSearchSearchEngine implements SearchEngine {
  private readonly elasticSearchClientWrapper: ElasticSearchClientWrapper;
  private readonly highlightOptions: ElasticSearchHighlightConfig;
  private readonly queryOptions?: ElasticSearchQueryConfig;

  private readonly elasticSearchClientOptions: ElasticSearchClientOptions;
  private readonly aliasPostfix: string;
  private readonly indexPrefix: string;
  private readonly logger: LoggerService;
  private readonly batchSize: number;
  private readonly batchDelay: number;
  private readonly batchKeyField?: string;

  constructor(
    elasticSearchClientOptions: ElasticSearchClientOptions,
    aliasPostfix: string,
    indexPrefix: string,
    logger: LoggerService,
    batchSize: number,
    batchKeyField?: string,
    highlightOptions?: ElasticSearchHighlightOptions,
    queryOptions?: ElasticSearchQueryConfig,
    batchDelay: number = DEFAULT_INDEXER_BATCH_DELAY,
  ) {
    this.elasticSearchClientOptions = elasticSearchClientOptions;
    this.aliasPostfix = aliasPostfix;
    this.indexPrefix = indexPrefix;
    this.logger = logger;
    this.batchSize = batchSize;
    this.batchDelay = batchDelay;
    this.batchKeyField = batchKeyField;
    this.elasticSearchClientWrapper =
      ElasticSearchClientWrapper.fromClientOptions(elasticSearchClientOptions);
    const uuidTag = uuid();
    this.highlightOptions = {
      preTag: `<${uuidTag}>`,
      postTag: `</${uuidTag}>`,
      fragmentSize: 1000,
      numFragments: 1,
      fragmentDelimiter: ' ... ',
      ...highlightOptions,
    };
    this.queryOptions = queryOptions;
  }

  static async fromConfig(options: ElasticSearchOptions) {
    const {
      logger,
      config,
      aliasPostfix = `search`,
      indexPrefix = ``,
      translator,
      authProvider,
    } = options;
    const credentialProvider = DefaultAwsCredentialsManager.fromConfig(config);
    const esConfig = config.getConfig('search.elasticsearch');
    const awsAccountId = esConfig.getOptionalString('accountId');
    const clientOptions = await this.createElasticSearchClientOptions(
      await credentialProvider?.getCredentialProvider(
        awsAccountId ? { accountId: awsAccountId } : undefined,
      ),
      esConfig,
      authProvider,
    );
    if (clientOptions.provider === 'elastic') {
      logger.info('Initializing Elastic.co ElasticSearch search engine.');
    } else if (clientOptions.provider === 'aws') {
      logger.info('Initializing AWS OpenSearch search engine.');
    } else if (clientOptions.provider === 'opensearch') {
      logger.info('Initializing OpenSearch search engine.');
    } else {
      logger.info('Initializing ElasticSearch search engine.');
    }

    const engine = new ElasticSearchSearchEngine(
      clientOptions,
      aliasPostfix,
      indexPrefix,
      logger,
      config.getOptionalNumber('search.elasticsearch.batchSize') ??
        DEFAULT_INDEXER_BATCH_SIZE,
      config.getOptionalString('search.elasticsearch.batchKeyField'),
      config.getOptional<ElasticSearchHighlightOptions>(
        'search.elasticsearch.highlightOptions',
      ),
      config.getOptional<ElasticSearchQueryConfig>(
        'search.elasticsearch.queryOptions',
      ),
      config.getOptionalNumber('search.elasticsearch.batchDelay') ??
        DEFAULT_INDEXER_BATCH_DELAY,
    );

    for (const indexTemplate of this.readIndexTemplateConfig(
      config.getConfig('search.elasticsearch'),
    )) {
      await engine.setIndexTemplate(indexTemplate);
    }

    if (translator) {
      await engine.setTranslator(translator);
    }

    return engine;
  }

  /**
   * Create a custom search client from the derived search client configuration.
   * This need not be the same client that the engine uses internally.
   *
   * @example Instantiate an instance of an Elasticsearch client.
   *
   * ```ts
   * import { isOpenSearchCompatible } from '@backstage/plugin-search-backend-module-elasticsearch';
   * import { Client } from '@elastic/elasticsearch';
   *
   * const client = searchEngine.newClient<Client>(options => {
   *   // This type guard ensures options are compatible with either OpenSearch
   *   // or Elasticsearch client constructors.
   *   if (!isOpenSearchCompatible(options)) {
   *     return new Client(options);
   *   }
   *   throw new Error('Incompatible options provided');
   * });
   * ```
   */
  newClient<T>(create: (options: ElasticSearchClientOptions) => T): T {
    return create(this.elasticSearchClientOptions);
  }

  protected translator(
    query: SearchQuery,
    options?: ElasticSearchQueryTranslatorOptions,
  ): ElasticSearchConcreteQuery {
    const { term, filters = {}, types, pageCursor } = query;

    const filter = Object.entries(filters)
      .filter(([_, value]) => Boolean(value))
      .map(([key, value]: [key: string, value: any]) => {
        if (['string', 'number', 'boolean'].includes(typeof value)) {
          // Use exact matching for string datatype fields
          const keyword = typeof value === 'string' ? `${key}.keyword` : key;
          return esb.matchQuery(keyword, value.toString());
        }
        if (Array.isArray(value)) {
          return esb
            .boolQuery()
            .should(value.map(it => esb.matchQuery(key, it.toString())));
        }
        this.logger.error('Failed to query, unrecognized filter type', {
          key,
          value,
        });
        throw new Error(
          'Failed to add filters to query. Unrecognized filter type',
        );
      });

    const esbQueries = [];
    // https://regex101.com/r/Lr0MqS/1
    const phraseTerms = term.match(/"[^"]*"/g);

    if (isBlank(term)) {
      const esbQuery = esb.matchAllQuery();
      esbQueries.push(esbQuery);
    } else if (phraseTerms && phraseTerms.length > 0) {
      let restTerm = term;
      for (const phraseTerm of phraseTerms) {
        restTerm = restTerm.replace(phraseTerm, '');
        const esbPhraseQuery = esb
          .multiMatchQuery(['*'], phraseTerm.replace(/"/g, ''))
          .type('phrase');
        esbQueries.push(esbPhraseQuery);
      }
      if (restTerm?.length > 0) {
        const esbRestQuery = esb
          .multiMatchQuery(['*'], restTerm.trim())
          .fuzziness(options?.queryOptions?.fuzziness ?? 'auto')
          .prefixLength(options?.queryOptions?.prefixLength ?? 0);
        esbQueries.push(esbRestQuery);
      }
    } else {
      const esbQuery = esb
        .multiMatchQuery(['*'], term)
        .fuzziness(options?.queryOptions?.fuzziness ?? 'auto')
        .prefixLength(options?.queryOptions?.prefixLength ?? 0);
      esbQueries.push(esbQuery);
    }

    const pageSize = query.pageLimit || 25;
    const { page } = decodePageCursor(pageCursor);

    let esbRequestBodySearch = esb
      .requestBodySearch()
      .query(esb.boolQuery().filter(filter).should(esbQueries))
      .from(page * pageSize)
      .size(pageSize);

    if (options?.highlightOptions) {
      esbRequestBodySearch = esbRequestBodySearch.highlight(
        esb
          .highlight('*')
          .numberOfFragments(options.highlightOptions.numFragments as number)
          .fragmentSize(options.highlightOptions.fragmentSize as number)
          .preTags(options.highlightOptions.preTag)
          .postTags(options.highlightOptions.postTag),
      );
    }

    return {
      elasticSearchQuery: esbRequestBodySearch.toJSON(),
      documentTypes: types,
      pageSize,
    };
  }

  setTranslator(translator: ElasticSearchQueryTranslator) {
    this.translator = translator;
  }

  async setIndexTemplate(template: ElasticSearchCustomIndexTemplate) {
    try {
      await this.elasticSearchClientWrapper.putIndexTemplate(template);
      this.logger.info('Custom index template set');
    } catch (error) {
      this.logger.error(`Unable to set custom index template: ${error}`);
    }
  }

  async getIndexer(type: string) {
    const alias = this.constructSearchAlias(type);
    const indexerLogger = this.logger.child({ documentType: type });

    const indexer = new ElasticSearchSearchEngineIndexer({
      type,
      indexPrefix: this.indexPrefix,
      indexSeparator: this.indexSeparator,
      alias,
      elasticSearchClientWrapper: this.elasticSearchClientWrapper,
      logger: indexerLogger,
      batchSize: this.batchSize,
      batchDelay: this.batchDelay,
      batchKeyField: this.batchKeyField,
      skipRefresh:
        (
          this
            .elasticSearchClientOptions as OpenSearchElasticSearchClientOptions
        )?.service === 'aoss',
    });

    // Attempt cleanup upon failure.
    // todo(@backstage/search-maintainers): Consider introducing a more
    // formal mechanism for handling such errors in BatchSearchEngineIndexer and
    // replacing this handler with it. See: #17291
    indexer.on('error', async e => {
      indexerLogger.error(`Failed to index documents for type ${type}`, e);
      let cleanupError: Error | undefined;

      // In some cases, a failure may have occurred before the indexer was able
      // to complete initialization. Try up to 5 times to remove the dangling
      // index.
      await new Promise<void>(async done => {
        const maxAttempts = 5;
        let attempts = 0;

        while (attempts < maxAttempts) {
          try {
            await this.elasticSearchClientWrapper.deleteIndex({
              index: indexer.indexName,
            });

            attempts = maxAttempts;
            cleanupError = undefined;
            done();
          } catch (err) {
            cleanupError = err;
          }

          // Wait 1 second between retries.
          await new Promise(okay => setTimeout(okay, 1000));

          attempts++;
        }
        done();
      });

      if (cleanupError) {
        indexerLogger.error(
          `Unable to clean up elastic index ${indexer.indexName}: ${cleanupError}`,
        );
      } else {
        indexerLogger.info(
          `Removed partial, failed index ${indexer.indexName}`,
        );
      }
    });

    return indexer;
  }

  async query(query: SearchQuery): Promise<IndexableResultSet> {
    const { elasticSearchQuery, documentTypes, pageSize } = this.translator(
      query,
      {
        highlightOptions: this.highlightOptions,
        queryOptions: this.queryOptions,
      },
    );
    if (documentTypes && documentTypes.length === 0) {
      return {
        results: [],
        nextPageCursor: undefined,
        previousPageCursor: undefined,
        numberOfResults: undefined,
      };
    }
    const queryIndices = documentTypes
      ? documentTypes.map(it => this.constructSearchAlias(it))
      : this.constructSearchAlias('*');
    try {
      const result = await this.elasticSearchClientWrapper.search({
        index: queryIndices,
        body: elasticSearchQuery,
      });
      const { page } = decodePageCursor(query.pageCursor);
      const hasNextPage = result.body.hits.total.value > (page + 1) * pageSize;
      const hasPreviousPage = page > 0;
      const nextPageCursor = hasNextPage
        ? encodePageCursor({ page: page + 1 })
        : undefined;
      const previousPageCursor = hasPreviousPage
        ? encodePageCursor({ page: page - 1 })
        : undefined;

      return {
        results: result.body.hits.hits.map(
          (d: ElasticSearchResult, index: number) => {
            const resultItem: IndexableResult = {
              type: this.getTypeFromIndex(d._index),
              document: d._source,
              rank: pageSize * page + index + 1,
            };

            if (d.highlight) {
              resultItem.highlight = {
                preTag: this.highlightOptions.preTag as string,
                postTag: this.highlightOptions.postTag as string,
                fields: Object.fromEntries(
                  Object.entries(d.highlight).map(([field, fragments]) => [
                    field,
                    fragments.join(this.highlightOptions.fragmentDelimiter),
                  ]),
                ),
              };
            }

            return resultItem;
          },
        ),
        nextPageCursor,
        previousPageCursor,
        numberOfResults: result.body.hits.total.value,
      };
    } catch (error) {
      const errorBody = error.meta?.body?.error;
      // The index can also go missing mid-query, nested under a search_phase_execution_exception
      if (
        errorBody?.type === 'index_not_found_exception' ||
        errorBody?.caused_by?.type === 'index_not_found_exception'
      ) {
        throw new MissingIndexError(
          `Missing index for ${queryIndices}. This means there are no documents to search through.`,
          error,
        );
      }
      this.logger.error(
        `Failed to query documents for indices ${queryIndices}`,
        error,
      );
      throw new Error(
        `Failed to query documents for indices ${queryIndices}: ${error?.message}`,
        { cause: error },
      );
    }
  }

  private readonly indexSeparator = '-index__';

  private getTypeFromIndex(index: string) {
    return index
      .substring(this.indexPrefix.length)
      .split(this.indexSeparator)[0];
  }

  private constructSearchAlias(type: string) {
    const postFix = this.aliasPostfix ? `__${this.aliasPostfix}` : '';
    return `${this.indexPrefix}${type}${postFix}`;
  }

  private static async createElasticSearchClientOptions(
    credentialProvider: AwsCredentialProvider,
    config?: Config,
    authProvider?: ElasticSearchAuthProvider,
  ): Promise<ElasticSearchClientOptions> {
    if (!config) {
      throw new Error('No elastic search config found');
    }
    const clientOptionsConfig = config.getOptionalConfig('clientOptions');
    const sslConfig = clientOptionsConfig?.getOptionalConfig('ssl');

    if (config.getOptionalString('provider') === 'elastic') {
      const authConfig = authProvider ? undefined : config.getConfig('auth');
      return {
        provider: 'elastic',
        cloud: {
          id: config.getString('cloudId'),
        },
        // When using authProvider, we inject auth via custom Transport, not static auth
        ...(authConfig
          ? {
              auth: {
                username: authConfig.getString('username'),
                password: authConfig.getString('password'),
              },
            }
          : {}),
        ...(authProvider
          ? {
              Transport: createElasticSearchAuthTransport(authProvider),
            }
          : {}),
        ...(sslConfig
          ? {
              ssl: {
                rejectUnauthorized:
                  sslConfig?.getOptionalBoolean('rejectUnauthorized'),
              },
            }
          : {}),
      };
    }
    if (config.getOptionalString('provider') === 'aws') {
      // AWS provider uses SigV4 signing; authProvider is not applicable here
      if (authProvider) {
        throw new Error(
          'Custom auth provider is not supported with AWS provider. AWS uses SigV4 signing.',
        );
      }
      const requestSigner = new RequestSigner(config.getString('node'));
      const service =
        config.getOptionalString('service') ?? requestSigner.service;
      if (service !== 'es' && service !== 'aoss')
        throw new Error(`Unrecognized service type: ${service}`);
      return {
        provider: 'aws',
        node: config.getString('node'),
        region: config.getOptionalString('region'),
        service,
        ...(sslConfig
          ? {
              ssl: {
                rejectUnauthorized:
                  sslConfig?.getOptionalBoolean('rejectUnauthorized'),
              },
            }
          : {}),
        ...AwsSigv4Signer({
          region: config.getOptionalString('region') ?? requestSigner.region, // for backwards compatibility
          service: service,
          getCredentials: async () =>
            await credentialProvider.sdkCredentialProvider(),
        }),
      };
    }
    if (config.getOptionalString('provider') === 'opensearch') {
      const authConfig = authProvider
        ? undefined
        : config.getOptionalConfig('auth');
      return {
        provider: 'opensearch',
        node: config.getString('node'),
        // When using authProvider, we inject auth via custom Transport, not static auth
        ...(authConfig
          ? {
              auth: {
                username: authConfig.getString('username'),
                password: authConfig.getString('password'),
              },
            }
          : {}),
        ...(authProvider
          ? {
              Transport: createOpenSearchAuthTransport(authProvider),
            }
          : {}),
        ...(sslConfig
          ? {
              ssl: {
                rejectUnauthorized:
                  sslConfig?.getOptionalBoolean('rejectUnauthorized'),
              },
            }
          : {}),
      };
    }
    // Default provider (standard Elasticsearch)
    const authConfig = authProvider
      ? undefined
      : config.getOptionalConfig('auth');
    const auth =
      authConfig &&
      (authConfig.has('apiKey')
        ? {
            apiKey: authConfig.getString('apiKey'),
          }
        : {
            username: authConfig.getString('username'),
            password: authConfig.getString('password'),
          });
    return {
      node: config.getString('node'),
      ...(auth ? { auth } : {}),
      ...(authProvider
        ? {
            Transport: createElasticSearchAuthTransport(authProvider),
          }
        : {}),
      ...(sslConfig
        ? {
            ssl: {
              rejectUnauthorized:
                sslConfig?.getOptionalBoolean('rejectUnauthorized'),
            },
          }
        : {}),
    };
  }

  private static readIndexTemplateConfig(
    config: Config,
  ): ElasticSearchCustomIndexTemplate[] {
    return (
      config.getOptionalConfigArray('indexTemplates')?.map(templateConfig => {
        const bodyConfig = templateConfig.getConfig('body');
        return {
          name: templateConfig.getString('name'),
          body: {
            index_patterns: bodyConfig.getStringArray('index_patterns'),
            composed_of: bodyConfig.getOptionalStringArray('composed_of'),
            template: bodyConfig.getOptionalConfig('template')?.get(),
          },
        };
      }) ?? []
    );
  }
}

/**
 * @public
 */
export function decodePageCursor(pageCursor?: string): { page: number } {
  if (!pageCursor) {
    return { page: 0 };
  }

  return {
    page: Number(Buffer.from(pageCursor, 'base64').toString('utf-8')),
  };
}

export function encodePageCursor({ page }: { page: number }): string {
  return Buffer.from(`${page}`, 'utf-8').toString('base64');
}
