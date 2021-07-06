/*
 * Copyright 2021 The Backstage Authors
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

import { Step, StepContent, Stepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useMemo } from 'react';
import { ImportFlows, ImportState, useImportState } from '../useImportState';
import {
  defaultGenerateStepper,
  defaultStepper,
  StepConfiguration,
  StepperProvider,
  StepperProviderOpts,
} from './defaults';

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { InfoCard, InfoCardVariants } from '@backstage/core-components';

const useStyles = makeStyles(() => ({
  stepperRoot: {
    padding: 0,
  },
}));

type Props = {
  initialUrl?: string;
  generateStepper?: (
    flow: ImportFlows,
    defaults: StepperProvider,
  ) => StepperProvider;
  variant?: InfoCardVariants;
  opts?: StepperProviderOpts;
};

export const ImportStepper = ({
  initialUrl,
  generateStepper = defaultGenerateStepper,
  variant,
  opts,
}: Props) => {
  const configApi = useApi(configApiRef);
  const classes = useStyles();
  const state = useImportState({ initialUrl });

  const states = useMemo<StepperProvider>(
    () => generateStepper(state.activeFlow, defaultStepper),
    [generateStepper, state.activeFlow],
  );

  const render = (step: StepConfiguration) => {
    return (
      <Step>
        {step.stepLabel}
        <StepContent>{step.content}</StepContent>
      </Step>
    );
  };

  return (
    <InfoCard variant={variant}>
      <Stepper
        classes={{ root: classes.stepperRoot }}
        activeStep={state.activeStepNumber}
        orientation="vertical"
      >
        {render(
          states.analyze(
            state as Extract<ImportState, { activeState: 'analyze' }>,
            { apis: { configApi }, opts },
          ),
        )}
        {render(
          states.prepare(
            state as Extract<ImportState, { activeState: 'prepare' }>,
            { apis: { configApi }, opts },
          ),
        )}
        {render(
          states.review(
            state as Extract<ImportState, { activeState: 'review' }>,
            { apis: { configApi }, opts },
          ),
        )}
        {render(
          states.finish(
            state as Extract<ImportState, { activeState: 'finish' }>,
            { apis: { configApi }, opts },
          ),
        )}
      </Stepper>
    </InfoCard>
  );
};
