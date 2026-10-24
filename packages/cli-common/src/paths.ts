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

import fs from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';

/**
 * The name of the backstage's config file
 *
 * @public
 */
export const BACKSTAGE_JSON = 'backstage.json';

/**
 * A function that takes a set of path fragments and resolves them into a
 * single complete path, relative to some root.
 *
 * @public
 */
export type ResolveFunc = (...paths: string[]) => string;

/**
 * Resolved paths relative to the target project, based on `process.cwd()`.
 * Lazily initialized on first property access. Re-resolves automatically
 * when `process.cwd()` changes.
 *
 * @public
 */
export type TargetPaths = {
  /** The target package directory. */
  dir: string;

  /**
   * The target monorepo root directory. This is the same directory as
   * {@link TargetPaths.workspaceRootDir}.
   *
   * @deprecated Use {@link TargetPaths.workspaceRootDir} or
   * {@link TargetPaths.installationRootDir}, depending on which root is needed.
   */
  rootDir: string;

  /**
   * The root directory of the package manager workspace that contains the
   * target directory. This is the nearest directory with a
   * `pnpm-workspace.yaml` file, or with a `package.json` that has a
   * `workspaces` field. pnpm ignores the `workspaces` field, so within a pnpm
   * workspace it only starts a workspace of its own for a Yarn project, which
   * has a `yarn.lock` or `.yarnrc.yml` file. The lockfile and the package
   * manager configuration live here, and installs act on everything inside
   * it.
   *
   * Falls back to the target directory when it is not inside a workspace.
   */
  workspaceRootDir: string;

  /**
   * The root directory of the Backstage installation that contains the target
   * directory. This is the nearest directory with a `package.json` that has a
   * `workspaces` field, up to and including the workspace root. In a Yarn
   * workspace this is the workspace root. In a pnpm workspace, a `workspaces`
   * field marks a Backstage installation in a subdirectory of a larger
   * workspace.
   *
   * Falls back to the workspace root when there is no such `package.json`.
   */
  installationRootDir: string;

  /**
   * The `backstage.json` file of the Backstage installation. This is the
   * nearest `backstage.json` file from the installation root up to and
   * including the workspace root, so that several installations in a
   * workspace can share one.
   *
   * Points into the installation root when there is no such file.
   */
  backstageJsonPath: string;

  /** Resolve a path relative to the target package directory. */
  resolve: ResolveFunc;

  /**
   * Resolve a path relative to the target repo root.
   *
   * @deprecated Use {@link TargetPaths.resolveWorkspaceRoot} or
   * {@link TargetPaths.resolveInstallationRoot}, depending on which root is
   * needed.
   */
  resolveRoot: ResolveFunc;

  /** Resolve a path relative to the workspace root. */
  resolveWorkspaceRoot: ResolveFunc;

  /** Resolve a path relative to the Backstage installation root. */
  resolveInstallationRoot: ResolveFunc;
};

/**
 * Resolved paths relative to a specific package in the repository.
 *
 * @public
 */
export type OwnPaths = {
  /** The package root directory. */
  dir: string;

  /** The monorepo root directory containing the package. */
  rootDir: string;

  /** Resolve a path relative to the package root. */
  resolve: ResolveFunc;

  /** Resolve a path relative to the monorepo root containing the package. */
  resolveRoot: ResolveFunc;
};

/**
 * Common paths and resolve functions used by the cli.
 * Currently assumes it is being executed within a monorepo.
 *
 * @public
 * @deprecated Use {@link targetPaths} and {@link findOwnPaths} instead.
 */
export type Paths = {
  ownDir: string;
  ownRoot: string;
  targetDir: string;
  targetRoot: string;
  resolveOwn: ResolveFunc;
  resolveOwnRoot: ResolveFunc;
  resolveTarget: ResolveFunc;
  resolveTargetRoot: ResolveFunc;
};

// Looks for a package.json with a workspace config to identify the root of the monorepo
export function findRootPath(
  searchDir: string,
  filterFunc: (pkgJsonPath: string) => boolean,
): string | undefined {
  let path = searchDir;

  // Some confidence check to avoid infinite loop
  for (let i = 0; i < 1000; i++) {
    const packagePath = resolvePath(path, 'package.json');
    const exists = fs.existsSync(packagePath);
    if (exists && filterFunc(packagePath)) {
      return path;
    }

    const newPath = dirname(path);
    if (newPath === path) {
      return undefined;
    }
    path = newPath;
  }

  throw new Error(
    `Iteration limit reached when searching for root package.json at ${searchDir}`,
  );
}

// Finds the root of the monorepo that the package exists in.
export function findOwnRootDir(ownDir: string) {
  const isLocal = fs.existsSync(resolvePath(ownDir, 'src'));
  if (!isLocal) {
    throw new Error(
      'Tried to access monorepo package root dir outside of Backstage repository',
    );
  }

  const rootDir = findRootPath(ownDir, pkgJsonPath => {
    try {
      const content = fs.readFileSync(pkgJsonPath, 'utf8');
      const data = JSON.parse(content);
      return Boolean(data.workspaces);
    } catch (error) {
      throw new Error(
        `Failed to read package.json at '${pkgJsonPath}', ${error}`,
      );
    }
  });

  if (!rootDir) {
    throw new Error(`No monorepo root found when searching from '${ownDir}'`);
  }

  return rootDir;
}

// Hierarchical directory cache shared across all OwnPathsImpl instances.
// When we resolve a searchDir to its package root, we also cache every
// intermediate directory, so sibling directories share work.
const dirCache = new Map<string, string>();

class OwnPathsImpl implements OwnPaths {
  static #instanceCache = new Map<string, OwnPathsImpl>();

  static find(searchDir: string): OwnPathsImpl {
    const dir = OwnPathsImpl.findDir(searchDir);
    let instance = OwnPathsImpl.#instanceCache.get(dir);
    if (!instance) {
      instance = new OwnPathsImpl(dir);
      OwnPathsImpl.#instanceCache.set(dir, instance);
    }
    return instance;
  }

  static findDir(searchDir: string): string {
    const visited: string[] = [];
    let dir = searchDir;

    for (let i = 0; i < 1000; i++) {
      const cached = dirCache.get(dir);
      if (cached !== undefined) {
        for (const d of visited) {
          dirCache.set(d, cached);
        }
        return cached;
      }

      visited.push(dir);

      if (fs.existsSync(resolvePath(dir, 'package.json'))) {
        for (const d of visited) {
          dirCache.set(d, dir);
        }
        return dir;
      }

      const newDir = dirname(dir);
      if (newDir === dir) {
        break;
      }
      dir = newDir;
    }

    throw new Error(
      `No package.json found while searching for package root of ${searchDir}`,
    );
  }

  #dir: string;
  #rootDir: string | undefined;

  private constructor(dir: string) {
    this.#dir = dir;
  }

  get dir(): string {
    return this.#dir;
  }

  get rootDir(): string {
    this.#rootDir ??= findOwnRootDir(this.#dir);
    return this.#rootDir;
  }

  resolve = (...paths: string[]): string => {
    return resolvePath(this.#dir, ...paths);
  };

  resolveRoot = (...paths: string[]): string => {
    return resolvePath(this.rootDir, ...paths);
  };
}

// Used by the test utility in testUtils.ts to override targetPaths
export let targetPathsOverride: TargetPaths | undefined;

/** @internal */
export function setTargetPathsOverride(override: TargetPaths | undefined) {
  targetPathsOverride = override;
}

function hasWorkspacesField(dir: string): boolean {
  const pkgJsonPath = resolvePath(dir, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    return false;
  }
  try {
    const content = fs.readFileSync(pkgJsonPath, 'utf8');
    const data = JSON.parse(content);
    return Boolean(data.workspaces);
  } catch (error) {
    throw new Error(
      `Failed to parse package.json file while searching for root, ${error}`,
    );
  }
}

function hasPnpmWorkspaceFile(dir: string): boolean {
  return fs.existsSync(resolvePath(dir, 'pnpm-workspace.yaml'));
}

function isYarnProject(dir: string): boolean {
  return (
    fs.existsSync(resolvePath(dir, 'yarn.lock')) ||
    fs.existsSync(resolvePath(dir, '.yarnrc.yml'))
  );
}

/**
 * Returns the nearest directory from `dir` up to and including `stopDir`, or
 * up to the file system root, that matches the predicate.
 */
function findAncestorDir(
  dir: string,
  predicate: (path: string) => boolean,
  stopDir?: string,
): string | undefined {
  let path = dir;
  for (let i = 0; i < 1000; i++) {
    if (predicate(path)) {
      return path;
    }
    const newPath = dirname(path);
    if (path === stopDir || newPath === path) {
      return undefined;
    }
    path = newPath;
  }
  throw new Error(`Iteration limit reached when searching from ${dir}`);
}

/**
 * Finds the root of the Yarn, npm, or pnpm workspace that contains `dir`.
 * pnpm reads its workspace packages from `pnpm-workspace.yaml` and ignores
 * the `workspaces` field, so within a pnpm workspace that field only counts
 * for a Yarn project of its own.
 */
function findWorkspaceRootDir(dir: string): string | undefined {
  const inPnpmWorkspace =
    findAncestorDir(dir, hasPnpmWorkspaceFile) !== undefined;
  return findAncestorDir(
    dir,
    path =>
      hasPnpmWorkspaceFile(path) ||
      (hasWorkspacesField(path) && (!inPnpmWorkspace || isYarnProject(path))),
  );
}

class TargetPathsImpl implements TargetPaths {
  #cwd: string | undefined;
  #dir: string | undefined;
  #workspaceRootDir: string | undefined;
  #installationRootDir: string | undefined;
  #backstageJsonPath: string | undefined;

  get dir(): string {
    if (targetPathsOverride) {
      return targetPathsOverride.dir;
    }
    const cwd = process.cwd();
    if (this.#dir !== undefined && this.#cwd === cwd) {
      return this.#dir;
    }
    this.#cwd = cwd;
    this.#workspaceRootDir = undefined;
    this.#installationRootDir = undefined;
    this.#backstageJsonPath = undefined;
    // Drive letter can end up being lowercased here on Windows, bring back to uppercase for consistency
    this.#dir = fs
      .realpathSync(cwd)
      .replace(/^[a-z]:/, str => str.toUpperCase());
    return this.#dir;
  }

  get rootDir(): string {
    return this.workspaceRootDir;
  }

  get workspaceRootDir(): string {
    if (targetPathsOverride) {
      return targetPathsOverride.workspaceRootDir;
    }
    // Access dir first to ensure cwd is fresh, which also invalidates the roots on cwd change
    const dir = this.dir;
    if (this.#workspaceRootDir !== undefined) {
      return this.#workspaceRootDir;
    }
    // Lazy init to only crash commands that require a monorepo when we're not in one
    this.#workspaceRootDir = findWorkspaceRootDir(dir) ?? dir;
    return this.#workspaceRootDir;
  }

  get installationRootDir(): string {
    if (targetPathsOverride) {
      return targetPathsOverride.installationRootDir;
    }
    const dir = this.dir;
    if (this.#installationRootDir !== undefined) {
      return this.#installationRootDir;
    }
    const workspaceRootDir = this.workspaceRootDir;
    this.#installationRootDir =
      findAncestorDir(dir, hasWorkspacesField, workspaceRootDir) ??
      workspaceRootDir;
    return this.#installationRootDir;
  }

  get backstageJsonPath(): string {
    if (targetPathsOverride) {
      return targetPathsOverride.backstageJsonPath;
    }
    // Resolving the installation root first also makes sure that the working
    // directory is fresh, which invalidates this path on change
    const installationRootDir = this.installationRootDir;
    if (this.#backstageJsonPath !== undefined) {
      return this.#backstageJsonPath;
    }
    const backstageJsonDir =
      findAncestorDir(
        installationRootDir,
        path => fs.existsSync(resolvePath(path, BACKSTAGE_JSON)),
        this.workspaceRootDir,
      ) ?? installationRootDir;
    this.#backstageJsonPath = resolvePath(backstageJsonDir, BACKSTAGE_JSON);
    return this.#backstageJsonPath;
  }

  resolve = (...paths: string[]): string => {
    if (targetPathsOverride) {
      return targetPathsOverride.resolve(...paths);
    }
    return resolvePath(this.dir, ...paths);
  };

  resolveRoot = (...paths: string[]): string => {
    return this.resolveWorkspaceRoot(...paths);
  };

  resolveWorkspaceRoot = (...paths: string[]): string => {
    if (targetPathsOverride) {
      return targetPathsOverride.resolveWorkspaceRoot(...paths);
    }
    return resolvePath(this.workspaceRootDir, ...paths);
  };

  resolveInstallationRoot = (...paths: string[]): string => {
    if (targetPathsOverride) {
      return targetPathsOverride.resolveInstallationRoot(...paths);
    }
    return resolvePath(this.installationRootDir, ...paths);
  };
}

/**
 * Lazily resolved paths relative to the target project. Import this directly
 * for cwd-based path resolution without needing `__dirname`.
 *
 * @public
 */
export const targetPaths: TargetPaths = new TargetPathsImpl();

/**
 * Find paths relative to the package that the calling code lives in.
 *
 * Results are cached per package root, and the package root lookup uses a
 * hierarchical directory cache so that multiple calls from different
 * subdirectories within the same package share work.
 *
 * @public
 */
export function findOwnPaths(searchDir: string): OwnPaths {
  return OwnPathsImpl.find(searchDir);
}

/**
 * Find paths related to a package and its execution context.
 *
 * @public
 * @deprecated Use {@link targetPaths} for cwd-based paths and
 * {@link findOwnPaths} for package-relative paths instead.
 *
 * @example
 *
 * const paths = findPaths(__dirname)
 */
export function findPaths(searchDir: string): Paths {
  const own = findOwnPaths(searchDir);
  return {
    get ownDir() {
      return own.dir;
    },
    get ownRoot() {
      return own.rootDir;
    },
    get targetDir() {
      return targetPaths.dir;
    },
    get targetRoot() {
      return targetPaths.workspaceRootDir;
    },
    resolveOwn: own.resolve,
    resolveOwnRoot: own.resolveRoot,
    resolveTarget: targetPaths.resolve,
    resolveTargetRoot: targetPaths.resolveWorkspaceRoot,
  };
}
