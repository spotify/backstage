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
import {
  Entity,
  Location,
  LocationSpec,
  LOCATION_ANNOTATION,
  ORIGIN_LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import {
  CatalogProcessingOrchestrator,
  DeferredEntity,
} from './processing/types';
import { LocationService, LocationStore } from './types';
import { locationSpecToMetadataName } from './util';

export class DefaultLocationService implements LocationService {
  constructor(
    private readonly store: LocationStore,
    private readonly orchestrator: CatalogProcessingOrchestrator,
  ) {}

  async createLocation(
    spec: LocationSpec,
    dryRun: boolean,
  ): Promise<{ location: Location; entities: Entity[] }> {
    if (dryRun) {
      return this.dryRunCreateLocation(spec);
    }
    const location = await this.store.createLocation(spec);
    return { location, entities: [] };
  }

  listLocations(): Promise<Location[]> {
    return this.store.listLocations();
  }
  getLocation(id: string): Promise<Location> {
    return this.store.getLocation(id);
  }
  deleteLocation(id: string): Promise<void> {
    return this.store.deleteLocation(id);
  }

  private async dryRunCreateLocation(
    spec: LocationSpec,
  ): Promise<{ location: Location; entities: Entity[] }> {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Location',
      metadata: {
        name: locationSpecToMetadataName({
          type: spec.type,
          target: spec.target,
        }),
        namespace: 'default',
        annotations: {
          [LOCATION_ANNOTATION]: `${spec.type}:${spec.target}`,
          [ORIGIN_LOCATION_ANNOTATION]: `${spec.type}:${spec.target}`,
        },
      },
      spec: {
        type: spec.type,
        target: spec.target,
      },
    };
    const unprocessedEntities: DeferredEntity[] = [
      { entity, locationKey: `${spec.type}:${spec.target}` },
    ];
    const entities: Entity[] = [];
    const state = new Map(); // ignored
    while (unprocessedEntities.length) {
      const currentEntity = unprocessedEntities.pop();
      if (!currentEntity) {
        continue;
      }
      const processed = await this.orchestrator.process({
        entity: currentEntity.entity,
        state,
      });

      if (processed.ok) {
        unprocessedEntities.push(...processed.deferredEntities);
        entities.push(processed.completedEntity);
      } else {
        throw Error(processed.errors.map(String).join(', '));
      }
    }

    return {
      location: { ...spec, id: `${spec.type}:${spec.target}` },
      entities,
    };
  }
}
