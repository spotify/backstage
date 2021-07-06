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

import { InputError } from '@backstage/errors';

/**
 * Takes a single unknown parameter and makes sure that it's a string that can
 * be parsed as an integer.
 */
export function parseIntegerParam(
  param: unknown,
  ctx: string,
): number | undefined {
  if (param === undefined) {
    return undefined;
  }

  if (typeof param !== 'string') {
    throw new InputError(`Invalid ${ctx}, not an integer on string form`);
  }

  const parsed = parseInt(param, 10);
  if (!Number.isInteger(parsed) || String(parsed) !== param) {
    throw new InputError(`Invalid ${ctx}, not an integer`);
  }

  return parsed;
}

/**
 * Takes a single unknown parameter and makes sure that it's a string.
 */
export function parseStringParam(
  param: unknown,
  ctx: string,
): string | undefined {
  if (param === undefined) {
    return undefined;
  }

  if (typeof param !== 'string') {
    throw new InputError(`Invalid ${ctx}, not a string`);
  }

  return param;
}

/**
 * Takes a single unknown parameter and makes sure that it's a single string or
 * an array of strings, and returns as an array.
 */
export function parseStringsParam(
  param: unknown,
  ctx: string,
): string[] | undefined {
  if (param === undefined) {
    return undefined;
  }

  const array = [param].flat();
  if (array.some(p => typeof p !== 'string')) {
    throw new InputError(`Invalid ${ctx}, not a string`);
  }

  return array as string[];
}
