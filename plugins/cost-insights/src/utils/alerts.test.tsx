/*
 * Copyright 2021 The Backstage Authors
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
import React, { ReactNode } from 'react';
import { formOf } from './alerts';
import { AlertAcceptForm, AlertDismissForm, AlertSnoozeForm } from '../forms';
import { Alert, AlertStatus, AlertFormProps } from '../types';

type Props = AlertFormProps<Alert, any>;

const createMockForm = (children: ReactNode) =>
  React.forwardRef<HTMLFormElement, Props>((props, ref) => (
    <form ref={ref} onSubmit={props.onSubmit}>
      {children}
    </form>
  ));

const snoozeDefault: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onSnoozed: jest.fn(),
};

const snoozeCustom: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onSnoozed: jest.fn(),
  SnoozeForm: createMockForm('Snooze'),
};

const snoozeNull: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onSnoozed: jest.fn(),
  SnoozeForm: null,
};

const acceptDefault: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onAccepted: jest.fn(),
};

const acceptCustom: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onAccepted: jest.fn(),
  AcceptForm: createMockForm('Accept'),
};

const acceptNull: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onAccepted: jest.fn(),
  AcceptForm: null,
};

const dismissDefault: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onDismissed: jest.fn(),
};

const dismissCustom: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onDismissed: jest.fn(),
  DismissForm: createMockForm('Dismiss'),
};

const dismissNull: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onDismissed: jest.fn(),
  DismissForm: null,
};

describe('formOf', () => {
  describe.each`
    msg                       | alert             | status                   | expected
    ${'default snooze form'}  | ${snoozeDefault}  | ${AlertStatus.Snoozed}   | ${AlertSnoozeForm}
    ${'custom snooze form'}   | ${snoozeCustom}   | ${AlertStatus.Snoozed}   | ${snoozeCustom.SnoozeForm}
    ${'null snooze form'}     | ${snoozeNull}     | ${AlertStatus.Snoozed}   | ${null}
    ${'default accept form'}  | ${acceptDefault}  | ${AlertStatus.Accepted}  | ${AlertAcceptForm}
    ${'custom accept form'}   | ${acceptCustom}   | ${AlertStatus.Accepted}  | ${acceptCustom.AcceptForm}
    ${'null accept form'}     | ${acceptNull}     | ${AlertStatus.Accepted}  | ${null}
    ${'default dismiss form'} | ${dismissDefault} | ${AlertStatus.Dismissed} | ${AlertDismissForm}
    ${'custom dismiss form'}  | ${dismissCustom}  | ${AlertStatus.Dismissed} | ${dismissCustom.DismissForm}
    ${'null dismiss form'}    | ${dismissNull}    | ${AlertStatus.Dismissed} | ${null}
    ${'no form or status'}    | ${null}           | ${null}                  | ${null}
  `('Should render the correct form', ({ msg, alert, status, expected }) => {
    it(`for ${msg}`, () => {
      const result = formOf(alert, status);
      expect(result).toBe(expected);
    });
  });
});
