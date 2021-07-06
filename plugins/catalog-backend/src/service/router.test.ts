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
import { ConfigReader } from '@backstage/config';
import { NotFoundError } from '@backstage/errors';
import type { Entity, LocationSpec } from '@backstage/catalog-model';
import express from 'express';
import request from 'supertest';
import { EntitiesCatalog, LocationsCatalog } from '../catalog';
import { LocationResponse } from '../catalog/types';
import { HigherOrderOperation } from '../ingestion/types';
import { createRouter } from './router';
import { basicEntityFilter } from './request';

describe('createRouter readonly disabled', () => {
  let entitiesCatalog: jest.Mocked<EntitiesCatalog>;
  let locationsCatalog: jest.Mocked<LocationsCatalog>;
  let higherOrderOperation: jest.Mocked<HigherOrderOperation>;
  let app: express.Express;

  beforeAll(async () => {
    entitiesCatalog = {
      entities: jest.fn(),
      removeEntityByUid: jest.fn(),
      batchAddOrUpdateEntities: jest.fn(),
    };
    locationsCatalog = {
      addLocation: jest.fn(),
      removeLocation: jest.fn(),
      locations: jest.fn(),
      location: jest.fn(),
      locationHistory: jest.fn(),
      logUpdateSuccess: jest.fn(),
      logUpdateFailure: jest.fn(),
    };
    higherOrderOperation = {
      addLocation: jest.fn(),
      refreshAllLocations: jest.fn(),
    };
    const router = await createRouter({
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      logger: getVoidLogger(),
      config: new ConfigReader(undefined),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /entities', () => {
    it('happy path: lists entities', async () => {
      const entities: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.entities.mockResolvedValueOnce({
        entities: [entities[0]],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(entities);
    });

    it('parses single and multiple request parameters and passes them down', async () => {
      entitiesCatalog.entities.mockResolvedValueOnce({
        entities: [],
        pageInfo: { hasNextPage: false },
      });
      const response = await request(app).get(
        '/entities?filter=a=1,a=2,b=3&filter=c=4',
      );

      expect(response.status).toEqual(200);
      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: {
          anyOf: [
            {
              allOf: [
                { key: 'a', matchValueIn: ['1', '2'] },
                { key: 'b', matchValueIn: ['3'] },
              ],
            },
            { allOf: [{ key: 'c', matchValueIn: ['4'] }] },
          ],
        },
      });
    });
  });

  describe('GET /entities/by-uid/:uid', () => {
    it('can fetch entity by uid', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
        },
      };
      entitiesCatalog.entities.mockResolvedValue({
        entities: [entity],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities/by-uid/zzz');

      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: basicEntityFilter({ 'metadata.uid': 'zzz' }),
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expect.objectContaining(entity));
    });

    it('responds with a 404 for missing entities', async () => {
      entitiesCatalog.entities.mockResolvedValue({
        entities: [],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities/by-uid/zzz');

      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: basicEntityFilter({ 'metadata.uid': 'zzz' }),
      });
      expect(response.status).toEqual(404);
      expect(response.text).toMatch(/uid/);
    });
  });

  describe('GET /entities/by-name/:kind/:namespace/:name', () => {
    it('can fetch entity by name', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'k',
        metadata: {
          name: 'n',
          namespace: 'ns',
        },
      };
      entitiesCatalog.entities.mockResolvedValue({
        entities: [entity],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities/by-name/k/ns/n');

      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: basicEntityFilter({
          kind: 'k',
          'metadata.namespace': 'ns',
          'metadata.name': 'n',
        }),
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expect.objectContaining(entity));
    });

    it('responds with a 404 for missing entities', async () => {
      entitiesCatalog.entities.mockResolvedValue({
        entities: [],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities/by-name/b/d/c');

      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: basicEntityFilter({
          kind: 'b',
          'metadata.namespace': 'd',
          'metadata.name': 'c',
        }),
      });
      expect(response.status).toEqual(404);
      expect(response.text).toMatch(/name/);
    });
  });

  describe('POST /entities', () => {
    it('requires a body', async () => {
      const response = await request(app)
        .post('/entities')
        .set('Content-Type', 'application/json')
        .send();

      expect(entitiesCatalog.batchAddOrUpdateEntities).not.toHaveBeenCalled();
      expect(response.status).toEqual(400);
      expect(response.text).toMatch(/body/);
    });

    it('passes the body down', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
      };

      entitiesCatalog.batchAddOrUpdateEntities.mockResolvedValue([
        { entityId: 'u' },
      ]);
      entitiesCatalog.entities.mockResolvedValue({
        entities: [entity],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app)
        .post('/entities')
        .send(entity)
        .set('Content-Type', 'application/json');

      expect(entitiesCatalog.batchAddOrUpdateEntities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.batchAddOrUpdateEntities).toHaveBeenCalledWith([
        { entity, relations: [] },
      ]);
      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: basicEntityFilter({ 'metadata.uid': 'u' }),
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(entity);
    });
  });

  describe('DELETE /entities/by-uid/:uid', () => {
    it('can remove', async () => {
      entitiesCatalog.removeEntityByUid.mockResolvedValue(undefined);

      const response = await request(app).delete('/entities/by-uid/apa');

      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledWith('apa');
      expect(response.status).toEqual(204);
    });

    it('responds with a 404 for missing entities', async () => {
      entitiesCatalog.removeEntityByUid.mockRejectedValue(
        new NotFoundError('nope'),
      );

      const response = await request(app).delete('/entities/by-uid/apa');

      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledWith('apa');
      expect(response.status).toEqual(404);
    });
  });

  describe('GET /locations', () => {
    it('happy path: lists locations', async () => {
      const locations: LocationResponse[] = [
        {
          currentStatus: { timestamp: '', status: '', message: '' },
          data: { id: 'a', type: 'b', target: 'c' },
        },
      ];
      locationsCatalog.locations.mockResolvedValueOnce(locations);

      const response = await request(app).get('/locations');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(locations);
    });
  });

  describe('POST /locations', () => {
    it('rejects malformed locations', async () => {
      const spec = ({
        typez: 'b',
        target: 'c',
      } as unknown) as LocationSpec;

      const response = await request(app).post('/locations').send(spec);

      expect(higherOrderOperation.addLocation).not.toHaveBeenCalled();
      expect(response.status).toEqual(400);
    });

    it('passes the body down', async () => {
      const spec: LocationSpec = {
        type: 'b',
        target: 'c',
      };

      higherOrderOperation.addLocation.mockResolvedValue({
        location: { id: 'a', ...spec },
        entities: [],
      });

      const response = await request(app).post('/locations').send(spec);

      expect(higherOrderOperation.addLocation).toHaveBeenCalledTimes(1);
      expect(higherOrderOperation.addLocation).toHaveBeenCalledWith(spec, {
        dryRun: false,
      });
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          location: { id: 'a', ...spec },
        }),
      );
    });

    it('supports dry run', async () => {
      const spec: LocationSpec = {
        type: 'b',
        target: 'c',
      };

      higherOrderOperation.addLocation.mockResolvedValue({
        location: { id: 'a', ...spec },
        entities: [],
      });

      const response = await request(app)
        .post('/locations?dryRun=true')
        .send(spec);

      expect(higherOrderOperation.addLocation).toHaveBeenCalledTimes(1);
      expect(higherOrderOperation.addLocation).toHaveBeenCalledWith(spec, {
        dryRun: true,
      });
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          location: { id: 'a', ...spec },
        }),
      );
    });
  });
});

describe('createRouter readonly enabled', () => {
  let entitiesCatalog: jest.Mocked<EntitiesCatalog>;
  let locationsCatalog: jest.Mocked<LocationsCatalog>;
  let higherOrderOperation: jest.Mocked<HigherOrderOperation>;
  let app: express.Express;

  beforeAll(async () => {
    entitiesCatalog = {
      entities: jest.fn(),
      removeEntityByUid: jest.fn(),
      batchAddOrUpdateEntities: jest.fn(),
    };
    locationsCatalog = {
      addLocation: jest.fn(),
      removeLocation: jest.fn(),
      locations: jest.fn(),
      location: jest.fn(),
      locationHistory: jest.fn(),
      logUpdateSuccess: jest.fn(),
      logUpdateFailure: jest.fn(),
    };
    higherOrderOperation = {
      addLocation: jest.fn(),
      refreshAllLocations: jest.fn(),
    };
    const router = await createRouter({
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      logger: getVoidLogger(),
      config: new ConfigReader({
        catalog: {
          readonly: true,
        },
      }),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /entities', () => {
    it('happy path: lists entities', async () => {
      const entities: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.entities.mockResolvedValueOnce({
        entities: [entities[0]],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(entities);
    });
  });

  describe('POST /entities', () => {
    it('is not allowed', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
      };

      const response = await request(app)
        .post('/entities')
        .set('Content-Type', 'application/json')
        .send(entity);

      expect(entitiesCatalog.batchAddOrUpdateEntities).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
      expect(response.text).toMatch(/not allowed in readonly/);
    });
  });

  describe('DELETE /entities/by-uid/:uid', () => {
    // this delete is allowed as there is no other way to remove entities
    it('is allowed', async () => {
      const response = await request(app).delete('/entities/by-uid/apa');

      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledWith('apa');
      expect(response.status).toEqual(204);
    });
  });

  describe('GET /locations', () => {
    it('happy path: lists locations', async () => {
      const locations: LocationResponse[] = [
        {
          currentStatus: { timestamp: '', status: '', message: '' },
          data: { id: 'a', type: 'b', target: 'c' },
        },
      ];
      locationsCatalog.locations.mockResolvedValueOnce(locations);

      const response = await request(app).get('/locations');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(locations);
    });
  });

  describe('POST /locations', () => {
    it('is not allowed', async () => {
      const spec: LocationSpec = {
        type: 'b',
        target: 'c',
      };

      const response = await request(app).post('/locations').send(spec);

      expect(higherOrderOperation.addLocation).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
      expect(response.text).toMatch(/not allowed in readonly/);
    });

    it('supports dry run', async () => {
      const spec: LocationSpec = {
        type: 'b',
        target: 'c',
      };

      higherOrderOperation.addLocation.mockResolvedValue({
        location: { id: 'a', ...spec },
        entities: [],
      });

      const response = await request(app)
        .post('/locations?dryRun=true')
        .send(spec);

      expect(higherOrderOperation.addLocation).toHaveBeenCalledTimes(1);
      expect(higherOrderOperation.addLocation).toHaveBeenCalledWith(spec, {
        dryRun: true,
      });
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          location: { id: 'a', ...spec },
        }),
      );
    });
  });
});
