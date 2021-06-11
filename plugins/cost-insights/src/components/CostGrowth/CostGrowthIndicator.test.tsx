/*
 * Copyright 2020 Spotify AB
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
import { CostGrowthIndicator } from './CostGrowthIndicator';
import { ChangeThreshold, EngineerThreshold } from '../../types';

describe.each`
  ratio                           | amount                     | ariaLabel
  ${ChangeThreshold.lower}        | ${EngineerThreshold}       | ${'savings'}
  ${ChangeThreshold.lower - 0.01} | ${EngineerThreshold}       | ${'savings'}
  ${ChangeThreshold.lower - 0.01} | ${EngineerThreshold + 0.1} | ${'savings'}
  ${ChangeThreshold.upper}        | ${EngineerThreshold}       | ${'excess'}
  ${ChangeThreshold.upper + 0.01} | ${EngineerThreshold}       | ${'excess'}
  ${ChangeThreshold.upper + 0.01} | ${EngineerThreshold + 0.1} | ${'excess'}
`('growthOf', ({ ratio, amount, ariaLabel }) => {
  it(`should display the correct indicator for ${ariaLabel}`, async () => {
    const { getByLabelText } = await renderInTestApp(
      <CostGrowthIndicator change={{ ratio, amount }} />,
    );
    expect(getByLabelText(ariaLabel)).toBeInTheDocument();
  });
});

describe.each`
  ratio                           | amount
  ${undefined}                    | ${0}
  ${0}                            | ${0}
  ${ChangeThreshold.lower}        | ${0}
  ${ChangeThreshold.lower + 0.01} | ${EngineerThreshold}
  ${ChangeThreshold.lower + 0.01} | ${EngineerThreshold + 0.1}
  ${ChangeThreshold.lower - 0.01} | ${EngineerThreshold - 0.1}
  ${ChangeThreshold.upper + 0.01} | ${EngineerThreshold - 0.1}
`('growthOf', ({ ratio, amount }) => {
  it('should display the correct indicator for negligible growth', async () => {
    const { queryByLabelText } = await renderInTestApp(
      <CostGrowthIndicator change={{ ratio, amount }} />,
    );
    expect(queryByLabelText('savings')).not.toBeInTheDocument();
    expect(queryByLabelText('excess')).not.toBeInTheDocument();
  });
});
