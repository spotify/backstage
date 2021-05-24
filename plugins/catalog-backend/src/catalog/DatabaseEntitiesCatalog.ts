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

import {
  Entity,
  entityHasChanges,
  generateUpdatedEntity,
  getEntityName,
  LOCATION_ANNOTATION,
  serializeEntityRef,
} from '@backstage/catalog-model';
import { ConflictError } from '@backstage/errors';
import { chunk, groupBy } from 'lodash';
import limiterFactory from 'p-limit';
import { Logger } from 'winston';
import {
  Database,
  DbEntityResponse,
  generateAttachmentEtag,
  Transaction,
} from '../database';
import { DbEntitiesRequest } from '../database/types';
import { basicEntityFilter } from '../service/request';
import { durationText } from '../util/timing';
import {
  EntitiesCatalog,
  EntitiesRequest,
  EntitiesResponse,
  EntityAttachment,
  EntityAttachmentFilter,
  EntityAttachmentUpsertRequest,
  EntityUpsertRequest,
  EntityUpsertResponse,
} from './types';

type BatchContext = {
  kind: string;
  namespace: string;
  locationId?: string;
};

// Some locations return tens or hundreds of thousands of entities. To make
// those payloads more manageable, we break work apart in batches of this
// many entities and write them to storage per batch.
const BATCH_SIZE = 100;

// When writing large batches, there's an increasing chance of contention in
// the form of conflicts where we compete with other writes. Each batch gets
// this many attempts at being written before giving up.
const BATCH_ATTEMPTS = 3;

// The number of batches that may be ongoing at the same time.
const BATCH_CONCURRENCY = 3;

export class DatabaseEntitiesCatalog implements EntitiesCatalog {
  constructor(
    private readonly database: Database,
    private readonly logger: Logger,
  ) {}

  async entities(request?: EntitiesRequest): Promise<EntitiesResponse> {
    const dbRequest: DbEntitiesRequest = {
      filter: request?.filter,
      pagination: request?.pagination,
    };

    const dbResponse = await this.database.transaction(tx =>
      this.database.entities(tx, dbRequest),
    );

    const entities = dbResponse.entities.map(e =>
      request?.fields ? request.fields(e.entity) : e.entity,
    );

    return {
      entities,
      pageInfo: dbResponse.pageInfo,
    };
  }

  async attachment(
    uid: string,
    key: string,
    filter?: EntityAttachmentFilter,
  ): Promise<EntityAttachment | undefined> {
    return await this.database.transaction(async tx => {
      const response = await this.database.attachmentByUidAndKey(
        tx,
        uid,
        key,
        filter,
      );

      if (!response) {
        return undefined;
      }

      return {
        key: response.key,
        data: response.data,
        contentType: response.contentType,
        etag: response.etag,
      };
    });
  }

  async removeEntityByUid(uid: string): Promise<void> {
    await this.database.transaction(async tx => {
      await this.database.removeEntityByUid(tx, uid);
    });
  }

  async batchAddOrUpdateEntities(
    requests: EntityUpsertRequest[],
    options?: {
      locationId?: string;
      dryRun?: boolean;
      outputEntities?: boolean;
    },
  ): Promise<EntityUpsertResponse[]> {
    // Group the requests by unique kind+namespace combinations. The reason for
    // this is that the change detection and merging logic requires finding
    // pre-existing versions of the entities in the database. Those queries are
    // easier and faster to make if every batch revolves around a single kind-
    // namespace pair.
    const requestsByKindAndNamespace = groupBy(requests, ({ entity }) => {
      const name = getEntityName(entity);
      return `${name.kind}:${name.namespace}`.toLowerCase();
    });

    // Go through the requests in reasonable batch sizes. Sometimes, sources
    // produce tens of thousands of entities, and those are too large batch
    // sizes to reasonably send to the database.
    const batches = Object.values(requestsByKindAndNamespace)
      .map(request => chunk(request, BATCH_SIZE))
      .flat();

    // Bound the number of concurrent batches. We want a bit of concurrency for
    // performance reasons, but not so much that we starve the connection pool
    // or start thrashing.
    const limiter = limiterFactory(BATCH_CONCURRENCY);
    const tasks = batches.map(batch =>
      limiter(async () => {
        // Retry the batch write a few times to deal with contention
        for (let attempt = 1; ; ++attempt) {
          try {
            return this.batchAddOrUpdateEntitiesSingleBatch(batch, options);
          } catch (e) {
            if (e instanceof ConflictError && attempt < BATCH_ATTEMPTS) {
              this.logger.warn(
                `Failed to write batch at attempt ${attempt}/${BATCH_ATTEMPTS}, ${e}`,
              );
            } else {
              throw e;
            }
          }
        }
      }),
    );

    const responses = await Promise.all(tasks);
    return responses.flat();
  }

  // Defines the actual logic of running a single batch. All of these share a
  // common kind and namespace.
  private async batchAddOrUpdateEntitiesSingleBatch(
    batch: EntityUpsertRequest[],
    options?: {
      locationId?: string;
      dryRun?: boolean;
      outputEntities?: boolean;
    },
  ) {
    const { kind, namespace } = getEntityName(batch[0].entity);
    const context = {
      kind,
      namespace,
      locationId: options?.locationId,
    };

    this.logger.debug(
      `Considering batch ${serializeEntityRef(
        batch[0].entity,
      )}-${serializeEntityRef(batch[batch.length - 1].entity)} (${
        batch.length
      } entries)`,
    );

    return this.database.transaction(async tx => {
      const { toAdd, toUpdate, toIgnore } = await this.analyzeBatch(
        batch,
        context,
        tx,
      );

      let responses = new Array<EntityUpsertResponse>();
      if (toAdd.length) {
        const items = await this.batchAdd(toAdd, context, tx);
        responses.push(...items);
      }
      if (toUpdate.length) {
        const items = await this.batchUpdate(toUpdate, context, tx);
        responses.push(...items);
      }
      for (const { entity, relations } of toIgnore) {
        // TODO(Rugvip): We currently always update relations, but we
        // likely want to figure out a way to avoid that
        const entityId = entity.metadata.uid;
        if (entityId) {
          await this.database.setRelations(tx, entityId, relations);
          responses.push({ entityId });
        }
      }

      if (options?.outputEntities && responses.length > 0) {
        const writtenEntities = await this.database.entities(tx, {
          filter: basicEntityFilter({
            'metadata.uid': responses.map(e => e.entityId),
          }),
        });
        responses = writtenEntities.entities.map(e => ({
          entityId: e.entity.metadata.uid!,
          entity: e.entity,
        }));
      }

      // If this is only a dry run, cancel the database transaction even if it
      // was successful.
      if (options?.dryRun) {
        await tx.rollback();
        this.logger.debug(`Performed successful dry run of adding entities`);
      }

      return responses;
    });
  }

  // Given a batch of entities that were just read from a location, take them
  // into consideration by comparing against the existing catalog entities and
  // produce the list of entities to be added, and the list of entities to be
  // updated
  private async analyzeBatch(
    requests: EntityUpsertRequest[],
    { kind, namespace }: BatchContext,
    tx: Transaction,
  ): Promise<{
    toAdd: EntityUpsertRequest[];
    toUpdate: EntityUpsertRequest[];
    toIgnore: EntityUpsertRequest[];
  }> {
    const markTimestamp = process.hrtime();

    // Here we make use of the fact that all of the entities share kind and
    // namespace within a batch
    const names = requests.map(({ entity }) => entity.metadata.name);
    const oldEntitiesResponse = await this.database.entities(tx, {
      filter: basicEntityFilter({
        kind: kind,
        'metadata.namespace': namespace,
        'metadata.name': names,
      }),
    });

    const oldEntitiesByName = new Map(
      oldEntitiesResponse.entities.map(e => [e.entity.metadata.name, e.entity]),
    );

    const toAdd: EntityUpsertRequest[] = [];
    const toUpdate: EntityUpsertRequest[] = [];
    const toIgnore: EntityUpsertRequest[] = [];

    for (const request of requests) {
      const newEntity = request.entity;
      const oldEntity = oldEntitiesByName.get(newEntity.metadata.name);
      const newLocation = newEntity.metadata.annotations?.[LOCATION_ANNOTATION];
      const oldLocation =
        oldEntity?.metadata.annotations?.[LOCATION_ANNOTATION];
      if (!oldEntity) {
        toAdd.push(request);
      } else if (oldLocation !== newLocation) {
        this.logger.warn(
          `Rejecting write of entity ${serializeEntityRef(
            newEntity,
          )} from ${newLocation} because entity existed from ${oldLocation}`,
        );
        toIgnore.push(request);
      } else if (
        entityHasChanges(oldEntity, newEntity) ||
        (await this.attachmentsHaveChanges(tx, oldEntity, request.attachments))
      ) {
        // TODO(freben): This currently uses addOrUpdateEntity under the hood,
        // but should probably calculate the end result entity right here
        // instead and call a dedicated batch update database method
        toUpdate.push(request);
      } else {
        // Use the existing entity to ensure that we're able to read it back by uid if needed
        toIgnore.push({ ...request, entity: oldEntity });
      }
    }

    this.logger.debug(
      `Found ${toAdd.length} entities to add, ${
        toUpdate.length
      } entities to update in ${durationText(markTimestamp)}`,
    );

    return { toAdd, toUpdate, toIgnore };
  }

  private async attachmentsHaveChanges(
    tx: Transaction,
    oldEntity: Entity,
    attachmentRequests: EntityAttachmentUpsertRequest[],
  ): Promise<boolean> {
    // TODO: This is a workaround, as it's not that easy to check whether an
    // entity has changed or not. The current implementation assumes that
    // attachments are part of the entity. So if they change, the entities
    // change too and vise versa.
    // But an attachment can change in the future, even if the entity definition
    // itself has not changed, because it comes from a different source. It
    // would be better if the ingestion process already stops updates if there
    // are no changes, so that a check like attachmentRequests.some(a => a.content)
    // is sufficient.
    // This implementation is expensive.
    const oldAttachments = await this.database.attachmentsByUid(
      tx,
      oldEntity?.metadata.uid!,
    );

    if (oldAttachments.length !== attachmentRequests.length) {
      return true;
    } else if (attachmentRequests.every(r => !r.content)) {
      return false;
    }

    return attachmentRequests
      .filter(r => r.content)
      .some(({ key, content }) => {
        const oldAttachment = oldAttachments.find(a => a.key === key);

        return (
          !oldAttachment ||
          generateAttachmentEtag(content!.data, content!.contentType) !==
            oldAttachment.etag
        );
      });
  }

  // Efficiently adds the given entities to storage, under the assumption that
  // they do not conflict with any existing entities
  private async batchAdd(
    requests: EntityUpsertRequest[],
    { locationId }: BatchContext,
    tx: Transaction,
  ): Promise<EntityUpsertResponse[]> {
    const markTimestamp = process.hrtime();

    const res = await this.database.addEntities(
      tx,
      requests.map(({ entity, relations, attachments }) => ({
        locationId,
        entity,
        relations,
        attachments: attachments.map(({ key, content }) => ({
          key,
          content,
        })),
      })),
    );

    const responses = res.map(({ entity }) => ({
      entityId: entity.metadata.uid!,
    }));

    this.logger.debug(
      `Added ${requests.length} entities in ${durationText(markTimestamp)}`,
    );

    return responses;
  }

  // Efficiently updates the given entities into storage, under the assumption
  // that there already exist entities with the same names
  private async batchUpdate(
    requests: EntityUpsertRequest[],
    { locationId }: BatchContext,
    tx: Transaction,
  ): Promise<EntityUpsertResponse[]> {
    const markTimestamp = process.hrtime();
    const responses: EntityUpsertResponse[] = [];

    // TODO(freben): Still not batched
    for (const request of requests) {
      const res = await this.addOrUpdateEntity(tx, request, locationId);
      const entityId = res.metadata.uid!;
      responses.push({ entityId });
    }

    this.logger.debug(
      `Updated ${requests.length} entities in ${durationText(markTimestamp)}`,
    );

    return responses;
  }

  // TODO(freben): Incorporate this into batchUpdate which is the only caller
  private async addOrUpdateEntity(
    tx: Transaction,
    { entity, relations, attachments }: EntityUpsertRequest,
    locationId?: string,
  ): Promise<Entity> {
    // Find a matching (by uid, or by compound name, depending on the given
    // entity) existing entity, to know whether to update or add
    const existing = entity.metadata.uid
      ? await this.database.entityByUid(tx, entity.metadata.uid)
      : await this.database.entityByName(tx, getEntityName(entity));

    // If it's an update, run the algorithm for annotation merging, updating
    // etag/generation, etc.
    let response: DbEntityResponse;
    if (existing) {
      const updated = generateUpdatedEntity(existing.entity, entity);
      response = await this.database.updateEntity(
        tx,
        {
          locationId,
          entity: updated,
          relations,
          attachments: attachments.map(({ key, content }) => ({
            key,
            content,
          })),
        },
        existing.entity.metadata.etag,
        existing.entity.metadata.generation,
      );
    } else {
      const added = await this.database.addEntities(tx, [
        {
          locationId,
          entity,
          relations,
          attachments: attachments.map(({ key, content }) => ({
            key,
            content,
          })),
        },
      ]);
      response = added[0];
    }

    return response.entity;
  }
}
