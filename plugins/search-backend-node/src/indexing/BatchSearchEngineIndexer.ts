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

import { toError } from '@backstage/errors';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { Writable } from 'node:stream';
import { scheduler } from 'node:timers/promises';

/**
 * Options for {@link BatchSearchEngineIndexer}
 * @public
 */
export type BatchSearchEngineOptions = {
  batchSize: number;
  /**
   * Time to wait, in milliseconds, after a batch has been indexed and before
   * the next batch is accepted. Spacing batches out lowers the peak CPU usage
   * of collation at the cost of a longer total indexing time. Defaults to no
   * delay.
   */
  batchDelay?: number;
};

/**
 * Base class encapsulating batch-based stream processing. Useful as a base
 * class for search engine indexers.
 * @public
 */
export abstract class BatchSearchEngineIndexer extends Writable {
  private batchSize: number;
  private batchDelay: number;
  private currentBatch: IndexableDocument[] = [];

  constructor(options: BatchSearchEngineOptions) {
    super({ objectMode: true });
    this.batchSize = options.batchSize;
    this.batchDelay = options.batchDelay ?? 0;
  }

  /**
   * Receives an array of indexable documents (of size this.batchSize) which
   * should be written to the search engine. This method won't be called again
   * at least until it resolves.
   */
  public abstract index(documents: IndexableDocument[]): Promise<void>;

  /**
   * Any asynchronous setup tasks can be performed here.
   */
  public abstract initialize(): Promise<void>;

  /**
   * Any asynchronous teardown tasks can be performed here.
   */
  public abstract finalize(): Promise<void>;

  /**
   * Encapsulates initialization logic.
   * @internal
   */
  async _construct(done: (error?: Error | null | undefined) => void) {
    try {
      await this.initialize();
      done();
    } catch (e) {
      done(toError(e));
    }
  }

  /**
   * Encapsulates batch stream write logic.
   * @internal
   */
  async _write(
    doc: IndexableDocument,
    _e: any,
    done: (error?: Error | null) => void,
  ) {
    this.currentBatch.push(doc);
    if (this.currentBatch.length < this.batchSize) {
      done();
      return;
    }

    try {
      await this.index(this.currentBatch);
      this.currentBatch = [];
      if (this.batchDelay > 0) {
        await scheduler.wait(this.batchDelay);
      }
      done();
    } catch (e) {
      done(toError(e));
    }
  }

  /**
   * Encapsulates finalization and final error handling logic.
   * @internal
   */
  async _final(done: (error?: Error | null) => void) {
    try {
      // Index any remaining documents.
      if (this.currentBatch.length) {
        await this.index(this.currentBatch);
        this.currentBatch = [];
      }
      await this.finalize();
      done();
    } catch (e) {
      done(toError(e));
    }
  }
}
