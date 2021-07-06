# @backstage/test-utils

## 0.1.14

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-app-api@0.1.3
  - @backstage/core-plugin-api@0.1.3

## 0.1.13

### Patch Changes

- 7af9cef07: Fix a bug in `MockStorageApi` where it unhelpfully returned new empty buckets every single time
- e7c5e4b30: Update installation instructions in README.
- Updated dependencies [e7c5e4b30]
- Updated dependencies [0160678b1]
  - @backstage/theme@0.2.8
  - @backstage/core-api@0.2.21

## 0.1.12

### Patch Changes

- 61c3f927c: Updated `MockErrorApi` to work with new `Observable` type in `@backstage/core`.
- Updated dependencies [61c3f927c]
- Updated dependencies [65e6c4541]
  - @backstage/core-api@0.2.19

## 0.1.11

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- Updated dependencies [062bbf90f]
- Updated dependencies [675a569a9]
  - @backstage/core-api@0.2.18

## 0.1.10

### Patch Changes

- ae6250ce3: Remove unnecessary wrapping of elements rendered by `wrapInTestApp` and `renderInTestApp`, which was breaking mount discovery.
- Updated dependencies [1279a3325]
- Updated dependencies [4a4681b1b]
- Updated dependencies [b051e770c]
  - @backstage/core-api@0.2.16

## 0.1.9

### Patch Changes

- 4e0b5055a: Allow `ExternalRouteRef` bindings in `mountedRoutes` to work with the latest version of core-api.
- Updated dependencies [a51dc0006]
- Updated dependencies [e7f9b9435]
- Updated dependencies [34ff49b0f]
- Updated dependencies [d88dd219e]
- Updated dependencies [c8b54c370]
  - @backstage/core-api@0.2.14

## 0.1.8

### Patch Changes

- dc12852c9: Allow `ExternalRouteRef` instances to be passed as a route ref to `mountedRoutes`.
- Updated dependencies [3a58084b6]
- Updated dependencies [1407b34c6]
- Updated dependencies [b6c4f485d]
- Updated dependencies [3a58084b6]
  - @backstage/core-api@0.2.11

## 0.1.7

### Patch Changes

- b51ee6ece: Added `mountedRoutes` option to `wrapInTestApp`, allowing routes to be associated to concrete paths to make `useRouteRef` usable in tested components.

## 0.1.6

### Patch Changes

- 1dc445e89: Update to use new plugin extension API
- Updated dependencies [d681db2b5]
- Updated dependencies [1dc445e89]
  - @backstage/core-api@0.2.7

## 0.1.5

### Patch Changes

- e1f4e24ef: Fix @backstage/cli not being a devDependency
- Updated dependencies [b6557c098]
- Updated dependencies [d8d5a17da]
- Updated dependencies [1665ae8bb]
  - @backstage/core-api@0.2.5
  - @backstage/theme@0.2.2

## 0.1.4

### Patch Changes

- Updated dependencies [b4488ddb0]
- Updated dependencies [4a655c89d]
- Updated dependencies [8a16e8af8]
- Updated dependencies [00670a96e]
  - @backstage/cli@0.4.0
  - @backstage/core-api@0.2.4

## 0.1.3

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [902340451]
  - @backstage/cli@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [cbbd271c4]
- Updated dependencies [3472c8be7]
- Updated dependencies [1d0aec70f]
- Updated dependencies [a3840bed2]
- Updated dependencies [b79017fd3]
- Updated dependencies [72f6cda35]
- Updated dependencies [8c2b76e45]
- Updated dependencies [cba4e4d97]
- Updated dependencies [8afce088a]
- Updated dependencies [9a3b3dbf1]
- Updated dependencies [26e69ab1a]
- Updated dependencies [cbab5bbf8]
- Updated dependencies [7bbeb049f]
  - @backstage/cli@0.2.0
  - @backstage/core-api@0.2.0
  - @backstage/theme@0.2.0
