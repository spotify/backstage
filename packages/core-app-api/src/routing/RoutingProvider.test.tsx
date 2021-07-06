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

import React, {
  PropsWithChildren,
  ReactElement,
  useContext,
  Context,
} from 'react';
import { MemoryRouter, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { VersionedValue } from '../lib/versionedValues';
import { getGlobalSingleton } from '../lib/globalObject';
import {
  childDiscoverer,
  routeElementDiscoverer,
  traverseElementTree,
} from '../extensions/traversal';
import {
  createPlugin,
  useRouteRef,
  createRoutableExtension,
  createRouteRef,
  createExternalRouteRef,
  RouteRef,
  ExternalRouteRef,
} from '@backstage/core-plugin-api';
import { RoutingProvider } from './RoutingProvider';
import {
  routePathCollector,
  routeParentCollector,
  routeObjectCollector,
} from './collectors';
import { validateRoutes } from './validation';
import { RouteResolver } from './RouteResolver';
import { AnyRouteRef, RouteFunc } from './types';
import { AppContextProvider } from '../app/AppContext';

const MockComponent = ({ children }: PropsWithChildren<{ path?: string }>) => (
  <>{children}</>
);

const plugin = createPlugin({ id: 'my-plugin' });

const ref1 = createRouteRef({ id: 'ref1' });
const ref2 = createRouteRef({ id: 'ref2' });
const ref3 = createRouteRef({ id: 'ref3' });
const ref4 = createRouteRef({ id: 'ref4' });
const ref5 = createRouteRef({ id: 'ref5', params: ['x'] });
const eRefA = createExternalRouteRef({ id: '1' });
const eRefB = createExternalRouteRef({ id: '2' });
const eRefC = createExternalRouteRef({ id: '3', params: ['y'] });
const eRefD = createExternalRouteRef({ id: '4', optional: true });
const eRefE = createExternalRouteRef({
  id: '5',
  optional: true,
  params: ['z'],
});

const MockRouteSource = <T extends { [name in string]: string }>(props: {
  path?: string;
  name: string;
  routeRef: AnyRouteRef;
  params?: T;
}) => {
  try {
    const routeFunc = useRouteRef(props.routeRef as any) as
      | RouteFunc<any>
      | undefined;
    return (
      <div>
        Path at {props.name}: {routeFunc?.(props.params) ?? '<none>'}
      </div>
    );
  } catch (ex) {
    return (
      <div>
        Error at {props.name}: {ex.message}
      </div>
    );
  }
};

const Extension1 = plugin.provide(
  createRoutableExtension({
    component: () => Promise.resolve(MockComponent),
    mountPoint: ref1,
  }),
);
const Extension2 = plugin.provide(
  createRoutableExtension({
    component: () => Promise.resolve(MockRouteSource),
    mountPoint: ref2,
  }),
);
const Extension3 = plugin.provide(
  createRoutableExtension({
    component: () => Promise.resolve(MockComponent),
    mountPoint: ref3,
  }),
);
const Extension4 = plugin.provide(
  createRoutableExtension({
    component: () => Promise.resolve(MockRouteSource),
    mountPoint: ref4,
  }),
);
const Extension5 = plugin.provide(
  createRoutableExtension({
    component: () => Promise.resolve(MockComponent),
    mountPoint: ref5,
  }),
);

const mockContext = {
  getComponents: () => ({ Progress: () => null } as any),
  getSystemIcon: jest.fn(),
  getPlugins: jest.fn(),
};

function withRoutingProvider(
  root: ReactElement,
  routeBindings: [ExternalRouteRef, RouteRef][] = [],
) {
  const { routePaths, routeParents, routeObjects } = traverseElementTree({
    root,
    discoverers: [childDiscoverer, routeElementDiscoverer],
    collectors: {
      routePaths: routePathCollector,
      routeParents: routeParentCollector,
      routeObjects: routeObjectCollector,
    },
  });

  return (
    <RoutingProvider
      routePaths={routePaths}
      routeParents={routeParents}
      routeObjects={routeObjects}
      routeBindings={new Map(routeBindings)}
    >
      {root}
    </RoutingProvider>
  );
}

describe('discovery', () => {
  it('should handle simple routeRef path creation for routeRefs used in other parts of the app', async () => {
    const root = (
      <AppContextProvider appContext={mockContext}>
        <MemoryRouter initialEntries={['/foo/bar']}>
          <Routes>
            <Extension1 path="/foo">
              <Extension2 path="/bar" name="inside" routeRef={ref2} />
              <MockRouteSource name="insideExternal" routeRef={eRefA} />
            </Extension1>
            <Extension3 path="/baz" />
          </Routes>
          <MockRouteSource name="outside" routeRef={ref2} />
          <MockRouteSource name="outsideExternal1" routeRef={eRefB} />
          <MockRouteSource name="outsideExternal2" routeRef={eRefC} />
          <MockRouteSource name="outsideExternal3" routeRef={eRefD} />
          <MockRouteSource name="outsideExternal4" routeRef={eRefE} />
        </MemoryRouter>
      </AppContextProvider>
    );

    const rendered = render(
      withRoutingProvider(root, [
        [eRefA, ref3],
        [eRefB, ref1],
        [eRefC, ref2],
        [eRefD, ref1],
      ]),
    );

    await expect(
      rendered.findByText('Path at inside: /foo/bar'),
    ).resolves.toBeInTheDocument();
    expect(
      rendered.getByText('Path at insideExternal: /baz'),
    ).toBeInTheDocument();
    expect(rendered.getByText('Path at outside: /foo/bar')).toBeInTheDocument();
    expect(
      rendered.getByText('Path at outsideExternal1: /foo'),
    ).toBeInTheDocument();
    expect(
      rendered.getByText('Path at outsideExternal2: /foo/bar'),
    ).toBeInTheDocument();
    expect(
      rendered.getByText('Path at outsideExternal3: /foo'),
    ).toBeInTheDocument();
    expect(
      rendered.getByText('Path at outsideExternal4: <none>'),
    ).toBeInTheDocument();
  });

  it('should handle routeRefs with parameters', async () => {
    const root = (
      <AppContextProvider appContext={mockContext}>
        <MemoryRouter initialEntries={['/foo/bar/wat']}>
          <Routes>
            <Extension1 path="/foo">
              <Extension4
                path="/bar/:id"
                name="inside"
                routeRef={ref4}
                params={{ id: 'bleb' }}
              />
            </Extension1>
          </Routes>
          <MockRouteSource
            name="outside"
            routeRef={ref4}
            params={{ id: 'blob' }}
          />
        </MemoryRouter>
      </AppContextProvider>
    );

    const rendered = render(withRoutingProvider(root));

    await expect(
      rendered.findByText('Path at inside: /foo/bar/bleb'),
    ).resolves.toBeInTheDocument();
    expect(
      rendered.getByText('Path at outside: /foo/bar/blob'),
    ).toBeInTheDocument();
  });

  it('should handle relative routing within parameterized routePaths', async () => {
    const root = (
      <AppContextProvider appContext={mockContext}>
        <MemoryRouter initialEntries={['/foo/blob/baz']}>
          <React.Suspense fallback="loller">
            <Routes>
              <Extension5 path="/foo/:id">
                <Extension2 path="/bar" name="inside" routeRef={ref3} />
                <Extension3 path="/baz" />
              </Extension5>
            </Routes>
            <MockRouteSource name="outsideNoParams" routeRef={ref3} />
            <MockRouteSource
              name="outsideWithParams"
              routeRef={ref3}
              params={{ id: 'blob' }}
            />
          </React.Suspense>
        </MemoryRouter>
      </AppContextProvider>
    );

    const rendered = render(withRoutingProvider(root));

    await expect(
      rendered.findByText('Path at inside: /foo/blob/baz'),
    ).resolves.toBeInTheDocument();
  });

  it('should throw errors for routing to other routeRefs with unsupported parameters', () => {
    const root = (
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Extension5 path="/foo/:id">
            <Extension2 path="/bar" name="inside" routeRef={ref3} />
            <Extension3 path="/baz" />
          </Extension5>
        </Routes>
        <MockRouteSource name="outsideNoParams" routeRef={ref3} />
        <MockRouteSource
          name="outsideWithParams"
          routeRef={ref3}
          params={{ id: 'blob' }}
        />
      </MemoryRouter>
    );

    const rendered = render(withRoutingProvider(root));

    expect(
      rendered.getByText(
        `Error at outsideWithParams: Cannot route to ${ref3} with parent ${ref5} as it has parameters`,
      ),
    ).toBeInTheDocument();
    expect(
      rendered.getByText(
        `Error at outsideNoParams: Cannot route to ${ref3} with parent ${ref5} as it has parameters`,
      ),
    ).toBeInTheDocument();
  });

  it('should handle relative routing of parameterized routePaths with duplicate param names', () => {
    const root = (
      <MemoryRouter>
        <Routes>
          <Extension5 path="/foo/:id">
            <Extension4 path="/bar/:id" name="borked" routeRef={ref4} />
          </Extension5>
        </Routes>
      </MemoryRouter>
    );

    const { routePaths, routeParents } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routePaths: routePathCollector,
        routeParents: routeParentCollector,
      },
    });

    expect(() => validateRoutes(routePaths, routeParents)).toThrow(
      'Parameter :id is duplicated in path /foo/:id/bar/:id',
    );
  });
});

describe('v1 consumer', () => {
  const RoutingContext = getGlobalSingleton<
    Context<VersionedValue<{ 1: RouteResolver }>>
  >('routing-context');

  function useMockRouteRefV1(
    routeRef: AnyRouteRef,
    location: string,
  ): RouteFunc<any> | undefined {
    const resolver = useContext(RoutingContext)?.atVersion(1);
    if (!resolver) {
      throw new Error('no impl');
    }
    return resolver.resolve(routeRef, location);
  }

  it('should resolve routes', () => {
    const routeRef1 = createRouteRef({ id: 'ref1' });
    const routeRef2 = createRouteRef({ id: 'ref2' });
    const routeRef3 = createRouteRef({ id: 'ref3', params: ['x'] });

    const renderedHook = renderHook(
      ({ routeRef }) => useMockRouteRefV1(routeRef, '/'),
      {
        initialProps: {
          routeRef: routeRef1 as AnyRouteRef,
        },
        wrapper: ({ children }) => (
          <RoutingProvider
            routePaths={
              new Map<RouteRef<any>, string>([
                [routeRef2, '/foo'],
                [routeRef3, '/bar/:x'],
              ])
            }
            routeParents={new Map()}
            routeObjects={[]}
            routeBindings={new Map()}
            children={children}
          />
        ),
      },
    );

    expect(renderedHook.result.current).toBe(undefined);
    renderedHook.rerender({ routeRef: routeRef2 });
    expect(renderedHook.result.current?.()).toBe('/foo');
    renderedHook.rerender({ routeRef: routeRef3 });
    expect(renderedHook.result.current?.({ x: 'my-x' })).toBe('/bar/my-x');
  });
});
