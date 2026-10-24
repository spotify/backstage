/*
 * Copyright 2022 The Backstage Authors
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

import { isEqual } from 'lodash';
import {
  SetStateAction,
  Dispatch,
  DispatchWithoutAction,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import useAsync, { AsyncState } from 'react-use/esm/useAsync';
import usePrevious from 'react-use/esm/usePrevious';

import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';
import { JsonObject } from '@backstage/types';
import {
  AnalyticsContext,
  useApi,
  configApiRef,
  useAnalytics,
} from '@backstage/core-plugin-api';
import { SearchResultSet } from '@backstage/plugin-search-common';

import { searchApiRef } from '../api';

/**
 *
 * @public
 */
export type SearchContextValue = {
  result: AsyncState<SearchResultSet>;
  setTerm: Dispatch<SetStateAction<string>>;
  setTypes: Dispatch<SetStateAction<string[]>>;
  setFilters: Dispatch<SetStateAction<JsonObject>>;
  setPageLimit: Dispatch<SetStateAction<number | undefined>>;
  setPageCursor: Dispatch<SetStateAction<string | undefined>>;
  fetchNextPage?: DispatchWithoutAction;
  fetchPreviousPage?: DispatchWithoutAction;
} & SearchContextState;

/**
 *
 * @public
 */
export type SearchContextState = {
  term: string;
  types: string[];
  filters: JsonObject;
  pageLimit?: number;
  pageCursor?: string;
};

const SearchContext = createVersionedContext<{
  1: SearchContextValue;
}>('search-context');

/**
 * @public
 *
 * React hook which provides the search context
 */
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchContextProvider');
  }

  const value = context.atVersion(1);
  if (!value) {
    throw new Error('No SearchContext v1 found');
  }
  return value;
};

/**
 * @public
 *
 * React hook which checks for an existing search context
 */
export const useSearchContextCheck = () => {
  const context = useContext(SearchContext);
  return context !== undefined;
};

/**
 * The initial state of `SearchContextProvider`.
 *
 */
const defaultInitialSearchState: SearchContextState = {
  term: '',
  types: [],
  filters: {},
  pageLimit: undefined,
  pageCursor: undefined,
};

const useSearchContextValue = (
  initialValue: SearchContextState = defaultInitialSearchState,
) => {
  const searchApi = useApi(searchApiRef);
  const analytics = useAnalytics();

  const [term, setTerm] = useState<string>(initialValue.term);
  const [types, setTypes] = useState<string[]>(initialValue.types);
  const [filters, setFilters] = useState<JsonObject>(initialValue.filters);
  const [pageLimit, setPageLimit] = useState<number | undefined>(
    initialValue.pageLimit,
  );
  const [pageCursor, setPageCursor] = useState<string | undefined>(
    initialValue.pageCursor,
  );
  const isFirstEmptyMount = useRef(true);

  const prevTerm = usePrevious(term);
  const prevFilters = usePrevious(filters);
  const abortControllerRef = useRef<AbortController | null>(null);

  const result = useAsync(async (): Promise<SearchResultSet | undefined> => {
    if (isFirstEmptyMount.current) {
      isFirstEmptyMount.current = false;
      if (!term && !types.length && !Object.keys(filters).length) {
        return undefined;
      }
    }

    // Here we cancel the previous request before making a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const resultSet = await searchApi.query(
      {
        term,
        types,
        filters,
        pageLimit,
        pageCursor,
      },
      { signal: controller.signal },
    );

    if (term) {
      analytics.captureEvent('search', term, {
        value: resultSet.numberOfResults,
      });
    }
    return resultSet;
  }, [term, types, filters, pageLimit, pageCursor]);

  const hasNextPage =
    !result.loading && !result.error && result.value?.nextPageCursor;
  const hasPreviousPage =
    !result.loading && !result.error && result.value?.previousPageCursor;

  const fetchNextPage = useCallback(() => {
    setPageCursor(result.value?.nextPageCursor);
  }, [result.value?.nextPageCursor]);

  const fetchPreviousPage = useCallback(() => {
    setPageCursor(result.value?.previousPageCursor);
  }, [result.value?.previousPageCursor]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    // Any time a term is reset, we want to start from page 0.
    // Only reset the term if it has been modified by the user at least once, the initial state must not reset the term.
    if (prevTerm !== undefined && term !== prevTerm) {
      setPageCursor(undefined);
    }
  }, [term, prevTerm, setPageCursor]);

  useEffect(() => {
    // Any time filters is reset, we want to start from page 0.
    // Only reset the page if it has been modified by the user at least once, the initial state must not reset the page.
    if (prevFilters !== undefined && !isEqual(filters, prevFilters)) {
      setPageCursor(undefined);
    }
  }, [filters, prevFilters, setPageCursor]);

  const value: SearchContextValue = {
    result,
    term,
    setTerm,
    types,
    setTypes,
    filters,
    setFilters,
    pageLimit,
    setPageLimit,
    pageCursor,
    setPageCursor,
    fetchNextPage: hasNextPage ? fetchNextPage : undefined,
    fetchPreviousPage: hasPreviousPage ? fetchPreviousPage : undefined,
  };

  return value;
};

export type LocalSearchContextProps = PropsWithChildren<{
  initialState?: SearchContextState;
}>;

const LocalSearchContext = (props: SearchContextProviderProps) => {
  const { initialState, children } = props;
  const value = useSearchContextValue(initialState);

  return (
    <AnalyticsContext
      attributes={{ searchTypes: value.types.sort().join(',') }}
    >
      <SearchContext.Provider value={createVersionedValueMap({ 1: value })}>
        {children}
      </SearchContext.Provider>
    </AnalyticsContext>
  );
};

/**
 * Props for {@link SearchContextProvider}
 *
 * @public
 */
export type SearchContextProviderProps =
  | PropsWithChildren<{
      /**
       * State initialized by a local context.
       */
      initialState?: SearchContextState;
      /**
       * Do not create an inheritance from the parent, as a new initial state must be defined in a local context.
       */
      inheritParentContextIfAvailable?: never;
    }>
  | PropsWithChildren<{
      /**
       * Does not accept initial state since it is already initialized by parent context.
       */
      initialState?: never;
      /**
       * If true, don't create a child context if there is a parent one already defined.
       * @remarks Defaults to false.
       */
      inheritParentContextIfAvailable?: boolean;
    }>;

/**
 * @public
 * Search context provider which gives you access to shared state between search components
 */
export const SearchContextProvider = (props: SearchContextProviderProps) => {
  const { initialState, inheritParentContextIfAvailable, children } = props;
  const hasParentContext = useSearchContextCheck();

  const configApi = useApi(configApiRef);

  const propsInitialSearchState = initialState ?? {};

  const configInitialSearchState = configApi.has('search.query.pageLimit')
    ? { pageLimit: configApi.getNumber('search.query.pageLimit') }
    : {};

  const searchContextInitialState = {
    ...defaultInitialSearchState,
    ...propsInitialSearchState,
    ...configInitialSearchState,
  };

  return hasParentContext && inheritParentContextIfAvailable ? (
    <>{children}</>
  ) : (
    <LocalSearchContext initialState={searchContextInitialState}>
      {children}
    </LocalSearchContext>
  );
};
