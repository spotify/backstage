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

import { LocalStorageFeatureFlags } from '../apis';
import { renderWithEffects, withLogCollector } from '@backstage/test-utils';
import { lightTheme } from '@backstage/theme';
import { render, screen } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { defaultAppIcons } from './icons';
import {
  configApiRef,
  createApiFactory,
  featureFlagsApiRef,
  createPlugin,
  useRouteRef,
  createExternalRouteRef,
  createRouteRef,
  createSubRouteRef,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { generateBoundRoutes, PrivateAppImpl } from './App';

describe('generateBoundRoutes', () => {
  it('runs happy path', () => {
    const external = { myRoute: createExternalRouteRef({ id: '1' }) };
    const ref = createRouteRef({ id: 'ref-1' });
    const result = generateBoundRoutes(({ bind }) => {
      bind(external, { myRoute: ref });
    });

    expect(result.get(external.myRoute)).toBe(ref);
  });

  it('throws on unknown keys', () => {
    const external = { myRoute: createExternalRouteRef({ id: '2' }) };
    const ref = createRouteRef({ id: 'ref-2' });
    expect(() =>
      generateBoundRoutes(({ bind }) => {
        bind(external, { someOtherRoute: ref } as any);
      }),
    ).toThrow('Key someOtherRoute is not an existing external route');
  });
});

describe('Integration Test', () => {
  const plugin1RouteRef = createRouteRef({ id: 'ref-1' });
  const plugin2RouteRef = createRouteRef({ id: 'ref-2', params: ['x'] });
  const subRouteRef1 = createSubRouteRef({
    id: 'sub1',
    path: '/sub1',
    parent: plugin1RouteRef,
  });
  const subRouteRef2 = createSubRouteRef({
    id: 'sub2',
    path: '/sub2/:x',
    parent: plugin1RouteRef,
  });
  const subRouteRef3 = createSubRouteRef({
    id: 'sub3',
    path: '/sub3',
    parent: plugin2RouteRef,
  });
  const subRouteRef4 = createSubRouteRef({
    id: 'sub4',
    path: '/sub4/:y',
    parent: plugin2RouteRef,
  });
  const extRouteRef1 = createExternalRouteRef({ id: 'extRouteRef1' });
  const extRouteRef2 = createExternalRouteRef({
    id: 'extRouteRef2',
    params: ['x'],
  });
  const extRouteRef3 = createExternalRouteRef({
    id: 'extRouteRef3',
    optional: true,
  });
  const extRouteRef4 = createExternalRouteRef({
    id: 'extRouteRef4',
    optional: true,
    params: ['x'],
  });

  const plugin1 = createPlugin({
    id: 'blob',
    // Both absolute and sub route refs should be assignable to the plugin routes
    routes: {
      ref1: plugin1RouteRef,
      ref2: plugin2RouteRef,
      ref3: subRouteRef1,
    },
    externalRoutes: {
      extRouteRef1,
      extRouteRef2,
      extRouteRef3,
      extRouteRef4,
    },
  });

  const plugin2 = createPlugin({
    id: 'plugin2',
  });

  const HiddenComponent = plugin2.provide(
    createRoutableExtension({
      component: () => Promise.resolve((_: { path?: string }) => <div />),
      mountPoint: plugin2RouteRef,
    }),
  );

  const ExposedComponent = plugin1.provide(
    createRoutableExtension({
      component: () =>
        Promise.resolve((_: PropsWithChildren<{ path?: string }>) => {
          const link1 = useRouteRef(plugin1RouteRef);
          const link2 = useRouteRef(plugin2RouteRef);
          const subLink1 = useRouteRef(subRouteRef1);
          const subLink2 = useRouteRef(subRouteRef2);
          const subLink3 = useRouteRef(subRouteRef3);
          const subLink4 = useRouteRef(subRouteRef4);
          const extLink1 = useRouteRef(extRouteRef1);
          const extLink2 = useRouteRef(extRouteRef2);
          const extLink3 = useRouteRef(extRouteRef3);
          const extLink4 = useRouteRef(extRouteRef4);
          return (
            <div>
              <span>link1: {link1()}</span>
              <span>link2: {link2({ x: 'a' })}</span>
              <span>subLink1: {subLink1()}</span>
              <span>subLink2: {subLink2({ x: 'a' })}</span>
              <span>subLink3: {subLink3({ x: 'b' })}</span>
              <span>subLink4: {subLink4({ x: 'c', y: 'd' })}</span>
              <span>extLink1: {extLink1()}</span>
              <span>extLink2: {extLink2({ x: 'a' })}</span>
              <span>extLink3: {extLink3?.() ?? '<none>'}</span>
              <span>extLink4: {extLink4?.({ x: 'b' }) ?? '<none>'}</span>
            </div>
          );
        }),
      mountPoint: plugin1RouteRef,
    }),
  );

  const components = {
    NotFoundErrorPage: () => null,
    BootErrorPage: () => null,
    Progress: () => null,
    Router: BrowserRouter,
    ErrorBoundaryFallback: () => null,
  };

  it('runs happy paths', async () => {
    const app = new PrivateAppImpl({
      apis: [],
      defaultApis: [],
      themes: [
        {
          id: 'light',
          title: 'Light Theme',
          variant: 'light',
          theme: lightTheme,
        },
      ],
      icons: defaultAppIcons,
      plugins: [],
      components,
      bindRoutes: ({ bind }) => {
        bind(plugin1.externalRoutes, {
          extRouteRef1: plugin1RouteRef,
          extRouteRef2: plugin2RouteRef,
          extRouteRef3: subRouteRef1,
          extRouteRef4: plugin2RouteRef,
        });
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();

    await renderWithEffects(
      <Provider>
        <Router>
          <Routes>
            <ExposedComponent path="/" />
            <HiddenComponent path="/foo/:x" />
          </Routes>
        </Router>
      </Provider>,
    );

    expect(screen.getByText('link1: /')).toBeInTheDocument();
    expect(screen.getByText('link2: /foo/a')).toBeInTheDocument();
    expect(screen.getByText('subLink1: /sub1')).toBeInTheDocument();
    expect(screen.getByText('subLink2: /sub2/a')).toBeInTheDocument();
    expect(screen.getByText('subLink3: /foo/b/sub3')).toBeInTheDocument();
    expect(screen.getByText('subLink4: /foo/c/sub4/d')).toBeInTheDocument();
    expect(screen.getByText('extLink1: /')).toBeInTheDocument();
    expect(screen.getByText('extLink2: /foo/a')).toBeInTheDocument();
    expect(screen.getByText('extLink3: /sub1')).toBeInTheDocument();
    expect(screen.getByText('extLink4: /foo/b')).toBeInTheDocument();

    // Plugins should be discovered through element tree
    expect(app.getPlugins()).toEqual([plugin1, plugin2]);
  });

  it('runs happy paths without optional routes', async () => {
    const app = new PrivateAppImpl({
      apis: [],
      defaultApis: [],
      themes: [
        {
          id: 'light',
          title: 'Light Theme',
          variant: 'light',
          theme: lightTheme,
        },
      ],
      icons: defaultAppIcons,
      plugins: [],
      components,
      bindRoutes: ({ bind }) => {
        bind(plugin1.externalRoutes, {
          extRouteRef1: plugin1RouteRef,
          extRouteRef2: plugin2RouteRef,
        });
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();

    await renderWithEffects(
      <Provider>
        <Router>
          <Routes>
            <ExposedComponent path="/" />
            <HiddenComponent path="/foo" />
          </Routes>
        </Router>
      </Provider>,
    );

    expect(screen.getByText('extLink1: /')).toBeInTheDocument();
    expect(screen.getByText('extLink2: /foo')).toBeInTheDocument();
    expect(screen.getByText('extLink3: <none>')).toBeInTheDocument();
    expect(screen.getByText('extLink4: <none>')).toBeInTheDocument();
  });

  it('should wait for the config to load before calling feature flags', async () => {
    const storageFlags = new LocalStorageFeatureFlags();
    jest.spyOn(storageFlags, 'registerFlag');

    const apis = [
      createApiFactory({
        api: featureFlagsApiRef,
        deps: { configApi: configApiRef },
        factory() {
          return storageFlags;
        },
      }),
    ];

    const app = new PrivateAppImpl({
      apis,
      defaultApis: [],
      themes: [
        {
          id: 'light',
          title: 'Light Theme',
          variant: 'light',
          theme: lightTheme,
        },
      ],
      icons: defaultAppIcons,
      plugins: [
        createPlugin({
          id: 'test',
          register: p => p.featureFlags.register('name'),
        }),
      ],
      components,
      bindRoutes: ({ bind }) => {
        bind(plugin1.externalRoutes, {
          extRouteRef1: plugin1RouteRef,
          extRouteRef2: plugin2RouteRef,
        });
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();

    await renderWithEffects(
      <Provider>
        <Router>
          <Routes>
            <ExposedComponent path="/" />
            <HiddenComponent path="/foo" />
          </Routes>
        </Router>
      </Provider>,
    );

    expect(storageFlags.registerFlag).toHaveBeenCalledWith({
      name: 'name',
      pluginId: 'test',
    });
  });

  it('should throw some error when the route has duplicate params', () => {
    const app = new PrivateAppImpl({
      apis: [],
      defaultApis: [],
      themes: [
        {
          id: 'light',
          title: 'Light Theme',
          variant: 'light',
          theme: lightTheme,
        },
      ],
      icons: defaultAppIcons,
      plugins: [],
      components,
      bindRoutes: ({ bind }) => {
        bind(plugin1.externalRoutes, {
          extRouteRef1: plugin1RouteRef,
          extRouteRef2: plugin2RouteRef,
        });
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();
    const { error: errorLogs } = withLogCollector(() => {
      expect(() =>
        render(
          <Provider>
            <Router>
              <Routes>
                <ExposedComponent path="/test/:thing">
                  <HiddenComponent path="/some/:thing" />
                </ExposedComponent>
              </Routes>
            </Router>
          </Provider>,
        ),
      ).toThrow(
        'Parameter :thing is duplicated in path /test/:thing/some/:thing',
      );
    });
    expect(errorLogs).toEqual([
      expect.stringContaining(
        'Parameter :thing is duplicated in path /test/:thing/some/:thing',
      ),
      expect.stringContaining(
        'The above error occurred in the <Provider> component',
      ),
    ]);
  });
});
