---
'@backstage/cli-module-build': patch
---

In pnpm projects, the dist workspace that `build-workspace` and backend package builds create now has what `pnpm install --frozen-lockfile` needs: `pnpm-workspace.yaml`, the patch files and the pnpmfile that the install reads, and a `pnpm-lock.yaml` without the dependencies of bundled packages such as the app. Packages that are repacked keep their `workspace:` and `catalog:` dependency ranges, so that workspace packages are linked rather than looked up in the registry. The backend `skeleton.tar.gz` also contains these files. A pnpmfile that loads other local files fails the build with an error that names them, since only the pnpmfile itself is copied.
