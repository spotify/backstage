---
id: modules
title: Overview
description: Overview of the Backstage CLI module system and the default set of modules.
---

The Backstage CLI is built from a set of independent **CLI modules**, each
providing a group of related commands. This modular architecture lets you
choose which commands are available and add your own.

## Default modules

Out of the box the CLI ships with
[`@backstage/cli-defaults`](https://www.npmjs.com/package/@backstage/cli-defaults),
which bundles the following modules:

| Module                                                   | Package                                      | Commands                                                                                                                                                                        |
| -------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Auth](./module-auth.md)                                 | `@backstage/cli-module-auth`                 | `auth login`, `auth logout`, `auth show`, `auth list`, `auth print-token`, `auth select`                                                                                        |
| [Actions](./module-actions.md)                           | `@backstage/cli-module-actions`              | `actions list`, `actions execute`, `actions sources add`, `actions sources list`, `actions sources remove`                                                                      |
| [Catalog](./module-catalog.md)                           | `@backstage/cli-module-catalog`              | `catalog list`, `catalog get`, `catalog validate`, `catalog register`, `catalog unregister`                                                                                     |
| [Scaffolder](./module-scaffolder.md)                     | `@backstage/cli-module-scaffolder`           | `template list`, `template execute`, `template dry-run`                                                                                                                         |
| [Search](./module-search.md)                             | `@backstage/cli-module-search`               | `search`, `docs search`                                                                                                                                                         |
| [Build](./module-build.md)                               | `@backstage/cli-module-build`                | `package build`, `package start`, `package bundle`, `package clean`, `package prepack`, `package postpack`, `repo build`, `repo start`, `repo clean`, `build-workspace`         |
| [Config](./module-config.md)                             | `@backstage/cli-module-config`               | `config:docs`, `config:print`, `config:check`, `config:schema`                                                                                                                  |
| [GitHub](./module-github.md)                             | `@backstage/cli-module-github`               | `create-github-app`                                                                                                                                                             |
| [Info](./module-info.md)                                 | `@backstage/cli-module-info`                 | `info`                                                                                                                                                                          |
| [Lint](./module-lint.md)                                 | `@backstage/cli-module-lint`                 | `package lint`, `repo lint`                                                                                                                                                     |
| [Maintenance](./module-maintenance.md)                   | `@backstage/cli-module-maintenance`          | `repo fix`, `repo list-deprecations`                                                                                                                                            |
| [Migrate](./module-migrate.md)                           | `@backstage/cli-module-migrate`              | `versions:bump`, `versions:migrate`, `migrate package-roles`, `migrate package-scripts`, `migrate package-exports`, `migrate package-lint-configs`, `migrate react-router-deps` |
| [New](./module-new.md)                                   | `@backstage/cli-module-new`                  | `new`                                                                                                                                                                           |
| [Test](./module-test.md)                                 | `@backstage/cli-module-test-jest`            | `repo test`, `package test`                                                                                                                                                     |
| [Translations](./module-translations.md)                 | `@backstage/cli-module-translations`         | `translations export`, `translations import`                                                                                                                                    |
| [Yarn Package Manager](./module-package-manager-yarn.md) | `@backstage/cli-module-package-manager-yarn` | `pm verify-patches`                                                                                                                                                             |

Each module name links to its dedicated page with full command documentation
including options and examples. See the [commands](./03-commands.md) page for a
quick reference index of all commands.

## How module discovery works

When the CLI starts it scans the project root's `package.json` for all
dependencies and development dependencies. For each dependency it checks whether the
package's own `package.json` contains `backstage.role` set to `"cli-module"`. If
it does, the module is loaded and its commands become available.

If no CLI modules are found among the project's dependencies, the CLI falls back
to importing `@backstage/cli-defaults` and prints a deprecation warning. This
fallback will be removed in a future release. To avoid the warning, add
`@backstage/cli-defaults` as a development dependency in your root `package.json`, or
install individual `@backstage/cli-module-*` packages.

## Package manager detection

Modules that install dependencies, read the lockfile, or pack packages detect
the package manager the same way. They use Yarn or pnpm depending on the
project they run in, with no configuration. The Yarn package manager module is
the exception. It works with Yarn only. See
[Package Managers](../package-managers.md) for the detection order and for
what differs in a pnpm project.

## Customizing the default modules

### Overriding a module

You can override one or more of the default modules by installing the
replacement as a direct dependency in your project root. When a module installed
individually conflicts with a module from `@backstage/cli-defaults`, the
individually installed module takes precedence and the conflicting default module
is silently skipped.

For example, if you publish an internal `@mycompany/cli-module-build` that
registers the same command paths as `@backstage/cli-module-build`, adding it to
your root `package.json` causes it to be used instead of the default build
module:

```json title="package.json"
{
  "devDependencies": {
    "@backstage/cli": "...",
    "@mycompany/cli-module-build": "..."
  }
}
```

### Using a subset of modules

If you only need certain modules, you can install them individually instead of
relying on `@backstage/cli-defaults`. The CLI discovers them through the same
dependency scanning mechanism:

```json title="package.json"
{
  "devDependencies": {
    "@backstage/cli": "...",
    "@backstage/cli-module-build": "...",
    "@backstage/cli-module-lint": "...",
    "@backstage/cli-module-test-jest": "..."
  }
}
```

In this example only the build, lint, and test commands would be available.

### Adding custom modules

You can add your own CLI modules alongside the defaults. Any package with
`backstage.role` set to `"cli-module"` in its `package.json` that is listed as a
dependency is discovered automatically. See
[Building Custom CLI Modules](./building-cli-modules.md) for a full guide.

## Architecture

The CLI module system is implemented across several packages:

- **`@backstage/cli`** — The main CLI entry point. Contains the `CliInitializer`
  that discovers modules and the `discoverCliModules` function that scans
  project dependencies.
- **`@backstage/cli-node`** — Provides the public API for building CLI modules:
  `createCliModule`, `runCli`, and the `CliModule`, `CliCommand`, and
  `CliCommandContext` types.
- **`@backstage/cli-common`** — Minimal shared utilities for path resolution and
  child process management, used by the CLI, backend, and `create-app`.
- **`@backstage/cli-defaults`** — Aggregator package that re-exports all 13
  default modules as an array.
