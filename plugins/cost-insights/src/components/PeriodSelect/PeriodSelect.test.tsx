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
import { getByRole, waitFor } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import UserEvent from '@testing-library/user-event';
import { PeriodSelect, getDefaultOptions } from './PeriodSelect';
import { getDefaultPageFilters } from '../../utils/filters';
import { MockBillingDateProvider } from '../../testUtils';
import { Group, Duration } from '../../types';

const DefaultPageFilters = getDefaultPageFilters([{ id: 'tools' }] as Group[]);
const lastCompleteBillingDate = '2020-05-01';
const options = getDefaultOptions(lastCompleteBillingDate);

describe('<PeriodSelect />', () => {
  it('Renders without exploding', async () => {
    const rendered = await renderInTestApp(
      <MockBillingDateProvider
        lastCompleteBillingDate={lastCompleteBillingDate}
      >
        <PeriodSelect
          duration={DefaultPageFilters.duration}
          onSelect={jest.fn()}
        />
      </MockBillingDateProvider>,
    );
    expect(rendered.getByTestId('period-select')).toBeInTheDocument();
  });

  it('Should display all costGrowth period options', async () => {
    const rendered = await renderInTestApp(
      <MockBillingDateProvider
        lastCompleteBillingDate={lastCompleteBillingDate}
      >
        <PeriodSelect
          duration={DefaultPageFilters.duration}
          onSelect={jest.fn()}
        />
      </MockBillingDateProvider>,
    );
    const periodSelectContainer = rendered.getByTestId('period-select');
    const button = getByRole(periodSelectContainer, 'button');
    UserEvent.click(button);
    await waitFor(() => rendered.getByText('Past 60 Days'));
    options.forEach(option =>
      expect(
        rendered.getByTestId(`period-select-option-${option.value}`),
      ).toBeInTheDocument(),
    );
  });

  describe.each`
    duration
    ${Duration.P3M}
    ${Duration.P90D}
    ${Duration.P30D}
  `('Should select the correct duration', ({ duration }) => {
    it(`Should select ${duration}`, async () => {
      const mockOnSelect = jest.fn();
      const mockAggregation =
        // Can't select an option that's already the default
        DefaultPageFilters.duration === duration
          ? Duration.P30D
          : DefaultPageFilters.duration;

      const rendered = await renderInTestApp(
        <MockBillingDateProvider
          lastCompleteBillingDate={lastCompleteBillingDate}
        >
          <PeriodSelect duration={mockAggregation} onSelect={mockOnSelect} />,
        </MockBillingDateProvider>,
      );
      const periodSelect = rendered.getByTestId('period-select');
      const button = getByRole(periodSelect, 'button');

      UserEvent.click(button);
      UserEvent.click(rendered.getByTestId(`period-select-option-${duration}`));
      expect(mockOnSelect).toHaveBeenLastCalledWith(duration);
    });
  });
});
