---
'@backstage/cli-node': patch
---

`PackageGraph.listChangedPackages` with `analyzeLockfile` now treats every package as changed when the changed lockfile can't be compared with the one at the given ref. This includes a changed lockfile of another package manager, such as a `pnpm-lock.yaml` in a Yarn workspace, which was previously ignored. The `--since` option of `repo build`, `repo test`, and `repo lint` uses this.
