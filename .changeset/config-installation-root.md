---
'@backstage/config-loader': patch
---

When no root directory is given, the default configuration sources now look for configuration files in the Backstage installation rather than at the root of the workspace. The installation is the nearest directory with a `package.json` that has a `workspaces` field, within the workspace. In a Yarn workspace that is the workspace root, so Yarn repositories behave as before. In a pnpm workspace, the field marks a Backstage installation in a subdirectory.
