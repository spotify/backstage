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
import { Box, IconButton, Link, Typography, Tooltip } from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import JenkinsLogo from '../../../../assets/JenkinsLogo.svg';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import { JenkinsRunStatus } from '../Status';
import { useBuilds } from '../../../useBuilds';
import { useProjectSlugFromEntity } from '../../../useProjectSlugFromEntity';
import { buildRouteRef } from '../../../../plugin';
import { Table, TableColumn } from '@backstage/core-components';

export type CITableBuildInfo = {
  id: string;
  buildName: string;
  buildNumber: number;
  buildUrl: string;
  source: {
    branchName: string;
    url: string;
    displayName: string;
    author?: string;
    commit: {
      hash: string;
    };
  };
  status: string;
  tests?: {
    total: number;
    passed: number;
    skipped: number;
    failed: number;
    testUrl: string;
  };
  onRestartClick: () => void;
};

const FailCount = ({ count }: { count: number }): JSX.Element | null => {
  if (count !== 0) {
    return <>{count} failed</>;
  }
  return null;
};

const SkippedCount = ({ count }: { count: number }): JSX.Element | null => {
  if (count !== 0) {
    return <>{count} skipped</>;
  }
  return null;
};

const FailSkippedWidget = ({
  skipped,
  failed,
}: {
  skipped: number;
  failed: number;
}): JSX.Element | null => {
  if (skipped === 0 && failed === 0) {
    return null;
  }

  if (skipped !== 0 && failed !== 0) {
    return (
      <>
        {' '}
        (<FailCount count={failed} />, <SkippedCount count={skipped} />)
      </>
    );
  }

  if (failed !== 0) {
    return (
      <>
        {' '}
        (<FailCount count={failed} />)
      </>
    );
  }

  if (skipped !== 0) {
    return (
      <>
        {' '}
        (<SkippedCount count={skipped} />)
      </>
    );
  }

  return null;
};

const generatedColumns: TableColumn[] = [
  {
    title: 'Build',
    field: 'buildName',
    highlight: true,
    render: (row: Partial<CITableBuildInfo>) => {
      if (!row.source?.branchName || !row.buildNumber) {
        return <>{row.buildName}</>;
      }

      return (
        <Link
          component={RouterLink}
          to={generatePath(buildRouteRef.path, {
            branch: encodeURIComponent(row.source.branchName),
            buildNumber: row.buildNumber.toString(),
          })}
        >
          {row.buildName}
        </Link>
      );
    },
  },
  {
    title: 'Source',
    field: 'source.branchName',
    render: (row: Partial<CITableBuildInfo>) => (
      <>
        <p>
          <Link href={row.source?.url || ''} target="_blank">
            {row.source?.branchName}
          </Link>
        </p>
        <p>{row.source?.commit?.hash}</p>
      </>
    ),
  },
  {
    title: 'Status',
    field: 'status',
    render: (row: Partial<CITableBuildInfo>) => {
      return (
        <Box display="flex" alignItems="center">
          <JenkinsRunStatus status={row.status} />
        </Box>
      );
    },
  },
  {
    title: 'Tests',
    sorting: false,
    render: (row: Partial<CITableBuildInfo>) => {
      return (
        <>
          <p>
            {row.tests && (
              <Link href={row.tests.testUrl || ''} target="_blank">
                {row.tests.passed} / {row.tests.total} passed
                <FailSkippedWidget
                  skipped={row.tests.skipped}
                  failed={row.tests.failed}
                />
              </Link>
            )}

            {!row.tests && 'n/a'}
          </p>
        </>
      );
    },
  },
  {
    title: 'Actions',
    sorting: false,
    render: (row: Partial<CITableBuildInfo>) => (
      <Tooltip title="Rerun build">
        <IconButton onClick={row.onRestartClick}>
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
  builds: CITableBuildInfo[];
  projectName: string;
  page: number;
  onChangePage: (page: number) => void;
  total: number;
  pageSize: number;
  onChangePageSize: (pageSize: number) => void;
};

export const CITableView = ({
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
      options={{ paging: true, pageSize, padding: 'dense' }}
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
      data={builds ?? []}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangePageSize}
      title={
        <Box display="flex" alignItems="center">
          <img src={JenkinsLogo} alt="Jenkins logo" height="50px" />
          <Box mr={2} />
          <Typography variant="h6">Project: {projectName}</Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};

export const CITable = () => {
  const projectName = useProjectSlugFromEntity();

  const [tableProps, { setPage, retry, setPageSize }] = useBuilds(projectName);

  return (
    <CITableView
      {...tableProps}
      retry={retry}
      onChangePageSize={setPageSize}
      onChangePage={setPage}
    />
  );
};
