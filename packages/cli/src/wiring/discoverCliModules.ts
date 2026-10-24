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

import { targetPaths } from '@backstage/cli-common';
import { PackageRoles } from '@backstage/cli-node';
import fs from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Scans the target project root's package.json for dependencies that are CLI
 * modules (packages with `backstage.role === 'cli-module'`).
 *
 * Returns the resolved entry point paths of discovered CLI module packages,
 * or an empty array if none are found or the project root cannot be read.
 * The paths are resolved relative to the project root to ensure they can be
 * imported regardless of where the CLI code itself is located.
 */
export function discoverCliModules(): string[] {
  const rootDir = targetPaths.installationRootDir;
  const pkgJsonPath = resolvePath(rootDir, 'package.json');

  let projectPkg: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  try {
    projectPkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  } catch {
    return [];
  }

  const allDeps = {
    ...projectPkg.dependencies,
    ...projectPkg.devDependencies,
  };

  const modules: string[] = [];

  for (const depName of Object.keys(allDeps)) {
    try {
      const depPkgPath = require.resolve(`${depName}/package.json`, {
        paths: [rootDir],
      });
      const depPkg = JSON.parse(fs.readFileSync(depPkgPath, 'utf8'));
      if (PackageRoles.getRoleFromPackage(depPkg) === 'cli-module') {
        const resolvedPath = require.resolve(depName, { paths: [rootDir] });
        modules.push(pathToFileURL(resolvedPath).href);
      }
    } catch {
      // Skip packages that can't be resolved or read
    }
  }

  return modules;
}
