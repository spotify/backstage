# @backstage/plugin-catalog-backend-module-gitlab

## 0.8.10-next.0

### Patch Changes

- ca14116: Moved `@gitbeaker/rest` to dev dependencies, since it is only used for types.
- Updated dependencies
  - @backstage/backend-defaults@0.18.2-next.0
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 0.8.9

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/backend-defaults@0.18.1
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-catalog-common@1.2.1
  - @backstage/plugin-catalog-node@2.2.6
  - @backstage/plugin-events-node@0.4.27

## 0.8.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/backend-defaults@0.18.1-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1
  - @backstage/plugin-events-node@0.4.27-next.1

## 0.8.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-defaults@0.18.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## 0.8.8

### Patch Changes

- 348bea1: Fixed `GitlabDiscoveryEntityProvider` to only process push events targeting the configured branch.
- b7db066: Fixed a scope validation issue in GitLab organization discovery.
- Updated dependencies
  - @backstage/backend-defaults@0.18.0
  - @backstage/integration@2.1.2
  - @backstage/plugin-catalog-common@1.2.0
  - @backstage/catalog-model@1.10.1
  - @backstage/config@1.3.9
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5
  - @backstage/plugin-events-node@0.4.26

## 0.8.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.2.0-next.0
  - @backstage/config@1.3.9-next.0
  - @backstage/backend-defaults@0.17.9-next.1
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/integration@2.1.2-next.1

## 0.8.8-next.1

### Patch Changes

- b7db066: Fixed a scope validation issue in GitLab organization discovery.
- Updated dependencies
  - @backstage/backend-defaults@0.17.9-next.0
  - @backstage/integration@2.1.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0
  - @backstage/plugin-events-node@0.4.26-next.0

## 0.8.7-next.0

### Patch Changes

- 348bea1: Fixed `GitlabDiscoveryEntityProvider` to only process push events targeting the configured branch.

## 0.8.6

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-defaults@0.17.7
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/integration@2.1.0
  - @backstage/plugin-catalog-node@2.2.4
  - @backstage/plugin-events-node@0.4.25

## 0.8.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.0-next.0
  - @backstage/backend-defaults@0.17.6-next.1

## 0.8.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.6-next.0
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0
  - @backstage/plugin-events-node@0.4.25-next.0

## 0.8.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.5
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/plugin-catalog-node@2.2.3
  - @backstage/plugin-events-node@0.4.24

## 0.8.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.4-next.0
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0
  - @backstage/plugin-events-node@0.4.24-next.0

## 0.8.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.3
  - @backstage/integration@2.0.3
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-catalog-node@2.2.2
  - @backstage/plugin-events-node@0.4.23

## 0.8.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.0.3-next.0
  - @backstage/backend-defaults@0.17.2-next.0
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0
  - @backstage/plugin-events-node@0.4.23-next.0

## 0.8.3

### Patch Changes

- 1ecc3ca: Fixed spelling mistakes in internal code
- 0c5e41f: Removed unused dependencies that had no imports in source code.
- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/backend-defaults@0.17.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/integration@2.0.2
  - @backstage/config@1.3.8
  - @backstage/plugin-catalog-common@1.1.10
  - @backstage/plugin-events-node@0.4.22

## 0.8.3-next.2

### Patch Changes

- 1ecc3ca: Fixed spelling mistakes in internal code
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.1-next.1
  - @backstage/backend-defaults@0.17.1-next.2

## 0.8.3-next.1

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.1
  - @backstage/plugin-catalog-node@2.2.1-next.1
  - @backstage/backend-defaults@0.17.1-next.1

## 0.8.3-next.0

### Patch Changes

- 0c5e41f: Removed unused dependencies that had no imports in source code.
- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/backend-defaults@0.17.1-next.0
  - @backstage/integration@2.0.2-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/plugin-events-node@0.4.22-next.0
  - @backstage/plugin-catalog-common@1.1.10-next.0

## 0.8.2

### Patch Changes

- 8df0796: Fixed GitLab project topic filtering by using correct API parameter 'topic' instead of 'topics'
- 54a8300: Add GitLab SCM event translation layer for instant catalog reprocessing.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/backend-defaults@0.17.0
  - @backstage/errors@1.3.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/integration@2.0.1
  - @backstage/config@1.3.7
  - @backstage/plugin-catalog-common@1.1.9
  - @backstage/plugin-events-node@0.4.21

## 0.8.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/backend-defaults@0.16.1-next.2
  - @backstage/integration@2.0.1-next.0
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0
  - @backstage/plugin-events-node@0.4.21-next.2
  - @backstage/plugin-catalog-common@1.1.9-next.0

## 0.8.2-next.1

### Patch Changes

- 54a8300: Add GitLab SCM event translation layer for instant catalog reprocessing.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/backend-defaults@0.16.1-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1
  - @backstage/plugin-events-node@0.4.21-next.1

## 0.8.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.16.1-next.0
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/plugin-events-node@0.4.21-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/integration@2.0.0
  - @backstage/plugin-catalog-common@1.1.8

## 0.8.1

### Patch Changes

- d933f62: Add configurable throttling and retry mechanism for GitLab integration.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/backend-defaults@0.16.0
  - @backstage/integration@2.0.0
  - @backstage/plugin-catalog-node@2.1.0
  - @backstage/catalog-model@1.7.7
  - @backstage/plugin-events-node@0.4.20

## 0.8.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/backend-defaults@0.16.0-next.2
  - @backstage/integration@2.0.0-next.2
  - @backstage/plugin-catalog-node@2.1.0-next.2
  - @backstage/plugin-events-node@0.4.20-next.1

## 0.8.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.16.0-next.1
  - @backstage/integration@2.0.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.1
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-events-node@0.4.20-next.0

## 0.8.1-next.0

### Patch Changes

- d933f62: Add configurable throttling and retry mechanism for GitLab integration.
- Updated dependencies
  - @backstage/backend-defaults@0.15.3-next.0
  - @backstage/integration@1.21.0-next.0
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-events-node@0.4.20-next.0

## 0.8.0

### Minor Changes

- 2f51676: allow entity discoverability via gitlab search API
- ff07934: Added the `{gitlab-integration-host}/user-id` annotation to store GitLab's user ID (immutable) in user entities. Also includes addition of the `userIdMatchingUserEntityAnnotation` sign-in resolver that matches users by the new ID.

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- 7455dae: Use node prefix on native imports
- 7e6b5e5: Fixed GitLab search API scope parameter from `'blob'` to `'blobs'`, resolving 400 errors in discovery provider.
- Updated dependencies
  - @backstage/integration@1.20.0
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/backend-defaults@0.15.2
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-events-node@0.4.19

## 0.8.0-next.2

### Patch Changes

- 7e6b5e5: Fixed GitLab search API scope parameter from `'blob'` to `'blobs'`, resolving 400 errors in discovery provider.
- Updated dependencies
  - @backstage/integration@1.20.0-next.2
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/backend-defaults@0.15.2-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-events-node@0.4.19-next.0

## 0.8.0-next.1

### Minor Changes

- 2f51676: allow entity discoverability via gitlab search API

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.20.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/backend-defaults@0.15.2-next.1

## 0.8.0-next.0

### Minor Changes

- ff07934: Added the `{gitlab-integration-host}/user-id` annotation to store GitLab's user ID (immutable) in user entities. Also includes addition of the `userIdMatchingUserEntityAnnotation` sign-in resolver that matches users by the new ID.

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/backend-defaults@0.15.1-next.0
  - @backstage/integration@1.19.3-next.0
  - @backstage/plugin-events-node@0.4.19-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.8-next.0

## 0.7.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.15.0
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/integration@1.19.2

## 0.7.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.15.0-next.2

## 0.7.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.1-next.1
  - @backstage/integration@1.19.2-next.0

## 0.7.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.1-next.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/integration@1.19.0
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-catalog-node@1.20.1
  - @backstage/plugin-events-node@0.4.18

## 0.7.6

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.19.0
  - @backstage/backend-defaults@0.14.0
  - @backstage/plugin-events-node@0.4.18
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1

## 0.7.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.1
  - @backstage/plugin-events-node@0.4.18-next.1
  - @backstage/integration@1.18.3-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-catalog-node@1.20.1-next.1

## 0.7.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.0
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/integration@1.18.3-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/plugin-events-node@0.4.18-next.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## 0.7.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## 0.7.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-defaults@0.13.1-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-events-node@0.4.17-next.1

## 0.7.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.1-next.0
  - @backstage/plugin-events-node@0.4.17-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/integration@1.18.2-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/plugin-catalog-common@1.1.7-next.0
  - @backstage/plugin-catalog-node@1.19.2-next.0

## 0.7.4

### Patch Changes

- 0443119: Fixed an issue in `GitlabDiscoveryEntityProvider` where entity fetching could fail for projects with special characters or that had been renamed or moved.
- 99fcf98: Removed unused dependencies
- Updated dependencies
  - @backstage/backend-defaults@0.13.0
  - @backstage/integration@1.18.1
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-common@1.1.6
  - @backstage/plugin-catalog-node@1.19.1
  - @backstage/plugin-events-node@0.4.16

## 0.7.4-next.2

### Patch Changes

- 0443119: Fixed an issue in `GitlabDiscoveryEntityProvider` where entity fetching could fail for projects with special characters or that had been renamed or moved.
- 99fcf98: Removed unused dependencies

## 0.7.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/backend-defaults@0.13.0-next.1
  - @backstage/integration@1.18.1-next.1
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-events-node@0.4.16-next.0
  - @backstage/plugin-catalog-common@1.1.6-next.0

## 0.7.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0-next.0
  - @backstage/integration@1.18.1-next.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-events-node@0.4.15

## 0.7.3

### Patch Changes

- ea80e76: When possible, requests a more limited set of results from the Gitlab projects API, which can reduce the amount of network traffic required to sync with Gitlab.
- Updated dependencies
  - @backstage/backend-defaults@0.12.1
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-events-node@0.4.15
  - @backstage/integration@1.18.0
  - @backstage/backend-plugin-api@1.4.3

## 0.7.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.1-next.1
  - @backstage/plugin-catalog-node@1.19.0-next.1
  - @backstage/integration@1.18.0-next.0

## 0.7.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.0-next.0
  - @backstage/backend-defaults@0.12.1-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0
  - @backstage/plugin-events-node@0.4.15-next.0

## 0.7.2

### Patch Changes

- 8dfe76f: Added support for multiple group patterns instead of a single one to increase flexibility when filtering groups from GitLab.
- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## 0.7.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.2-next.0
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/plugin-events-node@0.4.14-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/integration@1.17.1
  - @backstage/plugin-catalog-common@1.1.5

## 0.7.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/catalog-model@1.7.5
  - @backstage/backend-defaults@0.11.1
  - @backstage/integration@1.17.1
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.17.2
  - @backstage/plugin-events-node@0.4.13

## 0.7.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/backend-defaults@0.11.1-next.1
  - @backstage/integration@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-catalog-common@1.1.5-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0
  - @backstage/plugin-events-node@0.4.13-next.0

## 0.7.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.1-next.0
  - @backstage/integration@1.17.1-next.0
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/plugin-events-node@0.4.12
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4

## 0.7.0

### Minor Changes

- 42bb3b8: **BREAKING CHANGE**: User and Group discovery will default to ingesting all users in sub groups that belong to the specified root group in config. Disable by setting `restrictUsersToGroup: true` in app-config under your module settings.

### Patch Changes

- 57a0bad: Implement retry for GitLab API calls to handle rate limiting
- Updated dependencies
  - @backstage/backend-defaults@0.11.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-events-node@0.4.12

## 0.7.0-next.2

### Minor Changes

- 42bb3b8: **BREAKING CHANGE**: User and Group discovery will default to ingesting all users in sub groups that belong to the specified root group in config. Disable by setting `restrictUsersToGroup: true` in app-config under your module settings.

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.0-next.2
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/plugin-events-node@0.4.12-next.1

## 0.6.7-next.1

### Patch Changes

- 57a0bad: Implement retry for GitLab API calls to handle rate limiting
- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/backend-defaults@0.10.1-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-events-node@0.4.12-next.1

## 0.6.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/backend-defaults@0.10.1-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0
  - @backstage/plugin-events-node@0.4.12-next.0

## 0.6.6

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/integration@1.17.0
  - @backstage/backend-defaults@0.10.0
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-events-node@0.4.11

## 0.6.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.3
  - @backstage/integration@1.17.0-next.3
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.2
  - @backstage/plugin-events-node@0.4.11-next.2

## 0.6.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0-next.2
  - @backstage/backend-defaults@0.10.0-next.2
  - @backstage/config@1.3.2
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-events-node@0.4.11-next.1

## 0.6.6-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-events-node@0.4.11-next.1

## 0.6.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/backend-defaults@0.9.1-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-events-node@0.4.11-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3

## 0.6.5

### Patch Changes

- a568cda: add filter for repos by membership and topics
- 871a8db: fix: Add missing config options to config declaration file
- Updated dependencies
  - @backstage/backend-defaults@0.9.0
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/integration@1.16.3
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.10

## 0.6.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/backend-defaults@0.9.0-next.2
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.3-next.0
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.9

## 0.6.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.3-next.0
  - @backstage/backend-defaults@0.9.0-next.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-events-node@0.4.9

## 0.6.5-next.0

### Patch Changes

- a568cda: add filter for repos by membership and topics
- Updated dependencies
  - @backstage/backend-defaults@0.9.0-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-events-node@0.4.9

## 0.6.4

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.2
  - @backstage/backend-defaults@0.8.2
  - @backstage/plugin-events-node@0.4.9
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1

## 0.6.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.2-next.2
  - @backstage/integration@1.16.2-next.0
  - @backstage/plugin-events-node@0.4.9-next.2
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1

## 0.6.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.2-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-events-node@0.4.9-next.1

## 0.6.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.2-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.16.1-next.0
  - @backstage/plugin-events-node@0.4.9-next.0

## 0.6.3

### Patch Changes

- 4db039a: Fix `GitlabOrgDiscoveryEntityProvider` group path not being encoded causing 404 when using a subgroup in `config.group`
- Updated dependencies
  - @backstage/backend-defaults@0.8.0
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-catalog-node@1.16.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.8

## 0.6.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/backend-defaults@0.8.0-next.3
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.6.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/backend-defaults@0.8.0-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.1

## 0.6.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/backend-defaults@0.8.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.8-next.0

## 0.6.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.0-next.0
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.8-next.0

## 0.6.2

### Patch Changes

- 575613f: Go back to using `node-fetch` for gitlab
- Updated dependencies
  - @backstage/backend-defaults@0.7.0
  - @backstage/integration@1.16.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.15.1
  - @backstage/plugin-events-node@0.4.7

## 0.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.7.0-next.1
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/plugin-events-node@0.4.7-next.1
  - @backstage/plugin-catalog-common@1.1.3-next.0
  - @backstage/integration@1.16.1-next.0

## 0.6.1-next.0

### Patch Changes

- 575613f: Go back to using `node-fetch` for gitlab
- Updated dependencies
  - @backstage/backend-defaults@0.7.0-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/integration@1.16.0
  - @backstage/plugin-catalog-common@1.1.2
  - @backstage/plugin-catalog-node@1.15.1-next.0
  - @backstage/plugin-events-node@0.4.7-next.0

## 0.6.0

### Minor Changes

- 99dce5c: Implemented discovery for top-level groups defined in config.group or if undefined global top-level group in Gitlab

### Patch Changes

- 191e5bf: `restrictUsersToGroup` should use the entire group path when getting members
- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/backend-defaults@0.6.0
  - @backstage/integration@1.16.0
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/plugin-events-node@0.4.6
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/plugin-catalog-common@1.1.2

## 0.6.0-next.2

### Minor Changes

- 99dce5c: Implemented discovery for top-level groups defined in config.group or if undefined global top-level group in Gitlab

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.6.0-next.2
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/plugin-events-node@0.4.6-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/integration@1.16.0-next.1
  - @backstage/plugin-catalog-common@1.1.2-next.0

## 0.5.1-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/backend-defaults@0.6.0-next.1
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/integration@1.16.0-next.0
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-events-node@0.4.6-next.1

## 0.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.6.0-next.0
  - @backstage/integration@1.16.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-events-node@0.4.6-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-catalog-node@1.14.1-next.0

## 0.5.0

### Minor Changes

- 1b5fdd9: Extended the configuration with the `includeArchivedRepos` property, which allows including repositories when the project is archived.

### Patch Changes

- 4e58bc7: Upgrade to uuid v11 internally
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/plugin-events-node@0.4.5
  - @backstage/backend-defaults@0.5.3
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/catalog-model@1.7.1
  - @backstage/integration@1.15.2
  - @backstage/plugin-catalog-common@1.1.1

## 0.5.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.3
  - @backstage/backend-defaults@0.5.3-next.3
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.14.0-next.2

## 0.5.0-next.2

### Minor Changes

- 1b5fdd9: Extended the configuration with the `includeArchivedRepos` property, which allows including repositories when the project is archived.

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.3-next.2
  - @backstage/plugin-events-node@0.4.5-next.2
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0

## 0.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.14.0-next.1
  - @backstage/plugin-events-node@0.4.4-next.1

## 0.4.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.3-next.0
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/backend-defaults@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0

## 0.4.3

### Patch Changes

- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
- Updated dependencies
  - @backstage/backend-defaults@0.5.1
  - @backstage/plugin-events-node@0.4.1
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/integration@1.15.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0

## 0.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-events-node@0.4.1-next.1

## 0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.1
  - @backstage/integration@1.15.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-events-node@0.4.1-next.0

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.0
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.1-next.0

## 0.4.2

### Patch Changes

- 53b24d9: Internal update to use the new cache manager
- 0476be3: Add the `relations` array to allow Backstage to mirror GitLab's membership behavior, including descendant, inherited, and shared-from-group memberships.

  The previous `allowInherited` config option will be deprecated in future versions. Use the `relations` array with the `INHERITED` option instead.

  ```yaml
  catalog:
    providers:
      gitlab:
        development:
          relations:
            - INHERITED
  ```

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- b446954: Remove dependency on backend-common
- 06cc084: Added a `includeUsersWithoutSeat` config option that allow import of users without a paid seat, e.g. for Gitlab Free on SaaS. Defaults to false
- Updated dependencies
  - @backstage/backend-defaults@0.5.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/integration@1.15.0
  - @backstage/plugin-events-node@0.4.0
  - @backstage/config@1.2.0

## 0.4.2-next.2

### Patch Changes

- 0476be3: Add the `relations` array to allow Backstage to mirror GitLab's membership behavior, including descendant, inherited, and shared-from-group memberships.

  The previous `allowInherited` config option will be deprecated in future versions. Use the `relations` array with the `INHERITED` option instead.

  ```yaml
  catalog:
    providers:
      gitlab:
        development:
          relations:
            - INHERITED
  ```

- Updated dependencies
  - @backstage/backend-defaults@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/integration@1.15.0-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.2
  - @backstage/plugin-events-node@0.4.0-next.2

## 0.4.2-next.1

### Patch Changes

- 53b24d9: Internal update to use the new cache manager
- Updated dependencies
  - @backstage/backend-defaults@0.5.0-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.14.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.1
  - @backstage/plugin-events-node@0.4.0-next.1

## 0.4.2-next.0

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- b446954: Remove dependency on backend-common
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-defaults@0.5.0-next.0
  - @backstage/plugin-events-node@0.4.0-next.0
  - @backstage/plugin-catalog-node@1.12.7-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.14.0
  - @backstage/plugin-catalog-common@1.0.26

## 0.4.0

### Minor Changes

- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- c7b14ed: Adds new optional `excludeRepos` configuration option to the Gitlab catalog provider.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-catalog-node@1.12.5
  - @backstage/integration@1.14.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-events-node@0.3.9

## 0.3.22-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/config@1.2.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-common@1.0.26-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.3
  - @backstage/plugin-events-node@0.3.9-next.3

## 0.3.22-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.2
  - @backstage/plugin-events-node@0.3.9-next.2
  - @backstage/plugin-catalog-common@1.0.26-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.3.22-next.1

### Patch Changes

- c7b14ed: Adds new optional `excludeRepos` configuration option to the Gitlab catalog provider.
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-common@1.0.26-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-events-node@0.3.9-next.1

## 0.3.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/plugin-events-node@0.3.9-next.0

## 0.3.21

### Patch Changes

- 8db30ad: The Gitlab configuration supports an additional optional boolean key `catalog.providers.gitlab.<your-org>.restrictUsersToGroup`. Setting this to `true` will make Backstage only import users from the group defined in the `group` key, instead of all users in the organisation (self-hosted) or of the root group (SaaS). It will default to false, keeping the original implementation intact, when not explicitly set.
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/integration@1.13.0
  - @backstage/plugin-events-node@0.3.8
  - @backstage/plugin-catalog-node@1.12.4
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.3.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/plugin-catalog-node@1.12.4-next.1
  - @backstage/plugin-events-node@0.3.8-next.1

## 0.3.20-next.0

### Patch Changes

- 8db30ad: The Gitlab configuration supports an additional optional boolean key `catalog.providers.gitlab.<your-org>.restrictUsersToGroup`. Setting this to `true` will make Backstage only import users from the group defined in the `group` key, instead of all users in the organisation (self-hosted) or of the root group (SaaS). It will default to false, keeping the original implementation intact, when not explicitly set.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-catalog-node@1.12.3-next.0
  - @backstage/plugin-events-node@0.3.7-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.24

## 0.3.18

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- 150fc77: Fixed an issue in `GitlabOrgDiscoveryEntityProvider` where a missing `orgEnabled` config key was throwing an error.
- f271164: Fixed an issue in `GitlabDiscoveryEntityProvider` where the fallback branch was taking precedence over the GitLab default branch.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/integration@1.12.0
  - @backstage/plugin-catalog-node@1.12.1
  - @backstage/plugin-events-node@0.3.5
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.3.18-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-catalog-common@1.0.24-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.2
  - @backstage/plugin-events-node@0.3.5-next.2
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.3.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-catalog-node@1.12.1-next.1
  - @backstage/plugin-events-node@0.3.5-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.23

## 0.3.17-next.1

### Patch Changes

- 150fc77: Fixed an issue in `GitlabOrgDiscoveryEntityProvider` where a missing `orgEnabled` config key was throwing an error.
- f271164: Fixed an issue in `GitlabDiscoveryEntityProvider` where the fallback branch was taking precedence over the GitLab default branch.
- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0

## 0.3.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.11.0
  - @backstage/plugin-catalog-common@1.0.23

## 0.3.16

### Patch Changes

- a70377d: Added events support for `GitlabDiscoveryEntityProvider` and `GitlabOrgDiscoveryEntityProvider`.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-events-node@0.3.4
  - @backstage/integration@1.11.0
  - @backstage/plugin-catalog-common@1.0.23

## 0.3.15-next.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0-next.2
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-events-node@0.3.4-next.2
  - @backstage/integration@1.11.0-next.0

## 0.3.15-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-events-node@0.3.4-next.1
  - @backstage/plugin-catalog-node@1.11.2-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.3.15-next.2

### Patch Changes

- a70377d: Added events support for `GitlabDiscoveryEntityProvider` and `GitlabOrgDiscoveryEntityProvider`.
- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-catalog-common@1.0.23-next.0
  - @backstage/plugin-catalog-node@1.11.2-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.10.0
  - @backstage/plugin-events-node@0.3.4-next.0

## 0.3.15

### Patch Changes

- d5a1fe1: Replaced winston logger with `LoggerService`
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/backend-tasks@0.5.22
  - @backstage/integration@1.10.0
  - @backstage/plugin-catalog-node@1.11.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0

## 0.3.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/plugin-catalog-node@1.11.1-next.1

## 0.3.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-node@1.11.1-next.0

## 0.3.14

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.11.0
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/backend-tasks@0.5.21
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/integration@1.9.1

## 0.3.13

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.10.0
  - @backstage/backend-common@0.21.5
  - @backstage/backend-tasks@0.5.20
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/integration@1.9.1

## 0.3.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.9.0

## 0.3.11

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- 9f5b8bc: Add GitLab `visibility` to group entity annotations.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-catalog-node@1.8.0
  - @backstage/backend-tasks@0.5.19
  - @backstage/catalog-model@1.4.5

## 0.3.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.9.1-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-catalog-node@1.8.0-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1

## 0.3.11-next.1

### Patch Changes

- 9f5b8bc: Add GitLab `visibility` to group entity annotations.
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.1

## 0.3.10-next.0

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0

## 0.3.7

### Patch Changes

- 60e4c2a: Added the option to provide custom `groupTransformer`, `userTransformer` and `groupNameTransformer` to allow custom transformations of groups and users
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/backend-tasks@0.5.15
  - @backstage/catalog-model@1.4.4
  - @backstage/integration@1.9.0
  - @backstage/plugin-catalog-node@1.7.0
  - @backstage/config@1.1.1

## 0.3.7-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-catalog-node@1.6.2-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1

## 0.3.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/integration@1.9.0-next.0

## 0.3.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-node@1.6.2-next.1

## 0.3.7-next.0

### Patch Changes

- 60e4c2a: Added the option to provide custom `groupTransformer`, `userTransformer` and `groupNameTransformer` to allow custom transformations of groups and users
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0

## 0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/backend-tasks@0.5.14
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0

## 0.3.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-catalog-node@1.6.1-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-catalog-node@1.6.1-next.1

## 0.3.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0

## 0.3.5

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-catalog-node@1.6.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/integration@1.8.0
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1

## 0.3.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-catalog-node@1.6.0-next.3

## 0.3.5-next.2

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0-next.2
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0-next.1

## 0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-node@1.5.1-next.1

## 0.3.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/integration@1.8.0-next.0
  - @backstage/plugin-catalog-node@1.5.1-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1

## 0.3.4

### Patch Changes

- d732f17610: Added try catch around fetching gitlab group users to prevent refresh from failing completely while only a select number of groups might not be able to load correctly.
- 0873a43ac1: Resolved a bug affecting the retrieval of users from group members. By appending '/all' to the API call, we now include members from all inherited groups, as per Gitlab's API specifications. This change is reflected in the listSaaSUsers function.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0
  - @backstage/integration@1.7.2
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1

## 0.3.4-next.2

### Patch Changes

- [#20893](https://github.com/backstage/backstage/pull/20893) [`0873a43ac1`](https://github.com/backstage/backstage/commit/0873a43ac1557901b21dfa6f8534bbbfc73dc444) Thanks [@pushit-tech](https://github.com/pushit-tech)! - Resolved a bug affecting the retrieval of users from group members. By appending '/all' to the API call, we now include members from all inherited groups, as per Gitlab's API specifications. This change is reflected in the listSaaSUsers function.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-catalog-node@1.5.0-next.2

## 0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0-next.1
  - @backstage/integration@1.7.2-next.0
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1

## 0.3.4-next.0

### Patch Changes

- d732f17610: Added try catch around fetching gitlab group users to prevent refresh from failing completely while only a select number of groups might not be able to load correctly.
- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/integration@1.7.1
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-node@1.4.8-next.0

## 0.3.3

### Patch Changes

- 4f70fdfc93: fix: use REST API to get root group memberships for GitLab SaaS users listing

  This API is the only one that shows `email` field for enterprise users and
  allows to filter out bot users not using a license using the `is_using_seat`
  field.

  We also added the annotation `gitlab.com/saml-external-uid` taking the value
  of `group_saml_identity.extern_uid` of the `groups/:group-id/members` endpoint
  response. This is useful in case you want to create a `SignInResolver` that
  references the user with the id of your identity provider (e.g. OneLogin).

  ref:

  <https://docs.gitlab.com/ee/user/enterprise_user/#get-users-email-addresses-through-the-api>
  <https://docs.gitlab.com/ee/api/members.html#limitations>

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- 0b55f773a7: Removed some unused dependencies
- 6ae7f12abb: Make sure the archived projects are skipped with the Gitlab API
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## 0.3.3-next.2

### Patch Changes

- 4f70fdfc93: fix: use REST API to get root group memberships for GitLab SaaS users listing

  This API is the only one that shows `email` field for enterprise users and
  allows to filter out bot users not using a license using the `is_using_seat`
  field.

  We also added the annotation `gitlab.com/saml-external-uid` taking the value
  of `group_saml_identity.extern_uid` of the `groups/:group-id/members` endpoint
  response. This is useful in case you want to create a `SignInResolver` that
  references the user with the id of your identity provider (e.g. OneLogin).

  ref:

  <https://docs.gitlab.com/ee/user/enterprise_user/#get-users-email-addresses-through-the-api>
  <https://docs.gitlab.com/ee/api/members.html#limitations>

- 0b55f773a7: Removed some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/integration@1.7.1-next.1
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-catalog-node@1.4.7-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0

## 0.3.2-next.1

### Patch Changes

- 6ae7f12abb: Make sure the archived projects are skipped with the Gitlab API
- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/plugin-catalog-node@1.4.6-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.1-next.0
  - @backstage/types@1.1.1

## 0.3.2-next.0

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/integration@1.7.1-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.4.6-next.0

## 0.3.0

### Minor Changes

- 3d73bafd85c9: Fix Gitlab.com user ingestion by scoping GitlabOrgDiscoveryEntityProvider to a group.

  **BREAKING** The `group` parameter is now required Gitlab.com Org Data integrations and the backend will fail to start without this option configured.

  ```diff
  catalog:
    providers:
      gitlab:
        yourProviderId:
          host: gitlab.com
          orgEnabled: true
  +       group: org/teams
  ```

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
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.0
  - @backstage/types@1.1.1
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-catalog-node@1.4.4

## 0.3.0-next.3

### Minor Changes

- 3d73bafd85c9: Fix Gitlab.com user ingestion by scoping GitlabOrgDiscoveryEntityProvider to a group.

  **BREAKING** The `group` parameter is now required Gitlab.com Org Data integrations and the backend will fail to start without this option configured.

  ```diff
  catalog:
    providers:
      gitlab:
        yourProviderId:
          host: gitlab.com
          orgEnabled: true
  +       group: org/teams
  ```

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
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/integration@1.7.0-next.3
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-catalog-node@1.4.4-next.3

## 0.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/integration@1.7.0-next.1
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-catalog-node@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/integration@1.7.0-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-node@1.4.3-next.0

## 0.2.4

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- e6c721439f37: Added option to skip forked repos in GitlabDiscoveryEntityProvider
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- 2fe1f5973ff7: Filter Gitlab archived projects through APIs
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-catalog-node@1.4.1
  - @backstage/integration@1.6.0
  - @backstage/backend-tasks@0.5.5
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.2.4-next.2

### Patch Changes

- 2fe1f5973ff7: Filter Gitlab archived projects through APIs
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## 0.2.4-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- e6c721439f37: Added option to skip forked repos in GitlabDiscoveryEntityProvider
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-catalog-node@1.4.1-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/integration@1.5.1
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration@1.5.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-node@1.4.1-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/plugin-catalog-node@1.4.0
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/backend-tasks@0.5.4
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1
  - @backstage/types@1.1.0

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/plugin-catalog-node@1.4.0-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1-next.0
  - @backstage/types@1.1.0

## 0.2.2

### Patch Changes

- f31fd1f8fd98: Fixed bug that caused ingestion errors when a user's name or profile picture is undefined.
- 66261b4ab441: Added option to skip forked repos
- 571f78ed0ea7: Fix getGroupMembers with token that don't have sufficient permissions
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/types@1.1.0
  - @backstage/integration@1.5.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-catalog-node@1.3.7
  - @backstage/config@1.0.8

## 0.2.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/integration@1.5.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.7-next.2

## 0.2.2-next.2

### Patch Changes

- f31fd1f8fd98: Fixed bug that caused ingestion errors when a user's name or profile picture is undefined.
- 66261b4ab441: Added option to skip forked repos
- Updated dependencies
  - @backstage/config@1.0.7

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/integration@1.5.0-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.3.7-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/integration@1.4.5
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.2.1

### Patch Changes

- b12c41fafc4: Fix a corner case where returned users are null for bots
- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/integration@1.4.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-catalog-node@1.3.6
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/integration@1.4.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-catalog-node@1.3.6-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.2.0

### Minor Changes

- f64345108a0: **BREAKING**: The configuration of the `GitlabDiscoveryEntityProvider` has changed as follows:

  - The configuration key `branch` is now used to define the branch from which the catalog-info should be discovered.
  - The old configuration key `branch` is now called `fallbackBranch`. This value specifies which branch should be used
    if no default branch is defined on the project itself.

  To migrate to the new configuration value, rename `branch` to `fallbackBranch`

### Patch Changes

- 7b1b7bfdb7b: The gitlab org data integration now makes use of the GraphQL API to determine
  the relationships between imported User and Group entities, effectively making
  this integration usable without an administrator account's Personal Access
  Token.
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/integration@1.4.4
  - @backstage/plugin-catalog-node@1.3.5
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.2.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.5-next.3

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.5-next.2

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/integration@1.4.4-next.0
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.5-next.1

## 0.2.0-next.0

### Minor Changes

- f64345108a0: **BREAKING**: The configuration of the `GitlabDiscoveryEntityProvider` has changed as follows:

  - The configuration key `branch` is now used to define the branch from which the catalog-info should be discovered.
  - The old configuration key `branch` is now called `fallbackBranch`. This value specifies which branch should be used
    if no default branch is defined on the project itself.

  To migrate to the new configuration value, rename `branch` to `fallbackBranch`

### Patch Changes

- 7b1b7bfdb7b: The gitlab org data integration now makes use of the GraphQL API to determine
  the relationships between imported User and Group entities, effectively making
  this integration usable without an administrator account's Personal Access
  Token.
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.5-next.0

## 0.1.14

### Patch Changes

- 90469c02c8c: Renamed `gitlabDiscoveryEntityProviderCatalogModule` to `catalogModuleGitlabDiscoveryEntityProvider` to match the [recommended naming patterns](https://backstage.io/docs/backend-system/architecture/naming-patterns).
- e675f902980: Make sure to not use deprecated exports from `@backstage/plugin-catalog-backend`
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- af1095f1e11: The configuration key `branch` of the `GitlabDiscoveryEntityProvider` has been deprecated in favor of the configuration key `fallbackBranch`.
  It will be reused in future release to enforce a concrete branch to be used in catalog file discovery.
  To migrate to the new configuration value, rename `branch` to `fallbackBranch`.
- be129f8f3cd: filter gitlab groups by prefix
- Updated dependencies
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.4
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/integration@1.4.3
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.14-next.2

### Patch Changes

- be129f8f3cd: filter gitlab groups by prefix
- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-catalog-backend@1.8.0-next.2
  - @backstage/plugin-catalog-node@1.3.4-next.2
  - @backstage/config@1.0.7-next.0
  - @backstage/integration@1.4.3-next.0

## 0.1.14-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- af1095f1e11: The configuration key `branch` of the `GitlabDiscoveryEntityProvider` has been deprecated in favor of the configuration key `fallbackBranch`.
  It will be reused in future release to enforce a concrete branch to be used in catalog file discovery.
  To migrate to the new configuration value, rename `branch` to `fallbackBranch`.
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/integration@1.4.3-next.0
  - @backstage/plugin-catalog-backend@1.8.0-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.4-next.1

## 0.1.14-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.0-next.0
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.3.4-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.1.13

### Patch Changes

- 49948f644f: The config now consistently uses the term 'instance' to refer to a single GitLab API host.
- 85b04f659a: Internal refactor to not use deprecated `substr`
- 52c5685ceb: Implement Group and User Catalog Provider
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/catalog-model@1.2.0
  - @backstage/plugin-catalog-node@1.3.3
  - @backstage/backend-tasks@0.4.3
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.1.13-next.2

### Patch Changes

- 49948f644f: The config now consistently uses the term 'instance' to refer to a single GitLab API host.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-catalog-backend@1.7.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/plugin-catalog-node@1.3.3-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.1.13-next.1

### Patch Changes

- 85b04f659a: Internal refactor to not use deprecated `substr`
- 52c5685ceb: Implement Group and User Catalog Provider
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2-next.1
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.3-next.1

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-catalog-backend@1.7.2-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.1.11

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/catalog-model@1.1.5
  - @backstage/backend-tasks@0.4.1
  - @backstage/plugin-catalog-node@1.3.1
  - @backstage/plugin-catalog-backend@1.7.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.1.11-next.2

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/plugin-catalog-backend@1.7.0-next.2
  - @backstage/plugin-catalog-node@1.3.1-next.2
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.1-next.0

## 0.1.10

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-catalog-node@1.3.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/errors@1.1.4
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5

## 0.1.10-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.3
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-node@1.3.0-next.3

## 0.1.10-next.2

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-catalog-backend@1.6.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/plugin-catalog-node@1.2.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1

## 0.1.10-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
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

## 0.1.9

### Patch Changes

- 6bb046bcbe: Add `gitlabDiscoveryEntityProviderCatalogModule` (new backend-plugin-api, alpha).
- 81cedb5033: `GitlabDiscoveryEntityProvider`: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  <https://backstage.io/docs/integrations/gitlab/discovery>

- 4c9f7847e4: Updated dependency `msw` to `^0.48.0` while moving it to be a dev dependency.
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-catalog-backend@1.5.1
  - @backstage/integration@1.4.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/catalog-model@1.1.3
  - @backstage/types@1.0.1
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/plugin-catalog-node@1.2.1
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/plugin-catalog-backend@1.5.1-next.1
  - @backstage/plugin-catalog-node@1.2.1-next.1
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/types@1.0.1-next.0

## 0.1.9-next.0

### Patch Changes

- 6bb046bcbe: Add `gitlabDiscoveryEntityProviderCatalogModule` (new backend-plugin-api, alpha).
- 81cedb5033: `GitlabDiscoveryEntityProvider`: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  <https://backstage.io/docs/integrations/gitlab/discovery>

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-catalog-backend@1.5.1-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/plugin-catalog-node@1.2.1-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-catalog-backend@1.5.0
  - @backstage/backend-tasks@0.3.6
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/integration@1.3.2
  - @backstage/types@1.0.0

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.5.0-next.2
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/types@1.0.0

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-backend@1.4.1-next.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/plugin-catalog-backend@1.4.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/types@1.0.0

## 0.1.7

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/integration@1.3.1
  - @backstage/plugin-catalog-backend@1.4.0
  - @backstage/backend-tasks@0.3.5
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1

## 0.1.7-next.3

### Patch Changes

- Updated dependencies
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
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/integration@1.3.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.2

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.1

## 0.1.7-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/plugin-catalog-backend@1.3.2-next.0
  - @backstage/integration@1.3.1-next.0

## 0.1.6

### Patch Changes

- 24979413a4: Enhancing GitLab provider with filtering projects by pattern RegExp

  ```yaml
  providers:
    gitlab:
      stg:
        host: gitlab.stg.company.io
        branch: main
        projectPattern: 'john/' # new option
        entityFilename: template.yaml
  ```

  With the aforementioned parameter you can filter projects, and keep only who belongs to the namespace "john".

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/integration@1.3.0
  - @backstage/backend-tasks@0.3.4
  - @backstage/plugin-catalog-backend@1.3.1

## 0.1.6-next.1

### Patch Changes

- 24979413a4: Enhancing GitLab provider with filtering projects by pattern RegExp

  ```yaml
  providers:
    gitlab:
      stg:
        host: gitlab.stg.company.io
        branch: main
        projectPattern: 'john/' # new option
        entityFilename: template.yaml
  ```

  With the aforementioned parameter you can filter projects, and keep only who belongs to the namespace "john".

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.1-next.2

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
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 49ff472c0b: Add the possibility in the `GitlabDiscoveryEntityProvider` to scan the whole project instead of concrete groups. For that, use a configuration like this one, where the group parameter is omitted (not mandatory anymore):

  ```yaml
  catalog:
    providers:
      gitlab:
        yourProviderId:
          host: gitlab-host # Identifies one of the hosts set up in the integrations
          branch: main # Optional. Uses `master` as default
          entityFilename: catalog-info.yaml # Optional. Defaults to `catalog-info.yaml`
  ```

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
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0-next.3
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/integration@1.2.2-next.3
  - @backstage/backend-tasks@0.3.3-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 0.1.5-next.1

### Patch Changes

- 49ff472c0b: Add the possibility in the `GitlabDiscoveryEntityProvider` to scan the whole project instead of concrete groups. For that, use a configuration like this one, where the group parameter is omitted (not mandatory anymore):

  ```yaml
  catalog:
    providers:
      gitlab:
        yourProviderId:
          host: gitlab-host # Identifies one of the hosts set up in the integrations
          branch: main # Optional. Uses `master` as default
          entityFilename: catalog-info.yaml # Optional. Defaults to `catalog-info.yaml`
  ```

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

- eea8126171: Add a new provider `GitlabDiscoveryEntityProvider` as replacement for `GitlabDiscoveryProcessor`

  In order to migrate from the `GitlabDiscoveryProcessor` you need to apply
  the following changes:

  **Before:**

  ```yaml
  # app-config.yaml

  catalog:
    locations:
      - type: gitlab-discovery
        target: https://company.gitlab.com/prefix/*/catalog-info.yaml
  ```

  ```ts
  /* packages/backend/src/plugins/catalog.ts */

  import { GitlabDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-gitlab';

  const builder = await CatalogBuilder.create(env);
  /** ... other processors ... */
  builder.addProcessor(
    GitLabDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  ```

  **After:**

  ```yaml
  # app-config.yaml

  catalog:
    providers:
      gitlab:
        yourProviderId: # identifies your dataset / provider independent of config changes
          host: gitlab-host # Identifies one of the hosts set up in the integrations
          branch: main # Optional. Uses `master` as default
          group: example-group # Group and subgroup (if needed) to look for repositories
          entityFilename: catalog-info.yaml # Optional. Defaults to `catalog-info.yaml`
  ```

  ```ts
  /* packages/backend/src/plugins/catalog.ts */

  import { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';

  const builder = await CatalogBuilder.create(env);
  /** ... other processors and/or providers ... */
  builder.addEntityProvider(
    ...GitlabDiscoveryEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
    }),
  );
  ```

- bad907d794: The `last_activity_after` timestamp is now being omitted when querying the GitLab API for the first time.
- 3ac4522537: do not create location object if file with component definition do not exists in project, that decrease count of request to gitlab with 404 status code. Now we can create processor with new flag to enable this logic:

  ```ts
  const processor = GitLabDiscoveryProcessor.fromConfig(config, {
    logger,
    skipReposWithoutExactFileMatch: true,
  });
  ```

  **WARNING:** This new functionality does not support globs in the repo file path

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
  - @backstage/plugin-catalog-backend@1.2.0-next.2

## 0.1.4-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/catalog-model@1.0.3-next.0

## 0.1.4-next.0

### Patch Changes

- 3ac4522537: do not create location object if file with component definition do not exists in project, that decrease count of request to gitlab with 404 status code. Now we can create processor with new flag to enable this logic:

  ```ts
  const processor = GitLabDiscoveryProcessor.fromConfig(config, {
    logger,
    skipReposWithoutExactFileMatch: true,
  });
  ```

  **WARNING:** This new functionality does not support globs in the repo file path

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/plugin-catalog-backend@1.2.0-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-catalog-backend@1.1.2
  - @backstage/integration@1.2.0
  - @backstage/config@1.0.1
  - @backstage/catalog-model@1.0.2

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-catalog-backend@1.1.2-next.2
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

- 66ba5d9023: Added package, moving out GitLab specific functionality from the catalog-backend

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-catalog-backend@0.24.0
  - @backstage/catalog-model@0.13.0

## 0.1.0-next.0

### Minor Changes

- 66ba5d9023: Added package, moving out GitLab specific functionality from the catalog-backend

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-catalog-backend@0.24.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
