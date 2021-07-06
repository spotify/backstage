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
import yaml from 'yaml';
import { resolve as resolvePath, dirname, isAbsolute, basename } from 'path';
import { AppConfig } from '@backstage/config';
import {
  applyConfigTransforms,
  readEnvConfig,
  createIncludeTransform,
  createSubstitutionTransform,
} from './lib';
import { EnvFunc } from './lib/transform/types';

export type LoadConfigOptions = {
  // The root directory of the config loading context. Used to find default configs.
  configRoot: string;

  // Absolute paths to load config files from. Configs from earlier paths have lower priority.
  configPaths: string[];

  /** @deprecated This option has been removed */
  env?: string;

  /**
   * Custom environment variable loading function
   *
   * @experimental This API is not stable and may change at any point
   */
  experimentalEnvFunc?: EnvFunc;
};

export async function loadConfig(
  options: LoadConfigOptions,
): Promise<AppConfig[]> {
  const configs = [];
  const { configRoot, experimentalEnvFunc: envFunc } = options;
  const configPaths = options.configPaths.slice();

  // If no paths are provided, we default to reading
  // `app-config.yaml` and, if it exists, `app-config.local.yaml`
  if (configPaths.length === 0) {
    configPaths.push(resolvePath(configRoot, 'app-config.yaml'));

    const localConfig = resolvePath(configRoot, 'app-config.local.yaml');
    if (await fs.pathExists(localConfig)) {
      configPaths.push(localConfig);
    }
  }

  const env = envFunc ?? (async (name: string) => process.env[name]);

  try {
    for (const configPath of configPaths) {
      if (!isAbsolute(configPath)) {
        throw new Error(`Config load path is not absolute: '${configPath}'`);
      }

      const dir = dirname(configPath);
      const readFile = (path: string) =>
        fs.readFile(resolvePath(dir, path), 'utf8');

      const input = yaml.parse(await readFile(configPath));
      const substitutionTransform = createSubstitutionTransform(env);
      const data = await applyConfigTransforms(dir, input, [
        createIncludeTransform(env, readFile, substitutionTransform),
        substitutionTransform,
      ]);

      configs.push({ data, context: basename(configPath) });
    }
  } catch (error) {
    throw new Error(
      `Failed to read static configuration file, ${error.message}`,
    );
  }

  configs.push(...readEnvConfig(process.env));

  return configs;
}
