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
import { MockStorageApi, renderInTestApp } from '@backstage/test-utils';
import { screen, waitFor } from '@testing-library/react';
import { Shortcuts } from './Shortcuts';
import { LocalStoredShortcuts, shortcutsApiRef } from './api';

import { SidebarContext } from '@backstage/core-components';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

const apis = ApiRegistry.from([
  [shortcutsApiRef, new LocalStoredShortcuts(MockStorageApi.create())],
]);

describe('Shortcuts', () => {
  it('displays an add button', async () => {
    await renderInTestApp(
      <SidebarContext.Provider value={{ isOpen: true }}>
        <ApiProvider apis={apis}>
          <Shortcuts />
        </ApiProvider>
      </SidebarContext.Provider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));
    expect(screen.getByText('Add Shortcuts')).toBeInTheDocument();
  });
});
