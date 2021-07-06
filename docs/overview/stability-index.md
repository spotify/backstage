---
id: stability-index
title: Stability Index
# prettier-ignore
description: An overview of the commitment to stability for different parts of the Backstage codebase.
---

## Overview

The purpose of the Backstage Stability Index is to communicate the stability of
various parts of the project. It is tracked using a scoring system where a
higher score indicates a higher level of stability and is a commitment to
smoother transitions between breaking changes. Importantly, the Stability Index
does not supersede [semver](https://semver.org/), meaning we will still adhere
to semver and only do breaking changes in minor releases as long as we are on
`0.x`.

Each package or section is assigned a stability score between 0 and 3, with each
point building on top of the previous one:

- **0** - Breaking changes are noted in the changelog, and documentation is
  updated.
- **1** - The changelog entry includes a clearly documented upgrade path,
  providing guidance for how to migrate previous usage patterns to the new
  version.
- **2** - Breaking changes always include a deprecation phase where both the old
  and the new APIs can be used in parallel. This deprecation must have been
  released for at least two weeks before the deprecated API is removed in a
  minor version bump.
- **3** - The time limit for the deprecation is 3 months instead of two weeks.

TL;DR:

- **0** - There's a changelog entry.
- **1** - There's a migration guide.
- **2** - 2 weeks of deprecation.
- **3** - 3 months of deprecation.

## Packages

### `example-app` [GitHub](https://github.com/backstage/backstage/tree/master/packages/app/)

This is the `packages/app` package, and it serves as an example as well as
utility for local development in the main Backstage repo.

Stability: `N/A`

### `example-backend` [GitHub](https://github.com/backstage/backstage/tree/master/packages/backend/)

This is the `packages/backend` package, and it serves as an example as well as
utility for local development in the main Backstage repo.

Stability: `N/A`

### `backend-common` [GitHub](https://github.com/backstage/backstage/tree/master/packages/backend-common/)

A collection of common helpers to be used by both backend plugins, and for
constructing backend packages.

Stability: `1`

### `catalog-client` [GitHub](https://github.com/backstage/backstage/tree/master/packages/catalog-client/)

An HTTP client for interacting with the catalog backend. Usable both in frontend
and Backend.

Stability: `0`. This is a very new addition and we have some immediate changes
planned.

### `catalog-model` [GitHub](https://github.com/backstage/backstage/tree/master/packages/catalog-model/)

Contains the core catalog model, and utilities for working with entities. Usable
both in frontend and Backend.

Stability: `2`. The catalog model is evolving, but because of the broad usage we

want to ensure some stability.

### `cli` [GitHub](https://github.com/backstage/backstage/tree/master/packages/cli/)

The main toolchain used for Backstage development. The various CLI commands and
options passed to those commands, as well as the environment variables read by
the CLI, are considered to be the interface that the stability index refers to.
The build output may change over time and is not considered a breaking change
unless it is likely to affect external tooling.

Stability: `2`

### `cli-common` [GitHub](https://github.com/backstage/backstage/tree/master/packages/cli-common/)

Lightweight utilities used by the various Backstage CLIs, not intended for
external use.

Stability: `N/A`

### `config` [GitHub](https://github.com/backstage/backstage/tree/master/packages/config/)

Provides the logic and interfaces for reading static configuration.

Stability: `2`

### `config-loader` [GitHub](https://github.com/backstage/backstage/tree/master/packages/config-loader/)

Used to load in static configuration, mainly for use by the CLI and
@backstage/backend-common.

Stability: `1`. Mainly intended for internal use.

### `core-app-api` [GitHub](https://github.com/backstage/backstage/tree/master/packages/core-app-api/)

The APIs used exclusively in the app, such as `createApp` and the system icons.

Stability: `2`.

### `core-components` [GitHub](https://github.com/backstage/backstage/tree/master/packages/core-components/)

A collection of React components for use in Backstage plugins and apps.
Previously exported by `@backstage/core`.

Stability: `1`. These components have not received a proper review of the API,
but we also want to ensure stability.

### `core-plugin-api` [GitHub](https://github.com/backstage/backstage/tree/master/packages/core-plugin-api/)

The core API used to build Backstage plugins and apps.

Stability: `2`.

### `cost-insights` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/cost-insights)

A frontend plugin that allows users to visualize, understand and optimize your
team's cloud costs.

Stability: `1`

### `create-app` [GitHub](https://github.com/backstage/backstage/tree/master/packages/create-app/)

The CLI used to scaffold new Backstage projects.

Stability: `2`

### `dev-utils` [GitHub](https://github.com/backstage/backstage/tree/master/packages/dev-utils/)

Provides utilities for developing plugins in isolation.

Stability: `0`. This package is largely broken and needs updates.

### `docgen` [GitHub](https://github.com/backstage/backstage/tree/master/packages/docgen/)

Internal CLI utility for generating API Documentation.

Stability: `N/A`

### `e2e-test` [GitHub](https://github.com/backstage/backstage/tree/master/packages/e2e-test/)

Internal CLI utility for running e2e tests.

Stability: `N/A`

### `integration` [GitHub](https://github.com/backstage/backstage/tree/master/packages/integration/)

Provides shared utilities for managing integrations towards different types of
third party systems. This package is currently internal and its functionality
will likely be exposed via separate APIs in the future.

Some of the functionality in this package is not available elsewhere yes, so if
it's necessary it can be used, but there will be breaking changes.

Stability: `0`

### `storybook` [GitHub](https://github.com/backstage/backstage/tree/master/packages/storybook/)

Internal storybook build for publishing stories to
https://backstage.io/storybook

Stability: `N/A`

### `test-utils` [GitHub](https://github.com/backstage/backstage/tree/master/packages/test-utils/)

Utilities for writing tests for Backstage plugins and apps.

Stability: `2`

### `test-utils-core` [GitHub](https://github.com/backstage/backstage/tree/master/packages/test-utils-core/)

Internal testing utilities that are separated out for usage in
@backstage/core-app-api and @backstage/core-plugin-api. All exports are
re-exported by @backstage/test-utils. This package should not be depended on
directly.

Stability: See @backstage/test-utils

### `theme` [GitHub](https://github.com/backstage/backstage/tree/master/packages/theme/)

The core Backstage MUI theme along with customization utilities.

#### Section: TypeScript

This is the TypeScript API exported by the theme package.

Stability: `2`

#### Section: Visual Theme

The visual theme exported by the theme packages, where for example changing a
color could be considered a breaking change.

Stability: `1`

## Plugins

Many backend plugins are split into "REST API" and "TypeScript Interface"
sections. The "TypeScript Interface" refers to the API used to integrate the
plugin into the backend.

Any plugin that is not listed below is untracked and can generally be considered
unstable with a score of `0`. Open a Pull Request if you want your plugin to be
added!

### `api-docs` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/api-docs/)

Components to discover and display API entities as an extension to the catalog
plugin.

Stability: `0`

### `app-backend` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/app-backend/)

A backend plugin that can be used to serve the frontend app and inject
configuration.

Stability: `2`

### `auth-backend` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/auth-backend/)

A backend plugin that implements the backend portion of the various
authentication flows used in Backstage.

#### Section: REST API

Stability: `2`

#### Section: TypeScript Interface

Stability: `1`

### `catalog` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/catalog/)

The frontend plugin for the catalog, with the table and building blocks for the
entity pages.

Stability: `1`. We're planning some work to overhaul how entity pages are
constructed.

### `catalog-backend` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend/)

The backend API for the catalog, also exposes the processing subsystem for
customization of the catalog. Powers the @backstage/plugin-catalog frontend
plugin.

#### Section: REST API

Stability: `1`. There are plans to remove and rework some endpoints.

#### Section: TypeScript Interface

Stability: `1`. There are plans to rework parts of the Processor interface.

### `catalog-graphql` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/catalog-graphql/)

Provides the catalog schema and resolvers for the GraphQL backend.

Stability: `0`. Under heavy development and subject to change.

### `explore` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/explore/)

A frontend plugin that introduces the concept of exploring internal and external
tooling in an organization.

Stability: `0`. Only an example at the moment and not customizable.

### `graphiql` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/graphiql/)

Integrates GraphiQL as a tool to browse GraphQL API endpoints inside Backstage.

Stability: `1`

### `graphql` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/graphql/)

A backend plugin that provides

Stability: `0`. Under heavy development and subject to change.

### `kubernetes` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/kubernetes/)

The frontend component of the Kubernetes plugin, used to browse and visualize
Kubernetes resources.

Stability: `1`.

### `kubernetes-backend` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/kubernetes-backend/)

The backend component of the Kubernetes plugin, used to fetch Kubernetes
resources from clusters and associate them with entities in the Catalog.

Stability: `1`.

### `proxy-backend` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/proxy-backend/)

A backend plugin used to set up proxying to other endpoints based on static
configuration.

Stability: `1`

### `register-component` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/register-component/)

A frontend plugin that allows the user to register entity locations in the
catalog.

Stability: `0`. This plugin is likely to be replaced by a generic entity import
plugin instead.

### `scaffolder` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/scaffolder/)

The frontend scaffolder plugin where one can browse templates and initiate
scaffolding jobs.

Stability: `1`

### `scaffolder-backend` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend/)

The backend scaffolder plugin that provides an implementation for templates in
the catalog.

Stability: `1`. There is planned work to rework the scaffolder in
https://github.com/backstage/backstage/issues/2771.

### `tech-radar` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/tech-radar/)

Visualize your company's official guidelines of different areas of software
development.

Stability: `0`

### `techdocs` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/techdocs/)

The frontend component of the TechDocs plugin, used to browse technical
documentation of entities.

Stability: `1`

### `techdocs-backend` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/techdocs-backend/)

The backend component of the TechDocs plugin, used to transform and serve
TechDocs.

Stability: `0`

### `user-settings` [GitHub](https://github.com/backstage/backstage/tree/master/plugins/user-settings/)

A frontend plugin that provides a page where the user can tweak various
settings.

Stability: `1`
