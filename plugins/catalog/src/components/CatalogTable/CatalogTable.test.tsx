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

import {
  Entity,
  VIEW_URL_ANNOTATION,
  EDIT_URL_ANNOTATION,
} from '@backstage/catalog-model';
import { act, fireEvent } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import * as React from 'react';
import { CatalogTable } from './CatalogTable';
import {
  MockEntityListContextProvider,
  UserListFilter,
} from '@backstage/plugin-catalog-react';

const entities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'component1' },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'component2' },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'component3' },
  },
];

describe('CatalogTable component', () => {
  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render error message', async () => {
    const rendered = await renderInTestApp(
      <MockEntityListContextProvider value={{ error: new Error('error') }}>
        <CatalogTable />
      </MockEntityListContextProvider>,
    );
    const errorMessage = await rendered.findByText(
      /Could not fetch catalog entities./,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display entity names when loading has finished and no error occurred', async () => {
    const rendered = await renderInTestApp(
      <MockEntityListContextProvider
        value={{
          entities,
          filters: {
            user: new UserListFilter('owned', undefined, () => false),
          },
        }}
      >
        <CatalogTable />
      </MockEntityListContextProvider>,
    );
    expect(rendered.getByText(/Owned \(3\)/)).toBeInTheDocument();
    expect(rendered.getByText(/component1/)).toBeInTheDocument();
    expect(rendered.getByText(/component2/)).toBeInTheDocument();
    expect(rendered.getByText(/component3/)).toBeInTheDocument();
  });

  it('should use specified edit URL if in annotation', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'component1',
        annotations: { [EDIT_URL_ANNOTATION]: 'https://other.place' },
      },
    };

    const { getByTitle } = await renderInTestApp(
      <MockEntityListContextProvider value={{ entities: [entity] }}>
        <CatalogTable />
      </MockEntityListContextProvider>,
    );

    const editButton = getByTitle('Edit');

    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(window.open).toHaveBeenCalledWith('https://other.place', '_blank');
  });

  it('should use specified view URL if in annotation', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'component1',
        annotations: { [VIEW_URL_ANNOTATION]: 'https://other.place' },
      },
    };

    const { getByTitle } = await renderInTestApp(
      <MockEntityListContextProvider value={{ entities: [entity] }}>
        <CatalogTable />
      </MockEntityListContextProvider>,
    );

    const viewButton = getByTitle('View');

    await act(async () => {
      fireEvent.click(viewButton);
    });

    expect(window.open).toHaveBeenCalledWith('https://other.place', '_blank');
  });
});
