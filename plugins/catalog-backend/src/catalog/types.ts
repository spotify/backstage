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

import { Entity, EntityRelationSpec, Location } from '@backstage/catalog-model';
import { EntityFilter, EntityPagination } from '../database/types';

//
// Entities
//

export type PageInfo =
  | {
      hasNextPage: false;
    }
  | {
      hasNextPage: true;
      endCursor: string;
    };

export type EntitiesRequest = {
  filter?: EntityFilter;
  fields?: (entity: Entity) => Entity;
  pagination?: EntityPagination;
};

export type EntitiesResponse = {
  entities: Entity[];
  pageInfo: PageInfo;
};

export type EntityUpsertRequest = {
  entity: Entity;
  relations: EntityRelationSpec[];
  attachments: EntityAttachmentUpsertRequest[];
};

export type EntityUpsertResponse = {
  entityId: string;
  entity?: Entity;
};

export type EntityAttachment = {
  /** Key of the entity attachment, has to be unique inside an entity. */
  key: string;
  /**
   * An opaque string that changes for each update operation to the content of
   * the attachment.
   */
  etag: string;
  /** Mime type of the data. */
  contentType: string;
  /**
   * Data that is stored in the attachment. Might be empty, if it matches the
   * requested etag.
   */
  data?: Buffer;
};

export type EntityAttachmentContent = {
  /** Mime type of the data. */
  contentType: string;
  /** Data to be stored in the attachment. */
  data: Buffer;
};

export type EntityAttachmentUpsertRequest = {
  /** Key of the entity attachment, has to be unique inside an entity. */
  key: string;
  /**
   * Optional content of the attachment, including data and content type. If no
   * content is provided, the current content is kept.
   */
  content?: EntityAttachmentContent;
};

export type EntityAttachmentFilter = {
  /** Return data in the attachment only if the provided etag doesn't match. */
  ifNotMatchEtag?: string;
};

export type EntitiesCatalog = {
  /**
   * Fetch entities.
   *
   * @param request Request options
   */
  entities(request?: EntitiesRequest): Promise<EntitiesResponse>;

  /**
   * Get a single entity attachment including the data if not requested
   * otherwise.
   *
   * @param entityUid The unqiue id of the entity.
   * @param key The key of the attachment.
   * @param filter Filter to apply on the requested attachment.
   */
  attachment(
    entityUid: string,
    key: string,
    filter?: EntityAttachmentFilter,
  ): Promise<EntityAttachment | undefined>;

  /**
   * Removes a single entity.
   *
   * @param uid The metadata.uid of the entity
   */
  removeEntityByUid(uid: string): Promise<void>;

  /**
   * Writes a number of entities efficiently to storage.
   *
   * @param requests The entities and their relations
   * @param options.locationId The location that they all belong to (default none)
   * @param options.dryRun Whether to throw away the results (default false)
   * @param options.outputEntities Whether to return the resulting entities (default false)
   */
  batchAddOrUpdateEntities(
    requests: EntityUpsertRequest[],
    options?: {
      locationId?: string;
      dryRun?: boolean;
      outputEntities?: boolean;
    },
  ): Promise<EntityUpsertResponse[]>;
};

//
// Locations
//

export type LocationUpdateStatus = {
  timestamp: string | null;
  status: string | null;
  message: string | null;
};
export type LocationUpdateLogEvent = {
  id: string;
  status: 'fail' | 'success';
  location_id: string;
  entity_name: string;
  created_at?: string;
  message?: string;
};

export type LocationResponse = {
  data: Location;
  currentStatus: LocationUpdateStatus;
};

export type LocationsCatalog = {
  addLocation(location: Location): Promise<Location>;
  removeLocation(id: string): Promise<void>;
  locations(): Promise<LocationResponse[]>;
  location(id: string): Promise<LocationResponse>;
  locationHistory(id: string): Promise<LocationUpdateLogEvent[]>;
  logUpdateSuccess(
    locationId: string,
    entityName?: string | string[],
  ): Promise<void>;
  logUpdateFailure(
    locationId: string,
    error?: Error,
    entityName?: string,
  ): Promise<void>;
};
