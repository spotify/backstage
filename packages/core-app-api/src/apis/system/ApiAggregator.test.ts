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

import { createApiRef } from '@backstage/core-plugin-api';
import { ApiAggregator } from './ApiAggregator';
import { ApiRegistry } from './ApiRegistry';

describe('ApiAggregator', () => {
  const apiARef = createApiRef<number>({ id: 'a' });
  const apiBRef = createApiRef<number>({ id: 'b' });

  it('should forward implementations', () => {
    const agg = new ApiAggregator(
      ApiRegistry.from([
        [apiARef, 5],
        [apiBRef, 10],
      ]),
    );
    expect(agg.get(apiARef)).toBe(5);
    expect(agg.get(apiBRef)).toBe(10);
  });

  it('should return the first implementation', () => {
    const agg = new ApiAggregator(
      ApiRegistry.from([
        [apiARef, 1],
        [apiARef, 2],
      ]),
    );
    expect(agg.get(apiARef)).toBe(2);
    expect(agg.get(apiBRef)).toBe(undefined);
  });
});
