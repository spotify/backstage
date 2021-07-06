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

import { Config } from '@backstage/config';
import Keyv from 'keyv';
// @ts-expect-error
import KeyvMemcache from 'keyv-memcache';
import { Logger } from 'winston';
import { getRootLogger } from '../logging';
import { DefaultCacheClient, CacheClient } from './CacheClient';
import { NoStore } from './NoStore';
import {
  CacheManagerOptions,
  OptionalOnError,
  PluginCacheManager,
} from './types';

/**
 * Implements a Cache Manager which will automatically create new cache clients
 * for plugins when requested. All requested cache clients are created with the
 * connection details provided.
 */
export class CacheManager {
  /**
   * Keys represent supported `backend.cache.store` values, mapped to factories
   * that return Keyv instances appropriate to the store.
   */
  private readonly storeFactories = {
    memcache: this.getMemcacheClient,
    memory: this.getMemoryClient,
    none: this.getNoneClient,
  };

  private readonly logger: Logger;
  private readonly store: keyof CacheManager['storeFactories'];
  private readonly connection: string;
  private readonly errorHandler: OptionalOnError;

  /**
   * Creates a new CacheManager instance by reading from the `backend` config
   * section, specifically the `.cache` key.
   *
   * @param config The loaded application configuration.
   */
  static fromConfig(
    config: Config,
    options: CacheManagerOptions = {},
  ): CacheManager {
    // If no `backend.cache` config is provided, instantiate the CacheManager
    // with a "NoStore" cache client.
    const store = config.getOptionalString('backend.cache.store') || 'none';
    const connectionString =
      config.getOptionalString('backend.cache.connection') || '';
    const logger = (options.logger || getRootLogger()).child({
      type: 'cacheManager',
    });
    return new CacheManager(store, connectionString, logger, options.onError);
  }

  private constructor(
    store: string,
    connectionString: string,
    logger: Logger,
    errorHandler: OptionalOnError,
  ) {
    if (!this.storeFactories.hasOwnProperty(store)) {
      throw new Error(`Unknown cache store: ${store}`);
    }
    this.logger = logger;
    this.store = store as keyof CacheManager['storeFactories'];
    this.connection = connectionString;
    this.errorHandler = errorHandler;
  }

  /**
   * Generates a PluginCacheManager for consumption by plugins.
   *
   * @param pluginId The plugin that the cache manager should be created for. Plugin names should be unique.
   */
  forPlugin(pluginId: string): PluginCacheManager {
    return {
      getClient: (opts = {}): CacheClient => {
        const concreteClient = this.getClientWithTtl(pluginId, opts.defaultTtl);

        // Always provide an error handler to avoid killing the process.
        concreteClient.on('error', (err: Error) => {
          // In all cases, just log the error.
          this.logger.error(err);

          // Invoke any custom error handler if provided.
          if (typeof this.errorHandler === 'function') {
            this.errorHandler(err);
          }
        });

        return new DefaultCacheClient({
          client: concreteClient,
        });
      },
    };
  }

  private getClientWithTtl(pluginId: string, ttl: number | undefined): Keyv {
    return this.storeFactories[this.store].call(this, pluginId, ttl);
  }

  private getMemcacheClient(
    pluginId: string,
    defaultTtl: number | undefined,
  ): Keyv {
    return new Keyv({
      namespace: pluginId,
      ttl: defaultTtl,
      store: new KeyvMemcache(this.connection),
    });
  }

  private getMemoryClient(
    pluginId: string,
    defaultTtl: number | undefined,
  ): Keyv {
    return new Keyv({
      namespace: pluginId,
      ttl: defaultTtl,
    });
  }

  private getNoneClient(pluginId: string): Keyv {
    return new Keyv({
      namespace: pluginId,
      store: new NoStore(),
    });
  }
}
