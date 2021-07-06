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

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { capitalize } from 'lodash';
import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { EntityTypePicker } from './EntityTypePicker';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { catalogApiRef } from '../../api';
import { EntityKindFilter, EntityTypeFilter } from '../../types';

import { AlertApi, alertApiRef } from '@backstage/core-plugin-api';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
    },
    spec: {
      type: 'service',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
    },
    spec: {
      type: 'website',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-3',
    },
    spec: {
      type: 'library',
    },
  },
];

const apis = ApiRegistry.from([
  [
    catalogApiRef,
    ({
      getEntities: jest
        .fn()
        .mockImplementation(() => Promise.resolve({ items: entities })),
    } as unknown) as CatalogApi,
  ],
  [
    alertApiRef,
    ({
      post: jest.fn(),
    } as unknown) as AlertApi,
  ],
]);

describe('<EntityTypePicker/>', () => {
  it('renders available entity types', async () => {
    const rendered = render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ filters: { kind: new EntityKindFilter('component') } }}
        >
          <EntityTypePicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(rendered.getByText('Type')).toBeInTheDocument();

    const input = rendered.getByTestId('select');
    fireEvent.click(input);

    await waitFor(() => rendered.getByText('Service'));

    entities.forEach(entity => {
      expect(
        rendered.getByText(capitalize(entity.spec!.type as string)),
      ).toBeInTheDocument();
    });
  });

  it('sets the selected type filter', async () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            filters: { kind: new EntityKindFilter('component') },
            updateFilters,
          }}
        >
          <EntityTypePicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    const input = rendered.getByTestId('select');
    fireEvent.click(input);

    await waitFor(() => rendered.getByText('Service'));
    fireEvent.click(rendered.getByText('Service'));

    expect(updateFilters).toHaveBeenLastCalledWith({
      type: new EntityTypeFilter('service'),
    });

    fireEvent.click(input);
    fireEvent.click(rendered.getByText('All'));

    expect(updateFilters).toHaveBeenLastCalledWith({ type: undefined });
  });
});
