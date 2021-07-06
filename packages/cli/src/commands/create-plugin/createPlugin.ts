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
import inquirer, { Answers, Question } from 'inquirer';
import { exec as execCb } from 'child_process';
import { resolve as resolvePath, join as joinPath } from 'path';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import os from 'os';
import { Command } from 'commander';
import {
  parseOwnerIds,
  addCodeownersEntry,
  getCodeownersFilePath,
} from '../../lib/codeowners';
import { paths } from '../../lib/paths';
import { packageVersions } from '../../lib/version';
import { Task, templatingTask } from '../../lib/tasks';

const exec = promisify(execCb);

async function checkExists(destination: string) {
  await Task.forItem('checking', destination, async () => {
    if (await fs.pathExists(destination)) {
      const existing = chalk.cyan(
        destination.replace(`${paths.targetRoot}/`, ''),
      );
      throw new Error(
        `A plugin with the same name already exists: ${existing}\nPlease try again with a different plugin ID`,
      );
    }
  });
}

const sortObjectByKeys = (obj: { [name in string]: string }) => {
  return Object.keys(obj)
    .sort()
    .reduce((result, key: string) => {
      result[key] = obj[key];
      return result;
    }, {} as { [name in string]: string });
};

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const addExportStatement = async (
  file: string,
  exportStatement: string,
) => {
  const newContents = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean) // get rid of empty lines
    .concat([exportStatement])
    .concat(['']) // newline at end of file
    .join('\n');

  await fs.writeFile(file, newContents, 'utf8');
};

export async function addPluginDependencyToApp(
  rootDir: string,
  pluginPackage: string,
  versionStr: string,
) {
  const packageFilePath = 'packages/app/package.json';
  const packageFile = resolvePath(rootDir, packageFilePath);

  await Task.forItem('processing', packageFilePath, async () => {
    const packageFileContent = await fs.readFile(packageFile, 'utf-8');
    const packageFileJson = JSON.parse(packageFileContent);
    const dependencies = packageFileJson.dependencies;

    if (dependencies[pluginPackage]) {
      throw new Error(
        `Plugin ${pluginPackage} already exists in ${packageFile}`,
      );
    }

    dependencies[pluginPackage] = `^${versionStr}`;
    packageFileJson.dependencies = sortObjectByKeys(dependencies);
    const newContents = `${JSON.stringify(packageFileJson, null, 2)}\n`;

    await fs.writeFile(packageFile, newContents, 'utf-8').catch(error => {
      throw new Error(
        `Failed to add plugin as dependency to app: ${packageFile}: ${error.message}`,
      );
    });
  });
}

export async function addPluginExtensionToApp(
  pluginId: string,
  extensionName: string,
  pluginPackage: string,
) {
  const pluginsFilePath = paths.resolveTargetRoot('packages/app/src/App.tsx');
  if (!(await fs.pathExists(pluginsFilePath))) {
    return;
  }

  await Task.forItem('processing', pluginsFilePath, async () => {
    const content = await fs.readFile(pluginsFilePath, 'utf8');
    const revLines = content.split('\n').reverse();

    const lastImportIndex = revLines.findIndex(line =>
      line.match(/ from ("|').*("|')/),
    );
    const lastRouteIndex = revLines.findIndex(line =>
      line.match(/<\/FlatRoutes/),
    );

    if (lastImportIndex !== -1 && lastRouteIndex !== -1) {
      revLines.splice(
        lastImportIndex,
        0,
        `import { ${extensionName} } from '${pluginPackage}';`,
      );
      const [indentation] = revLines[lastRouteIndex + 1].match(/^\s*/) ?? [];
      revLines.splice(
        lastRouteIndex + 1,
        0,
        `${indentation}<Route path="/${pluginId}" element={<${extensionName} />}/>`,
      );

      const newContent = revLines.reverse().join('\n');
      await fs.writeFile(pluginsFilePath, newContent, 'utf8');
    }
  });
}

async function cleanUp(tempDir: string) {
  await Task.forItem('remove', 'temporary directory', async () => {
    await fs.remove(tempDir);
  });
}

async function buildPlugin(pluginFolder: string) {
  const commands = [
    'yarn install',
    'yarn lint --fix',
    'yarn tsc',
    'yarn build',
  ];
  for (const command of commands) {
    try {
      await Task.forItem('executing', command, async () => {
        process.chdir(pluginFolder);
        await exec(command);
      }).catch(error => {
        process.stdout.write(error.stderr);
        process.stdout.write(error.stdout);
        throw new Error(
          `Warning: Could not execute command ${chalk.cyan(command)}`,
        );
      });
    } catch (error) {
      Task.error(error.message);
      break;
    }
  }
}

export async function movePlugin(
  tempDir: string,
  destination: string,
  id: string,
) {
  await Task.forItem('moving', id, async () => {
    await fs.move(tempDir, destination).catch(error => {
      throw new Error(
        `Failed to move plugin from ${tempDir} to ${destination}: ${error.message}`,
      );
    });
  });
}

export default async (cmd: Command) => {
  const codeownersPath = await getCodeownersFilePath(paths.targetRoot);

  const questions: Question[] = [
    {
      type: 'input',
      name: 'id',
      message: chalk.blue('Enter an ID for the plugin [required]'),
      validate: (value: any) => {
        if (!value) {
          return chalk.red('Please enter an ID for the plugin');
        } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
          return chalk.red(
            'Plugin IDs must be lowercase and contain only letters, digits, and dashes.',
          );
        }
        return true;
      },
    },
  ];

  if (codeownersPath) {
    questions.push({
      type: 'input',
      name: 'owner',
      message: chalk.blue(
        'Enter the owner(s) of the plugin. If specified, this will be added to CODEOWNERS for the plugin path. [optional]',
      ),
      validate: (value: any) => {
        if (!value) {
          return true;
        }

        const ownerIds = parseOwnerIds(value);
        if (!ownerIds) {
          return chalk.red(
            'The owner must be a space separated list of team names (e.g. @org/team-name), usernames (e.g. @username), or the email addresses of users (e.g. user@example.com).',
          );
        }

        return true;
      },
    });
  }

  const answers: Answers = await inquirer.prompt(questions);
  const pluginId = cmd.backend ? `${answers.id}-backend` : answers.id;

  const name = cmd.scope
    ? `@${cmd.scope.replace(/^@/, '')}/plugin-${pluginId}`
    : `plugin-${pluginId}`;
  const pluginVar = `${camelCase(answers.id)}Plugin`;
  const extensionName = `${upperFirst(camelCase(answers.id))}Page`;
  const npmRegistry = cmd.npmRegistry && cmd.scope ? cmd.npmRegistry : '';
  const privatePackage = cmd.private === false ? false : true;
  const isMonoRepo = await fs.pathExists(paths.resolveTargetRoot('lerna.json'));
  const appPackage = paths.resolveTargetRoot('packages/app');
  const templateDir = paths.resolveOwn(
    cmd.backend
      ? 'templates/default-backend-plugin'
      : 'templates/default-plugin',
  );
  const pluginDir = isMonoRepo
    ? paths.resolveTargetRoot('plugins', pluginId)
    : paths.resolveTargetRoot(pluginId);
  const ownerIds = parseOwnerIds(answers.owner);
  const { version: pluginVersion } = isMonoRepo
    ? await fs.readJson(paths.resolveTargetRoot('lerna.json'))
    : { version: '0.1.0' };

  Task.log();
  Task.log('Creating the plugin...');

  Task.section('Checking if the plugin ID is available');
  await checkExists(pluginDir);

  Task.section('Creating a temporary plugin directory');
  const tempDir = await fs.mkdtemp(
    joinPath(os.tmpdir(), `backstage-plugin-${pluginId}`),
  );

  try {
    Task.section('Preparing files');

    await templatingTask(
      templateDir,
      tempDir,
      {
        ...answers,
        pluginVar,
        pluginVersion,
        extensionName,
        name,
        privatePackage,
        npmRegistry,
      },
      packageVersions,
    );

    Task.section('Moving to final location');
    await movePlugin(tempDir, pluginDir, pluginId);

    Task.section('Building the plugin');
    await buildPlugin(pluginDir);

    if ((await fs.pathExists(appPackage)) && !cmd.backend) {
      Task.section('Adding plugin as dependency in app');
      await addPluginDependencyToApp(paths.targetRoot, name, pluginVersion);

      Task.section('Import plugin in app');
      await addPluginExtensionToApp(pluginId, extensionName, name);
    }

    if (ownerIds && ownerIds.length) {
      await addCodeownersEntry(
        codeownersPath!,
        `/plugins/${pluginId}`,
        ownerIds,
      );
    }

    Task.log();
    Task.log(`🥇  Successfully created ${chalk.cyan(`${name}`)}`);
    Task.log();
    Task.exit();
  } catch (error) {
    Task.error(error.message);

    Task.log('It seems that something went wrong when creating the plugin 🤔');
    Task.log('We are going to clean up, and then you can try again.');

    Task.section('Cleanup');
    await cleanUp(tempDir);
    Task.error('🔥  Failed to create plugin!');
    Task.exit(1);
  }
};
