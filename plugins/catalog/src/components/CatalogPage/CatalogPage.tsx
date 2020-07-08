/*
 * Copyright 2020 Spotify AB
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
  Content,
  ContentHeader,
  identityApiRef,
  SupportButton,
  configApiRef,
  useApi,
} from '@backstage/core';
import { rootRoute as scaffolderRootRoute } from '@backstage/plugin-scaffolder';
import { Button, makeStyles, SvgIcon } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import React, { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { EntityFilterGroupsProvider, useFilteredEntities } from '../../filter';
import { useStarredEntities } from '../../hooks/useStarredEntites';
import { CatalogFilter, ButtonGroup } from '../CatalogFilter/CatalogFilter';
import { CatalogTable } from '../CatalogTable/CatalogTable';
import CatalogLayout from './CatalogLayout';
import { CatalogTabs, LabeledComponentType } from './CatalogTabs';
import { WelcomeBanner } from './WelcomeBanner';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
}));

const CatalogPageContents = () => {
  const styles = useStyles();
  const { loading, error, matchingEntities } = useFilteredEntities();
  const { isStarredEntity } = useStarredEntities();
  const userId = useApi(identityApiRef).getUserId();
  const [selectedTab, setSelectedTab] = useState<string>();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>();
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Company';
  const orgIcon =
    useApi(configApiRef).getOptionalString('organization.svg') ??
    'M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z';

  const tabs = useMemo<LabeledComponentType[]>(
    () => [
      {
        id: 'service',
        label: 'Services',
      },
      {
        id: 'website',
        label: 'Websites',
      },
      {
        id: 'library',
        label: 'Libraries',
      },
      {
        id: 'documentation',
        label: 'Documentation',
      },
      {
        id: 'other',
        label: 'Other',
      },
    ],
    [],
  );

  const filterGroups = useMemo<ButtonGroup[]>(
    () => [
      {
        name: 'Personal',
        items: [
          {
            id: 'owned',
            label: 'Owned',
            icon: SettingsIcon,
            filterFn: entity => entity.spec?.owner === userId,
          },
          {
            id: 'starred',
            label: 'Starred',
            icon: StarIcon,
            filterFn: isStarredEntity,
          },
        ],
      },
      {
        name: orgName,
        items: [
          {
            id: 'all',
            label: 'All',
            icon: () => (
              <SvgIcon>
                <path d={orgIcon} />
              </SvgIcon>
            ),
            filterFn: () => true,
          },
        ],
      },
    ],
    [isStarredEntity, userId, orgName, orgIcon],
  );

  return (
    <CatalogLayout>
      <CatalogTabs
        tabs={tabs}
        onChange={({ label }) => setSelectedTab(label)}
      />
      <Content>
        <WelcomeBanner />
        <ContentHeader title={selectedTab ?? ''}>
          <Button
            component={RouterLink}
            variant="contained"
            color="primary"
            to={scaffolderRootRoute.path}
          >
            Create Component
          </Button>
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <div className={styles.contentWrapper}>
          <div>
            <CatalogFilter
              buttonGroups={filterGroups}
              onChange={({ label }) => setSelectedSidebarItem(label)}
              initiallySelected="owned"
            />
          </div>
          <CatalogTable
            titlePreamble={selectedSidebarItem ?? ''}
            entities={matchingEntities}
            loading={loading}
            error={error}
          />
        </div>
      </Content>
    </CatalogLayout>
  );
};

export const CatalogPage = () => (
  <EntityFilterGroupsProvider>
    <CatalogPageContents />
  </EntityFilterGroupsProvider>
);
