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
import { isEqual } from 'lodash';
import { join } from 'node:path';
import chalk from 'chalk';
import { relative as relativePath, resolve as resolvePath } from 'node:path';
import { targetPaths } from '@backstage/cli-common';
import { runner } from '../../../../lib/runner';
import {
  OLD_SCHEMA_PATH,
  TS_SCHEMA_PATH,
  YAML_SCHEMA_PATH,
} from '../../../../lib/openapi/constants';
import {
  getPathToOpenApiSpec,
  loadAndValidateOpenApiYaml,
} from '../../../../lib/openapi/helpers';

async function validate(directoryPath: string) {
  let openapiPath = '';
  try {
    openapiPath = await getPathToOpenApiSpec(directoryPath);
  } catch {
    // Unable to find spec at path.
    return;
  }
  const yaml = await loadAndValidateOpenApiYaml(openapiPath);

  let schemaPath = join(directoryPath, TS_SCHEMA_PATH);
  if (
    !(await fs.pathExists(schemaPath)) &&
    !(await fs.pathExists(join(directoryPath, OLD_SCHEMA_PATH)))
  ) {
    throw new Error(`No \`${TS_SCHEMA_PATH}\` file found.`);
  } else if (await fs.pathExists(join(directoryPath, OLD_SCHEMA_PATH))) {
    console.warn(
      `\`${OLD_SCHEMA_PATH}\` is deprecated. Please re-run \`yarn backstage-repo-tools package schema openapi generate\` to update it.`,
    );
    schemaPath = join(directoryPath, OLD_SCHEMA_PATH);
  }

  const { default: schema } = await import(resolvePath(schemaPath));

  if (!schema.spec) {
    throw new Error(`\`${TS_SCHEMA_PATH}\` needs to have a 'spec' export.`);
  }
  if (!isEqual(schema.spec, yaml)) {
    const path = relativePath(targetPaths.workspaceRootDir, directoryPath);
    throw new Error(
      `\`${YAML_SCHEMA_PATH}\` and \`${TS_SCHEMA_PATH}\` do not match. Please run \`yarn backstage-repo-tools package schema openapi generate\` from '${path}' to regenerate \`${TS_SCHEMA_PATH}\`.`,
    );
  }
}

export async function bulkCommand(paths: string[] = []): Promise<void> {
  const resultsList = await runner(paths, dir => validate(dir));

  let failed = false;
  for (const { relativeDir, resultText } of resultsList) {
    if (resultText) {
      console.log();
      console.log(chalk.red(`OpenAPI validation failed in ${relativeDir}:`));
      console.log(resultText.trimStart());

      failed = true;
    }
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log(chalk.green('Validated all files.'));
  }
}
