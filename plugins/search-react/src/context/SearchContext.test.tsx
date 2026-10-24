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

import { analyticsApiRef, configApiRef } from '@backstage/core-plugin-api';
import {
  render,
  screen,
  waitFor,
  act,
  renderHook,
} from '@testing-library/react';
import { mockApis, TestApiProvider } from '@backstage/test-utils';
import {
  SearchContextProvider,
  useSearch,
  useSearchContextCheck,
} from './SearchContext';
import { searchApiRef } from '../api';

describe('SearchContext', () => {
  const searchApiMock = {
    query: jest.fn().mockResolvedValue({}),
  } satisfies typeof searchApiRef.T;

  const wrapper = ({ children, initialState, config = {} }: any) => {
    const configApiMock = mockApis.config({ data: config });
    return (
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchContextProvider initialState={initialState}>
          {children}
        </SearchContextProvider>
      </TestApiProvider>
    );
  };

  const initialState = {
    term: '',
    types: ['*'],
    filters: {},
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Skips the first query when nothing has been searched for', async () => {
    searchApiMock.query.mockResolvedValue({ results: [] });

    const { result } = renderHook(() => useSearch(), { wrapper });

    await waitFor(() => {
      expect(result.current.result.loading).toBe(false);
    });

    expect(result.current.result.value).toBeUndefined();
    expect(searchApiMock.query).not.toHaveBeenCalled();

    await act(async () => {
      result.current.setTerm('term');
    });

    await waitFor(() => {
      expect(result.current.result.value).toEqual({ results: [] });
    });
    expect(searchApiMock.query).toHaveBeenCalledTimes(1);
  });

  it('Passes children', async () => {
    const text = 'text';

    render(wrapper({ children: text, initialState }));

    await waitFor(() => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('Throws error when no context is set', () => {
    expect(() => renderHook(() => useSearch())).toThrow(
      'useSearch must be used within a SearchContextProvider',
    );
  });

  it('Checks whether context is set', async () => {
    const hook = renderHook(() => useSearchContextCheck());

    expect(hook.result.current).toEqual(false);

    const { result } = renderHook(() => useSearchContextCheck(), {
      wrapper: ({ children }) => wrapper({ children, initialState }),
    });

    await waitFor(() => {
      expect(result.current).toEqual(true);
    });
  });

  describe('Uses initial state values', () => {
    it('Uses default initial state values', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current).toEqual(
          expect.objectContaining({
            term: '',
            types: [],
            filters: {},
            pageLimit: undefined,
            pageCursor: undefined,
          }),
        );
      });
    });

    it('Uses provided initial state values', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) => wrapper({ children, initialState }),
      });

      await waitFor(() => {
        expect(result.current).toEqual(expect.objectContaining(initialState));
      });
    });

    it('Uses page limit provided via config api', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) =>
          wrapper({
            children,
            initialState,
            config: {
              search: {
                query: {
                  pageLimit: 100,
                },
              },
            },
          }),
      });

      await waitFor(() => {
        expect(result.current).toEqual(
          expect.objectContaining({ ...initialState, pageLimit: 100 }),
        );
      });
    });
  });

  describe('Resets cursor', () => {
    it('When term is cleared', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) =>
          wrapper({
            children,
            initialState: {
              ...initialState,
              term: 'first term',
              pageCursor: 'SOMEPAGE',
            },
          }),
      });

      await waitFor(() => {
        expect(result.current.term).toEqual('first term');
        expect(result.current.pageCursor).toEqual('SOMEPAGE');
      });

      await act(async () => {
        result.current.setTerm('');
      });

      expect(result.current.pageCursor).toBeUndefined();
    });

    it('When term is set (and different from previous)', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) =>
          wrapper({
            children,
            initialState: {
              ...initialState,
              term: 'first term',
              pageCursor: 'SOMEPAGE',
            },
          }),
      });

      await waitFor(() => {
        expect(result.current.term).toEqual('first term');
        expect(result.current.pageCursor).toEqual('SOMEPAGE');
      });

      await act(async () => {
        result.current.setTerm('second term');
      });

      expect(result.current.pageCursor).toBeUndefined();
    });

    it('When filters are cleared', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) =>
          wrapper({
            children,
            initialState: {
              ...initialState,
              term: 'first term',
              filters: { foo: 'bar' },
              pageCursor: 'SOMEPAGE',
            },
          }),
      });

      await waitFor(() => {
        expect(result.current.filters).toEqual({ foo: 'bar' });
        expect(result.current.pageCursor).toEqual('SOMEPAGE');
      });

      await act(async () => {
        result.current.setFilters({});
      });

      expect(result.current.pageCursor).toBeUndefined();
    });

    it('When filters are set (and different from previous)', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) =>
          wrapper({
            children,
            initialState: {
              ...initialState,
              term: 'first term',
              filters: { foo: 'bar' },
              pageCursor: 'SOMEPAGE',
            },
          }),
      });

      await waitFor(() => {
        expect(result.current.filters).toEqual({ foo: 'bar' });
        expect(result.current.pageCursor).toEqual('SOMEPAGE');
      });

      await act(async () => {
        result.current.setFilters({ foo: 'test' });
      });

      expect(result.current.pageCursor).toBeUndefined();
    });
  });

  describe('Performs search (and sets results)', () => {
    it('When term is set', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) => wrapper({ children, initialState }),
      });

      await waitFor(() => {
        expect(result.current).toEqual(expect.objectContaining(initialState));
      });

      const term = 'term';

      await act(async () => {
        result.current.setTerm(term);
      });

      expect(searchApiMock.query).toHaveBeenLastCalledWith(
        {
          term,
          types: ['*'],
          filters: {},
        },
        { signal: expect.any(AbortSignal) },
      );
    });

    it('When types is set', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) => wrapper({ children, initialState }),
      });

      await waitFor(() => {
        expect(result.current).toEqual(expect.objectContaining(initialState));
      });

      const types = ['type'];

      await act(async () => {
        result.current.setTypes(types);
      });

      expect(searchApiMock.query).toHaveBeenLastCalledWith(
        {
          types,
          term: '',
          filters: {},
        },
        { signal: expect.any(AbortSignal) },
      );
    });

    it('When filters are set', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) => wrapper({ children, initialState }),
      });

      await waitFor(() => {
        expect(result.current).toEqual(expect.objectContaining(initialState));
      });

      const filters = { filter: 'filter' };

      await act(async () => {
        result.current.setFilters(filters);
      });

      expect(searchApiMock.query).toHaveBeenLastCalledWith(
        {
          filters,
          term: '',
          types: ['*'],
        },
        { signal: expect.any(AbortSignal) },
      );
    });

    it('When page limit is set', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) => wrapper({ children, initialState }),
      });

      await waitFor(() => {
        expect(result.current).toEqual(expect.objectContaining(initialState));
      });

      const pageLimit = 30;

      await act(async () => {
        result.current.setPageLimit(pageLimit);
      });

      expect(searchApiMock.query).toHaveBeenLastCalledWith(
        {
          pageLimit,
          term: '',
          types: ['*'],
          filters: {},
        },
        { signal: expect.any(AbortSignal) },
      );
    });

    it('When page cursor is set', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) => wrapper({ children, initialState }),
      });

      await waitFor(() => {
        expect(result.current).toEqual(expect.objectContaining(initialState));
      });

      const pageCursor = 'SOMEPAGE';

      await act(async () => {
        result.current.setPageCursor(pageCursor);
      });

      expect(searchApiMock.query).toHaveBeenLastCalledWith(
        {
          pageCursor,
          term: '',
          types: ['*'],
          filters: {},
        },
        { signal: expect.any(AbortSignal) },
      );
    });

    it('provides function for fetch the next page', async () => {
      searchApiMock.query.mockResolvedValue({
        results: [],
        nextPageCursor: 'NEXT',
      });

      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) => wrapper({ children, initialState }),
      });

      await waitFor(() => {
        expect(result.current).toEqual(expect.objectContaining(initialState));
        expect(result.current.fetchNextPage).toBeDefined();
      });

      expect(result.current.fetchPreviousPage).toBeUndefined();

      await act(async () => {
        result.current.fetchNextPage!();
      });

      expect(searchApiMock.query).toHaveBeenLastCalledWith(
        {
          term: '',
          types: ['*'],
          filters: {},
          pageCursor: 'NEXT',
        },
        { signal: expect.any(AbortSignal) },
      );
    });

    it('provides function for fetch the previous page', async () => {
      searchApiMock.query.mockResolvedValue({
        results: [],
        previousPageCursor: 'PREVIOUS',
      });

      const { result } = renderHook(() => useSearch(), {
        wrapper: ({ children }) => wrapper({ children, initialState }),
      });

      await waitFor(() => {
        expect(result.current).toEqual(expect.objectContaining(initialState));
        expect(result.current.fetchNextPage).toBeUndefined();
        expect(result.current.fetchPreviousPage).toBeDefined();
      });

      await act(async () => {
        result.current.fetchPreviousPage!();
      });

      expect(searchApiMock.query).toHaveBeenLastCalledWith(
        {
          term: '',
          types: ['*'],
          filters: {},
          pageCursor: 'PREVIOUS',
        },
        { signal: expect.any(AbortSignal) },
      );
    });
  });

  describe('analytics', () => {
    const analyticsApiMock = mockApis.analytics();
    const Wrapper = ({ children }: React.PropsWithChildren) => (
      <TestApiProvider
        apis={[
          [configApiRef, mockApis.config()],
          [searchApiRef, searchApiMock],
          [analyticsApiRef, analyticsApiMock],
        ]}
      >
        <SearchContextProvider initialState={initialState}>
          {children}
        </SearchContextProvider>
      </TestApiProvider>
    );

    it('captures analytics events for non-empty term', async () => {
      searchApiMock.query
        .mockResolvedValueOnce({
          results: [],
          numberOfResults: 10,
        })
        .mockResolvedValueOnce({
          results: [],
          numberOfResults: 3,
        })
        .mockResolvedValueOnce({
          results: [],
          numberOfResults: 1,
        });

      // search with empty term
      const { result } = renderHook(() => useSearch(), {
        wrapper: Wrapper,
      });

      await waitFor(() => {
        expect(searchApiMock.query).toHaveBeenCalledWith(
          {
            term: '',
            types: ['*'],
            filters: {},
          },
          { signal: expect.any(AbortSignal) },
        );
        expect(analyticsApiMock.captureEvent).not.toHaveBeenCalled();
      });

      // search with term 'eva'
      await act(async () => {
        result.current.setTerm('eva');
      });

      await waitFor(() => {
        expect(searchApiMock.query).toHaveBeenCalledWith(
          {
            term: 'eva',
            types: ['*'],
            filters: {},
          },
          { signal: expect.any(AbortSignal) },
        );
        expect(analyticsApiMock.captureEvent).toHaveBeenCalledWith({
          action: 'search',
          subject: 'eva',
          value: 3,
          context: {
            extension: 'App',
            pluginId: 'root',
            routeRef: 'unknown',
          },
        });
      });

      // search with new term 'eva.m'
      await act(async () => {
        result.current.setTerm('eva.m');
      });

      await waitFor(() => {
        expect(searchApiMock.query).toHaveBeenCalledWith(
          {
            term: 'eva.m',
            types: ['*'],
            filters: {},
          },
          { signal: expect.any(AbortSignal) },
        );
        expect(analyticsApiMock.captureEvent).toHaveBeenCalledWith({
          action: 'search',
          subject: 'eva.m',
          value: 1,
          context: {
            extension: 'App',
            pluginId: 'root',
            routeRef: 'unknown',
          },
        });
      });
    });

    it('captures analytics events even if number of results does not exist', async () => {
      searchApiMock.query.mockResolvedValue({
        results: [],
      });

      const { result } = renderHook(() => useSearch(), {
        wrapper: Wrapper,
      });

      await waitFor(() => {
        expect(result.current).toEqual(expect.objectContaining(initialState));
      });

      const term = 'term';

      await act(async () => {
        result.current.setTerm(term);
      });

      await waitFor(() => {
        expect(searchApiMock.query).toHaveBeenLastCalledWith(
          {
            term: 'term',
            types: ['*'],
            filters: {},
          },
          { signal: expect.any(AbortSignal) },
        );
        expect(analyticsApiMock.captureEvent).toHaveBeenCalledWith({
          action: 'search',
          subject: 'term',
          value: undefined,
          context: {
            extension: 'App',
            pluginId: 'root',
            routeRef: 'unknown',
          },
        });
      });
    });
  });
});
