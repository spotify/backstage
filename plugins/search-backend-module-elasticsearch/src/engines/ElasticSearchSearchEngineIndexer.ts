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

import { BatchSearchEngineIndexer } from '@backstage/plugin-search-backend-node';
import { ElasticSearchClientWrapper } from './ElasticSearchClientWrapper';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { Readable } from 'node:stream';
import { LoggerService } from '@backstage/backend-plugin-api';

/**
 * Options for instantiate ElasticSearchSearchEngineIndexer
 * @public
 */
export type ElasticSearchSearchEngineIndexerOptions = {
  type: string;
  indexPrefix: string;
  indexSeparator: string;
  alias: string;
  logger: LoggerService;
  elasticSearchClientWrapper: ElasticSearchClientWrapper;
  batchSize: number;
  batchDelay?: number;
  batchKeyField?: string;
  skipRefresh?: boolean;
};

function duration(startTimestamp: [number, number]): string {
  const delta = process.hrtime(startTimestamp);
  const seconds = delta[0] + delta[1] / 1e9;
  return `${seconds.toFixed(1)}s`;
}

/**
 * Elasticsearch specific search engine indexer.
 * @public
 */
export class ElasticSearchSearchEngineIndexer extends BatchSearchEngineIndexer {
  private processed: number = 0;
  private hasExistingIndices: boolean = false;
  private removableIndices: string[] = [];

  private readonly startTimestamp: [number, number];
  private readonly type: string;
  public readonly indexName: string;
  private readonly indexPrefix: string;
  private readonly indexSeparator: string;
  private readonly alias: string;
  private readonly logger: LoggerService;
  private readonly sourceStream: Readable;
  private readonly elasticSearchClientWrapper: ElasticSearchClientWrapper;
  private configuredBatchSize: number;
  private bulkResult: Promise<any>;
  private bulkClientError?: Error;

  constructor(options: ElasticSearchSearchEngineIndexerOptions) {
    super({ batchSize: options.batchSize, batchDelay: options.batchDelay });
    this.configuredBatchSize = options.batchSize;
    this.logger = options.logger.child({ documentType: options.type });
    this.startTimestamp = process.hrtime();
    this.type = options.type;
    this.indexPrefix = options.indexPrefix;
    this.indexSeparator = options.indexSeparator;
    this.indexName = this.constructIndexName(`${Date.now()}`);
    this.alias = options.alias;
    this.elasticSearchClientWrapper = options.elasticSearchClientWrapper;

    // The ES client bulk helper supports stream-based indexing, but we have to
    // supply the stream directly to it at instantiation-time. We can't supply
    // this class itself, so instead, we create this inline stream instead.
    this.sourceStream = new Readable({ objectMode: true });
    this.sourceStream._read = () => {};

    // eslint-disable-next-line consistent-this
    const that = this;

    // Keep a reference to the ES Bulk helper so that we can know when all
    // documents have been successfully written to ES.
    this.bulkResult = this.elasticSearchClientWrapper.bulk({
      datasource: this.sourceStream,
      onDocument(doc) {
        that.processed++;
        return {
          index: { _index: that.indexName },
          ...(options.batchKeyField && doc[options.batchKeyField]
            ? { _id: doc[options.batchKeyField] }
            : {}),
        };
      },
      refreshOnCompletion:
        options.skipRefresh !== true ? that.indexName : false,
    });

    // Safely catch errors thrown by the bulk helper client, e.g. HTTP timeouts
    this.bulkResult.catch(e => {
      this.bulkClientError = e;
    });
  }

  async initialize(): Promise<void> {
    this.logger.info(`Started indexing documents for index ${this.type}`);

    const indices = await this.elasticSearchClientWrapper.listIndices({
      index: this.constructIndexName('*'),
    });

    for (const [key, details] of Object.entries(
      indices.body as Record<string, { aliases?: Record<string, unknown> }>,
    )) {
      this.hasExistingIndices = true;
      // Keep the index currently behind the alias so that in-flight queries
      // can complete; it will be removed by the next indexing run instead.
      if (details?.aliases?.[this.alias]) {
        continue;
      }
      this.removableIndices.push(key);
    }

    await this.elasticSearchClientWrapper.createIndex({
      index: this.indexName,
    });
  }

  async index(documents: IndexableDocument[]): Promise<void> {
    await this.isReady();
    documents.forEach(document => {
      this.sourceStream.push(document);
    });
  }

  async finalize(): Promise<void> {
    // Wait for all documents to be processed.
    await this.isReady();

    // Close off the underlying stream connected to ES, indicating that no more
    // documents will be written.
    this.sourceStream.push(null);

    // Wait for the bulk helper to finish processing.
    const result = await this.bulkResult;

    // Warn that no documents were indexed, early return so that alias swapping
    // does not occur, and clean up the empty index we just created.
    if (this.processed === 0) {
      this.logger.warn(
        `Index for ${this.indexName} of ${this.type} was not ${
          this.hasExistingIndices ? 'replaced' : 'created'
        }: indexer received 0 documents`,
      );
      try {
        await this.elasticSearchClientWrapper.deleteIndex({
          index: this.indexName,
        });
      } catch (error) {
        this.logger.error(`Unable to clean up elastic index: ${error}`);
      }
      return;
    }

    // Rotate main alias upon completion. Apply permanent secondary alias so
    // stale indices can be referenced for deletion in case initial attempt
    // fails. Allow errors to bubble up so that we can clean up the created index.
    this.logger.info(
      `Indexing completed for index ${this.indexName} of ${
        this.type
      } in ${duration(this.startTimestamp)}`,
      result,
    );
    await this.elasticSearchClientWrapper.updateAliases({
      actions: [
        {
          remove: { index: this.constructIndexName('*'), alias: this.alias },
        },
        {
          add: { index: this.indexName, alias: this.alias },
        },
      ].filter(Boolean),
    });

    // If any indices are removable, remove them. Do not bubble up this error,
    // as doing so would delete the now aliased index. Log instead.
    if (this.removableIndices.length) {
      this.logger.info('Removing stale search indices', {
        removableIndices: this.removableIndices,
      });

      // Split the array into chunks of up to 50 indices to handle the case
      // where we need to delete a lot of stalled indices
      const chunks = this.removableIndices.reduce(
        (resultArray, item, index) => {
          const chunkIndex = Math.floor(index / 50);

          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
          }

          resultArray[chunkIndex].push(item);

          return resultArray;
        },
        [] as string[][],
      );

      // Call deleteIndex for each chunk
      for (const chunk of chunks) {
        try {
          await this.elasticSearchClientWrapper.deleteIndex({
            index: chunk,
          });
        } catch (e) {
          this.logger.warn(`Failed to remove stale search indices: ${e}`);
        }
      }
    }
  }

  /**
   * Ensures that the number of documents sent over the wire to ES matches the
   * number of documents this stream has received so far. This helps manage
   * backpressure in other parts of the indexing pipeline.
   */
  private isReady(): Promise<void> {
    // Early exit if the underlying ES client encountered an error.
    if (this.bulkClientError) {
      return Promise.reject(this.bulkClientError);
    }

    // Optimization: if the stream that ES reads from has fewer docs queued
    // than the configured batch size, continue early to allow more docs to be
    // queued
    if (this.sourceStream.readableLength < this.configuredBatchSize) {
      return Promise.resolve();
    }

    // Otherwise, continue periodically checking the stream queue to see if
    // ES has consumed the documents and continue when it's ready for more.
    return new Promise((isReady, abort) => {
      let streamLengthChecks = 0;
      const interval = setInterval(() => {
        streamLengthChecks++;

        if (this.sourceStream.readableLength < this.configuredBatchSize) {
          clearInterval(interval);
          isReady();
        }

        // Do not allow this interval to loop endlessly; anything longer than 5
        // minutes likely indicates an unrecoverable error in ES; direct the
        // user to inspect ES logs for more clues and abort in order to allow
        // the index to be cleaned up.
        if (streamLengthChecks >= 6000) {
          clearInterval(interval);
          abort(
            new Error(
              'Exceeded 5 minutes waiting for elastic to be ready to accept more documents. Check the elastic logs for possible problems.',
            ),
          );
        }
      }, 50);
    });
  }

  private constructIndexName(postFix: string) {
    return `${this.indexPrefix}${this.type}${this.indexSeparator}${postFix}`;
  }
}
