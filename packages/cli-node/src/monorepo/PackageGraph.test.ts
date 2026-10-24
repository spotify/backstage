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

import { getPackages } from '@manypkg/get-packages';
import { PackageGraph } from './PackageGraph';
import { detectPackageManager, PackageManager, YarnLockfile } from '../pacman';
import { GitUtils } from '../git';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import { createMockDirectory } from '@backstage/backend-test-utils';

jest.mock('../pacman', () => ({
  ...jest.requireActual('../pacman'),
  detectPackageManager: jest.fn(),
}));

const mockListChangedFiles = jest.spyOn(GitUtils, 'listChangedFiles');
const mockReadFileAtRef = jest.spyOn(GitUtils, 'readFileAtRef');
const mockDetectPackageManager = jest.mocked(detectPackageManager);

// A Yarn package manager whose lockfile in the working tree has the given contents
function mockYarn(currentLockfile: string) {
  mockDetectPackageManager.mockResolvedValue({
    name: () => 'yarn',
    lockfileName: () => 'yarn.lock',
    loadLockfile: async () => YarnLockfile.parse(currentLockfile),
    parseLockfile: async (contents: string) => YarnLockfile.parse(contents),
  } as Partial<PackageManager> as PackageManager);
}

overrideTargetPaths('/');

const testPackages = [
  {
    dir: '/packages/a',
    packageJson: {
      name: 'a',
      version: '1.0.0',
      dependencies: {
        b: '1.0.0',
      },
      devDependencies: {
        c: '1.0.0',
      },
    },
  },
  {
    dir: '/packages/b',
    packageJson: {
      name: 'b',
      version: '1.0.0',
      devDependencies: {
        c: '1.0.0',
      },
    },
  },
  {
    dir: '/packages/c',
    packageJson: {
      name: 'c',
      version: '1.0.0',
    },
  },
];

describe('PackageGraph', () => {
  it('is able to construct a graph from this repo', async () => {
    const { packages } = await getPackages(__dirname);
    const graph = PackageGraph.fromPackages(packages);
    expect(graph.has('@backstage/cli')).toBe(true);
  });

  it('lists the packages of the installation', async () => {
    const mockDir = createMockDirectory();
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'monorepo' }),
      'pnpm-workspace.yaml':
        'packages:\n  - apps/backstage\n  - apps/backstage/packages/*\n  - libs/*\n',
      'apps/backstage/package.json': JSON.stringify({
        name: 'backstage',
        workspaces: ['packages/*'],
      }),
      'apps/backstage/packages/app/package.json': JSON.stringify({
        name: 'app',
      }),
      'libs/other/package.json': JSON.stringify({ name: 'other' }),
    });
    const listNames = async () =>
      (await PackageGraph.listTargetPackages())
        .map(pkg => pkg.packageJson.name)
        .sort();

    try {
      // A nested installation only has the packages that it lists itself
      overrideTargetPaths({
        dir: mockDir.resolve('apps/backstage/packages/app'),
        workspaceRootDir: mockDir.path,
        installationRootDir: mockDir.resolve('apps/backstage'),
      });
      await expect(listNames()).resolves.toEqual(['app']);

      // At the root of the pnpm workspace, the packages of pnpm-workspace.yaml are listed
      overrideTargetPaths(mockDir.path);
      await expect(listNames()).resolves.toEqual(['app', 'backstage', 'other']);
    } finally {
      overrideTargetPaths('/');
    }
  });

  it('creates a graph', () => {
    const graph = PackageGraph.fromPackages(testPackages);
    const a = graph.get('a');
    const b = graph.get('b');
    const c = graph.get('c');

    expect(a).toMatchObject({
      name: 'a',
      dir: '/packages/a',
      allLocalDependencies: new Map([
        ['b', b],
        ['c', c],
      ]),
      publishedLocalDependencies: new Map([['b', b]]),
      localDependencies: new Map([['b', b]]),
      localDevDependencies: new Map([['c', c]]),
      localOptionalDependencies: new Map(),
      allLocalDependents: new Map(),
      publishedLocalDependents: new Map(),
      localDependents: new Map(),
      localDevDependents: new Map(),
      localOptionalDependents: new Map(),
    });
    expect(b).toMatchObject({
      name: 'b',
      dir: '/packages/b',
      allLocalDependencies: new Map([['c', c]]),
      publishedLocalDependencies: new Map(),
      localDependencies: new Map(),
      localDevDependencies: new Map([['c', c]]),
      localOptionalDependencies: new Map(),
      allLocalDependents: new Map([['a', a]]),
      publishedLocalDependents: new Map([['a', a]]),
      localDependents: new Map([['a', a]]),
      localDevDependents: new Map(),
      localOptionalDependents: new Map(),
    });
    expect(c).toMatchObject({
      name: 'c',
      dir: '/packages/c',
      allLocalDependencies: new Map(),
      publishedLocalDependencies: new Map(),
      localDependencies: new Map(),
      localDevDependencies: new Map(),
      localOptionalDependencies: new Map(),
      allLocalDependents: new Map([
        ['a', a],
        ['b', b],
      ]),
      publishedLocalDependents: new Map(),
      localDependents: new Map(),
      localDevDependents: new Map([
        ['a', a],
        ['b', b],
      ]),
      localOptionalDependents: new Map(),
    });
  });

  it('collects package names', () => {
    const graph = PackageGraph.fromPackages(testPackages);

    expect(graph.collectPackageNames(['a'], () => undefined)).toEqual(
      new Set(['a']),
    );
    expect(
      graph.collectPackageNames(['a'], pkg => pkg.localDependencies.keys()),
    ).toEqual(new Set(['a', 'b']));
    expect(
      graph.collectPackageNames(['a'], pkg => pkg.localDevDependencies.keys()),
    ).toEqual(new Set(['a', 'c']));
    expect(
      graph.collectPackageNames(['b', 'a'], pkg =>
        pkg.localDevDependencies.keys(),
      ),
    ).toEqual(new Set(['b', 'a', 'c']));

    // Should not get stuck in cycles
    expect(graph.collectPackageNames(['a'], () => ['a', 'b', 'c'])).toEqual(
      new Set(['b', 'a', 'c']),
    );

    // Throws on unknown packages
    expect(() => graph.collectPackageNames(['a'], () => ['unknown'])).toThrow(
      `Package 'unknown' not found`,
    );
  });

  it('lists changed packages', async () => {
    const graph = PackageGraph.fromPackages(testPackages);

    mockListChangedFiles.mockResolvedValueOnce(
      [
        'README.md',
        'packages/a/src/foo.ts',
        'packages/a/src/bar.ts',
        'packages/b/package.json',
        'packages/f/src/foo.ts',
        'packages/f/README.md',
        'plugins/foo/src/index.ts',
      ].sort(),
    );

    await expect(
      graph.listChangedPackages({ ref: 'origin/master' }),
    ).resolves.toEqual([graph.get('a'), graph.get('b')]);
  });

  it('lists changed packages with lockfile analysis', async () => {
    const graph = PackageGraph.fromPackages(testPackages);

    mockListChangedFiles.mockResolvedValueOnce(
      ['README.md', 'packages/a/src/foo.ts', 'yarn.lock'].sort(),
    );
    mockReadFileAtRef.mockResolvedValueOnce(`
a@^1:
  version: "1.0.0"

c@^1:
  version: "1.0.0"
  dependencies:
      c-dep: ^1

c-dep@^2:
  version: "2.0.0"
  integrity: sha512-xyz
`);
    mockYarn(`
a@^1:
  version: "1.0.0"

c@^1:
  version: "1.0.0"
  dependencies:
      c-dep: ^1

c-dep@^2:
  version: "2.0.0"
  integrity: sha512-xyz-other
`);

    await expect(
      graph
        .listChangedPackages({
          ref: 'origin/master',
          analyzeLockfile: true,
        })
        .then(pkgs => pkgs.map(pkg => pkg.name)),
    ).resolves.toEqual(['a', 'c']);

    expect(mockReadFileAtRef).toHaveBeenCalledWith(
      'yarn.lock',
      'origin/master',
    );
  });

  it('detects packages affected by a removed dependency in the lockfile', async () => {
    const graph = PackageGraph.fromPackages(testPackages);

    mockListChangedFiles.mockResolvedValueOnce(['yarn.lock']);

    // The old lockfile (at the ref) has b depending on b-dep
    mockReadFileAtRef.mockResolvedValueOnce(`
a@^1:
  version: "1.0.0"

b@^1:
  version: "1.0.0"
  dependencies:
      b-dep: ^1

b-dep@^1:
  version: "1.0.0"
  integrity: sha512-old

c@^1:
  version: "1.0.0"
`);

    // The current lockfile no longer has b-dep at all
    mockYarn(`
a@^1:
  version: "1.0.0"

b@^1:
  version: "1.0.0"

c@^1:
  version: "1.0.0"
`);

    await expect(
      graph
        .listChangedPackages({
          ref: 'origin/master',
          analyzeLockfile: true,
        })
        .then(pkgs => pkgs.map(pkg => pkg.name)),
    ).resolves.toEqual(['b']);
  });

  it('assumes that all packages changed when the lockfile cannot be diffed', async () => {
    const graph = PackageGraph.fromPackages(testPackages);
    const allPackages = Array.from(graph.values());
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockYarn(`
a@^1:
  version: "1.0.0"
`);

    // A lockfile of another package manager can't be diffed with this one
    mockListChangedFiles.mockResolvedValueOnce([
      'packages/a/src/foo.ts',
      'pnpm-lock.yaml',
    ]);
    await expect(
      graph.listChangedPackages({
        ref: 'origin/master',
        analyzeLockfile: true,
      }),
    ).resolves.toEqual(allPackages);
    expect(warn).toHaveBeenLastCalledWith(
      expect.stringContaining(
        'pnpm-lock.yaml does not belong to yarn, which uses yarn.lock',
      ),
    );

    // Workspace packages in the lockfile at the ref are named from that ref
    const parseLockfile = jest.fn(async () => {
      throw new Error('the workspace packages could not be named');
    });
    mockDetectPackageManager.mockResolvedValueOnce({
      name: () => 'pnpm',
      lockfileName: () => 'pnpm-lock.yaml',
      loadLockfile: async () => YarnLockfile.parse(''),
      parseLockfile,
    } as Partial<PackageManager> as PackageManager);
    mockListChangedFiles.mockResolvedValueOnce(['pnpm-lock.yaml']);
    mockReadFileAtRef
      .mockResolvedValueOnce('lockfileVersion: 9.0')
      .mockResolvedValueOnce('{"name":"a"}')
      .mockRejectedValueOnce(new Error('does not exist'));
    await expect(
      graph.listChangedPackages({
        ref: 'origin/master',
        analyzeLockfile: true,
      }),
    ).resolves.toEqual(allPackages);
    const [contents, parseOptions] = (parseLockfile.mock
      .calls[0] as unknown as Parameters<PackageManager['parseLockfile']>)!;
    expect(contents).toBe('lockfileVersion: 9.0');
    await expect(
      parseOptions?.readWorkspacePackageJson?.('packages/a'),
    ).resolves.toEqual({ name: 'a' });
    await expect(
      parseOptions?.readWorkspacePackageJson?.('packages/gone'),
    ).resolves.toBeUndefined();
    expect(mockReadFileAtRef).toHaveBeenCalledWith(
      'packages/a/package.json',
      'origin/master',
    );

    // Nor can a lockfile that doesn't exist at the ref
    mockListChangedFiles.mockResolvedValueOnce(['yarn.lock']);
    mockReadFileAtRef.mockRejectedValueOnce(
      new Error("path 'yarn.lock' does not exist in 'origin/master'"),
    );
    await expect(
      graph.listChangedPackages({
        ref: 'origin/master',
        analyzeLockfile: true,
      }),
    ).resolves.toEqual(allPackages);
    expect(warn).toHaveBeenLastCalledWith(
      expect.stringContaining('does not exist'),
    );

    // Without lockfile analysis only the changed packages are listed
    mockListChangedFiles.mockResolvedValueOnce([
      'packages/a/src/foo.ts',
      'pnpm-lock.yaml',
    ]);
    await expect(
      graph.listChangedPackages({ ref: 'origin/master' }),
    ).resolves.toEqual([graph.get('a')]);
    expect(warn).toHaveBeenCalledTimes(3);
    warn.mockRestore();
  });
});
