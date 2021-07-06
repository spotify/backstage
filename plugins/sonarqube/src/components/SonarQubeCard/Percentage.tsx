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

import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core';
import { Circle } from 'rc-progress';
import React from 'react';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  root: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
}));

export const Percentage = ({ value }: { value?: string }) => {
  const classes = useStyles();
  const theme = useTheme<BackstageTheme>();

  return (
    <Circle
      strokeLinecap="butt"
      percent={+(value || 0)}
      strokeWidth={16}
      strokeColor={theme.palette.status.ok}
      trailColor={theme.palette.status.error}
      trailWidth={16}
      className={classes.root}
    />
  );
};
