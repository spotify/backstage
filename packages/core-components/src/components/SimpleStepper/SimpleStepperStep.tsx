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
import React, { PropsWithChildren } from 'react';
import {
  Step as MuiStep,
  StepContent,
  StepLabel,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { SimpleStepperFooter } from './SimpleStepperFooter';
import { StepProps } from './types';

const useStyles = makeStyles(theme => ({
  end: {
    padding: theme.spacing(3),
  },
}));

export const SimpleStepperStep = ({
  title,
  children,
  end,
  actions,
  ...muiProps
}: PropsWithChildren<StepProps>) => {
  const classes = useStyles();

  // The end step is not a part of the stepper
  // It simply is the final screen with an option to have buttons such as reset or back
  return end ? (
    <div className={classes.end}>
      <Typography variant="h6">{title}</Typography>
      {children}
      <SimpleStepperFooter actions={{ ...(actions || {}), showNext: false }} />
    </div>
  ) : (
    <MuiStep {...muiProps}>
      <StepLabel>
        <Typography variant="h6">{title}</Typography>
      </StepLabel>
      <StepContent>
        {children}
        <SimpleStepperFooter actions={actions} />
      </StepContent>
    </MuiStep>
  );
};
