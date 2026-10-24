/*
 * Copyright 2022 The Backstage Authors
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
import fs from 'fs-extra';

/**
 * Returns true if the current project is a monorepo.
 *
 * Uses a simple presence check on a `pnpm-workspace.yaml` file or the
 * `workspaces` field in the root `package.json`. Empty or invalid workspace
 * config is treated as a monorepo; we do not validate patterns.
 *
 * @public
 */
export async function isMonoRepo(): Promise<boolean> {
  // pnpm declares workspace packages in pnpm-workspace.yaml rather than package.json
  if (
    await fs.pathExists(targetPaths.resolveWorkspaceRoot('pnpm-workspace.yaml'))
  ) {
    return true;
  }
  const rootPackageJsonPath = targetPaths.resolveWorkspaceRoot('package.json');
  try {
    const pkg = await fs.readJson(rootPackageJsonPath);
    return Boolean(pkg?.workspaces);
  } catch (error) {
    return false;
  }
}
