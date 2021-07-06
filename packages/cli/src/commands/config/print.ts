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

import { Command } from 'commander';
import { stringify as stringifyYaml } from 'yaml';
import { AppConfig, ConfigReader } from '@backstage/config';
import { loadCliConfig } from '../../lib/config';
import { ConfigSchema, ConfigVisibility } from '@backstage/config-loader';

export default async (cmd: Command) => {
  const { schema, appConfigs } = await loadCliConfig({
    args: cmd.config,
    fromPackage: cmd.package,
    mockEnv: cmd.lax,
  });
  const visibility = getVisibilityOption(cmd);
  const data = serializeConfigData(appConfigs, schema, visibility);

  if (cmd.format === 'json') {
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
  } else {
    process.stdout.write(`${stringifyYaml(data)}\n`);
  }
};

function getVisibilityOption(cmd: Command): ConfigVisibility {
  if (cmd.frontend && cmd.withSecrets) {
    throw new Error('Not allowed to combine frontend and secret config');
  }
  if (cmd.frontend) {
    return 'frontend';
  } else if (cmd.withSecrets) {
    return 'secret';
  }
  return 'backend';
}

function serializeConfigData(
  appConfigs: AppConfig[],
  schema: ConfigSchema,
  visibility: ConfigVisibility,
) {
  if (visibility === 'frontend') {
    const frontendConfigs = schema.process(appConfigs, {
      visibility: ['frontend'],
    });
    return ConfigReader.fromConfigs(frontendConfigs).get();
  } else if (visibility === 'secret') {
    return ConfigReader.fromConfigs(appConfigs).get();
  }

  const sanitizedConfigs = schema.process(appConfigs, {
    valueTransform: (value, context) =>
      context.visibility === 'secret' ? '<secret>' : value,
  });

  return ConfigReader.fromConfigs(sanitizedConfigs).get();
}
