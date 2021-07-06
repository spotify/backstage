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
import { DateAggregation, ResourceData } from '../types';
import { ProductState } from './loading';

export const aggregationSort = (
  a: DateAggregation,
  b: DateAggregation,
): number => a.date.localeCompare(b.date);

export const resourceSort = (a: ResourceData, b: ResourceData) =>
  b.previous + b.current - (a.previous + a.current);

export function totalAggregationSort(a: ProductState, b: ProductState): number {
  const [prevA, currA] = a.entity?.aggregation ?? [0, 0];
  const [prevB, currB] = b.entity?.aggregation ?? [0, 0];
  return prevB + currB - (prevA + currA);
}
