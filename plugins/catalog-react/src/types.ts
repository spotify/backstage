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
  Entity,
  RELATION_OWNED_BY,
  UserEntity,
} from '@backstage/catalog-model';
import { getEntityRelations, isOwnerOf } from './utils';
import { formatEntityRefTitle } from './components/EntityRefLink';

export type EntityFilter = {
  /**
   * Get filters to add to the catalog-backend request. These are a dot-delimited field with
   * value(s) to accept, extracted on the backend by parseEntityFilterParams. For example:
   *   { field: 'kind', values: ['component'] }
   *   { field: 'metadata.name', values: ['component-1', 'component-2'] }
   */
  getCatalogFilters?: () => Record<string, string | string[]>;

  /**
   * Filter entities on the frontend after a catalog-backend request. This function will be called
   * with each backend-resolved entity. This is used when frontend information is required for
   * filtering, such as a user's starred entities.
   *
   * @param entity
   * @param env
   */
  filterEntity?: (entity: Entity) => boolean;
};

export class EntityKindFilter implements EntityFilter {
  constructor(readonly value: string) {}

  getCatalogFilters(): Record<string, string | string[]> {
    return { kind: this.value };
  }
}

export class EntityTypeFilter implements EntityFilter {
  constructor(readonly value: string) {}

  getCatalogFilters(): Record<string, string | string[]> {
    return { 'spec.type': this.value };
  }
}

export class EntityTagFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  filterEntity(entity: Entity): boolean {
    return this.values.every(v => (entity.metadata.tags ?? []).includes(v));
  }
}

export class EntityOwnerFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  filterEntity(entity: Entity): boolean {
    return this.values.some(v =>
      getEntityRelations(entity, RELATION_OWNED_BY).some(
        o => formatEntityRefTitle(o, { defaultKind: 'group' }) === v,
      ),
    );
  }
}

export class EntityLifecycleFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  filterEntity(entity: Entity): boolean {
    return this.values.some(v => entity.spec?.lifecycle === v);
  }
}

export type UserListFilterKind = 'owned' | 'starred' | 'all';
export class UserListFilter implements EntityFilter {
  constructor(
    readonly value: UserListFilterKind,
    readonly user: UserEntity | undefined,
    readonly isStarredEntity: (entity: Entity) => boolean,
  ) {}

  filterEntity(entity: Entity): boolean {
    switch (this.value) {
      case 'owned':
        return this.user !== undefined && isOwnerOf(this.user, entity);
      case 'starred':
        return this.isStarredEntity(entity);
      default:
        return true;
    }
  }
}
