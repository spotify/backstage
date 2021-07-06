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
import { splunkOnCallApiRef, SplunkOnCallClient } from './api';
import {
  createApiFactory,
  createPlugin,
  createRouteRef,
  discoveryApiRef,
  configApiRef,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  title: 'splunk-on-call',
});

export const splunkOnCallPlugin = createPlugin({
  id: 'splunk-on-call',
  apis: [
    createApiFactory({
      api: splunkOnCallApiRef,
      deps: { discoveryApi: discoveryApiRef, configApi: configApiRef },
      factory: ({ configApi, discoveryApi }) =>
        SplunkOnCallClient.fromConfig(configApi, discoveryApi),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const SplunkOnCallPage = splunkOnCallPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/SplunkOnCallPage').then(m => m.SplunkOnCallPage),
    mountPoint: rootRouteRef,
  }),
);

export const EntitySplunkOnCallCard = splunkOnCallPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/EntitySplunkOnCallCard').then(
          m => m.EntitySplunkOnCallCard,
        ),
    },
  }),
);
