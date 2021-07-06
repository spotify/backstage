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

import { gcpApiRef, GcpClient } from './api';
import { rootRouteRef } from './routes';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  googleAuthApiRef,
} from '@backstage/core-plugin-api';

export const gcpProjectsPlugin = createPlugin({
  id: 'gcp-projects',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: gcpApiRef,
      deps: { googleAuthApi: googleAuthApiRef },
      factory({ googleAuthApi }) {
        return new GcpClient(googleAuthApi);
      },
    }),
  ],
});

export const GcpProjectsPage = gcpProjectsPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/GcpProjectsPage').then(m => m.GcpProjectsPage),
    mountPoint: rootRouteRef,
  }),
);
