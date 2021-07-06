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

import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import {
  githubAuthApiRef,
  errorApiRef,
  IconComponent,
} from '@backstage/core-plugin-api';
import GraphiQLIcon from '../src/assets/graphiql.icon.svg';
import {
  graphiqlPlugin,
  GraphQLEndpoints,
  graphQlBrowseApiRef,
  GraphiQLPage,
} from '../src';

createDevApp()
  .registerPlugin(graphiqlPlugin)
  .registerApi({
    api: graphQlBrowseApiRef,
    deps: {
      errorApi: errorApiRef,
      githubAuthApi: githubAuthApiRef,
    },
    factory({ errorApi, githubAuthApi }) {
      return GraphQLEndpoints.from([
        GraphQLEndpoints.github({
          id: 'github',
          title: 'GitHub',
          errorApi,
          githubAuthApi,
        }),
        GraphQLEndpoints.create({
          id: 'gitlab',
          title: 'GitLab',
          url: 'https://gitlab.com/api/graphql',
        }),
        GraphQLEndpoints.create({
          id: 'countries',
          title: 'Countries',
          url: 'https://countries.trevorblades.com/',
        }),
      ]);
    },
  })
  .addPage({
    title: 'GraphiQL',
    icon: GraphiQLIcon as IconComponent,
    element: <GraphiQLPage />,
  })
  .render();
