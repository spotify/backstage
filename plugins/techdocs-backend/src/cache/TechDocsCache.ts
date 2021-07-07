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
import { CacheClient } from '@backstage/backend-common';
import { Logger } from 'winston';

export class CacheInvalidationError extends Error {
  public readonly rejections: PromiseRejectedResult[];

  constructor(rejections: PromiseRejectedResult[]) {
    super();
    this.rejections = rejections;
  }
}

export class TechDocsCache {
  protected readonly cache: CacheClient;
  protected readonly logger: Logger;

  constructor({ cache, logger }: { cache: CacheClient; logger: Logger }) {
    this.cache = cache;
    this.logger = logger;
  }

  async get(path: string): Promise<Buffer | undefined> {
    try {
      // Promise.race ensures we don't hang the client for long if the cache is
      // temporarily unreachable.
      const response = (await Promise.race([
        this.cache.get(path),
        new Promise(cancelAfter => setTimeout(cancelAfter, 1000)),
      ])) as string | undefined;

      if (response !== undefined) {
        this.logger.debug(`Cache hit: ${path}`);
        return Buffer.from(response, 'base64');
      }

      this.logger.debug(`Cache miss: ${path}`);
      return response;
    } catch (e) {
      this.logger.warn(`Error getting cache entry ${path}: ${e.message}`);
      this.logger.debug(e.stack);
      return undefined;
    }
  }

  async set(path: string, data: Buffer): Promise<void> {
    this.logger.debug(`Writing cache entry for ${path}`);
    this.cache
      .set(path, data.toString('base64'))
      .catch(e => this.logger.error('write error', e));
  }

  async invalidate(path: string): Promise<void> {
    return this.cache.delete(path);
  }

  async invalidateMultiple(
    paths: string[],
  ): Promise<PromiseSettledResult<void>[]> {
    const settled = await Promise.allSettled(
      paths.map(path => this.cache.delete(path)),
    );
    const rejected = settled.filter(
      s => s.status === 'rejected',
    ) as PromiseRejectedResult[];

    if (rejected.length) {
      throw new CacheInvalidationError(rejected);
    }

    return settled;
  }
}
