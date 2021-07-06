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

import { ApiEntity } from '@backstage/catalog-model';
import { defaultDefinitionWidgets } from './components/ApiDefinitionCard';
import { apiDocsConfigRef } from './config';
import { createComponentRouteRef, rootRoute } from './routes';
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

export const apiDocsPlugin = createPlugin({
  id: 'api-docs',
  routes: {
    root: rootRoute,
  },
  apis: [
    createApiFactory({
      api: apiDocsConfigRef,
      deps: {},
      factory: () => {
        const definitionWidgets = defaultDefinitionWidgets();
        return {
          getApiDefinitionWidget: (apiEntity: ApiEntity) => {
            return definitionWidgets.find(d => d.type === apiEntity.spec.type);
          },
        };
      },
    }),
  ],
  externalRoutes: {
    createComponent: createComponentRouteRef,
  },
});

export const ApiExplorerPage = apiDocsPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/ApiExplorerPage').then(m => m.ApiExplorerPage),
    mountPoint: rootRoute,
  }),
);

export const EntityApiDefinitionCard = apiDocsPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/ApiDefinitionCard').then(m => m.ApiDefinitionCard),
    },
  }),
);

export const EntityConsumedApisCard = apiDocsPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/ApisCards').then(m => m.ConsumedApisCard),
    },
  }),
);

export const EntityConsumingComponentsCard = apiDocsPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/ComponentsCards').then(
          m => m.ConsumingComponentsCard,
        ),
    },
  }),
);

export const EntityProvidedApisCard = apiDocsPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/ApisCards').then(m => m.ProvidedApisCard),
    },
  }),
);

export const EntityProvidingComponentsCard = apiDocsPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/ComponentsCards').then(
          m => m.ProvidingComponentsCard,
        ),
    },
  }),
);

export const EntityHasApisCard = apiDocsPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components/ApisCards').then(m => m.HasApisCard),
    },
  }),
);
