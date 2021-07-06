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
import chalk from 'chalk';
import uniq from 'lodash/uniq';
import { Command } from 'commander';
import { serveBundle } from '../../lib/bundler';
import { loadCliConfig } from '../../lib/config';
import { paths } from '../../lib/paths';
import { Lockfile } from '../../lib/versioning';
import { includedFilter } from '../versions/lint';

export default async (cmd: Command) => {
  const lockfile = await Lockfile.load(paths.resolveTargetRoot('yarn.lock'));
  const result = lockfile.analyze({
    filter: includedFilter,
  });
  const problemPackages = [...result.newVersions, ...result.newRanges].map(
    ({ name }) => name,
  );

  if (problemPackages.length > 1) {
    console.log(
      chalk.yellow(
        `⚠️ Some of the following packages may be outdated or have duplicate installations:

          ${uniq(problemPackages).join(', ')}
        `,
      ),
    );
    console.log(
      chalk.yellow(
        `⚠️ This can be resolved using the following command:

          yarn backstage-cli versions:check --fix
      `,
      ),
    );
  }

  const { name } = await fs.readJson(paths.resolveTarget('package.json'));
  const waitForExit = await serveBundle({
    entry: 'src/index',
    checksEnabled: cmd.check,
    ...(await loadCliConfig({
      args: cmd.config,
      fromPackage: name,
    })),
  });

  await waitForExit();
};
