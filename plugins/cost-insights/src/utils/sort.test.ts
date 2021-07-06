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

import { aggregationSort } from './sort';

describe('aggregationSort', () => {
  const aggregation = [
    { date: '2020-07-05', amount: 0.250991 },
    { date: '2020-07-06', amount: 0.253284 },
    { date: '2020-07-01', amount: 0.260798 },
  ];

  it('sorts in ascending order', () => {
    const sortedAggregation = aggregation.sort(aggregationSort);
    expect(sortedAggregation[0].date).toBe('2020-07-01');
    expect(sortedAggregation[1].date).toBe('2020-07-05');
    expect(sortedAggregation[2].date).toBe('2020-07-06');
  });
});
