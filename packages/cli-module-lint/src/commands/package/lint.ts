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
import { targetPaths } from '@backstage/cli-common';
import { ESLint } from 'eslint';
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { fix, format, outputFile, maxWarnings },
    _: directories,
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      parameters: ['[directories...]'],
      flags: {
        fix: {
          type: Boolean,
          description: 'Attempt to automatically fix violations',
        },
        format: {
          type: String,
          description: 'Lint report output format',
          default: 'eslint-formatter-friendly',
        },
        outputFile: {
          type: String,
          description: 'Write the lint report to a file instead of stdout',
        },
        maxWarnings: {
          type: String,
          description:
            'Fail if more than this number of warnings. -1 allows warnings. (default: -1)',
        },
      },
    },
    undefined,
    args,
  );

  const eslint = new ESLint({
    cwd: targetPaths.dir,
    fix,
    extensions: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'],
  });

  const results = await eslint.lintFiles(
    directories.length ? directories : ['.'],
  );

  const maxWarningsNum = maxWarnings ? +maxWarnings : -1;
  const ignoreWarnings = maxWarningsNum === -1;

  const failed =
    results.some(r => r.errorCount > 0) ||
    (!ignoreWarnings &&
      results.reduce((current, next) => current + next.warningCount, 0) >
        maxWarningsNum);

  if (fix) {
    await ESLint.outputFixes(results);
  }

  const formatter = await eslint.loadFormatter(format);

  // This formatter uses the cwd to format file paths, so let's have that happen from the root instead
  if (format === 'eslint-formatter-friendly') {
    process.chdir(targetPaths.installationRootDir);
  }

  const resultText = await formatter.format(results);

  if (resultText) {
    if (outputFile) {
      await fs.writeFile(targetPaths.resolve(outputFile), resultText);
    } else {
      console.log(resultText);
    }
  }

  if (failed) {
    process.exit(1);
  }
};
