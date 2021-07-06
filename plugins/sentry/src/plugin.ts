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

import { ProductionSentryApi, sentryApiRef } from './api';
import {
  configApiRef,
  createApiFactory,
  createPlugin,
  createRouteRef,
  discoveryApiRef,
} from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  path: '/sentry',
  title: 'Sentry',
});

export const sentryPlugin = createPlugin({
  id: 'sentry',
  apis: [
    createApiFactory({
      api: sentryApiRef,
      deps: { configApi: configApiRef, discoveryApi: discoveryApiRef },
      factory: ({ configApi, discoveryApi }) =>
        new ProductionSentryApi(
          discoveryApi,
          configApi.getString('sentry.organization'),
        ),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});
