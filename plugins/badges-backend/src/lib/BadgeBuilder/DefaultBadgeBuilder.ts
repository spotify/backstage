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

import { InputError } from '@backstage/errors';
import { makeBadge, Format } from 'badge-maker';
import { BadgeBuilder, BadgeInfo, BadgeOptions, BadgeSpec } from './types';
import { Badge, BadgeFactories } from '../../types';

export class DefaultBadgeBuilder implements BadgeBuilder {
  constructor(private readonly factories: BadgeFactories) {}

  public async getBadges(): Promise<BadgeInfo[]> {
    return Object.keys(this.factories).map(id => ({ id }));
  }

  public async createBadgeJson(options: BadgeOptions): Promise<BadgeSpec> {
    const factory = this.factories[options.badgeInfo.id];
    const badge = factory
      ? factory.createBadge(options.context)
      : ({
          label: 'unknown badge',
          message: options.badgeInfo.id,
          color: 'red',
        } as Badge);

    if (!badge) {
      throw new InputError(
        `The badge factory failed to produce a "${options.badgeInfo.id}" badge with the provided context`,
      );
    }

    return {
      badge,
      id: options.badgeInfo.id,
      url: options.context.badgeUrl,
      markdown: this.getMarkdownCode(badge, options.context.badgeUrl),
    };
  }

  public async createBadgeSvg(options: BadgeOptions): Promise<string> {
    const { badge } = await this.createBadgeJson(options);
    try {
      const format = {
        message: badge.message,
        color: badge.color || '#36BAA2',
        label: badge.label || '',
        labelColor: badge.labelColor || '',
        style: badge.style || 'flat-square',
      } as Format;
      return makeBadge(format);
    } catch (err) {
      return makeBadge({
        label: 'invalid badge',
        message: `${err}`,
        color: 'red',
      });
    }
  }

  private getMarkdownCode(params: Badge, badgeUrl: string): string {
    let altText = `${params.label}: ${params.message}`;
    if (params.description && params.description !== params.label) {
      altText = `${params.description}, ${altText}`;
    }
    const tooltip = params.description ? ` "${params.description}"` : '';
    const img = `![${altText}](${badgeUrl}${tooltip})`;
    return params.link ? `[${img}](${params.link})` : img;
  }
}
