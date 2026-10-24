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

import { SchedulerServiceTaskScheduleDefinitionConfig } from '@backstage/backend-plugin-api';

export interface Config {
  catalog?: {
    processors?: {
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

          /**
           * The namespace of the users created from this org.
           *
           * Defaults to empty string if omitted.
           */
          userNamespace?: string;
        }>;
      };
    };

    providers?: {
      /**
       * GithubEntityProvider configuration
       *
       * Uses "default" as default id for the single config variant.
       */
      github?:
        | {
            /**
             * (Optional) The hostname of your GitHub Enterprise instance.
             * Default: `github.com`.
             */
            host?: string;
            /**
             * (Required, unless `app` is set) Name of your organization account/workspace.
             */
            organization?: string;
            /**
             * (Required, unless `organization` is set) ID of your GitHub App.
             */
            app?: number;
            /**
             * (Optional) Path where to look for `catalog-info.yaml` files.
             * You can use wildcards - `*` or `**` - to search the path and/or the filename
             * Default: `/catalog-info.yaml`.
             */
            catalogPath?: string;
            /**
             * (Optional) Whether to validate locations that exist before emitting them.
             * Default: `false`.
             */
            validateLocationsExist?: boolean;
            /**
             * (Optional) Filter configuration.
             */
            filters?: {
              /**
               * (Optional) String used to filter results based on the branch name.
               */
              branch?: string;
              /**
               * (Optional) Regular expression used to filter results based on the repository name.
               */
              repository?: string;
              /**
               * (Optional) Allow Forks to be evaluated.
               */
              allowForks?: boolean;
              /**
               * (Optional) GitHub topic-based filters.
               */
              topic?: {
                /**
                 * (Optional) An array of strings used to filter in results based on their associated GitHub topics.
                 * If configured, only repositories with one (or more) topic(s) present in the inclusion
                 * filter will be ingested.
                 *
                 * If `include` and `exclude` are used, `exclude` has higher priority.
                 */
                include?: string[];
                /**
                 * (Optional) An array of strings used to filter out results based on their associated GitHub topics.
                 * If configured, all repositories _except_ those with one (or more) topics(s) present in
                 * the exclusion filter will be ingested.
                 *
                 * If `include` and `exclude` are used, `exclude` has higher priority.
                 */
                exclude?: string[];
              };
              /**
               * (Optional) GitHub repository visibility filter.
               */
              visibility?: Array<'private' | 'internal' | 'public'>;
              /**
               * (Optional) Whether to include archived repositories.
               * Default: `false`.
               */
              allowArchived?: boolean;
            };
            /**
             * (Optional) TaskScheduleDefinition for the refresh.
             */
            schedule?: SchedulerServiceTaskScheduleDefinitionConfig;

            /**
             * (Optional) Page sizes for GitHub GraphQL API queries.
             * Reduce these values if hitting RESOURCE_LIMITS_EXCEEDED errors.
             */
            pageSizes?: {
              /**
               * (Optional) Number of repositories to fetch per page when querying repositories.
               * Default: `25`.
               */
              repositories?: number;
            };

            queryLimits?: {
              /**
               * Number of repositories to fetch per chunk in a GraphQL client session.
               * Set this if you are getting 502 errors.
               * It probably means you have more repositories than you are able to fetch in one session.
               * Default: `undefined` - no chunking, fetch all repositories in one session.
               */
              repositoryChunkSize?: number;
            };
          }
        | {
            [name: string]: {
              /**
               * (Optional) The hostname of your GitHub Enterprise instance.
               * Default: `github.com`.
               */
              host?: string;
              /**
               * (Required, unless `app` is set) Name of your organization account/workspace.
               */
              organization?: string;
              /**
               * (Required, unless `organization` is set) ID of your GitHub App.
               */
              app?: number;
              /**
               * (Optional) Path where to look for `catalog-info.yaml` files.
               * You can use wildcards - `*` or `**` - to search the path and/or the filename
               * Default: `/catalog-info.yaml`.
               */
              catalogPath?: string;
              /**
               * (Optional) Whether to validate locations that exist before emitting them.
               * Default: `false`.
               */
              validateLocationsExist?: boolean;
              /**
               * (Optional) Filter configuration.
               */
              filters?: {
                /**
                 * (Optional) String used to filter results based on the branch name.
                 */
                branch?: string;
                /**
                 * (Optional) Regular expression used to filter results based on the repository name.
                 */
                repository?: string;
                /**
                 * (Optional) GitHub topic-based filters.
                 */
                allowForks?: boolean;
                /**
                 * (Optional) Allow Forks to be evaluated.
                 */
                topic?: {
                  /**
                   * (Optional) An array of strings used to filter in results based on their associated GitHub topics.
                   * If configured, only repositories with one (or more) topic(s) present in the inclusion
                   * filter will be ingested.
                   *
                   * If `include` and `exclude` are used, `exclude` has higher priority.
                   */
                  include?: string[];
                  /**
                   * (Optional) An array of strings used to filter out results based on their associated GitHub topics.
                   * If configured, all repositories _except_ those with one (or more) topics(s) present in
                   * the exclusion filter will be ingested.
                   *
                   * If `include` and `exclude` are used, `exclude` has higher priority.
                   */
                  exclude?: string[];
                };
                /**
                 * (Optional) GitHub repository visibility filter.
                 */
                visibility?: Array<'private' | 'internal' | 'public'>;
                /**
                 * (Optional) Whether to include archived repositories.
                 * Default: `false`.
                 */
                allowArchived?: boolean;
              };
              /**
               * (Optional) TaskScheduleDefinition for the refresh.
               */
              schedule?: SchedulerServiceTaskScheduleDefinitionConfig;

              /**
               * (Optional) Page sizes for GitHub GraphQL API queries.
               * Reduce these values if hitting RESOURCE_LIMITS_EXCEEDED errors.
               */
              pageSizes?: {
                /**
                 * (Optional) Number of repositories to fetch per page when querying repositories.
                 * Default: `25`.
                 */
                repositories?: number;
              };
            };
          };

      /**
       * Configuration for catalogModuleGithubOrgEntityProvider
       */
      githubOrg?:
        | {
            /**
             * A stable id for this provider. Entities from this provider will
             * be associated with this ID, so you should take care not to change
             * it over time since that may lead to orphaned entities and/or
             * conflicts.
             *
             * @example "ghe"
             */
            id: string;

            /**
             * The target that this provider should consume.
             *
             * @example "https://mycompany.github.com"
             */
            githubUrl: string;

            /**
             * The list of the GitHub orgs to consume. By default will consume all accessible
             * orgs on the given GitHub instance (support for GitHub App integration only).
             */
            orgs?: string[];

            /**
             * (Optional) Only for GitHub Enterprise. Whether to exclude suspended users when querying organization users.
             * Default: `false`.
             */
            excludeSuspendedUsers?: boolean;

            /**
             * (Optional) When set to true alongside `excludeSuspendedUsers`, use the GitHub REST API
             * to check for suspended users instead of the GraphQL `suspendedAt` field.
             * REST responses are cached using conditional HTTP requests to minimize rate limit usage.
             * Default: `false`.
             */
            experimental_checkForSuspendedUsersWithRest?: boolean;

            /**
             * (Optional) Configuration for the default user transformer.
             * These options only apply when using the built-in transformer;
             * they have no effect if a custom transformer is set via the
             * extension point.
             */
            defaultUserTransformer?: {
              /**
               * (Optional) Whether to prefer organization verified domain emails
               * over the user's public GitHub email when populating user entity profiles.
               * When enabled, the transformer uses the first verified domain email
               * (with plus-addressed routing tags stripped) and falls back to the
               * public email if none are available.
               * Default: `false`.
               */
              useVerifiedEmails?: boolean;
            };

            /**
             * The refresh schedule to use.
             */
            schedule: SchedulerServiceTaskScheduleDefinitionConfig;

            /**
             * (Optional) Page sizes for GitHub GraphQL API queries.
             * Reduce these values if hitting RESOURCE_LIMITS_EXCEEDED errors.
             */
            pageSizes?: {
              /**
               * (Optional) Number of teams to fetch per page when querying organization teams.
               * Default: `25`.
               */
              teams?: number;
              /**
               * (Optional) Number of team members to fetch per page when querying team members.
               * Default: `50`.
               */
              teamMembers?: number;
              /**
               * (Optional) Number of organization members to fetch per page when querying org members.
               * Default: `50`.
               */
              organizationMembers?: number;
            };
          }
        | Array<{
            /**
             * A stable id for this provider. Entities from this provider will
             * be associated with this ID, so you should take care not to change
             * it over time since that may lead to orphaned entities and/or
             * conflicts.
             *
             * @example "ghe"
             */
            id: string;

            /**
             * The target that this provider should consume.
             *
             * @example "https://mycompany.github.com"
             */
            githubUrl: string;

            /**
             * The list of the GitHub orgs to consume. By default will consume all accessible
             * orgs on the given GitHub instance (support for GitHub App integration only).
             */
            orgs?: string[];

            /**
             * (Optional) Only for GitHub Enterprise. Whether to exclude suspended users when querying organization users.
             * Default: `false`.
             */
            excludeSuspendedUsers?: boolean;

            /**
             * (Optional) When set to true alongside `excludeSuspendedUsers`, use the GitHub REST API
             * to check for suspended users instead of the GraphQL `suspendedAt` field.
             * REST responses are cached using conditional HTTP requests to minimize rate limit usage.
             * Default: `false`.
             */
            experimental_checkForSuspendedUsersWithRest?: boolean;

            /**
             * (Optional) Configuration for the default user transformer.
             * These options only apply when using the built-in transformer;
             * they have no effect if a custom transformer is set via the
             * extension point.
             */
            defaultUserTransformer?: {
              /**
               * (Optional) Whether to prefer organization verified domain emails
               * over the user's public GitHub email when populating user entity profiles.
               * When enabled, the transformer uses the first verified domain email
               * (with plus-addressed routing tags stripped) and falls back to the
               * public email if none are available.
               * Default: `false`.
               */
              useVerifiedEmails?: boolean;
            };

            /**
             * The refresh schedule to use.
             */
            schedule: SchedulerServiceTaskScheduleDefinitionConfig;

            /**
             * (Optional) Page sizes for GitHub GraphQL API queries.
             * Reduce these values if hitting RESOURCE_LIMITS_EXCEEDED errors.
             */
            pageSizes?: {
              /**
               * (Optional) Number of teams to fetch per page when querying organization teams.
               * Default: `25`.
               */
              teams?: number;
              /**
               * (Optional) Number of team members to fetch per page when querying team members.
               * Default: `50`.
               */
              teamMembers?: number;
              /**
               * (Optional) Number of organization members to fetch per page when querying org members.
               * Default: `50`.
               */
              organizationMembers?: number;
            };
          }>;
    };
  };
}
