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
import { Box, Typography } from '@material-ui/core';
import { useBarChartLabelStyles } from '../../utils/styles';

type BarChartLabelProps = {
  x: number;
  y: number;
  height: number;
  width: number;
  details?: JSX.Element;
};

export const BarChartLabel = ({
  x,
  y,
  height,
  width,
  details,
  children,
}: PropsWithChildren<BarChartLabelProps>) => {
  const classes = useBarChartLabelStyles();
  const translateX = width * -0.5;

  return (
    <foreignObject
      className={classes.foreignObject}
      style={{ transform: `translateX(${translateX}px)` }}
      x={x}
      y={y}
      height={height}
      width={width}
    >
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Typography className={classes.label} gutterBottom>
          {children}
        </Typography>
        {details}
      </Box>
    </foreignObject>
  );
};
