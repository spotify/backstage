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

import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { filterGroupsContext, FilterGroupsContext } from './context';
import {
  EntityFilterFn,
  FilterGroup,
  FilterGroupState,
  FilterGroupStates,
} from './types';
import { useApi } from '@backstage/core-plugin-api';

/**
 * Implementation of the shared filter groups state.
 */
export const EntityFilterGroupsProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const state = useProvideEntityFilters();
  return (
    <filterGroupsContext.Provider value={state}>
      {children}
    </filterGroupsContext.Provider>
  );
};

// The hook that implements the actual context building
function useProvideEntityFilters(): FilterGroupsContext {
  const catalogApi = useApi(catalogApiRef);
  const [{ value: entities, error }, doReload] = useAsyncFn(async () => {
    const response = await catalogApi.getEntities({
      filter: { kind: 'Template' },
    });
    return response.items as TemplateEntityV1alpha1[];
  });

  const filterGroups = useRef<{
    [filterGroupId: string]: FilterGroup;
  }>({});
  const selectedFilterKeys = useRef<{
    [filterGroupId: string]: Set<string>;
  }>({});
  const selectedCategories = useRef<string[]>([]);
  const [filterGroupStates, setFilterGroupStates] = useState<{
    [filterGroupId: string]: FilterGroupStates;
  }>({});
  const [filteredEntities, setFilteredEntities] = useState<
    TemplateEntityV1alpha1[]
  >([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isCatalogEmpty, setCatalogEmpty] = useState<boolean>(false);

  useEffect(() => {
    doReload();
  }, [doReload]);

  const rebuild = useCallback(() => {
    setFilterGroupStates(
      buildStates(
        filterGroups.current,
        selectedFilterKeys.current,
        selectedCategories.current,
        entities,
        error,
      ),
    );
    setFilteredEntities(
      buildMatchingEntities(
        filterGroups.current,
        selectedFilterKeys.current,
        selectedCategories.current,
        entities,
      ),
    );
    setAvailableCategories(collectCategories(entities));
    setCatalogEmpty(entities !== undefined && entities.length === 0);
  }, [entities, error]);

  const register = useCallback(
    (
      filterGroupId: string,
      filterGroup: FilterGroup,
      initialSelectedFilterIds?: string[],
    ) => {
      filterGroups.current[filterGroupId] = filterGroup;
      selectedFilterKeys.current[filterGroupId] = new Set(
        initialSelectedFilterIds ?? [],
      );
      rebuild();
    },
    [rebuild],
  );

  const unregister = useCallback(
    (filterGroupId: string) => {
      delete filterGroups.current[filterGroupId];
      delete selectedFilterKeys.current[filterGroupId];
      rebuild();
    },
    [rebuild],
  );

  const setGroupSelectedFilters = useCallback(
    (filterGroupId: string, filters: string[]) => {
      selectedFilterKeys.current[filterGroupId] = new Set(filters);
      rebuild();
    },
    [rebuild],
  );

  const setSelectedCategories = useCallback(
    (categories: string[]) => {
      selectedCategories.current = categories;
      rebuild();
    },
    [rebuild],
  );

  const reload = useCallback(async () => {
    await doReload();
  }, [doReload]);

  return {
    register,
    unregister,
    setGroupSelectedFilters,
    setSelectedCategories,
    reload,
    selectedCategories: selectedCategories.current,
    loading: !error && !entities,
    error,
    filterGroupStates,
    filteredEntities,
    availableCategories,
    isCatalogEmpty,
  };
}

// Given all filter groups and what filters are actually selected, along with
// the loading state for entities, generate the state of each individual filter
function buildStates(
  filterGroups: { [filterGroupId: string]: FilterGroup },
  selectedFilterKeys: { [filterGroupId: string]: Set<string> },
  selectedCategories: string[],
  entities?: TemplateEntityV1alpha1[],
  error?: Error,
): { [filterGroupId: string]: FilterGroupStates } {
  // On error - all entries are an error state
  if (error) {
    return Object.fromEntries(
      Object.keys(filterGroups).map(filterGroupId => [
        filterGroupId,
        { type: 'error', error },
      ]),
    );
  }

  // On startup - all entries are a loading state
  if (!entities) {
    return Object.fromEntries(
      Object.keys(filterGroups).map(filterGroupId => [
        filterGroupId,
        { type: 'loading' },
      ]),
    );
  }

  const result: { [filterGroupId: string]: FilterGroupStates } = {};
  for (const [filterGroupId, filterGroup] of Object.entries(filterGroups)) {
    const otherMatchingEntities = buildMatchingEntities(
      filterGroups,
      selectedFilterKeys,
      selectedCategories,
      entities,
      filterGroupId,
    );
    const groupState: FilterGroupState = { filters: {} };
    for (const [filterId, filterFn] of Object.entries(filterGroup.filters)) {
      const isSelected = !!selectedFilterKeys[filterGroupId]?.has(filterId);
      const matchCount = otherMatchingEntities.filter(entity =>
        filterFn(entity),
      ).length;
      groupState.filters[filterId] = { isSelected, matchCount };
    }
    result[filterGroupId] = { type: 'ready', state: groupState };
  }

  return result;
}

// Given all entites, find all possible categories and provide them in a sorted list.
function collectCategories(entities?: TemplateEntityV1alpha1[]): string[] {
  const categories = new Set<string>();
  (entities || []).forEach(e => {
    if (e.spec?.type) {
      categories.add(e.spec.type as string);
    }
  });
  return Array.from(categories).sort();
}

// Given all filter groups and what filters are actually selected, extract all
// entities that match all those filter groups.
function buildMatchingEntities(
  filterGroups: { [filterGroupId: string]: FilterGroup },
  selectedFilterKeys: { [filterGroupId: string]: Set<string> },
  selectedCategories: string[],
  entities?: TemplateEntityV1alpha1[],
  excludeFilterGroupId?: string,
): TemplateEntityV1alpha1[] {
  // Build one filter fn per filter group
  const allFilters: EntityFilterFn[] = [];
  for (const [filterGroupId, filterGroup] of Object.entries(filterGroups)) {
    if (excludeFilterGroupId === filterGroupId) {
      continue;
    }

    // Pick out all of the filter functions in the group that are actually
    // selected
    const groupFilters: EntityFilterFn[] = [];
    for (const [filterId, filterFn] of Object.entries(filterGroup.filters)) {
      if (!!selectedFilterKeys[filterGroupId]?.has(filterId)) {
        groupFilters.push(filterFn);
      }
    }

    // Need to match any of the selected filters in the group - if there is
    // any at all
    if (groupFilters.length) {
      allFilters.push(entity => groupFilters.some(fn => fn(entity)));
    }
  }

  // Filter by categories, if at least one category is selected.
  if (selectedCategories.length > 0) {
    allFilters.push(entity =>
      selectedCategories.some(c => entity.spec?.type === c),
    );
  }

  // All filter groups that had any checked filters need to match. Note that
  // every() always returns true for an empty array.
  return entities?.filter(entity => allFilters.every(fn => fn(entity))) ?? [];
}
