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
import {
  ConfigVisibility,
  DEFAULT_CONFIG_VISIBILITY,
  TransformFunc,
} from './types';

/**
 * This filters data by visibility by discovering the visibility of each
 * value, and then only keeping the ones that are specified in `includeVisibilities`.
 */
export function filterByVisibility(
  data: JsonObject,
  includeVisibilities: ConfigVisibility[],
  visibilityByPath: Map<string, ConfigVisibility>,
  transformFunc?: TransformFunc<number | string | boolean>,
): JsonObject {
  function transform(jsonVal: JsonValue, path: string): JsonValue | undefined {
    const visibility = visibilityByPath.get(path) ?? DEFAULT_CONFIG_VISIBILITY;
    const isVisible = includeVisibilities.includes(visibility);

    if (typeof jsonVal !== 'object') {
      if (isVisible) {
        if (transformFunc) {
          return transformFunc(jsonVal, { visibility });
        }
        return jsonVal;
      }
      return undefined;
    } else if (jsonVal === null) {
      return undefined;
    } else if (Array.isArray(jsonVal)) {
      const arr = new Array<JsonValue>();

      for (const [index, value] of jsonVal.entries()) {
        const out = transform(value, `${path}/${index}`);
        if (out !== undefined) {
          arr.push(out);
        }
      }

      if (arr.length > 0 || isVisible) {
        return arr;
      }
      return undefined;
    }

    const outObj: JsonObject = {};
    let hasOutput = false;

    for (const [key, value] of Object.entries(jsonVal)) {
      if (value === undefined) {
        continue;
      }
      const out = transform(value, `${path}/${key}`);
      if (out !== undefined) {
        outObj[key] = out;
        hasOutput = true;
      }
    }

    if (hasOutput || isVisible) {
      return outObj;
    }
    return undefined;
  }

  return (transform(data, '') as JsonObject) ?? {};
}
