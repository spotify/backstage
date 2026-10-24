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
import { createHash } from 'node:crypto';
import {
  basename,
  extname,
  relative as relativePath,
  resolve as resolvePath,
} from 'node:path';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import yaml from '@rollup/plugin-yaml';
import {
  RollupOptions,
  OutputOptions,
  WarningHandlerWithDefault,
  OutputPlugin,
} from 'rollup';

import { forwardFileImports, cssEntryPoints } from './plugins';
import { BuildOptions, Output } from './types';
import { targetPaths } from '@backstage/cli-common';

import { BackstagePackageJson } from '@backstage/cli-node';
import { detectPackageManager } from '@backstage/cli-node/alpha';
import { readEntryPoints } from '../entryPoints';

const SCRIPT_EXTS = ['.js', '.jsx', '.ts', '.tsx'];

const MODULE_EXTS = ['.mjs', '.mts'];
const COMMONJS_EXTS = ['.cjs', '.cts'];
const MOD_EXT = '.mjs';
const CJS_EXT = '.cjs';
const CJS_JS_EXT = '.cjs.js';

function isFileImport(source: string) {
  if (source.startsWith('.')) {
    return true;
  }
  if (source.startsWith('/')) {
    return true;
  }
  if (source.match(/[a-z]:/i)) {
    return true;
  }
  return false;
}

function buildInternalImportPattern(options: BuildOptions) {
  const inlinedPackages = options.workspacePackages.filter(
    pkg => pkg.packageJson.backstage?.inline,
  );
  for (const { packageJson } of inlinedPackages) {
    if (!packageJson.private) {
      throw new Error(
        `Inlined package ${packageJson.name} must be marked as private`,
      );
    }
  }
  const names = inlinedPackages.map(pkg => pkg.packageJson.name);
  return new RegExp(`^(?:${names.join('|')})(?:$|/)`);
}

// This Rollup output plugin enables support for mixed CommonJS and ESM output.
// It does it be filtering out the unwanted output files that don't match the
// input file format, allowing the rollup configuration to have overlapping
// output configurations for different formats.
function multiOutputFormat(): OutputPlugin {
  return {
    name: 'backstage-multi-output-format',
    generateBundle(opts, bundle) {
      const filter: (name: string) => boolean =
        opts.format === 'cjs'
          ? s => s.endsWith(MOD_EXT)
          : s => !s.endsWith(MOD_EXT);

      // Delete any files that don't match the current output format
      for (const name in bundle) {
        if (filter(name)) {
          delete bundle[name];
          delete bundle[`${name}.map`];
        }
      }
    },
    renderDynamicImport(opts) {
      if (opts.format === 'cjs') {
        return {
          left: 'import(',
          right: ')',
        };
      }
      return undefined;
    },
  };
}

export async function makeRollupConfigs(
  options: BuildOptions,
): Promise<RollupOptions[]> {
  const configs = new Array<RollupOptions>();
  const targetDir = options.targetDir ?? targetPaths.dir;

  let targetPkg = options.packageJson;
  if (!targetPkg) {
    const packagePath = resolvePath(targetDir, 'package.json');
    targetPkg = (await fs.readJson(packagePath)) as BackstagePackageJson;
  }

  const onwarn: WarningHandlerWithDefault = ({ code, message }) => {
    if (code === 'EMPTY_BUNDLE') {
      return; // We don't care about this one
    }
    if (options.logPrefix) {
      console.log(options.logPrefix + message);
    } else {
      console.log(message);
    }
  };

  const distDir = resolvePath(targetDir, 'dist');
  const entryPoints = readEntryPoints(targetPkg);

  const scriptEntryPoints = entryPoints.filter(e =>
    SCRIPT_EXTS.includes(e.ext),
  );

  const internalImportPattern = buildInternalImportPattern(options);
  const external = (
    source: string,
    importer: string | undefined,
    isResolved: boolean,
  ) => {
    if (source.startsWith('node:')) {
      return true;
    }

    return Boolean(
      importer &&
        !isResolved &&
        !internalImportPattern.test(source) &&
        !isFileImport(source),
    );
  };

  if (options.outputs.has(Output.cjs) || options.outputs.has(Output.esm)) {
    const output = new Array<OutputOptions>();
    const mainFields = ['module', 'main'];

    // Avoid using node_modules as a directory name, since it's trimmed from published packages.
    // This can happen when inlining dependencies such as style-inject added for css injection.
    const rewriteNodeModules = (name: string) =>
      name.replaceAll('node_modules', 'node_modules_dist');

    // For CommonJS we build both CommonJS and ESM output. Each of these outputs
    // can output both .cjs and .mjs files. The files from each of these outputs
    // will overlap, but we trim away files where the format doesn't match the
    // file extensions. That way we are left with a combination of .cjs and .mjs
    // files where the module format in the file matches the file extension.
    if (options.outputs.has(Output.cjs)) {
      const defaultExt = targetPkg.type === 'module' ? MOD_EXT : CJS_JS_EXT;
      const outputOpts: OutputOptions = {
        dir: distDir,
        entryFileNames(chunkInfo) {
          const cleanName = rewriteNodeModules(chunkInfo.name);

          const inputId = chunkInfo.facadeModuleId;
          if (!inputId) {
            return cleanName + defaultExt;
          }

          const inputExt = extname(inputId);
          if (MODULE_EXTS.includes(inputExt)) {
            return cleanName + MOD_EXT;
          }
          if (COMMONJS_EXTS.includes(inputExt)) {
            return cleanName + CJS_EXT;
          }
          return cleanName + defaultExt;
        },
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: `${targetDir}/src`,
        interop: 'compat',
        exports: 'named',
        plugins: [multiOutputFormat()],
      };

      output.push({
        ...outputOpts,
        format: 'cjs',
      });
      output.push({
        ...outputOpts,
        format: 'module',
      });
    }
    if (options.outputs.has(Output.esm)) {
      output.push({
        dir: distDir,
        entryFileNames: chunkInfo =>
          `${rewriteNodeModules(chunkInfo.name)}.esm.js`,
        chunkFileNames: `esm/[name]-[hash].esm.js`,
        format: 'module',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: `${targetDir}/src`,
      });
      // Assume we're building for the browser if ESM output is included
      mainFields.unshift('browser');
    }

    configs.push({
      input: Object.fromEntries(
        scriptEntryPoints.map(e => [e.name, resolvePath(targetDir, e.path)]),
      ),
      output,
      onwarn,
      makeAbsoluteExternalsRelative: false,
      preserveEntrySignatures: 'strict',
      // All module imports are always marked as external
      external,
      plugins: [
        resolve({
          mainFields,
          extensions: SCRIPT_EXTS,
        }),
        commonjs({
          include: /node_modules/,
          exclude: [/\/[^/]+\.(?:stories|test)\.[^/]+$/],
        }),
        postcss({
          modules: {
            generateScopedName(name: string, filename: string, css: string) {
              const hash = createHash('md5')
                .update(css)
                .digest('hex')
                .slice(0, 10);
              const file = basename(filename, '.module.css');
              return `${file}_${name}__${hash}`;
            },
          },
        }),
        forwardFileImports({
          exclude: /\.icon\.svg$/,
          include: [
            /\.svg$/,
            /\.png$/,
            /\.gif$/,
            /\.jpg$/,
            /\.jpeg$/,
            /\.webp$/,
            /\.eot$/,
            /\.woff$/,
            /\.woff2$/,
            /\.ttf$/,
            /\.md$/,
          ],
        }),
        json(),
        yaml(),
        esbuild({
          target: 'ES2023',
          minify: options.minify,
        }),
        cssEntryPoints({ entryPoints, targetDir }),
      ],
    });
  }

  if (options.outputs.has(Output.types)) {
    const input = Object.fromEntries(
      scriptEntryPoints.map(e => [
        e.name,
        targetPaths.resolveInstallationRoot(
          'dist-types',
          relativePath(targetPaths.installationRootDir, targetDir),
          e.path.replace(/\.(?:ts|tsx)$/, '.d.ts'),
        ),
      ]),
    );

    for (const path of Object.values(input)) {
      const declarationsExist = await fs.pathExists(path);
      if (!declarationsExist) {
        const declarationPath = relativePath(targetDir, path);
        const packageManager = await detectPackageManager();
        throw new Error(
          `No declaration files found at ${declarationPath}, be sure to run ${chalk.bgRed.white(
            packageManager.getCommandHint(['tsc']),
          )} to generate .d.ts files before packaging`,
        );
      }
    }

    configs.push({
      input,
      output: {
        dir: distDir,
        entryFileNames: `[name].d.ts`,
        chunkFileNames: `types/[name]-[hash].d.ts`,
        format: 'es',
      },
      external: (source, importer, isResolved) =>
        /\.css|scss|sass|svg|eot|woff|woff2|ttf$/.test(source) ||
        external(source, importer, isResolved),
      onwarn,
      plugins: [dts({ respectExternal: true })],
    });
  }

  return configs;
}
