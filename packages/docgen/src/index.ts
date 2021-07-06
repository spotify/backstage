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

import program from 'commander';
import { resolve as resolvePath } from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import { generate } from './generate';

const main = (argv: string[]) => {
  /* eslint-disable-next-line no-restricted-syntax */
  const pkgJson = fs.readJsonSync(resolvePath(__dirname, '../package.json'));
  program.name('docgen').version(pkgJson.version);

  program
    .command('generate')
    .description(
      'Generate documentation for the declarations in the core-api package',
    )
    .option('--output <output>', 'Output directory [./dist]')
    .option(
      '--format <format>',
      'Output format, either techdocs or github [techdocs]',
    )
    .action(async cmd => {
      await generate(cmd.output ?? './dist', cmd.format ?? 'techdocs');
    });

  program.on('command:*', () => {
    console.log();
    console.log(
      chalk.red(`Invalid command: ${chalk.cyan(program.args.join(' '))}`),
    );
    console.log(chalk.red('See --help for a list of available commands.'));
    console.log();
    process.exit(1);
  });

  program.parse(argv);
};

process.on('unhandledRejection', rejection => {
  console.error(String(rejection));
  process.exit(1);
});

main(process.argv);
