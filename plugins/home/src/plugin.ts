/*
 * Copyright 2021 The Backstage Authors
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
import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { createHomePageComponentExtension } from './extensions';

import { rootRouteRef } from './routes';

export const homePlugin = createPlugin({
  id: 'home',
  routes: {
    root: rootRouteRef,
  },
});

export const HomeIndexPage = homePlugin.provide(
  createRoutableExtension({
    component: () => import('./components').then(m => m.HomeIndexPage),
    mountPoint: rootRouteRef,
  }),
);

export const RandomJokeHomePageComponent = homePlugin.provide(
  createHomePageComponentExtension({
    title: 'Random Joke',
    component: () =>
      import('./homePageComponents/RandomJoke/Component').then(
        m => m.Component,
      ),
    actions: () =>
      import('./homePageComponents/RandomJoke/Actions').then(m => m.Actions),
    contextProvider: () =>
      import('./homePageComponents/RandomJoke/Context').then(
        m => m.ContextProvider,
      ),
    settings: () =>
      import('./homePageComponents/RandomJoke/Settings').then(m => m.Settings),
  }),
);
