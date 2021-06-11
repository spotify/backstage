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
  SearchQuery,
  IndexableDocument,
  SearchResultSet,
} from '@backstage/search-common';
import lunr from 'lunr';
import { Logger } from 'winston';
import { SearchEngine, QueryTranslator } from '../types';

type ConcreteLunrQuery = {
  lunrQueryString: string;
  documentTypes: string[];
};

export class LunrSearchEngine implements SearchEngine {
  protected lunrIndices: Record<string, lunr.Index> = {};
  protected docStore: Record<string, IndexableDocument>;
  protected logger: Logger;

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
    this.docStore = {};
  }

  translator: QueryTranslator = ({
    term,
    filters,
    types,
  }: SearchQuery): ConcreteLunrQuery => {
    let lunrQueryFilters;
    if (filters) {
      lunrQueryFilters = Object.entries(filters)
        .map(([key, value]) => ` +${key}:${value}`)
        .join('');
    }

    return {
      lunrQueryString: `${term}${lunrQueryFilters || ''}`,
      documentTypes: types || ['*'],
    };
  };

  index(type: string, documents: IndexableDocument[]): void {
    const lunrBuilder = new lunr.Builder();
    // Make this lunr index aware of all relevant fields.
    Object.keys(documents[0]).forEach(field => {
      lunrBuilder.field(field);
    });

    // Set "location" field as reference field
    lunrBuilder.ref('location');

    documents.forEach((document: IndexableDocument) => {
      // Add document to Lunar index
      lunrBuilder.add(document);
      // Store documents in memory to be able to look up document using the ref during query time
      // This is not how you should implement your SearchEngine implementation! Do not copy!
      this.docStore[document.location] = document;
    });

    // "Rotate" the index by simply overwriting any existing index of the same name.
    this.lunrIndices[type] = lunrBuilder.build();
  }

  query(query: SearchQuery): Promise<SearchResultSet> {
    const { lunrQueryString, documentTypes } = this.translator(
      query,
    ) as ConcreteLunrQuery;

    const results: lunr.Index.Result[] = [];

    if (documentTypes.length === 1 && documentTypes[0] === '*') {
      // Iterate over all this.lunrIndex values.
      Object.values(this.lunrIndices).forEach(i => {
        try {
          results.push(...i.search(lunrQueryString));
        } catch (err) {
          // if a field does not exist on a index, we can see that as a no-match
          if (
            err instanceof lunr.QueryParseError &&
            err.message.startsWith('unrecognised field')
          )
            return;
        }
      });
    } else {
      // Iterate over the filtered list of this.lunrIndex keys.
      Object.keys(this.lunrIndices)
        .filter(d => documentTypes.includes(d))
        .forEach(d => {
          try {
            results.push(...this.lunrIndices[d].search(lunrQueryString));
          } catch (err) {
            // if a field does not exist on a index, we can see that as a no-match
            if (
              err instanceof lunr.QueryParseError &&
              err.message.startsWith('unrecognised field')
            )
              return;
          }
        });
    }

    // Sort results.
    results.sort((doc1, doc2) => {
      return doc2.score - doc1.score;
    });

    // Translate results into SearchResultSet
    const resultSet: SearchResultSet = {
      results: results.map(d => {
        return { document: this.docStore[d.ref] };
      }),
    };

    return Promise.resolve(resultSet);
  }
}
