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
import { makeStyles, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  value: {
    fontWeight: 'bold',
    overflow: 'hidden',
    lineHeight: '24px',
    wordBreak: 'break-word',
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

type Props = {
  label: string;
  value?: string;
  gridSizes?: Record<string, number>;
  children?: React.ReactNode;
};

export const AboutField = ({ label, value, gridSizes, children }: Props) => {
  const classes = useStyles();

  // Content is either children or a string prop `value`
  const content = React.Children.count(children) ? (
    children
  ) : (
    <Typography variant="body2" className={classes.value}>
      {value || `unknown`}
    </Typography>
  );
  return (
    <Grid item {...gridSizes}>
      <Typography variant="subtitle2" className={classes.label}>
        {label}
      </Typography>
      {content}
    </Grid>
  );
};
