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

import { EntityMeta, TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { useStarredEntities } from '@backstage/plugin-catalog-react';
import { Button, Link, makeStyles, Typography } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import React, { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { EntityFilterGroupsProvider, useFilteredEntities } from '../../filter';
import { registerComponentRouteRef } from '../../routes';
import { ResultsFilter } from '../ResultsFilter/ResultsFilter';
import { ScaffolderFilter } from '../ScaffolderFilter';
import { ButtonGroup } from '../ScaffolderFilter/ScaffolderFilter';
import SearchToolbar from '../SearchToolbar/SearchToolbar';
import { TemplateCard } from '../TemplateCard';

import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';

import {
  Content,
  ContentHeader,
  Header,
  ItemCardGrid,
  Lifecycle,
  Page,
  Progress,
  SupportButton,
  WarningPanel,
} from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'grid'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
}));

export const ScaffolderPageContents = () => {
  const styles = useStyles();
  const {
    loading,
    error,
    filteredEntities,
    availableCategories,
  } = useFilteredEntities();
  const configApi = useApi(configApiRef);
  const orgName = configApi.getOptionalString('organization.name') ?? 'Company';
  const { isStarredEntity } = useStarredEntities();
  const filterGroups = useMemo<ButtonGroup[]>(
    () => [
      {
        name: orgName,
        items: [
          {
            id: 'all',
            label: 'All',
            filterFn: () => true,
          },
        ],
      },
      {
        name: 'Personal',
        items: [
          {
            id: 'starred',
            label: 'Starred',
            icon: StarIcon,
            filterFn: isStarredEntity,
          },
        ],
      },
    ],
    [isStarredEntity, orgName],
  );
  const [search, setSearch] = useState('');
  const [matchingEntities, setMatchingEntities] = useState(
    [] as TemplateEntityV1alpha1[],
  );

  const matchesQuery = (metadata: EntityMeta, query: string) =>
    `${metadata.title}`.toLocaleUpperCase('en-US').includes(query) ||
    metadata.tags?.join('').toLocaleUpperCase('en-US').indexOf(query) !== -1;

  const registerComponentLink = useRouteRef(registerComponentRouteRef);

  useEffect(() => {
    if (search.length === 0) {
      return setMatchingEntities(filteredEntities);
    }
    return setMatchingEntities(
      filteredEntities.filter(template =>
        matchesQuery(template.metadata, search.toLocaleUpperCase('en-US')),
      ),
    );
  }, [search, filteredEntities]);

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="Create a New Component"
        title={
          <>
            Create a New Component <Lifecycle alpha shorthand />
          </>
        }
        subtitle="Create new software components using standard templates"
      />
      <Content>
        <ContentHeader title="Available Templates">
          {registerComponentLink && (
            <Button
              component={RouterLink}
              variant="contained"
              color="primary"
              to={registerComponentLink()}
            >
              Register Existing Component
            </Button>
          )}
          <SupportButton>
            Create new software components using standard templates. Different
            templates create different kinds of components (services, websites,
            documentation, ...).
          </SupportButton>
        </ContentHeader>

        <div className={styles.contentWrapper}>
          <div>
            <SearchToolbar search={search} setSearch={setSearch} />
            <ScaffolderFilter
              buttonGroups={filterGroups}
              initiallySelected="all"
            />
            <ResultsFilter availableCategories={availableCategories} />
          </div>
          <div>
            {loading && <Progress />}

            {error && (
              <WarningPanel title="Oops! Something went wrong loading the templates">
                {error.message}
              </WarningPanel>
            )}

            {!error &&
              !loading &&
              matchingEntities &&
              !matchingEntities.length && (
                <Typography variant="body2">
                  No templates found that match your filter. Learn more about{' '}
                  <Link href="https://backstage.io/docs/features/software-templates/adding-templates">
                    adding templates
                  </Link>
                  .
                </Typography>
              )}

            <ItemCardGrid>
              {matchingEntities &&
                matchingEntities?.length > 0 &&
                matchingEntities.map((template, i) => (
                  <TemplateCard
                    key={i}
                    template={template}
                    deprecated={template.apiVersion === 'backstage.io/v1alpha1'}
                  />
                ))}
            </ItemCardGrid>
          </div>
        </div>
      </Content>
    </Page>
  );
};

export const ScaffolderPage = () => (
  <EntityFilterGroupsProvider>
    <ScaffolderPageContents />
  </EntityFilterGroupsProvider>
);
