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

/* eslint jest/expect-expect: ["warn", { "assertFunctionNames": ["expect", "expectPathExists"] }] */

import { createMockDirectory } from '@backstage/backend-test-utils';
import chalk from 'chalk';
import fs from 'fs-extra';
import { createRequire } from 'node:module';
import os from 'node:os';
import { join as joinPath } from 'node:path';
import { parse as parseYaml } from 'yaml';

import { targetPaths } from '@backstage/cli-common';
import {
  bundleCommand,
  filterBundleConfigSchemas,
  postProcessBundlePackageJson,
} from './command';
import { describeMissingFromPnpmCache } from './packageManagerSteps';

const fixturesDir = joinPath(__dirname, '__fixtures__');

const mockCreateDistWorkspace = jest.fn();
const mockPackToDirectory = jest.fn();
const mockBuildFrontend = jest.fn();
const mockRun = jest.fn();
const mockRunOutput = jest.fn();
const mockListTargetPackages = jest.fn();
const mockLoadConfigSchema = jest.fn();
const mockPackageManagerName = jest.fn(() => 'yarn');

// Mock external dependencies

jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  targetPaths: {
    dir: '',
    workspaceRootDir: '',
    resolve: jest.fn(),
  },
  run: (...args: unknown[]) => mockRun(...args),
  runOutput: (...args: unknown[]) => mockRunOutput(...args),
}));

jest.mock('../../../lib/packager', () => ({
  ...jest.requireActual('../../../lib/packager'),
  createDistWorkspace: (...args: unknown[]) => mockCreateDistWorkspace(...args),
  packToDirectory: (...args: unknown[]) => mockPackToDirectory(...args),
}));

jest.mock('../../../lib/buildFrontend', () => ({
  buildFrontend: (...args: unknown[]) => mockBuildFrontend(...args),
}));

jest.mock('@backstage/cli-node', () => {
  const actual = jest.requireActual('@backstage/cli-node');
  return {
    ...actual,
    PackageGraph: Object.assign(actual.PackageGraph, {
      listTargetPackages: (...args: unknown[]) =>
        mockListTargetPackages(...args),
    }),
  };
});

// Detected on every call, since tests switch package managers in the same
// directory
jest.mock('@backstage/cli-node/alpha', () => ({
  ...jest.requireActual('@backstage/cli-node/alpha'),
  detectPackageManager: async () => ({ name: () => mockPackageManagerName() }),
}));

jest.mock('@backstage/config-loader', () => ({
  loadConfigSchema: (...args: unknown[]) => mockLoadConfigSchema(...args),
}));

jest.mock('node:module', () => {
  const actual =
    jest.requireActual<typeof import('node:module')>('node:module');
  return {
    ...actual,
    createRequire: jest.fn(actual.createRequire),
  };
});

const mockCreateRequire = createRequire as jest.Mock;

// Unit tests for exported pure functions (no mocks required)

describe('postProcessBundlePackageJson', () => {
  it('clears scripts and devDependencies', () => {
    const pkg: Record<string, unknown> = {
      scripts: { build: 'tsc' },
      devDependencies: { typescript: '^5.0.0' },
    };
    postProcessBundlePackageJson(pkg, '/tmp', 'backend', undefined, {}, false);
    expect(pkg.scripts).toEqual({});
    expect(pkg.devDependencies).toEqual({});
  });

  it('sets bundleDependencies for backend plugins', () => {
    const pkg: Record<string, unknown> = {};
    postProcessBundlePackageJson(pkg, '/tmp', 'backend', undefined, {}, false);
    expect(pkg.bundleDependencies).toBe(true);
  });

  it('does not set bundleDependencies for frontend plugins', () => {
    const pkg: Record<string, unknown> = {};
    postProcessBundlePackageJson(pkg, '/tmp', 'frontend', undefined, {}, true);
    expect(pkg.bundleDependencies).toBeUndefined();
  });

  it('sets MF entry points for frontend plugins', () => {
    const pkg: Record<string, unknown> = {
      main: './dist/index.cjs.js',
      exports: { '.': './dist/index.cjs.js' },
      module: './dist/index.esm.js',
      typesVersions: { '*': { '*': ['dist/index.d.ts'] } },
    };
    postProcessBundlePackageJson(pkg, '/tmp', 'frontend', undefined, {}, false);
    expect(pkg.main).toBe('./dist/remoteEntry.js');
    expect(pkg.exports).toBeUndefined();
    expect(pkg.module).toBeUndefined();
    expect(pkg.typesVersions).toBeUndefined();
  });

  it('does not set MF entry points for backend plugins', () => {
    const pkg: Record<string, unknown> = {
      main: './dist/index.cjs.js',
    };
    postProcessBundlePackageJson(pkg, '/tmp', 'backend', undefined, {}, false);
    expect(pkg.main).toBe('./dist/index.cjs.js');
  });

  it('merges root resolutions and strips patch prefix', () => {
    const pkg: Record<string, unknown> = {
      resolutions: { existing: '3.0.0' },
    };
    const rootResolutions = {
      'some-dep': '1.0.0',
      'patched-dep': 'patch:patched-dep@npm%3A2.0.0#./patch',
    };
    postProcessBundlePackageJson(
      pkg,
      '/tmp',
      'backend',
      rootResolutions,
      {},
      true,
    );
    expect(pkg.resolutions).toEqual({
      'some-dep': '1.0.0',
      'patched-dep': '2.0.0',
      existing: '3.0.0',
    });
  });

  it('does not merge resolutions when needsDependencies is false', () => {
    const pkg: Record<string, unknown> = {};
    postProcessBundlePackageJson(
      pkg,
      '/tmp',
      'backend',
      { dep: '1.0.0' },
      {},
      false,
    );
    expect(pkg.resolutions).toBeUndefined();
  });
});

describe('filterBundleConfigSchemas', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    mockCreateRequire.mockImplementation((p: string) =>
      jest
        .requireActual<typeof import('node:module')>('node:module')
        .createRequire(p),
    );
  });

  afterEach(() => {
    mockCreateRequire.mockReset();
  });

  function writePluginTree(
    pluginPkg: Record<string, unknown>,
    deps: Record<string, Record<string, unknown>> = {},
  ) {
    const content: Record<string, string> = {
      'package.json': JSON.stringify(pluginPkg),
    };
    for (const [name, depPkg] of Object.entries(deps)) {
      content[`node_modules/${name}/package.json`] = JSON.stringify(depPkg);
    }
    mockDir.setContent(content);
  }

  function schemas(...names: string[]) {
    return names.map(n => ({ packageName: n, value: {}, path: '' }));
  }

  it('includes the plugin itself', () => {
    writePluginTree({ name: '@scope/my-plugin', dependencies: {} });
    const result = filterBundleConfigSchemas(
      schemas('@scope/my-plugin', '@other/unrelated'),
      mockDir.path,
    );
    expect(result.map(s => s.packageName)).toEqual(['@scope/my-plugin']);
  });

  it('includes third-party deps without backstage metadata', () => {
    writePluginTree(
      { name: '@scope/my-plugin', dependencies: { lodash: '^4.0.0' } },
      { lodash: { name: 'lodash', version: '4.17.21' } },
    );
    const result = filterBundleConfigSchemas(
      schemas('@scope/my-plugin', 'lodash'),
      mockDir.path,
    );
    expect(result.map(s => s.packageName)).toContain('lodash');
  });

  it('includes same-pluginId libraries', () => {
    writePluginTree(
      {
        name: '@scope/my-plugin',
        backstage: { role: 'backend-plugin', pluginId: 'foo' },
        dependencies: { '@scope/my-lib': '^1.0.0' },
      },
      {
        '@scope/my-lib': {
          name: '@scope/my-lib',
          backstage: { role: 'node-library', pluginId: 'foo' },
        },
      },
    );
    const result = filterBundleConfigSchemas(
      schemas('@scope/my-plugin', '@scope/my-lib'),
      mockDir.path,
    );
    expect(result.map(s => s.packageName)).toEqual([
      '@scope/my-plugin',
      '@scope/my-lib',
    ]);
  });

  it('excludes library with different pluginId', () => {
    writePluginTree(
      {
        name: '@scope/my-plugin',
        backstage: { role: 'backend-plugin', pluginId: 'foo' },
        dependencies: { '@scope/other-lib': '^1.0.0' },
      },
      {
        '@scope/other-lib': {
          name: '@scope/other-lib',
          backstage: { role: 'node-library', pluginId: 'bar' },
        },
      },
    );
    const result = filterBundleConfigSchemas(
      schemas('@scope/my-plugin', '@scope/other-lib'),
      mockDir.path,
    );
    expect(result.map(s => s.packageName)).toEqual(['@scope/my-plugin']);
  });

  it('recursively includes depended plugin/module schemas', () => {
    writePluginTree(
      {
        name: '@scope/my-plugin',
        dependencies: { '@scope/my-module': '^1.0.0' },
      },
      {
        '@scope/my-module': {
          name: '@scope/my-module',
          backstage: { role: 'backend-plugin-module' },
        },
      },
    );
    const result = filterBundleConfigSchemas(
      schemas('@scope/my-plugin', '@scope/my-module'),
      mockDir.path,
    );
    expect(result.map(s => s.packageName)).toEqual([
      '@scope/my-plugin',
      '@scope/my-module',
    ]);
  });
});

// Integration tests for the bundle command (require mocks)

describe('bundle command', () => {
  const mockDir = createMockDirectory();

  const backendPluginDir = 'plugins/foo-backend';
  const backendPkg = {
    name: '@scope/plugin-foo-backend',
    version: '1.0.0',
    backstage: { role: 'backend-plugin' },
    dependencies: {},
  };
  const backendMangledName = 'scope-plugin-foo-backend';

  const frontendPluginDir = 'plugins/foo';
  const frontendPkg = {
    name: '@scope/plugin-foo',
    version: '1.0.0',
    backstage: { role: 'frontend-plugin' },
    dependencies: {},
  };

  const defaultRootPkg = {
    name: 'root',
    version: '1.0.0',
    resolutions: {
      'some-dep': '1.0.0',
      'patched-dep': 'patch:patched-dep@npm%3A2.0.0#./patch',
    },
  };

  const defaultOpts = {
    build: true,
    install: true,
    clean: false,
    verbose: false,
    outputDestination: undefined as string | undefined,
    outputName: undefined as string | undefined,
    prePackedDir: undefined as string | undefined,
  };

  function setupPlugin(
    projectRelativeDir: string,
    pkg: Record<string, unknown>,
    bundleName = 'bundle',
  ) {
    const pluginDir = joinPath(mockDir.path, projectRelativeDir);
    const targetDir = joinPath(pluginDir, bundleName);

    mockDir.setContent({
      [joinPath(projectRelativeDir, 'package.json')]: JSON.stringify(pkg),
      [joinPath(projectRelativeDir, 'yarn.lock')]: '# yarn.lock content',
      'package.json': JSON.stringify(defaultRootPkg),
      'yarn.lock': '# root yarn.lock',
      'tmp/.keep': '',
    });
    targetPaths.dir = pluginDir;
    targetPaths.workspaceRootDir = mockDir.path;
    (targetPaths.resolve as jest.Mock).mockImplementation((...args: string[]) =>
      joinPath(targetPaths.dir, ...args),
    );

    return { pluginDir, targetDir, relDir: projectRelativeDir, bundleName };
  }

  function setupCreateDistWorkspaceMock(
    pluginDir: string,
    targets: { name: string; dir: string }[] = [],
    invokeLogger = false,
  ) {
    const mainTarget = { name: backendPkg.name, dir: pluginDir };
    mockCreateDistWorkspace.mockImplementation(async (_pkgNames, opts) => {
      if (invokeLogger && opts.logger) {
        opts.logger.log(`Moving ${backendPkg.name} into dist workspace`);
        opts.logger.warn('some dist workspace warning');
      }
      await fs.copy(
        joinPath(fixturesDir, 'dist-workspace', 'backend'),
        opts.targetDir,
      );
      return { targets: targets.length ? targets : [mainTarget] };
    });
  }

  function setupPackToDirectoryMock() {
    mockPackToDirectory.mockImplementation(
      async (opts: { targetDir: string; packageName: string }) => {
        await fs.copy(
          joinPath(fixturesDir, 'packed', 'frontend'),
          opts.targetDir,
        );
        const pkgPath = joinPath(opts.targetDir, 'package.json');
        const pkg = await fs.readJson(pkgPath);
        pkg.name = opts.packageName;
        await fs.writeJson(pkgPath, pkg);
      },
    );
  }

  function setupRunMock() {
    mockRun.mockImplementation(
      (
        args: string[],
        opts: { cwd: string; onStdout?: (d: Buffer) => void },
      ) => ({
        waitForExit: async () => {
          if (!args.includes('update-lockfile')) {
            await fs.ensureDir(joinPath(opts.cwd, 'node_modules'));
            await fs.ensureDir(joinPath(opts.cwd, '.yarn'));
          }
          opts.onStdout?.(Buffer.from('mock yarn output\n'));
        },
      }),
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockPackageManagerName.mockReturnValue('yarn');
    jest.spyOn(os, 'tmpdir').mockReturnValue(joinPath(mockDir.path, 'tmp'));
    mockLoadConfigSchema.mockResolvedValue({
      serialize: () => ({ schemas: [] }),
    });
    mockRunOutput.mockResolvedValue('/mock-cache');
    setupRunMock();
    mockCreateRequire.mockImplementation((path: string) =>
      jest.requireActual('node:module').createRequire(path),
    );
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    // Clear native Node module cache for files under mockDir to prevent
    // cross-test contamination when real createRequire loads dist/index.js.
    const nativeModule =
      jest.requireActual<typeof import('node:module')>('node:module');
    const nativeRequire = nativeModule.createRequire(__filename);
    for (const key of Object.keys(nativeRequire.cache ?? {})) {
      if (key.includes(mockDir.path)) {
        delete nativeRequire.cache![key];
      }
    }
    jest.restoreAllMocks();
  });

  async function expectPathExists(parts: string[], exists: boolean) {
    expect(await fs.pathExists(joinPath(...parts))).toBe(exists);
  }

  describe('validation', () => {
    it('throws when backstage.role is missing', async () => {
      setupPlugin(backendPluginDir, {
        name: '@scope/plugin-foo-backend',
        version: '1.0.0',
      });
      await expect(bundleCommand(defaultOpts)).rejects.toThrow(
        'does not have a backstage.role defined in package.json',
      );
    });

    it('throws when role is invalid', async () => {
      setupPlugin(backendPluginDir, {
        ...backendPkg,
        backstage: { role: 'backend' },
      });
      await expect(bundleCommand(defaultOpts)).rejects.toThrow(
        `only supports: ${chalk.cyan('backend-plugin')}, ${chalk.cyan(
          'backend-plugin-module',
        )}, ${chalk.cyan('frontend-plugin')}, ${chalk.cyan(
          'frontend-plugin-module',
        )}`,
      );
    });

    it('throws when bundled is true', async () => {
      setupPlugin(backendPluginDir, { ...backendPkg, bundled: true });
      await expect(bundleCommand(defaultOpts)).rejects.toThrow(
        'not compatible with dynamic plugin bundling',
      );
    });
  });

  describe('backend', () => {
    let ctx: ReturnType<typeof setupPlugin>;
    beforeEach(() => {
      ctx = setupPlugin(backendPluginDir, backendPkg);
    });

    describe('via createDistWorkspace', () => {
      beforeEach(() => {
        setupCreateDistWorkspaceMock(ctx.pluginDir);
      });

      it('should produce backend bundle when build=true', async () => {
        await bundleCommand(defaultOpts);
        const pkg = await fs.readJson(joinPath(ctx.targetDir, 'package.json'));
        expect(pkg.name).toBe(backendPkg.name);
        expect(pkg.bundleDependencies).toBe(true);
        await expectPathExists([ctx.targetDir, '.gitignore'], true);
        await expectPathExists([ctx.targetDir, '.yarnrc.yml'], true);
        expect(mockCreateDistWorkspace).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ buildDependencies: true }),
        );
      });

      it.each(['null', 'undefined'])(
        'should not write yarnPath when yarn config returns "%s"',
        async sentinel => {
          mockRunOutput.mockImplementation(
            (args: string[]): Promise<string> => {
              if (args.includes('yarnPath')) {
                return Promise.resolve(sentinel);
              }
              return Promise.resolve('/mock-cache');
            },
          );
          await bundleCommand(defaultOpts);
          const yarnrc = await fs.readFile(
            joinPath(ctx.targetDir, '.yarnrc.yml'),
            'utf8',
          );
          expect(yarnrc).not.toContain('yarnPath');
          expect(yarnrc).toContain('nodeLinker: node-modules');
        },
      );

      it('should write yarnPath when yarn config returns a real path', async () => {
        mockRunOutput.mockImplementation((args: string[]): Promise<string> => {
          if (args.includes('yarnPath')) {
            return Promise.resolve('/home/user/.yarn/releases/yarn-3.8.1.cjs');
          }
          return Promise.resolve('/mock-cache');
        });
        await bundleCommand(defaultOpts);
        const yarnrc = await fs.readFile(
          joinPath(ctx.targetDir, '.yarnrc.yml'),
          'utf8',
        );
        expect(yarnrc).toContain(
          'yarnPath: /home/user/.yarn/releases/yarn-3.8.1.cjs',
        );
      });

      it('should pass buildDependencies=false when build=false', async () => {
        await bundleCommand({ ...defaultOpts, build: false });
        expect(mockCreateDistWorkspace).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ buildDependencies: false }),
        );
      });

      it('should produce backend bundle for backend-plugin-module role', async () => {
        ctx = setupPlugin(backendPluginDir, {
          ...backendPkg,
          backstage: { role: 'backend-plugin-module' },
        });
        setupCreateDistWorkspaceMock(ctx.pluginDir);
        await bundleCommand(defaultOpts);
        const pkg = await fs.readJson(joinPath(ctx.targetDir, 'package.json'));
        expect(pkg.name).toBe(backendPkg.name);
        expect(mockCreateDistWorkspace).toHaveBeenCalled();
        expect(mockPackToDirectory).not.toHaveBeenCalled();
      });

      it('should assemble local deps into embedded/ and clean up .yarn', async () => {
        const commonRelDir = 'plugins/foo-common';
        const commonDir = joinPath(mockDir.path, commonRelDir);

        ctx = setupPlugin(backendPluginDir, {
          ...backendPkg,
          dependencies: { '@scope/plugin-foo-common': 'workspace:^' },
        });
        setupCreateDistWorkspaceMock(ctx.pluginDir, [
          { name: backendPkg.name, dir: ctx.pluginDir },
          { name: '@scope/plugin-foo-common', dir: commonDir },
        ]);

        await bundleCommand(defaultOpts);

        const pkg = await fs.readJson(joinPath(ctx.targetDir, 'package.json'));
        expect(pkg.name).toBe(backendPkg.name);
        await expectPathExists(
          [ctx.targetDir, 'embedded', commonRelDir, 'package.json'],
          true,
        );
        expect(pkg.resolutions['@scope/plugin-foo-common']).toBe(
          `file:./embedded/${commonRelDir}`,
        );
        await expectPathExists([ctx.targetDir, '.yarn'], false);
      });

      it('should log formatted packing output when distLogger is invoked', async () => {
        setupCreateDistWorkspaceMock(ctx.pluginDir, [], true);
        await bundleCommand(defaultOpts);

        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining(`Packing`),
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining(backendPkg.name),
        );
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('some dist workspace warning'),
        );
      });
    });

    describe('via createDistWorkspace - failure', () => {
      it('should clean up temp dir and propagate error on createDistWorkspace failure', async () => {
        mockCreateDistWorkspace.mockRejectedValue(new Error('pack failed'));
        const tempBase = joinPath(mockDir.path, 'tmp');
        jest.spyOn(os, 'tmpdir').mockReturnValue(tempBase);

        await expect(bundleCommand(defaultOpts)).rejects.toThrow('pack failed');

        const entries = await fs.readdir(tempBase).catch(() => []);
        expect(
          entries.filter((e: string) => e.startsWith('bundle-workspace-')),
        ).toHaveLength(0);
      });
    });

    describe('via --pre-packed-dir', () => {
      beforeEach(() => {
        mockCreateDistWorkspace.mockClear();
      });

      it('should copy from pre-packed dir and assemble embedded', async () => {
        const prePackedPath = joinPath(mockDir.path, 'pre-packed');
        await fs.copy(
          joinPath(fixturesDir, 'dist-workspace', 'backend'),
          prePackedPath,
        );

        mockListTargetPackages.mockResolvedValue([
          { packageJson: { name: backendPkg.name }, dir: ctx.pluginDir },
        ]);

        await bundleCommand({ ...defaultOpts, prePackedDir: prePackedPath });

        const pkg = await fs.readJson(joinPath(ctx.targetDir, 'package.json'));
        expect(pkg.name).toBe(backendPkg.name);
        expect(pkg.bundleDependencies).toBe(true);
      });

      it('should print warning when package not found in pre-packed dir', async () => {
        ctx = setupPlugin(backendPluginDir, {
          ...backendPkg,
          dependencies: { '@scope/other-dep': 'workspace:^' },
        });
        mockListTargetPackages.mockResolvedValue([
          {
            packageJson: {
              name: backendPkg.name,
              version: '1.0.0',
              dependencies: { '@scope/other-dep': 'workspace:^' },
            },
            dir: ctx.pluginDir,
          },
          {
            packageJson: { name: '@scope/other-dep', version: '1.0.0' },
            dir: joinPath(mockDir.path, 'packages/other-dep'),
          },
        ]);

        const prePackedPath = joinPath(mockDir.path, 'pre-packed');
        await fs.copy(
          joinPath(fixturesDir, 'dist-workspace', 'backend'),
          prePackedPath,
        );

        await bundleCommand({ ...defaultOpts, prePackedDir: prePackedPath });

        expect(console.warn).toHaveBeenCalledWith(
          chalk.yellow(
            `  Package ${chalk.cyan(
              '@scope/other-dep',
            )} not found in pre-packed dir (expected at ${chalk.cyan(
              'packages/other-dep',
            )})`,
          ),
        );
      });
    });

    describe('lockfile and install', () => {
      beforeEach(() => {
        setupCreateDistWorkspaceMock(ctx.pluginDir);
      });

      it('should seed lockfile from monorepo root when plugin has no yarn.lock', async () => {
        mockDir.setContent({
          [joinPath(backendPluginDir, 'package.json')]:
            JSON.stringify(backendPkg),
          'package.json': JSON.stringify(defaultRootPkg),
          'yarn.lock': '# root yarn.lock content',
          'tmp/.keep': '',
        });

        await bundleCommand(defaultOpts);

        const lockContent = await fs.readFile(
          joinPath(ctx.targetDir, 'yarn.lock'),
          'utf8',
        );
        expect(lockContent).toBe('# root yarn.lock content');
      });

      it('throws when no yarn.lock exists', async () => {
        mockDir.setContent({
          [joinPath(backendPluginDir, 'package.json')]:
            JSON.stringify(backendPkg),
          'package.json': JSON.stringify(defaultRootPkg),
          'tmp/.keep': '',
        });

        await expect(bundleCommand(defaultOpts)).rejects.toThrow(
          `Could not find a ${chalk.cyan(
            'yarn.lock',
          )} file in either the plugin directory or the monorepo root (${chalk.cyan(
            mockDir.path,
          )})`,
        );
      });

      it('should run prune and install in the bundle dir', async () => {
        await bundleCommand(defaultOpts);
        expect(mockRun).toHaveBeenCalledWith(
          expect.arrayContaining([
            'yarn',
            'install',
            '--no-immutable',
            '--mode',
            'update-lockfile',
          ]),
          expect.objectContaining({ cwd: ctx.targetDir }),
        );
        expect(mockRun).toHaveBeenCalledWith(
          expect.arrayContaining(['yarn', 'install', '--immutable']),
          expect.objectContaining({ cwd: ctx.targetDir }),
        );
      });

      it('throws when backend plugin has no valid BackendFeature export', async () => {
        mockCreateRequire.mockImplementation(() =>
          Object.assign(() => ({ default: {} }), {
            resolve: (id: string) => {
              if (id.includes('package.json')) {
                return joinPath(targetPaths.dir, 'node_modules', id);
              }
              throw new Error(`Cannot find module '${id}'`);
            },
          }),
        );
        await expect(bundleCommand(defaultOpts)).rejects.toThrow(
          'Backend plugin is not valid for dynamic loading',
        );
      });
    });

    describe('pnpm', () => {
      const pnpmWorkspace = `packages:
  - plugins/*
nodeLinker: isolated
storeDir: .pnpm-store
minimumReleaseAge: 4320
overrides:
  some-dep: 1.0.0
patchedDependencies:
  patched-dep@2.0.0: patches/patched-dep.patch
catalog:
  react: ^18.0.0
customSetting: true
`;

      beforeEach(() => {
        mockPackageManagerName.mockReturnValue('pnpm');
        mockRunOutput.mockImplementation(async (args: string[]) =>
          args.join(' ') === 'pnpm --version' ? '12.7.0\n' : '/mock-cache',
        );
        mockDir.setContent({
          [joinPath(backendPluginDir, 'package.json')]:
            JSON.stringify(backendPkg),
          'package.json': JSON.stringify({
            name: 'root',
            packageManager: 'pnpm@12.7.0',
          }),
          'pnpm-workspace.yaml': pnpmWorkspace,
          'pnpm-lock.yaml': '# root pnpm-lock.yaml',
          'patches/patched-dep.patch': '# patch',
          'tmp/.keep': '',
        });
        setupCreateDistWorkspaceMock(ctx.pluginDir);
      });

      it('should make the bundle a pnpm project of its own and install it offline', async () => {
        await bundleCommand(defaultOpts);

        expect(
          parseYaml(
            await fs.readFile(
              joinPath(ctx.targetDir, 'pnpm-workspace.yaml'),
              'utf8',
            ),
          ),
        ).toEqual({
          nodeLinker: 'hoisted',
          storeDir: joinPath(mockDir.path, '.pnpm-store'),
          minimumReleaseAge: 4320,
          catalog: { react: '^18.0.0' },
          patchedDependencies: {
            'patched-dep@2.0.0': 'patches/patched-dep.patch',
          },
          overrides: { 'some-dep': '1.0.0' },
        });
        await expectPathExists(
          [ctx.targetDir, 'patches', 'patched-dep.patch'],
          true,
        );
        await expectPathExists([ctx.targetDir, '.yarnrc.yml'], false);
        await expect(
          fs.readFile(joinPath(ctx.targetDir, 'pnpm-lock.yaml'), 'utf8'),
        ).resolves.toBe('# root pnpm-lock.yaml');

        const pkg = await fs.readJson(joinPath(ctx.targetDir, 'package.json'));
        expect(pkg.resolutions).toBeUndefined();
        expect(pkg.packageManager).toBe('pnpm@12.7.0');
        expect(pkg.bundleDependencies).toBe(true);

        expect(mockRun).toHaveBeenCalledWith(
          [
            'pnpm',
            'install',
            '--lockfile-only',
            '--no-frozen-lockfile',
            '--offline',
          ],
          expect.objectContaining({ cwd: ctx.targetDir }),
        );
        expect(mockRun).toHaveBeenCalledWith(
          ['pnpm', 'install', '--frozen-lockfile', '--offline'],
          expect.objectContaining({ cwd: ctx.targetDir }),
        );
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining(
            'These pnpm settings of the project are not carried into the bundle: customSetting',
          ),
        );
      });

      it('should fail with the missing package when the pnpm cache lacks it', async () => {
        mockRun.mockImplementation(
          (args: string[], opts: { onStderr?: (d: Buffer) => void }) => ({
            waitForExit: async () => {
              if (args.includes('--lockfile-only')) {
                opts.onStderr?.(
                  Buffer.from(
                    'Error: ERR_PNPM_NO_OFFLINE_META\n\n  × installing dependencies\n' +
                      '  ├─▶ Failed to resolve dependency tree: Failed to resolve is-odd@^3.0.0 in\n' +
                      '  │   package mirror "/cache/v12/metadata/is-odd.jsonl"\n',
                  ),
                );
                throw new Error('Command failed with exit code 1');
              }
            },
          }),
        );

        await expect(bundleCommand(defaultOpts)).rejects.toThrow(
          'The offline lockfile prune failed. pnpm has no cached metadata for is-odd@^3.0.0.',
        );
      });
    });

    describe('--no-install', () => {
      beforeEach(() => {
        setupCreateDistWorkspaceMock(ctx.pluginDir);
      });

      it('should skip install and print warning', async () => {
        await bundleCommand({ ...defaultOpts, install: false });

        await expectPathExists([ctx.targetDir, 'package.json'], true);
        await expectPathExists([ctx.targetDir, 'yarn.lock'], true);
        await expectPathExists([ctx.targetDir, 'node_modules'], false);
        expect(mockRun).toHaveBeenCalledWith(
          expect.arrayContaining(['--mode', 'update-lockfile']),
          expect.objectContaining({ cwd: ctx.targetDir }),
        );
        expect(mockRun).not.toHaveBeenCalledWith(
          expect.arrayContaining(['--immutable']),
          expect.objectContaining({ cwd: ctx.targetDir }),
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('Skipping dependency installation'),
        );
      });
    });

    describe('options', () => {
      beforeEach(() => {
        setupCreateDistWorkspaceMock(ctx.pluginDir);
      });

      it('should remove target when clean=true', async () => {
        mockDir.addContent({
          [joinPath(ctx.relDir, ctx.bundleName, 'existing-file')]: 'content',
        });

        await bundleCommand({ ...defaultOpts, clean: true });

        await expectPathExists([ctx.targetDir, 'existing-file'], false);
        await expectPathExists([ctx.targetDir, 'package.json'], true);
      });

      it('should write bundle to custom outputDestination with mangled name', async () => {
        const customOutput = joinPath(mockDir.path, 'custom-output');
        await bundleCommand({
          ...defaultOpts,
          outputDestination: customOutput,
        });

        await expectPathExists(
          [customOutput, backendMangledName, 'package.json'],
          true,
        );
      });

      it('should use "bundle" as default name when output stays in package dir', async () => {
        await bundleCommand(defaultOpts);
        const entries = await fs.readdir(ctx.pluginDir);
        expect(entries).toContain('bundle');
      });

      it('should use mangled package name when outputDestination is given', async () => {
        const customOutput = joinPath(mockDir.path, 'custom-output');
        await bundleCommand({
          ...defaultOpts,
          outputDestination: customOutput,
        });
        const entries = await fs.readdir(customOutput);
        expect(entries).toContain(backendMangledName);
      });

      it('should use explicit outputName when provided', async () => {
        await bundleCommand({ ...defaultOpts, outputName: 'my-custom-bundle' });
        const entries = await fs.readdir(ctx.pluginDir);
        expect(entries).toContain('my-custom-bundle');
      });

      it('should pipe run output to console when verbose=true', async () => {
        await bundleCommand({ ...defaultOpts, verbose: true });

        expect(mockRun).toHaveBeenCalledWith(
          expect.arrayContaining(['yarn', 'install', '--immutable']),
          expect.anything(),
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('mock yarn output'),
        );
      });

      it('should write .bundle-output marker to the output directory', async () => {
        await bundleCommand(defaultOpts);
        await expectPathExists([ctx.targetDir, '.bundle-output'], true);
      });

      it('should remove nested dirs that have a .bundle-output marker', async () => {
        // Leave a marked directory from a previous bundle run in the source tree.
        const prevBundleDir = joinPath(ctx.pluginDir, 'old-bundle');
        await fs.ensureDir(prevBundleDir);
        await fs.writeFile(joinPath(prevBundleDir, '.bundle-output'), '');

        // Simulate yarn pack pulling the stale dir into the packed output.
        mockCreateDistWorkspace.mockImplementation(async (_pkgNames, opts) => {
          await fs.copy(
            joinPath(fixturesDir, 'dist-workspace', 'backend'),
            opts.targetDir,
          );
          const nestedDir = joinPath(opts.targetDir, ctx.relDir, 'old-bundle');
          await fs.ensureDir(nestedDir);
          await fs.writeFile(joinPath(nestedDir, 'stale-file'), '');
          return { targets: [{ name: backendPkg.name, dir: ctx.pluginDir }] };
        });

        await bundleCommand(defaultOpts);
        await expectPathExists([ctx.targetDir, 'old-bundle'], false);
      });

      it('should not create recursive nesting when run twice without --clean', async () => {
        await bundleCommand(defaultOpts);
        await bundleCommand(defaultOpts);

        const entries = await fs.readdir(ctx.targetDir);
        expect(entries).not.toContain('bundle');
      });
    });

    describe('error handling', () => {
      it('should propagate error and show log when pruneBundleLockfile fails', async () => {
        setupCreateDistWorkspaceMock(ctx.pluginDir);
        mockRun
          .mockReturnValueOnce({ waitForExit: () => Promise.resolve() })
          .mockImplementationOnce((_args: any, opts: any) => ({
            waitForExit: async () => {
              (opts?.onStdout ?? opts?.onStderr)?.(
                Buffer.from('yarn prune output line 1\nline 2\n'),
              );
              throw new Error('prune failed');
            },
          }));

        await expect(bundleCommand(defaultOpts)).rejects.toThrow(
          'prune failed',
        );
        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining('Full log available at'),
        );
        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining('--- last 20 lines ---'),
        );
      });

      it('should propagate error when installBundleDependencies fails', async () => {
        setupCreateDistWorkspaceMock(ctx.pluginDir);
        let callCount = 0;
        mockRun.mockImplementation(() => ({
          waitForExit: () =>
            ++callCount === 2
              ? Promise.reject(new Error('install failed'))
              : Promise.resolve(),
        }));

        await expect(bundleCommand(defaultOpts)).rejects.toThrow(
          'install failed',
        );
      });
    });

    describe('config schema', () => {
      beforeEach(() => {
        setupCreateDistWorkspaceMock(ctx.pluginDir);
      });

      it('should set configSchema in package.json when schemas are found', async () => {
        mockLoadConfigSchema.mockResolvedValue({
          serialize: () => ({
            schemas: [
              {
                packageName: backendPkg.name,
                value: {
                  type: 'object',
                  properties: { foo: { type: 'string' } },
                },
                path: 'schemas/foo.json',
              },
            ],
          }),
        });

        await bundleCommand(defaultOpts);

        expect(mockLoadConfigSchema).toHaveBeenCalledWith({
          dependencies: [],
          packagePaths: ['package.json'],
          onSchemaError: expect.any(Function),
        });

        const pkg = await fs.readJson(joinPath(ctx.targetDir, 'package.json'));
        expect(pkg.configSchema).toBe('dist/.config-schema.json');
        const schemaFile = await fs.readJson(
          joinPath(ctx.targetDir, 'dist', '.config-schema.json'),
        );
        expect(schemaFile.backstageConfigSchemaVersion).toBe(1);
        expect(schemaFile.schemas).toHaveLength(1);
      });

      it('should not set configSchema when no schemas are found', async () => {
        await bundleCommand(defaultOpts);
        const pkg = await fs.readJson(joinPath(ctx.targetDir, 'package.json'));
        expect(pkg.configSchema).toBeUndefined();
      });
    });
  });

  describe('frontend', () => {
    let ctx: ReturnType<typeof setupPlugin>;
    beforeEach(() => {
      ctx = setupPlugin(frontendPluginDir, frontendPkg);
      setupPackToDirectoryMock();
    });

    describe('without --pre-packed-dir', () => {
      it('should produce frontend bundle when build=true', async () => {
        await bundleCommand(defaultOpts);
        const pkg = await fs.readJson(joinPath(ctx.targetDir, 'package.json'));
        expect(pkg.name).toBe(frontendPkg.name);
        await expectPathExists([ctx.targetDir, '.gitignore'], true);
        await expectPathExists([ctx.targetDir, '.yarnrc.yml'], false);
        await expectPathExists([ctx.targetDir, 'yarn.lock'], false);
        await expectPathExists([ctx.targetDir, 'node_modules'], false);
        await expectPathExists([ctx.targetDir, 'src'], false);
        expect(mockBuildFrontend).toHaveBeenCalled();
        expect(mockPackToDirectory).toHaveBeenCalled();
        expect(mockCreateDistWorkspace).not.toHaveBeenCalled();
      });

      it('should keep src/ when "files" explicitly includes it', async () => {
        ctx = setupPlugin(frontendPluginDir, {
          ...frontendPkg,
          files: ['dist', 'src'],
        });
        setupPackToDirectoryMock();
        await bundleCommand(defaultOpts);
        await expectPathExists([ctx.targetDir, 'src'], true);
      });

      it('should produce frontend bundle when build=false', async () => {
        await bundleCommand({ ...defaultOpts, build: false });
        const pkg = await fs.readJson(joinPath(ctx.targetDir, 'package.json'));
        expect(pkg.name).toBe(frontendPkg.name);
        await expectPathExists([ctx.targetDir, 'yarn.lock'], false);
        await expectPathExists([ctx.targetDir, 'node_modules'], false);
        expect(mockBuildFrontend).not.toHaveBeenCalled();
        expect(mockPackToDirectory).toHaveBeenCalled();
      });

      it('should produce frontend bundle for frontend-plugin-module role', async () => {
        ctx = setupPlugin(frontendPluginDir, {
          ...frontendPkg,
          backstage: { role: 'frontend-plugin-module' },
        });
        await bundleCommand(defaultOpts);
        const pkg = await fs.readJson(joinPath(ctx.targetDir, 'package.json'));
        expect(pkg.name).toBe(frontendPkg.name);
        expect(mockBuildFrontend).toHaveBeenCalled();
        expect(mockPackToDirectory).toHaveBeenCalled();
        expect(mockCreateDistWorkspace).not.toHaveBeenCalled();
      });
    });

    describe('package.json post-processing', () => {
      it('should apply frontend-specific and common post-processing', async () => {
        await bundleCommand(defaultOpts);
        const pkg = await fs.readJson(joinPath(ctx.targetDir, 'package.json'));
        expect(pkg.main).toBe('./dist/remoteEntry.js');
        expect(pkg.types).toBe('./dist/@mf-types/index.d.ts');
        expect(pkg.exports).toBeUndefined();
        expect(pkg.module).toBeUndefined();
        expect(pkg.typesVersions).toBeUndefined();
        expect(pkg.dependencies).toEqual({
          '@backstage/catalog-model': '^1.7.6',
        });
        expect(pkg.keywords).toEqual(['backstage']);
        expect(pkg.license).toBe('Apache-2.0');
        expect(pkg.backstage).toEqual(
          expect.objectContaining({ role: 'frontend-plugin' }),
        );
        expect(pkg.bundleDependencies).toBeUndefined();
        expect(pkg.scripts).toEqual({});
        expect(pkg.devDependencies).toEqual({});
      });

      it('should delete types when @mf-types/index.d.ts is absent', async () => {
        mockPackToDirectory.mockImplementation(
          async (opts: { targetDir: string; packageName: string }) => {
            await fs.copy(
              joinPath(fixturesDir, 'packed', 'frontend'),
              opts.targetDir,
            );
            await fs.remove(
              joinPath(opts.targetDir, 'dist', '@mf-types', 'index.d.ts'),
            );
            const pkgPath = joinPath(opts.targetDir, 'package.json');
            const pkg = await fs.readJson(pkgPath);
            pkg.name = opts.packageName;
            await fs.writeJson(pkgPath, pkg);
          },
        );
        await bundleCommand(defaultOpts);
        const pkg = await fs.readJson(joinPath(ctx.targetDir, 'package.json'));
        expect(pkg.main).toBe('./dist/remoteEntry.js');
        expect(pkg.types).toBeUndefined();
      });
    });

    describe('with --pre-packed-dir', () => {
      beforeEach(async () => {
        mockListTargetPackages.mockResolvedValue([
          { packageJson: { name: frontendPkg.name }, dir: ctx.pluginDir },
        ]);
        const prePackedPath = joinPath(mockDir.path, 'pre-packed');
        await fs.copy(
          joinPath(fixturesDir, 'dist-workspace', 'frontend'),
          prePackedPath,
        );
        mockBuildFrontend.mockImplementation(async () => {
          const distDir = joinPath(ctx.pluginDir, 'dist');
          await fs.ensureDir(distDir);
          await fs.writeFile(
            joinPath(distDir, 'remoteEntry.js'),
            '// MF remote entry',
          );
        });
      });

      it('should copy from pre-packed and prune lockfile but not install', async () => {
        await bundleCommand({
          ...defaultOpts,
          prePackedDir: joinPath(mockDir.path, 'pre-packed'),
        });

        await expectPathExists([ctx.targetDir, 'package.json'], true);
        await expectPathExists([ctx.targetDir, 'yarn.lock'], true);
        await expectPathExists([ctx.targetDir, 'node_modules'], false);
        await expectPathExists([ctx.targetDir, 'dist', 'remoteEntry.js'], true);
        expect(mockRun).toHaveBeenCalledWith(
          expect.arrayContaining(['--mode', 'update-lockfile']),
          expect.objectContaining({ cwd: ctx.targetDir }),
        );
        expect(mockRun).not.toHaveBeenCalledWith(
          expect.arrayContaining(['--immutable']),
          expect.objectContaining({ cwd: ctx.targetDir }),
        );
      });
    });

    describe('error handling', () => {
      it('should propagate error when packToDirectory fails', async () => {
        mockPackToDirectory.mockRejectedValue(new Error('pack failed'));

        await expect(bundleCommand(defaultOpts)).rejects.toThrow('pack failed');
        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining('Full log available at'),
        );
      });

      it('should not show last 20 lines when verbose=true on failure', async () => {
        mockPackToDirectory.mockRejectedValue(new Error('pack failed'));

        await expect(
          bundleCommand({ ...defaultOpts, verbose: true }),
        ).rejects.toThrow('pack failed');
        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining('Full log available at'),
        );
        expect(console.error).not.toHaveBeenCalledWith(
          expect.stringContaining('--- last 20 lines ---'),
        );
      });
    });
  });
});

describe('describeMissingFromPnpmCache', () => {
  it('describes the package that pnpm could not find offline', () => {
    expect(
      describeMissingFromPnpmCache(`Error: ERR_PNPM_NO_OFFLINE_TARBALL

  × installing dependencies
  ╰─▶ Failed to fetch tarball for is-number@6.0.0 from https://
      registry.npmjs.org/is-number/-/is-number-6.0.0.tgz in offline mode:
      snapshot not present in local store
`),
    ).toMatch(
      /^pnpm has no stored copy of is-number@6\.0\.0\. .*storeDir setting/,
    );

    expect(
      describeMissingFromPnpmCache(`Error: ERR_PNPM_META_FETCH_FAIL

  × installing dependencies
  ╰─▶ ERR_PNPM_NO_OFFLINE_META: Failed to resolve is-odd in package mirror /
      private/tmp/empty-cache/v12/metadata-full/https%3A+registry.npmjs.org/
      is-odd.jsonl
`),
    ).toMatch(
      /^pnpm has no cached metadata for is-odd\. .*cacheDir, minimumReleaseAge, and resolutionMode/,
    );

    expect(
      describeMissingFromPnpmCache(
        'ERR_PNPM_OUTDATED_LOCKFILE  Cannot install',
      ),
    ).toBeUndefined();
  });
});
