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
import { GithubDeployment } from '../../api';
import { DateTime } from 'luxon';
import { Box, Typography } from '@material-ui/core';
import {
  StatusPending,
  StatusRunning,
  StatusOK,
  TableColumn,
  StatusAborted,
  StatusError,
  Link,
} from '@backstage/core-components';

export const GithubStateIndicator = ({ state }: { state: string }) => {
  switch (state) {
    case 'PENDING':
      return <StatusPending />;
    case 'IN_PROGRESS':
      return <StatusRunning />;
    case 'ACTIVE':
      return <StatusOK />;
    case 'ERROR':
    case 'FAILURE':
      return <StatusError />;
    default:
      return <StatusAborted />;
  }
};

export function createEnvironmentColumn(): TableColumn<GithubDeployment> {
  return {
    title: 'Environment',
    field: 'environment',
    highlight: true,
  };
}

export function createStatusColumn(): TableColumn<GithubDeployment> {
  return {
    title: 'Status',
    render: (row: GithubDeployment): JSX.Element => (
      <Box display="flex" alignItems="center">
        <GithubStateIndicator state={row.state} />
        <Typography variant="caption">{row.state}</Typography>
      </Box>
    ),
  };
}

export function createCommitColumn(): TableColumn<GithubDeployment> {
  return {
    title: 'Commit',
    render: (row: GithubDeployment) =>
      row.commit && (
        <Link to={row.commit.commitUrl} target="_blank" rel="noopener">
          {row.commit.abbreviatedOid}
        </Link>
      ),
  };
}

export function createCreatorColumn(): TableColumn<GithubDeployment> {
  return {
    title: 'Creator',
    field: 'creator.login',
  };
}

export function createLastUpdatedColumn(): TableColumn<GithubDeployment> {
  return {
    title: 'Last Updated',
    render: (row: GithubDeployment): JSX.Element => (
      <Box>{DateTime.fromISO(row.updatedAt).toRelative({ locale: 'en' })}</Box>
    ),
  };
}
