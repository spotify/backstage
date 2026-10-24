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

import ora from 'ora';
import chalk from 'chalk';
import type { PackageManager } from '@backstage/cli-node/alpha';

export async function runInstall(packageManager: PackageManager) {
  const spinner = ora({
    prefixText: `Running ${chalk.blue(
      packageManager.getCommandHint(['install']),
    )} to install new versions`,
    spinner: 'arc',
    color: 'green',
  }).start();

  const installOutput = new Array<Buffer>();
  try {
    await packageManager.install({
      env: { FORCE_COLOR: 'true' },
      onStdout: data => installOutput.push(data),
      onStderr: data => installOutput.push(data),
    });
    spinner.succeed();
  } catch (error) {
    spinner.fail();
    process.stdout.write(Buffer.concat(installOutput));
    throw error;
  }
}
