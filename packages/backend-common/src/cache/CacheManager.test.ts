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

import { ConfigReader } from '@backstage/config';
import Keyv from 'keyv';
/* @ts-expect-error */
import KeyvMemcache from 'keyv-memcache';
import { DefaultCacheClient } from './CacheClient';
import { CacheManager } from './CacheManager';
import { NoStore } from './NoStore';

jest.createMockFromModule('keyv');
jest.mock('keyv');
jest.createMockFromModule('keyv-memcache');
jest.mock('keyv-memcache');
jest.mock('./CacheClient', () => {
  return {
    DefaultCacheClient: jest.fn(),
  };
});

describe('CacheManager', () => {
  const defaultConfigOptions = {
    backend: {
      cache: {
        store: 'memory',
      },
    },
  };
  const defaultConfig = () => new ConfigReader(defaultConfigOptions);

  afterEach(() => jest.resetAllMocks());

  describe('CacheManager.fromConfig', () => {
    it('accesses the backend.cache key', () => {
      const getOptionalString = jest.fn();
      const config = defaultConfig();
      config.getOptionalString = getOptionalString;

      CacheManager.fromConfig(config);

      expect(getOptionalString.mock.calls[0][0]).toEqual('backend.cache.store');
      expect(getOptionalString.mock.calls[1][0]).toEqual(
        'backend.cache.connection',
      );
    });

    it('does not require the backend.cache key', () => {
      const config = new ConfigReader({ backend: {} });
      expect(() => {
        CacheManager.fromConfig(config);
      }).not.toThrowError();
    });

    it('throws on unknown cache store', () => {
      const config = new ConfigReader({
        backend: { cache: { store: 'notreal' } },
      });
      expect(() => {
        CacheManager.fromConfig(config);
      }).toThrowError();
    });
  });

  describe('CacheManager.forPlugin', () => {
    const manager = CacheManager.fromConfig(defaultConfig());

    it('connects to a cache store scoped to the plugin', async () => {
      const pluginId = 'test1';
      manager.forPlugin(pluginId).getClient();

      const client = DefaultCacheClient as jest.Mock;
      expect(client).toHaveBeenCalledTimes(1);
    });

    it('attaches error handler to client', () => {
      const pluginId = 'error-test';
      manager.forPlugin(pluginId).getClient();

      const client = DefaultCacheClient as jest.Mock;
      const mockCalls = client.mock.calls.splice(-1);
      const realClient = mockCalls[0][0].client as Keyv;
      expect(realClient.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('provides different plugins different cache clients', async () => {
      const plugin1Id = 'test1';
      const plugin2Id = 'test2';
      const expectedTtl = 3600;
      manager.forPlugin(plugin1Id).getClient({ defaultTtl: expectedTtl });
      manager.forPlugin(plugin2Id).getClient({ defaultTtl: expectedTtl });

      const client = DefaultCacheClient as jest.Mock;
      const cache = (Keyv as unknown) as jest.Mock;
      expect(cache).toHaveBeenCalledTimes(2);
      expect(client).toHaveBeenCalledTimes(2);

      const plugin1CallArgs = cache.mock.calls[0];
      const plugin2CallArgs = cache.mock.calls[1];
      expect(plugin1CallArgs[0].namespace).not.toEqual(
        plugin2CallArgs[0].namespace,
      );
    });
  });

  describe('CacheManager.forPlugin stores', () => {
    it('returns none client when no cache is configured', () => {
      const manager = CacheManager.fromConfig(
        new ConfigReader({ backend: {} }),
      );
      const expectedNamespace = 'test-plugin';
      manager.forPlugin(expectedNamespace).getClient();

      const cache = (Keyv as unknown) as jest.Mock;
      const mockCalls = cache.mock.calls.splice(-1);
      const callArgs = mockCalls[0];
      expect(callArgs[0].store).toBeInstanceOf(NoStore);
    });

    it('returns memory client when explicitly configured', () => {
      const manager = CacheManager.fromConfig(defaultConfig());
      const expectedTtl = 3600;
      const expectedNamespace = 'test-plugin';
      manager
        .forPlugin(expectedNamespace)
        .getClient({ defaultTtl: expectedTtl });

      const cache = (Keyv as unknown) as jest.Mock;
      const mockCalls = cache.mock.calls.splice(-1);
      const callArgs = mockCalls[0];
      expect(callArgs[0]).toMatchObject({
        ttl: expectedTtl,
        namespace: expectedNamespace,
      });
    });

    it('returns a memcache client when configured', () => {
      const expectedHost = '127.0.0.1:11211';
      const manager = CacheManager.fromConfig(
        new ConfigReader({
          backend: {
            cache: {
              store: 'memcache',
              connection: expectedHost,
            },
          },
        }),
      );
      const expectedTtl = 3600;
      manager.forPlugin('test').getClient({ defaultTtl: expectedTtl });

      const cache = (Keyv as unknown) as jest.Mock;
      const mockCacheCalls = cache.mock.calls.splice(-1);
      expect(mockCacheCalls[0][0]).toMatchObject({
        ttl: expectedTtl,
      });
      expect(mockCacheCalls[0][0].store).toBeInstanceOf(KeyvMemcache);
      const memcache = KeyvMemcache as jest.Mock;
      const mockMemcacheCalls = memcache.mock.calls.splice(-1);
      expect(mockMemcacheCalls[0][0]).toEqual(expectedHost);
    });
  });

  describe('connection errors', () => {
    it('uses provided logger', () => {
      // Set up and inject mock logger.
      const mockLogger = { child: jest.fn(), error: jest.fn() };
      mockLogger.child.mockImplementation(() => mockLogger as any);
      const manager = CacheManager.fromConfig(defaultConfig(), {
        logger: mockLogger as any,
      });

      // Set up a cache client using the configured manager.
      manager.forPlugin('error-logger-test').getClient();

      // Retrieve the error handler attached to the cache client.
      const client = DefaultCacheClient as jest.Mock;
      const mockCalls = client.mock.calls.splice(-1);
      const realClient = mockCalls[0][0].client as Keyv;
      const realOnError = realClient.on as jest.Mock;
      const realHandler = realOnError.mock.calls.splice(-1)[0][1];

      // Invoke the actual error handler.
      const expectedError = new Error('some error');
      realHandler(expectedError);
      expect(mockLogger.error).toHaveBeenCalledWith(expectedError);
    });

    it('calls provided handler', () => {
      // Set up and inject mock logger.
      const mockHandler = jest.fn();
      const manager = CacheManager.fromConfig(defaultConfig(), {
        onError: mockHandler,
      });

      // Set up a cache client using the configured manager.
      manager.forPlugin('error-handler-test').getClient();

      // Retrieve the error handler attached to the cache client.
      const client = DefaultCacheClient as jest.Mock;
      const mockCalls = client.mock.calls.splice(-1);
      const realClient = mockCalls[0][0].client as Keyv;
      const realOnError = realClient.on as jest.Mock;
      const realHandler = realOnError.mock.calls.splice(-1)[0][1];

      // Invoke the actual error handler.
      const expectedError = new Error('some error');
      realHandler(expectedError);
      expect(mockHandler).toHaveBeenCalledWith(expectedError);
    });
  });
});
