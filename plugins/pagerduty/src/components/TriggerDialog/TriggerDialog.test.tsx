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
import { fireEvent, act } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { pagerDutyApiRef } from '../../api';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TriggerDialog } from './TriggerDialog';

import { ApiRegistry, ApiProvider } from '@backstage/core-app-api';
import {
  alertApiRef,
  createApiRef,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';

describe('TriggerDialog', () => {
  const mockIdentityApi: Partial<IdentityApi> = {
    getUserId: () => 'guest@example.com',
  };

  const mockTriggerAlarmFn = jest.fn();
  const mockPagerDutyApi = {
    triggerAlarm: mockTriggerAlarmFn,
  };

  const apis = ApiRegistry.from([
    [
      alertApiRef,
      createApiRef({
        id: 'core.alert',
        description: 'Used to report alerts and forward them to the app',
      }),
    ],
    [identityApiRef, mockIdentityApi],
    [pagerDutyApiRef, mockPagerDutyApi],
  ]);

  it('open the dialog and trigger an alarm', async () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'pagerduty-test',
        annotations: {
          'pagerduty.com/integration-key': 'abc123',
        },
      },
    };

    const { getByText, getByRole, getByTestId } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <TriggerDialog
            showDialog
            handleDialog={() => {}}
            onIncidentCreated={() => {}}
          />
        </EntityProvider>
      </ApiProvider>,
    );

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(
      getByText('This action will trigger an incident for ', {
        exact: false,
      }),
    ).toBeInTheDocument();
    const input = getByTestId('trigger-input');
    const description = 'Test Trigger Alarm';
    await act(async () => {
      fireEvent.change(input, { target: { value: description } });
    });
    const triggerButton = getByTestId('trigger-button');
    await act(async () => {
      fireEvent.click(triggerButton);
    });
    expect(mockTriggerAlarmFn).toHaveBeenCalled();
    expect(mockTriggerAlarmFn).toHaveBeenCalledWith({
      integrationKey: entity!.metadata!.annotations![
        'pagerduty.com/integration-key'
      ],
      source: window.location.toString(),
      description,
      userName: 'guest@example.com',
    });
  });
});
