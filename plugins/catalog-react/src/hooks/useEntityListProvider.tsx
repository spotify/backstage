/*
 * Copyright 2020 Spotify AB
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
import { useApi } from '@backstage/core';
import { compact, isEqual } from 'lodash';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useAsyncFn, useDebounce } from 'react-use';
import { catalogApiRef } from '../api';
import {
  EntityFilter,
  EntityKindFilter,
  EntityTagFilter,
  EntityTypeFilter,
  UserListFilter,
} from '../types';
import { reduceCatalogFilters, reduceEntityFilters } from '../utils';

export type DefaultEntityFilters = {
  kind?: EntityKindFilter;
  type?: EntityTypeFilter;
  user?: UserListFilter;
  tags?: EntityTagFilter;
};

export type EntityListContextProps<
  EntityFilters extends DefaultEntityFilters = DefaultEntityFilters
> = {
  /**
   * The currently registered filters, adhering to the shape of DefaultEntityFilters or an extension
   * of that default (to add custom filter types).
   */
  filters: EntityFilters;

  /**
   * The resolved list of catalog entities, after all filters are applied.
   */
  entities: Entity[];

  /**
   * The resolved list of catalog entities, after _only catalog-backend_ filters are applied.
   */
  backendEntities: Entity[];

  /**
   * Update one or more of the registered filters. Optional filters can be set to `undefined` to
   * reset the filter.
   */
  updateFilters: (
    filters:
      | Partial<EntityFilters>
      | ((prevFilters: EntityFilters) => Partial<EntityFilters>),
  ) => void;

  loading: boolean;
  error?: Error;
};

export const EntityListContext = createContext<
  EntityListContextProps<any> | undefined
>(undefined);

type OutputState<EntityFilters extends DefaultEntityFilters> = {
  appliedFilters: EntityFilters;
  entities: Entity[];
  backendEntities: Entity[];
};

export const EntityListProvider = <EntityFilters extends DefaultEntityFilters>({
  children,
}: PropsWithChildren<{}>) => {
  const catalogApi = useApi(catalogApiRef);
  const [requestedFilters, setRequestedFilters] = useState<EntityFilters>(
    {} as EntityFilters,
  );
  const [outputState, setOutputState] = useState<OutputState<EntityFilters>>({
    appliedFilters: {} as EntityFilters,
    entities: [],
    backendEntities: [],
  });

  // The main async filter worker. Note that while it has a lot of dependencies
  // in terms of its implementation, the triggering only happens (debounced)
  // based on the requested filters changing.
  const [{ loading, error }, refresh] = useAsyncFn(async () => {
    const compacted = compact(Object.values(requestedFilters));
    const entityFilter = reduceEntityFilters(compacted);
    const backendFilter = reduceCatalogFilters(compacted);
    const previousBackendFilter = reduceCatalogFilters(
      compact(Object.values(outputState.appliedFilters)),
    );

    if (!isEqual(previousBackendFilter, backendFilter)) {
      // TODO(timbonicus): should limit fields here, but would need filter
      // fields + table columns
      const response = await catalogApi.getEntities({ filter: backendFilter });
      setOutputState({
        appliedFilters: requestedFilters,
        backendEntities: response.items,
        entities: response.items.filter(entityFilter),
      });
    } else {
      setOutputState({
        appliedFilters: requestedFilters,
        backendEntities: outputState.backendEntities,
        entities: outputState.backendEntities.filter(entityFilter),
      });
    }
  }, [catalogApi, requestedFilters, outputState]);

  // Slight debounce on the refresh, since (especially on page load) several
  // filters will be calling this in rapid succession.
  useDebounce(refresh, 10, [requestedFilters]);

  const updateFilters = useCallback(
    (
      update:
        | Partial<EntityFilter>
        | ((prevFilters: EntityFilters) => Partial<EntityFilters>),
    ) => {
      setRequestedFilters(prevFilters => {
        const newFilters =
          typeof update === 'function' ? update(prevFilters) : update;
        return { ...prevFilters, ...newFilters };
      });
    },
    [],
  );

  return (
    <EntityListContext.Provider
      value={{
        filters: outputState.appliedFilters,
        entities: outputState.entities,
        backendEntities: outputState.backendEntities,
        updateFilters,
        loading,
        error,
      }}
    >
      {children}
    </EntityListContext.Provider>
  );
};

export function useEntityListProvider<
  EntityFilters extends DefaultEntityFilters
>(): EntityListContextProps<EntityFilters> {
  const context = useContext(EntityListContext);
  if (!context)
    throw new Error(
      'useEntityListProvider must be used within EntityListProvider',
    );
  return context;
}
