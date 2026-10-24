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

import fs from 'fs-extra';
import {
  basename,
  isAbsolute,
  join as joinPath,
  relative as relativePath,
  resolve as resolvePath,
  sep as pathSep,
} from 'node:path';
import { Document, parseAllDocuments, parseDocument } from 'yaml';

const LOCKFILE = 'pnpm-lock.yaml';
const WORKSPACE_FILE = 'pnpm-workspace.yaml';
const DEFAULT_PNPMFILES = ['.pnpmfile.cjs', '.pnpmfile.mjs'];
const DEPENDENCY_FIELDS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

// Keeps the formatting that pnpm writes as far as possible
const STRINGIFY_OPTIONS = { lineWidth: 0, flowCollectionPadding: false };

// require() and import() calls and import statements of relative paths
const LOCAL_IMPORT_PATTERN =
  /(?:\brequire(?:\.resolve)?\s*\(|\bimport\s*\(|\bfrom|\bimport)\s*(['"`])(\.\.?\/[^'"`]*)\1/g;

/**
 * Prepares a dist workspace that was created from a pnpm workspace, so that
 * `pnpm install --frozen-lockfile` works in it. The lockfile and
 * `pnpm-workspace.yaml` must already be copied into the dist workspace.
 *
 * - The lockfile entries of bundled packages are emptied, since their
 *   dependencies are removed from their `package.json` in the dist workspace.
 * - The patch files that `patchedDependencies` points at, and the pnpmfile,
 *   are copied. Patch files outside of the workspace root are copied into
 *   `patches`, and a pnpmfile outside of it into the root of the dist
 *   workspace, and the settings are changed to point at the copies. A
 *   pnpmfile that loads other local files fails, since those are not copied.
 *
 * Returns the files that were written, relative to the dist workspace.
 */
export async function preparePnpmDistWorkspace(options: {
  workspaceRootDir: string;
  targetDir: string;
  bundledPackageDirs: string[];
}): Promise<string[]> {
  const { workspaceRootDir, targetDir, bundledPackageDirs } = options;
  const files = new Array<string>();

  const lockfilePath = resolvePath(targetDir, LOCKFILE);
  if (await fs.pathExists(lockfilePath)) {
    await emptyLockfileImporters(lockfilePath, bundledPackageDirs);
    files.push(LOCKFILE);
  }

  const workspaceFilePath = resolvePath(targetDir, WORKSPACE_FILE);
  if (!(await fs.pathExists(workspaceFilePath))) {
    return files;
  }
  files.push(WORKSPACE_FILE);

  const doc = parseDocument(await fs.readFile(workspaceFilePath, 'utf8'));
  const settings = (doc.toJS() ?? {}) as {
    patchedDependencies?: Record<string, unknown>;
    pnpmfile?: unknown;
  };
  let changed = false;

  // A patch is applied through a file, so the files come along with the
  // setting that names them
  for (const [name, path] of Object.entries(
    settings.patchedDependencies ?? {},
  )) {
    if (typeof path !== 'string') {
      continue;
    }
    const copied = await copyFromWorkspace(
      workspaceRootDir,
      targetDir,
      path,
      'patches',
    );
    if (copied) {
      files.push(copied.path);
      if (copied.moved) {
        doc.setIn(['patchedDependencies', name], copied.path);
        changed = true;
      }
    }
  }

  // The checksum of the pnpmfile is part of the lockfile
  const pnpmfiles =
    typeof settings.pnpmfile === 'string'
      ? [settings.pnpmfile]
      : DEFAULT_PNPMFILES;
  for (const path of pnpmfiles) {
    const copied = await copyFromWorkspace(
      workspaceRootDir,
      targetDir,
      path,
      '.',
    );
    if (copied) {
      await checkPnpmfileImports(resolvePath(targetDir, copied.path), path);
      files.push(copied.path);
      if (copied.moved) {
        doc.set('pnpmfile', copied.path);
        changed = true;
      }
    }
  }

  if (changed) {
    await fs.writeFile(workspaceFilePath, doc.toString(STRINGIFY_OPTIONS));
  }
  return files;
}

/**
 * Puts back the dependency ranges from the source `package.json` that
 * `pnpm pack` replaced, such as `workspace:^` and `catalog:`. The dist
 * workspace is a pnpm workspace with the same catalogs, so the source ranges
 * resolve there and match the lockfile.
 */
export async function restorePnpmDependencyRanges(
  packageJsonPath: string,
  sourcePackageJson: object,
): Promise<void> {
  const packageJson = await fs.readJson(packageJsonPath);
  for (const field of DEPENDENCY_FIELDS) {
    const ranges = (sourcePackageJson as Record<string, unknown>)[field];
    if (ranges) {
      packageJson[field] = ranges;
    } else {
      delete packageJson[field];
    }
  }
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function emptyLockfileImporters(
  lockfilePath: string,
  packageDirs: string[],
): Promise<void> {
  if (packageDirs.length === 0) {
    return;
  }

  // A lockfile can have a separate document for the package manager itself
  const docs = parseAllDocuments(await fs.readFile(lockfilePath, 'utf8'));
  let changed = false;
  for (const doc of docs) {
    if (!(doc instanceof Document)) {
      continue;
    }
    for (const dir of packageDirs.map(toPosixPath)) {
      if (doc.hasIn(['importers', dir])) {
        doc.setIn(['importers', dir], doc.createNode({}));
        changed = true;
      }
    }
  }

  if (changed) {
    await fs.writeFile(
      lockfilePath,
      // pnpm separates the documents with an empty line
      docs.map(doc => doc.toString(STRINGIFY_OPTIONS)).join('\n'),
    );
  }
}

/**
 * Fails when a pnpmfile loads local files, since only the pnpmfile itself is
 * copied into the dist workspace and the install would not find them.
 */
async function checkPnpmfileImports(pnpmfilePath: string, name: string) {
  const source = (await fs.readFile(pnpmfilePath, 'utf8'))
    // Imports in comments don't count
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1');
  const imports = Array.from(
    source.matchAll(LOCAL_IMPORT_PATTERN),
    match => match[2],
  );
  if (imports.length > 0) {
    throw new Error(
      `The pnpmfile ${name} loads ${imports.join(
        ', ',
      )}, but only the pnpmfile itself is copied into the dist workspace. Move that code into the pnpmfile.`,
    );
  }
}

/**
 * Copies a file of the source workspace into the dist workspace. A file
 * inside the workspace keeps its relative path, while a file outside of it is
 * moved into the given directory of the dist workspace.
 */
async function copyFromWorkspace(
  workspaceRootDir: string,
  targetDir: string,
  path: string,
  outsideDir: string,
): Promise<{ path: string; moved: boolean } | undefined> {
  const sourcePath = resolvePath(workspaceRootDir, path);
  if (!(await fs.pathExists(sourcePath))) {
    return undefined;
  }
  const fromRoot = relativePath(workspaceRootDir, sourcePath);
  const moved = !fromRoot || fromRoot.startsWith('..') || isAbsolute(fromRoot);
  const targetPath = moved
    ? joinPath(outsideDir, basename(sourcePath))
    : fromRoot;
  await fs.copy(sourcePath, joinPath(targetDir, targetPath));
  return { path: toPosixPath(targetPath), moved };
}

function toPosixPath(path: string) {
  return path.split(pathSep).join('/');
}
