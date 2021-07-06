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

import React, { PropsWithChildren } from 'react';
import { ApiRef, ApiHolder, TypesToApiRefs } from './types';
import { useVersionedContext } from '../../lib/versionedValues';

export function useApiHolder(): ApiHolder {
  const versionedHolder = useVersionedContext<{ 1: ApiHolder }>('api-context');

  const apiHolder = versionedHolder.atVersion(1);
  if (!apiHolder) {
    throw new Error('ApiContext v1 not available');
  }
  return apiHolder;
}

export function useApi<T>(apiRef: ApiRef<T>): T {
  const apiHolder = useApiHolder();

  const api = apiHolder.get(apiRef);
  if (!api) {
    throw new Error(`No implementation available for ${apiRef}`);
  }
  return api;
}

export function withApis<T>(apis: TypesToApiRefs<T>) {
  return function withApisWrapper<P extends T>(
    WrappedComponent: React.ComponentType<P>,
  ) {
    const Hoc = (props: PropsWithChildren<Omit<P, keyof T>>) => {
      const apiHolder = useApiHolder();

      const impls = {} as T;

      for (const key in apis) {
        if (apis.hasOwnProperty(key)) {
          const ref = apis[key];

          const api = apiHolder.get(ref);
          if (!api) {
            throw new Error(`No implementation available for ${ref}`);
          }
          impls[key] = api;
        }
      }

      return <WrappedComponent {...(props as P)} {...impls} />;
    };
    const displayName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';

    Hoc.displayName = `withApis(${displayName})`;

    return Hoc;
  };
}
