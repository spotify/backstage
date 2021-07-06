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
  EntityName,
  getEntityName,
  ORIGIN_LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useCallback } from 'react';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';

/**
 * Each distinct state that the dialog can be in at any given time.
 */
export type UseUnregisterEntityDialogState =
  | {
      type: 'loading';
    }
  | {
      type: 'error';
      error: Error;
    }
  | {
      type: 'bootstrap';
      location: string;
      deleteEntity: () => Promise<void>;
    }
  | {
      type: 'unregister';
      location: string;
      colocatedEntities: EntityName[];
      unregisterLocation: () => Promise<void>;
      deleteEntity: () => Promise<void>;
    }
  | {
      type: 'only-delete';
      deleteEntity: () => Promise<void>;
    };

/**
 * Houses the main logic for unregistering entities and their locations.
 */
export function useUnregisterEntityDialogState(
  entity: Entity,
): UseUnregisterEntityDialogState {
  const catalogApi = useApi(catalogApiRef);
  const locationRef = entity.metadata.annotations?.[ORIGIN_LOCATION_ANNOTATION];
  const uid = entity.metadata.uid;
  const isBootstrap = locationRef === 'bootstrap:bootstrap';

  // Load the prerequisite data: what entities that are colocated with us, and
  // what location that spawned us
  const prerequisites = useAsync(async () => {
    const locationPromise = catalogApi.getOriginLocationByEntity(entity);

    let colocatedEntitiesPromise: Promise<Entity[]>;
    if (!locationRef) {
      colocatedEntitiesPromise = Promise.resolve([]);
    } else {
      const locationAnnotationFilter = `metadata.annotations.${ORIGIN_LOCATION_ANNOTATION}`;
      colocatedEntitiesPromise = catalogApi
        .getEntities({
          filter: { [locationAnnotationFilter]: locationRef },
          fields: [
            'kind',
            'metadata.uid',
            'metadata.name',
            'metadata.namespace',
          ],
        })
        .then(response => response.items);
    }

    return Promise.all([locationPromise, colocatedEntitiesPromise]).then(
      ([location, colocatedEntities]) => ({
        location,
        colocatedEntities,
      }),
    );
  }, [catalogApi, entity]);

  // Unregisters the underlying location and removes all of the entities that
  // are spawned from it. Can only ever be called when the prerequisites have
  // finished loading successfully, and if there was a matching location.
  const unregisterLocation = useCallback(
    async function unregisterLocationFn() {
      const { location, colocatedEntities } = prerequisites.value!;
      await catalogApi.removeLocationById(location!.id);
      await Promise.allSettled(
        colocatedEntities.map(e =>
          catalogApi.removeEntityByUid(e.metadata.uid!),
        ),
      );
    },
    [catalogApi, prerequisites],
  );

  // Just removes the entity, without affecting locations in any way.
  const deleteEntity = useCallback(
    async function deleteEntityFn() {
      await catalogApi.removeEntityByUid(uid!);
    },
    [catalogApi, uid],
  );

  // If this is a bootstrap location entity, don't even block on loading
  // prerequisites. We know that all that we will do is to offer to remove the
  // entity, and that doesn't require anything from the prerequisites.
  if (isBootstrap) {
    return { type: 'bootstrap', location: locationRef!, deleteEntity };
  }

  // Return early if prerequisites still loading or failing
  const { loading, error, value } = prerequisites;
  if (loading) {
    return { type: 'loading' };
  } else if (error) {
    return { type: 'error', error };
  }

  const { location, colocatedEntities } = value!;
  if (!location) {
    return { type: 'only-delete', deleteEntity };
  }
  return {
    type: 'unregister',
    location: locationRef!,
    colocatedEntities: colocatedEntities.map(getEntityName),
    unregisterLocation,
    deleteEntity,
  };
}
