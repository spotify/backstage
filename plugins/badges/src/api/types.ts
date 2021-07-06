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

import { Entity } from '@backstage/catalog-model';
import { createApiRef } from '@backstage/core-plugin-api';

export const badgesApiRef = createApiRef<BadgesApi>({
  id: 'plugin.badges.client',
  description: 'Used to make requests to the badges backend',
});

export type BadgeStyle =
  | 'plastic'
  | 'flat'
  | 'flat-square'
  | 'for-the-badge'
  | 'social';

interface Badge {
  color?: string;
  description?: string;
  kind?: 'entity';
  label: string;
  labelColor?: string;
  link?: string;
  message: string;
  style?: BadgeStyle;
}

export interface BadgeSpec {
  /** Badge id */
  id: string;

  /** Badge data */
  badge: Badge;

  /** The URL to the badge image */
  url: string;

  /** The markdown code to use the badge */
  markdown: string;
}

export interface BadgesApi {
  getEntityBadgeSpecs(entity: Entity): Promise<BadgeSpec[]>;
}
