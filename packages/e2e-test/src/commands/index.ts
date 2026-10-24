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

import { Command, Option } from 'commander';
import { runCommand } from './runCommand';

export function registerCommands(program: Command) {
  program
    .command('run')
    .option('--keep', 'Do not remove the temporary dir after tests complete')
    .addOption(
      new Option(
        '--package-manager <name>',
        'Package manager to use for the created app',
      )
        .choices(['yarn', 'pnpm'])
        .default('yarn'),
    )
    .addOption(
      new Option(
        '--node-linker <name>',
        'Node linker to switch a pnpm app to, instead of the hoisted linker that the template uses',
      ).choices(['hoisted', 'isolated']),
    )
    .description('Run e2e tests')
    .action(runCommand);
}
