---
'@backstage/cli': patch
'@backstage/cli-module-build': patch
'@backstage/cli-module-config': patch
'@backstage/cli-module-github': patch
'@backstage/cli-module-info': patch
'@backstage/cli-module-lint': patch
'@backstage/cli-module-maintenance': patch
'@backstage/cli-module-migrate': patch
'@backstage/cli-module-new': patch
'@backstage/cli-module-test-jest': patch
'@backstage/cli-module-translations': patch
---

Commands now tell the package manager workspace apart from the Backstage installation inside it. The installation is the nearest directory with a `package.json` that has a `workspaces` field, within the workspace. Files that belong to it, such as `app-config.yaml`, `tsconfig.json`, and the root `package.json` that declares CLI modules, templates, and the Jest configuration, are read relative to it, `repo test` and the other `repo` commands work on the packages that it lists, and `backstage-cli new` creates packages there. `backstage.json` is the nearest one from the installation up to the workspace root, so several installations can share one. The lockfile and package manager settings are still read from the workspace root. In a pnpm workspace, which ignores the `workspaces` field, this lets a Backstage installation live in a subdirectory of a larger workspace. In a Yarn workspace the installation is the workspace root, so Yarn repositories behave as before.
