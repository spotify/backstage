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
import { RunOptions } from '@backstage/cli-common';
import fs from 'fs-extra';

/**
 * Package info retrieved from the package manager, usually from NPM.
 *
 * @public
 */
export type PackageInfo = {
  name: string;
  'dist-tags': Record<string, string>;
  versions: string[];
  time: { [version: string]: string };
};

/**
 * Represents the package manager in use by this instance of Backstage. This
 * interface allows Backstage adopters to change the package manager used by
 * their repo and still use the Backstage CLI, and it's helpful tooling.
 *
 * @public
 */
export interface PackageManager {
  /** The name of the package manager. */
  name(): string;

  /** The self-reported version of the package manager. */
  version(): string;

  /** The file name of the lockfile used by the package manager. */
  lockfileName(): string;

  /** Uses the package manager to run a command in the repo. */
  run(args: string[], options?: RunOptions): Promise<void>;

  /**
   * Executes the package manager's pack command to bundle the repo into an
   * archive.
   */
  pack(output: string, packageDir: string): Promise<void>;

  /** Fetches information about the given package, usually from NPM. */
  fetchPackageInfo(name: string): Promise<PackageInfo>;

  /** Reads the lockfile from the repo. See {@link Lockfile} */
  loadLockfile(): Promise<Lockfile>;

  /** Parses the given string as a {@link Lockfile}. */
  parseLockfile(contents: string): Promise<Lockfile>;

  /**
   * Whether the package manager supports the 'backstage:^' version protocol.
   */
  supportsBackstageVersionProtocol(): Promise<boolean>;

  /** A string representation of the package manager. */
  toString(): string;
}

/**
 * Uses several mechanisms to detect the currently used package manager. The
 * detection methods are intended to be ordered roughly from fastest to slowest
 * in order to make this method as fast as possible.
 *
 * @public
 */
export async function detectPackageManager(): Promise<PackageManager> {
  const hasYarnLockfile = await fileExists(
    targetPaths.resolveWorkspaceRoot('yarn.lock'),
  );
  if (hasYarnLockfile) {
    return await Yarn.create();
  }

  try {
    const packageJson = await fs.readJson(
      targetPaths.resolveWorkspaceRoot('package.json'),
    );
    if (packageJson.workspaces) {
      // technically this could be NPM as well
      return await Yarn.create();
    }

    const declaredPacman = packageJson.packageManager;
    if (declaredPacman) {
      const [name, _version] = declaredPacman.split('@');
      switch (name) {
        case 'yarn':
          return await Yarn.create();
        default:
          console.log(`Detected unsupported package manager: ${name}.`);
          return await Yarn.create();
      }
    }
  } catch (error) {
    console.log(`Error during package manager detection: ${error}`);
  }

  // currently yarn is the only package manager supported so just log an error and use it anyway
  console.log(
    'Yarn was not detected, but is the only supported package manager.',
  );
  return await Yarn.create();
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}
