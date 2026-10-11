/*
 * Copyright 2025 The Backstage Authors
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

import { resolve as resolvePath } from 'node:path';
import { BACKSTAGE_JSON, setTargetPathsOverride } from './paths';

/**
 * Options for {@link overrideTargetPaths}.
 *
 * @public
 */
export interface OverrideTargetPathsOptions {
  /** The target package directory. */
  dir: string;
  /**
   * The target monorepo root directory, used as the default for
   * `workspaceRootDir`. Defaults to `dir` if not provided.
   */
  rootDir?: string;
  /** The workspace root directory. Defaults to `rootDir`. */
  workspaceRootDir?: string;
  /**
   * The Backstage installation root directory. Defaults to
   * `workspaceRootDir`.
   */
  installationRootDir?: string;
  /**
   * The path of the `backstage.json` file. Defaults to `backstage.json` in
   * `installationRootDir`.
   */
  backstageJsonPath?: string;
}

/**
 * Return value of {@link overrideTargetPaths}.
 *
 * @public
 */
export interface TargetPathsOverride {
  /** Restores `targetPaths` to its normal behavior. */
  restore(): void;
}

/**
 * Overrides the `targetPaths` singleton to resolve from the given directory
 * instead of `process.cwd()`.
 *
 * When called with a string, that value is used as `dir` and as both roots.
 * Pass an options object to set them independently.
 *
 * Calling `restore()` on the return value reverts to normal behavior.
 * Restoration is only needed if you want to change the override within a
 * test file; each Jest worker starts with a clean module state.
 *
 * @public
 */
export function overrideTargetPaths(
  dirOrOptions: string | OverrideTargetPathsOptions,
): TargetPathsOverride {
  const options =
    typeof dirOrOptions === 'string' ? { dir: dirOrOptions } : dirOrOptions;
  const dir = options.dir;
  const workspaceRootDir = options.workspaceRootDir ?? options.rootDir ?? dir;
  const installationRootDir = options.installationRootDir ?? workspaceRootDir;
  const backstageJsonPath =
    options.backstageJsonPath ??
    resolvePath(installationRootDir, BACKSTAGE_JSON);

  setTargetPathsOverride({
    dir,
    rootDir: workspaceRootDir,
    workspaceRootDir,
    installationRootDir,
    backstageJsonPath,
    resolve: (...paths: string[]) => resolvePath(dir, ...paths),
    resolveRoot: (...paths: string[]) =>
      resolvePath(workspaceRootDir, ...paths),
    resolveWorkspaceRoot: (...paths: string[]) =>
      resolvePath(workspaceRootDir, ...paths),
    resolveInstallationRoot: (...paths: string[]) =>
      resolvePath(installationRootDir, ...paths),
  });

  return {
    restore() {
      setTargetPathsOverride(undefined);
    },
  };
}
