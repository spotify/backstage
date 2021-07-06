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
import { ilertApiRef, TableState } from '../../api';
import { Incident, IncidentStatus } from '../../types';
import { StatusChip } from './StatusChip';
import { AlertSourceLink } from '../AlertSource/AlertSourceLink';
import { TableTitle } from './TableTitle';
import Typography from '@material-ui/core/Typography';
import { DateTime as dt, Interval } from 'luxon';
import humanizeDuration from 'humanize-duration';
import { IncidentActionsMenu } from '../Incident/IncidentActionsMenu';
import { IncidentLink } from '../Incident/IncidentLink';

import { Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const IncidentsTable = ({
  incidents,
  incidentsCount,
  tableState,
  states,
  isLoading,
  onIncidentChanged,
  setIsLoading,
  onIncidentStatesChange,
  onChangePage,
  onChangeRowsPerPage,
  compact,
}: {
  incidents: Incident[];
  incidentsCount: number;
  tableState: TableState;
  states: IncidentStatus[];
  isLoading: boolean;
  onIncidentChanged: (incident: Incident) => void;
  setIsLoading: (isLoading: boolean) => void;
  onIncidentStatesChange: (states: IncidentStatus[]) => void;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (pageSize: number) => void;
  compact?: boolean;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles();

  const xsColumnStyle = {
    width: '5%',
    maxWidth: '5%',
  };
  const smColumnStyle = {
    width: '10%',
    maxWidth: '10%',
  };
  const mdColumnStyle = {
    width: '15%',
    maxWidth: '15%',
  };
  const lgColumnStyle = {
    width: '20%',
    maxWidth: '20%',
  };
  const xlColumnStyle = {
    width: '30%',
    maxWidth: '30%',
  };

  const idColumn: TableColumn = {
    title: 'ID',
    field: 'id',
    highlight: true,
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => <IncidentLink incident={rowData as Incident} />,
  };
  const summaryColumn: TableColumn = {
    title: 'Summary',
    field: 'summary',
    cellStyle: !compact ? xlColumnStyle : undefined,
    headerStyle: !compact ? xlColumnStyle : undefined,
    render: rowData => <Typography>{(rowData as Incident).summary}</Typography>,
  };
  const sourceColumn: TableColumn = {
    title: 'Source',
    field: 'source',
    cellStyle: mdColumnStyle,
    headerStyle: mdColumnStyle,
    render: rowData => (
      <AlertSourceLink alertSource={(rowData as Incident).alertSource} />
    ),
  };
  const durationColumn: TableColumn = {
    title: 'Duration',
    field: 'reportTime',
    type: 'datetime',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => (
      <Typography noWrap>
        {(rowData as Incident).status !== 'RESOLVED'
          ? humanizeDuration(
              Interval.fromDateTimes(
                dt.fromISO((rowData as Incident).reportTime),
                dt.now(),
              )
                .toDuration()
                .valueOf(),
              { units: ['h', 'm', 's'], largest: 2, round: true },
            )
          : humanizeDuration(
              Interval.fromDateTimes(
                dt.fromISO((rowData as Incident).reportTime),
                dt.fromISO((rowData as Incident).resolvedOn),
              )
                .toDuration()
                .valueOf(),
              { units: ['h', 'm', 's'], largest: 2, round: true },
            )}
      </Typography>
    ),
  };
  const assignedToColumn: TableColumn = {
    title: 'Assigned to',
    field: 'assignedTo',
    cellStyle: !compact ? mdColumnStyle : lgColumnStyle,
    headerStyle: !compact ? mdColumnStyle : lgColumnStyle,
    render: rowData => (
      <Typography noWrap>
        {ilertApi.getUserInitials((rowData as Incident).assignedTo)}
      </Typography>
    ),
  };
  const priorityColumn: TableColumn = {
    title: 'Priority',
    field: 'priority',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => (
      <Typography noWrap>
        {(rowData as Incident).priority === 'HIGH' ? 'High' : 'Low'}
      </Typography>
    ),
  };
  const statusColumn: TableColumn = {
    title: 'Status',
    field: 'status',
    cellStyle: xsColumnStyle,
    headerStyle: xsColumnStyle,
    render: rowData => <StatusChip incident={rowData as Incident} />,
  };
  const actionsColumn: TableColumn = {
    title: '',
    field: '',
    cellStyle: xsColumnStyle,
    headerStyle: xsColumnStyle,
    render: rowData => (
      <IncidentActionsMenu
        incident={rowData as Incident}
        onIncidentChanged={onIncidentChanged}
        setIsLoading={setIsLoading}
      />
    ),
  };

  const columns: TableColumn[] = compact
    ? [
        summaryColumn,
        durationColumn,
        assignedToColumn,
        statusColumn,
        actionsColumn,
      ]
    : [
        idColumn,
        summaryColumn,
        sourceColumn,
        durationColumn,
        assignedToColumn,
        priorityColumn,
        statusColumn,
        actionsColumn,
      ];
  let tableStyle: React.CSSProperties = {};
  if (compact) {
    tableStyle = {
      width: '100%',
      maxWidth: '100%',
      minWidth: '0',
      height: 'calc(100% - 10px)',
      boxShadow: 'none !important',
      borderRadius: 'none !important',
    };
  } else {
    tableStyle = {
      width: '100%',
      maxWidth: '100%',
    };
  }

  return (
    <Table
      style={tableStyle}
      options={{
        sorting: false,
        search: !compact,
        paging: !compact,
        actionsColumnIndex: -1,
        pageSize: tableState.pageSize,
        pageSizeOptions: !compact ? [10, 20, 50, 100] : [3, 10, 20, 50, 100],
        padding: 'dense',
        loadingType: 'overlay',
        showEmptyDataSourceMessage: !isLoading,
        showTitle: true,
        toolbar: true,
      }}
      emptyContent={
        <Typography color="textSecondary" className={classes.empty}>
          No incidents right now
        </Typography>
      }
      title={
        !compact ? (
          <TableTitle
            incidentStates={states}
            onIncidentStatesChange={onIncidentStatesChange}
          />
        ) : (
          <Typography variant="button" color="textSecondary">
            INCIDENTS
          </Typography>
        )
      }
      page={tableState.page}
      totalCount={incidentsCount}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      // localization={{ header: { actions: undefined } }}
      columns={columns}
      data={incidents}
      isLoading={isLoading}
    />
  );
};
