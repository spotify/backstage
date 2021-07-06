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
import { Command } from 'commander';
import { createDistWorkspace } from '../lib/packager';

export default async (dir: string, _cmd: Command, packages: string[]) => {
  if (!(await fs.pathExists(dir))) {
    throw new Error(`Target workspace directory doesn't exist, '${dir}'`);
  }

  await createDistWorkspace(packages, {
    targetDir: dir,
  });
};
