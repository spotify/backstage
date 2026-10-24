# @backstage/cli-module-test-jest

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.6-next.0

## 0.1.7

### Patch Changes

- 8747376: `jest-cli`, `jest-runtime` and the default Node.js test environment are now loaded through the installed `jest` package, so tests also run with strict `node_modules` layouts. An unsupported Jest version, or a missing `jest`, now fails with a clear error instead of a module resolution error.
- 824e835: Fixed `setupFilesAfterEnv` from the root `package.json` Jest configuration being shared between workspace packages, which caused each package's `src/setupTests` file to also be added to every other package.
- 36e3f24: Fixed CommonJS frontend test execution with ESM dependencies on Node.js 24.
- Updated dependencies
  - @backstage/cli-node@0.3.5
  - @backstage/cli-common@0.3.2

## 0.1.7-next.0

### Patch Changes

- 36e3f24: Fixed CommonJS frontend test execution with ESM dependencies on Node.js 24.
- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/cli-common@0.3.2-next.0

## 0.1.6

### Patch Changes

- 33c8190: Made the test network request guard compatible with MSW 2 request handlers.
- Updated dependencies
  - @backstage/cli-common@0.3.1

## 0.1.5

### Patch Changes

- 943687f: Stopped disabling the Node.js snapshot by default when starting backends or running tests.

## 0.1.5-next.0

### Patch Changes

- 943687f: Stopped disabling the Node.js snapshot by default when starting backends or running tests.

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.3.0
  - @backstage/cli-node@0.3.4

## 0.1.4-next.0

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
  - @backstage/cli-node@0.3.2
  - @backstage/cli-common@0.2.2

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.2-next.0
  - @backstage/cli-node@0.3.2-next.0

## 0.1.1

### Patch Changes

- 2e5c5f8: Bumped `glob` dependency from v7/v8/v11 to v13 to address security vulnerabilities in older versions. Bumped `rollup` from v4.27 to v4.59+ to fix a high severity path traversal vulnerability (GHSA-mw96-cpmx-2vgc).
- 6cc4811: Minor error message update
- Updated dependencies
  - @backstage/cli-common@0.2.1
  - @backstage/cli-node@0.3.1

## 0.1.1-next.1

### Patch Changes

- 2e5c5f8: Bumped `glob` dependency from v7/v8/v11 to v13 to address security vulnerabilities in older versions. Bumped `rollup` from v4.27 to v4.59+ to fix a high severity path traversal vulnerability (GHSA-mw96-cpmx-2vgc).
- 6cc4811: Minor error message update

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.1-next.0
  - @backstage/cli-node@0.3.1-next.0

## 0.1.0

### Minor Changes

- 329f394: Initial release of the CLI module packages. Each module provides a set of commands that can be discovered automatically by `@backstage/cli` or executed standalone.

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.0
  - @backstage/cli-common@0.2.0
