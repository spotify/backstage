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

import { Entity } from '@backstage/catalog-model';
import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { EntityTable } from './EntityTable';

describe('<EntityTable />', () => {
  it('shows empty table', async () => {
    const { getByText } = await renderInTestApp(
      <EntityTable
        title="Entities"
        entities={[]}
        emptyContent={<div>EMPTY</div>}
        columns={[]}
      />,
    );

    expect(getByText('Entities')).toBeInTheDocument();
    expect(getByText('EMPTY')).toBeInTheDocument();
  });

  it('shows entities', async () => {
    const entities: Entity[] = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'System',
        metadata: {
          name: 'my-entity',
        },
        spec: {},
      },
    ];

    const { getByText } = await renderInTestApp(
      <EntityTable
        title="Entities"
        entities={entities}
        emptyContent={<div>EMPTY</div>}
        columns={[
          {
            title: 'Name',
            field: 'metadata.name',
          },
        ]}
      />,
    );

    await waitFor(() => {
      expect(getByText('my-entity')).toBeInTheDocument();
    });
  });
});
