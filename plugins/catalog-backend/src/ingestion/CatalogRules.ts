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

import { Config } from '@backstage/config';
import { LocationSpec, Entity } from '@backstage/catalog-model';

/**
 * A structure for matching entities to a given rule.
 */
type EntityMatcher = {
  kind: string;
};

/**
 * A structure for matching locations to a given rule.
 */
type LocationMatcher = {
  target?: string;
  type: string;
};

/**
 * Rules to apply to catalog entities
 *
 * An undefined list of matchers means match all, an empty list of matchers means match none
 */
type CatalogRule = {
  allow: EntityMatcher[];
  locations?: LocationMatcher[];
};

export class CatalogRulesEnforcer {
  /**
   * Default rules used by the catalog.
   *
   * Denies any location from specifying user or group entities.
   */
  static readonly defaultRules: CatalogRule[] = [
    {
      allow: ['Component', 'API', 'Location'].map(kind => ({ kind })),
    },
  ];

  /**
   * Loads catalog rules from config.
   *
   * This reads `catalog.rules` and defaults to the default rules if no value is present.
   * The value of the config should be a list of config objects, each with a single `allow`
   * field which in turn is a list of entity kinds to allow.
   *
   * If there is no matching rule to allow an ingested entity, it will be rejected by the catalog.
   *
   * It also reads in rules from `catalog.locations`, where each location can have a list
   * of rules for that specific location, specified in a `rules` field.
   *
   * For example:
   *
   * ```yaml
   * catalog:
   *   rules:
   *   - allow: [Component, API]
   *
   *   locations:
   *   - type: url
   *     target: https://github.com/org/repo/blob/master/users.yaml
   *     rules:
   *       - allow: [User, Group]
   *   - type: url
   *     target: https://github.com/org/repo/blob/master/systems.yaml
   *     rules:
   *       - allow: [System]
   * ```
   */
  static fromConfig(config: Config) {
    const rules = new Array<CatalogRule>();

    if (config.has('catalog.rules')) {
      const globalRules = config.getConfigArray('catalog.rules').map(sub => ({
        allow: sub.getStringArray('allow').map(kind => ({ kind })),
      }));
      rules.push(...globalRules);
    } else {
      rules.push(...CatalogRulesEnforcer.defaultRules);
    }

    if (config.has('catalog.locations')) {
      const locationRules = config
        .getConfigArray('catalog.locations')
        .flatMap(locConf => {
          if (!locConf.has('rules')) {
            return [];
          }
          const type = locConf.getString('type');
          const target = locConf.getString('target');

          return locConf.getConfigArray('rules').map(ruleConf => ({
            allow: ruleConf.getStringArray('allow').map(kind => ({ kind })),
            locations: [{ type, target }],
          }));
        });

      rules.push(...locationRules);
    }

    return new CatalogRulesEnforcer(rules);
  }

  constructor(private readonly rules: CatalogRule[]) {}

  /**
   * Checks wether a specific entity/location combination is allowed
   * according to the configured rules.
   */
  isAllowed(entity: Entity, location: LocationSpec) {
    for (const rule of this.rules) {
      if (!this.matchLocation(location, rule.locations)) {
        continue;
      }

      if (this.matchEntity(entity, rule.allow)) {
        return true;
      }
    }

    return false;
  }

  private matchLocation(
    location: LocationSpec,
    matchers?: LocationMatcher[],
  ): boolean {
    if (!matchers) {
      return true;
    }

    for (const matcher of matchers) {
      if (matcher.type !== location?.type) {
        continue;
      }
      if (matcher.target && matcher.target !== location?.target) {
        continue;
      }
      return true;
    }

    return false;
  }

  private matchEntity(entity: Entity, matchers?: EntityMatcher[]): boolean {
    if (!matchers) {
      return true;
    }

    for (const matcher of matchers) {
      if (entity?.kind?.toLowerCase() !== matcher.kind.toLowerCase()) {
        continue;
      }

      return true;
    }

    return false;
  }
}
