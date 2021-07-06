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
import { run } from '../lib/run';
import { paths } from '../lib/paths';

export default async (cmd: Command, cmdArgs: string[]) => {
  const args = [
    '--ext=js,jsx,ts,tsx',
    '--max-warnings=0',
    `--format=${cmd.format}`,
    ...(cmdArgs ?? [paths.targetDir]),
  ];
  if (cmd.fix) {
    args.push('--fix');
  }

  await run('eslint', args);
};
