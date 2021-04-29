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
import { ApiRegistry, ApiProvider } from '@backstage/core';
import React from 'react';
import { ScaffolderApi, scaffolderApiRef } from '../../api';
import { ActionsPage } from './ActionsPage';
import { rootRouteRef } from '../../routes';
import { renderInTestApp } from '@backstage/test-utils';

const scaffolderApiMock: jest.Mocked<ScaffolderApi> = {
  scaffold: jest.fn(),
  getTemplateParameterSchema: jest.fn(),
  getIntegrationsList: jest.fn(),
  getTask: jest.fn(),
  streamLogs: jest.fn(),
  listActions: jest.fn(),
};

const apis = ApiRegistry.from([[scaffolderApiRef, scaffolderApiMock]]);

describe('TemplatePage', () => {
  beforeEach(() => jest.resetAllMocks());

  it('renders action with input', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            type: 'object',
            required: ['foobar'],
            properties: {
              foobar: {
                title: 'Test title',
                type: 'string',
              },
            },
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );
    expect(rendered.queryByText('Test title')).toBeInTheDocument();
    expect(rendered.queryByText('example description')).toBeInTheDocument();
    expect(rendered.queryByText('foobar')).toBeInTheDocument();
    expect(rendered.queryByText('output')).not.toBeInTheDocument();
  });

  it('renders action with input and output', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            type: 'object',
            required: ['foobar'],
            properties: {
              foobar: {
                title: 'Test title',
                type: 'string',
              },
            },
          },
          output: {
            type: 'object',
            properties: {
              buzz: {
                title: 'Test output',
                type: 'string',
              },
            },
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );
    expect(rendered.queryByText('Test title')).toBeInTheDocument();
    expect(rendered.queryByText('example description')).toBeInTheDocument();
    expect(rendered.queryByText('foobar')).toBeInTheDocument();
    expect(rendered.queryByText('Test output')).toBeInTheDocument();
  });

  it('renders action with oneOf input', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            oneOf: [
              {
                type: 'object',
                required: ['foo'],
                properties: {
                  foo: {
                    title: 'Foo title',
                    description: 'Foo description',
                    type: 'string',
                  },
                },
              },
              {
                type: 'object',
                required: ['bar'],
                properties: {
                  bar: {
                    title: 'Bar title',
                    description: 'Bar description',
                    type: 'string',
                  },
                },
              },
            ],
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );
    expect(rendered.queryByText('oneOf')).toBeInTheDocument();
    expect(rendered.queryByText('Foo title')).toBeInTheDocument();
    expect(rendered.queryByText('Foo description')).toBeInTheDocument();
    expect(rendered.queryByText('Bar title')).toBeInTheDocument();
    expect(rendered.queryByText('Bar description')).toBeInTheDocument();
  });
});
