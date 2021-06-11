/*
 * Copyright 2021 Spotify AB
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
  DocumentCollator,
  DocumentDecorator,
  IndexableDocument,
  SearchQuery,
  SearchResultSet,
} from '@backstage/search-common';

/**
 * Parameters required to register a collator.
 */
export interface RegisterCollatorParameters {
  /**
   * The type of document to be indexed (used to name indices, to configure refresh loop, etc).
   */
  type: string;

  /**
   * The default interval (in seconds) that the provided collator will be called (can be overridden in config).
   */
  defaultRefreshIntervalSeconds: number;

  /**
   * The collator class responsible for returning all documents of the given type.
   */
  collator: DocumentCollator;
}

/**
 * Parameters required to register a decorator
 */
export interface RegisterDecoratorParameters {
  /**
   * The decorator class responsible for appending or modifying documents of the given type(s).
   */
  decorator: DocumentDecorator;

  /**
   * (Optional) An array of document types that the given decorator should apply to. If none are provided,
   * the decorator will be applied to all types.
   */
  types?: string[];
}

/**
 * A type of function responsible for translating an abstract search query into
 * a concrete query relevant to a particular search engine.
 */
export type QueryTranslator = (query: SearchQuery) => unknown;

/**
 * Interface that must be implemented by specific search engines, responsible
 * for performing indexing and querying and translating abstract queries into
 * concrete, search engine-specific queries.
 */
export interface SearchEngine {
  translator: QueryTranslator;
  index(type: string, documents: IndexableDocument[]): void;
  query(query: SearchQuery): Promise<SearchResultSet>;
}
