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

import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createVersionedContextForTesting } from '../lib/versionedValues';
import { useRouteRef } from './useRouteRef';
import { createRouteRef } from './RouteRef';

describe('v1 consumer', () => {
  const context = createVersionedContextForTesting('routing-context');

  afterEach(() => {
    context.reset();
  });

  it('should resolve routes', () => {
    const resolve = jest.fn(() => () => '/hello');
    context.set({ 1: { resolve } });

    const routeRef = createRouteRef({ id: 'ref1' });

    const renderedHook = renderHook(() => useRouteRef(routeRef), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/my-page']} children={children} />
      ),
    });

    const routeFunc = renderedHook.result.current;
    expect(routeFunc()).toBe('/hello');
    expect(resolve).toHaveBeenCalledWith(
      routeRef,
      expect.objectContaining({
        pathname: '/my-page',
      }),
    );
  });
});
