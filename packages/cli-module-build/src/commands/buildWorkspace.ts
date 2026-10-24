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
import { cli } from 'cleye';
import { createDistWorkspace } from '../lib/packager';
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  // Normalize legacy --alwaysYarnPack alias (a genuinely different name, not
  // just a casing variant — type-flag handles camelCase/kebab-case natively)
  const normalizedArgs = args.map(a => {
    if (a === '--alwaysYarnPack') {
      return '--always-pack';
    }
    if (a.startsWith('--alwaysYarnPack=')) {
      return `--always-pack${a.substring('--alwaysYarnPack'.length)}`;
    }
    return a;
  });

  const {
    flags: { alwaysPack },
    _: positionals,
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      parameters: ['<workspace-dir>', '[packages...]'],
      flags: {
        alwaysPack: {
          type: Boolean,
          description:
            'Force workspace output to be a result of running the pack command of the package manager on each package (warning: very slow)',
        },
      },
    },
    undefined,
    normalizedArgs,
  );

  const [dir, ...packages] = positionals;

  if (!(await fs.pathExists(dir))) {
    throw new Error(`Target workspace directory doesn't exist, '${dir}'`);
  }

  await createDistWorkspace(packages, {
    targetDir: dir,
    alwaysPack,
    enableFeatureDetection: true,
  });
};
