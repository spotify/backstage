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
import {
  StatusError,
  StatusAborted,
  StatusOK,
  StatusPending,
  StatusRunning,
  StatusWarning,
} from './Status';
import { Table } from '../Table';
import { InfoCard } from '../../layout/InfoCard';

export default {
  title: 'Data Display/Status',
  component: StatusOK,
};

const data = [
  {
    status: <StatusOK>OK</StatusOK>,
    label: 'OK',
    usage: 'Deployment successful',
  },
  {
    status: <StatusWarning>Warning</StatusWarning>,
    usage: 'CPU utilization at 90%',
  },
  {
    status: <StatusError>Error</StatusError>,
    usage: 'Service could not be created',
  },
  {
    status: <StatusAborted>Aborted</StatusAborted>,
    usage: 'Build for PR #34 aborted',
  },
  {
    status: <StatusPending>Pending</StatusPending>,
    usage: 'Job is waiting',
  },
  {
    status: <StatusRunning>Running</StatusRunning>,
    usage: 'Job is running',
  },
];

const columns = [
  { field: 'status', title: 'Status' },
  { field: 'usage', title: 'Example usage' },
];

const containerStyle = { width: 600 };

export const Default = () => (
  <div style={containerStyle}>
    <InfoCard title="Available status types" noPadding>
      <Table
        options={{
          search: false,
          paging: false,
          toolbar: false,
        }}
        data={data}
        columns={columns}
      />
    </InfoCard>
  </div>
);

export const statusOK = () => <StatusOK />;
export const statusWarning = () => <StatusWarning />;
export const statusError = () => <StatusError />;
export const statusAborted = () => <StatusAborted />;
export const statusPending = () => <StatusPending />;
export const statusRunning = () => <StatusRunning />;
