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

export {
  EDIT_URL_ANNOTATION,
  ENTITY_DEFAULT_NAMESPACE,
  ENTITY_META_GENERATED_FIELDS,
  VIEW_URL_ANNOTATION,
} from './constants';
export type {
  Entity,
  EntityLink,
  EntityMeta,
  EntityRelation,
  EntityRelationSpec,
} from './Entity';
export type { EntityEnvelope } from './EntityEnvelope';
export type {
  UNSTABLE_EntityStatus,
  UNSTABLE_EntityStatusItem,
  UNSTABLE_EntityStatusLevel,
} from './EntityStatus';
export * from './policies';
export {
  compareEntityToRef,
  getEntityName,
  parseEntityName,
  parseEntityRef,
  serializeEntityRef,
  stringifyEntityRef,
} from './ref';
export {
  entityHasChanges,
  generateEntityEtag,
  generateEntityUid,
  generateUpdatedEntity,
} from './util';
