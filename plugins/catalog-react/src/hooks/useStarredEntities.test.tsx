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

import React, { PropsWithChildren } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useStarredEntities } from './useStarredEntities';
import { storageApiRef, StorageApi } from '@backstage/core-plugin-api';
import { MockErrorApi } from '@backstage/test-utils';
import { Entity } from '@backstage/catalog-model';
import { ApiProvider, ApiRegistry, WebStorage } from '@backstage/core-app-api';

describe('useStarredEntities', () => {
  let mockStorage: StorageApi | undefined;

  const mockEntity: Entity = {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock',
    },
  };

  const secondMockEntity: Entity = {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      namespace: 'test',
      name: 'mock2',
    },
  };

  const wrapper = ({ children }: PropsWithChildren<{}>) => {
    return (
      <ApiProvider apis={ApiRegistry.with(storageApiRef, mockStorage)}>
        {children}
      </ApiProvider>
    );
  };

  beforeEach(() => {
    mockStorage = new WebStorage('@backstage', new MockErrorApi()).forBucket(
      Date.now().toString(), // TODO(blam): need something that changes every test run for now until the MockStorage is implemented
    );
  });
  it('should return an empty set for when there is no items in storage', async () => {
    const { result } = renderHook(() => useStarredEntities(), { wrapper });

    expect(result.current.starredEntities.size).toBe(0);
  });
  it('should return a set with the current items when there are items in storage', async () => {
    const expectedIds = ['i', 'am', 'some', 'test', 'ids'];
    const store = mockStorage?.forBucket('settings');
    await store?.set('starredEntities', expectedIds);

    const { result } = renderHook(() => useStarredEntities(), { wrapper });

    for (const item of expectedIds) {
      expect(result.current.starredEntities.has(item)).toBeTruthy();
    }
  });
  it('should listen to changes when the storage is set elsewhere', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useStarredEntities(),
      { wrapper },
    );

    expect(result.current.starredEntities.size).toBe(0);
    expect(result.current.isStarredEntity(mockEntity)).toBeFalsy();

    // Make this happen after awaiting for the next update so we can
    // catch when the hook re-renders with the latest data
    setTimeout(() => result.current.toggleStarredEntity(mockEntity), 1);

    await waitForNextUpdate();

    expect(result.current.starredEntities.size).toBe(1);
    expect(result.current.isStarredEntity(mockEntity)).toBeTruthy();
  });

  it('should write new entries to the local store when adding a toggling entity', async () => {
    const { result } = renderHook(() => useStarredEntities(), { wrapper });

    act(() => {
      result.current.toggleStarredEntity(mockEntity);
    });

    expect(result.current.isStarredEntity(mockEntity)).toBeTruthy();
    expect(result.current.isStarredEntity(secondMockEntity)).toBeFalsy();
  });

  it('should remove an existing entity when toggling entries', async () => {
    const { result } = renderHook(() => useStarredEntities(), { wrapper });

    act(() => {
      result.current.toggleStarredEntity(mockEntity);
      result.current.toggleStarredEntity(secondMockEntity);
      result.current.toggleStarredEntity(mockEntity);
    });

    expect(result.current.isStarredEntity(mockEntity)).toBeFalsy();
    expect(result.current.isStarredEntity(secondMockEntity)).toBeTruthy();
  });
});
