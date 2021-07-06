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

import {
  parseEntityFilterParams,
  parseEntityFilterString,
} from './parseEntityFilterParams';

describe('parseEntityFilterParams', () => {
  it('translates empty query to empty list', () => {
    const result = parseEntityFilterParams({});
    expect(result).toEqual(undefined);
  });

  it('supports single-string format', () => {
    const result = parseEntityFilterParams({ filter: 'a=1' })!;
    expect(result).toEqual({
      anyOf: [{ allOf: [{ key: 'a', matchValueIn: ['1'] }] }],
    });
  });

  it('supports array-of-strings format', () => {
    const result = parseEntityFilterParams({
      filter: ['a=1', 'b=2'],
    });
    expect(result).toEqual({
      anyOf: [
        { allOf: [{ key: 'a', matchValueIn: ['1'] }] },
        { allOf: [{ key: 'b', matchValueIn: ['2'] }] },
      ],
    });
  });

  it('merges values within each filter', () => {
    const result = parseEntityFilterParams({
      filter: ['a=1', 'b=2,b=3,c=4'],
    });
    expect(result).toEqual({
      anyOf: [
        { allOf: [{ key: 'a', matchValueIn: ['1'] }] },
        {
          allOf: [
            { key: 'b', matchValueIn: ['2', '3'] },
            { key: 'c', matchValueIn: ['4'] },
          ],
        },
      ],
    });
  });

  it('throws for non-strings', () => {
    expect(() => parseEntityFilterParams({ filter: [3] })).toThrow(/string/);
  });
});

describe('parseEntityFilterString', () => {
  it('works for the happy path', () => {
    expect(parseEntityFilterString('')).toBeUndefined();
    expect(parseEntityFilterString('a=1,b=2,a=3')).toEqual([
      { key: 'a', matchValueIn: ['1', '3'] },
      { key: 'b', matchValueIn: ['2'] },
    ]);
  });

  it('trims values', () => {
    expect(parseEntityFilterString(' a = 1 , b = 2 , a = 3 ')).toEqual([
      { key: 'a', matchValueIn: ['1', '3'] },
      { key: 'b', matchValueIn: ['2'] },
    ]);
  });

  it('rejects malformed strings', () => {
    expect(() => parseEntityFilterString('x=2,a=')).toThrow(
      "Invalid filter, 'a=' is not a valid statement (expected a string on the form a=b)",
    );
    expect(() => parseEntityFilterString('x=2,=a')).toThrow(
      "Invalid filter, '=a' is not a valid statement (expected a string on the form a=b)",
    );
    expect(() => parseEntityFilterString('x=2,=')).toThrow(
      "Invalid filter, '=' is not a valid statement (expected a string on the form a=b)",
    );
    expect(() => parseEntityFilterString('x=2,a')).toThrow(
      "Invalid filter, 'a' is not a valid statement (expected a string on the form a=b)",
    );
  });
});
