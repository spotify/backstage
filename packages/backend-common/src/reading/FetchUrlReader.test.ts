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

import { ConfigReader } from '@backstage/config';
import { msw } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { getVoidLogger } from '../logging';
import { FetchUrlReader } from './FetchUrlReader';
import { DefaultReadTreeResponseFactory } from './tree';

describe('FetchUrlReader', () => {
  const worker = setupServer();

  msw.setupDefaultHandlers(worker);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('factory should create a single entry with a predicate that matches config', async () => {
    const entries = FetchUrlReader.factory({
      config: new ConfigReader({
        backend: {
          reading: {
            allow: [
              { host: 'example.com' },
              { host: 'example.com:700' },
              { host: '*.examples.org' },
              { host: '*.examples.org:700' },
            ],
          },
        },
      }),
      logger: getVoidLogger(),
      treeResponseFactory: DefaultReadTreeResponseFactory.create({
        config: new ConfigReader({}),
      }),
    });

    expect(entries.length).toBe(1);
    const [{ predicate }] = entries;

    expect(predicate(new URL('https://example.com/test'))).toBe(true);
    expect(predicate(new URL('https://a.example.com/test'))).toBe(false);
    expect(predicate(new URL('https://example.com:600/test'))).toBe(false);
    expect(predicate(new URL('https://a.example.com:600/test'))).toBe(false);
    expect(predicate(new URL('https://example.com:700/test'))).toBe(true);
    expect(predicate(new URL('https://a.example.com:700/test'))).toBe(false);
    expect(predicate(new URL('https://other.com/test'))).toBe(false);
    expect(predicate(new URL('https://examples.org/test'))).toBe(false);
    expect(predicate(new URL('https://a.examples.org/test'))).toBe(true);
    expect(predicate(new URL('https://a.b.examples.org/test'))).toBe(true);
    expect(predicate(new URL('https://examples.org:600/test'))).toBe(false);
    expect(predicate(new URL('https://a.examples.org:600/test'))).toBe(false);
    expect(predicate(new URL('https://a.b.examples.org:600/test'))).toBe(false);
    expect(predicate(new URL('https://examples.org:700/test'))).toBe(false);
    expect(predicate(new URL('https://a.examples.org:700/test'))).toBe(true);
    expect(predicate(new URL('https://a.b.examples.org:700/test'))).toBe(true);
  });
});
