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
import { Command } from 'commander';
import {
  diffTemplateFiles,
  handlers,
  handleAllFiles,
  inquirerPromptFunc,
  makeCheckPromptFunc,
  yesPromptFunc,
} from '../../lib/diff';
import { paths } from '../../lib/paths';

export type PluginData = {
  id: string;
  name: string;
  privatePackage: string;
  pluginVersion: string;
  npmRegistry: string;
};

const fileHandlers = [
  {
    patterns: ['package.json'],
    handler: handlers.packageJson,
  },
  {
    // Not all plugins have routes
    patterns: ['src/routes.ts'],
    handler: handlers.skip,
  },
  {
    // make sure files in 1st level of src/ and dev/ exist
    patterns: ['.eslintrc.js', /^(src|dev)\/[^/]+$/],
    handler: handlers.exists,
  },
  {
    patterns: ['README.md', 'tsconfig.json', /^src\//],
    handler: handlers.skip,
  },
];

export default async (cmd: Command) => {
  let promptFunc = inquirerPromptFunc;
  let finalize = () => {};

  if (cmd.check) {
    [promptFunc, finalize] = makeCheckPromptFunc();
  } else if (cmd.yes) {
    promptFunc = yesPromptFunc;
  }

  const data = await readPluginData();
  const templateFiles = await diffTemplateFiles('default-plugin', data);
  await handleAllFiles(fileHandlers, templateFiles, promptFunc);
  await finalize();
};

// Reads templating data from the existing plugin
async function readPluginData(): Promise<PluginData> {
  let name: string;
  let privatePackage: string;
  let pluginVersion: string;
  let npmRegistry: string;
  try {
    const pkg = require(paths.resolveTarget('package.json'));
    name = pkg.name;
    privatePackage = pkg.private;
    pluginVersion = pkg.version;
    const scope = name.split('/')[0];
    if (`${scope}:registry` in pkg.publishConfig) {
      const registryURL = pkg.publishConfig[`${scope}:registry`];
      npmRegistry = `"${scope}:registry" : "${registryURL}"`;
    } else npmRegistry = '';
  } catch (error) {
    throw new Error(`Failed to read target package, ${error}`);
  }

  const pluginTsContents = await fs.readFile(
    paths.resolveTarget('src/plugin.ts'),
    'utf8',
  );
  // TODO: replace with some proper parsing logic or plugin metadata file
  const pluginIdMatch = pluginTsContents.match(/id: ['"`](.+?)['"`]/);
  if (!pluginIdMatch) {
    throw new Error(`Failed to parse plugin.ts, no plugin ID found`);
  }

  const id = pluginIdMatch[1];

  return { id, name, privatePackage, pluginVersion, npmRegistry };
}
