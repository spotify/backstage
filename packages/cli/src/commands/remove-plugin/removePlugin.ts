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
import fse from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer, { Answers, Question } from 'inquirer';
import { getCodeownersFilePath } from '../../lib/codeowners';
import { paths } from '../../lib/paths';
import { Task } from '../../lib/tasks';

const BACKSTAGE = '@backstage';

export const checkExists = async (rootDir: string, pluginName: string) => {
  await Task.forItem('checking', pluginName, async () => {
    try {
      const destination = path.join(rootDir, 'plugins', pluginName);
      const pathExist = await fse.pathExists(destination);

      if (!pathExist) {
        throw new Error(
          chalk.red(`   Plugin ${chalk.cyan(pluginName)} does not exist!`),
        );
      }
    } catch (e) {
      throw new Error(
        chalk.red(
          `   There was an error removing plugin ${chalk.cyan(pluginName)}: ${
            e.message
          }`,
        ),
      );
    }
  });
};

export const removePluginDirectory = async (destination: string) => {
  await Task.forItem('removing', 'plugin files', async () => {
    try {
      await fse.remove(destination);
    } catch (e) {
      throw Error(
        chalk.red(
          `   There was a problem removing the plugin directory: ${e.message}`,
        ),
      );
    }
  });
};

export const removeSymLink = async (destination: string) => {
  await Task.forItem('removing', 'symbolic link', async () => {
    const symLinkExists = await fse.pathExists(destination);
    if (symLinkExists) {
      try {
        await fse.remove(destination);
      } catch (e) {
        throw Error(
          chalk.red(
            `   Could not remove symbolic link\t${chalk.cyan(destination)}: ${
              e.message
            }`,
          ),
        );
      }
    }
  });
};

const removeAllStatementsContainingID = async (file: string, ID: string) => {
  const originalContent = await fse.readFile(file, 'utf8');
  const contentAfterRemoval = originalContent
    .split('\n')
    .filter(statement => !statement.includes(`${ID}`)) // get rid of lines with pluginName
    .join('\n');
  if (originalContent !== contentAfterRemoval) {
    await fse.writeFile(file, contentAfterRemoval, 'utf8');
  }
};

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const removeReferencesFromPluginsFile = async (
  pluginsFile: string,
  pluginName: string,
) => {
  const pluginNameCapitalized = pluginName
    .split('-')
    .map(name => capitalize(name))
    .join('');

  await Task.forItem('removing', 'export references', async () => {
    try {
      await removeAllStatementsContainingID(pluginsFile, pluginNameCapitalized);
    } catch (e) {
      throw new Error(
        chalk.red(
          `   There was an error removing export statement for plugin ${chalk.cyan(
            pluginNameCapitalized,
          )}: ${e.message}`,
        ),
      );
    }
  });
};

export const removePluginFromCodeOwners = async (
  codeOwnersFile: string,
  pluginName: string,
) => {
  await Task.forItem('removing', 'codeowners references', async () => {
    try {
      await removeAllStatementsContainingID(codeOwnersFile, pluginName);
    } catch (e) {
      throw new Error(
        chalk.red(
          `   There was an error removing code owners statement for plugin ${chalk.cyan(
            pluginName,
          )}: ${e.message}`,
        ),
      );
    }
  });
};

export const removeReferencesFromAppPackage = async (
  appPackageFile: string,
  pluginName: string,
) => {
  const pluginPackage = `${BACKSTAGE}/plugin-${pluginName}`;

  await Task.forItem('removing', 'plugin app dependency', async () => {
    try {
      const appPackageFileContent = await fse.readFile(appPackageFile, 'utf-8');
      const appPackageFileContentJSON = JSON.parse(appPackageFileContent);
      const dependencies = appPackageFileContentJSON.dependencies;

      if (!dependencies[pluginPackage]) {
        throw new Error(
          chalk.red(
            ` Plugin ${chalk.cyan(
              pluginPackage,
            )} does not exist in ${chalk.cyan(appPackageFile)}`,
          ),
        );
      }

      delete dependencies[pluginPackage];
      await fse.writeFile(
        appPackageFile,
        `${JSON.stringify(appPackageFileContentJSON, null, 2)}\n`,
        'utf-8',
      );
    } catch (e) {
      throw new Error(
        chalk.red(
          `  Failed to remove plugin as dependency in app: ${chalk.cyan(
            appPackageFile,
          )}: ${e.message}`,
        ),
      );
    }
  });
};

export default async () => {
  const questions: Question[] = [
    {
      type: 'input',
      name: 'pluginName',
      message: chalk.blue(
        'Enter the ID of the plugin to be removed [required]',
      ),
      validate: (value: any) => {
        if (!value) {
          return chalk.red('Please enter an ID for the plugin');
        } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
          return chalk.red(
            'Plugin IDs must be lowercase and contain only letters, digits and dashes.',
          );
        }
        return true;
      },
    },
  ];

  const answers: Answers = await inquirer.prompt(questions);
  const pluginName: string = answers.pluginName;
  const appPackage = paths.resolveTargetRoot('packages/app');
  const pluginDir = paths.resolveTargetRoot('plugins', answers.pluginName);
  const codeOwnersFile = await getCodeownersFilePath(paths.targetRoot);
  const appPackageFile = path.join(appPackage, 'package.json');
  const appPluginsFile = path.join(appPackage, 'src', 'plugins.ts');
  const pluginScopedDirectory = paths.resolveTargetRoot(
    'node_modules',
    BACKSTAGE,
    `plugin-${pluginName}`,
  );

  Task.log();
  Task.log('Removing the plugin...');

  console.log(pluginScopedDirectory);
  try {
    Task.section('Checking the plugin exists.');
    await checkExists(paths.targetRoot, pluginName);

    Task.section('Removing plugin files.');
    await removePluginDirectory(pluginDir);

    Task.section('Removing symbolic link from @backstage.');
    await removeSymLink(pluginScopedDirectory);

    if (await fse.pathExists(appPackage)) {
      Task.section('Removing references from plugins.ts.');
      await removeReferencesFromPluginsFile(appPluginsFile, pluginName);

      Task.section('Removing plugin dependency from app.');
      await removeReferencesFromAppPackage(appPackageFile, pluginName);
    }

    if (codeOwnersFile) {
      Task.section('Removing codeowners reference.');
      await removePluginFromCodeOwners(codeOwnersFile, pluginName);
    }

    Task.log();
    Task.log(
      `🥇  Successfully removed ${chalk.cyan(
        `@backstage/plugin-${answers.id}`,
      )}`,
    );
    Task.log();
  } catch (error) {
    Task.error(error.message);
    Task.log('It seems that something went wrong when removing the plugin 🤔');
  }
};
