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
import { V1Pod } from '@kubernetes/client-node';
import { PodDrawer } from './PodDrawer';
import {
  containersReady,
  containerStatuses,
  totalRestarts,
} from '../../utils/pod';
import { Table, TableColumn } from '@backstage/core-components';

const columns: TableColumn<V1Pod>[] = [
  {
    title: 'name',
    highlight: true,
    render: (pod: V1Pod) => <PodDrawer pod={pod} />,
  },
  {
    title: 'phase',
    render: (pod: V1Pod) => pod.status?.phase ?? 'unknown',
  },
  {
    title: 'containers ready',
    align: 'center',
    render: containersReady,
  },
  {
    title: 'total restarts',
    align: 'center',
    render: totalRestarts,
    type: 'numeric',
  },
  {
    title: 'status',
    render: containerStatuses,
  },
];

type DeploymentTablesProps = {
  pods: V1Pod[];
  children?: React.ReactNode;
};

export const PodsTable = ({ pods }: DeploymentTablesProps) => {
  const tableStyle = {
    minWidth: '0',
    width: '100%',
  };

  return (
    <div style={tableStyle}>
      <Table
        options={{ paging: true, search: false }}
        data={pods}
        columns={columns}
      />
    </div>
  );
};
