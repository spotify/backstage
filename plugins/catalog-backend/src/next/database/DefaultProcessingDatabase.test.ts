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
// import { DefaultProcessingDatabase } from './DefaultProcessingDatabase';
import { getVoidLogger } from '@backstage/backend-common';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';
import { Knex } from 'knex';
import * as uuid from 'uuid';
import { DatabaseManager } from './DatabaseManager';
import { DefaultProcessingDatabase } from './DefaultProcessingDatabase';
import {
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
} from './tables';

describe('Default Processing Database', () => {
  let db: Knex;
  let processingDatabase: DefaultProcessingDatabase;
  const logger = getVoidLogger();

  const insertRefRow = async (ref: DbRefreshStateReferencesRow) => {
    return db<DbRefreshStateReferencesRow>('refresh_state_references').insert(
      ref,
    );
  };

  const insertRefreshStateRow = async (ref: DbRefreshStateRow) => {
    await db<DbRefreshStateRow>('refresh_state').insert(ref);
  };

  beforeEach(async () => {
    db = await DatabaseManager.createTestDatabaseConnection();
    await DatabaseManager.createDatabase(db);

    processingDatabase = new DefaultProcessingDatabase(db, logger);
  });

  describe('updateProcessedEntity', () => {
    let id: string;
    let processedEntity: Entity;

    beforeEach(() => {
      id = uuid.v4();
      processedEntity = {
        apiVersion: '1',
        kind: 'Location',
        metadata: {
          name: 'fakelocation',
        },
        spec: {
          type: 'url',
          target: 'somethingelse',
        },
      };
    });

    it('fails when there is no processing state for the entity', async () => {
      await processingDatabase.transaction(async tx => {
        await expect(() =>
          processingDatabase.updateProcessedEntity(tx, {
            id,
            processedEntity,
            state: new Map<string, JsonObject>(),
            relations: [],
            deferredEntities: [],
          }),
        ).rejects.toThrow(`Processing state not found for ${id}`);
      });
    });

    it('updates the refresh state entry with the cache, processed entity and errors', async () => {
      await insertRefreshStateRow({
        entity_id: id,
        entity_ref: 'location:default/fakelocation',
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        next_update_at: '2021-04-01 13:37:00',
        last_discovery_at: '2021-04-01 13:37:00',
      });

      const state = new Map<string, JsonObject>();
      state.set('hello', { t: 'something' });

      await processingDatabase.transaction(tx =>
        processingDatabase.updateProcessedEntity(tx, {
          id,
          processedEntity,
          state,
          relations: [],
          deferredEntities: [],
          errors: "['something broke']",
        }),
      );

      const entities = await db<DbRefreshStateRow>('refresh_state').select();
      expect(entities.length).toBe(1);
      expect(entities[0].processed_entity).toEqual(
        JSON.stringify(processedEntity),
      );
      expect(entities[0].cache).toEqual(JSON.stringify(state));
      expect(entities[0].errors).toEqual("['something broke']");
    });

    it('removes old relations and stores the new relationships', async () => {
      await insertRefreshStateRow({
        entity_id: id,
        entity_ref: 'location:default/fakelocation',
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        next_update_at: '2021-04-01 13:37:00',
        last_discovery_at: '2021-04-01 13:37:00',
      });

      const relations = [
        {
          source: {
            kind: 'Component',
            namespace: 'Default',
            name: 'foo',
          },
          target: {
            kind: 'Component',
            namespace: 'Default',
            name: 'foo',
          },
          type: 'memberOf',
        },
      ];

      await processingDatabase.transaction(tx =>
        processingDatabase.updateProcessedEntity(tx, {
          id,
          processedEntity,
          state: new Map<string, JsonObject>(),
          relations: relations,
          deferredEntities: [],
        }),
      );

      const savedRelations = await db<DbRelationsRow>('relations')
        .where({ originating_entity_id: id })
        .select();
      expect(savedRelations.length).toBe(1);
      expect(savedRelations[0]).toEqual({
        originating_entity_id: id,
        source_entity_ref: 'component:default/foo',
        type: 'memberOf',
        target_entity_ref: 'component:default/foo',
      });
    });

    it('adds deferred entities to the the refresh_state table to be picked up later', async () => {
      await insertRefreshStateRow({
        entity_id: id,
        entity_ref: 'location:default/fakelocation',
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        next_update_at: '2021-04-01 13:37:00',
        last_discovery_at: '2021-04-01 13:37:00',
      });

      const deferredEntities = [
        {
          apiVersion: '1',
          kind: 'Location',
          metadata: {
            name: 'next',
          },
        },
      ];

      await processingDatabase.transaction(tx =>
        processingDatabase.updateProcessedEntity(tx, {
          id,
          processedEntity,
          state: new Map<string, JsonObject>(),
          relations: [],
          deferredEntities,
        }),
      );

      const refreshStateEntries = await db<DbRefreshStateRow>('refresh_state')
        .where({ entity_ref: stringifyEntityRef(deferredEntities[0]) })
        .select();

      expect(refreshStateEntries).toHaveLength(1);
    });
  });

  describe('replaceUnprocessedEntities', () => {
    const createLocations = async (entityRefs: string[]) => {
      for (const ref of entityRefs) {
        await insertRefreshStateRow({
          entity_id: uuid.v4(),
          entity_ref: ref,
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: '2021-04-01 13:37:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });
      }
    };

    it('replaces all existing state correctly for simple dependency chains', async () => {
      /*
        config -> location:default/root -> location:default/root-1 -> location:default/root-2
        database -> location:default/second -> location:default/root-2
      */
      await createLocations([
        'location:default/root',
        'location:default/root-1',
        'location:default/root-2',
        'location:default/second',
      ]);

      await insertRefRow({
        source_key: 'config',
        target_entity_ref: 'location:default/root',
      });

      await insertRefRow({
        source_key: 'database',
        target_entity_ref: 'location:default/second',
      });

      await insertRefRow({
        source_entity_ref: 'location:default/root',
        target_entity_ref: 'location:default/root-1',
      });

      await insertRefRow({
        source_entity_ref: 'location:default/root-1',
        target_entity_ref: 'location:default/root-2',
      });

      await insertRefRow({
        source_entity_ref: 'location:default/second',
        target_entity_ref: 'location:default/root-2',
      });

      await processingDatabase.transaction(tx =>
        processingDatabase.replaceUnprocessedEntities(tx, {
          type: 'full',
          sourceKey: 'config',
          items: [
            {
              apiVersion: '1.0.0',
              metadata: {
                name: 'new-root',
              },
              kind: 'Location',
            } as Entity,
          ],
        }),
      );

      const currentRefreshState = await db<DbRefreshStateRow>(
        'refresh_state',
      ).select();

      const currentRefRowState = await db<DbRefreshStateReferencesRow>(
        'refresh_state_references',
      ).select();

      for (const ref of ['location:default/root', 'location:default/root-1']) {
        expect(currentRefreshState.some(t => t.entity_ref === ref)).toBeFalsy();
      }

      expect(
        currentRefreshState.some(
          t => t.entity_ref === 'location:default/new-root',
        ),
      ).toBeTruthy();

      expect(
        currentRefRowState.some(
          t =>
            t.source_entity_ref === 'location:default/root' &&
            t.target_entity_ref === 'location:default/root-1',
        ),
      ).toBeFalsy();

      expect(
        currentRefRowState.some(
          t =>
            t.source_entity_ref === 'location:default/root-1' &&
            t.target_entity_ref === 'location:default/root-2',
        ),
      ).toBeFalsy();

      expect(
        currentRefRowState.some(
          t =>
            t.target_entity_ref === 'location:default/root-1' &&
            t.source_key === 'config',
        ),
      ).toBeFalsy();

      expect(
        currentRefRowState.some(
          t =>
            t.target_entity_ref === 'location:default/new-root' &&
            t.source_key === 'config',
        ),
      ).toBeTruthy();
    });

    it('should work for more complex chains', async () => {
      /*
        config -> location:default/root -> location:default/root-1 -> location:default/root-2
        config -> location:default/root -> location:default/root-1a -> location:default/root-2
      */
      await createLocations([
        'location:default/root',
        'location:default/root-1',
        'location:default/root-2',
        'location:default/root-1a',
      ]);

      await insertRefRow({
        source_key: 'config',
        target_entity_ref: 'location:default/root',
      });

      await insertRefRow({
        source_entity_ref: 'location:default/root',
        target_entity_ref: 'location:default/root-1',
      });

      await insertRefRow({
        source_entity_ref: 'location:default/root',
        target_entity_ref: 'location:default/root-1a',
      });

      await insertRefRow({
        source_entity_ref: 'location:default/root-1',
        target_entity_ref: 'location:default/root-2',
      });

      await insertRefRow({
        source_entity_ref: 'location:default/root-1a',
        target_entity_ref: 'location:default/root-2',
      });

      await processingDatabase.transaction(async tx => {
        await processingDatabase.replaceUnprocessedEntities(tx, {
          type: 'full',
          sourceKey: 'config',
          items: [
            {
              apiVersion: '1.0.0',
              metadata: {
                name: 'new-root',
              },
              kind: 'Location',
            } as Entity,
          ],
        });
      });

      const currentRefreshState = await db<DbRefreshStateRow>(
        'refresh_state',
      ).select();

      const currentRefRowState = await db<DbRefreshStateReferencesRow>(
        'refresh_state_references',
      ).select();

      const deletedRefs = [
        'location:default/root',
        'location:default/root-1',
        'location:default/root-1a',
        'location:default/root-2',
      ];

      for (const ref of deletedRefs) {
        expect(currentRefreshState.some(t => t.entity_ref === ref)).toBeFalsy();
      }

      expect(
        currentRefreshState.some(
          t => t.entity_ref === 'location:default/new-root',
        ),
      ).toBeTruthy();

      expect(
        currentRefRowState.some(
          t =>
            t.source_key === 'config' &&
            t.target_entity_ref === 'location:default/new-root',
        ),
      ).toBeTruthy();

      expect(
        currentRefRowState.some(
          t =>
            t.source_key === 'config' &&
            t.target_entity_ref === 'location:default/root',
        ),
      ).toBeFalsy();

      expect(
        currentRefRowState.some(
          t =>
            t.source_entity_ref === 'location:default/root' &&
            t.target_entity_ref === 'location:default/root-1',
        ),
      ).toBeFalsy();

      expect(
        currentRefRowState.some(
          t =>
            t.source_entity_ref === 'location:default/root' &&
            t.target_entity_ref === 'location:default/root-1a',
        ),
      ).toBeFalsy();

      expect(
        currentRefRowState.some(
          t =>
            t.source_entity_ref === 'location:default/root-1' &&
            t.target_entity_ref === 'location:default/root-2',
        ),
      ).toBeFalsy();

      expect(
        currentRefRowState.some(
          t =>
            t.source_entity_ref === 'location:default/root-1a' &&
            t.target_entity_ref === 'location:default/root-2',
        ),
      ).toBeFalsy();
    });

    it('should add new locations using the delta options', async () => {
      await processingDatabase.transaction(async tx => {
        await processingDatabase.replaceUnprocessedEntities(tx, {
          type: 'delta',
          sourceKey: 'lols',
          removed: [],
          added: [
            {
              apiVersion: '1.0.0',
              metadata: {
                name: 'new-root',
              },
              kind: 'Location',
            } as Entity,
          ],
        });
      });

      const currentRefreshState = await db<DbRefreshStateRow>(
        'refresh_state',
      ).select();

      const currentRefRowState = await db<DbRefreshStateReferencesRow>(
        'refresh_state_references',
      ).select();

      expect(
        currentRefreshState.some(
          t => t.entity_ref === 'location:default/new-root',
        ),
      ).toBeTruthy();

      expect(
        currentRefRowState.some(
          t =>
            t.source_key === 'lols' &&
            t.target_entity_ref === 'location:default/new-root',
        ),
      ).toBeTruthy();
    });

    it('should not remove locations that are referenced elsewhere', async () => {
      /*
        config-1 -> location:default/root
        config-2 -> location:default/root
      */
      await createLocations(['location:default/root']);

      await insertRefRow({
        source_key: 'config-1',
        target_entity_ref: 'location:default/root',
      });
      await insertRefRow({
        source_key: 'config-2',
        target_entity_ref: 'location:default/root',
      });

      await processingDatabase.transaction(async tx => {
        await processingDatabase.replaceUnprocessedEntities(tx, {
          type: 'full',
          sourceKey: 'config-1',
          items: [],
        });
      });

      const currentRefreshState = await db<DbRefreshStateRow>(
        'refresh_state',
      ).select();

      const currentRefRowState = await db<DbRefreshStateReferencesRow>(
        'refresh_state_references',
      ).select();

      expect(currentRefRowState).toEqual([
        expect.objectContaining({
          source_key: 'config-2',
          target_entity_ref: 'location:default/root',
        }),
      ]);

      expect(currentRefreshState).toEqual([
        expect.objectContaining({
          entity_ref: 'location:default/root',
        }),
      ]);
    });

    it('should remove old locations using the delta options', async () => {
      await createLocations(['location:default/new-root']);

      await insertRefRow({
        source_key: 'lols',
        target_entity_ref: 'location:default/new-root',
      });

      await processingDatabase.transaction(async tx => {
        await processingDatabase.replaceUnprocessedEntities(tx, {
          type: 'delta',
          sourceKey: 'lols',
          added: [],
          removed: [
            {
              apiVersion: '1.0.0',
              metadata: {
                name: 'new-root',
              },
              kind: 'Location',
            } as Entity,
          ],
        });
      });

      const currentRefreshState = await db<DbRefreshStateRow>(
        'refresh_state',
      ).select();

      const currentRefRowState = await db<DbRefreshStateReferencesRow>(
        'refresh_state_references',
      ).select();

      expect(
        currentRefreshState.some(
          t => t.entity_ref === 'location:default/new-root',
        ),
      ).toBeFalsy();

      expect(
        currentRefRowState.some(
          t =>
            t.source_key === 'lols' &&
            t.target_entity_ref === 'location:default/new-root',
        ),
      ).toBeFalsy();
    });
  });

  describe('getProcessableEntities', () => {
    it('should return entities to process', async () => {
      const entity = JSON.stringify({
        kind: 'Location',
        apiVersion: '1.0.0',
        metadata: {
          name: 'xyz',
        },
      } as Entity);

      await db<DbRefreshStateRow>('refresh_state').insert({
        entity_id: '2',
        entity_ref: 'location:default/new-root',
        unprocessed_entity: entity,
        errors: '[]',
        next_update_at: '2019-01-01 23:00:00',
        last_discovery_at: '2021-04-01 13:37:00',
      });

      await db<DbRefreshStateRow>('refresh_state').insert({
        entity_id: '1',
        entity_ref: 'location:default/foobar',
        unprocessed_entity: entity,
        errors: '[]',
        next_update_at: '2042-01-01 23:00:00',
        last_discovery_at: '2021-04-01 13:37:00',
      });

      await processingDatabase.transaction(async tx => {
        // request two items but only one can be processed.
        const result = await processingDatabase.getProcessableEntities(tx, {
          processBatchSize: 2,
        });
        expect(result.items.length).toEqual(1);
        expect(result.items[0].entityRef).toEqual('location:default/new-root');

        // should not return the same item as there's nothing left to process.
        await expect(
          processingDatabase.getProcessableEntities(tx, {
            processBatchSize: 2,
          }),
        ).resolves.toEqual({ items: [] });
      });
    });
  });
});
