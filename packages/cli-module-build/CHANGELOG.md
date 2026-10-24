# @backstage/cli-module-build

## 0.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.6-next.0

## 0.1.9

### Patch Changes

- cc4ef47: Restored the default exclusion of `node_modules` from test coverage for this package.
- 2ece167: Updated dependency `webpack` to `~5.111.0`.
- f163298: Improved code splitting for frontend module federation remotes to reduce unnecessary downloads of unrelated lazy components from the same dependency scope. Shared dependencies and workspace code are extracted across lazy boundaries when the resulting shared chunk meets the size threshold. Regular application builds are unchanged.
- Updated dependencies
  - @backstage/cli-node@0.3.5
  - @backstage/config-loader@1.11.4
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/cli-common@0.3.2
  - @backstage/module-federation-common@0.1.6

## 0.1.9-next.2

### Patch Changes

- cc4ef47: Restored the default exclusion of `node_modules` from test coverage for this package.
- f163298: Improved code splitting for frontend module federation remotes to reduce unnecessary downloads of unrelated lazy components from the same dependency scope. Shared dependencies and workspace code are extracted across lazy boundaries when the resulting shared chunk meets the size threshold. Regular application builds are unchanged.

## 0.1.9-next.1

### Patch Changes

- 2ece167: Updated dependency `webpack` to `~5.111.0`.

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/config-loader@1.11.4-next.0
  - @backstage/module-federation-common@0.1.6-next.0
  - @backstage/cli-common@0.3.2-next.0

## 0.1.8

### Patch Changes

- 064c2de: Updated the Module Federation dependencies to versions that avoid known security vulnerabilities.
- 96badbc: Fixed a bug where plugin packages installed through feature discovery were loaded before the app's own code ran. This could cause bootstrap-order-sensitive setup code in the app, such as configuring MUI 5's class name prefix, to be skipped if a discovered plugin's dependencies loaded MUI 5 components first. Discovered plugin packages are now loaded after the app's own code instead.
- b2b7568: Significantly improve the performance of `build-workspace` when packaging many Backstage packages.
- 277a125: Fixed declaration bundling of imports that use the `node:` built-in module prefix.
- Updated dependencies
  - @backstage/cli-common@0.3.1
  - @backstage/config@1.3.9
  - @backstage/module-federation-common@0.1.5
  - @backstage/config-loader@1.11.3

## 0.1.8-next.2

### Patch Changes

- 064c2de: Updated the Module Federation dependencies to versions that avoid known security vulnerabilities.
- 96badbc: Fixed a bug where plugin packages installed through feature discovery were loaded before the app's own code ran. This could cause bootstrap-order-sensitive setup code in the app, such as configuring MUI 5's class name prefix, to be skipped if a discovered plugin's dependencies loaded MUI 5 components first. Discovered plugin packages are now loaded after the app's own code instead.
- Updated dependencies
  - @backstage/config@1.3.9-next.0
  - @backstage/module-federation-common@0.1.5-next.0
  - @backstage/config-loader@1.11.3-next.0

## 0.1.8-next.1

### Patch Changes

- 277a125: Fixed declaration bundling of imports that use the `node:` built-in module prefix.

## 0.1.8-next.0

### Patch Changes

- b2b7568: Significantly improve the performance of `build-workspace` when packaging many Backstage packages.

## 0.1.7

### Patch Changes

- 943687f: Stopped disabling the Node.js snapshot by default when starting backends or running tests.
- 4d7b153: chore(deps): bump `shell-quote` from 1.8.4 to 1.9.0
- 78bf918: chore(deps): bump `tar` from 7.5.15 to 7.5.21
- bb98419: Package preparation for publishing validates TypeScript configuration schemas strictly, preventing invalid schemas from being published. Other build and bundle paths report schema errors as warnings.
- Updated dependencies
  - @backstage/config-loader@1.11.2

## 0.1.7-next.0

### Patch Changes

- 943687f: Stopped disabling the Node.js snapshot by default when starting backends or running tests.
- 4d7b153: chore(deps): bump `shell-quote` from 1.8.4 to 1.9.0
- 78bf918: chore(deps): bump `tar` from 7.5.15 to 7.5.21
- bb98419: Package preparation for publishing validates TypeScript configuration schemas strictly, preventing invalid schemas from being published. Other build and bundle paths report schema errors as warnings.
- Updated dependencies
  - @backstage/config-loader@1.11.2-next.0

## 0.1.5

### Patch Changes

- 87af6ce: Package preparation now converts TypeScript configuration schemas to separate JSON files. Backend builds compile schemas together before assembling the distribution workspace, while package publishing compiles each schema independently.
- 853bcba: Improved caching for Module Federation remote builds by extracting dependencies into separate content-hashed chunks.
- 3cce70f: Increase generated frontend static asset filename hashes to 12 characters to reduce the chance of collisions across long-lived cached builds.
- da820d1: Added support for passing custom flags to the embedded postgres processes via `backend.database.connection.flags.postgres` and `backend.database.connection.flags.initdb` configuration properties.
- Updated dependencies
  - @backstage/config-loader@1.11.0
  - @backstage/cli-common@0.3.0
  - @backstage/cli-node@0.3.4

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.3.0-next.0
  - @backstage/cli-node@0.3.4-next.0
  - @backstage/config-loader@1.11.0-next.2

## 0.1.5-next.1

### Patch Changes

- 3cce70f: Increase generated frontend static asset filename hashes to 12 characters to reduce the chance of collisions across long-lived cached builds.
- Updated dependencies
  - @backstage/config-loader@1.11.0-next.1

## 0.1.5-next.0

### Patch Changes

- 87af6ce: Package preparation now converts TypeScript configuration schemas to separate JSON files. Backend builds compile schemas together before assembling the distribution workspace, while package publishing compiles each schema independently.
- da820d1: Added support for passing custom flags to the embedded postgres processes via `backend.database.connection.flags.postgres` and `backend.database.connection.flags.initdb` configuration properties.
- Updated dependencies
  - @backstage/config-loader@1.11.0-next.0

## 0.1.4

### Patch Changes

- 696c78c: The `--help` output for commands now shows a generated usage line that lists the available flags and any positional arguments the command accepts.
- 2e6ffe6: Updated the standalone CLI executable to use the new CLI module runner.
- a1971ea: Suppress false-positive `@protobufjs/inquire` "Critical dependency" warning in the bundler. Since `protobufjs` 7.5.9, the dynamic require path in inquire is no longer exercised, but webpack/rspack still flags it during static analysis.
- 8007b58: Updated dependency `embedded-postgres` to `18.3.0-beta.17`.
- Updated dependencies
  - @backstage/cli-node@0.3.3
  - @backstage/config-loader@1.10.12

## 0.1.4-next.0

### Patch Changes

- a1971ea: Suppress false-positive `@protobufjs/inquire` "Critical dependency" warning in the bundler. Since `protobufjs` 7.5.9, the dynamic require path in inquire is no longer exercised, but webpack/rspack still flags it during static analysis.
- 8007b58: Updated dependency `embedded-postgres` to `18.3.0-beta.17`.

## 0.1.3

### Patch Changes

- ed4ee6f: Fixed config path resolution for the embedded-postgres database client detection to resolve paths relative to the target package directory rather than the workspace root.
- be7e4eb: The embedded Postgres database used during local development now respects user-provided connection configuration. If you configure `host`, `port`, `user`, or `password` under `backend.database.connection` alongside the `embedded-postgres` database client, those values will be forwarded to the embedded Postgres instance. Only values that you have not configured will be filled in with defaults. This makes it possible to run the embedded database on a specific host and port, for example to connect to it externally with `psql`.
- 41070b8: Upgraded `@module-federation/enhanced`, `@module-federation/runtime`, and `@module-federation/sdk` from `^0.21.6` to `^2.3.3` to address known vulnerabilities.
- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/cli-node@0.3.2
  - @backstage/module-federation-common@0.1.4
  - @backstage/cli-common@0.2.2
  - @backstage/config@1.3.8
  - @backstage/config-loader@1.10.11

## 0.1.3-next.0

### Patch Changes

- ed4ee6f: Fixed config path resolution for the embedded-postgres database client detection to resolve paths relative to the target package directory rather than the workspace root.
- 41070b8: Upgraded `@module-federation/enhanced`, `@module-federation/runtime`, and `@module-federation/sdk` from `^0.21.6` to `^2.3.3` to address known vulnerabilities.
- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/module-federation-common@0.1.4-next.0
  - @backstage/cli-common@0.2.2-next.0
  - @backstage/cli-node@0.3.2-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/config-loader@1.10.11-next.0

## 0.1.1

### Patch Changes

- 2e5c5f8: Bumped `glob` dependency from v7/v8/v11 to v13 to address security vulnerabilities in older versions. Bumped `rollup` from v4.27 to v4.59+ to fix a high severity path traversal vulnerability (GHSA-mw96-cpmx-2vgc).
- f1b493f: Fixed the embedded-postgres PID file being written before database initialization, which prevented the database from initializing successfully.
- f52a296: Suppressed false-positive Module Federation warning for shared dependencies that use secondary entry points (e.g. `@mui/material/styles`). These sub-path `package.json` files lack a `version` field, causing the bundler to emit "No version specified" warnings that fail CI builds.
- c16c508: When building dist-workspaces with --always-pack, batch `yarn pack` operations to avoid packing packages and their dependencies simultaneously.
- f14df56: Added experimental support for using `embedded-postgres` as the database for local development. Set `backend.database.client` to `embedded-postgres` in your app config to enable this. The `embedded-postgres` package must be installed as an explicit dependency in your project.
- Updated dependencies
  - @backstage/errors@1.3.0
  - @backstage/cli-common@0.2.1
  - @backstage/cli-node@0.3.1
  - @backstage/config-loader@1.10.10
  - @backstage/config@1.3.7
  - @backstage/module-federation-common@0.1.3

## 0.1.1-next.2

### Patch Changes

- c16c508: When building dist-workspaces with --always-pack, batch `yarn pack` operations to avoid packing packages and their dependencies simultaneously.
- f14df56: Added experimental support for using `embedded-postgres` as the database for local development. Set `backend.database.client` to `embedded-postgres` in your app config to enable this. The `embedded-postgres` package must be installed as an explicit dependency in your project.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/cli-common@0.2.1-next.1
  - @backstage/cli-node@0.3.1-next.1
  - @backstage/config-loader@1.10.10-next.1
  - @backstage/config@1.3.7-next.0
  - @backstage/module-federation-common@0.1.3-next.0

## 0.1.1-next.1

### Patch Changes

- 2e5c5f8: Bumped `glob` dependency from v7/v8/v11 to v13 to address security vulnerabilities in older versions. Bumped `rollup` from v4.27 to v4.59+ to fix a high severity path traversal vulnerability (GHSA-mw96-cpmx-2vgc).

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.1-next.0
  - @backstage/cli-node@0.3.1-next.0
  - @backstage/config-loader@1.10.10-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/module-federation-common@0.1.2

## 0.1.0

### Minor Changes

- 62d0849: Added `package bundle` command to create self-contained plugin bundles for dynamic loading, to be used by the `backend-dynamic-feature-service`. Supports backend and frontend plugins, with optional `--pre-packed-dir` for batch bundling from a pre-built workspace.
- 329f394: Initial release of the CLI module packages. Each module provides a set of commands that can be discovered automatically by `@backstage/cli` or executed standalone.

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.0
  - @backstage/cli-common@0.2.0
  - @backstage/module-federation-common@0.1.2
  - @backstage/config-loader@1.10.9
