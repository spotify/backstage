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
import { makeStyles } from '@material-ui/core';
import {
  EntityKindPicker,
  EntityLifecyclePicker,
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListFilterKind,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { CatalogTable } from '../CatalogTable';

import { EntityRow } from '../CatalogTable/types';
import CatalogLayout from './CatalogLayout';
import { CreateComponentButton } from '../CreateComponentButton';
import {
  Content,
  ContentHeader,
  SupportButton,
  TableColumn,
  TableProps,
} from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
  buttonSpacing: {
    marginLeft: theme.spacing(2),
  },
}));

export type CatalogPageProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<EntityRow>[];
  actions?: TableProps<EntityRow>['actions'];
};

export const CatalogPage = ({
  initiallySelectedFilter = 'owned',
  columns,
  actions,
}: CatalogPageProps) => {
  const styles = useStyles();

  return (
    <CatalogLayout>
      <Content>
        <ContentHeader title="Components">
          <CreateComponentButton />
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <div className={styles.contentWrapper}>
          <EntityListProvider>
            <div>
              <EntityKindPicker initialFilter="component" hidden />
              <EntityTypePicker />
              <UserListPicker initialFilter={initiallySelectedFilter} />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />
            </div>
            <CatalogTable columns={columns} actions={actions} />
          </EntityListProvider>
        </div>
      </Content>
    </CatalogLayout>
  );
};
