---
'@backstage/cli-module-build': patch
---

`package bundle` now supports pnpm projects. The bundle gets its own `pnpm-workspace.yaml` with `nodeLinker: hoisted`, the `overrides` of the project, and the settings that decide where pnpm caches packages and what the lockfile resolves to, including patch files. The seeded `pnpm-lock.yaml` is pruned and installed offline. When the pnpm cache lacks a package, the command fails and names the package and the settings that decide where pnpm looks for it.
