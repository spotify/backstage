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

import { BundlingOptions } from './types';
import {
  SwcJsMinimizerRspackPlugin,
  LightningCssMinimizerRspackPlugin,
  RspackOptionsNormalized,
} from '@rspack/core';
import { STATIC_ASSET_HASH_LENGTH } from './staticAssetHash';

// Matches the name of the package that a module belongs to, skipping the
// virtual store of the pnpm isolated linker, where every path starts with
// node_modules/.pnpm/<name>@<version>/node_modules/<name>
const PACKAGE_PATH_PATTERN =
  /[\\/]node_modules[\\/](?:\.pnpm[\\/][^\\/]+[\\/]node_modules[\\/])?(.*?)([\\/]|$)/;

export const optimization = (
  options: BundlingOptions,
): RspackOptionsNormalized['optimization'] => {
  const { isDev, moduleFederationRemote, webpack } = options;
  const sharedRemoteChunks = {
    chunks: 'async' as const,
    name: false as const,
    minChunks: 2,
    minSize: 20_000,
    maxAsyncRequests: Infinity,
    maxInitialRequests: Infinity,
    reuseExistingChunk: true,
    // Extracted styles retain the ordering of their importing chunks. Sharing
    // them across unrelated lazy boundaries can introduce conflicting orders.
    type: /^(?!css\/mini-extract$)/,
  };

  const MinifyPlugin = webpack
    ? require('esbuild-loader').EsbuildPlugin
    : SwcJsMinimizerRspackPlugin;

  return {
    minimize: !isDev,
    minimizer: [
      new MinifyPlugin({
        target: 'ES2023',
        format: 'iife',
        exclude: 'remoteEntry.js',
      }),
      // Avoid iife wrapping of module federation remote entry as it breaks the variable assignment
      new MinifyPlugin({
        target: 'ES2023',
        format: undefined,
        include: 'remoteEntry.js',
      }),
      webpack ? undefined : new LightningCssMinimizerRspackPlugin(),
    ],
    runtimeChunk: 'single',
    splitChunks: {
      automaticNameDelimiter: '-',
      cacheGroups: moduleFederationRemote
        ? {
            default: false,
            defaultVendors: false,
            dependencies: {
              ...sharedRemoteChunks,
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            },
            workspace: {
              ...sharedRemoteChunks,
              priority: 0,
            },
          }
        : {
            default: false,
            // Put large dependencies from the initial page load in individual files.
            packages: {
              chunks: 'initial',
              test(module: any) {
                return Boolean(module?.resource?.match(PACKAGE_PATH_PATTERN));
              },
              name(module: any) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName =
                  module.resource.match(PACKAGE_PATH_PATTERN)[1];

                // npm package names are URL-safe, but some servers don't like @ symbols
                return packageName.replace('@', '');
              },
              filename: isDev
                ? 'module-[name].js'
                : `static/module-[name].[contenthash:${STATIC_ASSET_HASH_LENGTH}].js`,
              priority: 10,
              minSize: 100000,
              minChunks: 1,
              ...(webpack && {
                maxAsyncRequests: Infinity,
                maxInitialRequests: Infinity,
              }),
            }, // filename is not included in type, but we need it
            // Group together the smallest modules
            vendor: {
              chunks: 'initial',
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 5,
              enforce: true,
            },
          },
    },
  };
};
