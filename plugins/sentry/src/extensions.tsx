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

import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import { sentryPlugin, rootRouteRef } from './plugin';
import {
  createComponentExtension,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

export const EntitySentryContent = sentryPlugin.provide(
  createRoutableExtension({
    mountPoint: rootRouteRef,
    component: () =>
      import('./components/SentryIssuesWidget').then(
        ({ SentryIssuesWidget }) => {
          const SentryPage = () => {
            const { entity } = useEntity();
            return <SentryIssuesWidget entity={entity} statsFor="24h" />;
          };
          return SentryPage;
        },
      ),
  }),
);

export const EntitySentryCard = sentryPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/SentryIssuesWidget').then(
          ({ SentryIssuesWidget }) => {
            const SentryCard = () => {
              const { entity } = useEntity();
              return <SentryIssuesWidget entity={entity} />;
            };
            return SentryCard;
          },
        ),
    },
  }),
);
