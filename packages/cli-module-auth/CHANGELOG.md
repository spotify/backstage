# @backstage/cli-module-auth

## 0.1.6-next.0

### Patch Changes

- 4d94005: Fixed `auth logout` so that it revokes the refresh token on the server. Previously the revocation request was rejected because it did not identify the CLI client, which left the session valid until it expired.
- Updated dependencies
  - @backstage/cli-node@0.3.6-next.0

## 0.1.5

### Patch Changes

- 2a83a41: Switched to version 4 of `zod` for internal validation.
- Updated dependencies
  - @backstage/cli-node@0.3.5
  - @backstage/errors@1.3.2

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/errors@1.3.2-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.4

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
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

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/cli-node@0.3.2-next.0

## 0.1.1

### Patch Changes

- 2e5c5f8: Bumped `glob` dependency from v7/v8/v11 to v13 to address security vulnerabilities in older versions. Bumped `rollup` from v4.27 to v4.59+ to fix a high severity path traversal vulnerability (GHSA-mw96-cpmx-2vgc).
- c705d44: Fixed `auth login` clearing previously configured action sources and other instance metadata when re-authenticating.
- Updated dependencies
  - @backstage/errors@1.3.0
  - @backstage/cli-node@0.3.1

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/cli-node@0.3.1-next.1

## 0.1.1-next.1

### Patch Changes

- 2e5c5f8: Bumped `glob` dependency from v7/v8/v11 to v13 to address security vulnerabilities in older versions. Bumped `rollup` from v4.27 to v4.59+ to fix a high severity path traversal vulnerability (GHSA-mw96-cpmx-2vgc).

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.1-next.0
  - @backstage/errors@1.2.7

## 0.1.0

### Minor Changes

- 329f394: Initial release of the CLI module packages. Each module provides a set of commands that can be discovered automatically by `@backstage/cli` or executed standalone.

### Patch Changes

- a49a40d: Updated dependency `zod` to `^3.25.76 || ^4.0.0` & migrated to `/v3` or `/v4` imports.
- Updated dependencies
  - @backstage/cli-node@0.3.0
