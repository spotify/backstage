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

import { useCallback, useContext, useEffect, useMemo } from 'react';
import { filterGroupsContext } from './context';
import { FilterGroup, FilterGroupStates } from './types';

export type EntityFilterGroupOutput = {
  state: FilterGroupStates;
  setSelectedFilters: (filterIds: string[]) => void;
};

/**
 * Hook that exposes the relevant data and operations for a single filter
 * group.
 */
export const useEntityFilterGroup = (
  filterGroupId: string,
  filterGroup: FilterGroup,
  initialSelectedFilters?: string[],
): EntityFilterGroupOutput => {
  const context = useContext(filterGroupsContext);
  if (!context) {
    throw new Error(`Must be used inside an EntityFilterGroupsProvider`);
  }
  const {
    register,
    unregister,
    setGroupSelectedFilters,
    filterGroupStates,
  } = context;

  // Intentionally consider initial set only at mount time
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialMemo = useMemo(() => initialSelectedFilters?.slice(), []);

  // Register the group on mount, and unregister on unmount
  useEffect(() => {
    register(filterGroupId, filterGroup, initialMemo);
    return () => unregister(filterGroupId);
  }, [register, unregister, filterGroupId, filterGroup, initialMemo]);

  const setSelectedFilters = useCallback(
    (filters: string[]) => {
      setGroupSelectedFilters(filterGroupId, filters);
    },
    [setGroupSelectedFilters, filterGroupId],
  );

  let state = filterGroupStates[filterGroupId];
  if (!state) {
    state = { type: 'loading' };
  }

  return { state, setSelectedFilters };
};
