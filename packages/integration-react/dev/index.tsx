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
import { createDevApp } from '@backstage/dev-utils';
import { ScmIntegrations } from '@backstage/integration';
import React from 'react';
import { scmIntegrationsApiRef } from '../src/ScmIntegrationsApi';
import { DevPage } from './DevPage';
import { configApiRef, createApiFactory } from '@backstage/core-plugin-api';

createDevApp()
  .registerApi(
    createApiFactory({
      api: scmIntegrationsApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => ScmIntegrations.fromConfig(configApi),
    }),
  )
  .addPage({
    element: <DevPage />,
    title: 'Root Page',
  })
  .render();
