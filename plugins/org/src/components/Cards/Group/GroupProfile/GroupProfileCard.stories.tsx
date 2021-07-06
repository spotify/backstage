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
import { EntityContext } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { GroupProfileCard } from './GroupProfileCard';

export default {
  title: 'Plugins/Org/Group Profile Card',
  component: GroupProfileCard,
};

const dummyDepartment = {
  type: 'childOf',
  target: {
    namespace: 'default',
    kind: 'group',
    name: 'department-a',
  },
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
  relations: [dummyDepartment],
};

export const Default = () => (
  <MemoryRouter>
    <EntityContext.Provider value={{ entity: defaultEntity, loading: false }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <GroupProfileCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityContext.Provider>
  </MemoryRouter>
);
