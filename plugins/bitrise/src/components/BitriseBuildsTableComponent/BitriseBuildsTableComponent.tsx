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

import React, { useState } from 'react';
import { Alert } from '@material-ui/lab';
import { Button } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import { useBitriseBuilds } from '../../hooks/useBitriseBuilds';
import {
  BitriseBuildResult,
  BitriseBuildResultStatus,
} from '../../api/bitriseApi.model';
import { BitriseBuildDetailsDialog } from '../BitriseBuildDetailsDialog';
import { DateTime } from 'luxon';
import {
  Table,
  TableColumn,
  Link,
  SubvalueCell,
  StatusOK,
  StatusWarning,
  StatusAborted,
  StatusError,
  StatusRunning,
} from '@backstage/core-components';

type BitriseBuildsProps = {
  appName: string;
  workflow?: string;
  error?: Error | undefined;
};

const bitriseBaseUrl = `https://app.bitrise.io`;

const createBitriseBuildUrl = (buildSlug: string) =>
  `${bitriseBaseUrl}/build/${buildSlug}#?tab=log`;

const renderBranch = (build: BitriseBuildResult): React.ReactNode => {
  return <SubvalueCell value={build.message} subvalue={build.workflow} />;
};

const renderStatus = (build: BitriseBuildResult): React.ReactNode => {
  switch (build.status) {
    case BitriseBuildResultStatus.successful: {
      return <StatusOK>{build.statusText}</StatusOK>;
    }
    case BitriseBuildResultStatus.failed: {
      return <StatusError>{build.statusText}</StatusError>;
    }
    case BitriseBuildResultStatus.notFinished: {
      return <StatusRunning>{build.statusText}</StatusRunning>;
    }
    case BitriseBuildResultStatus.abortedWithSuccess:
    case BitriseBuildResultStatus.abortedWithFailure: {
      return <StatusAborted>{build.statusText}</StatusAborted>;
    }
    default: {
      return <StatusWarning>{build.statusText}</StatusWarning>;
    }
  }
};

const renderSource = (build: BitriseBuildResult): React.ReactNode => {
  return build.source ? (
    <Button
      href={build.source}
      target="_blank"
      rel="noreferrer"
      startIcon={<GitHubIcon />}
    >
      {build.commitHash.substr(0, 6)}
    </Button>
  ) : null;
};

const renderId = (build: BitriseBuildResult): React.ReactNode => {
  return (
    <Link
      to={`${createBitriseBuildUrl(build.buildSlug)}`}
      target="_blank"
      rel="noreferrer"
    >
      {build.id}
    </Link>
  );
};

const renderDownload = (build: BitriseBuildResult): React.ReactNode => {
  return (
    <>
      {build.status === BitriseBuildResultStatus.successful && (
        <BitriseBuildDetailsDialog build={build} />
      )}
    </>
  );
};

const renderTriggerTime = (build: BitriseBuildResult): React.ReactNode => {
  return (
    <SubvalueCell
      value={DateTime.fromISO(build.triggerTime).toLocaleString(
        DateTime.DATETIME_MED,
      )}
      subvalue={
        build.status !== BitriseBuildResultStatus.notFinished && build.duration
      }
    />
  );
};

const renderErrors = (errors: (Error | undefined)[]) => {
  return errors.map(err =>
    err ? <Alert severity="error">{err.message}</Alert> : null,
  );
};

export const BitriseBuildsTable = ({
  appName,
  workflow,
  error,
}: BitriseBuildsProps) => {
  let selectedWorkflow = '';
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(20);
  const [{ page, next }, setPage] = React.useState<{
    page: number;
    next?: string;
  }>({ page: 0 });

  const [selectedSearchTerm, setSelectedSearchTerm] = useState<string>('');
  if (workflow) {
    selectedWorkflow = workflow;
  }

  const builds = useBitriseBuilds(appName, {
    workflow: selectedWorkflow.trim(),
    branch: selectedSearchTerm.trim(),
    limit: rowsPerPage,
    next,
  });

  const columns: TableColumn<BitriseBuildResult>[] = [
    {
      title: 'ID',
      field: 'id',
      highlight: true,
      render: build => renderId(build),
    },
    {
      title: 'Branch',
      customFilterAndSearch: (query, row: any) =>
        `${row.message} ${row.workflow}`
          .toLocaleUpperCase('en-US')
          .includes(query.toLocaleUpperCase('en-US')),
      field: 'message',
      width: 'auto',
      highlight: true,
      render: build => renderBranch(build),
    },
    {
      title: 'Status',
      field: 'status',
      render: build => renderStatus(build),
    },
    {
      title: 'Triggered',
      field: 'triggered',
      render: build => renderTriggerTime(build),
    },
    {
      title: 'Source',
      field: 'source',
      render: build => renderSource(build),
    },
    {
      title: 'Download',
      field: 'download',
      render: build => renderDownload(build),
    },
  ];

  const handleChangePage = (newPage: number, nextId: string | undefined) => {
    if (nextId) {
      setPage({ page: newPage, next: nextId });
    }
  };

  const handleChangeRowsPerPage = (amount: number) => {
    setRowsPerPage(amount);
    setPage({ page: 0, next: undefined });
  };

  return (
    <>
      {renderErrors([builds.error, error])}
      {!builds.error && (
        <Table
          isLoading={builds.loading}
          options={{
            search: true,
            searchAutoFocus: true,
            debounceInterval: 800,
            paging: true,
            showFirstLastPageButtons: false,
            pageSize: rowsPerPage,
            pageSizeOptions: [5, 10, 20, 50],
          }}
          totalCount={builds.value?.paging?.total_item_count || 0}
          page={page}
          onChangePage={pageIndex => {
            handleChangePage(pageIndex, builds.value?.paging?.next);
          }}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          columns={columns}
          data={builds.value?.data || []}
          onSearchChange={(searchTerm: string) =>
            setSelectedSearchTerm(searchTerm)
          }
        />
      )}
    </>
  );
};
