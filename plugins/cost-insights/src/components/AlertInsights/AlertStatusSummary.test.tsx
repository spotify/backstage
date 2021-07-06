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
import { AlertStatusSummary } from './AlertStatusSummary';
import { render } from '@testing-library/react';
import { Alert, AlertStatus } from '../../types';
import { MockScrollProvider } from '../../testUtils';

const mockSnoozed: Alert = {
  title: 'snoozed-title',
  subtitle: 'snoozed-subtitle',
  status: AlertStatus.Snoozed,
};

const mockAccepted: Alert = {
  title: 'accepted-title',
  subtitle: 'accepted-subtitle',
  status: AlertStatus.Accepted,
};

const mockDismissed: Alert = {
  title: 'dismissed-title',
  subtitle: 'dismissed-subtitle',
  status: AlertStatus.Dismissed,
};

describe('<AlertStatusSummary />', () => {
  it('should display alerts', () => {
    const { getByText, getByRole } = render(
      <MockScrollProvider>
        <AlertStatusSummary
          open
          snoozed={[mockSnoozed]}
          accepted={[mockAccepted]}
          dismissed={[mockDismissed]}
        />
      </MockScrollProvider>,
    );
    [mockSnoozed, mockAccepted, mockDismissed].forEach(a => {
      expect(getByText(a.title as string)).toBeInTheDocument();
      expect(getByText(a.subtitle as string)).toBeInTheDocument();
      expect(getByRole('img', { name: a.status })).toBeInTheDocument();
    });
  });
});
