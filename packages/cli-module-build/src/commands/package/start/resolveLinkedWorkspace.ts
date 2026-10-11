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

import { ForwardedError } from '@backstage/errors';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'node:path/posix';

export async function resolveLinkedWorkspace(
  linkPath: string | undefined,
): Promise<string | undefined> {
  if (!linkPath) {
    return undefined;
  }
  const dir = resolvePath(linkPath);
  if (!fs.pathExistsSync(dir)) {
    throw new Error(`Invalid workspace link, directory does not exist: ${dir}`);
  }
  const pkgJson = await fs
    .readJson(resolvePath(dir, 'package.json'))
    .catch(error => {
      throw new ForwardedError(
        'Failed to read package.json in linked workspace',
        error,
      );
    });

  // pnpm declares workspace packages in pnpm-workspace.yaml rather than package.json
  const isPnpmWorkspace = await fs.pathExists(
    resolvePath(dir, 'pnpm-workspace.yaml'),
  );
  if (!pkgJson.workspaces && !isPnpmWorkspace) {
    throw new Error(
      `Invalid workspace link, directory is not a workspace: ${dir}`,
    );
  }

  return dir;
}
