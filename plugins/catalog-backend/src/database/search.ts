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

import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import type { DbEntitiesSearchRow } from './types';

// These are excluded in the generic loop, either because they do not make sense
// to index, or because they are special-case always inserted whether they are
// null or not
const SPECIAL_KEYS = [
  'metadata.name',
  'metadata.namespace',
  'metadata.uid',
  'metadata.etag',
  'metadata.generation',
];

// The maximum length allowed for search values. These columns are indexed, and
// database engines do not like to index on massive values. For example,
// postgres will balk after 8191 byte line sizes.
const MAX_KEY_LENGTH = 200;
const MAX_VALUE_LENGTH = 200;

type Kv = {
  key: string;
  value: unknown;
};

// Helper for traversing through a nested structure and outputting a list of
// path->value entries of the leaves.
//
// For example, this yaml structure
//
// a: 1
// b:
//   c: null
//   e: [f, g]
// h:
//  - i: 1
//    j: k
//  - i: 2
//    j: l
//
// will result in
//
// "a", 1
// "b.c", null
// "b.e": "f"
// "b.e.f": true
// "b.e": "g"
// "b.e.g": true
// "h.i": 1
// "h.j": "k"
// "h.i": 2
// "h.j": "l"
export function traverse(root: unknown): Kv[] {
  const output: Kv[] = [];

  function visit(path: string, current: unknown) {
    if (SPECIAL_KEYS.includes(path)) {
      return;
    }

    // empty or scalar
    if (
      current === undefined ||
      current === null ||
      ['string', 'number', 'boolean'].includes(typeof current)
    ) {
      output.push({ key: path, value: current });
      return;
    }

    // unknown
    if (typeof current !== 'object') {
      return;
    }

    // array
    if (Array.isArray(current)) {
      for (const item of current) {
        // NOTE(freben): The reason that these are output in two different ways,
        // is to support use cases where you want to express that MORE than one
        // tag is present in a list. Since the EntityFilters structure is a
        // record, you can't have several entries of the same key. Therefore
        // you will have to match on
        //
        // { "a.b": ["true"], "a.c": ["true"] }
        //
        // rather than
        //
        // { "a": ["b", "c"] }
        //
        // because the latter means EITHER b or c has to be present.
        visit(path, item);
        if (typeof item === 'string') {
          output.push({ key: `${path}.${item}`, value: true });
        }
      }
      return;
    }

    // object
    for (const [key, value] of Object.entries(current!)) {
      visit(path ? `${path}.${key}` : key, value);
    }
  }

  visit('', root);

  return output;
}

// Translates a number of raw data rows to search table rows
export function mapToRows(
  input: Kv[],
  entityId: string,
): DbEntitiesSearchRow[] {
  const result: DbEntitiesSearchRow[] = [];

  for (const { key: rawKey, value: rawValue } of input) {
    const key = rawKey.toLowerCase();
    if (rawValue === undefined || rawValue === null) {
      result.push({ entity_id: entityId, key, value: null });
    } else {
      const value = String(rawValue).toLowerCase();
      if (key.length <= MAX_KEY_LENGTH && value.length <= MAX_VALUE_LENGTH) {
        result.push({ entity_id: entityId, key, value });
      }
    }
  }

  return result;
}

/**
 * Generates all of the search rows that are relevant for this entity.
 *
 * @param entityId The uid of the entity
 * @param entity The entity
 * @returns A list of entity search rows
 */
export function buildEntitySearch(
  entityId: string,
  entity: Entity,
): DbEntitiesSearchRow[] {
  // Visit the entire structure recursively
  const raw = traverse(entity);

  // Start with some special keys that are always present because you want to
  // be able to easily search for null specifically
  raw.push({ key: 'metadata.name', value: entity.metadata.name });
  raw.push({ key: 'metadata.namespace', value: entity.metadata.namespace });
  raw.push({ key: 'metadata.uid', value: entity.metadata.uid });

  // Namespace not specified has the default value "default", so we want to
  // match on that as well
  if (!entity.metadata.namespace) {
    raw.push({ key: 'metadata.namespace', value: ENTITY_DEFAULT_NAMESPACE });
  }

  return mapToRows(raw, entityId);
}
