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
import { screen, waitFor } from '@testing-library/react';
import { ShortcutItem } from './ShortcutItem';
import { Shortcut } from './types';
import { LocalStoredShortcuts } from './api';
import {
  MockStorageApi,
  renderInTestApp,
  wrapInTestApp,
} from '@backstage/test-utils';
import { pageTheme } from '@backstage/theme';
import { SidebarContext } from '@backstage/core-components';

describe('ShortcutItem', () => {
  const shortcut: Shortcut = {
    id: 'id',
    url: '/some-url',
    title: 'some title',
  };
  const api = new LocalStoredShortcuts(MockStorageApi.create());

  it('displays the shortcut', async () => {
    await renderInTestApp(
      <SidebarContext.Provider value={{ isOpen: true }}>
        <ShortcutItem api={api} shortcut={shortcut} />
      </SidebarContext.Provider>,
    );
    expect(screen.getByText('ST')).toBeInTheDocument();
    expect(screen.getByText('some title')).toBeInTheDocument();
  });

  it('calculates the shortcut text correctly', async () => {
    const shortcut1: Shortcut = {
      id: 'id1',
      url: '/some-url',
      title: 'onetitle',
    };
    const shortcut2: Shortcut = {
      id: 'id2',
      url: '/some-url',
      title: 'two title',
    };
    const shortcut3: Shortcut = {
      id: 'id3',
      url: '/some-url',
      title: 'more | title words',
    };

    const { rerender } = await renderInTestApp(
      <ShortcutItem api={api} shortcut={shortcut1} />,
    );
    expect(screen.getByText('On')).toBeInTheDocument();

    rerender(wrapInTestApp(<ShortcutItem api={api} shortcut={shortcut2} />));
    await waitFor(() => {
      expect(screen.getByText('TT')).toBeInTheDocument();
    });

    rerender(wrapInTestApp(<ShortcutItem api={api} shortcut={shortcut3} />));
    await waitFor(() => {
      expect(screen.getByText('MT')).toBeInTheDocument();
    });
  });

  it('gets the color based on the theme', async () => {
    const { rerender } = await renderInTestApp(
      <ShortcutItem api={api} shortcut={shortcut} />,
    );

    expect(document.querySelector('circle')?.getAttribute('fill')).toEqual(
      pageTheme.tool.colors[0],
    );

    const newShortcut: Shortcut = {
      id: 'id',
      url: '/catalog',
      title: 'some title',
    };
    rerender(wrapInTestApp(<ShortcutItem api={api} shortcut={newShortcut} />));

    await waitFor(() => {
      expect(document.querySelector('circle')?.getAttribute('fill')).toEqual(
        pageTheme.home.colors[0],
      );
    });
  });
});
