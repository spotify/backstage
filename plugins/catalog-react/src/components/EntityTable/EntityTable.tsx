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

import { Entity } from '@backstage/catalog-model';
import { makeStyles } from '@material-ui/core';
import React, { ReactNode } from 'react';
import * as columnFactories from './columns';
import { componentEntityColumns, systemEntityColumns } from './presets';
import { Table, TableColumn } from '@backstage/core-components';

type Props<T extends Entity> = {
  title: string;
  variant?: 'gridItem';
  entities: T[];
  emptyContent?: ReactNode;
  columns: TableColumn<T>[];
};

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export function EntityTable<T extends Entity>({
  entities,
  title,
  emptyContent,
  variant = 'gridItem',
  columns,
}: Props<T>) {
  const classes = useStyles();
  const tableStyle: React.CSSProperties = {
    minWidth: '0',
    width: '100%',
  };

  if (variant === 'gridItem') {
    tableStyle.height = 'calc(100% - 10px)';
  }

  return (
    <Table<T>
      columns={columns}
      title={title}
      style={tableStyle}
      emptyContent={
        emptyContent && <div className={classes.empty}>{emptyContent}</div>
      }
      options={{
        // TODO: Toolbar padding if off compared to other cards, should be: padding: 16px 24px;
        search: false,
        paging: false,
        actionsColumnIndex: -1,
        padding: 'dense',
      }}
      data={entities}
    />
  );
}

EntityTable.columns = columnFactories;

EntityTable.systemEntityColumns = systemEntityColumns;

EntityTable.componentEntityColumns = componentEntityColumns;
