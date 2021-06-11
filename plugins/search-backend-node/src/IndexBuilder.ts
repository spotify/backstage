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

import { DocumentCollator, DocumentDecorator } from '@backstage/search-common';
import { Logger } from 'winston';
import { Scheduler } from './index';
import {
  RegisterCollatorParameters,
  RegisterDecoratorParameters,
  SearchEngine,
} from './types';

interface CollatorEnvelope {
  collate: DocumentCollator;
  refreshInterval: number;
}

type IndexBuilderOptions = {
  searchEngine: SearchEngine;
  logger: Logger;
};

export class IndexBuilder {
  private collators: Record<string, CollatorEnvelope>;
  private decorators: Record<string, DocumentDecorator[]>;
  private searchEngine: SearchEngine;
  private logger: Logger;

  constructor({ logger, searchEngine }: IndexBuilderOptions) {
    this.collators = {};
    this.decorators = {};
    this.logger = logger;
    this.searchEngine = searchEngine;
  }

  getSearchEngine(): SearchEngine {
    return this.searchEngine;
  }

  /**
   * Makes the index builder aware of a collator that should be executed at the
   * given refresh interval.
   */
  addCollator({
    type,
    collator,
    defaultRefreshIntervalSeconds,
  }: RegisterCollatorParameters): void {
    this.logger.info(
      `Added ${collator.constructor.name} collator for type ${type}`,
    );
    this.collators[type] = {
      refreshInterval: defaultRefreshIntervalSeconds,
      collate: collator,
    };
  }

  /**
   * Makes the index builder aware of a decorator. If no types are provided, it
   * will be applied to documents from all known collators, otherwise it will
   * only be applied to documents of the given types.
   */
  addDecorator({
    types = ['*'],
    decorator,
  }: RegisterDecoratorParameters): void {
    this.logger.info(
      `Added decorator ${decorator.constructor.name} to types ${types.join(
        ', ',
      )}`,
    );
    types.forEach(type => {
      if (this.decorators.hasOwnProperty(type)) {
        this.decorators[type].push(decorator);
      } else {
        this.decorators[type] = [decorator];
      }
    });
  }

  /**
   * Compiles collators and decorators into tasks, which are added to a
   * scheduler returned to the caller.
   */
  async build(): Promise<{ scheduler: Scheduler }> {
    const scheduler = new Scheduler({ logger: this.logger });

    Object.keys(this.collators).forEach(type => {
      scheduler.addToSchedule(async () => {
        // Collate, Decorate, Index.
        const decorators: DocumentDecorator[] = (
          this.decorators['*'] || []
        ).concat(this.decorators[type] || []);

        this.logger.debug(
          `Collating documents for ${type} via ${this.collators[type].collate.constructor.name}`,
        );
        let documents = await this.collators[type].collate.execute();
        for (let i = 0; i < decorators.length; i++) {
          this.logger.debug(
            `Decorating ${type} documents via ${decorators[i].constructor.name}`,
          );
          documents = await decorators[i].execute(documents);
        }

        if (!documents || documents.length === 0) {
          this.logger.debug(`No documents for type "${type}" to index`);
          return;
        }

        // pushing documents to index to a configured search engine.
        this.searchEngine.index(type, documents);
      }, this.collators[type].refreshInterval * 1000);
    });

    return {
      scheduler,
    };
  }
}
