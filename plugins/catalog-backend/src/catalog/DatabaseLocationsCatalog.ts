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

import { Location } from '@backstage/catalog-model';
import type { Database } from '../database';
import {
  DatabaseLocationUpdateLogEvent,
  DatabaseLocationUpdateLogStatus,
} from '../database/types';
import { LocationResponse, LocationsCatalog } from './types';

export class DatabaseLocationsCatalog implements LocationsCatalog {
  constructor(private readonly database: Database) {}

  async addLocation(location: Location): Promise<Location> {
    return await this.database.transaction(
      async tx => await this.database.addLocation(tx, location),
    );
  }

  async removeLocation(id: string): Promise<void> {
    await this.database.transaction(tx => this.database.removeLocation(tx, id));
  }

  async locations(): Promise<LocationResponse[]> {
    const items = await this.database.locations();
    return items.map(({ message, status, timestamp, ...data }) => ({
      currentStatus: {
        message,
        status,
        timestamp,
      },
      data,
    }));
  }

  async locationHistory(id: string): Promise<DatabaseLocationUpdateLogEvent[]> {
    return this.database.locationHistory(id);
  }

  async location(id: string): Promise<LocationResponse> {
    const {
      message,
      status,
      timestamp,
      ...data
    } = await this.database.location(id);
    return {
      currentStatus: {
        message,
        status,
        timestamp,
      },
      data,
    };
  }

  async logUpdateSuccess(
    locationId: string,
    entityName?: string | string[],
  ): Promise<void> {
    await this.database.addLocationUpdateLogEvent(
      locationId,
      DatabaseLocationUpdateLogStatus.SUCCESS,
      entityName,
    );
  }

  async logUpdateFailure(
    locationId: string,
    error?: Error,
    entityName?: string,
  ): Promise<void> {
    await this.database.addLocationUpdateLogEvent(
      locationId,
      DatabaseLocationUpdateLogStatus.FAIL,
      entityName,
      error?.message,
    );
  }
}
