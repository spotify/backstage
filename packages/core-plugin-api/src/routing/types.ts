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

import { OldIconComponent } from '../icons/types';
import { getOrCreateGlobalSingleton } from '../lib/globalObject';

export type AnyParams = { [param in string]: string } | undefined;
export type ParamKeys<Params extends AnyParams> = keyof Params extends never
  ? []
  : (keyof Params)[];
export type OptionalParams<
  Params extends { [param in string]: string }
> = Params[keyof Params] extends never ? undefined : Params;

// The extra TS magic here is to require a single params argument if the RouteRef
// had at least one param defined, but require 0 arguments if there are no params defined.
// Without this we'd have to pass in empty object to all parameter-less RouteRefs
// just to make TypeScript happy, or we would have to make the argument optional in
// which case you might forget to pass it in when it is actually required.
export type RouteFunc<Params extends AnyParams> = (
  ...[params]: Params extends undefined ? readonly [] : readonly [Params]
) => string;

export const routeRefType: unique symbol = getOrCreateGlobalSingleton<any>(
  'route-ref-type',
  () => Symbol('route-ref-type'),
);

export type RouteRef<Params extends AnyParams = any> = {
  readonly [routeRefType]: 'absolute';

  params: ParamKeys<Params>;

  // TODO(Rugvip): Remove all of these once plugins don't rely on the path
  /** @deprecated paths are no longer accessed directly from RouteRefs, use useRouteRef instead */
  path: string;
  /** @deprecated icons are no longer accessed via RouteRefs */
  icon?: OldIconComponent;
  /** @deprecated titles are no longer accessed via RouteRefs */
  title?: string;
};

export type SubRouteRef<Params extends AnyParams = any> = {
  readonly [routeRefType]: 'sub';

  parent: RouteRef;

  path: string;

  params: ParamKeys<Params>;
};

export type ExternalRouteRef<
  Params extends AnyParams = any,
  Optional extends boolean = any
> = {
  readonly [routeRefType]: 'external';

  params: ParamKeys<Params>;

  optional?: Optional;
};

export type AnyRouteRef =
  | RouteRef<any>
  | SubRouteRef<any>
  | ExternalRouteRef<any, any>;

// TODO(Rugvip): None of these should be found in the wild anymore, remove in next minor release
/** @deprecated */
export type ConcreteRoute = {};
/** @deprecated */
export type AbsoluteRouteRef = RouteRef<{}>;
/** @deprecated */
export type MutableRouteRef = RouteRef<{}>;

// A duplicate of the react-router RouteObject, but with routeRef added
export interface BackstageRouteObject {
  caseSensitive: boolean;
  children?: BackstageRouteObject[];
  element: React.ReactNode;
  path: string;
  routeRefs: Set<RouteRef>;
}
