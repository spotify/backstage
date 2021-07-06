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

import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert } from '@material-ui/lab';
import { Maybe, PageFilters, ProductFilters } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  stringify,
  validate,
  getInitialPageState,
  getInitialProductState,
} from '../utils/history';
import { useGroups } from './useGroups';
import { useConfig } from './useConfig';

export type FilterContextProps = {
  pageFilters: PageFilters;
  productFilters: ProductFilters;
  setPageFilters: Dispatch<SetStateAction<Maybe<PageFilters>>>;
  setProductFilters: Dispatch<SetStateAction<Maybe<ProductFilters>>>;
};

export type MapFiltersToProps<T> = (props: FilterContextProps) => T;

export const FilterContext = React.createContext<
  FilterContextProps | undefined
>(undefined);

export const FilterProvider = ({ children }: PropsWithChildren<{}>) => {
  const config = useConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const groups = useGroups();
  const [error, setError] = useState<Maybe<Error>>(null);
  const [pageFilters, setPageFilters] = useState<Maybe<PageFilters>>(null);
  const [productFilters, setProductFilters] = useState<Maybe<ProductFilters>>(
    null,
  );

  useEffect(() => {
    async function setPageFiltersFromLocation() {
      try {
        // strip extraneous parameters, validate and transform
        const queryParams = await validate(location.search);
        const defaultMetric = config.metrics.find(m => m.default)?.kind ?? null;

        // Group or project parameters should override defaults
        const initialPageState = getInitialPageState(groups, queryParams);
        const initialProductState = getInitialProductState(config);

        setProductFilters(initialProductState);
        setPageFilters({ ...initialPageState, metric: defaultMetric });
      } catch (e) {
        setError(e);
      }
    }

    setPageFiltersFromLocation();
  }, [groups]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function setLocationFromPageFilters(filters: PageFilters) {
      const queryString = stringify({
        group: filters.group,
        ...(filters.project ? { project: filters.project } : {}),
      });
      // TODO Remove workaround once issue is resolved in react-router
      // (https://github.com/ReactTraining/react-router/issues/7496)
      // navigate({ ...location, search: queryString });
      navigate({ ...location, search: `?${queryString}` });
    }

    if (pageFilters) {
      setLocationFromPageFilters(pageFilters);
    }
  }, [pageFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  // Wait for filters to load
  if (!pageFilters || !productFilters) {
    return null;
  }

  return (
    <FilterContext.Provider
      value={{ pageFilters, productFilters, setPageFilters, setProductFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export function useFilters<T>(mapFiltersToProps: MapFiltersToProps<T>): T {
  const context = useContext(FilterContext);
  return context ? mapFiltersToProps(context) : assertNever();
}

function assertNever(): never {
  throw Error('Cannot use useFilters outside of FilterProvider');
}
