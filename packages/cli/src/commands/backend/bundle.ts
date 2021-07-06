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

import os from 'os';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import tar, { CreateOptions } from 'tar';
import { Command } from 'commander';
import { createDistWorkspace } from '../../lib/packager';
import { paths } from '../../lib/paths';
import { parseParallel, PARALLEL_ENV_VAR } from '../../lib/parallel';
import { buildPackage, Output } from '../../lib/builder';

const BUNDLE_FILE = 'bundle.tar.gz';
const SKELETON_FILE = 'skeleton.tar.gz';

export default async (cmd: Command) => {
  const targetDir = paths.resolveTarget('dist');
  const pkg = await fs.readJson(paths.resolveTarget('package.json'));

  // We build the target package without generating type declarations.
  await buildPackage({ outputs: new Set([Output.cjs]) });

  const tmpDir = await fs.mkdtemp(resolvePath(os.tmpdir(), 'backstage-bundle'));
  try {
    await createDistWorkspace([pkg.name], {
      targetDir: tmpDir,
      buildDependencies: Boolean(cmd.buildDependencies),
      buildExcludes: [pkg.name],
      parallel: parseParallel(process.env[PARALLEL_ENV_VAR]),
      skeleton: SKELETON_FILE,
    });

    // We built the target backend package using the regular build process, but the result of
    // that has now been packed into the dist workspace, so clean up the dist dir.
    await fs.remove(targetDir);
    await fs.mkdir(targetDir);

    // Move out skeleton.tar.gz before we create the main bundle, no point having that included up twice.
    await fs.move(
      resolvePath(tmpDir, SKELETON_FILE),
      resolvePath(targetDir, SKELETON_FILE),
    );

    // Create main bundle.tar.gz, with some tweaks to make it more likely hit Docker build cache.
    await tar.create(
      {
        file: resolvePath(targetDir, BUNDLE_FILE),
        cwd: tmpDir,
        portable: true,
        noMtime: true,
        gzip: true,
      } as CreateOptions & { noMtime: boolean },
      [''],
    );
  } finally {
    await fs.remove(tmpDir);
  }
};
