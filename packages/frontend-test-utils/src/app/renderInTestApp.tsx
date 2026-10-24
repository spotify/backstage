/*
 * Copyright 2023 The Backstage Authors
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

import { Fragment } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { prepareSpecializedApp } from '@backstage/frontend-app-api';
import { RenderResult, render } from '@testing-library/react';
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import {
  createExtension,
  ExtensionDefinition,
  coreExtensionData,
  RouteRef,
  createFrontendPlugin,
  FrontendFeature,
  createFrontendModule,
  createApiFactory,
  createRouteRef,
  ExternalRouteRef,
  identityApiRef,
  type ApiRef,
} from '@backstage/frontend-plugin-api';
import { RouterBlueprint } from '@backstage/plugin-app-react';
import appPlugin from '@backstage/plugin-app';
import { getMockApiFactory } from '../apis/MockWithApiFactory';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { CreateSpecializedAppInternalOptions } from '../../../frontend-app-api/src/wiring/createSpecializedApp';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { getBasePath } from '../../../frontend-app-api/src/routing/getBasePath';
import { TestApiPairs } from '../apis/TestApiProvider';
import { throwOnAppErrors } from './throwOnAppErrors';
import { OpaqueExternalRouteRef } from '@internal/frontend';

const DEFAULT_MOCK_CONFIG = {
  app: { baseUrl: 'http://localhost:3000' },
  backend: { baseUrl: 'http://localhost:7007' },
};

/**
 * Options to customize the behavior of the test app.
 * @public
 */
export type TestAppOptions<TApiPairs extends any[] = any[]> = {
  /**
   * An object of paths to mount route ref on, with the key being the path and the value
   * being the route ref that the path will be bound to. This allows the route refs to be
   * used by `useRouteRef` in the rendered elements.
   *
   * @example
   * ```ts
   * renderInTestApp(<MyComponent />, {
   *   mountedRoutes: {
   *     '/my-path': myRouteRef,
   *   }
   * })
   * // ...
   * const link = useRouteRef(myRouteRef)
   * ```
   */
  mountedRoutes?: { [path: string]: RouteRef | ExternalRouteRef };

  /**
   * Additional configuration passed to the app when rendering elements inside it.
   */
  config?: JsonObject;

  /**
   * Additional features to add to the test app.
   */
  features?: FrontendFeature[];

  /**
   * The route path pattern that the test element is rendered at. When set,
   * the element is wrapped in a `<Route>` with this path, enabling
   * `useParams()` to extract parameters from the URL.
   *
   * Should be used together with `initialRouteEntries` to set a concrete
   * URL that matches the pattern.
   *
   * @example
   * ```ts
   * renderInTestApp(<EntityPage />, {
   *   mountPath: '/catalog/:namespace/:kind/:name',
   *   initialRouteEntries: ['/catalog/default/component/my-entity'],
   * })
   * ```
   */
  mountPath?: string;

  /**
   * Initial route entries to use for the router.
   */
  initialRouteEntries?: string[];

  /**
   * API overrides to provide to the test app. Use `mockApis` helpers
   * from `@backstage/frontend-test-utils` to create mock implementations.
   *
   * @example
   * ```ts
   * import { mockApis } from '@backstage/frontend-test-utils';
   *
   * renderInTestApp(<MyComponent />, {
   *   apis: [mockApis.identity({ userEntityRef: 'user:default/guest' })],
   * })
   * ```
   */
  apis?: readonly [...TestApiPairs<TApiPairs>];
};

const appPluginOverride = appPlugin.withOverrides({
  extensions: [
    appPlugin.getExtension('sign-in-page:app').override({
      disabled: true,
    }),
    appPlugin.getExtension('app/layout').override({
      disabled: true,
    }),
    appPlugin.getExtension('app/routes').override({
      disabled: true,
    }),
    appPlugin.getExtension('app/nav').override({
      disabled: true,
    }),
  ],
});

/**
 * @public
 * Renders the given element in a test app, for use in unit tests.
 */
export function renderInTestApp<const TApiPairs extends any[] = any[]>(
  element: JSX.Element,
  options?: TestAppOptions<TApiPairs>,
): RenderResult {
  const mountPath = options?.mountPath;

  const extensions: Array<ExtensionDefinition> = [
    createExtension({
      attachTo: { id: 'app/root', input: 'children' },
      output: [coreExtensionData.reactElement],
      factory: () => {
        let content: JSX.Element = element;

        if (mountPath) {
          const routePath =
            mountPath === '/' || mountPath.endsWith('/*')
              ? mountPath
              : `${mountPath.replace(/\/$/, '')}/*`;
          content = (
            <Routes>
              <Route path={routePath} element={content} />
            </Routes>
          );
        }

        return [coreExtensionData.reactElement(content)];
      },
    }),
  ];

  const externalBindings = new Map<ExternalRouteRef, RouteRef>();

  if (options?.mountedRoutes) {
    for (const [path, optionRef] of Object.entries(options.mountedRoutes)) {
      let routeRef: RouteRef;

      if (OpaqueExternalRouteRef.isType(optionRef)) {
        // Create an actual route ref for the external route, then bind the external ref to it
        routeRef = createRouteRef();
        externalBindings.set(optionRef, routeRef);
      } else {
        routeRef = optionRef;
      }

      extensions.push(
        createExtension({
          kind: 'test-route',
          name: path,
          attachTo: { id: 'app/root', input: 'elements' },
          output: [
            coreExtensionData.reactElement,
            coreExtensionData.routePath,
            coreExtensionData.routeRef,
          ],
          factory: () => [
            coreExtensionData.reactElement(<Fragment />),
            coreExtensionData.routePath(path),
            coreExtensionData.routeRef(routeRef),
          ],
        }),
      );
    }
  }

  const apiFactoryOverrides = (options?.apis ?? []).map(
    entry =>
      getMockApiFactory(entry) ??
      createApiFactory(...(entry as readonly [ApiRef<any>, any])),
  );
  const identityOverrideFactory = apiFactoryOverrides.find(
    factory => factory.api.id === identityApiRef.id,
  );

  const features: FrontendFeature[] = [
    createFrontendModule({
      pluginId: 'app',
      extensions: [
        RouterBlueprint.make({
          params: {
            component: ({ children }) => (
              <MemoryRouter
                initialEntries={options?.initialRouteEntries}
                future={{
                  v7_relativeSplatPath: false,
                  v7_startTransition: false,
                }}
              >
                {children}
              </MemoryRouter>
            ),
          },
        }),
      ],
    }),
    createFrontendPlugin({
      pluginId: 'test',
      extensions,
    }),
    appPluginOverride,
  ];

  if (options?.features) {
    features.push(...options.features);
  }

  const config = ConfigReader.fromConfigs([
    {
      context: 'render-config',
      data: options?.config ?? DEFAULT_MOCK_CONFIG,
    },
  ]);

  const app = prepareSpecializedApp({
    features,
    config,
    __internal: options?.apis && {
      apiFactoryOverrides: apiFactoryOverrides.filter(
        factory => factory.api.id !== identityApiRef.id,
      ),
    },
    bindRoutes:
      externalBindings.size > 0
        ? ({ bind }) => {
            for (const [externalRef, targetRef] of externalBindings) {
              bind({ ref: externalRef }, { ref: targetRef });
            }
          }
        : undefined,
  } as CreateSpecializedAppInternalOptions).finalize();

  throwOnAppErrors(app);

  if (identityOverrideFactory) {
    // identityApiRef always resolves to the app's internal AppIdentityProxy
    // (AppRouter requires this), so the override can't replace the factory.
    // setTarget is now idempotent (first write wins), so we just need to
    // set it before AppRouter's own guest-identity fallback does, which
    // happens during this same synchronous render call.
    const proxy = app.apis.get(identityApiRef as any) as any;
    proxy?.setTarget?.(identityOverrideFactory.factory({}), {
      signOutTargetUrl: getBasePath(config) || '/',
    });
  }

  return render(
    app.tree.root.instance!.getData(coreExtensionData.reactElement),
  );
}
