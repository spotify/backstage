# @backstage/cli-node

## 0.3.6-next.0

### Patch Changes

- 4294614: Commands run through `runCli` now exit with the exit code they set, instead of always exiting with `0` on completion. For example, `catalog validate` and `template dry-run` now exit with a non-zero code when the input is invalid.

## 0.3.5

### Patch Changes

- 3d6721d: Add intent-based CLI modules for catalog, scaffolder, and search.

  New modules provide domain-oriented subcommands that talk directly to the corresponding plugins' REST APIs:

  - `@backstage/cli-module-catalog`: `catalog list`, `catalog get`, `catalog validate`, `catalog register`, `catalog unregister`
  - `@backstage/cli-module-scaffolder`: `template list`, `template execute`, `template dry-run`
  - `@backstage/cli-module-search`: `search`, `docs search`

  The commands take their main input as a positional argument: an entity or template reference, a file path (or `-` for standard input) for `catalog validate` and `template dry-run`, a URL for `catalog register`, and the search terms for `search` and `docs search`. Repeatable `key=value` flags are used for filters, template values, and secrets, and comma-separated lists for `--fields`. Unknown flags are rejected.

  The commands that list results, `catalog list`, `template list`, `search`, and `docs search`, support `--output human` (the default) or `--output json`, along with `--limit` and `--cursor` for paging. Each command prints a single page. Human output shows how many results were shown and, when more are available, prints the `--cursor` value to continue from. All other commands always print JSON. `catalog validate` checks every entity in a multi-document YAML file and prints a JSON array with one result per entity. `catalog validate` and `template dry-run` exit with a non-zero code when the input is invalid, while connection and authentication problems are reported as errors.

  `@backstage/cli-node` now provides shared parsers for repeatable `key=value` inputs and comma-separated lists.

- 7c6ab3d: Commands run through `runCli` now wait for `stdout` and `stderr` to be flushed before exiting, so large command output is no longer truncated on platforms where writes to `stdout` and `stderr` are asynchronous.
- 6dc6bc6: Fixed CLIs created with `runCli` silently exiting when the root or a command group is invoked without a subcommand. They now display help for that level and complete successfully.

  Help output now lists groups and commands in separate, alphabetically sorted sections. Group previews adapt to the terminal width, using 80 columns when unavailable. Nested groups expand breadth-first when space permits; unexpanded groups retain a trailing slash and truncated previews end in an ellipsis.

- Updated dependencies
  - @backstage/errors@1.3.2
  - @backstage/cli-common@0.3.2

## 0.3.5-next.1

### Patch Changes

- 7c6ab3d: Commands run through `runCli` now wait for `stdout` and `stderr` to be flushed before exiting, so large command output is no longer truncated on platforms where writes to `stdout` and `stderr` are asynchronous.
- 6dc6bc6: Fixed CLIs created with `runCli` silently exiting when the root or a command group is invoked without a subcommand. They now display help for that level and complete successfully.

  Help output now lists groups and commands in separate, alphabetically sorted sections. Group previews adapt to the terminal width, using 80 columns when unavailable. Nested groups expand breadth-first when space permits; unexpanded groups retain a trailing slash and truncated previews end in an ellipsis.

## 0.3.5-next.0

### Patch Changes

- 3d6721d: Add intent-based CLI modules for catalog, scaffolder, and search.

  New modules provide domain-oriented subcommands that talk directly to the corresponding plugins' REST APIs:

  - `@backstage/cli-module-catalog`: `catalog list`, `catalog get`, `catalog validate`, `catalog register`, `catalog unregister`
  - `@backstage/cli-module-scaffolder`: `template list`, `template execute`, `template dry-run`
  - `@backstage/cli-module-search`: `search`, `docs search`

  The commands support human-readable and JSON output, positional entity and template references, repeatable `key=value` filters and inputs, comma-separated fields and search types, and file-based catalog entity and template input.

  `@backstage/cli-node` now provides shared parsers for repeatable `key=value` inputs and comma-separated lists.

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/cli-common@0.3.2-next.0

## 0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.3.0

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.3.0-next.0

## 0.3.3

### Patch Changes

- b521571: Added `runCli` for creating executable CLI packages from a fixed collection of directly imported CLI modules, with validation for conflicting command paths. The single-module `runCliModule` helper is now deprecated.

## 0.3.2

### Patch Changes

- 357d639: Fixed a bug in `PackageGraph.listChangedPackages` where removed dependencies were not detected during lockfile analysis. The dependency graph from the previous lockfile was not being merged, causing transitive dependency removals to be missed.
- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/cli-common@0.2.2

## 0.3.2-next.1

### Patch Changes

- 357d639: Fixed a bug in `PackageGraph.listChangedPackages` where removed dependencies were not detected during lockfile analysis. The dependency graph from the previous lockfile was not being merged, causing transitive dependency removals to be missed.

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/cli-common@0.2.2-next.0
  - @backstage/types@1.2.2

## 0.3.1

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/errors@1.3.0
  - @backstage/cli-common@0.2.1

## 0.3.1-next.1

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/cli-common@0.2.1-next.1

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.3.0

### Minor Changes

- 7d055ef: Added `createCliModule` API and related types for building Backstage CLI plugins.

### Patch Changes

- 94a885a: Added a new `cli-module` package role for packages that provide CLI plugin extensions.
- 12fa965: Added `CliAuth` class for managing CLI authentication state. This provides a class-based API with a static `create` method that resolves the currently selected (or explicitly named) auth instance, transparently refreshes expired access tokens, and exposes helpers for other CLI modules to authenticate with a Backstage backend.
- 61cb976: Added `toString()` method to `Lockfile` for serializing lockfiles back to string format.
- 06c2015: Added `runConcurrentTasks` and `runWorkerQueueThreads` utilities, moved from the `@backstage/cli` internal code.
- 70fc178: Migrated from deprecated `findPaths` to `targetPaths` and `findOwnPaths` from `@backstage/cli-common`.
- 3c811bf: Added `hasBackstageYarnPlugin` and `SuccessCache` exports, moved from `@backstage/cli`.
- a49a40d: Updated dependency `zod` to `^3.25.76 || ^4.0.0` & migrated to `/v3` or `/v4` imports.
- a9d23c4: Properly support `package.json` `workspaces` field
- Updated dependencies
  - @backstage/cli-common@0.2.0

## 0.2.19-next.1

### Patch Changes

- 61cb976: Added `toString()` method to `Lockfile` for serializing lockfiles back to string format.
- 3c811bf: Added `hasBackstageYarnPlugin` and `SuccessCache` exports, moved from `@backstage/cli`.
- a9d23c4: Properly support `package.json` `workspaces` field
- Updated dependencies
  - @backstage/cli-common@0.2.0-next.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.2.19-next.0

### Patch Changes

- 06c2015: Added `runConcurrentTasks` and `runWorkerQueueThreads` utilities, moved from the `@backstage/cli` internal code.
- 70fc178: Migrated from deprecated `findPaths` to `targetPaths` and `findOwnPaths` from `@backstage/cli-common`.
- Updated dependencies
  - @backstage/cli-common@0.2.0-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.2.18

### Patch Changes

- 7455dae: Use node prefix on native imports
- 5e3ef57: Added support for the new `peerModules` metadata field in `package.json`. This field allows plugin packages to declare modules that should be installed alongside them for cross-plugin integrations. The field is validated by `backstage-cli repo fix --publish`.
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/cli-common@0.1.18

## 0.2.18-next.1

### Patch Changes

- 5e3ef57: Added support for the new `peerModules` metadata field in `package.json`. This field allows plugin packages to declare modules that should be installed alongside them for cross-plugin integrations. The field is validated by `backstage-cli repo fix --publish`.

## 0.2.17-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/cli-common@0.1.18-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.2.16

### Patch Changes

- 4e8c726: Updated to use new utilities from `@backstage/cli-common`.
- Updated dependencies
  - @backstage/cli-common@0.1.16

## 0.2.16-next.1

### Patch Changes

- 4e8c726: Updated to use new utilities from `@backstage/cli-common`.
- Updated dependencies
  - @backstage/cli-common@0.1.16-next.1

## 0.2.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.16-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.2.15

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.

## 0.2.15-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/cli-common@0.1.15
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.2.14

### Patch Changes

- d9a7835: Add `get` and `keys` methods to `Lockfile` class

## 0.2.13

### Patch Changes

- cb76663: Added `type` field to `BackstagePackageJson` type.
- f54eed0: Fixed an issue where default feature type information wasn't being added to package.json/exports before publishing if exports didn't exist beforehand
- Updated dependencies
  - @backstage/cli-common@0.1.15
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.2.13-next.1

### Patch Changes

- f54eed0: Fixed an issue where default feature type information wasn't being added to package.json/exports before publishing if exports didn't exist beforehand
- Updated dependencies
  - @backstage/cli-common@0.1.15
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.2.13-next.0

### Patch Changes

- cb76663: Added `type` field to `BackstagePackageJson` type.
- Updated dependencies
  - @backstage/cli-common@0.1.15
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.2.12

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1
  - @backstage/cli-common@0.1.15
  - @backstage/errors@1.2.7

## 0.2.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/cli-common@0.1.15

## 0.2.11

### Patch Changes

- af665ea: add PackageManager and Lockfile interfaces for future use
- cbfc69e: Internal refactor
- Updated dependencies
  - @backstage/errors@1.2.6
  - @backstage/cli-common@0.1.15
  - @backstage/types@1.2.0

## 0.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.6-next.0
  - @backstage/cli-common@0.1.15
  - @backstage/types@1.2.0

## 0.2.11-next.0

### Patch Changes

- af665ea: add PackageManager and Lockfile interfaces for future use
- cbfc69e: Internal refactor
- Updated dependencies
  - @backstage/cli-common@0.1.15
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0

## 0.2.10

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.0
  - @backstage/cli-common@0.1.15
  - @backstage/errors@1.2.5

## 0.2.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.9

### Patch Changes

- fec7278: Added new `lockfile.getDependencyTreeHash(name)` utility.
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.9-next.0

### Patch Changes

- fec7278: Added new `lockfile.getDependencyTreeHash(name)` utility.
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.8

### Patch Changes

- 0c70f43: Add definition for the new `backstage.inline` field in `package.json`.
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.8-next.0

### Patch Changes

- 0c70f43: Add definition for the new `backstage.inline` field in `package.json`.
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.7

### Patch Changes

- 133464c: Added internal metadata for the new experimental `frontend-dynamic-container` role.
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.6

### Patch Changes

- a1ae9cc: Updated doc link.
- c328131: Added new plugin metadata fields to `BackstagePackageJson` type.
- 93be042: Upgraded @yarnpkg/parsers to stable 3.0
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.6-next.2

### Patch Changes

- c328131: Added new plugin metadata fields to `BackstagePackageJson` type.
- Updated dependencies
  - @backstage/cli-common@0.1.14-next.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.6-next.1

### Patch Changes

- a1ae9cc: Updated doc link.
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.6-next.0

### Patch Changes

- 93be042: Upgraded @yarnpkg/parsers to stable 3.0
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.5

### Patch Changes

- ed9260f: Added `versions:migrate` command to help move packages to the new `@backstage-community` namespace
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.4
  - @backstage/cli-common@0.1.13
  - @backstage/types@1.1.1

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.4-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/types@1.1.1

## 0.2.3

### Patch Changes

- d557d47: Added `repository` field to `BackstagePackageJson` type.
- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.3-next.0

### Patch Changes

- d557d47: Added `repository` field to `BackstagePackageJson` type.
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.2

### Patch Changes

- 7acbb5a: Removed `mock-fs` dev dependency.
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.2-next.0

### Patch Changes

- 7acbb5a: Removed `mock-fs` dev dependency.
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.1

### Patch Changes

- 0cbb03b: Fixing regular expression ReDoS with zod packages. Upgrading to latest. ref: https://security.snyk.io/vuln/SNYK-JS-ZOD-5925617
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.0

### Minor Changes

- 8db5c3cd7a: Removed support for the `publishConfig.alphaTypes` and `.betaTypes` fields that were used together with `--experimental-type-build` to generate `/alpha` and `/beta` entry points. Use the `exports` field to achieve this instead.

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.0-next.0

### Minor Changes

- 8db5c3cd7a: Removed support for the `publishConfig.alphaTypes` and `.betaTypes` fields that were used together with `--experimental-type-build` to generate `/alpha` and `/beta` entry points. Use the `exports` field to achieve this instead.

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13
  - @backstage/types@1.1.1

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.3-next.0
  - @backstage/cli-common@0.1.13-next.0
  - @backstage/types@1.1.1

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.13-next.0
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/cli-common@0.1.12

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.2-next.0
  - @backstage/types@1.1.1-next.0
  - @backstage/cli-common@0.1.12

## 0.1.3

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.1.3-next.0

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.1.2

### Patch Changes

- 4edd1ef71453: semver upgrade to 7.5.3
- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/cli-common@0.1.12
  - @backstage/types@1.1.0

## 0.1.2-next.1

### Patch Changes

- 4edd1ef71453: semver upgrade to 7.5.3
- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.2.1-next.0
  - @backstage/types@1.1.0

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/types@1.1.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.1.0
  - @backstage/errors@1.2.0
  - @backstage/cli-common@0.1.12

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.0-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/types@1.0.2

## 0.1.0

### Minor Changes

- 3156b0d85dc: Introduced the new `@backstage/cli-node` package, which provides utilities for use across Backstage CLIs.

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.1.0-next.0

### Minor Changes

- 3156b0d85dc: Introduced the new `@backstage/cli-node` package, which provides utilities for use across Backstage CLIs.

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
