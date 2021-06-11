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

import {
  ApiProvider,
  ApiRegistry,
  ConfigApi,
  configApiRef,
  ConfigReader,
} from '@backstage/core';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { TechDocsHome } from './TechDocsHome';

jest.mock('../hooks', () => ({
  useOwnUser: () => {
    return {
      value: {
        apiVersion: 'version',
        kind: 'User',
        metadata: {
          name: 'owned',
          namespace: 'default',
        },
        relations: [
          {
            target: {
              kind: 'TestKind',
              name: 'testName',
            },
            type: 'ownerOf',
          },
        ],
      },
    };
  },
}));

describe('TechDocs Home', () => {
  const catalogApi: Partial<CatalogApi> = {
    getEntities: async () => ({ items: [] }),
  };

  const configApi: ConfigApi = new ConfigReader({
    organization: {
      name: 'My Company',
    },
  });

  const apiRegistry = ApiRegistry.with(catalogApiRef, catalogApi).with(
    configApiRef,
    configApi,
  );

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

    // Explore Content
    expect(await screen.findByTestId('docs-explore')).toBeDefined();
  });
});
