/*
 * Copyright 2021 Spotify AB
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

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
function getGlobalObject() {
  if (typeof window !== 'undefined' && window.Math === Math) {
    return window;
  }
  if (typeof self !== 'undefined' && self.Math === Math) {
    return self;
  }
  // eslint-disable-next-line no-new-func
  return Function('return this')();
}

const globalObject = getGlobalObject();

const makeKey = (id: string) => `__@backstage/${id}__`;

/**
 * Used to provide a global singleton value, failing if it is already set.
 */
export function setGlobalSingleton(id: string, value: unknown): void {
  const key = makeKey(id);
  if (key in globalObject) {
    throw new Error(`Global ${id} is already set`); // TODO some sort of special build err
  }
  globalObject[key] = value;
}

/**
 * Used to access a global singleton value, failing if it is not already set.
 */
export function getGlobalSingleton<T>(id: string): T {
  const key = makeKey(id);
  if (!(key in globalObject)) {
    throw new Error(`Global ${id} is not set`); // TODO some sort of special build err
  }

  return globalObject[key];
}

/**
 * Serializes access to a global singleton value, with the first caller creating the value.
 */
export function getOrCreateGlobalSingleton<T>(
  id: string,
  supplier: () => T,
): T {
  const key = makeKey(id);

  let value = globalObject[key];
  if (value) {
    return value;
  }

  value = supplier();
  globalObject[key] = value;
  return value;
}
