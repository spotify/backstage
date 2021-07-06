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

import fs from 'fs';
import { dirname, resolve as resolvePath } from 'path';

export type ResolveFunc = (...paths: string[]) => string;

// Common paths and resolve functions used by the cli.
// Currently assumes it is being executed within a monorepo.
export type Paths = {
  // Root dir of the cli itself, containing package.json
  ownDir: string;

  // Monorepo root dir of the cli itself. Only accessible when running inside Backstage repo.
  ownRoot: string;

  // The location of the app that the cli is being executed in
  targetDir: string;

  // The monorepo root package of the app that the cli is being executed in.
  targetRoot: string;

  // Resolve a path relative to own repo
  resolveOwn: ResolveFunc;

  // Resolve a path relative to own monorepo root. Only accessible when running inside Backstage repo.
  resolveOwnRoot: ResolveFunc;

  // Resolve a path relative to the app
  resolveTarget: ResolveFunc;

  // Resolve a path relative to the app repo root
  resolveTargetRoot: ResolveFunc;
};

// Looks for a package.json with a workspace config to identify the root of the monorepo
export function findRootPath(
  searchDir: string,
  filterFunc: (pkgJsonPath: string) => boolean,
): string | undefined {
  let path = searchDir;

  // Some sanity check to avoid infinite loop
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

// Finds the root of a given package
export function findOwnDir(searchDir: string) {
  const path = findRootPath(searchDir, () => true);
  if (!path) {
    throw new Error(
      `No package.json found while searching for package root of ${searchDir}`,
    );
  }
  return path;
}

// Finds the root of the monorepo that the package exists in. Only accessible when running inside Backstage repo.
export function findOwnRootDir(ownDir: string) {
  const isLocal = fs.existsSync(resolvePath(ownDir, 'src'));
  if (!isLocal) {
    throw new Error(
      'Tried to access monorepo package root dir outside of Backstage repository',
    );
  }

  return resolvePath(ownDir, '../..');
}

/**
 * Find paths related to a package and its execution context.
 *
 * @example
 *
 * const paths = findPaths(__dirname)
 */
export function findPaths(searchDir: string): Paths {
  const ownDir = findOwnDir(searchDir);
  // Drive letter can end up being lowercased here on Windows, bring back to uppercase for consistency
  const targetDir = fs
    .realpathSync(process.cwd())
    .replace(/^[a-z]:/, str => str.toUpperCase());

  // Lazy load this as it will throw an error if we're not inside the Backstage repo.
  let ownRoot = '';
  const getOwnRoot = () => {
    if (!ownRoot) {
      ownRoot = findOwnRootDir(ownDir);
    }
    return ownRoot;
  };

  // We're not always running in a monorepo, so we lazy init this to only crash commands
  // that require a monorepo when we're not in one.
  let targetRoot = '';
  const getTargetRoot = () => {
    if (!targetRoot) {
      targetRoot =
        findRootPath(targetDir, path => {
          try {
            const content = fs.readFileSync(path, 'utf8');
            const data = JSON.parse(content);
            return Boolean(data.workspaces?.packages);
          } catch (error) {
            throw new Error(
              `Failed to parse package.json file while searching for root, ${error}`,
            );
          }
        }) ?? targetDir; // We didn't find any root package.json, assume we're not in a monorepo
    }
    return targetRoot;
  };

  return {
    ownDir,
    get ownRoot() {
      return getOwnRoot();
    },
    targetDir,
    get targetRoot() {
      return getTargetRoot();
    },
    resolveOwn: (...paths) => resolvePath(ownDir, ...paths),
    resolveOwnRoot: (...paths) => resolvePath(getOwnRoot(), ...paths),
    resolveTarget: (...paths) => resolvePath(targetDir, ...paths),
    resolveTargetRoot: (...paths) => resolvePath(getTargetRoot(), ...paths),
  };
}
