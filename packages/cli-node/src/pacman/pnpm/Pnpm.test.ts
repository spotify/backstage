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
import { Pnpm } from './Pnpm';
import { PnpmLockfile } from './PnpmLockfile';

jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  run: jest.fn(),
  runOutput: jest.fn(),
}));

const mockRun = jest.mocked(run);
const mockRunOutput = jest.mocked(runOutput);

const mockDir = createMockDirectory();

const mockLockfile = `
lockfileVersion: '9.0'

importers:

  .:
    dependencies:
      a:
        specifier: ^1
        version: 1.0.0

  packages/b:
    dependencies:
      a:
        specifier: ^1
        version: 1.0.0

packages:

  a@1.0.0:
    resolution: {integrity: sha512-abc}

snapshots:

  a@1.0.0: {}
`;

describe('Pnpm', () => {
  let pnpm: Pnpm;

  // The pnpm lockfile libraries are ES modules, which are slow to load the
  // first time in tests
  beforeAll(async () => {
    await import('@pnpm/lockfile.fs');
    await import('@pnpm/deps.path');
  }, 60_000);

  beforeAll(async () => {
    pnpm = await Pnpm.create({ workspaceRootDir: '/project' });
    mockRunOutput.mockResolvedValueOnce('12.7.0\n');
    await pnpm.version();
  });

  beforeEach(() => {
    mockRun.mockReturnValue({
      waitForExit: async () => {},
    } as unknown as ReturnType<typeof run>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should detect the pnpm version when pnpm first runs, and require 11.28 or 12.7', async () => {
    expect(mockRunOutput).toHaveBeenCalledWith(['pnpm', '--version'], {
      cwd: '/project',
      env: { pnpm_config_lockfile: 'false' },
    });
    mockRunOutput.mockClear();

    // Creating an instance and reading files does not run pnpm
    const lazy = await Pnpm.create({ workspaceRootDir: '/lazy' });
    expect(lazy.name()).toBe('pnpm');
    expect(lazy.lockfileName()).toBe('pnpm-lock.yaml');
    expect(lazy.toString()).toBe('pnpm');
    await expect(lazy.supportsBackstageVersionProtocol()).resolves.toBe(false);
    expect(lazy.getCommandHint(['backstage-cli', 'repo', 'fix'])).toBe(
      'pnpm backstage-cli repo fix',
    );
    expect(mockRunOutput).not.toHaveBeenCalled();

    // The version is detected once, the first time it is needed
    mockRunOutput.mockResolvedValueOnce('12.7.0\n');
    await lazy.run(['install']);
    await expect(lazy.version()).resolves.toBe('12.7.0');
    expect(mockRunOutput).toHaveBeenCalledTimes(1);
    expect(mockRun).toHaveBeenCalledTimes(1);

    for (const version of ['12.6.0', '11.27.0', '10.30.0']) {
      mockRunOutput.mockResolvedValueOnce(`${version}\n`);
      const old = await Pnpm.create({ workspaceRootDir: `/old-${version}` });
      const message = `pnpm ${version} is not supported, use pnpm 11.28 or a later 11.x release, or pnpm 12.7 or later`;
      await expect(old.run(['install'])).rejects.toThrow(message);
      await expect(old.fetchPackageInfo('a')).rejects.toThrow(message);
      // The version can still be reported
      await expect(old.version()).resolves.toBe(version);
    }
    expect(mockRun).toHaveBeenCalledTimes(1);

    for (const version of ['11.28.0', '11.30.1', '13.0.0-rc.1']) {
      mockRunOutput.mockResolvedValueOnce(`${version}\n`);
      const supported = await Pnpm.create({
        workspaceRootDir: `/new-${version}`,
      });
      await expect(supported.run(['install'])).resolves.toBeUndefined();
    }
    expect(mockRun).toHaveBeenCalledTimes(4);

    // A failed version check is not cached
    const flaky = await Pnpm.create({ workspaceRootDir: '/flaky' });
    mockRunOutput.mockRejectedValueOnce(new Error('command not found'));
    await expect(flaky.run(['install'])).rejects.toThrow(
      'Failed to determine pnpm version',
    );
    mockRunOutput.mockResolvedValueOnce('12.14.0\n');
    await expect(flaky.run(['install'])).resolves.toBeUndefined();
  });

  it('should run commands and scripts in the workspace root by default', async () => {
    await pnpm.run(['--version']);
    expect(mockRun).toHaveBeenLastCalledWith(['pnpm', '--version'], {
      cwd: '/project',
    });

    await pnpm.runScript('lint', ['--fix'], { cwd: '/project/packages/a' });
    expect(mockRun).toHaveBeenLastCalledWith(['pnpm', 'run', 'lint', '--fix'], {
      cwd: '/project/packages/a',
    });

    await pnpm.runWorkspaceScript('backend', 'start', ['--inspect']);
    expect(mockRun).toHaveBeenLastCalledWith(
      ['pnpm', '--filter', 'backend', 'run', 'start', '--inspect'],
      { cwd: '/project' },
    );

    const onStdout = jest.fn();
    await pnpm.pack('/out/pkg.tgz', '/pkg', { cwd: '/other', onStdout });
    expect(mockRun).toHaveBeenLastCalledWith(
      ['pnpm', 'pack', '--out', '/out/pkg.tgz'],
      { cwd: '/pkg', onStdout },
    );
  });

  it('should install dependencies in the workspace root', async () => {
    const npmConfigVar = 'npm_config_backstage_pnpm_test';
    const originalValue = process.env[npmConfigVar];
    process.env[npmConfigVar] = 'value';

    try {
      await pnpm.install();
      expect(mockRun).toHaveBeenLastCalledWith(['pnpm', 'install'], {
        cwd: '/project',
        env: expect.objectContaining({
          PATH: process.env.PATH,
          [npmConfigVar]: undefined,
        }),
        onStdout: undefined,
        onStderr: undefined,
      });

      await pnpm.install({ immutable: true, offline: true });
      expect(mockRun).toHaveBeenLastCalledWith(
        ['pnpm', 'install', '--frozen-lockfile', '--offline'],
        expect.objectContaining({ cwd: '/project' }),
      );

      const onStdout = jest.fn();
      const onStderr = jest.fn();
      await pnpm.install({
        immutable: false,
        env: { FORCE_COLOR: 'true' },
        onStdout,
        onStderr,
      });
      expect(mockRun).toHaveBeenLastCalledWith(
        ['pnpm', 'install', '--no-frozen-lockfile'],
        {
          cwd: '/project',
          env: expect.objectContaining({ FORCE_COLOR: 'true' }),
          onStdout,
          onStderr,
        },
      );
    } finally {
      if (originalValue === undefined) {
        delete process.env[npmConfigVar];
      } else {
        process.env[npmConfigVar] = originalValue;
      }
    }
  });

  it('should fetch package info with pnpm view', async () => {
    mockRunOutput.mockResolvedValueOnce(
      JSON.stringify({
        name: 'my-package',
        'dist-tags': { latest: '1.0.0' },
        versions: ['1.0.0'],
        time: { '1.0.0': '2026-01-01T00:00:00.000Z' },
        description: 'not part of the result',
      }),
    );
    await expect(pnpm.fetchPackageInfo('my-package')).resolves.toEqual({
      name: 'my-package',
      'dist-tags': { latest: '1.0.0' },
      versions: ['1.0.0'],
      time: { '1.0.0': '2026-01-01T00:00:00.000Z' },
    });
    expect(mockRunOutput).toHaveBeenLastCalledWith(
      ['pnpm', 'view', 'my-package', '--json'],
      { cwd: '/project' },
    );

    // pnpm exits with an error and prints the error as JSON for a missing package
    const notFound = new Error('Command failed');
    (notFound as Error & { stdout?: string }).stdout = JSON.stringify({
      error: { code: 'ERR_PNPM_FETCH_404', message: 'Not Found - 404' },
    });
    mockRunOutput.mockRejectedValueOnce(notFound);
    await expect(pnpm.fetchPackageInfo('my-package')).rejects.toThrow(
      new NotFoundError(`No package information found for package my-package`),
    );

    mockRunOutput.mockResolvedValueOnce('');
    await expect(pnpm.fetchPackageInfo('my-package')).rejects.toThrow(
      NotFoundError,
    );

    mockRunOutput.mockResolvedValueOnce(
      JSON.stringify({ error: { code: 'ERR_PNPM_X', message: 'Nope' } }),
    );
    await expect(pnpm.fetchPackageInfo('my-package')).rejects.toThrow(
      'Failed to fetch package information for my-package, Nope',
    );

    mockRunOutput.mockRejectedValueOnce(new Error('Command failed'));
    await expect(pnpm.fetchPackageInfo('my-package')).rejects.toThrow(
      'Command failed',
    );
  });

  it('should load the lockfile and name workspace packages from the workspace root', async () => {
    mockDir.setContent({
      'pnpm-lock.yaml': mockLockfile,
      'package.json': JSON.stringify({ name: 'root' }),
      packages: { b: { 'package.json': JSON.stringify({ name: 'b' }) } },
    });
    const local = await Pnpm.create({ workspaceRootDir: mockDir.path });

    const loaded = await local.loadLockfile();
    expect(loaded).toBeInstanceOf(PnpmLockfile);
    expect([...loaded.keys()].sort()).toEqual(['a', 'b', 'root']);
    expect(loaded.get('a')).toEqual([{ range: '^1', version: '1.0.0' }]);
    expect(loaded.get('b')).toEqual([
      { range: 'workspace:packages/b', version: 'link:packages/b' },
    ]);

    // Without a way to read the workspace packages they can't be named
    const parsed = await local.parseLockfile(mockLockfile);
    expect([...parsed.keys()].sort()).toEqual(['.', 'a', 'packages/b']);
    expect(() => parsed.diff(loaded)).toThrow(
      'The workspace packages in pnpm-lock.yaml could not be named',
    );

    const named = await local.parseLockfile(mockLockfile, {
      readWorkspacePackageJson: async dir => ({
        name: dir === '.' ? 'root' : 'b',
      }),
    });
    expect(named.diff(loaded)).toEqual({ added: [], changed: [], removed: [] });
  });
});
