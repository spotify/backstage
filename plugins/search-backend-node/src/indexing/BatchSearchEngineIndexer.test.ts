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

import { IndexableDocument } from '@backstage/plugin-search-common';
import { BatchSearchEngineIndexer } from './BatchSearchEngineIndexer';
import { TestPipeline } from '../test-utils';

const indexSpy = jest.fn().mockResolvedValue(undefined);
const initializeSpy = jest.fn().mockResolvedValue(undefined);
const finalizeSpy = jest.fn().mockResolvedValue(undefined);

class ConcreteBatchIndexer extends BatchSearchEngineIndexer {
  async index(documents: IndexableDocument[]): Promise<void> {
    return indexSpy(documents);
  }
  async initialize(): Promise<void> {
    return initializeSpy();
  }
  async finalize(): Promise<void> {
    return finalizeSpy();
  }
}

describe('BatchSearchEngineIndexer', () => {
  const document = {
    title: 'Some Document',
    text: 'Some document text.',
    location: '/some/location',
  };
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should work end-to-end', async () => {
    const indexer = new ConcreteBatchIndexer({ batchSize: 1 });
    await TestPipeline.fromIndexer(indexer)
      .withDocuments([document, document, document])
      .execute();
    expect(indexSpy).toHaveBeenCalledTimes(3);
  });

  it('should call initialize at construction', () => {
    // @ts-expect-error
    const _indexer = new ConcreteBatchIndexer({ batchSize: 1 });

    return new Promise<void>(done => {
      // Allow initialization to complete.
      setImmediate(() => {
        expect(initializeSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should emit error if initialization throws', () => {
    // Cause the initializer to throw.
    const expectedError = new Error('some error');
    initializeSpy.mockRejectedValue(expectedError);
    const indexer = new ConcreteBatchIndexer({ batchSize: 1 });

    return new Promise<void>(done => {
      // Listen for the error and assert it's what was thrown.
      indexer.on('error', error => {
        expect(error).toStrictEqual(expectedError);
        done();
      });

      // Write a document to force the error state to become known.
      indexer.write(document);
    });
  });

  it('should call index according to batchSize', () => {
    const indexer = new ConcreteBatchIndexer({ batchSize: 2 });

    return new Promise<void>(done => {
      // Listen for it to finish and assert the batches.
      indexer.on('finish', () => {
        expect(indexSpy).toHaveBeenCalledTimes(2);
        expect(indexSpy).toHaveBeenNthCalledWith(1, [document, document]);
        expect(indexSpy).toHaveBeenNthCalledWith(2, [document]);
        done();
      });

      // Write batchSize + 1 documents and end the stream.
      indexer.write(document);
      indexer.write(document);
      indexer.write(document);
      indexer.end();
    });
  });

  it('should call index without exceeding batchSize', () => {
    const indexer = new ConcreteBatchIndexer({ batchSize: 2 });

    return new Promise<void>(done => {
      // Listen for it to finish and assert that it still wrote.
      indexer.on('finish', () => {
        expect(indexSpy).toHaveBeenCalledTimes(1);
        expect(indexSpy).toHaveBeenNthCalledWith(1, [document]);
        done();
      });

      // Write batchSize - 1 documents and end the stream.
      indexer.write(document);
      indexer.end();
    });
  });

  it('should emit error if index throws', () => {
    // Cause the indexer to throw.
    const expectedError = new Error('index error');
    indexSpy.mockRejectedValue(expectedError);
    const indexer = new ConcreteBatchIndexer({ batchSize: 1 });

    return new Promise<void>(done => {
      // Listen for the error and assert it's what was thrown.
      indexer.on('error', error => {
        expect(error).toStrictEqual(expectedError);
        done();
      });

      indexer.write(document);
    });
  });

  it('should emit error if finalize throws', () => {
    // Cause the indexer to throw.
    const expectedError = new Error('finalize error');
    finalizeSpy.mockRejectedValue(expectedError);
    const indexer = new ConcreteBatchIndexer({ batchSize: 1 });

    return new Promise<void>(done => {
      // Listen for the error and assert it's what was thrown.
      indexer.on('error', error => {
        expect(error).toStrictEqual(expectedError);
        done();
      });

      indexer.end();
    });
  });

  it('should wait batchDelay between batches', async () => {
    const batchDelay = 50;
    const indexTimestamps: number[] = [];

    class TimestampingBatchIndexer extends BatchSearchEngineIndexer {
      async index(documents: IndexableDocument[]): Promise<void> {
        indexTimestamps.push(Date.now());
        return indexSpy(documents);
      }
      async initialize(): Promise<void> {
        return initializeSpy();
      }
      async finalize(): Promise<void> {
        return finalizeSpy();
      }
    }

    const indexer = new TimestampingBatchIndexer({ batchSize: 2, batchDelay });
    await TestPipeline.fromIndexer(indexer)
      .withDocuments([document, document, document, document])
      .execute();

    expect(indexSpy).toHaveBeenCalledTimes(2);
    expect(indexTimestamps).toHaveLength(2);
    expect(indexTimestamps[1] - indexTimestamps[0]).toBeGreaterThanOrEqual(
      batchDelay - 5,
    );
  });
});
