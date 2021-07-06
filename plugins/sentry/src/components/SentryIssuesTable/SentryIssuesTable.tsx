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
import { SentryIssue } from '../../api';
import { DateTime } from 'luxon';
import { ErrorCell } from '../ErrorCell/ErrorCell';
import { ErrorGraph } from '../ErrorGraph/ErrorGraph';
import { Table, TableColumn } from '@backstage/core-components';

const columns: TableColumn[] = [
  {
    title: 'Error',
    render: data => <ErrorCell sentryIssue={data as SentryIssue} />,
  },
  {
    title: 'Graph',
    render: data => <ErrorGraph sentryIssue={data as SentryIssue} />,
  },
  {
    title: 'First seen',
    field: 'firstSeen',
    render: data => {
      const { firstSeen } = data as SentryIssue;

      return DateTime.fromISO(firstSeen).toRelative({ locale: 'en' });
    },
  },
  {
    title: 'Last seen',
    field: 'lastSeen',
    render: data => {
      const { lastSeen } = data as SentryIssue;
      return DateTime.fromISO(lastSeen).toRelative({ locale: 'en' });
    },
  },
  {
    title: 'Events',
    field: 'count',
  },
  {
    title: 'Users',
    field: 'userCount',
  },
];

type SentryIssuesTableProps = {
  sentryIssues: SentryIssue[];
};

const SentryIssuesTable = ({ sentryIssues }: SentryIssuesTableProps) => {
  return (
    <Table
      columns={columns}
      options={{ padding: 'dense', paging: true, search: false, pageSize: 5 }}
      title="Sentry issues"
      data={sentryIssues}
    />
  );
};

export default SentryIssuesTable;
