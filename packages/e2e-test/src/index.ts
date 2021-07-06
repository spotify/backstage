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
import chalk from 'chalk';
import { registerCommands } from './commands';
import { version } from '../package.json';
import { exitWithError } from './lib/helpers';

async function main(argv: string[]) {
  program.name('e2e-test').version(version);

  registerCommands(program);

  program.on('command:*', () => {
    console.log();
    console.log(chalk.red(`Invalid command: ${program.args.join(' ')}`));
    console.log();
    program.outputHelp();
    process.exit(1);
  });

  program.parse(argv);
}

process.on('unhandledRejection', (rejection: unknown) => {
  // Try to avoid exiting if the unhandled error is coming from jsdom, i.e. zombie.
  // Those are typically errors on the page that should be benign, at least in the
  // context of this test. We have other ways of asserting that the page is being
  // rendered correctly.
  if (
    rejection instanceof Error &&
    rejection?.stack?.includes('node_modules/jsdom/lib')
  ) {
    console.log(`Ignored error inside jsdom, ${rejection?.stack ?? rejection}`);
  } else {
    if (rejection instanceof Error) {
      exitWithError(rejection);
    } else {
      exitWithError(new Error(`Unknown rejection: '${rejection}'`));
    }
  }
});

main(process.argv).catch(exitWithError);
