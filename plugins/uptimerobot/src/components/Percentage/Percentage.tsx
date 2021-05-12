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
import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  green: {
    color: theme.palette.success.main,
  },
  yellow: {
    color: theme.palette.warning.main,
  },
  red: {
    color: theme.palette.error.main,
  },
}));

export const Percentage = ({ data }: { data: number }) => {
  const classes = useStyles();
  const className = [];

  if (data >= 100) {
    className.push(classes.green);
  } else if (data >= 95) {
    className.push(classes.yellow);
  } else {
    className.push(classes.red);
  }

  return <span className={className.join(' ')}>{data}%</span>;
};
