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
  AnyParams,
  OptionalParams,
  ParamKeys,
  RouteRef,
  routeRefType,
  SubRouteRef,
} from './types';

// Should match the pattern in react-router
const PARAM_PATTERN = /^\w+$/;

export class SubRouteRefImpl<Params extends AnyParams>
  implements SubRouteRef<Params> {
  readonly [routeRefType] = 'sub';

  constructor(
    private readonly id: string,
    readonly path: string,
    readonly parent: RouteRef,
    readonly params: ParamKeys<Params>,
  ) {}

  toString() {
    return `routeRef{type=sub,id=${this.id}}`;
  }
}

// These utility types help us infer a Param object type from a string path
// For example, `/foo/:bar/:baz` inferred to `{ bar: string, baz: string }`
type ParamPart<S extends string> = S extends `:${infer Param}` ? Param : never;
type ParamNames<S extends string> = S extends `${infer Part}/${infer Rest}`
  ? ParamPart<Part> | ParamNames<Rest>
  : ParamPart<S>;
type PathParams<S extends string> = { [name in ParamNames<S>]: string };

/**
 * Merges a param object type with with an optional params type into a params object
 */
type MergeParams<
  P1 extends { [param in string]: string },
  P2 extends AnyParams
> = (P1[keyof P1] extends never ? {} : P1) & (P2 extends undefined ? {} : P2);

/**
 * Creates a SubRouteRef type given the desired parameters and parent route parameters.
 * The parameters types are merged together while ensuring that there is no overlap between the two.
 */
type MakeSubRouteRef<
  Params extends { [param in string]: string },
  ParentParams extends AnyParams
> = keyof Params & keyof ParentParams extends never
  ? SubRouteRef<OptionalParams<MergeParams<Params, ParentParams>>>
  : never;

export function createSubRouteRef<
  Path extends string,
  ParentParams extends AnyParams = never
>(config: {
  id: string;
  path: Path;
  parent: RouteRef<ParentParams>;
}): MakeSubRouteRef<PathParams<Path>, ParentParams> {
  const { id, path, parent } = config;
  type Params = PathParams<Path>;

  // Collect runtime parameters from the path, e.g. ['bar', 'baz'] from '/foo/:bar/:baz'
  const pathParams = path
    .split('/')
    .filter(p => p.startsWith(':'))
    .map(p => p.substring(1));
  const params = [...parent.params, ...pathParams];

  if (parent.params.some(p => pathParams.includes(p as string))) {
    throw new Error(
      'SubRouteRef may not have params that overlap with its parent',
    );
  }
  if (!path.startsWith('/')) {
    throw new Error(`SubRouteRef path must start with '/', got '${path}'`);
  }
  if (path.endsWith('/')) {
    throw new Error(`SubRouteRef path must not end with '/', got '${path}'`);
  }
  for (const param of pathParams) {
    if (!PARAM_PATTERN.test(param)) {
      throw new Error(`SubRouteRef path has invalid param, got '${param}'`);
    }
  }

  // We ensure that the type of the return type is sane here
  const subRouteRef = new SubRouteRefImpl(
    id,
    path,
    parent,
    params as ParamKeys<MergeParams<Params, ParentParams>>,
  ) as SubRouteRef<OptionalParams<MergeParams<Params, ParentParams>>>;

  // But skip type checking of the return value itself, because the conditional
  // type checking of the parent parameter overlap is tricky to express.
  return subRouteRef as any;
}
