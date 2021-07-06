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

import { NewRelicClient, newRelicApiRef } from './api';
import {
  createApiFactory,
  createPlugin,
  createRouteRef,
  discoveryApiRef,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  path: '/newrelic',
  title: 'newrelic',
});

export const newRelicPlugin = createPlugin({
  id: 'newrelic',
  apis: [
    createApiFactory({
      api: newRelicApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new NewRelicClient({ discoveryApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const NewRelicPage = newRelicPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/NewRelicComponent').then(m => m.default),
    mountPoint: rootRouteRef,
  }),
);
