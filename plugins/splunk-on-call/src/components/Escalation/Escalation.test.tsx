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
import { splunkOnCallApiRef } from '../../api';
import { MOCKED_ON_CALL, MOCKED_USER } from '../../api/mocks';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

const mockSplunkOnCallApi = {
  getOnCallUsers: () => [],
};
const apis = ApiRegistry.from([[splunkOnCallApiRef, mockSplunkOnCallApi]]);

describe('Escalation', () => {
  it('Handles an empty response', async () => {
    mockSplunkOnCallApi.getOnCallUsers = jest
      .fn()
      .mockImplementationOnce(async () => []);

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <EscalationPolicy
            users={{
              [MOCKED_USER.username!]: MOCKED_USER,
            }}
            team="team_example"
          />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));

    expect(getByText('Empty escalation policy')).toBeInTheDocument();
    expect(mockSplunkOnCallApi.getOnCallUsers).toHaveBeenCalled();
  });

  it('Render a list of users', async () => {
    mockSplunkOnCallApi.getOnCallUsers = jest
      .fn()
      .mockImplementationOnce(async () => MOCKED_ON_CALL);

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <EscalationPolicy
            users={{
              [MOCKED_USER.username!]: MOCKED_USER,
            }}
            team="team_example"
          />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));

    expect(getByText('FirstNameTest LastNameTest')).toBeInTheDocument();
    expect(getByText('test@example.com')).toBeInTheDocument();
    expect(mockSplunkOnCallApi.getOnCallUsers).toHaveBeenCalled();
  });

  it('Handles errors', async () => {
    mockSplunkOnCallApi.getOnCallUsers = jest
      .fn()
      .mockRejectedValueOnce(new Error('Error message'));

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <EscalationPolicy
            users={{
              [MOCKED_USER.username!]: MOCKED_USER,
            }}
            team="team_example"
          />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));

    expect(
      getByText('Error encountered while fetching information. Error message'),
    ).toBeInTheDocument();
  });
});
