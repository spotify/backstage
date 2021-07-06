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
import { Typography, makeStyles } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import * as columnFactories from './columns';
import { defaultDeploymentColumns } from './presets';
import { Table, TableColumn } from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

type GithubDeploymentsTableProps = {
  deployments: GithubDeployment[];
  isLoading: boolean;
  reload: () => void;
  columns: TableColumn<GithubDeployment>[];
};

export function GithubDeploymentsTable({
  deployments,
  isLoading,
  reload,
  columns,
}: GithubDeploymentsTableProps) {
  const classes = useStyles();

  return (
    <Table
      columns={columns}
      options={{ padding: 'dense', paging: true, search: false, pageSize: 5 }}
      title="GitHub Deployments"
      data={deployments}
      isLoading={isLoading}
      actions={[
        {
          icon: () => <SyncIcon />,
          tooltip: 'Reload',
          isFreeAction: true,
          onClick: () => reload(),
        },
      ]}
      emptyContent={
        <div className={classes.empty}>
          <Typography variant="body1">
            No deployments found for this entity.
          </Typography>
        </div>
      }
    />
  );
}

GithubDeploymentsTable.columns = columnFactories;

GithubDeploymentsTable.defaultDeploymentColumns = defaultDeploymentColumns;
