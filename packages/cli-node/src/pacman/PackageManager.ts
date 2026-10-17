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
  parseLockfile(contents: string): Promise<Lockfile>;

  /**
   * Whether the package manager supports the 'backstage:^' version protocol.
   */
  supportsBackstageVersionProtocol(): Promise<boolean>;

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
 * Only the workspace root is read, never a directory above or below it.
 * Detection warnings are written to stderr. The result is cached per
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

  const hasYarnLockfile = await fileExists(
    resolvePath(workspaceRootDir, 'yarn.lock'),
  );
  if (hasYarnLockfile) {
    return await createYarn();
  }

  try {
    const packageJson = await fs.readJson(
      resolvePath(workspaceRootDir, 'package.json'),
    );
    if (packageJson.workspaces) {
      // technically this could be NPM as well
      return await createYarn();
    }

    const declaredPacman = packageJson.packageManager;
    if (declaredPacman) {
      const [name, _version] = declaredPacman.split('@');
      switch (name) {
        case 'yarn':
          return await createYarn();
        default:
          console.warn(`Detected unsupported package manager: ${name}.`);
          return await createYarn();
      }
    }
  } catch (error) {
    console.warn(`Error during package manager detection: ${error}`);
  }

  // currently yarn is the only package manager supported so just log an error and use it anyway
  console.warn(
    'Yarn was not detected, but is the only supported package manager.',
  );
  return await createYarn();
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}
