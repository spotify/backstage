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
import { createContext } from 'react';
import { FilterGroup, FilterGroupStates } from './types';

export type FilterGroupsContext = {
  register: (
    filterGroupId: string,
    filterGroup: FilterGroup,
    initialSelectedFilterIds?: string[],
  ) => void;
  unregister: (filterGroupId: string) => void;
  setGroupSelectedFilters: (filterGroupId: string, filterIds: string[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  reload: () => Promise<void>;
  selectedCategories: string[];
  loading: boolean;
  error?: Error;
  filterGroupStates: { [filterGroupId: string]: FilterGroupStates };
  filteredEntities: TemplateEntityV1alpha1[];
  availableCategories: string[];
  isCatalogEmpty: boolean;
};

/**
 * The context that maintains shared state for all visible filter groups.
 */
export const filterGroupsContext = createContext<
  FilterGroupsContext | undefined
>(undefined);
