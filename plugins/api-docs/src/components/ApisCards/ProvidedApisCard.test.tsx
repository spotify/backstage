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

import { Entity, RELATION_PROVIDES_API } from '@backstage/catalog-model';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { ApiDocsConfig, apiDocsConfigRef } from '../../config';
import { ProvidedApisCard } from './ProvidedApisCard';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

describe('<ProvidedApisCard />', () => {
  const apiDocsConfig: jest.Mocked<ApiDocsConfig> = {
    getApiDefinitionWidget: jest.fn(),
  } as any;
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
    const apis = ApiRegistry.with(catalogApiRef, catalogApi).with(
      apiDocsConfigRef,
      apiDocsConfig,
    );

    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <ApiProvider apis={apis}>{children}</ApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('shows empty list if no relations', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name',
        namespace: 'my-namespace',
      },
      relations: [],
    };

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <ProvidedApisCard />
        </EntityProvider>
      </Wrapper>,
    );

    expect(getByText(/Provided APIs/i)).toBeInTheDocument();
    expect(getByText(/does not provide any APIs/i)).toBeInTheDocument();
  });

  it('shows consumed APIs', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name',
        namespace: 'my-namespace',
      },
      relations: [
        {
          target: {
            kind: 'API',
            namespace: 'my-namespace',
            name: 'target-name',
          },
          type: RELATION_PROVIDES_API,
        },
      ],
    };
    catalogApi.getEntities.mockResolvedValue({
      items: [
        {
          apiVersion: 'v1',
          kind: 'API',
          metadata: {
            name: 'target-name',
            namespace: 'my-namespace',
          },
          spec: {},
        },
      ],
    });

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <ProvidedApisCard />
        </EntityProvider>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getByText(/Provided APIs/i)).toBeInTheDocument();
      expect(getByText(/target-name/i)).toBeInTheDocument();
    });
  });
});
