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

import { lighthouseApiRef, LighthouseRestApi } from './api';
import {
  createPlugin,
  createRouteRef,
  createApiFactory,
  configApiRef,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  path: '',
  title: 'Lighthouse',
});

export const viewAuditRouteRef = createRouteRef({
  path: 'audit/:id',
  title: 'View Lighthouse Audit',
});

export const createAuditRouteRef = createRouteRef({
  path: 'create-audit',
  title: 'Create Lighthouse Audit',
});

export const entityContentRouteRef = createRouteRef({
  title: 'Lighthouse Entity Content',
});

export const lighthousePlugin = createPlugin({
  id: 'lighthouse',
  apis: [
    createApiFactory({
      api: lighthouseApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => LighthouseRestApi.fromConfig(configApi),
    }),
  ],
  routes: {
    root: createAuditRouteRef,
    entityContent: entityContentRouteRef,
  },
});

export const LighthousePage = lighthousePlugin.provide(
  createRoutableExtension({
    component: () => import('./Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

export const EntityLighthouseContent = lighthousePlugin.provide(
  createRoutableExtension({
    component: () => import('./Router').then(m => m.EmbeddedRouter),
    mountPoint: entityContentRouteRef,
  }),
);

export const EntityLastLighthouseAuditCard = lighthousePlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/Cards').then(m => m.LastLighthouseAuditCard),
    },
  }),
);
