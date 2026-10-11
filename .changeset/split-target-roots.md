---
'@backstage/cli-common': patch
---

`targetPaths` now distinguishes two roots. `workspaceRootDir` is the root of the package manager workspace, found through a `workspaces` field in `package.json` or, new in this release, a `pnpm-workspace.yaml` file. Inside a pnpm workspace, a `workspaces` field only starts a separate workspace for a Yarn project with its own `yarn.lock` or `.yarnrc.yml` file. `installationRootDir` is the root of the Backstage installation, which is the nearest directory with a `package.json` that has a `workspaces` field within the workspace. In a Yarn workspace this is the workspace root. pnpm ignores the field, so in a pnpm workspace it marks a Backstage installation in a subdirectory, and without one the installation root is the workspace root. `backstageJsonPath` is the nearest `backstage.json` file from the installation root up to the workspace root, so several installations can share one. `resolveWorkspaceRoot` and `resolveInstallationRoot` resolve paths relative to each root.

`rootDir` and `resolveRoot` are deprecated. They keep returning the workspace root, so switch to whichever of the two roots you need. `overrideTargetPaths` accepts `workspaceRootDir`, `installationRootDir`, and `backstageJsonPath` options.
