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
  CatalogApi,
  catalogApiRef,
  catalogRouteRef,
  EntityProvider,
} from '@backstage/plugin-catalog-react';

import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { EntityOrphanWarning } from './EntityOrphanWarning';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

describe('<EntityOrphanWarning />', () => {
  const catalogClient: jest.Mocked<CatalogApi> = {
    removeEntityByUid: jest.fn(),
  } as any;
  const apis = ApiRegistry.with(catalogApiRef, catalogClient);

  it('renders EntityOrphanWarning if the entity is orphan', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
        annotations: { 'backstage.io/orphan': 'true' },
      },

      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <EntityOrphanWarning />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': catalogRouteRef,
        },
      },
    );
    expect(
      getByText(
        'This entity is not referenced by any location and is therefore not receiving updates. Click here to delete.',
      ),
    ).toBeInTheDocument();
  });
});
