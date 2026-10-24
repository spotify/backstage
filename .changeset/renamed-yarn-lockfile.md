---
'@backstage/cli-node': minor
---

**BREAKING**: The `Lockfile` class is renamed to `YarnLockfile`, since it only reads `yarn.lock` files. Its methods and the `LockfileQueryEntry`, `LockfileDiff`, and `LockfileDiffEntry` types are unchanged, so replacing the class name in imports is enough.
