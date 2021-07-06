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

import { Shortcut } from '../types';
import { createApiRef, Observable } from '@backstage/core-plugin-api';

export const shortcutsApiRef = createApiRef<ShortcutApi>({
  id: 'plugin.shortcuts.api',
  description: 'API to handle shortcuts in a Backstage Sidebar',
});

export interface ShortcutApi {
  /**
   * Returns an Observable that will subscribe to changes.
   */
  shortcut$(): Observable<Shortcut[]>;

  /**
   * Generates a unique id for the shortcut and then saves it.
   */
  add(shortcut: Omit<Shortcut, 'id'>): Promise<void>;

  /**
   * Removes the shortcut.
   */
  remove(id: string): Promise<void>;

  /**
   * Finds an existing shortcut that matches the ID of the
   * supplied shortcut and updates its values.
   */
  update(shortcut: Shortcut): Promise<void>;

  /**
   * Each shortcut should get a color for its icon based on the url.
   *
   * Preferably using some abstraction between the url and the actual
   * color value.
   */
  getColor(url: string): string;
}
