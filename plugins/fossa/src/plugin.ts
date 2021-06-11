/*
 * Copyright 2020 Spotify AB
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
  createPlugin,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core';
import { fossaApiRef, FossaClient } from './api';
import { rootRoute } from './routes';

export const fossaPlugin = createPlugin({
  id: 'fossa',
  apis: [
    createApiFactory({
      api: fossaApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ configApi, discoveryApi, identityApi }) =>
        new FossaClient({
          discoveryApi,
          identityApi,
          organizationId: configApi.getOptionalString('fossa.organizationId'),
        }),
    }),
  ],
  routes: {
    fossaOverview: rootRoute,
  },
});
