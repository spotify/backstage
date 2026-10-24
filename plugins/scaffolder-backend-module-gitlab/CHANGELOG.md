# @backstage/plugin-scaffolder-backend-module-gitlab

## 0.12.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.9-next.0

## 0.12.1

### Patch Changes

- 06128be: Throw a `ConflictError` with a clear message when `publish:gitlab` is called and the target repository already exists, instead of letting the GitLab API return a `GitbeakerRequestError` with a raw JSON body such as `{"name":["has already been taken"]}`.
- fe51d40: Added a secure `variableKey` input to `gitlab:projectAccessToken:create` and `gitlab:projectDeployToken:create` actions. When provided, the generated token is stored directly as a masked GitLab CI/CD variable instead of being exposed in task outputs and checkpoint state. The raw token outputs are now deprecated when `variableKey` is not used.
- Updated dependencies
  - @backstage/integration@2.1.3
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/plugin-scaffolder-node@0.13.8

## 0.12.1-next.2

### Patch Changes

- 06128be: Throw a `ConflictError` with a clear message when `publish:gitlab` is called and the target repository already exists, instead of letting the GitLab API return a `GitbeakerRequestError` with a raw JSON body such as `{"name":["has already been taken"]}`.
- Updated dependencies
  - @backstage/integration@2.1.3-next.1

## 0.12.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-scaffolder-node@0.13.8-next.1

## 0.12.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## 0.12.0

### Minor Changes

- 5c14f42: The `gitlab:issues:create` action now accepts a full project path (e.g. `group/sub-group/project`) for `projectId`, and `projectId` is optional — when omitted the project is derived from `repoUrl` (matching the behaviour of `gitlab:merge-request`).

### Patch Changes

- 736d84e: Use locale-insensitive Unicode casing for consistent string handling across environments.
- bbba6b5: Added support for requiring user-provided credentials for GitLab mutation actions when `scaffolder.requireScmUserCredentials` is enabled.
- 20595f0: The `gitlab:projectVariable:create` action no longer includes the variable value in its checkpoint key, preventing secret values from being persisted in scaffolder task state. The `gitlab:pipeline:trigger` action has been refactored so that the temporary pipeline trigger token is never serialized into checkpoint state.
- 4740660: Sped up `publish:gitlab:merge-request` and `gitlab:repo:push` by drastically reducing the number
  of GitLab API requests they make.

  Under the default `commitAction: 'auto'`, both actions previously downloaded the contents of every
  file already present on the target branch in order to work out which ones had actually changed.
  That information is available from the repository listing they already fetch, so the comparison is
  now done locally and those per-file requests are gone. The listing itself is also fetched in larger
  pages.

  For a merge request against a repository of a few hundred files this cuts the number of requests
  from roughly 300 to under ten, taking a step that took 5-15 seconds against a self-hosted GitLab
  down to about 3 seconds. Which files are created, updated or skipped is unchanged, including for
  repositories using git sha256 object format.

- 3c7c082: Fixed `gitlab:repo:push` failing with `400 Bad request - Provide at least one action` when the workspace has no file changes to commit (e.g. re-running a template against an already up-to-date branch). The action now detects an empty action list, skips the commit API call, and logs a warning whenever `allowEmpty` is not true (covering both the default of unset and an explicit `false`). The `commitHash` output is omitted in this no-op case and is now declared optional. Pass `allowEmpty: true` to retain the previous behavior of forwarding an empty commit to GitLab.
- cd77db3: Added an `autoMerge` boolean input to the `publish:gitlab:merge-request` scaffolder action. When set to `true`, the merge request is automatically merged once all merge checks succeed, using GitLab's auto-merge feature.
- Updated dependencies
  - @backstage/integration@2.1.2
  - @backstage/config@1.3.9
  - @backstage/plugin-scaffolder-node@0.13.7
  - @backstage/backend-plugin-api@1.10.1

## 0.11.11-next.2

### Patch Changes

- 20595f0: The `gitlab:projectVariable:create` action no longer includes the variable value in its checkpoint key, preventing secret values from being persisted in scaffolder task state. The `gitlab:pipeline:trigger` action has been refactored so that the temporary pipeline trigger token is never serialized into checkpoint state.
- 4740660: Sped up `publish:gitlab:merge-request` and `gitlab:repo:push` by drastically reducing the number
  of GitLab API requests they make.

  Under the default `commitAction: 'auto'`, both actions previously downloaded the contents of every
  file already present on the target branch in order to work out which ones had actually changed.
  That information is available from the repository listing they already fetch, so the comparison is
  now done locally and those per-file requests are gone. The listing itself is also fetched in larger
  pages.

  For a merge request against a repository of a few hundred files this cuts the number of requests
  from roughly 300 to under ten, taking a step that took 5-15 seconds against a self-hosted GitLab
  down to about 3 seconds. Which files are created, updated or skipped is unchanged, including for
  repositories using git sha256 object format.

- Updated dependencies
  - @backstage/config@1.3.9-next.0
  - @backstage/plugin-scaffolder-node@0.13.7-next.2
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/integration@2.1.2-next.1

## 0.11.11-next.1

### Patch Changes

- bbba6b5: Added support for requiring user-provided credentials for GitLab mutation actions when `scaffolder.requireScmUserCredentials` is enabled.
- cd77db3: Added an `autoMerge` boolean input to the `publish:gitlab:merge-request` scaffolder action. When set to `true`, the merge request is automatically merged once all merge checks succeed, using GitLab's auto-merge feature.
- Updated dependencies
  - @backstage/integration@2.1.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.7-next.1
  - @backstage/backend-plugin-api@1.10.1-next.0

## 0.11.10-next.0

### Patch Changes

- 3c7c082: Fixed `gitlab:repo:push` failing with `400 Bad request - Provide at least one action` when the workspace has no file changes to commit (e.g. re-running a template against an already up-to-date branch). The action now detects an empty action list, skips the commit API call, and logs a warning whenever `allowEmpty` is not true (covering both the default of unset and an explicit `false`). The `commitHash` output is omitted in this no-op case and is now declared optional. Pass `allowEmpty: true` to retain the previous behavior of forwarding an empty commit to GitLab.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.7-next.0

## 0.11.9

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.6
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/integration@2.1.0

## 0.11.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.0-next.0
  - @backstage/plugin-scaffolder-node@0.13.6-next.1

## 0.11.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-scaffolder-node@0.13.6-next.0

## 0.11.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/plugin-scaffolder-node@0.13.5

## 0.11.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-scaffolder-node@0.13.5-next.0

## 0.11.7

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.4
  - @backstage/integration@2.0.3
  - @backstage/backend-plugin-api@1.9.2

## 0.11.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.0.3-next.0
  - @backstage/plugin-scaffolder-node@0.13.4-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0

## 0.11.6

### Patch Changes

- 8474da5: Added `allowEmpty` input option to the `gitlab:repo:push` action, allowing empty commits. Required from GitLab 18.8 or later.
- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/integration@2.0.2
  - @backstage/plugin-scaffolder-node@0.13.3
  - @backstage/config@1.3.8

## 0.11.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/integration@2.0.2-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-scaffolder-node@0.13.3-next.0

## 0.11.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/plugin-scaffolder-node@0.13.2
  - @backstage/integration@2.0.1
  - @backstage/config@1.3.7

## 0.11.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-scaffolder-node@0.13.2-next.2
  - @backstage/integration@2.0.1-next.0
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/config@1.3.7-next.0

## 0.11.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-scaffolder-node@0.13.1-next.1

## 0.11.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-scaffolder-node@0.13.1-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration@2.0.0

## 0.11.4

### Patch Changes

- 5730c8e: Added `maskedAndHidden` option to `gitlab:projectVariable:create` and `publish:gitlab` action to support creating GitLab project variables that are both masked and hidden. Updated gitbeaker to version 43.8.0 for proper type support.
- 0c1726a: Added new `gitlab:group:access` scaffolder action to add or remove users and groups as members of GitLab groups. The action supports specifying members via `userIds` and/or `groupIds` array parameters, configurable access levels (Guest, Reporter, Developer, Maintainer, Owner), and defaults to the 'add' action when not specified.
- 4b8fcf0: Added two optional inputs to the `publish:gitlab` action:

  - `settings.name`: set a custom human-readable project title that differs from the repository slug.
  - `ownerUsername`: add a specific GitLab user as project owner (access level 50) of the newly created repository. Requires a privileged token in the integration configuration.

- a49a40d: Updated dependency `zod` to `^3.25.76 || ^4.0.0` & migrated to `/v3` or `/v4` imports.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/plugin-scaffolder-node@0.13.0
  - @backstage/integration@2.0.0

## 0.11.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/integration@2.0.0-next.2
  - @backstage/plugin-scaffolder-node@0.13.0-next.2

## 0.11.4-next.1

### Patch Changes

- 0c1726a: Added new `gitlab:group:access` scaffolder action to add or remove users and groups as members of GitLab groups. The action supports specifying members via `userIds` and/or `groupIds` array parameters, configurable access levels (Guest, Reporter, Developer, Maintainer, Owner), and defaults to the 'add' action when not specified.
- Updated dependencies
  - @backstage/integration@2.0.0-next.1
  - @backstage/plugin-scaffolder-node@0.13.0-next.1
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7

## 0.11.4-next.0

### Patch Changes

- 5730c8e: Added `maskedAndHidden` option to `gitlab:projectVariable:create` and `publish:gitlab` action to support creating GitLab project variables that are both masked and hidden. Updated gitbeaker to version 43.8.0 for proper type support.
- Updated dependencies
  - @backstage/integration@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/plugin-scaffolder-node@0.12.6-next.0

## 0.11.3

### Patch Changes

- 6b5e7d9: Allow setting optional description on group creation
- 7455dae: Use node prefix on native imports
- f0f9403: Changed `gitlab:group:ensureExists` action to use `Groups.show` API instead of `Groups.search` for checking if a group path exists. This is more efficient as it directly retrieves the group by path rather than searching and filtering results.
- 32c51c0: Added new `gitlab:user:info` scaffolder action that retrieves information about a GitLab user. The action can fetch either the current authenticated user or a specific user by ID.
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/integration@1.20.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-scaffolder-node@0.12.5

## 0.11.3-next.2

### Patch Changes

- 6b5e7d9: Allow setting optional description on group creation
- f0f9403: Changed `gitlab:group:ensureExists` action to use `Groups.show` API instead of `Groups.search` for checking if a group path exists. This is more efficient as it directly retrieves the group by path rather than searching and filtering results.
- Updated dependencies
  - @backstage/integration@1.20.0-next.2
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-scaffolder-node@0.12.5-next.1

## 0.11.3-next.1

### Patch Changes

- 32c51c0: Added new `gitlab:user:info` scaffolder action that retrieves information about a GitLab user. The action can fetch either the current authenticated user or a specific user by ID.
- Updated dependencies
  - @backstage/integration@1.20.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-scaffolder-node@0.12.5-next.1

## 0.11.2-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/plugin-scaffolder-node@0.12.4-next.0
  - @backstage/integration@1.19.3-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7

## 0.11.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/plugin-scaffolder-node@0.12.3
  - @backstage/integration@1.19.2

## 0.11.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.19.2-next.0
  - @backstage/plugin-scaffolder-node@0.12.3-next.0

## 0.11.0

### Minor Changes

- f2d034b: In the `gitlabRepoPush` action, add 'auto' possibility for `commitAction` input.

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.19.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-scaffolder-node@0.12.2

## 0.11.0-next.1

### Minor Changes

- f2d034b: In the `gitlabRepoPush` action, add 'auto' possibility for `commitAction` input.

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.3-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/plugin-scaffolder-node@0.12.2-next.1

## 0.10.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/integration@1.18.3-next.0
  - @backstage/plugin-scaffolder-node@0.12.2-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7

## 0.10.0

### Minor Changes

- ff96d7e: fix scaffolder action createDeployToken to allow usage of oauth tokens

### Patch Changes

- b2bef92: Convert all enums to erasable-syntax compliant patterns
- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1

## 0.10.0-next.1

### Minor Changes

- ff96d7e: fix scaffolder action createDeployToken to allow usage of oauth tokens

### Patch Changes

- b2bef92: Convert all enums to erasable-syntax compliant patterns
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-scaffolder-node@0.12.1-next.1

## 0.9.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.6-next.0
  - @backstage/integration@1.18.2-next.0
  - @backstage/plugin-scaffolder-node@0.12.1-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/errors@1.2.7

## 0.9.6

### Patch Changes

- c8aa210: Updating import for the `scaffolderActionsExtensionPoint` to be the main export
- f5e0963: Removed unused dependencies
- Updated dependencies
  - @backstage/integration@1.18.1
  - @backstage/plugin-scaffolder-node@0.12.0
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4

## 0.9.6-next.2

### Patch Changes

- f5e0963: Removed unused dependencies

## 0.9.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/integration@1.18.1-next.1
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-scaffolder-node@0.12.0-next.1

## 0.9.6-next.0

### Patch Changes

- c8aa210: Updating import for the `scaffolderActionsExtensionPoint` to be the main export
- Updated dependencies
  - @backstage/integration@1.18.1-next.0
  - @backstage/plugin-scaffolder-node@0.12.0-next.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7

## 0.9.5

### Patch Changes

- a84ddea: The log message now indicates that the pipeline trigger token was deleted and not pipeline itself.
- Updated dependencies
  - @backstage/integration@1.18.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/plugin-scaffolder-node@0.11.1

## 0.9.5-next.0

### Patch Changes

- a84ddea: The log message now indicates that the pipeline trigger token was deleted and not pipeline itself.
- Updated dependencies
  - @backstage/integration@1.18.0-next.0
  - @backstage/plugin-scaffolder-node@0.11.1-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0

## 0.9.4

### Patch Changes

- 5bb870b: Show additional information about the cause in error messages from GitLab
- df2bfab: The `description` property in `publish:gitlab:merge-request` has been made optional again to comply with the GitLab API.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2

## 0.9.4-next.1

### Patch Changes

- 5bb870b: Show additional information about the cause in error messages from GitLab

## 0.9.4-next.0

### Patch Changes

- df2bfab: The `description` property in `publish:gitlab:merge-request` has been made optional again to comply with the GitLab API.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.1

## 0.9.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/plugin-scaffolder-node@0.10.0
  - @backstage/integration@1.17.1
  - @backstage/backend-plugin-api@1.4.1

## 0.9.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.10.0-next.2

## 0.9.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/integration@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-scaffolder-node@0.9.1-next.1

## 0.9.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.9.1-next.0
  - @backstage/integration@1.17.1-next.0
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.9.2

### Patch Changes

- 063b2d3: Fixed dependency to frontend package from tests
- a296637: Migrate to new action format
- 3d6493a: Support merge request labels in publish:gitlab:merge-request
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.9.0
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0

## 0.9.2-next.2

### Patch Changes

- a296637: Migrate to new action format
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.9.0-next.2
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0

## 0.9.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.8.3-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0

## 0.9.2-next.0

### Patch Changes

- 3d6493a: Support merge request labels in publish:gitlab:merge-request
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.8.3-next.0
  - @backstage/backend-plugin-api@1.4.0-next.0

## 0.9.1

### Patch Changes

- d15355c: If the commit action is not `create` log a more appropriate error message to the end user advising that the files they're trying to modify might not exist
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/integration@1.17.0
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/plugin-scaffolder-node@0.8.2
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.9.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0-next.3
  - @backstage/plugin-scaffolder-node@0.8.2-next.3
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.9.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0-next.2
  - @backstage/config@1.3.2
  - @backstage/plugin-scaffolder-node@0.8.2-next.2
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/errors@1.2.7

## 0.9.1-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.9.1-next.0

### Patch Changes

- d15355c: If the commit action is not `create` log a more appropriate error message to the end user advising that the files they're trying to modify might not exist
- Updated dependencies
  - @backstage/integration@1.16.4-next.0
  - @backstage/plugin-scaffolder-node@0.8.2-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.9.0

### Minor Changes

- d86ce21: Added additional feedback in case branch is already created

### Patch Changes

- 003dc15: Updated the path field in the `gitlab:group:ensureExists` action to support also strings with multiple segments (e.g. `group/subgroup`)
- 19e23da: Adds more context to the `gitlab:repo:push` `commitAction` property for the installed actions section in the scaffolder
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.8.1
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/integration@1.16.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.8.2-next.1

### Patch Changes

- 003dc15: Updated the path field in the `gitlab:group:ensureExists` action to support also strings with multiple segments (e.g. `group/subgroup`)
- Updated dependencies
  - @backstage/integration@1.16.3-next.0
  - @backstage/plugin-scaffolder-node@0.8.1-next.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.8.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.8.1-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.2

## 0.8.1

### Patch Changes

- 0df33ea: fix: Creating a repository in a user namespace would always lead to an error
- 984b283: Made "gitlab:pipeline:trigger" action idempotent
- 225c733: Made gitlab:repo:push action idempotent.
- a08cb20: Remove usages of `@backstage/backend-common`
- ac58f84: Made gitlab:issue:edit action idempotent.
- f6b51a8: Made "gitlab:projectDeployToken:create" action idempotent
- a75e18f: Change the if statement in the catch block to match what the new version of Gitbeaker will return
- 36af946: Made "gitlab:projectVariable:create" action idempotent
- 1cea434: Made "gitlab:projectAccessToken:create" action idempotent
- 4f8b5b6: Allow signing git commits using configured private PGP key in scaffolder
- 83ae330: Made "gitlab:group:migrate" action idempotent
- Updated dependencies
  - @backstage/integration@1.16.2
  - @backstage/plugin-scaffolder-node@0.8.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.8.1-next.2

### Patch Changes

- 0df33ea: fix: Creating a repository in a user namespace would always lead to an error
- ac58f84: Made gitlab:issue:edit action idempotent.
- a75e18f: Change the if statement in the catch block to match what the new version of Gitbeaker will return
- 4f8b5b6: Allow signing git commits using configured private PGP key in scaffolder
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.8.0-next.2
  - @backstage/integration@1.16.2-next.0
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.8.1-next.1

### Patch Changes

- a08cb20: Remove usages of `@backstage/backend-common`
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.7.1-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1

## 0.8.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-scaffolder-node@0.7.1-next.0

## 0.8.0

### Minor Changes

- 06eee14: Support empty repository creation in gitlab without workspace pushing and conditionally skip if the repository already exists.

### Patch Changes

- a0419a6: Made gitlab:group:ensureExists action idempotent
- 9d04e91: Fix automated assignment of reviewers for instances without premium/ultimate license (404). Introduce opt-in flag for automatic reviewer assignment based on approval rules
- 9545c5f: `createGitlabProjectMigrateAction` can now output the `migrationId`
- e52cee6: Made gitlab:issues:create action idempotent.
- fe44946: Fixed bug of passing wrong value to `onChange` handler when using `GitLab` autocomplete
- 66e392f: Making publish:gitlab:merge-request idempotent.
- a7b22eb: Fixed bug in gitlabRepoPush where it was looking in the wrong place in the exception response from gitbeaker when checking if the branch already exists
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-scaffolder-node@0.7.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1

## 0.8.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.7.0-next.2
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1

## 0.8.0-next.2

### Patch Changes

- 9d04e91: Fix automated assignment of reviewers for instances without premium/ultimate license (404). Introduce opt-in flag for automatic reviewer assignment based on approval rules
- 9545c5f: `createGitlabProjectMigrateAction` can now output the `migrationId`
- fe44946: Fixed bug of passing wrong value to `onChange` handler when using `GitLab` autocomplete
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/plugin-scaffolder-node@0.7.0-next.1

## 0.8.0-next.1

### Minor Changes

- 06eee14: Support empty repository creation in gitlab without workspace pushing and conditionally skip if the repository already exists.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/plugin-scaffolder-node@0.7.0-next.0

## 0.7.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/plugin-scaffolder-node@0.7.0-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1

## 0.7.1

### Patch Changes

- 8fb529a: Added `reviewerIds` to the Gitlab Merge Request action.
- a913beb: Added action `gitlab:group:migrate` to migrate projects using `bulk_import`
- 7b62987: Updated the path field in the `gitlab:group:ensureExists` action to accept an array of either strings or objects with name and slug fields.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.6.3
  - @backstage/integration@1.16.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.7.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-scaffolder-node@0.6.3-next.1
  - @backstage/integration@1.16.1-next.0

## 0.7.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.6.3-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/integration@1.16.0

## 0.7.0

### Minor Changes

- c4ffd13: Added the autocomplete feature to GitlabRepoUrlPicker
- 32459d0: **BREAKING**: Upgraded the `gitbeaker` library to version 41. As part of this, the `scopes` parameter to the `gitlab:projectDeployToken:create` is no longer optional, so you will have to pass it a value (for example `['read_repository']`).

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.0
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-scaffolder-node@0.6.2
  - @backstage/errors@1.2.6
  - @backstage/config@1.3.1

## 0.7.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-scaffolder-node@0.6.2-next.2
  - @backstage/config@1.3.1-next.0
  - @backstage/integration@1.16.0-next.1

## 0.7.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.6.2-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/integration@1.16.0-next.0

## 0.7.0-next.0

### Minor Changes

- c4ffd13: Added the autocomplete feature to GitlabRepoUrlPicker
- 32459d0: **BREAKING**: Upgraded the `gitbeaker` library to version 41. As part of this, the `scopes` parameter to the `gitlab:projectDeployToken:create` is no longer optional, so you will have to pass it a value (for example `['read_repository']`).

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-scaffolder-node@0.6.1-next.0
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5

## 0.6.1

### Patch Changes

- cdc8b4c: Improve error messages from Gitlab
- 2dbdccb: Removed circular import
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-scaffolder-node@0.6.0
  - @backstage/errors@1.2.5
  - @backstage/integration@1.15.2

## 0.6.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-node@0.5.1-next.3

## 0.6.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-node@0.5.1-next.2

## 0.6.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-node@0.5.1-next.1

## 0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-node@0.5.1-next.0

## 0.6.0

### Minor Changes

- 73f2ccf: declare correct type (number) for publish:gitlab output.projectId

### Patch Changes

- 9adfe46: GitLab MR: introduce 'skip' commit action.
- bc71718: Updated installation instructions in README to not include `/alpha`.
- 094eaa3: Remove references to in-repo backend-common
- f2f68cf: Updated `gitlab:group:ensureExists` action to instead use oauth client.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.5.0
  - @backstage/integration@1.15.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.6.0-next.2

### Minor Changes

- 73f2ccf: declare correct type (number) for publish:gitlab output.projectId

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.5.0-next.1

## 0.5.1-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- f2f68cf: Updated `gitlab:group:ensureExists` action to instead use oauth client.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.5.0-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.0

## 0.5.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- 5d1670f: Update README installation instructions
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/integration@1.15.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.11

## 0.5.0-next.2

### Patch Changes

- 5d1670f: Update README installation instructions
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/integration@1.15.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.11-next.2

## 0.5.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/plugin-scaffolder-node@0.4.11-next.1

## 0.5.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.11-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0

## 0.4.5

### Patch Changes

- da97131: Added test cases for gitlab:issues:create examples
- fad1b90: Allow the `createGitlabProjectVariableAction` to use oauth tokens
- aab708e: Added test cases for gitlab:issue:edit examples
- ef742dc: Added test cases for gitlab:projectAccessToken:create example
- 1ba4c2f: Added test cases for gitlab:pipeline:trigger examples
- a6603e4: Add custom action for merge request: **auto**

  The **Auto** action selects the committed action between _create_ and _update_.

  The **Auto** action fetches files using the **/projects/repository/tree endpoint**.
  After fetching, it checks if the file exists locally and in the repository. If it does, it chooses **update**; otherwise, it chooses **create**.

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-scaffolder-node@0.4.9
  - @backstage/integration@1.14.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.5-next.3

### Patch Changes

- da97131: Added test cases for gitlab:issues:create examples
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.9-next.3

## 0.4.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-scaffolder-node@0.4.9-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/integration@1.14.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.9-next.1

## 0.4.5-next.0

### Patch Changes

- fad1b90: Allow the `createGitlabProjectVariableAction` to use oauth tokens
- aab708e: Added test cases for gitlab:issue:edit examples
- ef742dc: Added test cases for gitlab:projectAccessToken:create example
- 1ba4c2f: Added test cases for gitlab:pipeline:trigger examples
- a6603e4: Add custom action for merge request: **auto**

  The **Auto** action selects the committed action between _create_ and _update_.

  The **Auto** action fetches files using the **/projects/repository/tree endpoint**.
  After fetching, it checks if the file exists locally and in the repository. If it does, it chooses **update**; otherwise, it chooses **create**.

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.9-next.0

## 0.4.4

### Patch Changes

- 0ac124b: Updated configuration instructions
- 2fb0eb8: Added support for passing `variables` to `gitlab:pipeline:trigger`
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/integration@1.13.0
  - @backstage/plugin-scaffolder-node@0.4.8
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.4-next.1

### Patch Changes

- 2fb0eb8: Added support for passing `variables` to `gitlab:pipeline:trigger`
- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.8-next.1

## 0.4.3-next.0

### Patch Changes

- 0ac124b: Updated configuration instructions
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.7-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.1

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- cf96041: Added `gitlab:issue:edit` action to edit existing GitLab issues
- d44a20a: Added additional plugin metadata to `package.json`.
- 829e0ec: Add new `gitlab:pipeline:trigger` action to trigger GitLab pipelines.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/integration@1.12.0
  - @backstage/plugin-scaffolder-node@0.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.1-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.5-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.1-next.2

### Patch Changes

- cf96041: Added `gitlab:issue:edit` action to edit existing GitLab issues
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.5-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.1-next.1

### Patch Changes

- 829e0ec: Add new `gitlab:pipeline:trigger` action to trigger GitLab pipelines.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.5-next.1

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-scaffolder-node@0.4.5-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.11.0

## 0.4.0

### Minor Changes

- 18f736f: Add examples for `gitlab:projectVariable:create` scaffolder action & improve related tests

### Patch Changes

- 8fa8a00: Add merge method and squash option for project creation
- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- ffc73ec: Add examples for `gitlab:repo:push` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-scaffolder-node@0.4.4
  - @backstage/integration@1.11.0

## 0.4.0-next.2

### Minor Changes

- 18f736f: Add examples for `gitlab:projectVariable:create` scaffolder action & improve related tests

### Patch Changes

- 8fa8a00: Add merge method and squash option for project creation
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-scaffolder-node@0.4.4-next.2
  - @backstage/integration@1.11.0-next.0

## 0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.4-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.3.4-next.0

### Patch Changes

- ffc73ec: Add examples for `gitlab:repo:push` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-scaffolder-node@0.4.4-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0

## 0.3.3

### Patch Changes

- aa514d1: Add examples for `publish:gitlab:merge-request` scaffolder action & improve related tests
- 52f40ea: Add examples for `gitlab:group:ensureExists` scaffolder action & improve related tests
- 33f958a: Improve examples to ensure consistency across all publish actions
- d112225: Add examples for `gitlab:projectDeployToken:create` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/integration@1.10.0
  - @backstage/plugin-scaffolder-node@0.4.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.3.3-next.1

### Patch Changes

- 33f958a: Improve examples to ensure consistency across all publish actions
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-scaffolder-node@0.4.3-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0-next.0

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.3-next.0

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-scaffolder-node@0.4.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1

## 0.3.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-scaffolder-node@0.4.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1

## 0.3.0

### Minor Changes

- 6bfb7b1: Output the `iid` as `issuesIid` from the `gitlab:issues:create` action

### Patch Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0
  - @backstage/backend-common@0.21.4
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14

## 0.3.0-next.2

### Minor Changes

- 6bfb7b1: Output the `iid` as `issuesIid` from the `gitlab:issues:create` action

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.2
  - @backstage/integration@1.9.1-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0

## 0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## 0.2.16-next.0

### Patch Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-scaffolder-node@0.3.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0

## 0.2.13

### Patch Changes

- e9a5228: Exporting a default module for the new Backend System
- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 1cd2740: Use the Gitbeaker library for `gitlab:projectAccessToken:create` action, enabling the `expiresAt` option
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/integration@1.9.0
  - @backstage/plugin-scaffolder-node@0.3.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.13-next.3

### Patch Changes

- 1cd2740: Use the Gitbeaker library for `gitlab:projectAccessToken:create` action, enabling the `expiresAt` option
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/plugin-scaffolder-node@0.3.0-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.13-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-scaffolder-node@0.3.0-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.9.0-next.0

## 0.2.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/plugin-scaffolder-node@0.3.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.13-next.0

### Patch Changes

- e9a5228: Exporting a default module for the new Backend System
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-scaffolder-node@0.3.0-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0

## 0.2.12

### Patch Changes

- 604c9dd: Add Scaffolder custom action that creates GitLab issues called `gitlab:issues:create`
- 7c522c5: Add `gitlab:repo:push` scaffolder action to push files to arbitrary branch without creating a Merge Request
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/plugin-scaffolder-node@0.2.10
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0

## 0.2.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-scaffolder-node@0.2.10-next.2

## 0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.10-next.1
  - @backstage/errors@1.2.3

## 0.2.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/plugin-scaffolder-node@0.2.10-next.0

## 0.2.11

### Patch Changes

- 219d7f0: Extract some more actions to this library
- 0cbb03b: Fixing regular expression ReDoS with zod packages. Upgrading to latest. ref: https://security.snyk.io/vuln/SNYK-JS-ZOD-5925617
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-scaffolder-node@0.2.9
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.11-next.3

### Patch Changes

- 219d7f0: Extract some more actions to this library
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.9-next.3
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1

## 0.2.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-scaffolder-node@0.2.9-next.2

## 0.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.9-next.1

## 0.2.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.0
  - @backstage/plugin-scaffolder-node@0.2.9-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.10

### Patch Changes

- 26ca97ebaa: Add examples for `gitlab:projectAccessToken:create` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/integration@1.7.2
  - @backstage/plugin-scaffolder-node@0.2.8
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.8-next.2

## 0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.2-next.0
  - @backstage/plugin-scaffolder-node@0.2.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.10-next.0

### Patch Changes

- 26ca97ebaa: Add examples for `gitlab:projectAccessToken:create` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.8-next.0
  - @backstage/integration@1.7.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/config@1.1.1

## 0.2.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.1-next.1
  - @backstage/errors@1.2.3-next.0
  - @backstage/plugin-scaffolder-node@0.2.6-next.2
  - @backstage/config@1.1.1-next.0

## 0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.5-next.1
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.1-next.0

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.1-next.0
  - @backstage/plugin-scaffolder-node@0.2.5-next.0
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.0
  - @backstage/plugin-scaffolder-node@0.2.3

## 0.2.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/integration@1.7.0-next.3
  - @backstage/plugin-scaffolder-node@0.2.3-next.3

## 0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/integration@1.7.0-next.2
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/errors@1.2.1

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/integration@1.7.0-next.1
  - @backstage/plugin-scaffolder-node@0.2.3-next.1
  - @backstage/errors@1.2.1

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.0-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-scaffolder-node@0.2.2-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.0
  - @backstage/integration@1.6.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.2

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.1
  - @backstage/integration@1.5.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration@1.5.1
  - @backstage/plugin-scaffolder-node@0.1.6-next.0

## 0.2.2

### Patch Changes

- dd367967e2e1: Fixed a bug in `gitlab:group:ensureExists` where `repos` was always set as the root group.
- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1
  - @backstage/plugin-scaffolder-node@0.1.5

## 0.2.2-next.1

### Patch Changes

- dd367967e2e1: Fixed a bug in `gitlab:group:ensureExists` where `repos` was always set as the root group.
- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1-next.0
  - @backstage/integration@1.5.1-next.0
  - @backstage/plugin-scaffolder-node@0.1.5-next.0

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1-next.0
  - @backstage/plugin-scaffolder-node@0.1.5-next.0

## 0.2.1

### Patch Changes

- 50c4457119ec: Fixed publish configuration.
- 30e6edd7f6a5: Add support for dry run for `gitlab:group:ensureExists` action.
- f5a66052f04f: Tweak README
- Updated dependencies
  - @backstage/integration@1.5.0
  - @backstage/errors@1.2.0
  - @backstage/config@1.0.8
  - @backstage/plugin-scaffolder-node@0.1.4

## 0.2.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/integration@1.5.0-next.0
  - @backstage/plugin-scaffolder-node@0.1.4-next.2

## 0.2.1-next.2

### Patch Changes

- 30e6edd7f6a5: Add support for dry run for `gitlab:group:ensureExists` action.
- Updated dependencies
  - @backstage/config@1.0.7

## 0.2.1-next.1

### Patch Changes

- 50c4457119ec: Fixed publish configuration.
- Updated dependencies
  - @backstage/integration@1.5.0-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/plugin-scaffolder-node@0.1.4-next.1
  - @backstage/config@1.0.7

## 0.2.1-next.0

### Patch Changes

- f5a66052f04f: Tweak README
- Updated dependencies
  - @backstage/integration@1.4.5
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-scaffolder-node@0.1.4-next.0

## 0.2.0

### Minor Changes

- 439e2986be1: Add a new scaffolder action for gitlab to ensure a group exists

### Patch Changes

- f1496d4ab6f: Fix input schema validation issue for gitlab actions:

  - gitlab:group:ensureExists
  - gitlab:projectAccessToken:create
  - gitlab:projectDeployToken:create
  - gitlab:projectVariable:create

- Updated dependencies
  - @backstage/integration@1.4.5
  - @backstage/plugin-scaffolder-node@0.1.3
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.2.0-next.2

### Minor Changes

- 439e2986be1: Add a new scaffolder action for gitlab to ensure a group exists

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3-next.2
  - @backstage/config@1.0.7

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3-next.1
  - @backstage/config@1.0.7

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.4.5-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-scaffolder-node@0.1.3-next.0

## 0.1.0

### Minor Changes

- 1ad400bb2de: Add Gitlab Scaffolder Plugin

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2
  - @backstage/integration@1.4.4
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.1.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/plugin-scaffolder-node@0.1.2-next.3

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0

## 0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.1
  - @backstage/integration@1.4.4-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.1.0-next.0

### Minor Changes

- 1ad400bb2de: Add Gitlab Scaffolder Plugin

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/errors@1.1.5
