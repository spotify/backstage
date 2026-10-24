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
import { withLogCollector } from '@backstage/test-utils';

const mockDir = createMockDirectory();
overrideTargetPaths(mockDir.path);

const mockYarnCreate = jest.spyOn(Yarn, 'create');
const mockYarn = {} as Yarn;

describe('PackageManager', () => {
  describe('detectPackageManager', () => {
    beforeEach(() => {
      resetDetectedPackageManagers();
      mockYarnCreate.mockResolvedValue(mockYarn);
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

      it('should fall back to yarn when root package.json packageManager field is unrecognized', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({
            name: 'foo',
            packageManager: 'something-else@1.0.0',
          }),
        });

        const { log, warn } = await withLogCollector(async () => {
          await detectPackageManager();
        });

        expect(mockYarnCreate).toHaveBeenCalledTimes(1);
        expect(log).toEqual([]);
        expect(warn).toEqual([
          'Detected unsupported package manager: something-else.',
        ]);
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
