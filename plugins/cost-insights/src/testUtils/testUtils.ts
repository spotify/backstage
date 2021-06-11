/*
 * Copyright 2020 Spotify AB
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

import dayjs from 'dayjs';
import regression, { DataPoint } from 'regression';
import {
  ChangeStatistic,
  Duration,
  Entity,
  Trendline,
  DateAggregation,
  DEFAULT_DATE_FORMAT,
} from '../types';
import { inclusiveEndDateOf, inclusiveStartDateOf } from '../utils/duration';
import {
  MockComputeEngineInsights,
  MockCloudDataflowInsights,
  MockCloudStorageInsights,
  MockBigQueryInsights,
  MockEventsInsights,
} from './mockData';

type IntervalFields = {
  duration: Duration;
  endDate: string;
};

function parseIntervals(intervals: string): IntervalFields {
  const match = intervals.match(
    /\/(?<duration>P\d+[DM])\/(?<date>\d{4}-\d{2}-\d{2})/,
  );
  if (Object.keys(match?.groups || {}).length !== 2) {
    throw new Error(`Invalid intervals: ${intervals}`);
  }
  const { duration, date } = match!.groups!;
  return {
    duration: duration as Duration,
    endDate: date,
  };
}

export function aggregationFor(
  intervals: string,
  baseline: number,
): DateAggregation[] {
  const { duration, endDate } = parseIntervals(intervals);
  const inclusiveEndDate = inclusiveEndDateOf(duration, endDate);
  const days = dayjs(endDate).diff(
    inclusiveStartDateOf(duration, inclusiveEndDate),
    'day',
  );

  function nextDelta(): number {
    const varianceFromBaseline = 0.15;
    // Let's give positive vibes in trendlines - higher change for positive delta with >0.5 value
    const positiveTrendChance = 0.55;
    const normalization = positiveTrendChance - 1;
    return baseline * (Math.random() + normalization) * varianceFromBaseline;
  }

  return [...Array(days).keys()].reduce(
    (values: DateAggregation[], i: number): DateAggregation[] => {
      const last = values.length ? values[values.length - 1].amount : baseline;
      const date = dayjs(inclusiveStartDateOf(duration, inclusiveEndDate))
        .add(i, 'day')
        .format(DEFAULT_DATE_FORMAT);
      const amount = Math.max(0, last + nextDelta());
      values.push({
        date: date,
        amount: amount,
      });
      return values;
    },
    [],
  );
}

export function changeOf(aggregation: DateAggregation[]): ChangeStatistic {
  const firstAmount = aggregation.length ? aggregation[0].amount : 0;
  const lastAmount = aggregation.length
    ? aggregation[aggregation.length - 1].amount
    : 0;

  // if either the first or last amounts are zero, the rate of increase/decrease is infinite
  if (!firstAmount || !lastAmount) {
    return {
      amount: lastAmount - firstAmount,
    };
  }

  return {
    ratio: (lastAmount - firstAmount) / firstAmount,
    amount: lastAmount - firstAmount,
  };
}

export function trendlineOf(aggregation: DateAggregation[]): Trendline {
  const data: ReadonlyArray<DataPoint> = aggregation.map(a => [
    Date.parse(a.date) / 1000,
    a.amount,
  ]);
  const result = regression.linear(data, { precision: 5 });
  return {
    slope: result.equation[0],
    intercept: result.equation[1],
  };
}

export function entityOf(product: string): Entity {
  switch (product) {
    case 'computeEngine':
      return MockComputeEngineInsights;
    case 'cloudDataflow':
      return MockCloudDataflowInsights;
    case 'cloudStorage':
      return MockCloudStorageInsights;
    case 'bigQuery':
      return MockBigQueryInsights;
    case 'events':
      return MockEventsInsights;
    default:
      throw new Error(
        `Cannot get insights for ${product}. Make sure product matches product property in app-info.yaml`,
      );
  }
}

export const getGroupedProducts = (intervals: string) => [
  {
    id: 'Cloud Dataflow',
    aggregation: aggregationFor(intervals, 1_700),
  },
  {
    id: 'Compute Engine',
    aggregation: aggregationFor(intervals, 350),
  },
  {
    id: 'Cloud Storage',
    aggregation: aggregationFor(intervals, 1_300),
  },
  {
    id: 'BigQuery',
    aggregation: aggregationFor(intervals, 2_000),
  },
  {
    id: 'Cloud SQL',
    aggregation: aggregationFor(intervals, 750),
  },
  {
    id: 'Cloud Spanner',
    aggregation: aggregationFor(intervals, 50),
  },
  {
    id: 'Cloud Pub/Sub',
    aggregation: aggregationFor(intervals, 1_000),
  },
  {
    id: 'Cloud Bigtable',
    aggregation: aggregationFor(intervals, 250),
  },
];

export const getGroupedProjects = (intervals: string) => [
  {
    id: 'project-a',
    aggregation: aggregationFor(intervals, 1_700),
  },
  {
    id: 'project-b',
    aggregation: aggregationFor(intervals, 350),
  },
  {
    id: 'project-c',
    aggregation: aggregationFor(intervals, 1_300),
  },
];
