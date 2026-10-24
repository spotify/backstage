/*
 * Copyright 2021 The Backstage Authors
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

import inquirer from 'inquirer';
import path from 'node:path';
import { Command } from 'commander';
import * as tasks from './lib/tasks';
import createApp from './createApp';
import { findOwnPaths, targetPaths } from '@backstage/cli-common';
import { tmpdir } from 'node:os';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';

jest.mock('./lib/tasks');

const MOCK_TARGET_DIR = '/mock/target-dir';
const MOCK_TARGET_ROOT = '/mock/target-root';
overrideTargetPaths({ dir: MOCK_TARGET_DIR, rootDir: MOCK_TARGET_ROOT });

// By mocking this the filesystem mocks won't mess with reading all of the package.jsons
jest.mock('./lib/versions', () => ({
  packageVersions: { root: '1.0.0' },
}));

const promptMock = jest.spyOn(inquirer, 'prompt');
const checkPathExistsMock = jest.spyOn(tasks, 'checkPathExistsTask');
const templatingMock = jest.spyOn(tasks, 'templatingTask');
const checkAppExistsMock = jest.spyOn(tasks, 'checkAppExistsTask');
const tryInitGitRepositoryMock = jest.spyOn(tasks, 'tryInitGitRepository');
const readGitConfig = jest.spyOn(tasks, 'readGitConfig');
const moveAppMock = jest.spyOn(tasks, 'moveAppTask');
const buildAppMock = jest.spyOn(tasks, 'buildAppTask');
const fetchYarnLockSeedMock = jest.spyOn(tasks, 'fetchYarnLockSeedTask');
const tryCommandForVersionMock = jest.spyOn(tasks, 'tryCommandForVersion');

describe('command entrypoint', () => {
  const mockDir = createMockDirectory({ mockOsTmpDir: true });
  const originalUserAgent = process.env.npm_config_user_agent;

  beforeEach(() => {
    // Make the default package manager independent of how the tests are run
    delete process.env.npm_config_user_agent;
    promptMock.mockResolvedValueOnce({
      name: 'MyApp',
      dbType: 'PostgreSQL',
    });
    readGitConfig.mockResolvedValue({
      defaultBranch: 'git-default-branch',
    });
    tryCommandForVersionMock.mockResolvedValue({
      version: '1.2.3',
      error: undefined,
    });
  });

  afterEach(() => {
    if (originalUserAgent === undefined) {
      delete process.env.npm_config_user_agent;
    } else {
      process.env.npm_config_user_agent = originalUserAgent;
    }
    mockDir.clear();
    jest.resetAllMocks();
  });

  it('should call expected tasks with no `--path` option', async () => {
    const cmd = {} as unknown as Command;
    await createApp(cmd);
    expect(checkAppExistsMock).toHaveBeenCalled();
    expect(tryInitGitRepositoryMock).toHaveBeenCalled();
    expect(templatingMock).toHaveBeenCalled();
    expect(templatingMock.mock.lastCall?.[0]).toEqual(
      findOwnPaths(__dirname).resolve('templates/default-app'),
    );
    expect(templatingMock.mock.lastCall?.[1]).toContain(
      path.join(tmpdir(), 'MyApp'),
    );
    expect(moveAppMock).toHaveBeenCalled();
    expect(buildAppMock).toHaveBeenCalled();
  });

  it('should call expected tasks with `--path` option', async () => {
    const cmd = { path: 'myDirectory' } as unknown as Command;
    await createApp(cmd);
    expect(checkPathExistsMock).toHaveBeenCalled();
    expect(tryInitGitRepositoryMock).toHaveBeenCalled();
    expect(templatingMock).toHaveBeenCalled();
    expect(templatingMock.mock.lastCall?.[0]).toEqual(
      findOwnPaths(__dirname).resolve('templates/default-app'),
    );
    expect(templatingMock.mock.lastCall?.[1]).toEqual('myDirectory');
    expect(buildAppMock).toHaveBeenCalled();
  });

  it('should call expected tasks when `--legacy` is supplied', async () => {
    const cmd = { legacy: true } as unknown as Command;
    await createApp(cmd);
    expect(checkAppExistsMock).toHaveBeenCalled();
    expect(tryInitGitRepositoryMock).toHaveBeenCalled();
    expect(templatingMock).toHaveBeenCalled();
    expect(templatingMock.mock.lastCall?.[0]).toEqual(
      findOwnPaths(__dirname).resolve('templates/legacy-app'),
    );
    expect(templatingMock.mock.lastCall?.[1]).toContain(
      path.join(tmpdir(), 'MyApp'),
    );
    expect(moveAppMock).toHaveBeenCalled();
    expect(buildAppMock).toHaveBeenCalled();
  });

  it('should call expected tasks with relative `--template-path` option', async () => {
    const cmd = {
      path: 'myDirectory',
      templatePath: 'templateDirectory',
    } as unknown as Command;
    await createApp(cmd);
    expect(checkPathExistsMock).toHaveBeenCalled();
    expect(tryInitGitRepositoryMock).toHaveBeenCalled();
    expect(templatingMock).toHaveBeenCalled();
    expect(templatingMock.mock.lastCall?.[0]).toEqual(
      targetPaths.resolve('templateDirectory'),
    );
    expect(templatingMock.mock.lastCall?.[1]).toEqual('myDirectory');
    expect(buildAppMock).toHaveBeenCalled();
  });

  it('should call expected tasks with absolute `--template-path` option', async () => {
    const cmd = {
      path: 'myDirectory',
      templatePath: path.resolve('somewhere', 'templateDirectory'),
    } as unknown as Command;
    await createApp(cmd);
    expect(checkPathExistsMock).toHaveBeenCalled();
    expect(tryInitGitRepositoryMock).toHaveBeenCalled();
    expect(templatingMock).toHaveBeenCalled();
    expect(templatingMock.mock.lastCall?.[0]).toEqual(
      path.resolve('somewhere', 'templateDirectory'),
    );
    expect(templatingMock.mock.lastCall?.[1]).toEqual('myDirectory');
    expect(buildAppMock).toHaveBeenCalled();
  });

  it('should not call `buildAppTask()` when `--skip-install` is supplied', async () => {
    const cmd = { skipInstall: true } as unknown as Command;
    await createApp(cmd);
    expect(buildAppMock).not.toHaveBeenCalled();
  });

  it('should not call `initGitRepository()` when `gitConfig` is undefined', async () => {
    const cmd = {} as unknown as Command;
    readGitConfig.mockResolvedValue(undefined);
    await createApp(cmd);
    expect(tryInitGitRepositoryMock).not.toHaveBeenCalled();
  });

  it('should create a Yarn app by default and leave out the pnpm files', async () => {
    const cmd = {} as unknown as Command;
    await createApp(cmd);
    expect(tryCommandForVersionMock).toHaveBeenCalledWith('yarn -v', undefined);
    expect(tryCommandForVersionMock).not.toHaveBeenCalledWith(
      'pnpm -v',
      expect.anything(),
    );
    expect(templatingMock.mock.lastCall?.[2]).toEqual(
      expect.objectContaining({ packageManager: 'yarn', pnpm: false }),
    );
    const exclude = templatingMock.mock.lastCall?.[3]?.exclude!;
    expect(exclude('pnpm-workspace.yaml.hbs')).toBe(true);
    expect(exclude('.yarnrc.yml.hbs')).toBe(false);
    expect(exclude('.yarn/releases/yarn-4.13.0.cjs')).toBe(false);
    expect(exclude('yarn.lock')).toBe(false);
    expect(exclude('package.json.hbs')).toBe(false);
    expect(fetchYarnLockSeedMock).toHaveBeenCalled();
    expect(buildAppMock).toHaveBeenCalledWith(expect.any(String), 'yarn');
  });

  it('should create a pnpm app when `--package-manager pnpm` is supplied', async () => {
    tryCommandForVersionMock.mockImplementation(async (command: string) => {
      if (command === 'pnpm -v') {
        return { version: '12.7.0', error: undefined };
      }
      return { version: '3.12.4', error: undefined };
    });
    const cmd = { packageManager: 'pnpm' } as unknown as Command;
    await createApp(cmd);
    expect(tryCommandForVersionMock).toHaveBeenCalledWith('pnpm -v', {
      cwd: tmpdir(),
    });
    expect(tryCommandForVersionMock).not.toHaveBeenCalledWith(
      'yarn -v',
      expect.anything(),
    );
    expect(templatingMock.mock.lastCall?.[2]).toEqual(
      expect.objectContaining({ packageManager: 'pnpm', pnpm: true }),
    );
    const exclude = templatingMock.mock.lastCall?.[3]?.exclude!;
    expect(exclude('.yarnrc.yml.hbs')).toBe(true);
    expect(exclude('.yarn/releases/yarn-4.13.0.cjs')).toBe(true);
    expect(exclude('yarn.lock')).toBe(true);
    expect(exclude('pnpm-workspace.yaml.hbs')).toBe(false);
    expect(exclude('package.json.hbs')).toBe(false);
    expect(fetchYarnLockSeedMock).not.toHaveBeenCalled();
    expect(buildAppMock).toHaveBeenCalledWith(expect.any(String), 'pnpm');
  });

  it('should pick the package manager from the npm user agent unless an option is supplied', async () => {
    promptMock.mockResolvedValue({ name: 'MyApp' });
    tryCommandForVersionMock.mockResolvedValue({
      version: '12.7.0',
      error: undefined,
    });
    process.env.npm_config_user_agent =
      'pnpm/12.7.0 npm/? node/v24.11.0 linux x64';
    await createApp({} as unknown as Command);
    expect(templatingMock.mock.lastCall?.[2]).toEqual(
      expect.objectContaining({ packageManager: 'pnpm' }),
    );
    expect(buildAppMock).toHaveBeenLastCalledWith(expect.any(String), 'pnpm');

    await createApp({ packageManager: 'yarn' } as unknown as Command);
    expect(templatingMock.mock.lastCall?.[2]).toEqual(
      expect.objectContaining({ packageManager: 'yarn' }),
    );
    expect(buildAppMock).toHaveBeenLastCalledWith(expect.any(String), 'yarn');

    process.env.npm_config_user_agent =
      'yarn/4.13.0 npm/? node/v22.12.0 linux x64';
    await createApp({} as unknown as Command);
    expect(templatingMock.mock.lastCall?.[2]).toEqual(
      expect.objectContaining({ packageManager: 'yarn' }),
    );
  });

  it('should reject an unsupported package manager', async () => {
    const cmd = { packageManager: 'npm' } as unknown as Command;
    await expect(createApp(cmd)).rejects.toThrow(
      "Unsupported package manager 'npm', expected 'yarn' or 'pnpm'",
    );
    expect(templatingMock).not.toHaveBeenCalled();
  });

  it('should exit when pnpm is not available or too old', async () => {
    const errorMock = jest.spyOn(tasks.Task, 'error');
    const exitMock = jest.spyOn(tasks.Task, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });
    const cmd = { packageManager: 'pnpm' } as unknown as Command;

    tryCommandForVersionMock.mockImplementation(async (command: string) => {
      if (command === 'pnpm -v') {
        return { version: 'N/A', error: 'Command not found: pnpm' };
      }
      return { version: '3.12.4', error: undefined };
    });
    await expect(createApp(cmd)).rejects.toThrow('exit');
    expect(errorMock).toHaveBeenCalledWith(
      'pnpm is not available. Please install pnpm 11.28 or a later 11.x release, or pnpm 12.7 or later before creating a Backstage app.',
    );

    for (const version of ['12.6.0', '11.27.1', '10.30.0']) {
      tryCommandForVersionMock.mockImplementation(async (command: string) => {
        if (command === 'pnpm -v') {
          return { version, error: undefined };
        }
        return { version: '3.12.4', error: undefined };
      });
      await expect(createApp(cmd)).rejects.toThrow('exit');
      expect(errorMock).toHaveBeenCalledWith(
        `pnpm 11.28 or a later 11.x release, or pnpm 12.7 or later is required, found ${version}. Please upgrade pnpm before creating a Backstage app.`,
      );
    }
    expect(templatingMock).not.toHaveBeenCalled();

    exitMock.mockImplementation(() => undefined);
    promptMock.mockResolvedValue({ name: 'MyApp' });
    for (const version of ['11.28.0', '12.7.0', '13.0.0']) {
      templatingMock.mockClear();
      tryCommandForVersionMock.mockImplementation(async (command: string) => {
        if (command === 'pnpm -v') {
          return { version, error: undefined };
        }
        return { version: '3.12.4', error: undefined };
      });
      await createApp(cmd);
      expect(templatingMock).toHaveBeenCalled();
    }
  });

  it('should exit when yarn is not available', async () => {
    tryCommandForVersionMock.mockImplementation(async (command: string) => {
      if (command === 'yarn -v') {
        return { version: 'N/A', error: 'Command not found: yarn' };
      }
      return { version: '3.12.4', error: undefined };
    });
    jest.spyOn(tasks.Task, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });
    const cmd = {} as unknown as Command;
    await expect(createApp(cmd)).rejects.toThrow('exit');
    expect(templatingMock).not.toHaveBeenCalled();
  });

  it('should continue when python is not available', async () => {
    tryCommandForVersionMock.mockImplementation(async (command: string) => {
      if (command.startsWith('python')) {
        return { version: 'N/A', error: 'Command not found: python' };
      }
      return { version: '4.6.0', error: undefined };
    });
    const cmd = {} as unknown as Command;
    await createApp(cmd);
    expect(templatingMock).toHaveBeenCalled();
  });

  it('should fall back to python when python3 is not available', async () => {
    tryCommandForVersionMock.mockImplementation(async (command: string) => {
      if (command === 'python3 --version') {
        return { version: 'N/A', error: 'Command not found: python3' };
      }
      if (command === 'python --version') {
        return { version: 'Python 3.12.4', error: undefined };
      }
      return { version: '4.6.0', error: undefined };
    });
    const cmd = {} as unknown as Command;
    await createApp(cmd);
    expect(tryCommandForVersionMock).toHaveBeenCalledWith('python --version');
    expect(templatingMock).toHaveBeenCalled();
  });

  it('should exit when Node version is an odd number', async () => {
    const originalVersion = process.versions.node;
    Object.defineProperty(process.versions, 'node', {
      value: '23.1.0',
      configurable: true,
    });
    try {
      jest.spyOn(tasks.Task, 'exit').mockImplementation(() => {
        throw new Error('exit');
      });
      const cmd = {} as unknown as Command;
      await expect(createApp(cmd)).rejects.toThrow('exit');
      expect(templatingMock).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(process.versions, 'node', {
        value: originalVersion,
        configurable: true,
      });
    }
  });

  it('should exit when Node version is too old', async () => {
    const originalVersion = process.versions.node;
    Object.defineProperty(process.versions, 'node', {
      value: '18.0.0',
      configurable: true,
    });
    try {
      jest.spyOn(tasks.Task, 'exit').mockImplementation(() => {
        throw new Error('exit');
      });
      const cmd = {} as unknown as Command;
      await expect(createApp(cmd)).rejects.toThrow('exit');
      expect(templatingMock).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(process.versions, 'node', {
        value: originalVersion,
        configurable: true,
      });
    }
  });

  it('should exit when Node version is too new', async () => {
    const originalVersion = process.versions.node;
    Object.defineProperty(process.versions, 'node', {
      value: '26.0.0',
      configurable: true,
    });
    try {
      jest.spyOn(tasks.Task, 'exit').mockImplementation(() => {
        throw new Error('exit');
      });
      const cmd = {} as unknown as Command;
      await expect(createApp(cmd)).rejects.toThrow('exit');
      expect(templatingMock).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(process.versions, 'node', {
        value: originalVersion,
        configurable: true,
      });
    }
  });
});
