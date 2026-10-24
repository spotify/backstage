---
'@backstage/backend-dynamic-feature-service': patch
---

The dynamic plugins root directory is now resolved relative to the Backstage installation, while modules shared with the backend are still resolved from the root of the workspace. The installation is the nearest directory with a `package.json` that has a `workspaces` field, within the workspace. In a Yarn workspace that is the workspace root, so Yarn repositories behave as before. In a pnpm workspace, the field marks a Backstage installation in a subdirectory.
