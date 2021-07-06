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

import lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Entity } from './Entity';

/**
 * Generates a new random UID for an entity.
 *
 * @returns A string with enough randomness to uniquely identify an entity
 */
export function generateEntityUid(): string {
  return uuidv4();
}

/**
 * Generates a new random Etag for an entity.
 *
 * @returns A string with enough randomness to uniquely identify an entity
 *          revision
 */
export function generateEntityEtag(): string {
  return Buffer.from(uuidv4(), 'utf8').toString('base64').replace(/[^\w]/g, '');
}

/**
 * Checks whether there are any significant changes going from the previous to
 * the next version of this entity.
 *
 * Significance, in this case, means that we do not compare generated fields
 * such as uid, etag and generation.
 *
 * Note that this comparison does NOT take status, relations or similar into
 * account. It only compares the actual input entity data, i.e. metadata and
 * spec.
 *
 * @param previous The old state of the entity
 * @param next The new state of the entity
 */
export function entityHasChanges(previous: Entity, next: Entity): boolean {
  const e1 = lodash.cloneDeep(previous);
  const e2 = lodash.cloneDeep(next);

  if (!e1.metadata.labels) {
    e1.metadata.labels = {};
  }
  if (!e2.metadata.labels) {
    e2.metadata.labels = {};
  }
  if (!e1.metadata.annotations) {
    e1.metadata.annotations = {};
  }
  if (!e2.metadata.annotations) {
    e2.metadata.annotations = {};
  }
  if (!e1.metadata.tags) {
    e1.metadata.tags = [];
  }
  if (!e2.metadata.tags) {
    e2.metadata.tags = [];
  }

  // Remove generated fields
  delete e1.metadata.uid;
  delete e1.metadata.etag;
  delete e1.metadata.generation;
  delete e2.metadata.uid;
  delete e2.metadata.etag;
  delete e2.metadata.generation;

  // Remove things that we explicitly do not compare
  delete e1.relations;
  delete e1.status;
  delete e2.relations;
  delete e2.status;

  return !lodash.isEqual(e1, e2);
}

/**
 * Takes an old revision of an entity and a new desired state, and merges
 * them into a complete new state.
 *
 * The previous revision is expected to be a complete model loaded from the
 * catalog, including the uid, etag and generation fields.
 *
 * @param previous The old state of the entity
 * @param next The new state of the entity
 * @returns An entity with the merged state of both
 */
export function generateUpdatedEntity(previous: Entity, next: Entity): Entity {
  const { uid, etag, generation } = previous.metadata;
  if (!uid || !etag || !generation) {
    throw new Error('Previous entity must have uid, etag and generation');
  }

  const result = lodash.cloneDeep(next);

  // Generated fields are copied and updated
  const bumpEtag = entityHasChanges(previous, result);
  const bumpGeneration = !lodash.isEqual(previous.spec, result.spec);
  result.metadata.uid = uid;
  result.metadata.etag = bumpEtag ? generateEntityEtag() : etag;
  result.metadata.generation = bumpGeneration ? generation + 1 : generation;

  return result;
}
