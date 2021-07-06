#!/usr/bin/env node
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

const path = require('path');
const childProcess = require('child_process');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Project } = require('@lerna/project');

// Prepare a release of the provided packages, e.g. @backstage/core
async function main(args) {
  if (args.includes('--help') || args.length === 0) {
    const arg0 = path.relative(process.cwd(), process.argv[1]);
    console.log(`Usage: ${process.argv0} ${arg0} ...<package>`);
    process.exit(1);
  }

  const project = new Project(__dirname);
  const packages = await project.getPackages();
  const ignoreArgs = packages
    .filter(p => !args.includes(p.name))
    .flatMap(p => ['--ignore', p.name]);

  const { status } = childProcess.spawnSync(
    'yarn',
    ['changeset', 'version', ...ignoreArgs],
    {
      stdio: 'inherit',
    },
  );
  if (status !== 0) {
    return;
  }

  childProcess.spawnSync(
    'yarn',
    ['prettier', '--write', '{packages,plugins}/*/{package.json,CHANGELOG.md}'],
    {
      stdio: 'inherit',
    },
  );
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack);
  process.exit(1);
});
