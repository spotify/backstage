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
import { Duration, Maybe, PageFilters } from '../../types';
import { MapFiltersToProps } from '../../hooks/useFilters';

type CostOverviewFilterProps = PageFilters & {
  setDuration: (duration: Duration) => void;
  setProject: (project: Maybe<string>) => void;
  setMetric: (metric: Maybe<string>) => void;
};

export const mapFiltersToProps: MapFiltersToProps<CostOverviewFilterProps> = ({
  pageFilters,
  setPageFilters,
}) => ({
  ...pageFilters,
  project: pageFilters.project || 'all',
  setDuration: (duration: Duration) =>
    setPageFilters({
      ...pageFilters,
      duration,
    }),
  setProject: (project: Maybe<string>) =>
    setPageFilters({
      ...pageFilters,
      project: project === 'all' ? null : project,
    }),
  setMetric: (metric: Maybe<string>) =>
    setPageFilters({
      ...pageFilters,
      metric: metric,
    }),
});
