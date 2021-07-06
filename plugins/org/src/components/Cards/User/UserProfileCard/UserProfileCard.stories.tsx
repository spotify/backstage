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

import { UserEntity } from '@backstage/catalog-model';
import { EntityContext } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { UserProfileCard } from './UserProfileCard';

export default {
  title: 'Plugins/Org/User Profile Card',
  component: UserProfileCard,
};

const dummyGroup = {
  type: 'memberOf',
  target: {
    namespace: 'default',
    kind: 'group',
    name: 'team-a',
  },
};

const defaultEntity: UserEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'guest',
  },
  spec: {
    profile: {
      displayName: 'Guest User',
      email: 'guest@example.com',
      picture:
        'https://avatars.dicebear.com/api/avataaars/guest@example.com.svg?background=%23fff',
    },
    memberOf: ['team-a'],
  },
  relations: [dummyGroup],
};

export const Default = () => (
  <MemoryRouter>
    <EntityContext.Provider value={{ entity: defaultEntity, loading: false }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <UserProfileCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityContext.Provider>
  </MemoryRouter>
);

const noImageEntity: UserEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'guest',
  },
  spec: {
    profile: {
      displayName: 'Guest User',
      email: 'guest@example.com',
    },
    memberOf: ['team-a'],
  },
  relations: [dummyGroup],
};

export const NoImage = () => (
  <MemoryRouter>
    <EntityContext.Provider value={{ entity: noImageEntity, loading: false }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <UserProfileCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityContext.Provider>
  </MemoryRouter>
);
