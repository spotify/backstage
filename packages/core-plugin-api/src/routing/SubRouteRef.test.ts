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

import { AnyParams, SubRouteRef } from './types';
import { createSubRouteRef } from './SubRouteRef';
import { createRouteRef } from './RouteRef';

const parent = createRouteRef({ id: 'parent' });
const parentX = createRouteRef({ id: 'parent-x', params: ['x'] });

describe('SubRouteRef', () => {
  it('should be created', () => {
    const routeRef: SubRouteRef<undefined> = createSubRouteRef({
      parent,
      id: 'my-route-ref',
      path: '/foo',
    });
    expect(routeRef.path).toBe('/foo');
    expect(routeRef.parent).toBe(parent);
    expect(routeRef.params).toEqual([]);
    expect(String(routeRef)).toBe('routeRef{type=sub,id=my-route-ref}');
  });

  it('should be created with params', () => {
    const routeRef: SubRouteRef<{ bar: string }> = createSubRouteRef({
      parent,
      id: 'my-other-route-ref',
      path: '/foo/:bar',
    });
    expect(routeRef.path).toBe('/foo/:bar');
    expect(routeRef.parent).toBe(parent);
    expect(routeRef.params).toEqual(['bar']);
  });

  it('should be created with merged params', () => {
    const routeRef: SubRouteRef<{
      x: string;
      y: string;
      z: string;
    }> = createSubRouteRef({
      parent: parentX,
      id: 'my-other-route-ref',
      path: '/foo/:y/:z',
    });
    expect(routeRef.path).toBe('/foo/:y/:z');
    expect(routeRef.parent).toBe(parentX);
    expect(routeRef.params).toEqual(['x', 'y', 'z']);
  });

  it('should be created with params from parent', () => {
    const routeRef: SubRouteRef<{ x: string }> = createSubRouteRef({
      parent: parentX,
      id: 'my-other-route-ref',
      path: '/foo/bar',
    });
    expect(routeRef.path).toBe('/foo/bar');
    expect(routeRef.parent).toBe(parentX);
    expect(routeRef.params).toEqual(['x']);
  });

  it.each([
    ['foo', "SubRouteRef path must start with '/', got 'foo'"],
    [':foo', "SubRouteRef path must start with '/', got ':foo'"],
    ['', "SubRouteRef path must start with '/', got ''"],
    ['/', "SubRouteRef path must not end with '/', got '/'"],
    ['/foo/', "SubRouteRef path must not end with '/', got '/foo/'"],
    ['/foo/:x', 'SubRouteRef may not have params that overlap with its parent'],
    ['/:/foo', "SubRouteRef path has invalid param, got ''"],
    ['/:inva:lid/foo', "SubRouteRef path has invalid param, got 'inva:lid'"],
    ['/:inva=lid/foo', "SubRouteRef path has invalid param, got 'inva=lid'"],
  ])('should throw if path is invalid, %s', (path, message) => {
    expect(() =>
      createSubRouteRef({ path, parent: parentX, id: path }),
    ).toThrow(message);
  });

  it('should properly infer and parse path parameters', () => {
    function validateType<T extends AnyParams>(_ref: SubRouteRef<T>) {}

    const _1 = createSubRouteRef({ id: '1', parent, path: '/foo/bar' });
    // @ts-expect-error
    validateType<{ x: string }>(_1);
    validateType<undefined>(_1);

    const _2 = createSubRouteRef({ id: '2', parent, path: '/foo/:x/:y' });
    // @ts-expect-error
    validateType<undefined>(_2);
    // @ts-expect-error
    validateType<{ x: string; z: string }>(_2);
    // @ts-expect-error
    validateType<{ y: string }>(_2);
    // extra z, we validate this at runtime instead
    validateType<{ x: string; y: string; z: string }>(_2);
    validateType<{ x: string; y: string }>(_2);

    const _3 = createSubRouteRef({ id: '3', parent: parentX, path: '/foo' });
    // @ts-expect-error
    validateType<undefined>(_3);
    // @ts-expect-error
    validateType<{ y: string }>(_3);
    validateType<{ x: string }>(_3);

    const _4 = createSubRouteRef({ id: '4', parent: parentX, path: '/foo/:y' });
    // @ts-expect-error
    validateType<undefined>(_4);
    // @ts-expect-error
    validateType<{ x: string; z: string }>(_4);
    // @ts-expect-error
    validateType<{ y: string }>(_4);
    validateType<{ x: string; y: string }>(_4);

    // To avoid complains about missing expectations and unused vars
    expect([_1, _2, _3, _4].join('')).toEqual(expect.any(String));
  });
});
