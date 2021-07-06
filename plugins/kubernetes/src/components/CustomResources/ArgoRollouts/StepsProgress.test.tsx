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
import { render } from '@testing-library/react';
import pauseSteps from './__fixtures__/pause-steps';
import setWeightSteps from './__fixtures__/setweight-steps';
import analysisSteps from './__fixtures__/analysis-steps';
import { wrapInTestApp } from '@backstage/test-utils';
import { StepsProgress } from './StepsProgress';

describe('StepsProgress', () => {
  it('should render Pause step text', async () => {
    const { getByText } = render(
      wrapInTestApp(
        <StepsProgress
          currentStepIndex={0}
          aborted={false}
          steps={pauseSteps}
        />,
      ),
    );

    expect(getByText('pause for 1h')).toBeInTheDocument();
    expect(getByText('infinite pause')).toBeInTheDocument();
  });
  it('should render SetWeight step text', async () => {
    const { getByText } = render(
      wrapInTestApp(
        <StepsProgress
          currentStepIndex={0}
          aborted={false}
          steps={setWeightSteps}
        />,
      ),
    );

    expect(getByText('setWeight 10%')).toBeInTheDocument();
    expect(getByText('setWeight 95%')).toBeInTheDocument();
  });
  it('should render Analysis step text', async () => {
    const { getAllByText, getByText } = render(
      wrapInTestApp(
        <StepsProgress
          currentStepIndex={0}
          aborted={false}
          steps={analysisSteps}
        />,
      ),
    );

    expect(getAllByText('analysis templates:')).toHaveLength(2);
    expect(getByText('always-pass')).toBeInTheDocument();
    expect(getByText('always-fail')).toBeInTheDocument();
    expect(getByText('req-rate (cluster scoped)')).toBeInTheDocument();
  });
  it('should render 3 different steps', async () => {
    const { getByText } = render(
      wrapInTestApp(
        <StepsProgress
          currentStepIndex={0}
          aborted={false}
          steps={[setWeightSteps[0], pauseSteps[0], analysisSteps[0]]}
        />,
      ),
    );

    expect(getByText('setWeight 10%')).toBeInTheDocument();
    expect(getByText('pause for 1h')).toBeInTheDocument();
    expect(getByText('analysis templates:')).toBeInTheDocument();
    expect(getByText('always-pass')).toBeInTheDocument();
    expect(getByText('Canary promoted')).toBeInTheDocument();
  });
  it('current step is highlighted, previous steps are ticked', async () => {
    const { getByText, queryByText } = render(
      wrapInTestApp(
        <StepsProgress
          currentStepIndex={1}
          aborted={false}
          steps={[setWeightSteps[0], pauseSteps[0], analysisSteps[0]]}
        />,
      ),
    );

    // It is ticked, so it's not visible
    expect(queryByText('1')).toBeNull();
    // The current step
    expect(getByText('2')).toBeInTheDocument();
    // The future step
    expect(getByText('3')).toBeInTheDocument();
    // The canary promoted step should always be added at the end
    expect(getByText('4')).toBeInTheDocument();
  });
  it('aborted canary has all steps grey', async () => {
    const { getByText } = render(
      wrapInTestApp(
        <StepsProgress
          currentStepIndex={2}
          aborted
          steps={[setWeightSteps[0], pauseSteps[0], analysisSteps[0]]}
        />,
      ),
    );

    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
    expect(getByText('4')).toBeInTheDocument();
  });
  it('promoted canary has all steps ticked', async () => {
    const { queryByText } = render(
      wrapInTestApp(
        <StepsProgress
          currentStepIndex={3}
          aborted={false}
          steps={[setWeightSteps[0], pauseSteps[0], analysisSteps[0]]}
        />,
      ),
    );

    expect(queryByText('1')).toBeNull();
    expect(queryByText('2')).toBeNull();
    expect(queryByText('3')).toBeNull();
    expect(queryByText('4')).toBeNull();
  });
});
