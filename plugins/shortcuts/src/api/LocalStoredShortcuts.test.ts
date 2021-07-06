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

import { MockStorageApi } from '@backstage/test-utils';
import { pageTheme } from '@backstage/theme';
import { Shortcut } from '../types';
import { LocalStoredShortcuts } from './LocalStoredShortcuts';
import { ShortcutApi } from './ShortcutApi';

describe('LocalStoredShortcuts', () => {
  // eslint-disable-next-line jest/no-done-callback
  it('should observe shortcuts', async done => {
    const shortcutApi: ShortcutApi = new LocalStoredShortcuts(
      MockStorageApi.create(),
    );
    const shortcut: Shortcut = { id: 'id', title: 'title', url: '/url' };

    await shortcutApi.add(shortcut);
    shortcutApi.shortcut$().subscribe(data => {
      expect(data).toEqual(
        expect.arrayContaining([{ ...shortcut, id: expect.anything() }]),
      );
      done();
    });
  });

  it('should add shortcuts with ids', async () => {
    const storageApi = MockStorageApi.create();
    const shortcutApi: ShortcutApi = new LocalStoredShortcuts(storageApi);
    const shortcut: Omit<Shortcut, 'id'> = { title: 'title', url: '/url' };
    const spy = jest.spyOn(storageApi, 'set');

    await shortcutApi.add(shortcut);
    expect(spy).toHaveBeenCalledWith(
      'items',
      expect.objectContaining([{ ...shortcut, id: expect.anything() }]),
    );
  });

  it('should update shortcuts', async () => {
    const storageApi = MockStorageApi.create();
    const shortcutApi: ShortcutApi = new LocalStoredShortcuts(storageApi);
    const shortcut: Shortcut = { id: 'someid', title: 'title', url: '/url' };
    const spy = jest.spyOn(storageApi, 'set');

    await shortcutApi.update(shortcut);
    expect(spy).toHaveBeenCalledWith(
      'items',
      expect.objectContaining([shortcut]),
    );
  });

  it('should remove shortcuts', async () => {
    const storageApi = MockStorageApi.create();
    const shortcutApi: ShortcutApi = new LocalStoredShortcuts(storageApi);
    const shortcut: Shortcut = { id: 'someid', title: 'title', url: '/url' };
    const spy = jest.spyOn(storageApi, 'set');

    await shortcutApi.remove(shortcut.id);
    expect(spy).toHaveBeenCalledWith('items', []);
  });

  it('should get a color', () => {
    const storageApi = MockStorageApi.create();
    const shortcutApi: ShortcutApi = new LocalStoredShortcuts(storageApi);

    expect(shortcutApi.getColor('/catalog')).toEqual(pageTheme.home.colors[0]);
  });
});
