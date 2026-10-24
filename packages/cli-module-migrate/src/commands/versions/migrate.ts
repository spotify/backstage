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
import { BackstagePackageJson, PackageGraph } from '@backstage/cli-node';
import chalk from 'chalk';
import { resolve as resolvePath, join as joinPath } from 'node:path';
import { cli } from 'cleye';
import { readJson, writeJson } from 'fs-extra';
import { minimatch } from 'minimatch';
import { runInstall } from '../../lib/utils';
import replace from 'replace-in-file';
import { detectPackageManager } from '@backstage/cli-node/alpha';
import type { CliCommandContext } from '@backstage/cli-node';

declare module 'replace-in-file' {
  export default function (config: {
    files: string | string[];
    processor: (content: string, file: string) => string;
    ignore?: string | string[];
    allowEmptyPaths?: boolean;
  }): Promise<
    {
      file: string;
      hasChanged: boolean;
      numMatches?: number;
      numReplacements?: number;
    }[]
  >;
}

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { pattern, skipCodeChanges },
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      flags: {
        pattern: {
          type: String,
          description: 'Override glob for matching packages to upgrade',
        },
        skipCodeChanges: {
          type: Boolean,
          description: 'Skip code changes and only update package.json files',
        },
      },
    },
    undefined,
    args,
  );

  const changed = await migrateMovedPackages({
    pattern,
    skipCodeChanges,
  });

  if (changed) {
    await runInstall(await detectPackageManager());
  }
};

export async function migrateMovedPackages(options?: {
  pattern?: string;
  skipCodeChanges?: boolean;
}) {
  console.log(
    'Checking for moved packages to the @backstage-community namespace...',
  );
  const packages = await PackageGraph.listTargetPackages();
  let didAnythingChange = false;

  for (const pkg of packages) {
    const pkgName = pkg.packageJson.name;
    let didPackageChange = false;
    const movedPackages = new Map<string, string>();

    for (const depType of [
      'dependencies',
      'devDependencies',
      'peerDependencies',
    ] as const) {
      const depsObj = pkg.packageJson[depType];
      if (!depsObj) {
        continue;
      }
      for (const [depName, depVersion] of Object.entries(depsObj)) {
        if (options?.pattern && !minimatch(depName, options.pattern)) {
          continue;
        }
        let packageInfo: BackstagePackageJson;
        try {
          packageInfo = await readJson(
            require.resolve(`${depName}/package.json`, {
              paths: [pkg.dir],
            }),
          );
        } catch (ex) {
          console.warn(
            chalk.yellow(
              `Could not find package.json for ${depName}@${depVersion} in ${pkgName} (${depType})`,
            ),
          );
          continue;
        }

        const movedPackageName = packageInfo.backstage?.moved;

        if (movedPackageName) {
          movedPackages.set(depName, movedPackageName);
          console.log(
            chalk.yellow(
              `Found a moved package ${depName}@${depVersion} -> ${movedPackageName} in ${pkgName} (${depType})`,
            ),
          );

          didPackageChange = true;
          didAnythingChange = true;

          depsObj[movedPackageName] = depsObj[depName];
          delete depsObj[depName];
        }
      }
    }

    if (didPackageChange) {
      await writeJson(resolvePath(pkg.dir, 'package.json'), pkg.packageJson, {
        spaces: 2,
      });

      if (!options?.skipCodeChanges) {
        // Replace all occurrences of the old package names in the code.
        const files = await replace({
          files: joinPath(pkg.dir, 'src', '**'),
          allowEmptyPaths: true,
          processor: content => {
            return Array.from(movedPackages.entries()).reduce(
              (newContent, [oldName, newName]) => {
                return newContent
                  .replace(new RegExp(`"${oldName}"`, 'g'), `"${newName}"`)
                  .replace(new RegExp(`'${oldName}'`, 'g'), `'${newName}'`)
                  .replace(new RegExp(`${oldName}/`, 'g'), `${newName}/`);
              },
              content,
            );
          },
        });

        if (files.length > 0) {
          console.log(
            chalk.green(
              `Updated ${files.length} files in ${pkgName} to use the new package names`,
            ),
          );
        }
      }
    }
  }

  return didAnythingChange;
}
