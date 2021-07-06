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
import { renderInTestApp } from '@backstage/test-utils';
import { BarChartTooltip } from './BarChartTooltip';
import { BarChartTooltipItem } from './BarChartTooltipItem';
import { CostInsightsThemeProvider } from '../CostInsightsPage/CostInsightsThemeProvider';

const items = [
  {
    label: 'Cost',
    value: '$1,000,000',
    fill: '#FFF',
  },
  {
    label: 'Test Metric',
    value: '100,000,000',
    fill: '#FFF',
  },
];

const tooltipItems = () =>
  items.map(item => <BarChartTooltipItem key={item.label} item={item} />);

describe('<BarChartTooltip/>', () => {
  it('formats label and tooltip item text correctly', async () => {
    const rendered = await renderInTestApp(
      <CostInsightsThemeProvider>
        <BarChartTooltip title="05/16/2020">{tooltipItems}</BarChartTooltip>
      </CostInsightsThemeProvider>,
    );
    expect(rendered.getByText('05/16/2020')).toBeInTheDocument();
    expect(rendered.getByText('Cost')).toBeInTheDocument();
    expect(rendered.getByText('Test Metric')).toBeInTheDocument();
    expect(rendered.getByText('$1,000,000')).toBeInTheDocument();
    expect(rendered.getByText('100,000,000')).toBeInTheDocument();
  });
});
