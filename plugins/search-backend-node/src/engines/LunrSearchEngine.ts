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

type LunrResultEnvelope = {
  result: lunr.Index.Result;
  type: string;
};

type LunrQueryTranslator = (query: SearchQuery) => ConcreteLunrQuery;

export class LunrSearchEngine implements SearchEngine {
  protected lunrIndices: Record<string, lunr.Index> = {};
  protected docStore: Record<string, IndexableDocument>;
  protected logger: Logger;

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
    this.docStore = {};
  }

  protected translator: QueryTranslator = ({
    term,
    filters,
    types,
  }: SearchQuery): ConcreteLunrQuery => {
    let lunrQueryFilters;
    const lunrTerm = term ? `+${term}` : '';
    if (filters) {
      lunrQueryFilters = Object.entries(filters)
        .map(([field, value]) => {
          // Require that the given field has the given value (with +).
          if (['string', 'number', 'boolean'].includes(typeof value)) {
            if (typeof value === 'string') {
              return ` +${field}:${value.replace(':', '\\:')}`;
            }
            return ` +${field}:${value}`;
          }

          // Illustrate how multi-value filters could work.
          if (Array.isArray(value)) {
            // But warn that Lurn supports this poorly.
            this.logger.warn(
              `Non-scalar filter value used for field ${field}. Consider using a different Search Engine for better results.`,
            );
            return ` ${value.map(v => {
              return `${field}:${v}`;
            })}`;
          }

          // Log a warning or something about unknown filter value
          this.logger.warn(`Unknown filter type used on field ${field}`);
          return '';
        })
        .join('');
    }

    return {
      lunrQueryString: `${lunrTerm}${lunrQueryFilters || ''}`,
      documentTypes: types || ['*'],
    };
  };

  setTranslator(translator: LunrQueryTranslator) {
    this.translator = translator;
  }

  index(type: string, documents: IndexableDocument[]): void {
    const lunrBuilder = new lunr.Builder();

    lunrBuilder.pipeline.add(lunr.trimmer, lunr.stopWordFilter, lunr.stemmer);
    lunrBuilder.searchPipeline.add(lunr.stemmer);

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

    const results: LunrResultEnvelope[] = [];

    if (documentTypes.length === 1 && documentTypes[0] === '*') {
      // Iterate over all this.lunrIndex values.
      Object.keys(this.lunrIndices).forEach(type => {
        try {
          results.push(
            ...this.lunrIndices[type].search(lunrQueryString).map(result => {
              return {
                result: result,
                type: type,
              };
            }),
          );
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
        .filter(type => documentTypes.includes(type))
        .forEach(type => {
          try {
            results.push(
              ...this.lunrIndices[type].search(lunrQueryString).map(result => {
                return {
                  result: result,
                  type: type,
                };
              }),
            );
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
      return doc2.result.score - doc1.result.score;
    });

    // Translate results into SearchResultSet
    const realResultSet: SearchResultSet = {
      results: results.map(d => {
        return { type: d.type, document: this.docStore[d.result.ref] };
      }),
    };

    return Promise.resolve(realResultSet);
  }
}
