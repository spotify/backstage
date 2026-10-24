# @backstage/cli-module-package-manager-yarn

## 0.1.5-next.0

### Patch Changes

- 1cffd6f: Made `@yarnpkg/cli`, `@yarnpkg/core`, and `@yarnpkg/plugin-patch` optional peer dependencies. `@yarnpkg/core@4.9.2` was published with a dependency on a patch file that only exists in the Yarn repository, which made installation fail for all projects depending on this module. To use the `pm verify-patches` command until this is fixed upstream, add these packages as `devDependencies` in your root `package.json`, together with the resolution `"@yarnpkg/core/got": "npm:^11.8.6"`. They will become regular dependencies again once a fixed version of `@yarnpkg/core` is published.
- Updated dependencies
  - @backstage/cli-node@0.3.6-next.0

## 0.1.4

### Patch Changes

- Bumped version to account for a patch release.

## 0.1.3

### Patch Changes

- 84cfb88: Added a conservative `--fix` mode to `backstage-cli pm verify-patches` that can
  update project-owned Backstage package patches when an automated release
  upgrade leaves them pinned to older versions. The repair requires Yarn 3 or
  later.
- 673a35d: Fixed `backstage-cli pm verify-patches` failing to load unless projects installed the Yarn CLI package separately.
- Updated dependencies
  - @backstage/cli-node@0.3.5
  - @backstage/release-manifests@0.0.15
  - @backstage/cli-common@0.3.2

## 0.1.3-next.2

### Patch Changes

- 84cfb88: Added a conservative `--fix` mode to `backstage-cli pm verify-patches` that can
  update project-owned Backstage package patches when an automated release
  upgrade leaves them pinned to older versions. The repair requires Yarn 3 or
  later.
- Updated dependencies
  - @backstage/cli-node@0.3.5-next.1

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/release-manifests@0.0.15-next.0

## 0.1.3-next.0

### Patch Changes

- 673a35d: Fixed `backstage-cli pm verify-patches` failing to load unless projects installed the Yarn CLI package separately.
- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/cli-common@0.3.2-next.0

## 0.1.1

### Patch Changes

- de957f6: Added `@backstage/cli-module-package-manager-yarn` with `backstage-cli pm
verify-patches` to validate Yarn patch references, local patch files,
  lockfile consistency, and patched Backstage package versions against the
  selected Backstage release. The command is included in
  `@backstage/cli-defaults`.
- ce2a9c2: The `pm verify-patches` command now reports root-level Yarn resolutions that no longer match any dependency request in the lockfile.
- 064c2de: Updated the Yarn tooling dependencies to versions that avoid known security vulnerabilities.
- Updated dependencies
  - @backstage/cli-common@0.3.1

## 0.1.1-next.1

### Patch Changes

- 064c2de: Updated the Yarn tooling dependencies to versions that avoid known security vulnerabilities.

## 0.1.1-next.0

### Patch Changes

- de957f6: Added `@backstage/cli-module-package-manager-yarn` with `backstage-cli pm
verify-patches` to validate Yarn patch references, local patch files,
  lockfile consistency, and patched Backstage package versions against the
  selected Backstage release. The command is included in
  `@backstage/cli-defaults`.
