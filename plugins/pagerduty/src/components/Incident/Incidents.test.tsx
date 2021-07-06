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
import { pagerDutyApiRef } from '../../api';
import { Incident } from '../types';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

const mockPagerDutyApi = {
  getIncidentsByServiceId: () => [],
};
const apis = ApiRegistry.from([[pagerDutyApiRef, mockPagerDutyApi]]);

describe('Incidents', () => {
  it('Renders an empty state when there are no incidents', async () => {
    mockPagerDutyApi.getIncidentsByServiceId = jest
      .fn()
      .mockImplementationOnce(async () => []);

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <Incidents serviceId="abc" refreshIncidents={false} />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    expect(getByText('Nice! No incidents found!')).toBeInTheDocument();
  });

  it('Renders all incidents', async () => {
    mockPagerDutyApi.getIncidentsByServiceId = jest.fn().mockImplementationOnce(
      async () =>
        [
          {
            id: 'id1',
            status: 'triggered',
            title: 'title1',
            created_at: '2020-11-06T00:00:00Z',
            assignments: [
              {
                assignee: {
                  id: 'p1',
                  summary: 'person1',
                  html_url: 'http://a.com/id1',
                },
              },
            ],
            html_url: 'http://a.com/id1',
            serviceId: 'sId1',
          },
          {
            id: 'id2',
            status: 'acknowledged',
            title: 'title2',
            created_at: '2020-11-07T00:00:00Z',
            assignments: [
              {
                assignee: {
                  id: 'p2',
                  summary: 'person2',

                  html_url: 'http://a.com/id2',
                },
              },
            ],
            html_url: 'http://a.com/id2',
            serviceId: 'sId2',
          },
        ] as Incident[],
    );
    const { getByText, getAllByTitle, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <Incidents serviceId="abc" refreshIncidents={false} />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    expect(getByText('title1')).toBeInTheDocument();
    expect(getByText('title2')).toBeInTheDocument();
    expect(getByText('person1')).toBeInTheDocument();
    expect(getByText('person2')).toBeInTheDocument();
    expect(getByText('triggered')).toBeInTheDocument();
    expect(getByText('acknowledged')).toBeInTheDocument();
    expect(queryByTestId('chip-triggered')).toBeInTheDocument();
    expect(queryByTestId('chip-acknowledged')).toBeInTheDocument();

    // assert links, mailto and hrefs, date calculation
    expect(getAllByTitle('View in PagerDuty').length).toEqual(2);
  });

  it('Handle errors', async () => {
    mockPagerDutyApi.getIncidentsByServiceId = jest
      .fn()
      .mockRejectedValueOnce(new Error('Error occurred'));

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <Incidents serviceId="abc" refreshIncidents={false} />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    expect(
      getByText('Error encountered while fetching information. Error occurred'),
    ).toBeInTheDocument();
  });
});
