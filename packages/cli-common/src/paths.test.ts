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

/* eslint-disable no-restricted-syntax */
import fs from 'node:fs';
import os from 'node:os';
import { dirname, resolve as resolvePath } from 'node:path';
import {
  findPaths,
  findRootPath,
  findOwnRootDir,
  findOwnPaths,
  targetPaths,
} from './paths';
import { overrideTargetPaths } from './testUtils';

describe('paths', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('findOwnPaths and findOwnRootDir should find own paths', () => {
    const own = findOwnPaths(__dirname);
    const root = findOwnRootDir(own.dir);

    expect(own.dir).toBe(resolvePath(__dirname, '..'));
    expect(root).toBe(resolvePath(__dirname, '../../..'));
  });

  it('findRootPath should find a root path', () => {
    expect(findRootPath(__dirname, () => true)).toBe(
      resolvePath(__dirname, '..'),
    );

    expect(findRootPath(__dirname, () => false)).toBeUndefined();

    expect(
      findRootPath(
        __dirname,
        path => path !== resolvePath(__dirname, '../package.json'),
      ),
    ).toBe(resolvePath(__dirname, '../../..'));
  });

  it('findPaths should find package paths', () => {
    const dir = resolvePath(__dirname, '..');
    const root = resolvePath(__dirname, '../../..');

    jest.spyOn(process, 'cwd').mockReturnValue(dir);

    const paths = findPaths(__dirname);

    expect(paths.ownDir).toBe(dir);
    expect(paths.ownRoot).toBe(root);
    expect(paths.resolveOwn('./derp.txt')).toBe(resolvePath(dir, 'derp.txt'));
    expect(paths.resolveOwnRoot('./derp.txt')).toBe(
      resolvePath(root, 'derp.txt'),
    );
    expect(paths.targetDir).toBe(dir);
    expect(paths.targetRoot).toBe(root);
    expect(paths.resolveTarget('./derp.txt')).toBe(
      resolvePath(dir, 'derp.txt'),
    );
    expect(paths.resolveTargetRoot('./derp.txt')).toBe(
      resolvePath(root, 'derp.txt'),
    );
  });

  it('findPaths should find mocked package paths', () => {
    const mockCwd = resolvePath(__dirname, '../../config');
    const mockDir = resolvePath(__dirname, '../../cli');
    const root = resolvePath(__dirname, '../../..');

    jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);

    const paths = findPaths(resolvePath(mockDir, 'src/lib'));

    expect(paths.ownDir).toBe(mockDir);
    expect(paths.ownRoot).toBe(root);
    expect(paths.resolveOwn('./derp.txt')).toBe(
      resolvePath(mockDir, 'derp.txt'),
    );
    expect(paths.resolveOwnRoot('./derp.txt')).toBe(
      resolvePath(root, 'derp.txt'),
    );
    expect(paths.targetDir).toBe(mockCwd);
    expect(paths.targetRoot).toBe(root);
    expect(paths.resolveTarget('./derp.txt')).toBe(
      resolvePath(mockCwd, 'derp.txt'),
    );
    expect(paths.resolveTargetRoot('./derp.txt')).toBe(
      resolvePath(root, 'derp.txt'),
    );
  });

  it('findPaths should find workspace root with object', () => {
    jest
      .spyOn(JSON, 'parse')
      .mockReturnValue({ workspaces: { packages: ['packages/*'] } });
    jest.spyOn(process, 'cwd').mockReturnValue(__dirname);

    const paths = findPaths(__dirname);

    expect(paths.targetDir).toBe(
      resolvePath(__dirname, '../../cli-common/src'),
    );
    expect(paths.targetRoot).toBe(resolvePath(__dirname, '../../cli-common'));
  });

  it('findPaths should find workspace root with array', () => {
    jest.spyOn(JSON, 'parse').mockReturnValue({ workspaces: ['packages/*'] });
    jest.spyOn(process, 'cwd').mockReturnValue(__dirname);

    const paths = findPaths(__dirname);

    expect(paths.targetDir).toBe(
      resolvePath(__dirname, '../../cli-common/src'),
    );
    expect(paths.targetRoot).toBe(resolvePath(__dirname, '../../cli-common'));
  });
});

describe('targetPaths', () => {
  let tmpDir: string;

  beforeAll(() => {
    tmpDir = fs.realpathSync(
      fs.mkdtempSync(resolvePath(os.tmpdir(), 'cli-common-paths-')),
    );
    const files: Record<string, string> = {
      // A pnpm workspace with Backstage installations in subdirectories,
      // which a workspaces field marks, and one backstage.json at the top
      'pnpm/package.json': '{}',
      'pnpm/pnpm-workspace.yaml': 'packages:\n  - apps/**\n  - libs/*\n',
      'pnpm/backstage.json': '{}',
      'pnpm/apps/backstage/package.json': JSON.stringify({
        workspaces: ['packages/*'],
      }),
      'pnpm/apps/backstage/packages/backend/package.json': '{}',
      // A second installation with a backstage.json of its own
      'pnpm/apps/second/package.json': JSON.stringify({
        workspaces: ['packages/*'],
      }),
      'pnpm/apps/second/backstage.json': '{}',
      'pnpm/apps/second/packages/app/package.json': '{}',
      'pnpm/libs/other/package.json': '{}',
      // A separate Yarn project inside the pnpm workspace
      'pnpm/tools/yarn-project/package.json': JSON.stringify({
        workspaces: ['packages/*'],
      }),
      'pnpm/tools/yarn-project/yarn.lock': '',
      'pnpm/tools/yarn-project/packages/a/package.json': '{}',
      // A Yarn project that has no yarn.lock or .yarnrc.yml yet
      'pnpm/tools/new-yarn-project/package.json': JSON.stringify({
        workspaces: ['packages/*'],
      }),
      'pnpm/tools/new-yarn-project/packages/a/package.json': '{}',
      // A pnpm app, which has no workspaces field
      'pnpm-app/package.json': '{}',
      'pnpm-app/pnpm-workspace.yaml': 'packages:\n  - packages/*\n',
      'pnpm-app/backstage.json': '{}',
      'pnpm-app/packages/backend/package.json': '{}',
      // A Yarn workspace with the Backstage installation at the root
      'yarn/package.json': JSON.stringify({ workspaces: ['packages/*'] }),
      'yarn/backstage.json': '{}',
      'yarn/packages/app/package.json': '{}',
      // A package that is not part of any workspace
      'standalone/package.json': '{}',
    };
    for (const [path, content] of Object.entries(files)) {
      fs.mkdirSync(dirname(resolvePath(tmpDir, path)), { recursive: true });
      fs.writeFileSync(resolvePath(tmpDir, path), content);
    }
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('finds the workspace and installation roots and re-resolves them when the working directory changes', () => {
    const cwd = jest.spyOn(process, 'cwd');
    const expectRoots = (
      dir: string,
      workspaceRootDir: string,
      installationRootDir: string,
      backstageJsonPath: string,
    ) => {
      cwd.mockReturnValue(resolvePath(tmpDir, dir));
      expect(targetPaths.dir).toBe(resolvePath(tmpDir, dir));
      expect(targetPaths.workspaceRootDir).toBe(
        resolvePath(tmpDir, workspaceRootDir),
      );
      expect(targetPaths.installationRootDir).toBe(
        resolvePath(tmpDir, installationRootDir),
      );
      expect(targetPaths.backstageJsonPath).toBe(
        resolvePath(tmpDir, backstageJsonPath),
      );
    };

    // A nested installation uses the backstage.json at the top
    expectRoots(
      'pnpm/apps/backstage/packages/backend',
      'pnpm',
      'pnpm/apps/backstage',
      'pnpm/backstage.json',
    );
    expect(targetPaths.rootDir).toBe(resolvePath(tmpDir, 'pnpm'));
    expect(targetPaths.resolveWorkspaceRoot('pnpm-lock.yaml')).toBe(
      resolvePath(tmpDir, 'pnpm/pnpm-lock.yaml'),
    );
    expect(targetPaths.resolveInstallationRoot('app-config.yaml')).toBe(
      resolvePath(tmpDir, 'pnpm/apps/backstage/app-config.yaml'),
    );
    expect(targetPaths.resolveRoot('pnpm-lock.yaml')).toBe(
      resolvePath(tmpDir, 'pnpm/pnpm-lock.yaml'),
    );

    // The nearest backstage.json wins
    expectRoots(
      'pnpm/apps/second/packages/app',
      'pnpm',
      'pnpm/apps/second',
      'pnpm/apps/second/backstage.json',
    );

    // Outside of an installation, the installation root is the workspace root
    expectRoots('pnpm/libs/other', 'pnpm', 'pnpm', 'pnpm/backstage.json');

    // A Yarn project in a pnpm workspace is a workspace of its own
    expectRoots(
      'pnpm/tools/yarn-project/packages/a',
      'pnpm/tools/yarn-project',
      'pnpm/tools/yarn-project',
      'pnpm/tools/yarn-project/backstage.json',
    );

    // Until then, it counts as an installation in the pnpm workspace
    expectRoots(
      'pnpm/tools/new-yarn-project/packages/a',
      'pnpm',
      'pnpm/tools/new-yarn-project',
      'pnpm/backstage.json',
    );

    expectRoots(
      'pnpm-app/packages/backend',
      'pnpm-app',
      'pnpm-app',
      'pnpm-app/backstage.json',
    );
    expectRoots('yarn/packages/app', 'yarn', 'yarn', 'yarn/backstage.json');

    // Without a backstage.json, the path points into the installation root
    expectRoots(
      'standalone',
      'standalone',
      'standalone',
      'standalone/backstage.json',
    );
  });

  it('can be overridden with separate roots', () => {
    const override = overrideTargetPaths({
      dir: '/ws/apps/backstage/packages/backend',
      workspaceRootDir: '/ws',
      installationRootDir: '/ws/apps/backstage',
    });
    try {
      expect(targetPaths.dir).toBe('/ws/apps/backstage/packages/backend');
      expect(targetPaths.workspaceRootDir).toBe('/ws');
      expect(targetPaths.installationRootDir).toBe('/ws/apps/backstage');
      expect(targetPaths.rootDir).toBe('/ws');
      expect(targetPaths.resolveWorkspaceRoot('a')).toBe('/ws/a');
      expect(targetPaths.resolveInstallationRoot('a')).toBe(
        '/ws/apps/backstage/a',
      );
      expect(targetPaths.resolveRoot('a')).toBe('/ws/a');
      expect(targetPaths.backstageJsonPath).toBe(
        '/ws/apps/backstage/backstage.json',
      );
    } finally {
      override.restore();
    }

    const shared = overrideTargetPaths({
      dir: '/ws/apps/backstage',
      workspaceRootDir: '/ws',
      backstageJsonPath: '/ws/backstage.json',
    });
    try {
      expect(targetPaths.installationRootDir).toBe('/ws');
      expect(targetPaths.backstageJsonPath).toBe('/ws/backstage.json');
    } finally {
      shared.restore();
    }

    const shorthand = overrideTargetPaths('/ws');
    try {
      expect(targetPaths.workspaceRootDir).toBe('/ws');
      expect(targetPaths.installationRootDir).toBe('/ws');
    } finally {
      shorthand.restore();
    }
  });
});
