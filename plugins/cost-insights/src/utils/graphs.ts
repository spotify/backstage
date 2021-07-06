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

import { TooltipPayload, TooltipProps } from 'recharts';
import { AlertCost, DataKey, Entity, ResourceData } from '../types';
import {
  currencyFormatter,
  dateFormatter,
  lengthyCurrencyFormatter,
} from './formatters';

export function formatGraphValue(value: number, format?: string) {
  if (format === 'number') {
    return value.toLocaleString();
  }

  if (value < 1) {
    return lengthyCurrencyFormatter.format(value);
  }

  return currencyFormatter.format(value);
}

export const overviewGraphTickFormatter = (millis: string | number) =>
  typeof millis === 'number' ? dateFormatter.format(millis) : millis;

export const tooltipItemOf = (payload: TooltipPayload) => {
  const value =
    typeof payload.value === 'number'
      ? currencyFormatter.format(payload.value)
      : (payload.value as string);
  const fill = payload.fill as string;

  switch (payload.dataKey) {
    case DataKey.Current:
    case DataKey.Previous:
      return {
        label: payload.name,
        value: value,
        fill: fill,
      };
    default:
      return null;
  }
};

export const resourceOf = (entity: Entity | AlertCost): ResourceData => ({
  name: entity.id,
  previous: entity.aggregation[0],
  current: entity.aggregation[1],
});

export const titleOf = (label?: string | number) => {
  return label ? String(label) : 'Unlabeled';
};

export const isInvalid = ({ label, payload }: TooltipProps) => {
  // null labels are empty strings, which are valid
  return label === undefined || !payload || !payload.length;
};

export const isLabeled = (data?: Record<'activeLabel', string | undefined>) => {
  return data?.activeLabel && data?.activeLabel !== '';
};

export const isUnlabeled = (
  data?: Record<'activeLabel', string | undefined>,
) => {
  return data?.activeLabel === '';
};
