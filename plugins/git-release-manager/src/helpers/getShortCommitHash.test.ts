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

import { getShortCommitHash } from './getShortCommitHash';

describe('getShortCommitHash', () => {
  it('should get the short version of the commit hash', () => {
    const result = getShortCommitHash(
      'bd3fc6f6351018a748bb7f94c0ecf6c1577d8e06',
    );

    expect(result).toEqual('bd3fc6f');
    expect(result.length).toEqual(7);
  });

  it('should throw for invalid commit hashes (too short)', () => {
    expect(() => getShortCommitHash('bd3')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid shortCommitHash: less than 7 characters"`,
    );
  });
});
