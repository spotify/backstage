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
  catalogApiRef,
  CatalogApi,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { Entity, RELATION_PART_OF } from '@backstage/catalog-model';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { SystemDiagramCard } from './SystemDiagramCard';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

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
        name: 'system2',
        namespace: 'namespace2',
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
    expect(queryByText(/namespace2\/system2/)).toBeInTheDocument();
    expect(queryByText(/namespace\/entity/)).not.toBeInTheDocument();
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
                name: 'entity',
                namespace: 'namespace',
              },
              spec: {
                owner: 'not-tools@example.com',
                type: 'service',
                system: 'system',
              },
            },
          ] as Entity[],
        }),
    };

    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'System',
      metadata: {
        name: 'system',
        namespace: 'namespace',
      },
      relations: [
        {
          target: {
            kind: 'Domain',
            namespace: 'namespace',
            name: 'domain',
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
    expect(getByText('namespace/system')).toBeInTheDocument();
    expect(getByText('namespace/entity')).toBeInTheDocument();
  });

  it('should truncate long domains, systems or entities', async () => {
    const catalogApi: Partial<CatalogApi> = {
      getEntities: () =>
        Promise.resolve({
          items: [
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'alongentitythatshouldgettruncated',
                namespace: 'namespace',
              },
              spec: {
                owner: 'not-tools@example.com',
                type: 'service',
                system: 'system',
              },
            },
          ] as Entity[],
        }),
    };

    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'System',
      metadata: {
        name: 'alongsystemthatshouldgettruncated',
        namespace: 'namespace',
      },
      relations: [
        {
          target: {
            kind: 'Domain',
            namespace: 'namespace',
            name: 'alongdomainthatshouldgettruncated',
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

    expect(getByText('namespace/alongdomai...')).toBeInTheDocument();
    expect(getByText('namespace/alongsyste...')).toBeInTheDocument();
    expect(getByText('namespace/alongentit...')).toBeInTheDocument();
  });
});
