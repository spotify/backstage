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

import { Entity } from '@backstage/catalog-model';
import { storageApiRef, useApi } from '@backstage/core-plugin-api';
import { useCallback, useEffect, useState } from 'react';
import { useObservable } from 'react-use';

const buildEntityKey = (component: Entity) =>
  `entity:${component.kind}:${component.metadata.namespace ?? 'default'}:${
    component.metadata.name
  }`;

export const useStarredEntities = () => {
  const storageApi = useApi(storageApiRef);
  const settingsStore = storageApi.forBucket('settings');
  const rawStarredEntityKeys =
    settingsStore.get<string[]>('starredEntities') ?? [];

  const [starredEntities, setStarredEntities] = useState(
    new Set(rawStarredEntityKeys),
  );

  const observedItems = useObservable(
    settingsStore.observe$<string[]>('starredEntities'),
  );

  useEffect(() => {
    if (observedItems?.newValue) {
      const currentValue = observedItems?.newValue ?? [];
      setStarredEntities(new Set(currentValue));
    }
  }, [observedItems?.newValue]);

  const toggleStarredEntity = useCallback(
    (entity: Entity) => {
      const entityKey = buildEntityKey(entity);
      if (starredEntities.has(entityKey)) {
        starredEntities.delete(entityKey);
      } else {
        starredEntities.add(entityKey);
      }

      settingsStore.set('starredEntities', Array.from(starredEntities));
    },
    [starredEntities, settingsStore],
  );

  const isStarredEntity = useCallback(
    (entity: Entity) => {
      const entityKey = buildEntityKey(entity);
      return starredEntities.has(entityKey);
    },
    [starredEntities],
  );

  return {
    starredEntities,
    toggleStarredEntity,
    isStarredEntity,
  };
};
