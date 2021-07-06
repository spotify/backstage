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

import { AnyParams, RouteRef } from './types';
import { createRouteRef } from './RouteRef';

describe('RouteRef', () => {
  it('should be created', () => {
    const routeRef: RouteRef<undefined> = createRouteRef({
      id: 'my-route-ref',
    });
    expect(routeRef.params).toEqual([]);
    expect(String(routeRef)).toBe('routeRef{type=absolute,id=my-route-ref}');
  });

  it('should be created with params', () => {
    const routeRef: RouteRef<{
      x: string;
      y: string;
    }> = createRouteRef({
      id: 'my-other-route-ref',
      params: ['x', 'y'],
    });
    expect(routeRef.params).toEqual(['x', 'y']);
  });

  it('should properly infer and validate parameter types and assignments', () => {
    function validateType<T extends AnyParams>(_ref: RouteRef<T>) {}

    const _1 = createRouteRef({ id: '1', params: ['x'] });
    // @ts-expect-error
    validateType<{ y: string }>(_1);
    // @ts-expect-error
    validateType<undefined>(_1);
    validateType<{ x: string }>(_1);

    const _2 = createRouteRef({ id: '2', params: ['x', 'y'] });
    // @ts-expect-error
    validateType<{ x: string }>(_2);
    // @ts-expect-error
    validateType<undefined>(_2);
    // @ts-expect-error
    validateType<{ x: string; z: string }>(_2);
    // extra z, we validate this at runtime instead
    validateType<{ x: string; y: string; z: string }>(_2);
    validateType<{ x: string; y: string }>(_2);

    const _3 = createRouteRef({ id: '3', params: [] });
    // @ts-expect-error
    validateType<{ x: string }>(_3);
    validateType<undefined>(_3);

    const _4 = createRouteRef({ id: '4' });
    // @ts-expect-error
    validateType<{ x: string }>(_4);
    validateType<undefined>(_4);

    // To avoid complains about missing expectations and unused vars
    expect([_1, _2, _3, _4].join('')).toEqual(expect.any(String));
  });
});
