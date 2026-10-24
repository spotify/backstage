---
'@backstage/cli-module-info': patch
---

`info` now reports the package manager of the project, both in the text output and in a new `packageManager` field of the JSON output. The `yarn` field is still included for Yarn projects. When the lockfile can't be read, `info` warns and leaves out the installed packages instead of failing.
