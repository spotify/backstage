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

import { Entity, LOCATION_ANNOTATION } from '@backstage/catalog-model';
import { createDevApp } from '@backstage/dev-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import OnlineIcon from '@material-ui/icons/Cloud';
import OfflineIcon from '@material-ui/icons/Storage';
import React from 'react';
import { EntityTodoContent, todoApiRef, todoPlugin } from '../src';

import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { Content, Header, HeaderLabel, Page } from '@backstage/core-components';

const entity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'backstage',
    annotations: {
      [LOCATION_ANNOTATION]:
        'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
    },
  },
  spec: {
    type: 'library',
  },
};

const mockedApi = {
  listTodos: async () => ({
    items: [
      {
        text: 'Make sure this works',
        tag: 'TODO',
        author: 'Rugvip',
        viewUrl: 'https://github.com/backstage/backstage',
      },
    ],
    totalCount: 15,
    offset: 0,
    limit: 10,
  }),
};

createDevApp()
  .registerPlugin(todoPlugin)
  .addPage({
    element: (
      <ApiProvider apis={ApiRegistry.with(todoApiRef, mockedApi)}>
        <EntityProvider entity={entity}>
          <Page themeId="service">
            <Header title="Mocked TODO Data">
              <HeaderLabel label="Mode" value="Development" />
            </Header>
            <Content>
              <EntityTodoContent />
            </Content>
          </Page>
        </EntityProvider>
      </ApiProvider>
    ),
    title: 'Entity Todo Content',
    icon: OfflineIcon,
  })
  .addPage({
    element: (
      <EntityProvider entity={entity}>
        <Page themeId="service">
          <Header title="Live TODO Data">
            <HeaderLabel label="Mode" value="Development" />
          </Header>
          <Content>
            <EntityTodoContent />
          </Content>
        </Page>
      </EntityProvider>
    ),
    title: 'Backend Connected',
    icon: OnlineIcon,
  })
  .render();
