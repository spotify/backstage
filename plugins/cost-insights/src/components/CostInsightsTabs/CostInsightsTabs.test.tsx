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
import { CostInsightsTabs } from './CostInsightsTabs';
import UserEvent from '@testing-library/user-event';
import { Group } from '../../types';
import { MockFilterProvider, MockLoadingProvider } from '../../testUtils';
import { renderInTestApp } from '@backstage/test-utils';

const mockSetPageFilters = jest.fn();

const mockGroups: Group[] = [
  {
    id: 'test-group-1',
  },
  {
    id: 'test-group-2',
  },
  {
    id: 'test-group-3',
  },
];

describe('<CostInsightsTabs />', () => {
  const renderWrapped = (children: React.ReactNode) =>
    renderInTestApp(
      <MockFilterProvider setPageFilters={mockSetPageFilters}>
        <MockLoadingProvider>{children}</MockLoadingProvider>
      </MockFilterProvider>,
    );

  it('Does NOT display the tabs bar if owner belongs to less than two GROUPS', async () => {
    const oneGroup: Group[] = [{ id: 'test-group-1' }];
    const rendered = await renderWrapped(
      <CostInsightsTabs groups={oneGroup} />,
    );
    expect(
      rendered.container.querySelector('.cost-insights-tabs'),
    ).not.toBeInTheDocument();
  });

  it('Displays the correct number of groups in the groups tab', async () => {
    const rendered = await renderWrapped(
      <CostInsightsTabs groups={mockGroups} />,
    );
    expect(rendered.getByText('3 teams')).toBeInTheDocument();
  });

  it('Applies the correct group filter when selected', async () => {
    const selectedGroup = expect.objectContaining({ group: 'test-group-1' });
    const rendered = await renderWrapped(
      <CostInsightsTabs groups={mockGroups} />,
    );
    UserEvent.click(rendered.getByTestId('cost-insights-groups-tab'));
    UserEvent.click(rendered.getByTestId('test-group-1'));
    expect(mockSetPageFilters).toHaveBeenCalledWith(selectedGroup);
  });

  it('Displays the correct group names in the menu', async () => {
    const rendered = await renderWrapped(
      <CostInsightsTabs groups={mockGroups} />,
    );
    UserEvent.click(rendered.getByTestId('cost-insights-groups-tab'));
    mockGroups.forEach(group =>
      expect(rendered.getByText(group.id)).toBeInTheDocument(),
    );
  });
});
