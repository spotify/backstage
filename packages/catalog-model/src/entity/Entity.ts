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

import { JsonObject } from '@backstage/config';
import { EntityName } from '../types';
import { UNSTABLE_EntityStatus } from './EntityStatus';

/**
 * The parts of the format that's common to all versions/kinds of entity.
 *
 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/
 */
export type Entity = {
  /**
   * The version of specification format for this particular entity that
   * this is written against.
   */
  apiVersion: string;

  /**
   * The high level entity type being described.
   */
  kind: string;

  /**
   * Metadata related to the entity.
   */
  metadata: EntityMeta;

  /**
   * The specification data describing the entity itself.
   */
  spec?: JsonObject;

  /**
   * The relations that this entity has with other entities.
   */
  relations?: EntityRelation[];

  /**
   * The current status of the entity, as claimed by various sources.
   *
   * The keys are implementation defined and the values can be any JSON object
   * with semantics that match that implementation.
   */
  status?: UNSTABLE_EntityStatus;
};

/**
 * Metadata fields common to all versions/kinds of entity.
 *
 * @see https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#objectmeta-v1-meta
 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/
 */
export type EntityMeta = JsonObject & {
  /**
   * A globally unique ID for the entity.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, but the server is free to reject requests
   * that do so in such a way that it breaks semantics.
   */
  uid?: string;

  /**
   * An opaque string that changes for each update operation to any part of
   * the entity, including metadata.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, and the server will then reject the
   * operation if it does not match the current stored value.
   */
  etag?: string;

  /**
   * A positive nonzero number that indicates the current generation of data
   * for this entity; the value is incremented each time the spec changes.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations.
   */
  generation?: number;

  /**
   * The name of the entity.
   *
   * Must be unique within the catalog at any given point in time, for any
   * given namespace + kind pair.
   */
  name: string;

  /**
   * The namespace that the entity belongs to.
   */
  namespace?: string;

  /**
   * A short (typically relatively few words, on one line) description of the
   * entity.
   */
  description?: string;

  /**
   * Key/value pairs of identifying information attached to the entity.
   */
  labels?: Record<string, string>;

  /**
   * Key/value pairs of non-identifying auxiliary information attached to the
   * entity.
   */
  annotations?: Record<string, string>;

  /**
   * A list of single-valued strings, to for example classify catalog entities in
   * various ways.
   */
  tags?: string[];

  /**
   * A list of external hyperlinks related to the entity.
   */
  links?: EntityLink[];
};

/**
 * A relation of a specific type to another entity in the catalog.
 */
export type EntityRelation = {
  /**
   * The type of the relation.
   */
  type: string;

  /**
   * The target entity of this relation.
   */
  target: EntityName;
};

/**
 * Holds the relation data for entities.
 */
export type EntityRelationSpec = {
  /**
   * The source entity of this relation.
   */
  source: EntityName;

  /**
   * The type of the relation.
   */
  type: string;

  /**
   * The target entity of this relation.
   */
  target: EntityName;
};

/**
 * A link to external information that is related to the entity.
 */
export type EntityLink = {
  /**
   * The url to the external site, document, etc.
   */
  url: string;

  /**
   * An optional descriptive title for the link.
   */
  title?: string;

  /**
   * An optional semantic key that represents a visual icon.
   */
  icon?: string;
};
