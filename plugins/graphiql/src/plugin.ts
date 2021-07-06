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

import {
  createPlugin,
  createApiFactory,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { graphQlBrowseApiRef, GraphQLEndpoints } from './lib/api';
import { graphiQLRouteRef } from './route-refs';

export const graphiqlPlugin = createPlugin({
  id: 'graphiql',
  apis: [
    // GitLab is used as an example endpoint, but most will want to plug in
    // their own instead.
    createApiFactory(
      graphQlBrowseApiRef,
      GraphQLEndpoints.from([
        GraphQLEndpoints.create({
          id: 'gitlab',
          title: 'GitLab',
          url: 'https://gitlab.com/api/graphql',
        }),
      ]),
    ),
  ],
});

export const GraphiQLPage = graphiqlPlugin.provide(
  createRoutableExtension({
    component: () => import('./components').then(m => m.GraphiQLPage),
    mountPoint: graphiQLRouteRef,
  }),
);
