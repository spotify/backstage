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

import {
  detectPackageManager,
  PackageManager,
} from '@backstage/cli-node/alpha';
import { executePortableTemplate } from './executePortableTemplate';
import { writeTemplateContents } from './writeTemplateContents';
import { installNewPackage } from './installNewPackage';
import { Task } from '../tasks';

jest.mock('@backstage/cli-node/alpha', () => ({
  ...jest.requireActual('@backstage/cli-node/alpha'),
  detectPackageManager: jest.fn(),
}));
jest.mock('./writeTemplateContents', () => ({
  writeTemplateContents: jest.fn(),
}));
jest.mock('./installNewPackage', () => ({ installNewPackage: jest.fn() }));

const mockInstall = jest.fn();
const mockRunScript = jest.fn();

describe('executePortableTemplate', () => {
  const options = {
    config: { isUsingDefaultTemplates: true, templatePointers: [] },
    template: { name: 'plugin', role: 'frontend-plugin', files: [] },
    input: { packagePath: 'plugins/test' },
  } as any;

  beforeEach(() => {
    jest.mocked(detectPackageManager).mockResolvedValue({
      name: () => 'yarn',
      install: mockInstall,
      runScript: mockRunScript,
      getCommandHint: (args: string[]) => ['yarn', ...args].join(' '),
    } as Partial<PackageManager> as PackageManager);
    jest.mocked(writeTemplateContents).mockResolvedValue({
      targetDir: '/repo/plugins/test',
    } as any);
    jest.spyOn(Task, 'log').mockImplementation(() => {});
    jest.spyOn(Task, 'error').mockImplementation(() => {});
    jest
      .spyOn(Task, 'forItem')
      .mockImplementation((_task, _item, taskFunc) => taskFunc());
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('installs the workspace and fixes lint in the new package', async () => {
    await executePortableTemplate(options);

    expect(installNewPackage).toHaveBeenCalledWith(options.input);
    expect(mockInstall).toHaveBeenCalledTimes(1);
    expect(mockInstall).toHaveBeenCalledWith({
      onStdout: expect.any(Function),
      onStderr: expect.any(Function),
    });
    expect(mockRunScript).toHaveBeenCalledTimes(1);
    expect(mockRunScript).toHaveBeenCalledWith('lint', ['--fix'], {
      cwd: '/repo/plugins/test',
      stdio: 'ignore',
    });
    expect(Task.forItem).toHaveBeenCalledWith(
      'executing',
      'yarn install',
      expect.any(Function),
    );
    expect(Task.forItem).toHaveBeenCalledWith(
      'executing',
      'yarn lint --fix',
      expect.any(Function),
    );
    expect(Task.error).not.toHaveBeenCalled();

    // A failing command is reported as a warning rather than an error
    mockInstall.mockRejectedValueOnce(new Error('NOPE'));
    await executePortableTemplate(options);
    expect(Task.error).toHaveBeenCalledWith(
      "Warning: Failed to execute command 'yarn install', Error: NOPE",
    );
    expect(mockRunScript).toHaveBeenCalledTimes(2);
  });

  it('does not touch the package manager with skipInstall', async () => {
    await executePortableTemplate({ ...options, skipInstall: true });

    expect(installNewPackage).toHaveBeenCalledWith(options.input);
    expect(detectPackageManager).not.toHaveBeenCalled();
    expect(mockInstall).not.toHaveBeenCalled();
    expect(mockRunScript).not.toHaveBeenCalled();
  });
});
