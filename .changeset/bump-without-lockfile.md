---
'@backstage/cli-module-migrate': patch
---

`versions:bump` no longer fails when the lockfile can't be read, for example when a build system manages the installs. It warns and skips the report of possibly breaking updates instead.
