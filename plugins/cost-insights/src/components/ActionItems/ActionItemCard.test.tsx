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
import { ActionItemCard } from './ActionItemCard';
import { MockScrollProvider } from '../../testUtils';
import { ProjectGrowthAlert } from '../../alerts';
import { ProjectGrowthData } from '../../types';

const data: ProjectGrowthData = {
  aggregation: [500000.8, 970502.8],
  project: 'test-project',
  periodStart: '2019-10-01',
  periodEnd: '2020-03-31',
  change: { ratio: 120, amount: 120000 },
  products: [],
};
const alert = new ProjectGrowthAlert(data);

describe('<ActionItemCard/>', () => {
  it('Renders an alert', async () => {
    const rendered = await renderInTestApp(
      <MockScrollProvider>
        <ActionItemCard alert={alert} avatar={<div>1</div>} />
      </MockScrollProvider>,
    );

    expect(rendered.getByText('1')).toBeInTheDocument();
    expect(rendered.getByText(alert.title)).toBeInTheDocument();
    expect(rendered.getByText(alert.subtitle)).toBeInTheDocument();
  });

  it('renders custom title elements', async () => {
    const rendered = await renderInTestApp(
      <MockScrollProvider>
        <ActionItemCard
          alert={{
            ...alert,
            title: <span>Foo</span>,
            subtitle: <span>Bar</span>,
          }}
          avatar={<div>1</div>}
        />
      </MockScrollProvider>,
    );

    expect(rendered.getByText('Foo')).toBeInTheDocument();
    expect(rendered.getByText('Bar')).toBeInTheDocument();
  });
});
