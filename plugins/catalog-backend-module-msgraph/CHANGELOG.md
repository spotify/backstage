# @backstage/plugin-catalog-backend-module-msgraph

## 0.10.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 0.10.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/config@1.3.10
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-catalog-common@1.2.1
  - @backstage/plugin-catalog-node@2.2.6

## 0.10.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1

## 0.10.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## 0.10.6

### Patch Changes

- 736d84e: Use locale-insensitive Unicode casing for consistent string handling across environments.
- 7ac10da: Fixed accumulating abort listeners on `MicrosoftGraphClient`.
- Updated dependencies
  - @backstage/plugin-catalog-common@1.2.0
  - @backstage/catalog-model@1.10.1
  - @backstage/config@1.3.9
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5

## 0.10.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.2.0-next.0
  - @backstage/config@1.3.9-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1

## 0.10.6-next.0

### Patch Changes

- 7ac10da: Fixed accumulating abort listeners on `MicrosoftGraphClient`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0

## 0.10.5

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/plugin-catalog-node@2.2.4

## 0.10.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0

## 0.10.4

### Patch Changes

- 06bf22e: Configuring `userGroupMember.path` together with `user.filter` is now rejected with a configuration error, as the two options are mutually exclusive. This matches the existing validation for `userGroupMember.filter` and `userGroupMember.search`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/plugin-catalog-node@2.2.3

## 0.10.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0

## 0.10.3

### Patch Changes

- e0889a3: chore(deps): bump `qs` from 6.15.1 to 6.15.2
- e6493b9: Fixed a bug where setting `user.select` to an empty array would cause all users to be dropped from the catalog instead of using the default set of fields.
- 8930d77: Reverted the server-side `accountEnabled eq true` base filter that was added in v1.51.0, which broke the `userGroupMember` path because the group members endpoint doesn't support `$filter` on that property. Disabled users (`accountEnabled === false`) are now filtered client-side in both the `/users` and group members paths. The mutual exclusivity checks between `userFilter` and `userGroupMemberFilter`/`userGroupMemberSearch` have been restored.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-catalog-node@2.2.2

## 0.10.2-next.2

### Patch Changes

- e6493b9: Fixed a bug where setting `user.select` to an empty array would cause all users to be dropped from the catalog instead of using the default set of fields.

## 0.10.2-next.1

### Patch Changes

- 8930d77: Reverted the server-side `accountEnabled eq true` base filter that was added in v1.51.0, which broke the `userGroupMember` path because the group members endpoint doesn't support `$filter` on that property. Disabled users (`accountEnabled === false`) are now filtered client-side in both the `/users` and group members paths. The mutual exclusivity checks between `userFilter` and `userGroupMemberFilter`/`userGroupMemberSearch` have been restored.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.2-next.1

## 0.10.1-next.0

### Patch Changes

- e0889a3: chore(deps): bump `qs` from 6.15.1 to 6.15.2
- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0

## 0.10.0

### Minor Changes

- 2bd0450: **BREAKING**: Disabled user accounts are now filtered out by default. The provider automatically applies an `accountEnabled eq true` filter, combining it with any custom `user.filter` you provide. If you previously included `accountEnabled eq true` in your user filter, it is safe to remove it, but leaving it in will not cause any issues.

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/config@1.3.8
  - @backstage/plugin-catalog-common@1.1.10

## 0.9.3-next.1

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.1
  - @backstage/plugin-catalog-node@2.2.1-next.1

## 0.9.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/plugin-catalog-common@1.1.10-next.0

## 0.9.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/config@1.3.7
  - @backstage/plugin-catalog-common@1.1.9

## 0.9.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0
  - @backstage/plugin-catalog-common@1.1.9-next.0

## 0.9.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1

## 0.9.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.8

## 0.9.1

### Patch Changes

- 97eaecf: Fixed scheduler task remaining stuck in running state after pod termination by propagating AbortSignal into MicrosoftGraphOrgEntityProvider.read()
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/plugin-catalog-node@2.1.0
  - @backstage/catalog-model@1.7.7

## 0.9.1-next.1

### Patch Changes

- 97eaecf: Fixed scheduler task remaining stuck in running state after pod termination by propagating AbortSignal into MicrosoftGraphOrgEntityProvider.read()
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.2

## 0.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.8

## 0.9.0

### Minor Changes

- 8694561: Log group/user count, tenant ID, execution time as separate fields

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-catalog-common@1.1.8

## 0.9.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1

## 0.9.0-next.1

### Minor Changes

- 8694561: Log group/user count, tenant ID, execution time as separate fields

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0-next.1

## 0.8.5-next.0

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.8-next.0

## 0.8.4

### Patch Changes

- 115b378: Changed the logger level from 'warning' to 'debug' when we are unable to load the user's photo.
- Updated dependencies
  - @backstage/backend-plugin-api@1.6.1

## 0.8.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1

## 0.8.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-catalog-node@1.20.1-next.1

## 0.8.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## 0.8.2

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## 0.8.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1

## 0.8.2-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/plugin-catalog-common@1.1.7-next.0
  - @backstage/plugin-catalog-node@1.19.2-next.0

## 0.8.1

### Patch Changes

- 99fcf98: Removed unused dependencies
- Updated dependencies
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-common@1.1.6
  - @backstage/plugin-catalog-node@1.19.1

## 0.8.1-next.1

### Patch Changes

- 99fcf98: Removed unused dependencies

## 0.8.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-catalog-common@1.1.6-next.0

## 0.8.0

### Minor Changes

- 577f0ed: **BREAKING**: Encode query filters for requests made to msgraph. If you currently have manually encoded characters in a filter, this is a breaking change and must be updated to avoid requests being double encoded.

  ```diff
  user:
  -    filter: department in('MARKETING', 'RESEARCH %26 DEVELOPMENT')
  +    filter: department in('MARKETING', 'RESEARCH & DEVELOPMENT')
  ```

### Patch Changes

- 7597781: Ensure that msgraph parent group stays same in case the group has multiple parents
- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/backend-plugin-api@1.4.3

## 0.8.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0-next.1

## 0.8.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0

## 0.8.0-next.0

### Minor Changes

- 577f0ed: **BREAKING**: Encode query filters for requests made to msgraph. If you currently have manually encoded characters in a filter, this is a breaking change and must be updated to avoid requests being double encoded.

  ```diff
  user:
  -    filter: department in('MARKETING', 'RESEARCH %26 DEVELOPMENT')
  +    filter: department in('MARKETING', 'RESEARCH & DEVELOPMENT')
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.18.0

## 0.7.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## 0.7.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/plugin-catalog-common@1.1.5

## 0.7.2

### Patch Changes

- 3507fcd: Just some more circular dep cleanup
- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/catalog-model@1.7.5
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.17.2

## 0.7.2-next.0

### Patch Changes

- 3507fcd: Just some more circular dep cleanup
- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-catalog-common@1.1.5-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0

## 0.7.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4

## 0.7.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4

## 0.7.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0

## 0.7.0

### Minor Changes

- 20c1ea7: Add new `userGroupMember.path`, `user.path` and, `group.path` option to each query type to allow more complex msgraph queries

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4

## 0.7.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.2

## 0.7.0-next.1

### Minor Changes

- 20c1ea7: Add new `userGroupMember.path`, `user.path` and, `group.path` option to each query type to allow more complex msgraph queries

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0

## 0.6.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3

## 0.6.9

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3

## 0.6.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3

## 0.6.8

### Patch Changes

- 612d1fd: Update `catalog.providers.microsoftGraphOrg.target` config def to be optional as this has a default value.
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1

## 0.6.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1

## 0.6.8-next.0

### Patch Changes

- 612d1fd: Update `catalog.providers.microsoftGraphOrg.target` config def to be optional as this has a default value.
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.16.1-next.0

## 0.6.7

### Patch Changes

- eb80a1a: Minor doc string update
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-catalog-node@1.16.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3

## 0.6.7-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3

## 0.6.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.0-next.2

## 0.6.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3

## 0.6.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3

## 0.6.6

### Patch Changes

- 29a4aa8: fix(config): add missing parameters in config schema
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.15.1

## 0.6.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/plugin-catalog-common@1.1.3-next.0

## 0.6.6-next.1

### Patch Changes

- 29a4aa8: fix(config): add missing parameters in config schema

## 0.6.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/plugin-catalog-common@1.1.2
  - @backstage/plugin-catalog-node@1.15.1-next.0

## 0.6.5

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/plugin-catalog-common@1.1.2

## 0.6.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/plugin-catalog-common@1.1.2-next.0

## 0.6.5-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/plugin-catalog-common@1.1.1

## 0.6.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-catalog-node@1.14.1-next.0

## 0.6.4

### Patch Changes

- 4e58bc7: Upgrade to uuid v11 internally
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/catalog-model@1.7.1
  - @backstage/plugin-catalog-common@1.1.1

## 0.6.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0

## 0.6.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.14.0-next.1

## 0.6.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0

## 0.6.3

### Patch Changes

- 4b60e0c: Remove extension points from `/alpha` export, they're available from the main package already
- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0

## 0.6.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0

## 0.6.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.1-next.0

## 0.6.2

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- 3c2d690: Allow users without defined email to be ingested by the `msgraph` catalog plugin and add `userIdMatchingUserEntityAnnotation` sign-in resolver for the Microsoft auth provider to support sign-in for users without defined email.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/config@1.2.0

## 0.6.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.2

## 0.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.1

## 0.6.2-next.0

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- 3c2d690: Allow users without defined email to be ingested by the `msgraph` catalog plugin and add `userIdMatchingUserEntityAnnotation` sign-in resolver for the Microsoft auth provider to support sign-in for users without defined email.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-catalog-node@1.12.7-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.26

## 0.6.0

### Minor Changes

- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.

### Patch Changes

- 9342ac8: Removed unused dependency
- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- 58dff4d: Added option to ingest groups based on their group membership in Azure Entra ID
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-catalog-node@1.12.5
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.26

## 0.5.31-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.26-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.3

## 0.5.31-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.2
  - @backstage/plugin-catalog-common@1.0.26-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.5.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/plugin-catalog-common@1.0.26-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.5.31-next.0

### Patch Changes

- 58dff4d: Added option to ingest groups based on their group membership in Azure Entra ID
- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.25

## 0.5.30

### Patch Changes

- f7bdcea: Adds a dynamic provider for the plugin-catalog-backend-module-msgraph. Configuration is now runtime configurable through the ProviderConfigTransformer.
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/plugin-catalog-node@1.12.4
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.5.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/plugin-catalog-node@1.12.4-next.1

## 0.5.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/plugin-catalog-node@1.12.3-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.24

## 0.5.27

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- f7be17a: Added missing `userSelect` property in `readMicrosoftGraphOrg` method
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/plugin-catalog-node@1.12.1
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.5.27-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-catalog-common@1.0.24-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.2
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.5.27-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-catalog-node@1.12.1-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.23

## 0.5.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.0

## 0.5.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.23

## 0.5.26

### Patch Changes

- 49eab29: Fixed disabling of user photo fetching. Previously, the config value wasn't propagated properly, so user photos was still being fetched despite disabled by config.
- 6e370e6: Handle fetching huge amounts of users from Azure without crashing
- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-catalog-common@1.0.23

## 0.5.26-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0-next.2
  - @backstage/backend-common@0.22.0-next.2

## 0.5.26-next.1

### Patch Changes

- 49eab29: Fixed disabling of user photo fetching. Previously, the config value wasn't propagated properly, so user photos was still being fetched despite disabled by config.
- 6e370e6: Handle fetching huge amounts of users from Azure without crashing
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-catalog-node@1.11.2-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.5.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-catalog-common@1.0.23-next.0
  - @backstage/plugin-catalog-node@1.11.2-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0

## 0.5.25

### Patch Changes

- 9b6320f: Retry msgraph API calls, due to frequent ETIMEDOUT errors. Also allow disabling fetching user photos.
- d5a1fe1: Replaced winston logger with `LoggerService`
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/backend-tasks@0.5.22
  - @backstage/plugin-catalog-node@1.11.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.22

## 0.5.25-next.1

### Patch Changes

- 9b6320f: Retry msgraph API calls, due to frequent ETIMEDOUT errors. Also allow disabling fetching user photos.
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-catalog-node@1.11.1-next.1

## 0.5.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-catalog-node@1.11.1-next.0

## 0.5.24

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.11.0
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/backend-tasks@0.5.21
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.22

## 0.5.23

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.10.0
  - @backstage/backend-common@0.21.5
  - @backstage/backend-tasks@0.5.20
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.22

## 0.5.22

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.9.0

## 0.5.21

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/config@1.2.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-catalog-node@1.8.0
  - @backstage/backend-tasks@0.5.19
  - @backstage/catalog-model@1.4.5
  - @backstage/plugin-catalog-common@1.0.22

## 0.5.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-catalog-node@1.8.0-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-catalog-common@1.0.22-next.1

## 0.5.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## 0.5.20-next.0

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
  - @backstage/plugin-catalog-common@1.0.22-next.0

## 0.5.17

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/backend-tasks@0.5.15
  - @backstage/catalog-model@1.4.4
  - @backstage/plugin-catalog-node@1.7.0
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.21

## 0.5.17-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-catalog-node@1.6.2-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0

## 0.5.17-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/plugin-catalog-common@1.0.21-next.0

## 0.5.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.1

## 0.5.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.20

## 0.5.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/backend-tasks@0.5.14
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.20

## 0.5.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-catalog-node@1.6.1-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.5.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-catalog-node@1.6.1-next.1

## 0.5.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.19

## 0.5.15

### Patch Changes

- 99fb541: Updated dependency `@azure/identity` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-catalog-node@1.6.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.19

## 0.5.15-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.6.0-next.3

## 0.5.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0-next.2
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## 0.5.15-next.1

### Patch Changes

- 99fb54183b: Updated dependency `@azure/identity` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1

## 0.5.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/plugin-catalog-node@1.5.1-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## 0.5.14

### Patch Changes

- 224aa6f64c: export the function to read ms graph provider config
- 243c655a68: JSDoc and Error message updates to handle `Azure Active Directory` re-brand to `Entra ID`
- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## 0.5.14-next.2

### Patch Changes

- [#20958](https://github.com/backstage/backstage/pull/20958) [`224aa6f64c`](https://github.com/backstage/backstage/commit/224aa6f64c501a6a06b296ac4783ff4dbf3574ae) Thanks [@mrooding](https://github.com/mrooding)! - export the function to read ms graph provider config

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-catalog-node@1.5.0-next.2

## 0.5.14-next.1

### Patch Changes

- 243c655a68: JSDoc and Error message updates to handle `Azure Active Directory` re-brand to `Entra ID`
- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0-next.1
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## 0.5.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-catalog-node@1.4.8-next.0

## 0.5.13

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## 0.5.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-catalog-node@1.4.7-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/plugin-catalog-common@1.0.17-next.0

## 0.5.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/plugin-catalog-node@1.4.6-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/plugin-catalog-common@1.0.16

## 0.5.12-next.0

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/catalog-model@1.4.2
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-catalog-node@1.4.6-next.0

## 0.5.10

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
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-catalog-node@1.4.4

## 0.5.10-next.3

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
  - @backstage/plugin-catalog-common@1.0.16-next.2
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-catalog-node@1.4.4-next.3

## 0.5.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-catalog-common@1.0.16-next.1

## 0.5.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-catalog-node@1.4.4-next.1
  - @backstage/plugin-catalog-common@1.0.16-next.0

## 0.5.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.3-next.0

## 0.5.7

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- fb93323201bf: The alpha `catalogModuleMicrosoftGraphOrgEntityProvider` export no longer accepts options. Transformers are now instead configured via the `microsoftGraphOrgEntityProviderTransformExtensionPoint`.
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-catalog-node@1.4.1
  - @backstage/backend-tasks@0.5.5
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.15

## 0.5.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## 0.5.7-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-catalog-node@1.4.1-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.15

## 0.5.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.1-next.0

## 0.5.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/plugin-catalog-node@1.4.0
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/backend-tasks@0.5.4
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.15

## 0.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/plugin-catalog-node@1.4.0-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.15-next.0

## 0.5.5

### Patch Changes

- b43e030911f2: Upgrade `@azure/identity` to support using Workload Identity to authenticate against Azure.
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/catalog-model@1.4.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-catalog-node@1.3.7
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.14

## 0.5.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/plugin-catalog-common@1.0.14-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.2

## 0.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.1
  - @backstage/plugin-catalog-common@1.0.14-next.0
  - @backstage/config@1.0.7

## 0.5.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.3.7-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-catalog-common@1.0.13

## 0.5.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-catalog-node@1.3.6
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/plugin-catalog-common@1.0.13

## 0.5.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-catalog-node@1.3.6-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/plugin-catalog-common@1.0.13

## 0.5.3

### Patch Changes

- c9a0fdcd2c8: Fix deprecated types.
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-catalog-node@1.3.5
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/plugin-catalog-common@1.0.13

## 0.5.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/plugin-catalog-common@1.0.13-next.1
  - @backstage/plugin-catalog-node@1.3.5-next.3

## 0.5.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.2

## 0.5.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.1

## 0.5.3-next.0

### Patch Changes

- c9a0fdcd2c8: Fix deprecated types.
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/catalog-model@1.2.1
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/plugin-catalog-node@1.3.5-next.0

## 0.5.2

### Patch Changes

- a4ebd513527: Revert using `baseUrl` for MS Graph provider as it breaks token retrieval
- 26eef93c547: Fixed msgraph catalog backend to use user.select option when fetching user from AzureAD
- 90469c02c8c: Renamed `microsoftGraphOrgEntityProviderCatalogModule` to `catalogModuleMicrosoftGraphOrgEntityProvider` to match the [recommended naming patterns](https://backstage.io/docs/backend-system/architecture/naming-patterns).
- e675f902980: Make sure to not use deprecated exports from `@backstage/plugin-catalog-backend`
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 2c234a89325: properly support custom graph api URL
- Updated dependencies
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/plugin-catalog-node@1.3.4
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7

## 0.5.2-next.2

### Patch Changes

- 26eef93c547: Fixed msgraph catalog backend to use user.select option when fetching user from AzureAD
- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-catalog-backend@1.8.0-next.2
  - @backstage/plugin-catalog-node@1.3.4-next.2
  - @backstage/config@1.0.7-next.0

## 0.5.2-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/plugin-catalog-backend@1.8.0-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/plugin-catalog-node@1.3.4-next.1

## 0.5.2-next.0

### Patch Changes

- a4ebd51352: Revert using `baseUrl` for MS Graph provider as it breaks token retrieval
- 928a12a9b3: Internal refactor of `/alpha` exports.
- 2c234a8932: properly support custom graph api URL
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.0-next.0
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.3.4-next.0
  - @backstage/config@1.0.6

## 0.5.0

### Minor Changes

- fb568e2683: Improve performance when loading users via group membership.
  Users data is now loaded from a paged query, rather than having to make an extra call per user to load each user's profiles.

  Note, there are still additional per user calls made to load user avatars

### Patch Changes

- 4c86436fdf: Fix MS Graph provider to use target URL for fetching access token
- 0daa328c3a: Extract default transformers to their own file
- 28f9883440: Fixed a bug reading the `user.select` field expected from the `app-config.yaml` configuration
- c5b119ad9c: Increased default page size to 999 (from 100) to reduce the number of calls made to the Microsoft Graph API.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/catalog-model@1.2.0
  - @backstage/plugin-catalog-node@1.3.3
  - @backstage/backend-tasks@0.4.3
  - @backstage/config@1.0.6

## 0.5.0-next.2

### Minor Changes

- fb568e2683: Improve performance when loading users via group membership.
  Users data is now loaded from a paged query, rather than having to make an extra call per user to load each user's profiles.

  Note, there are still additional per user calls made to load user avatars

### Patch Changes

- 28f9883440: Fixed a bug reading the `user.select` field expected from the `app-config.yaml` configuration
- c5b119ad9c: Increased default page size to 999 (from 100) to reduce the number of calls made to the Microsoft Graph API.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-catalog-backend@1.7.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/plugin-catalog-node@1.3.3-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/config@1.0.6

## 0.4.8-next.1

### Patch Changes

- 4c86436fdf: Fix MS Graph provider to use target URL for fetching access token
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2-next.1
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/plugin-catalog-node@1.3.3-next.1

## 0.4.8-next.0

### Patch Changes

- 0daa328c3a: Extract default transformers to their own file
- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-catalog-backend@1.7.2-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.4.6

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

## 0.4.6-next.2

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

## 0.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1

## 0.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/config@1.0.5
  - @backstage/plugin-catalog-node@1.3.1-next.0

## 0.4.5

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0
  - @backstage/plugin-catalog-node@1.3.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5

## 0.4.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.3
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-catalog-node@1.3.0-next.3

## 0.4.5-next.2

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1

## 0.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/plugin-catalog-node@1.2.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/catalog-model@1.1.4-next.1

## 0.4.5-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/plugin-catalog-node@1.2.2-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0

## 0.4.4

### Patch Changes

- 0e37858f22: Added cause information to logged warnings
- 8d1a5e08ca: `MicrosoftGraphOrgEntityProvider`: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  https://github.com/backstage/backstage/tree/master/plugins/catalog-backend-module-msgraph#readme

- 384f99c276: Add `microsoftGraphOrgEntityProviderCatalogModule` (new backend-plugin-api, alpha).
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.5.1
  - @backstage/backend-tasks@0.3.7
  - @backstage/catalog-model@1.1.3
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/plugin-catalog-node@1.2.1
  - @backstage/config@1.0.4

## 0.4.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/plugin-catalog-backend@1.5.1-next.1
  - @backstage/plugin-catalog-node@1.2.1-next.1
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0

## 0.4.4-next.0

### Patch Changes

- 8d1a5e08ca: `MicrosoftGraphOrgEntityProvider`: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  https://github.com/backstage/backstage/tree/master/plugins/catalog-backend-module-msgraph#readme

- 384f99c276: Add `microsoftGraphOrgEntityProviderCatalogModule` (new backend-plugin-api, alpha).
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.5.1-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/plugin-catalog-node@1.2.1-next.0
  - @backstage/config@1.0.4-next.0

## 0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/plugin-catalog-backend@1.5.0
  - @backstage/backend-tasks@0.3.6
  - @backstage/config@1.0.3

## 0.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.5.0-next.2
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2

## 0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/plugin-catalog-backend@1.4.1-next.1

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/plugin-catalog-backend@1.4.1-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0

## 0.4.2

### Patch Changes

- c1d32d2b76: Fixed a bug in the `MicrosoftGraphEntityProvider` that ignored the `userExpand` and `groupExpand` configuration parameters
- d80aab31ae: Added $select attribute to user query
- a246d5a9b8: Read `queryMode` from the `microsoftGraphOrg` config
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 4c82b955fc: Fix typo
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.4.0
  - @backstage/backend-tasks@0.3.5
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2

## 0.4.2-next.3

### Patch Changes

- d80aab31ae: Added $select attribute to user query
- Updated dependencies
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/plugin-catalog-backend@1.4.0-next.3
  - @backstage/backend-tasks@0.3.5-next.1

## 0.4.2-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.4.0-next.2

## 0.4.2-next.1

### Patch Changes

- c1d32d2b76: Fixed a bug in the `MicrosoftGraphEntityProvider` that ignored the `userExpand` and `groupExpand` configuration parameters
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.4.0-next.1

## 0.4.2-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 4c82b955fc: Fix typo
- Updated dependencies
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/plugin-catalog-backend@1.3.2-next.0

## 0.4.1

### Patch Changes

- b1995df9f3: Adjust references in deprecation warnings to point to stable URL/document.
- Updated dependencies
  - @backstage/backend-tasks@0.3.4
  - @backstage/plugin-catalog-backend@1.3.1

## 0.4.1-next.0

### Patch Changes

- b1995df9f3: Adjust references in deprecation warnings to point to stable URL/document.
- Updated dependencies
  - @backstage/backend-tasks@0.3.4-next.0
  - @backstage/plugin-catalog-backend@1.3.1-next.0

## 0.4.0

### Minor Changes

- a145672f0f: Align `msgraph` plugin's entity provider config with other providers. **Deprecated** entity processor as well as previous config.

  You will see warning at the log output until you migrate to the new setup.
  All deprecated parts will be removed eventually after giving some time to migrate.

  Please find information on how to migrate your current setup to the new one below.

  **Migration Guide:**

  There were two different way on how to use the msgraph plugin: processor or provider.

  Previous registration for the processor:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addProcessor(
    MicrosoftGraphOrgReaderProcessor.fromConfig(env.config, {
      logger: env.logger,
      // [...]
    }),
  );
  ```

  Previous registration when using the provider:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
      id: 'https://graph.microsoft.com/v1.0',
      target: 'https://graph.microsoft.com/v1.0',
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
      // [...]
    }),
  );
  ```

  Previous configuration as used for both:

  ```yaml
  # app-config.yaml
  catalog:
    processors:
      microsoftGraphOrg:
        providers:
          - target: https://graph.microsoft.com/v1.0
            # [...]
  ```

  **Replacement:**

  Please check https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/README.md for the complete documentation of all configuration options (config as well as registration of the provider).

  ```yaml
  # app-config.yaml
  catalog:
    providers:
      microsoftGraphOrg:
        # In case you used the deprecated configuration with the entity provider
        # using the value of `target` will keep the same location key for all
        providerId: # some stable ID which will be used as part of the location key for all ingested data
          target: https://graph.microsoft.com/v1.0
          # [...]
  ```

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
      // [...]
    }),
  );
  ```

  In case you've used multiple entity providers before
  **and** you had different transformers for each of them
  you can provide these directly at the one `fromConfig` call
  by passing a Record with the provider ID as key.

- b8ebecd100: Microsoft Graph plugin can supports many more options for authenticating with the Microsoft Graph API.
  Previously only ClientId/ClientSecret was supported, but now all the authentication options of `DefaultAzureCredential` from `@azure/identity` are supported.
  Including Managed Identity, Client Certificate, Azure CLI and VS Code.

  If `clientId` and `clientSecret` are specified in configuration, the plugin behaves the same way as before.
  If these fields are omitted, the plugin uses `DefaultAzureCredential` to automatically determine the best authentication method.
  This is particularly useful for local development environments - the default configuration will try to use existing credentials from Visual Studio Code, Azure CLI and Azure PowerShell, without the user needing to configure any credentials in app-config.yaml

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0
  - @backstage/catalog-model@1.1.0
  - @backstage/backend-tasks@0.3.3

## 0.4.0-next.2

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0-next.3
  - @backstage/backend-tasks@0.3.3-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 0.4.0-next.1

### Minor Changes

- a145672f0f: Align `msgraph` plugin's entity provider config with other providers. **Deprecated** entity processor as well as previous config.

  You will see warning at the log output until you migrate to the new setup.
  All deprecated parts will be removed eventually after giving some time to migrate.

  Please find information on how to migrate your current setup to the new one below.

  **Migration Guide:**

  There were two different way on how to use the msgraph plugin: processor or provider.

  Previous registration for the processor:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addProcessor(
    MicrosoftGraphOrgReaderProcessor.fromConfig(env.config, {
      logger: env.logger,
      // [...]
    }),
  );
  ```

  Previous registration when using the provider:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
      id: 'https://graph.microsoft.com/v1.0',
      target: 'https://graph.microsoft.com/v1.0',
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
      // [...]
    }),
  );
  ```

  Previous configuration as used for both:

  ```yaml
  # app-config.yaml
  catalog:
    processors:
      microsoftGraphOrg:
        providers:
          - target: https://graph.microsoft.com/v1.0
            # [...]
  ```

  **Replacement:**

  Please check https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/README.md for the complete documentation of all configuration options (config as well as registration of the provider).

  ```yaml
  # app-config.yaml
  catalog:
    providers:
      microsoftGraphOrg:
        # In case you used the deprecated configuration with the entity provider
        # using the value of `target` will keep the same location key for all
        providerId: # some stable ID which will be used as part of the location key for all ingested data
          target: https://graph.microsoft.com/v1.0
          # [...]
  ```

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
      // [...]
    }),
  );
  ```

  In case you've used multiple entity providers before
  **and** you had different transformers for each of them
  you can provide these directly at the one `fromConfig` call
  by passing a Record with the provider ID as key.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-tasks@0.3.3-next.2
  - @backstage/plugin-catalog-backend@1.2.1-next.2

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/backend-tasks@0.3.3-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.0

## 0.3.3

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.2.0
  - @backstage/backend-tasks@0.3.2
  - @backstage/catalog-model@1.0.3

## 0.3.3-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/catalog-model@1.0.3-next.0

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.0
  - @backstage/plugin-catalog-backend@1.2.0-next.0

## 0.3.2

### Patch Changes

- 8d9f673106: Add annotation `microsoft.com/email` when using the `defaultUserTransformer`.

  This will allow users of the Microsoft auth provider to utilize the predefined
  SignIn resolver instead of maintaining their own.

  ```typescript
  // backend/plugins/auth.ts

  // [...]

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    return await createRouter({
      // [...]
      providerFactories: {
        microsoft: providers.microsoft.create({
          signIn: {
            resolver:
              providers.microsoft.resolvers.emailMatchingUserEntityAnnotation(),
          },
        }),
      },
    });
  }
  ```

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.2
  - @backstage/backend-tasks@0.3.1
  - @backstage/config@1.0.1
  - @backstage/catalog-model@1.0.2

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.2-next.2
  - @backstage/backend-tasks@0.3.1-next.1
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0

## 0.3.2-next.0

### Patch Changes

- 8d9f673106: Add annotation `microsoft.com/email` when using the `defaultUserTransformer`.

  This will allow users of the Microsoft auth provider to utilize the predefined
  SignIn resolver instead of maintaining their own.

  ```typescript
  // backend/plugins/auth.ts

  // [...]

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    return await createRouter({
      // [...]
      providerFactories: {
        microsoft: providers.microsoft.create({
          signIn: {
            resolver:
              providers.microsoft.resolvers.emailMatchingUserEntityAnnotation(),
          },
        }),
      },
    });
  }
  ```

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.2-next.0
  - @backstage/backend-tasks@0.3.1-next.0

## 0.3.1

### Patch Changes

- 1691c6c5c2: Clarify that config locations that emit User and Group kinds now need to declare so in the `catalog.locations.[].rules`
- 85fc53df95: Now plugin configuration accept a new optional parameter `groupSelect` which allow the client to fetch defined fields from the ms-graph api.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0
  - @backstage/backend-tasks@0.3.0
  - @backstage/catalog-model@1.0.1

## 0.3.1-next.2

### Patch Changes

- 85fc53df95: Now plugin configuration accept a new optional parameter `groupSelect` which allow the client to fetch defined fields from the ms-graph api.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0-next.3

## 0.3.1-next.1

### Patch Changes

- 1691c6c5c2: Clarify that config locations that emit User and Group kinds now need to declare so in the `catalog.locations.[].rules`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0-next.1
  - @backstage/backend-tasks@0.3.0-next.1

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-backend@1.0.1-next.0
  - @backstage/backend-tasks@0.2.2-next.0

## 0.3.0

### Minor Changes

- 331f258e06: **BREAKING**: `MicrosoftGraphOrgEntityProvider.fromConfig` now requires a `schedule` field in its options, which simplifies scheduling. If you want to retain the old behavior of calling its `run()` method manually, you can set the new field value to the string `'manual'`. But you may prefer to instead give it a scheduled task runner from the backend tasks package:

  ```diff
   // packages/backend/src/plugins/catalog.ts
  +import { Duration } from 'luxon';
  +import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);

  +  // The target parameter below needs to match one of the providers' target
  +  // value specified in your app-config.
  +  builder.addEntityProvider(
  +    MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
  +      id: 'production',
  +      target: 'https://graph.microsoft.com/v1.0',
  +      logger: env.logger,
  +      schedule: env.scheduler.createScheduledTaskRunner({
  +        frequency: Duration.fromObject({ minutes: 5 }),
  +        timeout: Duration.fromObject({ minutes: 3 }),
  +      }),
  +    }),
  +  );
  ```

### Patch Changes

- 759b32b0ce: support advanced querying capabilities using the config option `queryMode`
- 89c7e47967: Minor README update
- 132189e466: Updated the code to handle User kind `spec.memberOf` now being optional.
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.0.0
  - @backstage/backend-tasks@0.2.1
  - @backstage/catalog-model@1.0.0
  - @backstage/config@1.0.0

## 0.2.19

### Patch Changes

- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.24.0
  - @backstage/catalog-model@0.13.0

## 0.2.19-next.0

### Patch Changes

- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.24.0-next.0
  - @backstage/catalog-model@0.13.0-next.0

## 0.2.18

### Patch Changes

- c820a49426: add config option `groupExpand` to allow expanding a single relationship
- 83a83381b0: Use the new `processingResult` export from the catalog backend
- 4bc61a64e2: add documentation for config options `userGroupMemberSearch` and `groupSearch`
- f9bb6aa0aa: add `userExpand` config option to allow expanding a single relationship
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/plugin-catalog-backend@0.23.0

## 0.2.17

### Patch Changes

- ed09ad8093: Updated usage of the `LocationSpec` type from `@backstage/catalog-model`, which is deprecated.
- 25e97e7242: Minor wording update
- a097678475: add configuration to use search criteria to select groups
- df61ca71dd: Implemented required `getProcessorName` method for catalog processor.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.22.0
  - @backstage/catalog-model@0.11.0

## 0.2.16

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 27eccab216: Replaces use of deprecated catalog-model constants.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.4
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14

## 0.2.15

### Patch Changes

- 9b122a780c: Add userExpand option to allow users to expand fields retrieved from the Graph API - for use in custom transformers
- 7bb1bde7f6: Minor API cleanups
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.3

## 0.2.15-next.0

### Patch Changes

- 9b122a780c: Add userExpand option to allow users to expand fields retrieved from the Graph API - for use in custom transformers
- 7bb1bde7f6: Minor API cleanups
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.3-next.0

## 0.2.14

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.2

## 0.2.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.2-next.0

## 0.2.13

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.0
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10

## 0.2.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.0-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/catalog-model@0.9.10-next.0

## 0.2.12

### Patch Changes

- 722681b1b1: Clean up API report
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/plugin-catalog-backend@0.20.0
  - @backstage/catalog-model@0.9.9

## 0.2.11

### Patch Changes

- b055a6addc: Align on usage of `cross-fetch` vs `node-fetch` in frontend vs backend packages, and remove some unnecessary imports of either one of them
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.19.0

## 0.2.10

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.18.0

## 0.2.9

### Patch Changes

- 779d7a2304: Tweak logic for msgraph catalog ingesting for display names with security groups

  Previously security groups that weren't mail enabled were imported with UUIDs, now they use the display name.

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.3

## 0.2.8

### Patch Changes

- 406dcf06e5: Add `MicrosoftGraphOrgEntityProvider` as an alternative to `MicrosoftGraphOrgReaderProcessor` that automatically handles user and group deletions.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.1
  - @backstage/catalog-model@0.9.5

## 0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.0

## 0.2.6

### Patch Changes

- ff7c6cec1a: Allow loading users using group membership
- 95869261ed: Adding some documentation for the `msgraph` client
- a31afc5b62: Replace slash stripping regexp with trimEnd to remove CodeQL warning
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.16.0
  - @backstage/catalog-model@0.9.4

## 0.2.5

### Patch Changes

- 664bba5c45: Bumped `@microsoft/microsoft-graph-types` to v2
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.15.0

## 0.2.4

### Patch Changes

- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.14.0
  - @backstage/catalog-model@0.9.3
  - @backstage/config@0.1.10

## 0.2.3

### Patch Changes

- 77cdc5a84: Pass along a `UserTransformer` to the read step
- be498d22f: Pass along a `OrganizationTransformer` to the read step
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.3
  - @backstage/config@0.1.7

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.0

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0
  - @backstage/plugin-catalog-backend@0.12.0

## 0.2.0

### Minor Changes

- 115473c08: Handle error gracefully if failure occurs while loading photos using Microsoft Graph API.

  This includes a breaking change: you now have to pass the `options` object to `readMicrosoftGraphUsers` and `readMicrosoftGraphOrg`.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.11.0

## 0.1.1

### Patch Changes

- 127048f92: Move `MicrosoftGraphOrgReaderProcessor` from `@backstage/plugin-catalog-backend`
  to `@backstage/plugin-catalog-backend-module-msgraph`.

  The `MicrosoftGraphOrgReaderProcessor` isn't registered by default anymore, if
  you want to continue using it you have to register it manually at the catalog
  builder:

  1. Add dependency to `@backstage/plugin-catalog-backend-module-msgraph` to the `package.json` of your backend.
  2. Add the processor to the catalog builder:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addProcessor(
    MicrosoftGraphOrgReaderProcessor.fromConfig(config, {
      logger,
    }),
  );
  ```

  For more configuration details, see the [README of the `@backstage/plugin-catalog-backend-module-msgraph` package](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/README.md).

- 127048f92: Allow customizations of `MicrosoftGraphOrgReaderProcessor` by passing an
  optional `groupTransformer`, `userTransformer`, and `organizationTransformer`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.10.4
  - @backstage/catalog-model@0.8.4
