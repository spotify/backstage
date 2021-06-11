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
import { JsonObject } from '@backstage/config';

export interface SearchQuery {
  term: string;
  filters?: JsonObject;
  types?: string[];
  pageCursor: string;
}

export interface SearchResult {
  document: IndexableDocument;
}

export interface SearchResultSet {
  results: SearchResult[];
}

/**
 * Base properties that all indexed documents must include, as well as some
 * common properties that documents are encouraged to use where appropriate.
 */
export interface IndexableDocument {
  /**
   * The primary name of the document (e.g. name, title, identifier, etc).
   */
  title: string;

  /**
   * Free-form text of the document (e.g. description, content, etc).
   */
  text: string;

  /**
   * The relative or absolute URL of the document (target when a search result
   * is clicked).
   */
  location: string;
}

/**
 * Interface that must be implemented in order to expose new documents to
 * search.
 */
export interface DocumentCollator {
  execute(): Promise<IndexableDocument[]>;
}

/**
 * Interface that must be implemented in order to decorate existing documents with
 * additional metadata.
 */
export interface DocumentDecorator {
  execute(documents: IndexableDocument[]): Promise<IndexableDocument[]>;
}
