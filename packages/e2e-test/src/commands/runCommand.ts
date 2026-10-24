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

import os from 'node:os';
import fs from 'fs-extra';
import { rm } from 'node:fs/promises';
import handlebars from 'handlebars';
import killTree from 'tree-kill';
import { resolve as resolvePath, join as joinPath } from 'node:path';
import path from 'node:path';
import { parseDocument } from 'yaml';

import { waitFor, print } from '../lib/helpers';
import { getPackageManager, PackageManager } from '../lib/packageManager';

import mysql from 'mysql2/promise';
import pgtools from 'pgtools';

import { OptionValues } from 'commander';
import { isError, stringifyError } from '@backstage/errors';
import { findOwnPaths, runOutput, run } from '@backstage/cli-common';

/* eslint-disable-next-line no-restricted-syntax */
const ownPaths = findOwnPaths(__dirname);

const templatePackagePaths = [
  'packages/cli-module-new/templates/frontend-plugin/package.json.hbs',
  'packages/create-app/templates/default-app/package.json.hbs',
  'packages/create-app/templates/default-app/packages/app/package.json.hbs',
  'packages/create-app/templates/default-app/packages/backend/package.json.hbs',
];

export async function runCommand(opts: OptionValues) {
  const rootDir = await fs.mkdtemp(resolvePath(os.tmpdir(), 'backstage-e2e-'));
  print(`CLI E2E test root: ${rootDir}\n`);

  // The package manager used for the created app, the dist workspace is
  // always built and installed with Yarn since it is part of this repo
  const pm = getPackageManager(opts.packageManager);
  if (opts.nodeLinker && pm.name !== 'pnpm') {
    throw new Error('The --node-linker option is only supported for pnpm');
  }

  print('Building dist workspace');
  const workspaceDir = await buildDistWorkspace('workspace', rootDir);

  // Otherwise yarn will refuse to install with CI=true
  process.env.YARN_ENABLE_IMMUTABLE_INSTALLS = 'false';

  print('Creating a Backstage App');
  const appDir = await createApp(
    'test-app',
    workspaceDir,
    rootDir,
    pm,
    opts.nodeLinker,
  );

  print('Creating a Backstage Plugin');
  const pluginId = 'test';
  await createPlugin({ appDir, pluginId, select: 'frontend-plugin', pm });

  print('Creating a Backstage Backend Plugin');
  await createPlugin({ appDir, pluginId, select: 'backend-plugin', pm });

  const testE2eCmd = pm.run('test:e2e');
  print(
    `Running '${testE2eCmd.join(' ')}' in newly created app with new plugin`,
  );
  await runOutput(testE2eCmd, {
    cwd: appDir,
    env: { ...process.env, CI: undefined },
  });

  if (
    Boolean(process.env.POSTGRES_USER) ||
    Boolean(process.env.MYSQL_CONNECTION)
  ) {
    print('Testing the database backend startup');
    await preCleanDatabase();
    const appConfig = path.resolve(appDir, 'app-config.yaml');
    const productionConfig = path.resolve(appDir, 'app-config.production.yaml');
    await testBackendStart(
      appDir,
      pm,
      '--config',
      appConfig,
      '--config',
      productionConfig,
    );
    // Brief pause to let the OS reclaim the port from the previous backend
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  print('Testing the Database backend startup');
  await testBackendStart(appDir, pm);

  if (process.env.CI) {
    // Cleanup actually takes significant time, so skip it in CI since the
    // runner will be destroyed anyway
    print('All tests successful');
  } else {
    if (opts.keep) {
      print(`All tests successful, app dir available at ${appDir}`);
    } else {
      print('All tests successful, removing test dir');
      // pnpm can still be writing its run state for the stopped backend
      await rm(rootDir, { recursive: true, force: true, maxRetries: 5 });
    }
  }

  // Just in case some child process was left hanging
  process.exit(0);
}

/**
 * Builds a dist workspace that contains the cli and core packages
 */
async function buildDistWorkspace(workspaceName: string, rootDir: string) {
  const workspaceDir = resolvePath(rootDir, workspaceName);
  await fs.ensureDir(workspaceDir);

  // We grab the needed dependencies from the create app template
  const createAppDeps = new Set<string>();

  function appendDeps(pkg: any) {
    Array<string>()
      .concat(
        Object.keys(pkg.dependencies ?? {}),
        Object.keys(pkg.devDependencies ?? {}),
        Object.keys(pkg.peerDependencies ?? {}),
      )
      .filter(name => name.startsWith('@backstage/'))
      .forEach(dep => createAppDeps.add(dep));
  }

  for (const pkgJsonPath of templatePackagePaths) {
    const jsonPath = ownPaths.resolveRoot(pkgJsonPath);
    const pkgTemplate = await fs.readFile(jsonPath, 'utf8');
    const pkg = JSON.parse(
      handlebars.compile(pkgTemplate)(
        {
          privatePackage: true,
          scopeName: '@backstage',
        },
        {
          helpers: {
            version(name: string) {
              // Ignore non Backstage packages
              if (!name.startsWith('@backstage/')) {
                return '^0.0.0';
              }
              const pkge = require(`${name}/package.json`);
              if (!pkge) {
                throw new Error(`No version available for package ${name}`);
              }
              return pkge.version;
            },
            versionQuery(name: string, hint: string) {
              // Ignore non Backstage packages
              if (!name.startsWith('@backstage/')) {
                return '^0.0.0';
              }
              const pkgData = require(`${name}/package.json`);
              if (!pkgData) {
                if (typeof hint !== 'string') {
                  throw new Error(`No version available for package ${name}`);
                }
                return `^${hint}`;
              }
              return `^${pkgData.version}`;
            },
          },
        },
      ),
    );
    appendDeps(pkg);
  }

  // eslint-disable-next-line @backstage/no-forbidden-package-imports
  appendDeps(require('@backstage/create-app/package.json'));

  print(`Preparing workspace`);
  await runOutput([
    'yarn',
    'backstage-cli',
    'build-workspace',
    workspaceDir,
    '@backstage/create-app',
    ...createAppDeps,
  ]);

  print('Pinning yarn version in workspace');
  await pinYarnVersion(workspaceDir);

  const yarnPatchesPath = ownPaths.resolveRoot('.yarn/patches');
  if (await fs.pathExists(yarnPatchesPath)) {
    print('Copying yarn patches');
    await fs.copy(yarnPatchesPath, resolvePath(workspaceDir, '.yarn/patches'));
  }

  print('Installing workspace dependencies');
  await runOutput(['yarn', 'workspaces', 'focus', '--all', '--production'], {
    cwd: workspaceDir,
  });

  return workspaceDir;
}

/**
 * Pin the yarn version in a directory to the one we're using in the Backstage repo
 */
async function pinYarnVersion(dir: string) {
  const yarnRc = await fs.readFile(ownPaths.resolveRoot('.yarnrc.yml'), 'utf8');
  const yarnRcLines = yarnRc.split(/\r?\n/);
  const yarnPathLine = yarnRcLines.find(line => line.startsWith('yarnPath:'));
  if (!yarnPathLine) {
    throw new Error(`Unable to find 'yarnPath' in ${yarnRc}`);
  }
  const match = yarnPathLine.match(/^yarnPath: (.*)$/);
  if (!match) {
    throw new Error(`Invalid 'yarnPath' in ${yarnRc}`);
  }
  const [, localYarnPath] = match;
  const yarnPath = ownPaths.resolveRoot(localYarnPath);
  const yarnPluginPath = ownPaths.resolveRoot(
    localYarnPath,
    '../../plugins/@yarnpkg/plugin-workspace-tools.cjs',
  );

  // Intentionally writes a minimal yarnrc rather than merging with the template's.
  // The create-app template enables `npmMinimalAgeGate`, which would block e2e runs
  // from validating freshly-published dependency bumps and ecosystem-fix releases.
  // New Yarn defaults must be set explicitly so install does not rewrite this file.
  await fs.writeFile(
    resolvePath(dir, '.yarnrc.yml'),
    `yarnPath: ${yarnPath}
nodeLinker: node-modules
enableGlobalCache: true
enableScripts: true
npmMinimalAgeGate: 0
approvedGitRepositories: []
plugins:
  - path: ${yarnPluginPath}
    spec: '@yarnpkg/plugin-workspace-tools'
`,
  );
}

/**
 * Creates a new app inside rootDir called test-app, using packages from the workspaceDir
 */
async function createApp(
  appName: string,
  workspaceDir: string,
  rootDir: string,
  pm: PackageManager,
  nodeLinker?: string,
) {
  const child = run(
    [
      'node',
      resolvePath(workspaceDir, 'packages/create-app/bin/backstage-create-app'),
      '--skip-install',
      ...pm.createAppArgs(),
    ],
    {
      cwd: rootDir,
      stdio: ['pipe', 'pipe', 'pipe'],
    },
  );

  try {
    let stdout = '';
    child.stdout?.on('data', data => {
      stdout = stdout + data.toString('utf8');
    });

    await waitFor(() => stdout.includes('Enter a name for the app'));
    child.stdin?.write(`${appName}\n`);

    print('Waiting for app create script to be done');
    await child.waitForExit();

    const appDir = resolvePath(rootDir, appName);

    if (pm.name === 'yarn') {
      print('Overriding yarn.lock with seed file from the create-app package');
      await overrideYarnLockSeed(appDir);
    }

    print('Rewriting module resolutions of app to use workspace packages');
    await overrideModuleResolutions(appDir, workspaceDir, pm);

    // Yarn does not clean up node_module folders in the linked in dependencies by itself
    print('Cleaning up node_modules in workspace');
    await fs.remove(resolvePath(workspaceDir, 'node_modules'));
    for (const wsDir of ['packages', 'plugins']) {
      for (const dir of await fs.readdir(resolvePath(workspaceDir, wsDir))) {
        const moduleDir = resolvePath(workspaceDir, wsDir, dir, 'node_modules');
        if (await fs.pathExists(moduleDir)) {
          await fs.remove(moduleDir);
        }
      }
    }

    if (pm.name === 'yarn') {
      print('Pinning yarn version and registry in app');
      await pinYarnVersion(appDir);
    } else {
      print(
        'Pinning pnpm version, relaxing install checks and pinning registry in app',
      );
      await pinPnpmVersion(appDir);
      await relaxPnpmInstallChecks(appDir);
      if (nodeLinker) {
        print(`Switching the app to the ${nodeLinker} node linker`);
        await setPnpmNodeLinker(appDir, nodeLinker);
      }
    }
    await fs.writeFile(
      resolvePath(appDir, '.npmrc'),
      'registry=https://registry.npmjs.org/\n',
    );

    print('Test app created');

    for (const cmd of [
      pm.install(),
      ...[
        'tsc:full',
        'build:all',
        'lint:all',
        'prettier:check',
        'test:all',
      ].map(script => pm.run(script)),
    ]) {
      print(`Running '${cmd.join(' ')}' in newly created app`);
      await runOutput(cmd, { cwd: appDir });
    }

    return appDir;
  } finally {
    child.kill();
  }
}

/**
 * Overrides the downloaded yarn.lock file with the seed file packages/create-app/seed-yarn.lock
 * This ensures that the E2E tests use the same seed file as users would receive when creating a new app
 */
async function overrideYarnLockSeed(appDir: string) {
  const content = await fs.readFile(
    ownPaths.resolveRoot('packages/create-app/seed-yarn.lock'),
    'utf8',
  );
  const trimmedContent = content
    .split('\n')
    .filter(l => !l.startsWith('//'))
    .join('\n');
  await fs.writeFile(resolvePath(appDir, 'yarn.lock'), trimmedContent, 'utf8');
}

/**
 * Pins the app to the pnpm version that runs the test, rather than the one the
 * template pins. pnpm would otherwise switch to the pinned version, and CI
 * would never test the lowest supported version.
 */
async function pinPnpmVersion(appDir: string) {
  // pnpm refuses to run in this repository, since its package.json pins Yarn
  const version = (
    await runOutput(['pnpm', '--version'], { cwd: os.tmpdir() })
  ).trim();
  const pkgJsonPath = resolvePath(appDir, 'package.json');
  const pkgJson = await fs.readJson(pkgJsonPath);
  pkgJson.packageManager = `pnpm@${version}`;
  await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
}

/**
 * Switches the node linker of a pnpm app, so that the app can be tested with
 * the isolated layout as well as the hoisted one that the template uses.
 */
async function setPnpmNodeLinker(appDir: string, nodeLinker: string) {
  const workspaceYamlPath = resolvePath(appDir, 'pnpm-workspace.yaml');
  const doc = parseDocument(await fs.readFile(workspaceYamlPath, 'utf8'));
  doc.set('nodeLinker', nodeLinker);
  await fs.writeFile(workspaceYamlPath, doc.toString({ singleQuote: true }));
}

/**
 * This points dependency resolutions into the workspace for each package that is present there
 *
 * For Yarn this is done through the `resolutions` field in package.json, while
 * pnpm reads the equivalent `overrides` from pnpm-workspace.yaml.
 */
async function overrideModuleResolutions(
  appDir: string,
  workspaceDir: string,
  pm: PackageManager,
) {
  const pkgJsonPath = resolvePath(appDir, 'package.json');
  const pkgJson = await fs.readJson(pkgJsonPath);

  if (pm.name === 'yarn') {
    pkgJson.resolutions = pkgJson.resolutions || {};
  }
  pkgJson.dependencies = pkgJson.dependencies || {};

  const overrides = new Map<string, string>();

  for (const dir of ['packages', 'plugins']) {
    const packageNames = await fs.readdir(resolvePath(workspaceDir, dir));
    for (const pkgDir of packageNames) {
      const pkgPath = joinPath('..', 'workspace', dir, pkgDir);
      const { name } = await fs.readJson(
        resolvePath(workspaceDir, dir, pkgDir, 'package.json'),
      );

      pkgJson.dependencies[name] = `file:${pkgPath}`;
      overrides.set(name, `file:${pkgPath}`);
      if (pm.name === 'yarn') {
        pkgJson.resolutions[name] = `file:${pkgPath}`;
      }
      if (pkgJson.devDependencies) {
        delete pkgJson.devDependencies[name];
      }
    }
  }
  await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });

  if (pm.name === 'pnpm') {
    // Every workspace package is a root dependency here, which pulls their
    // peer dependencies into the root as well. Some accept React 17, and the
    // hoisted linker of pnpm 11 then puts React 17 in the root node_modules,
    // where the app build picks it up. A generated app has no such root
    // dependencies, so the root gets the React version of the app.
    const appPkgJson = await fs.readJson(
      resolvePath(appDir, 'packages/app/package.json'),
    );
    for (const name of ['react', 'react-dom']) {
      const range = appPkgJson.dependencies?.[name];
      if (range) {
        pkgJson.dependencies[name] = range;
      }
    }
    await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });

    const workspaceYamlPath = resolvePath(appDir, 'pnpm-workspace.yaml');
    const doc = parseDocument(await fs.readFile(workspaceYamlPath, 'utf8'));
    for (const [name, target] of overrides) {
      doc.setIn(['overrides', name], target);
    }
    // Single quotes match the template and the prettier config of the app
    await fs.writeFile(workspaceYamlPath, doc.toString({ singleQuote: true }));
  }
}

/**
 * Relaxes two pnpm install checks in the created app.
 *
 * The template sets `minimumReleaseAge`, which would block e2e runs from
 * validating freshly-published dependency bumps and ecosystem-fix releases.
 * This is the pnpm equivalent of the `npmMinimalAgeGate: 0` setting used for
 * Yarn apps.
 *
 * Frozen installs are turned off, since pnpm enables them by default when the
 * CI environment variable is set and a lockfile exists. The first install
 * creates the lockfile, but the installs that `backstage-cli new` runs after
 * adding a plugin need to update it. This is the pnpm equivalent of the
 * YARN_ENABLE_IMMUTABLE_INSTALLS=false setting used for Yarn apps, but is
 * written to pnpm-workspace.yaml so that it applies regardless of how pnpm is
 * invoked.
 */
async function relaxPnpmInstallChecks(appDir: string) {
  const workspaceYamlPath = resolvePath(appDir, 'pnpm-workspace.yaml');
  const doc = parseDocument(await fs.readFile(workspaceYamlPath, 'utf8'));
  doc.set('minimumReleaseAge', 0);
  const pair = doc.createPair('frozenLockfile', false);
  pair.key.commentBefore =
    ' Added by the e2e test, lets the installs that run after new plugins are\n' +
    ' created update the lockfile even though CI is set.';
  pair.key.spaceBefore = true;
  doc.add(pair);
  await fs.writeFile(workspaceYamlPath, doc.toString({ singleQuote: true }));
}

/**
 * Uses create-plugin command to create a new plugin in the app
 */
async function createPlugin(options: {
  appDir: string;
  pluginId: string;
  select: string;
  pm: PackageManager;
}) {
  const { appDir, pluginId, select, pm } = options;
  const child = run(
    pm.newPackage('--select', select, '--option', `pluginId=${pluginId}`),
    {
      cwd: appDir,
      stdio: ['pipe', 'pipe', 'pipe'],
    },
  );

  try {
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (data: Buffer) => {
      stdout = stdout + data.toString('utf8');
    });
    child.stderr?.on('data', (data: Buffer) => {
      stderr = stderr + data.toString('utf8');
    });

    print('Waiting for plugin create script to be done');
    await child.waitForExit();

    const pluginDir = resolvePath(
      appDir,
      'plugins',
      select === 'backend-plugin' ? `${pluginId}-backend` : pluginId,
    );

    const tscCmd = pm.run('tsc');
    print(`Running '${tscCmd.join(' ')}' in root for newly created plugin`);
    await runOutput(tscCmd, { cwd: appDir });

    for (const cmd of [pm.run('lint'), pm.run('test', '--no-watch')]) {
      print(`Running '${cmd.join(' ')}' in newly created plugin`);
      await runOutput(cmd, { cwd: pluginDir });
    }
  } finally {
    child.kill();
  }
}

/** Drops PG databases */
async function dropDB(database: string, client: string) {
  try {
    if (client === 'postgres') {
      const config = {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      };
      await pgtools.dropdb(config, database);
    } else if (client === 'mysql') {
      const connectionString = process.env.MYSQL_CONNECTION ?? '';
      const connection = await mysql.createConnection(connectionString);
      await connection.execute('DROP DATABASE ?', [database]);
    }
  } catch (_) {
    /* do nothing */
  }
}

/** Clean remnants from prior e2e runs */
async function preCleanDatabase() {
  print('Dropping old DBs');
  if (Boolean(process.env.POSTGRES_HOST)) {
    await dropClientDatabases('postgres');
  }
  if (Boolean(process.env.MYSQL_CONNECTION)) {
    await dropClientDatabases('mysql');
  }
  print('Dropped DBs');
}

async function dropClientDatabases(client: string) {
  await Promise.all(
    [
      'catalog',
      'scaffolder',
      'auth',
      'identity',
      'proxy',
      'techdocs',
      'search',
    ].map(name => dropDB(`backstage_plugin_${name}`, client)),
  );
}

/**
 * Start serving the newly created backend and make sure that all db migrations works correctly
 */
async function testBackendStart(
  appDir: string,
  pm: PackageManager,
  ...args: string[]
) {
  const child = run(pm.workspaceRun('backend', 'start', ...args), {
    cwd: appDir,
    // Windows does not like piping stdin here, the child process will hang when requiring the 'process' module
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      GITHUB_TOKEN: 'abc',
      // Ensure that the backend fails on unhandledRejection errors.
      NODE_ENV: 'test',
      // TODO: Default auth policy is disabled for e2e tests - replace this with external service auth
      APP_CONFIG_backend_auth_dangerouslyDisableDefaultAuthPolicy: 'true',
    },
  });

  let stdout = '';
  let stderr = '';
  child.stdout?.on('data', (data: Buffer) => {
    stdout = stdout + data.toString('utf8');
  });
  child.stderr?.on('data', (data: Buffer) => {
    stderr = stderr + data.toString('utf8');
  });
  let successful = false;

  const filterStderr = (input: string) => {
    const lines = input.split('\n').filter(Boolean);
    return lines.filter(
      l =>
        !l.includes(
          'ExperimentalWarning: Custom ESM Loaders is an experimental feature', // Node 16
        ) &&
        !l.includes(
          'ExperimentalWarning: `--experimental-loader` may be removed in the future;', // Node 18
        ) &&
        !l.includes("--import 'data:text/javascript,import") && // the new --experimental-loader replacement warning, printed after the above, Node 18
        !l.includes(
          'ExperimentalWarning: `globalPreload` is planned for removal in favor of `initialize`.', // Node 18
        ) &&
        !l.includes(
          'DeprecationWarning: The `punycode` module is deprecated.', // Node 22
        ) &&
        !l.includes('node --trace-warnings ...') &&
        !l.includes('node --trace-deprecation ...') &&
        !pm.stderrNoisePatterns.some(pattern => pattern.test(l)),
    );
  };

  try {
    await waitFor(
      () =>
        stdout.includes('Plugin initialization complete') ||
        filterStderr(stderr).length > 0,
    );
    const stderrLines = filterStderr(stderr);
    if (stderrLines.length > 0) {
      print(
        `Expected stderr to be clean, got ${stderr} \n\nThe following lines were unexpected:\n${stderrLines.join(
          '\n',
        )}`,
      );
      // Skipping the whole block
      throw new Error(stderr);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));

    print('Try to fetch entities from the backend');
    const maxAttempts = 3;
    const errors: Error[] = [];
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (attempt > 1) {
        if (child.exitCode !== null) {
          errors.push(
            new Error(
              `Backend process exited with code ${child.exitCode} before fetch could succeed`,
            ),
          );
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      try {
        const res = await fetch('http://localhost:7007/api/catalog/entities');
        if (!res.ok) {
          throw new Error(
            `Failed to fetch entities: ${res.status} ${res.statusText}`,
          );
        }
        const content = await res.text();
        try {
          JSON.parse(content);
        } catch (parseError) {
          throw new Error(
            `Failed to parse entities JSON response: ${stringifyError(
              parseError,
            )}\n${content}`,
          );
        }
        errors.length = 0;
        break;
      } catch (error) {
        errors.push(isError(error) ? error : new Error(stringifyError(error)));
      }
    }
    if (errors.length > 0) {
      throw new Error(
        `Failed to fetch entities after ${maxAttempts} attempts:\n${errors
          .map(e => `  - ${e.message}`)
          .join('\n')}`,
      );
    }
    print('Entities fetched successfully');
    successful = true;
  } catch (error) {
    print('');
    print(`Backend stdout:\n${stdout}`);
    if (stderr) {
      print(`Backend stderr:\n${stderr}`);
    }
    throw new Error(`Backend failed to startup: ${error}`);
  } finally {
    print('Stopping the child process');
    // Kill entire process group, otherwise we'll end up with hanging serve processes
    await new Promise<void>((res, rej) => {
      killTree(child.pid!, err => (err ? rej(err) : res()));
    });
  }

  try {
    await child.waitForExit();
  } catch (error) {
    if (!successful) {
      throw new Error(`Backend failed to startup: ${stderr}`);
    }
    print('Backend startup test finished successfully');
  }
}
