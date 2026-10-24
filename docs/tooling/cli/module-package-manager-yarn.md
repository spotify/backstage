---
id: module-package-manager-yarn
title: Yarn Package Manager Module
description: CLI command for verifying Yarn patch references.
---

The Yarn package manager module (`@backstage/cli-module-package-manager-yarn`)
verifies that Yarn patch
references, local patch files, and `yarn.lock` remain aligned. When a project
patches a Backstage package, it also checks that the package version matches
the Backstage release selected in `backstage.json`.

See [Generating temporary patches](../local-dev/linking-local-packages.md#generating-temporary-patches)
for guidance on creating Yarn patches for locally modified Backstage packages.

The command verifies Yarn's native `patch:` protocol, available in Yarn 2 and
later. It does not inspect patches managed by tools such as `patch-package` in
Yarn Classic repositories. The module is Yarn only, see
[Package Managers](../package-managers.md).

:::caution

The Yarn dependencies of this module (`@yarnpkg/cli`, `@yarnpkg/core`, and
`@yarnpkg/plugin-patch`) are temporarily optional, because
`@yarnpkg/core@4.9.2` was published with a broken dependency on `got` that
makes installation fail. To use `pm verify-patches` until this is fixed
upstream, add the packages and a resolution for the broken dependency to your
root `package.json`:

```json
{
  "devDependencies": {
    "@yarnpkg/cli": "^4.7.0",
    "@yarnpkg/core": "^4.9.1",
    "@yarnpkg/plugin-patch": "^4.0.2"
  },
  "resolutions": {
    "@yarnpkg/core/got": "npm:^11.8.6"
  }
}
```

Remove them again once a fixed `@yarnpkg/core` is published and this module
depends on it directly.

:::

## pm verify-patches

Run this command from the root of a Yarn repository:

```shell
yarn backstage-cli pm verify-patches
```

The command scans the root and workspace `package.json` files for `patch:`
references in `resolutions`, `dependencies`, `devDependencies`,
`optionalDependencies`, and `peerDependencies`. It reports all of the
following problems together before exiting unsuccessfully:

- Missing or orphaned local patch files.
- Patch references that do not agree with `yarn.lock`.
- Patched `@backstage/*` packages that are missing from, or do not match, the
  selected Backstage release.

By default, the command is read-only: it does not run Yarn, install
dependencies, or write project files. Use it alongside `yarn install
--immutable`; immutable installs protect the resolved dependency state, while
this command verifies that patch declarations and the selected Backstage
release remain aligned.

If a release upgrade leaves project-owned Backstage patches pinned to old
package versions, use `--fix` to attempt a conservative repair:

```shell
yarn backstage-cli pm verify-patches --fix
```

The fix is limited to exact-version `@backstage/*` patches in the root
`resolutions`. The command updates all eligible outdated patches to the
versions in the selected Backstage release and runs one lockfile-only Yarn
install. It never downgrades a patched package. Afterward it runs the normal
verification over the result. Dependency build scripts are disabled during
the install, which uses the repository's configured Yarn binary, plugins, and
registry settings. The `--fix` mode requires Yarn 3 or later.

The repair operates directly in the working checkout. If the install or final
verification fails, it restores `package.json` and `yarn.lock`. Run it in a
clean, exclusive checkout; an abrupt interruption can leave a partial change
behind. If a declaration is ambiguous or a patch no longer applies cleanly,
the command exits with the original verification failure for manual repair.

An automated Backstage version bump can run these commands in order:

```shell
yarn backstage-cli versions:bump
yarn backstage-cli pm verify-patches --fix
```

For offline or mirrored environments, set `BACKSTAGE_MANIFEST_FILE` to a local
release manifest or `BACKSTAGE_VERSIONS_BASE_URL` to the base URL from which
release manifests are fetched.
