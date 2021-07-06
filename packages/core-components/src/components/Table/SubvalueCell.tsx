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
import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core';

const useSubvalueCellStyles = makeStyles<BackstageTheme>(theme => ({
  value: {
    marginBottom: '6px',
  },
  subvalue: {
    color: theme.palette.textSubtle,
    fontWeight: 'normal',
  },
}));

type SubvalueCellProps = {
  value: React.ReactNode;
  subvalue: React.ReactNode;
};

export const SubvalueCell = ({ value, subvalue }: SubvalueCellProps) => {
  const classes = useSubvalueCellStyles();

  return (
    <>
      <div className={classes.value}>{value}</div>
      <div className={classes.subvalue}>{subvalue}</div>
    </>
  );
};
