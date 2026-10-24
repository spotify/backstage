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
import { getPackages } from '@manypkg/get-packages';
import { PackageRoles } from '@backstage/cli-node';
import { targetPaths } from '@backstage/cli-common';
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  cli({ name: info.usage, booleanFlagNegation: true }, undefined, args);
  const { packages } = await getPackages(targetPaths.installationRootDir);

  await Promise.all(
    packages.map(async ({ dir, packageJson: pkg }) => {
      const { name } = pkg;
      const existingRole = PackageRoles.getRoleFromPackage(pkg);
      if (existingRole) {
        return;
      }

      const detectedRole = PackageRoles.detectRoleFromPackage(pkg);
      if (!detectedRole) {
        console.error(`No role detected for package ${name}`);
        return;
      }

      console.log(`Detected package role of ${name} as ${detectedRole}`);

      let newPkg = pkg as any;

      const pkgKeys = Object.keys(pkg);
      if (pkgKeys.includes('backstage')) {
        newPkg.backstage = {
          ...newPkg.backstage,
          role: detectedRole,
        };
      } else {
        // We insert the backstage field after one of these fields, otherwise at the end
        const index =
          Math.max(
            pkgKeys.indexOf('version'),
            pkgKeys.indexOf('private'),
            pkgKeys.indexOf('publishConfig'),
          ) + 1 || pkgKeys.length;

        const pkgEntries = Object.entries(pkg);
        pkgEntries.splice(index, 0, ['backstage', { role: detectedRole }]);
        newPkg = Object.fromEntries(pkgEntries);
      }

      await fs.writeJson(resolvePath(dir, 'package.json'), newPkg, {
        spaces: 2,
      });
    }),
  );
};
