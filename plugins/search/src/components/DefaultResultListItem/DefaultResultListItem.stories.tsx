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

import React from 'react';
import { Grid } from '@material-ui/core';
import { DefaultResultListItem } from '../index';
import { MemoryRouter } from 'react-router';

export default {
  title: 'Plugins/Search/DefaultResultListItem',
  component: DefaultResultListItem,
};

export const Default = () => {
  return (
    <MemoryRouter>
      <Grid container direction="row">
        <Grid item xs={12}>
          <DefaultResultListItem
            result={{
              location: 'search/search-result',
              title: 'Search Result 1',
              text: 'some text from the search result',
            }}
          />
        </Grid>
      </Grid>
    </MemoryRouter>
  );
};
