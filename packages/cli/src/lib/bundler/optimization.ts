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

import { WebpackOptionsNormalized } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import { BundlingOptions } from './types';
import { isParallelDefault } from '../parallel';

export const optimization = (
  options: BundlingOptions,
): WebpackOptionsNormalized['optimization'] => {
  const { isDev } = options;

  return {
    minimize: !isDev,
    // Only configure when parallel is explicitly overriden from the default
    ...(!isParallelDefault(options.parallel)
      ? {
          minimizer: [
            new TerserPlugin({
              parallel: options.parallel,
            }),
          ],
        }
      : {}),
    runtimeChunk: 'single',
    splitChunks: {
      automaticNameDelimiter: '-',
      cacheGroups: {
        default: false,
        // Put all vendor code needed for initial page load in individual files if they're big
        // enough, if they're smaller they end up in the main
        packages: {
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          name(module: any) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return packageName.replace('@', '');
          },
          filename: isDev
            ? 'module-[name].js'
            : 'static/module-[name].[chunkhash:8].js',
          priority: 10,
          minSize: 100000,
          minChunks: 1,
          maxAsyncRequests: Infinity,
          maxInitialRequests: Infinity,
        } as any, // filename is not included in type, but we need it
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
