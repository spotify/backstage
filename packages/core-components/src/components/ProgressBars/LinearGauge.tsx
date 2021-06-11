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
import { Tooltip, useTheme } from '@material-ui/core';
// @ts-ignore
import { Line } from 'rc-progress';
import { BackstageTheme } from '@backstage/theme';
import { getProgressColor } from './Gauge';

type Props = {
  /**
   * Progress value between 0.0 - 1.0.
   */
  value: number;
};

export const LinearGauge = ({ value }: Props) => {
  const theme = useTheme<BackstageTheme>();
  if (isNaN(value)) {
    return null;
  }
  let percent = Math.round(value * 100 * 100) / 100;
  if (percent > 100) {
    percent = 100;
  }
  const strokeColor = getProgressColor(theme.palette, percent, false, 100);
  return (
    <Tooltip title={`${percent}%`}>
      <span>
        <Line
          percent={percent}
          strokeWidth={4}
          trailWidth={4}
          strokeColor={strokeColor}
        />
      </span>
    </Tooltip>
  );
};
