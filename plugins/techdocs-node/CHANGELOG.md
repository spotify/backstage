# @backstage/plugin-techdocs-node

## 2.2.0-next.0

### Minor Changes

- a4604d2: Added a new `@backstage/plugin-techdocs-node/alpha` entry point with building blocks for implementing additional documentation engines in separate modules: `createDockerContainerRunner`, `createOrUpdateMetadata`, `storeEtagMetadata`, `runCommand`, `validateInputDirectory`, `patchIndexPreBuild`, and the `mkdocs.yml` helpers `MKDOCS_SCHEMA`, `validateMkdocsYaml` and `sanitizeMkdocsYml`. These are alpha and may change in minor releases.

## 2.1.0

### Minor Changes

- 4d4f987: Add engine abstraction layer for multi-engine TechDocs support. Introduces `--engine` flag, engine config map, generator registry with `backstage.io/techdocs-engine` annotation support, `engine` field in `techdocs_metadata.json`, `serve:raw` command, and live-reload adapter interface. MkDocs remains the default with no behavior change.

  The built-in generator is now registered under `mkdocs`; the previous `techdocs` key is kept as an alias, so existing `generators.register('techdocs', ...)` calls continue to work. The CLI's `--engine` flag takes precedence over the `backstage.io/techdocs-engine` annotation for all commands, and `serve:mkdocs` and the `--mkdocs-parameter-*` flags now print deprecation warnings.

### Patch Changes

- 9fc5387: Improved handling of mapping-style Markdown extension configuration.
- 0fd5fe5: Fixed TechDocs allowing `custom_icons` paths in `mkdocs.yml` that resolve outside the documentation input directory. A `custom_icons` option with such a path is now removed from the configuration with a warning.
- 8a37336: Fixed TechDocs generation rejecting `mkdocs.yml` files that use the emoji indexes and generators or the `pymdownx.superfences` custom fence formats documented by mkdocs-material, pymdown-extensions and mkdocs-mermaid2.
- 76ac6ed: Updated dependency `js-yaml` to `^5.0.0`.
- Updated dependencies
  - @backstage/integration@2.1.3
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/plugin-techdocs-common@0.1.2
  - @backstage/catalog-model@1.10.2
  - @backstage/integration-aws-node@0.2.3
  - @backstage/plugin-search-common@1.2.26

## 2.0.3-next.2

### Patch Changes

- 76ac6ed: Updated dependency `js-yaml` to `^5.0.0`.
- Updated dependencies
  - @backstage/integration@2.1.3-next.1
  - @backstage/plugin-techdocs-common@0.1.2-next.0

## 2.0.3-next.1

### Patch Changes

- Bumped version to account for a patch release.

## 2.0.2-next.1

### Patch Changes

- 9fc5387: Improved handling of mapping-style Markdown extension configuration.
- 0fd5fe5: Fixed TechDocs allowing `custom_icons` paths in `mkdocs.yml` that resolve outside the documentation input directory. A `custom_icons` option with such a path is now removed from the configuration with a warning.
- 8a37336: Fixed TechDocs generation rejecting `mkdocs.yml` files that use the emoji indexes and generators or the `pymdownx.superfences` custom fence formats documented by mkdocs-material, pymdown-extensions and mkdocs-mermaid2.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1

## 2.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/integration-aws-node@0.2.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## 2.0.0

### Major Changes

- 62d1a6f: **BREAKING**: TechDocs generation now removes MkDocs plugins outside the built-in allowlist and logs a warning before continuing the build. To retain additional plugins, review and add them to `techdocs.generator.mkdocs.dangerouslyAllowAdditionalPlugins`, or supply them through `dangerouslyAllowAdditionalPlugins` when creating the generator directly. Plugins configured through `defaultPlugins` are also permitted. Generation stops if the MkDocs configuration cannot be read, parsed, or updated.

### Minor Changes

- ee97130: Added support for `techdocs.generator.pullOptions` when pulling the TechDocs generator Docker image from private registries that require authentication.

### Patch Changes

- 1711594: Fixed local TechDocs generation when temporary source paths resolve through filesystem aliases.
- c0ebaa7: chore(deps): bump `js-yaml` from 4.3.1 to 4.3.2
- e58d265: Updated TechDocs generation to reject source trees containing symlinks that resolve outside the source directory.
- d13ad29: Improved MkDocs configuration handling for additional templates.
- e582b56: Fixed AWS S3 publishing to paginate existing objects in order to properly remove all stale TechDocs files.
- 2233af2: Improved MkDocs configuration sanitization to cover additional nested configuration keys and theme options.
- 4441911: Improved MkDocs configuration file handling.
- 45cbd0a: Improved validation of MkDocs configuration values during TechDocs generation.
- 030331b: Improved file validation in the local TechDocs publisher during the publish step.
- Updated dependencies
  - @backstage/integration@2.1.2
  - @backstage/catalog-model@1.10.1
  - @backstage/config@1.3.9
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/integration-aws-node@0.2.2
  - @backstage/plugin-search-common@1.2.25

## 1.16.0-next.1

### Patch Changes

- 1711594: Fixed local TechDocs generation when temporary source paths resolve through filesystem aliases.
- e582b56: Fixed AWS S3 publishing to paginate existing objects in order to properly remove all stale TechDocs files.
- Updated dependencies
  - @backstage/config@1.3.9-next.0
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/integration@2.1.2-next.1
  - @backstage/integration-aws-node@0.2.2-next.0
  - @backstage/plugin-search-common@1.2.25-next.0

## 1.16.0-next.0

### Minor Changes

- ee97130: Added support for `techdocs.generator.pullOptions` when pulling the TechDocs generator Docker image from private registries that require authentication.

### Patch Changes

- e58d265: Updated TechDocs generation to reject source trees containing symlinks that resolve outside the source directory.
- d13ad29: Improved MkDocs configuration handling for additional templates.
- 2233af2: Improved MkDocs configuration sanitization to cover additional nested configuration keys and theme options.
- 4441911: Improved MkDocs configuration file handling.
- 45cbd0a: Improved validation of MkDocs configuration values during TechDocs generation.
- 030331b: Improved file validation in the local TechDocs publisher during the publish step.
- Updated dependencies
  - @backstage/integration@2.1.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0

## 1.15.3

### Patch Changes

- 226817d: chore(deps): bump `js-yaml` from 4.2.0 to 4.3.0
- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/integration@2.1.0
  - @backstage/integration-aws-node@0.2.1

## 1.15.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.0-next.0

## 1.15.3-next.0

### Patch Changes

- 226817d: chore(deps): bump `js-yaml` from 4.2.0 to 4.3.0
- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0

## 1.15.2

### Patch Changes

- 120e7c3: chore(deps): bump `js-yaml` from 4.1.1 to 4.2.0
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3

## 1.15.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0

## 1.15.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.0.3
  - @backstage/backend-plugin-api@1.9.2

## 1.15.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.0.3-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0

## 1.15.0

### Minor Changes

- 5ef8d16: Add support for disabling external font downloads via app-config option `techdocs.generator.mkdocs.disableExternalFonts`, useful for air-gapped Backstage instances.

### Patch Changes

- 6ce8462: Fixed bug causing `--legacyCopyReadmeMdToIndexMd` option to fail if docs directory is not present
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/errors@1.3.1
  - @backstage/integration-aws-node@0.2.0
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/integration@2.0.2
  - @backstage/config@1.3.8
  - @backstage/plugin-search-common@1.2.24

## 1.15.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration-aws-node@0.2.0-next.1
  - @backstage/backend-plugin-api@1.9.1-next.1

## 1.15.0-next.1

### Minor Changes

- 5ef8d16: Add support for disabling external font downloads via app-config option `techdocs.generator.mkdocs.disableExternalFonts`, useful for air-gapped Backstage instances.

### Patch Changes

- 6ce8462: Fixed bug causing `--legacyCopyReadmeMdToIndexMd` option to fail if docs directory is not present
- Updated dependencies
  - @backstage/integration@2.0.2-next.1

## 1.14.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/integration@2.0.2-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/integration-aws-node@0.1.22-next.0
  - @backstage/plugin-search-common@1.2.24-next.0
  - @backstage/plugin-techdocs-common@0.1.1

## 1.14.5

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/catalog-model@1.8.0
  - @backstage/integration@2.0.1
  - @backstage/config@1.3.7
  - @backstage/integration-aws-node@0.1.21
  - @backstage/plugin-search-common@1.2.23

## 1.14.5-next.2

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/integration@2.0.1-next.0
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0
  - @backstage/integration-aws-node@0.1.21-next.0
  - @backstage/plugin-search-common@1.2.23-next.0

## 1.14.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1

## 1.14.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration@2.0.0
  - @backstage/integration-aws-node@0.1.20
  - @backstage/plugin-search-common@1.2.22
  - @backstage/plugin-techdocs-common@0.1.1

## 1.14.4

### Patch Changes

- cb7c6b1: Added `techdocs.generator.mkdocs.dangerouslyAllowAdditionalKeys` configuration option to explicitly bypass MkDocs configuration key restrictions. This enables support for additional MkDocs configuration keys beyond the default safe allow list, such as the `hooks` key which some MkDocs plugins require.
- e96f6d9: Removed `INHERIT` from the `ALLOWED_MKDOCS_KEYS` set to address a security concern with MkDocs configuration inheritance.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/integration@2.0.0
  - @backstage/catalog-model@1.7.7

## 1.14.4-next.2

### Patch Changes

- e96f6d9: Removed `INHERIT` from the `ALLOWED_MKDOCS_KEYS` set to address a security concern with MkDocs configuration inheritance.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/integration@2.0.0-next.2

## 1.14.3-next.1

### Patch Changes

- cb7c6b1: Added `techdocs.generator.mkdocs.dangerouslyAllowAdditionalKeys` configuration option to explicitly bypass MkDocs configuration key restrictions. This enables support for additional MkDocs configuration keys beyond the default safe allow list, such as the `hooks` key which some MkDocs plugins require.
- Updated dependencies
  - @backstage/integration@2.0.0-next.1
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.20
  - @backstage/plugin-search-common@1.2.22
  - @backstage/plugin-techdocs-common@0.1.1

## 1.14.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.20
  - @backstage/plugin-search-common@1.2.22
  - @backstage/plugin-techdocs-common@0.1.1

## 1.14.2

### Patch Changes

- 7455dae: Use node prefix on native imports
- 3c455d4: Some security fixes
- Updated dependencies
  - @backstage/integration@1.20.0
  - @backstage/integration-aws-node@0.1.20
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-search-common@1.2.22

## 1.14.2-next.1

### Patch Changes

- 3c455d4: Some security fixes
- Updated dependencies
  - @backstage/integration@1.20.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1

## 1.14.1-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/integration-aws-node@0.1.20-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/plugin-search-common@1.2.22-next.0
  - @backstage/integration@1.19.3-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/plugin-techdocs-common@0.1.1

## 1.14.0

### Minor Changes

- 63c459c: **BREAKING:** It's now possible to use the credentials from the `integrations.awsS3` config to authenticate with AWS S3. The new priority is:

  1. `aws.accounts`
  2. `techdocs.publisher.awsS3.credentials`
  3. `integrations.awsS3`
  4. Default credential chain

  In case of multiple `integrations.awsS3` are present, the target integration is determined by the `accessKeyId` in `techdocs.publisher.awsS3.credentials` if provided. Otherwise, the default credential chain is used.

  This means that depending on your setup, this feature may break your existing setup.
  In general:

  - if you are configuring `aws.accounts`, no action is required
  - if you are configuring `techdocs.publisher.awsS3.credentials`, no action is required
  - if you are configuring multiple integrations under `integrations.awsS3`, no action is required
  - if you are configuring a single integration under `integrations.awsS3`, make sure that the integration has access to the bucket you are using for TechDocs

### Patch Changes

- f0951aa: Updated the `defaultDockerImage` to reflect the latest TechDocs Container version of v1.2.8
- Updated dependencies
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/integration@1.19.2

## 1.13.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.19.2-next.0

## 1.13.10

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- 703f8c0: There was an issue in the uploading of large size files to the AWS S3. We have modified the logic by adding retry along with multipart uploading functionality.
- Updated dependencies
  - @backstage/integration@1.19.0
  - @backstage/backend-plugin-api@1.6.0

## 1.13.10-next.1

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- 703f8c0: There was an issue in the uploading of large size files to the AWS S3. We have modified the logic by adding retry along with multipart uploading functionality.
- Updated dependencies
  - @backstage/integration@1.18.3-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.19
  - @backstage/plugin-search-common@1.2.21
  - @backstage/plugin-techdocs-common@0.1.1

## 1.13.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/integration@1.18.3-next.0
  - @backstage/config@1.3.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/plugin-search-common@1.2.21
  - @backstage/plugin-techdocs-common@0.1.1

## 1.13.9

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/plugin-search-common@1.2.21

## 1.13.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.1

## 1.13.9-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/integration@1.18.2-next.0
  - @backstage/integration-aws-node@0.1.19-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/errors@1.2.7
  - @backstage/plugin-search-common@1.2.21-next.0
  - @backstage/plugin-techdocs-common@0.1.1

## 1.13.8

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.1
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/integration-aws-node@0.1.18
  - @backstage/plugin-search-common@1.2.20

## 1.13.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/integration@1.18.1-next.1
  - @backstage/integration-aws-node@0.1.18-next.0
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-search-common@1.2.20-next.0

## 1.13.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.1-next.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.17
  - @backstage/plugin-search-common@1.2.19
  - @backstage/plugin-techdocs-common@0.1.1

## 1.13.7

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.0
  - @backstage/backend-plugin-api@1.4.3

## 1.13.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.0-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0

## 1.13.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## 1.13.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.1
  - @backstage/integration-aws-node@0.1.17
  - @backstage/plugin-search-common@1.2.19
  - @backstage/plugin-techdocs-common@0.1.1

## 1.13.5

### Patch Changes

- 029526c: Updated the error message thrown by parseReferenceAnnotation to reflect the annotation value passed as an argument rather than in correctly assuming location.
- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/catalog-model@1.7.5
  - @backstage/integration@1.17.1
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/integration-aws-node@0.1.17
  - @backstage/plugin-search-common@1.2.19

## 1.13.5-next.2

### Patch Changes

- 029526c: Updated the error message thrown by parseReferenceAnnotation to reflect the annotation value passed as an argument rather than in correctly assuming location.

## 1.13.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/integration@1.17.1-next.1
  - @backstage/integration-aws-node@0.1.17-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-search-common@1.2.19-next.0

## 1.13.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.1-next.0
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.16
  - @backstage/plugin-search-common@1.2.18
  - @backstage/plugin-techdocs-common@0.1.1

## 1.13.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-common@0.1.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/integration-aws-node@0.1.16
  - @backstage/plugin-search-common@1.2.18

## 1.13.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/integration-aws-node@0.1.16
  - @backstage/plugin-search-common@1.2.18
  - @backstage/plugin-techdocs-common@0.1.1-next.0

## 1.13.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-common@0.1.1-next.0
  - @backstage/backend-plugin-api@1.4.0-next.0

## 1.13.3

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/integration@1.17.0
  - @backstage/catalog-model@1.7.4
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/integration-aws-node@0.1.16
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-search-common@1.2.18
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0-next.3
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.16-next.0
  - @backstage/plugin-search-common@1.2.18-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration-aws-node@0.1.16-next.0
  - @backstage/integration@1.17.0-next.2
  - @backstage/config@1.3.2
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/plugin-search-common@1.2.18-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.3-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.18-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.4-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.2

### Patch Changes

- 304a422: Update AWS file retrieval logic from storing file in buffer array to piping to res for better memory efficiency.
- 2d7a3b8: Update Azure file retrieval logic from storing file in buffer array to piping to res for better memory efficiency.
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/integration@1.16.3
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.2-next.2

### Patch Changes

- 2d7a3b8: Update Azure file retrieval logic from storing file in buffer array to piping to res for better memory efficiency.
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.3-next.0
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.3-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.2-next.0

### Patch Changes

- 304a422: Update AWS file retrieval logic from storing file in buffer array to piping to res for better memory efficiency.
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.1

### Patch Changes

- 052a10a: Bumps the version of the techdocs generator container used.
- Updated dependencies
  - @backstage/integration@1.16.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.2-next.0
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.1-next.0

### Patch Changes

- 052a10a: Bumps the version of the techdocs generator container used.
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.0

## 1.13.0

### Minor Changes

- 8de3d2d: Allow configurable optional retries for publisher AWS S3 operations.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.13.0-next.0

### Minor Changes

- 8de3d2d: Allow configurable optional retries for publisher AWS S3 operations.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.16

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.17
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-search-common@1.2.17-next.0
  - @backstage/integration-aws-node@0.1.15-next.0
  - @backstage/integration@1.16.1-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/integration@1.16.0
  - @backstage/integration-aws-node@0.1.14
  - @backstage/plugin-search-common@1.2.16
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.15

### Patch Changes

- 5f04976: Fixed a bug that caused missing code in published packages.
- Updated dependencies
  - @backstage/integration@1.16.0
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/integration-aws-node@0.1.14
  - @backstage/plugin-search-common@1.2.16
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/integration@1.16.0-next.1
  - @backstage/integration-aws-node@0.1.14-next.0
  - @backstage/plugin-search-common@1.2.16-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/integration@1.16.0-next.0
  - @backstage/integration-aws-node@0.1.13
  - @backstage/plugin-search-common@1.2.15
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.15-next.0

### Patch Changes

- 5f04976: Fixed a bug that caused missing code in published packages.
- Updated dependencies
  - @backstage/integration@1.16.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/integration-aws-node@0.1.13
  - @backstage/plugin-search-common@1.2.15
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.13

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/integration-aws-node@0.1.13
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5
  - @backstage/integration@1.15.2
  - @backstage/plugin-search-common@1.2.15
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.13-next.3

### Patch Changes

- Updated dependencies
  - @backstage/integration-aws-node@0.1.13-next.0
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.12

### Patch Changes

- 7774828: Updated dependency `@smithy/node-http-handler` to `^3.0.0`.
- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- fbdc631: Allow to pass StorageOptions to GCS Publisher
- Updated dependencies
  - @backstage/integration@1.15.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.12-next.2

### Patch Changes

- 7774828: Updated dependency `@smithy/node-http-handler` to `^3.0.0`.
- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- fbdc631: Allow to pass StorageOptions to GCS Publisher
- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.11

### Patch Changes

- f715f5c: Move `TechdocsContainerRunner` from `publish` to `generate`.
- 4417dd4: Fix typo and unify TechDocs casing in doc strings
- 57da51f: Add support for mapping custom tags in the techdocs yaml parser that validates the mkdocs.yaml file
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- 3606843: Internal fixes to match `testcontainers` update
- 33ebb28: As the `@backstage/backend-common` package is deprecated, we have updated the `techdocs-node` package to stop depending on it.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/integration@1.15.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.11-next.2

### Patch Changes

- 57da51f: Add support for mapping custom tags in the techdocs yaml parser that validates the mkdocs.yaml file
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- 3606843: Internal fixes to match `testcontainers` update
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/integration@1.15.0-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.11-next.0

### Patch Changes

- 4417dd4: Fix typo and unify TechDocs casing in doc strings
- 33ebb28: As the `@backstage/backend-common` package is deprecated, we have updated the `techdocs-node` package to stop depending on it.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## 1.12.9

### Patch Changes

- 389f5a4: Update deprecated url-reader-related imports.
- 69bd940: Use annotation constants from new techdocs-common package.
- 949083d: Update `patchMkdocsYmlPrebuild` to modify `repo_url` and `edit_uri` independently.
- 5cedd9f: Fix TechDocs Edit URL for nested docs
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-search-common@1.2.14
  - @backstage/integration@1.14.0
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12

## 1.12.9-next.3

### Patch Changes

- 5cedd9f: Fix TechDocs Edit URL for nested docs
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14-next.1
  - @backstage/plugin-techdocs-common@0.1.0-next.0

## 1.12.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-search-common@1.2.14-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-techdocs-common@0.1.0-next.0

## 1.12.9-next.1

### Patch Changes

- 69bd940: Use annotation constants from new techdocs-common package.
- 949083d: Update `patchMkdocsYmlPrebuild` to modify `repo_url` and `edit_uri` independently.
- Updated dependencies
  - @backstage/plugin-techdocs-common@0.1.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 1.12.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.13

## 1.12.8

### Patch Changes

- 9ecf5fd: Adds extension point for publishers to the techdocs backend
- 4c4d077: Bumps default version of techdocs docker image to latest
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/integration@1.13.0
  - @backstage/plugin-search-common@1.2.13
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12

## 1.12.8-next.1

### Patch Changes

- 9ecf5fd: Adds extension point for publishers to the techdocs backend
- 4c4d077: Bumps default version of techdocs docker image to latest
- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.13.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.12

## 1.12.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.12

## 1.12.5

### Patch Changes

- e64bfb2: Allow defining custom build log transport for techdocs builder
- 48c38f0: `TechdocsGenerator` won't require a `containerRunner` option anymore for generating TechDocs in docker.
- d44a20a: Added additional plugin metadata to `package.json`.
- 5db7536: Updated `getRepoUrlFromLocationAnnotation` to check for Harness SCM integration
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/integration@1.12.0
  - @backstage/plugin-search-common@1.2.12
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12

## 1.12.5-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-search-common@1.2.12-next.0
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12

## 1.12.5-next.2

### Patch Changes

- e64bfb2: Allow defining custom build log transport for techdocs builder
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.11

## 1.12.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1

## 1.12.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.11.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.11

## 1.12.4

### Patch Changes

- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- Updated dependencies
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/integration@1.11.0

## 1.12.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/integration@1.11.0-next.0

## 1.12.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 1.12.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.11

## 1.12.3

### Patch Changes

- 8e28c88: Allow overriding default techdocs preparers with new `TechdocsPreparerExtensionPoint`
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/integration@1.10.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-search-common@1.2.11

## 1.12.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.11

## 1.12.3-next.0

### Patch Changes

- 8e28c88: Allow overriding default techdocs preparers with new `TechdocsPreparerExtensionPoint`
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.11

## 1.12.2

### Patch Changes

- 81a995f: Updated dependency `aws-sdk-client-mock` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/integration-aws-node@0.1.12
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1
  - @backstage/plugin-search-common@1.2.11

## 1.12.1

### Patch Changes

- 81a995f: Updated dependency `aws-sdk-client-mock` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/integration-aws-node@0.1.11
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1
  - @backstage/plugin-search-common@1.2.11

## 1.12.0

### Minor Changes

- 718b734: Create extension point `TechdocsGeneratorExtensionPoint` to allow adding a custom generator

### Patch Changes

- 5b4f565: Fix handling of default plugins that have configuration
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-search-common@1.2.11
  - @backstage/catalog-model@1.4.5
  - @backstage/integration-aws-node@0.1.10

## 1.12.0-next.2

### Minor Changes

- 718b734: Create extension point `TechdocsGeneratorExtensionPoint` to allow adding a custom generator

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.9.1-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/integration-aws-node@0.1.10-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## 1.11.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/integration-aws-node@0.1.10-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-search-common@1.2.11-next.1

## 1.11.5-next.0

### Patch Changes

- 5b4f565: Fix handling of default plugins that have configuration
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-search-common@1.2.11-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0
  - @backstage/integration-aws-node@0.1.10-next.0

## 1.11.2

### Patch Changes

- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- 1cae748: Updated dependency `git-url-parse` to `^14.0.0`.
- 77e3050: Update to a newer version of `@trendyol-js/openstack-swift-sdk`
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/catalog-model@1.4.4
  - @backstage/integration-aws-node@0.1.9
  - @backstage/integration@1.9.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-common@1.2.10

## 1.11.2-next.3

### Patch Changes

- 1cae748: Updated dependency `git-url-parse` to `^14.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/integration-aws-node@0.1.9-next.0
  - @backstage/integration@1.9.0-next.1
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-common@1.2.10

## 1.11.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/config@1.1.1
  - @backstage/integration-aws-node@0.1.8
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/integration@1.9.0-next.0
  - @backstage/plugin-search-common@1.2.10

## 1.11.2-next.1

### Patch Changes

- 77e3050: Update to a newer version of `@trendyol-js/openstack-swift-sdk`
- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/plugin-search-common@1.2.10

## 1.11.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/integration-aws-node@0.1.8
  - @backstage/plugin-search-common@1.2.10

## 1.11.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/integration-aws-node@0.1.8
  - @backstage/plugin-search-common@1.2.10

## 1.11.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2

## 1.11.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/integration-aws-node@0.1.8
  - @backstage/config@1.1.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-common@1.2.9

## 1.11.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/integration-aws-node@0.1.8
  - @backstage/plugin-search-common@1.2.9

## 1.11.0

### Minor Changes

- d15d483: Add command `--runAsDefaultUser` for `@techdocs/cli generate` to bypass running the docker builds as host user for macOS and Linux.

### Patch Changes

- 99fb541: Updated dependency `@azure/identity` to `^4.0.0`.
- 2666675: Updated dependency `@google-cloud/storage` to `^7.0.0`.
- 4f773c1: Bumped the default TechDocs docker image version to the latest which was released several month ago
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/integration@1.8.0
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/plugin-search-common@1.2.9

## 1.11.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/integration-aws-node@0.1.8
  - @backstage/plugin-search-common@1.2.8

## 1.11.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/integration-aws-node@0.1.8
  - @backstage/plugin-search-common@1.2.8

## 1.11.0-next.1

### Patch Changes

- 99fb54183b: Updated dependency `@azure/identity` to `^4.0.0`.
- 2666675457: Updated dependency `@google-cloud/storage` to `^7.0.0`.
- 4f773c15f6: Bumped the default TechDocs docker image version to the latest which was released several month ago
- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/plugin-search-common@1.2.8

## 1.11.0-next.0

### Minor Changes

- d15d483a49: Add command `--runAsDefaultUser` for `@techdocs/cli generate` to bypass running the docker builds as host user for macOS and Linux.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/integration@1.8.0-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/plugin-search-common@1.2.8

## 1.10.0

### Minor Changes

- 67cff7b06f: Expose an extension point to set a custom build strategy. Also move `DocsBuildStrategy` type to `@backstage/plugin-techdocs-node` and deprecate `ShouldBuildParameters` type.

### Patch Changes

- e61a975f61: Switch to `@smithy/node-http-handler` instead of the `@aws-sdk/node-http-handler`
- 3d043526f4: Updated dependency `aws-sdk-client-mock` to `^3.0.0`.
- Updated dependencies
  - @backstage/integration@1.7.2
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/integration-aws-node@0.1.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-common@1.2.8

## 1.10.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2

## 1.10.0-next.1

### Minor Changes

- 67cff7b06f: Expose an extension point to set a custom build strategy. Also move `DocsBuildStrategy` type to `@backstage/plugin-techdocs-node` and deprecate `ShouldBuildParameters` type.

### Patch Changes

- e61a975f61: Switch to `@smithy/node-http-handler` instead of the `@aws-sdk/node-http-handler`
- Updated dependencies
  - @backstage/integration@1.7.2-next.0
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.7
  - @backstage/plugin-search-common@1.2.7

## 1.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/integration@1.7.1
  - @backstage/integration-aws-node@0.1.7
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-common@1.2.7

## 1.9.0

### Minor Changes

- 344cfbcfbc: Allow prepared directory clean up for custom preparers

  When using custom preparer for TechDocs, the `preparedDir` might
  end up taking disk space. This requires all custom preparers to
  implement a new method `shouldCleanPreparedDirectory` which indicates
  whether the prepared directory should be cleaned after generation.

- d06b30b050: Add possibility to use a mkdocs config file with a different name than `mkdocs.<yaml|yml> with the serve command using the `--mkdocs-config-file-name` argument

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/config@1.1.1
  - @backstage/integration-aws-node@0.1.7
  - @backstage/plugin-search-common@1.2.7

## 1.9.0-next.2

### Minor Changes

- 344cfbcfbc: Allow prepared directory clean up for custom preparers

  When using custom preparer for TechDocs, the `preparedDir` might
  end up taking disk space. This requires all custom preparers to
  implement a new method `shouldCleanPreparedDirectory` which indicates
  whether the prepared directory should be cleaned after generation.

- d06b30b050: Add possibility to use a mkdocs config file with a different name than `mkdocs.<yaml|yml> with the serve command using the `--mkdocs-config-file-name` argument

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/integration@1.7.1-next.1
  - @backstage/errors@1.2.3-next.0
  - @backstage/config@1.1.1-next.0
  - @backstage/integration-aws-node@0.1.7-next.0
  - @backstage/plugin-search-common@1.2.7-next.0

## 1.8.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/config@1.1.0
  - @backstage/integration-aws-node@0.1.6
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.1-next.0
  - @backstage/plugin-search-common@1.2.6

## 1.8.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.1-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/integration-aws-node@0.1.6
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/plugin-search-common@1.2.6

## 1.8.0

### Minor Changes

- 5985d458ee30: Add a `techdocs.publisher.azureBlobStorage.connectionString` app-config setting, which can be leveraged for improved Azurite support.
- 10a86bd4ae12: Add optional config and cli option for techdocs to specify default mkdocs plugins.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.0
  - @backstage/plugin-search-common@1.2.6
  - @backstage/integration-aws-node@0.1.6

## 1.8.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/integration@1.7.0-next.3
  - @backstage/plugin-search-common@1.2.6-next.2
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/integration-aws-node@0.1.6-next.2

## 1.8.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/integration-aws-node@0.1.6-next.1
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-search-common@1.2.6-next.1

## 1.8.0-next.1

### Minor Changes

- 5985d458ee30: Add a `techdocs.publisher.azureBlobStorage.connectionString` app-config setting, which can be leveraged for improved Azurite support.
- 10a86bd4ae12: Add optional config and cli option for techdocs to specify default mkdocs plugins.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/integration@1.7.0-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/integration-aws-node@0.1.6-next.0
  - @backstage/errors@1.2.1
  - @backstage/plugin-search-common@1.2.6-next.0

## 1.7.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/integration@1.7.0-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration-aws-node@0.1.5
  - @backstage/plugin-search-common@1.2.5

## 1.7.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/integration@1.6.0
  - @backstage/integration-aws-node@0.1.5
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-search-common@1.2.5

## 1.7.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2

## 1.7.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/integration@1.5.1
  - @backstage/integration-aws-node@0.1.5
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-search-common@1.2.5

## 1.7.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration@1.5.1
  - @backstage/integration-aws-node@0.1.5
  - @backstage/plugin-search-common@1.2.5

## 1.7.3

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1
  - @backstage/integration-aws-node@0.1.5
  - @backstage/plugin-search-common@1.2.5

## 1.7.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1-next.0
  - @backstage/integration-aws-node@0.1.5-next.0
  - @backstage/plugin-search-common@1.2.5-next.0

## 1.7.2

### Patch Changes

- b43e030911f2: Upgrade `@azure/identity` to support using Workload Identity to authenticate against Azure.
- 7d4a09304f67: Use latest techdocs docker image by default. The latest image contains security updates.
- 5f2c38c70f5b: Fix SNYK-JS-FASTXMLPARSER-5668858 (`fast-xml-parser`) by upgrading aws-sdk to at least the current latest version.
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/integration-aws-node@0.1.4
  - @backstage/integration@1.5.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/config@1.0.8
  - @backstage/plugin-search-common@1.2.4

## 1.7.2-next.2

### Patch Changes

- 5f2c38c70f5b: Fix SNYK-JS-FASTXMLPARSER-5668858 (`fast-xml-parser`) by upgrading aws-sdk to at least the current latest version.
- Updated dependencies
  - @backstage/integration-aws-node@0.1.4-next.1
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/integration@1.5.0-next.0
  - @backstage/plugin-search-common@1.2.4-next.0

## 1.7.2-next.1

### Patch Changes

- 7d4a09304f67: Use latest techdocs docker image by default. The latest image contains security updates.
- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/integration@1.5.0-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/integration-aws-node@0.1.4-next.0
  - @backstage/config@1.0.7
  - @backstage/plugin-search-common@1.2.4-next.0

## 1.7.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/integration@1.4.5
  - @backstage/integration-aws-node@0.1.3
  - @backstage/config@1.0.7
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/plugin-search-common@1.2.3

## 1.7.1

### Patch Changes

- 3659c71c5d9: Standardize `@aws-sdk` v3 versions
- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/integration@1.4.5
  - @backstage/integration-aws-node@0.1.3
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-search-common@1.2.3

## 1.7.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7
  - @backstage/integration-aws-node@0.1.2

## 1.7.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/integration@1.4.5-next.0
  - @backstage/integration-aws-node@0.1.2
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-search-common@1.2.3

## 1.7.0

### Minor Changes

- a8b9357eb71: Use the latest version `v.1.2.0` of the spotify/techdocs docker image as default

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/catalog-model@1.3.0
  - @backstage/integration@1.4.4
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration-aws-node@0.1.2
  - @backstage/plugin-search-common@1.2.3

## 1.6.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/integration-aws-node@0.1.2
  - @backstage/plugin-search-common@1.2.3-next.0

## 1.6.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/integration-aws-node@0.1.2
  - @backstage/plugin-search-common@1.2.3-next.0

## 1.6.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.4.4-next.0
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration-aws-node@0.1.2
  - @backstage/plugin-search-common@1.2.3-next.0

## 1.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/integration-aws-node@0.1.2
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/plugin-search-common@1.2.2

## 1.6.0

### Minor Changes

- ea2bbef1b16: Added support for an HTTPS proxy for techdocs AWS S3 requests

### Patch Changes

- 65454876fb2: Minor API report tweaks
- bf493710f50: Update to a newer version of `@trendyol-js/openstack-swift-sdk`
- bfe350ef4ce: Fixed bug that prevented deletion of stale files when non-empty directories where tried to be deleted as well.
- Updated dependencies
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/catalog-model@1.2.1
  - @backstage/integration@1.4.3
  - @backstage/config@1.0.7
  - @backstage/integration-aws-node@0.1.2
  - @backstage/plugin-search-common@1.2.2

## 1.6.0-next.2

### Patch Changes

- 65454876fb2: Minor API report tweaks
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/config@1.0.7-next.0
  - @backstage/integration@1.4.3-next.0
  - @backstage/integration-aws-node@0.1.2-next.0

## 1.6.0-next.1

### Minor Changes

- ea2bbef1b16: Added support for an HTTPS proxy for techdocs AWS S3 requests

### Patch Changes

- bfe350ef4ce: Fixed bug that prevented deletion of stale files when non-empty directories where tried to be deleted as well.
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/integration@1.4.3-next.0
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/integration-aws-node@0.1.2-next.0
  - @backstage/plugin-search-common@1.2.2-next.0

## 1.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/integration-aws-node@0.1.1
  - @backstage/plugin-search-common@1.2.1

## 1.5.0

### Minor Changes

- dd1e37649f: Deprecated getMkDocsYml in favor of getMkdocsYml (lowercase 'd')

### Patch Changes

- 87ab76e55c: Fixed bug caused by recent migration to AWS SDK V3 for techdocs-node. Instead of s3ForcePathStyle, forcePathStyle should be passed.
- 339d9a5b5c: Added support for using a default `mkdocs.yml` configuration file when none is provided
- Updated dependencies
  - @backstage/backend-common@0.18.2
  - @backstage/catalog-model@1.2.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/integration-aws-node@0.1.1
  - @backstage/plugin-search-common@1.2.1

## 1.4.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/integration-aws-node@0.1.1
  - @backstage/plugin-search-common@1.2.1

## 1.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/integration-aws-node@0.1.1
  - @backstage/plugin-search-common@1.2.1

## 1.4.6-next.0

### Patch Changes

- 87ab76e55c: Fixed bug caused by recent migration to AWS SDK V3 for techdocs-node. Instead of s3ForcePathStyle, forcePathStyle should be passed.
- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0

## 1.4.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/integration-aws-node@0.1.1
  - @backstage/catalog-model@1.1.5
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/plugin-search-common@1.2.1

## 1.4.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/integration-aws-node@0.1.1-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## 1.4.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/integration-aws-node@0.1.1-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## 1.4.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/integration-aws-node@0.1.0
  - @backstage/plugin-search-common@1.2.0

## 1.4.3

### Patch Changes

- 0a61aab172: Bump dependency @azure/identity to next minor
- e40790d0c2: Add support for specifying an S3 bucket's account ID and retrieving the credentials from the `aws` app config section. This is now the preferred way to configure AWS credentials for Techdocs.
- 37931c33ce: Upgrade to AWS SDK for Javascript v3

  Techdocs support for AWS S3 now requires defining the AWS region to connect to.
  If `techdocs.publisher.awsS3.region` is missing from the config, the AWS environment variable `AWS_REGION` will be used.

- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/integration-aws-node@0.1.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/plugin-search-common@1.2.0
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5

## 1.4.3-next.3

### Patch Changes

- e40790d0c2: Add support for specifying an S3 bucket's account ID and retrieving the credentials from the `aws` app config section. This is now the preferred way to configure AWS credentials for Techdocs.
- Updated dependencies
  - @backstage/integration-aws-node@0.1.0-next.0
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/plugin-search-common@1.2.0-next.3

## 1.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/plugin-search-common@1.2.0-next.2
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1

## 1.4.3-next.1

### Patch Changes

- 0a61aab172: Bump dependency @azure/identity to next minor
- 37931c33ce: Upgrade to AWS SDK for Javascript v3

  Techdocs support for AWS S3 now requires defining the AWS region to connect to.
  If `techdocs.publisher.awsS3.region` is missing from the config, the AWS environment variable `AWS_REGION` will be used.

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-search-common@1.1.2-next.1

## 1.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/integration@1.4.1-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0
  - @backstage/plugin-search-common@1.1.2-next.0

## 1.4.2

### Patch Changes

- a7607b5413: Replace usage of deprecataed `UrlReader.read` with `UrlReader.readUrl`.
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/integration@1.4.0
  - @backstage/catalog-model@1.1.3
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3
  - @backstage/plugin-search-common@1.1.1

## 1.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/plugin-search-common@1.1.1-next.0

## 1.4.2-next.0

### Patch Changes

- a7607b5413: Replace usage of deprecataed `UrlReader.read` with `UrlReader.readUrl`.
- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/plugin-search-common@1.1.1-next.0

## 1.4.1

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
  - @backstage/plugin-search-common@1.1.0
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/integration@1.3.2

## 1.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-search-common@1.1.0-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2

## 1.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/plugin-search-common@1.1.0-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1

## 1.4.1-next.0

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
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/plugin-search-common@1.0.2-next.0

## 1.4.0

### Minor Changes

- aa524a5377: Add `projectId` config option to GCP Cloud Storage techdocs publisher. This will allow users to override the project ID, instead of implicitly using the same one as found in a credentials bundle.

### Patch Changes

- 33ac0c0546: Fix Techdocs S3 and GCS publisher to include bucketRootPath in requests
- eadf56bbbf: Bump `git-url-parse` version to `^13.0.0`
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/integration@1.3.1
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1
  - @backstage/plugin-search-common@1.0.1

## 1.4.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/backend-common@0.15.1-next.3

## 1.4.0-next.1

### Minor Changes

- aa524a5377: Add `projectId` config option to GCP Cloud Storage techdocs publisher. This will allow users to override the project ID, instead of implicitly using the same one as found in a credentials bundle.

### Patch Changes

- 33ac0c0546: Fix Techdocs S3 and GCS publisher to include bucketRootPath in requests
- eadf56bbbf: Bump `git-url-parse` version to `^13.0.0`
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/integration@1.3.1-next.1

## 1.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/integration@1.3.1-next.0
  - @backstage/plugin-search-common@1.0.1-next.0

## 1.3.0

### Minor Changes

- ad35364e97: feat(techdocs): add edit button support for bitbucketServer

### Patch Changes

- c8196bd37d: Fix AWS S3 404 NotFound error

  When reading an object from the S3 bucket through a stream, the aws-sdk getObject() API may throw a 404 NotFound Error with no error message or, in fact, any sort of HTTP-layer error responses. These fail the @backstage/error's assertError() checks, so they must be wrapped. The test for this case was also updated to match the wrapped error message.

- f833344611: Bump default `TechDocs` image to `v1.1.0`, see the release [here](https://github.com/backstage/techdocs-container/releases/tag/v1.1.0).
- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/integration@1.3.0

## 1.3.0-next.1

### Minor Changes

- ad35364e97: feat(techdocs): add edit button support for bitbucketServer

### Patch Changes

- f833344611: Bump default `TechDocs` image to `v1.1.0`, see the release [here](https://github.com/backstage/techdocs-container/releases/tag/v1.1.0).
- Updated dependencies
  - @backstage/backend-common@0.15.0-next.1
  - @backstage/integration@1.3.0-next.1

## 1.2.1-next.0

### Patch Changes

- c8196bd37d: Fix AWS S3 404 NotFound error

  When reading an object from the S3 bucket through a stream, the aws-sdk getObject() API may throw a 404 NotFound Error with no error message or, in fact, any sort of HTTP-layer error responses. These fail the @backstage/error's assertError() checks, so they must be wrapped. The test for this case was also updated to match the wrapped error message.

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/integration@1.3.0-next.0

## 1.2.0

### Minor Changes

- 860765ff45: Added local publishing target directory `config`: `techdocs.publisher.local.publishDirectory`

### Patch Changes

- a5d73da942: Fix the flag parsing for `legacyCopyReadmeMdToIndexMd` in `techdocs-cli generate` command, and decouple it's logic from the `techdocs-ref` flag.
- d505b7b37d: Fixed issue with git feedback buttons not appearing automatically in docs pages. This was done by appending `repo_url` to the helper function `getRepoUrlFromLocationAnnotation`.
- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0
  - @backstage/plugin-search-common@1.0.0
  - @backstage/integration@1.2.2
  - @backstage/errors@1.1.0

## 1.2.0-next.3

### Patch Changes

- d505b7b37d: Fixed issue with git feedback buttons not appearing automatically in docs pages. This was done by appending repo_url to the helper function getRepoUrlFromLocationAnnotation.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/integration@1.2.2-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 1.2.0-next.2

### Patch Changes

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/integration@1.2.2-next.2

## 1.2.0-next.1

### Minor Changes

- 860765ff45: Added local publishing target directory `config`: `techdocs.publisher.local.publishDirectory`

### Patch Changes

- a5d73da942: Fix the flag parsing for `legacyCopyReadmeMdToIndexMd` in `techdocs-cli generate` command, and decouple it's logic from the `techdocs-ref` flag.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/integration@1.2.2-next.1
  - @backstage/plugin-search-common@0.3.6-next.0

## 1.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/integration@1.2.2-next.0

## 1.1.2

### Patch Changes

- f5283a42e2: Updated dependency `@google-cloud/storage` to `^6.0.0`.
- 2c048f8b90: Updated deprecated use of `express`' `res.redirect()` method when handling legacy path casing.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.5
  - @backstage/backend-common@0.14.0
  - @backstage/integration@1.2.1
  - @backstage/catalog-model@1.0.3

## 1.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@0.3.5-next.1
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/integration@1.2.1-next.2

## 1.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-search-common@0.3.5-next.0

## 1.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0

## 1.1.1

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- c2a1d8935e: Updated the default version of the `@spotify/techdocs` container used when `techdocs.generator.runIn` is `docker` to `v1.0.3`.
- b26f4cb6a1: Allow usage of custom tags with sequence node type (such as the !ENV tag) in the techdocs mkdocs config.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/integration@1.2.0
  - @backstage/config@1.0.1
  - @backstage/plugin-search-common@0.3.4
  - @backstage/catalog-model@1.0.2

## 1.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.4-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/integration@1.2.0-next.1

## 1.1.1-next.0

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- b26f4cb6a1: Allow usage of custom tags with sequence node type (such as the !ENV tag) in the techdocs mkdocs config.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/integration@1.2.0-next.0

## 1.1.0

### Minor Changes

- bcf1a2496c: Removed an undocumented, broken behavior where `README.md` files would be copied to `index.md` if it did not exist, leading to broken links in the TechDocs UI.

### Patch Changes

- 9fa68705bf: The default container version used to generate TechDocs content is now `v1.0.2`.
- Updated dependencies
  - @backstage/integration@1.1.0
  - @backstage/catalog-model@1.0.1
  - @backstage/plugin-search-common@0.3.3
  - @backstage/backend-common@0.13.2

## 1.1.0-next.2

### Minor Changes

- bcf1a2496c: BREAKING: The default Techdocs behavior will no longer attempt to copy `docs/README.md` or `README.md` to `docs/index.md` (if not found). To retain this behavior in your instance, you can set the following config in your `app-config.yaml`:

  ```yaml
  techdocs:
    generator:
      mkdocs:
        legacyCopyReadmeMdToIndexMd: true
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/integration@1.1.0-next.2

## 1.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.1.0-next.1
  - @backstage/backend-common@0.13.2-next.1
  - @backstage/plugin-search-common@0.3.3-next.1

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.3-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/integration@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Minor Changes

- 700d93ff41: - `DirectoryPreparer` now uses private constructor. Use static fromConfig method to instantiate.
  - `UrlPreparer` now uses private constructor. Use static fromConfig method to instantiate.

### Patch Changes

- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/plugin-search-common@0.3.2

## 0.11.12

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- cea6f10b97: Renamed `@backstage/techdocs-common` to `@backstage/plugin-techdocs-node`.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-search-common@0.3.1

## 0.11.12-next.0

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- cea6f10b97: Renamed `@backstage/techdocs-common` to `@backstage/plugin-techdocs-node`.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-search-common@0.3.1-next.0

## 0.11.11

### Patch Changes

- 955be6bc7d: adds passing projectID to the Storage client
- ff0a16fb1a: Modify techdocs builder to automatically append techdocs-core plugin to mkdocs.yaml file if it is missing. Adds an optional configuration item if this plugin needs to be omitted.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/backend-common@0.12.0
  - @backstage/integration@0.8.0
  - @backstage/search-common@0.3.0

## 0.11.10

### Patch Changes

- 209fd128e6: Updated usage of `github:` location types in docs to use `url:` instead.
- 13ef228d03: Clean up the API interface for TechDocs common library.
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/catalog-model@0.11.0
  - @backstage/integration@0.7.5

## 0.11.9

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/integration@0.7.4
  - @backstage/search-common@0.2.4

## 0.11.8

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 216725b434: Updated to use new names for `parseLocationRef` and `stringifyLocationRef`
- 7aeb491394: Replace use of deprecated `ENTITY_DEFAULT_NAMESPACE` constant with `DEFAULT_NAMESPACE`.
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/errors@0.2.1
  - @backstage/integration@0.7.3
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/search-common@0.2.3

## 0.11.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.11.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.11.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.11.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.11.5

### Patch Changes

- ff93fbeeec: Fix interpolated string for "Failed to generate docs from ..."
- Updated dependencies
  - @backstage/search-common@0.2.2
  - @backstage/backend-common@0.10.5

## 0.11.4

### Patch Changes

- 47277c0d8c: Updated the default version of the `@spotify/techdocs` container used when `techdocs.generator.runIn` is `docker` to `v0.3.6`, which includes an update to `mkdocs-monorepo-plugin` that allows glob-based wildcard includes.
- Updated dependencies
  - @backstage/integration@0.7.2
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10

## 0.11.4-next.0

### Patch Changes

- 47277c0d8c: Updated the default version of the `@spotify/techdocs` container used when `techdocs.generator.runIn` is `docker` to `v0.3.6`, which includes an update to `mkdocs-monorepo-plugin` that allows glob-based wildcard includes.
- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/integration@0.7.2-next.0

## 0.11.3

### Patch Changes

- 5333451def: Cleaned up API exports
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/integration@0.7.1
  - @backstage/backend-common@0.10.3
  - @backstage/errors@0.2.0
  - @backstage/catalog-model@0.9.9

## 0.11.2

### Patch Changes

- c2c8768771: Bump `@azure/identity` from `^1.5.0` to `^2.0.1`.
- Updated dependencies
  - @backstage/backend-common@0.10.1
  - @backstage/integration@0.7.0

## 0.11.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0

## 0.11.0

### Minor Changes

- 1bada775a9: Added the ability for the TechDocs Backend to (optionally) leverage a cache
  store to improve performance when reading files from a cloud storage provider.

### Patch Changes

- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/backend-common@0.9.13

## 0.10.8

### Patch Changes

- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/backend-common@0.9.11

## 0.10.7

### Patch Changes

- 0b60a051c9: Added OpenStack Swift case migration support.
- 9e64a7ac1e: Allow amazon web services s3 buckets to pass an server side encryption configuration so they can publish to encrypted buckets
- Updated dependencies
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10

## 0.10.6

### Patch Changes

- a2d4389587: 1. Techdocs publisher constructors now use parameter objects when being
  instantiated

  2. Internal refactor of `LocalPublish` publisher to use `fromConfig` for
     creation to be aligned with other publishers; this does not impact
     `LocalPublish` usage.

  ```diff
  - const publisher = new LocalPublish(config, logger, discovery);
  + const publisher = LocalPublish.fromConfig(config, logger, discovery);
  ```

- 6129c89a47: Default TechDocs container used at docs generation-time is now [v0.3.5](https://github.com/backstage/techdocs-container/releases/tag/v0.3.5).
- f3c7eec64b: Updated to properly join URL segments under any OS for both AWS S3 and GCP
- Updated dependencies
  - @backstage/backend-common@0.9.9

## 0.10.5

### Patch Changes

- d207f6ee9e: Support optional bucketRootPath configuration parameter in S3 and GCS publishers
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/backend-common@0.9.8
  - @backstage/catalog-model@0.9.6
  - @backstage/search-common@0.2.1

## 0.10.4

### Patch Changes

- 87f5b9db13: Use docs/README.md or README.md as fallback if docs/index.md is missing
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/backend-common@0.9.7
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.10.3

### Patch Changes

- 156421c59a: Sets the default techdocs docker image to the [latest released version - v0.3.3](https://github.com/backstage/techdocs-container/releases/tag/v0.3.3).
- Updated dependencies
  - @backstage/catalog-model@0.9.4
  - @backstage/backend-common@0.9.6
  - @backstage/integration@0.6.7

## 0.10.2

### Patch Changes

- 1c75e8bf98: Add more context to techdocs log lines when files are not found along with
  ensuring that the routers return 404 with a descriptive message.
- e92f0f728b: Locks the version of the default docker image used to generate TechDocs. As of
  this changelog entry, it is v0.3.2!
- Updated dependencies
  - @backstage/backend-common@0.9.5
  - @backstage/integration@0.6.6

## 0.10.1

### Patch Changes

- 96fef17a18: Upgrade git-parse-url to v11.6.0
- Updated dependencies
  - @backstage/backend-common@0.9.3
  - @backstage/integration@0.6.4

## 0.10.0

### Minor Changes

- 8b0f6f860: Set the correct `edit_uri` or `repo_url` for documentation pages that are hosted on GitHub and GitLab.

  The constructor of the `TechDocsGenerator` changed.
  Prefer the use of `TechdocsGenerator.fromConfig(…)` instead:

  ```diff
  - const techdocsGenerator = new TechdocsGenerator({
  + const techdocsGenerator = TechdocsGenerator.fromConfig(config, {
      logger,
      containerRunner,
  -   config,
    });
  ```

### Patch Changes

- 30ed662a3: Adding in-context search to TechDocs Reader component. Using existing search-backend to query for indexed search results scoped into a specific entity's techdocs. Needs TechDocsCollator enabled on the backend to work.

  Adding extra information to indexed tech docs documents for search.

- 3624616e7: "Local" (out-of-the-box) publisher explicitly follows lower-case entity triplet
  logic.
- 67ba7e088: Only write the updated `mkdocs.yml` file if the content was updated.

  This keeps local files unchanged if the `dir` annotation is used in combination with the `file` location.

- 8eab6be6a: Force using `posix` path for cloud storage
- Updated dependencies
  - @backstage/integration@0.6.3
  - @backstage/search-common@0.2.0
  - @backstage/catalog-model@0.9.1
  - @backstage/backend-common@0.9.1

## 0.9.0

### Minor Changes

- 58452cdb7: OpenStack Swift Client changed with Trendyol's OpenStack Swift SDK.

  ## Migration from old OpenStack Swift Configuration

  Let's assume we have the old OpenStack Swift configuration here.

  ```yaml
  techdocs:
    publisher:
      type: 'openStackSwift'
      openStackSwift:
        containerName: 'name-of-techdocs-storage-bucket'
        credentials:
          username: ${OPENSTACK_SWIFT_STORAGE_USERNAME}
          password: ${OPENSTACK_SWIFT_STORAGE_PASSWORD}
        authUrl: ${OPENSTACK_SWIFT_STORAGE_AUTH_URL}
        keystoneAuthVersion: ${OPENSTACK_SWIFT_STORAGE_AUTH_VERSION}
        domainId: ${OPENSTACK_SWIFT_STORAGE_DOMAIN_ID}
        domainName: ${OPENSTACK_SWIFT_STORAGE_DOMAIN_NAME}
        region: ${OPENSTACK_SWIFT_STORAGE_REGION}
  ```

  ##### Step 1: Change the credential keys

  Since the new SDK uses _Application Credentials_ to authenticate OpenStack, we
  need to change the keys `credentials.username` to `credentials.id`,
  `credentials.password` to `credentials.secret` and use Application Credential ID
  and secret here. For more detail about credentials look
  [here](https://docs.openstack.org/api-ref/identity/v3/?expanded=password-authentication-with-unscoped-authorization-detail,authenticating-with-an-application-credential-detail#authenticating-with-an-application-credential).

  ##### Step 2: Remove the unused keys

  Since the new SDK doesn't use the old way authentication, we don't need the keys
  `openStackSwift.keystoneAuthVersion`, `openStackSwift.domainId`,
  `openStackSwift.domainName` and `openStackSwift.region`. So you can remove them.

  ##### Step 3: Add Swift URL

  The new SDK needs the OpenStack Swift connection URL for connecting the Swift.
  So you need to add a new key called `openStackSwift.swiftUrl` and give the
  OpenStack Swift url here. Example url should look like that:
  `https://example.com:6780/swift/v1`

  ##### That's it!

  Your new configuration should look like that!

  ```yaml
  techdocs:
    publisher:
      type: 'openStackSwift'
      openStackSwift:
        containerName: 'name-of-techdocs-storage-bucket'
        credentials:
          id: ${OPENSTACK_SWIFT_STORAGE_APPLICATION_CREDENTIALS_ID}
          secret: ${OPENSTACK_SWIFT_STORAGE_APPLICATION_CREDENTIALS_SECRET}
        authUrl: ${OPENSTACK_SWIFT_STORAGE_AUTH_URL}
        swiftUrl: ${OPENSTACK_SWIFT_STORAGE_SWIFT_URL}
  ```

- c772d9a84: TechDocs sites can now be accessed using paths containing entity triplets of
  any case (e.g. `/docs/namespace/KIND/name` or `/docs/namespace/kind/name`).

  If you do not use an external storage provider for serving TechDocs, this is a
  transparent change and no action is required from you.

  If you _do_ use an external storage provider for serving TechDocs (one of\* GCS,
  AWS S3, or Azure Blob Storage), you must run a migration command against your
  storage provider before updating.

  [A migration guide is available here](https://backstage.io/docs/features/techdocs/how-to-guides#how-to-migrate-from-techdocs-alpha-to-beta).

  - (\*) We're seeking help from the community to bring OpenStack Swift support
    [to feature parity](https://github.com/backstage/backstage/issues/6763) with the above.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/integration@0.6.2
  - @backstage/config@0.1.8

## 0.8.1

### Patch Changes

- bc405be6e: Stale TechDocs content (files that had previously been published but which have
  since been removed) is now removed from storage at publish-time. This is now
  supported by the following publishers:

  - Google GCS
  - AWS S3
  - Azure Blob Storage

  You may need to apply a greater level of permissions (e.g. the ability to
  delete objects in your storage provider) to any credentials/accounts used by
  the TechDocs CLI or TechDocs backend in order for this change to take effect.

  For more details, see [#6132][issue-ref].

  [issue-ref]: https://github.com/backstage/backstage/issues/6132

- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/backend-common@0.8.9

## 0.8.0

### Minor Changes

- 48ea3d25b: TechDocs has dropped all support for the long-ago deprecated git-based common
  prepares as well as all corresponding values in `backstage.io/techdocs-ref`
  annotations.

  Entities whose `backstage.io/techdocs-ref` annotation values still begin with
  `github:`, `gitlab:`, `bitbucket:`, or `azure/api:` will no longer be generated
  by TechDocs. Be sure to update these values so that they align with their
  expected format and your usage of TechDocs.

  For details, see [this explainer on TechDocs ref annotation values][how].

  [how]: https://backstage.io/docs/features/techdocs/how-to-guides#how-to-understand-techdocs-ref-annotation-values

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.8.8
  - @backstage/config@0.1.6
  - @backstage/integration@0.5.9

## 0.7.1

### Patch Changes

- 59a5fa319: Migrated files are now printed when `techdocs-cli migrate` is run with the
  `--verbose` flag set.
- 54356336e: TechDocs generator stage now supports `mkdocs.yaml` file, in addition to `.yml`
  depending on whichever is present at the time of generation. (Assumes the
  latest `spotify/techdocs` container, running mkdocs `v1.2.2` or greater).

## 0.7.0

### Minor Changes

- d32d01e5b: Improve the annotation `backstage.io/techdocs-ref: dir:<relative-target>` that links to a path that is relative to the source of the annotated entity.
  This annotation works with the basic and the recommended flow, however, it will be most useful with the basic approach.

  This change remove the deprecation of the `dir` reference and provides first-class support for it.
  In addition, this change removes the support of the deprecated `github`, `gitlab`, and `azure/api` locations from the `dir` reference preparer.

  #### Example Usage

  The annotation is convenient if the documentation is stored in the same location, i.e. the same git repository, as the `catalog-info.yaml`.
  While it is still supported to add full URLs such as `backstage.io/techdocs-ref: url:https://...` for custom setups, documentation is mostly stored in the same repository as the entity definition.
  By automatically resolving the target relative to the registration location of the entity, the configuration overhead for this default setup is minimized.
  Since it leverages the `@backstage/integrations` package for the URL resolution, this is compatible with every supported source.

  Consider the following examples:

  1. "I have a repository with a single `catalog-info.yaml` and a TechDocs page in the root folder!"

  ```
  https://github.com/backstage/example/tree/main/
   |- catalog-info.yaml
   |  > apiVersion: backstage.io/v1alpha1
   |  > kind: Component
   |  > metadata:
   |  >   name: example
   |  >   annotations:
   |  >     backstage.io/techdocs-ref: dir:. # -> same folder
   |  > spec: {}
   |- docs/
   |- mkdocs.yml
  ```

  2. "I have a repository with a single `catalog-info.yaml` and my TechDocs page in located in a folder!"

  ```
  https://bitbucket.org/my-owner/my-project/src/master/
   |- catalog-info.yaml
   |  > apiVersion: backstage.io/v1alpha1
   |  > kind: Component
   |  > metadata:
   |  >   name: example
   |  >   annotations:
   |  >     backstage.io/techdocs-ref: dir:./some-folder # -> subfolder
   |  > spec: {}
   |- some-folder/
     |- docs/
     |- mkdocs.yml
  ```

  3. "I have a mono repository that hosts multiple components!"

  ```
  https://dev.azure.com/organization/project/_git/repository
   |- my-1st-module/
     |- catalog-info.yaml
     |  > apiVersion: backstage.io/v1alpha1
     |  > kind: Component
     |  > metadata:
     |  >   name: my-1st-module
     |  >   annotations:
     |  >     backstage.io/techdocs-ref: dir:. # -> same folder
     |  > spec: {}
     |- docs/
     |- mkdocs.yml
   |- my-2nd-module/
     |- catalog-info.yaml
     |  > apiVersion: backstage.io/v1alpha1
     |  > kind: Component
     |  > metadata:
     |  >   name: my-2nd-module
     |  >   annotations:
     |  >     backstage.io/techdocs-ref: dir:. # -> same folder
     |  > spec: {}
     |- docs/
     |- mkdocs.yml
   |- catalog-info.yaml
   |  > apiVersion: backstage.io/v1alpha1
   |  > kind: Location
   |  > metadata:
   |  >   name: example
   |  > spec:
   |  >   targets:
   |  >     - ./*/catalog-info.yaml
  ```

### Patch Changes

- 6e5aed1c9: Fix validation of mkdocs.yml docs_dir
- 250984333: Add link to https://backstage.io/docs/features/techdocs/configuration in the log warning message about updating techdocs.generate key.
- Updated dependencies
  - @backstage/backend-common@0.8.7

## 0.6.8

### Patch Changes

- d5eaab91d: Adds custom docker image support to the techdocs generator. This change adds a new `techdocs.generator` configuration key and deprecates the existing `techdocs.generators.techdocs` key.

  ```yaml
  techdocs:
    # recommended, going forward:
    generator:
      runIn: 'docker' # or 'local'
      # New optional settings
      dockerImage: my-org/techdocs # use a custom docker image
      pullImage: false # disable automatic pulling of image (e.g. if custom docker login is required)
    # legacy (deprecated):
    generators:
      techdocs: 'docker' # or 'local'
  ```

- c18e8eb91: Provide optional `logger: Logger` and `logStream: Writable` arguments to the `GeneratorBase#run(...)` command.
  They receive all log messages that are emitted during the generator run.
- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6

## 0.6.7

### Patch Changes

- 683308ecf: Fix openStack swift publisher encoding issue. Remove utf8 forced encoding on binary files
- 6841e0113: fix minor version of git-url-parse as 11.5.x introduced a bug for Bitbucket Server
- Updated dependencies
  - @backstage/integration@0.5.8
  - @backstage/catalog-model@0.9.0
  - @backstage/backend-common@0.8.5

## 0.6.6

### Patch Changes

- ab5cc376f: Use new utilities from `@backstage/backend-common` for safely resolving child paths
- b47fc34bc: Update "service catalog" references to "software catalog"
- Updated dependencies
  - @backstage/backend-common@0.8.4
  - @backstage/integration@0.5.7

## 0.6.5

### Patch Changes

- c17c0fcf9: Adding additional checks on tech docs to prevent folder traversal via mkdocs.yml docs_dir value.
- Updated dependencies
  - @backstage/catalog-model@0.8.4

## 0.6.4

### Patch Changes

- aad98c544: Fixes multiple XSS and sanitization bypass vulnerabilities in TechDocs.
- 090594755: Support parsing `mkdocs.yml` files that are using custom yaml tags like
  `!!python/name:materialx.emoji.twemoji`.
- Updated dependencies [ebe802bc4]
- Updated dependencies [49d7ec169]
  - @backstage/catalog-model@0.8.1
  - @backstage/integration@0.5.5

## 0.6.3

### Patch Changes

- 8cefadca0: Adding validation to mkdocs.yml parsing to prevent directory tree traversing
- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/integration@0.5.4
  - @backstage/catalog-model@0.8.0

## 0.6.2

### Patch Changes

- 65e6c4541: Remove circular dependencies
- Updated dependencies [f7f7783a3]
- Updated dependencies [c7dad9218]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5001de908]
  - @backstage/catalog-model@0.7.10
  - @backstage/backend-common@0.8.1
  - @backstage/integration@0.5.3

## 0.6.1

### Patch Changes

- e04f1ccfb: Fixed a bug that prevented loading static assets from GCS, S3, Azure, and OpenStackSwift whose keys contain spaces or other special characters.
- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9

## 0.6.0

### Minor Changes

- e0bfd3d44: Migrate the package to use the `ContainerRunner` interface instead of `runDockerContainer(…)`.
  It also no longer provides the `ContainerRunner` as an input to the `GeneratorBase#run(…)` function, but expects it as a constructor parameter instead.

  If you use the `TechdocsGenerator` you need to update the usage:

  ```diff
  + const containerRunner = new DockerContainerRunner({ dockerClient });

  - const generator = new TechdocsGenerator(logger, config);
  + const techdocsGenerator = new TechdocsGenerator({
  +   logger,
  +   containerRunner,
  +   config,
  + });

    await this.generator.run({
      inputDir: preparedDir,
      outputDir,
  -   dockerClient: this.dockerClient,
      parsedLocationAnnotation,
      etag: newEtag,
    });
  ```

### Patch Changes

- e9e56b01a: Adding optional config to enable S3-like API for tech-docs using s3ForcePathStyle option.
  This allows providers like LocalStack, Minio and Wasabi (+possibly others) to be used to host tech docs.
- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/integration@0.5.2
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.5.1

### Patch Changes

- f4af06ebe: Gracefully handle HTTP request failures in download method of AzureBlobStorage publisher.

## 0.5.0

### Minor Changes

- bc9d62f4f: Move the confidence checks of the publisher configurations to a dedicated `PublisherBase#getReadiness()` method instead of throwing an error when doing `Publisher.fromConfig(...)`.
  You should include the check when your backend to get early feedback about a potential misconfiguration:

  ```diff
    // packages/backend/src/plugins/techdocs.ts

    export default async function createPlugin({
      logger,
      config,
      discovery,
      reader,
    }: PluginEnvironment): Promise<Router> {
      // ...

      const publisher = await Publisher.fromConfig(config, {
        logger,
        discovery,
      })

  +   // checks if the publisher is working and logs the result
  +   await publisher.getReadiness();

      // Docker client (conditionally) used by the generators, based on techdocs.generators config.
      const dockerClient = new Docker();

      // ...
  }
  ```

  If you want to crash your application on invalid configurations, you can throw an `Error` to preserve the old behavior.
  Please be aware that this is not the recommended for the use in a Backstage backend but might be helpful in CLI tools such as the `techdocs-cli`.

  ```ts
  const publisher = await Publisher.fromConfig(config, {
    logger,
    discovery,
  });

  const ready = await publisher.getReadiness();
  if (!ready.isAvailable) {
    throw new Error('Invalid TechDocs publisher configuration');
  }
  ```

### Patch Changes

- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
  - @backstage/catalog-model@0.7.7

## 0.4.5

### Patch Changes

- 8686eb38c: Use errors from `@backstage/errors`
- 424742dc1: Applies only if you use TechDocs local builder instead of building on CI/CD i.e. if `techdocs.builder` in your `app-config.yaml` is set to `'local'`

  Improvements

  1. Do not check for updates in the repository if a check has been made in the last 60 seconds. This is to prevent the annoying check for update on every page switch or load.
  2. No need to maintain an in-memory etag storage, and use the one stored in `techdocs_metadata.json` file alongside generated docs.

  New feature

  1. You can now use a mix of basic and recommended setup i.e. `techdocs.builder` is `'local'` but using an external cloud storage instead of local storage. Previously, in this setup, the docs would never get updated.

- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.4.4

### Patch Changes

- d7245b733: Remove runDockerContainer, and start using the utility function provided by @backstage/backend-common
- 0b42fff22: Make use of parseLocationReference/stringifyLocationReference
- 2ef5bc7ea: Implement proper AWS Credentials precedence with assume-role and explicit credentials
- aa095e469: OpenStack Swift publisher added for tech-docs.
- bc46435f5: - Improve deprecation warning messaging in logs.
  - Replace temp folder path from git provider domain(`source`) to full git host name (`resource`). (See: https://github.com/IonicaBizau/git-url-parse#giturlparseurl)
- a501128db: Refactor log messaging to improve clarity
- ca4a904f6: Add an optional configuration option for setting the url endpoint for AWS S3 publisher: `techdocs.publisher.awsS3.endpoint`
- Updated dependencies [277644e09]
- Updated dependencies [52f613030]
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [905cbfc96]
- Updated dependencies [761698831]
- Updated dependencies [d4e77ec5f]
  - @backstage/integration@0.5.1
  - @backstage/backend-common@0.5.6
  - @backstage/catalog-model@0.7.4

## 0.4.3

### Patch Changes

- f43192207: remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
- 61299519f: Remove read-store-upload loop when uploading S3 objects for TechDocs
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5

## 0.4.2

### Patch Changes

- 2499f6cde: Add support for assuming role in AWS integrations
- 1e4ddd71d: Fix AWS, GCS and Azure publisher to work on Windows.
- Updated dependencies [bad21a085]
- Updated dependencies [a1f5e6545]
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.4.1

### Patch Changes

- fb28da212: Switched to using `'x-access-token'` for authenticating Git over HTTPS towards GitHub.
- 26e143e60: After TechDocs generate step, insert build timestamp to techdocs_metadata.json
- c6655413d: Improved error reporting in AzureBlobStorage to surface errors when fetching metadata and uploading files fails.
- 44414239f: Pass user and group ID when invoking docker container. When TechDocs invokes Docker, docker could be run as a `root` user which results in generation of files by applications run by non-root user (e.g. TechDocs) will not have access to modify. This PR passes in current user and group ID to docker so that the file permissions of the generated files and folders are correct.
- b0a41c707: Add etag of the prepared file tree to techdocs_metadata.json in the storage
- Updated dependencies [16fb1d03a]
- Updated dependencies [491f3a0ec]
- Updated dependencies [491f3a0ec]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
  - @backstage/backend-common@0.5.4
  - @backstage/integration@0.5.0

## 0.4.0

### Minor Changes

- 08142b256: URL Preparer will now use proper etag based caching introduced in https://github.com/backstage/backstage/pull/4120. Previously, builds used to be cached for 30 minutes.

### Patch Changes

- 77ad0003a: Revert AWS SDK version to v2
- 08142b256: TechDocs will throw warning in backend logs when legacy git preparer or dir preparer is used to preparer docs. Migrate to URL Preparer by updating `backstage.io/techdocs-ref` annotation to be prefixed with `url:`.
  Detailed docs are here https://backstage.io/docs/features/techdocs/how-to-guides#how-to-use-url-reader-in-techdocs-prepare-step
  See benefits and reason for doing so https://github.com/backstage/backstage/issues/4409
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [5a5163519]
  - @backstage/backend-common@0.5.3
  - @backstage/integration@0.4.0

## 0.3.7

### Patch Changes

- c777df180: 1. Added option to use Azure Blob Storage as a choice to store the static generated files for TechDocs.
- e44925723: `techdocs.requestUrl` and `techdocs.storageUrl` are now optional configs and the discovery API will be used to get the URL where techdocs plugin is hosted.
- f0320190d: dir preparer will use URL Reader in its implementation.
- Updated dependencies [c4abcdb60]
- Updated dependencies [2430ee7c2]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [064c513e1]
- Updated dependencies [7881f2117]
- Updated dependencies [3149bfe63]
- Updated dependencies [2e62aea6f]
- Updated dependencies [11cb5ef94]
  - @backstage/integration@0.3.2
  - @backstage/backend-common@0.5.2
  - @backstage/catalog-model@0.7.1

## 0.3.6

### Patch Changes

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- db2328c88: Add rate limiter for concurrent execution of file uploads in AWS and Google publishers
- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [6800da78d]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1
  - @backstage/integration@0.3.1

## 0.3.5

### Patch Changes

- 53c9c51f2: TechDocs backend now streams files through from Google Cloud Storage to the browser, improving memory usage.
- a5e27d5c1: Create type for TechDocsMetadata (#3716)

  This change introduces a new type (TechDocsMetadata) in packages/techdocs-common. This type is then introduced in the endpoint response in techdocs-backend and in the api interface in techdocs (frontend).

- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [fa8ba330a]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [ed6baab66]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0
  - @backstage/integration@0.3.0

## 0.3.4

### Patch Changes

- a594a7257: @backstage/techdocs-common can now be imported in an environment without @backstage/plugin-techdocs-backend being installed.

## 0.3.3

### Patch Changes

- 68ad5af51: Improve techdocs-common Generator API for it to be used by techdocs-cli. TechDocs generator.run function now takes
  an input AND an output directory. Most probably you use techdocs-common via plugin-techdocs-backend, and so there
  is no breaking change for you.
  But if you use techdocs-common separately, you need to create an output directory and pass into the generator.
- 371f67ecd: fix to-string breakage of binary files
- f1e74777a: Fix bug where binary files (`png`, etc.) could not load when using AWS or GCS publisher.
- dbe4450c3: Google Cloud authentication in TechDocs has been improved.

  1. `techdocs.publisher.googleGcs.credentials` is now optional. If it is missing, `GOOGLE_APPLICATION_CREDENTIALS`
     environment variable (and some other methods) will be used to authenticate.
     Read more here https://cloud.google.com/docs/authentication/production

  2. `techdocs.publisher.googleGcs.projectId` is no longer used. You can remove it from your `app-config.yaml`.

- 5826d0973: AWS SDK version bump for TechDocs.
- b3b9445df: AWS S3 authentication in TechDocs has been improved.

  1. `techdocs.publisher.awsS3.bucketName` is now the only required config. `techdocs.publisher.awsS3.credentials` and `techdocs.publisher.awsS3.region` are optional.

  2. If `techdocs.publisher.awsS3.credentials` and `techdocs.publisher.awsS3.region` are missing, the AWS environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_REGION` will be used. There are more better ways of setting up AWS authentication. Read the guide at https://backstage.io/docs/features/techdocs/using-cloud-storage

- Updated dependencies [466354aaa]
- Updated dependencies [f3b064e1c]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/integration@0.2.0
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.3.2

### Patch Changes

- 7ec525481: 1. Added option to use AWS S3 as a choice to store the static generated files for TechDocs.
- f8ba88ded: Fix for `integration.github.apiBaseUrl` configuration not properly overriding apiBaseUrl used by techdocs
- 00042e73c: Moving the Git actions to isomorphic-git instead of the node binding version of nodegit
- Updated dependencies [5ecd50f8a]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/backend-common@0.4.2
  - @backstage/integration@0.1.5

## 0.3.1

### Patch Changes

- 8804e8981: Using @backstage/integration package for GitHub/GitLab/Azure tokens and request options.

  Most probably you do not have to make any changes in the app because of this change.
  However, if you are using the `DirectoryPreparer` or `CommonGitPreparer` exported by
  `@backstage/techdocs-common` package, you now need to add pass in a `config` (from `@backstage/config`)
  instance as argument.

  ```
  <!-- Before -->
      const directoryPreparer = new DirectoryPreparer(logger);
      const commonGitPreparer = new CommonGitPreparer(logger);
  <!-- Now -->
      const directoryPreparer = new DirectoryPreparer(config, logger);
      const commonGitPreparer = new CommonGitPreparer(config, logger);
  ```

## 0.3.0

### Minor Changes

- a8573e53b: techdocs-backend: Simplified file, removing individual preparers and generators.
  techdocs-backend: UrlReader is now available to use in preparers.

  In your Backstage app, `packages/backend/plugins/techdocs.ts` file has now been simplified,
  to remove registering individual preparers and generators.

  Please update the file when upgrading the version of `@backstage/plugin-techdocs-backend` package.

  ```typescript
  const preparers = await Preparers.fromConfig(config, {
    logger,
    reader,
  });

  const generators = await Generators.fromConfig(config, {
    logger,
  });

  const publisher = await Publisher.fromConfig(config, {
    logger,
    discovery,
  });
  ```

  You should be able to remove unnecessary imports, and just do

  ```typescript
  import {
    createRouter,
    Preparers,
    Generators,
    Publisher,
  } from '@backstage/plugin-techdocs-backend';
  ```

## 0.2.0

### Minor Changes

- dae4f3983: _Breaking changes_

  1. Added option to use Google Cloud Storage as a choice to store the static generated files for TechDocs.
     It can be configured using `techdocs.publisher.type` option in `app-config.yaml`.
     Step-by-step guide to configure GCS is available here https://backstage.io/docs/features/techdocs/using-cloud-storage
     Set `techdocs.publisher.type` to `'local'` if you want to continue using local filesystem to store TechDocs files.

  2. `techdocs.builder` is now required and can be set to `'local'` or `'external'`. (Set it to `'local'` for now, since CI/CD build
     workflow for TechDocs will be available soon (in few weeks)).
     If builder is set to 'local' and you open a TechDocs page, `techdocs-backend` will try to generate the docs, publish to storage and
     show the generated docs afterwords.
     If builder is set to `'external'`, `techdocs-backend` will only fetch the docs and will NOT try to generate and publish. In this case of `'external'`,
     we assume that docs are being built in the CI/CD pipeline of the repository.
     TechDocs will not assume a default value for `techdocs.builder`. It is better to explicitly define it in the `app-config.yaml`.

  3. When configuring TechDocs in your backend, there is a difference in how a new publisher is created.

  ```
  ---  const publisher = new LocalPublish(logger, discovery);
  +++  const publisher = Publisher.fromConfig(config, logger, discovery);
  ```

  Based on the config `techdocs.publisher.type`, the publisher could be either Local publisher or Google Cloud Storage publisher.

  4. `techdocs.storageUrl` is now a required config. Should be `http://localhost:7007/api/techdocs/static/docs` in most setups.

  5. Parts of `@backstage/plugin-techdocs-backend` have been moved to a new package `@backstage/techdocs-common` to generate docs. Also to publish docs
     to-and-fro between TechDocs and a storage (either local or external). However, a Backstage app does NOT need to import the `techdocs-common` package -
     app should only import `@backstage/plugin-techdocs` and `@backstage/plugin-techdocs-backend`.

  _Patch changes_

  1. See all of TechDocs config options and its documentation https://backstage.io/docs/features/techdocs/configuration

  2. Logic about serving static files and metadata retrieval have been abstracted away from the router in `techdocs-backend` to the instance of publisher.

  3. Removed Material UI Spinner from TechDocs header. Spinners cause unnecessary UX distraction.
     Case 1 (when docs are built and are to be served): Spinners appear for a split second before the name of site shows up. This unnecessarily distracts eyes because spinners increase the size of the Header. A dot (.) would do fine. Definitely more can be done.
     Case 2 (when docs are being generated): There is already a linear progress bar (which is recommended in Storybook).

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/backend-common@0.4.1
