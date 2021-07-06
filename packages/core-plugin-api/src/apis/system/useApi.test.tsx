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
import { createVersionedContextForTesting } from '../../lib/versionedValues';
import { createApiRef } from './ApiRef';
import { useApi } from './useApi';

describe('useApi', () => {
  const context = createVersionedContextForTesting('api-context');

  afterEach(() => {
    context.reset();
  });

  it('should resolve routes', () => {
    const get = jest.fn(() => 'my-api-impl');
    context.set({ 1: { get } });

    const apiRef = createApiRef<string>({ id: 'x' });
    const renderedHook = renderHook(() => useApi(apiRef));

    const value = renderedHook.result.current;
    expect(value).toBe('my-api-impl');
    expect(get).toHaveBeenCalledWith(apiRef);
  });
});
