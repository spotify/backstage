/*
 * Copyright 2024 The Backstage Authors
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

import { ScannedPluginPackage } from '../scanner/types';
import {
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { targetPaths } from '@backstage/cli-common';

import fs from 'fs-extra';
import * as path from 'node:path';
import * as url from 'node:url';
import { isEmpty } from 'lodash';
import { LoggerService } from '@backstage/backend-plugin-api';
import { JsonObject } from '@backstage/types';
import { PluginScanner } from '../scanner/plugin-scanner';
import {
  ConfigSchema,
  loadConfigSchema,
  mergeConfigSchemas,
} from '@backstage/config-loader';
import { dynamicPluginsFeatureLoader } from '../features';

/**
 *
 * @public
 * */
export interface DynamicPluginsSchemasService {
  addDynamicPluginsSchemas(configSchema: ConfigSchema): Promise<{
    schema: ConfigSchema;
  }>;
}

/**
 * A service that provides the config schemas of scanned dynamic plugins.
 *
 * @public
 */
export const dynamicPluginsSchemasServiceRef =
  createServiceRef<DynamicPluginsSchemasService>({
    id: 'core.dynamicplugins.schemas',
    scope: 'root',
  });

/**
 * @public
 */
export interface DynamicPluginsSchemasOptions {
  /**
   * Function that returns the path to the Json schema file for a given scanned plugin package.
   * The path is either absolute, or relative to the plugin package root directory.
   *
   * Default behavior is to look for the `dist/.config-schema.json` relative path.
   *
   * @param pluginPackage - The scanned plugin package.
   * @returns the absolute or plugin-relative path to the Json schema file.
   */
  schemaLocator?: (pluginPackage: ScannedPluginPackage) => string;
}

const dynamicPluginsSchemasServiceFactoryWithOptions = (
  options?: DynamicPluginsSchemasOptions,
) =>
  createServiceFactory({
    service: dynamicPluginsSchemasServiceRef,
    deps: {
      config: coreServices.rootConfig,
    },
    factory({ config }) {
      let additionalSchemas: { [context: string]: JsonObject } | undefined;

      return {
        async addDynamicPluginsSchemas(configSchema: ConfigSchema): Promise<{
          schema: ConfigSchema;
        }> {
          if (!additionalSchemas) {
            const logger = {
              ...console,
              child() {
                return this;
              },
            };

            const scanner = PluginScanner.create({
              config,
              logger,
              // eslint-disable-next-line no-restricted-syntax
              backstageRoot: targetPaths.installationRootDir,
              preferAlpha: true,
            });

            const { packages } = await scanner.scanRoot();

            additionalSchemas = await gatherDynamicPluginsSchemas(
              packages,
              logger,
              options?.schemaLocator,
            );
          }

          const serialized = configSchema.serialize();
          if (serialized?.backstageConfigSchemaVersion !== 1) {
            throw new Error(
              'Serialized configuration schema is invalid or has an invalid version number',
            );
          }
          const schemas = serialized.schemas as {
            value: JsonObject;
            path: string;
          }[];

          schemas.push(
            ...Object.keys(additionalSchemas).map(context => {
              return {
                path: context,
                value: additionalSchemas![context],
              };
            }),
          );
          serialized.schemas = schemas;
          return {
            schema: await loadConfigSchema({
              serialized,
            }),
          };
        },
      };
    },
  });

/**
 * @public
 * @deprecated Use {@link dynamicPluginsFeatureLoader} instead, which gathers all services and features required for dynamic plugins.
 */
export const dynamicPluginsSchemasServiceFactory = Object.assign(
  dynamicPluginsSchemasServiceFactoryWithOptions,
  dynamicPluginsSchemasServiceFactoryWithOptions(),
);

/** @internal */
async function gatherDynamicPluginsSchemas(
  packages: ScannedPluginPackage[],
  logger: LoggerService,
  schemaLocator: (pluginPackage: ScannedPluginPackage) => string = () =>
    path.join('dist', '.config-schema.json'),
): Promise<{ [context: string]: JsonObject }> {
  const allSchemas: { [context: string]: JsonObject } = {};

  for (const pluginPackage of packages) {
    let schemaLocation = schemaLocator(pluginPackage);

    if (!path.isAbsolute(schemaLocation)) {
      const pluginLocation = url.fileURLToPath(pluginPackage.location);
      schemaLocation = path.resolve(pluginLocation, schemaLocation);
    }

    if (!(await fs.pathExists(schemaLocation))) {
      continue;
    }

    let serialized = await fs.readJson(schemaLocation);
    if (!serialized) {
      continue;
    }

    if (isEmpty(serialized)) {
      continue;
    }

    if (serialized?.backstageConfigSchemaVersion === 1) {
      serialized = mergeConfigSchemas(
        (serialized?.schemas as JsonObject[]).map(_ => _.value as any),
      );
    }

    if (!serialized?.$schema || serialized?.type !== 'object') {
      logger.error(
        `Serialized configuration schema is invalid for plugin ${pluginPackage.manifest.name}`,
      );
      continue;
    }

    allSchemas[schemaLocation] = serialized;
  }

  return allSchemas;
}
