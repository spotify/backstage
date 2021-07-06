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
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { pagerDutyApiRef } from '../../api';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TriggerButton } from './';

import { ApiRegistry, ApiProvider } from '@backstage/core-app-api';
import {
  alertApiRef,
  createApiRef,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';

describe('TriggerButton', () => {
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

  it('renders the trigger button, opens and closes dialog', async () => {
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

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <TriggerButton />
        </EntityProvider>
      </ApiProvider>,
    );

    const triggerButton = screen.getByText('Create Incident');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(triggerButton);
    });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Close');
    await act(async () => {
      fireEvent.click(closeButton);
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('renders the trigger button with children', async () => {
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

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <TriggerButton>Send an alert</TriggerButton>
        </EntityProvider>
      </ApiProvider>,
    );

    expect(screen.getByText('Send an alert')).toBeInTheDocument();
  });

  it('renders a disabled trigger button if entity does not include key', async () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'pagerduty-test',
      },
    };

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <TriggerButton />
        </EntityProvider>
      </ApiProvider>,
    );

    const triggerButton = screen.getByText('Missing integration key');

    await act(async () => {
      fireEvent.click(triggerButton);
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
