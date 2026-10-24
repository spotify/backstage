/*
 * Copyright 2025 The Backstage Authors
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

import { YarnLockfile } from '@backstage/cli-node';
import { PackageDocsCache } from './Cache';
import {
  createMockDirectory,
  MockDirectory,
} from '@backstage/backend-test-utils';
import { readFile } from 'node:fs/promises';
import { join as joinPath } from 'node:path';

jest.mock('crypto', () => {
  const actual = jest.requireActual('crypto');
  const hash = {
    update: jest.fn(),
    digest: jest.fn().mockReturnValue('test'),
  };
  return {
    ...actual,
    createHash: jest.fn().mockReturnValue(hash),
  };
});

describe('PackageDocsCache', () => {
  let testDir: MockDirectory;
  beforeAll(async () => {
    testDir = createMockDirectory();
  });
  afterEach(async () => {
    testDir.clear();
  });
  it('should be able to parse cache files', async () => {
    testDir.addContent({
      '.cache': {
        'package-docs': {
          test: {
            'cache.json': JSON.stringify({
              hash: 'test',
              packageName: 'test',
              restoreTo: 'test',
              version: '1',
            }),
          },
        },
      },
      test: {
        'package.json': JSON.stringify({
          name: '@test/test',
        }),
      },
    });
    const lockfile = {
      getDependencyTreeHash: () => 'test',
    } as any as YarnLockfile;
    const cache = await PackageDocsCache.loadAsync(testDir.path, lockfile);
    expect(await cache.has('test')).toBe(true);
  });

  it('should be able to restore cache', async () => {
    testDir.addContent({
      '.cache': {
        'package-docs': {
          test: {
            'cache.json': JSON.stringify({
              hash: 'test',
              packageName: 'test',
              restoreTo: 'test',
              version: '1',
            }),
            contents: {
              'src/index.ts': 'export const test = "test";',
            },
          },
        },
      },
      test: {
        'package.json': JSON.stringify({
          name: '@test/test',
        }),
      },
    });
    const lockfile = {
      getDependencyTreeHash: () => 'test',
    } as any as YarnLockfile;
    const cache = await PackageDocsCache.loadAsync(testDir.path, lockfile);
    await cache.restore('test');
    expect(
      await readFile(joinPath(testDir.path, 'test', 'src/index.ts'), 'utf-8'),
    ).toBe('export const test = "test";');
  });

  it('should be able to write cache', async () => {
    testDir.addContent({
      '.cache': {},
      test: {
        'package.json': JSON.stringify({
          name: '@test/test',
        }),
        'src/index.ts': 'export const test = "test";',
      },
    });
    const lockfile = {
      getDependencyTreeHash: () => 'test',
    } as any as YarnLockfile;
    const cache = await PackageDocsCache.loadAsync(testDir.path, lockfile);
    await cache.write('test', joinPath(testDir.path, 'test'));
    expect(
      await readFile(
        joinPath(testDir.path, '.cache', 'package-docs', 'test', 'cache.json'),
        'utf-8',
      ),
    ).toBe(
      JSON.stringify({
        hash: 'test',
        packageName: '@test/test',
        restoreTo: 'test',
        version: '1',
      }),
    );
    expect(
      await readFile(
        joinPath(
          testDir.path,
          '.cache',
          'package-docs',
          'test',
          'contents',
          'src/index.ts',
        ),
        'utf-8',
      ),
    ).toBe('export const test = "test";');
  });

  it.each([
    {
      content: JSON.stringify({
        hash: 'test',
        packageName: 'test',
        restoreTo: 'test',
        version: '2',
      }),
    },
    {
      content: JSON.stringify({
        hash: 'test',
        packageName: 1,
      }),
    },
  ])('should skip invalid cache files', async content => {
    testDir.addContent({
      '.cache': {},
      test: {
        'package.json': JSON.stringify({
          name: '@test/test',
        }),
      },
      'cache.json': content,
    });
    const lockfile = {
      getDependencyTreeHash: () => 'test',
    } as any as YarnLockfile;
    const cache = await PackageDocsCache.loadAsync(testDir.path, lockfile);
    expect(await cache.has('test')).toBe(false);
  });
});
