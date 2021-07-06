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

import { Entity } from '@backstage/catalog-model';
import { createDevApp, EntityGridItem } from '@backstage/dev-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React from 'react';
import {
  EntitySentryCard,
  EntitySentryContent,
  MockSentryApi,
  SentryApi,
  sentryApiRef,
} from '../src';
import { SENTRY_PROJECT_SLUG_ANNOTATION } from '../src/components/useProjectSlug';
import { Content, Header, Page } from '@backstage/core-components';

const entity = (name?: string) =>
  ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        [SENTRY_PROJECT_SLUG_ANNOTATION]: name,
      },
      name: name,
    },
  } as Entity);

createDevApp()
  .registerApi({
    api: sentryApiRef,
    deps: {},
    factory: () =>
      ({
        fetchIssues: async (project: string) => {
          switch (project) {
            case 'error':
              throw new Error('Error!');

            case 'never':
              return new Promise(() => {});

            case 'with-values':
              return new MockSentryApi().fetchIssues();

            default:
              return [];
          }
        },
      } as SentryApi),
  })
  .addPage({
    title: 'Entity Content',
    element: (
      <Page themeId="home">
        <Header title="Sentry" />
        <Content>
          <EntityProvider entity={entity('error')}>
            <EntitySentryContent />
          </EntityProvider>
        </Content>
      </Page>
    ),
  })
  .addPage({
    title: 'Cards',
    element: (
      <Page themeId="home">
        <Header title="Sentry" />
        <Content>
          <Grid container>
            <EntityGridItem xs={12} md={6} entity={entity('error')}>
              <EntitySentryCard />
            </EntityGridItem>
            <EntityGridItem xs={12} md={6} entity={entity('empty')}>
              <EntitySentryCard />
            </EntityGridItem>
            <EntityGridItem xs={12} md={6} entity={entity('never')}>
              <EntitySentryCard />
            </EntityGridItem>
            <EntityGridItem xs={12} md={6} entity={entity('with-values')}>
              <EntitySentryCard />
            </EntityGridItem>
            <EntityGridItem xs={12} entity={entity(undefined)}>
              <EntitySentryCard />
            </EntityGridItem>
          </Grid>
        </Content>
      </Page>
    ),
  })
  .render();
