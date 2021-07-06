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

enum LocalStorageKeys {
  SIDEBAR_PIN_STATE = 'sidebarPinState',
}

export const LocalStorage = {
  getSidebarPinState(): boolean {
    let value;
    try {
      value = JSON.parse(
        window.localStorage.getItem(LocalStorageKeys.SIDEBAR_PIN_STATE) ||
          'false',
      );
    } catch {
      return false;
    }
    return !!value;
  },
  setSidebarPinState(state: boolean) {
    return window.localStorage.setItem(
      LocalStorageKeys.SIDEBAR_PIN_STATE,
      JSON.stringify(state),
    );
  },
};
