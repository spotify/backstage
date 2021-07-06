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
import { render, waitFor } from '@testing-library/react';
import { EscalationPolicy } from './EscalationPolicy';
import { wrapInTestApp } from '@backstage/test-utils';
import { User } from '../types';
import { pagerDutyApiRef } from '../../api';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

const mockPagerDutyApi = {
  getOnCallByPolicyId: () => [],
};
const apis = ApiRegistry.from([[pagerDutyApiRef, mockPagerDutyApi]]);

describe('Escalation', () => {
  it('Handles an empty response', async () => {
    mockPagerDutyApi.getOnCallByPolicyId = jest
      .fn()
      .mockImplementationOnce(async () => []);

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <EscalationPolicy policyId="456" />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));

    expect(getByText('Empty escalation policy')).toBeInTheDocument();
    expect(mockPagerDutyApi.getOnCallByPolicyId).toHaveBeenCalledWith('456');
  });

  it('Render a list of users', async () => {
    mockPagerDutyApi.getOnCallByPolicyId = jest
      .fn()
      .mockImplementationOnce(async () => [
        {
          user: {
            name: 'person1',
            id: 'p1',
            summary: 'person1',
            email: 'person1@example.com',
            html_url: 'http://a.com/id1',
          } as User,
        },
      ]);

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <EscalationPolicy policyId="abc" />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));

    expect(getByText('person1')).toBeInTheDocument();
    expect(getByText('person1@example.com')).toBeInTheDocument();
    expect(mockPagerDutyApi.getOnCallByPolicyId).toHaveBeenCalledWith('abc');
  });

  it('Handles errors', async () => {
    mockPagerDutyApi.getOnCallByPolicyId = jest
      .fn()
      .mockRejectedValueOnce(new Error('Error message'));

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <EscalationPolicy policyId="abc" />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));

    expect(
      getByText('Error encountered while fetching information. Error message'),
    ).toBeInTheDocument();
  });
});
