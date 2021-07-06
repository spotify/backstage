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
import { promisify } from 'util';
import chalk from 'chalk';
import { Command } from 'commander';
import inquirer, { Answers, Question } from 'inquirer';
import { exec as execCb } from 'child_process';
import { resolve as resolvePath } from 'path';
import { findPaths } from '@backstage/cli-common';
import os from 'os';
import { Task, templatingTask } from './lib/tasks';

const exec = promisify(execCb);

async function checkExists(rootDir: string, name: string) {
  await Task.forItem('checking', name, async () => {
    const destination = resolvePath(rootDir, name);

    if (await fs.pathExists(destination)) {
      const existing = chalk.cyan(destination.replace(`${rootDir}/`, ''));
      throw new Error(
        `A directory with the same name already exists: ${existing}\nPlease try again with a different app name`,
      );
    }
  });
}

async function createTemporaryAppFolder(tempDir: string) {
  await Task.forItem('creating', 'temporary directory', async () => {
    try {
      await fs.mkdir(tempDir);
    } catch (error) {
      throw new Error(
        `Failed to create temporary app directory: ${error.message}`,
      );
    }
  });
}

async function cleanUp(tempDir: string) {
  await Task.forItem('remove', 'temporary directory', async () => {
    await fs.remove(tempDir);
  });
}

async function buildApp(appDir: string) {
  const runCmd = async (cmd: string) => {
    await Task.forItem('executing', cmd, async () => {
      process.chdir(appDir);

      await exec(cmd).catch(error => {
        process.stdout.write(error.stderr);
        process.stdout.write(error.stdout);
        throw new Error(`Could not execute command ${chalk.cyan(cmd)}`);
      });
    });
  };

  await runCmd('yarn install');
  await runCmd('yarn tsc');
}

async function moveApp(tempDir: string, destination: string, id: string) {
  await Task.forItem('moving', id, async () => {
    await fs.move(tempDir, destination).catch(error => {
      throw new Error(
        `Failed to move app from ${tempDir} to ${destination}: ${error.message}`,
      );
    });
  });
}

export default async (cmd: Command): Promise<void> => {
  /* eslint-disable-next-line no-restricted-syntax */
  const paths = findPaths(__dirname);

  const questions: Question[] = [
    {
      type: 'input',
      name: 'name',
      message: chalk.blue('Enter a name for the app [required]'),
      validate: (value: any) => {
        if (!value) {
          return chalk.red('Please enter a name for the app');
        } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
          return chalk.red(
            'App name must be lowercase and contain only letters, digits, and dashes.',
          );
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'dbType',
      message: chalk.blue('Select database for the backend [required]'),
      // @ts-ignore
      choices: ['SQLite', 'PostgreSQL'],
    },
  ];
  const answers: Answers = await inquirer.prompt(questions);
  answers.dbTypePG = answers.dbType === 'PostgreSQL';
  answers.dbTypeSqlite = answers.dbType === 'SQLite';

  const templateDir = paths.resolveOwn('templates/default-app');
  const tempDir = resolvePath(os.tmpdir(), answers.name);
  const appDir = resolvePath(paths.targetDir, answers.name);

  Task.log();
  Task.log('Creating the app...');

  try {
    Task.section('Checking if the directory is available');
    await checkExists(paths.targetDir, answers.name);

    Task.section('Creating a temporary app directory');
    await createTemporaryAppFolder(tempDir);

    Task.section('Preparing files');
    await templatingTask(templateDir, tempDir, answers);

    Task.section('Moving to final location');
    await moveApp(tempDir, appDir, answers.name);

    if (!cmd.skipInstall) {
      Task.section('Building the app');
      await buildApp(appDir);
    }

    Task.log();
    Task.log(
      chalk.green(`🥇  Successfully created ${chalk.cyan(answers.name)}`),
    );
    Task.log();
    Task.section('All set! Now you might want to');
    Task.log(`  Run the app: ${chalk.cyan(`cd ${answers.name} && yarn dev`)}`);
    Task.log(
      '  Set up the software catalog: https://backstage.io/docs/features/software-catalog/configuration',
    );
    Task.log('  Add authentication: https://backstage.io/docs/auth/');
    Task.log();
    Task.exit();
  } catch (error) {
    Task.error(error.message);

    Task.log('It seems that something went wrong when creating the app 🤔');
    Task.log('We are going to clean up, and then you can try again.');

    Task.section('Cleanup');
    await cleanUp(tempDir);
    Task.error('🔥  Failed to create app!');
    Task.exit(1);
  }
};
