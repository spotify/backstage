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

import React from 'react';
import { makeStyles } from '@material-ui/core';
import {
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import {
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { EntityListDocsTable } from './EntityListDocsTable';
import { TechDocsHomeLayout } from './TechDocsHomeLayout';
import { TechDocsPicker } from './TechDocsPicker';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
}));

export const TechDocsHome = () => {
  const styles = useStyles();

  return (
    <TechDocsHomeLayout>
      <Content>
        <ContentHeader title="">
          <SupportButton>
            Discover documentation in your ecosystem.
          </SupportButton>
        </ContentHeader>
        <div className={styles.contentWrapper}>
          <EntityListProvider>
            <div>
              <TechDocsPicker />
              <UserListPicker initialFilter="all" />
              <EntityOwnerPicker />
              <EntityTagPicker />
            </div>
            <EntityListDocsTable />
          </EntityListProvider>
        </div>
      </Content>
    </TechDocsHomeLayout>
  );
};
