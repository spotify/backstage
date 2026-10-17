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

import { mapDependencies } from './packages';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('mapDependencies', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should read dependencies', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        workspaces: ['pkgs/*'],
      }),
      pkgs: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/core': '1 || 2',
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              '@backstage/core': '3',
              '@backstage/cli': '^0',
            },
          }),
        },
      },
    });

    const dependencyMap = await mapDependencies(mockDir.path, '@backstage/*');
    expect(Array.from(dependencyMap)).toEqual([
      [
        '@backstage/core',
        [
          {
            name: 'a',
            range: '1 || 2',
            location: mockDir.resolve('pkgs/a'),
          },
          {
            name: 'b',
            range: '3',
            location: mockDir.resolve('pkgs/b'),
          },
        ],
      ],
      [
        '@backstage/cli',
        [
          {
            name: 'b',
            range: '^0',
            location: mockDir.resolve('pkgs/b'),
          },
        ],
      ],
    ]);
  });
});
