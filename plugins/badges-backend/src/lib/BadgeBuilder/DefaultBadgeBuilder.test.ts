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

import { Config, ConfigReader } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { DefaultBadgeBuilder } from './DefaultBadgeBuilder';
import { BadgeBuilder, BadgeOptions } from './types';
import { Badge, BadgeContext, BadgeFactories, BadgeStyle } from '../../types';

describe('DefaultBadgeBuilder', () => {
  let builder: BadgeBuilder;
  let config: Config;
  let factories: BadgeFactories;

  const badge = {
    description: 'a test badge',
    label: 'test',
    message: 'ok',
    link: 'http://example.com/badgelink',
  };

  beforeAll(() => {
    config = new ConfigReader({
      backend: { baseUrl: 'http://127.0.0.1' },
    });

    factories = {
      testbadge: {
        createBadge: () => badge,
      },
      failbadge: {
        createBadge: () => (undefined as unknown) as Badge, // force a bad return value..
      },
      invalidbadge: {
        createBadge: () => ({ style: 'wrong' as BadgeStyle, ...badge }),
      },
    };
  });

  beforeEach(() => {
    jest.resetAllMocks();
    builder = new DefaultBadgeBuilder(factories);
  });

  it('getBadges() returns all badge factory ids', async () => {
    expect(await builder.getBadges()).toEqual([
      { id: 'testbadge' },
      { id: 'failbadge' },
      { id: 'invalidbadge' },
    ]);
  });

  describe('createBadge[Json|Svg]', () => {
    const context: BadgeContext = {
      badgeUrl: 'http://127.0.0.1/badge/url',
      config,
    };

    it('badge spec', async () => {
      const options: BadgeOptions = {
        badgeInfo: { id: 'testbadge' },
        context,
      };

      const spec = await builder.createBadgeJson(options);
      expect(spec).toEqual({
        badge,
        id: 'testbadge',
        url: context.badgeUrl,
        markdown: `[![a test badge, test: ok](${context.badgeUrl} "a test badge")](${badge.link})`,
      });
    });

    it('badge image', async () => {
      const options: BadgeOptions = {
        badgeInfo: { id: 'testbadge' },
        context,
      };

      const img = await builder.createBadgeSvg(options);
      expect(img).toEqual(expect.stringMatching(/^<svg[^>]*>.*<\/svg>$/));
    });

    it('returns "unknown" badge for missing factory', async () => {
      const options: BadgeOptions = {
        badgeInfo: { id: 'other-id' },
        context,
      };

      const spec = await builder.createBadgeJson(options);
      expect(spec).toEqual({
        badge: {
          label: 'unknown badge',
          message: 'other-id',
          color: 'red',
        },
        id: 'other-id',
        url: context.badgeUrl,
        markdown: `![unknown badge: other-id](${context.badgeUrl})`,
      });
    });

    it('throws InputError when the BadgeFactory.createBadge() fails', async () => {
      expect.assertions(1);
      await expect(
        builder.createBadgeJson({ badgeInfo: { id: 'failbadge' }, context }),
      ).rejects.toEqual(
        new InputError(
          'The badge factory failed to produce a "failbadge" badge with the provided context',
        ),
      );
    });

    it('returns "invalid badge" for bad parameters', async () => {
      expect(
        await builder.createBadgeSvg({
          badgeInfo: { id: 'invalidbadge' },
          context,
        }),
      ).toEqual(expect.stringMatching(/Error: Field `style` must be one of/));
    });
  });
});
