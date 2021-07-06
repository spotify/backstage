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

import { Config, JsonValue } from '@backstage/config';
import { SearchOptions } from 'ldapjs';
import mergeWith from 'lodash/mergeWith';
import { RecursivePartial } from '@backstage/plugin-catalog-backend';

/**
 * The configuration parameters for a single LDAP provider.
 */
export type LdapProviderConfig = {
  // The prefix of the target that this matches on, e.g.
  // "ldaps://ds.example.net", with no trailing slash.
  target: string;
  // The settings to use for the bind command. If none are specified, the bind
  // command is not issued.
  bind?: BindConfig;
  // The settings that govern the reading and interpretation of users
  users: UserConfig;
  // The settings that govern the reading and interpretation of groups
  groups: GroupConfig;
};

/**
 * The settings to use for the a command.
 */
export type BindConfig = {
  // The DN of the user to auth as, e.g.
  // uid=ldap-robot,ou=robots,ou=example,dc=example,dc=net
  dn: string;
  // The secret of the user to auth as (its password)
  secret: string;
};

/**
 * The settings that govern the reading and interpretation of users.
 */
export type UserConfig = {
  // The DN under which users are stored.
  dn: string;
  // The search options to use.
  // Only the scope, filter, attributes, and paged fields are supported. The
  // default is scope "one" and attributes "*" and "+".
  options: SearchOptions;
  // JSON paths (on a.b.c form) and hard coded values to set on those paths
  set?: { [path: string]: JsonValue };
  // Mappings from well known entity fields, to LDAP attribute names
  map: {
    // The name of the attribute that holds the relative distinguished name of
    // each entry. Defaults to "uid".
    rdn: string;
    // The name of the attribute that shall be used for the value of the
    // metadata.name field of the entity. Defaults to "uid".
    name: string;
    // The name of the attribute that shall be used for the value of the
    // metadata.description field of the entity.
    description?: string;
    // The name of the attribute that shall be used for the value of the
    // spec.profile.displayName field of the entity. Defaults to "cn".
    displayName: string;
    // The name of the attribute that shall be used for the value of the
    // spec.profile.email field of the entity. Defaults to "mail".
    email: string;
    // The name of the attribute that shall be used for the value of the
    // spec.profile.picture field of the entity.
    picture?: string;
    // The name of the attribute that shall be used for the values of the
    // spec.memberOf field of the entity. Defaults to "memberOf".
    memberOf: string;
  };
};

/**
 * The settings that govern the reading and interpretation of groups.
 */
export type GroupConfig = {
  // The DN under which groups are stored.
  dn: string;
  // The search options to use.
  // Only the scope, filter, attributes, and paged fields are supported.
  options: SearchOptions;
  // JSON paths (on a.b.c form) and hard coded values to set on those paths
  set?: { [path: string]: JsonValue };
  // Mappings from well known entity fields, to LDAP attribute names
  map: {
    // The name of the attribute that holds the relative distinguished name of
    // each entry. Defaults to "cn".
    rdn: string;
    // The name of the attribute that shall be used for the value of the
    // metadata.name field of the entity. Defaults to "cn".
    name: string;
    // The name of the attribute that shall be used for the value of the
    // metadata.description field of the entity. Defaults to "description".
    description: string;
    // The name of the attribute that shall be used for the value of the
    // spec.type field of the entity. Defaults to "groupType".
    type: string;
    // The name of the attribute that shall be used for the value of the
    // spec.profile.displayName field of the entity. Defaults to "cn".
    displayName: string;
    // The name of the attribute that shall be used for the value of the
    // spec.profile.email field of the entity.
    email?: string;
    // The name of the attribute that shall be used for the value of the
    // spec.profile.picture field of the entity.
    picture?: string;
    // The name of the attribute that shall be used for the values of the
    // spec.parent field of the entity. Defaults to "memberOf".
    memberOf: string;
    // The name of the attribute that shall be used for the values of the
    // spec.children field of the entity. Defaults to "member".
    members: string;
  };
};

const defaultConfig = {
  users: {
    options: {
      scope: 'one',
      attributes: ['*', '+'],
    },
    map: {
      rdn: 'uid',
      name: 'uid',
      displayName: 'cn',
      email: 'mail',
      memberOf: 'memberOf',
    },
  },
  groups: {
    options: {
      scope: 'one',
      attributes: ['*', '+'],
    },
    map: {
      rdn: 'cn',
      name: 'cn',
      description: 'description',
      displayName: 'cn',
      type: 'groupType',
      memberOf: 'memberOf',
      members: 'member',
    },
  },
};

/**
 * Parses configuration.
 *
 * @param config The root of the LDAP config hierarchy
 */
export function readLdapConfig(config: Config): LdapProviderConfig[] {
  function readBindConfig(
    c: Config | undefined,
  ): LdapProviderConfig['bind'] | undefined {
    if (!c) {
      return undefined;
    }
    return {
      dn: c.getString('dn'),
      secret: c.getString('secret'),
    };
  }

  function readOptionsConfig(c: Config | undefined): SearchOptions {
    if (!c) {
      return {};
    }

    const paged = readOptionsPagedConfig(c);

    return {
      scope: c.getOptionalString('scope') as SearchOptions['scope'],
      filter: formatFilter(c.getOptionalString('filter')),
      attributes: c.getOptionalStringArray('attributes'),
      ...(paged !== undefined ? { paged } : undefined),
    };
  }

  function readOptionsPagedConfig(c: Config): SearchOptions['paged'] {
    const pagedConfig = c.getOptional('paged');
    if (pagedConfig === undefined) {
      return undefined;
    }

    if (pagedConfig === true || pagedConfig === false) {
      return pagedConfig;
    }

    const pageSize = c.getOptionalNumber('paged.pageSize');
    const pagePause = c.getOptionalBoolean('paged.pagePause');
    return {
      ...(pageSize !== undefined ? { pageSize } : undefined),
      ...(pagePause !== undefined ? { pagePause } : undefined),
    };
  }

  function readSetConfig(
    c: Config | undefined,
  ): { [path: string]: JsonValue } | undefined {
    if (!c) {
      return undefined;
    }
    return Object.fromEntries(c.keys().map(path => [path, c.get(path)]));
  }

  function readUserMapConfig(
    c: Config | undefined,
  ): Partial<LdapProviderConfig['users']['map']> {
    if (!c) {
      return {};
    }

    return {
      rdn: c.getOptionalString('rdn'),
      name: c.getOptionalString('name'),
      description: c.getOptionalString('description'),
      displayName: c.getOptionalString('displayName'),
      email: c.getOptionalString('email'),
      picture: c.getOptionalString('picture'),
      memberOf: c.getOptionalString('memberOf'),
    };
  }

  function readGroupMapConfig(
    c: Config | undefined,
  ): Partial<LdapProviderConfig['groups']['map']> {
    if (!c) {
      return {};
    }

    return {
      rdn: c.getOptionalString('rdn'),
      name: c.getOptionalString('name'),
      description: c.getOptionalString('description'),
      type: c.getOptionalString('type'),
      displayName: c.getOptionalString('displayName'),
      email: c.getOptionalString('email'),
      picture: c.getOptionalString('picture'),
      memberOf: c.getOptionalString('memberOf'),
      members: c.getOptionalString('members'),
    };
  }

  function readUserConfig(
    c: Config,
  ): RecursivePartial<LdapProviderConfig['users']> {
    return {
      dn: c.getString('dn'),
      options: readOptionsConfig(c.getOptionalConfig('options')),
      set: readSetConfig(c.getOptionalConfig('set')),
      map: readUserMapConfig(c.getOptionalConfig('map')),
    };
  }

  function readGroupConfig(
    c: Config,
  ): RecursivePartial<LdapProviderConfig['groups']> {
    return {
      dn: c.getString('dn'),
      options: readOptionsConfig(c.getOptionalConfig('options')),
      set: readSetConfig(c.getOptionalConfig('set')),
      map: readGroupMapConfig(c.getOptionalConfig('map')),
    };
  }

  function formatFilter(filter?: string): string | undefined {
    // Remove extra whitespace between blocks to support multiline filters from the configuration
    return filter?.replace(/\s*(\(|\))/g, '$1')?.trim();
  }

  const providerConfigs = config.getOptionalConfigArray('providers') ?? [];
  return providerConfigs.map(c => {
    const newConfig = {
      target: c.getString('target').replace(/\/+$/, ''),
      bind: readBindConfig(c.getOptionalConfig('bind')),
      users: readUserConfig(c.getConfig('users')),
      groups: readGroupConfig(c.getConfig('groups')),
    };
    const merged = mergeWith({}, defaultConfig, newConfig, (_into, from) => {
      // Replace arrays instead of merging, otherwise default behavior
      return Array.isArray(from) ? from : undefined;
    });
    return merged as LdapProviderConfig;
  });
}
