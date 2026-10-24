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

import fs from 'fs-extra';
import { join } from 'node:path';
import { targetPaths } from '@backstage/cli-common';

export async function createTemporaryTsConfig(includedPackageDirs: string[]) {
  const path = targetPaths.resolveWorkspaceRoot('tsconfig.tmp.json');

  process.once('exit', () => {
    fs.removeSync(path);
  });

  let assetTypeFile: string[] = [];

  try {
    assetTypeFile = [
      require.resolve('@backstage/cli/asset-types/asset-types.d.ts'),
    ];
  } catch {
    /** ignore */
  }

  await fs.writeJson(path, {
    extends: './tsconfig.json',
    include: [
      // These two contain global definitions that are needed for stable API report generation
      ...assetTypeFile,
      ...includedPackageDirs.map(dir => join(dir, 'src')),
    ],
    // we don't exclude node_modules so that we can use the asset-types.d.ts file
    exclude: [],
  });

  return path;
}
