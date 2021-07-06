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

import { CatalogClient } from '@backstage/catalog-client';
import { createDevApp } from '@backstage/dev-utils';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import React from 'react';
import { scaffolderApiRef, ScaffolderClient } from '../src';
import { ScaffolderPage } from '../src/plugin';
import {
  configApiRef,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

createDevApp()
  .registerApi({
    api: catalogApiRef,
    deps: { discoveryApi: discoveryApiRef },
    factory: ({ discoveryApi }) => new CatalogClient({ discoveryApi }),
  })
  .registerApi({
    api: scaffolderApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      identityApi: identityApiRef,
      configApi: configApiRef,
      scmIntegrationsApi: scmIntegrationsApiRef,
    },
    factory: ({ discoveryApi, identityApi, scmIntegrationsApi }) =>
      new ScaffolderClient({ discoveryApi, identityApi, scmIntegrationsApi }),
  })
  .addPage({
    path: '/create',
    title: 'Create',
    element: <ScaffolderPage />,
  })
  .render();
