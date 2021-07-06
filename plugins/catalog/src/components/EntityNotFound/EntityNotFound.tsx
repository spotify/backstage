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
import { Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';

import { Illo } from './Illo';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  container: {
    paddingTop: theme.spacing(24),
    paddingLeft: theme.spacing(8),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  title: {
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      fontSize: 32,
    },
  },
  body: {
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.down('xs')]: {
      paddingBottom: theme.spacing(5),
    },
  },
}));

export const EntityNotFound = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={0} className={classes.container}>
      <Illo />
      <Grid item xs={12} sm={6}>
        <Typography variant="h2" className={classes.title}>
          Entity was not found
        </Typography>
        <Typography variant="body1" className={classes.body}>
          Want to help us build this? Check out our Getting Started
          documentation.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="https://backstage.io/docs"
        >
          DOCS
        </Button>
      </Grid>
    </Grid>
  );
};
