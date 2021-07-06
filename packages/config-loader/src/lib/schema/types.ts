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

import { AppConfig, JsonObject } from '@backstage/config';

/**
 * An sub-set of configuration schema.
 */
export type ConfigSchemaPackageEntry = {
  /**
   * The configuration schema itself.
   */
  value: JsonObject;
  /**
   * The relative path that the configuration schema was discovered at.
   */
  path: string;
};

/**
 * A list of all possible configuration value visibilities.
 */
export const CONFIG_VISIBILITIES = ['frontend', 'backend', 'secret'] as const;

/**
 * A type representing the possible configuration value visibilities
 */
export type ConfigVisibility = typeof CONFIG_VISIBILITIES[number];

/**
 * The default configuration visibility if no other values is given.
 */
export const DEFAULT_CONFIG_VISIBILITY: ConfigVisibility = 'backend';

/**
 * An explanation of a configuration validation error.
 */
type ValidationError = string;

/**
 * The result of validating configuration data using a schema.
 */
type ValidationResult = {
  /**
   * Errors that where emitted during validation, if any.
   */
  errors?: ValidationError[];
  /**
   * The configuration visibilities that were discovered during validation.
   *
   * The path in the key uses the form `/<key>/<sub-key>/<array-index>/<leaf-key>`
   */
  visibilityByPath: Map<string, ConfigVisibility>;
};

/**
 * A function used validate configuration data.
 */
export type ValidationFunc = (configs: AppConfig[]) => ValidationResult;

/**
 * A function used to transform primitive configuration values.
 */
export type TransformFunc<T extends number | string | boolean> = (
  value: T,
  context: { visibility: ConfigVisibility },
) => T | undefined;

/**
 * Options used to process configuration data with a schema.
 */
type ConfigProcessingOptions = {
  /**
   * The visibilities that should be included in the output data.
   * If omitted, the data will not be filtered by visibility.
   */
  visibility?: ConfigVisibility[];

  /**
   * A transform function that can be used to transform primitive configuration values
   * during validation. The value returned from the transform function will be used
   * instead of the original value. If the transform returns `undefined`, the value
   * will be omitted.
   */
  valueTransform?: TransformFunc<any>;
};

/**
 * A loaded configuration schema that is ready to process configuration data.
 */
export type ConfigSchema = {
  process(
    appConfigs: AppConfig[],
    options?: ConfigProcessingOptions,
  ): AppConfig[];

  serialize(): JsonObject;
};
