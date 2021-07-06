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

import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { TextField } from '@material-ui/core';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AnalyzeResult, catalogImportApiRef } from '../../api';
import {
  generateEntities,
  StepPrepareCreatePullRequest,
} from './StepPrepareCreatePullRequest';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

describe('<StepPrepareCreatePullRequest />', () => {
  const catalogImportApi: jest.Mocked<typeof catalogImportApiRef.T> = {
    analyzeUrl: jest.fn(),
    submitPullRequest: jest.fn(),
  };

  const catalogApi: jest.Mocked<typeof catalogApiRef.T> = {
    getEntities: jest.fn(),
    addLocation: jest.fn(),
    getEntityByName: jest.fn(),
    getOriginLocationByEntity: jest.fn(),
    getLocationByEntity: jest.fn(),
    getLocationById: jest.fn(),
    removeLocationById: jest.fn(),
    removeEntityByUid: jest.fn(),
  };

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <ApiProvider
      apis={ApiRegistry.with(catalogImportApiRef, catalogImportApi).with(
        catalogApiRef,
        catalogApi,
      )}
    >
      {children}
    </ApiProvider>
  );

  const onPrepareFn = jest.fn();
  const analyzeResult = {
    type: 'repository',
    url: 'https://my-repository',
    integrationType: 'github',
    generatedEntities: [
      {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          namespace: 'default',
        },
        spec: {
          owner: 'my-owner',
        },
      },
    ],
  } as Extract<AnalyzeResult, { type: 'repository' }>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without exploding', async () => {
    catalogApi.getEntities.mockReturnValue(Promise.resolve({ items: [] }));

    await act(async () => {
      const { getByText } = render(
        <StepPrepareCreatePullRequest
          defaultTitle="My title"
          defaultBody="My **body**"
          analyzeResult={analyzeResult}
          onPrepare={onPrepareFn}
          renderFormFields={({ register }) => {
            return (
              <>
                <TextField name="title" inputRef={register()} />
                <TextField name="body" inputRef={register()} />
                <TextField name="componentName" inputRef={register()} />
                <TextField name="owner" inputRef={register()} />
              </>
            );
          }}
        />,
        {
          wrapper: Wrapper,
        },
      );

      const title = getByText('My title');
      const description = getByText('body', { selector: 'strong' });
      expect(title).toBeInTheDocument();
      expect(title).toBeVisible();
      expect(description).toBeInTheDocument();
      expect(description).toBeVisible();
    });
  });

  it('should submit created PR', async () => {
    catalogApi.getEntities.mockReturnValue(Promise.resolve({ items: [] }));
    catalogImportApi.submitPullRequest.mockReturnValue(
      Promise.resolve({
        location: 'https://my/location.yaml',
        link: 'https://my/pull',
      }),
    );

    await act(async () => {
      await render(
        <StepPrepareCreatePullRequest
          defaultTitle="My title"
          defaultBody="My **body**"
          analyzeResult={analyzeResult}
          onPrepare={onPrepareFn}
          renderFormFields={({ register }) => {
            return (
              <>
                <TextField name="title" inputRef={register()} />
                <TextField name="body" inputRef={register()} />
                <TextField
                  id="name"
                  label="name"
                  name="componentName"
                  inputRef={register()}
                />
                <TextField
                  id="owner"
                  label="owner"
                  name="owner"
                  inputRef={register()}
                />
              </>
            );
          }}
        />,
        {
          wrapper: Wrapper,
        },
      );

      await userEvent.type(await screen.getByLabelText('name'), '-changed');
      await userEvent.type(await screen.getByLabelText('owner'), '-changed');
      await userEvent.click(
        await screen.getByRole('button', { name: /Create PR/i }),
      );
    });

    expect(catalogImportApi.submitPullRequest).toBeCalledTimes(1);
    expect(catalogImportApi.submitPullRequest.mock.calls[0]).toMatchObject([
      {
        body: 'My **body**',
        fileContent: `apiVersion: "1"
kind: Component
metadata:
  name: my-component-changed
  namespace: default
spec:
  owner: my-owner-changed
`,
        repositoryUrl: 'https://my-repository',
        title: 'My title',
      },
    ]);
    expect(onPrepareFn).toBeCalledTimes(1);
    expect(onPrepareFn.mock.calls[0]).toMatchObject([
      {
        type: 'repository',
        url: 'https://my-repository',
        integrationType: 'github',
        pullRequest: {
          url: 'https://my/pull',
        },
        locations: [
          {
            entities: [
              {
                kind: 'Component',
                name: 'my-component-changed',
                namespace: 'default',
              },
            ],
            target: 'https://my/location.yaml',
          },
        ],
      },
      {
        notRepeatable: true,
      },
    ]);
  });

  it('should show error message', async () => {
    catalogApi.getEntities.mockResolvedValueOnce({ items: [] });
    catalogImportApi.submitPullRequest.mockRejectedValueOnce(
      new Error('some error'),
    );

    await act(async () => {
      await render(
        <StepPrepareCreatePullRequest
          defaultTitle="My title"
          defaultBody="My **body**"
          analyzeResult={analyzeResult}
          onPrepare={onPrepareFn}
          renderFormFields={({ register }) => {
            return (
              <>
                <TextField name="title" inputRef={register()} />
                <TextField name="body" inputRef={register()} />
                <TextField name="componentName" inputRef={register()} />
                <TextField name="owner" inputRef={register()} />
              </>
            );
          }}
        />,
        {
          wrapper: Wrapper,
        },
      );

      await userEvent.click(
        await screen.getByRole('button', { name: /Create PR/i }),
      );
    });

    expect(screen.getByText('some error')).toBeInTheDocument();
    expect(catalogImportApi.submitPullRequest).toBeCalledTimes(1);
    expect(onPrepareFn).toBeCalledTimes(0);
  });

  it('should load groups', async () => {
    const renderFormFieldsFn = jest.fn();
    catalogApi.getEntities.mockReturnValue(
      Promise.resolve({
        items: [
          {
            apiVersion: '1',
            kind: 'Group',
            metadata: {
              name: 'my-group',
            },
          },
        ],
      }),
    );

    await act(async () => {
      await render(
        <StepPrepareCreatePullRequest
          defaultTitle="My title"
          defaultBody="My **body**"
          analyzeResult={analyzeResult}
          onPrepare={onPrepareFn}
          renderFormFields={renderFormFieldsFn}
        />,
        {
          wrapper: Wrapper,
        },
      );
    });

    expect(catalogApi.getEntities).toBeCalledTimes(1);
    expect(renderFormFieldsFn).toBeCalled();
    expect(renderFormFieldsFn.mock.calls[0][0]).toMatchObject({
      groups: [],
      groupsLoading: true,
    });
    expect(
      renderFormFieldsFn.mock.calls[
        renderFormFieldsFn.mock.calls.length - 1
      ][0],
    ).toMatchObject({ groups: ['my-group'], groupsLoading: false });
  });

  describe('generateEntities', () => {
    it.each([[undefined], [null]])(
      'should not include blank namespace for %s',
      namespace => {
        expect(
          generateEntities(
            [{ metadata: { namespace: namespace as any } }],
            'my-component',
            'group-1',
          ),
        ).toEqual([
          expect.objectContaining({
            metadata: expect.not.objectContaining({
              namespace: 'default',
            }),
          }),
        ]);
      },
    );

    it.each([['default'], ['my-namespace']])(
      'should include explicit namespace %s',
      namespace => {
        expect(
          generateEntities(
            [{ metadata: { namespace } }],
            'my-component',
            'group-1',
          ),
        ).toEqual([
          expect.objectContaining({
            metadata: expect.objectContaining({
              namespace,
            }),
          }),
        ]);
      },
    );
  });
});
