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
import { Grid, List } from '@material-ui/core';
import React from 'react';
import { PinButton } from './PinButton';
import { Profile } from './Profile';
import { ThemeToggle } from './ThemeToggle';
import { InfoCard } from '@backstage/core-components';

export const General = () => {
  return (
    <Grid container direction="row" spacing={3}>
      <Grid item sm={12} md={6}>
        <Profile />
      </Grid>
      <Grid item sm={12} md={6}>
        <InfoCard title="Appearance">
          <List dense>
            <ThemeToggle />
            <PinButton />
          </List>
        </InfoCard>
      </Grid>
    </Grid>
  );
};
