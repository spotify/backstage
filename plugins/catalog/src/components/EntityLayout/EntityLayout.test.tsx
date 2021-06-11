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
import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {
  AlertApi,
  alertApiRef,
  ApiProvider,
  ApiRegistry,
} from '@backstage/core';
import { catalogApiRef, EntityContext } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Route, Routes } from 'react-router';
import { EntityLayout } from './EntityLayout';

const mockEntityData = {
  loading: false,
  error: undefined,
  entity: {
    kind: 'MyKind',
    metadata: {
      name: 'my-entity',
    },
  } as Entity,
};

const mockApis = ApiRegistry.with(catalogApiRef, {} as CatalogApi).with(
  alertApiRef,
  {} as AlertApi,
);

describe('EntityLayout', () => {
  it('renders simplest case', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <EntityContext.Provider value={mockEntityData}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityContext.Provider>
      </ApiProvider>,
    );

    expect(rendered.getByText('my-entity')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content')).toBeInTheDocument();
  });

  it('navigates when user clicks different tab', async () => {
    const rendered = await renderInTestApp(
      <Routes>
        <Route
          path="/*"
          element={
            <ApiProvider apis={mockApis}>
              <EntityContext.Provider value={mockEntityData}>
                <EntityLayout>
                  <EntityLayout.Route path="/" title="tabbed-test-title">
                    <div>tabbed-test-content</div>
                  </EntityLayout.Route>
                  <EntityLayout.Route
                    path="/some-other-path"
                    title="tabbed-test-title-2"
                  >
                    <div>tabbed-test-content-2</div>
                  </EntityLayout.Route>
                </EntityLayout>
              </EntityContext.Provider>
            </ApiProvider>
          }
        />
      </Routes>,
    );

    const secondTab = rendered.queryAllByRole('tab')[1];
    act(() => {
      fireEvent.click(secondTab);
    });

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content')).not.toBeInTheDocument();

    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content-2')).toBeInTheDocument();
  });

  it('should conditionally render tabs', async () => {
    const shouldRenderTab = (e: Entity) => e.metadata.name === 'my-entity';
    const shouldNotRenderTab = (e: Entity) => e.metadata.name === 'some-entity';

    const rendered = await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <EntityContext.Provider value={mockEntityData}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
            <EntityLayout.Route
              path="/some-other-path"
              title="tabbed-test-title-2"
              if={shouldNotRenderTab}
            >
              <div>tabbed-test-content-2</div>
            </EntityLayout.Route>
            <EntityLayout.Route
              path="/some-other-other-path"
              title="tabbed-test-title-3"
              if={shouldRenderTab}
            >
              <div>tabbed-test-content-3</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityContext.Provider>
      </ApiProvider>,
    );

    expect(rendered.queryByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-title-2')).not.toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-title-3')).toBeInTheDocument();
  });
});
