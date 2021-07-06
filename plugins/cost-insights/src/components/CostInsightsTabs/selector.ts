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

import { MapFiltersToProps } from '../../hooks/useFilters';
import { MapLoadingToProps } from '../../hooks/useLoading';
import { Group, PageFilters } from '../../types';
import { getResetStateWithoutInitial } from '../../utils/loading';

type CostInsightsTabsFilterProps = PageFilters & {
  setGroup: (group: Group) => void;
};

type CostInsightsTabsLoadingProps = {
  loadingActions: Array<string>;
  dispatchReset: (loadingActions: string[]) => void;
};

export const mapFiltersToProps: MapFiltersToProps<CostInsightsTabsFilterProps> = ({
  pageFilters,
  setPageFilters,
}) => ({
  ...pageFilters,
  setGroup: (group: Group) =>
    setPageFilters({
      ...pageFilters,
      group: group.id,
      project: null,
    }),
});

export const mapLoadingToProps: MapLoadingToProps<CostInsightsTabsLoadingProps> = ({
  actions,
  dispatch,
}) => ({
  loadingActions: actions,
  dispatchReset: (loadingActions: string[]) =>
    dispatch(getResetStateWithoutInitial(loadingActions)),
});
