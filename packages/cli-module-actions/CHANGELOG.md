# @backstage/cli-module-actions

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.6-next.0

## 0.1.4

### Patch Changes

- d73df15: The `actions list` command now returns partial results when some plugin sources fail, instead of failing entirely. Failed sources are reported as warnings.
- Updated dependencies
  - @backstage/cli-node@0.3.5
  - @backstage/errors@1.3.2

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/errors@1.3.2-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.4

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.4-next.0

## 0.1.2

### Patch Changes

- 696c78c: The `--help` output for commands now shows a generated usage line that lists the available flags and any positional arguments the command accepts.
- 2e6ffe6: Updated the standalone CLI executable to use the new CLI module runner.
- Updated dependencies
  - @backstage/cli-node@0.3.3

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/cli-node@0.3.2

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/cli-node@0.3.2-next.0

## 0.1.0

### Minor Changes

- c705d44: Added improved CLI output formatting and UX for the actions module. The `list` command now groups actions by plugin source with colored headers and action titles. The `execute --help` command renders full action details including markdown descriptions. Complex schema types like objects, arrays, and union types are now accepted as JSON flags. Error messages from the server are now surfaced directly. The `sources add` and `sources remove` commands accept multiple plugin IDs at once.

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0
  - @backstage/cli-node@0.3.1

## 0.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/cli-node@0.3.1-next.1

## 0.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.1-next.0
  - @backstage/errors@1.2.7

## 0.0.1

### Patch Changes

- 42960f1: Added `actions` CLI module for listing and executing actions from the distributed actions registry. Includes `actions list`, `actions execute`, and `actions sources` commands for managing plugin sources.
- Updated dependencies
  - @backstage/cli-node@0.3.0
