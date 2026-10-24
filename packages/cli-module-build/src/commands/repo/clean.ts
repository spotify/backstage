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

import { cli } from 'cleye';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'node:path';
import { PackageGraph } from '@backstage/cli-node';
import { detectPackageManager } from '@backstage/cli-node/alpha';
import { targetPaths } from '@backstage/cli-common';
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  cli({ name: info.usage, booleanFlagNegation: true }, undefined, args);
  const packages = await PackageGraph.listTargetPackages();
  // Only detected when a package has a custom clean script
  let packageManager: ReturnType<typeof detectPackageManager> | undefined;

  await fs.remove(targetPaths.resolveInstallationRoot('dist'));
  await fs.remove(targetPaths.resolveInstallationRoot('dist-types'));
  await fs.remove(targetPaths.resolveInstallationRoot('coverage'));

  await Promise.all(
    Array.from(Array(10), async () => {
      while (packages.length > 0) {
        const pkg = packages.pop()!;
        const cleanScript = pkg.packageJson.scripts?.clean;

        if (
          cleanScript === 'backstage-cli clean' ||
          cleanScript === 'backstage-cli package clean'
        ) {
          await fs.remove(resolvePath(pkg.dir, 'dist'));
          await fs.remove(resolvePath(pkg.dir, 'dist-types'));
          await fs.remove(resolvePath(pkg.dir, 'coverage'));
        } else if (cleanScript) {
          packageManager ??= detectPackageManager();
          const pm = await packageManager;
          await pm.runScript('clean', [], { cwd: pkg.dir });
        }
      }
    }),
  );
};
