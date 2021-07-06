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
import { render } from '@testing-library/react';
import { GraphiQLBrowser } from './GraphiQLBrowser';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';

jest.mock('graphiql', () => () => '<GraphiQL />');

describe('GraphiQLBrowser', () => {
  it('should render error text if there are no endpoints', () => {
    const rendered = render(
      <ThemeProvider theme={lightTheme}>
        <GraphiQLBrowser endpoints={[]} />
      </ThemeProvider>,
    );
    rendered.getByText('No endpoints available');
  });

  it('should render endpoint tabs', () => {
    const rendered = render(
      <ThemeProvider theme={lightTheme}>
        <GraphiQLBrowser
          endpoints={[
            {
              id: 'a',
              title: 'Endpoint A',
              async fetcher() {},
            },
            {
              id: 'b',
              title: 'Endpoint B',
              async fetcher() {},
            },
          ]}
        />
      </ThemeProvider>,
    );
    rendered.getByText('Endpoint A');
    rendered.getByText('Endpoint B');
  });
});
