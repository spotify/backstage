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

import { GroupEntity } from '@backstage/catalog-model';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import {
  CatalogApi,
  catalogApiRef,
  EntityContext,
} from '@backstage/plugin-catalog-react';
import {
  BackstageTheme,
  createTheme,
  genPageTheme,
  shapes,
} from '@backstage/theme';
import { Grid, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { OwnershipCard } from './OwnershipCard';

export default {
  title: 'Plugins/Org/Ownership Card',
  component: OwnershipCard,
};

const defaultEntity: GroupEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: {
    name: 'team-a',
    description: 'Team A',
  },
  spec: {
    profile: {
      displayName: 'Team A',
      email: 'team-a@example.com',
      picture:
        'https://avatars.dicebear.com/api/identicon/team-a@example.com.svg?background=%23fff&margin=25',
    },
    type: 'group',
    children: [],
  },
};

const makeComponent = ({ type, name }: { type: string; name: string }) => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name,
  },
  spec: {
    type,
  },
  relations: [
    {
      type: 'ownedBy',
      target: {
        namespace: 'default',
        kind: 'Group',
        name: 'team-a',
      },
    },
  ],
});

const serviceA = makeComponent({ type: 'service', name: 'service-a' });
const serviceB = makeComponent({ type: 'service', name: 'service-a' });
const websiteA = makeComponent({ type: 'website', name: 'website-a' });

const catalogApi: Partial<CatalogApi> = {
  getEntities: () => Promise.resolve({ items: [serviceA, serviceB, websiteA] }),
};

const apiRegistry = ApiRegistry.from([[catalogApiRef, catalogApi]]);

export const Default = () => (
  <MemoryRouter>
    <ApiProvider apis={apiRegistry}>
      <EntityContext.Provider value={{ entity: defaultEntity, loading: false }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <OwnershipCard />
          </Grid>
        </Grid>
      </EntityContext.Provider>
    </ApiProvider>
  </MemoryRouter>
);

const monochromeTheme = (outer: BackstageTheme) =>
  createTheme({
    ...outer,
    defaultPageTheme: 'home',
    pageTheme: {
      home: genPageTheme(['#444'], shapes.wave2),
      documentation: genPageTheme(['#474747'], shapes.wave2),
      tool: genPageTheme(['#222'], shapes.wave2),
      service: genPageTheme(['#aaa'], shapes.wave2),
      website: genPageTheme(['#0e0e0e'], shapes.wave2),
      library: genPageTheme(['#9d9d9d'], shapes.wave2),
      other: genPageTheme(['#aaa'], shapes.wave2),
      app: genPageTheme(['#666'], shapes.wave2),
    },
  });

export const Themed = () => (
  <MemoryRouter>
    <ThemeProvider theme={monochromeTheme}>
      <ApiProvider apis={apiRegistry}>
        <EntityContext.Provider
          value={{ entity: defaultEntity, loading: false }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <OwnershipCard />
            </Grid>
          </Grid>
        </EntityContext.Provider>
      </ApiProvider>
    </ThemeProvider>
  </MemoryRouter>
);
