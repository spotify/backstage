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
import { Link, Typography, Box, IconButton, Tooltip } from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import GoogleIcon from '@material-ui/icons/CloudCircle';
import { Link as RouterLink, generatePath } from 'react-router-dom';
import { useWorkflowRuns, WorkflowRun } from '../useWorkflowRuns';
import { WorkflowRunStatus } from '../WorkflowRunStatus';
import SyncIcon from '@material-ui/icons/Sync';
import { useProjectName } from '../useProjectName';
import { Entity } from '@backstage/catalog-model';
import { buildRouteRef } from '../../routes';
import moment from 'moment';
import { Table, TableColumn } from '@backstage/core-components';

const generatedColumns: TableColumn[] = [
  {
    title: 'Status',
    width: '150px',

    render: (row: Partial<WorkflowRun>) => (
      <Box display="flex" alignItems="center">
        <WorkflowRunStatus status={row.status} />
      </Box>
    ),
  },
  {
    title: 'Build',
    field: 'id',
    type: 'numeric',
    width: '150px',
    render: (row: Partial<WorkflowRun>) => (
      <Typography variant="body2" noWrap>
        <p>{row.id?.substring(0, 8)}</p>
      </Typography>
    ),
  },
  {
    title: 'Source',
    field: 'source',
    highlight: true,
    width: '200px',
    render: (row: Partial<WorkflowRun>) => (
      <Link
        component={RouterLink}
        to={generatePath(buildRouteRef.path, { id: row.id! })}
      >
        {row.message}
      </Link>
    ),
  },
  {
    title: 'Ref',
    render: (row: Partial<WorkflowRun>) => (
      <Typography variant="body2" noWrap>
        <p>{row.substitutions?.BRANCH_NAME}</p>
      </Typography>
    ),
  },
  {
    title: 'Commit',
    render: (row: Partial<WorkflowRun>) => (
      <Typography variant="body2" noWrap>
        <p>{row.substitutions?.SHORT_SHA}</p>
      </Typography>
    ),
  },
  {
    title: 'Created',
    render: (row: Partial<WorkflowRun>) => (
      <Typography variant="body2" noWrap>
        <p>{moment(row.createTime).format('DD-MM-YYYY hh:mm:ss')}</p>
      </Typography>
    ),
  },
  {
    title: 'Actions',
    render: (row: Partial<WorkflowRun>) => (
      <Tooltip title="Rerun workflow">
        <IconButton onClick={row.rerun}>
          <RetryIcon />
        </IconButton>
      </Tooltip>
    ),
    width: '10%',
  },
];

type Props = {
  loading: boolean;
  retry: () => void;
  runs?: WorkflowRun[];
  projectName: string;
  page: number;
  onChangePage: (page: number) => void;
  total: number;
  pageSize: number;
  onChangePageSize: (pageSize: number) => void;
};

export const WorkflowRunsTableView = ({
  projectName,
  loading,
  pageSize,
  page,
  retry,
  runs,
  onChangePage,
  onChangePageSize,
  total,
}: Props) => {
  return (
    <Table
      isLoading={loading}
      options={{ paging: true, pageSize, padding: 'dense' }}
      totalCount={total}
      page={page}
      actions={[
        {
          icon: () => <SyncIcon />,
          tooltip: 'Reload workflow runs',
          isFreeAction: true,
          onClick: () => retry(),
        },
      ]}
      data={runs ?? []}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangePageSize}
      style={{ width: '100%' }}
      title={
        <Box display="flex" alignItems="center">
          <GoogleIcon />
          <Box mr={1} />
          <Typography variant="h6">{projectName}</Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};

export const WorkflowRunsTable = ({ entity }: { entity: Entity }) => {
  const { value: projectName, loading } = useProjectName(entity);
  const [projectId] = (projectName ?? '/').split('/');

  const [tableProps, { retry, setPage, setPageSize }] = useWorkflowRuns({
    projectId,
  });

  return (
    <WorkflowRunsTableView
      {...tableProps}
      loading={loading || tableProps.loading}
      retry={retry}
      onChangePageSize={setPageSize}
      onChangePage={setPage}
    />
  );
};
