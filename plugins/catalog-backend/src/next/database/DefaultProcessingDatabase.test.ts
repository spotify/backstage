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

import { getVoidLogger } from '@backstage/backend-common';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';
import { Knex } from 'knex';
import { Logger } from 'winston';
import * as uuid from 'uuid';
import { DatabaseManager } from './DatabaseManager';
import { DefaultProcessingDatabase } from './DefaultProcessingDatabase';
import {
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
} from './tables';

describe('Default Processing Database', () => {
  const defaultLogger = getVoidLogger();
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createDatabase(
    databaseId: TestDatabaseId,
    logger: Logger = defaultLogger,
  ) {
    const knex = await databases.init(databaseId);
    await DatabaseManager.createDatabase(knex);
    return {
      knex,
      db: new DefaultProcessingDatabase({
        database: knex,
        logger,
        refreshIntervalSeconds: 100,
      }),
    };
  }

  const insertRefRow = async (db: Knex, ref: DbRefreshStateReferencesRow) => {
    return db<DbRefreshStateReferencesRow>('refresh_state_references').insert(
      ref,
    );
  };

  const insertRefreshStateRow = async (db: Knex, ref: DbRefreshStateRow) => {
    await db<DbRefreshStateRow>('refresh_state').insert(ref);
  };

  describe('addUprocessedEntities', () => {
    function mockEntity(name: string, type: string): Entity {
      return {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name,
        },
        spec: {
          type,
        },
      };
    }

    it.each(databases.eachSupportedId())(
      'updates refresh state with varying location keys, %p',
      async databaseId => {
        const mockWarn = jest.fn();
        const { db } = await createDatabase(databaseId, ({
          debug: jest.fn(),
          warn: mockWarn,
        } as unknown) as Logger);
        await db.transaction(async tx => {
          const knexTx = tx as Knex.Transaction;

          const steps = [
            {
              locationKey: undefined,
              expectedLocationKey: null,
              type: 'a',
              expectedType: 'a',
            },
            {
              locationKey: undefined,
              expectedLocationKey: null,
              type: 'b',
              expectedType: 'b',
            },
            {
              locationKey: 'x',
              expectedLocationKey: 'x',
              type: 'c',
              expectedType: 'c',
            },
            {
              locationKey: 'y',
              expectedLocationKey: 'x',
              type: 'd',
              expectedType: 'c',
              expectConflict: true,
            },
            {
              locationKey: undefined,
              expectedLocationKey: 'x',
              type: 'e',
              expectedType: 'c',
              expectConflict: true,
            },
            {
              locationKey: 'x',
              expectedLocationKey: 'x',
              type: 'f',
              expectedType: 'f',
            },
          ];
          for (const step of steps) {
            mockWarn.mockClear();

            await db.addUnprocessedEntities(tx, {
              sourceKey: 'testing',
              entities: [
                {
                  entity: mockEntity('1', step.type),
                  locationKey: step.locationKey,
                },
              ],
            });

            if (step.expectConflict) {
              // eslint-disable-next-line jest/no-conditional-expect
              expect(mockWarn).toHaveBeenCalledWith(
                expect.stringMatching(/^Detected conflicting entityRef/),
              );
            } else {
              // eslint-disable-next-line jest/no-conditional-expect
              expect(mockWarn).not.toHaveBeenCalled();
            }

            const entities = await knexTx<DbRefreshStateRow>(
              'refresh_state',
            ).select();
            expect(entities).toEqual([
              expect.objectContaining({
                entity_ref: 'component:default/1',
                location_key: step.expectedLocationKey,
              }),
            ]);
            const entity = JSON.parse(entities[0].unprocessed_entity) as Entity;
            expect(entity.spec?.type).toEqual(step.expectedType);

            await expect(
              knexTx<DbRefreshStateReferencesRow>(
                'refresh_state_references',
              ).select(),
            ).resolves.toEqual([
              expect.objectContaining({
                source_key: 'testing',
                target_entity_ref: 'component:default/1',
              }),
            ]);
          }
        });
      },
      60_000,
    );
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

    it.each(databases.eachSupportedId())(
      'fails when an entity is processed with a different locationKey, %p',
      async databaseId => {
        const { db } = await createDatabase(databaseId);
        await db.transaction(async tx => {
          await expect(() =>
            db.updateProcessedEntity(tx, {
              id,
              processedEntity,
              state: new Map<string, JsonObject>(),
              relations: [],
              deferredEntities: [],
            }),
          ).rejects.toThrow(
            `Conflicting write of processing result for ${id} with location key 'undefined'`,
          );
        });
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'fails when the locationKey is different, %p',
      async databaseId => {
        const options = {
          id,
          processedEntity,
          state: new Map<string, JsonObject>(),
          relations: [],
          deferredEntities: [],
          locationKey: 'key',
          errors: "['something broke']",
        };
        const { knex, db } = await createDatabase(databaseId);
        await insertRefreshStateRow(knex, {
          entity_id: id,
          entity_ref: 'location:default/fakelocation',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          location_key: 'key',
          errors: '[]',
          next_update_at: '2021-04-01 13:37:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });
        await db.transaction(tx => db.updateProcessedEntity(tx, options));

        const entities = await knex<DbRefreshStateRow>(
          'refresh_state',
        ).select();
        expect(entities.length).toBe(1);

        await db.transaction(tx =>
          expect(
            db.updateProcessedEntity(tx, { ...options, locationKey: 'fail' }),
          ).rejects.toThrow(
            `Conflicting write of processing result for ${id} with location key 'fail'`,
          ),
        );
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'updates the refresh state entry with the cache, processed entity and errors, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        await insertRefreshStateRow(knex, {
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

        await db.transaction(tx =>
          db.updateProcessedEntity(tx, {
            id,
            processedEntity,
            state,
            relations: [],
            deferredEntities: [],
            locationKey: 'key',
            errors: "['something broke']",
          }),
        );

        const entities = await knex<DbRefreshStateRow>(
          'refresh_state',
        ).select();
        expect(entities.length).toBe(1);
        expect(entities[0].processed_entity).toEqual(
          JSON.stringify(processedEntity),
        );
        expect(entities[0].cache).toEqual(JSON.stringify(state));
        expect(entities[0].errors).toEqual("['something broke']");
        expect(entities[0].location_key).toEqual('key');
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'removes old relations and stores the new relationships, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        await insertRefreshStateRow(knex, {
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

        await db.transaction(tx =>
          db.updateProcessedEntity(tx, {
            id,
            processedEntity,
            state: new Map<string, JsonObject>(),
            relations: relations,
            deferredEntities: [],
          }),
        );

        const savedRelations = await knex<DbRelationsRow>('relations')
          .where({ originating_entity_id: id })
          .select();
        expect(savedRelations.length).toBe(1);
        expect(savedRelations[0]).toEqual({
          originating_entity_id: id,
          source_entity_ref: 'component:default/foo',
          type: 'memberOf',
          target_entity_ref: 'component:default/foo',
        });
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'adds deferred entities to the the refresh_state table to be picked up later, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        await insertRefreshStateRow(knex, {
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
            entity: {
              apiVersion: '1',
              kind: 'Location',
              metadata: {
                name: 'next',
              },
            },
            locationKey: 'mock',
          },
        ];

        await db.transaction(tx =>
          db.updateProcessedEntity(tx, {
            id,
            processedEntity,
            state: new Map<string, JsonObject>(),
            relations: [],
            deferredEntities,
          }),
        );

        const refreshStateEntries = await knex<DbRefreshStateRow>(
          'refresh_state',
        )
          .where({ entity_ref: stringifyEntityRef(deferredEntities[0].entity) })
          .select();

        expect(refreshStateEntries).toHaveLength(1);
      },
      60_000,
    );
  });

  describe('replaceUnprocessedEntities', () => {
    const createLocations = async (db: Knex, entityRefs: string[]) => {
      for (const ref of entityRefs) {
        await insertRefreshStateRow(db, {
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

    it.each(databases.eachSupportedId())(
      'replaces all existing state correctly for simple dependency chains, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        /*
        config -> location:default/root -> location:default/root-1 -> location:default/root-2
        database -> location:default/second -> location:default/root-2
        */
        await createLocations(knex, [
          'location:default/root',
          'location:default/root-1',
          'location:default/root-2',
          'location:default/second',
        ]);

        await insertRefRow(knex, {
          source_key: 'config',
          target_entity_ref: 'location:default/root',
        });

        await insertRefRow(knex, {
          source_key: 'database',
          target_entity_ref: 'location:default/second',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root',
          target_entity_ref: 'location:default/root-1',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root-1',
          target_entity_ref: 'location:default/root-2',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/second',
          target_entity_ref: 'location:default/root-2',
        });

        await db.transaction(tx =>
          db.replaceUnprocessedEntities(tx, {
            type: 'full',
            sourceKey: 'config',
            items: [
              {
                entity: {
                  apiVersion: '1.0.0',
                  metadata: {
                    name: 'new-root',
                  },
                  kind: 'Location',
                } as Entity,
                locationKey: 'file:///tmp/foobar',
              },
            ],
          }),
        );

        const currentRefreshState = await knex<DbRefreshStateRow>(
          'refresh_state',
        ).select();

        const currentRefRowState = await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).select();

        for (const ref of [
          'location:default/root',
          'location:default/root-1',
        ]) {
          expect(
            currentRefreshState.some(t => t.entity_ref === ref),
          ).toBeFalsy();
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
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'should work for more complex chains, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        /*
        config -> location:default/root -> location:default/root-1 -> location:default/root-2
        config -> location:default/root -> location:default/root-1a -> location:default/root-2
      */
        await createLocations(knex, [
          'location:default/root',
          'location:default/root-1',
          'location:default/root-2',
          'location:default/root-1a',
        ]);

        await insertRefRow(knex, {
          source_key: 'config',
          target_entity_ref: 'location:default/root',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root',
          target_entity_ref: 'location:default/root-1',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root',
          target_entity_ref: 'location:default/root-1a',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root-1',
          target_entity_ref: 'location:default/root-2',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root-1a',
          target_entity_ref: 'location:default/root-2',
        });

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'full',
            sourceKey: 'config',
            items: [
              {
                entity: {
                  apiVersion: '1.0.0',
                  metadata: {
                    name: 'new-root',
                  },
                  kind: 'Location',
                } as Entity,
                locationKey: 'file:/tmp/foobar',
              },
            ],
          });
        });

        const currentRefreshState = await knex<DbRefreshStateRow>(
          'refresh_state',
        ).select();

        const currentRefRowState = await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).select();

        const deletedRefs = [
          'location:default/root',
          'location:default/root-1',
          'location:default/root-1a',
          'location:default/root-2',
        ];

        for (const ref of deletedRefs) {
          expect(
            currentRefreshState.some(t => t.entity_ref === ref),
          ).toBeFalsy();
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
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'should add new locations using the delta options, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'delta',
            sourceKey: 'lols',
            removed: [],
            added: [
              {
                entity: {
                  apiVersion: '1.0.0',
                  metadata: {
                    name: 'new-root',
                  },
                  kind: 'Location',
                } as Entity,
                locationKey: 'file:///tmp/foobar',
              },
            ],
          });
        });

        const currentRefreshState = await knex<DbRefreshStateRow>(
          'refresh_state',
        ).select();

        const currentRefRowState = await knex<DbRefreshStateReferencesRow>(
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
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'should not remove locations that are referenced elsewhere, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        /*
        config-1 -> location:default/root
        config-2 -> location:default/root
      */
        await createLocations(knex, ['location:default/root']);

        await insertRefRow(knex, {
          source_key: 'config-1',
          target_entity_ref: 'location:default/root',
        });
        await insertRefRow(knex, {
          source_key: 'config-2',
          target_entity_ref: 'location:default/root',
        });

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'full',
            sourceKey: 'config-1',
            items: [],
          });
        });

        const currentRefreshState = await knex<DbRefreshStateRow>(
          'refresh_state',
        ).select();

        const currentRefRowState = await knex<DbRefreshStateReferencesRow>(
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
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'should remove old locations using the delta options, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        await createLocations(knex, ['location:default/new-root']);

        await insertRefRow(knex, {
          source_key: 'lols',
          target_entity_ref: 'location:default/new-root',
        });

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'delta',
            sourceKey: 'lols',
            added: [],
            removed: [
              {
                entity: {
                  apiVersion: '1.0.0',
                  metadata: {
                    name: 'new-root',
                  },
                  kind: 'Location',
                } as Entity,
                locationKey: 'file:/tmp/foobar',
              },
            ],
          });
        });

        const currentRefreshState = await knex<DbRefreshStateRow>(
          'refresh_state',
        ).select();

        const currentRefRowState = await knex<DbRefreshStateReferencesRow>(
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
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'should update the location key during full replace, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        await createLocations(knex, ['location:default/removed']);
        await insertRefreshStateRow(knex, {
          entity_id: uuid.v4(),
          entity_ref: 'location:default/replaced',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: '2021-04-01 13:37:00',
          last_discovery_at: '2021-04-01 13:37:00',
          location_key: 'file:///tmp/old',
        });

        await insertRefRow(knex, {
          source_key: 'lols',
          target_entity_ref: 'location:default/removed',
        });
        await insertRefRow(knex, {
          source_key: 'lols',
          target_entity_ref: 'location:default/replaced',
        });

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'full',
            sourceKey: 'lols',
            items: [
              {
                entity: {
                  apiVersion: '1.0.0',
                  metadata: {
                    name: 'replaced',
                  },
                  kind: 'Location',
                } as Entity,
                locationKey: 'file:///tmp/foobar',
              },
            ],
          });
        });

        const currentRefreshState = await knex<DbRefreshStateRow>(
          'refresh_state',
        ).select();
        expect(currentRefreshState).toEqual([
          expect.objectContaining({
            entity_ref: 'location:default/replaced',
            location_key: 'file:///tmp/foobar',
          }),
        ]);

        const currentRefRowState = await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).select();
        expect(currentRefRowState).toEqual([
          expect.objectContaining({
            source_key: 'lols',
            target_entity_ref: 'location:default/replaced',
          }),
        ]);
      },
      60_000,
    );
  });

  describe('getProcessableEntities', () => {
    it.each(databases.eachSupportedId())(
      'should return entities to process, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        const entity = JSON.stringify({
          kind: 'Location',
          apiVersion: '1.0.0',
          metadata: {
            name: 'xyz',
          },
        } as Entity);

        await knex<DbRefreshStateRow>('refresh_state').insert({
          entity_id: '2',
          entity_ref: 'location:default/new-root',
          unprocessed_entity: entity,
          errors: '[]',
          next_update_at: '2019-01-01 23:00:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });

        await knex<DbRefreshStateRow>('refresh_state').insert({
          entity_id: '1',
          entity_ref: 'location:default/foobar',
          unprocessed_entity: entity,
          errors: '[]',
          next_update_at: '2042-01-01 23:00:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });

        await db.transaction(async tx => {
          // request two items but only one can be processed.
          const result = await db.getProcessableEntities(tx, {
            processBatchSize: 2,
          });
          expect(result.items.length).toEqual(1);
          expect(result.items[0].entityRef).toEqual(
            'location:default/new-root',
          );

          // should not return the same item as there's nothing left to process.
          await expect(
            db.getProcessableEntities(tx, {
              processBatchSize: 2,
            }),
          ).resolves.toEqual({ items: [] });
        });
      },
      60_000,
    );
  });
});
