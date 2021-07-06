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

import { JsonValue } from '@backstage/config';
import { TransformFunc, EnvFunc } from './types';

/**
 * A environment variable substitution transform that transforms e.g. 'token ${MY_TOKEN}'
 * to 'token abc' if MY_TOKEN is 'abc'. If any of the substituted variables are undefined,
 * the entire expression ends up undefined.
 */
export function createSubstitutionTransform(env: EnvFunc): TransformFunc {
  return async (input: JsonValue) => {
    if (typeof input !== 'string') {
      return { applied: false };
    }

    const parts: (string | undefined)[] = input.split(/(\$?\$\{[^{}]*\})/);
    for (let i = 1; i < parts.length; i += 2) {
      const part = parts[i]!;
      if (part.startsWith('$$')) {
        parts[i] = part.slice(1);
      } else {
        parts[i] = await env(part.slice(2, -1).trim());
      }
    }

    if (parts.some(part => part === undefined)) {
      return { applied: true, value: undefined };
    }
    return { applied: true, value: parts.join('') };
  };
}
