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

import { parseEntityPaginationParams } from './parseEntityPaginationParams';

describe('parseEntityPaginationParams', () => {
  it('works for the happy path', () => {
    expect(parseEntityPaginationParams({})).toBeUndefined();
    expect(parseEntityPaginationParams({ limit: '1' })).toEqual({ limit: 1 });
    expect(parseEntityPaginationParams({ offset: '0' })).toEqual({ offset: 0 });
    expect(parseEntityPaginationParams({ offset: '2' })).toEqual({ offset: 2 });
    expect(parseEntityPaginationParams({ after: 'x' })).toEqual({ after: 'x' });
    expect(
      parseEntityPaginationParams({ limit: '1', offset: '2', after: 'x' }),
    ).toEqual({ limit: 1, offset: 2, after: 'x' });
  });

  it('rejects bad values', () => {
    expect(() => parseEntityPaginationParams({ limit: '' })).toThrow(
      'Invalid limit, not an integer',
    );
    expect(() => parseEntityPaginationParams({ limit: '0' })).toThrow(
      'Invalid limit, must be greater than zero',
    );
    expect(() => parseEntityPaginationParams({ limit: '-1' })).toThrow(
      'Invalid limit, must be greater than zero',
    );
    expect(() => parseEntityPaginationParams({ offset: '' })).toThrow(
      'Invalid offset, not an integer',
    );
    expect(() => parseEntityPaginationParams({ offset: '-1' })).toThrow(
      'Invalid offset, must be zero or greater',
    );
    expect(() => parseEntityPaginationParams({ after: '' })).toThrow(
      'Invalid after, must not be empty',
    );
  });
});
