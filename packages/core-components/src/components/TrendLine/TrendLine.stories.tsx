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
import { Table } from '../Table';
import { TrendLine } from './TrendLine';
import { InfoCard } from '../../layout/InfoCard';

export default {
  title: 'Data Display/TrendLine',
  component: TrendLine,
};

const containerStyle = { width: 700 };

const data = [
  {
    stock: 'A',
    day: <TrendLine data={[0.1, 0.5, 0.7, 1]} title="Trend over time" />,
    week: <TrendLine data={[1, 0.7, 0.9, 1]} title="Trend over time" />,
    month: <TrendLine data={[0.1, 0.3, 0.6, 1]} title="Trend over time" />,
    year: <TrendLine data={[0.8, 0.8, 0.8, 1]} title="Trend over time" />,
  },
  {
    stock: 'B',
    day: <TrendLine data={[0.8, 0.7, 0.5, 0.1]} title="Trend over time" />,
    week: <TrendLine data={[1, 0.9, 0.9, 1]} title="Trend over time" />,
    month: <TrendLine data={[1, 0.8, 0.6, 0.4]} title="Trend over time" />,
    year: <TrendLine data={[1, 1, 0.9, 0.8]} title="Trend over time" />,
  },
  {
    stock: 'C',
    day: <TrendLine data={[0.5, 0.3, 0.9, 1]} title="Trend over time" />,
    week: <TrendLine data={[1, 0.7, 0.9, 0.3]} title="Trend over time" />,
    month: <TrendLine data={[0.4, 0.6, 0.8, 0.4]} title="Trend over time" />,
    year: <TrendLine data={[0.2, 0.5, 0.8, 1]} title="Trend over time" />,
  },
  {
    stock: 'D',
    day: <TrendLine data={[0.8, 0.7, 0.5, 0.1]} title="Trend over time" />,
    week: <TrendLine data={[0.2, 0.7, 0.9, 1]} title="Trend over time" />,
    month: <TrendLine data={[1, 0.8, 0.8, 0.8]} title="Trend over time" />,
    year: <TrendLine data={[1, 0.6, 0.9, 0.7]} title="Trend over time" />,
  },
  {
    stock: 'E',
    day: (
      <TrendLine
        data={[1, 0.3, 0.3, 0.6]}
        color="blue"
        title="Trend over time"
      />
    ),
    week: (
      <TrendLine
        data={[0.1, 0.9, 0.1, 0.9]}
        color="rgb(241,225,89)"
        title="Trend over time"
      />
    ),
    month: (
      <TrendLine
        data={[0.1, 0.3, 0.5, 0.7]}
        color="#9a59b7"
        title="Trend over time"
      />
    ),
    year: (
      <TrendLine
        data={[0.1, 0.7, 0.4, 1]}
        color="#000000"
        title="Trend over time"
      />
    ),
  },
];

const columns = [
  { field: 'stock', title: 'Stock' },
  { field: 'day', title: 'Day' },
  { field: 'week', title: 'Week' },
  { field: 'month', title: 'Month' },
  { field: 'year', title: 'Year' },
];

export const Default = () => (
  <div style={containerStyle}>
    <InfoCard title="Trends over time" noPadding>
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

export const TrendingMix = () => (
  <div style={containerStyle}>
    <TrendLine data={[0.1, 0.7, 0.5, 0.8]} title="Trend over time" />
  </div>
);

export const TrendingUp = () => (
  <div style={containerStyle}>
    <TrendLine data={[0.1, 0.5, 0.9, 1.0]} title="Trend over time" />
  </div>
);

export const TrendingDown = () => (
  <div style={containerStyle}>
    <TrendLine data={[0.8, 0.7, 0.5, 0.1]} title="Trend over time" />
  </div>
);

export const TrendingCustomColor = () => (
  <div style={containerStyle}>
    <TrendLine
      data={[0.8, 0.7, 0.5, 0.1]}
      color="purple"
      title="Trend over time"
    />
  </div>
);
