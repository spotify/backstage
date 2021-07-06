/*
 * Copyright 2021 The Backstage Authors
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

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';

import { useSearch, SearchContextProvider } from './SearchContext';

import { useApi } from '@backstage/core-plugin-api';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn(),
}));

describe('SearchContext', () => {
  const query = jest.fn();

  const wrapper = ({ children, initialState }: any) => (
    <SearchContextProvider initialState={initialState}>
      {children}
    </SearchContextProvider>
  );

  const initialState = {
    term: '',
    pageCursor: '',
    filters: {},
    types: ['*'],
  };

  beforeEach(() => {
    query.mockResolvedValue({});
    (useApi as jest.Mock).mockReturnValue({ query: query });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Passes children', async () => {
    const text = 'text';

    render(
      <SearchContextProvider initialState={initialState}>
        {text}
      </SearchContextProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('Throws error when no context is set', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.error).toEqual(
      Error('useSearch must be used within a SearchContextProvider'),
    );
  });

  it('Uses initial state values', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
      wrapper,
      initialProps: {
        initialState,
      },
    });

    await waitForNextUpdate();

    expect(result.current).toEqual(expect.objectContaining(initialState));
  });

  it('Resets cursor when term is set (and different from previous)', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
      wrapper,
      initialProps: {
        initialState: {
          ...initialState,
          pageCursor: '1',
        },
      },
    });

    await waitForNextUpdate();

    expect(result.current.pageCursor).toBe('1');

    act(() => {
      result.current.setTerm('first term');
    });

    await waitForNextUpdate();

    expect(result.current.pageCursor).toBe('1');

    act(() => {
      result.current.setTerm('second term');
    });

    await waitForNextUpdate();

    expect(result.current.pageCursor).toBe('');
  });

  describe('Performs search (and sets results)', () => {
    it('When term is set', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState,
        },
      });

      await waitForNextUpdate();

      const term = 'term';

      act(() => {
        result.current.setTerm(term);
      });

      await waitForNextUpdate();

      expect(query).toHaveBeenLastCalledWith({
        ...initialState,
        term,
      });
    });

    it('When filters are set', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState,
        },
      });

      await waitForNextUpdate();

      const filters = { filter: 'filter' };

      act(() => {
        result.current.setFilters(filters);
      });

      await waitForNextUpdate();

      expect(query).toHaveBeenLastCalledWith({
        ...initialState,
        filters,
      });
    });

    it('When pageCursor is set', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState,
        },
      });

      await waitForNextUpdate();

      const pageCursor = 'pageCursor';

      act(() => {
        result.current.setPageCursor(pageCursor);
      });

      await waitForNextUpdate();

      expect(query).toHaveBeenLastCalledWith({
        ...initialState,
        pageCursor,
      });
    });

    it('When types is set', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useSearch(), {
        wrapper,
        initialProps: {
          initialState,
        },
      });

      await waitForNextUpdate();

      const types = ['type'];

      act(() => {
        result.current.setTypes(types);
      });

      await waitForNextUpdate();

      expect(query).toHaveBeenLastCalledWith({
        ...initialState,
        types,
      });
    });
  });
});
