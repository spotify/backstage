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
import { run, runOutput } from '@backstage/cli-common';
import { NotFoundError } from '@backstage/errors';
import { hasBackstageYarnPlugin } from '../../yarn/yarnPlugin';
import { Yarn } from './Yarn';
import { YarnLockfile } from './YarnLockfile';

jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  run: jest.fn(),
  runOutput: jest.fn(),
}));

jest.mock('../../yarn/yarnPlugin', () => ({
  hasBackstageYarnPlugin: jest.fn(),
}));

const mockRun = jest.mocked(run);
const mockRunOutput = jest.mocked(runOutput);
const mockHasBackstageYarnPlugin = jest.mocked(hasBackstageYarnPlugin);

const mockDir = createMockDirectory();

describe('Yarn', () => {
  let classic: Yarn;
  let berry: Yarn;

  beforeAll(async () => {
    mockRunOutput.mockResolvedValueOnce('1.22.22\n');
    classic = await Yarn.create({ workspaceRootDir: '/classic' });
    mockRunOutput.mockResolvedValueOnce('4.5.0\n');
    berry = await Yarn.create({ workspaceRootDir: '/berry' });
  });

  beforeEach(() => {
    mockRun.mockReturnValue({
      waitForExit: async () => {},
    } as unknown as ReturnType<typeof run>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should detect the yarn version in the workspace root', async () => {
    expect(mockRunOutput).toHaveBeenCalledWith(['yarn', '--version'], {
      cwd: '/classic',
    });
    expect(mockRunOutput).toHaveBeenCalledWith(['yarn', '--version'], {
      cwd: '/berry',
    });

    expect(classic.name()).toBe('yarn');
    await expect(classic.version()).resolves.toBe('1.22.22');
    expect(classic.lockfileName()).toBe('yarn.lock');
    expect(classic.toString()).toBe('yarn@1.22.22');

    expect(berry.name()).toBe('yarn');
    await expect(berry.version()).resolves.toBe('4.5.0');
    expect(berry.lockfileName()).toBe('yarn.lock');
    expect(berry.toString()).toBe('yarn@4.5.0');
  });

  it('should retry the version detection after a failure', async () => {
    mockRunOutput.mockRejectedValueOnce(new Error('command not found'));
    await expect(Yarn.create({ workspaceRootDir: '/flaky' })).rejects.toThrow(
      'Failed to determine yarn version',
    );

    mockRunOutput.mockResolvedValueOnce('4.5.0\n');
    const yarn = await Yarn.create({ workspaceRootDir: '/flaky' });
    await expect(yarn.version()).resolves.toBe('4.5.0');
    expect(mockRunOutput).toHaveBeenCalledTimes(2);
  });

  it('should run commands and scripts in the workspace root by default', async () => {
    await berry.run(['--version']);
    expect(mockRun).toHaveBeenLastCalledWith(['yarn', '--version'], {
      cwd: '/berry',
    });

    await berry.runScript('lint', ['--fix'], { cwd: '/berry/packages/a' });
    expect(mockRun).toHaveBeenLastCalledWith(['yarn', 'run', 'lint', '--fix'], {
      cwd: '/berry/packages/a',
    });

    await berry.runWorkspaceScript('backend', 'start', ['--inspect']);
    expect(mockRun).toHaveBeenLastCalledWith(
      ['yarn', 'workspace', 'backend', 'start', '--inspect'],
      { cwd: '/berry' },
    );

    expect(berry.getCommandHint(['backstage-cli', 'repo', 'fix'])).toBe(
      'yarn backstage-cli repo fix',
    );
  });

  it('should install dependencies in the workspace root', async () => {
    const npmConfigVar = 'npm_config_backstage_yarn_test';
    const originalValue = process.env[npmConfigVar];
    process.env[npmConfigVar] = 'value';

    try {
      await berry.install();
      expect(mockRun).toHaveBeenLastCalledWith(['yarn', 'install'], {
        cwd: '/berry',
        env: expect.objectContaining({
          PATH: process.env.PATH,
          [npmConfigVar]: undefined,
        }),
        onStdout: undefined,
        onStderr: undefined,
      });
      expect(mockRun.mock.lastCall![1]!.env).not.toHaveProperty(
        'YARN_ENABLE_IMMUTABLE_INSTALLS',
      );

      await berry.install({ immutable: true });
      expect(mockRun).toHaveBeenLastCalledWith(
        ['yarn', 'install', '--immutable'],
        expect.anything(),
      );

      await classic.install({ immutable: true, offline: true });
      expect(mockRun).toHaveBeenLastCalledWith(
        ['yarn', 'install', '--frozen-lockfile', '--offline'],
        expect.objectContaining({ cwd: '/classic' }),
      );

      const onStdout = jest.fn();
      const onStderr = jest.fn();
      await berry.install({
        immutable: false,
        offline: true,
        env: { FORCE_COLOR: 'true' },
        onStdout,
        onStderr,
      });
      expect(mockRun).toHaveBeenLastCalledWith(['yarn', 'install'], {
        cwd: '/berry',
        env: expect.objectContaining({
          YARN_ENABLE_IMMUTABLE_INSTALLS: 'false',
          YARN_ENABLE_NETWORK: '0',
          FORCE_COLOR: 'true',
          [npmConfigVar]: undefined,
        }),
        onStdout,
        onStderr,
      });
    } finally {
      if (originalValue === undefined) {
        delete process.env[npmConfigVar];
      } else {
        process.env[npmConfigVar] = originalValue;
      }
    }
  });

  it('should pack with the flag matching the yarn version', async () => {
    await classic.pack('/out/pkg.tgz', '/pkg');
    expect(mockRun).toHaveBeenLastCalledWith(
      ['yarn', 'pack', '--filename', '/out/pkg.tgz'],
      { cwd: '/pkg' },
    );

    const onStdout = jest.fn();
    await berry.pack('/out/pkg.tgz', '/pkg', { cwd: '/other', onStdout });
    expect(mockRun).toHaveBeenLastCalledWith(
      ['yarn', 'pack', '--out', '/out/pkg.tgz'],
      { cwd: '/pkg', onStdout },
    );
  });

  it('should fetch package info with yarn classic', async () => {
    mockRunOutput.mockResolvedValueOnce(
      `{"type":"inspect","data":{"the":"data"}}`,
    );
    await expect(classic.fetchPackageInfo('my-package')).resolves.toEqual({
      the: 'data',
    });
    expect(mockRunOutput).toHaveBeenLastCalledWith(
      ['yarn', 'info', '--json', 'my-package'],
      { cwd: '/classic' },
    );

    mockRunOutput.mockResolvedValueOnce('');
    await expect(classic.fetchPackageInfo('my-package')).rejects.toThrow(
      new NotFoundError(`No package information found for package my-package`),
    );

    mockRunOutput.mockResolvedValueOnce(`{"type":"other","data":{}}`);
    await expect(classic.fetchPackageInfo('my-package')).rejects.toThrow(
      'Received unknown yarn info for my-package',
    );
  });

  it('should fetch package info with yarn berry', async () => {
    mockRunOutput.mockResolvedValueOnce(`{"the":"data"}`);
    await expect(berry.fetchPackageInfo('my-package')).resolves.toEqual({
      the: 'data',
    });
    expect(mockRunOutput).toHaveBeenLastCalledWith(
      ['yarn', 'npm', 'info', '--json', 'my-package'],
      { cwd: '/berry' },
    );

    const notFound = new Error('Command failed');
    (notFound as Error & { stdout?: string }).stdout =
      'bla bla bla Response Code: 404 bla bla';
    mockRunOutput.mockRejectedValueOnce(notFound);
    await expect(berry.fetchPackageInfo('my-package')).rejects.toThrow(
      new NotFoundError(`No package information found for package my-package`),
    );

    mockRunOutput.mockRejectedValueOnce(new Error('Command failed'));
    await expect(berry.fetchPackageInfo('my-package')).rejects.toThrow(
      'Command failed',
    );
  });

  it('should load the lockfile from the workspace root and parse lockfiles', async () => {
    mockDir.setContent({
      'yarn.lock': `
a@^1:
  version: "1.0.0"
`,
    });
    mockRunOutput.mockResolvedValueOnce('4.5.0\n');
    const yarn = await Yarn.create({ workspaceRootDir: mockDir.path });

    const loaded = await yarn.loadLockfile();
    expect(loaded).toBeInstanceOf(YarnLockfile);
    expect(loaded.get('a')).toEqual([
      { range: '^1', version: '1.0.0', dataKey: 'a@^1' },
    ]);

    const parsed = await yarn.parseLockfile(`
b@^2:
  version: "2.0.0"
`);
    expect(parsed).toBeInstanceOf(YarnLockfile);
    expect(parsed.get('b')).toEqual([
      { range: '^2', version: '2.0.0', dataKey: 'b@^2' },
    ]);
  });

  it('should check the workspace root for the backstage yarn plugin', async () => {
    mockHasBackstageYarnPlugin.mockResolvedValueOnce(true);
    await expect(berry.supportsBackstageVersionProtocol()).resolves.toBe(true);
    mockHasBackstageYarnPlugin.mockResolvedValueOnce(false);
    await expect(berry.supportsBackstageVersionProtocol()).resolves.toBe(false);
    expect(mockHasBackstageYarnPlugin).toHaveBeenCalledWith('/berry');
  });
});
