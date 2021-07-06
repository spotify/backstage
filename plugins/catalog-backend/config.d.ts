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
       * GithubMultiOrgReaderProcessor configuration
       */
      githubMultiOrg?: {
        /**
         * The configuration parameters for each GitHub org to process.
         */
        orgs: Array<{
          /**
           * The name of the GitHub org to process.
           */
          name: string;
          /**
           * The namespace of the group created for this org.
           *
           * Defaults to org name if omitted.
           */
          groupNamespace?: string;
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
    };
  };
}
