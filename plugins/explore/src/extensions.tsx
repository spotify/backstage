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

import { explorePlugin } from './plugin';
import { exploreRouteRef } from './routes';
import {
  createComponentExtension,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

export const ExplorePage = explorePlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/ExplorePage').then(m => m.ExplorePage),
    mountPoint: exploreRouteRef,
  }),
);

export const DomainExplorerContent = explorePlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/DomainExplorerContent').then(
          m => m.DomainExplorerContent,
        ),
    },
  }),
);

export const GroupsExplorerContent = explorePlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/GroupsExplorerContent').then(
          m => m.GroupsExplorerContent,
        ),
    },
  }),
);

export const ToolExplorerContent = explorePlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/ToolExplorerContent').then(
          m => m.ToolExplorerContent,
        ),
    },
  }),
);
