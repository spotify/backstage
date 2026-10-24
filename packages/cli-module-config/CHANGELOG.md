# @backstage/cli-module-config

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.6-next.0

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5
  - @backstage/config-loader@1.11.4
  - @backstage/config@1.3.10
  - @backstage/cli-common@0.3.2

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/config-loader@1.11.4-next.0
  - @backstage/cli-common@0.3.2-next.0

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.3.1
  - @backstage/config@1.3.9
  - @backstage/config-loader@1.11.3

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.9-next.0
  - @backstage/config-loader@1.11.3-next.0

## 0.1.6

### Patch Changes

- bb98419: The `--strict` flag for `config:check` now treats TypeScript configuration schema errors as fatal. The same flag is now also available for `config:schema`.
- Updated dependencies
  - @backstage/config-loader@1.11.2

## 0.1.6-next.0

### Patch Changes

- bb98419: The `--strict` flag for `config:check` now treats TypeScript configuration schema errors as fatal. The same flag is now also available for `config:schema`.
- Updated dependencies
  - @backstage/config-loader@1.11.2-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.11.0
  - @backstage/cli-common@0.3.0
  - @backstage/cli-node@0.3.4

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.3.0-next.0
  - @backstage/cli-node@0.3.4-next.0
  - @backstage/config-loader@1.11.0-next.2

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.11.0-next.0

## 0.1.3

### Patch Changes

- 696c78c: The `--help` output for commands now shows a generated usage line that lists the available flags and any positional arguments the command accepts.
- 2e6ffe6: Updated the standalone CLI executable to use the new CLI module runner.
- 02c4e8a: Removed unused `json-schema` runtime dependency. The package was only used for TypeScript types from `@types/json-schema`; affected imports have been converted to `import type` to allow safe removal.
- Updated dependencies
  - @backstage/cli-node@0.3.3
  - @backstage/config-loader@1.10.12

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.2
  - @backstage/cli-common@0.2.2
  - @backstage/config@1.3.8
  - @backstage/config-loader@1.10.11

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.2-next.0
  - @backstage/cli-node@0.3.2-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/config-loader@1.10.11-next.0
  - @backstage/types@1.2.2

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.1
  - @backstage/cli-node@0.3.1
  - @backstage/config-loader@1.10.10
  - @backstage/config@1.3.7

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.1-next.1
  - @backstage/cli-node@0.3.1-next.1
  - @backstage/config-loader@1.10.10-next.1
  - @backstage/config@1.3.7-next.0

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.1-next.0
  - @backstage/cli-node@0.3.1-next.0
  - @backstage/config-loader@1.10.10-next.0
  - @backstage/config@1.3.6
  - @backstage/types@1.2.2

## 0.1.0

### Minor Changes

- 329f394: Initial release of the CLI module packages. Each module provides a set of commands that can be discovered automatically by `@backstage/cli` or executed standalone.

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.0
  - @backstage/cli-common@0.2.0
  - @backstage/config-loader@1.10.9
