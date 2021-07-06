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

import { Box, Link, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import {
  RollbarFrameworkId,
  RollbarLevel,
  RollbarTopActiveItem,
} from '../../api/types';
import { buildItemUrl } from '../../utils';
import { TrendGraph } from '../TrendGraph/TrendGraph';
import { Table, TableColumn } from '@backstage/core-components';

const columns: TableColumn[] = [
  {
    title: 'ID',
    field: 'item.counter',
    type: 'string',
    align: 'left',
    width: '70px',
    render: (data: any) => (
      <Link
        href={buildItemUrl(data.org, data.project, data.item.counter)}
        target="_blank"
        rel="noreferrer"
      >
        {data.item.counter}
      </Link>
    ),
  },
  {
    title: 'Title',
    field: 'item.title',
    type: 'string',
    align: 'left',
  },
  {
    title: 'Trend',
    sorting: false,
    render: (data: any) => <TrendGraph counts={data.counts} />,
  },
  {
    title: 'Occurrences',
    field: 'item.occurrences',
    type: 'numeric',
    align: 'right',
  },
  {
    title: 'Environment',
    field: 'item.environment',
    type: 'string',
  },
  {
    title: 'Level',
    field: 'item.level',
    type: 'string',
    render: data => RollbarLevel[(data as RollbarTopActiveItem).item.level],
  },
  {
    title: 'Framework',
    field: 'item.framework',
    type: 'string',
    render: data =>
      RollbarFrameworkId[(data as RollbarTopActiveItem).item.framework],
  },
  {
    title: 'Last Occurrence',
    field: 'item.lastOccurrenceTimestamp',
    type: 'datetime',
    render: data =>
      new Date(
        (data as RollbarTopActiveItem).item.lastOccurrenceTimestamp * 1000,
      ).toLocaleDateString(),
  },
];

type Props = {
  items: RollbarTopActiveItem[];
  organization: string;
  project: string;
  loading: boolean;
  error?: any;
};

export const RollbarTopItemsTable = ({
  items,
  organization,
  project,
  loading,
  error,
}: Props) => {
  if (error) {
    return (
      <div>
        <Alert severity="error">
          Error encountered while fetching rollbar top items. {error.toString()}
        </Alert>
      </div>
    );
  }

  return (
    <Table
      isLoading={loading}
      columns={columns}
      options={{
        padding: 'dense',
        search: true,
        paging: true,
        pageSize: 5,
        showEmptyDataSourceMessage: !loading,
      }}
      title={
        <Box display="flex" alignItems="center">
          <Box mr={1} />
          <Typography variant="h6">Top Active Items / {project}</Typography>
        </Box>
      }
      data={items.map(i => ({ org: organization, project, ...i }))}
    />
  );
};
