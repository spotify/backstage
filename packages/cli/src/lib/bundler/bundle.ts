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

import yn from 'yn';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import webpack from 'webpack';
import {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} from 'react-dev-utils/FileSizeReporter';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import { createConfig, resolveBaseUrl } from './config';
import { BuildOptions } from './types';
import { resolveBundlingPaths } from './paths';
import chalk from 'chalk';

// TODO(Rugvip): Limits from CRA, we might want to tweak these though.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

export async function buildBundle(options: BuildOptions) {
  const { statsJsonEnabled, schema: configSchema } = options;

  const paths = resolveBundlingPaths(options);
  const config = await createConfig(paths, {
    ...options,
    checksEnabled: false,
    isDev: false,
    baseUrl: resolveBaseUrl(options.frontendConfig),
  });
  const compiler = webpack(config);

  const isCi = yn(process.env.CI, { default: false });

  const previousFileSizes = await measureFileSizesBeforeBuild(paths.targetDist);
  await fs.emptyDir(paths.targetDist);

  if (paths.targetPublic) {
    await fs.copy(paths.targetPublic, paths.targetDist, {
      dereference: true,
      filter: file => file !== paths.targetHtml,
    });
  }

  if (configSchema) {
    await fs.writeJson(
      resolvePath(paths.targetDist, '.config-schema.json'),
      configSchema.serialize(),
      { spaces: 2 },
    );
  }

  const { stats } = await build(compiler, isCi).catch(error => {
    console.log(chalk.red('Failed to compile.\n'));
    throw new Error(`Failed to compile.\n${error.message || error}`);
  });

  if (statsJsonEnabled) {
    // No @types/bfj
    await require('bfj').write(
      resolvePath(paths.targetDist, 'bundle-stats.json'),
      stats.toJson(),
    );
  }

  printFileSizesAfterBuild(
    stats,
    previousFileSizes,
    paths.targetDist,
    WARN_AFTER_BUNDLE_GZIP_SIZE,
    WARN_AFTER_CHUNK_GZIP_SIZE,
  );
}

async function build(compiler: webpack.Compiler, isCi: boolean) {
  const stats = await new Promise<webpack.Stats>((resolve, reject) => {
    compiler.run((err, buildStats) => {
      if (err) {
        if (err.message) {
          const { errors } = formatWebpackMessages({
            errors: [err.message],
            warnings: new Array<string>(),
          } as webpack.Stats.ToJsonOutput);

          throw new Error(errors[0]);
        } else {
          reject(err);
        }
      } else {
        resolve(buildStats);
      }
    });
  });

  const { errors, warnings } = formatWebpackMessages(
    stats.toJson({ all: false, warnings: true, errors: true }),
  );

  if (errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    throw new Error(errors[0]);
  }
  if (isCi && warnings.length) {
    console.log(
      chalk.yellow(
        '\nTreating warnings as errors because process.env.CI = true.\n',
      ),
    );
    throw new Error(warnings.join('\n\n'));
  }

  return { stats };
}
