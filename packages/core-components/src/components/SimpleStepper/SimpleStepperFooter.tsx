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
import React, { useContext, ReactNode, PropsWithChildren } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { StepActions } from './types';
import { VerticalStepperContext } from './SimpleStepper';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    '& button': {
      marginRight: theme.spacing(1),
    },
  },
}));

interface CommonBtnProps {
  text?: string;
  handleClick?: () => void;
  stepIndex: number;
}
interface RestartBtnProps extends CommonBtnProps {}

interface NextBtnProps extends CommonBtnProps {
  disabled?: boolean;
  last?: boolean;
  stepIndex: number;
}
interface BackBtnProps extends CommonBtnProps {
  disabled?: boolean;
  stepIndex: number;
}
export const RestartBtn = ({ text, handleClick }: RestartBtnProps) => (
  <Button onClick={handleClick}>{text || 'Reset'}</Button>
);

const NextBtn = ({
  text,
  handleClick,
  disabled,
  last,
  stepIndex,
}: NextBtnProps) => (
  <Button
    variant="contained"
    color="primary"
    disabled={disabled}
    data-testid={`nextButton-${stepIndex}`}
    onClick={handleClick}
  >
    {text || (last ? 'Finish' : 'Next')}
  </Button>
);

const BackBtn = ({ text, handleClick, disabled, stepIndex }: BackBtnProps) => (
  <Button
    onClick={handleClick}
    data-testid={`backButton-${stepIndex}`}
    disabled={disabled}
  >
    {text || 'Back'}
  </Button>
);

export type SimpleStepperFooterProps = {
  actions?: StepActions;
  children?: ReactNode;
};

export const SimpleStepperFooter = ({
  actions = {},
  children,
}: PropsWithChildren<SimpleStepperFooterProps>) => {
  const classes = useStyles();
  const {
    stepperLength,
    stepIndex,
    setStepIndex,
    stepHistory,
    setStepHistory,
    onStepChange,
  } = useContext(VerticalStepperContext);

  const onChange = (newIndex: number, callback?: () => void) => {
    if (callback) {
      callback();
    }
    if (onStepChange) {
      onStepChange(stepIndex, newIndex);
    }

    setStepIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = actions.nextStep
      ? actions.nextStep(stepIndex, stepperLength - 1)
      : stepIndex + 1;
    onChange(newIndex, actions.onNext);
    setStepHistory([...stepHistory, newIndex]);
  };
  const handleBack = () => {
    stepHistory.pop();
    onChange(stepHistory[stepHistory.length - 1], actions.onBack);
    setStepHistory([...stepHistory]);
  };
  const handleRestart = () => {
    onChange(0, actions.onRestart);
    setStepHistory([0]);
  };

  return (
    <div className={classes.root}>
      {[undefined, true].includes(actions.showBack) && stepIndex !== 0 && (
        <BackBtn
          text={actions.backText}
          handleClick={handleBack}
          disabled={stepIndex === 0}
          stepIndex={stepIndex}
        />
      )}
      {[undefined, true].includes(actions.showNext) && (
        <NextBtn
          text={actions.nextText}
          handleClick={handleNext}
          disabled={
            (!!stepperLength && stepIndex >= stepperLength) ||
            (!!actions.canNext && !actions.canNext())
          }
          stepIndex={stepIndex}
        />
      )}
      {actions.showRestart && stepIndex !== 0 && (
        <RestartBtn
          text={actions.restartText}
          handleClick={handleRestart}
          stepIndex={stepIndex}
        />
      )}
      {children}
    </div>
  );
};
