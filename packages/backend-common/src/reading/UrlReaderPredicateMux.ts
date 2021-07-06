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

import { NotAllowedError } from '@backstage/errors';
import { Logger } from 'winston';
import {
  ReadTreeOptions,
  ReadTreeResponse,
  ReadUrlOptions,
  ReadUrlResponse,
  SearchOptions,
  SearchResponse,
  UrlReader,
  UrlReaderPredicateTuple,
} from './types';

const MIN_WARNING_INTERVAL_MS = 1000 * 60 * 15;

/**
 * A UrlReader implementation that selects from a set of UrlReaders
 * based on a predicate tied to each reader.
 */
export class UrlReaderPredicateMux implements UrlReader {
  private readonly readers: UrlReaderPredicateTuple[] = [];
  private readonly readerWarnings: Map<UrlReader, number> = new Map();

  constructor(private readonly logger: Logger) {}

  register(tuple: UrlReaderPredicateTuple): void {
    this.readers.push(tuple);
  }

  async read(url: string): Promise<Buffer> {
    const parsed = new URL(url);

    for (const { predicate, reader } of this.readers) {
      if (predicate(parsed)) {
        return reader.read(url);
      }
    }

    throw new NotAllowedError(`Reading from '${url}' is not allowed`);
  }

  async readUrl(
    url: string,
    options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    const parsed = new URL(url);

    for (const { predicate, reader } of this.readers) {
      if (predicate(parsed)) {
        if (reader.readUrl) {
          return reader.readUrl(url, options);
        }
        const now = Date.now();
        const lastWarned = this.readerWarnings.get(reader) ?? 0;
        if (now > lastWarned + MIN_WARNING_INTERVAL_MS) {
          this.readerWarnings.set(reader, now);
          this.logger.warn(
            `No implementation of readUrl found for ${reader}, this method will be required in the ` +
              `future and will replace the 'read' method. See the changelog for more details here: ` +
              'https://github.com/backstage/backstage/blob/master/packages/backend-common/CHANGELOG.md#085',
          );
        }
        const buffer = await reader.read(url);
        return {
          buffer: async () => buffer,
        };
      }
    }

    throw new NotAllowedError(`Reading from '${url}' is not allowed`);
  }

  async readTree(
    url: string,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    const parsed = new URL(url);

    for (const { predicate, reader } of this.readers) {
      if (predicate(parsed)) {
        return await reader.readTree(url, options);
      }
    }

    throw new NotAllowedError(`Reading from '${url}' is not allowed`);
  }

  async search(url: string, options?: SearchOptions): Promise<SearchResponse> {
    const parsed = new URL(url);

    for (const { predicate, reader } of this.readers) {
      if (predicate(parsed)) {
        return await reader.search(url, options);
      }
    }

    throw new NotAllowedError(`Reading from '${url}' is not allowed`);
  }

  toString() {
    return `predicateMux{readers=${this.readers.map(t => t.reader).join(',')}`;
  }
}
