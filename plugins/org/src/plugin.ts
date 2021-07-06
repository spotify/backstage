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
  createComponentExtension,
  createPlugin,
} from '@backstage/core-plugin-api';

export const orgPlugin = createPlugin({
  id: 'org',
});

export const EntityGroupProfileCard = orgPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components').then(m => m.GroupProfileCard),
    },
  }),
);
export const EntityMembersListCard = orgPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components').then(m => m.MembersListCard),
    },
  }),
);
export const EntityOwnershipCard = orgPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components').then(m => m.OwnershipCard),
    },
  }),
);
export const EntityUserProfileCard = orgPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components').then(m => m.UserProfileCard),
    },
  }),
);
