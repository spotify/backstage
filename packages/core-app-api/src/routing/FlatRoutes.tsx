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

import React, { ReactNode, Children, isValidElement, Fragment } from 'react';
import { useRoutes } from 'react-router-dom';
import { useApp } from '@backstage/core-plugin-api';

type RouteObject = {
  path: string;
  element: JSX.Element;
  children?: RouteObject[];
};

// Similar to the same function from react-router, this collects routes from the
// children, but only the first level of routes
function createRoutesFromChildren(childrenNode: ReactNode): RouteObject[] {
  return Children.toArray(childrenNode).flatMap(child => {
    if (!isValidElement(child)) {
      return [];
    }

    const { children } = child.props;

    if (child.type === Fragment) {
      return createRoutesFromChildren(children);
    }

    let path = child.props.path as string | undefined;

    // TODO(Rugvip): Work around plugins registering empty paths, remove once deprecated routes are gone
    if (path === '') {
      return [];
    }
    path = path?.replace(/\/\*$/, '') ?? '/';

    return [
      {
        path,
        element: child,
        children: children && [
          {
            path: '/*',
            element: children,
          },
        ],
      },
    ];
  });
}

type FlatRoutesProps = {
  children: ReactNode;
};

export const FlatRoutes = (props: FlatRoutesProps): JSX.Element | null => {
  const app = useApp();
  const { NotFoundErrorPage } = app.getComponents();
  const routes = createRoutesFromChildren(props.children)
    // Routes are sorted to work around a bug where prefixes are unexpectedly matched
    .sort((a, b) => b.path.localeCompare(a.path))
    // We make sure all routes have '/*' appended, except '/'
    .map(obj => {
      obj.path = obj.path === '/' ? '/' : `${obj.path}/*`;
      return obj;
    });

  // TODO(Rugvip): Possibly add a way to skip this, like a noNotFoundPage prop
  routes.push({
    element: <NotFoundErrorPage />,
    path: '/*',
  });

  return useRoutes(routes);
};
