/*
 * Copyright 2024 The Backstage Authors
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
import {
  detectPackageManager,
  resetDetectedPackageManagers,
} from './PackageManager';
import { Yarn } from './yarn';
import { Pnpm } from './pnpm';
import { withLogCollector } from '@backstage/test-utils';

const mockDir = createMockDirectory();
overrideTargetPaths(mockDir.path);

const mockYarnCreate = jest.spyOn(Yarn, 'create');
const mockYarn = {} as Yarn;
const mockPnpmCreate = jest.spyOn(Pnpm, 'create');
const mockPnpm = {} as Pnpm;

describe('PackageManager', () => {
  describe('detectPackageManager', () => {
    beforeEach(() => {
      resetDetectedPackageManagers();
      mockYarnCreate.mockResolvedValue(mockYarn);
      mockPnpmCreate.mockResolvedValue(mockPnpm);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('yarn', () => {
      it('should detect via yarn.lock', async () => {
        mockDir.setContent({
          'yarn.lock': 'just needs to exist',
        });
        await expect(detectPackageManager()).resolves.toBe(mockYarn);
        expect(mockYarnCreate).toHaveBeenCalledWith({
          workspaceRootDir: mockDir.path,
        });
      });

      it('should detect via root package.json workspaces', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({
            name: 'foo',
            workspaces: {
              packages: [],
            },
          }),
        });
        await detectPackageManager();
        expect(mockYarnCreate).toHaveBeenCalled();
      });
      it('should detect via root package.json workspaces (array form)', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({
            name: 'foo',
            workspaces: ['packages/*'],
          }),
        });
        await detectPackageManager();
        expect(mockYarnCreate).toHaveBeenCalled();
      });

      it('should detect via root package.json packageManager', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({
            name: 'foo',
            packageManager: 'yarn@1.0.0',
          }),
        });
        await detectPackageManager();
        expect(mockYarnCreate).toHaveBeenCalled();
      });

      it('should ignore an unsupported packageManager field when there is a yarn.lock', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({
            name: 'foo',
            packageManager: 'something-else@1.0.0',
          }),
          'yarn.lock': '',
        });

        const { log, warn } = await withLogCollector(async () => {
          await detectPackageManager();
        });

        expect(mockYarnCreate).toHaveBeenCalledTimes(1);
        expect(log).toEqual([]);
        expect(warn).toEqual([
          'Ignoring the packageManager field in the root package.json, since something-else is not supported.',
        ]);
      });

      it('should fail for an unsupported packageManager field without other signals', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({
            name: 'foo',
            packageManager: 'bun@1.0.0',
          }),
        });

        await withLogCollector(async () => {
          await expect(detectPackageManager()).rejects.toThrow(
            'The packageManager field in the root package.json names bun, which is not supported.',
          );
        });
        expect(mockYarnCreate).not.toHaveBeenCalled();
        expect(mockPnpmCreate).not.toHaveBeenCalled();
      });

      it('should fall back to yarn with available detection methods', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({
            name: 'foo',
          }),
        });

        const { log, warn } = await withLogCollector(async () => {
          await detectPackageManager();
        });

        expect(mockYarnCreate).toHaveBeenCalledTimes(1);
        expect(log).toEqual([]);
        expect(warn).toHaveLength(1);
      });

      it('should fall back to yarn with no package.json at all', async () => {
        mockDir.setContent({});

        const { log, warn } = await withLogCollector(async () => {
          await detectPackageManager();
        });

        expect(mockYarnCreate).toHaveBeenCalledTimes(1);
        // extra warning for the error reading package.json
        expect(log).toEqual([]);
        expect(warn).toHaveLength(2);
      });
    });

    describe('pnpm', () => {
      it('should detect via pnpm-lock.yaml', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({ name: 'foo' }),
          'pnpm-lock.yaml': '',
        });
        await expect(detectPackageManager()).resolves.toBe(mockPnpm);
        expect(mockPnpmCreate).toHaveBeenCalledWith({
          workspaceRootDir: mockDir.path,
        });
      });

      it('should detect via pnpm-workspace.yaml, even with a workspaces field', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({ workspaces: ['packages/*'] }),
          'pnpm-workspace.yaml': 'packages:\n  - packages/*\n',
        });
        await expect(detectPackageManager()).resolves.toBe(mockPnpm);
        expect(mockYarnCreate).not.toHaveBeenCalled();
      });

      it('should prefer the packageManager field over a leftover lockfile', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({ packageManager: 'pnpm@12.7.0' }),
          'yarn.lock': '',
        });
        await expect(detectPackageManager()).resolves.toBe(mockPnpm);
        expect(mockYarnCreate).not.toHaveBeenCalled();
      });

      it('should read devEngines.packageManager when there is no packageManager field', async () => {
        // Before the first pnpm install of a migration, only yarn.lock exists
        mockDir.setContent({
          'package.json': JSON.stringify({
            devEngines: {
              packageManager: { name: 'pnpm', version: '^12.7.0' },
            },
          }),
          'yarn.lock': '',
        });
        await expect(detectPackageManager()).resolves.toBe(mockPnpm);

        // The array form uses the first supported entry
        resetDetectedPackageManagers();
        mockDir.setContent({
          'package.json': JSON.stringify({
            devEngines: {
              packageManager: [{ name: 'bun' }, { name: 'yarn' }],
            },
          }),
          'pnpm-lock.yaml': '',
        });
        await expect(detectPackageManager()).resolves.toBe(mockYarn);

        // An unsupported name is ignored like an unsupported packageManager
        resetDetectedPackageManagers();
        mockDir.setContent({
          'package.json': JSON.stringify({
            devEngines: { packageManager: { name: 'bun' } },
          }),
          'pnpm-lock.yaml': '',
        });
        const { warn } = await withLogCollector(async () => {
          await expect(detectPackageManager()).resolves.toBe(mockPnpm);
        });
        expect(warn).toEqual([
          'Ignoring the devEngines.packageManager field in the root package.json, since bun is not supported.',
        ]);

        // The packageManager field wins over a conflicting devEngines entry
        resetDetectedPackageManagers();
        mockDir.setContent({
          'package.json': JSON.stringify({
            packageManager: 'pnpm@12.7.0',
            devEngines: { packageManager: { name: 'yarn' } },
          }),
        });
        const { warn: warn2 } = await withLogCollector(async () => {
          await expect(detectPackageManager()).resolves.toBe(mockPnpm);
        });
        expect(warn2).toEqual([
          'The packageManager field in the root package.json names pnpm, but devEngines.packageManager names yarn. Using pnpm.',
        ]);
      });

      it('should warn about a second lockfile', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({ name: 'foo' }),
          'pnpm-lock.yaml': '',
          'yarn.lock': '',
        });
        const { warn } = await withLogCollector(async () => {
          await expect(detectPackageManager()).resolves.toBe(mockPnpm);
        });
        expect(warn).toEqual([
          expect.stringContaining(
            'Both pnpm-lock.yaml and yarn.lock exist in the workspace root',
          ),
        ]);

        // The packageManager field decides, but the warning stays
        resetDetectedPackageManagers();
        mockDir.setContent({
          'package.json': JSON.stringify({ packageManager: 'yarn@4.18.0' }),
          'pnpm-lock.yaml': '',
          'yarn.lock': '',
        });
        const { warn: warn2 } = await withLogCollector(async () => {
          await expect(detectPackageManager()).resolves.toBe(mockYarn);
        });
        expect(warn2).toHaveLength(1);
      });
    });

    it('should only read the given workspace root and cache the result per root', async () => {
      mockDir.setContent({
        'yarn.lock': '',
        nested: {
          'package.json': JSON.stringify({ workspaces: ['packages/*'] }),
        },
      });

      await expect(detectPackageManager()).resolves.toBe(mockYarn);
      await expect(detectPackageManager()).resolves.toBe(mockYarn);
      await expect(
        detectPackageManager({ workspaceRootDir: mockDir.resolve('nested') }),
      ).resolves.toBe(mockYarn);

      expect(mockYarnCreate).toHaveBeenCalledTimes(2);
      expect(mockYarnCreate).toHaveBeenNthCalledWith(1, {
        workspaceRootDir: mockDir.path,
      });
      expect(mockYarnCreate).toHaveBeenNthCalledWith(2, {
        workspaceRootDir: mockDir.resolve('nested'),
      });
    });

    it('should not cache a failed detection', async () => {
      mockDir.setContent({ 'yarn.lock': '' });

      mockYarnCreate.mockRejectedValueOnce(new Error('yarn not found'));
      await expect(detectPackageManager()).rejects.toThrow('yarn not found');
      await expect(detectPackageManager()).resolves.toBe(mockYarn);
      expect(mockYarnCreate).toHaveBeenCalledTimes(2);
    });
  });
});
