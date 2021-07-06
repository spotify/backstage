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

import { Schema } from 'ajv';
import { Entity } from '../entity';
import { compileAjvSchema, throwAjvError } from './ajv';

/**
 * Creates a validation function that takes some arbitrary data, and either
 * returns that data cast to a `T` if it matches that schema, or `false` if the
 * schema apiVersion/kind didn't apply to that data, or throws a
 * {@link TypeError} describing actual errors.
 *
 * This validator is highly specialized, in that it has special treatment of
 * the `kind` and `apiVersion` root keys. This only works if your schema has
 * their rule set to `"enum"`:
 *
 * <pre>
 *   "apiVersion": {
 *      "enum": ["backstage.io/v1alpha1", "backstage.io/v1beta1"]
 *   },
 *   "kind": {
 *     "enum": ["Group"]
 *   },
 * </pre>
 *
 * In the above example, the created validator will return `false` if and only
 * if the kind and/or apiVersion mismatch.
 *
 * Note that this validator is only meant for applying the base schema checks;
 * it does not take custom policies or additional processor based validation
 * into account.
 *
 * The given schema may contain `$ref` references to the following, which are
 * resolved automatically for you:
 *
 * - EntityEnvelope
 * - Entity
 * - EntityMeta
 * - common#<id>
 *
 * @see https://github.com/backstage/backstage/tree/master/packages/catalog-model/src/schema
 */
export function entityKindSchemaValidator<T extends Entity>(
  schema: unknown,
): (data: unknown) => T | false {
  const validate = compileAjvSchema(schema as Schema);

  return data => {
    const result = validate(data);
    if (result === true) {
      return data as T;
    }

    // Only in the case where kind and/or apiVersion have enum mismatches AND
    // have NO other errors, we call it a soft error.
    const softCandidates = validate.errors?.filter(e =>
      ['/kind', '/apiVersion'].includes(e.dataPath),
    );
    if (
      softCandidates?.length &&
      softCandidates.every(e => e.keyword === 'enum')
    ) {
      return false;
    }

    throw throwAjvError(validate.errors);
  };
}
