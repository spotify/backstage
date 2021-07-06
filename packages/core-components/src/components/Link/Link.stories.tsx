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
import React, { ComponentType } from 'react';
import { Link } from './Link';
import {
  MemoryRouter,
  Route,
  useLocation,
  NavLink as RouterNavLink,
} from 'react-router-dom';
import { createRouteRef, useRouteRef } from '@backstage/core-plugin-api';
// We don't want to export RoutingProvider from core-app-api, but it's way easier to
// use here. This hack only works in storybook stories.
// eslint-disable-next-line monorepo/no-internal-import
import { RoutingProvider } from '@backstage/core-app-api/src/routing/RoutingProvider';

const routeRef = createRouteRef({
  id: 'storybook.test-route',
});

const Location = () => {
  const location = useLocation();
  return <pre>Current location: {location.pathname}</pre>;
};

export default {
  title: 'Navigation/Link',
  component: Link,
  decorators: [
    (Story: ComponentType<{}>) => (
      <MemoryRouter>
        <RoutingProvider
          routeBindings={new Map()}
          routeObjects={[]}
          routeParents={new Map()}
          routePaths={new Map([[routeRef, '/hello']])}
        >
          <div>
            <div>
              <Location />
            </div>
            <Story />
          </div>
        </RoutingProvider>
      </MemoryRouter>
    ),
  ],
};

export const Default = () => {
  const link = useRouteRef(routeRef);

  return (
    <>
      <Link to={link()}>This link</Link>&nbsp;will utilise the react-router
      MemoryRouter's navigation
      <Route path={link()}>
        <h1>Hi there!</h1>
      </Route>
    </>
  );
};

export const PassProps = () => {
  const link = useRouteRef(routeRef);

  return (
    <>
      <Link
        to={link()}
        /** react-router-dom related prop */
        component={RouterNavLink}
        /** material-ui related prop */
        color="secondary"
      >
        This link
      </Link>
      &nbsp;has props for both material-ui's component as well as for
      react-router-dom's
      <Route path={link()}>
        <h1>Hi there!</h1>
      </Route>
    </>
  );
};
PassProps.story = {
  name: `Accepts material-ui Link's and react-router-dom Link's props`,
};
