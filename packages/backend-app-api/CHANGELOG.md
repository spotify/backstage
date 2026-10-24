# @backstage/backend-app-api

## 1.9.0-next.0

### Minor Changes

- 1c93987: Add optional `beginAt` timestamps to `PluginStartupResult` and `ModuleStartupResult` in the `BackendStartupResult` returned by `backend.start()`. The new timestamp marks when a plugin's or module's init function was invoked, i.e. after its dependencies were resolved. Together with the existing `resultAt` this makes it possible to see how long each individual plugin's or module's init function took, separate from time spent waiting for other plugins to initialize. It is undefined when a plugin or module failed before reaching initialization.

## 1.8.0

### Minor Changes

- e956084: Added an `instanceId` option to `createSpecializedBackend`. Each backend instance uses a random UUID by default.

### Patch Changes

- f6054ac: Updated undeclared-connection errors to direct plugin authors to `declareConnection` from `@backstage/backend-plugin-api/alpha`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/connections@0.4.1

## 1.8.0-next.2

### Patch Changes

- f6054ac: Updated undeclared-connection errors to direct plugin authors to `declareConnection` from `@backstage/backend-plugin-api/alpha`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.2

## 1.8.0-next.1

### Minor Changes

- e956084: Added an `instanceId` option to `createSpecializedBackend`. Each backend instance uses a random UUID by default.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1

## 1.7.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/connections@0.4.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## 1.7.4

### Patch Changes

- Updated dependencies
  - @backstage/connections@0.4.0
  - @backstage/config@1.3.9
  - @backstage/backend-plugin-api@1.10.1

## 1.7.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.9-next.0
  - @backstage/connections@0.4.0-next.0
  - @backstage/backend-plugin-api@1.10.1-next.1

## 1.7.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.1-next.0

## 1.7.3

### Patch Changes

- 64cea29: Updated the backend runtime to use the internal connection service implementation after the shared connection contract moved into `@backstage/connections`.
- 03133fc: Hardened backend startup against malformed installed backend features, with contextual input errors and configured boot-failure handling when invalid registrations can be attributed to a plugin or module.
- Updated dependencies
  - @backstage/connections@0.3.0
  - @backstage/backend-plugin-api@1.10.0

## 1.7.3-next.1

### Patch Changes

- 03133fc: Hardened backend startup against malformed installed backend features, with contextual input errors and configured boot-failure handling when invalid registrations can be attributed to a plugin or module.
- Updated dependencies
  - @backstage/connections@0.3.0-next.2

## 1.7.3-next.0

### Patch Changes

- 64cea29: Updated the backend runtime to use the internal connection service implementation after the shared connection contract moved into `@backstage/connections`.
- Updated dependencies
  - @backstage/connections@0.3.0-next.0
  - @backstage/backend-plugin-api@1.10.0-next.0

## 1.7.2

### Patch Changes

- Updated dependencies
  - @backstage/connections@0.2.0
  - @backstage/backend-plugin-api@1.9.3

## 1.7.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/connections@0.1.1-next.0

## 1.7.1

### Patch Changes

- 2e895ea: Internal refactor.
- Updated dependencies
  - @backstage/connections@0.1.0
  - @backstage/backend-plugin-api@1.9.2

## 1.7.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.2-next.0

## 1.7.0

### Minor Changes

- 3595c97: Added `ExtensionPointFactoryMiddleware` type and `createExtensionPointFactoryMiddleware` helper to reimplement extension point outputs at backend creation time.

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/config@1.3.8

## 1.7.0-next.0

### Minor Changes

- 3595c97: Added `ExtensionPointFactoryMiddleware` type and `createExtensionPointFactoryMiddleware` helper to reimplement extension point outputs at backend creation time.

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/config@1.3.8-next.0

## 1.6.1

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/config@1.3.7

## 1.6.1-next.2

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/config@1.3.7-next.0

## 1.6.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1

## 1.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7

## 1.6.0

### Minor Changes

- 545557a: Registration errors should be forwarded as BackendStartupResult

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0

## 1.6.0-next.1

### Minor Changes

- 545557a: Registration errors should be forwarded as BackendStartupResult

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1

## 1.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7

## 1.5.0

### Minor Changes

- f1d29b4: Added support for extension point factories, along with the ability to report module startup failures via the extension point factory context.

### Patch Changes

- 6bb2f21: Fixed memory leak by properly cleaning up process event listeners on backend shutdown.
- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0

## 1.5.0-next.1

### Patch Changes

- 6bb2f21: Fixed memory leak by properly cleaning up process event listeners on backend shutdown.
- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0-next.1

## 1.5.0-next.0

### Minor Changes

- f1d29b4: Added support for extension point factories, along with the ability to report module startup failures via the extension point factory context.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7

## 1.4.1

### Patch Changes

- 04db26b: Clean up process event listeners on backend stop to prevent leaks
- Updated dependencies
  - @backstage/backend-plugin-api@1.6.1

## 1.4.0

### Minor Changes

- 5a2d538: Introduced backend startup result tracking and error handling. The `Backend.start()` method now returns a `BackendStartupResult` with detailed success/failure status and timing information for all plugins and modules. When startup fails, a `BackendStartupError` is thrown that includes the complete startup results, making it easier to diagnose which plugins or modules failed.

  This also improves the default error message when backend startup fails, and of course makes it possible to craft your own custom error reporting based on the startup results.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0

## 1.4.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7

## 1.4.0-next.0

### Minor Changes

- 5a2d538: Introduced backend startup result tracking and error handling. The `Backend.start()` method now returns a `BackendStartupResult` with detailed success/failure status and timing information for all plugins and modules. When startup fails, a `BackendStartupError` is thrown that includes the complete startup results, making it easier to diagnose which plugins or modules failed.

  This also improves the default error message when backend startup fails, and of course makes it possible to craft your own custom error reporting based on the startup results.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7

## 1.3.0

### Minor Changes

- a17d9df: Updates API for `instanceMetadata` service to return a list of plugins not features.

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6

## 1.3.0-next.1

### Minor Changes

- a17d9df: Updates API for `instanceMetadata` service to return a list of plugins not features.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.1

## 1.2.9-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/config@1.3.6-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/errors@1.2.7

## 1.2.8

### Patch Changes

- dd69cf6: Moved up registration of unhandled rejections and errors listeners to be done as early as possible, avoiding flakiness in backend startups and instead always logging these failures rather than sometimes crashing the process.
- Updated dependencies
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4

## 1.2.8-next.1

### Patch Changes

- dd69cf6: Moved up registration of unhandled rejections and errors listeners to be done as early as possible, avoiding flakiness in backend startups and instead always logging these failures rather than sometimes crashing the process.

## 1.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/backend-plugin-api@1.4.4-next.0

## 1.2.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.3

## 1.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.3-next.0

## 1.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## 1.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7

## 1.2.5

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/backend-plugin-api@1.4.1

## 1.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0

## 1.2.4

### Patch Changes

- bb9a501: Fixed a bug where occasionally the initialization order of multiple modules consuming a single extension point could happen in the wrong order.
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 1.2.4-next.2

### Patch Changes

- bb9a501: Fixed a bug where occasionally the initialization order of multiple modules consuming a single extension point could happen in the wrong order.
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 1.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 1.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0

## 1.2.3

### Patch Changes

- 729a7d6: Added a configuration to permit backend plugin module failures on startup:

  ```yaml
  backend:
    ...
    startup:
      plugins:
        plugin-x:
          modules:
            module-y:
              onPluginModuleBootFailure: continue
  ```

  This configuration permits `plugin-x` with `module-y` to fail on startup. Omitting the
  `onPluginModuleBootFailure` configuration matches the previous behavior, wherein any
  individual plugin module failure is forwarded to the plugin and aborts backend startup.

  The default can also be changed, so that continuing on failure is the default
  unless otherwise specified:

  ```yaml
  backend:
    startup:
      default:
        onPluginModuleBootFailure: continue
      plugins:
        catalog:
          modules:
            github:
              onPluginModuleBootFailure: abort
  ```

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 1.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 1.2.3-next.1

### Patch Changes

- 729a7d6: Added a configuration to permit backend plugin module failures on startup:

  ```yaml
  backend:
    ...
    startup:
      plugins:
        plugin-x:
          modules:
            module-y:
              onPluginModuleBootFailure: continue
  ```

  This configuration permits `plugin-x` with `module-y` to fail on startup. Omitting the
  `onPluginModuleBootFailure` configuration matches the previous behavior, wherein any
  individual plugin module failure is forwarded to the plugin and aborts backend startup.

  The default can also be changed, so that continuing on failure is the default
  unless otherwise specified:

  ```yaml
  backend:
    startup:
      default:
        onPluginModuleBootFailure: continue
      plugins:
        catalog:
          modules:
            github:
              onPluginModuleBootFailure: abort
  ```

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 1.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 1.2.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 1.2.1

### Patch Changes

- f422984: Remove unused dependencies
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 1.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.10.0-next.0
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/plugin-permission-node@0.8.9-next.1

## 1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.9.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-node@0.8.9-next.1

## 1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.8.9-next.0
  - @backstage/plugin-auth-node@0.6.1-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/config-loader@1.9.6

## 1.2.0

### Minor Changes

- 92a56f6: **BREAKING ALPHA**: Removed the deprecated `featureDiscoveryServiceFactory`. Existing usage can be replaced with `discoveryFeatureLoader` from `@backstage/backend-defaults`.

### Patch Changes

- ad9aba2: The log message written when plugins fail to initialize now includes the error that caused the plugin startup to fail.
- 5622362: Added a configuration to permit backend plugin failures on startup:

  ```yaml
  backend:
    ...
    startup:
      plugins:
        plugin-x:
          onPluginBootFailure: continue
  ```

  This configuration permits `plugin-x` to fail on startup. Omitting the
  `onPluginBootFailure` configuration matches the previous behavior, wherein any
  individual plugin failure aborts backend startup.

  The default can also be changed, so that continuing on failure is the default
  unless otherwise specified:

  ```yaml
  backend:
    startup:
      default:
        onPluginBootFailure: continue
      plugins:
        catalog:
          onPluginBootFailure: abort
  ```

- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8
  - @backstage/config-loader@1.9.6
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-auth-node@0.6.0
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 1.2.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8-next.2
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/config-loader@1.9.6-next.0
  - @backstage/plugin-auth-node@0.6.0-next.2
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 1.2.0-next.2

### Minor Changes

- 92a56f6: **BREAKING ALPHA**: Removed the deprecated `featureDiscoveryServiceFactory`. Existing usage can be replaced with `discoveryFeatureLoader` from `@backstage/backend-defaults`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/plugin-auth-node@0.6.0-next.1
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.9.6-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-node@0.8.8-next.1

## 1.1.2-next.1

### Patch Changes

- ad9aba2: The log message written when plugins fail to initialize now includes the error that caused the plugin startup to fail.
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.9.6-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.5.7-next.0
  - @backstage/plugin-permission-node@0.8.8-next.0

## 1.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8-next.0
  - @backstage/config-loader@1.9.6-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.5.7-next.0

## 1.1.1

### Patch Changes

- 02534c7: Corrected spelling mistake in error message
- Updated dependencies
  - @backstage/types@1.2.1
  - @backstage/config-loader@1.9.5
  - @backstage/plugin-permission-node@0.8.7
  - @backstage/plugin-auth-node@0.5.6
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 1.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/config@1.3.2-next.0
  - @backstage/config-loader@1.9.5-next.1
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.1
  - @backstage/plugin-permission-node@0.8.7-next.1
  - @backstage/cli-common@0.1.15

## 1.1.1-next.0

### Patch Changes

- 02534c7: Corrected spelling mistake in error message
- Updated dependencies
  - @backstage/config-loader@1.9.5-next.0
  - @backstage/plugin-permission-node@0.8.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/types@1.2.0

## 1.1.0

### Minor Changes

- ebf083d: Service factories added by feature loaders now have lower priority and will be ignored if a factory for the same service is added directly by `backend.add(serviceFactory)`.
- 12eac85: **EXPERIMENTAL**: Adds a new `instanceMetadataService` to hold information about a specific backend instance.

### Patch Changes

- eef3ef1: Removed unused `express` dependencies.
- ae2408b: Add a `toString` on the default `BackendFeatureMeta` implementations
- 5c9cc05: Use native fetch instead of node-fetch
- 0e9c9fa: As soon as a backend termination signal is received, call before shutting down root lifecycle hooks.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-permission-node@0.8.6
  - @backstage/config-loader@1.9.3
  - @backstage/errors@1.2.6
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1
  - @backstage/types@1.2.0

## 1.1.0-next.2

### Minor Changes

- ebf083d: Service factories added by feature loaders now have lower priority and will be ignored if a factory for the same service is added directly by `backend.add(serviceFactory)`.

### Patch Changes

- 0e9c9fa: As soon as a backend termination signal is received, call before shutting down root lifecycle hooks.
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-permission-node@0.8.6-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-auth-node@0.5.5-next.2
  - @backstage/config-loader@1.9.3-next.1
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1-next.0
  - @backstage/types@1.2.0

## 1.1.0-next.1

### Minor Changes

- 12eac85: **EXPERIMENTAL**: Adds a new `instanceMetadataService` to hold information about a specific backend instance.

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/config-loader@1.9.3-next.0
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/plugin-permission-node@0.8.6-next.1
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0

## 1.0.3-next.0

### Patch Changes

- eef3ef1: Removed unused `express` dependencies.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.0
  - @backstage/config-loader@1.9.2
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-permission-node@0.8.6-next.0

## 1.0.2

### Patch Changes

- 4e58bc7: Upgrade to uuid v11 internally
- 5d74716: Remove unused backend-common dependency
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0
  - @backstage/config-loader@1.9.2
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/cli-common@0.1.15
  - @backstage/errors@1.2.5
  - @backstage/plugin-permission-node@0.8.5

## 1.0.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.2-next.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.8.5-next.2

## 1.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.2-next.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.4-next.1
  - @backstage/plugin-permission-node@0.8.5-next.1

## 1.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.8.5-next.0

## 1.0.1

### Patch Changes

- ffd1f4a: Plugin lifecycle shutdown hooks are now performed before root lifecycle shutdown hooks.
- fd6e6f4: build(deps): bump `cookie` from 0.6.0 to 0.7.0
- 094eaa3: Remove references to in-repo backend-common
- 04af116: The backend will no longer exit immediately if any plugin or modules fails to initialize. Instead, the backend will wait for all plugins and modules to either start up successfully or throw, and then shut down the backend if there were any initialization errors.

  This fixes an issue where backend initialization errors in adjacent plugins during database schema migration could cause the database migrations to be stuck in a locked state.

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/plugin-permission-node@0.8.4
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.0.1-next.1

### Patch Changes

- ffd1f4a: Plugin lifecycle shutdown hooks are now performed before root lifecycle shutdown hooks.
- fd6e6f4: build(deps): bump `cookie` from 0.6.0 to 0.7.0
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.8.4-next.1

## 1.0.1-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- 04af116: The backend will no longer exit immediately if any plugin or modules fails to initialize. Instead, the backend will wait for all plugins and modules to either start up successfully or throw, and then shut down the backend if there were any initialization errors.

  This fixes an issue where backend initialization errors in adjacent plugins during database schema migration could cause the database migrations to be stuck in a locked state.

- Updated dependencies
  - @backstage/plugin-permission-node@0.8.4-next.0
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.0.0

### Major Changes

- ec1b4be: Release 1.0 of the new backend system! :tada:

  The backend system is finally getting promoted to 1.0.0. This means that the API is now stable and breaking changes should not occur until version 2.0.0, see our [package versioning policy](https://backstage.io/docs/overview/versioning-policy/#package-versioning-policy) for more information what this means.

  This release also marks the end of the old backend system based on `createRouter` exports. Going forward backend plugins packages will start to deprecate and later this year remove exports supporting the old backend system. If you would like to help out with this transition, see https://github.com/backstage/backstage/issues/26353 or consult the [migration guide](https://backstage.io/docs/backend-system/building-plugins-and-modules/migrating/#remove-support-for-the-old-backend-system).

### Minor Changes

- 19ff127: **BREAKING**: The deprecated `identityServiceFactory` and `tokenManagerServiceFactory` have been removed.
- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- cd38da8: Deprecate the `featureDiscoveryServiceFactory` in favor of using `@backstage/backend-defaults#discoveryFeatureLoader` instead.
- 8ccf784: All created backend instances now share a the same `process` exit listeners, and on exit the process will wait for all backend instances to shut down before exiting. This fixes the `EventEmitter` leak warnings in tests.
- 6ed9264: chore(deps): bump `path-to-regexp` from 6.2.2 to 8.0.0
- c246372: Updated the error message for missing service dependencies to include the plugin and module IDs.
- 7f779c7: `auth.externalAccess` should be optional in the config schema
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- 51a69b5: Fix feature loaders in CJS double-default nested builds
- 0b2a402: Updates to the config schema to match reality
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/plugin-permission-node@0.8.3
  - @backstage/config-loader@1.9.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.0.0-next.2

### Major Changes

- ec1b4be: Release 1.0 of the new backend system! :tada:

  The backend system is finally getting promoted to 1.0.0. This means that the API is now stable and breaking changes should not occur until version 2.0.0, see our [package versioning policy](https://backstage.io/docs/overview/versioning-policy/#package-versioning-policy) for more information what this means.

  This release also marks the end of the old backend system based on `createRouter` exports. Going forward backend plugins packages will start to deprecate and later this year remove exports supporting the old backend system. If you would like to help out with this transition, see https://github.com/backstage/backstage/issues/26353 or consult the [migration guide](https://backstage.io/docs/backend-system/building-plugins-and-modules/migrating/#remove-support-for-the-old-backend-system).

### Patch Changes

- 6ed9264: chore(deps): bump `path-to-regexp` from 6.2.2 to 8.0.0
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/config-loader@1.9.1-next.0
  - @backstage/plugin-permission-node@0.8.3-next.2
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.10.0-next.1

### Patch Changes

- c246372: Updated the error message for missing service dependencies to include the plugin and module IDs.
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.8.3-next.1

## 0.10.0-next.0

### Minor Changes

- 19ff127: **BREAKING**: The deprecated `identityServiceFactory` and `tokenManagerServiceFactory` have been removed.
- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- cd38da8: Deprecate the `featureDiscoveryServiceFactory` in favor of using `@backstage/backend-defaults#discoveryFeatureLoader` instead.
- 7f779c7: `auth.externalAccess` should be optional in the config schema
- 51a69b5: Fix feature loaders in CJS double-default nested builds
- 0b2a402: Updates to the config schema to match reality
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-permission-node@0.8.3-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.9.0

### Minor Changes

- da4fde5: **BREAKING**: Removed several deprecated service factories. These can instead be imported from `@backstage/backend-defaults` package.
- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.
- 389f5a4: Remove deprecated `urlReaderServiceFactory`, please import from `@backstage/backend-defaults/urlReader` instead.

### Patch Changes

- 8b13183: Added support for the latest version of `BackendFeature`s from `@backstage/backend-plugin-api`, including feature loaders.
- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- 7c5f3b0: Update the `ServiceRegister` implementation to enable registering multiple service implementations for a given service ref.
- 80a0737: Added configuration for the `packages` options to config schema
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/config-loader@1.9.0
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/plugin-permission-node@0.8.1
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.7
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.8.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.7
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.0-next.2
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.0-next.3
  - @backstage/plugin-permission-node@0.8.1-next.3

## 0.8.1-next.2

### Patch Changes

- 8b13183: Added support for the latest version of `BackendFeature`s from `@backstage/backend-plugin-api`, including feature loaders.
- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- 7c5f3b0: Update the `ServiceRegister` implementation to enable registering multiple service implementations for a given service ref.
- 80a0737: Added configuration for the `packages` options to config schema
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/config-loader@1.9.0-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/plugin-permission-node@0.8.1-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/cli-node@0.2.7
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.8.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.9.0-next.1
  - @backstage/plugin-permission-node@0.8.1-next.1
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.7
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.1

## 0.8.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/config-loader@1.8.2-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.7
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.0
  - @backstage/plugin-permission-node@0.8.1-next.0

## 0.8.0

### Minor Changes

- 1cb84d7: **BREAKING**: Removed the depreacted `getPath` option from `httpRouterServiceFactory`, as well as the `HttpRouterFactoryOptions` type.
- f691c9b: **BREAKING**: Removed the ability to pass callback-form service factories through the `defaultServiceFactories` option of `createSpecializedBackend`. This is an immediate breaking change as usage of this function is expected to be very rare.

### Patch Changes

- 2f99178: The `ServiceFactoryTest.get` method was deprecated and the `ServiceFactoryTest.getSubject` should be used instead. The `getSubject` method has the same behavior, but has a better method name to indicate that the service instance returned is the subject currently being tested.
- b05e1e1: Service factories exported by this package have been updated to use the new service factory format that doesn't use a callback.
- 617a7d2: Internal refactor that avoids the use of service factory options.
- b60db08: Fixing exporting of classes properly from new packages
- 18b96b1: The ability to install backend features in callback form (`() => BackendFeature`) has been deprecated. This typically means that you need to update the installed features to use the latest version of `@backstage/backend-plugin-api`. If the feature is from a third-party package, please reach out to the package maintainer to update it.
- a63c4b6: Fixing issue with `MiddlewareFactory` deprecation wrapping
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/cli-node@0.2.7
  - @backstage/backend-tasks@0.5.27
  - @backstage/plugin-permission-node@0.8.0
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/config-loader@1.8.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.7.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.6
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.8.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.17-next.1
  - @backstage/plugin-permission-node@0.7.33-next.1

## 0.7.9-next.0

### Patch Changes

- b60db08: Fixing exporting of classes properly from new packages
- a63c4b6: Fixing issue with `MiddlewareFactory` deprecation wrapping
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/plugin-permission-node@0.7.32-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.6
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.8.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.7.6

### Patch Changes

- b7de623: Fixed a potential crash when passing an object with a `null` prototype as log meta.
- 9539a0b: Deprecated `authServiceFactory`, `httpAuthServiceFactory`, and `userInfoServiceFactory`. Please import them from `@backstage/backend-defaults/auth`, `@backstage/backend-defaults/httpAuth`, and `@backstage/backend-defaults/userInfo` respectively instead.
- 3e823d3: Limited user tokens will no longer include the `ent` field in its payload. Ownership claims will now be fetched from the user info service.

  NOTE: Limited tokens issued prior to this change will no longer be valid. Users may have to clear their browser cookies in order to refresh their auth tokens.

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- 398b82a: Add support for JWKS tokens in ExternalTokenHandler.
- 9e63318: Added an optional `accessRestrictions` to external access service tokens and service principals in general, such that you can limit their access to certain plugins or permissions.
- e25e467: Added a new static key based method for plugin-to-plugin auth. This is useful for example if you are running readonly service nodes that cannot use a database for the default public-key signature scheme outlined in [BEP-0003](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution). Most users should want to stay on the more secure zero-config database signature scheme.

  You can generate a public and private key pair using `openssl`.

  - First generate a private key using the ES256 algorithm

    ```sh
    openssl ecparam -name prime256v1 -genkey -out private.ec.key
    ```

  - Convert it to PKCS#8 format

    ```sh
    openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private.ec.key -out private.key
    ```

  - Extract the public key

    ```sh
    openssl ec -inform PEM -outform PEM -pubout -in private.key -out public.key
    ```

  After this you have the files `private.key` and `public.key`. Put them in a place where you know their absolute paths, and then set up your app-config accordingly:

  ```yaml
  backend:
    auth:
      keyStore:
        type: static
        static:
          keys:
            - publicKeyFile: /absolute/path/to/public.key
              privateKeyFile: /absolute/path/to/private.key
              keyId: some-custom-id
  ```

- 7d30d95: Fixing issue with log meta fields possibly being circular refs
- 6a576dc: Stop using `getVoidLogger` in tests to reduce the dependency on the soon-to-deprecate `backstage-common` package.
- 6551b3d: Deprecated core service factories and implementations and moved them over to
  subpath exports on `@backstage/backend-defaults` instead. E.g.
  `@backstage/backend-defaults/scheduler` is where the service factory and default
  implementation of `coreServices.scheduler` now lives.
- d617103: Updating the logger redaction message to something less dramatic
- Updated dependencies
  - @backstage/cli-node@0.2.6
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/plugin-permission-node@0.7.30
  - @backstage/cli-common@0.1.14
  - @backstage/config-loader@1.8.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.7.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.2.6-next.2
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/plugin-permission-node@0.7.30-next.3
  - @backstage/cli-common@0.1.14-next.0
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config-loader@1.8.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.7.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.2.6-next.1
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-permission-node@0.7.30-next.2
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/config-loader@1.8.0
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.7.6-next.1

### Patch Changes

- 398b82a: Add support for JWKS tokens in ExternalTokenHandler.
- 9e63318: Added an optional `accessRestrictions` to external access service tokens and service principals in general, such that you can limit their access to certain plugins or permissions.
- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/plugin-permission-node@0.7.30-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/cli-node@0.2.6-next.0
  - @backstage/config-loader@1.8.0
  - @backstage/plugin-auth-node@0.4.14-next.1

## 0.7.6-next.0

### Patch Changes

- b7de623: Fixed a potential crash when passing an object with a `null` prototype as log meta.
- 7d30d95: Fixing issue with log meta fields possibly being circular refs
- 6a576dc: Stop using `getVoidLogger` in tests to reduce the dependency on the soon-to-deprecate `backstage-common` package.
- 6551b3d: Deprecated core service factories and implementations and moved them over to
  subpath exports on `@backstage/backend-defaults` instead. E.g.
  `@backstage/backend-defaults/scheduler` is where the service factory and default
  implementation of `coreServices.scheduler` now lives.
- d617103: Updating the logger redaction message to something less dramatic
- Updated dependencies
  - @backstage/cli-node@0.2.6-next.0
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/plugin-permission-node@0.7.30-next.0
  - @backstage/config-loader@1.8.0
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.7.3

### Patch Changes

- 4cd5ff0: Add ability to configure the Node.js HTTP Server when configuring the root HTTP Router service
- e8199b1: Move the JWKS registration outside of the lifecycle middleware
- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- dc8c5dd: The default `TokenManager` implementation no longer requires keys to be configured in production, but it will throw an errors when generating or authenticating tokens. The default `AuthService` implementation will now also provide additional context if such an error is throw when falling back to using the `TokenManager` service to generate tokens for outgoing requests.
- 025641b: Redact `meta` fields too with the logger
- 09f8988: Remove explicit `alg` check for user tokens in `verifyToken`
- 5863e02: Internal refactor to only create one external token handler
- a1dc547: Added support for camel case CSP directives in app-config. For example:

  ```yaml
  backend:
    csp:
      upgradeInsecureRequests: false
  ```

- 329cc34: Added logging of all plugins being initialized, periodic status, and completion.
- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-auth-node@0.4.13
  - @backstage/plugin-permission-node@0.7.29

## 0.7.2-next.1

### Patch Changes

- 09f8988: Remove explicit `alg` check for user tokens in `verifyToken`
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/plugin-permission-node@0.7.29-next.1
  - @backstage/cli-node@0.2.5
  - @backstage/config-loader@1.8.0
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.7.1-next.0

### Patch Changes

- 4cd5ff0: Add ability to configure the Node.js HTTP Server when configuring the root HTTP Router service
- e8199b1: Move the JWKS registration outside of the lifecycle middleware
- dc8c5dd: The default `TokenManager` implementation no longer requires keys to be configured in production, but it will throw an errors when generating or authenticating tokens. The default `AuthService` implementation will now also provide additional context if such an error is throw when falling back to using the `TokenManager` service to generate tokens for outgoing requests.
- 025641b: Redact `meta` fields too with the logger
- 5863e02: Internal refactor to only create one external token handler
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.5
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.8.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.7.29-next.0

## 0.7.0

### Minor Changes

- 3256f14: **BREAKING**: Modules are no longer loaded unless the plugin that they extend is present.

### Patch Changes

- 10327fb: Deprecate the `getPath` option for the `httpRouterServiceFactory` and more generally the ability to configure plugin API paths to be anything else than `/api/:pluginId/`. Requests towards `/api/*` that do not match an installed plugin will also no longer be handled by the index router, typically instead returning a 404.
- 2c50516: Fix auth cookie issuance for split backend deployments by preferring to set it against the request target host instead of origin
- 7e584d6: Fixed a bug where expired cookies would not be refreshed.
- 1a20b12: Make the auth service create and validate dedicated OBO tokens, containing the user identity proof.
- 00fca28: Implemented support for external access using both the legacy token form and static tokens.
- d5a1fe1: Replaced winston logger with `LoggerService`
- bce0879: Service-to-service authentication has been improved.

  Each plugin now has the capability to generate its own signing keys for token issuance. The generated public keys are stored in a database, and they are made accessible through a newly created endpoint: `/.backstage/auth/v1/jwks.json`.

  `AuthService` can now issue tokens with a reduced scope using the `getPluginRequestToken` method. This improvement enables plugins to identify the plugin originating the request.

- 54f2ac8: Added `initialization` option to `createServiceFactory` which defines the initialization strategy for the service. The default strategy mimics the current behavior where plugin scoped services are initialized lazily by default and root scoped services are initialized eagerly.
- 56f81b5: Improved error message thrown by `AuthService` when requesting a token for plugins that don't support the new authentication tokens.
- 25ea3d2: Minor internal restructuring
- d62bc51: Add support for limited user tokens by using user identity proof provided by the auth backend.
- c884b9a: Automatically creates a get and delete cookie endpoint when a `user-cookie` policy is added.
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/config-loader@1.8.0
  - @backstage/plugin-permission-node@0.7.28
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/backend-tasks@0.5.22
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/cli-node@0.2.5
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.7.0-next.1

### Minor Changes

- 3256f14: **BREAKING**: Modules are no longer loaded unless the plugin that they extend is present.

### Patch Changes

- 10327fb: Deprecate the `getPath` option for the `httpRouterServiceFactory` and more generally the ability to configure plugin API paths to be anything else than `/api/:pluginId/`. Requests towards `/api/*` that do not match an installed plugin will also no longer be handled by the index router, typically instead returning a 404.
- 1a20b12: Make the auth service create and validate dedicated OBO tokens, containing the user identity proof.
- bce0879: Service-to-service authentication has been improved.

  Each plugin now has the capability to generate its own signing keys for token issuance. The generated public keys are stored in a database, and they are made accessible through a newly created endpoint: `/.backstage/auth/v1/jwks.json`.

  `AuthService` can now issue tokens with a reduced scope using the `getPluginRequestToken` method. This improvement enables plugins to identify the plugin originating the request.

- 54f2ac8: Added `initialization` option to `createServiceFactory` which defines the initialization strategy for the service. The default strategy mimics the current behavior where plugin scoped services are initialized lazily by default and root scoped services are initialized eagerly.
- d62bc51: Add support for limited user tokens by using user identity proof provided by the auth backend.
- c884b9a: Automatically creates a get and delete cookie endpoint when a `user-cookie` policy is added.
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/plugin-permission-node@0.7.28-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.8.0-next.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.6.3-next.0

### Patch Changes

- 7e584d6: Fixed a bug where expired cookies would not be refreshed.
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/config-loader@1.8.0-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.12-next.0
  - @backstage/plugin-permission-node@0.7.28-next.0

## 0.6.2

### Patch Changes

- e848644: Temporarily revert the rate limiting
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-permission-node@0.7.27
  - @backstage/backend-tasks@0.5.21
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.6.1

### Patch Changes

- de1f45d: Temporarily revert the rate limiting
- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/backend-tasks@0.5.20
  - @backstage/plugin-permission-node@0.7.26
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.6.0

### Minor Changes

- 4a3d434: **BREAKING**: For users that have migrated to the new backend system, incoming requests will now be rejected if they are not properly authenticated (e.g. with a Backstage bearer token or a backend token). Please see the [Auth Service Migration tutorial](https://backstage.io/docs/tutorials/auth-service-migration) for more information on how to circumvent this behavior in the short term and how to properly leverage it in the longer term.

  Added service factories for the new [`auth`](https://backstage.io/docs/backend-system/core-services/auth/), [`httpAuth`](https://backstage.io/docs/backend-system/core-services/http-auth), and [`userInfo`](https://backstage.io/docs/backend-system/core-services/user-info) services that were created as part of [BEP-0003](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution).

### Patch Changes

- 999224f: Bump dependency `minimatch` to v9
- 81e0120: Fixed an issue where configuration schema for the purpose of redacting secrets from logs was not being read correctly.
- 15fda44: Provide some sane defaults for `WinstonLogger.create` making some of the arguments optional
- 0502d82: Updated the `permissionsServiceFactory` to forward the `AuthService` to the implementation.
- 9d91128: Add the possibility to disable watching files in the new backend system
- a5d341e: Adds an initial rate-limiting implementation so that any incoming requests that have a `'none'` principal are rate-limited automatically.
- 9802004: Made the `DefaultUserInfoService` claims check stricter
- f235ca7: Make sure to not filter out schemas in `createConfigSecretEnumerator`
- af5f7a6: The experimental feature discovery service exported at the `/alpha` sub-path will no longer attempt to load packages that are not Backstage backend packages.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/config-loader@1.7.0
  - @backstage/backend-tasks@0.5.19
  - @backstage/plugin-permission-node@0.7.25
  - @backstage/cli-node@0.2.4
  - @backstage/cli-common@0.1.13
  - @backstage/types@1.1.1

## 0.6.0-next.2

### Patch Changes

- 15fda44: Provide some sane defaults for `WinstonLogger.create` making some of the arguments optional
- 9d91128: Add the possibility to disable watching files in the new backend system
- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/config-loader@1.7.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.7.25-next.2

## 0.6.0-next.1

### Patch Changes

- 81e0120: Fixed an issue where configuration schema for the purpose of redacting secrets from logs was not being read correctly.
- f235ca7: Make sure to not filter out schemas in `createConfigSecretEnumerator`
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/config-loader@1.7.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## 0.6.0-next.0

### Minor Changes

- 4a3d434: **BREAKING**: For users that have migrated to the new backend system, incoming requests will now be rejected if they are not properly authenticated (e.g. with a Backstage bearer token or a backend token). Please see the [Auth Service Migration tutorial](https://backstage.io/docs/tutorials/auth-service-migration) for more information on how to circumvent this behavior in the short term and how to properly leverage it in the longer term.

  Added service factories for the new [`auth`](https://backstage.io/docs/backend-system/core-services/auth/), [`httpAuth`](https://backstage.io/docs/backend-system/core-services/http-auth), and [`userInfo`](https://backstage.io/docs/backend-system/core-services/user-info) services that were created as part of [BEP-0003](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution).

### Patch Changes

- 999224f: Bump dependency `minimatch` to v9
- 0502d82: Updated the `permissionsServiceFactory` to forward the `AuthService` to the implementation.
- 9802004: Made the `DefaultUserInfoService` claims check stricter
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/plugin-permission-node@0.7.24-next.0
  - @backstage/cli-node@0.2.4-next.0
  - @backstage/config-loader@1.6.3-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/types@1.1.1

## 0.5.11

### Patch Changes

- e0c18ef: Include the extension point ID and the module ID in the backend init error message.
- 7ae5704: Updated the default error handling middleware to filter out certain known error types that should never be returned in responses. The errors are instead logged along with a correlation ID, which is also returned in the response. Initially only PostgreSQL protocol errors from the `pg-protocol` package are filtered out.
- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 54ad8e1: Allow the `createConfigSecretEnumerator` to take an optional `schema` argument with an already-loaded global configuration schema.
- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/cli-node@0.2.3
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/backend-tasks@0.5.15
  - @backstage/config-loader@1.6.2
  - @backstage/plugin-permission-node@0.7.21
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.11-next.3

### Patch Changes

- 54ad8e1: Allow the `createConfigSecretEnumerator` to take an optional `schema` argument with an already-loaded global configuration schema.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/cli-node@0.2.3-next.0
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/config-loader@1.6.2-next.0
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/plugin-permission-node@0.7.21-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.11-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/plugin-permission-node@0.7.21-next.2
  - @backstage/config@1.1.1
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.2
  - @backstage/config-loader@1.6.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.2
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.6.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.4-next.1
  - @backstage/plugin-permission-node@0.7.21-next.1

## 0.5.11-next.0

### Patch Changes

- e0c18ef: Include the extension point ID and the module ID in the backend init error message.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/cli-node@0.2.2
  - @backstage/config-loader@1.6.1
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/plugin-permission-node@0.7.21-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.10

### Patch Changes

- 516fd3e: Updated README to reflect release status
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/config-loader@1.6.1
  - @backstage/cli-node@0.2.2
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-permission-node@0.7.20
  - @backstage/backend-tasks@0.5.14
  - @backstage/plugin-auth-node@0.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.10-next.2

### Patch Changes

- 516fd3e: Updated README to reflect release status
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-auth-node@0.4.3-next.2
  - @backstage/plugin-permission-node@0.7.20-next.2
  - @backstage/backend-tasks@0.5.14-next.2
  - @backstage/cli-node@0.2.2-next.0
  - @backstage/config-loader@1.6.1-next.0

## 0.5.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.6.1-next.0
  - @backstage/cli-node@0.2.2-next.0
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/plugin-permission-node@0.7.20-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.1
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.6.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.0
  - @backstage/plugin-permission-node@0.7.20-next.0

## 0.5.9

### Patch Changes

- 1da5f43: Ensure redaction of secrets that have accidental extra whitespace around them
- 9f8f266: Add redacting for secrets in stack traces of logs
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/config-loader@1.6.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/plugin-permission-node@0.7.19
  - @backstage/cli-node@0.2.1
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.9-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.0
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.6.0-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.3
  - @backstage/plugin-permission-node@0.7.19-next.3

## 0.5.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.6.0-next.0
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.7.19-next.2

## 0.5.9-next.1

### Patch Changes

- 1da5f434f3: Ensure redaction of secrets that have accidental extra whitespace around them
- 9f8f266ff4: Add redacting for secrets in stack traces of logs
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.0
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.5.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-permission-node@0.7.19-next.1

## 0.5.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/plugin-auth-node@0.4.2-next.0
  - @backstage/plugin-permission-node@0.7.19-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.0
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.5.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.8

### Patch Changes

- bc9a18d5ec: Added a workaround for double `default` wrapping when dynamically importing CommonJS modules with default exports.
- Updated dependencies
  - @backstage/config-loader@1.5.3
  - @backstage/cli-node@0.2.0
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1
  - @backstage/plugin-permission-node@0.7.18

## 0.5.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-auth-node@0.4.1-next.2
  - @backstage/plugin-permission-node@0.7.18-next.2
  - @backstage/config-loader@1.5.3-next.0

## 0.5.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/config-loader@1.5.3-next.0
  - @backstage/plugin-auth-node@0.4.1-next.1
  - @backstage/plugin-permission-node@0.7.18-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.0-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.8-next.0

### Patch Changes

- bc9a18d5ec: Added a workaround for double `default` wrapping when dynamically importing CommonJS modules with default exports.
- Updated dependencies
  - @backstage/config-loader@1.5.2-next.0
  - @backstage/cli-node@0.2.0-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1-next.0
  - @backstage/plugin-permission-node@0.7.18-next.0

## 0.5.6

### Patch Changes

- 74491c9602: Moved `HostDiscovery` from `@backstage/backend-common`.
- a4617c422a: Added `watch` option to configuration loaders that can be used to disable file watching by setting it to `false`.
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/config-loader@1.5.1
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/cli-node@0.1.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.5.6-next.2

### Patch Changes

- 74491c9602: Moved `HostDiscovery` from `@backstage/backend-common`.
- a4617c422a: Added `watch` option to configuration loaders that can be used to disable file watching by setting it to `false`.
- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-auth-node@0.4.0-next.2
  - @backstage/config-loader@1.5.1-next.1
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-permission-node@0.7.17-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/cli-common@0.1.13-next.0
  - @backstage/cli-node@0.1.5-next.1
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1

## 0.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/plugin-auth-node@0.3.2-next.1
  - @backstage/plugin-permission-node@0.7.16-next.1
  - @backstage/config@1.1.0
  - @backstage/cli-common@0.1.13-next.0
  - @backstage/cli-node@0.1.5-next.0
  - @backstage/config-loader@1.5.1-next.0
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1

## 0.5.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.2-next.0
  - @backstage/config-loader@1.5.1-next.0
  - @backstage/cli-common@0.1.13-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/cli-node@0.1.5-next.0
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.7.16-next.0

## 0.5.3

### Patch Changes

- 154632d8753b: Add support for discovering additional service factories during startup.
- 37a20c7f14aa: Adds include and exclude configuration to feature discovery of backend packages
  Adds alpha modules to feature discovery
- cb7fc410ed99: The experimental backend feature discovery now only considers default exports from packages. It no longer filters packages to include based on the package role, except that `'cli'` packages are ignored. However, the `"backstage"` field is still required in `package.json`.
- 3fc64b9e2f8f: Extension points are now tracked via their ID rather than reference, in order to support package duplication.
- 3b30b179cb38: Add support for installing features as package imports, for example `backend.add(import('my-plugin'))`.
- b219d097b3f4: Backend startup will now fail if any circular service dependencies are detected.
- Updated dependencies
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/plugin-auth-node@0.3.0
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.7.14
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/config-loader@1.5.0
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.4

## 0.5.3-next.3

### Patch Changes

- 154632d8753b: Add support for discovering additional service factories during startup.
- cb7fc410ed99: The experimental backend feature discovery now only considers default exports from packages. It no longer filters packages to include based on the package role, except that `'cli'` packages are ignored. However, the `"backstage"` field is still required in `package.json`.
- 3b30b179cb38: Add support for installing features as package imports, for example `backend.add(import('my-plugin'))`.
- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/types@1.1.1-next.0
  - @backstage/plugin-permission-node@0.7.14-next.3
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.4-next.0
  - @backstage/config-loader@1.5.0-next.3
  - @backstage/plugin-auth-node@0.3.0-next.3

## 0.5.3-next.2

### Patch Changes

- 37a20c7f14aa: Adds include and exclude configuration to feature discovery of backend packages
  Adds alpha modules to feature discovery
- 3fc64b9e2f8f: Extension points are now tracked via their ID rather than reference, in order to support package duplication.
- b219d097b3f4: Backend startup will now fail if any circular service dependencies are detected.
- Updated dependencies
  - @backstage/config-loader@1.5.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.3
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.5.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/config-loader@1.5.0-next.1
  - @backstage/plugin-auth-node@0.3.0-next.1
  - @backstage/plugin-permission-node@0.7.14-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.3
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.5.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.0
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/config-loader@1.5.0-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.3
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-node@0.7.13-next.0

## 0.5.0

### Minor Changes

- b9c57a4f857e: **BREAKING**: Renamed `configServiceFactory` to `rootConfigServiceFactory`.
- a6d7983f349c: **BREAKING**: Removed the `services` option from `createBackend`. Service factories are now `BackendFeature`s and should be installed with `backend.add(...)` instead. The following should be migrated:

  ```ts
  const backend = createBackend({ services: [myCustomServiceFactory] });
  ```

  To instead pass the service factory via `backend.add(...)`:

  ```ts
  const backend = createBackend();
  backend.add(customRootLoggerServiceFactory);
  ```

### Patch Changes

- e65c4896f755: Do not throw in backend.stop, if start failed
- c7aa4ff1793c: Allow modules to register extension points.
- 57a10c6c69cc: Add validation to make sure that extension points do not cross plugin boundaries.
- cc9256a33bcc: Added new experimental `featureDiscoveryServiceFactory`, available as an `/alpha` export.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/config-loader@1.4.0
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/cli-node@0.1.3
  - @backstage/plugin-auth-node@0.2.17
  - @backstage/backend-tasks@0.5.5
  - @backstage/plugin-permission-node@0.7.11
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.5.0-next.2

### Patch Changes

- e65c4896f755: Do not throw in backend.stop, if start failed
- cc9256a33bcc: Added new experimental `featureDiscoveryServiceFactory`, available as an `/alpha` export.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2
  - @backstage/config-loader@1.4.0-next.1

## 0.5.0-next.1

### Minor Changes

- b9c57a4f857e: **BREAKING**: Renamed `configServiceFactory` to `rootConfigServiceFactory`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/config-loader@1.4.0-next.1
  - @backstage/plugin-auth-node@0.2.17-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/plugin-permission-node@0.7.11-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.4.0-next.0
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.17-next.0
  - @backstage/plugin-permission-node@0.7.11-next.0

## 0.4.5

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/backend-tasks@0.5.4
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/config-loader@1.3.2
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16
  - @backstage/plugin-permission-node@0.7.10

## 0.4.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/config-loader@1.3.2-next.0
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16-next.0
  - @backstage/plugin-permission-node@0.7.10-next.0

## 0.4.4

### Patch Changes

- 3bb4158a8aa4: Switched startup strategy to initialize all plugins in parallel, as well as hook into the new startup lifecycle hooks.
- 68a21956ef52: Remove reference to deprecated import
- a5c5491ff50c: Use `durationToMilliseconds` from `@backstage/types` instead of our own
- 2c9f67e6f166: Introduced built-in middleware into the default `HttpService` implementation that throws a `ServiceNotAvailable` error when plugins aren't able to serve request. Also introduced a request stalling mechanism that pauses incoming request until plugins have been fully initialized.
- c4e8fefd9f13: Added handling of `ServiceUnavailableError` to error handling middleware.
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/types@1.1.0
  - @backstage/config-loader@1.3.1
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-auth-node@0.2.15
  - @backstage/plugin-permission-node@0.7.9
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8

## 0.4.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/config-loader@1.3.1-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.2
  - @backstage/plugin-permission-node@0.7.9-next.2

## 0.4.4-next.1

### Patch Changes

- 3bb4158a8aa4: Switched startup strategy to initialize all plugins in parallel, as well as hook into the new startup lifecycle hooks.
- 2c9f67e6f166: Introduced built-in middleware into the default `HttpService` implementation that throws a `ServiceNotAvailable` error when plugins aren't able to serve request. Also introduced a request stalling mechanism that pauses incoming request until plugins have been fully initialized.
- c4e8fefd9f13: Added handling of `ServiceUnavailableError` to error handling middleware.
- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-auth-node@0.2.15-next.1
  - @backstage/plugin-permission-node@0.7.9-next.1
  - @backstage/config-loader@1.3.1-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.4.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.3.1-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.0
  - @backstage/plugin-permission-node@0.7.9-next.0

## 0.4.3

### Patch Changes

- cf13b482f9e: Switch `configServiceFactory` to use `ConfigSources` from `@backstage/config-loader` to load config.
- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/config-loader@1.3.0
  - @backstage/plugin-permission-node@0.7.8
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-auth-node@0.2.14
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config-loader@1.3.0-next.0
  - @backstage/config@1.0.7

## 0.4.3-next.0

### Patch Changes

- cf13b482f9e: Switch `configServiceFactory` to use `ConfigSources` from `@backstage/config-loader` to load config.
- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/config-loader@1.3.0-next.0
  - @backstage/plugin-permission-node@0.7.8-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-auth-node@0.2.14-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.4.2

### Patch Changes

- 5c7ce585824: Allow an additionalConfig to be provided to loadBackendConfig that fetches config values during runtime.
- 8cce2205a39: Register unhandled rejection and uncaught exception handlers to avoid backend crashes.
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/config-loader@1.2.0
  - @backstage/plugin-permission-node@0.7.7
  - @backstage/backend-tasks@0.5.1
  - @backstage/plugin-auth-node@0.2.13
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.4.2-next.2

### Patch Changes

- 5c7ce585824: Allow an additionalConfig to be provided to loadBackendConfig that fetches config values during runtime.
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/plugin-permission-node@0.7.7-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/config-loader@1.1.9
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.2

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.7.7-next.1
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/config-loader@1.1.9
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.1

## 0.4.2-next.0

### Patch Changes

- 8cce2205a39: Register unhandled rejection and uncaught exception handlers to avoid backend crashes.
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/config-loader@1.1.9
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.0
  - @backstage/plugin-permission-node@0.7.7-next.0

## 0.4.1

### Patch Changes

- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 482dae5de1c: Updated link to docs.
- 915e46622cf: Add support for `NotImplementedError`, properly returning 501 as status code.
- Updated dependencies
  - @backstage/plugin-permission-node@0.7.6
  - @backstage/plugin-auth-node@0.2.12
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/config-loader@1.1.9
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12-next.2
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-permission-node@0.7.6-next.2
  - @backstage/config@1.0.7-next.0

## 0.4.1-next.1

### Patch Changes

- 482dae5de1c: Updated link to docs.
- 915e46622cf: Add support for `NotImplementedError`, properly returning 501 as status code.
- Updated dependencies
  - @backstage/plugin-permission-node@0.7.6-next.1
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/config-loader@1.1.9-next.0
  - @backstage/plugin-auth-node@0.2.12-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/cli-common@0.1.12-next.0
  - @backstage/config@1.0.7-next.0
  - @backstage/types@1.0.2

## 0.4.1-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/cli-common@0.1.11
  - @backstage/config@1.0.6
  - @backstage/config-loader@1.1.8
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.12-next.0
  - @backstage/plugin-permission-node@0.7.6-next.0

## 0.4.0

### Minor Changes

- 01a075ec1d: **BREAKING**: Renamed `RootHttpRouterConfigureOptions` to `RootHttpRouterConfigureContext`, and removed the unused type `ServiceOrExtensionPoint`.
- 4ae71b7f2e: **BREAKING** Renaming `*Factory` exports to `*ServiceFactory` instead. For example `configFactory` now is exported as `configServiceFactory`.
- d31d8e00b3: **BREAKING** `HttpServerCertificateOptions` when specified with a `key` and `cert` should also have the `type: 'pem'` instead of `type: 'plain'`

### Patch Changes

- a18da2f8b5: Fixed an issue were the log redaction didn't properly escape RegExp characters.
- 5febb216fe: Updated to match the new `CacheService` interface.
- e716946103: Updated usage of the lifecycle service.
- f60cca9da1: Updated database factory to pass service deps required for restoring database state during development.
- 610d65e143: Updates to match new `BackendFeature` type.
- 725383f69d: Tweaked messaging in the README.
- b86efa2d04: Updated usage of `ServiceFactory`.
- ab22515647: The shutdown signal handlers are now installed as part of the backend instance rather than the lifecycle service, and explicitly cause the process to exit.
- b729f9f31f: Moved the options of the `config` and `rootHttpRouter` services out to the factories themselves, where they belong
- ed8b5967d7: `HttpRouterFactoryOptions.getPath` is now optional as a default value is always provided in the factory.
- 71a5ec0f06: Updated usages of `LogMeta`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/backend-tasks@0.4.3
  - @backstage/cli-common@0.1.11
  - @backstage/config@1.0.6
  - @backstage/config-loader@1.1.8
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11
  - @backstage/plugin-permission-node@0.7.5

## 0.4.0-next.2

### Minor Changes

- 01a075ec1d: **BREAKING**: Renamed `RootHttpRouterConfigureOptions` to `RootHttpRouterConfigureContext`, and removed the unused type `ServiceOrExtensionPoint`.
- 4ae71b7f2e: **BREAKING** Renaming `*Factory` exports to `*ServiceFactory` instead. For example `configFactory` now is exported as `configServiceFactory`.
- d31d8e00b3: **BREAKING** `HttpServerCertificateOptions` when specified with a `key` and `cert` should also have the `type: 'pem'` instead of `type: 'plain'`

### Patch Changes

- e716946103: Updated usage of the lifecycle service.
- f60cca9da1: Updated database factory to pass service deps required for restoring database state during development.
- 610d65e143: Updates to match new `BackendFeature` type.
- ab22515647: The shutdown signal handlers are now installed as part of the backend instance rather than the lifecycle service, and explicitly cause the process to exit.
- b729f9f31f: Moved the options of the `config` and `rootHttpRouter` services out to the factories themselves, where they belong
- 71a5ec0f06: Updated usages of `LogMeta`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/plugin-auth-node@0.2.11-next.2
  - @backstage/plugin-permission-node@0.7.5-next.2
  - @backstage/cli-common@0.1.11
  - @backstage/config@1.0.6
  - @backstage/config-loader@1.1.8
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/cli-common@0.1.11
  - @backstage/config@1.0.6
  - @backstage/config-loader@1.1.8
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11-next.1
  - @backstage/plugin-permission-node@0.7.5-next.1

## 0.3.2-next.0

### Patch Changes

- a18da2f8b5: Fixed an issue were the log redaction didn't properly escape RegExp characters.
- ed8b5967d7: `HttpRouterFactoryOptions.getPath` is now optional as a default value is always provided in the factory.
- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/plugin-auth-node@0.2.11-next.0
  - @backstage/plugin-permission-node@0.7.5-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.3.0

### Minor Changes

- 02b119ff93: **BREAKING**: The `httpRouterFactory` now accepts a `getPath` option rather than `indexPlugin`. To set up custom index path, configure the new `rootHttpRouterFactory` with a custom `indexPath` instead.

  Added an implementation for the new `rootHttpRouterServiceRef`.

### Patch Changes

- ecc6bfe4c9: Use new `ServiceFactoryOrFunction` type.
- b99c030f1b: Moved over implementation of the root HTTP service from `@backstage/backend-common`, and replaced the `middleware` option with a `configure` callback option.
- 170282ece6: Fixed a bug in the default token manager factory where it created multiple incompatible instances.
- 843a0a158c: Added service factory for the new core identity service.
- 150a7dd790: An error will now be thrown if attempting to override the plugin metadata service.
- 483e907eaf: Internal updates of `createServiceFactory` from `@backstage/backend-plugin-api`.
- 015a6dced6: The `createSpecializedBackend` function will now throw an error if duplicate service implementations are provided.
- e3fca10038: Tweaked the plugin logger to use `plugin` as the label for the plugin ID, rather than `pluginId`.
- ecbec4ec4c: Internal refactor to match new options pattern in the experimental backend system.
- 51b7a7ed07: Exported the default root HTTP router implementation as `DefaultRootHttpRouter`. It only implements the routing layer and needs to be exposed via an HTTP server similar to the built-in setup in the `rootHttpRouterFactory`.
- 0e63aab311: Moved over logging and configuration loading implementations from `@backstage/backend-common`. There is a now `WinstonLogger` which implements the `RootLoggerService` through Winston with accompanying utilities. For configuration the `loadBackendConfig` function has been moved over, but it now instead returns an object with a `config` property.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- 3b8fd4169b: Internal folder structure refactor.
- 6cfd4d7073: Updated implementations for the new `RootLifecycleService`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/backend-tasks@0.4.1
  - @backstage/config@1.0.6
  - @backstage/cli-common@0.1.11
  - @backstage/config-loader@1.1.8
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.9
  - @backstage/plugin-permission-node@0.7.3

## 0.3.0-next.1

### Minor Changes

- 02b119ff93: **BREAKING**: The `httpRouterFactory` now accepts a `getPath` option rather than `indexPlugin`. To set up custom index path, configure the new `rootHttpRouterFactory` with a custom `indexPath` instead.

  Added an implementation for the new `rootHttpRouterServiceRef`.

### Patch Changes

- ecc6bfe4c9: Use new `ServiceFactoryOrFunction` type.
- b99c030f1b: Moved over implementation of the root HTTP service from `@backstage/backend-common`, and replaced the `middleware` option with a `configure` callback option.
- 150a7dd790: An error will now be thrown if attempting to override the plugin metadata service.
- 015a6dced6: The `createSpecializedBackend` function will now throw an error if duplicate service implementations are provided.
- e3fca10038: Tweaked the plugin logger to use `plugin` as the label for the plugin ID, rather than `pluginId`.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/plugin-permission-node@0.7.3-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4

## 0.2.5-next.0

### Patch Changes

- 6cfd4d7073: Updated implementations for the new `RootLifecycleService`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-node@0.7.3-next.0

## 0.2.4

### Patch Changes

- cb1c2781c0: Updated logger implementations to match interface changes.
- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- afa3bf5657: Added `.stop()` method to `Backend`.
- d6dbf1792b: Added `lifecycleFactory` implementation.
- 05a928e296: Updated usages of types from `@backstage/backend-plugin-api`.
- 5260d8fc7d: Root scoped services are now always initialized, regardless of whether they're used by any features.
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/plugin-permission-node@0.7.2
  - @backstage/errors@1.1.4
  - @backstage/backend-plugin-api@0.2.0

## 0.2.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/plugin-permission-node@0.7.2-next.3
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/errors@1.1.4-next.1

## 0.2.4-next.2

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/plugin-permission-node@0.7.2-next.2
  - @backstage/errors@1.1.4-next.1

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/plugin-permission-node@0.7.2-next.1
  - @backstage/errors@1.1.4-next.1

## 0.2.4-next.0

### Patch Changes

- d6dbf1792b: Added `lifecycleFactory` implementation.
- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/plugin-permission-node@0.7.2-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/errors@1.1.4-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/plugin-permission-node@0.7.1
  - @backstage/errors@1.1.3

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/plugin-permission-node@0.7.1-next.1
  - @backstage/errors@1.1.3-next.0

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/plugin-permission-node@0.7.1-next.0
  - @backstage/errors@1.1.3-next.0

## 0.2.2

### Patch Changes

- 0027a749cd: Added possibility to configure index plugin of the HTTP router service.
- 45857bffae: Properly export `rootLoggerFactory`.
- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/backend-tasks@0.3.6
  - @backstage/plugin-permission-node@0.7.0
  - @backstage/backend-plugin-api@0.1.3
  - @backstage/errors@1.1.2

## 0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-permission-node@0.7.0-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2
  - @backstage/errors@1.1.2-next.2

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/plugin-permission-node@0.6.6-next.1

## 0.2.2-next.0

### Patch Changes

- 0027a749cd: Added possibility to configure index plugin of the HTTP router service.
- 45857bffae: Properly export `rootLoggerFactory`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.3-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/plugin-permission-node@0.6.6-next.0
  - @backstage/errors@1.1.2-next.0

## 0.2.1

### Patch Changes

- 2c57c0c499: Made `ApiRef.defaultFactory` internal.
- 854ba37357: Updated to support new `ServiceFactory` formats.
- af6bb42c68: Updated `ServiceRegistry` to not initialize factories more than once.
- 409ed984e8: Updated service implementations and backend wiring to support scoped service.
- de3347ca74: Updated usages of `ServiceFactory`.
- 1f384c5644: Improved error messaging when failing to instantiate services.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-permission-node@0.6.5
  - @backstage/backend-tasks@0.3.5
  - @backstage/errors@1.1.1

## 0.2.1-next.2

### Patch Changes

- 854ba37357: Updated to support new `ServiceFactory` formats.
- 409ed984e8: Updated service implementations and backend wiring to support scoped service.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/errors@1.1.1-next.0
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/backend-tasks@0.3.5-next.1
  - @backstage/plugin-permission-node@0.6.5-next.3

## 0.2.1-next.1

### Patch Changes

- 2c57c0c499: Made `ApiRef.defaultFactory` internal.
- af6bb42c68: Updated `ServiceRegistry` to not initialize factories more than once.
- 1f384c5644: Improved error messaging when failing to instantiate services.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.1
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/plugin-permission-node@0.6.5-next.2

## 0.2.1-next.0

### Patch Changes

- de3347ca74: Updated usages of `ServiceFactory`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/backend-plugin-api@0.1.2-next.0
  - @backstage/plugin-permission-node@0.6.5-next.0

## 0.2.0

### Minor Changes

- 5df230d48c: Introduced a new `backend-defaults` package carrying `createBackend` which was previously exported from `backend-app-api`.
  The `backend-app-api` package now exports the `createSpecializedBacked` that does not add any service factories by default.

### Patch Changes

- 0599732ec0: Refactored experimental backend system with new type names.
- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/backend-plugin-api@0.1.1
  - @backstage/backend-tasks@0.3.4
  - @backstage/plugin-permission-node@0.6.4

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/backend-tasks@0.3.4-next.0
  - @backstage/backend-plugin-api@0.1.1-next.0
  - @backstage/plugin-permission-node@0.6.4-next.0

## 0.1.0

### Minor Changes

- 91c1d12123: Add initial plumbing for creating backends using the experimental backend framework.

  This package is highly **EXPERIMENTAL** and should not be used in production.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.0
  - @backstage/backend-common@0.14.1
  - @backstage/plugin-permission-node@0.6.3
  - @backstage/backend-tasks@0.3.3

## 0.1.0-next.0

### Minor Changes

- 91c1d12123: Add initial plumbing for creating backends using the experimental backend framework.

  This package is highly **EXPERIMENTAL** and should not be used in production.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.0-next.0
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/plugin-permission-node@0.6.3-next.2
  - @backstage/backend-tasks@0.3.3-next.3
