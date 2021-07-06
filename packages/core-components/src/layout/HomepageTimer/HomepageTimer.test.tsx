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

import { renderWithEffects } from '@backstage/test-utils';
import { HomepageTimer } from './HomepageTimer';
import React from 'react';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import {
  ApiProvider,
  ApiRegistry,
  ConfigReader,
} from '@backstage/core-app-api';
import { ConfigApi, configApiRef } from '@backstage/core-plugin-api';

it('changes default timezone to GMT', async () => {
  const configApi: ConfigApi = new ConfigReader({
    homepage: {
      clocks: [
        {
          label: 'New York',
          timezone: 'America/New_Pork',
        },
      ],
    },
    context: 'test',
  });

  const rendered = await renderWithEffects(
    <ThemeProvider theme={lightTheme}>
      <ApiProvider apis={ApiRegistry.from([[configApiRef, configApi]])}>
        <HomepageTimer />
      </ApiProvider>
    </ThemeProvider>,
  );

  expect(rendered.getByText('GMT')).toBeInTheDocument();
});
