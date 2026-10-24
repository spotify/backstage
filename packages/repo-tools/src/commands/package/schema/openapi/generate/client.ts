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

import { resolvePackagePath } from '@backstage/backend-plugin-api';
import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve } from 'node:path';
import { exec } from '../../../../../lib/exec';
import {
  OPENAPI_IGNORE_FILES,
  OUTPUT_PATH,
} from '../../../../../lib/openapi/constants';
import { deduplicateImports } from '../../../../../lib/openapi/dedupe-imports';
import { targetPaths } from '@backstage/cli-common';
import {
  getOpenApiGeneratorKey,
  getPathToCurrentOpenApiSpec,
  toGeneratorAdditionalProperties,
} from '../../../../../lib/openapi/helpers';

async function generate(
  outputDirectory: string,
  clientAdditionalProperties?: string,
  abortSignal?: AbortController,
) {
  const resolvedOpenapiPath = await getPathToCurrentOpenApiSpec();
  const resolvedOutputDirectory = targetPaths.resolveWorkspaceRoot(
    outputDirectory,
    OUTPUT_PATH,
  );
  const additionalProperties = toGeneratorAdditionalProperties({
    initialValue: clientAdditionalProperties,
  });
  const generatorKey = await getOpenApiGeneratorKey(resolvedOpenapiPath);

  await fs.emptyDir(resolvedOutputDirectory);

  await fs.writeFile(
    resolve(resolvedOutputDirectory, '.openapi-generator-ignore'),
    OPENAPI_IGNORE_FILES.join('\n'),
  );

  await exec(
    'node',
    [
      resolvePackagePath('@openapitools/openapi-generator-cli', 'main.js'),
      'generate',
      '-i',
      resolvedOpenapiPath,
      '-o',
      resolvedOutputDirectory,
      '-g',
      'typescript',
      '-c',
      resolvePackagePath(
        '@backstage/repo-tools',
        'templates/typescript-backstage-client.yaml',
      ),
      '--generator-key',
      generatorKey,
      additionalProperties
        ? `--additional-properties=${additionalProperties}`
        : '',
    ],
    {
      signal: abortSignal?.signal,
      maxBuffer: Number.MAX_VALUE,
      cwd: resolvePackagePath('@backstage/repo-tools'),
      env: {
        ...process.env,
      },
    },
  );

  const parentDirectory = resolve(resolvedOutputDirectory, '..');

  await fs.writeFile(
    resolve(parentDirectory, 'index.ts'),
    `//
    export * from './generated';`,
  );

  await exec(`yarn backstage-cli package lint --fix ${parentDirectory}`, [], {
    signal: abortSignal?.signal,
  });

  const prettier = targetPaths.resolveWorkspaceRoot(
    'node_modules/.bin/prettier',
  );
  if (await fs.pathExists(prettier)) {
    await exec(`${prettier} --write ${parentDirectory}`, [], {
      signal: abortSignal?.signal,
    });
  }

  // Deduplicate imports in generated files
  const generatedFiles = await fs.readdir(resolvedOutputDirectory);
  for (const file of generatedFiles) {
    if (file.endsWith('.ts')) {
      deduplicateImports(resolve(resolvedOutputDirectory, file));
    }
  }

  fs.removeSync(resolve(resolvedOutputDirectory, '.openapi-generator-ignore'));
  fs.removeSync(resolve(resolvedOutputDirectory, '.gitattributes'));

  fs.rmSync(resolve(resolvedOutputDirectory, 'docs'), {
    recursive: true,
    force: true,
  });
  fs.rmSync(resolve(resolvedOutputDirectory, '.openapi-generator'), {
    recursive: true,
    force: true,
  });
}

export async function command(
  outputPackage: string,
  clientAdditionalProperties?: string,
  {
    abortSignal,
    isWatch = false,
  }: { abortSignal?: AbortController; isWatch?: boolean } = {},
): Promise<void> {
  try {
    await generate(outputPackage, clientAdditionalProperties, abortSignal);
    console.log(
      chalk.green(`Generated client in ${outputPackage}/${OUTPUT_PATH}`),
    );
  } catch (err) {
    if (err.name === 'AbortError') {
      console.debug('Server generation aborted.');
      return;
    }
    if (isWatch) {
      console.log(chalk.red(`Client generation failed:`));
      console.group();
      console.log(chalk.red(err.message));
      console.groupEnd();
    } else {
      console.log(chalk.red(`Client generation failed.`));
      console.log(chalk.red(err.message));
    }
  }
}
