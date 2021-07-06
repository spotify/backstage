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

import { DateAggregation, Trendline, ChartData } from '../types';

export function trendFrom(trendline: Trendline, date: number): number {
  return trendline.slope * (date / 1000) + trendline.intercept;
}

export function groupByDate(
  acc: Record<string, number>,
  entry: DateAggregation,
): Record<string, number> {
  return { ...acc, [entry.date]: entry.amount };
}

export function toMaxCost(acc: ChartData, entry: ChartData): ChartData {
  return acc.dailyCost > entry.dailyCost ? acc : entry;
}

export function toDataMax(metric: string, data: ChartData[]): number {
  return (
    (data.reduce(toMaxCost).dailyCost / Math.abs(data[0].trend)) *
    data[0][metric]
  );
}
