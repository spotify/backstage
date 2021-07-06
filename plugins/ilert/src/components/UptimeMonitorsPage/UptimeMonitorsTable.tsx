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
import { makeStyles } from '@material-ui/core/styles';
import { TableState } from '../../api';
import { UptimeMonitor } from '../../types';
import { StatusChip } from './StatusChip';
import Typography from '@material-ui/core/Typography';
import { DateTime as dt, Interval } from 'luxon';
import humanizeDuration from 'humanize-duration';
import { EscalationPolicyLink } from '../EscalationPolicy/EscalationPolicyLink';
import { UptimeMonitorCheckType } from './UptimeMonitorCheckType';
import { UptimeMonitorActionsMenu } from '../UptimeMonitor/UptimeMonitorActionsMenu';
import { UptimeMonitorLink } from '../UptimeMonitor/UptimeMonitorLink';
import { Table, TableColumn } from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const UptimeMonitorsTable = ({
  uptimeMonitors,
  tableState,
  isLoading,
  onChangePage,
  onChangeRowsPerPage,
  onUptimeMonitorChanged,
}: {
  uptimeMonitors: UptimeMonitor[];
  tableState: TableState;
  isLoading: boolean;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (pageSize: number) => void;
  onUptimeMonitorChanged: (uptimeMonitor: UptimeMonitor) => void;
}) => {
  const classes = useStyles();

  const smColumnStyle = {
    width: '5%',
    maxWidth: '5%',
  };
  const mdColumnStyle = {
    width: '10%',
    maxWidth: '10%',
  };
  const lgColumnStyle = {
    width: '15%',
    maxWidth: '15%',
  };

  const columns: TableColumn[] = [
    {
      title: 'ID',
      field: 'id',
      highlight: true,
      cellStyle: mdColumnStyle,
      headerStyle: mdColumnStyle,
      render: rowData => (
        <UptimeMonitorLink uptimeMonitor={rowData as UptimeMonitor} />
      ),
    },
    {
      title: 'Name',
      field: 'name',
      render: rowData => (
        <Typography>{(rowData as UptimeMonitor).name}</Typography>
      ),
    },
    {
      title: 'Check Type',
      field: 'checkType',
      cellStyle: lgColumnStyle,
      headerStyle: lgColumnStyle,
      render: rowData => (
        <UptimeMonitorCheckType uptimeMonitor={rowData as UptimeMonitor} />
      ),
    },
    {
      title: 'Last state change',
      field: 'lastStatusChange',
      type: 'datetime',
      cellStyle: mdColumnStyle,
      headerStyle: mdColumnStyle,
      render: rowData => (
        <Typography noWrap>
          {humanizeDuration(
            Interval.fromDateTimes(
              dt.fromISO((rowData as UptimeMonitor).lastStatusChange),
              dt.now(),
            )
              .toDuration()
              .valueOf(),
            { units: ['h', 'm', 's'], largest: 2, round: true },
          )}
        </Typography>
      ),
    },
    {
      title: 'Escalation policy',
      field: 'assignedTo',
      cellStyle: lgColumnStyle,
      headerStyle: lgColumnStyle,
      render: rowData => (
        <EscalationPolicyLink
          escalationPolicy={(rowData as UptimeMonitor).escalationPolicy}
        />
      ),
    },
    {
      title: 'Status',
      field: 'status',
      cellStyle: smColumnStyle,
      headerStyle: smColumnStyle,
      render: rowData => (
        <StatusChip uptimeMonitor={rowData as UptimeMonitor} />
      ),
    },
    {
      title: '',
      field: '',
      cellStyle: smColumnStyle,
      headerStyle: smColumnStyle,
      render: rowData => (
        <UptimeMonitorActionsMenu
          uptimeMonitor={rowData as UptimeMonitor}
          onUptimeMonitorChanged={onUptimeMonitorChanged}
        />
      ),
    },
  ];

  return (
    <Table
      options={{
        sorting: true,
        search: true,
        paging: true,
        actionsColumnIndex: -1,
        pageSize: tableState.pageSize,
        pageSizeOptions: [10, 20, 50, 100],
        padding: 'dense',
        loadingType: 'overlay',
        showEmptyDataSourceMessage: !isLoading,
      }}
      emptyContent={
        <Typography color="textSecondary" className={classes.empty}>
          No uptime monitor
        </Typography>
      }
      page={tableState.page}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      localization={{ header: { actions: undefined } }}
      isLoading={isLoading}
      columns={columns}
      data={uptimeMonitors}
    />
  );
};
