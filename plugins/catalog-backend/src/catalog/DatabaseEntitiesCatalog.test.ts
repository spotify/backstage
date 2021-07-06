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

import { getVoidLogger } from '@backstage/backend-common';
import { Entity, LOCATION_ANNOTATION } from '@backstage/catalog-model';
import { Database, DatabaseManager, Transaction } from '../database';
import { basicEntityFilter } from '../service/request';
import { DatabaseEntitiesCatalog } from './DatabaseEntitiesCatalog';
import { EntityUpsertRequest } from './types';

describe('DatabaseEntitiesCatalog', () => {
  let db: jest.Mocked<Database>;
  let transaction: jest.Mocked<Transaction>;

  beforeAll(() => {
    db = {
      transaction: jest.fn(),
      addEntities: jest.fn(),
      updateEntity: jest.fn(),
      entities: jest.fn(),
      entityByName: jest.fn(),
      entityByUid: jest.fn(),
      removeEntityByUid: jest.fn(),
      setRelations: jest.fn(),
      addLocation: jest.fn(),
      removeLocation: jest.fn(),
      location: jest.fn(),
      locations: jest.fn(),
      locationHistory: jest.fn(),
      addLocationUpdateLogEvent: jest.fn(),
    };
    transaction = {
      rollback: jest.fn(),
    };
  });

  beforeEach(() => {
    jest.resetAllMocks();
    db.transaction.mockImplementation(async f => f(transaction));
  });

  describe('batchAddOrUpdateEntities', () => {
    it('adds when no given uid and no matching by name', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
      };

      db.entities.mockResolvedValue({
        entities: [],
        pageInfo: { hasNextPage: false },
      });
      db.addEntities.mockResolvedValue([
        { entity: { ...entity, metadata: { ...entity.metadata, uid: 'u' } } },
      ]);

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.batchAddOrUpdateEntities([
        { entity, relations: [] },
      ]);

      expect(db.entities).toHaveBeenCalledTimes(1);
      expect(db.entities).toHaveBeenCalledWith(expect.anything(), {
        filter: basicEntityFilter({
          kind: 'b',
          'metadata.namespace': 'd',
          'metadata.name': 'c',
        }),
      });
      expect(db.addEntities).toHaveBeenCalledTimes(1);
      expect(db.addEntities).toHaveBeenCalledWith(expect.anything(), [
        { entity: expect.anything(), relations: [] },
      ]);
      expect(result).toEqual([{ entityId: 'u' }]);
    });

    it('dry run of add operation', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
      };
      db.entities.mockResolvedValue({
        entities: [],
        pageInfo: { hasNextPage: false },
      });
      db.addEntities.mockResolvedValue([
        { entity: { ...entity, metadata: { ...entity.metadata, uid: 'u' } } },
      ]);

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.batchAddOrUpdateEntities(
        [{ entity, relations: [] }],
        { dryRun: true },
      );

      expect(db.entities).toHaveBeenCalledTimes(1);
      expect(db.entities).toHaveBeenCalledWith(expect.anything(), {
        filter: basicEntityFilter({
          kind: 'b',
          'metadata.namespace': 'd',
          'metadata.name': 'c',
        }),
      });
      expect(db.addEntities).toHaveBeenCalledTimes(1);
      expect(db.addEntities).toHaveBeenCalledWith(expect.anything(), [
        { entity: expect.anything(), relations: [] },
      ]);
      expect(transaction.rollback).toBeCalledTimes(1);
      expect(result).toEqual([{ entityId: 'u' }]);
    });

    it('output modified entities', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
          annotations: {
            [LOCATION_ANNOTATION]: 'mock',
          },
        },
      };
      const dbEntity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
          description: 'changes',
          uid: 'u',
          annotations: {
            [LOCATION_ANNOTATION]: 'mock',
          },
        },
      };
      db.entities.mockResolvedValue({
        entities: [{ entity: dbEntity }],
        pageInfo: { hasNextPage: false },
      });
      db.addEntities.mockResolvedValue([
        { entity: { ...entity, metadata: { ...entity.metadata, uid: 'u' } } },
      ]);

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.batchAddOrUpdateEntities(
        [{ entity, relations: [] }],
        { outputEntities: true },
      );

      expect(db.entities).toHaveBeenCalledTimes(2);
      expect(db.addEntities).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        {
          entityId: 'u',
          entity: dbEntity,
        },
      ]);
    });

    it('updates when given uid', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          uid: 'u',
          name: 'c',
          namespace: 'd',
        },
        spec: {
          x: 'b',
        },
      };
      const existing = {
        entity: {
          apiVersion: 'a',
          kind: 'b',
          metadata: {
            uid: 'u',
            etag: 'e',
            generation: 1,
            name: 'c',
            namespace: 'd',
          },
          spec: {
            x: 'a',
          },
        },
      };

      db.entities.mockResolvedValue({
        entities: [existing],
        pageInfo: { hasNextPage: false },
      });
      db.entityByUid.mockResolvedValue(existing);
      db.updateEntity.mockResolvedValue({ entity });

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.batchAddOrUpdateEntities([
        { entity, relations: [] },
      ]);

      expect(db.entities).toHaveBeenCalledTimes(1);
      expect(db.entities).toHaveBeenCalledWith(expect.anything(), {
        filter: basicEntityFilter({
          kind: 'b',
          'metadata.namespace': 'd',
          'metadata.name': 'c',
        }),
      });
      expect(db.entityByName).not.toHaveBeenCalled();
      expect(db.entityByUid).toHaveBeenCalledTimes(1);
      expect(db.entityByUid).toHaveBeenCalledWith(transaction, 'u');
      expect(db.updateEntity).toHaveBeenCalledTimes(1);
      expect(db.updateEntity).toHaveBeenCalledWith(
        transaction,
        {
          entity: {
            apiVersion: 'a',
            kind: 'b',
            metadata: {
              uid: 'u',
              etag: expect.any(String),
              generation: 2,
              name: 'c',
              namespace: 'd',
            },
            spec: {
              x: 'b',
            },
          },
          relations: [],
        },
        'e',
        1,
      );
      expect(result).toEqual([{ entityId: 'u' }]);
    });

    it('update when no given uid and matching by name', async () => {
      const added: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
        spec: {
          x: 'b',
        },
      };
      const existing = {
        entity: {
          apiVersion: 'a',
          kind: 'b',
          metadata: {
            uid: 'u',
            etag: 'e',
            generation: 1,
            name: 'c',
            namespace: 'd',
          },
          spec: {
            x: 'a',
          },
        },
      };

      db.entities.mockResolvedValue({
        entities: [existing],
        pageInfo: { hasNextPage: false },
      });
      db.entityByName.mockResolvedValue(existing);
      db.updateEntity.mockResolvedValue(existing);

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.batchAddOrUpdateEntities([
        { entity: added, relations: [] },
      ]);

      expect(db.entities).toHaveBeenCalledTimes(1);
      expect(db.entities).toHaveBeenCalledWith(expect.anything(), {
        filter: basicEntityFilter({
          kind: 'b',
          'metadata.namespace': 'd',
          'metadata.name': 'c',
        }),
      });
      expect(db.entityByName).toHaveBeenCalledTimes(1);
      expect(db.entityByName).toHaveBeenCalledWith(transaction, {
        kind: 'b',
        namespace: 'd',
        name: 'c',
      });
      expect(db.updateEntity).toHaveBeenCalledTimes(1);
      expect(db.updateEntity).toHaveBeenCalledWith(
        transaction,
        {
          entity: {
            apiVersion: 'a',
            kind: 'b',
            metadata: {
              uid: 'u',
              etag: expect.any(String),
              generation: 2,
              name: 'c',
              namespace: 'd',
            },
            spec: {
              x: 'b',
            },
          },
          relations: [],
        },
        'e',
        1,
      );
      expect(result).toEqual([{ entityId: 'u' }]);
    });

    it('should not update if entity is unchanged', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          uid: 'u',
          name: 'c',
          namespace: 'd',
        },
        spec: {
          x: 'a',
        },
      };

      db.entities.mockResolvedValue({
        entities: [{ entity }],
        pageInfo: { hasNextPage: false },
      });
      db.entityByUid.mockResolvedValue({ entity });
      db.updateEntity.mockResolvedValue({ entity });

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.batchAddOrUpdateEntities([
        { entity, relations: [] },
      ]);

      expect(db.entities).toHaveBeenCalledTimes(1);
      expect(db.entities).toHaveBeenCalledWith(expect.anything(), {
        filter: basicEntityFilter({
          kind: 'b',
          'metadata.namespace': 'd',
          'metadata.name': 'c',
        }),
      });
      expect(db.entityByName).not.toHaveBeenCalled();
      expect(db.entityByUid).not.toHaveBeenCalled();
      expect(db.updateEntity).not.toHaveBeenCalled();
      expect(db.setRelations).toHaveBeenCalledTimes(1);
      expect(db.setRelations).toHaveBeenCalledWith(expect.anything(), 'u', []);
      expect(result).toEqual([{ entityId: 'u' }]);
    });

    it('both adds and updates', async () => {
      const catalog = new DatabaseEntitiesCatalog(
        await DatabaseManager.createTestDatabase(),
        getVoidLogger(),
      );
      const entities: EntityUpsertRequest[] = [];
      for (let i = 0; i < 300; ++i) {
        entities.push({
          entity: {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: `n${i}` },
          },
          relations: [],
        });
      }

      await catalog.batchAddOrUpdateEntities(entities);
      const afterFirst = await catalog.entities();
      expect(afterFirst.entities.length).toBe(300);

      entities[40].entity.metadata.op = 'changed';
      entities.push({
        entity: {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: `n300`, op: 'added' },
        },
        relations: [],
      });

      await catalog.batchAddOrUpdateEntities(entities);
      const afterSecond = await catalog.entities();
      expect(afterSecond.entities.length).toBe(301);
      expect(
        afterSecond.entities.find(e => e.metadata.op === 'changed'),
      ).toBeDefined();
      expect(
        afterSecond.entities.find(e => e.metadata.op === 'added'),
      ).toBeDefined();
    }, 10000);
  });
});
