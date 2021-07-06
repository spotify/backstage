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
import { paths } from '../lib/paths';
import { runCheck } from '../lib/run';

function includesAnyOf(hayStack: string[], ...needles: string[]) {
  for (const needle of needles) {
    if (hayStack.includes(needle)) {
      return true;
    }
  }
  return false;
}

export default async (cmd: Command) => {
  // all args are forwarded to jest
  const rawArgs = cmd.parent.rawArgs as string[];
  const args = rawArgs.slice(rawArgs.indexOf('test') + 1);

  // Only include our config if caller isn't passing their own config
  if (!includesAnyOf(args, '-c', '--config')) {
    args.push('--config', paths.resolveOwn('config/jest.js'));
  }

  // Run in watch mode unless in CI, coverage mode, or running all tests
  if (
    !process.env.CI &&
    !args.includes('--coverage') &&
    // explicitly no watching
    !includesAnyOf(args, '--no-watch', '--watch=false', '--watchAll=false') &&
    // already watching
    !includesAnyOf(args, '--watch', '--watchAll')
  ) {
    const isGitRepo = () =>
      runCheck('git', 'rev-parse', '--is-inside-work-tree');
    const isMercurialRepo = () => runCheck('hg', '--cwd', '.', 'root');

    if ((await isGitRepo()) || (await isMercurialRepo())) {
      args.push('--watch');
    } else {
      args.push('--watchAll');
    }
  }

  // This is the only thing that is not implemented by jest.run(), so we do it here instead
  // https://github.com/facebook/jest/blob/cd8828f7bbec6e55b4df5e41e853a5133c4a3ee1/packages/jest-cli/bin/jest.js#L12
  if (!process.env.NODE_ENV) {
    (process.env as any).NODE_ENV = 'test';
  }

  // eslint-disable-next-line jest/no-jest-import
  await require('jest').run(args);
};
