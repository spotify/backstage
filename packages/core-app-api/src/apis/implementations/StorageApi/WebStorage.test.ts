/*
 * Copyright 2020 The Backstage Authors
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
import { CreateStorageApiOptions, WebStorage } from './WebStorage';
import { StorageApi } from '@backstage/core-plugin-api';

describe('WebStorage Storage API', () => {
  const mockErrorApi = { post: jest.fn(), error$: jest.fn() };
  const createWebStorage = (
    args?: Partial<CreateStorageApiOptions>,
  ): StorageApi => {
    return WebStorage.create({
      errorApi: mockErrorApi,
      ...args,
    });
  };
  it('should return undefined for values which are unset', async () => {
    const storage = createWebStorage();

    expect(storage.get('myfakekey')).toBeUndefined();
  });

  it('should allow the setting and getting of the simple data structures', async () => {
    const storage = createWebStorage();

    await storage.set('myfakekey', 'helloimastring');
    await storage.set('mysecondfakekey', 1234);
    await storage.set('mythirdfakekey', true);
    expect(storage.get('myfakekey')).toBe('helloimastring');
    expect(storage.get('mysecondfakekey')).toBe(1234);
    expect(storage.get('mythirdfakekey')).toBe(true);
  });

  it('should allow setting of complex datastructures', async () => {
    const storage = createWebStorage();

    const mockData = {
      something: 'here',
      is: [{ super: { complex: [{ but: 'something', why: true }] } }],
    };

    await storage.set('myfakekey', mockData);

    expect(storage.get('myfakekey')).toEqual(mockData);
  });

  it('should subscribe to key changes when setting a new value', async () => {
    const storage = createWebStorage();

    const wrongKeyNextHandler = jest.fn();
    const selectedKeyNextHandler = jest.fn();
    const mockData = { hello: 'im a great new value' };

    await new Promise<void>(resolve => {
      storage.observe$<String>('correctKey').subscribe({
        next: (...args) => {
          selectedKeyNextHandler(...args);
          resolve();
        },
      });

      storage.observe$('wrongKey').subscribe({ next: wrongKeyNextHandler });

      storage.set('correctKey', mockData);
    });

    expect(wrongKeyNextHandler).not.toHaveBeenCalled();
    expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'correctKey',
      newValue: mockData,
    });
  });

  it('should subscribe to key changes when deleting a value', async () => {
    const storage = createWebStorage();

    const wrongKeyNextHandler = jest.fn();
    const selectedKeyNextHandler = jest.fn();
    const mockData = { hello: 'im a great new value' };

    storage.set('correctKey', mockData);

    await new Promise<void>(resolve => {
      storage.observe$('correctKey').subscribe({
        next: (...args) => {
          selectedKeyNextHandler(...args);
          resolve();
        },
      });

      storage.observe$('wrongKey').subscribe({ next: wrongKeyNextHandler });

      storage.remove('correctKey');
    });

    expect(wrongKeyNextHandler).not.toHaveBeenCalled();
    expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'correctKey',
      newValue: undefined,
    });
  });

  it('should be able to create different buckets for different uses', async () => {
    const rootStorage = createWebStorage();

    const firstStorage = rootStorage.forBucket('userSettings');
    const secondStorage = rootStorage.forBucket('profileSettings');
    const keyName = 'blobby';

    await firstStorage.set(keyName, 'boop');
    await secondStorage.set(keyName, 'deerp');

    expect(firstStorage.get(keyName)).not.toBe(secondStorage.get(keyName));
    expect(firstStorage.get(keyName)).toBe('boop');
    expect(secondStorage.get(keyName)).toBe('deerp');
  });

  it('should not clash with other namesapces when creating buckets', async () => {
    const rootStorage = createWebStorage();

    // when getting key test2 it will translate to /profile/something/deep/test2
    const firstStorage = rootStorage
      .forBucket('profile')
      .forBucket('something')
      .forBucket('deep');
    // when getting key deep/test2 it will translate to /profile/something/deep/test2
    const secondStorage = rootStorage.forBucket('profile/something');

    await firstStorage.set('test2', { error: true });

    expect(secondStorage.get('deep/test2')).toBe(undefined);
  });

  it('should call the error api when the json can not be parsed in local storage', async () => {
    const rootStorage = createWebStorage({
      namespace: '/Test/Mock/Thing',
    });

    localStorage.setItem('/Test/Mock/Thing/key', '{smd: asdouindA}');

    const value = rootStorage.get('key');

    expect(value).toBe(undefined);
    expect(mockErrorApi.post).toHaveBeenCalledWith(expect.any(Error));
    expect(mockErrorApi.post).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error when parsing JSON config from storage for: key',
      }),
    );
  });

  it('should return a singleton for the same namespace and same bucket', async () => {
    const rootStorage = createWebStorage({
      namespace: '/Test/Mock/Thing/Thing ',
    });

    expect(rootStorage.forBucket('test')).toBe(rootStorage.forBucket('test'));
  });
});
