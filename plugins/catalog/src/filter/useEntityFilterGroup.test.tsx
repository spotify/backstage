/*
 * Copyright 2020 Spotify AB
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

import { ApiProvider, ApiRegistry, storageApiRef } from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { MockStorageApi } from '@backstage/test-utils';
import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { EntityFilterGroupsProvider } from './EntityFilterGroupsProvider';
import { FilterGroup, FilterGroupStatesReady } from './types';
import { useEntityFilterGroup } from './useEntityFilterGroup';

describe('useEntityFilterGroup', () => {
  let catalogApi: jest.Mocked<typeof catalogApiRef.T>;
  let wrapper: ({ children }: { children?: React.ReactNode }) => JSX.Element;

  beforeEach(() => {
    catalogApi = {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      addLocation: jest.fn(_a => new Promise(() => {})),
      getEntities: jest.fn(),
      getOriginLocationByEntity: jest.fn(),
      getLocationByEntity: jest.fn(),
      getLocationById: jest.fn(),
      removeLocationById: jest.fn(),
      removeEntityByUid: jest.fn(),
      getEntityByName: jest.fn(),
      getAttachment: jest.fn(),
    };
    const apis = ApiRegistry.with(catalogApiRef, catalogApi).with(
      storageApiRef,
      MockStorageApi.create(),
    );
    wrapper = ({ children }: { children?: React.ReactNode }) => (
      <ApiProvider apis={apis}>
        <EntityFilterGroupsProvider>{children}</EntityFilterGroupsProvider>
      </ApiProvider>
    );
  });

  it('works for an empty set of filters', async () => {
    catalogApi.getEntities.mockResolvedValue({ items: [] });
    const group: FilterGroup = { filters: {} };
    const { result, waitFor } = renderHook(
      () => useEntityFilterGroup('g1', group),
      { wrapper },
    );

    await waitFor(() => expect(result.current.state.type).toBe('ready'));
  });

  it('works for a single group', async () => {
    catalogApi.getEntities.mockResolvedValue({
      items: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'n' },
        },
      ],
    });
    const group: FilterGroup = {
      filters: {
        f1: e => e.metadata.name === 'n',
        f2: e => e.metadata.name !== 'n',
      },
    };
    const { result, waitFor } = renderHook(
      () => useEntityFilterGroup('g1', group),
      { wrapper },
    );

    await waitFor(() => expect(result.current.state.type).toEqual('ready'));
    let state = result.current.state as FilterGroupStatesReady;
    expect(state.state.filters.f1).toEqual({
      isSelected: false,
      matchCount: 1,
    });
    expect(state.state.filters.f2).toEqual({
      isSelected: false,
      matchCount: 0,
    });

    act(() => result.current.setSelectedFilters(['f1']));

    await waitFor(() => expect(result.current.state.type).toEqual('ready'));
    state = result.current.state as FilterGroupStatesReady;
    expect(state.state.filters.f1).toEqual({
      isSelected: true,
      matchCount: 1,
    });
    expect(state.state.filters.f2).toEqual({
      isSelected: false,
      matchCount: 0,
    });

    act(() => result.current.setSelectedFilters(['f2']));

    await waitFor(() => expect(result.current.state.type).toEqual('ready'));
    state = result.current.state as FilterGroupStatesReady;
    expect(state.state.filters.f1).toEqual({
      isSelected: false,
      matchCount: 1,
    });
    expect(state.state.filters.f2).toEqual({
      isSelected: true,
      matchCount: 0,
    });
  });
});
