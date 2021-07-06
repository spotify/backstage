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

import React, { useContext, Context } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { VersionedValue } from '../lib/versionedValues';
import { getGlobalSingleton } from '../lib/globalObject';
import { AppContext as AppContextV1 } from './types';
import { AppContextProvider } from './AppContext';

describe('v1 consumer', () => {
  const AppContext = getGlobalSingleton<
    Context<VersionedValue<{ 1: AppContextV1 }>>
  >('app-context');

  function useMockAppV1(): AppContextV1 {
    const impl = useContext(AppContext)?.atVersion(1);
    if (!impl) {
      throw new Error('no impl');
    }
    return impl;
  }

  it('should provide an app context', () => {
    const mockContext: AppContextV1 = {
      getPlugins: jest.fn(),
      getComponents: jest.fn(),
      getSystemIcon: jest.fn(),
    };

    const renderedHook = renderHook(() => useMockAppV1(), {
      wrapper: ({ children }) => (
        <AppContextProvider appContext={mockContext} children={children} />
      ),
    });
    const result = renderedHook.result.current;

    expect(mockContext.getPlugins).toHaveBeenCalledTimes(0);
    result.getPlugins();
    expect(mockContext.getPlugins).toHaveBeenCalledTimes(1);

    expect(mockContext.getComponents).toHaveBeenCalledTimes(0);
    result.getComponents();
    expect(mockContext.getComponents).toHaveBeenCalledTimes(1);

    expect(mockContext.getSystemIcon).toHaveBeenCalledTimes(0);
    result.getSystemIcon('icon');
    expect(mockContext.getSystemIcon).toHaveBeenCalledTimes(1);
    expect(mockContext.getSystemIcon).toHaveBeenCalledWith('icon');
  });
});
