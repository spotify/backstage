/*
 * Copyright 2021 Spotify AB
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
  configApiRef,
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { rootRouteRef } from './routes';
import { UPTIMEROBOT_MONITORS_ANNOTATION } from '../constants';
import { uptimerobotApiRef, UptimerobotClient } from './api';

export const uptimerobotPlugin = createPlugin({
  id: 'uptimerobot',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: uptimerobotApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
      },
      factory: ({ configApi, discoveryApi }) =>
        new UptimerobotClient({
          configApi,
          discoveryApi,
        }),
    }),
  ],
});

export const UptimerobotPage = uptimerobotPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/HomePage').then(m => m.HomePage),
    mountPoint: rootRouteRef,
  }),
);

export const isUptimerobotAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[UPTIMEROBOT_MONITORS_ANNOTATION]);

export const EntityUptimerobotOverviewCard = uptimerobotPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components/OverviewCard').then(m => m.OverviewCard),
    },
  }),
);
