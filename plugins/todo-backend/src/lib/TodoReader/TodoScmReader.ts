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

import { UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { Logger } from 'winston';

import {
  ReadTodosOptions,
  ReadTodosResult,
  TodoItem,
  TodoParser,
  TodoReader,
} from './types';
import { Config } from '@backstage/config';
import { createTodoParser } from './createTodoParser';

type Options = {
  logger: Logger;
  reader: UrlReader;
  integrations: ScmIntegrations;
  parser?: TodoParser;
};

type CacheItem = {
  etag: string;
  result: ReadTodosResult;
};

export class TodoScmReader implements TodoReader {
  private readonly logger: Logger;
  private readonly reader: UrlReader;
  private readonly parser: TodoParser;
  private readonly integrations: ScmIntegrations;

  private readonly cache = new Map<string, CacheItem>();

  static fromConfig(config: Config, options: Omit<Options, 'integrations'>) {
    return new TodoScmReader({
      ...options,
      integrations: ScmIntegrations.fromConfig(config),
    });
  }

  constructor(options: Options) {
    this.logger = options.logger;
    this.reader = options.reader;
    this.parser = options.parser ?? createTodoParser();
    this.integrations = options.integrations;
  }

  async readTodos({ url }: ReadTodosOptions): Promise<ReadTodosResult> {
    const cacheItem = this.cache.get(url);
    try {
      const newCacheItem = await this.doReadTodos({ url }, cacheItem?.etag);
      this.cache.set(url, newCacheItem);
      return newCacheItem.result;
    } catch (error) {
      if (cacheItem && error.name === 'NotModifiedError') {
        return cacheItem.result;
      }
      throw error;
    }
  }

  private async doReadTodos(
    { url }: ReadTodosOptions,
    etag?: string,
  ): Promise<CacheItem> {
    const tree = await this.reader.readTree(url, {
      etag,
      filter(path) {
        return !path.startsWith('.') && !path.includes('/.');
      },
    });

    const files = await tree.files();
    this.logger.info(`Read ${files.length} files from ${url}`);

    const todos = new Array<TodoItem>();
    for (const file of files) {
      const content = await file.content();
      try {
        const items = this.parser({
          path: file.path,
          content: content.toString('utf8'),
        });

        todos.push(
          ...items.map(({ lineNumber, text, tag, author }) => ({
            text,
            tag,
            author,
            lineNumber,
            repoFilePath: file.path,
            viewUrl: this.integrations.resolveUrl({
              url: file.path,
              base: url,
              lineNumber,
            }),
          })),
        );
      } catch (error) {
        this.logger.error(
          `Failed to parse TODO in ${url} at ${file.path}, ${error}`,
        );
      }
    }

    return { result: { items: todos }, etag: tree.etag };
  }
}
