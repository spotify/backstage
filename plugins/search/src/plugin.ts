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

import { SearchClient, searchApiRef } from './apis';
import {
  createApiFactory,
  createPlugin,
  createRouteRef,
  createRoutableExtension,
  discoveryApiRef,
  createComponentExtension,
  identityApiRef,
} from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  path: '/search',
  title: 'search',
});

export const rootNextRouteRef = createRouteRef({
  path: '/search-next',
  title: 'search',
});

export const searchPlugin = createPlugin({
  id: 'search',
  apis: [
    createApiFactory({
      api: searchApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => {
        return new SearchClient({ discoveryApi, identityApi });
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
    nextRoot: rootNextRouteRef,
  },
});

export const SearchPage = searchPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/SearchPage').then(m => m.SearchPage),
    mountPoint: rootRouteRef,
  }),
);

/**
 * @deprecated This component was used for rapid prototyping of the Backstage
 * Search platform. Now that the API has stabilized, you should use the
 * <SearchPage /> component instead. This component will be removed in an
 * upcoming release.
 */
export const SearchPageNext = searchPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/SearchPage').then(m => m.SearchPage),
    mountPoint: rootNextRouteRef,
  }),
);

export const SearchBar = searchPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components/SearchBar').then(m => m.SearchBar),
    },
  }),
);

/**
 * @deprecated This component was used for rapid prototyping of the Backstage
 * Search platform. Now that the API has stabilized, you should use the
 * <SearchBar /> component instead. This component will be removed in an
 * upcoming release.
 */
export const SearchBarNext = searchPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components/SearchBar').then(m => m.SearchBar),
    },
  }),
);

export const SearchResult = searchPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components/SearchResult').then(m => m.SearchResult),
    },
  }),
);

/**
 * @deprecated This component was used for rapid prototyping of the Backstage
 * Search platform. Now that the API has stabilized, you should use the
 * <SearchResult /> component instead. This component will be removed in an
 * upcoming release.
 */
export const SearchResultNext = searchPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components/SearchResult').then(m => m.SearchResult),
    },
  }),
);

export const DefaultResultListItem = searchPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/DefaultResultListItem').then(
          m => m.DefaultResultListItem,
        ),
    },
  }),
);
