/*
 * Copyright 2021 The Backstage Authors
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
import { Content, Header, Lifecycle, Page } from '@backstage/core-components';
import Grid from '@material-ui/core/Grid';
import { RandomJokeHomePageComponent } from '@backstage/plugin-home';

export const HomePage = () => {
  return (
    <Page themeId="home">
      <Header title="Home" subtitle={<Lifecycle alpha />} />
      <Content>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <RandomJokeHomePageComponent />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
