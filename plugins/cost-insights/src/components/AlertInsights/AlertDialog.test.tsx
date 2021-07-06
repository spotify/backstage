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
import { capitalize } from '@material-ui/core';
import { AlertDialog } from './AlertDialog';
import { render } from '@testing-library/react';
import { Alert, AlertFormProps, AlertStatus } from '../../types';

type MockFormDataProps = AlertFormProps<Alert>;

function createForm(title: string) {
  return React.forwardRef<HTMLFormElement, MockFormDataProps>((props, ref) => (
    <form ref={ref} onSubmit={props.onSubmit}>
      You. {title}. Me.
    </form>
  ));
}

const snoozableAlert: Alert = {
  title: 'title',
  subtitle: 'test-subtitle',
  onSnoozed: jest.fn(),
};

const dimissableAlert: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onDismissed: jest.fn(),
};

const acceptableAlert: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onAccepted: jest.fn(),
};

const customSnoozeAlert: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onSnoozed: jest.fn(),
  SnoozeForm: createForm('Snooze'),
};

const customDismissAlert: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onDismissed: jest.fn(),
  DismissForm: createForm('Dismiss'),
};

const customAcceptAlert: Alert = {
  title: 'title',
  subtitle: 'test-subtitle',
  onAccepted: jest.fn(),
  AcceptForm: createForm('Accept'),
};

const nullAcceptAlert: Alert = {
  title: 'title',
  subtitle: 'test-subtitle',
  onAccepted: jest.fn(),
  AcceptForm: null,
};

const nullDismissAlert: Alert = {
  title: 'title',
  subtitle: 'test-subtitle',
  onDismissed: jest.fn(),
  DismissForm: null,
};

const nullSnoozeAlert: Alert = {
  title: 'title',
  subtitle: 'test-subtitle',
  onSnoozed: jest.fn(),
  SnoozeForm: null,
};

describe('<AlertDialog />', () => {
  describe.each`
    alert              | status                   | action                      | text
    ${acceptableAlert} | ${AlertStatus.Accepted}  | ${['accept', 'accepted']}   | ${'My team can commit to making this change soon, or has already.'}
    ${dimissableAlert} | ${AlertStatus.Dismissed} | ${['dismiss', 'dismissed']} | ${'Reason for dismissing?'}
    ${snoozableAlert}  | ${AlertStatus.Snoozed}   | ${['snooze', 'snoozed']}    | ${'For how long?'}
  `('Default forms', ({ alert, status, action: [action, actioned], text }) => {
    it(`Displays a default ${action} form`, () => {
      const { getByText } = render(
        <AlertDialog
          open
          group="Ramones"
          alert={alert}
          status={status}
          onClose={jest.fn()}
          onSubmit={jest.fn()}
        />,
      );
      expect(getByText(text)).toBeInTheDocument();
      expect(
        getByText(`${capitalize(action)} this action item?`),
      ).toBeInTheDocument();
      expect(
        getByText(`This action item will be ${actioned} for all of Ramones.`),
      ).toBeInTheDocument();
    });
  });

  describe.each`
    alert                 | status                   | action                      | text
    ${customAcceptAlert}  | ${AlertStatus.Accepted}  | ${['accept', 'accepted']}   | ${'My team can commit to making this change soon, or has already.'}
    ${customDismissAlert} | ${AlertStatus.Dismissed} | ${['dismiss', 'dismissed']} | ${'Reason for dismissing?'}
    ${customSnoozeAlert}  | ${AlertStatus.Snoozed}   | ${['snooze', 'snoozed']}    | ${'For how long?'}
  `('Custom forms', ({ alert, status, action: [action, actioned] }) => {
    it(`Displays a custom ${capitalize(action)} form`, () => {
      const { getByText } = render(
        <AlertDialog
          open
          group="Ramones"
          alert={alert}
          status={status}
          onClose={jest.fn()}
          onSubmit={jest.fn()}
        />,
      );
      expect(getByText(`You. ${capitalize(action)}. Me.`)).toBeInTheDocument();
      expect(
        getByText(`${capitalize(action)} this action item?`),
      ).toBeInTheDocument();
      expect(
        getByText(`This action item will be ${actioned} for all of Ramones.`),
      ).toBeInTheDocument();
    });
  });

  describe.each`
    alert               | status                   | action                      | text
    ${nullAcceptAlert}  | ${AlertStatus.Accepted}  | ${['accept', 'accepted']}   | ${'My team can commit to making this change soon, or has already.'}
    ${nullDismissAlert} | ${AlertStatus.Dismissed} | ${['dismiss', 'dismissed']} | ${'Reason for dismissing?'}
    ${nullSnoozeAlert}  | ${AlertStatus.Snoozed}   | ${['snooze', 'snoozed']}    | ${'For how long?'}
  `('Null forms', ({ alert, status, action: [action, actioned], text }) => {
    it(`Does NOT display a ${capitalize(action)} form`, () => {
      const { getByText, getByRole, queryByText } = render(
        <AlertDialog
          open
          group="Ramones"
          alert={alert}
          status={status}
          onClose={jest.fn()}
          onSubmit={jest.fn()}
        />,
      );
      expect(queryByText(text)).not.toBeInTheDocument();
      expect(getByRole('button', { name: action })).toBeInTheDocument();
      expect(
        getByText(`${capitalize(action)} this action item?`),
      ).toBeInTheDocument();
      expect(
        getByText(`This action item will be ${actioned} for all of Ramones.`),
      ).toBeInTheDocument();
    });
  });
});
