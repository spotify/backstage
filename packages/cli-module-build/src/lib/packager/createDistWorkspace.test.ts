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
import { getDefaultWorkspaceFiles } from './createDistWorkspace';

describe('getDefaultWorkspaceFiles', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    overrideTargetPaths(mockDir.path);
  });

  it('copies the lockfile when there is one, and warns when there is not', async () => {
    const logger = { warn: jest.fn() };
    const yarn = { lockfileName: () => 'yarn.lock' };

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
