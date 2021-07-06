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

import { isTruthy } from './helper';

describe('isTruthy', () => {
  it.each`
    value        | result
    ${'string'}  | ${true}
    ${true}      | ${true}
    ${1}         | ${true}
    ${['1']}     | ${true}
    ${{}}        | ${true}
    ${false}     | ${false}
    ${''}        | ${false}
    ${undefined} | ${false}
    ${null}      | ${false}
    ${0}         | ${false}
    ${[]}        | ${false}
  `('should be $result for $value', async ({ value, result }) => {
    expect(isTruthy(value)).toEqual(result);
  });
});
