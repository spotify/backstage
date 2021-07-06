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
import { waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { MetricSelect, MetricSelectProps } from './MetricSelect';
import { renderInTestApp } from '@backstage/test-utils';

describe('<MetricSelect />', () => {
  it('should display a metric', async () => {
    const mockProps: MetricSelectProps = {
      metric: 'test',
      metrics: [{ kind: 'test', name: 'some-name', default: false }],
      onSelect: jest.fn(),
    };
    const { getByText } = await renderInTestApp(
      <MetricSelect {...mockProps} />,
    );
    expect(getByText(/some-name/)).toBeInTheDocument();
  });

  it('should display all metrics', async () => {
    const mockProps: MetricSelectProps = {
      metric: null,
      metrics: [
        { kind: 'DAU', name: 'Daily Active Users', default: true },
        { kind: 'MSC', name: 'Monthly Subscribers', default: false },
      ],
      onSelect: jest.fn(),
    };
    const { getAllByText, getByText, getByRole } = await renderInTestApp(
      <MetricSelect {...mockProps} />,
    );
    const button = getByRole('button');

    UserEvent.click(button);

    await waitFor(() => getAllByText(/None/));

    // The active metric should display in the popver list and in the input
    expect(getByText(/Daily Active Users/)).toBeInTheDocument();
    expect(getByText(/Monthly Subscribers/)).toBeInTheDocument();
  });
});
