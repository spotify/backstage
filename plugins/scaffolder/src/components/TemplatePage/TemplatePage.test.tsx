/*
 * Copyright 2020 Spotify AB
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
import { ApiProvider, ApiRegistry, errorApiRef } from '@backstage/core';
import { renderInTestApp, renderWithEffects } from '@backstage/test-utils';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router';
import { ScaffolderApi, scaffolderApiRef } from '../../api';
import { rootRouteRef } from '../../routes';
import { TemplatePage, createValidator } from './TemplatePage';

jest.mock('react-router-dom', () => {
  return {
    ...(jest.requireActual('react-router-dom') as any),
    useParams: () => ({
      templateName: 'test',
    }),
  };
});

const scaffolderApiMock: jest.Mocked<ScaffolderApi> = {
  scaffold: jest.fn(),
  getTemplateParameterSchema: jest.fn(),
  getIntegrationsList: jest.fn(),
  getIntegration: jest.fn(),
  getTask: jest.fn(),
  streamLogs: jest.fn(),
  listActions: jest.fn(),
};

const errorApiMock = { post: jest.fn(), error$: jest.fn() };

const apis = ApiRegistry.from([
  [scaffolderApiRef, scaffolderApiMock],
  [errorApiRef, errorApiMock],
]);

describe('TemplatePage', () => {
  beforeEach(() => jest.resetAllMocks());

  it('renders correctly', async () => {
    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
      title: 'React SSR Template',
      steps: [],
    });
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <TemplatePage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );

    expect(rendered.queryByText('Create a New Component')).toBeInTheDocument();
    expect(rendered.queryByText('React SSR Template')).toBeInTheDocument();
  });

  it('renders spinner while loading', async () => {
    let resolve: Function;
    const promise = new Promise<any>(res => {
      resolve = res;
    });
    scaffolderApiMock.getTemplateParameterSchema.mockReturnValueOnce(promise);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <TemplatePage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );

    expect(rendered.queryByText('Create a New Component')).toBeInTheDocument();
    expect(rendered.queryByTestId('loading-progress')).toBeInTheDocument();

    await act(async () => {
      resolve!({
        title: 'React SSR Template',
        steps: [],
      });
    });
  });

  it('navigates away if no template was loaded', async () => {
    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue(
      undefined as any,
    );

    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <ThemeProvider theme={lightTheme}>
          <MemoryRouter initialEntries={['/create/test']}>
            <Route path="/create/test">
              <TemplatePage />
            </Route>
            <Route path="/create" element={<>This is root</>} />
          </MemoryRouter>
        </ThemeProvider>
      </ApiProvider>,
    );

    expect(
      rendered.queryByText('Create a New Component'),
    ).not.toBeInTheDocument();
    expect(rendered.queryByText('This is root')).toBeInTheDocument();
  });
});

describe('createValidator', () => {
  it('should validate deep schema', () => {
    const validator = createValidator({
      type: 'object',
      properties: {
        foo: {
          type: 'object',
          properties: {
            bar: {
              type: 'string',
              'ui:field': 'RepoUrlPicker',
            },
          },
        },
      },
    });

    const errors = { foo: { bar: { addError: jest.fn() } } };
    validator({ foo: { bar: 'github.com?owner=a' } }, errors as any);
    expect(errors.foo.bar.addError).toHaveBeenCalledWith(
      'Incomplete repository location provided',
    );
    jest.resetAllMocks();

    validator({ foo: { bar: 'github.com?repo=b' } }, errors as any);
    expect(errors.foo.bar.addError).toHaveBeenCalledWith(
      'Incomplete repository location provided',
    );
    jest.resetAllMocks();

    validator({ foo: { bar: 'github.com?owner=a&repo=b' } }, errors as any);
    expect(errors.foo.bar.addError).not.toHaveBeenCalled();
  });
});
