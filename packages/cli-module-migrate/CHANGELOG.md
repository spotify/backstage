# @backstage/cli-module-migrate

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.6-next.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5
  - @backstage/errors@1.3.2
  - @backstage/release-manifests@0.0.15
  - @backstage/cli-common@0.3.2

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/release-manifests@0.0.15-next.0

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/cli-common@0.3.2-next.0

## 0.2.1

### Patch Changes

- cf59370: Migrated tests from MSW v1 to MSW v2.
- Updated dependencies
  - @backstage/release-manifests@0.0.14

## 0.2.0

### Minor Changes

- 39deda4: **BREAKING**: The `versions:bump` command no longer bootstraps legacy proxy agents. Use Node.js built-in proxy support by setting `NODE_USE_ENV_PROXY=1` alongside your `HTTP_PROXY`/`HTTPS_PROXY`/`NO_PROXY` environment variables instead.

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.3.0
  - @backstage/cli-node@0.3.4

## 0.2.0-next.0

### Minor Changes

- 39deda4: **BREAKING**: The `versions:bump` command no longer bootstraps legacy proxy agents. Use Node.js built-in proxy support by setting `NODE_USE_ENV_PROXY=1` alongside your `HTTP_PROXY`/`HTTPS_PROXY`/`NO_PROXY` environment variables instead.

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.3.0-next.0
  - @backstage/cli-node@0.3.4-next.0

## 0.1.3

### Patch Changes

- 696c78c: The `--help` output for commands now shows a generated usage line that lists the available flags and any positional arguments the command accepts.
- 2e6ffe6: Updated the standalone CLI executable to use the new CLI module runner.
- Updated dependencies
  - @backstage/cli-node@0.3.3

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/cli-node@0.3.2
  - @backstage/cli-common@0.2.2

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/cli-common@0.2.2-next.0
  - @backstage/cli-node@0.3.2-next.0
  - @backstage/release-manifests@0.0.13

## 0.1.1

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/errors@1.3.0
  - @backstage/cli-common@0.2.1
  - @backstage/cli-node@0.3.1

## 0.1.1-next.1

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/cli-common@0.2.1-next.1
  - @backstage/cli-node@0.3.1-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.1-next.0
  - @backstage/cli-node@0.3.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/release-manifests@0.0.13

## 0.1.0

### Minor Changes

- 329f394: Initial release of the CLI module packages. Each module provides a set of commands that can be discovered automatically by `@backstage/cli` or executed standalone.

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.0
  - @backstage/cli-common@0.2.0
