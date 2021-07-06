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

import { render, RenderResult } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { MemoryRouter, Route, Routes, useOutlet } from 'react-router-dom';
import { ApiProvider, ApiRegistry, LocalStorageFeatureFlags } from '../apis';
import { featureFlagsApiRef } from '@backstage/core-plugin-api';
import { AppContext } from '../app';
import { AppContextProvider } from '../app/AppContext';
import { FlatRoutes } from './FlatRoutes';

const mockFeatureFlagsApi = new LocalStorageFeatureFlags();
const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <ApiProvider apis={ApiRegistry.with(featureFlagsApiRef, mockFeatureFlagsApi)}>
    {children}
  </ApiProvider>
);

function makeRouteRenderer(node: ReactNode) {
  let rendered: RenderResult | undefined = undefined;
  return (path: string) => {
    const content = (
      <Wrapper>
        <AppContextProvider
          appContext={
            ({
              getComponents: () => ({
                NotFoundErrorPage: () => <>Not Found</>,
              }),
            } as unknown) as AppContext
          }
        >
          <MemoryRouter initialEntries={[path]} children={node} />
        </AppContextProvider>
      </Wrapper>
    );
    if (rendered) {
      rendered.unmount();
      rendered.rerender(content);
    } else {
      rendered = render(content);
    }
    return rendered;
  };
}

describe('FlatRoutes', () => {
  it('renders some routes', () => {
    const renderRoute = makeRouteRenderer(
      <FlatRoutes>
        <Route path="/a" element={<>a</>} />
        <Route path="/b" element={<>b</>} />
      </FlatRoutes>,
    );
    expect(renderRoute('/a').getByText('a')).toBeInTheDocument();
    expect(renderRoute('/b').getByText('b')).toBeInTheDocument();
    expect(renderRoute('/c').getByText('Not Found')).toBeInTheDocument();
    expect(renderRoute('/b').queryByText('Not Found')).not.toBeInTheDocument();
    expect(renderRoute('/a').getByText('a')).toBeInTheDocument();
  });

  it('is not sensitive to ordering and overlapping routes', () => {
    // The '/*' suffixes here are intentional and will be ignored by FlatRoutes
    const routes = (
      <>
        <Route path="/a-1/*" element={<>a-1</>} />
        <Route path="/a/*" element={<>a</>} />
        <Route path="/a-2/*" element={<>a-2</>} />
      </>
    );
    const renderRoute = makeRouteRenderer(<FlatRoutes>{routes}</FlatRoutes>);
    expect(renderRoute('/a').getByText('a')).toBeInTheDocument();
    expect(renderRoute('/a-1').getByText('a-1')).toBeInTheDocument();
    expect(renderRoute('/a-2').getByText('a-2')).toBeInTheDocument();
    renderRoute('').unmount();

    // This uses regular Routes from react-router, not that a-2 renders a, which is the behavior we're working around
    const renderBadRoute = makeRouteRenderer(<Routes>{routes}</Routes>);
    expect(renderBadRoute('/a').getByText('a')).toBeInTheDocument();
    expect(renderBadRoute('/a-1').getByText('a-1')).toBeInTheDocument();
    expect(renderBadRoute('/a-2').getByText('a')).toBeInTheDocument();
  });

  it('renders children straight as outlets', () => {
    const MyPage = () => {
      return <>Outlet: {useOutlet()}</>;
    };

    // The '/*' suffixes here are intentional and will be ignored by FlatRoutes
    const routes = (
      <>
        <Route path="/a" element={<MyPage />}>
          a
        </Route>
        <Route path="/a/b" element={<MyPage />}>
          a-b
        </Route>
        <Route path="/b" element={<MyPage />}>
          b
        </Route>
      </>
    );
    const renderRoute = makeRouteRenderer(<FlatRoutes>{routes}</FlatRoutes>);
    expect(renderRoute('/a').getByText('Outlet: a')).toBeInTheDocument();
    expect(renderRoute('/a/b').getByText('Outlet: a-b')).toBeInTheDocument();
    expect(renderRoute('/b').getByText('Outlet: b')).toBeInTheDocument();
  });
});
