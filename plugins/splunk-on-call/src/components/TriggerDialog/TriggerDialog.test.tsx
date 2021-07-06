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
import { render, fireEvent, act } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import { splunkOnCallApiRef } from '../../api';
import { TriggerDialog } from './TriggerDialog';

import { ApiRegistry, ApiProvider } from '@backstage/core-app-api';
import { alertApiRef, createApiRef } from '@backstage/core-plugin-api';

describe('TriggerDialog', () => {
  const mockTriggerAlarmFn = jest.fn();
  const mockSplunkOnCallApi = {
    incidentAction: mockTriggerAlarmFn,
  };

  const apis = ApiRegistry.from([
    [
      alertApiRef,
      createApiRef({
        id: 'core.alert',
        description: 'Used to report alerts and forward them to the app',
      }),
    ],
    [splunkOnCallApiRef, mockSplunkOnCallApi],
  ]);

  it('open the dialog and trigger an alarm', async () => {
    const { getByText, getByRole, getByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <TriggerDialog
            team="Example"
            showDialog
            handleDialog={() => {}}
            onIncidentCreated={() => {}}
          />
        </ApiProvider>,
      ),
    );

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(
      getByText('This action will trigger an incident', {
        exact: false,
      }),
    ).toBeInTheDocument();
    const incidentType = getByTestId('trigger-incident-type');
    const incidentId = getByTestId('trigger-incident-id');
    const incidentDisplayName = getByTestId('trigger-incident-displayName');
    const incidentMessage = getByTestId('trigger-incident-message');

    await act(async () => {
      fireEvent.change(incidentType, { target: { value: 'CRITICAL' } });
      fireEvent.change(incidentId, { target: { value: 'incident-id' } });
      fireEvent.change(incidentDisplayName, {
        target: { value: 'incident-display-name' },
      });
      fireEvent.change(incidentMessage, {
        target: { value: 'incident-message' },
      });
    });

    // Trigger incident creation button
    const triggerButton = getByTestId('trigger-button');
    await act(async () => {
      fireEvent.click(triggerButton);
    });
    expect(mockTriggerAlarmFn).toHaveBeenCalled();
    expect(mockTriggerAlarmFn).toHaveBeenCalledWith({
      incidentType: 'CRITICAL',
      incidentId: 'incident-id',
      routingKey: 'Example',
      incidentDisplayName: 'incident-display-name',
      incidentMessage: 'incident-message',
    });
  });
});
