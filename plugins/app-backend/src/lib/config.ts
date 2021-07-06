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
import { Logger } from 'winston';
import { AppConfig, Config, JsonObject } from '@backstage/config';
import { loadConfigSchema, readEnvConfig } from '@backstage/config-loader';

type InjectOptions = {
  appConfigs: AppConfig[];
  // Directory of the static JS files to search for file to inject
  staticDir: string;
  logger: Logger;
};

/**
 * Injects configs into the app bundle, replacing any existing injected config.
 */
export async function injectConfig(options: InjectOptions) {
  const { staticDir, logger, appConfigs } = options;

  const files = await fs.readdir(staticDir);
  const jsFiles = files.filter(file => file.endsWith('.js'));

  const escapedData = JSON.stringify(appConfigs).replace(/("|'|\\)/g, '\\$1');
  const injected = `/*__APP_INJECTED_CONFIG_MARKER__*/"${escapedData}"/*__INJECTED_END__*/`;

  for (const jsFile of jsFiles) {
    const path = resolvePath(staticDir, jsFile);

    const content = await fs.readFile(path, 'utf8');
    if (content.includes('__APP_INJECTED_RUNTIME_CONFIG__')) {
      logger.info(`Injecting env config into ${jsFile}`);

      const newContent = content.replace(
        '"__APP_INJECTED_RUNTIME_CONFIG__"',
        injected,
      );
      await fs.writeFile(path, newContent, 'utf8');
      return;
    } else if (content.includes('__APP_INJECTED_CONFIG_MARKER__')) {
      logger.info(`Replacing injected env config in ${jsFile}`);

      const newContent = content.replace(
        /\/\*__APP_INJECTED_CONFIG_MARKER__\*\/.*\/\*__INJECTED_END__\*\//,
        injected,
      );
      await fs.writeFile(path, newContent, 'utf8');
      return;
    }
  }
  logger.info('Env config not injected');
}

type ReadOptions = {
  env: { [name: string]: string | undefined };
  appDistDir: string;
  config: Config;
};

/**
 * Read config from environment and process the backend config using the
 * schema that is embedded in the frontend build.
 */
export async function readConfigs(options: ReadOptions): Promise<AppConfig[]> {
  const { env, appDistDir, config } = options;

  const appConfigs = readEnvConfig(env);

  const schemaPath = resolvePath(appDistDir, '.config-schema.json');
  if (await fs.pathExists(schemaPath)) {
    const serializedSchema = await fs.readJson(schemaPath);

    try {
      const schema = await loadConfigSchema({ serialized: serializedSchema });

      const frontendConfigs = await schema.process(
        [{ data: config.get() as JsonObject, context: 'app' }],
        { visibility: ['frontend'] },
      );
      appConfigs.push(...frontendConfigs);
    } catch (error) {
      throw new Error(
        'Invalid app bundle schema. If this error is unexpected you need to run `yarn build` in the app. ' +
          `If that doesn't help you should make sure your config schema is correct and rebuild the app bundle again. ` +
          `Caused by the following schema error, ${error}`,
      );
    }
  }

  return appConfigs;
}
