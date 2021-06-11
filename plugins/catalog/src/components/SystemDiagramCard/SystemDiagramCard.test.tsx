/*
 * Copyright 2020 Spotify AB
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
import {
  catalogApiRef,
  CatalogApi,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { Entity, RELATION_PART_OF } from '@backstage/catalog-model';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { SystemDiagramCard } from './SystemDiagramCard';

describe('<SystemDiagramCard />', () => {
  beforeAll(() => {
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      value: () => ({ width: 100, height: 100 }),
      configurable: true,
    });
  });

  afterEach(() => jest.resetAllMocks());

  it('shows empty list if no relations', async () => {
    const catalogApi: Partial<CatalogApi> = {
      getEntities: () =>
        Promise.resolve({
          items: [] as Entity[],
        }),
    };

    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'System',
      metadata: {
        name: 'my-system2',
        namespace: 'my-namespace2',
      },
      relations: [],
    };

    const { queryByText } = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.from([[catalogApiRef, catalogApi]])}>
        <EntityProvider entity={entity}>
          <SystemDiagramCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(queryByText(/System Diagram/)).toBeInTheDocument();
    expect(queryByText(/my-namespace2\/my-system2/)).toBeInTheDocument();
    expect(queryByText(/my-namespace\/my-entity/)).not.toBeInTheDocument();
  });

  it('shows related systems', async () => {
    const catalogApi: Partial<CatalogApi> = {
      getEntities: () =>
        Promise.resolve({
          items: [
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'my-entity',
                namespace: 'my-namespace',
              },
              spec: {
                owner: 'not-tools@example.com',
                type: 'service',
                system: 'my-system',
              },
            },
          ] as Entity[],
        }),
    };

    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'System',
      metadata: {
        name: 'my-system',
        namespace: 'my-namespace',
      },
      relations: [
        {
          target: {
            kind: 'Domain',
            namespace: 'my-namespace',
            name: 'my-domain',
          },
          type: RELATION_PART_OF,
        },
      ],
    };

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.from([[catalogApiRef, catalogApi]])}>
        <EntityProvider entity={entity}>
          <SystemDiagramCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByText('System Diagram')).toBeInTheDocument();
    expect(getByText('my-namespace/my-system')).toBeInTheDocument();
    expect(getByText('my-namespace/my-entity')).toBeInTheDocument();
  });
});
