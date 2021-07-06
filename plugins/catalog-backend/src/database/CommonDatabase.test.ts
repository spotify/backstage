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

import { Entity, Location, parseEntityRef } from '@backstage/catalog-model';
import { ConflictError } from '@backstage/errors';
import { basicEntityFilter } from '../service/request';
import { DatabaseManager } from './DatabaseManager';
import type {
  DbEntityRequest,
  DbEntityResponse,
  DbLocationsRowWithStatus,
} from './types';
import { Database, DatabaseLocationUpdateLogStatus } from './types';

const bootstrapLocation = {
  id: expect.any(String),
  type: 'bootstrap',
  target: 'bootstrap',
  message: null,
  status: null,
  timestamp: null,
};

describe('CommonDatabase', () => {
  let db: Database;
  let entityRequest: DbEntityRequest;
  let entityResponse: DbEntityResponse;

  beforeEach(async () => {
    db = await DatabaseManager.createTestDatabase();

    entityRequest = {
      entity: {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
          labels: { e: 'f' },
          annotations: { g: 'h' },
        },
        spec: { i: 'j' },
      },
      relations: [],
    };

    entityResponse = {
      locationId: undefined,
      entity: {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          uid: expect.anything(),
          etag: expect.anything(),
          generation: expect.anything(),
          name: 'c',
          namespace: 'd',
          labels: { e: 'f' },
          annotations: {
            g: 'h',
          },
        },
        spec: { i: 'j' },
      },
    };
  });

  it('manages locations', async () => {
    const input: Location = {
      id: 'dd12620d-0436-422f-93bd-929aa0788123',
      type: 'a',
      target: 'b',
    };
    const output: DbLocationsRowWithStatus = {
      id: 'dd12620d-0436-422f-93bd-929aa0788123',
      type: 'a',
      target: 'b',
      message: null,
      status: null,
      timestamp: null,
    };

    await db.transaction(async tx => await db.addLocation(tx, input));

    const locations = await db.locations();
    expect(locations).toEqual(
      expect.arrayContaining([output, bootstrapLocation]),
    );
    const location = await db.location(
      locations.find(l => l.type !== 'bootstrap')!.id,
    );
    expect(location).toEqual(output);

    // If we add 2 new update log events,
    // this should not result in location duplication
    // due to incorrect join in DB
    await db.addLocationUpdateLogEvent(
      'dd12620d-0436-422f-93bd-929aa0788123',
      DatabaseLocationUpdateLogStatus.SUCCESS,
    );

    // Have a second in-between
    // To avoid having same timestamp on event
    await new Promise(res => setTimeout(res, 1000));
    await db.addLocationUpdateLogEvent(
      'dd12620d-0436-422f-93bd-929aa0788123',
      DatabaseLocationUpdateLogStatus.FAIL,
    );

    await expect(db.locations()).resolves.toEqual(
      expect.arrayContaining([
        bootstrapLocation,
        {
          ...output,
          status: DatabaseLocationUpdateLogStatus.FAIL,
          timestamp: expect.anything(),
        },
      ]),
    );

    await db.transaction(tx => db.removeLocation(tx, location.id));

    await expect(db.locations()).resolves.toEqual([bootstrapLocation]);
    await expect(db.location(location.id)).rejects.toThrow(/Found no location/);
  });

  it('refuses to remove the bootstrap location', async () => {
    const input: Location = {
      id: 'dd12620d-0436-422f-93bd-929aa0788123',
      type: 'bootstrap',
      target: 'bootstrap',
    };

    const output = await db.transaction(
      async tx => await db.addLocation(tx, input),
    );

    await expect(
      db.transaction(async tx => await db.removeLocation(tx, output.id)),
    ).rejects.toThrow(ConflictError);
  });

  describe('addEntities', () => {
    it('happy path: adds entities to empty database', async () => {
      const result = await db.transaction(tx =>
        db.addEntities(tx, [entityRequest]),
      );
      expect(result).toEqual([entityResponse]);
    });

    it('rejects adding the same-named entity twice', async () => {
      const req: DbEntityRequest[] = [
        {
          entity: {
            apiVersion: 'av1',
            kind: 'k1',
            metadata: { name: 'n1', namespace: 'ns1' },
          },
          relations: [],
        },
        {
          entity: {
            apiVersion: 'av1',
            kind: 'k1',
            metadata: { name: 'n1', namespace: 'ns1' },
          },
          relations: [],
        },
      ];
      await expect(
        db.transaction(tx => db.addEntities(tx, req)),
      ).rejects.toThrow(ConflictError);
    });

    it('rejects adding the almost-same-namespace entity twice', async () => {
      const req: DbEntityRequest[] = [
        {
          entity: {
            apiVersion: 'av1',
            kind: 'k1',
            metadata: { name: 'n1', namespace: 'ns1' },
          },
          relations: [],
        },
        {
          entity: {
            apiVersion: 'av1',
            kind: 'k1',
            metadata: { name: 'n1', namespace: 'nS1' },
          },
          relations: [],
        },
      ];
      await expect(
        db.transaction(tx => db.addEntities(tx, req)),
      ).rejects.toThrow(ConflictError);
    });

    it('accepts adding the same-named entity twice if on different namespaces', async () => {
      const req: DbEntityRequest[] = [
        {
          entity: {
            apiVersion: 'av1',
            kind: 'k1',
            metadata: { name: 'n1', namespace: 'ns1' },
          },
          relations: [],
        },
        {
          entity: {
            apiVersion: 'av1',
            kind: 'k1',
            metadata: { name: 'n1', namespace: 'ns2' },
          },
          relations: [],
        },
      ];
      await expect(
        db.transaction(tx => db.addEntities(tx, req)),
      ).resolves.toEqual([
        {
          entity: expect.objectContaining({
            metadata: expect.objectContaining({
              namespace: 'ns1',
              uid: expect.any(String),
              etag: expect.any(String),
              generation: expect.any(Number),
            }),
          }),
        },
        {
          entity: expect.objectContaining({
            metadata: expect.objectContaining({
              namespace: 'ns2',
              uid: expect.any(String),
              etag: expect.any(String),
              generation: expect.any(Number),
            }),
          }),
        },
      ]);
    });
  });

  describe('locationHistory', () => {
    it('outputs the history correctly', async () => {
      const location: Location = {
        id: 'dd12620d-0436-422f-93bd-929aa0788123',
        type: 'a',
        target: 'b',
      };

      await db.transaction(async tx => await db.addLocation(tx, location));

      await db.addLocationUpdateLogEvent(
        'dd12620d-0436-422f-93bd-929aa0788123',
        DatabaseLocationUpdateLogStatus.SUCCESS,
      );
      await db.addLocationUpdateLogEvent(
        'dd12620d-0436-422f-93bd-929aa0788123',
        DatabaseLocationUpdateLogStatus.FAIL,
        undefined,
        'Something went wrong',
      );

      const result = await db.locationHistory(
        'dd12620d-0436-422f-93bd-929aa0788123',
      );
      expect(result).toEqual(
        expect.arrayContaining([
          {
            created_at: expect.anything(),
            entity_name: null,
            id: expect.anything(),
            location_id: 'dd12620d-0436-422f-93bd-929aa0788123',
            message: null,
            status: DatabaseLocationUpdateLogStatus.SUCCESS,
          },
          {
            created_at: expect.anything(),
            entity_name: null,
            id: expect.anything(),
            location_id: 'dd12620d-0436-422f-93bd-929aa0788123',
            message: 'Something went wrong',
            status: DatabaseLocationUpdateLogStatus.FAIL,
          },
        ]),
      );
    });
  });

  describe('updateEntity', () => {
    it('can read and no-op-update an entity', async () => {
      const [added] = await db.transaction(tx =>
        db.addEntities(tx, [entityRequest]),
      );
      const updated = await db.transaction(tx =>
        db.updateEntity(tx, { entity: added.entity, relations: [] }),
      );
      expect(updated.entity.apiVersion).toEqual(added.entity.apiVersion);
      expect(updated.entity.kind).toEqual(added.entity.kind);
      expect(updated.entity.metadata.etag).toEqual(added.entity.metadata.etag);
      expect(updated.entity.metadata.generation).toEqual(
        added.entity.metadata.generation,
      );
      expect(updated.entity.metadata.name).toEqual(added.entity.metadata.name);
      expect(updated.entity.metadata.namespace).toEqual(
        added.entity.metadata.namespace,
      );
    });

    it('can update name if uid matches', async () => {
      const [added] = await db.transaction(tx =>
        db.addEntities(tx, [entityRequest]),
      );
      added.entity.metadata.name! = 'new!';
      const updated = await db.transaction(tx =>
        db.updateEntity(tx, { entity: added.entity, relations: [] }),
      );
      expect(updated.entity.metadata.name).toEqual('new!');
    });

    it('fails to update an entity if etag does not match', async () => {
      const [added] = await db.transaction(tx =>
        db.addEntities(tx, [entityRequest]),
      );
      await expect(
        db.transaction(tx =>
          db.updateEntity(
            tx,
            { entity: added.entity, relations: [] },
            'garbage',
          ),
        ),
      ).rejects.toThrow(ConflictError);
    });

    it('fails to update an entity if generation does not match', async () => {
      const [added] = await db.transaction(tx =>
        db.addEntities(tx, [entityRequest]),
      );
      await expect(
        db.transaction(tx =>
          db.updateEntity(
            tx,
            { entity: added.entity, relations: [] },
            undefined,
            1e20,
          ),
        ),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('entities', () => {
    it('can get all entities with empty filters list', async () => {
      const e1: Entity = {
        apiVersion: 'a',
        kind: 'k1',
        metadata: { name: 'n' },
      };
      const e2: Entity = {
        apiVersion: 'c',
        kind: 'k2',
        metadata: { name: 'n' },
        spec: { c: null },
      };
      await db.transaction(async tx => {
        await db.addEntities(tx, [
          { entity: e1, relations: [] },
          { entity: e2, relations: [] },
        ]);
      });
      const result = await db.transaction(async tx => db.entities(tx));
      expect(result.entities.length).toEqual(2);
      expect(result.entities).toEqual(
        expect.arrayContaining([
          {
            locationId: undefined,
            entity: expect.objectContaining({ kind: 'k1' }),
          },
          {
            locationId: undefined,
            entity: expect.objectContaining({ kind: 'k2' }),
          },
        ]),
      );
    });

    it('can get all specific entities for matching filters (naive case)', async () => {
      const entities: Entity[] = [
        { apiVersion: 'a', kind: 'k1', metadata: { name: 'n' } },
        {
          apiVersion: 'a',
          kind: 'k2',
          metadata: { name: 'n' },
          spec: { c: 'some' },
        },
        {
          apiVersion: 'a',
          kind: 'k3',
          metadata: { name: 'n' },
          spec: { c: null },
        },
      ];

      await db.transaction(async tx => {
        await db.addEntities(
          tx,
          entities.map(entity => ({ entity, relations: [] })),
        );
      });

      const response = await db.transaction(async tx =>
        db.entities(tx, {
          filter: basicEntityFilter({ kind: 'k2', 'spec.c': 'some' }),
        }),
      );

      expect(response.entities).toEqual([
        {
          locationId: undefined,
          entity: expect.objectContaining({ kind: 'k2' }),
        },
      ]);
    });

    it('can get all specific entities for matching filters case insensitively', async () => {
      const entities: Entity[] = [
        {
          apiVersion: 'A',
          kind: 'K1',
          metadata: { name: 'N' },
          spec: { c: 'SOME' },
        },
        {
          apiVersion: 'a',
          kind: 'k2',
          metadata: { name: 'n' },
          spec: { c: 'Some' },
        },
        {
          apiVersion: 'a',
          kind: 'k3',
          metadata: { name: 'n' },
          spec: { c: 'somE' },
        },
      ];

      await db.transaction(async tx => {
        await db.addEntities(
          tx,
          entities.map(entity => ({ entity, relations: [] })),
        );
      });

      const rows = await db.transaction(async tx =>
        db.entities(tx, {
          filter: basicEntityFilter({ ApiVersioN: 'A', 'spEc.C': 'some' }),
        }),
      );

      expect(rows.entities.length).toEqual(3);
      expect(rows.entities).toEqual(
        expect.arrayContaining([
          {
            locationId: undefined,
            entity: expect.objectContaining({ kind: 'K1' }),
          },
          {
            locationId: undefined,
            entity: expect.objectContaining({ kind: 'k2' }),
          },
          {
            locationId: undefined,
            entity: expect.objectContaining({ kind: 'k3' }),
          },
        ]),
      );
    });
  });

  describe('setRelations', () => {
    it('adds a relation for an entity', async () => {
      const mockRelations = [
        {
          source: {
            kind: entityRequest.entity.kind,
            namespace: entityRequest.entity.metadata.namespace!,
            name: entityRequest.entity.metadata.name,
          },
          target: {
            kind: 'component',
            namespace: 'asd',
            name: 'bleb',
          },
          type: 'child',
        },
      ];

      const entityId = await db.transaction(async tx => {
        const [{ entity }] = await db.addEntities(tx, [entityRequest]);

        await db.setRelations(tx, entity?.metadata?.uid!, mockRelations);
        return entity.metadata.uid;
      });

      const returnedEntity1 = await db.transaction(tx =>
        db.entityByUid(tx, entityId!),
      );
      expect(returnedEntity1?.entity.relations).toEqual([
        { target: mockRelations[0].target, type: 'child' },
      ]);

      const returnedEntity2 = await db.transaction(tx =>
        db.entityByName(tx, mockRelations[0].source),
      );
      expect(returnedEntity2?.entity.relations).toEqual([
        { target: mockRelations[0].target, type: 'child' },
      ]);

      const { entities } = await db.transaction(tx => db.entities(tx));
      const [returnedEntity3] = entities;
      expect(returnedEntity3?.entity.relations).toEqual([
        { target: mockRelations[0].target, type: 'child' },
      ]);
    });

    function makeRelation(source: string, type: string, target: string) {
      return {
        source: parseEntityRef(source, {
          defaultKind: 'x',
          defaultNamespace: 'x',
        }),
        type,
        target: parseEntityRef(target, {
          defaultKind: 'x',
          defaultNamespace: 'x',
        }),
      };
    }

    it('should not allow setting relations on nonexistent entities', async () => {
      await expect(
        db.transaction(async tx => {
          await db.setRelations(tx, 'nonexistent', [
            makeRelation('a:b/c', 'rel1', 'x:y/z'),
          ]);
        }),
      ).rejects.toThrow(/constraint failed/);
    });

    it('should allow setting relations on nonexistent entities without any relations', async () => {
      await expect(
        db.transaction(async tx => {
          await db.setRelations(tx, 'nonexistent', []);
        }),
      ).resolves.toBeUndefined();
    });

    it('adds multiple relations for entities', async () => {
      const entity1 = {
        apiVersion: 'v1',
        kind: 'a',
        metadata: {
          name: 'c',
          namespace: 'b',
        },
      };
      const entity2 = {
        apiVersion: 'v1',
        kind: 'x',
        metadata: {
          name: 'z',
          namespace: 'y',
        },
      };
      const fromEntity1 = [
        makeRelation('a:b/c', 'rel1', 'x:y/z'),
        makeRelation('x:y/z', 'rel2', 'a:b/c'),
        makeRelation('a:b/c', 'rel2', 'x:y/z'),
      ];
      const fromEntity2 = [
        makeRelation('a:b/c', 'rel4', 'x:y/z'),
        makeRelation('a:b/c', 'rel5', 'x:y/z'),
        makeRelation('x:y/z', 'rel6', 'a:b/c'),
        // relations don't have to reference the originating entity, so this should be fine, but not show up
        makeRelation('g:h/i', 'rel8', 'd:e/f'),
      ];

      const { id2: secondEntityId } = await db.transaction(async tx => {
        const [{ entity: e1 }, { entity: e2 }] = await db.addEntities(tx, [
          { entity: entity1, relations: [] },
          { entity: entity2, relations: [] },
        ]);
        const id1 = e1?.metadata?.uid!;
        const id2 = e2?.metadata?.uid!;

        await db.setRelations(tx, id1, fromEntity1);
        await db.setRelations(tx, id2, fromEntity2);

        return { id1, id2 };
      });

      const res = await db.transaction(tx => db.entities(tx));
      expect(
        res.entities.map(r => ({
          name: r.entity.metadata.name,
          relations: r.entity.relations,
        })),
      ).toEqual([
        {
          name: 'c',
          relations: [
            {
              type: 'rel1',
              target: { kind: 'x', namespace: 'y', name: 'z' },
            },
            {
              type: 'rel2',
              target: { kind: 'x', namespace: 'y', name: 'z' },
            },
            {
              type: 'rel4',
              target: { kind: 'x', namespace: 'y', name: 'z' },
            },
            {
              type: 'rel5',
              target: { kind: 'x', namespace: 'y', name: 'z' },
            },
          ],
        },
        {
          name: 'z',
          relations: [
            {
              type: 'rel2',
              target: { kind: 'a', namespace: 'b', name: 'c' },
            },
            {
              type: 'rel6',
              target: { kind: 'a', namespace: 'b', name: 'c' },
            },
          ],
        },
      ]);

      await db.transaction(tx => db.removeEntityByUid(tx, secondEntityId));

      const res2 = await db.transaction(tx => db.entities(tx));
      expect(
        res2.entities.map(r => ({
          name: r.entity.metadata.name,
          relations: r.entity.relations,
        })),
      ).toEqual([
        {
          name: 'c',
          relations: [
            {
              type: 'rel1',
              target: { kind: 'x', namespace: 'y', name: 'z' },
            },
            {
              type: 'rel2',
              target: { kind: 'x', namespace: 'y', name: 'z' },
            },
          ],
        },
      ]);
    });
  });

  describe('entityByName', () => {
    it('can get entities case insensitively', async () => {
      const entities: Entity[] = [
        {
          apiVersion: 'a',
          kind: 'k1',
          metadata: { name: 'n' },
        },
        {
          apiVersion: 'B',
          kind: 'K2',
          metadata: { name: 'N', namespace: 'NS' },
        },
      ];

      await db.transaction(async tx => {
        await db.addEntities(
          tx,
          entities.map(entity => ({ entity, relations: [] })),
        );
      });

      const e1 = await db.transaction(async tx =>
        db.entityByName(tx, { kind: 'k1', namespace: 'default', name: 'n' }),
      );
      expect(e1!.entity.metadata.name).toEqual('n');
      const e2 = await db.transaction(async tx =>
        db.entityByName(tx, { kind: 'k2', namespace: 'nS', name: 'n' }),
      );
      expect(e2!.entity.metadata.name).toEqual('N');
      const e3 = await db.transaction(async tx =>
        db.entityByName(tx, { kind: 'unknown', namespace: 'nS', name: 'n' }),
      );
      expect(e3).toBeUndefined();
    });
  });
});
