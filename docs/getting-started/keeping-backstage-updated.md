---
id: keeping-backstage-updated
title: Keeping Backstage Updated
description: How to keep your Backstage App updated
---

Audience: Developers and Admins

:::note
To better understand the concepts in this section, it's recommended to have an understanding of [Monorepos](https://semaphoreci.com/blog/what-is-monorepo), [Semantic Versioning](https://semver.org) and [CHANGELOGs](https://keepachangelog.com).
:::

## Summary

Backstage is always improving, so it's a good idea to stay in sync with the
latest releases. Backstage is more of a library than an application or service;
similar to `create-react-app`, the `@backstage/create-app` tool gives you a
starting point that's meant to be evolved.

## Updating Backstage versions with backstage-cli

The Backstage CLI has a command to bump all `@backstage` packages and
dependencies you're using to the latest versions:
[versions:bump](../tooling/cli/module-migrate.md#versionsbump).

```bash
yarn backstage-cli versions:bump
```

The reason for bumping all `@backstage` packages at once is to maintain the
dependencies that they have between each other.

<a name="plugin"></a>
:::tip

To make the version bump process even easier and more streamlined we highly recommend using the [Backstage yarn plugin](#managing-package-versions-with-the-backstage-yarn-plugin)

:::

By default the bump command will upgrade `@backstage` packages to the latest `main` release line which is released monthly. For those in a hurry that want to track the `next` release line which releases weekly can do so using the `--release next` option.

```bash
yarn backstage-cli versions:bump --release next
```

You can also use the `--release` option to target a specific version. This is useful if you need to pin your app to a specific release or if you need to downgrade to a previous version (e.g. moving from `1.45.0` back to `1.43.0`).

:::warning
Note that downgrading across significant version gaps (e.g. 2-3 releases) may result in package mismatches or errors due to the way Backstage manages dependencies. This method is best suited for small adjustments.
:::

```bash
yarn backstage-cli versions:bump --release 1.43.0
```

If you are using other plugins you can pass in the `--pattern` option to update
more than just the `@backstage/*` dependencies.

```bash
yarn backstage-cli versions:bump --pattern '@{backstage,roadiehq}/*'
```

In a pnpm project, run `pnpm backstage-cli versions:bump` with the same options. The command writes each new version where the dependency is declared: version ranges in your `package.json` files, and `catalog:` references in the default catalog of `pnpm-workspace.yaml`. It then runs `pnpm install`. The Backstage Yarn plugin and its `backstage:^` versions are not available with pnpm. See [Package Managers](../tooling/package-managers.md#version-bumps) for details, including how to bump a named catalog.

To see which versions a bump would move to without changing any files, add `--dry-run`. With `--dry-run --json`, the command prints the resolved versions as JSON, which other tools can use.

## Following create-app template changes

The `@backstage/create-app` command creates the initial structure of your
Backstage installation from a **template**. The source of this template in the
Backstage repository is updated periodically, but your local `app` and `backend`
packages are established at `create-app` time and won't automatically get these
template updates.

For this reason, any changes made to the template are documented along with
upgrade instructions in the
[changelog](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md)
of the `@backstage/create-app` package. We recommend peeking at this changelog
for any applicable updates when upgrading packages. As an alternative, the
[Backstage Upgrade Helper](https://backstage.github.io/upgrade-helper/) provides
a consolidated view of all the changes between two versions of Backstage. You
can find the current version of your Backstage installation in `backstage.json`.

## Applying automated codemods

After package bumps and create-app / Upgrade Helper diffs, run _versioned_
Codemod Registry recipes for that release. For larger work such as Material-UI
to Backstage UI, use a _misc_ recipe when you are ready. Commands and details
are in [Codemods](../tooling/codemods.md).

## Managing package versions with the Backstage yarn plugin

:::note
This section applies to Yarn projects only. The plugin has no pnpm equivalent.
:::

The Backstage yarn plugin makes it easier to manage Backstage package versions,
by determining the appropriate version for each package based on the overall
Backstage version in `backstage.json`. This avoids the need to update every
package.json across your Backstage monorepo, and means that when adding new
`@backstage` dependencies, you don't need to worry about figuring out the right
version to use to match the currently-installed release of Backstage.

### Requirements

In order to use the yarn plugin, you'll need to be using yarn 4.1.1 or greater.

### Installation

To install the yarn plugin, run the following command in your Backstage
monorepo:

```bash
yarn plugin import https://versions.backstage.io/v1/tags/main/yarn-plugin
```

The resulting changes in the file system should be committed to your repo.

:::tip

For best results it's ideal to add the Backstage Yarn plugin when you are about to do a Backstage upgrade as it will make it easier to confirm everything is working.

:::

### Usage

When the yarn plugin is installed, versions for currently-released `@backstage`
packages can be replaced in package.json with the string `"backstage:^"`. This
instructs yarn to resolve the version based on the overall Backstage version in
`backstage.json`.

:::tip

The `backstage.json` is key for the plugin to work, make sure this file is included in your CI/CD pipelines and/or any Container builds.

:::

The `backstage-cli versions:bump` command documented above will detect the
installation of the yarn plugin, and when it's installed, will automatically
migrate dependencies across the monorepo to use it.

## More information on dependency mismatches

Backstage is structured as a monorepo with
[Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). This means
the `app` and `backend` packages, as well as any custom plugins you've added,
are separate packages with their own `package.json` and dependencies.

When a given dependency version is the _same_ between different packages, the
dependency is hoisted to the main `node_modules` folder in the monorepo root to
be shared between packages. When _different_ versions of the same dependency are
encountered, Yarn creates a `node_modules` folder within a particular package.
This can lead to multiple versions of the same package being installed and used
in the same app.

All Backstage core packages are implemented in such as way that package
duplication is **not** a problem. For example, duplicate installations of
packages like `@backstage/core-plugin-api`, `@backstage/core-components`,
`@backstage/plugin-catalog-react`, and `@backstage/backend-plugin-api` are all
acceptable.

While package duplication might be acceptable in many cases, you might want to
deduplicate packages for the purpose of optimizing bundle size and installation
speed. We recommend using deduplication utilities such as `yarn dedupe` to trim
down the number of duplicate packages.

## Proxy

The Backstage CLI respects the standard `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` environment variables when `NODE_USE_ENV_PROXY=1` is set. See the [corporate proxy guide](../tutorials/corporate-proxy.md) for full details.

Additionally, yarn needs a proxy too (sometimes), when in environments with restricted internet access. It uses different settings than the other modules. If you decide to use the backstage yarn plugin [mentioned above](#managing-package-versions-with-the-backstage-yarn-plugin), you will need to set additional proxy values.
If you will always need proxy settings in all environments and situations, you can add `httpProxy` and `httpsProxy` values to [the yarnrc.yml file](https://yarnpkg.com/configuration/yarnrc). If some environments need it (say a developer workstation) but other environments do not (perhaps a CI build server running on AWS), then you may not want to update the yarnrc.yml file but just set environment variables `YARN_HTTP_PROXY` and `YARN_HTTPS_PROXY` in the environments/situations where you need to proxy.

**If you plan to use the backstage yarn plugin, you will need these extra yarn proxy settings to both install the plugin and run the `versions:bump` command**. If you do not plan to use the backstage yarn plugin, it seems like the proxy settings alone are sufficient.

### Example Configuration

```bash
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,internal.company.com
export NODE_USE_ENV_PROXY=1
export YARN_HTTP_PROXY=${HTTP_PROXY}                          # optional
export YARN_HTTPS_PROXY=${HTTPS_PROXY}                        # optional
```

## Rollback migrations

In some cases you could need to downgrade Backstage instance due to some problem or maybe because you are using a test environment to validate the new version of Backstage. You can check the [Manual Rollback using Knex](../tutorials/manual-knex-rollback.md) guide to know how to rollback migrations using Knex.
