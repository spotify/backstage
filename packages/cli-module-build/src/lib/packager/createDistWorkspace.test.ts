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
import {
  createDistWorkspace,
  getDefaultWorkspaceFiles,
} from './createDistWorkspace';

jest.mock('@backstage/cli-node/alpha', () => ({
  ...jest.requireActual('@backstage/cli-node/alpha'),
  detectPackageManager: jest.fn(),
}));

function mockPackageManager(name: string, lockfileName: string) {
  jest.mocked(detectPackageManager).mockResolvedValue({
    name: () => name,
    lockfileName: () => lockfileName,
  } as Partial<PackageManager> as PackageManager);
}

describe('createDistWorkspace', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    overrideTargetPaths(mockDir.path);
    jest.spyOn(PackageGraph, 'listTargetPackages').mockResolvedValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('copies the root files that the package manager needs', async () => {
    mockDir.setContent({
      'package.json': '{}',
      'pnpm-lock.yaml': 'lockfileVersion: 9.0',
      'pnpm-workspace.yaml': 'packages: [packages/*]',
      'yarn.lock': '# yarn',
      dist: {},
    });

    mockPackageManager('pnpm', 'pnpm-lock.yaml');
    await createDistWorkspace([], { targetDir: mockDir.resolve('dist') });
    expect(mockDir.content({ path: 'dist', shouldReadAsText: true })).toEqual({
      'package.json': '{}',
      'pnpm-lock.yaml': 'lockfileVersion: 9.0',
      'pnpm-workspace.yaml': 'packages: [packages/*]',
    });

    mockDir.setContent({
      'package.json': '{}',
      'pnpm-workspace.yaml': 'packages: [packages/*]',
      'yarn.lock': '# yarn',
      dist: {},
    });
    mockPackageManager('yarn', 'yarn.lock');
    await createDistWorkspace([], { targetDir: mockDir.resolve('dist') });
    expect(mockDir.content({ path: 'dist', shouldReadAsText: true })).toEqual({
      'package.json': '{}',
      'yarn.lock': '# yarn',
    });
  });
});

describe('getDefaultWorkspaceFiles', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    overrideTargetPaths(mockDir.path);
  });

  it('copies the lockfile when there is one, and warns when there is not', async () => {
    const logger = { warn: jest.fn() };
    const yarn = { name: () => 'yarn', lockfileName: () => 'yarn.lock' };

    mockDir.setContent({ 'package.json': '{}', 'yarn.lock': '' });
    await expect(getDefaultWorkspaceFiles(yarn, logger)).resolves.toEqual([
      'yarn.lock',
      'package.json',
    ]);
    expect(logger.warn).not.toHaveBeenCalled();

    mockDir.setContent({ 'package.json': '{}' });
    await expect(getDefaultWorkspaceFiles(yarn, logger)).resolves.toEqual([
      'package.json',
    ]);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('There is no yarn.lock in the workspace root'),
    );
  });
});
