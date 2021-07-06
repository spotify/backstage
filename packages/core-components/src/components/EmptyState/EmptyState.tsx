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
import { EmptyStateImage } from './EmptyStateImage';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2, 0, 0, 0),
  },
  action: {
    marginTop: theme.spacing(2),
  },
  imageContainer: {
    position: 'relative',
  },
}));

type Props = {
  title: string;
  description?: string | JSX.Element;
  missing: 'field' | 'info' | 'content' | 'data';
  action?: JSX.Element;
};

export const EmptyState = ({ title, description, missing, action }: Props) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justify="space-around"
      alignItems="flex-start"
      className={classes.root}
      spacing={2}
    >
      <Grid item container direction="column" xs={12} md={6}>
        <Grid item>
          <Typography variant="h5">{title}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">{description}</Typography>
        </Grid>
        <Grid item className={classes.action}>
          {action}
        </Grid>
      </Grid>
      <Grid item xs={12} md={6} className={classes.imageContainer}>
        <EmptyStateImage missing={missing} />
      </Grid>
    </Grid>
  );
};
