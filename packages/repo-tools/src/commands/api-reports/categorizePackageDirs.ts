/*
 * Copyright 2021 The Backstage Authors
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
import { targetPaths } from '@backstage/cli-common';

export async function categorizePackageDirs(packageDirs: string[]) {
  const dirs = packageDirs.slice();
  const tsPackageDirs = new Array<string>();
  const cliPackageDirs = new Array<string>();
  const sqlPackageDirs = new Array<string>();

  await Promise.all(
    Array(10)
      .fill(0)
      .map(async () => {
        for (;;) {
          const dir = dirs.pop();
          if (!dir) {
            return;
          }

          const pkgJson = await fs
            .readJson(targetPaths.resolveWorkspaceRoot(dir, 'package.json'))
            .catch(error => {
              if (error.code === 'ENOENT') {
                return undefined;
              }
              throw error;
            });
          const role = pkgJson?.backstage?.role;
          if (!role) {
            return; // Ignore packages without roles
          }
          if (
            await fs.pathExists(
              targetPaths.resolveWorkspaceRoot(dir, 'migrations'),
            )
          ) {
            sqlPackageDirs.push(dir);
          }
          // TODO(Rugvip): Inlined packages are ignored because we can't handle @internal exports
          //               gracefully, and we don't want to have to mark all exports @public etc.
          //               It would be good if we could include these packages though.
          if (pkgJson?.backstage?.inline) {
            return;
          }
          if (role === 'cli' || role === 'cli-module') {
            cliPackageDirs.push(dir);
          }
          if (role !== 'cli' && role !== 'frontend' && role !== 'backend') {
            tsPackageDirs.push(dir);
          }
        }
      }),
  );

  return { tsPackageDirs, cliPackageDirs, sqlPackageDirs };
}
