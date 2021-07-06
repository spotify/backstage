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

import { isValidSingleOwnerId, parseOwnerIds } from './codeowners';

describe('codeowners', () => {
  it('isValidSingleOwnerId', () => {
    [
      '@foo',
      '@a-b',
      '@org-a/team-a',
      '@a/b',
      'adam_driver+spam@deathstar.com',
    ].forEach(id => {
      expect(isValidSingleOwnerId(id)).toBeTruthy();
    });

    [
      '',
      '@',
      '@/team-a',
      '@orsdsd/',
      'adam_driver@deathstar',
      'something',
    ].forEach(id => {
      expect(isValidSingleOwnerId(id)).toBeFalsy();
    });
  });

  it('parseOwnerIds', () => {
    expect(parseOwnerIds('')).toBeUndefined();
    expect(parseOwnerIds('@foo')).toEqual(['@foo']);
    expect(parseOwnerIds(' @foo  @bar/baz   ')).toEqual(['@foo', '@bar/baz']);
    expect(parseOwnerIds(' @foo  @bar/   ')).toBeUndefined();
  });
});
