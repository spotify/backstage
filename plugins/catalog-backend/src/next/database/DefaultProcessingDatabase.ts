/*
 * Copyright 2021 Spotify AB
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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { Knex } from 'knex';
import lodash from 'lodash';
import { v4 as uuid } from 'uuid';
import type { Logger } from 'winston';
import { Transaction } from '../../database';
import {
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
} from './tables';
import {
  AddUnprocessedEntitiesOptions,
  GetProcessableEntitiesResult,
  ProcessingDatabase,
  RefreshStateItem,
  ReplaceUnprocessedEntitiesOptions,
  UpdateProcessedEntityOptions,
} from './types';

// The number of items that are sent per batch to the database layer, when
// doing .batchInsert calls to knex. This needs to be low enough to not cause
// errors in the underlying engine due to exceeding query limits, but large
// enough to get the speed benefits.
const BATCH_SIZE = 50;

export class DefaultProcessingDatabase implements ProcessingDatabase {
  constructor(
    private readonly database: Knex,
    private readonly logger: Logger,
  ) {}

  async updateProcessedEntity(
    txOpaque: Transaction,
    options: UpdateProcessedEntityOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;
    const {
      id,
      processedEntity,
      state,
      errors,
      relations,
      deferredEntities,
    } = options;

    const refreshResult = await tx<DbRefreshStateRow>('refresh_state')
      .update({
        processed_entity: JSON.stringify(processedEntity),
        cache: JSON.stringify(state),
        errors,
      })
      .where('entity_id', id);
    if (refreshResult === 0) {
      throw new NotFoundError(`Processing state not found for ${id}`);
    }

    // Schedule all deferred entities for future processing.
    await this.addUnprocessedEntities(tx, {
      entities: deferredEntities,
      entityRef: stringifyEntityRef(processedEntity),
    });

    // Update fragments

    // Delete old relations
    await tx<DbRelationsRow>('relations')
      .where({ originating_entity_id: id })
      .delete();

    // Batch insert new relations
    const relationRows: DbRelationsRow[] = relations.map(
      ({ source, target, type }) => ({
        originating_entity_id: id,
        source_entity_ref: stringifyEntityRef(source),
        target_entity_ref: stringifyEntityRef(target),
        type,
      }),
    );
    await tx.batchInsert(
      'relations',
      this.deduplicateRelations(relationRows),
      BATCH_SIZE,
    );
  }

  async updateProcessedEntityErrors(
    txOpaque: Transaction,
    options: UpdateProcessedEntityOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;
    const { id, errors } = options;

    await tx<DbRefreshStateRow>('refresh_state')
      .update({
        errors,
      })
      .where('entity_id', id);
  }

  private deduplicateRelations(rows: DbRelationsRow[]): DbRelationsRow[] {
    return lodash.uniqBy(
      rows,
      r => `${r.source_entity_ref}:${r.target_entity_ref}:${r.type}`,
    );
  }

  private async createDelta(
    tx: Knex.Transaction,
    options: ReplaceUnprocessedEntitiesOptions,
  ): Promise<{ toAdd: Entity[]; toRemove: string[] }> {
    if (options.type === 'delta') {
      return {
        toAdd: options.added,
        toRemove: options.removed.map(e => stringifyEntityRef(e)),
      };
    }

    const oldRefs = await tx<DbRefreshStateReferencesRow>(
      'refresh_state_references',
    )
      .where({ source_key: options.sourceKey })
      .select('target_entity_ref')
      .then(rows => rows.map(r => r.target_entity_ref));

    const items = options.items.map(entity => ({
      entity,
      ref: stringifyEntityRef(entity),
    }));

    const oldRefsSet = new Set(oldRefs);
    const newRefsSet = new Set(items.map(item => item.ref));
    const toAdd = items.filter(item => !oldRefsSet.has(item.ref));
    const toRemove = oldRefs.filter(ref => !newRefsSet.has(ref));

    return { toAdd: toAdd.map(({ entity }) => entity), toRemove };
  }

  async replaceUnprocessedEntities(
    txOpaque: Transaction,
    options: ReplaceUnprocessedEntitiesOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;

    const { toAdd, toRemove } = await this.createDelta(tx, options);

    if (toRemove.length) {
      // TODO(freben): Batch split, to not hit variable limits?
      /*
      WITH RECURSIVE
        -- All the nodes that can be reached downwards from our root
        descendants(root_id, entity_ref) AS (
          SELECT id, target_entity_ref
          FROM refresh_state_references
          WHERE source_key = "R1" AND target_entity_ref = "A"
          UNION
          SELECT descendants.root_id, target_entity_ref
          FROM descendants
          JOIN refresh_state_references ON source_entity_ref = descendants.entity_ref
        ),
        -- All the nodes that can be reached upwards from the descendants
        ancestors(root_id, via_entity_ref, to_entity_ref) AS (
          SELECT CAST(NULL as INT), entity_ref, entity_ref
          FROM descendants
          UNION
          SELECT
            CASE WHEN source_key IS NOT NULL THEN id ELSE NULL END,
            source_entity_ref,
            ancestors.to_entity_ref
          FROM ancestors
          JOIN refresh_state_references ON target_entity_ref = ancestors.via_entity_ref
        )
      -- Start out with all of the descendants
      SELECT descendants.entity_ref
      FROM descendants
      -- Expand with all ancestors that point to those, but aren't the current root
      LEFT OUTER JOIN ancestors
        ON ancestors.to_entity_ref = descendants.entity_ref
        AND ancestors.root_id IS NOT NULL
        AND ancestors.root_id != descendants.root_id
      -- Exclude all lines that had such a foreign ancestor
      WHERE ancestors.root_id IS NULL;
      */
      const removedCount = await tx<DbRefreshStateRow>('refresh_state')
        .whereIn('entity_ref', function orphanedEntityRefs(orphans) {
          return (
            orphans
              // All the nodes that can be reached downwards from our root
              .withRecursive('descendants', function descendants(outer) {
                return outer
                  .select({ root_id: 'id', entity_ref: 'target_entity_ref' })
                  .from('refresh_state_references')
                  .where('source_key', options.sourceKey)
                  .whereIn('target_entity_ref', toRemove)
                  .union(function recursive(inner) {
                    return inner
                      .select({
                        root_id: 'descendants.root_id',
                        entity_ref:
                          'refresh_state_references.target_entity_ref',
                      })
                      .from('descendants')
                      .join('refresh_state_references', {
                        'descendants.entity_ref':
                          'refresh_state_references.source_entity_ref',
                      });
                  });
              })
              // All the nodes that can be reached upwards from the descendants
              .withRecursive('ancestors', function ancestors(outer) {
                return outer
                  .select({
                    root_id: tx.raw('CAST(NULL as INT)', []),
                    via_entity_ref: 'entity_ref',
                    to_entity_ref: 'entity_ref',
                  })
                  .from('descendants')
                  .union(function recursive(inner) {
                    return inner
                      .select({
                        root_id: tx.raw(
                          'CASE WHEN source_key IS NOT NULL THEN id ELSE NULL END',
                          [],
                        ),
                        via_entity_ref: 'source_entity_ref',
                        to_entity_ref: 'ancestors.to_entity_ref',
                      })
                      .from('ancestors')
                      .join('refresh_state_references', {
                        target_entity_ref: 'ancestors.via_entity_ref',
                      });
                  });
              })
              // Start out with all of the descendants
              .select('descendants.entity_ref')
              .from('descendants')
              // Expand with all ancestors that point to those, but aren't the current root
              .leftOuterJoin('ancestors', function keepaliveRoots() {
                this.on(
                  'ancestors.to_entity_ref',
                  '=',
                  'descendants.entity_ref',
                );
                this.andOnNotNull('ancestors.root_id');
                this.andOn('ancestors.root_id', '!=', 'descendants.root_id');
              })
              .whereNull('ancestors.root_id')
          );
        })
        .delete();

      await tx<DbRefreshStateReferencesRow>('refresh_state_references')
        .where('source_key', '=', options.sourceKey)
        .whereIn('target_entity_ref', toRemove)
        .delete();

      this.logger.debug(
        `removed, ${removedCount} entities: ${JSON.stringify(toRemove)}`,
      );
    }

    if (toAdd.length) {
      const state: Knex.DbRecord<DbRefreshStateRow>[] = toAdd.map(entity => ({
        entity_id: uuid(),
        entity_ref: stringifyEntityRef(entity),
        unprocessed_entity: JSON.stringify(entity),
        errors: '',
        next_update_at: tx.fn.now(),
        last_discovery_at: tx.fn.now(),
      }));

      const stateReferences: DbRefreshStateReferencesRow[] = toAdd.map(
        entity => ({
          source_key: options.sourceKey,
          target_entity_ref: stringifyEntityRef(entity),
        }),
      );
      // TODO(freben): Concurrency? If we did these one by one, a .onConflict().merge would have made sense
      await tx.batchInsert('refresh_state', state, BATCH_SIZE);
      await tx.batchInsert(
        'refresh_state_references',
        stateReferences,
        BATCH_SIZE,
      );
    }
  }

  async addUnprocessedEntities(
    txOpaque: Transaction,
    options: AddUnprocessedEntitiesOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;

    const stateRows = options.entities.map(
      entity =>
        ({
          entity_id: uuid(),
          entity_ref: stringifyEntityRef(entity),
          unprocessed_entity: JSON.stringify(entity),
          errors: '',
          next_update_at: tx.fn.now(),
          last_discovery_at: tx.fn.now(),
        } as Knex.DbRecord<DbRefreshStateRow>),
    );
    const stateReferenceRows = stateRows.map(
      stateRow =>
        ({
          source_entity_ref: options.entityRef,
          target_entity_ref: stateRow.entity_ref,
        } as Knex.DbRecord<DbRefreshStateReferencesRow>),
    );

    // Upsert all of the unprocessed entities into the refresh_state table, by
    // their entity ref.
    // TODO(freben): Can this be batched somehow?
    for (const row of stateRows) {
      await tx<DbRefreshStateRow>('refresh_state')
        .insert(row)
        .onConflict('entity_ref')
        .merge(['unprocessed_entity', 'last_discovery_at']);
    }

    // Replace all references for the originating entity before creating new ones
    await tx<DbRefreshStateReferencesRow>('refresh_state_references')
      .where({ source_entity_ref: options.entityRef })
      .delete();
    await tx.batchInsert(
      'refresh_state_references',
      stateReferenceRows,
      BATCH_SIZE,
    );
  }

  async getProcessableEntities(
    txOpaque: Transaction,
    request: { processBatchSize: number },
  ): Promise<GetProcessableEntitiesResult> {
    const tx = txOpaque as Knex.Transaction;

    const items = await tx<DbRefreshStateRow>('refresh_state')
      .select()
      .where('next_update_at', '<=', tx.fn.now())
      .limit(request.processBatchSize)
      .orderBy('next_update_at', 'asc');

    await tx<DbRefreshStateRow>('refresh_state')
      .whereIn(
        'entity_ref',
        items.map(i => i.entity_ref),
      )
      .update({
        next_update_at:
          tx.client.config.client === 'sqlite3'
            ? tx.raw(`datetime('now', ?)`, [`100 seconds`])
            : tx.raw(`now() + interval '100 seconds'`),
      });

    return {
      items: items.map(
        i =>
          ({
            id: i.entity_id,
            entityRef: i.entity_ref,
            unprocessedEntity: JSON.parse(i.unprocessed_entity) as Entity,
            processedEntity: i.processed_entity
              ? (JSON.parse(i.processed_entity) as Entity)
              : undefined,
            nextUpdateAt: i.next_update_at,
            lastDiscoveryAt: i.last_discovery_at,
            state: i.cache
              ? JSON.parse(i.cache)
              : new Map<string, JsonObject>(),
            errors: i.errors,
          } as RefreshStateItem),
      ),
    };
  }

  async transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
    try {
      let result: T | undefined = undefined;

      await this.database.transaction(
        async tx => {
          // We can't return here, as knex swallows the return type in case the transaction is rolled back:
          // https://github.com/knex/knex/blob/e37aeaa31c8ef9c1b07d2e4d3ec6607e557d800d/lib/transaction.js#L136
          result = await fn(tx);
        },
        {
          // If we explicitly trigger a rollback, don't fail.
          doNotRejectOnRollback: true,
        },
      );

      return result!;
    } catch (e) {
      this.logger.debug(`Error during transaction, ${e}`);

      if (
        /SQLITE_CONSTRAINT: UNIQUE/.test(e.message) ||
        /unique constraint/.test(e.message)
      ) {
        throw new ConflictError(`Rejected due to a conflicting entity`, e);
      }

      throw e;
    }
  }
}
