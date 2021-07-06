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

import { AppTheme } from '@backstage/core-plugin-api';
import { AppThemeSelector } from './AppThemeSelector';

describe('AppThemeSelector', () => {
  it('should should select new themes', async () => {
    const selector = new AppThemeSelector([]);

    expect(selector.getInstalledThemes()).toEqual([]);

    const subFn = jest.fn();
    selector.activeThemeId$().subscribe(subFn);
    expect(selector.getActiveThemeId()).toBe(undefined);
    await 'wait a tick';
    expect(subFn).toHaveBeenLastCalledWith(undefined);

    selector.setActiveThemeId('x');
    expect(subFn).toHaveBeenLastCalledWith('x');
    expect(selector.getActiveThemeId()).toBe('x');

    selector.setActiveThemeId(undefined);
    expect(subFn).toHaveBeenLastCalledWith(undefined);
    expect(selector.getActiveThemeId()).toBe(undefined);
  });

  it('should return a new array of themes', () => {
    const themes = new Array<AppTheme>();
    const selector = new AppThemeSelector(themes);

    expect(selector.getInstalledThemes()).toEqual(themes);
    expect(selector.getInstalledThemes()).not.toBe(themes);
  });

  it('should store theme in local storage', async () => {
    expect(AppThemeSelector.createWithStorage([]).getActiveThemeId()).toBe(
      undefined,
    );
    localStorage.setItem('theme', 'x');
    expect(AppThemeSelector.createWithStorage([]).getActiveThemeId()).toBe('x');
    localStorage.removeItem('theme');
    expect(AppThemeSelector.createWithStorage([]).getActiveThemeId()).toBe(
      undefined,
    );

    const addListenerSpy = jest.spyOn(window, 'addEventListener');
    const selector = AppThemeSelector.createWithStorage([]);

    expect(addListenerSpy).toHaveBeenCalledTimes(1);
    expect(addListenerSpy).toHaveBeenCalledWith(
      'storage',
      expect.any(Function),
    );

    selector.setActiveThemeId('y');
    await 'wait a tick';
    expect(localStorage.getItem('theme')).toBe('y');

    selector.setActiveThemeId(undefined);
    await 'wait a tick';
    expect(localStorage.getItem('theme')).toBe(null);

    localStorage.setItem('theme', 'z');
    expect(selector.getActiveThemeId()).toBe(undefined);

    const listener = addListenerSpy.mock.calls[0][1] as EventListener;
    listener({ key: 'theme' } as StorageEvent);

    expect(selector.getActiveThemeId()).toBe('z');
  });
});
