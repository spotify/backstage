/*
 * Copyright 2020 Spotify AB
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
     * Rules to apply to all catalog entities, from any location.
     *
     * An undefined list of matchers means match all, an empty list of
     * matchers means match none.
     *
     * This is commonly used to put in what amounts to a whitelist of kinds
     * that regular users of Backstage are permitted to register locations
     * for. This can be used to stop them from registering yaml files
     * describing for example a Group entity called "admin" that they make
     * themselves members of, or similar.
     */
    rules?: Array<{
      /**
       * Allow entities of these particular kinds.
       *
       * E.g. ["Component", "API", "Template", "Location"]
       */
      allow: Array<string>;
    }>;

    /**
     * Readonly defines whether the catalog allows writes after startup.
     *
     * Setting 'readonly=false' allows users to register their own components.
     * This is the default value.
     *
     * Setting 'readonly=true' configures catalog to only allow reads. This can
     * be used in combination with static locations to only serve operator
     * provided locations. Effectively this removes the ability to register new
     * components to a running backstage instance.
     *
     */
    readonly?: boolean;

    /**
     * A set of static locations that the catalog shall always keep itself
     * up-to-date with. This is commonly used for large, permanent integrations
     * that are defined by the Backstage operators at an organization, rather
     * than individual things that users register dynamically.
     *
     * These have (optional) rules of their own. These override what the global
     * rules above specify. This way, you can prevent everybody from register
     * e.g. User and Group entities, except for one or a few static locations
     * that have those two kinds explicitly allowed.
     *
     * For example:
     *
     * ```yaml
     * rules:
     *   - allow: [Component, API, Template, Location]
     * locations:
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
    locations?: Array<{
      /**
       * The type of location, e.g. "url".
       */
      type: string;
      /**
       * The target URL of the location, e.g.
       * "https://github.com/org/repo/blob/master/users.yaml".
       */
      target: string;
      /**
       * Optional extra rules that apply to this particular location.
       *
       * These override the global rules above.
       */
      rules?: Array<{
        /**
         * Allow entities of these particular kinds.
         *
         * E.g. ["Group", "User"]
         */
        allow: Array<string>;
      }>;
    }>;

    /**
     * List of processor-specific options and attributes
     */
    processors?: {
      /**
       * GithubOrgReaderProcessor configuration
       *
       * @deprecated Configure a GitHub integration instead.
       */
      githubOrg?: {
        /**
         * The configuration parameters for each single GitHub org provider.
         */
        providers: Array<{
          /**
           * The prefix of the target that this matches on, e.g.
           * "https://github.com", with no trailing slash.
           */
          target: string;
          /**
           * The base URL of the API of this provider, e.g.
           * "https://api.github.com", with no trailing slash.
           *
           * May be omitted specifically for GitHub; then it will be deduced.
           */
          apiBaseUrl?: string;
          /**
           * The authorization token to use for requests to this provider.
           *
           * If no token is specified, anonymous access is used.
           *
           * @visibility secret
           */
          token?: string;
        }>;
      };

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

      /**
       * AwsOrganizationCloudAccountProcessor configuration
       */
      awsOrganization?: {
        provider: {
          /**
           * The role to be assumed by this processor
           *
           */
          roleArn?: string;
        };
      };

      /**
       * MicrosoftGraphOrgReaderProcessor configuration
       */
      microsoftGraphOrg?: {
        /**
         * The configuration parameters for each single Microsoft Graph provider.
         */
        providers: Array<{
          /**
           * The prefix of the target that this matches on, e.g.
           * "https://graph.microsoft.com/v1.0", with no trailing slash.
           */
          target: string;
          /**
           * The auth authority used.
           *
           * Default value "https://login.microsoftonline.com"
           */
          authority?: string;
          /**
           * The tenant whose org data we are interested in.
           */
          tenantId: string;
          /**
           * The OAuth client ID to use for authenticating requests.
           */
          clientId: string;
          /**
           * The OAuth client secret to use for authenticating requests.
           *
           * @visibility secret
           */
          clientSecret: string;
          /**
           * The filter to apply to extract users.
           *
           * E.g. "accountEnabled eq true and userType eq 'member'"
           */
          userFilter?: string;
          /**
           * The filter to apply to extract groups.
           *
           * E.g. "securityEnabled eq false and mailEnabled eq true"
           */
          groupFilter?: string;
        }>;
      };
    };
  };
}
