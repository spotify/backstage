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
import { relative as relativePath, resolve as resolvePath } from 'node:path';
import { targetPaths } from '@backstage/cli-common';

import { makeRollupConfigs } from './config';
import { BuildOptions, Output } from './types';
import { PackageRoles, runConcurrentTasks } from '@backstage/cli-node';
import { buildBackendBrowserAssets } from '../backendBrowserAssets';

export function formatErrorMessage(error: any) {
  let msg = '';

  if (error.code === 'PLUGIN_ERROR') {
    if (error.plugin === 'esbuild') {
      msg += `${error.message}`;
      if (error.errors?.length) {
        msg += `\n\n`;
        for (const { text, location } of error.errors) {
          const { line, column } = location;
          const path = relativePath(targetPaths.dir, error.id);
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
      const file = `${targetPaths.resolve((error.loc.file || error.id)!)}`;
      const pos = `${error.loc.line}:${error.loc.column}`;
      msg += `${file} [${pos}]\n`;
    } else if (error.id) {
      msg += `${targetPaths.resolve(error.id)}\n`;
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

async function rollupBuild(config: RollupOptions) {
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
      targetPaths.resolveRoot('package.json'),
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

  const rollupConfigs = await makeRollupConfigs(options);

  const targetDir = options.targetDir ?? targetPaths.dir;
  await fs.remove(resolvePath(targetDir, 'dist'));

  const buildTasks = rollupConfigs.map(rollupBuild);

  await Promise.all(buildTasks);
  await buildBackendBrowserAssets({ targetDir });
};

export const buildPackages = async (options: BuildOptions[]) => {
  if (options.some(opt => !opt.targetDir)) {
    throw new Error('targetDir must be set for all build options');
  }
  const rollupConfigs = await Promise.all(options.map(makeRollupConfigs));

  await Promise.all(
    options.map(({ targetDir }) => fs.remove(resolvePath(targetDir!, 'dist'))),
  );

  const buildTasks = rollupConfigs.flat().map(opts => () => rollupBuild(opts));

  await runConcurrentTasks({
    items: buildTasks,
    worker: async task => task(),
  });

  await Promise.all(
    options.map(({ targetDir }) =>
      buildBackendBrowserAssets({ targetDir: targetDir! }),
    ),
  );
};

export function getOutputsForRole(role: string): Set<Output> {
  const outputs = new Set<Output>();

  for (const output of PackageRoles.getRoleInfo(role).output) {
    if (output === 'cjs') {
      outputs.add(Output.cjs);
    }
    if (output === 'esm') {
      outputs.add(Output.esm);
    }
    if (output === 'types') {
      outputs.add(Output.types);
    }
  }

  return outputs;
}
