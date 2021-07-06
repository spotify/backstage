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
import { createVersionedContextForTesting } from '../lib/versionedValues';
import { useApp } from './useApp';

describe('v1 consumer', () => {
  const context = createVersionedContextForTesting('app-context');

  afterEach(() => {
    context.reset();
  });

  it('should provide an app context', () => {
    context.set({ 1: 'context-value' });

    const renderedHook = renderHook(() => useApp());
    expect(renderedHook.result.current).toBe('context-value');
  });
});
