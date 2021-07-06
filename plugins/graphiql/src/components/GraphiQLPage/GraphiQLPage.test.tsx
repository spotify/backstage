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
import { GraphiQLPage } from './GraphiQLPage';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { act } from 'react-dom/test-utils';
import { renderWithEffects } from '@backstage/test-utils';
import { GraphQLBrowseApi, graphQlBrowseApiRef } from '../../lib/api';
import { configApiRef } from '@backstage/core-plugin-api';
import {
  ApiProvider,
  ApiRegistry,
  ConfigReader,
} from '@backstage/core-app-api';

jest.mock('../GraphiQLBrowser', () => ({
  GraphiQLBrowser: () => '<GraphiQLBrowser />',
}));

describe('GraphiQLPage', () => {
  it('should show progress', async () => {
    jest.useFakeTimers();
    const loadingApi: GraphQLBrowseApi = {
      async getEndpoints() {
        await new Promise(() => {});
        return [];
      },
    };

    const rendered = await renderWithEffects(
      <ApiProvider
        apis={ApiRegistry.from([
          [graphQlBrowseApiRef, loadingApi],
          [configApiRef, new ConfigReader({})],
        ])}
      >
        <ThemeProvider theme={lightTheme}>
          <GraphiQLPage />
        </ThemeProvider>
        ,
      </ApiProvider>,
    );
    act(() => {
      jest.advanceTimersByTime(250);
    });
    rendered.getByText('GraphiQL');
    rendered.getByTestId('progress');
    jest.useRealTimers();
  });

  it('should show error', async () => {
    const loadingApi: GraphQLBrowseApi = {
      async getEndpoints() {
        throw new Error('NOPE');
      },
    };

    const rendered = await renderWithEffects(
      <ApiProvider
        apis={ApiRegistry.from([
          [graphQlBrowseApiRef, loadingApi],
          [configApiRef, new ConfigReader({})],
        ])}
      >
        <ThemeProvider theme={lightTheme}>
          <GraphiQLPage />
        </ThemeProvider>
      </ApiProvider>,
    );

    rendered.getByText('GraphiQL');
    rendered.getByText('Failed to load GraphQL endpoints, Error: NOPE');
  });

  it('should show GraphiQLBrowser', async () => {
    const loadingApi: GraphQLBrowseApi = {
      async getEndpoints() {
        return [];
      },
    };

    const rendered = await renderWithEffects(
      <ApiProvider
        apis={ApiRegistry.from([
          [graphQlBrowseApiRef, loadingApi],
          [configApiRef, new ConfigReader({})],
        ])}
      >
        <ThemeProvider theme={lightTheme}>
          <GraphiQLPage />
        </ThemeProvider>
      </ApiProvider>,
    );

    rendered.getByText('GraphiQL');
    rendered.getByText('<GraphiQLBrowser />');
  });
});
