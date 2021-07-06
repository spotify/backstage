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

import { githubActionsApiRef, GithubActionsClient } from './api';
import { rootRouteRef } from './routes';
import {
  configApiRef,
  createPlugin,
  createApiFactory,
  githubAuthApiRef,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';

export const githubActionsPlugin = createPlugin({
  id: 'github-actions',
  apis: [
    createApiFactory({
      api: githubActionsApiRef,
      deps: { configApi: configApiRef, githubAuthApi: githubAuthApiRef },
      factory: ({ configApi, githubAuthApi }) =>
        new GithubActionsClient({ configApi, githubAuthApi }),
    }),
  ],
  routes: {
    entityContent: rootRouteRef,
  },
});

export const EntityGithubActionsContent = githubActionsPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

export const EntityLatestGithubActionRunCard = githubActionsPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/Cards').then(m => m.LatestWorkflowRunCard),
    },
  }),
);

export const EntityLatestGithubActionsForBranchCard = githubActionsPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/Cards').then(m => m.LatestWorkflowsForBranchCard),
    },
  }),
);

export const EntityRecentGithubActionsRunsCard = githubActionsPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/Cards').then(m => m.RecentWorkflowRunsCard),
    },
  }),
);
