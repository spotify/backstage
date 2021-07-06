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
import { BarChartLabel } from './BarChartLabel';

type BarChartTickProps = {
  x: number;
  y: number;
  height: number;
  width: number;
  payload: {
    value: any;
  };
  visibleTicksCount: number;
  details?: JSX.Element;
};

export const BarChartTick = ({
  x,
  y,
  height,
  width,
  payload,
  visibleTicksCount,
  details,
}: BarChartTickProps) => {
  const gutterWidth = 5;
  const labelWidth = width / visibleTicksCount - gutterWidth * 2;
  return (
    <BarChartLabel
      x={x}
      y={y}
      height={height}
      width={labelWidth}
      details={details}
    >
      {!payload.value ? 'Unlabeled' : payload.value}
    </BarChartLabel>
  );
};
