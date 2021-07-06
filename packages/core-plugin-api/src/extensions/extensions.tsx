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

import React, { lazy, Suspense } from 'react';
import { useApp } from '../app';
import { RouteRef, useRouteRef } from '../routing';
import { attachComponentData } from './componentData';
import { Extension, BackstagePlugin } from '../plugin/types';
import { PluginErrorBoundary } from './PluginErrorBoundary';

type ComponentLoader<T> =
  | {
      lazy: () => Promise<T>;
    }
  | {
      sync: T;
    };

// We do not use ComponentType as the return type, since it doesn't let us convey the children prop.
// ComponentType inserts children as an optional prop whether the inner component accepts it or not,
// making it impossible to make the usage of children type safe.
export function createRoutableExtension<
  T extends (props: any) => JSX.Element | null
>(options: {
  component: () => Promise<T>;
  mountPoint: RouteRef;
}): Extension<T> {
  const { component, mountPoint } = options;
  return createReactExtension({
    component: {
      lazy: () =>
        component().then(
          InnerComponent => {
            const RoutableExtensionWrapper: any = (props: any) => {
              // Validate that the routing is wired up correctly in the App.tsx
              try {
                useRouteRef(mountPoint);
              } catch (error) {
                if (error?.message.startsWith('No path for ')) {
                  throw new Error(
                    `Routable extension component with mount point ${mountPoint} was not discovered in the app element tree. ` +
                      'Routable extension components may not be rendered by other components and must be ' +
                      'directly available as an element within the App provider component.',
                  );
                }
                throw error;
              }
              return <InnerComponent {...props} />;
            };

            const componentName =
              (InnerComponent as { displayName?: string }).displayName ||
              InnerComponent.name ||
              'LazyComponent';

            RoutableExtensionWrapper.displayName = `RoutableExtension(${componentName})`;

            return RoutableExtensionWrapper as T;
          },
          error => {
            const RoutableExtensionWrapper: any = (_: any) => {
              const app = useApp();
              const { BootErrorPage } = app.getComponents();

              return <BootErrorPage step="load-chunk" error={error} />;
            };
            return RoutableExtensionWrapper;
          },
        ),
    },
    data: {
      'core.mountPoint': mountPoint,
    },
  });
}

// We do not use ComponentType as the return type, since it doesn't let us convey the children prop.
// ComponentType inserts children as an optional prop whether the inner component accepts it or not,
// making it impossible to make the usage of children type safe.
export function createComponentExtension<
  T extends (props: any) => JSX.Element | null
>(options: { component: ComponentLoader<T> }): Extension<T> {
  const { component } = options;
  return createReactExtension({ component });
}

// We do not use ComponentType as the return type, since it doesn't let us convey the children prop.
// ComponentType inserts children as an optional prop whether the inner component accepts it or not,
// making it impossible to make the usage of children type safe.
export function createReactExtension<
  T extends (props: any) => JSX.Element | null
>(options: {
  component: ComponentLoader<T>;
  data?: Record<string, unknown>;
}): Extension<T> {
  const { data = {} } = options;

  let Component: T;
  if ('lazy' in options.component) {
    const lazyLoader = options.component.lazy;
    Component = (lazy(() =>
      lazyLoader().then(component => ({ default: component })),
    ) as unknown) as T;
  } else {
    Component = options.component.sync;
  }
  const componentName =
    (Component as { displayName?: string }).displayName ||
    Component.name ||
    'Component';

  return {
    expose(plugin: BackstagePlugin<any, any>) {
      const Result: any = (props: any) => {
        const app = useApp();
        const { Progress } = app.getComponents();

        return (
          <Suspense fallback={<Progress />}>
            <PluginErrorBoundary app={app} plugin={plugin}>
              <Component {...props} />
            </PluginErrorBoundary>
          </Suspense>
        );
      };

      attachComponentData(Result, 'core.plugin', plugin);
      for (const [key, value] of Object.entries(data)) {
        attachComponentData(Result, key, value);
      }

      Result.displayName = `Extension(${componentName})`;
      return Result;
    },
  };
}
