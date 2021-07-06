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

import { ConfigReader } from '@backstage/config';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { wrapInTestApp } from '@backstage/test-utils';
import { act, render } from '@testing-library/react';
import React from 'react';
import { TechDocsStorageApi, techdocsStorageApiRef } from '../../api';
import { Reader } from './Reader';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: jest.fn(),
  };
});

const { useParams }: { useParams: jest.Mock } = jest.requireMock(
  'react-router-dom',
);

describe('<Reader />', () => {
  it('should render Reader content', async () => {
    useParams.mockReturnValue({
      entityId: 'Component::backstage',
    });

    const scmIntegrationsApi: ScmIntegrationsApi = ScmIntegrationsApi.fromConfig(
      new ConfigReader({
        integrations: {},
      }),
    );
    const techdocsStorageApi: Partial<TechDocsStorageApi> = {};

    const apiRegistry = ApiRegistry.from([
      [scmIntegrationsApiRef, scmIntegrationsApi],
      [techdocsStorageApiRef, techdocsStorageApi],
    ]);

    await act(async () => {
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apiRegistry}>
            <Reader
              entityId={{
                kind: 'Component',
                namespace: 'default',
                name: 'example',
              }}
            />
          </ApiProvider>,
        ),
      );
      expect(
        rendered.getByTestId('techdocs-content-shadowroot'),
      ).toBeInTheDocument();
    });
  });
});
