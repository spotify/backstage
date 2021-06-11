/*
 * Copyright 2020 Spotify AB
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
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import openBrowser from 'react-dev-utils/openBrowser';
import { createConfig, resolveBaseUrl } from './config';
import { ServeOptions } from './types';
import { resolveBundlingPaths } from './paths';

export async function serveBundle(options: ServeOptions) {
  const url = resolveBaseUrl(options.frontendConfig);

  const host =
    options.frontendConfig.getOptionalString('app.listen.host') || url.hostname;
  const port =
    options.frontendConfig.getOptionalNumber('app.listen.port') ||
    Number(url.port) ||
    (url.protocol === 'https:' ? 443 : 80);

  const paths = resolveBundlingPaths(options);
  const pkgPath = paths.targetPackageJson;
  const pkg = await fs.readJson(pkgPath);
  const config = await createConfig(paths, {
    ...options,
    isDev: true,
    baseUrl: url,
  });
  const compiler = webpack(config);

  const server = new WebpackDevServer(compiler, {
    hot: !process.env.CI,
    contentBase: paths.targetPublic,
    contentBasePublicPath: config.output?.publicPath,
    publicPath: config.output?.publicPath,
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebookincubator/create-react-app/issues/387.
      disableDotRule: true,
    },
    clientLogLevel: 'warning',
    stats: 'errors-warnings',
    https: url.protocol === 'https:',
    host,
    port,
    proxy: pkg.proxy,
    // When the dev server is behind a proxy, the host and public hostname differ
    allowedHosts: [url.hostname],
  });

  await new Promise<void>((resolve, reject) => {
    server.listen(port, host, (err?: Error) => {
      if (err) {
        reject(err);
        return;
      }

      openBrowser(url.href);
      resolve();
    });
  });

  const waitForExit = async () => {
    for (const signal of ['SIGINT', 'SIGTERM'] as const) {
      process.on(signal, () => {
        server.close();
        // exit instead of resolve. The process is shutting down and resolving a promise here logs an error
        process.exit();
      });
    }

    // Block indefinitely and wait for the interrupt signal
    return new Promise(() => {});
  };

  return waitForExit;
}
