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

import { JsonValue } from '@backstage/config';

export interface Config {
  /**
   * Configuration options for the catalog plugin.
   */
  catalog?: {
    /**
     * List of processor-specific options and attributes
     */
    processors?: {
      /**
       * LdapOrgReaderProcessor configuration
       */
      ldapOrg?: {
        /**
         * The configuration parameters for each single LDAP provider.
         */
        providers: Array<{
          /**
           * The prefix of the target that this matches on, e.g.
           * "ldaps://ds.example.net", with no trailing slash.
           */
          target: string;

          /**
           * The settings to use for the bind command. If none are specified,
           * the bind command is not issued.
           */
          bind?: {
            /**
             * The DN of the user to auth as.
             *
             * E.g. "uid=ldap-robot,ou=robots,ou=example,dc=example,dc=net"
             */
            dn: string;
            /**
             * The secret of the user to auth as (its password).
             *
             * @visibility secret
             */
            secret: string;
          };

          /**
           * The settings that govern the reading and interpretation of users.
           */
          users: {
            /**
             * The DN under which users are stored.
             *
             * E.g. "ou=people,ou=example,dc=example,dc=net"
             */
            dn: string;
            /**
             * The search options to use. The default is scope "one" and
             * attributes "*" and "+".
             *
             * It is common to want to specify a filter, to narrow down the set
             * of matching items.
             */
            options: {
              scope?: 'base' | 'one' | 'sub';
              filter?: string;
              attributes?: string | string[];
              paged?:
                | boolean
                | {
                    pageSize?: number;
                    pagePause?: boolean;
                  };
            };
            /**
             * JSON paths (on a.b.c form) and hard coded values to set on those
             * paths.
             *
             * This can be useful for example if you want to hard code a
             * namespace or similar on the generated entities.
             */
            set?: { [key: string]: JsonValue };
            /**
             * Mappings from well known entity fields, to LDAP attribute names
             */
            map?: {
              /**
               * The name of the attribute that holds the relative
               * distinguished name of each entry. Defaults to "uid".
               */
              rdn?: string;
              /**
               * The name of the attribute that shall be used for the value of
               * the metadata.name field of the entity. Defaults to "uid".
               */
              name?: string;
              /**
               * The name of the attribute that shall be used for the value of
               * the metadata.description field of the entity.
               */
              description?: string;
              /**
               * The name of the attribute that shall be used for the value of
               * the spec.profile.displayName field of the entity. Defaults to
               * "cn".
               */
              displayName?: string;
              /**
               * The name of the attribute that shall be used for the value of
               * the spec.profile.email field of the entity. Defaults to
               * "mail".
               */
              email?: string;
              /**
               * The name of the attribute that shall be used for the value of
               * the spec.profile.picture field of the entity.
               */
              picture?: string;
              /**
               * The name of the attribute that shall be used for the values of
               * the spec.memberOf field of the entity. Defaults to "memberOf".
               */
              memberOf?: string;
            };
          };

          /**
           * The settings that govern the reading and interpretation of groups.
           */
          groups: {
            /**
             * The DN under which groups are stored.
             *
             * E.g. "ou=people,ou=example,dc=example,dc=net"
             */
            dn: string;
            /**
             * The search options to use. The default is scope "one" and
             * attributes "*" and "+".
             *
             * It is common to want to specify a filter, to narrow down the set
             * of matching items.
             */
            options: {
              scope?: 'base' | 'one' | 'sub';
              filter?: string;
              attributes?: string | string[];
              paged?:
                | boolean
                | {
                    pageSize?: number;
                    pagePause?: boolean;
                  };
            };
            /**
             * JSON paths (on a.b.c form) and hard coded values to set on those
             * paths.
             *
             * This can be useful for example if you want to hard code a
             * namespace or similar on the generated entities.
             */
            set?: { [key: string]: JsonValue };
            /**
             * Mappings from well known entity fields, to LDAP attribute names
             */
            map?: {
              /**
               * The name of the attribute that holds the relative
               * distinguished name of each entry. Defaults to "cn".
               */
              rdn?: string;
              /**
               * The name of the attribute that shall be used for the value of
               * the metadata.name field of the entity. Defaults to "cn".
               */
              name?: string;
              /**
               * The name of the attribute that shall be used for the value of
               * the metadata.description field of the entity. Defaults to
               * "description".
               */
              description?: string;
              /**
               * The name of the attribute that shall be used for the value of
               * the spec.type field of the entity. Defaults to "groupType".
               */
              type?: string;
              /**
               * The name of the attribute that shall be used for the value of
               * the spec.profile.displayName field of the entity. Defaults to
               * "cn".
               */
              displayName?: string;
              /**
               * The name of the attribute that shall be used for the value of
               * the spec.profile.email field of the entity.
               */
              email?: string;
              /**
               * The name of the attribute that shall be used for the value of
               * the spec.profile.picture field of the entity.
               */
              picture?: string;
              /**
               * The name of the attribute that shall be used for the values of
               * the spec.parent field of the entity. Defaults to "memberOf".
               */
              memberOf?: string;
              /**
               * The name of the attribute that shall be used for the values of
               * the spec.children field of the entity. Defaults to "member".
               */
              members?: string;
            };
          };
        }>;
      };
    };
  };
}
