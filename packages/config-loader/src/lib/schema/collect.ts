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

import fs from 'fs-extra';
import {
  resolve as resolvePath,
  relative as relativePath,
  dirname,
  sep,
} from 'path';
import { ConfigSchemaPackageEntry } from './types';
import { getProgramFromFiles, generateSchema } from 'typescript-json-schema';
import { JsonObject } from '@backstage/config';

type Item = {
  name: string;
  parentPath?: string;
};

const req =
  typeof __non_webpack_require__ === 'undefined'
    ? require
    : __non_webpack_require__;

/**
 * This collects all known config schemas across all dependencies of the app.
 */
export async function collectConfigSchemas(
  packageNames: string[],
): Promise<ConfigSchemaPackageEntry[]> {
  const visitedPackages = new Set<string>();
  const schemas = Array<ConfigSchemaPackageEntry>();
  const tsSchemaPaths = Array<string>();
  const currentDir = await fs.realpath(process.cwd());

  async function processItem({ name, parentPath }: Item) {
    // Ensures that we only process each package once. We don't bother with
    // loading in schemas from duplicates of different versions, as that's not
    // supported by Backstage right now anyway. We may want to change that in
    // the future though, if it for example becomes possible to load in two
    // different versions of e.g. @backstage/core at once.
    if (visitedPackages.has(name)) {
      return;
    }
    visitedPackages.add(name);

    let pkgPath: string;
    try {
      pkgPath = req.resolve(
        `${name}/package.json`,
        parentPath && {
          paths: [parentPath],
        },
      );
    } catch {
      // We can somewhat safely ignore packages that don't export package.json,
      // as they are likely not part of the Backstage ecosystem anyway.
      return;
    }

    const pkg = await fs.readJson(pkgPath);
    const depNames = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ];

    // TODO(Rugvip): Trying this out to avoid having to traverse the full dependency graph,
    //               since that's pretty slow. We probably need a better way to determine when
    //               we've left the Backstage ecosystem, but this will do for now.
    const hasSchema = 'configSchema' in pkg;
    const hasBackstageDep = depNames.some(_ => _.startsWith('@backstage/'));
    if (!hasSchema && !hasBackstageDep) {
      return;
    }
    if (hasSchema) {
      if (typeof pkg.configSchema === 'string') {
        const isJson = pkg.configSchema.endsWith('.json');
        const isDts = pkg.configSchema.endsWith('.d.ts');
        if (!isJson && !isDts) {
          throw new Error(
            `Config schema files must be .json or .d.ts, got ${pkg.configSchema}`,
          );
        }
        if (isDts) {
          tsSchemaPaths.push(
            relativePath(
              currentDir,
              resolvePath(dirname(pkgPath), pkg.configSchema),
            ),
          );
        } else {
          const path = resolvePath(dirname(pkgPath), pkg.configSchema);
          const value = await fs.readJson(path);
          schemas.push({
            value,
            path: relativePath(currentDir, path),
          });
        }
      } else {
        schemas.push({
          value: pkg.configSchema,
          path: relativePath(currentDir, pkgPath),
        });
      }
    }

    await Promise.all(
      depNames.map(depName =>
        processItem({ name: depName, parentPath: pkgPath }),
      ),
    );
  }

  await Promise.all(
    packageNames.map(name => processItem({ name, parentPath: currentDir })),
  );

  const tsSchemas = compileTsSchemas(tsSchemaPaths);

  return schemas.concat(tsSchemas);
}

// This handles the support of TypeScript .d.ts config schema declarations.
// We collect all typescript schema definition and compile them all in one go.
// This is much faster than compiling them separately.
function compileTsSchemas(paths: string[]) {
  if (paths.length === 0) {
    return [];
  }

  const program = getProgramFromFiles(paths, {
    incremental: false,
    isolatedModules: true,
    lib: ['ES5'], // Skipping most libs speeds processing up a lot, we just need the primitive types anyway
    noEmit: true,
    noResolve: true,
    skipLibCheck: true, // Skipping lib checks speeds things up
    skipDefaultLibCheck: true,
    strict: true,
    typeRoots: [], // Do not include any additional types
    types: [],
  });

  const tsSchemas = paths.map(path => {
    let value;
    try {
      value = generateSchema(
        program,
        // All schemas should export a `Config` symbol
        'Config',
        // This enables usage of @visibility is doc comments
        {
          required: true,
          validationKeywords: ['visibility'],
        },
        [path.split(sep).join('/')], // Unix paths are expected for all OSes here
      ) as JsonObject | null;
    } catch (error) {
      if (error.message !== 'type Config not found') {
        throw error;
      }
    }

    if (!value) {
      throw new Error(`Invalid schema in ${path}, missing Config export`);
    }
    return { path, value };
  });

  return tsSchemas;
}
