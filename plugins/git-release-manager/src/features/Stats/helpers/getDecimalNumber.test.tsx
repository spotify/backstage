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

import { getDecimalNumber } from './getDecimalNumber';

describe('getDecimalNumber', () => {
  it('should handle NaN', () => {
    const result = getDecimalNumber(NaN);

    expect(result).toEqual(0);
  });

  it('should only handle decimals', () => {
    const result = getDecimalNumber(1);

    expect(result).toEqual(1);
  });

  it('should get decimal number with default decimals = 2', () => {
    const result = getDecimalNumber(1 / 3);

    expect(result).toMatchInlineSnapshot(`0.33`);
  });

  it('should get decimal number for decimals = 1', () => {
    const result = getDecimalNumber(1 / 3, 1);

    expect(result).toMatchInlineSnapshot(`0.3`);
  });
});
