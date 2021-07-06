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

import { Alert, AlertForm, AlertStatus, Maybe } from '../types';
import { AlertAcceptForm, AlertDismissForm, AlertSnoozeForm } from '../forms';

const createAlertHandler = (status?: AlertStatus) => (alert: Alert) =>
  alert.status === status;
export const isAlertActive = (alert: Alert) => !hasProperty(alert, 'status');
export const isAlertSnoozed = createAlertHandler(AlertStatus.Snoozed);
export const isAlertAccepted = createAlertHandler(AlertStatus.Accepted);
export const isAlertDismissed = createAlertHandler(AlertStatus.Dismissed);

const createStatusHandler = (status: AlertStatus) => (s: Maybe<AlertStatus>) =>
  s === status;
export const isStatusSnoozed = createStatusHandler(AlertStatus.Snoozed);
export const isStatusAccepted = createStatusHandler(AlertStatus.Accepted);
export const isStatusDismissed = createStatusHandler(AlertStatus.Dismissed);

const createAlertEventHandler = (
  onEvent: 'onSnoozed' | 'onAccepted' | 'onDismissed',
) => (alert: Maybe<Alert>): boolean => hasProperty(alert, onEvent);
export const isSnoozeEnabled = createAlertEventHandler('onSnoozed');
export const isAcceptEnabled = createAlertEventHandler('onAccepted');
export const isDismissEnabled = createAlertEventHandler('onDismissed');

const createFormEnabledHandler = (
  Form: 'SnoozeForm' | 'AcceptForm' | 'DismissForm',
) => (alert: Maybe<Alert>): boolean => {
  if (!alert) return false;
  if (alert[Form] === null) return false;
  switch (Form) {
    case 'SnoozeForm':
      return isSnoozeEnabled(alert);
    case 'AcceptForm':
      return isAcceptEnabled(alert);
    case 'DismissForm':
      return isDismissEnabled(alert);
    default:
      return false;
  }
};
export const isSnoozeFormEnabled = createFormEnabledHandler('SnoozeForm');
export const isAcceptFormEnabled = createFormEnabledHandler('AcceptForm');
export const isDismissFormEnabled = createFormEnabledHandler('DismissForm');

/**
 * Utility for determining if a form is disabled.
 * When a form is disabled, the dialog button's type should convert from submit to button.
 * @param alert
 * @param status
 */
export const isFormDisabled = (
  alert: Maybe<Alert>,
  status: Maybe<AlertStatus>,
): boolean => {
  switch (status) {
    case AlertStatus.Snoozed:
      return alert?.SnoozeForm === null;
    case AlertStatus.Accepted:
      return alert?.AcceptForm === null;
    case AlertStatus.Dismissed:
      return alert?.DismissForm === null;
    default:
      return false;
  }
};

export function formOf(
  alert: Maybe<Alert>,
  status: Maybe<AlertStatus>,
): Maybe<AlertForm> {
  switch (status) {
    case AlertStatus.Snoozed: {
      const SnoozeForm = alert?.SnoozeForm ?? AlertSnoozeForm;
      return isSnoozeFormEnabled(alert) ? SnoozeForm : null;
    }
    case AlertStatus.Accepted: {
      const AcceptForm = alert?.AcceptForm ?? AlertAcceptForm;
      return isAcceptFormEnabled(alert) ? AcceptForm : null;
    }
    case AlertStatus.Dismissed: {
      const DismissForm = alert?.DismissForm ?? AlertDismissForm;
      return isDismissFormEnabled(alert) ? DismissForm : null;
    }
    default:
      return null;
  }
}

/**
 * Utility for choosing from a fixed set of values for a given alert status.
 * @param status
 * @param values
 */
export function choose<T>(
  status: Maybe<AlertStatus>,
  values: [T, T, T],
  none: T,
): T {
  switch (status) {
    case AlertStatus.Snoozed:
      return values[0];
    case AlertStatus.Accepted:
      return values[1];
    case AlertStatus.Dismissed:
      return values[2];
    default:
      return none;
  }
}

export function hasProperty(alert: Maybe<Alert>, prop: keyof Alert): boolean {
  return prop in (alert ?? {});
}

export const sumOfAllAlerts = (sum: number, alerts: Alert[]) =>
  sum + alerts.length;
