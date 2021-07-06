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
import { Incidents } from './Incidents';
import { wrapInTestApp } from '@backstage/test-utils';
import { splunkOnCallApiRef } from '../../api';
import { MOCK_TEAM, MOCK_INCIDENT } from '../../api/mocks';

import {
  alertApiRef,
  createApiRef,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

const mockIdentityApi: Partial<IdentityApi> = {
  getUserId: () => 'test',
};

const mockSplunkOnCallApi = {
  getIncidents: () => [],
  getTeams: () => [],
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
  [splunkOnCallApiRef, mockSplunkOnCallApi],
]);

describe('Incidents', () => {
  it('Renders an empty state when there are no incidents', async () => {
    mockSplunkOnCallApi.getTeams = jest
      .fn()
      .mockImplementationOnce(async () => [MOCK_TEAM]);

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <Incidents refreshIncidents={false} team="test" />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    await waitFor(
      () => expect(getByText('Nice! No incidents found!')).toBeInTheDocument(),
      { timeout: 2000 },
    );
  });

  it('Renders all incidents', async () => {
    mockSplunkOnCallApi.getIncidents = jest
      .fn()
      .mockImplementationOnce(async () => [MOCK_INCIDENT]);

    mockSplunkOnCallApi.getTeams = jest
      .fn()
      .mockImplementationOnce(async () => [MOCK_TEAM]);
    const {
      getByText,
      getByTitle,
      getAllByTitle,
      getByLabelText,
      queryByTestId,
    } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <Incidents team="test" refreshIncidents={false} />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    await waitFor(
      () =>
        expect(
          getByText('user', {
            exact: false,
          }),
        ).toBeInTheDocument(),
      { timeout: 2000 },
    );
    expect(getByText('test-incident')).toBeInTheDocument();
    expect(getByTitle('Acknowledged')).toBeInTheDocument();
    expect(getByLabelText('Status warning')).toBeInTheDocument();

    // assert links, mailto and hrefs, date calculation
    expect(getAllByTitle('View in Splunk On-Call').length).toEqual(1);
  });

  it('Handle errors', async () => {
    mockSplunkOnCallApi.getIncidents = jest
      .fn()
      .mockRejectedValueOnce(new Error('Error occurred'));

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <Incidents team="test" refreshIncidents={false} />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    await waitFor(
      () =>
        expect(
          getByText(
            'Error encountered while fetching information. Error occurred',
          ),
        ).toBeInTheDocument(),
      { timeout: 2000 },
    );
  });
});
