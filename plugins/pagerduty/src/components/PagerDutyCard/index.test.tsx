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
import { render, waitFor, fireEvent, act } from '@testing-library/react';
import { PagerDutyCard } from '../PagerDutyCard';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { wrapInTestApp } from '@backstage/test-utils';
import { pagerDutyApiRef, UnauthorizedError, PagerDutyClient } from '../../api';
import { Service } from '../types';

import { alertApiRef, createApiRef } from '@backstage/core-plugin-api';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

const mockPagerDutyApi: Partial<PagerDutyClient> = {
  getServiceByIntegrationKey: async () => [],
  getOnCallByPolicyId: async () => [],
  getIncidentsByServiceId: async () => [],
};

const apis = ApiRegistry.from([
  [pagerDutyApiRef, mockPagerDutyApi],
  [
    alertApiRef,
    createApiRef({
      id: 'core.alert',
      description: 'Used to report alerts and forward them to the app',
    }),
  ],
]);
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

const service: Service = {
  id: 'abc',
  name: 'pagerduty-name',
  html_url: 'www.example.com',
  escalation_policy: {
    id: 'def',
    user: {
      name: 'person1',
      id: 'p1',
      summary: 'person1',
      email: 'person1@example.com',
      html_url: 'http://a.com/id1',
    },
  },
  integrationKey: 'abcd',
};

describe('PageDutyCard', () => {
  it('Render pagerduty', async () => {
    mockPagerDutyApi.getServiceByIntegrationKey = jest
      .fn()
      .mockImplementationOnce(async () => [service]);

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <EntityProvider entity={entity}>
            <PagerDutyCard />
          </EntityProvider>
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    expect(getByText('Service Directory')).toBeInTheDocument();
    expect(getByText('Create Incident')).toBeInTheDocument();
    expect(getByText('Nice! No incidents found!')).toBeInTheDocument();
    expect(getByText('Empty escalation policy')).toBeInTheDocument();
  });

  it('Handles custom error for missing token', async () => {
    mockPagerDutyApi.getServiceByIntegrationKey = jest
      .fn()
      .mockRejectedValueOnce(new UnauthorizedError());

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <EntityProvider entity={entity}>
            <PagerDutyCard />
          </EntityProvider>
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    expect(getByText('Missing or invalid PagerDuty Token')).toBeInTheDocument();
  });

  it('handles general error', async () => {
    mockPagerDutyApi.getServiceByIntegrationKey = jest
      .fn()
      .mockRejectedValueOnce(new Error('An error occurred'));
    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <EntityProvider entity={entity}>
            <PagerDutyCard />
          </EntityProvider>
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));

    expect(
      getByText(
        'Error encountered while fetching information. An error occurred',
      ),
    ).toBeInTheDocument();
  });
  it('opens the dialog when trigger button is clicked', async () => {
    mockPagerDutyApi.getServiceByIntegrationKey = jest
      .fn()
      .mockImplementationOnce(async () => [service]);

    const { getByText, queryByTestId, getByRole } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <EntityProvider entity={entity}>
            <PagerDutyCard />
          </EntityProvider>
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    expect(getByText('Service Directory')).toBeInTheDocument();

    const triggerLink = getByText('Create Incident');
    await act(async () => {
      fireEvent.click(triggerLink);
    });
    expect(getByRole('dialog')).toBeInTheDocument();
  });
});
