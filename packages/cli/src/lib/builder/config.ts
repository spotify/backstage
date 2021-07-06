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
import { relative as relativePath } from 'path';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import svgr from '@svgr/rollup';
import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import yaml from '@rollup/plugin-yaml';
import { RollupOptions, OutputOptions } from 'rollup';

import { forwardFileImports } from './plugins';
import { BuildOptions, Output } from './types';
import { paths } from '../paths';
import { svgrTemplate } from '../svgrTemplate';

export const makeConfigs = async (
  options: BuildOptions,
): Promise<RollupOptions[]> => {
  const configs = new Array<RollupOptions>();

  if (options.outputs.has(Output.cjs) || options.outputs.has(Output.esm)) {
    const output = new Array<OutputOptions>();
    const mainFields = ['module', 'main'];

    if (options.outputs.has(Output.cjs)) {
      output.push({
        dir: 'dist',
        entryFileNames: 'index.cjs.js',
        chunkFileNames: 'cjs/[name]-[hash].cjs.js',
        format: 'commonjs',
        sourcemap: true,
      });
    }
    if (options.outputs.has(Output.esm)) {
      output.push({
        dir: 'dist',
        entryFileNames: 'index.esm.js',
        chunkFileNames: 'esm/[name]-[hash].esm.js',
        format: 'module',
        sourcemap: true,
      });
      // Assume we're building for the browser if ESM output is included
      mainFields.unshift('browser');
    }

    configs.push({
      input: 'src/index.ts',
      output,
      preserveEntrySignatures: 'strict',
      external: require('module').builtinModules,
      plugins: [
        peerDepsExternal({
          includeDependencies: true,
        }),
        resolve({ mainFields }),
        commonjs({
          include: /node_modules/,
          exclude: [/\/[^/]+\.(?:stories|test)\.[^/]+$/],
        }),
        postcss(),
        forwardFileImports({
          exclude: /\.icon\.svg$/,
          include: [/\.svg$/, /\.png$/, /\.gif$/, /\.jpg$/, /\.jpeg$/],
        }),
        json(),
        yaml(),
        svgr({
          include: /\.icon\.svg$/,
          template: svgrTemplate,
        }),
        esbuild({
          target: 'es2019',
        }),
      ],
    });
  }

  if (options.outputs.has(Output.types)) {
    const typesInput = paths.resolveTargetRoot(
      'dist-types',
      relativePath(paths.targetRoot, paths.targetDir),
      'src/index.d.ts',
    );

    const declarationsExist = await fs.pathExists(typesInput);
    if (!declarationsExist) {
      const path = relativePath(paths.targetDir, typesInput);
      throw new Error(
        `No declaration files found at ${path}, be sure to run ${chalk.bgRed.white(
          'yarn tsc',
        )} to generate .d.ts files before packaging`,
      );
    }

    configs.push({
      input: typesInput,
      output: {
        file: 'dist/index.d.ts',
        format: 'es',
      },
      plugins: [dts()],
    });
  }

  return configs;
};
