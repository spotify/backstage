---
'@backstage/cli-node': patch
---

Added an experimental package manager API in the new `@backstage/cli-node/alpha` entry point. `detectPackageManager()` returns the `PackageManager` of a workspace, which installs dependencies, runs scripts, packs packages, fetches package information, and reads the lockfile. Yarn and pnpm are supported, and pnpm requires version 11.28 or a later 11.x release, or 12.7 or later. The pnpm version is checked the first time pnpm runs, so detecting the package manager and reading the lockfile work where pnpm is not installed. The package manager is picked from the `packageManager` or `devEngines.packageManager` field of the root `package.json`, then from the lockfile, then from `pnpm-workspace.yaml` or the `workspaces` field. The API may change in any release while it is experimental.
