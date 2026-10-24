/*
 * Copyright 2023 The Backstage Authors
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
import { targetPaths } from '@backstage/cli-common';
import chalk from 'chalk';
import { spawn } from '../../../../lib/exec';
import { getPathToCurrentOpenApiSpec } from '../../../../lib/openapi/helpers';
import { ConfigSources } from '@backstage/config-loader';
import { loadYaml } from '../../../../lib/yaml';
import { join } from 'node:path';
import { OptionValues } from 'commander';
import { sync as existsSync } from 'command-exists';

async function fuzz(opts: OptionValues) {
  const resolvedOpenapiPath = await getPathToCurrentOpenApiSpec();

  if (!existsSync('st')) {
    console.log(
      chalk.red(
        `Please install schemathesis globally with 'python -m pip install schemathesis'. Then run this command again.`,
      ),
    );
    process.exit(1);
  }

  const openapiSpec = loadYaml(
    await fs.readFile(resolvedOpenapiPath, 'utf8'),
  ) as { info: { title: string } };
  const configSource = ConfigSources.default({
    rootDir: targetPaths.workspaceRootDir,
  });
  const config = await ConfigSources.toConfig(configSource);
  const pluginId = openapiSpec.info.title;
  const args = [];
  if (opts.debug) {
    args.push(
      '--cassette-path',
      targetPaths.resolveWorkspaceRoot(join('.cassettes', `${pluginId}.yml`)),
    );
  }

  if (opts.limit) {
    args.push('--hypothesis-max-examples', opts.limit);
  }
  args.push('--workers', opts.workers);

  if (opts.useGuest) {
    // TODO: @sennyeya This should leverage the `guest-provider` if available.
    args.push('--header', `Authorization: Basic guest`);
  } else {
    // This is just here to prevent any "Invalid JWT" errors during execution.
    args.push('--header', `Authorization: Basic test`);
  }

  if (opts.excludeChecks) {
    args.push('--exclude-checks', opts.excludeChecks);
  }

  await spawn(
    'st',
    [
      'run',
      '--checks',
      'all',
      ...args,
      `${config.getString('backend.baseUrl')}/api/${pluginId}/openapi.json`,
    ],
    {
      stdio: ['ignore', 'inherit', 'ignore'],
    },
  );
}

export async function command(opts: OptionValues) {
  try {
    await fuzz(opts);
    console.log(chalk.green(`Successfully fuzzed.`));
  } catch (err) {
    console.log(chalk.red(`OpenAPI fuzzing failed.`));
    console.error(err);
    process.exit(1);
  }
}
