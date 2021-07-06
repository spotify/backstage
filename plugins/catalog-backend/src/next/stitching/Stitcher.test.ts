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
import { TestDatabases } from '@backstage/backend-test-utils';
import { Entity } from '@backstage/catalog-model';
import { DatabaseManager } from '../database/DatabaseManager';
import {
  DbFinalEntitiesRow,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
  DbSearchRow,
} from '../database/tables';
import { Stitcher } from './Stitcher';

describe('Stitcher', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });
  const logger = getVoidLogger();

  it.each(databases.eachSupportedId())(
    'runs the happy path for %p',
    async databaseId => {
      const db = await databases.init(databaseId);
      await DatabaseManager.createDatabase(db);

      const stitcher = new Stitcher(db, logger);
      let entities: DbFinalEntitiesRow[];
      let entity: Entity;

      await db<DbRefreshStateRow>('refresh_state').insert([
        {
          entity_id: 'my-id',
          entity_ref: 'k:ns/n',
          unprocessed_entity: JSON.stringify({}),
          processed_entity: JSON.stringify({
            apiVersion: 'a',
            kind: 'k',
            metadata: {
              name: 'n',
              namespace: 'ns',
            },
            spec: {
              k: 'v',
            },
          }),
          errors: '[]',
          next_update_at: db.fn.now(),
          last_discovery_at: db.fn.now(),
        },
      ]);
      await db<DbRefreshStateReferencesRow>('refresh_state_references').insert([
        { source_key: 'a', target_entity_ref: 'k:ns/n' },
      ]);
      await db<DbRelationsRow>('relations').insert([
        {
          originating_entity_id: 'my-id',
          source_entity_ref: 'k:ns/n',
          type: 'looksAt',
          target_entity_ref: 'k:ns/other',
        },
        // handles and ignores duplicates
        {
          originating_entity_id: 'my-id',
          source_entity_ref: 'k:ns/n',
          type: 'looksAt',
          target_entity_ref: 'k:ns/other',
        },
      ]);

      await stitcher.stitch(new Set(['k:ns/n']));

      entities = await db<DbFinalEntitiesRow>('final_entities');

      expect(entities.length).toBe(1);
      entity = JSON.parse(entities[0].final_entity!);
      expect(entity).toEqual({
        relations: [
          {
            type: 'looksAt',
            target: {
              kind: 'k',
              namespace: 'ns',
              name: 'other',
            },
          },
        ],
        apiVersion: 'a',
        kind: 'k',
        metadata: {
          name: 'n',
          namespace: 'ns',
          etag: expect.any(String),
          generation: 1,
          uid: 'my-id',
        },
        spec: {
          k: 'v',
        },
      });

      expect(entity.metadata.etag).toEqual(entities[0].hash);
      const firstHash = entities[0].hash;

      const search = await db<DbSearchRow>('search');
      expect(search).toEqual(
        expect.arrayContaining([
          { entity_id: 'my-id', key: 'relations.looksat', value: 'k:ns/other' },
          { entity_id: 'my-id', key: 'apiversion', value: 'a' },
          { entity_id: 'my-id', key: 'kind', value: 'k' },
          { entity_id: 'my-id', key: 'metadata.name', value: 'n' },
          { entity_id: 'my-id', key: 'metadata.namespace', value: 'ns' },
          { entity_id: 'my-id', key: 'metadata.uid', value: 'my-id' },
          { entity_id: 'my-id', key: 'spec.k', value: 'v' },
        ]),
      );

      // Re-stitch without any changes
      await stitcher.stitch(new Set(['k:ns/n']));

      entities = await db<DbFinalEntitiesRow>('final_entities');
      expect(entities.length).toBe(1);
      entity = JSON.parse(entities[0].final_entity!);
      expect(entities[0].hash).toEqual(firstHash);
      expect(entity.metadata.etag).toEqual(firstHash);

      // Now add one more relation and re-stitch
      await db<DbRelationsRow>('relations').insert([
        {
          originating_entity_id: 'my-id',
          source_entity_ref: 'k:ns/n',
          type: 'looksAt',
          target_entity_ref: 'k:ns/third',
        },
      ]);

      await stitcher.stitch(new Set(['k:ns/n']));

      entities = await db<DbFinalEntitiesRow>('final_entities');

      expect(entities.length).toBe(1);
      entity = JSON.parse(entities[0].final_entity!);
      expect(entity).toEqual({
        relations: expect.arrayContaining([
          {
            type: 'looksAt',
            target: {
              kind: 'k',
              namespace: 'ns',
              name: 'other',
            },
          },
          {
            type: 'looksAt',
            target: {
              kind: 'k',
              namespace: 'ns',
              name: 'third',
            },
          },
        ]),
        apiVersion: 'a',
        kind: 'k',
        metadata: {
          name: 'n',
          namespace: 'ns',
          etag: expect.any(String),
          generation: 1,
          uid: 'my-id',
        },
        spec: {
          k: 'v',
        },
      });

      expect(entities[0].hash).not.toEqual(firstHash);
      expect(entities[0].hash).toEqual(entity.metadata.etag);

      expect(await db<DbSearchRow>('search')).toEqual(
        expect.arrayContaining([
          { entity_id: 'my-id', key: 'relations.looksat', value: 'k:ns/other' },
          { entity_id: 'my-id', key: 'relations.looksat', value: 'k:ns/third' },
          { entity_id: 'my-id', key: 'apiversion', value: 'a' },
          { entity_id: 'my-id', key: 'kind', value: 'k' },
          { entity_id: 'my-id', key: 'metadata.name', value: 'n' },
          { entity_id: 'my-id', key: 'metadata.namespace', value: 'ns' },
          { entity_id: 'my-id', key: 'metadata.uid', value: 'my-id' },
          { entity_id: 'my-id', key: 'spec.k', value: 'v' },
        ]),
      );
    },
    60_000,
  );
});
