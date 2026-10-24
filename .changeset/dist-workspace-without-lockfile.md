---
'@backstage/cli-module-build': patch
---

`package build` for backends and `build-workspace` no longer fail when the workspace root has no lockfile. They warn, and the dist workspace is created without one.
