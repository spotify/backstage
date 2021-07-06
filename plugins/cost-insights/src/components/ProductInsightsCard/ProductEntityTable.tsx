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
import classnames from 'classnames';
import { Typography } from '@material-ui/core';
import { costFormatter, formatChange } from '../../utils/formatters';
import { useEntityDialogStyles as useStyles } from '../../utils/styles';
import { CostGrowthIndicator } from '../CostGrowth';
import { BarChartOptions, ChangeStatistic, Entity } from '../../types';
import { Table, TableColumn } from '@backstage/core-components';

export type ProductEntityTableOptions = Partial<
  Pick<BarChartOptions, 'previousName' | 'currentName'>
>;

type RowData = {
  id: string;
  label: string;
  previous: number;
  current: number;
  change: ChangeStatistic;
};

function createRenderer(col: keyof RowData, classes: Record<string, string>) {
  return function render(rowData: {}): JSX.Element {
    const row = rowData as RowData;
    const rowStyles = classnames(classes.row, {
      [classes.rowTotal]: row.id === 'total',
      [classes.colFirst]: col === 'label',
      [classes.colLast]: col === 'change',
    });

    switch (col) {
      case 'previous':
      case 'current':
        return (
          <Typography className={rowStyles}>
            {costFormatter.format(row[col])}
          </Typography>
        );
      case 'change':
        return (
          <CostGrowthIndicator
            className={rowStyles}
            change={row.change}
            formatter={formatChange}
          />
        );
      default:
        return <Typography className={rowStyles}>{row.label}</Typography>;
    }
  };
}

// material-table does not support fixed rows. Override the sorting algorithm
// to force Total row to bottom by default or when a user sort toggles a column.
function createSorter(field?: keyof Omit<RowData, 'id'>) {
  return function rowSort(data1: {}, data2: {}): number {
    const a = data1 as RowData;
    const b = data2 as RowData;
    if (a.id === 'total') return 1;
    if (b.id === 'total') return 1;
    if (field === 'label') return a.label.localeCompare(b.label);
    if (field === 'change') {
      if (formatChange(a[field]) === '∞' || formatChange(b[field]) === '-∞')
        return 1;
      if (formatChange(a[field]) === '-∞' || formatChange(b[field]) === '∞')
        return -1;
      return a[field].ratio! - b[field].ratio!;
    }

    return b.previous + b.current - (a.previous + a.current);
  };
}

type ProductEntityTableProps = {
  entityLabel: string;
  entity: Entity;
  options: ProductEntityTableOptions;
};

export const ProductEntityTable = ({
  entityLabel,
  entity,
  options,
}: ProductEntityTableProps) => {
  const classes = useStyles();
  const entities = entity.entities[entityLabel];

  const data = Object.assign(
    {
      previousName: 'Previous',
      currentName: 'Current',
    },
    options,
  );

  const firstColClasses = classnames(classes.column, classes.colFirst);
  const lastColClasses = classnames(classes.column, classes.colLast);

  const columns: TableColumn[] = [
    {
      field: 'label',
      title: <Typography className={firstColClasses}>{entityLabel}</Typography>,
      render: createRenderer('label', classes),
      customSort: createSorter('label'),
      width: '33.33%',
    },
    {
      field: 'previous',
      title: (
        <Typography className={classes.column}>{data.previousName}</Typography>
      ),
      align: 'right',
      render: createRenderer('previous', classes),
      customSort: createSorter('previous'),
    },
    {
      field: 'current',
      title: (
        <Typography className={classes.column}>{data.currentName}</Typography>
      ),
      align: 'right',
      render: createRenderer('current', classes),
      customSort: createSorter('current'),
    },
    {
      field: 'change',
      title: <Typography className={lastColClasses}>Change</Typography>,
      align: 'right',
      render: createRenderer('change', classes),
      customSort: createSorter('change'),
    },
  ];

  const rowData: RowData[] = entities
    .map(e => ({
      id: e.id || 'Unknown',
      label: e.id || 'Unknown',
      previous: e.aggregation[0],
      current: e.aggregation[1],
      change: e.change,
    }))
    .concat({
      id: 'total',
      label: 'Total',
      previous: entity.aggregation[0],
      current: entity.aggregation[1],
      change: entity.change,
    })
    .sort(createSorter());

  return (
    <Table
      columns={columns}
      data={rowData}
      title={entity.id || 'Unlabeled'}
      options={{
        paging: false,
        search: false,
        hideFilterIcons: true,
      }}
    />
  );
};
