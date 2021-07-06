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
import { KafkaBackendClient } from './api/KafkaBackendClient';
import { kafkaApiRef } from './api/types';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  createRouteRef,
  discoveryApiRef,
} from '@backstage/core-plugin-api';

export const rootCatalogKafkaRouteRef = createRouteRef({
  path: '*',
  title: 'Kafka',
});

export const kafkaPlugin = createPlugin({
  id: 'kafka',
  apis: [
    createApiFactory({
      api: kafkaApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new KafkaBackendClient({ discoveryApi }),
    }),
  ],
  routes: {
    entityContent: rootCatalogKafkaRouteRef,
  },
});

export const EntityKafkaContent = kafkaPlugin.provide(
  createRoutableExtension({
    component: () => import('./Router').then(m => m.Router),
    mountPoint: rootCatalogKafkaRouteRef,
  }),
);
