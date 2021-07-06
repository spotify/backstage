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
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { GroupsExplorerContent } from '../GroupsExplorerContent';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

describe('<GroupsExplorerContent />', () => {
  const catalogApi: jest.Mocked<typeof catalogApiRef.T> = {
    addLocation: jest.fn(_a => new Promise(() => {})),
    getEntities: jest.fn(),
    getOriginLocationByEntity: jest.fn(),
    getLocationByEntity: jest.fn(),
    getLocationById: jest.fn(),
    removeLocationById: jest.fn(),
    removeEntityByUid: jest.fn(),
    getEntityByName: jest.fn(),
  };

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <ApiProvider apis={ApiRegistry.with(catalogApiRef, catalogApi)}>
      {children}
    </ApiProvider>
  );

  const mountedRoutes = {
    mountedRoutes: {
      '/catalog/:namespace/:kind/:name': entityRouteRef,
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();

    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      value: () => ({ width: 100, height: 100 }),
      configurable: true,
    });
  });

  it('renders a groups diagram', async () => {
    const entities: Entity[] = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'group-a',
          namespace: 'my-namespace',
        },
        spec: {
          type: 'organization',
        },
      },
    ];
    catalogApi.getEntities.mockResolvedValue({ items: entities });

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <GroupsExplorerContent />
      </Wrapper>,
      mountedRoutes,
    );

    await waitFor(() => {
      expect(getByText('my-namespace/group-a')).toBeInTheDocument();
    });
  });

  it('renders a custom title', async () => {
    catalogApi.getEntities.mockResolvedValue({ items: [] });

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <GroupsExplorerContent title="Our Teams" />
      </Wrapper>,
      mountedRoutes,
    );

    await waitFor(() => expect(getByText('Our Teams')).toBeInTheDocument());
  });

  it('renders a friendly error if it cannot collect domains', async () => {
    const catalogError = new Error('Network timeout');
    catalogApi.getEntities.mockRejectedValueOnce(catalogError);

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <GroupsExplorerContent />
      </Wrapper>,
      mountedRoutes,
    );

    await waitFor(() =>
      expect(getByText(/Warning: Network timeout/)).toBeInTheDocument(),
    );
  });
});
