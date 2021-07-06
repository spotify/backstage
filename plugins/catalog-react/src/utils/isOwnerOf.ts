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

import {
  Entity,
  EntityName,
  getEntityName,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import { getEntityRelations } from './getEntityRelations';

/**
 * Get the related entity references.
 */
export function isOwnerOf(owner: Entity, owned: Entity) {
  const possibleOwners: EntityName[] = [
    ...getEntityRelations(owner, RELATION_MEMBER_OF, { kind: 'group' }),
    ...(owner ? [getEntityName(owner)] : []),
  ];

  const owners = getEntityRelations(owned, RELATION_OWNED_BY);

  for (const ownerItem of owners) {
    if (
      possibleOwners.find(
        o =>
          ownerItem.kind.toLowerCase() === o.kind.toLowerCase() &&
          ownerItem.namespace.toLowerCase() === o.namespace.toLowerCase() &&
          ownerItem.name.toLowerCase() === o.name.toLowerCase(),
      ) !== undefined
    ) {
      return true;
    }
  }

  return false;
}
