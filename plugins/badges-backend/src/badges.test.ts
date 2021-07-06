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

import type { Entity } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import { Config, ConfigReader } from '@backstage/config';
import { BadgeContext, BadgeFactories } from './types';
import { createDefaultBadgeFactories } from './badges';

describe('BadgeFactories', () => {
  let badgeFactories: BadgeFactories;
  let config: Config;

  beforeAll(() => {
    badgeFactories = createDefaultBadgeFactories();
    config = new ConfigReader({
      app: {
        baseUrl: 'http://localhost',
      },
    });
  });

  it('throws when missing entity', () => {
    const context: BadgeContext = {
      badgeUrl: '/dummy/url',
      config,
    };
    expect.assertions(Object.keys(badgeFactories).length);
    for (const badgeFactory of Object.values(badgeFactories)) {
      expect(() => badgeFactory.createBadge(context)).toThrow(InputError);
    }
  });

  it('returns valid badge for entity', () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'service',
      metadata: {
        name: 'test',
      },
    };

    const context: BadgeContext = {
      badgeUrl: '/dummy/url',
      config,
      entity,
    };

    expect.assertions(Object.keys(badgeFactories).length);
    for (const badgeFactory of Object.values(badgeFactories)) {
      const badge = badgeFactory.createBadge(context);
      expect(badge.kind).toEqual('entity');
    }
  });

  it('returns valid link for entity', () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'service',
      metadata: {
        name: 'test',
      },
    };

    const context: BadgeContext = {
      badgeUrl: '/dummy/url',
      config,
      entity,
    };

    expect.assertions(Object.keys(badgeFactories).length);
    for (const badgeFactory of Object.values(badgeFactories)) {
      const badge = badgeFactory.createBadge(context);
      expect(badge.link).toContain(
        'http://localhost/catalog/default/service/test',
      );
    }
  });
});
