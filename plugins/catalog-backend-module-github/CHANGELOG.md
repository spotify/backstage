# @backstage/plugin-catalog-backend-module-github

## 0.14.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 0.14.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-catalog-common@1.2.1
  - @backstage/plugin-catalog-node@2.2.6
  - @backstage/plugin-events-node@0.4.27

## 0.14.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1
  - @backstage/plugin-events-node@0.4.27-next.1

## 0.14.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## 0.14.0

### Minor Changes

- 6ecff59: The GitHub multi-org entity provider now logs a clear warning and aborts ingestion when no GitHub App installation is found for an org, instead of failing with a confusing rate-limit or authentication error. This prevents silent deletion of existing catalog entities.

### Patch Changes

- 736d84e: Use locale-insensitive Unicode casing for consistent string handling across environments.
- Updated dependencies
  - @backstage/integration@2.1.2
  - @backstage/plugin-catalog-common@1.2.0
  - @backstage/catalog-model@1.10.1
  - @backstage/config@1.3.9
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5
  - @backstage/plugin-events-node@0.4.26

## 0.14.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.2.0-next.0
  - @backstage/config@1.3.9-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/integration@2.1.2-next.1

## 0.14.0-next.0

### Minor Changes

- 6ecff59: The GitHub multi-org entity provider now logs a clear warning and aborts ingestion when no GitHub App installation is found for an org, instead of failing with a confusing rate-limit or authentication error. This prevents silent deletion of existing catalog entities.

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0
  - @backstage/plugin-events-node@0.4.26-next.0

## 0.13.5

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/integration@2.1.0
  - @backstage/plugin-catalog-node@2.2.4
  - @backstage/plugin-events-node@0.4.25

## 0.13.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.0-next.0

## 0.13.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0
  - @backstage/plugin-events-node@0.4.25-next.0

## 0.13.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/plugin-catalog-node@2.2.3
  - @backstage/plugin-events-node@0.4.24

## 0.13.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0
  - @backstage/plugin-events-node@0.4.24-next.0

## 0.13.3

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.0.3
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-catalog-node@2.2.2
  - @backstage/plugin-events-node@0.4.23

## 0.13.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.0.3-next.0
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0
  - @backstage/plugin-events-node@0.4.23-next.0

## 0.13.2

### Patch Changes

- d745f1c: Added experimental support for checking suspended users via the GitHub REST API instead of the GraphQL `suspendedAt` field. Enable by setting both `excludeSuspendedUsers: true` and `experimental_checkForSuspendedUsersWithRest: true` in the provider config. When enabled, responses are cached using conditional HTTP requests to minimize REST API rate limit usage.
- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- aa313f0: The `GithubMultiOrgEntityProvider` now emits entities in a stable order during full mutations. Entities are sorted by entity ref, with the location annotation as a tiebreaker for entities that share the same ref. This prevents entity data from flickering between different GitHub orgs across refresh cycles when `alwaysUseDefaultNamespace` is enabled and teams with identical slugs exist in multiple orgs.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/integration@2.0.2
  - @backstage/config@1.3.8
  - @backstage/plugin-catalog-common@1.1.10
  - @backstage/plugin-events-node@0.4.22

## 0.13.2-next.1

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.1
  - @backstage/plugin-catalog-node@2.2.1-next.1

## 0.13.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/integration@2.0.2-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/plugin-events-node@0.4.22-next.0
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.10-next.0

## 0.13.1

### Patch Changes

- b11e338: Fixed a bug where `GithubEntityProvider` with `validateLocationsExist: true` and `filters.branch` configured would always check for the catalog file on the repository's default branch (`HEAD`) instead of the configured branch. This caused repositories to be filtered out when the catalog file only existed on the non-default branch.
- edf465f: Removed the `type-fest` dev dependency, replacing its `PartialDeep` import with a local helper type in tests.
- cca9fc2: Added automatic retry on temporary errors (like 5XX) to the shared GitHub GraphQL client used by `GithubOrgEntityProvider` and replaced the GraphQL client in `GithubEntityProvider` by this one as well, improving resilience against intermittent GitHub API failures.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/integration@2.0.1
  - @backstage/config@1.3.7
  - @backstage/plugin-catalog-common@1.1.9
  - @backstage/plugin-events-node@0.4.21

## 0.13.1-next.2

### Patch Changes

- cca9fc2: Added automatic retry on temporary errors (like 5XX) to the shared GitHub GraphQL client used by `GithubOrgEntityProvider` and replaced the GraphQL client in `GithubEntityProvider` by this one as well, improving resilience against intermittent GitHub API failures.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/integration@2.0.1-next.0
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0
  - @backstage/plugin-events-node@0.4.21-next.2
  - @backstage/plugin-catalog-common@1.1.9-next.0

## 0.13.1-next.1

### Patch Changes

- b11e338: Fixed a bug where `GithubEntityProvider` with `validateLocationsExist: true` and `filters.branch` configured would always check for the catalog file on the repository's default branch (`HEAD`) instead of the configured branch. This caused repositories to be filtered out when the catalog file only existed on the non-default branch.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1
  - @backstage/plugin-events-node@0.4.21-next.1

## 0.13.1-next.0

### Patch Changes

- edf465f: Removed the `type-fest` dev dependency, replacing its `PartialDeep` import with a local helper type in tests.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/plugin-events-node@0.4.21-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration@2.0.0
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8

## 0.13.0

### Minor Changes

- b11c2cd: The default user transformer now prefers organization verified domain emails over the user's public GitHub email when populating the user entity profile. It also strips plus-addressed routing tags that GitHub adds to these emails.

  If you want to retain the old behavior, you can do so with a custom user transformer using the `githubOrgEntityProviderTransformsExtensionPoint`:

  ```ts
  import { createBackendModule } from '@backstage/backend-plugin-api';
  import { githubOrgEntityProviderTransformsExtensionPoint } from '@backstage/plugin-catalog-backend-module-github-org';
  import { defaultUserTransformer } from '@backstage/plugin-catalog-backend-module-github';

  export default createBackendModule({
    pluginId: 'catalog',
    moduleId: 'github-org-custom-transforms',
    register(env) {
      env.registerInit({
        deps: {
          transforms: githubOrgEntityProviderTransformsExtensionPoint,
        },
        async init({ transforms }) {
          transforms.setUserTransformer(async (item, ctx) => {
            const entity = await defaultUserTransformer(item, ctx);
            if (entity && item.email) {
              entity.spec.profile!.email = item.email;
            }
            return entity;
          });
        },
      });
    },
  });
  ```

### Patch Changes

- 6738cf0: build(deps): bump `minimatch` from 9.0.5 to 10.2.1
- 106d1b2: Added a `defaultUserTransformer.useVerifiedEmails` config option for the `githubOrg` provider. When set to `true`, the default user transformer prefers organization verified domain emails over the user's public GitHub email. Defaults to `false`, which uses only the public GitHub email.

  This option has no effect when a custom user transformer is set via the `githubOrgEntityProviderTransformsExtensionPoint`.

  ```yaml
  catalog:
    providers:
      githubOrg:
        production:
          githubUrl: https://github.com
          orgs:
            - my-org
          defaultUserTransformer:
            useVerifiedEmails: true
  ```

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/integration@2.0.0
  - @backstage/plugin-catalog-node@2.1.0
  - @backstage/catalog-model@1.7.7
  - @backstage/plugin-events-node@0.4.20

## 0.13.0-next.2

### Patch Changes

- 106d1b2: Added a `defaultUserTransformer.useVerifiedEmails` config option for the `githubOrg` provider. When set to `true`, the default user transformer prefers organization verified domain emails over the user's public GitHub email. Defaults to `false`, which uses only the public GitHub email.

  This option has no effect when a custom user transformer is set via the `githubOrgEntityProviderTransformsExtensionPoint`.

  ```yaml
  catalog:
    providers:
      githubOrg:
        production:
          githubUrl: https://github.com
          orgs:
            - my-org
          defaultUserTransformer:
            useVerifiedEmails: true
  ```

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/integration@2.0.0-next.2
  - @backstage/plugin-catalog-node@2.1.0-next.2
  - @backstage/plugin-events-node@0.4.20-next.1

## 0.13.0-next.1

### Minor Changes

- b11c2cd: The default user transformer now prefers organization verified domain emails over the user's public GitHub email when populating the user entity profile. It also strips plus-addressed routing tags that GitHub adds to these emails.

  If you want to retain the old behavior, you can do so with a custom user transformer using the `githubOrgEntityProviderTransformsExtensionPoint`:

  ```ts
  import { createBackendModule } from '@backstage/backend-plugin-api';
  import { githubOrgEntityProviderTransformsExtensionPoint } from '@backstage/plugin-catalog-backend-module-github-org';
  import { defaultUserTransformer } from '@backstage/plugin-catalog-backend-module-github';

  export default createBackendModule({
    pluginId: 'catalog',
    moduleId: 'github-org-custom-transforms',
    register(env) {
      env.registerInit({
        deps: {
          transforms: githubOrgEntityProviderTransformsExtensionPoint,
        },
        async init({ transforms }) {
          transforms.setUserTransformer(async (item, ctx) => {
            const entity = await defaultUserTransformer(item, ctx);
            if (entity && item.email) {
              entity.spec.profile!.email = item.email;
            }
            return entity;
          });
        },
      });
    },
  });
  ```

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.0.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.1
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-events-node@0.4.20-next.0

## 0.12.3-next.0

### Patch Changes

- 6738cf0: build(deps): bump `minimatch` from 9.0.5 to 10.2.1
- Updated dependencies
  - @backstage/integration@1.21.0-next.0
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-events-node@0.4.20-next.0

## 0.12.2

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- 7455dae: Use node prefix on native imports
- 34cc520: Implemented translation of webhook events into `catalogScmEventsServiceRef` events.
- Updated dependencies
  - @backstage/integration@1.20.0
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-events-node@0.4.19

## 0.12.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.20.0-next.2
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-events-node@0.4.19-next.0

## 0.12.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.20.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1

## 0.12.2-next.0

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/integration@1.19.3-next.0
  - @backstage/plugin-events-node@0.4.19-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.8-next.0

## 0.12.1

### Patch Changes

- cb4b907: Improved efficiency of `GithubOrgEntityProvider` membership event handling and edit team. The provider now fetches only the specific user's teams instead of all organization users when processing membership events, and uses `addEntitiesOperation` instead of `replaceEntitiesOperation` to avoid unnecessary entity deletions.
- Updated dependencies
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/integration@1.19.2

## 0.12.1-next.1

### Patch Changes

- cb4b907: Improved efficiency of `GithubOrgEntityProvider` membership event handling and edit team. The provider now fetches only the specific user's teams instead of all organization users when processing membership events, and uses `addEntitiesOperation` instead of `replaceEntitiesOperation` to avoid unnecessary entity deletions.

## 0.12.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.19.2-next.0

## 0.12.0

### Minor Changes

- b3286d5: Added the `github.com/user-id` annotation to store GitHub's user ID (immutable) in user entities. Also includes addition of the `userIdMatchingUserEntityAnnotation` sign-in resolver that matches users by the new ID.

### Patch Changes

- ed5a7a3: Introduce new configuration option to exclude suspended users from GitHub Enterprise instances.

  When it’s set to true, suspended users won’t be returned when querying the organization users for GitHub Enterprise instances.
  Note that this option should be used only against GitHub Enterprise instances, the property does not exist in the github.com GraphQL schema, setting it will cause a schema validation error and the syncing of users will fail.

- a413977: Added configurable `pageSizes` option to `GithubOrgEntityProvider` for GitHub GraphQL API queries to prevent `RESOURCE_LIMITS_EXCEEDED` errors with organizations with large number of teams and members. This aligns the configuration options with `GithubMultiOrgEntityProvider`.
- Updated dependencies
  - @backstage/integration@1.19.0
  - @backstage/plugin-events-node@0.4.18
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1

## 0.11.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.18-next.1
  - @backstage/integration@1.18.3-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-catalog-node@1.20.1-next.1

## 0.11.3-next.1

### Patch Changes

- ed5a7a3: Introduce new configuration option to exclude suspended users from GitHub Enterprise instances.

  When it’s set to true, suspended users won’t be returned when querying the organization users for GitHub Enterprise instances.
  Note that this option should be used only against GitHub Enterprise instances, the property does not exist in the github.com GraphQL schema, setting it will cause a schema validation error and the syncing of users will fail.

## 0.11.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/integration@1.18.3-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/plugin-events-node@0.4.18-next.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## 0.11.2

### Patch Changes

- 999d1c1: Added configurable `pageSizes` for GitHub GraphQL API queries to prevent `RESOURCE_LIMITS_EXCEEDED` errors with organizations with large number of repositories. Please see the [GitHub Discovery documentation](https://backstage.io/docs/integrations/github/discovery#configuration) for new configuration options.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## 0.11.2-next.1

### Patch Changes

- 999d1c1: Added configurable `pageSizes` for GitHub GraphQL API queries to prevent `RESOURCE_LIMITS_EXCEEDED` errors with organizations with large number of repositories. Please see the [GitHub Discovery documentation](https://backstage.io/docs/integrations/github/discovery#configuration) for new configuration options.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-events-node@0.4.17-next.1

## 0.11.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.17-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/integration@1.18.2-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/plugin-catalog-common@1.1.7-next.0
  - @backstage/plugin-catalog-node@1.19.2-next.0

## 0.11.1

### Patch Changes

- 99fcf98: Removed unused dependencies
- Updated dependencies
  - @backstage/integration@1.18.1
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-common@1.1.6
  - @backstage/plugin-catalog-node@1.19.1
  - @backstage/plugin-events-node@0.4.16

## 0.11.1-next.2

### Patch Changes

- 99fcf98: Removed unused dependencies

## 0.11.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/integration@1.18.1-next.1
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-catalog-backend@3.1.1-next.1
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-events-node@0.4.16-next.0
  - @backstage/plugin-catalog-common@1.1.6-next.0
  - @backstage/catalog-client@1.12.0

## 0.11.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.1.1-next.0
  - @backstage/integration@1.18.1-next.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/catalog-client@1.12.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-events-node@0.4.15

## 0.11.0

### Minor Changes

- 03bdc68: Added support for discovery by app

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.1.0
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/catalog-client@1.12.0
  - @backstage/plugin-events-node@0.4.15
  - @backstage/integration@1.18.0
  - @backstage/backend-plugin-api@1.4.3

## 0.11.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.0.2-next.1
  - @backstage/catalog-client@1.12.0-next.0
  - @backstage/plugin-catalog-node@1.19.0-next.1
  - @backstage/integration@1.18.0-next.0

## 0.11.0-next.0

### Minor Changes

- 03bdc68: Added support for discovery by app

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.0.2-next.0
  - @backstage/integration@1.18.0-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0
  - @backstage/plugin-events-node@0.4.15-next.0

## 0.10.2

### Patch Changes

- d421b16: This change introduces single user versions of the user group resolution code in the multi org provider that will not page through all membership when updating a single user.
- f6c64d1: Fix GitHub catalog entity provider branch matching on event processing.
- Updated dependencies
  - @backstage/plugin-catalog-backend@3.0.1
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## 0.10.2-next.1

### Patch Changes

- f6c64d1: Fix GitHub catalog entity provider branch matching on event processing.
- Updated dependencies
  - @backstage/plugin-catalog-backend@3.0.1-next.1

## 0.10.2-next.0

### Patch Changes

- d421b16: This change introduces single user versions of the user group resolution code in the multi org provider that will not page through all membership when updating a single user.
- Updated dependencies
  - @backstage/catalog-client@1.11.0-next.0
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/plugin-catalog-backend@3.0.1-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/plugin-events-node@0.4.14-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/integration@1.17.1
  - @backstage/plugin-catalog-common@1.1.5

## 0.10.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.0.0
  - @backstage/config@1.3.3
  - @backstage/catalog-model@1.7.5
  - @backstage/catalog-client@1.10.2
  - @backstage/integration@1.17.1
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.17.2
  - @backstage/plugin-events-node@0.4.13

## 0.10.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/catalog-client@1.10.2-next.0
  - @backstage/integration@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-catalog-backend@3.0.0-next.1
  - @backstage/plugin-catalog-common@1.1.5-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0
  - @backstage/plugin-events-node@0.4.13-next.0

## 0.10.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.0.0-next.0
  - @backstage/integration@1.17.1-next.0
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/plugin-events-node@0.4.12
  - @backstage/catalog-client@1.10.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4

## 0.10.0

### Minor Changes

- 7c0dfb0: GitHub organization now matches in a case-insensitive manner when processing events.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1
  - @backstage/plugin-catalog-backend@2.1.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-events-node@0.4.12

## 0.9.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@2.0.1-next.2
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/plugin-events-node@0.4.12-next.1

## 0.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/plugin-catalog-backend@2.0.1-next.1
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-events-node@0.4.12-next.1

## 0.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@2.0.1-next.0
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0
  - @backstage/plugin-events-node@0.4.12-next.0

## 0.9.0

### Minor Changes

- ff335e5: **BREAKING** The `GithubLocationAnalyzer` now requires the `AuthService` and the `CatalogService` when being constructed and the `TokenManger` has been removed.

### Patch Changes

- ee9f59f: Added filter to include archived repositories
- Updated dependencies
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-backend@2.0.0
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/catalog-client@1.10.0
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-events-node@0.4.11

## 0.9.0-next.3

### Patch Changes

- ee9f59f: Added filter to include archived repositories
- Updated dependencies
  - @backstage/plugin-catalog-backend@2.0.0-next.3
  - @backstage/integration@1.17.0-next.3
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.2
  - @backstage/plugin-events-node@0.4.11-next.2

## 0.9.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0-next.2
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-backend@2.0.0-next.2
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-events-node@0.4.11-next.1

## 0.9.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@2.0.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-events-node@0.4.11-next.1

## 0.9.0-next.0

### Minor Changes

- ff335e5: **BREAKING** The `GithubLocationAnalyzer` now requires the `AuthService` and the `CatalogService` when being constructed and the `TokenManger` has been removed.

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.4-next.0
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/plugin-catalog-backend@1.32.2-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-events-node@0.4.11-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3

## 0.8.0

### Minor Changes

- f0c22eb: **BREAKING**: Explicitly rejects branch names containing a slash character.

  The module now rejects any configuration that contains slashes in branch names. The reason for this is that the ingestion will run into downstream problems if they were let through. If you had configuration with a slash in the branch name in `filters.branch`, your application may fail to start up.

  If you are affected by this, please move over to using branches that do not have slashes in them.

### Patch Changes

- 16648ef: Added `validateLocationsExist` to the config definition where it was missing.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/plugin-catalog-backend@1.32.1
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/integration@1.16.3
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.10

## 0.8.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.32.1-next.1
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.3-next.0
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.9

## 0.8.0-next.1

### Minor Changes

- f0c22eb: **BREAKING**: Explicitly rejects branch names containing a slash character.

  The module now rejects any configuration that contains slashes in branch names. The reason for this is that the ingestion will run into downstream problems if they were let through. If you had configuration with a slash in the branch name in `filters.branch`, your application may fail to start up.

  If you are affected by this, please move over to using branches that do not have slashes in them.

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.3-next.0
  - @backstage/plugin-catalog-backend@1.32.1-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-events-node@0.4.9

## 0.7.12-next.0

### Patch Changes

- 16648ef: Added `validateLocationsExist` to the config definition where it was missing.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.32.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-events-node@0.4.9

## 0.7.11

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.2
  - @backstage/plugin-catalog-backend@1.32.0
  - @backstage/plugin-events-node@0.4.9
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1

## 0.7.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.32.0-next.2
  - @backstage/integration@1.16.2-next.0
  - @backstage/plugin-events-node@0.4.9-next.2
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1

## 0.7.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.32.0-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-events-node@0.4.9-next.1

## 0.7.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.31.1-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.16.1-next.0
  - @backstage/plugin-events-node@0.4.9-next.0

## 0.7.10

### Patch Changes

- eb80a1a: Minor doc string update
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.31.0
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-catalog-node@1.16.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.8

## 0.7.10-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/plugin-catalog-backend@1.31.0-next.3
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.2
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.7.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-backend@1.31.0-next.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.1

## 0.7.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.31.0-next.1
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.8-next.0

## 0.7.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.31.0-next.0
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.8-next.0

## 0.7.9

### Patch Changes

- 8379bf4: Remove usages of `PluginDatabaseManager` and `PluginEndpointDiscovery` and replace with their equivalent service types
- 64dd0b8: Added rate limiting and throttling to `GithubOrgEntityProvider`
- 4ab00e4: Fixes an issue in `GithubMultiOrgEntityProvider` that caused an error when processing teams without a parent.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.30.0
  - @backstage/integration@1.16.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.15.1
  - @backstage/plugin-events-node@0.4.7

## 0.7.9-next.1

### Patch Changes

- 4ab00e4: Fixes an issue in `GithubMultiOrgEntityProvider` that caused an error when processing teams without a parent.
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/plugin-catalog-backend@1.30.0-next.1
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/plugin-events-node@0.4.7-next.1
  - @backstage/catalog-client@1.9.1-next.0
  - @backstage/plugin-catalog-common@1.1.3-next.0
  - @backstage/integration@1.16.1-next.0

## 0.7.9-next.0

### Patch Changes

- 8379bf4: Remove usages of `PluginDatabaseManager` and `PluginEndpointDiscovery` and replace with their equivalent service types
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.30.0-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-client@1.9.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/integration@1.16.0
  - @backstage/plugin-catalog-common@1.1.2
  - @backstage/plugin-catalog-node@1.15.1-next.0
  - @backstage/plugin-events-node@0.4.7-next.0

## 0.7.8

### Patch Changes

- 468bbcc: Pass in a default schedule to the `GithubEntityProvider` if none is provided
- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.29.0
  - @backstage/integration@1.16.0
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/plugin-events-node@0.4.6
  - @backstage/catalog-client@1.9.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/plugin-catalog-common@1.1.2

## 0.7.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.29.0-next.2
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/plugin-events-node@0.4.6-next.2
  - @backstage/catalog-client@1.9.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/integration@1.16.0-next.1
  - @backstage/plugin-catalog-common@1.1.2-next.0

## 0.7.8-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.29.0-next.1
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/catalog-client@1.9.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/integration@1.16.0-next.0
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-events-node@0.4.6-next.1

## 0.7.8-next.0

### Patch Changes

- 468bbcc: Pass in a default schedule to the `GithubEntityProvider` if none is provided
- Updated dependencies
  - @backstage/integration@1.16.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-catalog-backend@1.28.1-next.0
  - @backstage/plugin-events-node@0.4.6-next.0
  - @backstage/catalog-client@1.8.1-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-catalog-node@1.14.1-next.0

## 0.7.7

### Patch Changes

- 9790c02: Fixed an issue in `GithubOrgEntityProvider` that caused an error when processing teams without a parent.
- 4e58bc7: Upgrade to uuid v11 internally
- Updated dependencies
  - @backstage/catalog-client@1.8.0
  - @backstage/config@1.3.0
  - @backstage/plugin-events-node@0.4.5
  - @backstage/plugin-catalog-backend@1.28.0
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/catalog-model@1.7.1
  - @backstage/integration@1.15.2
  - @backstage/plugin-catalog-common@1.1.1

## 0.7.7-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.3
  - @backstage/plugin-catalog-backend@1.28.0-next.3
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.14.0-next.2

## 0.7.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/plugin-catalog-backend@1.28.0-next.2
  - @backstage/plugin-events-node@0.4.5-next.2
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0

## 0.7.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-backend@1.27.2-next.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.14.0-next.1
  - @backstage/plugin-events-node@0.4.4-next.1

## 0.7.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.3-next.0
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-backend@1.27.2-next.0
  - @backstage/plugin-catalog-common@1.1.0

## 0.7.5

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.27.0
  - @backstage/plugin-events-node@0.4.1
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/integration@1.15.1
  - @backstage/catalog-client@1.7.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0

## 0.7.5-next.2

### Patch Changes

- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-catalog-backend@1.26.2-next.2
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-events-node@0.4.1-next.1

## 0.7.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.26.2-next.1
  - @backstage/integration@1.15.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-events-node@0.4.1-next.0

## 0.7.4-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.26.1-next.0
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.1-next.0

## 0.7.3

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- 5edd344: Refactor to use injected catalog client in the new backend system
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-catalog-backend@1.26.0
  - @backstage/catalog-client@1.7.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/integration@1.15.0
  - @backstage/plugin-events-node@0.4.0
  - @backstage/config@1.2.0

## 0.7.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-client@1.7.0-next.1
  - @backstage/plugin-catalog-backend@1.26.0-next.2
  - @backstage/integration@1.15.0-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.2
  - @backstage/plugin-events-node@0.4.0-next.2

## 0.7.3-next.1

### Patch Changes

- 5edd344: Refactor to use injected catalog client in the new backend system
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/catalog-client@1.6.7-next.0
  - @backstage/plugin-catalog-backend@1.25.3-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.14.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.1
  - @backstage/plugin-events-node@0.4.0-next.1

## 0.7.3-next.0

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-catalog-backend@1.25.3-next.0
  - @backstage/plugin-events-node@0.4.0-next.0
  - @backstage/plugin-catalog-node@1.12.7-next.0
  - @backstage/catalog-client@1.6.6
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.14.0
  - @backstage/plugin-catalog-common@1.0.26

## 0.7.0

### Minor Changes

- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- c1eb809: Fix GitHub `repository` event support.

  - `$.repository.organization` is only provided for `push` events. Switched to `$.organization.login` instead.
  - `$.repository.url` is not always returning the expected and required value. Use `$.repository.html_url` instead.

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-catalog-backend@1.25.0
  - @backstage/plugin-catalog-node@1.12.5
  - @backstage/integration@1.14.0
  - @backstage/catalog-model@1.6.0
  - @backstage/catalog-client@1.6.6
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-events-node@0.3.9

## 0.6.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/catalog-client@1.6.6-next.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-backend@1.24.1-next.3
  - @backstage/plugin-catalog-common@1.0.26-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.3
  - @backstage/plugin-events-node@0.3.9-next.3

## 0.6.6-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-catalog-backend@1.24.1-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.2
  - @backstage/plugin-events-node@0.3.9-next.2
  - @backstage/plugin-catalog-common@1.0.26-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.6.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.24.1-next.1
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-common@1.0.26-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-events-node@0.3.9-next.1

## 0.6.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/plugin-catalog-backend@1.24.1-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/plugin-events-node@0.3.9-next.0

## 0.6.5

### Patch Changes

- 9112efc: Adds support for `repository` events.

  The provider adds a subscription to the topic `github.repository`.

  Hereby, it supports events of type `repository` with actions

  - `archived`
  - `deleted`
  - `edited`
  - `renamed`
  - `transferred`
  - `unarchived`

  Actions skipped as they don't require entity changes:

  - `created`
  - `privatized`
  - `publicized`

  If the config option `validateLocationsExist` is enabled, an API request
  is necessary and will be executed.
  This affects the actions `renamed`, `transferred`, and `unarchive`
  of event type `repository`.

  Catalog entities related to the `GithubEntityProvider` instance will be adjusted
  according to action and its meaning for them.

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/integration@1.13.0
  - @backstage/plugin-events-node@0.3.8
  - @backstage/plugin-catalog-backend@1.24.0
  - @backstage/plugin-catalog-node@1.12.4
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.6.5-next.1

### Patch Changes

- 9112efc: Adds support for `repository` events.

  The provider adds a subscription to the topic `github.repository`.

  Hereby, it supports events of type `repository` with actions

  - `archived`
  - `deleted`
  - `edited`
  - `renamed`
  - `transferred`
  - `unarchived`

  Actions skipped as they don't require entity changes:

  - `created`
  - `privatized`
  - `publicized`

  If the config option `validateLocationsExist` is enabled, an API request
  is necessary and will be executed.
  This affects the actions `renamed`, `transferred`, and `unarchive`
  of event type `repository`.

  Catalog entities related to the `GithubEntityProvider` instance will be adjusted
  according to action and its meaning for them.

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.24.0-next.1
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/plugin-catalog-node@1.12.4-next.1
  - @backstage/plugin-events-node@0.3.8-next.1

## 0.6.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-catalog-backend@1.23.2-next.0
  - @backstage/plugin-catalog-node@1.12.3-next.0
  - @backstage/plugin-events-node@0.3.7-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.24

## 0.6.2

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- 67d0530: Fix bug in root repo import where catalog-info.yaml.hcl file is found by search and breaks the import
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/plugin-catalog-backend@1.23.0
  - @backstage/integration@1.12.0
  - @backstage/plugin-catalog-node@1.12.1
  - @backstage/plugin-events-node@0.3.5
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.6.2-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-catalog-backend@1.23.0-next.3
  - @backstage/plugin-catalog-common@1.0.24-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.2
  - @backstage/plugin-events-node@0.3.5-next.2
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.6.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-catalog-backend@1.23.0-next.2
  - @backstage/plugin-catalog-node@1.12.1-next.1
  - @backstage/plugin-events-node@0.3.5-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.23

## 0.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-catalog-backend@1.23.0-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0

## 0.6.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-catalog-backend@1.23.0-next.0
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.11.0
  - @backstage/plugin-catalog-common@1.0.23

## 0.6.1

### Patch Changes

- 0b50143: GitHub push events now schedule a refresh on entities that have a `refresh_key` matching the `catalogPath` config itself.
  This allows to support a `catalogPath` configuration that uses glob patterns.
- f2a2a83: Updated to use the new `catalogAnalysisExtensionPoint` API.
- 5bdeaa7: Added `alwaysUseDefaultNamespace` option to `GithubMultiOrgEntityProvider`.

  If set to true, the provider will use `default` as the namespace for all group entities. Groups with the same name across different orgs will be considered the same group.

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0
  - @backstage/plugin-catalog-backend@1.22.0
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-events-node@0.3.4
  - @backstage/integration@1.11.0
  - @backstage/catalog-client@1.6.5
  - @backstage/plugin-catalog-common@1.0.23

## 0.6.1-next.2

### Patch Changes

- 0b50143: GitHub push events now schedule a refresh on entities that have a `refresh_key` matching the `catalogPath` config itself.
  This allows to support a `catalogPath` configuration that uses glob patterns.
- f2a2a83: Updated to use the new `catalogAnalysisExtensionPoint` API.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0-next.2
  - @backstage/plugin-catalog-backend@1.22.0-next.2
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-events-node@0.3.4-next.2
  - @backstage/integration@1.11.0-next.0

## 0.6.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-catalog-backend@1.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-events-node@0.3.4-next.1
  - @backstage/plugin-catalog-node@1.11.2-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.22.0-next.0
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/catalog-client@1.6.5-next.0
  - @backstage/plugin-catalog-common@1.0.23-next.0
  - @backstage/plugin-catalog-node@1.11.2-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.10.0
  - @backstage/plugin-events-node@0.3.4-next.0

## 0.6.0

### Minor Changes

- 29c3898: Remove use of `EventBroker` and `EventSubscriber` for the GitHub org data providers.

  BREAKING CHANGE:

  - `GithubOrgEntityProvider.onEvent` made private
  - `GithubOrgEntityProvider.supportsEventTopics` removed
  - `eventBroker` option was removed from `GithubMultiOrgEntityProvider.fromConfig`
  - `GithubMultiOrgEntityProvider.supportsEventTopics` removed

  This change only impacts users who still use the legacy backend system
  **and** who still use `eventBroker` as option when creating these
  entity providers.

  Please pass the `EventsService` instance as option `events` instead.
  You can find more information at the [installation documentation](https://backstage.io/docs/integrations/github/org/#legacy-backend-system).

### Patch Changes

- d5a1fe1: Replaced winston logger with `LoggerService`
- 469e87f: Properly instantiate `GithubMultiOrgEntityProvider` and `GithubOrgEntityProvider` with `EventsService` if defined
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/plugin-catalog-backend@1.21.1
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/backend-tasks@0.5.22
  - @backstage/catalog-client@1.6.4
  - @backstage/integration@1.10.0
  - @backstage/plugin-events-node@0.3.3
  - @backstage/plugin-catalog-node@1.11.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.22

## 0.5.8-next.1

### Patch Changes

- 469e87f: Properly instantiate `GithubMultiOrgEntityProvider` and `GithubOrgEntityProvider` with `EventsService` if defined
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-catalog-backend@1.21.1-next.1
  - @backstage/catalog-client@1.6.4-next.0
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/plugin-events-node@0.3.3-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-catalog-node@1.11.1-next.1

## 0.5.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.21.1-next.0
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/catalog-client@1.6.3
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-catalog-node@1.11.1-next.0
  - @backstage/plugin-events-node@0.3.3-next.0

## 0.5.7

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.21.0
  - @backstage/plugin-catalog-node@1.11.0
  - @backstage/catalog-client@1.6.3
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/backend-tasks@0.5.21
  - @backstage/plugin-events-node@0.3.2
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/integration@1.9.1
  - @backstage/plugin-catalog-common@1.0.22

## 0.5.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.20.0
  - @backstage/plugin-catalog-node@1.10.0
  - @backstage/catalog-client@1.6.2
  - @backstage/backend-common@0.21.5
  - @backstage/backend-tasks@0.5.20
  - @backstage/plugin-events-node@0.3.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/integration@1.9.1
  - @backstage/plugin-catalog-common@1.0.22

## 0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.19.0
  - @backstage/plugin-catalog-node@1.9.0

## 0.5.4

### Patch Changes

- a936a8f: Migrated the `GithubLocationAnalyzer` to support new auth services.
- 999224f: Bump dependency `minimatch` to v9
- 2eb0da3: Support EventsService and events with the new backend system (through EventsService) for `GithubOrgEntityProvider` and `GithubMultiOrgEntityProvider`.

  _New/Current Backend System:_

  The events support for the provider will be enabled always, making it ready to consume events from its subscribed topics.
  In order to receive events and make use of this feature, you still need to set up receiving events from the event source as before.

  _Legacy Backend System:_

  You can pass the `EventsService` instance to the factory method as one of its options:

  ```diff
    // packages/backend/src/plugins/catalog.ts
    const githubOrgProvider = GithubOrgEntityProvider.fromConfig(env.config, {
      events: env.events,
      // ...
    });
  - env.eventBroker.subscribe(githubOrgProvider);
  ```

  ```diff
    // packages/backend/src/plugins/catalog.ts
    const githubMultiOrgProvider = GithubMultiOrgEntityProvider.fromConfig(env.config, {
      events: env.events,
      // ...
    });
  - env.eventBroker.subscribe(githubMultiOrgProvider);
  ```

- bcf55d5: Support EventsService and events with the new backend system (through EventsService).

  _New/Current Backend System:_

  The events support for the provider will be enabled always, making it ready to consume events from its subscribed topics.
  In order to receive events and make use of this feature, you still need to set up receiving events from the event source as before.

  _Legacy Backend System:_

  You can pass the `EventsService` instance to the factory method as one of its options:

  ```diff
    // packages/backend/src/plugins/catalog.ts
    const githubProvider = GithubEntityProvider.fromConfig(env.config, {
  +   events: env.events,
      logger: env.logger,
      scheduler: env.scheduler,
    });
  - env.eventBroker.subscribe(githubProvider);
  ```

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- 9eab52a: Add location analyzer when installing the module
- Updated dependencies
  - @backstage/plugin-events-node@0.3.0
  - @backstage/plugin-catalog-backend@1.18.0
  - @backstage/backend-common@0.21.4
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-catalog-node@1.8.0
  - @backstage/catalog-client@1.6.1
  - @backstage/backend-tasks@0.5.19
  - @backstage/catalog-model@1.4.5
  - @backstage/plugin-catalog-common@1.0.22

## 0.5.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.18.0-next.2
  - @backstage/integration@1.9.1-next.2
  - @backstage/catalog-client@1.6.1-next.1
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-catalog-node@1.8.0-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-events-node@0.3.0-next.2

## 0.5.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-catalog-backend@1.18.0-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## 0.5.3-next.0

### Patch Changes

- a936a8f: Migrated the `GithubLocationAnalyzer` to support new auth services.
- 999224f: Bump dependency `minimatch` to v9
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-events-node@0.3.0-next.0
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-catalog-backend@1.18.0-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.0

## 0.5.0

### Minor Changes

- a950ed0: Prevent Entity Providers from eliminating Users and Groups from the DB when the synchronisation fails

### Patch Changes

- 785ff24: Added `validateLocationsExist` to the config
- 9477133: Decreased number of teams fetched by GraphQL Query responsible for fetching Teams and Members in organization, due to timeouts when running against big organizations
- 1cae748: Updated dependency `git-url-parse` to `^14.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/plugin-catalog-backend@1.17.0
  - @backstage/backend-tasks@0.5.15
  - @backstage/catalog-model@1.4.4
  - @backstage/integration@1.9.0
  - @backstage/catalog-client@1.6.0
  - @backstage/plugin-catalog-node@1.7.0
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.21
  - @backstage/plugin-events-node@0.2.19

## 0.5.0-next.3

### Patch Changes

- 785ff24: Added `validateLocationsExist` to the config
- 1cae748: Updated dependency `git-url-parse` to `^14.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-catalog-backend@1.17.0-next.3
  - @backstage/plugin-catalog-node@1.6.2-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-events-node@0.2.19-next.3

## 0.5.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-catalog-backend@1.17.0-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/plugin-events-node@0.2.19-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/integration@1.9.0-next.0
  - @backstage/plugin-catalog-common@1.0.21-next.0

## 0.5.0-next.1

### Minor Changes

- a950ed0: Prevent Entity Providers from eliminating Users and Groups from the DB when the synchronisation fails

### Patch Changes

- 9477133: Decreased number of teams fetched by GraphQL Query responsible for fetching Teams and Members in organization, due to timeouts when running against big organizations
- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/plugin-catalog-backend@1.17.0-next.1
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.1
  - @backstage/plugin-events-node@0.2.19-next.1

## 0.4.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-catalog-backend@1.17.0-next.0
  - @backstage/catalog-client@1.6.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-catalog-common@1.0.20
  - @backstage/plugin-events-node@0.2.19-next.0

## 0.4.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/catalog-client@1.5.2
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/plugin-catalog-backend@1.16.1
  - @backstage/backend-tasks@0.5.14
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-catalog-common@1.0.20
  - @backstage/plugin-events-node@0.2.18

## 0.4.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-catalog-backend@1.16.1-next.2
  - @backstage/plugin-catalog-node@1.6.1-next.2
  - @backstage/plugin-events-node@0.2.18-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.4.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/plugin-catalog-backend@1.16.1-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-catalog-node@1.6.1-next.1
  - @backstage/plugin-events-node@0.2.18-next.1

## 0.4.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-catalog-backend@1.16.1-next.0
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-events-node@0.2.18-next.0

## 0.4.6

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-catalog-node@1.6.0
  - @backstage/plugin-catalog-backend@1.16.0
  - @backstage/catalog-client@1.5.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/integration@1.8.0
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-events-node@0.2.17

## 0.4.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-catalog-backend@1.16.0-next.3
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.6.0-next.3
  - @backstage/plugin-events-node@0.2.17-next.3

## 0.4.6-next.2

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0-next.2
  - @backstage/plugin-catalog-backend@1.16.0-next.2
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-events-node@0.2.17-next.2

## 0.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.1-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-events-node@0.2.17-next.1

## 0.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/integration@1.8.0-next.0
  - @backstage/plugin-catalog-backend@1.15.1-next.0
  - @backstage/plugin-catalog-node@1.5.1-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-events-node@0.2.17-next.0

## 0.4.5

### Patch Changes

- 88b673aa76: Import `AnalyzeOptions` and `ScmLocationAnalyzer` types from `@backstage/plugin-catalog-node`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.0
  - @backstage/plugin-catalog-node@1.5.0
  - @backstage/integration@1.7.2
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-events-node@0.2.16

## 0.4.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-catalog-backend@1.15.0-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-catalog-node@1.5.0-next.2
  - @backstage/plugin-events-node@0.2.16-next.2

## 0.4.5-next.1

### Patch Changes

- 88b673aa76: Import `AnalyzeOptions` and `ScmLocationAnalyzer` types from `@backstage/plugin-catalog-node`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.0-next.1
  - @backstage/plugin-catalog-node@1.5.0-next.1
  - @backstage/integration@1.7.2-next.0
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-events-node@0.2.16-next.1

## 0.4.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.0-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/integration@1.7.1
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-catalog-node@1.4.8-next.0
  - @backstage/plugin-events-node@0.2.16-next.0

## 0.4.4

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- 0b55f773a7: Removed some unused dependencies
- 4f16e60e6d: Request slightly smaller pages of data from GitHub
- b4b1cbf9fa: Make `defaultUserTransformer` resolve to `UserEntity` instead of `Entity`
- c101e683d5: Removed `catalogModuleGithubOrgEntityProvider`. Import from `@backstage/plugin-catalog-backend-module-github-org` instead.
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-backend@1.14.0
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-events-node@0.2.15

## 0.4.4-next.2

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- c101e683d5: Removed `catalogModuleGithubOrgEntityProvider`. Import from `@backstage/plugin-catalog-backend-module-github-org` instead.
- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-catalog-backend@1.14.0-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/integration@1.7.1-next.1
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-catalog-node@1.4.7-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/catalog-client@1.4.5-next.0
  - @backstage/config@1.1.1-next.0
  - @backstage/plugin-catalog-common@1.0.17-next.0
  - @backstage/plugin-events-node@0.2.15-next.2

## 0.4.3-next.1

### Patch Changes

- b4b1cbf9fa: Make `defaultUserTransformer` resolve to `UserEntity` instead of `Entity`
- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/plugin-catalog-backend@1.14.0-next.1
  - @backstage/plugin-catalog-node@1.4.6-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/config@1.1.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-events-node@0.2.14-next.1

## 0.4.3-next.0

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/integration@1.7.1-next.0
  - @backstage/plugin-catalog-backend@1.14.0-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-catalog-node@1.4.6-next.0
  - @backstage/plugin-events-node@0.2.14-next.0

## 0.4.0

### Minor Changes

- fa7004d9722c: Added a `catalogModuleGithubOrgEntityProvider` for the new backend system

### Patch Changes

- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- 3d63e60f3c36: Internal restructure to avoid circular imports
- 96353bb7cb4a: Properly support custom `userTransformer` returning `undefined` in `GithubMultiOrgEntityProvider`
- 3c44761b9191: Allow github user and team transforms to return any Entity
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.0
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/types@1.1.1
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-catalog-node@1.4.4
  - @backstage/plugin-events-node@0.2.12

## 0.4.0-next.3

### Minor Changes

- fa7004d9722c: Added a `catalogModuleGithubOrgEntityProvider` for the new backend system

### Patch Changes

- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.3
  - @backstage/catalog-client@1.4.4-next.2
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/integration@1.7.0-next.3
  - @backstage/plugin-catalog-common@1.0.16-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-catalog-node@1.4.4-next.3
  - @backstage/plugin-events-node@0.2.12-next.3

## 0.3.8-next.2

### Patch Changes

- 96353bb7cb4a: Properly support custom `userTransformer` returning `undefined` in `GithubMultiOrgEntityProvider`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-events-node@0.2.12-next.2

## 0.3.8-next.1

### Patch Changes

- 3c44761b9191: Allow github user and team transforms to return any Entity
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.1
  - @backstage/config@1.1.0-next.0
  - @backstage/integration@1.7.0-next.1
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-catalog-node@1.4.4-next.1
  - @backstage/plugin-events-node@0.2.12-next.1
  - @backstage/catalog-client@1.4.4-next.0
  - @backstage/plugin-catalog-common@1.0.16-next.0
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.3.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.2-next.0
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/integration@1.7.0-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.3-next.0
  - @backstage/plugin-events-node@0.2.11-next.0

## 0.3.3

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- 81c231c9c9ee: Fixed a bug where the visibility filter was case sensitive and casting was inconsistent.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/plugin-catalog-backend@1.12.0
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-catalog-node@1.4.1
  - @backstage/plugin-events-node@0.2.9
  - @backstage/integration@1.6.0
  - @backstage/backend-tasks@0.5.5
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 0.3.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## 0.3.3-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-catalog-backend@1.12.0-next.1
  - @backstage/plugin-catalog-node@1.4.1-next.1
  - @backstage/plugin-events-node@0.2.9-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/integration@1.5.1
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.0-next.0
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration@1.5.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.1-next.0
  - @backstage/plugin-events-node@0.2.9-next.0

## 0.3.2

### Patch Changes

- b01b869d7158: fixed event handler to respect configured organization
- 68531cc70e1f: Break some internal circular import chains
- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/plugin-catalog-backend@1.11.0
  - @backstage/plugin-catalog-node@1.4.0
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/backend-tasks@0.5.4
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-events-node@0.2.8

## 0.3.2-next.1

### Patch Changes

- b01b869d7158: fixed event handler to respect configured organization
- Updated dependencies
  - @backstage/config@1.0.8

## 0.3.2-next.0

### Patch Changes

- 68531cc70e1f: Break some internal circular import chains
- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/plugin-catalog-backend@1.11.0-next.0
  - @backstage/plugin-catalog-node@1.4.0-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1-next.0
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15-next.0
  - @backstage/plugin-events-node@0.2.8-next.0

## 0.3.1

### Patch Changes

- b9a6d1348d96: Properly handle `async` event callback
- df8411779da1: Add support for Repository Variables and Secrets to the `publish:github` and `github:repo:create` scaffolder actions. You will need to add `read/write` permissions to your GITHUB_TOKEN and/or Github Backstage App for Repository `Secrets` and `Variables`

  Upgrade octokit introduces some breaking changes.

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/catalog-client@1.4.2
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-backend@1.10.0
  - @backstage/integration@1.5.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-catalog-node@1.3.7
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.14
  - @backstage/plugin-events-node@0.2.7

## 0.3.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/plugin-catalog-backend@1.10.0-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/catalog-client@1.4.2-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/integration@1.5.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.14-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.2
  - @backstage/plugin-events-node@0.2.7-next.2

## 0.3.1-next.2

### Patch Changes

- b9a6d1348d96: Properly handle `async` event callback
- Updated dependencies
  - @backstage/config@1.0.7

## 0.3.1-next.1

### Patch Changes

- df8411779da1: Add support for Repository Variables and Secrets to the `publish:github` and `github:repo:create` scaffolder actions. You will need to add `read/write` permissions to your GITHUB_TOKEN and/or Github Backstage App for Repository `Secrets` and `Variables`

  Upgrade octokit introduces some breaking changes.

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/plugin-catalog-backend@1.9.2-next.1
  - @backstage/integration@1.5.0-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.1
  - @backstage/catalog-client@1.4.2-next.1
  - @backstage/plugin-events-node@0.2.7-next.1
  - @backstage/plugin-catalog-common@1.0.14-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.2-next.0
  - @backstage/plugin-catalog-backend@1.9.2-next.0
  - @backstage/plugin-catalog-node@1.3.7-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/integration@1.4.5
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-events-node@0.2.7-next.0

## 0.3.0

### Minor Changes

- 970678adbe2: Implement events support for `GithubMultiOrgEntityProvider`

  **BREAKING:** Passing in a custom `teamTransformer` will now correctly completely override the default transformer behavior

### Patch Changes

- 78bb674a713: Fixed bug in queryWithPaging that caused secondary rate limit errors in GitHub with organizations having more than 1000 repositories. This change makes one request per second to avoid concurrency issues.
- bd101cefd37: Updated the `team.edited` event emitted from `GithubOrgEntityProvider` to also include teams description.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.9.1
  - @backstage/backend-common@0.18.5
  - @backstage/integration@1.4.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-catalog-node@1.3.6
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-events-node@0.2.6

## 0.3.0-next.2

### Minor Changes

- 970678adbe2: Implement events support for `GithubMultiOrgEntityProvider`

  **BREAKING:** Passing in a custom `teamTransformer` will now correctly completely override the default transformer behavior

### Patch Changes

- bd101cefd37: Updated the `team.edited` event emitted from `GithubOrgEntityProvider` to also include teams description.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.9.1-next.2
  - @backstage/config@1.0.7

## 0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-catalog-backend@1.9.1-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## 0.2.8-next.0

### Patch Changes

- 78bb674a713: Fixed bug in queryWithPaging that caused secondary rate limit errors in GitHub with organizations having more than 1000 repositories. This change makes one request per second to avoid concurrency issues.
- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/integration@1.4.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-catalog-backend@1.9.1-next.0
  - @backstage/plugin-catalog-node@1.3.6-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-events-node@0.2.6-next.0

## 0.2.7

### Patch Changes

- 3756dd98feb: `GitHubEntityProvider`: Add option to configure visibility filter via `app-config.yaml`.

  Please find how to configure visibility filter config at https://backstage.io/docs/integrations/github/discovery

- 3160138d8d4: Implement `GithubMultiOrgEntityProvider` for sourcing group and user entities from multiple GitHub organizations
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/plugin-catalog-backend@1.9.0
  - @backstage/catalog-client@1.4.1
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/integration@1.4.4
  - @backstage/plugin-catalog-node@1.3.5
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-events-node@0.2.5

## 0.2.7-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.9.0-next.3
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-client@1.4.1-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.1
  - @backstage/plugin-catalog-node@1.3.5-next.3
  - @backstage/plugin-events-node@0.2.5-next.2

## 0.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.1-next.2
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/catalog-client@1.4.1-next.0
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.2
  - @backstage/plugin-events-node@0.2.5-next.2

## 0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.1-next.1
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/integration@1.4.4-next.0
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.1
  - @backstage/plugin-events-node@0.2.5-next.1

## 0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.1-next.0
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/plugin-catalog-node@1.3.5-next.0
  - @backstage/plugin-events-node@0.2.5-next.0

## 0.2.6

### Patch Changes

- 65454876fb2: Minor API report tweaks
- 90469c02c8c: Renamed `githubEntityProviderCatalogModule` to `catalogModuleGithubEntityProvider` to match the [recommended naming patterns](https://backstage.io/docs/backend-system/architecture/naming-patterns).
- e675f902980: Make sure to not use deprecated exports from `@backstage/plugin-catalog-backend`
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.0
  - @backstage/catalog-client@1.4.0
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.4
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/plugin-events-node@0.2.4
  - @backstage/integration@1.4.3
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.2.6-next.2

### Patch Changes

- 65454876fb2: Minor API report tweaks
- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-catalog-backend@1.8.0-next.2
  - @backstage/plugin-catalog-node@1.3.4-next.2
  - @backstage/plugin-events-node@0.2.4-next.2
  - @backstage/config@1.0.7-next.0
  - @backstage/integration@1.4.3-next.0

## 0.2.6-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/catalog-client@1.4.0-next.1
  - @backstage/integration@1.4.3-next.0
  - @backstage/plugin-catalog-backend@1.8.0-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.12-next.1
  - @backstage/plugin-catalog-node@1.3.4-next.1
  - @backstage/plugin-events-node@0.2.4-next.1

## 0.2.6-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/catalog-client@1.4.0-next.0
  - @backstage/plugin-catalog-backend@1.8.0-next.0
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/plugin-catalog-common@1.0.12-next.0
  - @backstage/plugin-catalog-node@1.3.4-next.0
  - @backstage/plugin-events-node@0.2.4-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.2.5

### Patch Changes

- 66158754b4: Add support for filtering out forks
- 80afd5ff8b: Use github team slug and login annotations rather than entity name to infer location annotations
- 85b04f659a: Internal refactor to not use deprecated `substr`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/catalog-model@1.2.0
  - @backstage/plugin-events-node@0.2.3
  - @backstage/plugin-catalog-node@1.3.3
  - @backstage/backend-tasks@0.4.3
  - @backstage/catalog-client@1.3.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.11

## 0.2.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-catalog-backend@1.7.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/plugin-events-node@0.2.3-next.2
  - @backstage/plugin-catalog-node@1.3.3-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/catalog-client@1.3.1-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.11-next.1

## 0.2.5-next.1

### Patch Changes

- 66158754b4: Add support for filtering out forks
- 85b04f659a: Internal refactor to not use deprecated `substr`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2-next.1
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.11-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.1
  - @backstage/plugin-events-node@0.2.3-next.1

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/plugin-catalog-backend@1.7.2-next.0
  - @backstage/plugin-catalog-common@1.0.11-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0
  - @backstage/plugin-events-node@0.2.3-next.0

## 0.2.3

### Patch Changes

- 427d8f4411: Added support for event based updates in the `GithubOrgEntityProvider`!
  Based on webhook events from GitHub the affected `User` or `Group` entity will be refreshed.
  This includes adding new entities, refreshing existing ones, and removing obsolete ones.

  Please find more information at
  https://backstage.io/docs/integrations/github/org#installation-with-events-support

- f8d91a8810: fixed `catalogPath` option to properly glob match on received GitHub events.
- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/catalog-model@1.1.5
  - @backstage/catalog-client@1.3.0
  - @backstage/backend-tasks@0.4.1
  - @backstage/plugin-catalog-node@1.3.1
  - @backstage/plugin-catalog-backend@1.7.0
  - @backstage/config@1.0.6
  - @backstage/plugin-events-node@0.2.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10

## 0.2.3-next.2

### Patch Changes

- f8d91a8810: fixed `catalogPath` option to properly glob match on received GitHub events.
- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/catalog-client@1.3.0-next.2
  - @backstage/plugin-catalog-backend@1.7.0-next.2
  - @backstage/plugin-catalog-node@1.3.1-next.2
  - @backstage/plugin-events-node@0.2.1-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1

## 0.2.3-next.1

### Patch Changes

- 427d8f4411: Added support for event based updates in the `GithubOrgEntityProvider`!
  Based on webhook events from GitHub the affected `User` or `Group` entity will be refreshed.
  This includes adding new entities, refreshing existing ones, and removing obsolete ones.

  Please find more information at
  https://backstage.io/docs/integrations/github/org#installation-with-events-support

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/plugin-events-node@0.2.1-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/catalog-client@1.3.0-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.0
  - @backstage/plugin-catalog-node@1.3.1-next.0
  - @backstage/plugin-events-node@0.2.0

## 0.2.2

### Patch Changes

- 70fa5ec3ec: Fixes the assignment of group member references in `GithubMultiOrgProcessor` so membership relations are resolved correctly.
- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- fe93cce743: Added the githubCredentialsProvider property to the GithubLocationAnalyzerOptions to be able to override the GithubCredentialsProvider.
- a0fd4af94a: Handle GitHub `push` events at the `GithubEntityProvider` by subscribing to the topic `github.push.`

  Implements `EventSubscriber` to receive events for the topic `github.push`.

  On `github.push`, the affected repository will be refreshed.
  This includes adding new Location entities, refreshing existing ones,
  and removing obsolete ones.

  Please find more information at
  https://backstage.io/docs/integrations/github/discovery#installation-with-events-support

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 754b5854df: Fix incorrectly exported GithubOrgEntityProvider as a type
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0
  - @backstage/catalog-client@1.2.0
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-catalog-node@1.3.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/errors@1.1.4
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/plugin-events-node@0.2.0
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5
  - @backstage/plugin-catalog-common@1.0.9

## 0.2.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.3
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.3
  - @backstage/plugin-catalog-node@1.3.0-next.3
  - @backstage/plugin-events-node@0.2.0-next.3

## 0.2.2-next.2

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.2
  - @backstage/plugin-events-node@0.2.0-next.2

## 0.2.2-next.1

### Patch Changes

- fe93cce743: Added the githubCredentialsProvider property to the GithubLocationAnalyzerOptions to be able to override the GithubCredentialsProvider.
- a0fd4af94a: Handle GitHub `push` events at the `GithubEntityProvider` by subscribing to the topic `github.push.`

  Implements `EventSubscriber` to receive events for the topic `github.push`.

  On `github.push`, the affected repository will be refreshed.
  This includes adding new Location entities, refreshing existing ones,
  and removing obsolete ones.

  Please find more information at
  https://backstage.io/docs/integrations/github/discovery#installation-with-events-support

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-catalog-backend@1.6.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/plugin-catalog-node@1.2.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.1
  - @backstage/plugin-events-node@0.2.0-next.1

## 0.2.2-next.0

### Patch Changes

- 70fa5ec3ec: Fixes the assignment of group member references in `GithubMultiOrgProcessor` so membership relations are resolved correctly.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 754b5854df: Fix incorrectly exported GithubOrgEntityProvider as a type
- Updated dependencies
  - @backstage/catalog-client@1.2.0-next.0
  - @backstage/plugin-catalog-backend@1.6.0-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/integration@1.4.1-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/plugin-catalog-node@1.2.2-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0

## 0.2.0

### Minor Changes

- 67fe5bc9a9: BREAKING: Support authenticated backends by including a server token for catalog requests. The constructor of `GithubLocationAnalyzer` now requires an instance of `TokenManager` to be supplied:

  ```diff
  ...
    builder.addLocationAnalyzers(
      new GitHubLocationAnalyzer({
        discovery: env.discovery,
        config: env.config,
  +     tokenManager: env.tokenManager,
      }),
    );
  ...
  ```

- f64d66a45c: Added the ability for the GitHub discovery provider to validate that catalog files exist before emitting them.

  Users can now set the `validateLocationsExist` property to `true` in their GitHub discovery configuration to opt in to this feature.
  This feature only works with `catalogPath`s that do not contain wildcards.

  When `validateLocationsExist` is set to `true`, the GitHub discovery provider will retrieve the object from the
  repository at the provided `catalogPath`.
  If this file exists and is non-empty, then it will be emitted as a location for further processing.
  If this file does not exist or is empty, then it will not be emitted.
  Not emitting locations that do not exist allows for far fewer calls to the GitHub API to validate locations that do not exist.

### Patch Changes

- 67fe5bc9a9: Properly derive Github credentials when making requests in `GithubLocationAnalyzer` to support Github App authentication
- bef063dc8d: - Make it possible to inject custom user and team transformers when configuring the `GithubOrgEntityProvider`
- 4c9f7847e4: Updated dependency `msw` to `^0.48.0` while moving it to be a dev dependency.
- c1784a4980: Replaces in-code uses of `GitHub` with `Github` and deprecates old versions.
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-catalog-backend@1.5.1
  - @backstage/integration@1.4.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/catalog-model@1.1.3
  - @backstage/types@1.0.1
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/plugin-catalog-node@1.2.1
  - @backstage/catalog-client@1.1.2
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/plugin-catalog-backend@1.5.1-next.1
  - @backstage/plugin-catalog-node@1.2.1-next.1
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/types@1.0.1-next.0

## 0.2.0-next.0

### Minor Changes

- 67fe5bc9a9: BREAKING: Support authenticated backends by including a server token for catalog requests. The constructor of `GithubLocationAnalyzer` now requires an instance of `TokenManager` to be supplied:

  ```diff
  ...
    builder.addLocationAnalyzers(
      new GitHubLocationAnalyzer({
        discovery: env.discovery,
        config: env.config,
  +     tokenManager: env.tokenManager,
      }),
    );
  ...
  ```

- f64d66a45c: Added the ability for the GitHub discovery provider to validate that catalog files exist before emitting them.

  Users can now set the `validateLocationsExist` property to `true` in their GitHub discovery configuration to opt in to this feature.
  This feature only works with `catalogPath`s that do not contain wildcards.

  When `validateLocationsExist` is set to `true`, the GitHub discovery provider will retrieve the object from the
  repository at the provided `catalogPath`.
  If this file exists and is non-empty, then it will be emitted as a location for further processing.
  If this file does not exist or is empty, then it will not be emitted.
  Not emitting locations that do not exist allows for far fewer calls to the GitHub API to validate locations that do not exist.

### Patch Changes

- 67fe5bc9a9: Properly derive Github credentials when making requests in `GithubLocationAnalyzer` to support Github App authentication
- c1784a4980: Replaces in-code uses of `GitHub` with `Github` and deprecates old versions.
- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-catalog-backend@1.5.1-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/plugin-catalog-node@1.2.1-next.0
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.1.8

### Patch Changes

- 8749df3d02: `GitHubEntityProvider`: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  https://backstage.io/docs/integrations/github/discovery

- 7022aebf35: Added `GithubLocationAnalyzer`. This can be used to add to the `CatalogBuilder`. When added this will be used by `RepoLocationAnalyzer` to figure out if the given URL that you are trying to import from the /catalog-import page already contains catalog-info.yaml files.
- 51046b58b0: Use schedule from config at backend module.

  Also, it removes `GithubEntityProviderCatalogModuleOptions`
  in favor of config-only for the backend module setup
  like at other similar modules.

- 7edb5909e8: Add missing config schema for the `GitHubEntityProvider`.
- be9474b103: Replaces in-code uses of `GitHub` by `Github` and deprecates old versions.

  Deprecates

  - `GitHubEntityProvider` replaced by `GithubEntityProvider`
  - `GitHubLocationAnalyzer` replaced by `GithubLocationAnalyzer`
  - `GitHubLocationAnalyzerOptions` replaced by `GithubLocationAnalyzerOptions`
  - `GitHubOrgEntityProvider` replaced by `GithubOrgEntityProvider`
  - `GitHubOrgEntityProviderOptions` replaced by `GithubOrgEntityProviderOptions`

  Renames

  - `GitHubLocationAnalyzer` to `GithubLocationAnalyzer`
  - `GitHubLocationAnalyzerOptions` to `GithubLocationAnalyzerOptions`

- a35a27df70: Updated the `moduleId` of the experimental module export.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.2.0
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-catalog-backend@1.5.0
  - @backstage/backend-tasks@0.3.6
  - @backstage/backend-plugin-api@0.1.3
  - @backstage/catalog-client@1.1.1
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/integration@1.3.2
  - @backstage/types@1.0.0

## 0.1.8-next.2

### Patch Changes

- 7022aebf35: Added `GitHubLocationAnalyzer`. This can be used to add to the `CatalogBuilder`. When added this will be used by `RepoLocationAnalyzer` to figure out if the given URL that you are trying to import from the /catalog-import page already contains catalog-info.yaml files.
- 7edb5909e8: Add missing config schema for the `GitHubEntityProvider`.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.2.0-next.2
  - @backstage/plugin-catalog-backend@1.5.0-next.2
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2
  - @backstage/catalog-client@1.1.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/types@1.0.0

## 0.1.8-next.1

### Patch Changes

- a35a27df70: Updated the `moduleId` of the experimental module export.
- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-backend@1.4.1-next.1
  - @backstage/plugin-catalog-node@1.1.1-next.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/backend-plugin-api@0.1.3-next.0
  - @backstage/plugin-catalog-backend@1.4.1-next.0
  - @backstage/plugin-catalog-node@1.1.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/types@1.0.0

## 0.1.7

### Patch Changes

- 3c4a388537: New experimental alpha exports for use with the upcoming backend system.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 3a62594a11: Add support for including (or excluding) Github repositories by topic
- 287a64bf97: Added the ability to configure the host for the `GitHubEntityProvider` to use against GitHub Enterprise
- 91e2abbd46: Remove the duplicated `scheduleFn` initialization in `GitHubEntityProvider`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-catalog-node@1.1.0
  - @backstage/integration@1.3.1
  - @backstage/plugin-catalog-backend@1.4.0
  - @backstage/backend-tasks@0.3.5
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1

## 0.1.7-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.1.0-next.2
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/plugin-catalog-backend@1.4.0-next.3
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/backend-tasks@0.3.5-next.1

## 0.1.7-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- 3a62594a11: Add support for including (or excluding) Github repositories by topic
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.1
  - @backstage/plugin-catalog-node@1.0.2-next.1
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/integration@1.3.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.2

## 0.1.7-next.1

### Patch Changes

- 287a64bf97: Added the ability to configure the host for the `GitHubEntityProvider` to use against GitHub Enterprise
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.1

## 0.1.7-next.0

### Patch Changes

- 3c4a388537: New experimental alpha exports for use with the upcoming backend system.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/plugin-catalog-backend@1.3.2-next.0
  - @backstage/backend-plugin-api@0.1.2-next.0
  - @backstage/integration@1.3.1-next.0
  - @backstage/plugin-catalog-node@1.0.2-next.0

## 0.1.6

### Patch Changes

- f48950e34b: Github Entity Provider functionality for adding entities to the catalog.

  This provider replaces the GithubDiscoveryProcessor functionality as providers offer more flexibility with scheduling ingestion, removing and preventing orphaned entities.

  More information can be found on the [GitHub Discovery](https://backstage.io/docs/integrations/github/discovery) page.

- c59d1ce487: Fixed bug where repository filter was including all archived repositories
- 97f0a37378: Improved support for wildcards in `catalogPath`
- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/integration@1.3.0
  - @backstage/backend-tasks@0.3.4
  - @backstage/plugin-catalog-backend@1.3.1

## 0.1.6-next.2

### Patch Changes

- 97f0a37378: Improved support for wildcards in `catalogPath`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.1-next.2

## 0.1.6-next.1

### Patch Changes

- f48950e34b: Github Entity Provider functionality for adding entities to the catalog.

  This provider replaces the GithubDiscoveryProcessor functionality as providers offer more flexibility with scheduling ingestion, removing and preventing orphaned entities.

  More information can be found on the [GitHub Discovery](https://backstage.io/docs/integrations/github/discovery) page.

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.1
  - @backstage/integration@1.3.0-next.1
  - @backstage/plugin-catalog-backend@1.3.1-next.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/integration@1.3.0-next.0
  - @backstage/backend-tasks@0.3.4-next.0
  - @backstage/plugin-catalog-backend@1.3.1-next.0

## 0.1.5

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 0f25116d28: Updated dependency `@octokit/graphql` to `^5.0.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0
  - @backstage/integration@1.2.2
  - @backstage/backend-tasks@0.3.3
  - @backstage/errors@1.1.0

## 0.1.5-next.2

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 0f25116d28: Updated dependency `@octokit/graphql` to `^5.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0-next.3
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/integration@1.2.2-next.3
  - @backstage/backend-tasks@0.3.3-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.1
  - @backstage/backend-tasks@0.3.3-next.1
  - @backstage/integration@1.2.2-next.1

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/integration@1.2.2-next.0
  - @backstage/backend-tasks@0.3.3-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.0

## 0.1.4

### Patch Changes

- 8335a6f6f3: Adds an edit URL to the GitHub Teams Group entities.
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.2.0
  - @backstage/backend-tasks@0.3.2
  - @backstage/backend-common@0.14.0
  - @backstage/integration@1.2.1
  - @backstage/catalog-model@1.0.3

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/integration@1.2.1-next.2
  - @backstage/backend-tasks@0.3.2-next.2
  - @backstage/plugin-catalog-backend@1.2.0-next.2

## 0.1.4-next.1

### Patch Changes

- 8335a6f6f3: Adds an edit URL to the GitHub Teams Group entities.
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.1
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/catalog-model@1.0.3-next.0

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.0
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/plugin-catalog-backend@1.2.0-next.0

## 0.1.3

### Patch Changes

- a7de43f648: `GitHubOrgEntityProvider.fromConfig` now supports a `schedule` option like other
  entity providers, that makes it more convenient to leverage using the common
  task scheduler.

  If you want to use this in your own project, it is used something like the following:

  ```ts
  // In packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    GitHubOrgEntityProvider.fromConfig(env.config, {
      id: 'production',
      orgUrl: 'https://github.com/backstage',
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { cron: '*/30 * * * *' },
        timeout: { minutes: 10 },
      }),
      logger: env.logger,
    }),
  );
  ```

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-catalog-backend@1.1.2
  - @backstage/backend-tasks@0.3.1
  - @backstage/integration@1.2.0
  - @backstage/config@1.0.1
  - @backstage/catalog-model@1.0.2

## 0.1.3-next.1

### Patch Changes

- a7de43f648: `GitHubOrgEntityProvider.fromConfig` now supports a `schedule` option like other
  entity providers, that makes it more convenient to leverage using the common
  task scheduler.

  If you want to use this in your own project, it is used something like the following:

  ```ts
  // In packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    GitHubOrgEntityProvider.fromConfig(env.config, {
      id: 'production',
      orgUrl: 'https://github.com/backstage',
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { cron: '*/30 * * * *' },
        timeout: { minutes: 10 },
      }),
      logger: env.logger,
    }),
  );
  ```

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-catalog-backend@1.1.2-next.2
  - @backstage/backend-tasks@0.3.1-next.1
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/integration@1.2.0-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/integration@1.2.0-next.0
  - @backstage/plugin-catalog-backend@1.1.2-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0
  - @backstage/integration@1.1.0
  - @backstage/catalog-model@1.0.1
  - @backstage/backend-common@0.13.2

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0-next.1
  - @backstage/integration@1.1.0-next.1
  - @backstage/backend-common@0.13.2-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-backend@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/integration@1.0.1-next.0

## 0.1.1

### Patch Changes

- 132189e466: Updated the code to handle User kind `spec.memberOf` now being optional.
- e949d68059: Made sure to move the catalog-related github and ldap config into their right places
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.0.0
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0

## 0.1.0

### Minor Changes

- d4934e19b1: Added package, moving out GitHub specific functionality from the catalog-backend

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-catalog-backend@0.24.0
  - @backstage/catalog-model@0.13.0
