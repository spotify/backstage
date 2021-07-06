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
import { Grid, Typography } from '@material-ui/core';
import EmptyStateImage from '../../assets/emptystate.svg';

export const IncidentsEmptyState = () => {
  return (
    <Grid container justify="center" direction="column" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h5">Nice! No incidents found!</Typography>
      </Grid>
      <Grid item xs={12}>
        <img
          src={EmptyStateImage}
          alt="EmptyState"
          data-testid="emptyStateImg"
        />
      </Grid>
    </Grid>
  );
};
