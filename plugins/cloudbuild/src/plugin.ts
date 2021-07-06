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
import { cloudbuildApiRef, CloudbuildClient } from './api';
import { rootRouteRef } from './routes';
import {
  createPlugin,
  createApiFactory,
  googleAuthApiRef,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';

export const cloudbuildPlugin = createPlugin({
  id: 'cloudbuild',
  apis: [
    createApiFactory({
      api: cloudbuildApiRef,
      deps: { googleAuthApi: googleAuthApiRef },
      factory({ googleAuthApi }) {
        return new CloudbuildClient(googleAuthApi);
      },
    }),
  ],
  routes: {
    entityContent: rootRouteRef,
  },
});

export const EntityCloudbuildContent = cloudbuildPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

export const EntityLatestCloudbuildRunCard = cloudbuildPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/Cards').then(m => m.LatestWorkflowRunCard),
    },
  }),
);

export const EntityLatestCloudbuildsForBranchCard = cloudbuildPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/Cards').then(m => m.LatestWorkflowsForBranchCard),
    },
  }),
);
