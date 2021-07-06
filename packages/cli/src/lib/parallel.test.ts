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

import { isParallelDefault, parseParallel } from './parallel';

describe('parallel', () => {
  describe('parseParallel', () => {
    it('coerces "false" string to boolean', () => {
      expect(parseParallel('false')).toBeFalsy();
    });

    it('coerces "true" to boolean', () => {
      expect(parseParallel('true')).toBeTruthy();
    });

    it('coerces number string to number', () => {
      expect(parseParallel('2')).toBe(2);
    });
    it.each([[true], [false], [2]])('returns itself for %p', value => {
      expect(parseParallel(value as any)).toEqual(value);
    });

    it.each([[undefined], [null]])('returns true for %p', value => {
      expect(parseParallel(value as any)).toBe(true);
    });

    it.each([['on'], [2.5], ['2.5']])('throws error for %p', value => {
      expect(() => parseParallel(value as any)).toThrowError(
        `Parallel option value '${value}' is not a boolean or integer`,
      );
    });
  });

  describe('isParallelDefault', () => {
    it('returns true if default value', () => {
      expect(isParallelDefault(undefined)).toBeTruthy();
      expect(isParallelDefault(true)).toBeTruthy();
    });

    it('returns false if not default value', () => {
      expect(isParallelDefault(false)).toBeFalsy();
      expect(isParallelDefault(2)).toBeFalsy();
      expect(isParallelDefault('true' as any)).toBeFalsy();
    });
  });
});
