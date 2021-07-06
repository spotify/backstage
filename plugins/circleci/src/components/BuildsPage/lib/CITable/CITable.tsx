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
import {
  Avatar,
  Link,
  Typography,
  Box,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import GitHubIcon from '@material-ui/icons/GitHub';
import LaunchIcon from '@material-ui/icons/Launch';
import { Link as RouterLink, generatePath } from 'react-router-dom';
import { durationHumanized, relativeTimeTo } from '../../../../util';
import { circleCIBuildRouteRef } from '../../../../route-refs';
import {
  StatusError,
  StatusWarning,
  StatusOK,
  StatusPending,
  StatusRunning,
  Table,
  TableColumn,
} from '@backstage/core-components';

export type CITableBuildInfo = {
  id: string;
  buildName: string;
  buildUrl?: string;
  startTime?: string;
  stopTime?: string;
  source: {
    branchName: string;
    commit: {
      hash: string;
      shortHash: string;
      url: string;
      committerName?: string;
    };
  };
  status: string;
  tests?: {
    total: number;
    passed: number;
    skipped: number;
    failed: number;
    testUrl: string; // fixme better name
  };
  workflow: {
    id: string;
    url: string;
    name?: string;
    jobName?: string;
  };
  user: {
    isUser: boolean;
    login: string;
    name?: string;
    avatarUrl?: string;
  };
  onRestartClick: () => void;
};

// retried, canceled, infrastructure_fail, timedout, not_run, running, failed, queued, scheduled, not_running, no_tests, fixed, success
const getStatusComponent = (status: string | undefined = '') => {
  switch (status.toLocaleLowerCase('en-US')) {
    case 'queued':
    case 'scheduled':
      return <StatusPending />;
    case 'running':
      return <StatusRunning />;
    case 'failed':
      return <StatusError />;
    case 'success':
      return <StatusOK />;
    case 'canceled':
    default:
      return <StatusWarning />;
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
      verticalAlign: 'center',
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const SourceInfo = ({ build }: { build: CITableBuildInfo }) => {
  const classes = useStyles();
  const { user, source } = build;

  return (
    <Box display="flex" alignItems="center" className={classes.root}>
      <Avatar alt={user.name} src={user.avatarUrl} className={classes.small} />
      <Box>
        <Typography variant="button">{source?.branchName}</Typography>
        <Typography variant="body1">
          {source?.commit?.url !== undefined ? (
            <Link href={source?.commit?.url} target="_blank">
              {source?.commit.shortHash}
            </Link>
          ) : (
            source?.commit.shortHash
          )}
        </Typography>
      </Box>
    </Box>
  );
};

const generatedColumns: TableColumn[] = [
  {
    title: 'ID',
    field: 'id',
    type: 'numeric',
    width: '80px',
  },
  {
    title: 'Build',
    field: 'buildName',
    highlight: true,
    width: '20%',
    render: (row: Partial<CITableBuildInfo>) => (
      <Link
        component={RouterLink}
        to={`${generatePath(circleCIBuildRouteRef.path, {
          buildId: row.id!,
        })}`}
      >
        {row.buildName ? row.buildName : row?.workflow?.name}
      </Link>
    ),
  },
  {
    title: 'Job',
    field: 'buildName',
    highlight: true,
    render: (row: Partial<CITableBuildInfo>) => (
      <Link href={row?.buildUrl} target="_blank">
        <Box display="flex" alignItems="center">
          <LaunchIcon fontSize="small" color="disabled" />
          <Box mr={1} />
          {row?.workflow?.jobName}
        </Box>
      </Link>
    ),
  },
  {
    title: 'Source',
    field: 'source.commit.hash',
    highlight: true,
    render: (row: Partial<CITableBuildInfo>) => (
      <SourceInfo build={row as any} />
    ),
  },
  {
    title: 'Status',
    field: 'status',
    render: (row: Partial<CITableBuildInfo>) => (
      <Box display="flex" alignItems="center">
        {getStatusComponent(row.status)}
        <Box mr={1} />
        <Typography variant="button">{row.status}</Typography>
      </Box>
    ),
  },
  {
    title: 'Time',
    field: 'startTime',
    render: (row: Partial<CITableBuildInfo>) => (
      <>
        <Typography variant="body2">
          run {relativeTimeTo(row?.startTime)}
        </Typography>
        <Typography variant="body2">
          took {durationHumanized(row?.startTime, row?.stopTime)}
        </Typography>
      </>
    ),
  },
  {
    title: 'Workflow',
    field: 'workflow.name',
  },
  {
    title: 'Actions',
    width: '10%',
    render: (row: Partial<CITableBuildInfo>) => (
      <IconButton onClick={row.onRestartClick}>
        <RetryIcon />
      </IconButton>
    ),
  },
];

type Props = {
  loading: boolean;
  retry: () => void;
  builds: CITableBuildInfo[];
  projectName: string;
  page: number;
  onChangePage: (page: number) => void;
  total: number;
  pageSize: number;
  onChangePageSize: (pageSize: number) => void;
};

export const CITable = ({
  projectName,
  loading,
  pageSize,
  page,
  retry,
  builds,
  onChangePage,
  onChangePageSize,
  total,
}: Props) => {
  return (
    <Table
      isLoading={loading}
      options={{
        paging: true,
        pageSize,
        padding: 'dense',
        pageSizeOptions: [10, 20, 50],
      }}
      totalCount={total}
      page={page}
      actions={[
        {
          icon: () => <RetryIcon />,
          tooltip: 'Refresh Data',
          isFreeAction: true,
          onClick: () => retry(),
        },
      ]}
      data={builds}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangePageSize}
      title={
        <Box display="flex" alignItems="center">
          <GitHubIcon />
          <Box mr={1} />
          <Typography variant="h6">{projectName}</Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};
