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
import { Entity, Location, LocationSpec } from '@backstage/catalog-model';
import { EntitiesCatalog, LocationsCatalog } from '../catalog';
import { LocationUpdateStatus } from '../catalog/types';
import { DatabaseLocationUpdateLogStatus } from '../database/types';
import { HigherOrderOperations } from './HigherOrderOperations';
import { LocationReader } from './types';

describe('HigherOrderOperations', () => {
  let entitiesCatalog: jest.Mocked<EntitiesCatalog>;
  let locationsCatalog: jest.Mocked<LocationsCatalog>;
  let locationReader: jest.Mocked<LocationReader>;
  let higherOrderOperation: HigherOrderOperations;

  beforeAll(() => {
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
    locationReader = {
      read: jest.fn(),
    };
    higherOrderOperation = new HigherOrderOperations(
      entitiesCatalog,
      locationsCatalog,
      locationReader,
      getVoidLogger(),
    );
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('addLocation', () => {
    it('just inserts the location when there are no entities to read', async () => {
      const spec = {
        type: 'a',
        target: 'b',
      };
      locationsCatalog.addLocation.mockImplementation(x => Promise.resolve(x));
      locationsCatalog.locations.mockResolvedValue([]);
      locationReader.read.mockResolvedValue({
        entities: [],
        errors: [],
      });

      const result = await higherOrderOperation.addLocation(spec);

      expect(result.location).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          ...spec,
        }),
      );
      expect(result.entities).toEqual([]);
      expect(locationsCatalog.locations).toBeCalledTimes(1);
      expect(locationReader.read).toBeCalledTimes(1);
      expect(locationReader.read).toBeCalledWith({ type: 'a', target: 'b' });
      expect(entitiesCatalog.batchAddOrUpdateEntities).not.toBeCalled();
      expect(locationsCatalog.addLocation).toBeCalledTimes(1);
      expect(locationsCatalog.addLocation).toBeCalledWith(
        expect.objectContaining({
          id: expect.anything(),
          ...spec,
        }),
      );
    });

    it('insert the location and its entities', async () => {
      const spec = {
        type: 'a',
        target: 'b',
      };
      const location: LocationSpec = { type: '', target: '' };
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: { name: 'n' },
      };
      locationsCatalog.addLocation.mockImplementation(x => Promise.resolve(x));
      locationsCatalog.locations.mockResolvedValue([]);
      locationsCatalog.locations.mockResolvedValue([]);
      entitiesCatalog.batchAddOrUpdateEntities.mockResolvedValue([
        {
          entityId: 'id',
          entity,
        },
      ]);

      locationReader.read.mockResolvedValue({
        entities: [
          {
            location,
            entity,
            relations: [],
          },
        ],
        errors: [],
      });

      const result = await higherOrderOperation.addLocation(spec);

      expect(result.location).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          ...spec,
        }),
      );
      expect(result.entities).toEqual([entity]);
      expect(locationsCatalog.locations).toBeCalledTimes(1);
      expect(locationsCatalog.addLocation).toBeCalledTimes(1);
      expect(locationsCatalog.addLocation).toBeCalledWith(
        expect.objectContaining({
          id: expect.anything(),
          ...spec,
        }),
      );
      expect(locationReader.read).toBeCalledTimes(1);
      expect(locationReader.read).toBeCalledWith({ type: 'a', target: 'b' });
      expect(entitiesCatalog.batchAddOrUpdateEntities).toBeCalledTimes(1);
      expect(entitiesCatalog.batchAddOrUpdateEntities).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          locationId: expect.anything(),
          dryRun: false,
          outputEntities: true,
        }),
      );
    });

    it('reuses the location if a match already existed', async () => {
      const spec = {
        type: 'a',
        target: 'b',
      };
      const location = {
        id: 'dd12620d-0436-422f-93bd-929aa0788123',
        ...spec,
      };

      locationsCatalog.locations.mockResolvedValue([
        {
          currentStatus: { timestamp: '', status: '', message: '' },
          data: location,
        },
      ]);
      locationReader.read.mockResolvedValue({
        entities: [],
        errors: [],
      });

      const result = await higherOrderOperation.addLocation(spec);

      expect(result.location).toEqual(location);
      expect(result.entities).toEqual([]);
      expect(locationsCatalog.locations).toBeCalledTimes(1);
      expect(locationReader.read).toBeCalledTimes(1);
      expect(locationReader.read).toBeCalledWith({ type: 'a', target: 'b' });
      expect(entitiesCatalog.batchAddOrUpdateEntities).not.toBeCalled();
      expect(locationsCatalog.addLocation).not.toBeCalled();
    });

    it('rejects the whole operation if any entity could not be read', async () => {
      const spec = {
        type: 'a',
        target: 'b',
      };
      const location: LocationSpec = { type: '', target: '' };
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: { name: 'n' },
      };

      locationsCatalog.locations.mockResolvedValue([]);
      locationReader.read.mockResolvedValue({
        entities: [{ entity, location, relations: [] }],
        errors: [{ error: new Error('abcd'), location }],
      });

      await expect(higherOrderOperation.addLocation(spec)).rejects.toThrow(
        /abcd/,
      );
      expect(locationsCatalog.locations).toBeCalledTimes(1);
      expect(entitiesCatalog.batchAddOrUpdateEntities).not.toBeCalled();
      expect(locationsCatalog.addLocation).not.toBeCalled();
    });

    it('rollback everything after a dry run', async () => {
      const spec = {
        type: 'a',
        target: 'b',
      };
      const location: LocationSpec = { type: '', target: '' };
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: { name: 'n' },
      };
      locationsCatalog.locations.mockResolvedValue([]);
      locationsCatalog.locations.mockResolvedValue([]);
      entitiesCatalog.batchAddOrUpdateEntities.mockResolvedValue([
        {
          entityId: 'id',
          entity,
        },
      ]);
      locationReader.read.mockResolvedValue({
        entities: [
          {
            location,
            entity,
            relations: [],
          },
        ],
        errors: [],
      });

      const result = await higherOrderOperation.addLocation(spec, {
        dryRun: true,
      });

      expect(result.location).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          ...spec,
        }),
      );
      expect(result.entities).toEqual([entity]);
      expect(locationsCatalog.locations).toBeCalledTimes(1);
      expect(locationReader.read).toBeCalledTimes(1);
      expect(locationReader.read).toBeCalledWith({ type: 'a', target: 'b' });
      expect(entitiesCatalog.batchAddOrUpdateEntities).toBeCalledTimes(1);
      expect(entitiesCatalog.batchAddOrUpdateEntities).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          dryRun: true,
          outputEntities: true,
        }),
      );
    });
  });

  describe('refreshLocations', () => {
    it('works with no locations added', async () => {
      locationsCatalog.locations.mockResolvedValue([]);

      await expect(
        higherOrderOperation.refreshAllLocations(),
      ).resolves.toBeUndefined();

      expect(locationsCatalog.locations).toHaveBeenCalledTimes(1);
      expect(locationReader.read).not.toHaveBeenCalled();
      expect(entitiesCatalog.batchAddOrUpdateEntities).not.toHaveBeenCalled();
    });

    it('can update a single location where a matching entity did not exist', async () => {
      const locationStatus: LocationUpdateStatus = {
        message: '',
        status: DatabaseLocationUpdateLogStatus.SUCCESS,
        timestamp: new Date(314159265).toISOString(),
      };
      const location: Location = {
        id: '123',
        type: 'some',
        target: 'thing',
      };
      const desc: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'c1' },
        spec: { type: 'service' },
      };
      const entityId = 'xyz123';

      locationsCatalog.locations.mockResolvedValue([
        { currentStatus: locationStatus, data: location },
      ]);
      locationReader.read.mockResolvedValue({
        entities: [{ entity: desc, location, relations: [] }],
        errors: [],
      });
      entitiesCatalog.batchAddOrUpdateEntities.mockResolvedValue([
        { entityId },
      ]);

      await expect(
        higherOrderOperation.refreshAllLocations(),
      ).resolves.toBeUndefined();

      expect(locationsCatalog.locations).toHaveBeenCalledTimes(1);
      expect(locationReader.read).toHaveBeenCalledTimes(1);
      expect(locationReader.read).toHaveBeenNthCalledWith(1, {
        type: 'some',
        target: 'thing',
      });
      expect(entitiesCatalog.batchAddOrUpdateEntities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.batchAddOrUpdateEntities).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            entity: expect.objectContaining({ metadata: { name: 'c1' } }),
            relations: [],
          }),
        ],
        {
          locationId: '123',
        },
      );
    });

    it('logs successful updates', async () => {
      const locationStatus: LocationUpdateStatus = {
        message: '',
        status: DatabaseLocationUpdateLogStatus.SUCCESS,
        timestamp: new Date(314159265).toISOString(),
      };
      const location: Location = {
        id: '123',
        type: 'some',
        target: 'thing',
      };
      const desc: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'c1' },
        spec: { type: 'service' },
      };

      locationsCatalog.locations.mockResolvedValue([
        { currentStatus: locationStatus, data: location },
      ]);
      locationReader.read.mockResolvedValue({
        entities: [{ entity: desc, location, relations: [] }],
        errors: [],
      });
      entitiesCatalog.entities.mockResolvedValue({
        entities: [],
        pageInfo: { hasNextPage: false },
      });
      entitiesCatalog.batchAddOrUpdateEntities.mockResolvedValue([]);

      await expect(
        higherOrderOperation.refreshAllLocations(),
      ).resolves.toBeUndefined();

      expect(locationsCatalog.logUpdateSuccess).toHaveBeenCalledTimes(2);
      expect(locationsCatalog.logUpdateSuccess).toHaveBeenCalledWith(
        '123',
        undefined,
      );
      expect(locationsCatalog.logUpdateSuccess).toHaveBeenCalledWith('123', [
        'c1',
      ]);
    });

    it('logs unsuccessful updates when reader fails', async () => {
      const locationStatus: LocationUpdateStatus = {
        message: '',
        status: DatabaseLocationUpdateLogStatus.SUCCESS,
        timestamp: new Date(314159265).toISOString(),
      };
      const location: Location = {
        id: '123',
        type: 'some',
        target: 'thing',
      };

      locationsCatalog.locations.mockResolvedValue([
        { currentStatus: locationStatus, data: location },
      ]);
      locationReader.read.mockRejectedValue(new Error('reader error message'));

      await expect(
        higherOrderOperation.refreshAllLocations(),
      ).resolves.toBeUndefined();

      expect(locationReader.read).toHaveBeenCalledTimes(1);
      expect(locationsCatalog.logUpdateFailure).toHaveBeenCalledTimes(1);
      expect(locationsCatalog.logUpdateSuccess).not.toHaveBeenCalled();
      expect(locationsCatalog.logUpdateFailure).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({ message: 'reader error message' }),
      );
    });
  });
});
