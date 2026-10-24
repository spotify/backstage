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
import { resolve as resolvePath } from 'node:path';
import yaml from 'yaml';
import { z } from 'zod/v3';
import { targetPaths } from '@backstage/cli-common';

const yarnRcSchema = z.object({
  plugins: z
    .array(
      z.object({
        path: z.string(),
      }),
    )
    .optional(),
});

/**
 * Detects whether the Backstage Yarn plugin is installed in the given workspace directory.
 *
 * @param workspaceDir - The workspace root directory to check. Defaults to the target root.
 * @returns Promise resolving to true if the plugin is installed, false otherwise
 * @public
 */
export async function hasBackstageYarnPlugin(
  workspaceDir?: string,
): Promise<boolean> {
  const yarnRcPath = resolvePath(
    workspaceDir ?? targetPaths.workspaceRootDir,
    '.yarnrc.yml',
  );
  const yarnRcContent = await fs.readFile(yarnRcPath, 'utf-8').catch(e => {
    if (e.code === 'ENOENT') {
      return '';
    }
    throw e;
  });

  if (!yarnRcContent) {
    return false;
  }

  const parseResult = yarnRcSchema.safeParse(yaml.parse(yarnRcContent));

  if (!parseResult.success) {
    throw new Error(
      `Unexpected content in .yarnrc.yml: ${parseResult.error.toString()}`,
    );
  }

  const yarnRc = parseResult.data;

  const backstagePlugin = yarnRc.plugins?.some(
    plugin => plugin.path === '.yarn/plugins/@yarnpkg/plugin-backstage.cjs',
  );

  return Boolean(backstagePlugin);
}
