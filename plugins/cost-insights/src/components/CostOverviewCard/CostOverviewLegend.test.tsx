/*
 * Copyright 2021 Spotify AB
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
import { render } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import { CostOverviewLegend } from './CostOverviewLegend';
import {
  MockBillingDateProvider,
  MockConfigProvider,
  MockFilterProvider,
  MockCurrencyProvider,
} from '../../testUtils';

function renderInTestApp(children: JSX.Element) {
  return render(
    wrapInTestApp(
      <MockConfigProvider>
        <MockCurrencyProvider>
          <MockBillingDateProvider>
            <MockFilterProvider>{children}</MockFilterProvider>
          </MockBillingDateProvider>
        </MockCurrencyProvider>
      </MockConfigProvider>,
    ),
  );
}

describe('<CostOverviewLegend />', () => {
  it('displays the legend without exploding', async () => {
    const { findByText } = renderInTestApp(
      <CostOverviewLegend
        metric={{
          kind: 'msc',
          name: 'MSC',
          default: false,
        }}
        metricData={{
          id: 'msc',
          format: 'number',
          aggregation: [],
          change: {
            ratio: 0,
            amount: 0,
          },
        }}
        dailyCostData={{
          id: 'mock-id',
          aggregation: [],
          change: {
            amount: 0,
          },
        }}
      />,
    );

    expect(await findByText('Cost Trend')).toBeInTheDocument();
    expect(await findByText('MSC Trend')).toBeInTheDocument();
  });

  it('does not display metric legend if metric data is not provided', async () => {
    const { findByText, queryByText } = renderInTestApp(
      <CostOverviewLegend
        metric={{
          kind: 'msc',
          name: 'MSC',
          default: false,
        }}
        metricData={null}
        dailyCostData={{
          id: 'mock-id',
          aggregation: [],
          change: {
            amount: 0,
          },
        }}
      />,
    );

    expect(await findByText('Cost Trend')).toBeInTheDocument();
    expect(queryByText('MSC Trend')).not.toBeInTheDocument();
  });
});

describe.each`
  ratio        | amount    | title   | expected
  ${undefined} | ${1_000}  | ${'∞'}  | ${'Your Excess'}
  ${undefined} | ${-1_000} | ${'-∞'} | ${'Your Savings'}
`('<CostOverviewLegend />', ({ ratio, amount, title, expected }) => {
  it('displays the correct legend if ratio cannot be calculated and costs are within time period', async () => {
    const { findByText, findAllByText } = renderInTestApp(
      <CostOverviewLegend
        metric={{
          kind: 'msc',
          name: 'MSC',
          default: false,
        }}
        metricData={{
          id: 'msc',
          format: 'number',
          change: {
            ratio: ratio,
            amount: amount,
          },
          aggregation: [
            {
              date: '2020-01-01',
              amount: 0,
            },
            {
              date: '2020-07-01', // within default P90D period
              amount: amount,
            },
          ],
        }}
        dailyCostData={{
          id: 'mock-id',
          change: {
            ratio,
            amount,
          },
          aggregation: [
            {
              date: '2020-01-01',
              amount: 0,
            },
            {
              date: '2020-07-01', // within default P90D period
              amount: amount,
            },
          ],
        }}
      />,
    );

    expect(await findByText('Cost Trend')).toBeInTheDocument();
    expect(await findByText('MSC Trend')).toBeInTheDocument();
    expect(await findAllByText(title).then(res => res.length)).toBe(2);
    expect(await findByText(expected)).toBeInTheDocument();
  });
});
