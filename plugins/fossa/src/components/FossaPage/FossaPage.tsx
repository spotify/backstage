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

import {
  Entity,
  EntityName,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import {
  catalogApiRef,
  EntityRefLink,
  EntityRefLinks,
  formatEntityRefTitle,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { Tooltip } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { DateTime } from 'luxon';
import * as React from 'react';
import { useMemo } from 'react';
import { useAsync } from 'react-use';
import { FindingSummary, fossaApiRef } from '../../api';
import { getProjectName } from '../getProjectName';

import {
  Content,
  Header,
  Link,
  Page,
  StatusError,
  StatusOK,
  StatusWarning,
  Table,
  TableColumn,
  TableFilter,
} from '@backstage/core-components';

import { useApi } from '@backstage/core-plugin-api';

type FossaRow = {
  entity: Entity;
  resolved: {
    name: string;
    ownedByRelationsTitle?: string;
    ownedByRelations: EntityName[];
    loading: boolean;
    details?: FindingSummary;
  };
};

const columns: TableColumn<FossaRow>[] = [
  {
    title: 'Name',
    field: 'resolved.name',
    highlight: true,
    width: 'auto',
    render: ({ entity }) => (
      <EntityRefLink entityRef={entity} defaultKind="Component" />
    ),
  },
  {
    title: 'Owner',
    field: 'resolved.ownedByRelationsTitle',
    render: ({ resolved }) => (
      <EntityRefLinks
        entityRefs={resolved.ownedByRelations}
        defaultKind="group"
      />
    ),
  },
  {
    title: 'Status',
    field: 'resolved.details.issueCount',
    // We interpret missing values as '0.5' to be sorted at the end of the projects with issues.
    customSort: (a, b) =>
      (b?.resolved?.details?.issueCount ?? 0.5) -
      (a?.resolved?.details?.issueCount ?? 0.5),
    render: ({ resolved }) => {
      if (resolved.loading) {
        return <Skeleton animation="pulse" />;
      } else if (!resolved.details) {
        return <StatusWarning>Not configured</StatusWarning>;
      } else if (resolved.details.dependencyCount === 0) {
        return <StatusWarning>No dependencies</StatusWarning>;
      } else if (resolved.details.issueCount > 0) {
        return <StatusError>{resolved.details.issueCount} Issues</StatusError>;
      }

      return <StatusOK>{resolved.details.issueCount} Issues</StatusOK>;
    },
  },
  {
    title: 'Dependencies',
    field: 'resolved.details.dependencyCount',
    render: ({ resolved: { loading, details } }) => {
      if (loading) {
        return <Skeleton animation="pulse" />;
      }

      return details?.dependencyCount;
    },
  },
  {
    title: 'Branch',
    field: 'resolved.details.projectDefaultBranch',
    render: ({ resolved: { loading, details } }) => {
      if (loading) {
        return <Skeleton animation="pulse" />;
      }

      return details?.projectDefaultBranch;
    },
  },
  {
    title: 'Last Updated',
    field: 'resolved.details.timestamp',
    render: ({ resolved: { loading, details } }) => {
      if (loading) {
        return <Skeleton animation="pulse" />;
      }

      return (
        details?.timestamp && (
          <Tooltip
            title={DateTime.fromISO(details.timestamp).toLocaleString(
              DateTime.DATETIME_MED,
            )}
          >
            <span>
              {DateTime.fromISO(details.timestamp).toRelative({
                locale: 'en',
              })}
            </span>
          </Tooltip>
        )
      );
    },
  },
  {
    sorting: false,
    render: ({ resolved: { loading, details } }) => {
      if (loading) {
        return <Skeleton animation="pulse" />;
      }

      return details && <Link to={details.projectUrl}>View in FOSSA</Link>;
    },
  },
];

const filters: TableFilter[] = [
  { column: 'Owner', type: 'multiple-select' },
  { column: 'Branch', type: 'select' },
];

export const FossaPage = () => {
  const catalogApi = useApi(catalogApiRef);
  const fossaApi = useApi(fossaApiRef);

  // Get a list of all relevant entities
  const { value: entities, loading: entitiesLoading } = useAsync(() => {
    return catalogApi.getEntities({
      filter: { kind: 'Component' },
      fields: [
        'kind',
        'metadata.namespace',
        'metadata.name',
        'metadata.annotations',
        'relations',
      ],
    });
  });

  // get the project names of all entities. the idx of both lists match.
  const projectNames = useMemo(
    () => entities?.items?.map(getProjectName) ?? [],
    [entities?.items],
  );

  // get the summary list
  const { value: summaries, loading: summariesLoading } = useAsync(
    async () =>
      await fossaApi.getFindingSummaries(
        projectNames.filter(n => n !== undefined) as string[],
      ),
    [projectNames],
  );

  // compose the rows
  const rows: FossaRow[] = useMemo(
    () =>
      entities?.items?.map((entity, idx) => {
        const projectName = projectNames[idx];
        const summary = projectName ? summaries?.get(projectName) : undefined;
        const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

        return {
          entity,
          resolved: {
            name: formatEntityRefTitle(entity),
            ownedByRelations,
            ownedByRelationsTitle: ownedByRelations
              .map(r => formatEntityRefTitle(r, { defaultKind: 'group' }))
              .join(', '),
            loading: summariesLoading,
            details: summary,
          },
        };
      }) ?? [],
    [projectNames, entities?.items, summaries, summariesLoading],
  );

  return (
    <Page themeId="home">
      <Header title="FOSSA Component Overview" />
      <Content>
        <Table<FossaRow>
          columns={columns}
          data={rows}
          filters={filters}
          isLoading={entitiesLoading}
          options={{
            pageSize: 20,
            actionsColumnIndex: -1,
            loadingType: 'linear',
            padding: 'dense',
            showEmptyDataSourceMessage: !entitiesLoading,
          }}
        />
      </Content>
    </Page>
  );
};
