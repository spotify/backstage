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
import { makeStyles, Tooltip } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    width: '3px',
    height: '15px',
    marginRight: '2px',
    borderRadius: '4px',
    backgroundColor: theme.palette.textSubtle,
  },
  green: {
    backgroundColor: theme.palette.success.main,
  },
  yellow: {
    backgroundColor: theme.palette.warning.main,
  },
  red: {
    backgroundColor: theme.palette.error.main,
  },
}));

export const Bar = ({
  percentage,
  range,
}: {
  percentage: number;
  range: number;
}) => {
  const classes = useStyles();
  const className = [];

  className.push(classes.root);

  if (percentage >= 100) {
    className.push(classes.green);
  } else if (percentage >= 95) {
    className.push(classes.yellow);
  } else {
    className.push(classes.red);
  }

  const dateString = new Date(range * 1000).toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Tooltip
        title={
          <>
            {dateString}
            <br />
            {percentage}%
          </>
        }
        placement="top"
      >
        <div className={className.join(' ')} />
      </Tooltip>
    </>
  );
};
