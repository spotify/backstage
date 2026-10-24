---
'@backstage/cli-module-test-jest': patch
---

`repo test` now finds the packages of pnpm workspaces, which are declared in `pnpm-workspace.yaml` rather than in the `workspaces` field of the root `package.json`.
