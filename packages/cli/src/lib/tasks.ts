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
import fs from 'fs-extra';
import handlebars from 'handlebars';
import ora from 'ora';
import { basename, dirname } from 'path';
import recursive from 'recursive-readdir';
import { paths } from './paths';

const TASK_NAME_MAX_LENGTH = 14;

export class Task {
  static log(name: string = '') {
    process.stdout.write(`${chalk.green(name)}\n`);
  }

  static error(message: string = '') {
    process.stdout.write(`\n${chalk.red(message)}\n\n`);
  }

  static section(name: string) {
    const title = chalk.green(`${name}:`);
    process.stdout.write(`\n ${title}\n`);
  }

  static exit(code: number = 0) {
    process.exit(code);
  }

  static async forItem(
    task: string,
    item: string,
    taskFunc: () => Promise<void>,
  ): Promise<void> {
    const paddedTask = chalk.green(task.padEnd(TASK_NAME_MAX_LENGTH));

    const spinner = ora({
      prefixText: chalk.green(`  ${paddedTask}${chalk.cyan(item)}`),
      spinner: 'arc',
      color: 'green',
    }).start();

    try {
      await taskFunc();
      spinner.succeed();
    } catch (error) {
      spinner.fail();
      throw error;
    }
  }
}

export async function templatingTask(
  templateDir: string,
  destinationDir: string,
  context: any,
  versions: { [name: string]: string },
) {
  const files = await recursive(templateDir).catch(error => {
    throw new Error(`Failed to read template directory: ${error.message}`);
  });
  const isMonoRepo = await fs.pathExists(paths.resolveTargetRoot('lerna.json'));

  for (const file of files) {
    const destinationFile = file.replace(templateDir, destinationDir);
    await fs.ensureDir(dirname(destinationFile));

    if (file.endsWith('.hbs')) {
      await Task.forItem('templating', basename(file), async () => {
        const destination = destinationFile.replace(/\.hbs$/, '');

        const template = await fs.readFile(file);
        const compiled = handlebars.compile(template.toString());
        const contents = compiled(
          { name: basename(destination), ...context },
          {
            helpers: {
              version(name: string) {
                if (versions[name]) {
                  return versions[name];
                }
                throw new Error(`No version available for package ${name}`);
              },
            },
          },
        );

        await fs.writeFile(destination, contents).catch(error => {
          throw new Error(
            `Failed to create file: ${destination}: ${error.message}`,
          );
        });
      });
    } else {
      if (isMonoRepo && file.match('tsconfig.json')) {
        continue;
      }

      await Task.forItem('copying', basename(file), async () => {
        await fs.copyFile(file, destinationFile).catch(error => {
          const destination = destinationFile;
          throw new Error(
            `Failed to copy file to ${destination} : ${error.message}`,
          );
        });
      });
    }
  }
}
