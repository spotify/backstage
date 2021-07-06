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
import { Entity } from '../entity/Entity';
import entitySchema from '../schema/Entity.schema.json';
import { compileAjvSchema, throwAjvError } from './ajv';

/**
 * Creates a validation function that takes some arbitrary data, and either
 * returns that data cast to an {@link Entity} (or the given subtype) if it
 * matches that schema, or throws a {@link TypeError} describing the errors.
 *
 * Note that this validator is only meant for applying the base schema checks;
 * it does not take custom policies or additional processor based validation
 * into account.
 *
 * By default, the plain `Entity` schema is used. If you pass in your own, it
 * may contain `$ref` references to the following, which are resolved
 * automatically for you:
 *
 * - EntityEnvelope
 * - Entity
 * - EntityMeta
 * - common#<id>
 *
 * @see https://github.com/backstage/backstage/tree/master/packages/catalog-model/src/schema
 */
export function entitySchemaValidator<T extends Entity = Entity>(
  schema?: unknown,
): (data: unknown) => T {
  const validate = compileAjvSchema(schema ? (schema as Schema) : entitySchema);

  return data => {
    const result = validate(data);
    if (result === true) {
      return data as T;
    }

    throw throwAjvError(validate.errors);
  };
}
