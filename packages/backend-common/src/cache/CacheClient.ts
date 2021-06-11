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

import { JsonValue } from '@backstage/config';
import { createHash } from 'crypto';
import Keyv from 'keyv';

type CacheClientArgs = {
  client: Keyv;
};

type CacheSetOptions = {
  /**
   * Optional TTL in milliseconds. Defaults to the TTL provided when the client
   * was set up (or no TTL if none are provided).
   */
  ttl?: number;
};

/**
 * A pre-configured, storage agnostic cache client suitable for use by
 * Backstage plugins.
 */
export interface CacheClient {
  /**
   * Reads data from a cache store for the given key. If no data was found,
   * returns undefined.
   */
  get(key: string): Promise<JsonValue | undefined>;

  /**
   * Writes the given data to a cache store, associated with the given key. An
   * optional TTL may also be provided, otherwise it defaults to the TTL that
   * was provided when the client was instantiated.
   */
  set(key: string, value: JsonValue, options?: CacheSetOptions): Promise<void>;

  /**
   * Removes the given key from the cache store.
   */
  delete(key: string): Promise<void>;
}

/**
 * A basic, concrete implementation of the CacheClient, suitable for almost
 * all uses in Backstage.
 */
export class DefaultCacheClient implements CacheClient {
  private readonly client: Keyv;

  constructor({ client }: CacheClientArgs) {
    this.client = client;
  }

  async get(key: string): Promise<JsonValue | undefined> {
    const k = this.getNormalizedKey(key);
    return await this.client.get(k);
  }

  async set(
    key: string,
    value: JsonValue,
    opts: CacheSetOptions = {},
  ): Promise<void> {
    const k = this.getNormalizedKey(key);
    await this.client.set(k, value, opts.ttl);
  }

  async delete(key: string): Promise<void> {
    const k = this.getNormalizedKey(key);
    await this.client.delete(k);
  }

  /**
   * Ensures keys are well-formed for any/all cache stores.
   */
  private getNormalizedKey(candidateKey: string): string {
    // Remove potentially invalid characters.
    const wellFormedKey = Buffer.from(candidateKey).toString('base64');

    // Memcache in particular doesn't do well with keys > 250 bytes.
    // Padded because a plugin ID is also prepended to the key.
    if (wellFormedKey.length < 200) {
      return wellFormedKey;
    }

    return createHash('md5').update(candidateKey).digest('base64');
  }
}
