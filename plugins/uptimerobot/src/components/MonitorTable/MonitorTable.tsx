/*
 * Copyright 2021 Spotify AB
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

import { Button } from '@material-ui/core';
import { CurrentStatus } from '../CurrentStatus';
import { NormalizedMonitor } from '../../types';
import { PercentagesTable } from '../PercentagesTable';
import { SubvalueCell, Table } from '@backstage/core';
import { UptimeHistory } from '../UptimeHistory';
import LaunchIcon from '@material-ui/icons/Launch';
import React from 'react';

function dataMapper(monitor: NormalizedMonitor) {
  return {
    name: monitor.friendlyName,
    url: monitor.url,
    currentStatus: <CurrentStatus data={monitor.status} />,
    uptimeHistory: (
      <UptimeHistory
        data={monitor.customUptimeRanges}
        percentage={monitor.customUptimeRatio[2]}
      />
    ),
    otherRanges: <PercentagesTable data={monitor.customUptimeRatio} />,
    id: monitor.id,
    apiKey: monitor.apiKey,
    actions: (
      <Button
        href={`https://uptimerobot.com/dashboard.php#${monitor.id}`}
        endIcon={<LaunchIcon />}
        rel="noopener"
      >
        Show details
      </Button>
    ),
  };
}

const columns = [
  {
    field: 'name',
    title: 'Name and URL',
    render: (row: any): React.ReactNode => (
      <SubvalueCell value={row.name} subvalue={row.url} />
    ),
  },
  { field: 'currentStatus', title: 'Current status' },
  { field: 'uptimeHistory', title: 'Last 30 days' },
  { field: 'otherRanges', title: 'Other ranges' },
  {
    field: 'id',
    title: 'ID and API key',
    render: (row: any): React.ReactNode => (
      <SubvalueCell value={row.id} subvalue={row.apiKey} />
    ),
  },
  { field: 'actions', title: 'Actions' },
];

export const MonitorTable = ({
  monitors,
  allowedColumns = [
    'name',
    'currentStatus',
    'uptimeHistory',
    'otherRanges',
    'id',
    'actions',
  ],
}: {
  monitors: NormalizedMonitor[];
  allowedColumns?: string[];
}) => {
  const data = monitors.map(dataMapper);

  const filteredColumns = columns.filter(column => {
    return allowedColumns.includes(column.field);
  });

  return (
    <Table
      columns={filteredColumns}
      data={data}
      options={{
        search: false,
        paging: false,
        toolbar: false,
        padding: 'dense',
      }}
    />
  );
};
