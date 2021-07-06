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
import React, {
  Children,
  isValidElement,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { Stepper as MuiStepper } from '@material-ui/core';

type InternalState = {
  stepperLength: number;
  stepIndex: number;
  setStepIndex: any;
  stepHistory: number[];
  setStepHistory: any;
  onStepChange?: (prevIndex: number, nextIndex: number) => void;
};

const noop = () => {};
export const VerticalStepperContext = React.createContext<InternalState>({
  stepperLength: 0,
  stepIndex: 0,
  setStepIndex: noop,
  stepHistory: [],
  setStepHistory: noop,
  onStepChange: noop,
});

export interface StepperProps {
  elevated?: boolean;
  onStepChange?: (prevIndex: number, nextIndex: number) => void;
  activeStep?: number;
}

export const SimpleStepper = ({
  children,
  elevated,
  onStepChange,
  activeStep = 0,
}: PropsWithChildren<StepperProps>) => {
  const [stepIndex, setStepIndex] = useState<number>(activeStep);
  const [stepHistory, setStepHistory] = useState<number[]>([0]);

  useEffect(() => {
    setStepIndex(activeStep);
  }, [activeStep]);

  const steps: React.ReactNode[] = [];
  let endStep;
  Children.forEach(children, child => {
    if (isValidElement(child)) {
      if (child.props.end) {
        endStep = child;
      } else {
        steps.push(child);
      }
    }
  });

  return (
    <>
      <VerticalStepperContext.Provider
        value={{
          stepIndex,
          setStepIndex,
          stepHistory,
          setStepHistory,
          onStepChange,
          stepperLength: Children.count(children),
        }}
      >
        <MuiStepper
          activeStep={stepIndex}
          orientation="vertical"
          elevation={elevated ? 2 : 0}
        >
          {steps}
        </MuiStepper>
      </VerticalStepperContext.Provider>
      {stepIndex >= Children.count(children) - 1 && endStep}
    </>
  );
};
