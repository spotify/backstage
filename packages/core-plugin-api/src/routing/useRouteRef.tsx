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

import { useMemo } from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';
import { useVersionedContext } from '../lib/versionedValues';
import {
  AnyParams,
  ExternalRouteRef,
  RouteFunc,
  RouteRef,
  SubRouteRef,
} from './types';

export interface RouteResolver {
  resolve<Params extends AnyParams>(
    anyRouteRef:
      | RouteRef<Params>
      | SubRouteRef<Params>
      | ExternalRouteRef<Params, any>,
    sourceLocation: Parameters<typeof matchRoutes>[1],
  ): RouteFunc<Params> | undefined;
}

export function useRouteRef<Optional extends boolean, Params extends AnyParams>(
  routeRef: ExternalRouteRef<Params, Optional>,
): Optional extends true ? RouteFunc<Params> | undefined : RouteFunc<Params>;
export function useRouteRef<Params extends AnyParams>(
  routeRef: RouteRef<Params> | SubRouteRef<Params>,
): RouteFunc<Params>;
export function useRouteRef<Params extends AnyParams>(
  routeRef:
    | RouteRef<Params>
    | SubRouteRef<Params>
    | ExternalRouteRef<Params, any>,
): RouteFunc<Params> | undefined {
  const sourceLocation = useLocation();
  const versionedContext = useVersionedContext<{ 1: RouteResolver }>(
    'routing-context',
  );
  const resolver = versionedContext.atVersion(1);
  const routeFunc = useMemo(
    () => resolver && resolver.resolve(routeRef, sourceLocation),
    [resolver, routeRef, sourceLocation],
  );

  if (!versionedContext) {
    throw new Error('useRouteRef used outside of routing context');
  }
  if (!resolver) {
    throw new Error('RoutingContext v1 not available');
  }

  const isOptional = 'optional' in routeRef && routeRef.optional;
  if (!routeFunc && !isOptional) {
    throw new Error(`No path for ${routeRef}`);
  }

  return routeFunc;
}
