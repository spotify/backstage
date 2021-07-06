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

import { Command } from 'commander';
import { yellow } from 'chalk';
import fs from 'fs-extra';
import { join as joinPath, relative as relativePath } from 'path';
import { createDistWorkspace } from '../../lib/packager';
import { paths } from '../../lib/paths';
import { run } from '../../lib/run';
import { parseParallel, PARALLEL_ENV_VAR } from '../../lib/parallel';

const PKG_PATH = 'package.json';

export default async (cmd: Command) => {
  // Skip the preparation steps if we're being asked for help
  if (cmd.args.includes('--help')) {
    await run('docker', ['image', 'build', '--help']);
    return;
  }

  console.warn(
    yellow(`
The backend:build-image command is deprecated and will be removed in the future.
Please use the backend:bundle command instead along with your own Docker setup.

  https://backstage.io/docs/deployment/docker
`),
  );

  const pkgPath = paths.resolveTarget(PKG_PATH);
  const pkg = await fs.readJson(pkgPath);
  const appConfigs = await findAppConfigs();
  const npmrc = (await fs.pathExists(paths.resolveTargetRoot('.npmrc')))
    ? ['.npmrc']
    : [];
  const tempDistWorkspace = await createDistWorkspace([pkg.name], {
    buildDependencies: Boolean(cmd.build),
    files: [
      'package.json',
      'yarn.lock',
      ...npmrc,
      ...appConfigs,
      { src: paths.resolveTarget('Dockerfile'), dest: 'Dockerfile' },
    ],
    parallel: parseParallel(process.env[PARALLEL_ENV_VAR]),
    skeleton: 'skeleton.tar',
  });
  console.log(`Dist workspace ready at ${tempDistWorkspace}`);

  // all args are forwarded to docker build
  await run('docker', ['image', 'build', '.', ...cmd.args], {
    cwd: tempDistWorkspace,
  });

  await fs.remove(tempDistWorkspace);
};

/**
 * Find all config files to copy into the image
 */
async function findAppConfigs(): Promise<string[]> {
  const files = [];

  for (const name of await fs.readdir(paths.targetRoot)) {
    if (name.startsWith('app-config.') && name.endsWith('.yaml')) {
      files.push(name);
    }
  }

  if (paths.targetRoot !== paths.targetDir) {
    const dirPath = relativePath(paths.targetRoot, paths.targetDir);

    for (const name of await fs.readdir(paths.targetDir)) {
      if (name.startsWith('app-config.') && name.endsWith('.yaml')) {
        files.push(joinPath(dirPath, name));
      }
    }
  }

  return files;
}
