---
'@backstage/cli-module-build': patch
---

Frontend builds no longer fail under the pnpm `isolated` node linker when a default module federation shared dependency is only available through the packages that pnpm hoists for its own use. Such a dependency is now skipped, as when it is not installed, and is shared again once the app declares it. The large dependencies of the initial page load also get one chunk per package under the `isolated` linker, as with the other linkers, rather than a single chunk for all of them.
