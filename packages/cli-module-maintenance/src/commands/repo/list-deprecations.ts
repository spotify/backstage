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

import chalk from 'chalk';
import { ESLint } from 'eslint';
import { cli } from 'cleye';
import { relative as relativePath } from 'node:path';
import { PackageGraph } from '@backstage/cli-node';
import { targetPaths } from '@backstage/cli-common';
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { json },
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      flags: {
        json: { type: Boolean, description: 'Output as JSON' },
      },
    },
    undefined,
    args,
  );

  const packages = await PackageGraph.listTargetPackages();

  const eslint = new ESLint({
    cwd: targetPaths.dir,
    overrideConfig: {
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-deprecated': 'error',
      },
      parserOptions: {
        project: [targetPaths.resolveInstallationRoot('tsconfig.json')],
      },
    },
    extensions: ['jsx', 'ts', 'tsx', 'mjs', 'cjs'],
  });

  const { stderr } = process;
  if (stderr.isTTY) {
    stderr.write('Initializing TypeScript...');
  }

  const deprecations = [];
  for (const [index, pkg] of packages.entries()) {
    const results = await eslint.lintFiles(pkg.dir);
    for (const result of results) {
      for (const message of result.messages) {
        if (message.ruleId !== '@typescript-eslint/no-deprecated') {
          continue;
        }

        const path = relativePath(
          targetPaths.installationRootDir,
          result.filePath,
        );
        deprecations.push({
          path,
          message: message.message,
          line: message.line,
          column: message.column,
        });
      }
    }

    if (stderr.isTTY) {
      stderr.clearLine(0);
      stderr.cursorTo(0);
      stderr.write(`Scanning packages ${index + 1}/${packages.length}`);
    }
  }

  if (stderr.isTTY) {
    stderr.clearLine(0);
    stderr.cursorTo(0);
  }

  if (json) {
    console.log(JSON.stringify(deprecations, null, 2));
  } else {
    for (const d of deprecations) {
      const location = `${d.path}:${d.line}:${d.column}`;
      const wrappedMessage = d.message.replace(/\r?\n\s*/g, ' ');
      console.log(`${location} - ${chalk.yellow(wrappedMessage)}`);
    }
  }

  if (deprecations.length > 0) {
    process.exit(1);
  }
};
