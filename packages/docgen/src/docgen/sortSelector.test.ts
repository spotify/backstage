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

import sortSelector from './sortSelector';

describe('sortSelector', () => {
  it('should stable sort', () => {
    const arr = [
      [3, 1],
      [1, 2],
      [1, 1],
      [1, 3],
      [2, 1],
    ];

    const sortedByFirst = arr.slice().sort(sortSelector(([first]) => first));
    expect(sortedByFirst).toEqual([
      [1, 2],
      [1, 1],
      [1, 3],
      [2, 1],
      [3, 1],
    ]);

    const sortedBySecond = arr
      .slice()
      .sort(sortSelector(([, second]) => second));
    expect(sortedBySecond).toEqual([
      [3, 1],
      [1, 1],
      [2, 1],
      [1, 2],
      [1, 3],
    ]);
  });
});
