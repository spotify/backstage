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
import { EntityTagFilter } from '../../types';
import { EntityTagPicker } from './EntityTagPicker';

const taggedEntities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
      tags: ['tag4', 'tag1', 'tag2'],
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
      tags: ['tag3', 'tag4'],
    },
  },
];

describe('<EntityTagPicker/>', () => {
  it('renders all tags', () => {
    const rendered = render(
      <MockEntityListContextProvider
        value={{ entities: taggedEntities, backendEntities: taggedEntities }}
      >
        <EntityTagPicker />
      </MockEntityListContextProvider>,
    );
    expect(rendered.getByText('Tags')).toBeInTheDocument();

    fireEvent.click(rendered.getByTestId('tag-picker-expand'));
    taggedEntities
      .flatMap(e => e.metadata.tags!)
      .forEach(tag => {
        expect(rendered.getByText(tag)).toBeInTheDocument();
      });
  });

  it('renders unique tags in alphabetical order', () => {
    const rendered = render(
      <MockEntityListContextProvider
        value={{ entities: taggedEntities, backendEntities: taggedEntities }}
      >
        <EntityTagPicker />
      </MockEntityListContextProvider>,
    );
    expect(rendered.getByText('Tags')).toBeInTheDocument();

    fireEvent.click(rendered.getByTestId('tag-picker-expand'));

    expect(rendered.getAllByRole('option').map(o => o.textContent)).toEqual([
      'tag1',
      'tag2',
      'tag3',
      'tag4',
    ]);
  });

  it('adds tags to filters', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockEntityListContextProvider
        value={{
          entities: taggedEntities,
          backendEntities: taggedEntities,
          updateFilters,
        }}
      >
        <EntityTagPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).not.toHaveBeenCalled();

    fireEvent.click(rendered.getByTestId('tag-picker-expand'));
    fireEvent.click(rendered.getByText('tag1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      tags: new EntityTagFilter(['tag1']),
    });
  });

  it('removes tags from filters', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockEntityListContextProvider
        value={{
          entities: taggedEntities,
          backendEntities: taggedEntities,
          updateFilters,
          filters: { tags: new EntityTagFilter(['tag1']) },
        }}
      >
        <EntityTagPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).not.toHaveBeenCalled();
    fireEvent.click(rendered.getByTestId('tag-picker-expand'));
    expect(rendered.getByLabelText('tag1')).toBeChecked();

    fireEvent.click(rendered.getByLabelText('tag1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      tags: undefined,
    });
  });
});
