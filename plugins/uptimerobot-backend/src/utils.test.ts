/*
 * Copyright 2021 Spotify AB
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

import { getUptimeRanges, parseAnnotation } from './utils';

describe('getUptimeRanges', () => {
  it('should export string with 30 unix timestamps separated by a dash', () => {
    expect(getUptimeRanges()).toMatch(/^(?:\d+_{1}\d+-){29}(\d+_\d+)$/i);
  });
});

describe('parseAnnotation', () => {
  it('should return an map with parsed API keys and monitor IDs', () => {
    const annotation = 'teamA/123456789,192837465 teamB/987654321,918273645';

    const desiredResult = new Map();
    desiredResult.set('teamA', ['123456789', '192837465']);
    desiredResult.set('teamB', ['987654321', '918273645']);

    expect(parseAnnotation(annotation)).toEqual(desiredResult);
  });
});
