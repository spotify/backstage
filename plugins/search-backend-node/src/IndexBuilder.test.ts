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
import {
  DocumentCollator,
  DocumentDecorator,
  IndexableDocument,
} from '@backstage/search-common';
import { IndexBuilder } from './IndexBuilder';
import { LunrSearchEngine, SearchEngine } from './index';

class TestDocumentCollator implements DocumentCollator {
  readonly type: string = 'anything';
  async execute(): Promise<IndexableDocument[]> {
    return [];
  }
}

class TypedDocumentCollator extends TestDocumentCollator {
  readonly type = 'an-expected-type';
}

class TestDocumentDecorator implements DocumentDecorator {
  async execute(documents: IndexableDocument[]) {
    return documents;
  }
}

class TypedDocumentDecorator extends TestDocumentDecorator {
  readonly types = ['an-expected-type'];
}

class DifferentlyTypedDocumentDecorator extends TestDocumentDecorator {
  readonly types = ['not-the-expected-type'];
}

describe('IndexBuilder', () => {
  let testSearchEngine: SearchEngine;
  let testIndexBuilder: IndexBuilder;

  beforeEach(() => {
    const logger = getVoidLogger();
    testSearchEngine = new LunrSearchEngine({ logger });
    testIndexBuilder = new IndexBuilder({
      logger,
      searchEngine: testSearchEngine,
    });
  });

  describe('addCollator', () => {
    it('adds a collator', async () => {
      jest.useFakeTimers();
      const testCollator = new TestDocumentCollator();
      const collatorSpy = jest.spyOn(testCollator, 'execute');

      // Add a collator.
      testIndexBuilder.addCollator({
        defaultRefreshIntervalSeconds: 6,
        collator: testCollator,
      });

      // Build the index and ensure the collator was invoked.
      const { scheduler } = await testIndexBuilder.build();
      scheduler.start();
      jest.advanceTimersByTime(6000);
      expect(collatorSpy).toHaveBeenCalled();
    });
  });

  describe('addDecorator', () => {
    it('adds a decorator', async () => {
      jest.useFakeTimers();
      const testCollator = new TestDocumentCollator();
      const testDecorator = new TestDocumentDecorator();
      const decoratorSpy = jest.spyOn(testDecorator, 'execute');

      // Add a collator.
      testIndexBuilder.addCollator({
        defaultRefreshIntervalSeconds: 6,
        collator: testCollator,
      });

      // Add a decorator.
      testIndexBuilder.addDecorator({
        decorator: testDecorator,
      });

      // Build the index and ensure the decorator was invoked.
      const { scheduler } = await testIndexBuilder.build();
      scheduler.start();
      jest.advanceTimersByTime(6000);
      // wait for async decorator execution
      await Promise.resolve();
      expect(decoratorSpy).toHaveBeenCalled();
    });

    it('adds a type-specific decorator', async () => {
      jest.useFakeTimers();
      const testCollator = new TypedDocumentCollator();
      const testDecorator = new TypedDocumentDecorator();
      const docFixture = {
        title: 'Test',
        text: 'Test text.',
        location: '/test/location',
      };
      jest
        .spyOn(testCollator, 'execute')
        .mockImplementation(async () => [docFixture]);
      const decoratorSpy = jest.spyOn(testDecorator, 'execute');

      // Add a collator.
      testIndexBuilder.addCollator({
        defaultRefreshIntervalSeconds: 6,
        collator: testCollator,
      });

      // Add a decorator for the same type.
      testIndexBuilder.addDecorator({
        decorator: testDecorator,
      });

      // Build the index and ensure the decorator was invoked.
      const { scheduler } = await testIndexBuilder.build();
      scheduler.start();
      jest.advanceTimersByTime(6000);
      // wait for async decorator execution
      await Promise.resolve();
      expect(decoratorSpy).toHaveBeenCalled();
      expect(decoratorSpy).toHaveBeenCalledWith([docFixture]);
    });

    it('adds a type-specific decorator that should not be called', async () => {
      const docFixture = {
        title: 'Test',
        text: 'Test text.',
        location: '/test/location',
      };
      const testCollator = new TestDocumentCollator();
      const testDecorator = new DifferentlyTypedDocumentDecorator();
      const collatorSpy = jest
        .spyOn(testCollator, 'execute')
        .mockImplementation(async () => [docFixture]);
      const decoratorSpy = jest.spyOn(testDecorator, 'execute');

      // Add a collator.
      testIndexBuilder.addCollator({
        defaultRefreshIntervalSeconds: 6,
        collator: testCollator,
      });

      // Add a decorator for a different type.
      testIndexBuilder.addDecorator({
        decorator: testDecorator,
      });

      // Build the index and ensure the decorator was not invoked.
      const { scheduler } = await testIndexBuilder.build();
      scheduler.start();
      jest.advanceTimersByTime(6000);
      expect(collatorSpy).toHaveBeenCalled();
      expect(decoratorSpy).not.toHaveBeenCalled();
    });
  });
});
