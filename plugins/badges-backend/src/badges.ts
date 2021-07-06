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

import { ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import { Badge, BadgeContext, BadgeFactories } from './types';

function appTitle(context: BadgeContext): string {
  return context.config.getOptionalString('app.title') || 'Backstage';
}

function entityUrl(context: BadgeContext): string {
  const e = context.entity!;
  const entityUri = `${e.metadata.namespace || ENTITY_DEFAULT_NAMESPACE}/${
    e.kind
  }/${e.metadata.name}`;
  const catalogUrl = `${context.config.getString('app.baseUrl')}/catalog`;
  return `${catalogUrl}/${entityUri}`.toLowerCase();
}

export const createDefaultBadgeFactories = (): BadgeFactories => ({
  pingback: {
    createBadge: (context: BadgeContext): Badge => {
      if (!context.entity) {
        throw new InputError('"pingback" badge only defined for entities');
      }
      return {
        description: `Link to ${context.entity.metadata.name} in ${appTitle(
          context,
        )}`,
        kind: 'entity',
        label: context.entity.kind,
        link: entityUrl(context),
        message: context.entity.metadata.name,
        style: 'flat-square',
      };
    },
  },

  lifecycle: {
    createBadge: (context: BadgeContext): Badge => {
      if (!context.entity) {
        throw new InputError('"lifecycle" badge only defined for entities');
      }
      return {
        description: 'Entity lifecycle badge',
        kind: 'entity',
        label: 'lifecycle',
        link: entityUrl(context),
        message: `${context.entity.spec?.lifecycle || 'unknown'}`,
        style: 'flat-square',
      };
    },
  },

  owner: {
    createBadge: (context: BadgeContext): Badge => {
      if (!context.entity) {
        throw new InputError('"owner" badge only defined for entities');
      }
      return {
        description: 'Entity owner badge',
        kind: 'entity',
        label: 'owner',
        link: entityUrl(context),
        message: `${context.entity.spec?.owner || 'unknown'}`,
        style: 'flat-square',
      };
    },
  },

  docs: {
    createBadge: (context: BadgeContext): Badge => {
      if (!context.entity) {
        throw new InputError('"docs" badge only defined for entities');
      }
      return {
        description: 'Entity docs badge',
        kind: 'entity',
        label: 'docs',
        link: `${entityUrl(context)}/docs`,
        message: context.entity.metadata.name,
        style: 'flat-square',
      };
    },
  },
});
