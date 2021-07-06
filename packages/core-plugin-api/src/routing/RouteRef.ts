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
  RouteRef,
  routeRefType,
  AnyParams,
  ParamKeys,
  OptionalParams,
} from './types';
import { OldIconComponent } from '../icons/types';

// TODO(Rugvip): Remove this in the next breaking release, it's exported but unused
export type RouteRefConfig<Params extends AnyParams> = {
  params?: ParamKeys<Params>;
  path?: string;
  icon?: OldIconComponent;
  title: string;
};

export class RouteRefImpl<Params extends AnyParams>
  implements RouteRef<Params> {
  readonly [routeRefType] = 'absolute';

  constructor(
    private readonly id: string,
    readonly params: ParamKeys<Params>,
    private readonly config: {
      path?: string;
      icon?: OldIconComponent;
      title?: string;
    },
  ) {}

  get icon() {
    return this.config.icon;
  }

  // TODO(Rugvip): Remove this, routes are looked up via the registry instead
  get path() {
    return this.config.path ?? '';
  }

  get title() {
    return this.config.title ?? this.id;
  }

  toString() {
    return `routeRef{type=absolute,id=${this.id}}`;
  }
}

export function createRouteRef<
  // Params is the type that we care about and the one to be embedded in the route ref.
  // For example, given the params ['name', 'kind'], Params will be {name: string, kind: string}
  Params extends { [param in ParamKey]: string },
  // ParamKey is here to make sure the Params type properly has its keys narrowed down
  // to only the elements of params. Defaulting to never makes sure we end up with
  // Param = {} if the params array is empty.
  ParamKey extends string = never
>(config: {
  /** The id of the route ref, used to identify it when printed */
  id?: string;
  /** A list of parameter names that the path that this route ref is bound to must contain */
  params?: ParamKey[];
  /** @deprecated Route refs no longer decide their own path */
  path?: string;
  /** @deprecated Route refs no longer decide their own icon */
  icon?: OldIconComponent;
  /** @deprecated Route refs no longer decide their own title */
  title?: string;
}): RouteRef<OptionalParams<Params>> {
  const id = config.id || config.title;
  if (!id) {
    throw new Error('RouteRef must be provided a non-empty id');
  }
  return new RouteRefImpl(
    id,
    (config.params ?? []) as ParamKeys<OptionalParams<Params>>,
    config,
  );
}
