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

import { AnyParams, ExternalRouteRef } from './types';
import { createExternalRouteRef } from './ExternalRouteRef';

describe('ExternalRouteRef', () => {
  it('should be created', () => {
    const routeRef: ExternalRouteRef<undefined> = createExternalRouteRef({
      id: 'my-route-ref',
    });
    expect(routeRef.params).toEqual([]);
    expect(routeRef.optional).toBe(false);
    expect(String(routeRef)).toBe('routeRef{type=external,id=my-route-ref}');
  });

  it('should be created as optional', () => {
    const routeRef: ExternalRouteRef<{
      x: string;
      y: string;
    }> = createExternalRouteRef({
      id: 'my-other-route-ref',
      params: [],
      optional: true,
    });
    expect(routeRef.params).toEqual([]);
    expect(routeRef.optional).toEqual(true);
  });

  it('should be created with params', () => {
    const routeRef: ExternalRouteRef<{
      x: string;
      y: string;
    }> = createExternalRouteRef({
      id: 'my-other-route-ref',
      params: ['x', 'y'],
    });
    expect(routeRef.params).toEqual(['x', 'y']);
    expect(routeRef.optional).toEqual(false);
  });

  it('should be created as optional with params', () => {
    const routeRef: ExternalRouteRef<{
      x: string;
      y: string;
    }> = createExternalRouteRef({
      id: 'my-other-route-ref',
      params: ['x', 'y'],
      optional: true,
    });
    expect(routeRef.params).toEqual(['x', 'y']);
    expect(routeRef.optional).toEqual(true);
  });

  it('should properly infer and validate parameter types and assignments', () => {
    function validateType<T extends AnyParams, O extends boolean>(
      _ref: ExternalRouteRef<T, O>,
    ) {}

    const _1 = createExternalRouteRef({ id: '1', params: ['notX'] });
    // @ts-expect-error
    validateType<{ x: string }, any>(_1);
    validateType<{ notX: string }, any>(_1);

    const _2 = createExternalRouteRef({
      id: '2',
      params: ['x'],
      optional: true,
    });
    // @ts-expect-error
    validateType<undefined, any>(_2);
    validateType<{ x: string }, true>(_2);

    const _3 = createExternalRouteRef({ id: '3', params: ['x', 'y'] });
    // @ts-expect-error
    validateType<{ x: string }, any>(_3);
    // extra z, we validate this at runtime instead
    validateType<{ x: string; y: string; z: string }, any>(_3);
    validateType<{ x: string; y: string }, false>(_3);

    const _4 = createExternalRouteRef({ id: '4', params: [] });
    // @ts-expect-error
    validateType<{ x: string }, any>(_4);
    validateType<undefined, false>(_4);

    const _5 = createExternalRouteRef({ id: '5' });
    // @ts-expect-error
    validateType<{ x: string }, any>(_5);
    validateType<undefined, false>(_5);

    const _6 = createExternalRouteRef({ id: '6', optional: true });
    // @ts-expect-error
    validateType<undefined, false>(_6);
    validateType<undefined, true>(_6);

    // To avoid complains about missing expectations and unused vars
    expect([_1, _2, _3, _4, _5, _6].join('')).toEqual(expect.any(String));
  });
});
