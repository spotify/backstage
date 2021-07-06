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

import React, { useEffect, useState } from 'react';
import { Paper, Slide } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { BarChartStepperButton } from './BarChartStepperButton';
import { BarChartSteps } from './BarChartSteps';
import { useBarChartStepperStyles } from '../../utils/styles';

type BarChartStepperProps = {
  disableScroll: boolean;
  steps: number;
  onChange: (activeStep: number) => void;
};

export const BarChartStepper = ({
  steps,
  disableScroll,
  onChange,
}: BarChartStepperProps) => {
  const classes = useBarChartStepperStyles();
  const [activeStep, setActiveStep] = useState(0);

  /*
   * This calc determines how many active steps to display in the stepper.
   * If the chart is displaying a large amount of resources,
   * the total dots are truncated to 10. As the user clicks forward,
   * eventually, there might be resources "left over" in excess of the ten dot limit.
   * Once the user has reached that threshold, the difference should appear constant
   * as the user clicks through the remaining resources and no extra dots should be displayed.
   */

  const diff = steps % 10;
  const stepsRemaining = steps - activeStep <= diff ? diff : steps;
  const displayedStep = activeStep % 10;

  useEffect(() => {
    onChange(activeStep);
  }, [activeStep, onChange]);

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleClick = (index: number) => {
    setActiveStep(prevStep => {
      const offset = index - (prevStep % 10);
      return prevStep + offset;
    });
  };

  return (
    <Paper
      data-testid="bar-chart-stepper"
      square
      elevation={0}
      className={classes.paper}
    >
      <Slide
        direction="right"
        in={!disableScroll && activeStep !== 0}
        mountOnEnter
        unmountOnExit
      >
        <BarChartStepperButton
          name="back"
          className={classes.backButton}
          onClick={handleBack}
        >
          <ChevronLeftIcon />
        </BarChartStepperButton>
      </Slide>
      <BarChartSteps
        steps={Math.min(10, stepsRemaining)}
        activeStep={displayedStep}
        onClick={handleClick}
      />
      <Slide
        direction="left"
        in={!disableScroll && activeStep < steps - 1}
        mountOnEnter
        unmountOnExit
      >
        <BarChartStepperButton
          name="next"
          className={classes.nextButton}
          onClick={handleNext}
        >
          <ChevronRightIcon />
        </BarChartStepperButton>
      </Slide>
    </Paper>
  );
};
