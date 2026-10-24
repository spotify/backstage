---
'@backstage/cli-module-lint': patch
'@backstage/cli-module-test-jest': patch
---

When the success cache is enabled but the lockfile can't be read, `repo lint` and `repo test` now warn and run without the cache instead of failing.
