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

import { Entity } from '@backstage/catalog-model';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityOwnerFilter } from '../../types';
import { EntityOwnerPicker } from './EntityOwnerPicker';

const sampleEntities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
    },
    relations: [
      {
        type: 'ownedBy',
        target: {
          name: 'some-owner',
          namespace: 'default',
          kind: 'Group',
        },
      },
      {
        type: 'ownedBy',
        target: {
          name: 'some-owner-2',
          namespace: 'default',
          kind: 'Group',
        },
      },
    ],
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
    },
    relations: [
      {
        type: 'ownedBy',
        target: {
          name: 'another-owner',
          namespace: 'default',
          kind: 'Group',
        },
      },
    ],
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-3',
    },
    relations: [
      {
        type: 'ownedBy',
        target: {
          name: 'some-owner',
          namespace: 'default',
          kind: 'Group',
        },
      },
    ],
  },
];

describe('<EntityOwnerPicker/>', () => {
  it('renders all owners', () => {
    const rendered = render(
      <MockEntityListContextProvider
        value={{ entities: sampleEntities, backendEntities: sampleEntities }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(rendered.getByText('Owner')).toBeInTheDocument();

    fireEvent.click(rendered.getByTestId('owner-picker-expand'));
    sampleEntities
      .flatMap(e => e.relations?.map(r => r.target.name))
      .forEach(owner => {
        expect(rendered.getByText(owner as string)).toBeInTheDocument();
      });
  });

  it('renders unique owners in alphabetical order', () => {
    const rendered = render(
      <MockEntityListContextProvider
        value={{ entities: sampleEntities, backendEntities: sampleEntities }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(rendered.getByText('Owner')).toBeInTheDocument();

    fireEvent.click(rendered.getByTestId('owner-picker-expand'));

    expect(rendered.getAllByRole('option').map(o => o.textContent)).toEqual([
      'another-owner',
      'some-owner',
      'some-owner-2',
    ]);
  });

  it('adds owners to filters', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
        }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).not.toHaveBeenCalled();

    fireEvent.click(rendered.getByTestId('owner-picker-expand'));
    fireEvent.click(rendered.getByText('some-owner'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['some-owner']),
    });
  });

  it('removes owners from filters', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
          filters: { owners: new EntityOwnerFilter(['some-owner']) },
        }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).not.toHaveBeenCalled();
    fireEvent.click(rendered.getByTestId('owner-picker-expand'));
    expect(rendered.getByLabelText('some-owner')).toBeChecked();

    fireEvent.click(rendered.getByLabelText('some-owner'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      owner: undefined,
    });
  });
});
