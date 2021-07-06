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

import { DefaultCacheClient } from './CacheClient';
import Keyv from 'keyv';

describe('CacheClient', () => {
  let client: Keyv;
  const b64 = (k: string) => Buffer.from(k).toString('base64');

  beforeEach(() => {
    client = new Keyv();
    client.get = jest.fn();
    client.set = jest.fn();
    client.delete = jest.fn();
  });

  afterEach(() => jest.resetAllMocks());

  describe('CacheClient.get', () => {
    it('calls client with normalized key', async () => {
      const sut = new DefaultCacheClient({ client });
      const key = 'somekey';

      await sut.get(key);

      expect(client.get).toHaveBeenCalledWith(b64(key));
    });

    it('calls client with normalized key (very long key)', async () => {
      const sut = new DefaultCacheClient({ client });
      const key = 'x'.repeat(251);

      await sut.get(key);

      const spy = client.get as jest.Mock;
      const actualKey = spy.mock.calls[0][0];
      expect(actualKey).not.toEqual(b64(key));
      expect(actualKey.length).toBeLessThan(250);
    });

    it('rejects on underlying error', async () => {
      const sut = new DefaultCacheClient({ client });
      const expectedError = new Error('Some runtime error');
      client.get = jest.fn().mockRejectedValue(expectedError);

      return expect(sut.get('someKey')).rejects.toEqual(expectedError);
    });

    it('resolves what underlying client resolves', async () => {
      const sut = new DefaultCacheClient({ client });
      const expectedValue = 'some value';
      client.get = jest.fn().mockResolvedValue(expectedValue);

      const actualValue = await sut.get('someKey');

      return expect(actualValue).toEqual(expectedValue);
    });
  });

  describe('CacheClient.set', () => {
    it('calls client with normalized key', async () => {
      const sut = new DefaultCacheClient({ client });
      const key = 'somekey';

      await sut.set(key, {});

      const spy = client.set as jest.Mock;
      const actualKey = spy.mock.calls[0][0];
      expect(actualKey).toEqual(b64(key));
    });

    it('passes ttl to client when given', async () => {
      const sut = new DefaultCacheClient({ client });
      const expectedTtl = 3600;

      await sut.set('someKey', {}, { ttl: expectedTtl });

      const spy = client.set as jest.Mock;
      const actualTtl = spy.mock.calls[0][2];
      expect(actualTtl).toEqual(expectedTtl);
    });

    it('rejects on underlying error if configured', async () => {
      const sut = new DefaultCacheClient({ client });
      const expectedError = new Error('Some runtime error');
      client.set = jest.fn().mockRejectedValue(expectedError);

      return expect(sut.set('someKey', {})).rejects.toEqual(expectedError);
    });
  });

  describe('CacheClient.delete', () => {
    it('calls client with normalized key', async () => {
      const sut = new DefaultCacheClient({ client });
      const key = 'somekey';

      await sut.delete(key);

      const spy = client.delete as jest.Mock;
      const actualKey = spy.mock.calls[0][0];
      expect(actualKey).toEqual(b64(key));
    });

    it('rejects on underlying error if configured', async () => {
      const sut = new DefaultCacheClient({ client });
      const expectedError = new Error('Some runtime error');
      client.delete = jest.fn().mockRejectedValue(expectedError);

      return expect(sut.delete('someKey')).rejects.toEqual(expectedError);
    });
  });
});
