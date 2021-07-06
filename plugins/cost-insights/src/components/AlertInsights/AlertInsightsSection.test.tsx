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
import { AlertInsightsSection } from './AlertInsightsSection';
import { render } from '@testing-library/react';
import { Alert } from '../../types';
import { MockScrollProvider } from '../../testUtils';

const mockAlert: Alert = {
  subtitle:
    'Wherefore was I to this keen mockery born? When at your hands did I deserve this scorn?',
  title: 'Mock alert',
  url: '/cost-insights/test',
};

function renderInContext(children: JSX.Element) {
  return render(<MockScrollProvider>{children}</MockScrollProvider>);
}

describe('<AlertInsightsSection/>', () => {
  it('Renders alert without exploding', () => {
    const { getByText, queryByText } = renderInContext(
      <AlertInsightsSection
        alert={mockAlert}
        number={1}
        onSnooze={jest.fn()}
        onDismiss={jest.fn()}
        onAccept={jest.fn()}
      />,
    );
    expect(getByText(mockAlert.title as string)).toBeInTheDocument();
    expect(getByText(mockAlert.subtitle as string)).toBeInTheDocument();
    expect(getByText('View Instructions')).toBeInTheDocument();
    expect(queryByText('Snooze')).not.toBeInTheDocument();
    expect(queryByText('Accept')).not.toBeInTheDocument();
    expect(queryByText('Dismiss')).not.toBeInTheDocument();
  });

  it('renders custom title elements', () => {
    const { getByText } = renderInContext(
      <AlertInsightsSection
        alert={{
          ...mockAlert,
          title: <span>Foo</span>,
          subtitle: <span>Bar</span>,
        }}
        number={1}
        onSnooze={jest.fn()}
        onDismiss={jest.fn()}
        onAccept={jest.fn()}
      />,
    );

    expect(getByText('Foo')).toBeInTheDocument();
    expect(getByText('Bar')).toBeInTheDocument();
  });

  it('Hides instructions button if url is not provided', () => {
    const alert: Alert = {
      ...mockAlert,
      url: undefined,
    };
    const { queryByText } = renderInContext(
      <AlertInsightsSection
        alert={alert}
        number={1}
        onSnooze={jest.fn()}
        onDismiss={jest.fn()}
        onAccept={jest.fn()}
      />,
    );
    expect(queryByText('View Instructions')).not.toBeInTheDocument();
  });

  it('Displays a snooze button if a hook is provided', () => {
    const alert: Alert = {
      ...mockAlert,
      onSnoozed: jest.fn(),
    };

    const { queryByText, getByText } = renderInContext(
      <AlertInsightsSection
        alert={alert}
        number={1}
        onSnooze={jest.fn()}
        onDismiss={jest.fn()}
        onAccept={jest.fn()}
      />,
    );

    expect(getByText('Snooze')).toBeInTheDocument();
    expect(queryByText('Accept')).not.toBeInTheDocument();
    expect(queryByText('Dismiss')).not.toBeInTheDocument();
  });

  it('Displays a dismiss button if a hook is provided', () => {
    const alert: Alert = {
      ...mockAlert,
      onDismissed: jest.fn(),
    };

    const { queryByText, getByText } = renderInContext(
      <AlertInsightsSection
        alert={alert}
        number={1}
        onSnooze={jest.fn()}
        onDismiss={jest.fn()}
        onAccept={jest.fn()}
      />,
    );

    expect(getByText('Dismiss')).toBeInTheDocument();
    expect(queryByText('Accept')).not.toBeInTheDocument();
    expect(queryByText('Snooze')).not.toBeInTheDocument();
  });

  it('Displays an accept button if a hook is provided', () => {
    const alert: Alert = {
      ...mockAlert,
      onAccepted: jest.fn(),
    };

    const { queryByText, getByText } = renderInContext(
      <AlertInsightsSection
        alert={alert}
        number={1}
        onSnooze={jest.fn()}
        onDismiss={jest.fn()}
        onAccept={jest.fn()}
      />,
    );

    expect(getByText('Accept')).toBeInTheDocument();
    expect(queryByText('Snooze')).not.toBeInTheDocument();
    expect(queryByText('Dismiss')).not.toBeInTheDocument();
  });
});
