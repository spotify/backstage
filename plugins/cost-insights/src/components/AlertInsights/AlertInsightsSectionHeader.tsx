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
import { Avatar, Box, Button, Grid, Typography } from '@material-ui/core';
import { useAlertInsightsSectionStyles as useStyles } from '../../utils/styles';
import { ScrollAnchor } from '../../utils/scroll';
import { Alert } from '../../types';

type AlertInsightsSectionHeaderProps = {
  alert: Alert;
  number: number;
};

export const AlertInsightsSectionHeader = ({
  alert,
  number,
}: AlertInsightsSectionHeaderProps) => {
  const classes = useStyles();

  const isViewInstructionsButtonDisplayed = !!alert.url;

  return (
    <Box position="relative" mb={3} textAlign="left">
      <ScrollAnchor id={`alert-${number}`} />
      <Grid container spacing={2} justify="space-between" alignItems="center">
        <Grid item>
          <Box display="flex" alignItems="center">
            <Box mr={2}>
              <Avatar className={classes.button}>{number}</Avatar>
            </Box>
            <Box>
              <Typography variant="h5">{alert.title}</Typography>
              <Typography gutterBottom>{alert.subtitle}</Typography>
            </Box>
          </Box>
        </Grid>
        {isViewInstructionsButtonDisplayed && (
          <Grid item>
            <Button variant="text" color="primary" href={alert.url}>
              {alert.buttonText || 'View Instructions'}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
