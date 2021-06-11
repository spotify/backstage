/*
 * Copyright 2020 Spotify AB
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

export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return !isNull(value) && !isUndefined(value);
}

export function isUndefined(value: any): value is undefined {
  return value === undefined;
}

export function isNull(value: any): boolean {
  return value === null;
}

// Utility for exhaustiveness checking in switch statements
export function assertNever(x: never): never {
  throw new Error(`Exhaustiveness check failed: ${x}`);
}

export function assertAlways<T>(argument: T | undefined): T {
  if (argument === undefined) {
    throw new TypeError(
      'Expected to always find a value but received undefined',
    );
  }
  return argument;
}

// Utility for working with static lists; asserts a value will always be found or
// throws an error
export function findAlways<T>(
  collection: T[],
  callback: (el: T) => boolean,
): T {
  return assertAlways(collection.find(callback));
}

export function findAnyKey<T>(
  record: Record<string, T> | undefined,
): string | undefined {
  return Object.keys(record ?? {}).find(_ => true);
}
