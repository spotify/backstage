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

import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { MockStorageApi, wrapInTestApp } from '@backstage/test-utils';
import { render } from '@testing-library/react';
import React from 'react';
import { EntityFilterGroupsProvider } from '../../filter';
import { ResultsFilter } from './ResultsFilter';

import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import {
  IdentityApi,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';

describe('Results Filter', () => {
  const catalogApi: Partial<CatalogApi> = {
    getEntities: () =>
      Promise.resolve({
        items: [
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'Entity1',
              tags: ['java'],
            },
            spec: {
              owner: 'tools@example.com',
              type: 'service',
            },
          },
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'Entity2',
            },
            spec: {
              owner: 'not-tools@example.com',
              type: 'service',
            },
          },
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'Entity3',
              tags: ['java', 'test'],
            },
            spec: {
              owner: 'tools@example.com',
              type: 'service',
            },
          },
        ] as Entity[],
      }),
  };

  const identityApi: Partial<IdentityApi> = {
    getUserId: () => 'tools@example.com',
  };

  const renderWrapped = (children: React.ReactNode) =>
    render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([
            [catalogApiRef, catalogApi],
            [identityApiRef, identityApi],
            [storageApiRef, MockStorageApi.create()],
          ])}
        >
          <EntityFilterGroupsProvider>{children}</EntityFilterGroupsProvider>,
        </ApiProvider>,
      ),
    );

  it('should render all available categories', async () => {
    const categories = ['test', 'java'];
    const { findByText } = renderWrapped(
      <ResultsFilter availableCategories={categories} />,
    );
    for (const category of categories) {
      expect(
        await findByText(
          category.charAt(0).toLocaleUpperCase('en-US') + category.slice(1),
        ),
      ).toBeInTheDocument();
    }
  });
});
