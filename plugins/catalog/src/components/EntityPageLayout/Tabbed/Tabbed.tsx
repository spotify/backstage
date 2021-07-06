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
import React from 'react';
import {
  useParams,
  useNavigate,
  PartialRouteObject,
  matchRoutes,
  RouteObject,
  useRoutes,
  Navigate,
  RouteMatch,
} from 'react-router';
import { Helmet } from 'react-helmet';
import { Tab, HeaderTabs, Content } from '@backstage/core-components';

const getSelectedIndexOrDefault = (
  matchedRoute: RouteMatch,
  tabs: Tab[],
  defaultIndex = 0,
) => {
  if (!matchedRoute) return defaultIndex;
  const tabIndex = tabs.findIndex(t => t.id === matchedRoute.route.path);
  return ~tabIndex ? tabIndex : defaultIndex;
};

/**
 * Compound component, which allows you to define layout
 * for EntityPage using Tabs as a sub-navigation mechanism
 * Consists of 2 parts: Tabbed.Layout and Tabbed.Content.
 * Takes care of: tabs, routes, document titles, spacing around content
 *
 * @example
 * ```jsx
 * <Tabbed.Layout>
 *   <Tabbed.Content
 *      title="Example tab"
 *      route="/example/*"
 *      element={<div>This is rendered under /example/anything-here route</div>}
 *   />
 * </TabbedLayout>
 * ```
 */
export const Tabbed = {
  Layout: ({ children }: { children: React.ReactNode }) => {
    const routes: PartialRouteObject[] = [];
    const tabs: Tab[] = [];
    const params = useParams();
    const navigate = useNavigate();

    React.Children.forEach(children, child => {
      if (!React.isValidElement(child)) {
        // Skip conditionals resolved to falses/nulls/undefineds etc
        return;
      }
      if (child.type !== Tabbed.Content) {
        throw new Error(
          'This component only accepts Content elements as direct children. Check the code of the EntityPage.',
        );
      }
      const pathAndId = (child as JSX.Element).props.path;

      // Child here must be then always a functional component without any wrappers
      tabs.push({
        id: pathAndId,
        label: (child as JSX.Element).props.title,
      });

      routes.push({
        path: pathAndId,
        element: child.props.element,
      });
    });

    // Add catch-all for incorrect sub-routes
    if ((routes?.[0]?.path ?? '') !== '')
      routes.push({
        path: '/*',
        element: <Navigate to={routes[0].path!} />,
      });

    const [matchedRoute] =
      matchRoutes(routes as RouteObject[], `/${params['*']}`) ?? [];
    const selectedIndex = getSelectedIndexOrDefault(matchedRoute, tabs);
    const currentTab = tabs[selectedIndex];
    const title = currentTab?.label;

    const onTabChange = (index: number) =>
      // Remove trailing /*
      // And remove leading / for relative navigation
      // Note! route resolves relative to the position in the React tree,
      // not relative to current location
      navigate(tabs[index].id.replace(/\/\*$/, '').replace(/^\//, ''));

    const currentRouteElement = useRoutes(routes);

    if (!currentTab) return null;
    return (
      <>
        <HeaderTabs
          tabs={tabs}
          selectedIndex={selectedIndex}
          onChange={onTabChange}
        />
        <Content>
          <Helmet title={title} />
          {currentRouteElement}
        </Content>
      </>
    );
  },
  Content: (_props: { path: string; title: string; element: JSX.Element }) =>
    null,
};
