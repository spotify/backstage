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

import { ComponentType, ReactNode } from 'react';
import { getOrCreateGlobalSingleton } from '../lib/globalObject';

// TODO(Rugvip): Access via symbol is deprecated, remove once on 0.3.x
const DATA_KEY = Symbol('backstage-component-data');

type ComponentWithData<P> = ComponentType<P> & {
  [DATA_KEY]?: DataContainer;
};

type DataContainer = {
  map: Map<string, unknown>;
};

type MaybeComponentNode = ReactNode & {
  type?: ComponentType<any> & { [DATA_KEY]?: DataContainer };
};

// The store is bridged across versions using the global object
const store = getOrCreateGlobalSingleton(
  'component-data-store',
  () => new WeakMap<ComponentType<any>, DataContainer>(),
);

export function attachComponentData<P>(
  component: ComponentType<P>,
  type: string,
  data: unknown,
) {
  const dataComponent = component as ComponentWithData<P>;

  let container = store.get(component) || dataComponent[DATA_KEY];
  if (!container) {
    container = { map: new Map() };
    store.set(component, container);
    dataComponent[DATA_KEY] = container;
  }

  if (container.map.has(type)) {
    const name = component.displayName || component.name;
    throw new Error(
      `Attempted to attach duplicate data "${type}" to component "${name}"`,
    );
  }

  container.map.set(type, data);
}

export function getComponentData<T>(
  node: ReactNode,
  type: string,
): T | undefined {
  if (!node) {
    return undefined;
  }

  const component = (node as MaybeComponentNode).type;
  if (!component) {
    return undefined;
  }

  const container = store.get(component) || component[DATA_KEY];
  if (!container) {
    return undefined;
  }

  return container.map.get(type) as T | undefined;
}
