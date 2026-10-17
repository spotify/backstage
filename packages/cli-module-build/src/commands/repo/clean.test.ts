/*
 * Copyright 2026 The Backstage Authors
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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import { PackageGraph } from '@backstage/cli-node';
import {
  detectPackageManager,
  PackageManager,
} from '@backstage/cli-node/alpha';
import clean from './clean';

jest.mock('@backstage/cli-node/alpha', () => ({
  ...jest.requireActual('@backstage/cli-node/alpha'),
  detectPackageManager: jest.fn(),
}));

const mockRunScript = jest.fn();

describe('repo clean', () => {
  const mockDir = createMockDirectory();
  const info = { usage: 'backstage-cli repo clean', name: 'clean' };

  beforeEach(() => {
    overrideTargetPaths(mockDir.path);
    jest.mocked(detectPackageManager).mockResolvedValue({
      name: () => 'yarn',
      runScript: mockRunScript,
    } as Partial<PackageManager> as PackageManager);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('removes build output and runs custom clean scripts through the package manager', async () => {
    mockDir.setContent({
      'dist/index.js': '',
      'dist-types/index.d.ts': '',
      'packages/a/dist/index.js': '',
      'packages/a/coverage/lcov.info': '',
      'packages/b/dist/index.js': '',
    });
    jest.spyOn(PackageGraph, 'listTargetPackages').mockResolvedValue([
      {
        dir: mockDir.resolve('packages/a'),
        packageJson: {
          name: 'a',
          version: '0.0.0',
          scripts: { clean: 'backstage-cli package clean' },
        },
      },
      {
        dir: mockDir.resolve('packages/b'),
        packageJson: {
          name: 'b',
          version: '0.0.0',
          scripts: { clean: 'rimraf dist' },
        },
      },
      {
        dir: mockDir.resolve('packages/c'),
        packageJson: { name: 'c', version: '0.0.0' },
      },
    ]);

    await clean({ args: [], info });

    expect(mockDir.content({ shouldReadAsText: true })).toEqual({
      packages: {
        a: {},
        b: { dist: { 'index.js': '' } },
      },
    });
    expect(mockRunScript).toHaveBeenCalledTimes(1);
    expect(mockRunScript).toHaveBeenCalledWith('clean', [], {
      cwd: mockDir.resolve('packages/b'),
    });
  });

  it('does not detect the package manager when no custom clean scripts exist', async () => {
    mockDir.setContent({});
    jest.spyOn(PackageGraph, 'listTargetPackages').mockResolvedValue([
      {
        dir: mockDir.resolve('packages/a'),
        packageJson: {
          name: 'a',
          version: '0.0.0',
          scripts: { clean: 'backstage-cli clean' },
        },
      },
    ]);

    await clean({ args: [], info });

    expect(detectPackageManager).not.toHaveBeenCalled();
    expect(mockRunScript).not.toHaveBeenCalled();
  });
});
