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
  ComponentEntity,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
  SystemEntity,
} from '@backstage/catalog-model';
import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { EntityTable } from './EntityTable';
import { componentEntityColumns, systemEntityColumns } from './presets';

describe('systemEntityColumns', () => {
  it('shows systems', async () => {
    const entities: SystemEntity[] = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'System',
        metadata: {
          name: 'my-system',
          namespace: 'my-namespace',
          description: 'Some description',
        },
        spec: {
          owner: 'owner-data',
        },
        relations: [
          {
            type: RELATION_PART_OF,
            target: {
              kind: 'Domain',
              name: 'my-domain',
              namespace: 'my-namespace',
            },
          },
          {
            type: RELATION_OWNED_BY,
            target: {
              kind: 'Group',
              name: 'Test',
              namespace: 'default',
            },
          },
        ],
      },
    ];

    const { getByText } = await renderInTestApp(
      <EntityTable
        title="My Systems"
        entities={entities}
        emptyContent={<div>EMPTY</div>}
        columns={systemEntityColumns}
      />,
    );

    await waitFor(() => {
      expect(getByText('my-namespace/my-system')).toBeInTheDocument();
      expect(getByText('my-namespace/my-domain')).toBeInTheDocument();
      expect(getByText('Test')).toBeInTheDocument();
      expect(getByText(/Some/)).toBeInTheDocument();
    });
  });
});

describe('componentEntityColumns', () => {
  it('shows components', async () => {
    const entities: ComponentEntity[] = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          namespace: 'my-namespace',
          description: 'Some description',
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'owner-data',
        },
        relations: [
          {
            type: RELATION_PART_OF,
            target: {
              kind: 'System',
              name: 'my-system',
              namespace: 'my-namespace',
            },
          },
          {
            type: RELATION_OWNED_BY,
            target: {
              kind: 'Group',
              name: 'Test',
              namespace: 'default',
            },
          },
        ],
      },
    ];

    const { getByText } = await renderInTestApp(
      <EntityTable
        title="My Components"
        entities={entities}
        emptyContent={<div>EMPTY</div>}
        columns={componentEntityColumns}
      />,
    );

    await waitFor(() => {
      expect(getByText('my-namespace/my-component')).toBeInTheDocument();
      expect(getByText('my-namespace/my-system')).toBeInTheDocument();
      expect(getByText('Test')).toBeInTheDocument();
      expect(getByText('production')).toBeInTheDocument();
      expect(getByText('service')).toBeInTheDocument();
      expect(getByText(/Some/)).toBeInTheDocument();
    });
  });
});
