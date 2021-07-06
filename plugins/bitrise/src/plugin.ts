/*
 * Copyright 2021 The Backstage Authors
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

import { BitriseClientApi } from './api/bitriseApi.client';

import { BitriseApi } from './api/bitriseApi';
import {
  discoveryApiRef,
  createApiRef,
  createApiFactory,
  createPlugin,
} from '@backstage/core-plugin-api';

export const bitriseApiRef = createApiRef<BitriseApi>({
  id: 'plugin.bitrise.service',
  description:
    'Used by the BitriseCI plugin to retrieve information about builds.',
});

export const bitrisePlugin = createPlugin({
  id: 'bitrise',
  apis: [
    createApiFactory({
      api: bitriseApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => {
        return new BitriseClientApi(discoveryApi);
      },
    }),
  ],
});
