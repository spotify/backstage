/*
 * Copyright 2024 The Backstage Authors
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

import { Yarn } from './yarn';
import { Pnpm } from './pnpm';
import { Lockfile } from './Lockfile';
import { targetPaths } from '@backstage/cli-common';
import { RunOnOutput, RunOptions } from '@backstage/cli-common';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'node:path';

/**
 * Package info retrieved from the package manager, usually from NPM.
 *
 * @alpha
 */
export type PackageInfo = {
  name: string;
  'dist-tags': Record<string, string>;
  versions: string[];
  time: { [version: string]: string };
};

/**
 * Options for {@link PackageManager.install}.
 *
 * @alpha
 */
export type PackageManagerInstallOptions = {
  /**
   * Whether the install may modify the lockfile. `true` refuses to modify it.
   * `false` allows it even where the package manager would otherwise refuse,
   * such as in CI. When not set, the package manager's own default applies.
   */
  immutable?: boolean;

  /** Whether to install without network access, using only cached packages. */
  offline?: boolean;

  /** Additional environment variables to pass to the package manager. */
  env?: Partial<NodeJS.ProcessEnv>;

  /** Called with each chunk of output written to stdout by the package manager. */
  onStdout?: RunOnOutput;

  /** Called with each chunk of output written to stderr by the package manager. */
  onStderr?: RunOnOutput;
};

/**
 * Options for {@link PackageManager.parseLockfile}.
 *
 * @alpha
 */
export type ParseLockfileOptions = {
  /**
   * Reads the `package.json` file of a workspace package, given the directory
   * of the package relative to the workspace root with forward slashes. It must
   * read from the same source as the lockfile contents, such as the same git
   * ref, and return `undefined` when the file doesn't exist there.
   *
   * Lockfiles that list workspace packages by directory, such as the pnpm
   * lockfile, use it to name them. Without it those packages can't be named,
   * and diffing the lockfile fails.
   */
  readWorkspacePackageJson?: (
    dir: string,
  ) => Promise<{ name?: string; version?: string } | undefined>;
};

/**
 * The package manager of a workspace.
 *
 * @remarks
 *
 * An instance is bound to the workspace root that it was created for, which
 * decides the lockfile and the package manager settings. Methods that run a
 * command run it in the workspace root unless a `cwd` is given, and never in
 * the current working directory of the process.
 *
 * @alpha
 */
export interface PackageManager {
  /** The name of the package manager, for example `yarn`. */
  name(): string;

  /** The self-reported version of the package manager. */
  version(): Promise<string>;

  /** The file name of the lockfile used by the package manager, for example `yarn.lock`. */
  lockfileName(): string;

  /**
   * Installs the dependencies of the whole workspace. There is no `cwd`
   * option, since an install always acts on the entire workspace.
   */
  install(options?: PackageManagerInstallOptions): Promise<void>;

  /** Uses the package manager to run a command. */
  run(args: string[], options?: RunOptions): Promise<void>;

  /**
   * Runs a `package.json` script through the package manager, with any
   * additional arguments forwarded to the script. The script is taken from
   * the package in `options.cwd`, which defaults to the workspace root.
   */
  runScript(
    script: string,
    args?: string[],
    options?: RunOptions,
  ): Promise<void>;

  /**
   * Runs a `package.json` script of the named workspace package through the
   * package manager, with any additional arguments forwarded to the script.
   */
  runWorkspaceScript(
    workspace: string,
    script: string,
    args?: string[],
    options?: RunOptions,
  ): Promise<void>;

  /**
   * Executes the package manager's pack command to bundle the package in
   * `packageDir` into an archive written to `output`. Any `options` are
   * forwarded to the pack process, except that `cwd` is always `packageDir`.
   */
  pack(output: string, packageDir: string, options?: RunOptions): Promise<void>;

  /** Fetches information about the given package, usually from NPM. */
  fetchPackageInfo(name: string): Promise<PackageInfo>;

  /** Reads the lockfile in the workspace root. See {@link Lockfile} */
  loadLockfile(): Promise<Lockfile>;

  /** Parses the given string as a {@link Lockfile}. */
  parseLockfile(
    contents: string,
    options?: ParseLockfileOptions,
  ): Promise<Lockfile>;

  /**
   * Whether the package manager supports the 'backstage:^' version protocol.
   */
  supportsBackstageVersionProtocol(): Promise<boolean>;

  /**
   * Reads the dependency catalogs of the workspace, keyed by catalog name. The
   * default catalog, which `catalog:` refers to, is named `default`. Only
   * implemented by package managers that support catalogs.
   */
  readCatalogs?(): Promise<Record<string, Record<string, string>>>;

  /**
   * Reads the dependency overrides of the workspace, keyed by their selector,
   * for example `foo`, `foo@^1`, or `bar>foo`. Overrides take precedence over
   * the ranges in `package.json` files and over the catalogs. Not implemented
   * for Yarn yet, where the `resolutions` field has the same role.
   */
  readOverrides?(): Promise<Record<string, string>>;

  /**
   * Sets the given dependency versions in an existing catalog of the
   * workspace, using the names from {@link PackageManager.readCatalogs}. Fails
   * when the catalog does not exist. Only implemented by package managers that
   * support catalogs.
   */
  updateCatalog?(name: string, versions: Record<string, string>): Promise<void>;

  /**
   * Returns the command that a user would type to run the given arguments
   * through the package manager, for example `yarn backstage-cli repo fix`.
   * Intended for messages to the user.
   */
  getCommandHint(args: string[]): string;

  /** A string representation of the package manager. */
  toString(): string;
}

/**
 * Options for {@link detectPackageManager}.
 *
 * @alpha
 */
export type DetectPackageManagerOptions = {
  /**
   * The root of the workspace to detect the package manager for. Defaults to
   * the workspace root of the current working directory.
   */
  workspaceRootDir?: string;
};

const detectedPackageManagers = new Map<string, Promise<PackageManager>>();

/**
 * Detects the package manager of a workspace from the files in its root.
 *
 * @remarks
 *
 * The package manager is picked from the workspace root, in this order:
 *
 * 1. The `packageManager` field in the root `package.json`, when it names
 *    `yarn` or `pnpm`.
 * 2. A `pnpm-lock.yaml` file: pnpm.
 * 3. A `yarn.lock` file: Yarn.
 * 4. A `pnpm-workspace.yaml` file: pnpm.
 * 5. A `workspaces` field in the root `package.json`: Yarn.
 * 6. Otherwise Yarn, with a warning.
 *
 * A `packageManager` field that names another package manager is ignored with
 * a warning, and detection fails when the project files don't decide it
 * either. Only the workspace root is read, never a directory above or below
 * it. Detection warnings are written to stderr. The result is cached per
 * workspace root.
 *
 * @alpha
 */
export async function detectPackageManager(
  options?: DetectPackageManagerOptions,
): Promise<PackageManager> {
  const workspaceRootDir =
    options?.workspaceRootDir ?? targetPaths.workspaceRootDir;

  let detected = detectedPackageManagers.get(workspaceRootDir);
  if (!detected) {
    detected = detectPackageManagerInDir(workspaceRootDir);
    detectedPackageManagers.set(workspaceRootDir, detected);
    // A failed detection is not cached, so that the next call tries again
    detected.catch(() => {
      detectedPackageManagers.delete(workspaceRootDir);
    });
  }

  return detected;
}

/**
 * Clears the cache of detected package managers. Only intended for tests.
 *
 * @internal
 */
export function resetDetectedPackageManagers(): void {
  detectedPackageManagers.clear();
}

async function detectPackageManagerInDir(
  workspaceRootDir: string,
): Promise<PackageManager> {
  const createYarn = () => Yarn.create({ workspaceRootDir });
  const createPnpm = () => Pnpm.create({ workspaceRootDir });

  const packageJson = await readPackageJson(workspaceRootDir);
  const declared = getDeclaredPackageManager(packageJson);
  const declaredName = declared?.name;

  const hasPnpmLockfile = await fileExists(
    resolvePath(workspaceRootDir, 'pnpm-lock.yaml'),
  );
  const hasYarnLockfile = await fileExists(
    resolvePath(workspaceRootDir, 'yarn.lock'),
  );
  if (hasPnpmLockfile && hasYarnLockfile) {
    console.warn(
      'Both pnpm-lock.yaml and yarn.lock exist in the workspace root. Remove the lockfile ' +
        'of the package manager that the project no longer uses.',
    );
  }

  // A project that names its package manager is taken at its word, so that a
  // lockfile that another package manager left behind does not decide it
  if (declaredName === 'yarn') {
    return createYarn();
  }
  if (declaredName === 'pnpm') {
    return createPnpm();
  }
  if (declaredName !== undefined) {
    console.warn(
      `Ignoring the ${declared?.field} field in the root package.json, since ${declaredName} is not supported.`,
    );
  }

  if (hasPnpmLockfile) {
    return createPnpm();
  }
  if (hasYarnLockfile) {
    return createYarn();
  }
  if (await fileExists(resolvePath(workspaceRootDir, 'pnpm-workspace.yaml'))) {
    return createPnpm();
  }
  if (packageJson?.workspaces) {
    // technically this could be NPM as well
    return createYarn();
  }

  if (declaredName !== undefined) {
    // Falling back to Yarn here would write a Yarn lockfile into a project
    // that picked another package manager
    throw new Error(
      `The ${declared?.field} field in the root package.json names ${declaredName}, which is not supported. ` +
        'Use yarn or pnpm, or remove the field so that the package manager is detected from the project files.',
    );
  }

  console.warn(
    'Could not detect the package manager from the project files, using Yarn.',
  );
  return createYarn();
}

const SUPPORTED_PACKAGE_MANAGERS = ['yarn', 'pnpm'];

/**
 * Reads the package manager that the root package.json names, from the
 * packageManager field or else from devEngines.packageManager. When
 * devEngines lists several, the first supported one is used.
 */
function getDeclaredPackageManager(
  packageJson: Record<string, unknown> | undefined,
): { name: string; field: string } | undefined {
  const packageManager = packageJson?.packageManager;
  const fromPackageManager =
    typeof packageManager === 'string'
      ? packageManager.split('@')[0]
      : undefined;

  const devEngines = packageJson?.devEngines as
    | { packageManager?: unknown }
    | undefined;
  const devEngineNames = [devEngines?.packageManager].flat().flatMap(entry => {
    const name = (entry as { name?: unknown } | undefined)?.name;
    return typeof name === 'string' ? [name] : [];
  });
  const fromDevEngines =
    devEngineNames.find(name => SUPPORTED_PACKAGE_MANAGERS.includes(name)) ??
    devEngineNames[0];

  if (fromPackageManager !== undefined) {
    if (
      fromDevEngines !== undefined &&
      fromDevEngines !== fromPackageManager &&
      SUPPORTED_PACKAGE_MANAGERS.includes(fromDevEngines)
    ) {
      console.warn(
        `The packageManager field in the root package.json names ${fromPackageManager}, but devEngines.packageManager names ${fromDevEngines}. Using ${fromPackageManager}.`,
      );
    }
    return { name: fromPackageManager, field: 'packageManager' };
  }
  if (fromDevEngines !== undefined) {
    return { name: fromDevEngines, field: 'devEngines.packageManager' };
  }
  return undefined;
}

async function readPackageJson(
  workspaceRootDir: string,
): Promise<Record<string, unknown> | undefined> {
  try {
    return await fs.readJson(resolvePath(workspaceRootDir, 'package.json'));
  } catch (error) {
    console.warn(`Error during package manager detection: ${error}`);
    return undefined;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}
