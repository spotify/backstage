/*
 * Copyright 2020 Spotify AB
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

import type { Entity } from '../entity/Entity';
import schema from '../schema/kinds/API.v1alpha1.schema.json';
import entitySchema from '../schema/Entity.schema.json';
import entityMetaSchema from '../schema/EntityMeta.schema.json';
import commonSchema from '../schema/shared/common.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';

const API_VERSION = ['backstage.io/v1alpha1', 'backstage.io/v1beta1'] as const;
const KIND = 'API' as const;

export interface ApiEntityV1alpha1 extends Entity {
  apiVersion: typeof API_VERSION[number];
  kind: typeof KIND;
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    // TODO: We need to adjust tests and documentation for this change.
    // TODO: Think about a migration strategy!
    definition?: string;
    definitionLocation: string;
    system?: string;
  };
}

export const apiEntityV1alpha1Validator = ajvCompiledJsonSchemaValidator(
  KIND,
  API_VERSION,
  schema,
  [commonSchema, entityMetaSchema, entitySchema],
);
