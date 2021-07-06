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

import yaml from 'yaml';
import { extname, dirname, resolve as resolvePath } from 'path';
import { JsonObject, JsonValue } from '@backstage/config';
import { isObject } from './utils';
import { TransformFunc, EnvFunc, ReadFileFunc } from './types';

// Parsers for each type of included file
const includeFileParser: {
  [ext in string]: (content: string) => Promise<JsonObject>;
} = {
  '.json': async content => JSON.parse(content),
  '.yaml': async content => yaml.parse(content),
  '.yml': async content => yaml.parse(content),
};

/**
 * Transforms a include description into the actual included value.
 */
export function createIncludeTransform(
  env: EnvFunc,
  readFile: ReadFileFunc,
  substitute: TransformFunc,
): TransformFunc {
  return async (input: JsonValue, baseDir: string) => {
    if (!isObject(input)) {
      return { applied: false };
    }
    // Check if there's any key that starts with a '$', in that case we treat
    // this entire object as an include description.
    const [includeKey] = Object.keys(input).filter(key => key.startsWith('$'));
    if (includeKey) {
      if (Object.keys(input).length !== 1) {
        throw new Error(
          `include key ${includeKey} should not have adjacent keys`,
        );
      }
    } else {
      return { applied: false };
    }

    const rawIncludedValue = input[includeKey];
    if (typeof rawIncludedValue !== 'string') {
      throw new Error(`${includeKey} include value is not a string`);
    }

    const substituteResults = await substitute(rawIncludedValue, baseDir);
    const includeValue = substituteResults.applied
      ? substituteResults.value
      : rawIncludedValue;

    // The second string check is needed for Typescript to know this is a string.
    if (includeValue === undefined || typeof includeValue !== 'string') {
      throw new Error(`${includeKey} substitution value was undefined`);
    }

    switch (includeKey) {
      case '$file':
        try {
          const value = await readFile(resolvePath(baseDir, includeValue));
          return { applied: true, value };
        } catch (error) {
          throw new Error(`failed to read file ${includeValue}, ${error}`);
        }
      case '$env':
        try {
          return { applied: true, value: await env(includeValue) };
        } catch (error) {
          throw new Error(`failed to read env ${includeValue}, ${error}`);
        }

      case '$include': {
        const [filePath, dataPath] = includeValue.split(/#(.*)/);

        const ext = extname(filePath);
        const parser = includeFileParser[ext];
        if (!parser) {
          throw new Error(
            `no configuration parser available for included file ${filePath}`,
          );
        }

        const path = resolvePath(baseDir, filePath);
        const content = await readFile(path);
        const newBaseDir = dirname(path);

        const parts = dataPath ? dataPath.split('.') : [];

        let value: JsonValue | undefined;
        try {
          value = await parser(content);
        } catch (error) {
          throw new Error(
            `failed to parse included file ${filePath}, ${error}`,
          );
        }

        // This bit handles selecting a subtree in the included file, if a path was provided after a #
        for (const [index, part] of parts.entries()) {
          if (!isObject(value)) {
            const errPath = parts.slice(0, index).join('.');
            throw new Error(
              `value at '${errPath}' in included file ${filePath} is not an object`,
            );
          }
          value = value[part];
        }

        return {
          applied: true,
          value,
          newBaseDir: newBaseDir !== baseDir ? newBaseDir : undefined,
        };
      }

      default:
        throw new Error(`unknown include ${includeKey}`);
    }
  };
}
