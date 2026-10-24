/*
 * Copyright 2026 The Backstage Authors
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

import { act, renderHook, waitFor } from '@testing-library/react';
import type { PagePagination, SortDescriptor } from '../types';
import type { CursorParams, OffsetParams, UseTableResult } from './types';
import { useTable } from './useTable';

interface Item {
  id: number;
}

const items = Array.from({ length: 25 }, (_, id) => ({ id }));

function getPagination(result: UseTableResult<Item, unknown>): PagePagination {
  if (result.tableProps.pagination.type !== 'page') {
    throw new Error('Expected page pagination');
  }
  return result.tableProps.pagination;
}

function createOffsetGetData(source: Item[]) {
  return jest.fn(async ({ offset, pageSize }: OffsetParams<unknown>) => ({
    data: source.slice(offset, offset + pageSize),
    totalCount: source.length,
  }));
}

afterEach(() => {
  jest.useRealTimers();
});

describe('useTable', () => {
  it('uses the supplied or default page size when options are empty', () => {
    const suppliedPageSize = renderHook(() =>
      useTable<Item>({
        mode: 'complete',
        data: items,
        paginationOptions: { pageSize: 10, pageSizeOptions: [] },
      }),
    );

    expect(getPagination(suppliedPageSize.result.current)).toMatchObject({
      pageSize: 10,
      pageSizeOptions: [],
    });
    expect(suppliedPageSize.result.current.tableProps.data).toHaveLength(10);

    const defaultPageSize = renderHook(() =>
      useTable<Item>({
        mode: 'complete',
        data: items,
        paginationOptions: { pageSizeOptions: [] },
      }),
    );

    expect(getPagination(defaultPageSize.result.current)).toMatchObject({
      pageSize: 20,
      pageSizeOptions: [],
    });
    expect(defaultPageSize.result.current.tableProps.data).toHaveLength(20);
  });

  it('honors the initial offset in complete mode', () => {
    const { result } = renderHook(() =>
      useTable<Item>({
        mode: 'complete',
        data: items,
        paginationOptions: { pageSize: 10, initialOffset: 10 },
      }),
    );

    expect(result.current.tableProps.data?.map(item => item.id)).toEqual([
      10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    ]);
    expect(result.current.tableProps.pagination).toMatchObject({ offset: 10 });
  });

  it('reports retained controlled data as pending when data becomes undefined', () => {
    const { result, rerender } = renderHook(
      ({ data }: { data: Item[] | undefined }) =>
        useTable<Item>({
          mode: 'complete',
          data,
          paginationOptions: { pageSize: 10 },
        }),
      { initialProps: { data: items as Item[] | undefined } },
    );

    act(() => getPagination(result.current).onNextPage());
    rerender({ data: undefined });

    expect(result.current.tableProps.data?.map(item => item.id)).toEqual(
      Array.from({ length: 10 }, (_, id) => id + 10),
    );
    expect(result.current.tableProps.isPending).toBe(true);
    expect(result.current.tableProps.isStale).toBe(true);
    expect(getPagination(result.current)).toMatchObject({
      offset: 10,
      totalCount: 25,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it('persists a valid offset when complete data shrinks', () => {
    const { result, rerender } = renderHook(
      ({ data }: { data: Item[] }) =>
        useTable<Item>({
          mode: 'complete',
          data,
          paginationOptions: { pageSize: 10 },
        }),
      { initialProps: { data: items } },
    );

    act(() => getPagination(result.current).onNextPage());
    act(() => getPagination(result.current).onNextPage());

    rerender({ data: items.slice(0, 15) });
    expect(result.current.tableProps.pagination).toMatchObject({ offset: 10 });
    expect(result.current.tableProps.data?.map(item => item.id)).toEqual([
      10, 11, 12, 13, 14,
    ]);

    rerender({ data: items });
    expect(result.current.tableProps.pagination).toMatchObject({ offset: 10 });
  });

  it('shows the first page when complete pagination is enabled after mount', () => {
    const { result, rerender } = renderHook(
      ({ paginate }: { paginate: boolean }) =>
        useTable<Item>({
          mode: 'complete',
          data: items,
          paginationOptions: paginate
            ? { type: 'page', pageSize: 10 }
            : { type: 'none' },
        }),
      { initialProps: { paginate: false } },
    );

    rerender({ paginate: true });

    expect(result.current.tableProps.pagination).toMatchObject({
      offset: 0,
      pageSize: 10,
    });
    expect(result.current.tableProps.data?.map(item => item.id)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });

  it('navigates to offset zero from an initial offset', async () => {
    const getData = createOffsetGetData(items);
    const { result } = renderHook(() =>
      useTable<Item>({
        mode: 'offset',
        getData,
        paginationOptions: { pageSize: 10, initialOffset: 10 },
      }),
    );

    await waitFor(() =>
      expect(result.current.tableProps.isPending).toBe(false),
    );
    act(() => getPagination(result.current).onPreviousPage());

    await waitFor(() =>
      expect(result.current.tableProps.data?.[0]?.id).toBe(0),
    );
    expect(getPagination(result.current)).toMatchObject({
      offset: 0,
      hasPreviousPage: false,
    });
  });

  it('navigates with an empty string cursor', async () => {
    const getData = jest.fn(async ({ cursor }: CursorParams<unknown>) => ({
      data: cursor === undefined ? items.slice(0, 10) : items.slice(10, 20),
      nextCursor: cursor === undefined ? '' : undefined,
      totalCount: items.length,
    }));
    const { result } = renderHook(() =>
      useTable<Item>({ mode: 'cursor', getData }),
    );

    await waitFor(() =>
      expect(result.current.tableProps.isPending).toBe(false),
    );
    act(() => getPagination(result.current).onNextPage());

    await waitFor(() =>
      expect(result.current.tableProps.data?.[0]?.id).toBe(10),
    );
  });

  it('renders cache updates from immediately resolving reloads', async () => {
    let source = items;
    const getData = jest.fn(
      async ({ offset, pageSize }: OffsetParams<unknown>) => ({
        data: source.slice(offset, offset + pageSize),
        totalCount: source.length,
      }),
    );
    const { result } = renderHook(() =>
      useTable<Item>({ mode: 'offset', getData }),
    );

    await waitFor(() =>
      expect(result.current.tableProps.isPending).toBe(false),
    );
    source = items.map(item => ({ id: item.id + 100 }));
    await act(async () => {
      result.current.reload();
      await Promise.resolve();
    });

    expect(result.current.tableProps.data?.[0]?.id).toBe(100);
  });

  it('recovers from a failed page after returning to cached data', async () => {
    let failSecondPage = true;
    const getData = jest.fn(
      async ({ offset, pageSize }: OffsetParams<unknown>) => {
        if (offset === 10 && failSecondPage) {
          throw new Error('page failed');
        }
        return {
          data: items.slice(offset, offset + pageSize),
          totalCount: items.length,
        };
      },
    );
    const { result } = renderHook(() =>
      useTable<Item>({
        mode: 'offset',
        getData,
        paginationOptions: { pageSize: 10 },
      }),
    );

    await waitFor(() =>
      expect(result.current.tableProps.isPending).toBe(false),
    );
    act(() => getPagination(result.current).onNextPage());
    await waitFor(() =>
      expect(result.current.tableProps.error?.message).toBe('page failed'),
    );

    act(() => getPagination(result.current).onPreviousPage());
    expect(result.current.tableProps.error).toBeUndefined();
    expect(result.current.tableProps.data?.[0]?.id).toBe(0);

    failSecondPage = false;
    act(() => getPagination(result.current).onNextPage());
    await waitFor(() =>
      expect(result.current.tableProps.data?.[0]?.id).toBe(10),
    );
  });

  it('does not reload when controlled callback identities change', async () => {
    const getData = createOffsetGetData(items);
    const { result, rerender } = renderHook(
      ({ onSortChange }: { onSortChange: (sort: SortDescriptor) => void }) =>
        useTable<Item>({ mode: 'offset', getData, onSortChange }),
      { initialProps: { onSortChange: jest.fn() } },
    );

    await waitFor(() =>
      expect(result.current.tableProps.isPending).toBe(false),
    );
    jest.useFakeTimers();
    rerender({ onSortChange: jest.fn() });

    act(() => jest.advanceTimersByTime(250));
    expect(getData).toHaveBeenCalledTimes(1);
  });
});
