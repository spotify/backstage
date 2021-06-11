/*
 * Copyright 2020 Spotify AB
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

import { ApiRef, ApiFactory, TypesToApiRefs } from './types';

/**
 * Used to infer types for a standalone ApiFactory that isn't immediately passed
 * to another function.
 * This function doesn't actually do anything, it's only used to infer types.
 */
export function createApiFactory<
  Api,
  Impl extends Api,
  Deps extends { [name in string]: unknown }
>(factory: ApiFactory<Api, Impl, Deps>): ApiFactory<Api, Impl, Deps>;
export function createApiFactory<Api, Impl extends Api>(
  api: ApiRef<Api>,
  instance: Impl,
): ApiFactory<Api, Impl, {}>;
export function createApiFactory<
  Api,
  Impl extends Api,
  Deps extends { [name in string]: unknown }
>(
  factory: ApiFactory<Api, Impl, Deps> | ApiRef<Api>,
  instance?: Impl,
): ApiFactory<Api, Impl, Deps> {
  if ('id' in factory) {
    return {
      api: factory,
      deps: {} as TypesToApiRefs<Deps>,
      factory: () => instance!,
    };
  }
  return factory;
}
