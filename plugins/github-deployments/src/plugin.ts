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
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { githubDeploymentsApiRef, GithubDeploymentsApiClient } from './api';
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';

export const githubDeploymentsPlugin = createPlugin({
  id: 'github-deployments',
  apis: [
    createApiFactory({
      api: githubDeploymentsApiRef,
      deps: {
        scmIntegrationsApi: scmIntegrationsApiRef,
        githubAuthApi: githubAuthApiRef,
      },
      factory: ({ scmIntegrationsApi, githubAuthApi }) =>
        new GithubDeploymentsApiClient({ scmIntegrationsApi, githubAuthApi }),
    }),
  ],
});

export const EntityGithubDeploymentsCard = githubDeploymentsPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/GithubDeploymentsCard').then(
          m => m.GithubDeploymentsCard,
        ),
    },
  }),
);
