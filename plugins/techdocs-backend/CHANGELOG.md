# @backstage/plugin-techdocs-backend

## 2.4.1-next.0

### Patch Changes

- 4d7a3fe: Clarified in the config schema which `techdocs.generator.mkdocs` settings also apply to the Zensical engine: `legacyCopyReadmeMdToIndexMd`, `dangerouslyAllowAdditionalKeys` and `dangerouslyAllowAdditionalPlugins`.
- Updated dependencies
  - @backstage/plugin-techdocs-node@2.2.0-next.0
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 2.4.0

### Minor Changes

- 4d4f987: Add engine abstraction layer for multi-engine TechDocs support. Introduces `--engine` flag, engine config map, generator registry with `backstage.io/techdocs-engine` annotation support, `engine` field in `techdocs_metadata.json`, `serve:raw` command, and live-reload adapter interface. MkDocs remains the default with no behavior change.

  The built-in generator is now registered under `mkdocs`; the previous `techdocs` key is kept as an alias, so existing `generators.register('techdocs', ...)` calls continue to work. The CLI's `--engine` flag takes precedence over the `backstage.io/techdocs-engine` annotation for all commands, and `serve:mkdocs` and the `--mkdocs-parameter-*` flags now print deprecation warnings.

- 45b0b89: Added a `get-techdocs-metadata` action to the TechDocs backend plugin, registered with the Actions Registry Service (alpha).

### Patch Changes

- 685aee1: Fixed TechDocs asset caching on reused HTTP connections to avoid listener leaks and cross-request response corruption. Existing cached assets are refreshed automatically.
- Updated dependencies
  - @backstage/integration@2.1.3
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/plugin-techdocs-node@2.1.0
  - @backstage/catalog-client@1.16.3
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/plugin-techdocs-common@0.1.2
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-catalog-node@2.2.6

## 2.4.0-next.2

### Minor Changes

- 45b0b89: Added a `get-techdocs-metadata` action to the TechDocs backend plugin, registered with the Actions Registry Service (alpha).

### Patch Changes

- 685aee1: Fixed TechDocs asset caching on reused HTTP connections to avoid listener leaks and cross-request response corruption. Existing cached assets are refreshed automatically.
- Updated dependencies
  - @backstage/plugin-techdocs-node@2.0.3-next.2
  - @backstage/integration@2.1.3-next.1
  - @backstage/plugin-techdocs-common@0.1.2-next.0

## 2.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-techdocs-node@2.0.2-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1

## 2.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-techdocs-node@2.0.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## 2.3.0

### Minor Changes

- ee97130: Added support for `techdocs.generator.pullOptions` when pulling the TechDocs generator Docker image from private registries that require authentication.
- 62d1a6f: Added `techdocs.generator.mkdocs.dangerouslyAllowAdditionalPlugins` configuration option, allowing operators to extend the set of permitted MkDocs plugins during TechDocs generation.

### Patch Changes

- 932986c: Improve validation of TechDocs static content paths.
- 736d84e: Use locale-insensitive Unicode casing for consistent string handling across environments.
- 1b0e277: Improved path validation for TechDocs content serving.
- Updated dependencies
  - @backstage/integration@2.1.2
  - @backstage/catalog-client@1.16.2
  - @backstage/catalog-model@1.10.1
  - @backstage/plugin-techdocs-node@2.0.0
  - @backstage/config@1.3.9
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5

## 2.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.16.0-next.1
  - @backstage/config@1.3.9-next.0
  - @backstage/catalog-client@1.16.2-next.1
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/integration@2.1.2-next.1

## 2.3.0-next.0

### Minor Changes

- ee97130: Added support for `techdocs.generator.pullOptions` when pulling the TechDocs generator Docker image from private registries that require authentication.

### Patch Changes

- 932986c: Improve validation of TechDocs static content paths.
- 1b0e277: Improved path validation for TechDocs content serving.
- Updated dependencies
  - @backstage/integration@2.1.2-next.0
  - @backstage/plugin-techdocs-node@1.16.0-next.0
  - @backstage/catalog-client@1.16.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0

## 2.2.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/plugin-techdocs-node@1.15.3
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/integration@2.1.0
  - @backstage/plugin-catalog-node@2.2.4

## 2.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.0-next.0
  - @backstage/plugin-techdocs-node@1.15.3-next.1

## 2.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.15.3-next.0
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0

## 2.2.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.15.2
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/catalog-client@1.16.1
  - @backstage/plugin-catalog-node@2.2.3

## 2.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0
  - @backstage/plugin-techdocs-node@1.15.2-next.0
  - @backstage/catalog-client@1.16.1-next.0

## 2.2.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.16.0
  - @backstage/integration@2.0.3
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-catalog-node@2.2.2
  - @backstage/plugin-techdocs-node@1.15.1

## 2.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.16.0-next.0
  - @backstage/integration@2.0.3-next.0
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/plugin-techdocs-node@1.15.1-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0

## 2.2.0

### Minor Changes

- 5ef8d16: Add support for disabling external font downloads via app-config option `techdocs.generator.mkdocs.disableExternalFonts`, useful for air-gapped Backstage instances.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/integration@2.0.2
  - @backstage/plugin-techdocs-node@1.15.0
  - @backstage/catalog-client@1.15.1
  - @backstage/config@1.3.8

## 2.2.0-next.1

### Minor Changes

- 5ef8d16: Add support for disabling external font downloads via app-config option `techdocs.generator.mkdocs.disableExternalFonts`, useful for air-gapped Backstage instances.

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.0.2-next.1
  - @backstage/plugin-techdocs-node@1.15.0-next.1

## 2.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/integration@2.0.2-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-client@1.15.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/plugin-techdocs-node@1.14.6-next.0
  - @backstage/types@1.2.2

## 2.1.7

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- 5e32f77: Migrated internal usage of the deprecated `catalogServiceRef` from `@backstage/plugin-catalog-node/alpha` to the stable `catalogServiceRef` from `@backstage/plugin-catalog-node`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/plugin-techdocs-node@1.14.5
  - @backstage/catalog-client@1.15.0
  - @backstage/integration@2.0.1
  - @backstage/config@1.3.7

## 2.1.7-next.2

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- 5e32f77: Migrated internal usage of the deprecated `catalogServiceRef` from `@backstage/plugin-catalog-node/alpha` to the stable `catalogServiceRef` from `@backstage/plugin-catalog-node`.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/plugin-techdocs-node@1.14.5-next.2
  - @backstage/integration@2.0.1-next.0
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-client@1.14.1-next.0
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0

## 2.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1
  - @backstage/plugin-techdocs-node@1.14.5-next.1

## 2.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/plugin-techdocs-node@1.14.5-next.0
  - @backstage/catalog-client@1.14.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration@2.0.0
  - @backstage/types@1.2.2

## 2.1.6

### Patch Changes

- cb7c6b1: Added `techdocs.generator.mkdocs.dangerouslyAllowAdditionalKeys` configuration option to explicitly bypass MkDocs configuration key restrictions. This enables support for additional MkDocs configuration keys beyond the default safe allow list, such as the `hooks` key which some MkDocs plugins require.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/catalog-client@1.14.0
  - @backstage/plugin-techdocs-node@1.14.4
  - @backstage/integration@2.0.0
  - @backstage/plugin-catalog-node@2.1.0
  - @backstage/catalog-model@1.7.7

## 2.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/plugin-techdocs-node@1.14.4-next.2
  - @backstage/catalog-client@1.14.0-next.2
  - @backstage/integration@2.0.0-next.2
  - @backstage/plugin-catalog-node@2.1.0-next.2

## 2.1.6-next.1

### Patch Changes

- cb7c6b1: Added `techdocs.generator.mkdocs.dangerouslyAllowAdditionalKeys` configuration option to explicitly bypass MkDocs configuration key restrictions. This enables support for additional MkDocs configuration keys beyond the default safe allow list, such as the `hooks` key which some MkDocs plugins require.
- Updated dependencies
  - @backstage/catalog-client@1.14.0-next.1
  - @backstage/plugin-techdocs-node@1.14.3-next.1
  - @backstage/integration@2.0.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.1
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 2.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.21.0-next.0
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-client@1.13.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-techdocs-node@1.14.3-next.0

## 2.1.5

### Patch Changes

- 7455dae: Use node prefix on native imports
- 5e3ef57: Added `peerModules` metadata declaring recommended modules for cross-plugin integrations.
- 8148621: Moved `@backstage/backend-defaults` from `dependencies` to `devDependencies`.
- Updated dependencies
  - @backstage/integration@1.20.0
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-techdocs-node@1.14.2
  - @backstage/catalog-client@1.13.0

## 2.1.5-next.2

### Patch Changes

- 8148621: Moved `@backstage/backend-defaults` from `dependencies` to `devDependencies`.
- Updated dependencies
  - @backstage/integration@1.20.0-next.2
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/catalog-client@1.12.2-next.0
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-techdocs-node@1.14.2-next.1

## 2.1.5-next.1

### Patch Changes

- 5e3ef57: Added `peerModules` metadata declaring recommended modules for cross-plugin integrations.
- Updated dependencies
  - @backstage/integration@1.20.0-next.1
  - @backstage/plugin-techdocs-node@1.14.2-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/backend-defaults@0.15.2-next.1

## 2.1.5-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/backend-defaults@0.15.1-next.0
  - @backstage/plugin-techdocs-node@1.14.1-next.0
  - @backstage/integration@1.19.3-next.0
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 2.1.4

### Patch Changes

- b6ff2a5: Some AWS `publisher` config options such as `region`, `endpoint`, `accountId` are now marked as `@visibility backend` instead of `secret`.
- Updated dependencies
  - @backstage/backend-defaults@0.15.0
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/integration@1.19.2
  - @backstage/plugin-techdocs-node@1.14.0

## 2.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.15.0-next.2

## 2.1.4-next.1

### Patch Changes

- b6ff2a5: Some AWS `publisher` config options such as `region`, `endpoint`, `accountId` are now marked as `@visibility backend` instead of `secret`.
- Updated dependencies
  - @backstage/backend-defaults@0.14.1-next.1
  - @backstage/integration@1.19.2-next.0
  - @backstage/plugin-techdocs-node@1.13.11-next.0

## 2.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.1-next.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration@1.19.0
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.20.1
  - @backstage/plugin-techdocs-node@1.13.10

## 2.1.3

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- 2bae83a: Corrected `ErrorCallback` type to work with Node 22 types
- 592361e: The `techdocs` config is now marked as optional.
- Updated dependencies
  - @backstage/integration@1.19.0
  - @backstage/backend-defaults@0.14.0
  - @backstage/plugin-techdocs-node@1.13.10
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1

## 2.1.3-next.2

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- 2bae83a: Corrected `ErrorCallback` type to work with Node 22 types
- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.1
  - @backstage/plugin-techdocs-node@1.13.10-next.1
  - @backstage/integration@1.18.3-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.20.1-next.1

## 2.1.3-next.1

### Patch Changes

- 592361e: The `techdocs` config is now marked as optional.

## 2.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.0
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/integration@1.18.3-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/plugin-techdocs-node@1.13.10-next.0
  - @backstage/config@1.3.6
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 2.1.2

### Patch Changes

- 71c22f3: Removed/moved unused dependencies
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-techdocs-node@1.13.9
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1

## 2.1.2-next.1

### Patch Changes

- 71c22f3: Removed/moved unused dependencies
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-defaults@0.13.1-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-techdocs-node@1.13.9-next.1

## 2.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.1-next.0
  - @backstage/plugin-techdocs-node@1.13.9-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/integration@1.18.2-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/catalog-client@1.12.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.7-next.0
  - @backstage/plugin-catalog-node@1.19.2-next.0
  - @backstage/plugin-permission-common@0.9.3-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.8-next.0
  - @backstage/plugin-techdocs-common@0.1.1

## 2.1.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0
  - @backstage/integration@1.18.1
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-common@1.1.6
  - @backstage/plugin-catalog-node@1.19.1
  - @backstage/plugin-permission-common@0.9.2
  - @backstage/plugin-search-backend-module-techdocs@0.4.7
  - @backstage/plugin-techdocs-node@1.13.8

## 2.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/backend-defaults@0.13.0-next.1
  - @backstage/integration@1.18.1-next.1
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-permission-common@0.9.2-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.7-next.1
  - @backstage/plugin-techdocs-node@1.13.8-next.1
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-catalog-common@1.1.6-next.0
  - @backstage/catalog-client@1.12.0

## 2.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0-next.0
  - @backstage/integration@1.18.1-next.0
  - @backstage/plugin-techdocs-node@1.13.8-next.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/catalog-client@1.12.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-permission-common@0.9.1
  - @backstage/plugin-search-backend-module-techdocs@0.4.7-next.0
  - @backstage/plugin-techdocs-common@0.1.1

## 2.1.0

### Minor Changes

- 063cdc5: Techdocs: support HumanDuration for cache TTL and timeout configuration
- a0b604c: Adding new entity that specifies an external entity in the techdocs-entity annotation and updates to documentation regarding TechDocs redirects.

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.1
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/catalog-client@1.12.0
  - @backstage/integration@1.18.0
  - @backstage/types@1.2.2
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/plugin-search-backend-module-techdocs@0.4.6
  - @backstage/plugin-techdocs-node@1.13.7

## 2.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.1-next.1
  - @backstage/catalog-client@1.12.0-next.0
  - @backstage/plugin-catalog-node@1.19.0-next.1
  - @backstage/integration@1.18.0-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.6-next.1

## 2.1.0-next.0

### Minor Changes

- 063cdc5: Techdocs: support HumanDuration for cache TTL and timeout configuration

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.0-next.0
  - @backstage/backend-defaults@0.12.1-next.0
  - @backstage/plugin-techdocs-node@1.13.7-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.6-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0

## 2.0.5

### Patch Changes

- 484e500: Updated CachedEntityLoader to use BackstageCredentials instead of raw tokens for cache key generation. It now uses principal-based identification (user entity ref for users, subject for services) instead of token-based keys, providing more consistent caching behavior.
- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-search-backend-module-techdocs@0.4.5
  - @backstage/plugin-techdocs-node@1.13.6

## 2.0.5-next.1

### Patch Changes

- 484e500: Updated CachedEntityLoader to use BackstageCredentials instead of raw tokens for cache key generation. It now uses principal-based identification (user entity ref for users, subject for services) instead of token-based keys, providing more consistent caching behavior.
- Updated dependencies
  - @backstage/backend-defaults@0.11.2-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/catalog-client@1.11.0-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.1
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/plugin-permission-common@0.9.1
  - @backstage/plugin-search-backend-module-techdocs@0.4.5-next.0
  - @backstage/plugin-techdocs-common@0.1.1
  - @backstage/plugin-techdocs-node@1.13.6-next.0

## 2.0.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.2-next.0
  - @backstage/catalog-client@1.11.0-next.0
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.5-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/plugin-techdocs-node@1.13.6-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.1
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-permission-common@0.9.1
  - @backstage/plugin-techdocs-common@0.1.1

## 2.0.4

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/plugin-permission-common@0.9.1
  - @backstage/catalog-model@1.7.5
  - @backstage/backend-defaults@0.11.1
  - @backstage/catalog-client@1.10.2
  - @backstage/integration@1.17.1
  - @backstage/plugin-techdocs-node@1.13.5
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.17.2
  - @backstage/plugin-search-backend-module-techdocs@0.4.4

## 2.0.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/plugin-permission-common@0.9.1-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/catalog-client@1.10.2-next.0
  - @backstage/backend-defaults@0.11.1-next.1
  - @backstage/integration@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.4-next.1
  - @backstage/plugin-techdocs-node@1.13.5-next.1
  - @backstage/plugin-catalog-common@1.1.5-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0

## 2.0.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.1-next.0
  - @backstage/integration@1.17.1-next.0
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/plugin-search-backend-module-techdocs@0.4.4-next.0
  - @backstage/plugin-techdocs-node@1.13.5-next.0
  - @backstage/catalog-client@1.10.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-techdocs-common@0.1.1

## 2.0.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1
  - @backstage/backend-defaults@0.11.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/plugin-search-backend-module-techdocs@0.4.3
  - @backstage/plugin-techdocs-common@0.1.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-techdocs-node@1.13.4

## 2.0.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.0-next.2
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.3-next.1
  - @backstage/plugin-techdocs-common@0.1.1-next.0
  - @backstage/plugin-techdocs-node@1.13.4-next.1

## 2.0.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.3-next.1
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/backend-defaults@0.10.1-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-techdocs-common@0.1.1-next.0
  - @backstage/plugin-techdocs-node@1.13.4-next.1

## 2.0.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-common@0.1.1-next.0
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/backend-defaults@0.10.1-next.0
  - @backstage/plugin-techdocs-node@1.13.4-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.3-next.0

## 2.0.2

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/integration@1.17.0
  - @backstage/backend-defaults@0.10.0
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-techdocs-node@1.13.3
  - @backstage/catalog-client@1.10.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-search-backend-module-techdocs@0.4.2
  - @backstage/plugin-techdocs-common@0.1.0

## 2.0.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.3
  - @backstage/integration@1.17.0-next.3
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.2
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.2-next.3
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.13.3-next.3

## 2.0.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0-next.2
  - @backstage/backend-defaults@0.10.0-next.2
  - @backstage/config@1.3.2
  - @backstage/plugin-techdocs-node@1.13.3-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.4.2-next.2
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## 2.0.2-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-techdocs-node@1.13.3-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.4.2-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## 2.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.4-next.0
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/backend-defaults@0.9.1-next.0
  - @backstage/plugin-techdocs-node@1.13.3-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.2-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-techdocs-common@0.1.0

## 2.0.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.0
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/plugin-techdocs-node@1.13.2
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/integration@1.16.3
  - @backstage/plugin-search-backend-module-techdocs@0.4.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-techdocs-common@0.1.0

## 2.0.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/backend-defaults@0.9.0-next.2
  - @backstage/plugin-techdocs-node@1.13.2-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.4.1-next.2
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.3-next.0
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-techdocs-common@0.1.0

## 2.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.3-next.0
  - @backstage/backend-defaults@0.9.0-next.1
  - @backstage/plugin-techdocs-node@1.13.2-next.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-backend-module-techdocs@0.4.1-next.1
  - @backstage/plugin-techdocs-common@0.1.0

## 2.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.0-next.0
  - @backstage/plugin-techdocs-node@1.13.2-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.1-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-techdocs-common@0.1.0

## 2.0.0

### Major Changes

- d5c4a9d: **BREAKING** Removed support for the legacy backend, please migrate to the new backend system. Also removed deprecated `DefaultTechDocsCollatorFactory`. Use the `@backstage/plugin-search-backend-module-techdocs` for this instead. Finally, deprecated `DocsBuildStrategy` and `TechDocsDocument` were removed, use the versions in `@backstage/plugin-techdocs-node` instead.

### Patch Changes

- 7828186: Minor type fix
- 8f03776: Properly clean up temporary files on build failures
- Updated dependencies
  - @backstage/plugin-search-backend-module-techdocs@0.4.0
  - @backstage/integration@1.16.2
  - @backstage/backend-defaults@0.8.2
  - @backstage/plugin-techdocs-node@1.13.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-techdocs-common@0.1.0

## 1.11.7-next.2

### Patch Changes

- 7828186: Minor type fix
- 8f03776: Properly clean up temporary files on build failures
- Updated dependencies
  - @backstage/integration@1.16.2-next.0
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-backend-module-techdocs@0.3.7-next.2
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.13.1-next.2

## 1.11.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-backend-module-techdocs@0.3.7-next.1
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.13.1-next.1

## 1.11.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.13.1-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.3.7-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.16.1-next.0

## 1.11.6

### Patch Changes

- b78e3fd: Fixed issue `syncEntityDocs` that would cause the `/sync` endpoint to be continuously called if the request fails
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-catalog-node@1.16.0
  - @backstage/plugin-techdocs-node@1.13.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-backend-module-techdocs@0.3.6
  - @backstage/plugin-techdocs-common@0.1.0

## 1.11.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.3.6-next.3
  - @backstage/plugin-techdocs-node@1.13.0-next.2
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-techdocs-common@0.1.0

## 1.11.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.0-next.2
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-backend-module-techdocs@0.3.6-next.2
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.13.0-next.1

## 1.11.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-backend-module-techdocs@0.3.6-next.1
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.13.0-next.0

## 1.11.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/plugin-techdocs-node@1.13.0-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-backend-module-techdocs@0.3.6-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## 1.11.5

### Patch Changes

- 29a4aa8: fix(config): add missing parameters in config schema
- Updated dependencies
  - @backstage/integration@1.16.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.15.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-backend-module-techdocs@0.3.5
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.12.16

## 1.11.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/plugin-permission-common@0.8.4-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.3.5-next.1
  - @backstage/plugin-techdocs-node@1.12.16-next.1
  - @backstage/catalog-client@1.9.1-next.0
  - @backstage/plugin-catalog-common@1.1.3-next.0
  - @backstage/integration@1.16.1-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## 1.11.5-next.1

### Patch Changes

- 29a4aa8: fix(config): add missing parameters in config schema

## 1.11.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-client@1.9.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/integration@1.16.0
  - @backstage/plugin-catalog-common@1.1.2
  - @backstage/plugin-catalog-node@1.15.1-next.0
  - @backstage/plugin-permission-common@0.8.3
  - @backstage/plugin-search-backend-module-techdocs@0.3.5-next.0
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.12.16-next.0

## 1.11.4

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/integration@1.16.0
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-search-backend-module-techdocs@0.3.4
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/catalog-client@1.9.0
  - @backstage/plugin-techdocs-node@1.12.15
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/plugin-catalog-common@1.1.2
  - @backstage/plugin-permission-common@0.8.3
  - @backstage/plugin-techdocs-common@0.1.0

## 1.11.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.3.4-next.2
  - @backstage/plugin-techdocs-node@1.12.15-next.2
  - @backstage/catalog-client@1.9.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/integration@1.16.0-next.1
  - @backstage/plugin-catalog-common@1.1.2-next.0
  - @backstage/plugin-permission-common@0.8.3-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## 1.11.4-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/catalog-client@1.9.0-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.3.4-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/integration@1.16.0-next.0
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.12.15-next.1

## 1.11.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.3.4-next.0
  - @backstage/plugin-techdocs-node@1.12.15-next.0
  - @backstage/catalog-client@1.8.1-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-catalog-node@1.14.1-next.0
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/plugin-techdocs-common@0.1.0

## 1.11.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0
  - @backstage/config@1.3.0
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5
  - @backstage/integration@1.15.2
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-search-backend-module-techdocs@0.3.2
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.12.13

## 1.11.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-backend-module-techdocs@0.3.2-next.3
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.12.13-next.3

## 1.11.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.3.2-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.12.13-next.2

## 1.11.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.14.0-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-backend-module-techdocs@0.3.2-next.1
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.12.13-next.1

## 1.11.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-backend-module-techdocs@0.3.2-next.0
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.12.13-next.0

## 1.11.0

### Minor Changes

- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- fbdc631: Allow to pass StorageOptions to GCS Publisher
- Updated dependencies
  - @backstage/plugin-search-backend-module-techdocs@0.3.0
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/plugin-techdocs-node@1.12.12
  - @backstage/integration@1.15.1
  - @backstage/catalog-client@1.7.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-techdocs-common@0.1.0

## 1.10.14-next.2

### Patch Changes

- fbdc631: Allow to pass StorageOptions to GCS Publisher
- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/plugin-techdocs-node@1.12.12-next.2
  - @backstage/integration@1.15.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-backend-module-techdocs@0.2.3-next.2
  - @backstage/plugin-techdocs-common@0.1.0

## 1.10.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-backend-module-techdocs@0.2.3-next.1
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.12.12-next.1

## 1.10.14-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-search-backend-module-techdocs@0.2.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.12.12-next.0

## 1.10.13

### Patch Changes

- 086c32d: Dedicated token for techdocs cache sync
- 5b679ac: The `createRouter` and its related types has been marked as deprecared. This backend should instead be initialized using the new backend system.
- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- 5edd344: Refactor to use injected catalog client in the new backend system
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/plugin-techdocs-node@1.12.11
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/catalog-client@1.7.0
  - @backstage/plugin-search-backend-module-techdocs@0.2.2
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/integration@1.15.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-techdocs-common@0.1.0

## 1.10.13-next.2

### Patch Changes

- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-client@1.7.0-next.1
  - @backstage/plugin-techdocs-node@1.12.11-next.2
  - @backstage/integration@1.15.0-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.2
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-backend-module-techdocs@0.2.2-next.2
  - @backstage/plugin-techdocs-common@0.1.0

## 1.10.13-next.1

### Patch Changes

- 5edd344: Refactor to use injected catalog client in the new backend system
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/catalog-client@1.6.7-next.0
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-backend-module-techdocs@0.2.2-next.1
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-node@1.12.11-next.1

## 1.10.13-next.0

### Patch Changes

- 086c32d: Dedicated token for techdocs cache sync
- 5b679ac: The `createRouter` and its related types has been marked as deprecared. This backend should instead be initialized using the new backend system.
- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-techdocs-node@1.12.11-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.2.2-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/catalog-client@1.6.6
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-techdocs-common@0.1.0

## 1.10.10

### Patch Changes

- 69bd940: Use annotation constants from new techdocs-common package.
- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- b77fbf4: Added back `type: 'local'` to TechDocs config schema for `publisher`
- a16632c: Update configuration schema to match actual behavior
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-techdocs-node@1.12.9
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-backend-module-techdocs@0.2.0
  - @backstage/integration@1.14.0
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/catalog-model@1.6.0
  - @backstage/catalog-client@1.6.6
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-common@1.0.26

## 1.10.10-next.3

### Patch Changes

- a16632c: Update configuration schema to match actual behavior
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/plugin-techdocs-node@1.12.9-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/catalog-client@1.6.6-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-common@1.0.26-next.2
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.28-next.3
  - @backstage/plugin-techdocs-common@0.1.0-next.0

## 1.10.10-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.28-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-techdocs-node@1.12.9-next.2
  - @backstage/plugin-catalog-common@1.0.26-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-techdocs-common@0.1.0-next.0

## 1.10.10-next.1

### Patch Changes

- 69bd940: Use annotation constants from new techdocs-common package.
- Updated dependencies
  - @backstage/plugin-techdocs-node@1.12.9-next.1
  - @backstage/plugin-permission-common@0.8.1-next.0
  - @backstage/plugin-techdocs-common@0.1.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.28-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-common@1.0.26-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 1.10.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.28-next.0
  - @backstage/plugin-techdocs-node@1.12.9-next.0

## 1.10.9

### Patch Changes

- 9ecf5fd: Adds extension point for publishers to the techdocs backend
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-techdocs-node@1.12.8
  - @backstage/integration@1.13.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.27
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 1.10.9-next.1

### Patch Changes

- 9ecf5fd: Adds extension point for publishers to the techdocs backend
- Updated dependencies
  - @backstage/plugin-techdocs-node@1.12.8-next.1
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.27-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/plugin-permission-common@0.7.14

## 1.10.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.26-next.0
  - @backstage/plugin-techdocs-node@1.12.7-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/plugin-permission-common@0.7.14

## 1.10.6

### Patch Changes

- e64bfb2: Allow defining custom build log transport for techdocs builder
- 8869b8e: Updated local development setup.
- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- 2110d76: Removed `dockerode` dependency.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-techdocs-node@1.12.5
  - @backstage/integration@1.12.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.24
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 1.10.6-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.24-next.3
  - @backstage/plugin-permission-common@0.7.14-next.0
  - @backstage/plugin-catalog-common@1.0.24-next.0
  - @backstage/plugin-techdocs-node@1.12.5-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 1.10.6-next.2

### Patch Changes

- e64bfb2: Allow defining custom build log transport for techdocs builder
- Updated dependencies
  - @backstage/plugin-techdocs-node@1.12.5-next.2
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.24-next.2
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-common@1.0.23
  - @backstage/plugin-permission-common@0.7.13

## 1.10.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.24-next.1
  - @backstage/plugin-techdocs-node@1.12.5-next.1

## 1.10.6-next.0

### Patch Changes

- 8869b8e: Updated local development setup.
- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.24-next.0
  - @backstage/plugin-techdocs-node@1.12.5-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.11.0
  - @backstage/plugin-catalog-common@1.0.23
  - @backstage/plugin-permission-common@0.7.13

## 1.10.5

### Patch Changes

- 5863cf7: The `techdocs.builder` config is now optional and it will default to `local`.
- Updated dependencies
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-techdocs-node@1.12.4
  - @backstage/integration@1.11.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.23
  - @backstage/catalog-client@1.6.5
  - @backstage/plugin-catalog-common@1.0.23

## 1.10.5-next.2

### Patch Changes

- 5863cf7: The `techdocs.builder` config is now optional and it will default to `local`.
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/integration@1.11.0-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.23-next.2
  - @backstage/plugin-techdocs-node@1.12.4-next.2

## 1.10.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.23-next.1
  - @backstage/plugin-techdocs-node@1.12.4-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 1.10.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/catalog-client@1.6.5-next.0
  - @backstage/plugin-catalog-common@1.0.23-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.23-next.0
  - @backstage/plugin-techdocs-node@1.12.4-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0
  - @backstage/plugin-permission-common@0.7.13

## 1.10.4

### Patch Changes

- 8e28c88: Allow overriding default techdocs preparers with new `TechdocsPreparerExtensionPoint`
- c884b9a: Use the default cookie endpoints added automatically when a cookie policy is set.
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/plugin-techdocs-node@1.12.3
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-search-backend-module-techdocs@0.1.22
  - @backstage/catalog-client@1.6.4
  - @backstage/integration@1.10.0
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13

## 1.10.4-next.1

### Patch Changes

- c884b9a: Use the default cookie endpoints added automatically when a cookie policy is set.
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/catalog-client@1.6.4-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.22-next.1
  - @backstage/plugin-techdocs-node@1.12.3-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0-next.0
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13

## 1.10.4-next.0

### Patch Changes

- 8e28c88: Allow overriding default techdocs preparers with new `TechdocsPreparerExtensionPoint`
- Updated dependencies
  - @backstage/plugin-techdocs-node@1.12.3-next.0
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.22-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/catalog-client@1.6.3
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13

## 1.10.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.3
  - @backstage/backend-common@0.21.6
  - @backstage/plugin-techdocs-node@1.12.2
  - @backstage/plugin-search-backend-module-techdocs@0.1.21
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13

## 1.10.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.2
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-techdocs-node@1.12.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.20
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13

## 1.10.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-module-techdocs@0.1.19

## 1.10.0

### Minor Changes

- 718b734: Create extension point `TechdocsGeneratorExtensionPoint` to allow adding a custom generator

### Patch Changes

- 3f14e9f: Migrate plugin to use the new auth services.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-techdocs-node@1.12.0
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-search-backend-module-techdocs@0.1.18
  - @backstage/catalog-client@1.6.1
  - @backstage/catalog-model@1.4.5
  - @backstage/plugin-catalog-common@1.0.22

## 1.10.0-next.2

### Minor Changes

- 718b734: Create extension point `TechdocsGeneratorExtensionPoint` to allow adding a custom generator

### Patch Changes

- 3f14e9f: Migrate plugin to use the new auth services.
- Updated dependencies
  - @backstage/integration@1.9.1-next.2
  - @backstage/plugin-techdocs-node@1.12.0-next.2
  - @backstage/catalog-client@1.6.1-next.1
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.1.18-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1

## 1.9.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.18-next.1
  - @backstage/plugin-techdocs-node@1.11.6-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1

## 1.9.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-techdocs-node@1.11.5-next.0
  - @backstage/plugin-permission-common@0.7.13-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.17-next.0
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.0

## 1.9.3

### Patch Changes

- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- d2e3ab9: Updated dependency `dockerode` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.14
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/catalog-model@1.4.4
  - @backstage/integration@1.9.0
  - @backstage/catalog-client@1.6.0
  - @backstage/plugin-techdocs-node@1.11.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.21
  - @backstage/plugin-permission-common@0.7.12

## 1.9.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/plugin-techdocs-node@1.11.2-next.3
  - @backstage/plugin-search-backend-module-techdocs@0.1.14-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-permission-common@0.7.12

## 1.9.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.1.14-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-techdocs-node@1.11.2-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/integration@1.9.0-next.0
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-permission-common@0.7.12

## 1.9.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/plugin-techdocs-node@1.11.2-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-search-backend-module-techdocs@0.1.14-next.1

## 1.9.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/catalog-client@1.6.0-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.14-next.0
  - @backstage/plugin-techdocs-node@1.11.2-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/plugin-catalog-common@1.0.20
  - @backstage/plugin-permission-common@0.7.12

## 1.9.2

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/catalog-client@1.5.2
  - @backstage/plugin-search-backend-module-techdocs@0.1.13
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-techdocs-node@1.11.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/plugin-catalog-common@1.0.20

## 1.9.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.1.13-next.2
  - @backstage/plugin-techdocs-node@1.11.1-next.2

## 1.9.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.13-next.1
  - @backstage/plugin-techdocs-node@1.11.1-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-permission-common@0.7.11

## 1.9.2-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.13-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-techdocs-node@1.11.1-next.0

## 1.9.1

### Patch Changes

- a402644: Regenerates a fresh token for each call to the search index when collating techdocs.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/catalog-client@1.5.0
  - @backstage/integration@1.8.0
  - @backstage/plugin-techdocs-node@1.11.0
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-search-backend-module-techdocs@0.1.12
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-search-common@1.2.9

## 1.9.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-search-backend-module-techdocs@0.1.12-next.3
  - @backstage/plugin-search-common@1.2.8
  - @backstage/plugin-techdocs-node@1.11.0-next.3

## 1.9.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.12-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-search-common@1.2.8
  - @backstage/plugin-techdocs-node@1.11.0-next.2

## 1.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-techdocs-node@1.11.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-search-backend-module-techdocs@0.1.12-next.1
  - @backstage/plugin-search-common@1.2.8

## 1.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/integration@1.8.0-next.0
  - @backstage/plugin-techdocs-node@1.11.0-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.12-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-search-common@1.2.8

## 1.9.0

### Minor Changes

- 67cff7b06f: Expose an extension point to set a custom build strategy. Also move `DocsBuildStrategy` type to `@backstage/plugin-techdocs-node` and deprecate `ShouldBuildParameters` type.

### Patch Changes

- c3c5c7e514: Add info about the entity when tech docs fail to build
- 48a61bfdca: Fix potential memory leak by not creating a build log transport if not given via `RouterOptions`.
- 013611b42e: `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.
- Updated dependencies
  - @backstage/plugin-techdocs-node@1.10.0
  - @backstage/integration@1.7.2
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/plugin-search-backend-module-techdocs@0.1.11
  - @backstage/catalog-client@1.4.6
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-search-common@1.2.8

## 1.9.0-next.2

### Patch Changes

- [#20570](https://github.com/backstage/backstage/pull/20570) [`013611b42e`](https://github.com/backstage/backstage/commit/013611b42ed457fefa9bb85fddf416cf5e0c1f76) Thanks [@freben](https://github.com/freben)! - `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.1.11-next.2
  - @backstage/plugin-techdocs-node@1.10.0-next.2

## 1.9.0-next.1

### Minor Changes

- 67cff7b06f: Expose an extension point to set a custom build strategy. Also move `DocsBuildStrategy` type to `@backstage/plugin-techdocs-node` and deprecate `ShouldBuildParameters` type.

### Patch Changes

- 48a61bfdca: Fix potential memory leak by not creating a build log transport if not given via `RouterOptions`.
- Updated dependencies
  - @backstage/plugin-techdocs-node@1.10.0-next.1
  - @backstage/integration@1.7.2-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.11-next.1
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## 1.8.1-next.0

### Patch Changes

- c3c5c7e514: Add info about the entity when tech docs fail to build
- Updated dependencies
  - @backstage/plugin-search-backend-module-techdocs@0.1.11-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/integration@1.7.1
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7
  - @backstage/plugin-techdocs-node@1.9.1-next.0

## 1.8.0

### Minor Changes

- 344cfbcfbc: Allow prepared directory clean up for custom preparers

  When using custom preparer for TechDocs, the `preparedDir` might
  end up taking disk space. This requires all custom preparers to
  implement a new method `shouldCleanPreparedDirectory` which indicates
  whether the prepared directory should be cleaned after generation.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-techdocs-node@1.9.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-module-techdocs@0.1.10
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## 1.8.0-next.2

### Minor Changes

- 344cfbcfbc: Allow prepared directory clean up for custom preparers

  When using custom preparer for TechDocs, the `preparedDir` might
  end up taking disk space. This requires all custom preparers to
  implement a new method `shouldCleanPreparedDirectory` which indicates
  whether the prepared directory should be cleaned after generation.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-techdocs-node@1.9.0-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/integration@1.7.1-next.1
  - @backstage/errors@1.2.3-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.10-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/catalog-client@1.4.5-next.0
  - @backstage/config@1.1.1-next.0
  - @backstage/plugin-catalog-common@1.0.17-next.0
  - @backstage/plugin-permission-common@0.7.9-next.0
  - @backstage/plugin-search-common@1.2.7-next.0

## 1.7.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.9-next.1
  - @backstage/plugin-techdocs-node@1.8.2-next.1
  - @backstage/config@1.1.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.1-next.0
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-search-common@1.2.6

## 1.7.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.1-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/plugin-techdocs-node@1.8.2-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-search-backend-module-techdocs@0.1.9-next.0
  - @backstage/plugin-search-common@1.2.6

## 1.7.0

### Minor Changes

- 5985d458ee30: Add a `techdocs.publisher.azureBlobStorage.connectionString` app-config setting, which can be leveraged for improved Azurite support.
- 10a86bd4ae12: Add optional config and cli option for techdocs to specify default mkdocs plugins.

### Patch Changes

- 60af8017dd84: Expand techdocs.publisher.type with `googleGcs`,`awsS3`,`azureBlobStorage` and `openStackSwift`
- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- a8a614ba0d07: Minor `package.json` update.
- Updated dependencies
  - @backstage/plugin-search-backend-module-techdocs@0.1.7
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.0
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-search-common@1.2.6
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-techdocs-node@1.8.0

## 1.7.0-next.3

### Patch Changes

- 60af8017dd84: Expand techdocs.publisher.type with `googleGcs`,`awsS3`,`azureBlobStorage` and `openStackSwift`
- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- a8a614ba0d07: Minor `package.json` update.
- Updated dependencies
  - @backstage/plugin-search-backend-module-techdocs@0.1.7-next.3
  - @backstage/catalog-client@1.4.4-next.2
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/integration@1.7.0-next.3
  - @backstage/plugin-catalog-common@1.0.16-next.2
  - @backstage/plugin-permission-common@0.7.8-next.2
  - @backstage/plugin-search-common@1.2.6-next.2
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/plugin-techdocs-node@1.8.0-next.3

## 1.7.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.1.7-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/plugin-techdocs-node@1.8.0-next.2
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-search-common@1.2.6-next.1

## 1.7.0-next.1

### Minor Changes

- 5985d458ee30: Add a `techdocs.publisher.azureBlobStorage.connectionString` app-config setting, which can be leveraged for improved Azurite support.
- 10a86bd4ae12: Add optional config and cli option for techdocs to specify default mkdocs plugins.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/integration@1.7.0-next.1
  - @backstage/plugin-techdocs-node@1.8.0-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-permission-common@0.7.8-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.7-next.1
  - @backstage/catalog-client@1.4.4-next.0
  - @backstage/plugin-catalog-common@1.0.16-next.0
  - @backstage/errors@1.2.1
  - @backstage/plugin-search-common@1.2.6-next.0

## 1.6.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/integration@1.7.0-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-search-backend-module-techdocs@0.1.6-next.0
  - @backstage/plugin-search-common@1.2.5
  - @backstage/plugin-techdocs-node@1.7.6-next.0

## 1.6.5

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- Updated dependencies
  - @backstage/plugin-search-backend-module-techdocs@0.1.4
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/integration@1.6.0
  - @backstage/plugin-techdocs-node@1.7.4
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-search-common@1.2.5

## 1.6.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-module-techdocs@0.1.4-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-techdocs-node@1.7.4-next.2

## 1.6.5-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- Updated dependencies
  - @backstage/plugin-search-backend-module-techdocs@0.1.4-next.1
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/plugin-techdocs-node@1.7.4-next.1
  - @backstage/integration@1.5.1
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-search-common@1.2.5

## 1.6.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration@1.5.1
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-search-backend-module-techdocs@0.1.4-next.0
  - @backstage/plugin-search-common@1.2.5
  - @backstage/plugin-techdocs-node@1.7.4-next.0

## 1.6.4

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-search-backend-module-techdocs@0.1.3
  - @backstage/plugin-search-common@1.2.5
  - @backstage/plugin-techdocs-node@1.7.3

## 1.6.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1-next.0
  - @backstage/plugin-catalog-common@1.0.15-next.0
  - @backstage/plugin-permission-common@0.7.7-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.3-next.0
  - @backstage/plugin-search-common@1.2.5-next.0
  - @backstage/plugin-techdocs-node@1.7.3-next.0

## 1.6.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/catalog-client@1.4.2
  - @backstage/plugin-techdocs-node@1.7.2
  - @backstage/integration@1.5.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/plugin-search-backend-module-techdocs@0.1.2
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.14
  - @backstage/plugin-permission-common@0.7.6
  - @backstage/plugin-search-common@1.2.4

## 1.6.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/plugin-techdocs-node@1.7.2-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/catalog-client@1.4.2-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/integration@1.5.0-next.0
  - @backstage/plugin-catalog-common@1.0.14-next.1
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.2-next.2
  - @backstage/plugin-search-common@1.2.4-next.0

## 1.6.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/plugin-techdocs-node@1.7.2-next.1
  - @backstage/integration@1.5.0-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.2-next.1
  - @backstage/catalog-client@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/plugin-catalog-common@1.0.14-next.0
  - @backstage/config@1.0.7
  - @backstage/plugin-search-common@1.2.4-next.0

## 1.6.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.2-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.2-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/integration@1.4.5
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-search-common@1.2.3
  - @backstage/plugin-techdocs-node@1.7.2-next.0

## 1.6.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/integration@1.4.5
  - @backstage/plugin-techdocs-node@1.7.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.1
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-search-common@1.2.3

## 1.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.1-next.1
  - @backstage/plugin-techdocs-node@1.7.1-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 1.6.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/integration@1.4.5-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.1-next.0
  - @backstage/plugin-techdocs-node@1.7.1-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-search-common@1.2.3

## 1.6.1

### Patch Changes

- 01ae205352e: Collator factories instantiated in new backend system modules and now marked as deprecated. Will be continued to be exported publicly until the new backend system is fully rolled out.
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/catalog-client@1.4.1
  - @backstage/plugin-techdocs-node@1.7.0
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.0
  - @backstage/integration@1.4.4
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-search-common@1.2.3

## 1.6.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/catalog-client@1.4.1-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/plugin-catalog-common@1.0.13-next.1
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.0-next.2
  - @backstage/plugin-search-common@1.2.3-next.0
  - @backstage/plugin-techdocs-node@1.6.1-next.3

## 1.6.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/catalog-client@1.4.1-next.0
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.0-next.1
  - @backstage/plugin-search-common@1.2.3-next.0
  - @backstage/plugin-techdocs-node@1.6.1-next.2

## 1.6.1-next.1

### Patch Changes

- 01ae205352e: Collator factories instantiated in new backend system modules and now marked as deprecated. Will be continued to be exported publicly until the new backend system is fully rolled out.
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.1.0-next.0
  - @backstage/integration@1.4.4-next.0
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-search-common@1.2.3-next.0
  - @backstage/plugin-techdocs-node@1.6.1-next.1

## 1.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/plugin-permission-common@0.7.4
  - @backstage/plugin-search-common@1.2.2
  - @backstage/plugin-techdocs-node@1.6.1-next.0

## 1.6.0

### Minor Changes

- 92b495328bd: Introduced alpha export of the `techdocsPlugin` using the new backend system.

### Patch Changes

- 40298b02778: Techdocs backend explains a bit more about what might have caused the docs not being found when building techdocs.
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/catalog-client@1.4.0
  - @backstage/plugin-techdocs-node@1.6.0
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/integration@1.4.3
  - @backstage/plugin-permission-common@0.7.4
  - @backstage/config@1.0.7
  - @backstage/plugin-search-common@1.2.2

## 1.5.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.6.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/config@1.0.7-next.0
  - @backstage/integration@1.4.3-next.0

## 1.5.4-next.1

### Patch Changes

- 40298b02778: Techdocs backend explains a bit more about what might have caused the docs not being found when building techdocs.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/plugin-techdocs-node@1.6.0-next.1
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/catalog-client@1.4.0-next.1
  - @backstage/integration@1.4.3-next.0
  - @backstage/plugin-permission-common@0.7.4-next.0
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/plugin-catalog-common@1.0.12-next.1
  - @backstage/plugin-search-common@1.2.2-next.0

## 1.5.4-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/catalog-client@1.4.0-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/plugin-catalog-common@1.0.12-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-search-common@1.2.1
  - @backstage/plugin-techdocs-node@1.5.1-next.0

## 1.5.3

### Patch Changes

- 6f097023fc: Keep the tech docs sync event stream alive even if it is taking a while to build.
- 339d9a5b5c: Added support for using a default `mkdocs.yml` configuration file when none is provided
- Updated dependencies
  - @backstage/backend-common@0.18.2
  - @backstage/plugin-techdocs-node@1.5.0
  - @backstage/catalog-model@1.2.0
  - @backstage/catalog-client@1.3.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/plugin-catalog-common@1.0.11
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-search-common@1.2.1

## 1.5.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/catalog-client@1.3.1-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/plugin-catalog-common@1.0.11-next.1
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-search-common@1.2.1
  - @backstage/plugin-techdocs-node@1.4.6-next.2

## 1.5.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/plugin-catalog-common@1.0.11-next.0
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-search-common@1.2.1
  - @backstage/plugin-techdocs-node@1.4.6-next.1

## 1.5.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.4.6-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/plugin-catalog-common@1.0.11-next.0

## 1.5.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/catalog-model@1.1.5
  - @backstage/catalog-client@1.3.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/plugin-catalog-common@1.0.10
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-search-common@1.2.1
  - @backstage/plugin-techdocs-node@1.4.4

## 1.5.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/catalog-client@1.3.0-next.2
  - @backstage/plugin-techdocs-node@1.4.4-next.2
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## 1.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-search-common@1.2.1-next.0
  - @backstage/plugin-techdocs-node@1.4.4-next.1

## 1.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/catalog-client@1.3.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/plugin-catalog-common@1.0.10-next.0
  - @backstage/plugin-permission-common@0.7.2
  - @backstage/plugin-search-common@1.2.0
  - @backstage/plugin-techdocs-node@1.4.4-next.0

## 1.5.0

### Minor Changes

- dfbdae092e: Added a new optional `accountId` to the configuration options of the AWS S3 publisher. Configuring this option will source credentials for the `accountId` in the `aws` app config section. See https://github.com/backstage/backstage/blob/master/packages/integration-aws-node/README.md for more details.

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/catalog-client@1.2.0
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-permission-common@0.7.2
  - @backstage/plugin-techdocs-node@1.4.3
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/plugin-search-common@1.2.0
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5
  - @backstage/plugin-catalog-common@1.0.9

## 1.5.0-next.3

### Minor Changes

- dfbdae092e: Added a new optional `accountId` to the configuration options of the AWS S3 publisher. Configuring this option will source credentials for the `accountId` in the `aws` app config section. See https://github.com/backstage/backstage/blob/master/packages/integration-aws-node/README.md for more details.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.2-next.2
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/plugin-techdocs-node@1.4.3-next.3
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.3
  - @backstage/plugin-search-common@1.2.0-next.3

## 1.4.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/plugin-search-common@1.2.0-next.2
  - @backstage/plugin-techdocs-node@1.4.3-next.2
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.2
  - @backstage/plugin-permission-common@0.7.2-next.1

## 1.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-techdocs-node@1.4.3-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1
  - @backstage/plugin-search-common@1.1.2-next.1

## 1.4.2-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/catalog-client@1.2.0-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/integration@1.4.1-next.0
  - @backstage/plugin-permission-common@0.7.2-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0
  - @backstage/plugin-catalog-common@1.0.9-next.0
  - @backstage/plugin-search-common@1.1.2-next.0
  - @backstage/plugin-techdocs-node@1.4.3-next.0

## 1.4.1

### Patch Changes

- a7607b5413: Replace usage of deprecataed `UrlReader.read` with `UrlReader.readUrl`.
- a6d779d58a: Remove explicit default visibility at `config.d.ts` files.

  ```ts
  /**
   * @visibility backend
   */
  ```

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-techdocs-node@1.4.2
  - @backstage/integration@1.4.0
  - @backstage/catalog-model@1.1.3
  - @backstage/plugin-permission-common@0.7.1
  - @backstage/catalog-client@1.1.2
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3
  - @backstage/plugin-catalog-common@1.0.8
  - @backstage/plugin-search-common@1.1.1

## 1.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/plugin-techdocs-node@1.4.2-next.1
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/plugin-catalog-common@1.0.8-next.0
  - @backstage/plugin-permission-common@0.7.1-next.0
  - @backstage/plugin-search-common@1.1.1-next.0

## 1.4.1-next.0

### Patch Changes

- a7607b5413: Replace usage of deprecataed `UrlReader.read` with `UrlReader.readUrl`.
- a6d779d58a: Remove explicit default visibility at `config.d.ts` files.

  ```ts
  /**
   * @visibility backend
   */
  ```

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-techdocs-node@1.4.2-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/plugin-permission-common@0.7.1-next.0
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/plugin-catalog-common@1.0.8-next.0
  - @backstage/plugin-search-common@1.1.1-next.0

## 1.4.0

### Minor Changes

- 7ced1b4076: Add optional `catalogClient` argument to `createRoute` parameters

### Patch Changes

- 8006f8a602: In order to improve the debuggability of the search indexing process, messages logged during indexing are now tagged with a `documentType` whose value corresponds to the `type` being indexed.
- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-catalog-common@1.0.7
  - @backstage/plugin-techdocs-node@1.4.1
  - @backstage/plugin-permission-common@0.7.0
  - @backstage/catalog-client@1.1.1
  - @backstage/plugin-search-common@1.1.0
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/integration@1.3.2

## 1.4.0-next.2

### Minor Changes

- 7ced1b4076: Add optional `catalogClient` argument to `createRoute` parameters

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.0.7-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-permission-common@0.7.0-next.2
  - @backstage/plugin-techdocs-node@1.4.1-next.2
  - @backstage/plugin-search-common@1.1.0-next.2
  - @backstage/catalog-client@1.1.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2

## 1.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.1.1-next.1
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/plugin-search-common@1.1.0-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/plugin-catalog-common@1.0.7-next.1
  - @backstage/plugin-permission-common@0.6.5-next.1
  - @backstage/plugin-techdocs-node@1.4.1-next.1

## 1.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/plugin-techdocs-node@1.4.1-next.0
  - @backstage/catalog-client@1.1.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/plugin-catalog-common@1.0.7-next.0
  - @backstage/plugin-permission-common@0.6.5-next.0
  - @backstage/plugin-search-common@1.0.2-next.0

## 1.3.0

### Minor Changes

- aa524a5377: Add `projectId` config option to GCP Cloud Storage techdocs publisher. This will allow users to override the project ID, instead of implicitly using the same one as found in a credentials bundle.

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-techdocs-node@1.4.0
  - @backstage/integration@1.3.1
  - @backstage/catalog-client@1.1.0
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1
  - @backstage/plugin-permission-common@0.6.4
  - @backstage/plugin-catalog-common@1.0.6
  - @backstage/plugin-search-common@1.0.1

## 1.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.1.0-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/plugin-permission-common@0.6.4-next.2
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/plugin-techdocs-node@1.4.0-next.2

## 1.3.0-next.1

### Minor Changes

- aa524a5377: Add `projectId` config option to GCP Cloud Storage techdocs publisher. This will allow users to override the project ID, instead of implicitly using the same one as found in a credentials bundle.

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/plugin-techdocs-node@1.4.0-next.1
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/integration@1.3.1-next.1
  - @backstage/catalog-client@1.0.5-next.1
  - @backstage/plugin-permission-common@0.6.4-next.1

## 1.2.2-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/catalog-client@1.0.5-next.0
  - @backstage/integration@1.3.1-next.0
  - @backstage/plugin-permission-common@0.6.4-next.0
  - @backstage/plugin-techdocs-node@1.3.1-next.0
  - @backstage/plugin-catalog-common@1.0.6-next.0
  - @backstage/plugin-search-common@1.0.1-next.0

## 1.2.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/integration@1.3.0
  - @backstage/plugin-techdocs-node@1.3.0
  - @backstage/plugin-catalog-common@1.0.5

## 1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.0.5-next.0
  - @backstage/backend-common@0.15.0-next.1
  - @backstage/integration@1.3.0-next.1
  - @backstage/plugin-techdocs-node@1.3.0-next.1

## 1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/integration@1.3.0-next.0
  - @backstage/plugin-techdocs-node@1.2.1-next.0

## 1.2.0

### Minor Changes

- 860765ff45: Added local publishing target directory `config`: `techdocs.publisher.local.publishDirectory`

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- 726577958f: Add sample headings on the documented component homepage.
- Updated dependencies
  - @backstage/plugin-techdocs-node@1.2.0
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0
  - @backstage/plugin-search-common@1.0.0
  - @backstage/integration@1.2.2
  - @backstage/catalog-client@1.0.4
  - @backstage/plugin-permission-common@0.6.3
  - @backstage/errors@1.1.0
  - @backstage/plugin-catalog-common@1.0.4

## 1.2.0-next.3

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/plugin-techdocs-node@1.2.0-next.3
  - @backstage/catalog-client@1.0.4-next.2
  - @backstage/integration@1.2.2-next.3
  - @backstage/plugin-permission-common@0.6.3-next.1
  - @backstage/catalog-model@1.1.0-next.3

## 1.2.0-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/integration@1.2.2-next.2
  - @backstage/plugin-techdocs-node@1.2.0-next.2

## 1.2.0-next.1

### Minor Changes

- 860765ff45: Added local publishing target directory `config`: `techdocs.publisher.local.publishDirectory`

### Patch Changes

- 726577958f: Add sample headings on the documented component homepage.
- Updated dependencies
  - @backstage/plugin-techdocs-node@1.2.0-next.1
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/catalog-client@1.0.4-next.1
  - @backstage/integration@1.2.2-next.1
  - @backstage/plugin-catalog-common@1.0.4-next.0
  - @backstage/plugin-permission-common@0.6.3-next.0
  - @backstage/plugin-search-common@0.3.6-next.0

## 1.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/integration@1.2.2-next.0
  - @backstage/plugin-techdocs-node@1.1.3-next.0
  - @backstage/catalog-client@1.0.4-next.0

## 1.1.2

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- 61fba6e50b: In order to ensure a good, stable TechDocs user experience when running TechDocs with `techdocs.builder` set to `local`, the number of concurrent builds has been limited to 10. Any additional builds requested concurrently will be queued and handled as prior builds complete. In the unlikely event that you need to handle more concurrent builds, consider scaling out your TechDocs backend deployment or using the `external` option for `techdocs.builder`.
- 5d66d4ff67: Output logs from a TechDocs build to a logging transport in addition to existing
  frontend event stream, for capturing these logs to other sources.

  This allows users to capture debugging information around why tech docs fail to build
  without needing to rely on end users capturing information from their web browser.

  The most common use case is to log to the same place as the rest of the backend
  application logs.

  Sample usage:

  ```
  import { DockerContainerRunner } from '@backstage/backend-common';
  import {
    createRouter,
    Generators,
    Preparers,
    Publisher,
  } from '@backstage/plugin-techdocs-backend';
  import Docker from 'dockerode';
  import { Router } from 'express';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const preparers = await Preparers.fromConfig(env.config, {
      logger: env.logger,
      reader: env.reader,
    });

    const dockerClient = new Docker();
    const containerRunner = new DockerContainerRunner({ dockerClient });

    const generators = await Generators.fromConfig(env.config, {
      logger: env.logger,
      containerRunner,
    });

    const publisher = await Publisher.fromConfig(env.config, {
      logger: env.logger,
      discovery: env.discovery,
    });

    await publisher.getReadiness();

    return await createRouter({
      preparers,
      generators,
      publisher,
      logger: env.logger,
      // Passing a buildLogTransport as a parameter in createRouter will enable
      // capturing build logs to a backend log stream
      buildLogTransport: env.logger,
      config: env.config,
      discovery: env.discovery,
      cache: env.cache,
    });
  }
  ```

- Updated dependencies
  - @backstage/plugin-search-common@0.3.5
  - @backstage/plugin-catalog-common@1.0.3
  - @backstage/backend-common@0.14.0
  - @backstage/integration@1.2.1
  - @backstage/plugin-techdocs-node@1.1.2
  - @backstage/catalog-client@1.0.3
  - @backstage/plugin-permission-common@0.6.2
  - @backstage/catalog-model@1.0.3

## 1.1.2-next.2

### Patch Changes

- 61fba6e50b: In order to ensure a good, stable TechDocs user experience when running TechDocs with `techdocs.builder` set to `local`, the number of concurrent builds has been limited to 10. Any additional builds requested concurrently will be queued and handled as prior builds complete. In the unlikely event that you need to handle more concurrent builds, consider scaling out your TechDocs backend deployment or using the `external` option for `techdocs.builder`.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.5-next.1
  - @backstage/plugin-catalog-common@1.0.3-next.1
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/integration@1.2.1-next.2
  - @backstage/plugin-techdocs-node@1.1.2-next.2

## 1.1.2-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/catalog-client@1.0.3-next.0
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-permission-common@0.6.2-next.0
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-catalog-common@1.0.3-next.0
  - @backstage/plugin-search-common@0.3.5-next.0
  - @backstage/plugin-techdocs-node@1.1.2-next.1

## 1.1.2-next.0

### Patch Changes

- 5d66d4ff67: Output logs from a TechDocs build to a logging transport in addition to existing
  frontend event stream, for capturing these logs to other sources.

  This allows users to capture debugging information around why tech docs fail to build
  without needing to rely on end users capturing information from their web browser.

  The most common use case is to log to the same place as the rest of the backend
  application logs.

  Sample usage:

  ```
  import { DockerContainerRunner } from '@backstage/backend-common';
  import {
    createRouter,
    Generators,
    Preparers,
    Publisher,
  } from '@backstage/plugin-techdocs-backend';
  import Docker from 'dockerode';
  import { Router } from 'express';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const preparers = await Preparers.fromConfig(env.config, {
      logger: env.logger,
      reader: env.reader,
    });

    const dockerClient = new Docker();
    const containerRunner = new DockerContainerRunner({ dockerClient });

    const generators = await Generators.fromConfig(env.config, {
      logger: env.logger,
      containerRunner,
    });

    const publisher = await Publisher.fromConfig(env.config, {
      logger: env.logger,
      discovery: env.discovery,
    });

    await publisher.getReadiness();

    return await createRouter({
      preparers,
      generators,
      publisher,
      logger: env.logger,
      // Passing a buildLogTransport as a parameter in createRouter will enable
      // capturing build logs to a backend log stream
      buildLogTransport: env.logger,
      config: env.config,
      discovery: env.discovery,
      cache: env.cache,
    });
  }
  ```

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/plugin-techdocs-node@1.1.2-next.0

## 1.1.1

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- 1b3ba5d198: Fixed a bug that could cause TechDocs index generation to hang and fail when an underlying TechDocs site's `search_index.json` was empty.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/integration@1.2.0
  - @backstage/config@1.0.1
  - @backstage/plugin-techdocs-node@1.1.1
  - @backstage/plugin-search-common@0.3.4
  - @backstage/catalog-client@1.0.2
  - @backstage/catalog-model@1.0.2
  - @backstage/plugin-catalog-common@1.0.2
  - @backstage/plugin-permission-common@0.6.1

## 1.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.4-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/integration@1.2.0-next.1
  - @backstage/plugin-permission-common@0.6.1-next.0
  - @backstage/plugin-techdocs-node@1.1.1-next.1
  - @backstage/catalog-client@1.0.2-next.0
  - @backstage/plugin-catalog-common@1.0.2-next.0

## 1.1.1-next.0

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/integration@1.2.0-next.0
  - @backstage/plugin-techdocs-node@1.1.1-next.0

## 1.1.0

### Minor Changes

- 733187987b: Removed an undocumented, broken behavior where `README.md` files would be copied to `index.md` if it did not exist, leading to broken links in the TechDocs UI.

  **WARNING**: If you notice 404s in TechDocs after updating, check to make sure that all markdown files referenced in your `mkdocs.yml`s' `nav` sections exist. The following configuration may be used to temporarily revert to the broken behavior.

  ```yaml
  techdocs:
    generator:
      mkdocs:
        legacyCopyReadmeMdToIndexMd: true
  ```

### Patch Changes

- ada4446733: Specify type of `visibilityPermission` property on collators and collator factories.
- 7762d54200: Fixed a bug affecting those with cache enabled that would result in empty content being cached if the first attempt to load a static asset from storage were made via a `HEAD` request, rather than a `GET` request.
- Updated dependencies
  - @backstage/integration@1.1.0
  - @backstage/plugin-permission-common@0.6.0
  - @backstage/catalog-model@1.0.1
  - @backstage/plugin-search-common@0.3.3
  - @backstage/backend-common@0.13.2
  - @backstage/plugin-catalog-common@1.0.1
  - @backstage/plugin-techdocs-node@1.1.0
  - @backstage/catalog-client@1.0.1

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
  - @backstage/plugin-permission-common@0.6.0-next.1
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/integration@1.1.0-next.2
  - @backstage/plugin-techdocs-node@1.1.0-next.2

## 1.0.1-next.1

### Patch Changes

- ada4446733: Specify type of `visibilityPermission` property on collators and collator factories.
- Updated dependencies
  - @backstage/integration@1.1.0-next.1
  - @backstage/plugin-permission-common@0.6.0-next.0
  - @backstage/plugin-catalog-common@1.0.1-next.1
  - @backstage/backend-common@0.13.2-next.1
  - @backstage/plugin-techdocs-node@1.0.1-next.1
  - @backstage/plugin-search-common@0.3.3-next.1

## 1.0.1-next.0

### Patch Changes

- 7762d54200: Fixed a bug affecting those with cache enabled that would result in empty content being cached if the first attempt to load a static asset from storage were made via a `HEAD` request, rather than a `GET` request.
- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.3-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/integration@1.0.1-next.0
  - @backstage/catalog-client@1.0.1-next.0
  - @backstage/plugin-techdocs-node@1.0.1-next.0
  - @backstage/plugin-catalog-common@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Minor Changes

- 700d93ff41: Removed deprecated exports, including:

  - deprecated config `generators` is now deleted and fully replaced with `techdocs.generator`
  - deprecated config `generators.techdocs` is now deleted and fully replaced with `techdocs.generator.runIn`
  - deprecated config `techdocs.requestUrl` is now deleted
  - deprecated config `techdocs.storageUrl` is now deleted
  - deprecated `createHttpResponse` is now deleted and calls to `/sync/:namespace/:kind/:name` needs to be done by an EventSource.

### Patch Changes

- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/catalog-client@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/plugin-catalog-common@1.0.0
  - @backstage/plugin-techdocs-node@1.0.0
  - @backstage/plugin-search-common@0.3.2

## 0.14.2

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- 91bf1e6c1a: Use `@backstage/plugin-techdocs-node` package instead of `@backstage/techdocs-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-techdocs-node@0.11.12
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-catalog-common@0.2.2
  - @backstage/plugin-search-common@0.3.1
  - @backstage/catalog-client@0.9.0

## 0.14.2-next.0

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- 91bf1e6c1a: Use `@backstage/plugin-techdocs-node` package instead of `@backstage/techdocs-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-techdocs-node@0.11.12-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-catalog-common@0.2.2-next.0
  - @backstage/plugin-search-common@0.3.1-next.0
  - @backstage/catalog-client@0.9.0-next.0

## 0.14.1

### Patch Changes

- 6537a601c7: Added a new interface that allows for customization of when to build techdocs
- 899f196af5: Use `getEntityByRef` instead of `getEntityByName` in the catalog client
- 022507c860: A `DefaultTechDocsCollatorFactory`, which works with the new stream-based
  search indexing subsystem, is now available. The `DefaultTechDocsCollator` will
  continue to be available for those unable to upgrade to the stream-based
  `@backstage/plugin-search-backend-node` (and related packages), however it is now
  marked as deprecated and will be removed in a future version.

  To upgrade this plugin and the search indexing subsystem in one go, check
  [this upgrade guide](https://backstage.io/docs/features/search/how-to-guides#how-to-migrate-from-search-alpha-to-beta)
  for necessary changes to your search backend plugin configuration.

- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-catalog-common@0.2.0
  - @backstage/integration@0.8.0
  - @backstage/search-common@0.3.0
  - @backstage/techdocs-common@0.11.11

## 0.14.0

### Minor Changes

- a925ba8385: BREAKING: constructor based initialization of DefaultTechDocsCollator now deprecated. Use static fromConfig method instead.

  ```diff
  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
  -   collator: new DefaultTechDocsCollator({
  +   collator: DefaultTechDocsCollator.fromConfig(config, {
      discovery,
      logger,
      tokenManager,
    }),
  });
  ```

  Note: in an upcoming release, TechDocs backend's /sync/:namespace/:kind/:name endpoint will only respond to text/event-stream-based requests. Update any custom code at your organization accordingly.

### Patch Changes

- 91eb01b5cf: Optimize DefaultTechDocsCollator get entities.
- 919cf2f836: Minor updates to match the new `targetRef` field of relations, and to stop consuming the `target` field
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/techdocs-common@0.11.10
  - @backstage/integration@0.7.5

## 0.13.5

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-client@0.7.1
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/integration@0.7.4
  - @backstage/search-common@0.2.4
  - @backstage/techdocs-common@0.11.9
  - @backstage/plugin-catalog-common@0.1.4

## 0.13.4

### Patch Changes

- 453145abba: Do not use cross-fetch in the backend
- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 811c710a21: Fix bug where tech docs collator stores search indices with wrong entity ref casing. Make the collator to conform legacyPathCasing configuration option.
- 7aeb491394: Replace use of deprecated `ENTITY_DEFAULT_NAMESPACE` constant with `DEFAULT_NAMESPACE`.
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/catalog-client@0.7.0
  - @backstage/errors@0.2.1
  - @backstage/integration@0.7.3
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/search-common@0.2.3
  - @backstage/techdocs-common@0.11.8
  - @backstage/plugin-catalog-common@0.1.3

## 0.13.3

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/backend-common@0.10.7
  - @backstage/techdocs-common@0.11.7

## 0.13.3-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/techdocs-common@0.11.7-next.0

## 0.13.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@0.1.2
  - @backstage/backend-common@0.10.6
  - @backstage/techdocs-common@0.11.6

## 0.13.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@0.1.2-next.0
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/techdocs-common@0.11.6-next.0

## 0.13.1

### Patch Changes

- 4682340457: Add support for permissions to the DefaultTechDocsCollator.
- Updated dependencies
  - @backstage/search-common@0.2.2
  - @backstage/techdocs-common@0.11.5
  - @backstage/backend-common@0.10.5

## 0.13.0

### Minor Changes

- ca2ee182c3: **BREAKING**: The `cache` option is now required by `createRouter`.

  Added catalog-based authorization to TechDocs backend. When permissions are enabled for Backstage (via the `permission.enabled` config) the current user must have read access to the doc's corresponding catalog entity. The backend will return a 404 if the current user doesn't have access or if the entity doesn't exist. Entities are cached to for a short time to optimize the `/static/docs` request path, which can be called many times when loading a single TechDocs page.

  Note: If you publish your TechDocs documentation to storage in a custom way under paths that do not conform to the default `:namespace/:kind/:name` pattern, then TechDocs will not work with permissions enabled. We want understand these use cases better and provide a solution in the future, so reach out to us on Discord in the [#docs-like-code](https://discord.com/channels/687207715902193673/714754240933003266) channel if you would like to help out.

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.7.2
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/techdocs-common@0.11.4
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5

## 0.12.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/techdocs-common@0.11.4-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/catalog-client@0.5.5-next.0
  - @backstage/integration@0.7.2-next.0

## 0.12.3

### Patch Changes

- 5333451def: Cleaned up API exports
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/integration@0.7.1
  - @backstage/backend-common@0.10.3
  - @backstage/techdocs-common@0.11.3
  - @backstage/errors@0.2.0
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9

## 0.12.2

### Patch Changes

- da676a49ab: Add support for API auth in DefaultTechDocsCollator
- Updated dependencies
  - @backstage/techdocs-common@0.11.2
  - @backstage/backend-common@0.10.1
  - @backstage/integration@0.7.0

## 0.12.1

### Patch Changes

- 8c25c3ea5b: Fixed a bug preventing cache from being enabled in TechDocs "recommended" deployment mode.
- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/catalog-client@0.5.3
  - @backstage/techdocs-common@0.11.1

## 0.12.0

### Minor Changes

- 1bada775a9: Added the ability for the TechDocs Backend to (optionally) leverage a cache
  store to improve performance when reading files from a cloud storage provider.

### Patch Changes

- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/backend-common@0.9.13
  - @backstage/techdocs-common@0.11.0

## 0.11.0

### Minor Changes

- 905dd952ac: **BREAKING** `DefaultTechDocsCollator` has a new required option `tokenManager`. See the create-app changelog for how to create a `tokenManager` and add it to the `PluginEnvironment`. It can then be passed to the collator in `createPlugin`:

  ```diff
  // packages/backend/src/plugins/search.ts

  ...
  export default async function createPlugin({
    ...
  + tokenManager,
  }: PluginEnvironment) {
    ...

    indexBuilder.addCollator({
      defaultRefreshIntervalSeconds: 600,
      collator: DefaultTechDocsCollator.fromConfig(config, {
        discovery,
        logger,
  +     tokenManager,
      }),
    });

    ...
  }
  ```

### Patch Changes

- b055a6addc: Align on usage of `cross-fetch` vs `node-fetch` in frontend vs backend packages, and remove some unnecessary imports of either one of them
- Updated dependencies
  - @backstage/integration@0.6.10
  - @backstage/backend-common@0.9.12

## 0.10.9

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
  - @backstage/techdocs-common@0.10.8

## 0.10.8

### Patch Changes

- e21e3c6102: Bumping minimum requirements for `dockerode` and `testcontainers`
- 9e64a7ac1e: Allow amazon web services s3 buckets to pass an server side encryption configuration so they can publish to encrypted buckets
- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10
  - @backstage/techdocs-common@0.10.7

## 0.10.7

### Patch Changes

- b45607a2ec: Make techdocs s3 publisher credentials config schema optional.

## 0.10.6

### Patch Changes

- 106a5dc3ad: Restore original casing for `kind`, `namespace` and `name` in `DefaultTechDocsCollator`.
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/backend-common@0.9.8
  - @backstage/catalog-model@0.9.6
  - @backstage/search-common@0.2.1
  - @backstage/techdocs-common@0.10.5

## 0.10.5

### Patch Changes

- 177401b571: Display entity title (if defined) in titles of TechDocs search results
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/techdocs-common@0.10.4
  - @backstage/backend-common@0.9.7
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.10.4

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.4
  - @backstage/backend-common@0.9.6
  - @backstage/catalog-client@0.5.0
  - @backstage/integration@0.6.7
  - @backstage/techdocs-common@0.10.3

## 0.10.3

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.5
  - @backstage/catalog-client@0.4.0
  - @backstage/catalog-model@0.9.3
  - @backstage/backend-common@0.9.4
  - @backstage/config@0.1.10

## 0.10.2

### Patch Changes

- 1d346ba903: Modify TechDocsCollator to be aware of new TechDocs URL pattern. Modify tech docs in context search to use correct casing when creating initial filter.
- Updated dependencies
  - @backstage/backend-common@0.9.3
  - @backstage/integration@0.6.4
  - @backstage/techdocs-common@0.10.1

## 0.10.1

### Patch Changes

- 30ed662a3: Adding in-context search to TechDocs Reader component. Using existing search-backend to query for indexed search results scoped into a specific entity's techdocs. Needs TechDocsCollator enabled on the backend to work.

  Adding extra information to indexed tech docs documents for search.

- a42a142c2: Errors encountered while attempting to load TechDocs search indices at
  collation-time are now logged at `DEBUG` instead of `WARN` level.
- Updated dependencies
  - @backstage/techdocs-common@0.10.0
  - @backstage/integration@0.6.3
  - @backstage/search-common@0.2.0
  - @backstage/catalog-model@0.9.1
  - @backstage/backend-common@0.9.1

## 0.10.0

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
  - @backstage/techdocs-common@0.9.0

## 0.9.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/backend-common@0.8.9
  - @backstage/techdocs-common@0.8.1

## 0.9.1

### Patch Changes

- 48ea3d25b: The recommended value for a `backstage.io/techdocs-ref` annotation is now
  `dir:.`, indicating "documentation source files are located in the same
  directory relative to the catalog entity." Note that `url:<location>` values
  are still supported.
- Updated dependencies
  - @backstage/backend-common@0.8.8
  - @backstage/config@0.1.6
  - @backstage/integration@0.5.9
  - @backstage/techdocs-common@0.8.0
  - @backstage/search-common@0.1.3

## 0.9.0

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

- 9266b80ab: Implements tech docs collator to retrieve and expose search indexes for entities that have tech docs configured
- Updated dependencies
  - @backstage/techdocs-common@0.7.0
  - @backstage/catalog-client@0.3.17
  - @backstage/backend-common@0.8.7

## 0.8.7

### Patch Changes

- f1200f44c: Rewrite the `/sync/:namespace/:kind/:name` endpoint to support an event-stream as response.
  This change allows the sync process to take longer than a normal HTTP timeout.
  The stream also emits log events, so the caller can follow the build process in the frontend.
- 35a67722b: It is no longer required to provide a generator and a preparer to the TechDocs
  router factory when running TechDocs in the "recommended" (e.g. externally
  prepared and generated docs) configuration.
- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6
  - @backstage/techdocs-common@0.6.8

## 0.8.6

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0
  - @backstage/techdocs-common@0.6.7
  - @backstage/backend-common@0.8.5

## 0.8.5

### Patch Changes

- b47fc34bc: Update "service catalog" references to "software catalog"
- Updated dependencies
  - @backstage/backend-common@0.8.4
  - @backstage/techdocs-common@0.6.6

## 0.8.4

### Patch Changes

- fea7fa0ba: Return a `304 Not Modified` from the `/sync/:namespace/:kind/:name` endpoint if nothing was built. This enables the caller to know whether a refresh of the docs page will return updated content (-> `201 Created`) or not (-> `304 Not Modified`).
- Updated dependencies
  - @backstage/techdocs-common@0.6.5
  - @backstage/catalog-model@0.8.4

## 0.8.3

### Patch Changes

- 6013a16dc: TechDocs: Support configurable working directory as temp dir
- 3108ff7bf: Make `yarn dev` respect the `PLUGIN_PORT` environment variable.
- Updated dependencies
  - @backstage/backend-common@0.8.3
  - @backstage/catalog-model@0.8.3

## 0.8.2

### Patch Changes

- Updated dependencies [8cefadca0]
- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/techdocs-common@0.6.3
  - @backstage/catalog-model@0.8.0

## 0.8.1

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
- Updated dependencies [e04f1ccfb]
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9
  - @backstage/techdocs-common@0.6.1

## 0.8.0

### Minor Changes

- e0bfd3d44: Migrate the plugin to use the `ContainerRunner` interface instead of `runDockerContainer(…)`.
  It also provides the `ContainerRunner` to the generators instead of to the `createRouter` function.

  To apply this change to an existing backend application, add the following to `src/plugins/techdocs.ts`:

  ```diff
  + import { DockerContainerRunner } from '@backstage/backend-common';

    // ...

    export default async function createPlugin({
      logger,
      config,
      discovery,
      reader,
    }: PluginEnvironment): Promise<Router> {
      // Preparers are responsible for fetching source files for documentation.
      const preparers = await Preparers.fromConfig(config, {
        logger,
        reader,
      });

  +   // Docker client (conditionally) used by the generators, based on techdocs.generators config.
  +   const dockerClient = new Docker();
  +   const containerRunner = new DockerContainerRunner({ dockerClient });

      // Generators are used for generating documentation sites.
      const generators = await Generators.fromConfig(config, {
        logger,
  +     containerRunner,
      });

      // Publisher is used for
      // 1. Publishing generated files to storage
      // 2. Fetching files from storage and passing them to TechDocs frontend.
      const publisher = await Publisher.fromConfig(config, {
        logger,
        discovery,
      });

      // checks if the publisher is working and logs the result
      await publisher.getReadiness();

  -   // Docker client (conditionally) used by the generators, based on techdocs.generators config.
  -   const dockerClient = new Docker();

      return await createRouter({
        preparers,
        generators,
        publisher,
  -     dockerClient,
        logger,
        config,
        discovery,
      });
    }
  ```

### Patch Changes

- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [e0bfd3d44]
- Updated dependencies [d8b81fd28]
- Updated dependencies [e9e56b01a]
  - @backstage/backend-common@0.7.0
  - @backstage/techdocs-common@0.6.0
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.7.1

### Patch Changes

- cba5944fc: Change the response status of metadata endpoints in case a documentation is not
  available to `404 NOT FOUND`. This also introduces the JSON based error messages
  used by other backends.
- Updated dependencies [bc9d62f4f]
- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
  - @backstage/techdocs-common@0.5.0
  - @backstage/catalog-model@0.7.7

## 0.7.0

### Minor Changes

- aaeb7ecf3: When newer documentation available but not built, show older documentation while async building newer
  TechDocs backend: /sync endpoint added to support above, returns immediate success if docs don't need a build, returns delayed success after build if needed
  TechDocs backend: /docs endpoint removed as frontend can directly request to techdocs.storageUrl or /static/docs

## 0.6.5

### Patch Changes

- e7baa0d2e: Separate techdocs-backend and frontend config schema declarations
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
- Updated dependencies [424742dc1]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4
  - @backstage/techdocs-common@0.4.5

## 0.6.4

### Patch Changes

- aa095e469: OpenStack Swift publisher added for tech-docs.
- 761698831: Bump to the latest version of the Knex library.
- 02d78290a: Enhanced the example documented-component to better demonstrate TechDocs features
- a501128db: Refactor log messaging to improve clarity
- Updated dependencies [d7245b733]
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [2ef5bc7ea]
- Updated dependencies [761698831]
- Updated dependencies [aa095e469]
- Updated dependencies [bc46435f5]
- Updated dependencies [a501128db]
- Updated dependencies [ca4a904f6]
  - @backstage/backend-common@0.5.6
  - @backstage/techdocs-common@0.4.4
  - @backstage/catalog-model@0.7.4

## 0.6.3

### Patch Changes

- 52b5bc3e2: Forward authorization header on backend request if present
- 15eee03bc: Use external url for static docs
- f43192207: remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [f43192207]
- Updated dependencies [8adb48df4]
- Updated dependencies [61299519f]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5
  - @backstage/techdocs-common@0.4.3

## 0.6.2

### Patch Changes

- f37992797: Got rid of some `attr` and cleaned up a bit in the TechDocs config schema.
- Updated dependencies [bad21a085]
- Updated dependencies [2499f6cde]
- Updated dependencies [a1f5e6545]
- Updated dependencies [1e4ddd71d]
  - @backstage/catalog-model@0.7.2
  - @backstage/techdocs-common@0.4.2
  - @backstage/config@0.1.3

## 0.6.1

### Patch Changes

- b0a41c707: Add etag of the prepared file tree to techdocs_metadata.json in the storage
- Updated dependencies [16fb1d03a]
- Updated dependencies [491f3a0ec]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
- Updated dependencies [26e143e60]
- Updated dependencies [c6655413d]
- Updated dependencies [44414239f]
- Updated dependencies [b0a41c707]
  - @backstage/backend-common@0.5.4
  - @backstage/techdocs-common@0.4.1

## 0.6.0

### Minor Changes

- 08142b256: URL Preparer will now use proper etag based caching introduced in https://github.com/backstage/backstage/pull/4120. Previously, builds used to be cached for 30 minutes.

### Patch Changes

- 08142b256: TechDocs will throw warning in backend logs when legacy git preparer or dir preparer is used to preparer docs. Migrate to URL Preparer by updating `backstage.io/techdocs-ref` annotation to be prefixed with `url:`.
  Detailed docs are here https://backstage.io/docs/features/techdocs/how-to-guides#how-to-use-url-reader-in-techdocs-prepare-step
  See benefits and reason for doing so https://github.com/backstage/backstage/issues/4409
- Updated dependencies [77ad0003a]
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [5a5163519]
- Updated dependencies [08142b256]
- Updated dependencies [08142b256]
  - @backstage/techdocs-common@0.4.0
  - @backstage/backend-common@0.5.3

## 0.5.5

### Patch Changes

- c777df180: 1. Added option to use Azure Blob Storage as a choice to store the static generated files for TechDocs.
- e44925723: `techdocs.requestUrl` and `techdocs.storageUrl` are now optional configs and the discovery API will be used to get the URL where techdocs plugin is hosted.
- Updated dependencies [c777df180]
- Updated dependencies [2430ee7c2]
- Updated dependencies [6e612ce25]
- Updated dependencies [e44925723]
- Updated dependencies [025e122c3]
- Updated dependencies [7881f2117]
- Updated dependencies [f0320190d]
- Updated dependencies [11cb5ef94]
  - @backstage/techdocs-common@0.3.7
  - @backstage/backend-common@0.5.2
  - @backstage/catalog-model@0.7.1

## 0.5.4

### Patch Changes

- a5e27d5c1: Create type for TechDocsMetadata (#3716)

  This change introduces a new type (TechDocsMetadata) in packages/techdocs-common. This type is then introduced in the endpoint response in techdocs-backend and in the api interface in techdocs (frontend).

- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [53c9c51f2]
- Updated dependencies [a5e27d5c1]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0
  - @backstage/techdocs-common@0.3.5

## 0.5.3

### Patch Changes

- 68ad5af51: Improve techdocs-common Generator API for it to be used by techdocs-cli. TechDocs generator.run function now takes
  an input AND an output directory. Most probably you use techdocs-common via plugin-techdocs-backend, and so there
  is no breaking change for you.
  But if you use techdocs-common separately, you need to create an output directory and pass into the generator.
- cb7af51e7: If using Url Reader, cache downloaded source files for 30 minutes.
- Updated dependencies [68ad5af51]
- Updated dependencies [f3b064e1c]
- Updated dependencies [371f67ecd]
- Updated dependencies [f1e74777a]
- Updated dependencies [dbe4450c3]
- Updated dependencies [5826d0973]
- Updated dependencies [b3b9445df]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/techdocs-common@0.3.3
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.5.2

### Patch Changes

- 7ec525481: 1. Added option to use AWS S3 as a choice to store the static generated files for TechDocs.
- Updated dependencies [7ec525481]
- Updated dependencies [5ecd50f8a]
- Updated dependencies [f8ba88ded]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/techdocs-common@0.3.2
  - @backstage/backend-common@0.4.2

## 0.5.1

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

- 359f9d2d8: Added configuration schema for the commonly used properties of techdocs and techdocs-backend plugins
- Updated dependencies [8804e8981]
  - @backstage/techdocs-common@0.3.1

## 0.5.0

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

### Patch Changes

- Updated dependencies [a8573e53b]
  - @backstage/techdocs-common@0.3.0

## 0.4.0

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

  4. `techdocs.storageUrl` is now a required config. Should be `http://localhost:7000/api/techdocs/static/docs` in most setups.

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
- Updated dependencies [dae4f3983]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/techdocs-common@0.2.0
  - @backstage/backend-common@0.4.1

## 0.3.2

### Patch Changes

- 1e22f8e0b: Unify `dockerode` library and type dependency versions
- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0

## 0.3.1

### Patch Changes

- ae95c7ff3: Update URL auth format for GitLab clone
- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0

## 0.3.0

### Minor Changes

- 4b53294a6: - Use techdocs annotation to add repo_url if missing in mkdocs.yml. Having repo_url creates a Edit button on techdocs pages.
  - techdocs-backend: API endpoint `/metadata/mkdocs/*` renamed to `/metadata/techdocs/*`

### Patch Changes

- Updated dependencies [3aa7efb3f]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2
  - @backstage/catalog-model@0.3.1

## 0.2.2

### Patch Changes

- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1

## 0.2.1

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.2.0

### Minor Changes

- 6d29605db: Change the default backend plugin mount point to /api
- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 5a920c6e4: Updated naming of environment variables. New pattern [NAME]\_TOKEN for GitHub, GitLab, Azure & GitHub Enterprise access tokens.

  ### Detail:

  - Previously we have to export same token for both, catalog & scaffolder

  ```bash
  export GITHUB_ACCESS_TOKEN=foo
  export GITHUB_PRIVATE_TOKEN=foo
  ```

  with latest changes, only single export is sufficient.

  ```bash
  export GITHUB_TOKEN=foo
  export GITLAB_TOKEN=foo
  export GHE_TOKEN=foo
  export AZURE_TOKEN=foo
  ```

  ### list:

  <table>
    <tr>
      <th>Old name</th>
      <th>New name</th>
    </tr>
    <tr>
      <td>GITHUB_ACCESS_TOKEN</td>
      <td>GITHUB_TOKEN</td>
    </tr>
    <tr>
      <td>GITHUB_PRIVATE_TOKEN</td>
      <td>GITHUB_TOKEN</td>
    </tr>
    <tr>
      <td>GITLAB_ACCESS_TOKEN</td>
      <td>GITLAB_TOKEN</td>
    </tr>
    <tr>
      <td>GITLAB_PRIVATE_TOKEN</td>
      <td>GITLAB_TOKEN</td>
    </tr>
    <tr>
      <td>AZURE_PRIVATE_TOKEN</td>
      <td>AZURE_TOKEN</td>
    </tr>
    <tr>
      <td>GHE_PRIVATE_TOKEN</td>
      <td>GHE_TOKEN</td>
    </tr>
  </table>

### Patch Changes

- 22ff8fba5: Replacing the hard coded `baseApiUrl` by reading the value from configuration to enable private GitHub setup for TechDocs.
- Updated dependencies [3a4236570]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [a768a07fb]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [5adfc005e]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [fa56f4615]
- Updated dependencies [8afce088a]
- Updated dependencies [b3d57961c]
- Updated dependencies [7bbeb049f]
  - @backstage/catalog-model@0.2.0
  - @backstage/backend-common@0.2.0
