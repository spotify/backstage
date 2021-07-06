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
import { Typography, Box, Grid, Container, Divider } from '@material-ui/core';

export const WhyCostsMatter = () => {
  return (
    <Box mt={10} mb={4}>
      <Container maxWidth="md">
        <Box mt={2} mb={2}>
          <Typography variant="h5" align="center" gutterBottom>
            Why cloud costs matter
          </Typography>
        </Box>
        <Grid container alignContent="space-around" spacing={3} wrap="nowrap">
          <Grid item>
            <Typography variant="h6">
              Sustainability{' '}
              <span role="img" aria-label="globe">
                🌎
              </span>
            </Typography>
            <Typography>
              Reducing cloud usage improves our carbon footprint.
            </Typography>
          </Grid>
          <Grid item>
            <Divider orientation="vertical" />
          </Grid>
          <Grid item>
            <Typography variant="h6">
              Revenue{' '}
              <span role="img" aria-label="money-with-wings">
                💸
              </span>
            </Typography>
            <Typography>
              Keeping cloud costs well-tuned prevents infrastructure from eating
              into revenue.
            </Typography>
          </Grid>
          <Grid item>
            <Divider orientation="vertical" />
          </Grid>
          <Grid item>
            <Typography variant="h6">
              Innovation{' '}
              <span role="img" aria-label="medal">
                🥇
              </span>
            </Typography>
            <Typography>
              The more we save, the more we can reinvest in speed and
              innovation.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
