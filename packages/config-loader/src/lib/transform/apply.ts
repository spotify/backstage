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

import { JsonObject, JsonValue } from '@backstage/config';
import { TransformFunc } from './types';
import { isObject } from './utils';

/**
 * Applies a set of transforms to raw configuration data.
 */
export async function applyConfigTransforms(
  initialDir: string,
  input: JsonValue,
  transforms: TransformFunc[],
): Promise<JsonObject> {
  async function transform(
    inputObj: JsonValue,
    path: string,
    baseDir: string,
  ): Promise<JsonValue | undefined> {
    let obj = inputObj;
    let dir = baseDir;

    for (const tf of transforms) {
      try {
        const result = await tf(inputObj, baseDir);
        if (result.applied) {
          if (result.value === undefined) {
            return undefined;
          }
          obj = result.value;
          dir = result.newBaseDir ?? dir;
          break;
        }
      } catch (error) {
        throw new Error(`error at ${path}, ${error.message}`);
      }
    }

    if (typeof obj !== 'object') {
      return obj;
    } else if (obj === null) {
      return undefined;
    } else if (Array.isArray(obj)) {
      const arr = new Array<JsonValue>();

      for (const [index, value] of obj.entries()) {
        const out = await transform(value, `${path}[${index}]`, dir);
        if (out !== undefined) {
          arr.push(out);
        }
      }

      return arr;
    }

    const out: JsonObject = {};

    for (const [key, value] of Object.entries(obj)) {
      // undefined covers optional fields
      if (value !== undefined) {
        const result = await transform(value, `${path}.${key}`, dir);
        if (result !== undefined) {
          out[key] = result;
        }
      }
    }

    return out;
  }

  const finalData = await transform(input, '', initialDir);
  if (!isObject(finalData)) {
    throw new TypeError('expected object at config root');
  }
  return finalData;
}
