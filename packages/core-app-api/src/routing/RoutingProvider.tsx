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

import React, { createContext, ReactNode } from 'react';
import {
  ExternalRouteRef,
  RouteRef,
  SubRouteRef,
} from '@backstage/core-plugin-api';
import { getOrCreateGlobalSingleton } from '../lib/globalObject';
import {
  createVersionedValueMap,
  VersionedValue,
} from '../lib/versionedValues';
import { RouteResolver } from './RouteResolver';
import { BackstageRouteObject } from './types';

type RoutingContextType = VersionedValue<{ 1: RouteResolver }> | undefined;
const RoutingContext = getOrCreateGlobalSingleton('routing-context', () =>
  createContext<RoutingContextType>(undefined),
);

type ProviderProps = {
  routePaths: Map<RouteRef, string>;
  routeParents: Map<RouteRef, RouteRef | undefined>;
  routeObjects: BackstageRouteObject[];
  routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>;
  children: ReactNode;
};

export const RoutingProvider = ({
  routePaths,
  routeParents,
  routeObjects,
  routeBindings,
  children,
}: ProviderProps) => {
  const resolver = new RouteResolver(
    routePaths,
    routeParents,
    routeObjects,
    routeBindings,
  );

  const versionedValue = createVersionedValueMap({ 1: resolver });
  return (
    <RoutingContext.Provider value={versionedValue}>
      {children}
    </RoutingContext.Provider>
  );
};
