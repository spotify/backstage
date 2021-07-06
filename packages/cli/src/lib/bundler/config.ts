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
import { resolve as resolvePath } from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';
import StartServerPlugin from 'start-server-webpack-plugin';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { isChildPath } from '@backstage/cli-common';
import { optimization } from './optimization';
import { Config } from '@backstage/config';
import { BundlingPaths } from './paths';
import { transforms } from './transforms';
import { LinkedPackageResolvePlugin } from './LinkedPackageResolvePlugin';
import { BundlingOptions, BackendBundlingOptions, LernaPackage } from './types';
import { version } from '../../lib/version';
import { paths as cliPaths } from '../../lib/paths';
import { runPlain } from '../run';

export function resolveBaseUrl(config: Config): URL {
  const baseUrl = config.getString('app.baseUrl');
  try {
    return new URL(baseUrl);
  } catch (error) {
    throw new Error(`Invalid app.baseUrl, ${error}`);
  }
}

async function readBuildInfo() {
  const timestamp = Date.now();

  let commit = 'unknown';
  try {
    commit = await runPlain('git', 'rev-parse', 'HEAD');
  } catch (error) {
    console.warn(`WARNING: Failed to read git commit, ${error}`);
  }

  let gitVersion = 'unknown';
  try {
    gitVersion = await runPlain('git', 'describe', '--always');
  } catch (error) {
    console.warn(`WARNING: Failed to describe git version, ${error}`);
  }

  const { version: packageVersion } = await fs.readJson(
    cliPaths.resolveTarget('package.json'),
  );

  return {
    cliVersion: version,
    gitVersion,
    packageVersion,
    timestamp,
    commit,
  };
}

async function loadLernaPackages(): Promise<LernaPackage[]> {
  const { Project } = require('@lerna/project');
  const project = new Project(cliPaths.targetDir);
  return project.getPackages();
}

export async function createConfig(
  paths: BundlingPaths,
  options: BundlingOptions,
): Promise<webpack.Configuration> {
  const { checksEnabled, isDev, frontendConfig } = options;

  const packages = await loadLernaPackages();
  const { plugins, loaders } = transforms(options);
  // Any package that is part of the monorepo but outside the monorepo root dir need
  // separate resolution logic.
  const externalPkgs = packages.filter(
    p => !isChildPath(paths.root, p.location),
  );

  const baseUrl = frontendConfig.getString('app.baseUrl');
  const validBaseUrl = new URL(baseUrl);

  if (checksEnabled) {
    plugins.push(
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: paths.targetTsConfig,
        },
        eslint: {
          files: ['**', '!**/__tests__/**', '!**/?(*.)(spec|test).*'],
          options: {
            parserOptions: {
              project: paths.targetTsConfig,
              tsconfigRootDir: paths.targetPath,
            },
          },
        },
      }),
    );
  }

  plugins.push(
    new webpack.EnvironmentPlugin({
      APP_CONFIG: options.frontendAppConfigs,
    }),
  );

  plugins.push(
    new HtmlWebpackPlugin({
      template: paths.targetHtml,
      templateParameters: {
        publicPath: validBaseUrl.pathname.replace(/\/$/, ''),
        app: {
          title: frontendConfig.getString('app.title'),
          baseUrl: validBaseUrl.href,
          googleAnalyticsTrackingId: frontendConfig.getOptionalString(
            'app.googleAnalyticsTrackingId',
          ),
          datadogRum: {
            env: frontendConfig.getOptionalString('app.datadogRum.env'),
            clientToken: frontendConfig.getOptionalString(
              'app.datadogRum.clientToken',
            ),
            applicationId: frontendConfig.getOptionalString(
              'app.datadogRum.applicationId',
            ),
            site: frontendConfig.getOptionalString('app.datadogRum.site'),
          },
        },
      },
    }),
  );

  const buildInfo = await readBuildInfo();
  plugins.push(
    new webpack.DefinePlugin({
      'process.env.BUILD_INFO': JSON.stringify(buildInfo),
    }),
  );

  return {
    mode: isDev ? 'development' : 'production',
    profile: false,
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    optimization: optimization(options),
    bail: false,
    performance: {
      hints: false, // we check the gzip size instead
    },
    devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',
    context: paths.targetPath,
    entry: [require.resolve('react-hot-loader/patch'), paths.targetEntry],
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
      mainFields: ['browser', 'module', 'main'],
      plugins: [
        new LinkedPackageResolvePlugin(paths.rootNodeModules, externalPkgs),
        new ModuleScopePlugin(
          [paths.targetSrc, paths.targetDev],
          [paths.targetPackageJson],
        ),
      ],
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    module: {
      rules: loaders,
    },
    output: {
      path: paths.targetDist,
      publicPath: validBaseUrl.pathname,
      filename: isDev ? '[name].js' : 'static/[name].[hash:8].js',
      chunkFilename: isDev
        ? '[name].chunk.js'
        : 'static/[name].[chunkhash:8].chunk.js',
      ...(isDev
        ? {
            devtoolModuleFilenameTemplate: info =>
              `file:///${resolvePath(info.absoluteResourcePath).replace(
                /\\/g,
                '/',
              )}`,
          }
        : {}),
    },
    plugins,
  };
}

export async function createBackendConfig(
  paths: BundlingPaths,
  options: BackendBundlingOptions,
): Promise<webpack.Configuration> {
  const { checksEnabled, isDev } = options;

  // Find all local monorepo packages and their node_modules, and mark them as external.
  const packages = await await loadLernaPackages();
  const localPackageNames = packages.map((p: any) => p.name);
  const moduleDirs = packages.map((p: any) =>
    resolvePath(p.location, 'node_modules'),
  );
  const externalPkgs = packages.filter(
    p => !isChildPath(paths.root, p.location),
  ); // See frontend config

  const { loaders } = transforms(options);

  return {
    mode: isDev ? 'development' : 'production',
    profile: false,
    ...(isDev
      ? {
          watch: true,
          watchOptions: {
            ignored: [/node_modules\/(?!\@backstage)/],
          },
        }
      : {}),
    externals: [
      nodeExternalsWithResolve({
        modulesDir: paths.rootNodeModules,
        additionalModuleDirs: moduleDirs,
        allowlist: ['webpack/hot/poll?100', ...localPackageNames],
      }),
    ],
    target: 'node' as const,
    node: {
      /* eslint-disable-next-line no-restricted-syntax */
      __dirname: true,
      __filename: true,
      global: true,
    },
    bail: false,
    performance: {
      hints: false, // we check the gzip size instead
    },
    devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',
    context: paths.targetPath,
    entry: [
      'webpack/hot/poll?100',
      paths.targetRunFile ? paths.targetRunFile : paths.targetEntry,
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
      mainFields: ['browser', 'module', 'main'],
      modules: [paths.rootNodeModules, ...moduleDirs],
      plugins: [
        new LinkedPackageResolvePlugin(paths.rootNodeModules, externalPkgs),
        new ModuleScopePlugin(
          [paths.targetSrc, paths.targetDev],
          [paths.targetPackageJson],
        ),
      ],
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    module: {
      rules: loaders,
    },
    output: {
      path: paths.targetDist,
      filename: isDev ? '[name].js' : '[name].[hash:8].js',
      chunkFilename: isDev
        ? '[name].chunk.js'
        : '[name].[chunkhash:8].chunk.js',
      ...(isDev
        ? {
            devtoolModuleFilenameTemplate: info =>
              `file:///${resolvePath(info.absoluteResourcePath).replace(
                /\\/g,
                '/',
              )}`,
          }
        : {}),
    },
    plugins: [
      new StartServerPlugin({
        name: 'main.js',
        nodeArgs: options.inspectEnabled ? ['--inspect'] : undefined,
      }),
      new webpack.HotModuleReplacementPlugin(),
      ...(checksEnabled
        ? [
            new ForkTsCheckerWebpackPlugin({
              typescript: {
                configFile: paths.targetTsConfig,
              },
              eslint: {
                files: ['**', '!**/__tests__/**', '!**/?(*.)(spec|test).*'],
                options: {
                  parserOptions: {
                    project: paths.targetTsConfig,
                    tsconfigRootDir: paths.targetPath,
                  },
                },
              },
            }),
          ]
        : []),
    ],
  };
}

// This makes the module resolution happen from the context of each non-external module, rather
// than the main entrypoint. This fixes a bug where dependencies would be resolved from the backend
// package rather than each individual backend package and plugin.
//
// TODO(Rugvip): Feature suggestion/contribute this to webpack-externals
function nodeExternalsWithResolve(
  options: Parameters<typeof nodeExternals>[0],
) {
  let currentContext: string;
  const externals = nodeExternals({
    ...options,
    importType(request) {
      const resolved = require.resolve(request, {
        paths: [currentContext],
      });
      return `commonjs ${resolved}`;
    },
  });

  return (
    context: string,
    request: string,
    callback: webpack.ExternalsFunctionCallback,
  ) => {
    currentContext = context;
    return externals(context, request, callback);
  };
}
