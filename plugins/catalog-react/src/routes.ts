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

import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { createRouteRef } from '@backstage/core-plugin-api';

const NoIcon = () => null;

// TODO(Rugvip): Move these route refs back to the catalog plugin once we're all ported to using external routes
export const rootRoute = createRouteRef({
  icon: NoIcon,
  path: '',
  title: 'Catalog',
});
export const catalogRouteRef = rootRoute;

export const entityRoute = createRouteRef({
  icon: NoIcon,
  path: ':namespace/:kind/:name/*',
  title: 'Entity',
  params: ['namespace', 'kind', 'name'],
});
export const entityRouteRef = entityRoute;

// Utility function to get suitable route params for entityRoute, given an
// entity instance
export function entityRouteParams(entity: Entity) {
  return {
    kind: entity.kind.toLowerCase(),
    namespace:
      entity.metadata.namespace?.toLowerCase() ?? ENTITY_DEFAULT_NAMESPACE,
    name: entity.metadata.name,
  } as const;
}
