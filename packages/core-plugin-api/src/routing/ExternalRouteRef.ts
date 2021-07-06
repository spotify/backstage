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
  ExternalRouteRef,
  routeRefType,
  AnyParams,
  ParamKeys,
  OptionalParams,
} from './types';

export class ExternalRouteRefImpl<
  Params extends AnyParams,
  Optional extends boolean
> implements ExternalRouteRef<Params, Optional> {
  readonly [routeRefType] = 'external';

  constructor(
    private readonly id: string,
    readonly params: ParamKeys<Params>,
    readonly optional: Optional,
  ) {}

  toString() {
    return `routeRef{type=external,id=${this.id}}`;
  }
}

export function createExternalRouteRef<
  Params extends { [param in ParamKey]: string },
  Optional extends boolean = false,
  ParamKey extends string = never
>(options: {
  /**
   * An identifier for this route, used to identify it in error messages
   */
  id: string;

  /**
   * The parameters that will be provided to the external route reference.
   */
  params?: ParamKey[];

  /**
   * Whether or not this route is optional, defaults to false.
   *
   * Optional external routes are not required to be bound in the app, and
   * if they aren't, `useRouteRef` will return `undefined`.
   */
  optional?: Optional;
}): ExternalRouteRef<OptionalParams<Params>, Optional> {
  return new ExternalRouteRefImpl(
    options.id,
    (options.params ?? []) as ParamKeys<OptionalParams<Params>>,
    Boolean(options.optional) as Optional,
  );
}
