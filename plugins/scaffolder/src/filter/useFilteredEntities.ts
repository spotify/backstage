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

import { useContext } from 'react';
import { filterGroupsContext } from './context';

/**
 * Hook that exposes the result of applying a set of filter groups.
 */
export function useFilteredEntities() {
  const context = useContext(filterGroupsContext);
  if (!context) {
    throw new Error(`Must be used inside an EntityFilterGroupsProvider`);
  }

  return {
    loading: context.loading,
    error: context.error,
    filteredEntities: context.filteredEntities,
    availableCategories: context.availableCategories,
    isCatalogEmpty: context.isCatalogEmpty,
    reload: context.reload,
  };
}
