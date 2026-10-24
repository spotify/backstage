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

import fs from 'fs-extra';
import { join as joinPath } from 'node:path';
import { PnpmLockfile } from './PnpmLockfile';

const fixturesDir = joinPath(__dirname, '__fixtures__');
const pinnedDir = joinPath(fixturesDir, 'pinned');

async function readFixture(name: string) {
  return fs.readFile(joinPath(fixturesDir, name, 'pnpm-lock.yaml'), 'utf8');
}

// Names workspace packages after their directory
const namedByDir = {
  readWorkspacePackageJson: async (dir: string) => ({
    name: dir === '.' ? 'root' : `@fixture/${dir.split('/').pop()}`,
  }),
};

// Reads the workspace packages of the fixture workspace
const fromPinnedDir = {
  readWorkspacePackageJson: (dir: string) =>
    fs
      .readJson(joinPath(pinnedDir, dir, 'package.json'))
      .catch(() => undefined),
};

const PNPM_PACKAGES = ['pnpm', '@pnpm/exe.linux-x64', '@pnpm/exe.darwin-arm64'];

describe('PnpmLockfile', () => {
  // The pnpm lockfile libraries are ES modules, which are slow to load the
  // first time in tests
  beforeAll(async () => {
    await import('@pnpm/lockfile.fs');
    await import('@pnpm/deps.path');
  }, 60_000);

  it('should load a lockfile with a pinned package manager', async () => {
    const lockfile = await PnpmLockfile.load(
      joinPath(pinnedDir, 'pnpm-lock.yaml'),
      fromPinnedDir,
    );

    // The packages of the pinned package manager live in the first document
    // and must be ignored, while the workspace projects are named through
    // their package.json files
    expect([...lockfile.keys()].sort()).toEqual([
      '@fixture/a',
      '@fixture/b',
      'fixture-root',
      'is-number',
      'is-odd',
      'js-tokens',
      'kind-of',
      'loose-envify',
      'my-alias',
      'react',
      'react-dom',
      'scheduler',
    ]);
    for (const name of PNPM_PACKAGES) {
      expect(lockfile.get(name)).toBeUndefined();
    }

    // Direct dependencies use the specifier as range, transitive ones the version
    expect(lockfile.get('is-number')).toEqual([
      { range: '6.0.0', version: '6.0.0' },
      { range: '^7.0.0', version: '7.0.0' },
    ]);
    expect(lockfile.get('is-odd')).toEqual([
      { range: '^3.0.0', version: '3.0.1' },
    ]);
    expect(lockfile.get('loose-envify')).toEqual([
      { range: '1.4.0', version: '1.4.0' },
    ]);
    // Optional dependencies
    expect(lockfile.get('kind-of')).toEqual([
      { range: '^6.0.0', version: '6.0.3' },
    ]);
    // Aliased packages keep the alias name and the version of the real package
    expect(lockfile.get('my-alias')).toEqual([
      { range: 'is-odd@^3.0.0', version: '3.0.1' },
    ]);
    // Peer dependency suffixes are stripped from the version
    expect(lockfile.get('react-dom')).toEqual([
      { range: '^18.3.1', version: '18.3.1' },
    ]);
    expect(lockfile.get('react')).toEqual([
      { range: '^18.3.1', version: '18.3.1' },
    ]);
    // Workspace projects, both as dependencies and as projects, with links
    // relative to the workspace root
    expect(lockfile.get('@fixture/b')).toEqual([
      { range: 'workspace:^', version: 'link:packages/b' },
      { range: 'workspace:packages/b', version: 'link:packages/b' },
    ]);
    expect(lockfile.get('@fixture/a')).toEqual([
      { range: 'workspace:packages/a', version: 'link:packages/a' },
    ]);
    expect(lockfile.get('fixture-root')).toEqual([
      { range: 'workspace:.', version: 'link:.' },
    ]);
    expect(lockfile.get('nonexistent')).toBeUndefined();
  });

  it('should parse both lockfile layouts the same way', async () => {
    const pinned = await PnpmLockfile.parse(await readFixture('pinned'));
    const unpinned = await PnpmLockfile.parse(await readFixture('unpinned'));

    // Without a way to read the workspace packages, they are listed under
    // their directory instead of their name
    const keys = [...unpinned.keys()].sort();
    expect(keys).toEqual(
      expect.arrayContaining(['.', 'packages/a', 'packages/b', '@fixture/b']),
    );
    expect(keys).not.toContain('@fixture/a');
    expect(keys).not.toContain('fixture-root');
    for (const name of PNPM_PACKAGES) {
      expect(keys).not.toContain(name);
    }

    expect([...pinned.keys()].sort()).toEqual(keys);
    for (const name of keys) {
      expect(pinned.get(name)).toEqual(unpinned.get(name));
    }
    expect(unpinned.get('@fixture/b')).toEqual([
      { range: 'workspace:^', version: 'link:packages/b' },
    ]);
    expect(unpinned.get('packages/b')).toEqual([
      { range: 'workspace:packages/b', version: 'link:packages/b' },
    ]);
    expect(unpinned.get('is-number')).toEqual([
      { range: '6.0.0', version: '6.0.0' },
      { range: '^7.0.0', version: '7.0.0' },
    ]);
  });

  it('should create a simplified dependency graph', async () => {
    const lockfile = await PnpmLockfile.load(
      joinPath(pinnedDir, 'pnpm-lock.yaml'),
      fromPinnedDir,
    );
    const graph = lockfile.createSimplifiedDependencyGraph();

    expect([...graph.keys()].sort()).toEqual([...lockfile.keys()].sort());
    expect(graph.get('fixture-root')).toEqual(new Set(['is-number']));
    expect(graph.get('@fixture/a')).toEqual(
      new Set(['@fixture/b', 'my-alias', 'react', 'react-dom', 'kind-of']),
    );
    expect(graph.get('@fixture/b')).toEqual(new Set(['is-odd']));
    // Resolved peer dependencies are part of the snapshot dependencies
    expect(graph.get('react-dom')).toEqual(
      new Set(['loose-envify', 'react', 'scheduler']),
    );
    expect(graph.get('react')).toEqual(new Set(['loose-envify']));
    // Aliases resolve to the dependencies of the real package
    expect(graph.get('my-alias')).toEqual(new Set(['is-number']));
    expect(graph.get('is-odd')).toEqual(new Set(['is-number']));
    expect(graph.get('js-tokens')).toEqual(new Set());
    expect(graph.get('kind-of')).toEqual(new Set());
  });

  it('should diff lockfiles', async () => {
    const pinned = await PnpmLockfile.load(
      joinPath(pinnedDir, 'pnpm-lock.yaml'),
      fromPinnedDir,
    );
    const bumped = await PnpmLockfile.parse(
      await readFixture('bumped'),
      fromPinnedDir,
    );

    expect(pinned.diff(pinned)).toEqual({
      added: [],
      changed: [],
      removed: [],
    });

    // kind-of is downgraded from 6.0.3 to 6.0.2 with the same range
    expect(bumped.diff(pinned)).toEqual({
      added: [],
      changed: [{ name: 'kind-of', range: '^6.0.0' }],
      removed: [],
    });
    expect(pinned.diff(bumped)).toEqual({
      added: [],
      changed: [{ name: 'kind-of', range: '^6.0.0' }],
      removed: [],
    });

    const small = await PnpmLockfile.parse(
      `
lockfileVersion: '9.0'

importers:

  .:
    devDependencies:
      is-number:
        specifier: ^7.0.0
        version: 7.0.0
      react:
        specifier: ^18.0.0
        version: 18.3.1

packages:

  is-number@7.0.0:
    resolution: {integrity: sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==}

  react@18.3.1:
    resolution: {integrity: sha512-wS+hAgJShR0KhEvPJArfuPVN1+Hz1t0Y6n5jLrGQbkb4urgPE/0Rve+1kMB1v/oWgHgm4WIcV+i7F2pTVj+2iQ==}

  foo@1.0.0:
    resolution: {integrity: sha512-foo}

snapshots:

  is-number@7.0.0: {}

  react@18.3.1: {}

  foo@1.0.0: {}
`,
      { readWorkspacePackageJson: async () => ({ name: 'fixture-root' }) },
    );

    const diff = small.diff(pinned);
    expect(diff.changed).toEqual([]);
    expect(diff.added).toEqual([
      { name: 'react', range: '^18.0.0' },
      { name: 'foo', range: '1.0.0' },
    ]);
    // Everything but is-number@^7.0.0 and the root, which both lockfiles share
    expect(diff.removed).toHaveLength(
      [...pinned.keys()].flatMap(name => pinned.get(name)!).length - 2,
    );
    expect(diff.removed).toEqual(
      expect.arrayContaining([
        { name: 'is-number', range: '6.0.0' },
        { name: 'react', range: '^18.3.1' },
        { name: 'my-alias', range: 'is-odd@^3.0.0' },
        { name: '@fixture/b', range: 'workspace:^' },
        { name: '@fixture/b', range: 'workspace:packages/b' },
      ]),
    );
    expect(diff.removed).not.toContainEqual({
      name: 'is-number',
      range: '^7.0.0',
    });

    expect(() =>
      pinned.diff({
        get: () => undefined,
        keys: () => [][Symbol.iterator](),
        createSimplifiedDependencyGraph: () => new Map(),
        diff: () => ({ added: [], changed: [], removed: [] }),
        getDependencyTreeHash: () => '',
      }),
    ).toThrow('A pnpm-lock.yaml file can only be diffed with another one');

    // Changes can't be attributed to workspace packages without their names
    const unnamed = await PnpmLockfile.parse(await readFixture('pinned'));
    expect(() => unnamed.diff(pinned)).toThrow(
      'The workspace packages in pnpm-lock.yaml could not be named',
    );
    expect(() => pinned.diff(unnamed)).toThrow(
      'The workspace packages in pnpm-lock.yaml could not be named',
    );
  });

  it('should generate dependency tree hashes', async () => {
    const pinned = await PnpmLockfile.load(
      joinPath(pinnedDir, 'pnpm-lock.yaml'),
      fromPinnedDir,
    );
    const unpinned = await PnpmLockfile.parse(
      await readFixture('unpinned'),
      fromPinnedDir,
    );
    const bumped = await PnpmLockfile.parse(
      await readFixture('bumped'),
      fromPinnedDir,
    );

    const hashA = pinned.getDependencyTreeHash('@fixture/a');
    expect(hashA).toMatch(/^[0-9a-f]{40}$/);
    expect(unpinned.getDependencyTreeHash('@fixture/a')).toBe(hashA);

    // @fixture/a depends on kind-of, which is bumped, while @fixture/b does not
    expect(bumped.getDependencyTreeHash('@fixture/a')).not.toBe(hashA);
    expect(bumped.getDependencyTreeHash('@fixture/b')).toBe(
      pinned.getDependencyTreeHash('@fixture/b'),
    );
    expect(bumped.getDependencyTreeHash('react-dom')).toBe(
      pinned.getDependencyTreeHash('react-dom'),
    );
    expect(pinned.getDependencyTreeHash('@fixture/a')).not.toBe(
      pinned.getDependencyTreeHash('@fixture/b'),
    );

    expect(() => pinned.getDependencyTreeHash('nonexistent')).toThrow(
      "Package 'nonexistent' not found in lockfile",
    );
  });

  it('should collapse links to the same workspace project from different depths', async () => {
    const withDeep = await PnpmLockfile.parse(
      `
lockfileVersion: '9.0'

importers:

  .:
    dependencies:
      '@fixture/b':
        specifier: workspace:^
        version: link:packages/b
      external:
        specifier: link:../external
        version: link:../external

  packages/a:
    dependencies:
      '@fixture/b':
        specifier: workspace:^
        version: link:../b

  packages/nested/deep/c:
    dependencies:
      '@fixture/b':
        specifier: workspace:^
        version: link:../../../b

  packages/b:
    dependencies:
      is-number:
        specifier: ^7.0.0
        version: 7.0.0

packages:

  is-number@7.0.0:
    resolution: {integrity: sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==}

snapshots:

  is-number@7.0.0: {}
`,
      namedByDir,
    );

    // The link version is relative to the workspace root, no matter the
    // depth of the project that depends on it
    expect(withDeep.get('@fixture/b')).toEqual([
      { range: 'workspace:^', version: 'link:packages/b' },
      { range: 'workspace:packages/b', version: 'link:packages/b' },
    ]);
    // Links outside of the workspace keep their relative path
    expect(withDeep.get('external')).toEqual([
      { range: 'link:../external', version: 'link:../external' },
    ]);

    // Adding a dependent at another depth does not affect the dependency
    const withoutDeep = await PnpmLockfile.parse(
      `
lockfileVersion: '9.0'

importers:

  .:
    dependencies:
      '@fixture/b':
        specifier: workspace:^
        version: link:packages/b

  packages/b:
    dependencies:
      is-number:
        specifier: ^7.0.0
        version: 7.0.0

packages:

  is-number@7.0.0:
    resolution: {integrity: sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==}

snapshots:

  is-number@7.0.0: {}
`,
      namedByDir,
    );
    expect(withoutDeep.get('@fixture/b')).toEqual(withDeep.get('@fixture/b'));
    expect(withDeep.getDependencyTreeHash('@fixture/b')).toBe(
      withoutDeep.getDependencyTreeHash('@fixture/b'),
    );
    expect(withDeep.diff(withoutDeep)).toEqual({
      added: [
        { name: 'external', range: 'link:../external' },
        { name: '@fixture/a', range: 'workspace:packages/a' },
        { name: '@fixture/c', range: 'workspace:packages/nested/deep/c' },
      ],
      changed: [],
      removed: [],
    });
  });

  it('should reject lockfiles that cannot be parsed', async () => {
    await expect(
      PnpmLockfile.parse(`lockfileVersion: '6.0'\n`),
    ).rejects.toThrow(
      "Unsupported pnpm-lock.yaml version '6.0', only version 9 lockfiles are supported",
    );
    await expect(PnpmLockfile.parse('')).rejects.toThrow(
      'Failed pnpm-lock.yaml parse, the lockfile is empty',
    );
    await expect(PnpmLockfile.parse('importers: [\n')).rejects.toThrow(
      'Failed pnpm-lock.yaml parse',
    );
    await expect(
      PnpmLockfile.parse(`lockfileVersion: '9.0'\nsnapshots:\n  nope: {}\n`),
    ).rejects.toThrow("Failed to parse pnpm-lock.yaml package 'nope'");
  });
});
