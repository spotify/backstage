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

import { run, runOutput, RunOnOutput } from '@backstage/cli-common';
import { PackageManager, Pnpm, Yarn } from '@backstage/cli-node/alpha';
import chalk from 'chalk';
import fs from 'fs-extra';
import {
  basename,
  isAbsolute,
  join as joinPath,
  relative as relativePath,
  resolve as resolvePath,
  sep as pathSep,
} from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { createStepLogger, showLogOnError } from './stepLogger';

type StepLogger = ReturnType<typeof createStepLogger>;

/**
 * The steps of the bundle command that depend on the package manager of the
 * source project. The bundle is a project of its own, and each package
 * manager has its own way of turning the bundle directory into a project
 * root, carrying over dependency overrides, and pruning and installing the
 * lockfile.
 */
export interface BundlePackageManagerSteps {
  /** The lockfile that is seeded into the bundle. */
  lockfileName: string;

  /**
   * Establishes the bundle directory as its own project root, so that the
   * seeded lockfile is the one the package manager reads and writes even when
   * the output directory is inside another monorepo.
   */
  prepareBundleDir(options: {
    targetDir: string;
    rootDir: string;
    rootPkg: Record<string, any>;
  }): Promise<void>;

  /**
   * Reads the dependency overrides of the source project, which are merged
   * into the overrides of the bundle.
   */
  readRootOverrides(options: {
    rootDir: string;
    rootPkg: Record<string, any>;
  }): Promise<Record<string, string> | undefined>;

  /**
   * Stores the merged overrides of the bundle where the package manager reads
   * them. On entry they are in the `resolutions` field of `targetPkg`, which
   * is written to the bundle `package.json` afterwards. May also add other
   * fields to `targetPkg` that the package manager needs in the bundle.
   */
  writeOverrides(options: {
    targetDir: string;
    rootDir: string;
    rootPkg: Record<string, any>;
    targetPkg: Record<string, unknown>;
  }): Promise<void>;

  /**
   * Prunes the seeded lockfile of the bundle down to the entries that its
   * `package.json` still needs, without network access.
   */
  pruneLockfile(options: {
    targetDir: string;
    rootDir: string;
    verbose: boolean;
  }): Promise<void>;

  /**
   * Installs the dependencies of the bundle from the pruned lockfile into a
   * private `node_modules`, without modifying the lockfile.
   */
  installDependencies(options: {
    targetDir: string;
    verbose: boolean;
  }): Promise<void>;

  /** Removes files that the install left behind outside of `node_modules`. */
  cleanupAfterInstall(targetDir: string): Promise<void>;
}

/**
 * Captures the output of a step in a log file that is shown on failure and
 * removed on success.
 */
async function runLoggedStep(
  logFilePath: string,
  verbose: boolean,
  prefix: string,
  step: (log: StepLogger) => Promise<void>,
): Promise<void> {
  const log = createStepLogger(logFilePath, verbose, prefix);
  try {
    await step(log);
  } catch (err) {
    await log.close();
    await showLogOnError(log.path, verbose);
    throw err;
  }
  await log.close();
  await fs.remove(log.path);
}

// ── Yarn ─────────────────────────────────────────────────────────────────

const yarnSteps: BundlePackageManagerSteps = {
  lockfileName: 'yarn.lock',

  async prepareBundleDir({ targetDir, rootDir, rootPkg }) {
    const yarnrcLines = ['nodeLinker: node-modules'];
    try {
      // Include yarnPath so the same Yarn version that created the lockfile
      // is used for pruning/installing -- lockfile formats differ across
      // major Yarn versions (e.g. ~builtin vs optional!builtin patches).
      const resolved = await runOutput(['yarn', 'config', 'get', 'yarnPath'], {
        cwd: rootDir,
      });
      const yarnPathSentinels = new Set(['undefined', 'null']);
      if (resolved && !yarnPathSentinels.has(resolved)) {
        yarnrcLines.push(`yarnPath: ${resolved}`);
      }
    } catch {
      // yarnPath not configured — check if corepack manages the version instead
      if (!rootPkg.packageManager) {
        console.warn(
          chalk.yellow(
            'No yarnPath configured and no packageManager field found. ' +
              'The Yarn version in PATH will be used for lockfile operations.',
          ),
        );
      }
    }

    await fs.writeFile(
      joinPath(targetDir, '.yarnrc.yml'),
      `${yarnrcLines.join('\n')}\n`,
    );
  },

  async readRootOverrides({ rootPkg }) {
    return rootPkg?.resolutions;
  },

  async writeOverrides() {
    // Yarn reads the merged overrides from the `resolutions` field of the
    // bundle package.json, where they already are.
  },

  async pruneLockfile({ targetDir, rootDir, verbose }) {
    const sourceCacheFolder = await runOutput(
      ['yarn', 'config', 'get', 'cacheFolder'],
      { cwd: rootDir },
    );

    await runLoggedStep(
      joinPath(targetDir, 'lockfile-prune.log'),
      verbose,
      '[lockfile-prune] ',
      async pruneLog => {
        await run(
          ['yarn', 'install', '--no-immutable', '--mode', 'update-lockfile'],
          {
            cwd: targetDir,
            env: {
              YARN_ENABLE_GLOBAL_CACHE: 'false',
              YARN_ENABLE_NETWORK: '0',
              YARN_ENABLE_MIRROR: 'false',
              YARN_CACHE_FOLDER: sourceCacheFolder,
            },
            onStdout: pruneLog.logRunOutput('out'),
            onStderr: pruneLog.logRunOutput('err'),
          },
        ).waitForExit();
      },
    );
  },

  async installDependencies({ targetDir, verbose }) {
    const yarn = await Yarn.create({ workspaceRootDir: targetDir });
    await runLoggedStep(
      joinPath(targetDir, 'yarn-install.log'),
      verbose,
      '[yarn-install] ',
      async installLog => {
        await yarn.install({
          immutable: true,
          onStdout: installLog.logRunOutput('out'),
          onStderr: installLog.logRunOutput('err'),
        });
      },
    );
  },

  async cleanupAfterInstall(targetDir) {
    // Clean up .yarn directory created during install
    const yarnDir = joinPath(targetDir, '.yarn');
    if (await fs.pathExists(yarnDir)) {
      await fs.remove(yarnDir);
    }
  },
};

// ── pnpm ─────────────────────────────────────────────────────────────────

/**
 * Settings of the source `pnpm-workspace.yaml` that the bundle copies.
 *
 * The first group makes the offline steps work. pnpm's store and metadata
 * cache are global on the machine, and the offline steps rely on both having
 * been filled by the install in the source project, so the bundle looks in
 * the same place. `minimumReleaseAge` and `resolutionMode` select between
 * separate metadata caches, and `allowBuilds` builds the same native
 * dependencies as the source project.
 *
 * The second group changes what the lockfile resolves to. pnpm records these
 * in the lockfile and re-resolves the seeded one when they do not match, which
 * it does without an error, so a bundle built without them is quietly wrong.
 */
const PNPM_SETTINGS_TO_COPY = [
  'storeDir',
  'cacheDir',
  'minimumReleaseAge',
  'minimumReleaseAgeExclude',
  'resolutionMode',
  'allowBuilds',
  'packageExtensions',
  'peerDependencyRules',
  'ignoredOptionalDependencies',
  'supportedArchitectures',
  'autoInstallPeers',
  'excludeLinksFromLockfile',
  'dedupePeerDependents',
  'catalog',
  'catalogs',
];

const PNPM_PATH_SETTINGS = new Set(['storeDir', 'cacheDir']);

/** Settings that the bundle sets itself, or handles separately. */
const PNPM_SETTINGS_SET_BY_BUNDLE = new Set([
  // The bundle is a single package, not the workspace of the source project
  'packages',
  // The bundle always uses the flat layout that Yarn produces
  'nodeLinker',
  // Merged with the resolutions of the plugin and written from those
  'overrides',
  // Copied together with the patch files it points at
  'patchedDependencies',
]);

/**
 * Settings that cannot change what the bundle installs. They describe the
 * workspace layout of the source project, which the bundle does not have, or
 * they only affect how the package manager is used during development. The
 * hoisting patterns are in this group because the bundle picks its own linker.
 */
const PNPM_SETTINGS_WITHOUT_EFFECT_ON_BUNDLE = new Set([
  'hoist',
  'hoistPattern',
  'hoistWorkspacePackages',
  'publicHoistPattern',
  'shamefullyHoist',
  'modulesDir',
  'virtualStoreDir',
  'virtualStoreDirMaxLength',
  'enableGlobalVirtualStore',
  'sharedWorkspaceLockfile',
  'linkWorkspacePackages',
  'preferWorkspacePackages',
  'saveWorkspaceProtocol',
  'injectWorkspacePackages',
  'ignoreWorkspaceRootCheck',
  'recursiveInstall',
  'strictPeerDependencies',
  'enablePrePostScripts',
  'verifyDepsBeforeRun',
  'managePackageManagerVersions',
  'updateNotifier',
]);

/**
 * Copies the patch files of the source project into the bundle and returns a
 * `patchedDependencies` setting that points at the copies. A patch that is
 * inside the source project keeps its path, so that two patch files with the
 * same name do not collide.
 */
async function copyPnpmPatches(options: {
  rootDir: string;
  targetDir: string;
  patchedDependencies: Record<string, unknown>;
}): Promise<Record<string, string>> {
  const { rootDir, targetDir, patchedDependencies } = options;

  const copied: Record<string, string> = {};
  for (const [name, value] of Object.entries(patchedDependencies)) {
    if (typeof value !== 'string') {
      continue;
    }
    const patchPath = isAbsolute(value) ? value : resolvePath(rootDir, value);
    if (!(await fs.pathExists(patchPath))) {
      console.warn(
        chalk.yellow(
          `The patch file for ${chalk.cyan(name)} was not found at ${chalk.cyan(
            patchPath,
          )}, the bundle will not be patched`,
        ),
      );
      continue;
    }
    const fromRoot = relativePath(rootDir, patchPath);
    const bundlePath =
      fromRoot && !fromRoot.startsWith('..') && !isAbsolute(fromRoot)
        ? fromRoot
        : joinPath('patches', basename(patchPath));
    await fs.copy(patchPath, joinPath(targetDir, bundlePath));
    copied[name] = bundlePath.split(pathSep).join('/');
  }
  return copied;
}

async function readPnpmWorkspaceConfig(
  rootDir: string,
): Promise<Record<string, unknown>> {
  const configPath = joinPath(rootDir, 'pnpm-workspace.yaml');
  if (!(await fs.pathExists(configPath))) {
    return {};
  }
  const parsed = parseYaml(await fs.readFile(configPath, 'utf8'));
  return parsed && typeof parsed === 'object' ? parsed : {};
}

/**
 * Turns pnpm output about a package that its cache lacks in an offline step
 * into a description of what is missing and which settings decide where pnpm
 * looks for it. pnpm wraps long messages across lines, so the output is
 * matched with collapsed whitespace.
 */
export function describeMissingFromPnpmCache(
  output: string,
): string | undefined {
  // eslint-disable-next-line no-control-regex
  const text = output.replace(/[│├╰─▶×]|\x1b\[[0-9;]*m/g, ' ');
  const collapsed = text.replace(/\s+/g, ' ');

  const tarball = collapsed.match(/Failed to fetch tarball for (\S+) from/);
  if (tarball || collapsed.includes('ERR_PNPM_NO_OFFLINE_TARBALL')) {
    const name = tarball?.[1] ?? 'a package';
    return (
      `pnpm has no stored copy of ${name}. The bundle uses the package ` +
      `store from the storeDir setting in the pnpm-workspace.yaml of the ` +
      `project, so install the project with the same settings before bundling.`
    );
  }

  const metadata = collapsed.match(/Failed to resolve (\S+) in package mirror/);
  if (metadata || collapsed.includes('ERR_PNPM_NO_OFFLINE_META')) {
    const name = metadata?.[1] ?? 'a package';
    return (
      `pnpm has no cached metadata for ${name}. The bundle reads the ` +
      `metadata cache through the cacheDir, minimumReleaseAge, and ` +
      `resolutionMode settings in the pnpm-workspace.yaml of the project, so ` +
      `install the project with the same settings before bundling.`
    );
  }

  return undefined;
}

/**
 * Runs a pnpm step that is offline. When it fails because the pnpm cache
 * lacks a package, the error says which one and which settings decide where
 * pnpm looks for it. The step is not retried online, since a caller that asks
 * for an offline bundle usually has no network to fall back to.
 */
async function runOfflinePnpmStep(
  log: StepLogger,
  description: string,
  step: (output: {
    onStdout: RunOnOutput;
    onStderr: RunOnOutput;
  }) => Promise<void>,
): Promise<void> {
  const chunks: string[] = [];
  const capture =
    (forward: RunOnOutput): RunOnOutput =>
    data => {
      chunks.push(data.toString('utf8'));
      forward(data);
    };

  try {
    await step({
      onStdout: capture(log.logRunOutput('out')),
      onStderr: capture(log.logRunOutput('err')),
    });
  } catch (error) {
    const missing = describeMissingFromPnpmCache(chunks.join(''));
    if (missing) {
      throw new Error(`The offline ${description} failed. ${missing}`);
    }
    throw error;
  }
}

const pnpmSteps: BundlePackageManagerSteps = {
  lockfileName: 'pnpm-lock.yaml',

  async prepareBundleDir() {
    // The bundle pnpm-workspace.yaml is written together with the overrides
    // once those are known, which is before pnpm first runs in the bundle.
  },

  async readRootOverrides({ rootDir }) {
    const { overrides } = await readPnpmWorkspaceConfig(rootDir);
    if (!overrides || typeof overrides !== 'object') {
      return undefined;
    }
    return Object.fromEntries(
      Object.entries(overrides).filter(
        ([, value]) => typeof value === 'string',
      ),
    );
  },

  async writeOverrides({ targetDir, rootDir, rootPkg, targetPkg }) {
    const rootConfig = await readPnpmWorkspaceConfig(rootDir);

    // The bundle may be written outside the source project, where the
    // `packageManager` pin of the source root is not found. Carry it over so
    // that pnpm uses the version that created the seeded lockfile.
    if (
      typeof rootPkg.packageManager === 'string' &&
      rootPkg.packageManager.startsWith('pnpm@')
    ) {
      targetPkg.packageManager = rootPkg.packageManager;
    }

    // Establish the bundle directory as its own pnpm workspace root, with the
    // same flat node_modules layout that Yarn produces.
    const config: Record<string, unknown> = { nodeLinker: 'hoisted' };
    for (const key of PNPM_SETTINGS_TO_COPY) {
      const value = rootConfig[key];
      if (value === undefined) {
        continue;
      }
      if (PNPM_PATH_SETTINGS.has(key) && typeof value === 'string') {
        // Relative paths are relative to the source project root
        config[key] =
          isAbsolute(value) || value.startsWith('~')
            ? value
            : resolvePath(rootDir, value);
      } else {
        config[key] = value;
      }
    }

    // A patch is applied through a file, so the files come along with the
    // setting that names them.
    const patchedDependencies = rootConfig.patchedDependencies;
    if (patchedDependencies && typeof patchedDependencies === 'object') {
      const copied = await copyPnpmPatches({
        rootDir,
        targetDir,
        patchedDependencies: patchedDependencies as Record<string, unknown>,
      });
      if (Object.keys(copied).length > 0) {
        config.patchedDependencies = copied;
      }
    }

    // pnpm ignores the `resolutions` field, so the merged overrides go into
    // the workspace file instead.
    const overrides = targetPkg.resolutions as
      | Record<string, string>
      | undefined;
    delete targetPkg.resolutions;
    if (overrides && Object.keys(overrides).length > 0) {
      config.overrides = overrides;
    }

    // A setting that is neither carried nor known to be irrelevant may change
    // what the bundle installs, so say so rather than let the difference pass
    // unnoticed.
    const notCarried = Object.keys(rootConfig).filter(
      key =>
        !PNPM_SETTINGS_TO_COPY.includes(key) &&
        !PNPM_SETTINGS_SET_BY_BUNDLE.has(key) &&
        !PNPM_SETTINGS_WITHOUT_EFFECT_ON_BUNDLE.has(key),
    );
    if (notCarried.length > 0) {
      console.warn(
        chalk.yellow(
          `These pnpm settings of the project are not carried into the bundle: ${chalk.cyan(
            notCarried.join(', '),
          )}. If the bundle resolves dependencies differently than the ` +
            `project, this is the first place to look.`,
        ),
      );
    }

    await fs.writeFile(
      joinPath(targetDir, 'pnpm-workspace.yaml'),
      stringifyYaml(config),
    );
  },

  async pruneLockfile({ targetDir, verbose }) {
    const pnpm = await Pnpm.create({ workspaceRootDir: targetDir });
    await runLoggedStep(
      joinPath(targetDir, 'lockfile-prune.log'),
      verbose,
      '[lockfile-prune] ',
      async pruneLog => {
        await runOfflinePnpmStep(pruneLog, 'lockfile prune', async output => {
          // The seeded lockfile belongs to another project, so the prune must
          // be able to rewrite it even where pnpm defaults to a frozen
          // lockfile, such as in CI.
          await pnpm.run(
            ['install', '--lockfile-only', '--no-frozen-lockfile', '--offline'],
            output,
          );
        });
      },
    );
  },

  async installDependencies({ targetDir, verbose }) {
    const pnpm = await Pnpm.create({ workspaceRootDir: targetDir });
    await runLoggedStep(
      joinPath(targetDir, 'pnpm-install.log'),
      verbose,
      '[pnpm-install] ',
      async installLog => {
        await runOfflinePnpmStep(installLog, 'install', async output => {
          await pnpm.install({ immutable: true, offline: true, ...output });
        });
      },
    );
  },

  async cleanupAfterInstall() {
    // pnpm keeps its install state inside node_modules, in the same way that
    // Yarn keeps node_modules/.yarn-state.yml, and leaves nothing behind
    // outside of it.
  },
};

/** Returns the bundle steps for the package manager of the source project. */
export function getBundlePackageManagerSteps(
  packageManager: PackageManager,
): BundlePackageManagerSteps {
  switch (packageManager.name()) {
    case 'yarn':
      return yarnSteps;
    case 'pnpm':
      return pnpmSteps;
    default:
      throw new Error(
        `The package bundle command does not support ${packageManager.name()}`,
      );
  }
}
