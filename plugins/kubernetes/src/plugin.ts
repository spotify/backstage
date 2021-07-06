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
import { KubernetesBackendClient } from './api/KubernetesBackendClient';
import { kubernetesApiRef } from './api/types';
import { kubernetesAuthProvidersApiRef } from './kubernetes-auth-provider/types';
import { KubernetesAuthProviders } from './kubernetes-auth-provider/KubernetesAuthProviders';
import {
  createApiFactory,
  createPlugin,
  createRouteRef,
  discoveryApiRef,
  identityApiRef,
  googleAuthApiRef,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

export const rootCatalogKubernetesRouteRef = createRouteRef({
  path: '*',
  title: 'Kubernetes',
});

export const kubernetesPlugin = createPlugin({
  id: 'kubernetes',
  apis: [
    createApiFactory({
      api: kubernetesApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ discoveryApi, identityApi }) =>
        new KubernetesBackendClient({ discoveryApi, identityApi }),
    }),
    createApiFactory({
      api: kubernetesAuthProvidersApiRef,
      deps: { googleAuthApi: googleAuthApiRef },
      factory: ({ googleAuthApi }) => {
        return new KubernetesAuthProviders({ googleAuthApi });
      },
    }),
  ],
  routes: {
    entityContent: rootCatalogKubernetesRouteRef,
  },
});

export const EntityKubernetesContent = kubernetesPlugin.provide(
  createRoutableExtension({
    component: () => import('./Router').then(m => m.Router),
    mountPoint: rootCatalogKubernetesRouteRef,
  }),
);
