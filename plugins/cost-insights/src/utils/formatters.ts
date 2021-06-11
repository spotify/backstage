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

import moment from 'moment';
import pluralize from 'pluralize';
import { ChangeStatistic, Duration } from '../types';
import { inclusiveEndDateOf, inclusiveStartDateOf } from '../utils/duration';
import { notEmpty } from './assert';

export type Period = {
  periodStart: string;
  periodEnd: string;
};

export const costFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const lengthyCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  minimumSignificantDigits: 2,
  maximumSignificantDigits: 2,
});

export const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const monthFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  month: 'long',
  year: 'numeric',
});

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'short',
});

export const monthOf = (date: string): string => {
  return monthFormatter.format(Date.parse(date));
};

export const quarterOf = (date: string): string => {
  // Supports formatting YYYY-MM-DD and YYYY-[Q]Q returned in alerts
  const d = moment(date).isValid() ? moment(date) : moment(date, 'YYYY-[Q]Q');
  return d.format('[Q]Q YYYY');
};

export function formatCurrency(amount: number, currency?: string): string {
  const n = Math.round(amount);
  const numString = numberFormatter.format(n);

  return currency ? `${numString} ${pluralize(currency, n)}` : numString;
}

export function formatChange(change: ChangeStatistic): string {
  if (notEmpty(change.ratio)) {
    return formatPercent(Math.abs(change.ratio));
  }
  return change.amount >= 0 ? '∞' : '-∞';
}

export function formatPercent(n: number): string {
  // Number.toFixed shows scientific notation for extreme numbers
  if (isNaN(n) || Math.abs(n) < 0.01) {
    return '0%';
  }

  if (Math.abs(n) > 10) {
    return `>1000%`;
  }

  return `${(n * 100).toFixed(0)}%`;
}

export function formatLastTwoLookaheadQuarters(inclusiveEndDate: string) {
  const start = moment(
    inclusiveStartDateOf(Duration.P3M, inclusiveEndDate),
  ).format('[Q]Q YYYY');
  const end = moment(inclusiveEndDateOf(Duration.P3M, inclusiveEndDate)).format(
    '[Q]Q YYYY',
  );
  return `${start} vs ${end}`;
}

const formatRelativePeriod = (
  duration: Duration,
  date: string,
  isEndDate: boolean,
): string => {
  const periodStart = isEndDate ? inclusiveStartDateOf(duration, date) : date;
  const periodEnd = isEndDate ? date : inclusiveEndDateOf(duration, date);
  const days = moment.duration(duration).asDays();
  if (![periodStart, periodEnd].includes(date)) {
    throw new Error(`Invalid relative date ${date} for duration ${duration}`);
  }
  return date === periodStart ? `First ${days} Days` : `Last ${days} Days`;
};

export function formatPeriod(
  duration: Duration,
  date: string,
  isEndDate: boolean,
) {
  switch (duration) {
    case Duration.P3M:
      return quarterOf(
        isEndDate
          ? inclusiveEndDateOf(duration, date)
          : inclusiveStartDateOf(duration, date),
      );
    default:
      return formatRelativePeriod(duration, date, isEndDate);
  }
}
