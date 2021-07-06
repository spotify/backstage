/*
 * Copyright 2021 The Backstage Authors
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

import Ajv, { Schema, ValidateFunction } from 'ajv';
import entitySchema from '../schema/Entity.schema.json';
import entityEnvelopeSchema from '../schema/EntityEnvelope.schema.json';
import entityMetaSchema from '../schema/EntityMeta.schema.json';
import commonSchema from '../schema/shared/common.schema.json';

// A local cache of compiled schemas, to avoid duplicate work.
// The keys are JSON stringified versions of the schema
const compiledSchemaCache = new Map<string, ValidateFunction<unknown>>();

// The core schemas that others can depend on
const refDependencyCandidates = [
  entityEnvelopeSchema,
  entitySchema,
  entityMetaSchema,
  commonSchema,
];

export function throwAjvError(
  errors: ValidateFunction<unknown>['errors'],
): never {
  if (!errors?.length) {
    throw new TypeError('Unknown error');
  }

  const error = errors[0];
  throw new TypeError(
    `${error.dataPath || '<root>'} ${error.message}${
      error.params
        ? ` - ${Object.entries(error.params)
            .map(([key, val]) => `${key}: ${val}`)
            .join(', ')}`
        : ''
    }`,
  );
}

// Compiles the given schema, and makes sure to also grab any core dependencies
// that it depends on
export function compileAjvSchema(
  schema: Schema,
  options: { disableCache?: boolean } = {},
): ValidateFunction<unknown> {
  const disableCache = options?.disableCache ?? false;
  const cacheKey = disableCache ? '' : JSON.stringify(schema);

  if (!disableCache) {
    const cached = compiledSchemaCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const extraSchemas = getExtraSchemas(schema);
  const ajv = new Ajv({
    allowUnionTypes: true,
    allErrors: true,
    validateSchema: true,
  });
  if (extraSchemas.length) {
    ajv.addSchema(extraSchemas, undefined, undefined, true);
  }
  const compiled = ajv.compile(schema);

  if (!disableCache) {
    compiledSchemaCache.set(cacheKey, compiled);
  }

  return compiled;
}

// Find refs in the given schema and recursively in all known schemas it
// targets, collecting that list of schemas as we go
function getExtraSchemas(schema: Schema): Schema[] {
  if (typeof schema !== 'object') {
    return [];
  }

  const seen = new Set<string>();
  if (schema.$id) {
    seen.add(schema.$id);
  }

  const selected = new Array<Schema>();

  const todo: Schema[] = [schema];
  while (todo.length) {
    const current = todo.pop()!;

    for (const ref of getAllRefs(current)) {
      if (!seen.has(ref)) {
        seen.add(ref);

        const match = refDependencyCandidates.find(c => c.$id === ref);
        if (match) {
          selected.push(match);
          todo.push(match);
        }
      }
    }
  }

  return selected;
}

// Naively step through the entire schema looking for "$ref": "x" pairs. The
// resulting iterator may contain duplicates. Ignores fragments, i.e. for a ref
// of "a#b", it will just yield "a".
function* getAllRefs(schema: Schema): Iterable<string> {
  const todo: any[] = [schema];
  while (todo.length) {
    const current = todo.pop()!;
    if (typeof current === 'object' && current) {
      for (const [key, value] of Object.entries(current)) {
        if (key === '$ref' && typeof value === 'string') {
          yield value.split('#')[0];
        } else {
          todo.push(value);
        }
      }
    }
  }
}
