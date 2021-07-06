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
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { matchRoutes, useNavigate, useParams, useRoutes } from 'react-router';
import { Content } from '../../layout/Content';
import { HeaderTabs } from '../../layout/HeaderTabs';
import { SubRoute } from './types';

export function useSelectedSubRoute(
  subRoutes: SubRoute[],
): { index: number; route: SubRoute; element: JSX.Element } {
  const params = useParams();

  const routes = subRoutes.map(({ path, children }) => ({
    caseSensitive: false,
    path: `${path}/*`,
    element: children,
  }));

  const element = useRoutes(routes) ?? subRoutes[0].children;

  const [matchedRoute] = matchRoutes(routes, `/${params['*']}`) ?? [];
  const foundIndex = matchedRoute
    ? subRoutes.findIndex(t => `${t.path}/*` === matchedRoute.route.path)
    : 0;

  return {
    index: foundIndex === -1 ? 0 : foundIndex,
    element,
    route: subRoutes[foundIndex] ?? subRoutes[0],
  };
}

export const RoutedTabs = ({ routes }: { routes: SubRoute[] }) => {
  const navigate = useNavigate();
  const { index, route, element } = useSelectedSubRoute(routes);
  const headerTabs = useMemo(
    () =>
      routes.map(t => ({
        id: t.path,
        label: t.title,
        tabProps: t.tabProps,
      })),
    [routes],
  );

  const onTabChange = (tabIndex: number) =>
    // Remove trailing /*
    // And remove leading / for relative navigation
    // Note! route resolves relative to the position in the React tree,
    // not relative to current location
    navigate(routes[tabIndex].path.replace(/\/\*$/, '').replace(/^\//, ''));

  return (
    <>
      <HeaderTabs
        tabs={headerTabs}
        selectedIndex={index}
        onChange={onTabChange}
      />
      <Content>
        <Helmet title={route.title} />
        {element}
      </Content>
    </>
  );
};
