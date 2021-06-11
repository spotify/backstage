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

import { ApiProvider, ApiRegistry } from '@backstage/core';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { TechDocsCustomHome, PanelType } from './TechDocsCustomHome';

describe('TechDocsCustomHome', () => {
  const catalogApi: Partial<CatalogApi> = {
    getEntities: async () => ({ items: [] }),
  };

  const apiRegistry = ApiRegistry.with(catalogApiRef, catalogApi);

  it('should render a TechDocs home page', async () => {
    const tabsConfig = [
      {
        label: 'First Tab',
        panels: [
          {
            title: 'First Tab',
            description: 'First Tab Description',
            panelType: 'DocsCardGrid' as PanelType,
            filterPredicate: () => true,
          },
        ],
      },
      {
        label: 'Second Tab ',
        panels: [
          {
            title: 'Second Tab',
            description: 'Second Tab Description',
            panelType: 'DocsTable' as PanelType,
            filterPredicate: () => true,
          },
        ],
      },
    ];

    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <TechDocsCustomHome tabsConfig={tabsConfig} />
      </ApiProvider>,
    );

    // Header
    expect(await screen.findByText('Documentation')).toBeInTheDocument();
    expect(
      await screen.findByText(/Documentation available in Backstage/i),
    ).toBeInTheDocument();

    // Explore Content
    expect(await screen.findByTestId('docs-explore')).toBeDefined();

    // Tabs
    expect(await screen.findAllByText('First Tab')).toHaveLength(2);
    expect(await screen.findByText('Second Tab')).toBeInTheDocument();
    expect(
      await screen.findByText('First Tab Description'),
    ).toBeInTheDocument();
    (await screen.findByText('Second Tab')).click();
    expect(
      await screen.findByText('Second Tab Description'),
    ).toBeInTheDocument();
  });
});
