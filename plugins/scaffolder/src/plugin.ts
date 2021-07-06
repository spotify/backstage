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

import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { scaffolderApiRef, ScaffolderClient } from './api';
import { EntityPicker } from './components/fields/EntityPicker';
import { OwnerPicker } from './components/fields/OwnerPicker';
import {
  repoPickerValidation,
  RepoUrlPicker,
} from './components/fields/RepoUrlPicker';
import { createScaffolderFieldExtension } from './extensions';
import { registerComponentRouteRef, rootRouteRef } from './routes';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

export const scaffolderPlugin = createPlugin({
  id: 'scaffolder',
  apis: [
    createApiFactory({
      api: scaffolderApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
        scmIntegrationsApi: scmIntegrationsApiRef,
      },
      factory: ({ discoveryApi, identityApi, scmIntegrationsApi }) =>
        new ScaffolderClient({ discoveryApi, identityApi, scmIntegrationsApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
  externalRoutes: {
    registerComponent: registerComponentRouteRef,
  },
});

export const EntityPickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: EntityPicker,
    name: 'EntityPicker',
  }),
);

export const RepoUrlPickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: RepoUrlPicker,
    name: 'RepoUrlPicker',
    validation: repoPickerValidation,
  }),
);

export const OwnerPickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: OwnerPicker,
    name: 'OwnerPicker',
  }),
);

export const ScaffolderPage = scaffolderPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);
