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

import { Badge, BadgeContext } from '../../types';

export type BadgeInfo = {
  id: string;
};

export type BadgeOptions = {
  badgeInfo: BadgeInfo;
  context: BadgeContext;
};

export type BadgeSpec = {
  /** Badge id */
  id: string;

  /** Badge data */
  badge: Badge;

  /** The URL to the badge image */
  url: string;

  /** The markdown code to use the badge */
  markdown: string;
};

export type BadgeBuilder = {
  getBadges(): Promise<BadgeInfo[]>;
  createBadgeJson(options: BadgeOptions): Promise<BadgeSpec>;
  createBadgeSvg(options: BadgeOptions): Promise<string>;
};
