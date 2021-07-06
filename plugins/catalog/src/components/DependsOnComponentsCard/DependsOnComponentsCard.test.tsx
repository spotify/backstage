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

import { Entity, RELATION_DEPENDS_ON } from '@backstage/catalog-model';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { DependsOnComponentsCard } from './DependsOnComponentsCard';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

describe('<DependsOnComponentsCard />', () => {
  const catalogApi: jest.Mocked<CatalogApi> = {
    getLocationById: jest.fn(),
    getEntityByName: jest.fn(),
    getEntities: jest.fn(),
    addLocation: jest.fn(),
    getLocationByEntity: jest.fn(),
    removeEntityByUid: jest.fn(),
  } as any;
  let Wrapper: React.ComponentType;

  beforeEach(() => {
    const apis = ApiRegistry.with(catalogApiRef, catalogApi);

    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <ApiProvider apis={apis}>{children}</ApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('shows empty list if no dependencies', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-component',
        namespace: 'my-namespace',
      },
      relations: [],
    };

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <DependsOnComponentsCard />
        </EntityProvider>
      </Wrapper>,
    );

    expect(getByText('Depends on components')).toBeInTheDocument();
    expect(
      getByText(/No component is a dependency of this component/i),
    ).toBeInTheDocument();
  });

  it('shows dependency components', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-component',
        namespace: 'my-namespace',
      },
      relations: [
        {
          target: {
            kind: 'Component',
            namespace: 'my-namespace',
            name: 'target-name',
          },
          type: RELATION_DEPENDS_ON,
        },
      ],
    };
    catalogApi.getEntities.mockResolvedValue({
      items: [
        {
          apiVersion: 'v1',
          kind: 'Component',
          metadata: {
            namespace: 'my-namespace',
            name: 'target-name',
          },
          spec: {},
        },
      ],
    });

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <DependsOnComponentsCard />
        </EntityProvider>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getByText('Depends on components')).toBeInTheDocument();
      expect(getByText(/target-name/i)).toBeInTheDocument();
    });
  });
});
