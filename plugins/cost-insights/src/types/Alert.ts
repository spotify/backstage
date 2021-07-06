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
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { ChangeStatistic } from './ChangeStatistic';
import { Duration } from './Duration';
import { Maybe } from './Maybe';

/**
 * Generic alert type with required fields for display. The `element` field will be rendered in
 * the Cost Insights "Action Items" section. This should use data fetched in the CostInsightsApi
 * implementation to render an InfoCard or other visualization.
 *
 * The alert type exposes hooks which can be used to enable and access various events,
 * such as when a user dismisses or snoozes an alert. Default forms and buttons
 * will be rendered if a hook is defined.
 *
 * Each default form can be overridden with a custom component. It must be implemented using
 * React.forwardRef. See https://reactjs.org/docs/forwarding-refs
 *
 * Errors thrown within hooks will generate a snackbar error notification.
 */

export type Alert = {
  title: string | JSX.Element;
  subtitle: string | JSX.Element;
  element?: JSX.Element;
  status?: AlertStatus;
  url?: string;
  buttonText?: string; // Default: View Instructions
  SnoozeForm?: Maybe<AlertForm>;
  AcceptForm?: Maybe<AlertForm>;
  DismissForm?: Maybe<AlertForm>;
  onSnoozed?(options: AlertOptions): Promise<Alert[]>;
  onAccepted?(options: AlertOptions): Promise<Alert[]>;
  onDismissed?(options: AlertOptions): Promise<Alert[]>;
};

export type AlertForm<
  A extends Alert = any,
  Data = any
> = ForwardRefExoticComponent<
  AlertFormProps<A, Data> & RefAttributes<HTMLFormElement>
>;

export interface AlertOptions<T = any> {
  data: T;
  group: string;
}

/**
 * Default snooze form intervals are expressed using an ISO 8601 repeating interval string.
 * For example, R1/P7D/2020-09-02 for 1 week or R1/P30D/2020-09-02 for 1 month.
 *
 * For example, if a user dismisses an alert on Monday January 01 for 1 week,
 * it can be re-served on Monday, January 08. 7 calendar days from January 02,
 * inclusive of the last day.
 *
 * https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
 */
export interface AlertSnoozeFormData {
  intervals: string;
}

export interface AlertDismissFormData {
  other: Maybe<string>;
  reason: AlertDismissReason;
  feedback: Maybe<string>;
}

// TODO: Convert enum to literal
export enum AlertStatus {
  Snoozed = 'snoozed',
  Accepted = 'accepted',
  Dismissed = 'dismissed',
}

export type AlertFormProps<A extends Alert, FormData = {}> = {
  alert: A;
  onSubmit: (data: FormData) => void;
  disableSubmit: (isDisabled: boolean) => void;
};

export interface AlertDismissOption {
  label: string;
  reason: string;
}

export enum AlertDismissReason {
  Other = 'other',
  Resolved = 'resolved',
  Expected = 'expected',
  Seasonal = 'seasonal',
  Migration = 'migration',
  NotApplicable = 'not-applicable',
}

export const AlertDismissOptions: AlertDismissOption[] = [
  {
    reason: AlertDismissReason.Resolved,
    label: 'This action item is now resolved.',
  },
  {
    reason: AlertDismissReason.Seasonal,
    label: 'This is an expected increase at this time of year.',
  },
  {
    reason: AlertDismissReason.Migration,
    label: 'This increase is from a migration in process.',
  },
  {
    reason: AlertDismissReason.Expected,
    label: 'This is an expected increase due to our team’s priorities.',
  },
  {
    reason: AlertDismissReason.NotApplicable,
    label: 'This action item doesn’t make sense for my team.',
  },
  {
    reason: AlertDismissReason.Other,
    label: 'Other (please specify)',
  },
];

export type AlertSnoozeOption = {
  label: string;
  duration: Duration;
};

export const AlertSnoozeOptions: AlertSnoozeOption[] = [
  {
    duration: Duration.P7D,
    label: '1 Week',
  },
  {
    duration: Duration.P30D,
    label: '1 Month',
  },
  {
    duration: Duration.P90D,
    label: '1 Quarter',
  },
];

export interface AlertCost {
  id: string;
  aggregation: [number, number];
}

export interface ResourceData {
  previous: number;
  current: number;
  name: Maybe<string>;
}

export interface BarChartOptions {
  previousFill: string;
  currentFill: string;
  previousName: string;
  currentName: string;
}

/** deprecated use BarChartOptions instead */
export interface BarChartData extends BarChartOptions {}

export enum DataKey {
  Previous = 'previous',
  Current = 'current',
  Name = 'name',
}

export interface ProjectGrowthData {
  project: string;
  periodStart: string;
  periodEnd: string;
  aggregation: [number, number];
  change: ChangeStatistic;
  products: Array<AlertCost>;
}

export interface UnlabeledDataflowData {
  periodStart: string;
  periodEnd: string;
  projects: Array<UnlabeledDataflowAlertProject>;
  unlabeledCost: number;
  labeledCost: number;
}

export interface UnlabeledDataflowAlertProject {
  id: string;
  unlabeledCost: number;
  labeledCost: number;
}
