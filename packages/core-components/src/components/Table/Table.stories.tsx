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

import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Link } from '../Link';
import { SubvalueCell, Table, TableColumn } from '.';
import { TableFilter } from './Table';

export default {
  title: 'Data Display/Table',
  component: Table,
};

const useStyles = makeStyles(theme => ({
  container: {
    width: 850,
  },
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const generateTestData: (number: number) => Array<{}> = (rows = 10) => {
  const data: Array<{}> = [];
  while (data.length <= rows) {
    data.push({
      col1: `Some value ${data.length}`,
      col2: `More data ${data.length}`,
      subvalue: `Subvalue ${data.length}`,
      number: Math.round(Math.abs(Math.sin(data.length)) * 1000),
      date: new Date(Math.abs(Math.sin(data.length)) * 10000000000000),
    });
  }

  return data;
};

const testData10 = generateTestData(10);

export const DefaultTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: 'Column 1',
      field: 'col1',
      highlight: true,
    },
    {
      title: 'Column 2',
      field: 'col2',
    },
    {
      title: 'Numeric value',
      field: 'number',
      type: 'numeric',
    },
    {
      title: 'A Date',
      field: 'date',
      type: 'date',
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false }}
        data={testData10}
        columns={columns}
        title="Backstage Table"
      />
    </div>
  );
};

export const EmptyTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: 'Column 1',
      field: 'col1',
      highlight: true,
    },
    {
      title: 'Column 2',
      field: 'col2',
    },
    {
      title: 'Numeric value',
      field: 'number',
      type: 'numeric',
    },
    {
      title: 'A Date',
      field: 'date',
      type: 'date',
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false }}
        data={[]}
        columns={columns}
        emptyContent={
          <div className={classes.empty}>
            No data was added yet,&nbsp;
            <Link to="http://backstage.io/">learn how to add data</Link>.
          </div>
        }
        title="Backstage Table"
      />
    </div>
  );
};

export const SubtitleTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: 'Column 1',
      field: 'col1',
      highlight: true,
    },
    {
      title: 'Column 2',
      field: 'col2',
    },
    {
      title: 'Numeric value',
      field: 'number',
      type: 'numeric',
    },
    {
      title: 'A Date',
      field: 'date',
      type: 'date',
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false }}
        data={testData10}
        columns={columns}
        title="Backstage Table"
        subtitle="Table Subtitle"
      />
    </div>
  );
};

export const HiddenSearchTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: 'Column 1',
      field: 'col1',
      highlight: true,
    },
    {
      title: 'Column 2',
      field: 'col2',
    },
    {
      title: 'Numeric value',
      field: 'number',
      type: 'numeric',
    },
    {
      title: 'A Date',
      field: 'date',
      type: 'date',
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false, search: false }}
        data={testData10}
        columns={columns}
      />
    </div>
  );
};

export const SubvalueTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: 'Column 1',
      customFilterAndSearch: (
        query,
        row: any, // Only needed if you want subvalue searchable
      ) =>
        `${row.col1} ${row.subvalue}`
          .toLocaleUpperCase('en-US')
          .includes(query.toLocaleUpperCase('en-US')),
      field: 'col1',
      highlight: true,
      render: (row: any): React.ReactNode => (
        <SubvalueCell value={row.col1} subvalue={row.subvalue} />
      ),
    },
    {
      title: 'Column 2',
      field: 'col2',
    },
    {
      title: 'Numeric value',
      field: 'number',
      type: 'numeric',
    },
    {
      title: 'A Date',
      field: 'date',
      type: 'date',
    },
  ];

  return (
    <div className={classes.container}>
      <Table options={{ paging: false }} data={testData10} columns={columns} />
    </div>
  );
};

export const DenseTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: 'Column 1',
      field: 'col1',
      highlight: true,
    },
    {
      title: 'Column 2',
      field: 'col2',
    },
    {
      title: 'Numeric value',
      field: 'number',
      type: 'numeric',
    },
    {
      title: 'A Date',
      field: 'date',
      type: 'date',
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false, padding: 'dense' }}
        data={testData10}
        columns={columns}
        title="Backstage Table"
      />
    </div>
  );
};

export const FilterTable = () => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: 'Column 1',
      field: 'col1',
      highlight: true,
    },
    {
      title: 'Column 2',
      field: 'col2',
    },
    {
      title: 'Numeric value',
      field: 'number',
      type: 'numeric',
    },
    {
      title: 'A Date',
      field: 'date',
      type: 'date',
    },
  ];

  const filters: TableFilter[] = [
    {
      column: 'Column 1',
      type: 'select',
    },
    {
      column: 'Column 2',
      type: 'multiple-select',
    },
    {
      column: 'Numeric value',
      type: 'checkbox-tree',
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        options={{ paging: false, padding: 'dense' }}
        data={testData10}
        columns={columns}
        filters={filters}
      />
    </div>
  );
};
