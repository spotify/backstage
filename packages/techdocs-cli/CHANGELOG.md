# @techdocs/cli

## 1.14.0-next.0

### Minor Changes

- a4604d2: Add Zensical support to `serve`, `serve:raw` and `generate` via `--engine zensical` (or the `backstage.io/techdocs-engine` annotation in `catalog-info.yaml`), including live reload in the preview app. The default `--docker-image` is now chosen per engine instead of always being `spotify/techdocs`, and matches the image the TechDocs backend uses for that engine, so MkDocs previews now use `spotify/techdocs:v1.2.8` instead of `latest`. Passing `--docker-image` explicitly behaves as before.

  The `serve` flags `--mkdocs-port`, `--mkdocs-config-file-name` and `--mkdocs-parameter-*` are deprecated in favor of `--engine-port`, `--config-file-name` and `--parameter-*`. If both the old and new flag are given, the new one wins and the warning says the old one is ignored.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@2.2.0-next.0
  - @backstage/backend-defaults@0.18.2-next.0

## 1.13.0

### Minor Changes

- 4d4f987: Add engine abstraction layer for multi-engine TechDocs support. Introduces `--engine` flag, engine config map, generator registry with `backstage.io/techdocs-engine` annotation support, `engine` field in `techdocs_metadata.json`, `serve:raw` command, and live-reload adapter interface. MkDocs remains the default with no behavior change.

  The built-in generator is now registered under `mkdocs`; the previous `techdocs` key is kept as an alias, so existing `generators.register('techdocs', ...)` calls continue to work. The CLI's `--engine` flag takes precedence over the `backstage.io/techdocs-engine` annotation for all commands, and `serve:mkdocs` and the `--mkdocs-parameter-*` flags now print deprecation warnings.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@2.1.0
  - @backstage/backend-defaults@0.18.1
  - @backstage/config@1.3.10
  - @backstage/catalog-model@1.10.2
  - @backstage/cli-common@0.3.2

## 1.12.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-defaults@0.18.1-next.0
  - @backstage/plugin-techdocs-node@2.0.1-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/cli-common@0.3.2-next.0

## 1.12.0

### Minor Changes

- 57205a0: Added a `--dangerouslyAllowAdditionalKeys` option to `techdocs-cli generate`
- c4976e0: The `generate` command now automatically computes a sha256 content hash of the generated site output and stores it as the etag in `techdocs_metadata.json` when no `--etag` value is explicitly provided.

  Added `--skip-if-unchanged` flag to `publish` that compares the local etag against the remote etag before uploading. When they match, the publish step is skipped entirely. This avoids redundant uploads in CI pipelines when docs haven't changed between builds.

### Patch Changes

- de92fae: Fixed an issue where `techdocs-cli serve` would silently stop detecting documentation changes and no longer refresh the browser when the Python environment (TechDocs container image or local) contains `click` 8.3.x. The CLI now explicitly enables MkDocs live reload when serving.
- 4441911: Improved MkDocs configuration file handling.
- Updated dependencies
  - @backstage/backend-defaults@0.18.0
  - @backstage/catalog-model@1.10.1
  - @backstage/cli-common@0.3.1
  - @backstage/plugin-techdocs-node@2.0.0
  - @backstage/config@1.3.9

## 1.11.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.16.0-next.1
  - @backstage/config@1.3.9-next.0
  - @backstage/backend-defaults@0.17.9-next.1

## 1.11.5-next.1

### Patch Changes

- 4441911: Improved MkDocs configuration file handling.
- Updated dependencies
  - @backstage/backend-defaults@0.17.9-next.0
  - @backstage/plugin-techdocs-node@1.16.0-next.0

## 1.11.4-next.0

### Patch Changes

- de92fae: Fixed an issue where `techdocs-cli serve` would silently stop detecting documentation changes and no longer refresh the browser when the Python environment (TechDocs container image or local) contains `click` 8.3.x. The CLI now explicitly enables MkDocs live reload when serving.

## 1.11.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-defaults@0.17.7
  - @backstage/plugin-techdocs-node@1.15.3

## 1.11.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.6-next.0
  - @backstage/plugin-techdocs-node@1.15.3-next.0

## 1.11.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.5
  - @backstage/plugin-techdocs-node@1.15.2
  - @backstage/cli-common@0.3.0

## 1.11.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.3.0-next.0
  - @backstage/backend-defaults@0.17.5-next.2

## 1.11.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.4-next.0
  - @backstage/plugin-techdocs-node@1.15.2-next.0

## 1.11.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.3
  - @backstage/plugin-techdocs-node@1.15.1

## 1.11.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.2-next.0
  - @backstage/plugin-techdocs-node@1.15.1-next.0

## 1.11.0

### Minor Changes

- 329f592: Add support for disabling external font downloads via techdocs-cli `techdocs-cli generate --disableExternalFonts`, useful for air-gapped Backstage instances.

### Patch Changes

- 0c5e41f: Removed unused dependencies that had no imports in source code.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/backend-defaults@0.17.1
  - @backstage/plugin-techdocs-node@1.15.0
  - @backstage/cli-common@0.2.2
  - @backstage/config@1.3.8

## 1.11.0-next.1

### Minor Changes

- 329f592: Add support for disabling external font downloads via techdocs-cli `techdocs-cli generate --disableExternalFonts`, useful for air-gapped Backstage instances.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.15.0-next.1

## 1.10.8-next.0

### Patch Changes

- 0c5e41f: Removed unused dependencies that had no imports in source code.
- Updated dependencies
  - @backstage/backend-defaults@0.17.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/cli-common@0.2.2-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-techdocs-node@1.14.6-next.0

## 1.10.7

### Patch Changes

- 980b7f5: Updated proxy documentation to recommend Node.js built-in proxy support via `NODE_USE_ENV_PROXY` instead of `global-agent`.
- Updated dependencies
  - @backstage/backend-defaults@0.17.0
  - @backstage/catalog-model@1.8.0
  - @backstage/cli-common@0.2.1
  - @backstage/plugin-techdocs-node@1.14.5
  - @backstage/config@1.3.7

## 1.10.7-next.1

### Patch Changes

- 980b7f5: Updated proxy documentation to recommend Node.js built-in proxy support via `NODE_USE_ENV_PROXY` instead of `global-agent`.
- Updated dependencies
  - @backstage/backend-defaults@0.16.1-next.2
  - @backstage/cli-common@0.2.1-next.1
  - @backstage/plugin-techdocs-node@1.14.5-next.2
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0

## 1.10.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.1-next.0
  - @backstage/backend-defaults@0.16.1-next.0
  - @backstage/plugin-techdocs-node@1.14.5-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6

## 1.10.6

### Patch Changes

- 70fc178: Migrated from deprecated `findPaths` to `targetPaths` and `findOwnPaths` from `@backstage/cli-common`.
- de62a9d: Upgraded `commander` dependency from `^12.0.0` to `^14.0.3` across all CLI packages.
- Updated dependencies
  - @backstage/backend-defaults@0.16.0
  - @backstage/cli-common@0.2.0
  - @backstage/plugin-techdocs-node@1.14.4
  - @backstage/catalog-model@1.7.7

## 1.10.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.0-next.1
  - @backstage/plugin-techdocs-node@1.14.3-next.1
  - @backstage/backend-defaults@0.16.0-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6

## 1.10.6-next.0

### Patch Changes

- 70fc178: Migrated from deprecated `findPaths` to `targetPaths` and `findOwnPaths` from `@backstage/cli-common`.
- de62a9d: Upgraded `commander` dependency from `^12.0.0` to `^14.0.3` across all CLI packages.
- Updated dependencies
  - @backstage/cli-common@0.2.0-next.0
  - @backstage/backend-defaults@0.15.3-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/plugin-techdocs-node@1.14.3-next.0

## 1.10.5

### Patch Changes

- 7455dae: Use node prefix on native imports
- 27798df: Migrate the Techdocs CLI embedded app to the New Frontend System (NFS)
- 508d127: Updated dependency `find-process` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-defaults@0.15.2
  - @backstage/plugin-techdocs-node@1.14.2
  - @backstage/cli-common@0.1.18

## 1.10.5-next.1

### Patch Changes

- 508d127: Updated dependency `find-process` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-defaults@0.15.2-next.1
  - @backstage/plugin-techdocs-node@1.14.2-next.1

## 1.10.5-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/backend-defaults@0.15.1-next.0
  - @backstage/plugin-techdocs-node@1.14.1-next.0
  - @backstage/cli-common@0.1.18-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6

## 1.10.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.15.0
  - @backstage/cli-common@0.1.17
  - @backstage/plugin-techdocs-node@1.14.0

## 1.10.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.15.0-next.2

## 1.10.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.1-next.1
  - @backstage/plugin-techdocs-node@1.13.11-next.0

## 1.10.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/cli-common@0.1.16
  - @backstage/config@1.3.6
  - @backstage/plugin-techdocs-node@1.13.10

## 1.10.3

### Patch Changes

- 43629b1: Updated to use new utilities from `@backstage/cli-common`.
- 2bae83a: Bumped dev dependencies `@types/node`
- Updated dependencies
  - @backstage/backend-defaults@0.14.0
  - @backstage/plugin-techdocs-node@1.13.10
  - @backstage/cli-common@0.1.16

## 1.10.3-next.2

### Patch Changes

- 2bae83a: Bumped dev dependencies `@types/node`
- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.1
  - @backstage/plugin-techdocs-node@1.13.10-next.1
  - @backstage/cli-common@0.1.16-next.2
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6

## 1.10.3-next.1

### Patch Changes

- 43629b1: Updated to use new utilities from `@backstage/cli-common`.
- Updated dependencies
  - @backstage/cli-common@0.1.16-next.1

## 1.10.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.0
  - @backstage/cli-common@0.1.16-next.0
  - @backstage/plugin-techdocs-node@1.13.10-next.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6

## 1.10.2

### Patch Changes

- c2a2017: Fix for missing styles due to move to BUI.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-techdocs-node@1.13.9
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6

## 1.10.1-next.0

### Patch Changes

- c2a2017: Fix for missing styles due to move to BUI.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1-next.0
  - @backstage/plugin-techdocs-node@1.13.9-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/cli-common@0.1.15

## 1.10.0

### Minor Changes

- 43afbe5: Techdocs CLI serve supports automatic refresh, relying on `mkdocs` `watch` feature.

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0
  - @backstage/config@1.3.5
  - @backstage/plugin-techdocs-node@1.13.8

## 1.9.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/backend-defaults@0.13.0-next.1
  - @backstage/plugin-techdocs-node@1.13.8-next.1

## 1.9.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0-next.0
  - @backstage/plugin-techdocs-node@1.13.8-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.3

## 1.9.8

### Patch Changes

- db63208: Fixed an issue where `@techdocs/cli serve` command did not pick up the latest changes to TechDocs.
- Updated dependencies
  - @backstage/backend-defaults@0.12.1
  - @backstage/plugin-techdocs-node@1.13.7

## 1.9.8-next.0

### Patch Changes

- db63208: Fixed an issue where `@techdocs/cli serve` command did not pick up the latest changes to TechDocs.
- Updated dependencies
  - @backstage/backend-defaults@0.12.1-next.0
  - @backstage/plugin-techdocs-node@1.13.7-next.0

## 1.9.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-techdocs-node@1.13.6

## 1.9.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.2-next.0
  - @backstage/plugin-techdocs-node@1.13.6-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.3

## 1.9.5

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/catalog-model@1.7.5
  - @backstage/backend-defaults@0.11.1
  - @backstage/plugin-techdocs-node@1.13.5

## 1.9.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/backend-defaults@0.11.1-next.1
  - @backstage/plugin-techdocs-node@1.13.5-next.1

## 1.9.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.1-next.0
  - @backstage/plugin-techdocs-node@1.13.5-next.0
  - @backstage/catalog-model@1.7.4
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2

## 1.9.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.0
  - @backstage/catalog-model@1.7.4
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/plugin-techdocs-node@1.13.4

## 1.9.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.0-next.2
  - @backstage/catalog-model@1.7.4
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/plugin-techdocs-node@1.13.4-next.1

## 1.9.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.1-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/plugin-techdocs-node@1.13.4-next.1

## 1.9.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.1-next.0
  - @backstage/plugin-techdocs-node@1.13.4-next.0

## 1.9.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-techdocs-node@1.13.3
  - @backstage/config@1.3.2
  - @backstage/cli-common@0.1.15

## 1.9.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.3
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/plugin-techdocs-node@1.13.3-next.3

## 1.9.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.2
  - @backstage/config@1.3.2
  - @backstage/plugin-techdocs-node@1.13.3-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15

## 1.9.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-techdocs-node@1.13.3-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2

## 1.9.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.1-next.0
  - @backstage/plugin-techdocs-node@1.13.3-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2

## 1.9.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.0
  - @backstage/plugin-techdocs-node@1.13.2
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2

## 1.9.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.0-next.2
  - @backstage/plugin-techdocs-node@1.13.2-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2

## 1.9.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.0-next.1
  - @backstage/plugin-techdocs-node@1.13.2-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2

## 1.9.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.0-next.0
  - @backstage/plugin-techdocs-node@1.13.2-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2

## 1.9.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.2
  - @backstage/plugin-techdocs-node@1.13.1
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2

## 1.9.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.2-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/plugin-techdocs-node@1.13.1-next.2

## 1.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.2-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/plugin-techdocs-node@1.13.1-next.1

## 1.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.2-next.0
  - @backstage/plugin-techdocs-node@1.13.1-next.0

## 1.9.0

### Minor Changes

- 8de3d2d: Allow configurable optional retries for publisher AWS S3 operations.

### Patch Changes

- 69f84ac: Internal update to work with dynamic imports.
- Updated dependencies
  - @backstage/backend-defaults@0.8.0
  - @backstage/plugin-techdocs-node@1.13.0
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2

## 1.9.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.0-next.3
  - @backstage/plugin-techdocs-node@1.13.0-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2

## 1.9.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.0-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/plugin-techdocs-node@1.13.0-next.1

## 1.9.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.0-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/plugin-techdocs-node@1.13.0-next.0

## 1.9.0-next.0

### Minor Changes

- 8de3d2d: Allow configurable optional retries for publisher AWS S3 operations.

### Patch Changes

- 69f84ac: Internal update to work with dynamic imports.
- Updated dependencies
  - @backstage/backend-defaults@0.8.0-next.0
  - @backstage/plugin-techdocs-node@1.13.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2

## 1.8.25

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.7.0
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/plugin-techdocs-node@1.12.16

## 1.8.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.7.0-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/plugin-techdocs-node@1.12.16-next.1
  - @backstage/cli-common@0.1.15

## 1.8.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.7.0-next.0
  - @backstage/catalog-model@1.7.2
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1
  - @backstage/plugin-techdocs-node@1.12.16-next.0

## 1.8.24

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.6.0
  - @backstage/plugin-techdocs-node@1.12.15
  - @backstage/catalog-model@1.7.2
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1

## 1.8.24-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.6.0-next.2
  - @backstage/plugin-techdocs-node@1.12.15-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1-next.0

## 1.8.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.6.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.0
  - @backstage/plugin-techdocs-node@1.12.15-next.1

## 1.8.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.6.0-next.0
  - @backstage/plugin-techdocs-node@1.12.15-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.0

## 1.8.22

### Patch Changes

- 702f41d: Bumped dev dependencies `@types/node`
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/backend-defaults@0.5.3
  - @backstage/cli-common@0.1.15
  - @backstage/catalog-model@1.7.1
  - @backstage/plugin-techdocs-node@1.12.13

## 1.8.22-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.3-next.3
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-techdocs-node@1.12.13-next.3

## 1.8.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.3-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-techdocs-node@1.12.13-next.2

## 1.8.22-next.1

### Patch Changes

- 702f41d: Bumped dev dependencies `@types/node`
- Updated dependencies
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/backend-defaults@0.5.3-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-techdocs-node@1.12.13-next.1

## 1.8.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.3-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/plugin-techdocs-node@1.12.13-next.0

## 1.8.20

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1
  - @backstage/plugin-techdocs-node@1.12.12
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## 1.8.20-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-techdocs-node@1.12.12-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## 1.8.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/plugin-techdocs-node@1.12.12-next.1

## 1.8.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/plugin-techdocs-node@1.12.12-next.0

## 1.8.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.0
  - @backstage/plugin-techdocs-node@1.12.11
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## 1.8.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.0-next.2
  - @backstage/plugin-techdocs-node@1.12.11-next.2
  - @backstage/catalog-model@1.6.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## 1.8.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/plugin-techdocs-node@1.12.11-next.1

## 1.8.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.12.11-next.0
  - @backstage/backend-defaults@0.5.0-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## 1.8.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.4.2
  - @backstage/plugin-techdocs-node@1.12.9
  - @backstage/catalog-model@1.6.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## 1.8.17-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.4.2-next.3
  - @backstage/plugin-techdocs-node@1.12.9-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## 1.8.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.4.2-next.2
  - @backstage/plugin-techdocs-node@1.12.9-next.2
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## 1.8.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.12.9-next.1
  - @backstage/backend-defaults@0.4.2-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## 1.8.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.4.2-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/plugin-techdocs-node@1.12.9-next.0

## 1.8.16

### Patch Changes

- c964a3d: Import discovery from backend-defaults instead of backend-common
- Updated dependencies
  - @backstage/backend-defaults@0.4.0
  - @backstage/plugin-techdocs-node@1.12.8
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## 1.8.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.12.8-next.1
  - @backstage/backend-defaults@0.3.4-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## 1.8.15-next.0

### Patch Changes

- c964a3d: Import discovery from backend-defaults instead of backend-common
- Updated dependencies
  - @backstage/backend-defaults@0.3.3-next.0
  - @backstage/plugin-techdocs-node@1.12.7-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## 1.8.12

### Patch Changes

- 2110d76: Removed `dockerode` dependency.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/plugin-techdocs-node@1.12.5
  - @backstage/cli-common@0.1.14
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 1.8.12-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.12.5-next.3
  - @backstage/cli-common@0.1.14-next.0
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 1.8.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.12.5-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0

## 1.8.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-techdocs-node@1.12.5-next.1

## 1.8.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-techdocs-node@1.12.5-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0

## 1.8.11

### Patch Changes

- 1a0e009: Fix cookie endpoint mock for `serve`
- Updated dependencies
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/plugin-techdocs-node@1.12.4

## 1.8.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-techdocs-node@1.12.4-next.1

## 1.8.10-next.0

### Patch Changes

- 1a0e009: Fix cookie endpoint mock for `serve`
- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/plugin-techdocs-node@1.12.4-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0

## 1.8.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/plugin-techdocs-node@1.12.3
  - @backstage/catalog-model@1.4.5
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0

## 1.8.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/plugin-techdocs-node@1.12.3-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0

## 1.8.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.12.3-next.0
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/catalog-model@1.4.5
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0

## 1.8.8

### Patch Changes

- 8caf2f7: Fix how the cli server mocks the new auth cookie endpoint.
- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/plugin-techdocs-node@1.12.2
  - @backstage/catalog-model@1.4.5
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0

## 1.8.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-techdocs-node@1.12.1
  - @backstage/catalog-model@1.4.5
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0

## 1.8.6

### Patch Changes

- 1bd4596: Removed the `ts-node` dev dependency.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/config@1.2.0
  - @backstage/plugin-techdocs-node@1.12.0
  - @backstage/catalog-model@1.4.5
  - @backstage/cli-common@0.1.13

## 1.8.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.12.0-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0-next.1

## 1.8.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/plugin-techdocs-node@1.11.6-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/cli-common@0.1.13

## 1.8.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-techdocs-node@1.11.5-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/cli-common@0.1.13

## 1.8.2

### Patch Changes

- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- d2e3ab9: Updated dependency `dockerode` to `^4.0.0`.
- 6ba64c4: Updated dependency `commander` to `^12.0.0`.
- d8d243c: fix: mkdocs parameter casing
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/catalog-model@1.4.4
  - @backstage/plugin-techdocs-node@1.11.2
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## 1.8.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/plugin-techdocs-node@1.11.2-next.3
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## 1.8.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/plugin-techdocs-node@1.11.2-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/cli-common@0.1.13

## 1.8.2-next.1

### Patch Changes

- d8d243c: fix: mkdocs parameter casing
- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/plugin-techdocs-node@1.11.2-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## 1.8.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-techdocs-node@1.11.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## 1.8.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/plugin-techdocs-node@1.11.1
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## 1.8.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-techdocs-node@1.11.1-next.2

## 1.8.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-techdocs-node@1.11.1-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13

## 1.8.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/plugin-techdocs-node@1.11.1-next.0

## 1.8.0

### Minor Changes

- d15d483: Add command `--runAsDefaultUser` for `@techdocs/cli generate` to bypass running the docker builds as host user for macOS and Linux.
- b2dccad: Support passing additional `mkdocs-server` CLI parameters (`--dirtyreload`, `--strict` and `--clean`) when run in containerized mode.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-techdocs-node@1.11.0
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## 1.8.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/plugin-techdocs-node@1.11.0-next.3

## 1.8.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/plugin-techdocs-node@1.11.0-next.2

## 1.8.0-next.1

### Minor Changes

- b2dccad7b3: Support passing additional `mkdocs-server` CLI parameters (`--dirtyreload`, `--strict` and `--clean`) when run in containerized mode.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.11.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## 1.8.0-next.0

### Minor Changes

- d15d483a49: Add command `--runAsDefaultUser` for `@techdocs/cli generate` to bypass running the docker builds as host user for macOS and Linux.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/plugin-techdocs-node@1.11.0-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## 1.7.0

### Minor Changes

- 8600b86820: validate Docker status before running mkdocs server

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.10.0
  - @backstage/backend-common@0.19.9
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## 1.6.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-techdocs-node@1.10.0-next.2

## 1.6.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.10.0-next.1
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## 1.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/plugin-techdocs-node@1.9.1-next.0

## 1.6.0

### Minor Changes

- d06b30b050: Add possibility to use a mkdocs config file with a different name than `mkdocs.<yaml|yml> with the serve command using the `--mkdocs-config-file-name` argument

### Patch Changes

- de42eebaaf: Bumped dev dependencies `@types/node` and `mock-fs`.
- 2b6e572051: Restructured tests.
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-techdocs-node@1.9.0
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## 1.6.0-next.2

### Minor Changes

- d06b30b050: Add possibility to use a mkdocs config file with a different name than `mkdocs.<yaml|yml> with the serve command using the `--mkdocs-config-file-name` argument

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-techdocs-node@1.9.0-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/cli-common@0.1.13-next.0
  - @backstage/config@1.1.1-next.0

## 1.5.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/plugin-techdocs-node@1.8.2-next.1
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/cli-common@0.1.13-next.0

## 1.5.2-next.0

### Patch Changes

- de42eebaaf: Bumped dev dependencies `@types/node` and `mock-fs`.
- 2b6e572051: Restructured tests.
- Updated dependencies
  - @backstage/cli-common@0.1.13-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/plugin-techdocs-node@1.8.2-next.0
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2

## 1.5.0

### Minor Changes

- 10a86bd4ae12: Add optional config and cli option for techdocs to specify default mkdocs plugins.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/plugin-techdocs-node@1.8.0
  - @backstage/cli-common@0.1.12

## 1.5.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/cli-common@0.1.12
  - @backstage/plugin-techdocs-node@1.8.0-next.3

## 1.5.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-techdocs-node@1.8.0-next.2
  - @backstage/cli-common@0.1.12

## 1.5.0-next.1

### Minor Changes

- 10a86bd4ae12: Add optional config and cli option for techdocs to specify default mkdocs plugins.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/plugin-techdocs-node@1.8.0-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/cli-common@0.1.12

## 1.4.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/plugin-techdocs-node@1.7.6-next.0

## 1.4.5

### Patch Changes

- 971bdd6a4732: Bumped internal `nodemon` dependency.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/plugin-techdocs-node@1.7.4
  - @backstage/catalog-model@1.4.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8

## 1.4.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-techdocs-node@1.7.4-next.2

## 1.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-techdocs-node@1.7.4-next.1
  - @backstage/catalog-model@1.4.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8

## 1.4.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/plugin-techdocs-node@1.7.4-next.0

## 1.4.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/catalog-model@1.4.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/plugin-techdocs-node@1.7.3

## 1.4.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/plugin-techdocs-node@1.7.3-next.0

## 1.4.3

### Patch Changes

- 68a21956ef52: Remove reference to deprecated import
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/plugin-techdocs-node@1.7.2
  - @backstage/catalog-model@1.4.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8

## 1.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/plugin-techdocs-node@1.7.2-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7

## 1.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/plugin-techdocs-node@1.7.2-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7

## 1.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/catalog-model@1.3.0
  - @backstage/cli-common@0.1.12
  - @backstage/plugin-techdocs-node@1.7.2-next.0

## 1.4.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/plugin-techdocs-node@1.7.1
  - @backstage/catalog-model@1.3.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7

## 1.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-techdocs-node@1.7.1-next.1
  - @backstage/config@1.0.7

## 1.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/plugin-techdocs-node@1.7.1-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7

## 1.4.1

### Patch Changes

- b348420a804: Adding global-agent to enable the ability to publish through a proxy
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/plugin-techdocs-node@1.7.0
  - @backstage/catalog-model@1.3.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7

## 1.4.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/plugin-techdocs-node@1.6.1-next.3

## 1.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/plugin-techdocs-node@1.6.1-next.2

## 1.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/plugin-techdocs-node@1.6.1-next.1

## 1.4.1-next.0

### Patch Changes

- b348420a804: Adding global-agent to enable the ability to publish through a proxy
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/catalog-model@1.2.1
  - @backstage/cli-common@0.1.12
  - @backstage/plugin-techdocs-node@1.6.1-next.0

## 1.4.0

### Minor Changes

- 8e465ce52e2: Running `@techdocs/cli generate` with the `--verbose` flag will now print the mkdocs output.
- ea2bbef1b16: Added support for an HTTPS proxy for techdocs AWS S3 requests

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.6.0
  - @backstage/backend-common@0.18.3
  - @backstage/catalog-model@1.2.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7

## 1.4.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.6.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/config@1.0.7-next.0

## 1.4.0-next.1

### Minor Changes

- 8e465ce52e2: Running `@techdocs/cli generate` with the `--verbose` flag will now print the mkdocs output.
- ea2bbef1b16: Added support for an HTTPS proxy for techdocs AWS S3 requests

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.6.0-next.1
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/cli-common@0.1.12-next.0
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1

## 1.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/cli-common@0.1.11
  - @backstage/config@1.0.6
  - @backstage/plugin-techdocs-node@1.5.1-next.0

## 1.3.2

### Patch Changes

- dd1e37649f: Deprecated getMkDocsYml in favor of getMkdocsYml (lowercase 'd')
- dcacf94912: Fix proxying to mkdocs

  The domain localhost may point to both 127.0.0.1 and ::1, ipv4 and ipv6
  and when node tries to lookup localhost it might prefer ipv6 while mkdocs
  is only listening on ipv4. This tells node-proxy to target the ipv4 address
  instead of relying on localhost hostname lookup.

- 339d9a5b5c: Added support for using a default `mkdocs.yml` configuration file when none is provided
- 6e0b6a0d50: Fixed publish command missing awsBucketRootPath option.
  Fixed publish command having the gcsBucketRootPath option misconfigured, previously returning a boolean vs a string.
- Updated dependencies
  - @backstage/backend-common@0.18.2
  - @backstage/plugin-techdocs-node@1.5.0
  - @backstage/catalog-model@1.2.0
  - @backstage/cli-common@0.1.11
  - @backstage/config@1.0.6

## 1.3.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/cli-common@0.1.11
  - @backstage/config@1.0.6
  - @backstage/plugin-techdocs-node@1.4.6-next.2

## 1.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/cli-common@0.1.11
  - @backstage/config@1.0.6
  - @backstage/plugin-techdocs-node@1.4.6-next.1

## 1.3.2-next.0

### Patch Changes

- 6e0b6a0d50: Fixed publish command missing awsBucketRootPath option.
  Fixed publish command having the gcsBucketRootPath option misconfigured, previously returning a boolean vs a string.
- Updated dependencies
  - @backstage/plugin-techdocs-node@1.4.6-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0

## 1.3.0

### Minor Changes

- bc18c902a2: Add `--preview-app-bundle-path` and `--preview-app-port` options to the `serve` command enabling previewing with apps other than the provided one

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/catalog-model@1.1.5
  - @backstage/config@1.0.6
  - @backstage/cli-common@0.1.11
  - @backstage/plugin-techdocs-node@1.4.4

## 1.3.0-next.2

### Minor Changes

- bc18c902a2: Add `--preview-app-bundle-path` and `--preview-app-port` options to the `serve` command enabling previewing with apps other than the provided one

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/plugin-techdocs-node@1.4.4-next.2
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/cli-common@0.1.11
  - @backstage/config@1.0.6-next.0

## 1.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/cli-common@0.1.11
  - @backstage/plugin-techdocs-node@1.4.4-next.1

## 1.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/cli-common@0.1.11
  - @backstage/config@1.0.5
  - @backstage/plugin-techdocs-node@1.4.4-next.0

## 1.2.4

### Patch Changes

- 8015ff1258: Tweaked wording to use inclusive terminology
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-techdocs-node@1.4.3
  - @backstage/cli-common@0.1.11
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5

## 1.2.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/plugin-techdocs-node@1.4.3-next.3
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/cli-common@0.1.11-next.0
  - @backstage/config@1.0.5-next.1

## 1.2.4-next.2

### Patch Changes

- 8015ff1258: Tweaked wording to use inclusive terminology
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/cli-common@0.1.11-next.0
  - @backstage/plugin-techdocs-node@1.4.3-next.2
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1

## 1.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-techdocs-node@1.4.3-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/cli-common@0.1.10

## 1.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.5-next.0
  - @backstage/plugin-techdocs-node@1.4.3-next.0

## 1.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-techdocs-node@1.4.2
  - @backstage/catalog-model@1.1.3
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.4

## 1.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/plugin-techdocs-node@1.4.2-next.1
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.4-next.0

## 1.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-techdocs-node@1.4.2-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.4-next.0

## 1.2.2

### Patch Changes

- 0b2a30dead: fixing techdocs-cli Docker client creation

  Docker client does not need to be created when --no-docker
  option is provided.

  If you had DOCKER_CERT_PATH environment variable defined
  the Docker client was looking for certificates
  and breaking techdocs-cli generate command even with --no-docker
  option.

- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-techdocs-node@1.4.1
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.3

## 1.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-techdocs-node@1.4.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.3-next.2

## 1.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.3-next.1
  - @backstage/plugin-techdocs-node@1.4.1-next.1

## 1.2.2-next.0

### Patch Changes

- 0b2a30dead: fixing techdocs-cli Docker client creation

  Docker client does not need to be created when --no-docker
  option is provided.

  If you had DOCKER_CERT_PATH environment variable defined
  the Docker client was looking for certificates
  and breaking techdocs-cli generate command even with --no-docker
  option.

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/plugin-techdocs-node@1.4.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.3-next.0

## 1.2.1

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-techdocs-node@1.4.0
  - @backstage/catalog-model@1.1.1
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.2

## 1.2.1-next.2

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/cli-common@0.1.10-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/plugin-techdocs-node@1.4.0-next.2

## 1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.4.0-next.1
  - @backstage/backend-common@0.15.1-next.2

## 1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/plugin-techdocs-node@1.3.1-next.0

## 1.2.0

### Minor Changes

- 855952db53: Added CLI option `--docker-option` to allow passing additional options to the `docker run` command executed my `serve` and `serve:mkdocs`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/plugin-techdocs-node@1.3.0

## 1.2.0-next.2

### Minor Changes

- 855952db53: Added CLI option `--docker-option` to allow passing additional options to the `docker run` command executed my `serve` and `serve:mkdocs`.

## 1.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.1
  - @backstage/plugin-techdocs-node@1.3.0-next.1

## 1.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/plugin-techdocs-node@1.2.1-next.0

## 1.1.3

### Patch Changes

- a5d73da942: Fix the flag parsing for `legacyCopyReadmeMdToIndexMd` in `techdocs-cli generate` command, and decouple it's logic from the `techdocs-ref` flag.
- 14ce0d9347: Fixed a bug that prevented docker images from being pulled by default when generating TechDocs.
- Updated dependencies
  - @backstage/plugin-techdocs-node@1.2.0
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0

## 1.1.3-next.1

### Patch Changes

- a5d73da942: Fix the flag parsing for `legacyCopyReadmeMdToIndexMd` in `techdocs-cli generate` command, and decouple it's logic from the `techdocs-ref` flag.
- Updated dependencies
  - @backstage/plugin-techdocs-node@1.2.0-next.1
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1

## 1.1.3-next.0

### Patch Changes

- 14ce0d9347: Fixed a bug that prevented docker images from being pulled by default when generating TechDocs.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/plugin-techdocs-node@1.1.3-next.0

## 1.1.2

### Patch Changes

- f96e98f4cd: Updated dependency `cypress` to `^10.0.0`.
- bff65e6958: Updated sidebar-related logic to use `<SidebarPinStateProvider>` + `useSidebarPinState()` and/or `<SidebarOpenStateProvider>` + `useSidebarOpenState()` from `@backstage/core-components`.
- Updated dependencies
  - @backstage/backend-common@0.14.0
  - @backstage/plugin-techdocs-node@1.1.2
  - @backstage/catalog-model@1.0.3

## 1.1.2-next.2

### Patch Changes

- f96e98f4cd: Updated dependency `cypress` to `^10.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/plugin-techdocs-node@1.1.2-next.2

## 1.1.2-next.1

### Patch Changes

- bff65e6958: Updated sidebar-related logic to use `<SidebarPinStateProvider>` + `useSidebarPinState()` and/or `<SidebarOpenStateProvider>` + `useSidebarOpenState()` from `@backstage/core-components`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-techdocs-node@1.1.2-next.1

## 1.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/plugin-techdocs-node@1.1.2-next.0

## 1.1.1

### Patch Changes

- 344ea56acc: Bump `commander` to version 9.1.0
- 52fddad92d: The TechDocs CLI's embedded app now imports all API refs from the `@backstage/plugin-techdocs-react` package.
- c14e78a367: Update `techdocs-cli serve`'s `proxyEndpoint` to match the base URL of the embedded techdocs app.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/cli-common@0.1.9
  - @backstage/config@1.0.1
  - @backstage/plugin-techdocs-node@1.1.1
  - @backstage/catalog-model@1.0.2

## 1.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/cli-common@0.1.9-next.0
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/plugin-techdocs-node@1.1.1-next.1

## 1.1.1-next.1

### Patch Changes

- 52fddad92d: The TechDocs CLI's embedded app now imports all API refs from the `@backstage/plugin-techdocs-react` package.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.1

## 1.1.1-next.0

### Patch Changes

- 344ea56acc: Bump `commander` to version 9.1.0
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/plugin-techdocs-node@1.1.1-next.0

## 1.1.0

### Minor Changes

- 733187987b: Removed an undocumented, broken behavior where `README.md` files would be copied to `index.md` if it did not exist, leading to broken links in the TechDocs UI.

  **WARNING**: If you notice 404s in TechDocs after updating, check to make sure that all markdown files referenced in your `mkdocs.yml`s' `nav` sections exist. The following flag may be passed to the `generate` command to temporarily revert to the broken behavior.

  ```sh
  techdocs-cli generate --legacyCopyReadmeMdToIndexMd
  ```

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16
- eb470ea54c: Adds a new flag to override the entrypoint when using a custom docker image. It could be used to reuse existing images with different entrypoints.
- Updated dependencies
  - @backstage/catalog-model@1.0.1
  - @backstage/backend-common@0.13.2
  - @backstage/plugin-techdocs-node@1.1.0

## 1.1.0-next.1

### Minor Changes

- bcf1a2496c: BREAKING: The default Techdocs behavior will no longer attempt to copy `docs/README.md` or `README.md` to `docs/index.md` (if not found). To retain this behavior in your instance, you can set the following config in your `app-config.yaml`:

  ```yaml
  techdocs:
    generator:
      mkdocs:
        legacyCopyReadmeMdToIndexMd: true
  ```

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16
- eb470ea54c: Adds a new flag to override the entrypoint when using a custom docker image. It could be used to reuse existing images with different entrypoints.
- Updated dependencies
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/plugin-techdocs-node@1.1.0-next.2

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/plugin-techdocs-node@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/config@1.0.0
  - @backstage/plugin-techdocs-node@1.0.0

## 0.8.17

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 91bf1e6c1a: Use `@backstage/plugin-techdocs-node` package instead of `@backstage/techdocs-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-techdocs-node@0.11.12
  - @backstage/catalog-model@0.13.0

## 0.8.17-next.0

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 91bf1e6c1a: Use `@backstage/plugin-techdocs-node` package instead of `@backstage/techdocs-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-techdocs-node@0.11.12-next.0
  - @backstage/catalog-model@0.13.0-next.0

## 0.8.16

### Patch Changes

- 853efd42bd: Bump `@backstage/techdocs-common` to `0.11.10` to use `spotify/techdocs:v0.3.7` which upgrades `mkdocs-theme` as a dependency of `mkdocs-techdocs-core`.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/backend-common@0.12.0
  - @backstage/techdocs-common@0.11.11

## 0.8.15

### Patch Changes

- ed78516480: chore(deps-dev): bump `cypress` from 7.3.0 to 9.5.0
- 209fd128e6: Updated usage of `github:` location types in docs to use `url:` instead.
- 61ff215e08: - Adds `cypress` and `cypress-plugin-snapshots` as dependencies for integration and visual regression tests.
  - Updates README documentation with instructions for how to run tests.
  - Clarifies output text for prepack script.
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/catalog-model@0.11.0
  - @backstage/techdocs-common@0.11.10

## 0.8.14

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/catalog-model@0.10.0
  - @backstage/cli-common@0.1.7
  - @backstage/config@0.1.14
  - @backstage/techdocs-common@0.11.8

## 0.8.13

### Patch Changes

- b70c186194: Updated the HTTP server to allow for simplification of the development of the CLI itself.
- Updated dependencies
  - @backstage/backend-common@0.10.7
  - @backstage/techdocs-common@0.11.7

## 0.8.13-next.0

### Patch Changes

- b70c186194: Updated the HTTP server to allow for simplification of the development of the CLI itself.
- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/techdocs-common@0.11.7-next.0

## 0.8.12

### Patch Changes

- 14472509a3: Use a local file dependency for techdocs-cli-embedded-app, to ensure that it's always pulled out of the workspace
- Updated dependencies
  - @backstage/backend-common@0.10.6
  - @backstage/techdocs-common@0.11.6

## 0.8.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/techdocs-common@0.11.6-next.0

## 0.8.12-next.0

### Patch Changes

- 14472509a3: Use a local file dependency for techdocs-cli-embedded-app, to ensure that it's always pulled out of the workspace

## 0.8.11

### Patch Changes

- 10086f5873: Bumped `react-dev-utils` from `^12.0.0-next.47` to `^12.0.0-next.60`.
- Updated dependencies
  - @backstage/techdocs-common@0.11.5
  - @backstage/backend-common@0.10.5

## 0.8.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/techdocs-common@0.11.4-next.0
  - @backstage/catalog-model@0.9.10-next.0

## 0.8.10

### Patch Changes

- 8fbc988bfc: remove internal and inline CSS from index.html
- Updated dependencies
  - @backstage/techdocs-common@0.11.2
  - @backstage/backend-common@0.10.1

## 0.8.9

### Patch Changes

- 5fdc8df0e8: The `index.html` template was updated to use the new `config` global.
- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/techdocs-common@0.11.1

## 0.8.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.13
  - @backstage/techdocs-common@0.11.0

## 0.8.7

### Patch Changes

- e7230ef814: Bump react-dev-utils to v12
- Updated dependencies
  - @backstage/backend-common@0.9.12

## 0.8.6

### Patch Changes

- e21e3c6102: Bumping minimum requirements for `dockerode` and `testcontainers`
- 1578ad341b: Add support for specifying bucketRootPath for AWS and GCS publishers
- f2694e3750: Adds ability to use encrypted S3 buckets by utilizing the SSE option in the AWS SDK
- Updated dependencies
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10
  - @backstage/techdocs-common@0.10.7

## 0.8.5

### Patch Changes

- Reunified the [techdocs-cli](https://github.com/backstage/techdocs-cli) monorepo code back into the main [backstage](https://github.com/backstage/backstage) repo

  See [7288](https://github.com/backstage/backstage/issues/7288)). The changes include some internal refactoring that do not affect functionality beyond the local development setup.

## 0.8.4

### Patch Changes

- 8333394: The [change](https://github.com/backstage/techdocs-cli/commit/b25014cec313d46ce1c9b4f324cc09047a00fc1f) updated the `@backstage/techdocs-common` from version `0.9.0` to `0.10.2` and one of the intermediate versions, the [0.10.0](https://github.com/backstage/backstage/blob/cac4afb95fdbd130a66e53a1b0430a1e62787a7f/packages/techdocs-common/CHANGELOG.md#patch-changes-2), introduced the use of search in context that requires an implementation for the Search API.

  Created a custom techdocs page to disable search in the Reader component, preventing it from using the Search API, as we don't want to provide search in preview mode.

## 0.8.3

### Patch Changes

- edbb988: Upgrades the techdocs common page to the latest version 0.10.2.

  See [@backstage/techdocs-common changelog](https://github.com/backstage/backstage/blob/cac4afb95fdbd130a66e53a1b0430a1e62787a7f/packages/techdocs-common/CHANGELOG.md#L3).

- db4ebfc: Add an `etag` flag to the `generate` command that is stored in the `techdocs_metadata.json` file.

## 0.8.2

### Patch Changes

- 8fc7384: Allow to execute techdocs-cli serve using docker techdocs-container on Windows

## 0.8.1

### Patch Changes

- 0187424: Separate build and publish release steps

## 0.8.0

### Minor Changes

- c6f437a: OpenStack Swift configuration changed due to OSS SDK Client change in @backstage/techdocs-common, it was a breaking change.
  PR Reference: https://github.com/backstage/backstage/pull/6839

### Patch Changes

- 05f0409: Merge Jobs for Release Pull Requests and Package Publishes

## 0.7.0

### Minor Changes

- 9d1f8d8: The `techdocs-cli publish` command will now publish TechDocs content to remote
  storage using the lowercase'd entity triplet as the storage path. This is in
  line with the beta release of the TechDocs plugin (`v0.11.0`).

  If you have been running `techdocs-cli` prior to this version, you will need to
  follow this [migration guide](https://backstage.io/docs/features/techdocs/how-to-guides#how-to-migrate-from-techdocs-alpha-to-beta).

## 0.6.2

### Patch Changes

- f1bcf1a: Changelog (from v0.6.1 to v0.6.2)

  #### :bug: Bug Fix

  - `techdocs-cli`
    - [#105](https://github.com/backstage/techdocs-cli/pull/105) Add azureAccountKey parameter back to the publish command ([@emmaindal](https://github.com/emmaindal))

  #### :house: Internal

  - `techdocs-cli-embedded-app`
    - [#122](https://github.com/backstage/techdocs-cli/pull/122) chore(deps-dev): bump @types/node from 12.20.20 to 16.7.1 in /packages/techdocs-cli-embedded-app ([@dependabot[bot]](https://github.com/apps/dependabot))
    - [#120](https://github.com/backstage/techdocs-cli/pull/120) chore(deps-dev): bump @types/react-dom from 16.9.14 to 17.0.9 in /packages/techdocs-cli-embedded-app ([@dependabot[bot]](https://github.com/apps/dependabot))
    - [#119](https://github.com/backstage/techdocs-cli/pull/119) chore(deps-dev): bump @testing-library/user-event from 12.8.3 to 13.2.1 in /packages/techdocs-cli-embedded-app ([@dependabot[bot]](https://github.com/apps/dependabot))
    - [#118](https://github.com/backstage/techdocs-cli/pull/118) chore(deps-dev): bump @testing-library/react from 10.4.9 to 12.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - Other
    - [#117](https://github.com/backstage/techdocs-cli/pull/117) chore(deps): bump @backstage/plugin-catalog from 0.6.11 to 0.6.12 ([@dependabot[bot]](https://github.com/apps/dependabot))
    - [#124](https://github.com/backstage/techdocs-cli/pull/124) Update release process docs ([@emmaindal](https://github.com/emmaindal))
    - [#116](https://github.com/backstage/techdocs-cli/pull/116) ignore dependabot branches for project board workflow ([@emmaindal](https://github.com/emmaindal))
    - [#106](https://github.com/backstage/techdocs-cli/pull/106) Configure dependabot for all packages ([@emmaindal](https://github.com/emmaindal))
    - [#102](https://github.com/backstage/techdocs-cli/pull/102) readme: add information about running techdocs-common locally ([@vcapretz](https://github.com/vcapretz))
    - [#103](https://github.com/backstage/techdocs-cli/pull/103) Introduce changesets and improve the publish workflow ([@minkimcello](https://github.com/minkimcello))
    - [#101](https://github.com/backstage/techdocs-cli/pull/101) update yarn lockfile to get rid of old version of node-forge ([@emmaindal](https://github.com/emmaindal))

  #### Committers: 3

  Thank you for contributing ❤️

  - `Emma Indal` ([@emmaindal](https://github.com/emmaindal))
  - `Min Kim` ([@minkimcello](https://github.com/minkimcello))
  - `Vitor Capretz` ([@vcapretz](https://github.com/vcapretz))
