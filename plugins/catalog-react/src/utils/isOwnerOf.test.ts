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
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import { isOwnerOf } from './isOwnerOf';

describe('isOwnerOf', () => {
  it('should be owned by user', () => {
    const ownerEntity = {
      kind: 'User',
      metadata: { name: 'User', namespace: 'Default' },
    } as Entity;
    const ownedEntity = {
      relations: [
        {
          type: RELATION_OWNED_BY,
          target: { kind: 'user', namespace: 'default', name: 'user' },
        },
      ],
    } as Entity;

    expect(isOwnerOf(ownerEntity, ownedEntity)).toBe(true);
  });

  it('should be owned by group', () => {
    const ownerEntity = {
      kind: 'User',
      metadata: { name: 'user' },
      relations: [
        {
          type: RELATION_MEMBER_OF,
          target: { kind: 'group', namespace: 'default', name: 'group' },
        },
      ],
    } as Entity;
    const ownedEntity = {
      relations: [
        {
          type: RELATION_OWNED_BY,
          target: { kind: 'group', namespace: 'default', name: 'group' },
        },
      ],
    } as Entity;

    expect(isOwnerOf(ownerEntity, ownedEntity)).toBe(true);
  });
});
