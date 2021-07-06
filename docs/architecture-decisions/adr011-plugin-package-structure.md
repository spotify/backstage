---
id: adrs-adr011
title: ADR011: Plugin Package Structure
description: Architecture Decision Record (ADR) for Plugin Package Structure
---

## Context

A core feature of Backstage is the extensibility via plugins. The Backstage
repository is open for contributions of plugins. Even most of the core features
are implemented as plugins. A plugin consists of one or multiple packages in the
`plugins/` directory. Up till now, we have a simple conventions for naming
plugin packages: Plugins are named `x`, with the option of having a related
backend plugin called `x-backend` (where `x` is the plugin name, like `catalog`
or `techdocs`). There is a need for sharing code between the frontend and
backend of a plugin, between backend plugins, or components and hooks between
different frontend plugins
([some examples](https://github.com/backstage/backstage/issues/3655#issuecomment-758166746)).
This results in emerging plugin packages with shared code, like
`packages/catalog-client` or `packages/techdocs-common`.

> There is a common phrase in software development:
> [Naming things is hard](https://martinfowler.com/bliki/TwoHardThings.html)

To keep the contributed plugins consistent, this Architecture Decision Record
provides rules for naming plugin packages.

## Decision

We will place all plugin related code in the `plugins/` directory. The
`packages/` directory is reserved for core package of Backstage.

We follow this structure for plugin packages (where `x` is the plugin name, for
example `catalog` or `techdocs`):

- `x`: Contains the main frontend code of the plugin.
- `x-backend`: Contains the main backend code of the plugin.
- `x-backend-module-<name>`: Contains optional modules related to the backend
  plugin.
- `x-react`: Contains shared widgets, hooks and similar that both the plugin
  itself (`x`) and third-party frontend plugins can depend on.
- `x-node`: Contains utilities for backends that both the plugin backend itself
  (`x-backend`) and third-party backend plugins can depend on.
- `x-common`: An isomorphic package with platform agnostic models, clients, and
  utilities that all packages above or any third-party plugin package can depend
  on.

We prefix the package names with `@backstage/plugin-`.

This structure is based on a
[suggestion in issue #3655](https://github.com/backstage/backstage/issues/3655#issuecomment-758166746).

## Consequences

We will actively migrate existing packages that are part of a plugin to the
`plugins/` folder. This affects packages like:

- `packages/techdocs-common` which should be moved to `plugins/techdocs-node`
  and named `@backstage/plugin-techdocs-node`.
- `packages/catalog-client` which will be part of a future
  `plugins/catalog-common` and named `@backstage/plugin-catalog-common`.
- While the new location of `packages/catalog-model` should be
  `plugins/catalog-common` we might want to do an exception here, as it's a very
  central package.

We will actively migrate optional features of backend plugins into separate
`x-backend-module-<name>` packages, for example the more specialized processors
in the catalog backend.

The limited set of rules might not be sufficient in the future. If additional
packages are required, we will revisit this decision and extend the pattern.

If possible, we will add tools, such as lint rules, to help enforce the package
names and dependencies between them or CLI commands to generate these packages.

The distinction between core packages and plugins helps us to setup
[CODEOWNERS](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners)
in the repository. We can set the code owners for the `packages/` folder to the
core team and create additional rules (like `plugins/x*`) for plugin
maintainers.
