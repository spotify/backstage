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

import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { MockStorageApi, renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { TechDocsHome } from './TechDocsHome';

import {
  ApiProvider,
  ApiRegistry,
  ConfigReader,
} from '@backstage/core-app-api';
import {
  ConfigApi,
  configApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';

jest.mock('@backstage/plugin-catalog-react', () => {
  const actual = jest.requireActual('@backstage/plugin-catalog-react');
  return {
    ...actual,
    useOwnUser: () => 'test-user',
  };
});

const mockCatalogApi = {
  getEntityByName: () => Promise.resolve(),
  getEntities: async () => ({
    items: [
      {
        apiVersion: 'version',
        kind: 'User',
        metadata: {
          name: 'owned',
          namespace: 'default',
        },
      },
    ],
  }),
} as Partial<CatalogApi>;

describe('TechDocs Home', () => {
  const configApi: ConfigApi = new ConfigReader({
    organization: {
      name: 'My Company',
    },
  });

  const apiRegistry = ApiRegistry.from([
    [catalogApiRef, mockCatalogApi],
    [configApiRef, configApi],
    [storageApiRef, MockStorageApi.create()],
  ]);

  it('should render a TechDocs home page', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <TechDocsHome />
      </ApiProvider>,
    );

    // Header
    expect(await screen.findByText('Documentation')).toBeInTheDocument();
    expect(
      await screen.findByText(/Documentation available in My Company/i),
    ).toBeInTheDocument();
  });
});
