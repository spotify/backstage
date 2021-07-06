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

import { Location, LocationSpec } from '@backstage/catalog-model';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import { DbLocationsRow } from './database/tables';
import { getEntityLocationRef } from './processing/util';
import {
  EntityProvider,
  EntityProviderConnection,
  LocationStore,
} from './types';
import { locationSpecToLocationEntity } from './util';

export class DefaultLocationStore implements LocationStore, EntityProvider {
  private _connection: EntityProviderConnection | undefined;

  constructor(private readonly db: Knex) {}

  getProviderName(): string {
    return 'DefaultLocationStore';
  }

  async createLocation(spec: LocationSpec): Promise<Location> {
    const location = await this.db.transaction(async tx => {
      // Attempt to find a previous location matching the spec
      const previousLocations = await this.locations(tx);
      // TODO: when location id's are a compilation of spec target we can remove this full
      // lookup of locations first and just grab the by that instead.
      const previousLocation = previousLocations.some(
        l => spec.type === l.type && spec.target === l.target,
      );
      if (previousLocation) {
        throw new ConflictError(
          `Location ${spec.type}:${spec.target} already exists`,
        );
      }

      const inner: DbLocationsRow = {
        id: uuid(),
        type: spec.type,
        target: spec.target,
      };

      await tx<DbLocationsRow>('locations').insert(inner);

      return inner;
    });
    const entity = locationSpecToLocationEntity(location);
    await this.connection.applyMutation({
      type: 'delta',
      added: [{ entity, locationKey: getEntityLocationRef(entity) }],
      removed: [],
    });

    return location;
  }

  async listLocations(): Promise<Location[]> {
    return await this.locations();
  }

  async getLocation(id: string): Promise<Location> {
    const items = await this.db<DbLocationsRow>('locations')
      .where({ id })
      .select();

    if (!items.length) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
    return items[0];
  }

  async deleteLocation(id: string): Promise<void> {
    if (!this.connection) {
      throw new Error('location store is not initialized');
    }

    const deleted = await this.db.transaction(async tx => {
      const [location] = await tx<DbLocationsRow>('locations')
        .where({ id })
        .select();

      if (!location) {
        throw new NotFoundError(`Found no location with ID ${id}`);
      }

      await tx<DbLocationsRow>('locations').where({ id }).del();
      return location;
    });
    const entity = locationSpecToLocationEntity(deleted);
    await this.connection.applyMutation({
      type: 'delta',
      added: [],
      removed: [{ entity, locationKey: getEntityLocationRef(entity) }],
    });
  }

  private get connection(): EntityProviderConnection {
    if (!this._connection) {
      throw new Error('location store is not initialized');
    }

    return this._connection;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this._connection = connection;

    const locations = await this.locations();

    const entities = locations.map(location => {
      const entity = locationSpecToLocationEntity(location);
      return { entity, locationKey: getEntityLocationRef(entity) };
    });

    await this.connection.applyMutation({
      type: 'full',
      entities,
    });
  }

  private async locations(dbOrTx: Knex.Transaction | Knex = this.db) {
    const locations = await dbOrTx<DbLocationsRow>('locations').select();
    return (
      locations
        // TODO(blam): We should create a mutation to remove this location for everyone
        // eventually when it's all done and dusted
        .filter(({ type }) => type !== 'bootstrap')
        .map(item => ({
          id: item.id,
          target: item.target,
          type: item.type,
        }))
    );
  }
}
