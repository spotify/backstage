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

import { Entity } from '@backstage/catalog-model';
import { createHash } from 'crypto';
import stableStringify from 'fast-json-stable-stringify';

// The number of items that are sent per batch to the database layer, when
// doing .batchInsert calls to knex. This needs to be low enough to not cause
// errors in the underlying engine due to exceeding query limits, but large
// enough to get the speed benefits.
export const BATCH_SIZE = 50;

export function generateStableHash(entity: Entity) {
  return createHash('sha1')
    .update(stableStringify({ ...entity }))
    .digest('hex');
}
