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

import type { Entity } from '../entity/Entity';
import schema from '../schema/kinds/Group.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';

export interface GroupEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'Group';
  spec: {
    type: string;
    profile?: {
      displayName?: string;
      email?: string;
      picture?: string;
    };
    parent?: string;
    children: string[];
    members?: string[];
  };
}

export const groupEntityV1alpha1Validator = ajvCompiledJsonSchemaValidator(
  schema,
);
