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
import { fireEvent, within } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { SimpleStepper as Stepper } from './SimpleStepper';
import { SimpleStepperStep as Step } from './SimpleStepperStep';

const getTextInSlide = (rendered: any, index: number) =>
  within(rendered.getByTestId(`step${index}`)).getByText;

describe('Stepper', () => {
  it('Maintains state history', async () => {
    const rendered = await renderInTestApp(
      <Stepper>
        <Step title="Step 0" data-testid="step0">
          <div>step0</div>
        </Step>
        <Step title="Step 1" data-testid="step1">
          <div>step1</div>
        </Step>
        <Step title="Step 2" data-testid="step2">
          <div>step2</div>
        </Step>
      </Stepper>,
    );

    fireEvent.click(getTextInSlide(rendered, 0)('Next') as Node);
    expect(rendered.getByText('step1')).toBeInTheDocument();

    fireEvent.click(getTextInSlide(rendered, 1)('Back') as Node);
    expect(rendered.getByText('step0')).toBeInTheDocument();

    fireEvent.click(getTextInSlide(rendered, 0)('Next') as Node);
    expect(rendered.getByText('step1')).toBeInTheDocument();
  });

  it('Handles nextStep property', async () => {
    const rendered = await renderInTestApp(
      <Stepper>
        <Step title="Step 0" data-testid="step0">
          <div>step0</div>
        </Step>
        <Step
          title="Step 1"
          actions={{ nextStep: () => 3 }}
          data-testid="step1"
        >
          <div>step1</div>
        </Step>
        <Step title="Step 2" data-testid="step2">
          <div>step2</div>
        </Step>
        <Step title="Step 3" data-testid="step3">
          <div>step3</div>
        </Step>
      </Stepper>,
    );

    fireEvent.click(getTextInSlide(rendered, 0)('Next') as Node);
    expect(rendered.getByText('step1')).toBeInTheDocument();

    fireEvent.click(getTextInSlide(rendered, 1)('Next') as Node);
    expect(rendered.getByText('step3')).toBeInTheDocument();

    fireEvent.click(getTextInSlide(rendered, 3)('Back') as Node);
    expect(rendered.getByText('step1')).toBeInTheDocument();
  });

  it('Shows controls and content when going back to first step', async () => {
    const rendered = await renderInTestApp(
      <Stepper>
        <Step title="Step 0" data-testid="step0">
          <div>step0</div>
        </Step>
        <Step
          title="Step 1"
          actions={{ nextStep: () => 3 }}
          data-testid="step1"
        >
          <div>step1</div>
        </Step>
        <Step title="Step 2" data-testid="step2">
          <div>step2</div>
        </Step>
        <Step title="Step 3" data-testid="step3">
          <div>step3</div>
        </Step>
      </Stepper>,
    );

    fireEvent.click(getTextInSlide(rendered, 0)('Next') as Node);
    expect(rendered.getByText('step1')).toBeInTheDocument();

    fireEvent.click(getTextInSlide(rendered, 1)('Next') as Node);
    expect(rendered.getByText('step3')).toBeInTheDocument();

    fireEvent.click(getTextInSlide(rendered, 3)('Back') as Node);
    expect(rendered.getByText('step1')).toBeInTheDocument();
    expect(getTextInSlide(rendered, 1)('Next')).toBeInTheDocument();

    fireEvent.click(getTextInSlide(rendered, 1)('Back') as Node);
    expect(rendered.getByText('step0')).toBeInTheDocument();
    expect(getTextInSlide(rendered, 0)('Next')).toBeInTheDocument();
  });

  it('uses nextText if specified in all steps', async () => {
    const rendered = await renderInTestApp(
      <Stepper>
        <Stepper>
          <Step
            title="Step 0"
            actions={{
              nextText: 'Step0Next',
            }}
          >
            <div>step0</div>
          </Step>
          <Step
            title="Step 1"
            actions={{
              nextText: 'FinalStepNext',
            }}
          >
            <div>final step</div>
          </Step>
        </Stepper>
      </Stepper>,
    );
    expect(rendered.getByText('Step0Next')).toBeInTheDocument();
    fireEvent.click(rendered.getByText('Step0Next'));

    expect(rendered.getByText('FinalStepNext')).toBeInTheDocument();
  });
});
