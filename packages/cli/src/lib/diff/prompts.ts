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
import inquirer from 'inquirer';
import { PromptFunc } from './types';

export const inquirerPromptFunc: PromptFunc = async msg => {
  const { result } = await inquirer.prompt({
    type: 'confirm',
    name: 'result',
    message: chalk.blue(msg),
  });
  return result;
};

export const makeCheckPromptFunc = () => {
  let failed = false;

  const promptFunc: PromptFunc = async msg => {
    failed = true;
    console.log(chalk.red(`[Check Failed] ${msg}`));
    return false;
  };

  const finalize = () => {
    if (failed) {
      throw new Error(
        'Check failed, the plugin is not in sync with the latest template',
      );
    }
  };

  return [promptFunc, finalize] as const;
};

export const yesPromptFunc: PromptFunc = async msg => {
  console.log(`Accepting: "${msg}"`);
  return true;
};
