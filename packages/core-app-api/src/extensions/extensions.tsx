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

import { Extension, RouteRef } from '@backstage/core-plugin-api';

type ComponentLoader<T> =
  | {
      lazy: () => Promise<T>;
    }
  | {
      sync: T;
    };

const ERROR_MESSAGE = 'Import this from @backstage/core-plugin-api';

/** @deprecated Import from @backstage/core-plugin-api instead */
export function createRoutableExtension<
  T extends (props: any) => JSX.Element | null
>(_options: {
  component: () => Promise<T>;
  mountPoint: RouteRef;
}): Extension<T> {
  throw new Error(ERROR_MESSAGE);
}

/** @deprecated Import from @backstage/core-plugin-api instead */
export function createComponentExtension<
  T extends (props: any) => JSX.Element | null
>(_options: { component: ComponentLoader<T> }): Extension<T> {
  throw new Error(ERROR_MESSAGE);
}

/** @deprecated Import from @backstage/core-plugin-api instead */
export function createReactExtension<
  T extends (props: any) => JSX.Element | null
>(_options: {
  component: ComponentLoader<T>;
  data?: Record<string, unknown>;
}): Extension<T> {
  throw new Error(ERROR_MESSAGE);
}
