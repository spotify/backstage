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
import { rollup, RollupOptions } from 'rollup';
import chalk from 'chalk';
import { relative as relativePath } from 'path';
import { paths } from '../paths';
import { makeConfigs } from './config';
import { BuildOptions } from './types';

export function formatErrorMessage(error: any) {
  let msg = '';

  if (error.code === 'PLUGIN_ERROR') {
    if (error.plugin === 'esbuild') {
      msg += `${error.message}`;
      if (error.errors?.length) {
        msg += `\n\n`;
        for (const { text, location } of error.errors) {
          const { line, column } = location;
          const path = relativePath(paths.targetDir, error.id);
          const loc = chalk.cyan(`${path}:${line}:${column}`);

          if (text === 'Unexpected "<"' && error.id.endsWith('.js')) {
            msg += `${loc}: ${text}, JavaScript files with JSX should use a .jsx extension`;
          } else {
            msg += `${loc}: ${text}`;
          }
        }
      }
    } else {
      // Log which plugin is causing errors to make it easier to identity.
      // If we see these in logs we likely want to provide some custom error
      // output for those plugins too.
      msg += `(plugin ${error.plugin}) ${error}\n`;
    }
  } else {
    // Generic rollup errors, log what's available
    if (error.loc) {
      const file = `${paths.resolveTarget((error.loc.file || error.id)!)}`;
      const pos = `${error.loc.line}:${error.loc.column}`;
      msg += `${file} [${pos}]\n`;
    } else if (error.id) {
      msg += `${paths.resolveTarget(error.id)}\n`;
    }

    msg += `${error}\n`;

    if (error.url) {
      msg += `${chalk.cyan(error.url)}\n`;
    }

    if (error.frame) {
      msg += `${chalk.dim(error.frame)}\n`;
    }
  }
  return msg;
}

async function build(config: RollupOptions) {
  try {
    const bundle = await rollup(config);
    if (config.output) {
      for (const output of [config.output].flat()) {
        await bundle.generate(output);
        await bundle.write(output);
      }
    }
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
}

export const buildPackage = async (options: BuildOptions) => {
  try {
    const { resolutions } = await fs.readJson(
      paths.resolveTargetRoot('package.json'),
    );
    if (resolutions?.esbuild) {
      console.warn(
        chalk.red(
          'Your root package.json contains a "resolutions" entry for "esbuild". This was ' +
            'included in older @backstage/create-app templates in order to work around build ' +
            'issues that have since been fixed. Please remove the entry and run `yarn install`',
        ),
      );
    }
  } catch {
    /* Errors ignored, this is just a warning */
  }

  const configs = await makeConfigs(options);
  await fs.remove(paths.resolveTarget('dist'));
  await Promise.all(configs.map(build));
};
