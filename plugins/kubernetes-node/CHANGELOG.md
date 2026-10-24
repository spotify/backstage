# @backstage/plugin-kubernetes-node

## 0.4.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.15-next.0

## 0.4.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-kubernetes-common@0.9.14

## 0.4.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1

## 0.4.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-kubernetes-common@0.9.14-next.0

## 0.4.8

### Patch Changes

- 5268d63: Migrated tests from MSW v1 to MSW v2.
- d9a57de: Add `KubernetesWatcher` interface for streaming Kubernetes resource changes via an async iterator. The watcher is separated from `KubernetesFetcher` because watching is a long-lived streaming connection that only works with server-side auth providers. Watch supports all event types (ADDED, MODIFIED, DELETED, BOOKMARK, ERROR) with errors yielded as data rather than thrown.
- Updated dependencies
  - @backstage/catalog-model@1.10.1
  - @backstage/plugin-kubernetes-common@0.9.13
  - @backstage/backend-plugin-api@1.10.1

## 0.4.8-next.2

### Patch Changes

- 5268d63: Migrated tests from MSW v1 to MSW v2.
- Updated dependencies
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/plugin-kubernetes-common@0.9.13-next.1

## 0.4.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.1-next.0

## 0.4.8-next.0

### Patch Changes

- d9a57de: Add `KubernetesWatcher` interface for streaming Kubernetes resource changes via an async iterator. The watcher is separated from `KubernetesFetcher` because watching is a long-lived streaming connection that only works with server-side auth providers. Watch supports all event types (ADDED, MODIFIED, DELETED, BOOKMARK, ERROR) with errors yielded as data rather than thrown.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.13-next.0

## 0.4.7

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-plugin-api@1.10.0

## 0.4.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0

## 0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3

## 0.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0

## 0.4.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.2

## 0.4.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.2-next.0

## 0.4.4

### Patch Changes

- ab1cdbb: Removed a handful of internal imports that referenced the package by its own name. Value imports were switched to relative paths, and type-only imports to `import type`. These self-referential imports could trigger circular initialization errors in bundled ESM and when the package was loaded via `jest.requireActual` — most visibly `Cannot access '_AppRootElementBlueprintesm' before initialization` from `@backstage/frontend-plugin-api`. There are no user-facing API changes.
- 0c5e41f: Removed unused dependencies that had no imports in source code.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-kubernetes-common@0.9.12

## 0.4.4-next.1

### Patch Changes

- ab1cdbb: Removed a handful of internal imports that referenced the package by its own name. Value imports were switched to relative paths, and type-only imports to `import type`. These self-referential imports could trigger circular initialization errors in bundled ESM and when the package was loaded via `jest.requireActual` — most visibly `Cannot access '_AppRootElementBlueprintesm' before initialization` from `@backstage/frontend-plugin-api`. There are no user-facing API changes.
- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.1
  - @backstage/plugin-kubernetes-common@0.9.12-next.1

## 0.4.4-next.0

### Patch Changes

- 0c5e41f: Removed unused dependencies that had no imports in source code.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.12-next.0

## 0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-kubernetes-common@0.9.11

## 0.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/plugin-kubernetes-common@0.9.11-next.0

## 0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.10

## 0.4.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/catalog-model@1.7.7

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.10

## 0.4.1

### Patch Changes

- 7455dae: Use node prefix on native imports
- ce3639c: Add PersistentVolume and PersistentVolumeClaims Rendering
- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-kubernetes-common@0.9.10

## 0.4.1-next.1

### Patch Changes

- ce3639c: Add PersistentVolume and PersistentVolumeClaims Rendering
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.10-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1

## 0.4.1-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.10-next.0

## 0.4.0

### Minor Changes

- 7f9846f: Add possibility to extends Kubernetes REST API. Add fetcher to parameters for custom objects provider

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-kubernetes-common@0.9.9

## 0.4.0-next.2

### Minor Changes

- 7f9846f: Add possibility to extends Kubernetes REST API. Add fetcher to parameters for custom objects provider

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.9-next.0

## 0.3.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.9-next.0

## 0.3.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.8

## 0.3.6

### Patch Changes

- 1906d37: Updated dependency `@kubernetes/client-node` to `1.4.0`.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-kubernetes-common@0.9.8
  - @backstage/catalog-model@1.7.6

## 0.3.6-next.2

### Patch Changes

- 1906d37: Updated dependency `@kubernetes/client-node` to `1.4.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.2
  - @backstage/plugin-kubernetes-common@0.9.8-next.1

## 0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.1

## 0.3.6-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.8-next.0

## 0.3.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.7
  - @backstage/backend-plugin-api@1.4.4

## 0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-kubernetes-common@0.9.7-next.1

## 0.3.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.7-next.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/catalog-model@1.7.5
  - @backstage/types@1.2.2

## 0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.2
  - @backstage/backend-plugin-api@1.4.3

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.3-next.0

## 0.3.3

### Patch Changes

- 79e342e: Added support for providing a factory to the extension points
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.6

## 0.3.2

### Patch Changes

- 3507fcd: Just some more circular dep cleanup
- Updated dependencies
  - @backstage/catalog-model@1.7.5
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-kubernetes-common@0.9.6

## 0.3.2-next.0

### Patch Changes

- 3507fcd: Just some more circular dep cleanup
- Updated dependencies
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-kubernetes-common@0.9.6-next.0

## 0.3.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.5

## 0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.5

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0

## 0.3.0

### Minor Changes

- 9cdf001: **BREAKING**: The `PinnipedHelper` class now expects a regular `LoggerService` instance from the new backend system, instead of a Winston logger.

### Patch Changes

- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/catalog-model@1.7.4
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/plugin-kubernetes-common@0.9.5
  - @backstage/types@1.2.1

## 0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0

## 0.3.0-next.1

### Minor Changes

- 9cdf001: **BREAKING**: The `PinnipedHelper` class now expects a regular `LoggerService` instance from the new backend system, instead of a Winston logger.

### Patch Changes

- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1

## 0.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.4

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.4

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.4
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.4-next.0

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.4-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0

## 0.2.3

### Patch Changes

- ac0e1ac: Fixed the lack of `secrets` to fetch from the kubernetes api by adding option to specify additional Objects which are not part of Default Objects
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.3
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.3-next.1

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/plugin-kubernetes-common@0.9.3-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1

## 0.2.3-next.0

### Patch Changes

- ac0e1ac: Fixed the lack of `secrets` to fetch from the kubernetes api by adding option to specify additional Objects which are not part of Default Objects
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.3-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-kubernetes-common@0.9.2

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/plugin-kubernetes-common@0.9.2-next.0

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-model@1.7.2
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.1

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/catalog-model@1.7.2
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.1

## 0.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.1-next.0

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.0

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.0

## 0.2.0

### Minor Changes

- 71b8704: Bumping @kubernetes/client-node to 1.0.0-rc7 to mitigate CVEs related to the request and tough-cookie packages

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/catalog-model@1.7.1

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.9.0-next.0

## 0.2.0-next.1

### Minor Changes

- 71b8704: Bumping @kubernetes/client-node to 1.0.0-rc7 to mitigate CVEs related to the request and tough-cookie packages

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/types@1.1.1

## 0.1.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.1.20

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.1.20-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.1.19

### Patch Changes

- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.1.19-next.2

### Patch Changes

- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-model@1.6.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.2

## 0.1.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.2

## 0.1.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.2

## 0.1.17

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- b63d378: Update internal imports
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/catalog-model@1.6.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.2

## 0.1.17-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.2-next.2

## 0.1.17-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-kubernetes-common@0.8.2-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1

## 0.1.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/plugin-kubernetes-common@0.8.2-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1

## 0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.1

## 0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/plugin-kubernetes-common@0.8.1
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1

## 0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.0

## 0.1.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.0

## 0.1.13

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-kubernetes-common@0.8.0
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1

## 0.1.13-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-kubernetes-common@0.8.0-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1

## 0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.0-next.0

## 0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/plugin-kubernetes-common@0.8.0-next.0

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.6

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-kubernetes-common@0.7.6

## 0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-kubernetes-common@0.7.6-next.0
  - @backstage/types@1.1.1

## 0.1.11

### Patch Changes

- f5cec55: Fixing issue where `BackstageCredentials` were not properly forwarded for all calls
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/catalog-model@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.1.11-next.1

### Patch Changes

- f5cec55: Fixing issue where `BackstageCredentials` were not properly forwarded for all calls
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/catalog-model@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/catalog-model@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.1.8

### Patch Changes

- 69d0217: Accept auth credentials to get kubernetes clusters
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-kubernetes-common@0.7.5
  - @backstage/catalog-model@1.4.5
  - @backstage/types@1.1.1

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## 0.1.8-next.1

### Patch Changes

- 69d0217: Accept auth credentials to get kubernetes clusters
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-kubernetes-common@0.7.5-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/types@1.1.1

## 0.1.4

### Patch Changes

- a775596: Enabled a way to include custom auth metadata info on the clusters endpoint. If you want to implement a Kubernetes auth strategy which requires surfacing custom auth metadata to the frontend, use the new presentAuthMetadata method on the AuthenticationStrategy interface.
- 8472188: Added or fixed the `repository` field in `package.json`.
- 043cf88: The `ClusterDetails` type now has a `title` field, which should be a
  human-readable name.
- cceed8a: Introduced `PinnipedHelper` class to enable authentication to Kubernetes clusters through Pinniped
- f180cba: Enabling authentication to kubernetes clusters with mTLS x509 client certs
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.4
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/catalog-model@1.4.4
  - @backstage/types@1.1.1

## 0.1.4-next.3

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- 043cf88: The `ClusterDetails` type now has a `title` field, which should be a
  human-readable name.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.4-next.2
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/types@1.1.1

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.4-next.1

## 0.1.4-next.1

### Patch Changes

- cceed8a: Introduced `PinnipedHelper` class to enable authentication to Kubernetes clusters through Pinniped
- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.4-next.1

## 0.1.4-next.0

### Patch Changes

- a775596: Enabled a way to include custom auth metadata info on the clusters endpoint. If you want to implement a Kubernetes auth strategy which requires surfacing custom auth metadata to the frontend, use the new presentAuthMetadata method on the AuthenticationStrategy interface.
- f180cba: Enabling authentication to kubernetes clusters with mTLS x509 client certs
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-kubernetes-common@0.7.3
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1

## 0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.3-next.0

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.3-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1

## 0.1.2

### Patch Changes

- 6010564: The `kubernetes-node` plugin has been modified to house a new extension points for Kubernetes backend plugin;
  `KubernetesClusterSupplierExtensionPoint` is introduced .
  `kubernetesAuthStrategyExtensionPoint` is introduced .
  `kubernetesFetcherExtensionPoint` is introduced .
  `kubernetesServiceLocatorExtensionPoint` is introduced .

  The `kubernetes-backend` plugin was modified to use this new extension point.

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.2
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1

## 0.1.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-kubernetes-common@0.7.2-next.1

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-kubernetes-common@0.7.2-next.1

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.2-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-model@1.4.3

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.1
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/catalog-model@1.4.3

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.1-next.1
  - @backstage/backend-plugin-api@0.6.7-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-kubernetes-common@0.7.1-next.0

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-kubernetes-common@0.7.1-next.0

## 0.1.0

### Minor Changes

- cbb0e3c3f4: A new plugin has been introduced to house the extension points for Kubernetes backend plugin; at the moment only the `KubernetesObjectsProviderExtensionPoint` is present. The `kubernetes-backend` plugin was modified to use this new extension point.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/backend-plugin-api@0.6.6

## 0.1.0-next.0

### Minor Changes

- cbb0e3c3f4: A new plugin has been introduced to house the extension points for Kubernetes backend plugin; at the moment only the `KubernetesObjectsProviderExtensionPoint` is present. The `kubernetes-backend` plugin was modified to use this new extension point.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/plugin-kubernetes-common@0.7.0-next.1
  - @backstage/backend-plugin-api@0.6.6-next.2
