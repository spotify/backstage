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

import {
  createRouteRef,
  createSubRouteRef,
  createExternalRouteRef,
  ExternalRouteRef,
  RouteRef,
  SubRouteRef,
} from '@backstage/core-plugin-api';
import { RouteResolver } from './RouteResolver';
import { MATCH_ALL_ROUTE } from './collectors';

const element = () => null;
const rest = { element, caseSensitive: false, children: [MATCH_ALL_ROUTE] };

const ref1 = createRouteRef({ id: 'rr1' });
const ref2 = createRouteRef({ id: 'rr2', params: ['x'] });
const ref3 = createRouteRef({ id: 'rr3', params: ['y'] });
const subRef1 = createSubRouteRef({
  id: 'srr1',
  parent: ref1,
  path: '/foo',
});
const subRef2 = createSubRouteRef({
  id: 'srr2',
  parent: ref1,
  path: '/foo/:a',
});
const subRef3 = createSubRouteRef({
  id: 'srr3',
  parent: ref2,
  path: '/bar',
});
const subRef4 = createSubRouteRef({
  id: 'srr4',
  parent: ref2,
  path: '/bar/:a',
});
const externalRef1 = createExternalRouteRef({ id: 'err1' });
const externalRef2 = createExternalRouteRef({
  id: 'err2',
  optional: true,
});
const externalRef3 = createExternalRouteRef({ id: 'err3', params: ['x'] });
const externalRef4 = createExternalRouteRef({
  id: 'err4',
  optional: true,
  params: ['x'],
});

describe('RouteResolver', () => {
  it('should not resolve anything with an empty resolver', () => {
    const r = new RouteResolver(new Map(), new Map(), [], new Map());

    expect(r.resolve(ref1, '/')?.()).toBe(undefined);
    expect(r.resolve(ref2, '/')?.({ x: '1x' })).toBe(undefined);
    expect(r.resolve(subRef1, '/')?.()).toBe(undefined);
    expect(r.resolve(subRef2, '/')?.({ a: '2a' })).toBe(undefined);
    expect(r.resolve(subRef3, '/')?.({ x: '3x' })).toBe(undefined);
    expect(r.resolve(subRef4, '/')?.({ x: '4x', a: '4a' })).toBe(undefined);
    expect(r.resolve(externalRef1, '/')?.()).toBe(undefined);
    expect(r.resolve(externalRef2, '/')?.()).toBe(undefined);
    expect(r.resolve(externalRef3, '/')?.({ x: '5x' })).toBe(undefined);
    expect(r.resolve(externalRef4, '/')?.({ x: '6x' })).toBe(undefined);
  });

  it('should resolve an absolute route', () => {
    const r = new RouteResolver(
      new Map([[ref1, '/my-route']]),
      new Map(),
      [{ routeRefs: new Set([ref1]), path: '/my-route', ...rest }],
      new Map(),
    );

    expect(r.resolve(ref1, '/')?.()).toBe('/my-route');
    expect(r.resolve(ref2, '/')?.({ x: '1x' })).toBe(undefined);
    expect(r.resolve(subRef1, '/')?.()).toBe('/my-route/foo');
    expect(r.resolve(subRef2, '/')?.({ a: '2a' })).toBe('/my-route/foo/2a');
    expect(r.resolve(subRef3, '/')?.({ x: '3x' })).toBe(undefined);
    expect(r.resolve(subRef4, '/')?.({ x: '4x', a: '4a' })).toBe(undefined);
    expect(r.resolve(externalRef1, '/')?.()).toBe(undefined);
    expect(r.resolve(externalRef2, '/')?.()).toBe(undefined);
    expect(r.resolve(externalRef3, '/')?.({ x: '5x' })).toBe(undefined);
    expect(r.resolve(externalRef4, '/')?.({ x: '6x' })).toBe(undefined);
  });

  it('should resolve an absolute route with a param and with a parent', () => {
    const r = new RouteResolver(
      new Map<RouteRef, string>([
        [ref1, '/my-route'],
        [ref2, '/my-parent/:x'],
      ]),
      new Map([[ref2, ref1]]),
      [
        {
          routeRefs: new Set([ref2]),
          path: '/my-parent/:x',
          ...rest,
          children: [
            MATCH_ALL_ROUTE,
            { routeRefs: new Set([ref1]), path: '/my-route', ...rest },
          ],
        },
      ],
      new Map<ExternalRouteRef, RouteRef | SubRouteRef>([
        [externalRef1, ref1],
        [externalRef3, ref2],
        [externalRef4, subRef3],
      ]),
    );

    expect(r.resolve(ref1, '/')?.()).toBe('/my-route');
    expect(r.resolve(ref2, '/')?.({ x: '1x' })).toBe('/my-route/my-parent/1x');
    expect(r.resolve(subRef1, '/')?.()).toBe('/my-route/foo');
    expect(r.resolve(subRef2, '/')?.({ a: '2a' })).toBe('/my-route/foo/2a');
    expect(r.resolve(subRef3, '/')?.({ x: '3x' })).toBe(
      '/my-route/my-parent/3x/bar',
    );
    expect(r.resolve(subRef4, '/')?.({ x: '4x', a: '4a' })).toBe(
      '/my-route/my-parent/4x/bar/4a',
    );
    expect(r.resolve(externalRef1, '/')?.()).toBe('/my-route');
    expect(r.resolve(externalRef2, '/')?.()).toBe(undefined);
    expect(r.resolve(externalRef3, '/')?.({ x: '5x' })).toBe(
      '/my-route/my-parent/5x',
    );
    expect(r.resolve(externalRef4, '/')?.({ x: '6x' })).toBe(
      '/my-route/my-parent/6x/bar',
    );
  });

  it('should resolve the most specific match', () => {
    const r = new RouteResolver(
      new Map<RouteRef, string>([
        [ref1, '/deep'],
        [ref2, '/root/:x'],
        [ref3, '/sub/:y'],
      ]),
      new Map<RouteRef, RouteRef>([
        [ref3, ref2],
        [ref1, ref3],
      ]),
      [
        {
          routeRefs: new Set([ref2]),
          path: '/root/:x',
          ...rest,
          children: [
            MATCH_ALL_ROUTE,
            {
              routeRefs: new Set([ref3]),
              path: '/sub/:y',
              ...rest,
              children: [
                MATCH_ALL_ROUTE,
                {
                  routeRefs: new Set([ref1]),
                  path: '/deep',
                  ...rest,
                },
              ],
            },
          ],
        },
      ],
      new Map<ExternalRouteRef, RouteRef | SubRouteRef>(),
    );

    expect(r.resolve(ref2, '/')?.({ x: 'x' })).toBe('/root/x');
    expect(r.resolve(ref3, '/root/x')?.({ y: 'y' })).toBe('/root/x/sub/y');

    expect(() => r.resolve(ref1, '/')?.()).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(() => r.resolve(ref1, '/root/x')?.()).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(ref1, '/root/x/sub/y')?.()).toBe('/root/x/sub/y/deep');
    // Without the MATCH_ALL_ROUTE, we wouldn't properly match the route here
    expect(r.resolve(ref1, '/root/x/sub/y/any/nested/path/here')?.()).toBe(
      '/root/x/sub/y/deep',
    );
  });

  it('should resolve an absolute route with multiple parents', () => {
    const r = new RouteResolver(
      new Map<RouteRef, string>([
        [ref1, '/my-route'],
        [ref2, '/my-parent/:x'],
        [ref3, '/my-grandparent/:y'],
      ]),
      new Map<RouteRef, RouteRef>([
        [ref1, ref2],
        [ref2, ref3],
      ]),
      [
        {
          routeRefs: new Set([ref3]),
          path: '/my-grandparent/:y',
          ...rest,
          children: [
            MATCH_ALL_ROUTE,
            {
              routeRefs: new Set([ref2]),
              path: '/my-parent/:x',
              ...rest,
              children: [
                MATCH_ALL_ROUTE,
                { routeRefs: new Set([ref1]), path: '/my-route', ...rest },
              ],
            },
          ],
        },
      ],
      new Map<ExternalRouteRef, RouteRef | SubRouteRef>([
        [externalRef1, ref1],
        [externalRef3, ref2],
        [externalRef4, subRef3],
      ]),
    );

    const l = '/my-grandparent/my-y/my-parent/my-x';
    expect(r.resolve(ref1, l)?.()).toBe(
      '/my-grandparent/my-y/my-parent/my-x/my-route',
    );
    expect(() => r.resolve(ref1, '/')?.()).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(ref2, l)?.({ x: '1x' })).toBe(
      '/my-grandparent/my-y/my-parent/1x',
    );
    expect(r.resolve(ref2, '/my-grandparent/my-y')?.({ x: '1x' })).toBe(
      '/my-grandparent/my-y/my-parent/1x',
    );
    expect(() => r.resolve(ref2, '/')?.({ x: '1x' })).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(subRef1, l)?.()).toBe(
      '/my-grandparent/my-y/my-parent/my-x/my-route/foo',
    );
    expect(() => r.resolve(subRef1, '/')?.()).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(subRef2, l)?.({ a: '2a' })).toBe(
      '/my-grandparent/my-y/my-parent/my-x/my-route/foo/2a',
    );
    expect(() => r.resolve(subRef2, '/')?.({ a: '2a' })).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(subRef3, l)?.({ x: '3x' })).toBe(
      '/my-grandparent/my-y/my-parent/3x/bar',
    );
    expect(r.resolve(subRef3, '/my-grandparent/my-y')?.({ x: '3x' })).toBe(
      '/my-grandparent/my-y/my-parent/3x/bar',
    );
    expect(r.resolve(subRef4, l)?.({ x: '4x', a: '4a' })).toBe(
      '/my-grandparent/my-y/my-parent/4x/bar/4a',
    );
    expect(
      r.resolve(subRef4, '/my-grandparent/my-y')?.({ x: '4x', a: '4a' }),
    ).toBe('/my-grandparent/my-y/my-parent/4x/bar/4a');
    expect(r.resolve(externalRef1, l)?.()).toBe(
      '/my-grandparent/my-y/my-parent/my-x/my-route',
    );
    expect(() => r.resolve(externalRef1, '/')?.()).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(externalRef2, l)?.()).toBe(undefined);
    expect(r.resolve(externalRef3, l)?.({ x: '5x' })).toBe(
      '/my-grandparent/my-y/my-parent/5x',
    );
    expect(() => r.resolve(externalRef3, '/')?.({ x: '5x' })).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
    expect(r.resolve(externalRef4, l)?.({ x: '6x' })).toBe(
      '/my-grandparent/my-y/my-parent/6x/bar',
    );
    expect(() => r.resolve(externalRef4, '/')?.({ x: '6x' })).toThrow(
      /^Cannot route.*with parent.*as it has parameters$/,
    );
  });
});
