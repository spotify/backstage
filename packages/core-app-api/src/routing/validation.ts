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

import { AnyRouteRef } from './types';

export function validateRoutes(
  routePaths: Map<AnyRouteRef, string>,
  routeParents: Map<AnyRouteRef, AnyRouteRef | undefined>,
) {
  const notLeafRoutes = new Set(routeParents.values());
  notLeafRoutes.delete(undefined);

  for (const route of routeParents.keys()) {
    if (notLeafRoutes.has(route)) {
      continue;
    }

    let currentRouteRef: AnyRouteRef | undefined = route;

    let fullPath = '';
    while (currentRouteRef) {
      const path = routePaths.get(currentRouteRef);
      if (!path) {
        throw new Error(`No path for ${currentRouteRef}`);
      }
      fullPath = `${path}${fullPath}`;
      currentRouteRef = routeParents.get(currentRouteRef);
    }

    const params = fullPath.match(/:(\w+)/g);
    if (params) {
      for (let j = 0; j < params.length; j++) {
        for (let i = j + 1; i < params.length; i++) {
          if (params[i] === params[j]) {
            throw new Error(
              `Parameter ${params[i]} is duplicated in path ${fullPath}`,
            );
          }
        }
      }
    }
  }
}
