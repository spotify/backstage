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

import { attachComponentData } from '@backstage/core-plugin-api';
import React, {
  Children,
  Fragment,
  isValidElement,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { RoutedTabs } from './RoutedTabs';
import { TabProps } from '@material-ui/core';

type SubRoute = {
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

const Route: (props: SubRoute) => null = () => null;

// This causes all mount points that are discovered within this route to use the path of the route itself
attachComponentData(Route, 'core.gatherMountPoints', true);

export function createSubRoutesFromChildren(
  childrenProps: ReactNode,
): SubRoute[] {
  // Directly comparing child.type with Route will not work with in
  // combination with react-hot-loader in storybook
  // https://github.com/gaearon/react-hot-loader/issues/304
  const routeType = (
    <Route path="" title="">
      <div />
    </Route>
  ).type;

  return Children.toArray(childrenProps).flatMap(child => {
    if (!isValidElement(child)) {
      return [];
    }

    if (child.type === Fragment) {
      return createSubRoutesFromChildren(child.props.children);
    }

    if (child.type !== routeType) {
      throw new Error('Child of TabbedLayout must be an TabbedLayout.Route');
    }

    const { path, title, children, tabProps } = child.props;
    return [{ path, title, children, tabProps }];
  });
}

/**
 * TabbedLayout is a compound component, which allows you to define a layout for
 * pages using a sub-navigation mechanism.
 *
 * Consists of two parts: TabbedLayout and TabbedLayout.Route
 *
 * @example
 * ```jsx
 * <TabbedLayout>
 *   <TabbedLayout.Route path="/example" title="Example tab">
 *     <div>This is rendered under /example/anything-here route</div>
 *   </TabbedLayout.Route>
 * </TabbedLayout>
 * ```
 */
export const TabbedLayout = ({ children }: PropsWithChildren<{}>) => {
  const routes = createSubRoutesFromChildren(children);

  return <RoutedTabs routes={routes} />;
};

TabbedLayout.Route = Route;
