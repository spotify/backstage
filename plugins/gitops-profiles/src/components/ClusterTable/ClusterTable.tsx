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
import { Link } from '@material-ui/core';
import { ClusterStatus } from '../../api';
import { transformStatus } from '../ProfileCatalog/ProfileCatalog';
import { Table, TableColumn } from '@backstage/core-components';

const columns: TableColumn[] = [
  {
    title: 'Cluster Name',
    field: 'name',
    highlight: true,
    render: (componentData: any) => (
      <Link href={`/gitops-cluster/${componentData.name}`}>
        {componentData.name}
      </Link>
    ),
  },
  {
    title: 'Status',
    field: 'status',
    render: (componentData: any) => (
      <>
        {transformStatus({
          status: componentData.status,
          conclusion: componentData.conclusion,
          message: componentData.status,
        })}
      </>
    ),
  },
  {
    title: 'Conclusion',
    field: 'Conclusion',
    render: (componentData: any) => (
      <>
        {transformStatus({
          status: componentData.status,
          conclusion: componentData.conclusion,
          message: componentData.conclusion,
        })}
      </>
    ),
  },
];

type ClusterTableProps = {
  components: ClusterStatus[];
};
const ClusterTable = ({ components }: ClusterTableProps) => {
  return (
    <Table columns={columns} options={{ paging: false }} data={components} />
  );
};
export default ClusterTable;
