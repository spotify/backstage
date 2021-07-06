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

import { getVoidLogger } from '@backstage/backend-common';
import { LunrSearchEngine } from './LunrSearchEngine';
import { SearchEngine } from '../types';

/**
 * Just used to test the default translator shipped with LunrSearchEngine.
 */
class LunrSearchEngineForTranslatorTests extends LunrSearchEngine {
  getTranslator() {
    return this.translator;
  }
}

describe('LunrSearchEngine', () => {
  let testLunrSearchEngine: SearchEngine;

  beforeEach(() => {
    testLunrSearchEngine = new LunrSearchEngine({ logger: getVoidLogger() });
  });

  describe('translator', () => {
    it('query translator invoked', async () => {
      // Given: Set a translator spy on the search engine.
      const translatorSpy = jest.fn().mockReturnValue({
        lunrQueryString: '',
        documentTypes: [],
      });
      testLunrSearchEngine.setTranslator(translatorSpy);

      // When: querying the search engine
      testLunrSearchEngine.query({
        term: 'testTerm',
        filters: {},
        pageCursor: '',
      });

      // Then: the translator is invoked with expected args.
      expect(translatorSpy).toHaveBeenCalledWith({
        term: 'testTerm',
        filters: {},
        pageCursor: '',
      });
    });

    it('should return translated query', async () => {
      const inspectableSearchEngine = new LunrSearchEngineForTranslatorTests({
        logger: getVoidLogger(),
      });
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        term: 'testTerm',
        filters: {},
        pageCursor: '',
      });

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['*'],
        lunrQueryString: '+testTerm',
      });
    });

    it('should return translated query with 1 filter', async () => {
      const inspectableSearchEngine = new LunrSearchEngineForTranslatorTests({
        logger: getVoidLogger(),
      });
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        term: 'testTerm',
        filters: { kind: 'testKind' },
        pageCursor: '',
      });

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['*'],
        lunrQueryString: '+testTerm +kind:testKind',
      });
    });

    it('should return translated query with multiple filters', async () => {
      const inspectableSearchEngine = new LunrSearchEngineForTranslatorTests({
        logger: getVoidLogger(),
      });
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        term: 'testTerm',
        filters: { kind: 'testKind', namespace: 'testNameSpace' },
        pageCursor: '',
      });

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['*'],
        lunrQueryString: '+testTerm +kind:testKind +namespace:testNameSpace',
      });
    });
  });

  describe('query', () => {
    it('should perform search query', async () => {
      const querySpy = jest.spyOn(testLunrSearchEngine, 'query');

      // Perform search query and ensure the query func was invoked.
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTerm',
        filters: {},
        pageCursor: '',
      });

      expect(querySpy).toHaveBeenCalled();
      expect(querySpy).toHaveBeenCalledWith({
        term: 'testTerm',
        filters: {},
        pageCursor: '',
      });

      // Should return 0 results as nothing is indexed here
      expect(mockedSearchResult).toMatchObject({ results: [] });
    });

    it('should perform search query and return 0 results on no match', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
      ];

      // Mock indexing of 1 document
      testLunrSearchEngine.index('test-index', mockDocuments);

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTerm',
        filters: {},
        pageCursor: '',
      });

      // Should return 0 results as we are mocking the indexing of 1 document but with no match on the fields
      expect(mockedSearchResult).toMatchObject({ results: [] });
    });

    it('should perform search query and return search results on match', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
      ];

      // Mock indexing of 1 document
      testLunrSearchEngine.index('test-index', mockDocuments);

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitle',
        filters: {},
        pageCursor: '',
      });

      // Should return 1 result as we are mocking the indexing of 1 document with match on the title field
      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'testText',
              location: 'test/location',
            },
          },
        ],
      });
    });

    it('should perform search query with trailing punctuation and return search results on match (trimming)', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'Hello World.',
          location: 'test/location',
        },
      ];

      // Mock indexing of 1 document
      testLunrSearchEngine.index('test-index', mockDocuments);

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'World',
        filters: {},
        pageCursor: '',
      });

      // Should return 1 result as we are mocking the indexing of 1 document with match on the title field
      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'Hello World.',
              location: 'test/location',
            },
          },
        ],
      });
    });

    it('should perform search query by similar words and return search results on match (stemming)', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'Searching',
          location: 'test/location',
        },
      ];

      // Mock indexing of 1 document
      testLunrSearchEngine.index('test-index', mockDocuments);

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'Search',
        filters: {},
        pageCursor: '',
      });

      // Should return 1 result as we are mocking the indexing of 1 document with match on the title field
      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'Searching',
              location: 'test/location',
            },
          },
        ],
      });
    });

    it('should perform search query and return search results on match with filters', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location2',
        },
      ];

      // Mock indexing of 2 documents
      testLunrSearchEngine.index('test-index', mockDocuments);

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitle',
        filters: { location: 'test/location2' },
        pageCursor: '',
      });

      // Should return 1 of 2 results as we are
      // 1. Mocking the indexing of 2 documents
      // 2. Matching on the location field with the filter { location: 'test/location2' }
      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'testText',
              location: 'test/location2',
            },
          },
        ],
      });
    });

    it('should perform search query and return search results on match with filter and not fail on missing field', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
      ];

      const mockDocuments2 = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location2',
          extraField: 'testExtraField',
        },
      ];

      // Mock 2 indices with 1 document each
      testLunrSearchEngine.index('test-index', mockDocuments);
      testLunrSearchEngine.index('test-index-2', mockDocuments2);
      // Perform search query scoped to "test-index-2" with a filter on the field "extraField"
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitle',
        pageCursor: '',
        filters: { extraField: 'testExtraField' },
      });

      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'testText',
              location: 'test/location2',
              extraField: 'testExtraField',
            },
          },
        ],
      });
    });

    it('should perform search query and return search results on match with filters that include a : character', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test:location',
        },
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test:location2',
        },
      ];

      // Mock indexing of 2 documents
      testLunrSearchEngine.index('test-index', mockDocuments);

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitle',
        filters: { location: 'test:location2' },
        pageCursor: '',
      });

      // Should return 1 of 2 results as we are
      // 1. Mocking the indexing of 2 documents
      // 2. Matching on the location field with the filter { location: 'test:location2' }
      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'testText',
              location: 'test:location2',
            },
          },
        ],
      });
    });

    it('should perform search query and return search results on match, scoped to specific index', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location2',
        },
      ];

      const mockDocuments2 = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location3',
        },
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location4',
        },
      ];

      // Mock 2 indices with 2 documents each
      testLunrSearchEngine.index('test-index', mockDocuments);
      testLunrSearchEngine.index('test-index-2', mockDocuments2);

      // Perform search query scoped to "test-index-2"
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitle',
        types: ['test-index-2'],
        pageCursor: '',
      });

      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              location: 'test/location3',
              text: 'testText',
              title: 'testTitle',
            },
          },
          {
            document: {
              location: 'test/location4',
              text: 'testText',
              title: 'testTitle',
            },
          },
        ],
      });
    });
  });

  describe('index', () => {
    it('should index document', async () => {
      const indexSpy = jest.spyOn(testLunrSearchEngine, 'index');
      const mockDocuments = [
        {
          title: 'testTerm',
          text: 'testText',
          location: 'test/location',
        },
      ];

      // call index func and ensure the index func was invoked.
      testLunrSearchEngine.index('test-index', mockDocuments);
      expect(indexSpy).toHaveBeenCalled();
      expect(indexSpy).toHaveBeenCalledWith('test-index', [
        { title: 'testTerm', text: 'testText', location: 'test/location' },
      ]);
    });
  });
});
