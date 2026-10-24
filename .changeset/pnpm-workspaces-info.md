---
'@backstage/cli-module-info': patch
---

`info` now lists local Backstage packages that are not linked into the root `node_modules`, which is common in pnpm workspaces.
