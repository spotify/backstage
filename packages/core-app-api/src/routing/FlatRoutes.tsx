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

import React, { ReactNode } from 'react';
import { useRoutes } from 'react-router-dom';
import { useApp, useElementFilter } from '@backstage/core-plugin-api';

type RouteObject = {
  path: string;
  element: ReactNode;
  children?: RouteObject[];
};

type FlatRoutesProps = {
  children: ReactNode;
};

export const FlatRoutes = (props: FlatRoutesProps): JSX.Element | null => {
  const app = useApp();
  const { NotFoundErrorPage } = app.getComponents();
  const routes = useElementFilter(props.children, elements =>
    elements
      .getElements<{ path?: string; children: ReactNode }>()
      .flatMap<RouteObject>(child => {
        let path = child.props.path;

        // TODO(Rugvip): Work around plugins registering empty paths, remove once deprecated routes are gone
        if (path === '') {
          return [];
        }
        path = path?.replace(/\/\*$/, '') ?? '/';

        return [
          {
            path,
            element: child,
            children: child.props.children
              ? [
                  {
                    path: '/*',
                    element: child.props.children,
                  },
                ]
              : undefined,
          },
        ];
      })
      // Routes are sorted to work around a bug where prefixes are unexpectedly matched
      .sort((a, b) => b.path.localeCompare(a.path))
      // We make sure all routes have '/*' appended, except '/'
      .map(obj => {
        obj.path = obj.path === '/' ? '/' : `${obj.path}/*`;
        return obj;
      }),
  );

  // TODO(Rugvip): Possibly add a way to skip this, like a noNotFoundPage prop
  routes.push({
    element: <NotFoundErrorPage />,
    path: '/*',
  });

  return useRoutes(routes);
};
