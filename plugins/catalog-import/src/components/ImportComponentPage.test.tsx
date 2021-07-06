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

import { CatalogClient } from '@backstage/catalog-client';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { wrapInTestApp } from '@backstage/test-utils';
import { act, render } from '@testing-library/react';
import React from 'react';
import { catalogImportApiRef, CatalogImportClient } from '../api';
import { ImportComponentPage } from './ImportComponentPage';

import {
  ApiProvider,
  ApiRegistry,
  ConfigReader,
} from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';

describe('<ImportComponentPage />', () => {
  const identityApi = {
    getUserId: () => {
      return 'user';
    },
    getProfile: () => {
      return {};
    },
    getIdToken: () => {
      return Promise.resolve('token');
    },
    signOut: () => {
      return Promise.resolve();
    },
  };

  let apis: ApiRegistry;

  beforeEach(() => {
    apis = ApiRegistry.with(
      configApiRef,
      new ConfigReader({ integrations: {} }),
    )
      .with(catalogApiRef, new CatalogClient({ discoveryApi: {} as any }))
      .with(
        catalogImportApiRef,
        new CatalogImportClient({
          discoveryApi: {} as any,
          githubAuthApi: {
            getAccessToken: async () => 'token',
          },
          identityApi,
          scmIntegrationsApi: {} as any,
          catalogApi: {} as any,
        }),
      );
  });

  it('renders without exploding', async () => {
    await act(async () => {
      const { getByText } = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <ImportComponentPage />
          </ApiProvider>,
        ),
      );

      expect(
        await getByText('Start tracking your component in Backstage'),
      ).toBeInTheDocument();
    });
  });
});
