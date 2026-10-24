---
'@backstage/cli-node': patch
---

`isMonoRepo` now also recognizes pnpm workspaces, which declare their packages in `pnpm-workspace.yaml` rather than in a `workspaces` field.
