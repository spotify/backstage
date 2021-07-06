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

import { generatePath } from 'react-router';
import { ResponseError } from '@backstage/errors';
import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { entityRoute } from '@backstage/plugin-catalog-react';
import { BadgesApi, BadgeSpec } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

export class BadgesClient implements BadgesApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  public async getEntityBadgeSpecs(entity: Entity): Promise<BadgeSpec[]> {
    const entityBadgeSpecsUrl = await this.getEntityBadgeSpecsUrl(entity);
    const token = await this.identityApi.getIdToken();
    const response = await fetch(entityBadgeSpecsUrl, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  private async getEntityBadgeSpecsUrl(entity: Entity): Promise<string> {
    const routeParams = this.getEntityRouteParams(entity);
    const path = generatePath(entityRoute.path, routeParams);
    return `${await this.discoveryApi.getBaseUrl(
      'badges',
    )}/entity/${path}/badge-specs`;
  }

  private getEntityRouteParams(entity: Entity) {
    return {
      kind: entity.kind.toLowerCase(),
      namespace:
        entity.metadata.namespace?.toLowerCase() ?? ENTITY_DEFAULT_NAMESPACE,
      name: entity.metadata.name,
    };
  }
}
