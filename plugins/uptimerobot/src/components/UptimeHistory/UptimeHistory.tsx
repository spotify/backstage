/*
 * Copyright 2021 Spotify AB
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

import { BackstageTheme } from '@backstage/theme';
import { Bar } from './Bar';
import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Percentage } from '../Percentage';
import { getUptimeRanges } from '../../utils';

const useStyles = makeStyles<BackstageTheme>(() => ({
  root: {
    display: 'flex',
  },
}));

export const UptimeHistory = ({
  data,
  percentage,
}: {
  data: number[];
  percentage: number;
}) => {
  const uptimeRanges = getUptimeRanges();
  const classes = useStyles();

  const bars = [];

  for (let i = data.length - 1; i >= 0; i--) {
    bars.push(
      <Bar
        key={uptimeRanges[i]}
        percentage={data[i]}
        range={uptimeRanges[i]}
      />,
    );
  }

  return (
    <div className={classes.root}>
      {bars}
      <Percentage data={percentage} />
    </div>
  );
};
