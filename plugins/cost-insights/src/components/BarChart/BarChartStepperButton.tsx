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

import React, { forwardRef, PropsWithChildren, Ref } from 'react';
import { ButtonBase, ButtonBaseProps } from '@material-ui/core';
import { useBarChartStepperButtonStyles as useStyles } from '../../utils/styles';

interface BarChartStepperButtonProps extends ButtonBaseProps {
  name: string;
}

export const BarChartStepperButton = forwardRef(
  (
    {
      name,
      children,
      ...buttonBaseProps
    }: PropsWithChildren<BarChartStepperButtonProps>,
    ref: Ref<HTMLButtonElement>,
  ) => {
    const classes = useStyles();
    return (
      <ButtonBase
        ref={ref}
        classes={classes}
        disableRipple
        data-testid={`bar-chart-stepper-button-${name}`}
        {...buttonBaseProps}
      >
        {children}
      </ButtonBase>
    );
  },
);
