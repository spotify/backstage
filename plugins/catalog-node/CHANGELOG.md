# @backstage/plugin-catalog-node

## 2.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@1.11.9-next.0

## 2.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/catalog-client@1.16.3
  - @backstage/errors@1.3.2
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-catalog-common@1.2.1
  - @backstage/plugin-permission-common@0.9.12
  - @backstage/plugin-permission-node@0.11.5

## 2.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-permission-node@0.11.5-next.1

## 2.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-test-utils@1.11.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## 2.2.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.2.0
  - @backstage/catalog-client@1.16.2
  - @backstage/catalog-model@1.10.1
  - @backstage/plugin-permission-node@0.11.4
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-permission-common@0.9.11

## 2.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.2.0-next.0
  - @backstage/catalog-client@1.16.2-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/plugin-permission-common@0.9.11-next.0
  - @backstage/plugin-permission-node@0.11.4-next.1

## 2.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@1.11.7-next.0
  - @backstage/plugin-permission-node@0.11.4-next.0
  - @backstage/catalog-client@1.16.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0

## 2.2.4

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/plugin-permission-common@0.9.10
  - @backstage/plugin-permission-node@0.11.3

## 2.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/backend-test-utils@1.11.6-next.0
  - @backstage/plugin-permission-node@0.11.3-next.0

## 2.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/catalog-client@1.16.1
  - @backstage/plugin-permission-node@0.11.2

## 2.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@1.11.5-next.0
  - @backstage/plugin-permission-node@0.11.2-next.0
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/catalog-client@1.16.1-next.0

## 2.2.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.16.0
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-permission-node@0.11.1

## 2.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.16.0-next.0
  - @backstage/backend-test-utils@1.11.4-next.0
  - @backstage/plugin-permission-node@0.11.1-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0

## 2.2.1

### Patch Changes

- ab1cdbb: Removed a handful of internal imports that referenced the package by its own name. Value imports were switched to relative paths, and type-only imports to `import type`. These self-referential imports could trigger circular initialization errors in bundled ESM and when the package was loaded via `jest.requireActual` — most visibly `Cannot access '_AppRootElementBlueprintesm' before initialization` from `@backstage/frontend-plugin-api`. There are no user-facing API changes.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/errors@1.3.1
  - @backstage/backend-test-utils@1.11.3
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-permission-node@0.11.0
  - @backstage/plugin-permission-common@0.9.9
  - @backstage/catalog-client@1.15.1
  - @backstage/plugin-catalog-common@1.1.10

## 2.2.1-next.1

### Patch Changes

- ab1cdbb: Removed a handful of internal imports that referenced the package by its own name. Value imports were switched to relative paths, and type-only imports to `import type`. These self-referential imports could trigger circular initialization errors in bundled ESM and when the package was loaded via `jest.requireActual` — most visibly `Cannot access '_AppRootElementBlueprintesm' before initialization` from `@backstage/frontend-plugin-api`. There are no user-facing API changes.
- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.1
  - @backstage/backend-test-utils@1.11.3-next.1
  - @backstage/plugin-permission-common@0.9.9-next.1

## 2.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/backend-test-utils@1.11.3-next.0
  - @backstage/catalog-client@1.15.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/plugin-permission-common@0.9.9-next.0
  - @backstage/plugin-permission-node@0.10.13-next.0
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.10-next.0

## 2.2.0

### Minor Changes

- e5fcfcb: Added `provideStaticCatalogModel` that helps provide a static catalog model at startup.
- 056e18e: **BREAKING ALPHA**: Removed the deprecated `CatalogPermissionRuleInput`, `CatalogPermissionExtensionPoint`, and `catalogPermissionExtensionPoint` exports. Use `coreServices.permissionsRegistry` directly to register catalog entity permission rules and permissions.
- c384fff: **BREAKING PRODUCERS**: Added `updateLocation` method to `CatalogService` for updating the type and target of an existing location. Any code that implements `CatalogService` must now provide this method.
- 7a03196: **BREAKING ALPHA**: Removed the following deprecated exports from `@backstage/plugin-catalog-node/alpha`:

  - `catalogServiceRef` — use `catalogServiceRef` from `@backstage/plugin-catalog-node` instead
  - `CatalogLocationsExtensionPoint` / `catalogLocationsExtensionPoint` — use the non-alpha equivalents from `@backstage/plugin-catalog-node` instead
  - `CatalogProcessingExtensionPoint` / `catalogProcessingExtensionPoint` — use the non-alpha equivalents from `@backstage/plugin-catalog-node` instead
  - `CatalogAnalysisExtensionPoint` / `catalogAnalysisExtensionPoint` — use the non-alpha equivalents from `@backstage/plugin-catalog-node` instead

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/backend-test-utils@1.11.2
  - @backstage/errors@1.3.0
  - @backstage/catalog-model@1.8.0
  - @backstage/catalog-client@1.15.0
  - @backstage/plugin-permission-node@0.10.12
  - @backstage/plugin-catalog-common@1.1.9
  - @backstage/plugin-permission-common@0.9.8

## 2.2.0-next.2

### Minor Changes

- 056e18e: **BREAKING ALPHA**: Removed the deprecated `CatalogPermissionRuleInput`, `CatalogPermissionExtensionPoint`, and `catalogPermissionExtensionPoint` exports. Use `coreServices.permissionsRegistry` directly to register catalog entity permission rules and permissions.
- 7a03196: **BREAKING ALPHA**: Removed the following deprecated exports from `@backstage/plugin-catalog-node/alpha`:

  - `catalogServiceRef` — use `catalogServiceRef` from `@backstage/plugin-catalog-node` instead
  - `CatalogLocationsExtensionPoint` / `catalogLocationsExtensionPoint` — use the non-alpha equivalents from `@backstage/plugin-catalog-node` instead
  - `CatalogProcessingExtensionPoint` / `catalogProcessingExtensionPoint` — use the non-alpha equivalents from `@backstage/plugin-catalog-node` instead
  - `CatalogAnalysisExtensionPoint` / `catalogAnalysisExtensionPoint` — use the non-alpha equivalents from `@backstage/plugin-catalog-node` instead

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/backend-test-utils@1.11.2-next.2
  - @backstage/catalog-client@1.14.1-next.0
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/plugin-permission-common@0.9.8-next.0
  - @backstage/plugin-permission-node@0.10.12-next.2
  - @backstage/plugin-catalog-common@1.1.9-next.0

## 2.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/backend-test-utils@1.11.2-next.1
  - @backstage/plugin-permission-node@0.10.12-next.1

## 2.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/backend-test-utils@1.11.2-next.0
  - @backstage/plugin-permission-node@0.10.12-next.0
  - @backstage/catalog-client@1.14.0
  - @backstage/catalog-model@1.7.7
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-permission-common@0.9.7

## 2.1.0

### Minor Changes

- bf71677: Added the ability for SCM events subscribers to mark the fact that they have taken actions based on events, which produces output metrics:

  - `catalog.events.scm.actions` with attribute `action`: Counter for the number of actions actually taken by catalog internals or other subscribers, based on SCM events. The `action` is currently either `create`, `delete`, `refresh`, or `move`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/backend-test-utils@1.11.1
  - @backstage/catalog-client@1.14.0
  - @backstage/plugin-permission-common@0.9.7
  - @backstage/plugin-permission-node@0.10.11
  - @backstage/catalog-model@1.7.7

## 2.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@1.11.1-next.2
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/catalog-client@1.14.0-next.2
  - @backstage/plugin-permission-node@0.10.11-next.1

## 2.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.14.0-next.1
  - @backstage/backend-test-utils@1.11.1-next.1
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-permission-node@0.10.11-next.0

## 2.1.0-next.0

### Minor Changes

- bf71677: Added the ability for SCM events subscribers to mark the fact that they have taken actions based on events, which produces output metrics:

  - `catalog.events.scm.actions` with attribute `action`: Counter for the number of actions actually taken by catalog internals or other subscribers, based on SCM events. The `action` is currently either `create`, `delete`, `refresh`, or `move`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-client@1.13.1-next.0
  - @backstage/backend-test-utils@1.11.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-permission-node@0.10.11-next.0

## 2.0.0

### Minor Changes

- cfd8103: Promoted stable catalog extension points from alpha to main export. The following extension points are now exported from `@backstage/plugin-catalog-node` instead of `@backstage/plugin-catalog-node/alpha`:

  - `catalogLocationsExtensionPoint` and `CatalogLocationsExtensionPoint`
  - `catalogProcessingExtensionPoint` and `CatalogProcessingExtensionPoint`
  - `catalogAnalysisExtensionPoint` and `CatalogAnalysisExtensionPoint`

  The old alpha exports for these extension points are now deprecated with `@deprecated` markers pointing to the new stable exports. Please update your imports from `@backstage/plugin-catalog-node/alpha` to `@backstage/plugin-catalog-node`.

  Note: The `catalogModelExtensionPoint`, `catalogPermissionExtensionPoint`, and related types remain in alpha.

- b4e8249: Implemented support for the new `queryLocations` and `streamLocations` that allow paginated/streamed and filtered location queries
- 34cc520: Introduced the `catalogScmEventsServiceRef`, along with `CatalogScmEventsService` and associated types. These allow communicating a unified set of events, that parts of the catalog can react to.

### Patch Changes

- 42abfb1: Updated `catalogServiceMock.mock` to use `createServiceMock` from `@backstage/backend-test-utils`, replacing the internal copy of `simpleMock`. Added `@backstage/backend-test-utils` as an optional peer dependency.
- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/backend-test-utils@1.11.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/catalog-client@1.13.0
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-permission-node@0.10.10
  - @backstage/plugin-catalog-common@1.1.8

## 2.0.0-next.1

### Patch Changes

- 42abfb1: Updated `catalogServiceMock.mock` to use `createServiceMock` from `@backstage/backend-test-utils`, replacing the internal copy of `simpleMock`. Added `@backstage/backend-test-utils` as an optional peer dependency.
- Updated dependencies
  - @backstage/backend-test-utils@1.11.0-next.1
  - @backstage/catalog-client@1.12.2-next.0
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-permission-node@0.10.10-next.0

## 1.21.0-next.0

### Minor Changes

- cfd8103: Promoted stable catalog extension points from alpha to main export. The following extension points are now exported from `@backstage/plugin-catalog-node` instead of `@backstage/plugin-catalog-node/alpha`:

  - `catalogLocationsExtensionPoint` and `CatalogLocationsExtensionPoint`
  - `catalogProcessingExtensionPoint` and `CatalogProcessingExtensionPoint`
  - `catalogAnalysisExtensionPoint` and `CatalogAnalysisExtensionPoint`

  The old alpha exports for these extension points are now deprecated with `@deprecated` markers pointing to the new stable exports. Please update your imports from `@backstage/plugin-catalog-node/alpha` to `@backstage/plugin-catalog-node`.

  Note: The `catalogModelExtensionPoint`, `catalogPermissionExtensionPoint`, and related types remain in alpha.

### Patch Changes

- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/plugin-permission-common@0.9.5-next.0
  - @backstage/plugin-permission-node@0.10.9-next.0
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8-next.0

## 1.20.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.10.7
  - @backstage/backend-plugin-api@1.6.0

## 1.20.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.10.7-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-permission-common@0.9.3

## 1.20.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-permission-node@0.10.7-next.0
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-permission-common@0.9.3

## 1.20.0

### Minor Changes

- 9d3ec06: Make YAML merge (<<:) support configurable in the Backstage Catalog instead of always being enabled
- 8c26af4: Enable YAML merge keys in yamlPlaceholderResolver

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-permission-node@0.10.6

## 1.20.0-next.1

### Minor Changes

- 9d3ec06: Make YAML merge (<<:) support configurable in the Backstage Catalog instead of always being enabled
- 8c26af4: Enable YAML merge keys in yamlPlaceholderResolver

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-permission-common@0.9.3-next.1
  - @backstage/plugin-permission-node@0.10.6-next.1

## 1.19.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/plugin-permission-node@0.10.6-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/catalog-client@1.12.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.7-next.0
  - @backstage/plugin-permission-common@0.9.3-next.0

## 1.19.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-common@1.1.6
  - @backstage/plugin-permission-common@0.9.2
  - @backstage/plugin-permission-node@0.10.5

## 1.19.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-permission-common@0.9.2-next.0
  - @backstage/plugin-permission-node@0.10.5-next.0
  - @backstage/plugin-catalog-common@1.1.6-next.0
  - @backstage/catalog-client@1.12.0

## 1.19.0

### Minor Changes

- 0e9ec44: Introduced new `streamEntities` async generator method for the catalog.

  Catalog API and Catalog Service now includes a `streamEntities` method that allows for streaming entities from the catalog.
  This method is designed to handle large datasets efficiently by processing entities in a stream rather than loading them
  all into memory at once. This is useful when you need to fetch a large number of entities but do not want to use pagination
  or fetch all entities at once.

  Example usage:

  ```ts
  const pageStream = catalogClient.streamEntities({ pageSize: 100 }, { token });
  for await (const page of pageStream) {
    // Handle page of entities
    for (const entity of page) {
      console.log(entity);
    }
  }
  ```

### Patch Changes

- 2bbd24f: Order catalog processors by priority.

  This change enables the ordering of catalog processors by their priority,
  allowing for more control over the catalog processing sequence.
  The default priority is set to 20, and processors can be assigned a custom
  priority to influence their execution order. Lower number indicates higher priority.
  The priority can be set by implementing the `getPriority` method in the processor class
  or by adding a `catalog.processors.<processorName>.priority` configuration
  in the `app-config.yaml` file. The configuration takes precedence over the method.

- Updated dependencies
  - @backstage/catalog-client@1.12.0
  - @backstage/types@1.2.2
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/plugin-permission-node@0.10.4

## 1.19.0-next.1

### Minor Changes

- 0e9ec44: Introduced new `streamEntities` async generator method for the catalog.

  Catalog API and Catalog Service now includes a `streamEntities` method that allows for streaming entities from the catalog.
  This method is designed to handle large datasets efficiently by processing entities in a stream rather than loading them
  all into memory at once. This is useful when you need to fetch a large number of entities but do not want to use pagination
  or fetch all entities at once.

  Example usage:

  ```ts
  const pageStream = catalogClient.streamEntities({ pageSize: 100 }, { token });
  for await (const page of pageStream) {
    // Handle page of entities
    for (const entity of page) {
      console.log(entity);
    }
  }
  ```

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.12.0-next.0

## 1.18.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-permission-node@0.10.4-next.0

## 1.18.0

### Minor Changes

- 3f4da39: Added the analyze-location endpoint to the CatalogService

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2

## 1.18.0-next.0

### Minor Changes

- 3f4da39: Added the analyze-location endpoint to the CatalogService

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0-next.0
  - @backstage/plugin-permission-node@0.10.3-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-permission-common@0.9.1

## 1.17.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.1
  - @backstage/plugin-permission-node@0.10.2
  - @backstage/catalog-model@1.7.5
  - @backstage/catalog-client@1.10.2
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-common@1.1.5

## 1.17.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.1-next.0
  - @backstage/plugin-permission-node@0.10.2-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/catalog-client@1.10.2-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-catalog-common@1.1.5-next.0

## 1.17.1

### Patch Changes

- 0169b23: Internal tweak to avoid circular dependencies
- Updated dependencies
  - @backstage/catalog-client@1.10.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.1

## 1.17.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.1-next.1

## 1.17.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-permission-node@0.10.1-next.0

## 1.17.0

### Minor Changes

- a459f17: Added `parseEntityYaml` from `@backstage/plugin-catalog-backend`, to make it more easily usable by custom plugins and modules
- 1a003ff: Add `getLocations` method to `CatalogApi` and `CatalogClient`. This method calls the [`GET /locations`](https://backstage.io/docs/features/software-catalog/software-catalog-api/#get-locations) endpoint from the catalog backend.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.4
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.0
  - @backstage/catalog-client@1.10.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4

## 1.17.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.2

## 1.17.0-next.1

### Minor Changes

- a459f17: Added `parseEntityYaml` from `@backstage/plugin-catalog-backend`, to make it more easily usable by custom plugins and modules

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0

## 1.17.0-next.0

### Minor Changes

- 1a003ff: Add `getLocations` method to `CatalogApi` and `CatalogClient`. This method calls the [`GET /locations`](https://backstage.io/docs/features/software-catalog/software-catalog-api/#get-locations) endpoint from the catalog backend.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-permission-node@0.9.2-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4

## 1.16.3

### Patch Changes

- 2c5598c: Adds documentation for the CatalogProcessingExtensionPoint functions.
- 98b7131: Use a different ID for the deprecated alpha version of the catalog service, as it has a different type definition and cannot be used interchangeably with the non-alpha version.
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/plugin-permission-node@0.9.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4

## 1.16.3-next.0

### Patch Changes

- 98b7131: Use a different ID for the deprecated alpha version of the catalog service, as it has a different type definition and cannot be used interchangeably with the non-alpha version.
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.9.0

## 1.16.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.9.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4

## 1.16.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.9-next.1

## 1.16.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.8.9-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0

## 1.16.0

### Minor Changes

- b4183ad: Added new `catalogEntityPermissionResourceRef` export via the `/alpha` sub-path.
- 9b9737c: Added the `locationKey` option to `processingResult.entity(...)`.

### Patch Changes

- 4a941e7: Deprecated the alpha `catalogPermissionExtensionPoint` and related types, since the same functionality is now available via the new `PermissionsRegistryService`.
- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4

## 1.16.0-next.3

### Minor Changes

- b4183ad: Added new `catalogEntityPermissionResourceRef` export via the `/alpha` sub-path.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8-next.2
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4

## 1.16.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.8-next.1

## 1.16.0-next.1

### Minor Changes

- 9b9737c: Added the `locationKey` option to `processingResult.entity(...)`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.8-next.0

## 1.15.2-next.0

### Patch Changes

- 4a941e7: Deprecated the alpha `catalogPermissionExtensionPoint` and related types, since the same functionality is now available via the new `PermissionsRegistryService`.
- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4

## 1.15.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-node@0.8.7
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4

## 1.15.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-permission-common@0.8.4-next.0
  - @backstage/plugin-permission-node@0.8.7-next.1
  - @backstage/catalog-client@1.9.1-next.0
  - @backstage/plugin-catalog-common@1.1.3-next.0

## 1.15.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.8.7-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-client@1.9.0
  - @backstage/catalog-model@1.7.2
  - @backstage/errors@1.2.6
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.2
  - @backstage/plugin-permission-common@0.8.3

## 1.15.0

### Minor Changes

- 8edc4cd: Updated the `catalogServiceMock` return type to match both `CatalogService` and `CatalogApi`

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/catalog-client@1.9.0
  - @backstage/plugin-permission-node@0.8.6
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.2
  - @backstage/plugin-permission-common@0.8.3

## 1.15.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-permission-node@0.8.6-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/catalog-client@1.9.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.2-next.0
  - @backstage/plugin-permission-common@0.8.3-next.0

## 1.15.0-next.1

### Minor Changes

- 8edc4cd: Updated the `catalogServiceMock` return type to match both `CatalogService` and `CatalogApi`

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.9.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/plugin-permission-node@0.8.6-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-permission-common@0.8.2

## 1.14.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/catalog-client@1.8.1-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/plugin-permission-node@0.8.6-next.0

## 1.14.0

### Minor Changes

- bc13b42: The `catalogServiceRef` now has its own accompanying `CatalogService` interface that requires Backstage `credentials` objects to be passed. This new version of the `catalogServiceRef` has been promoted and is now available via the main `@backstage/plugin-catalog-node` entry point.

  The old `catalogServiceRef` with the old `CatalogApi` type is still available from the `/alpha` entry point.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0
  - @backstage/types@1.2.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-permission-node@0.8.5

## 1.14.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.2

## 1.14.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.1

## 1.14.0-next.0

### Minor Changes

- bc13b42: The `catalogServiceRef` now has its own accompanying `CatalogService` interface that requires Backstage `credentials` objects to be passed. This new version of the `catalogServiceRef` has been promoted and is now available via the main `@backstage/plugin-catalog-node` entry point.

  The old `catalogServiceRef` with the old `CatalogApi` type is still available from the `/alpha` entry point.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.0

## 1.13.1

### Patch Changes

- 0801db6: Documentation for the `testUtils` named export
- Updated dependencies
  - @backstage/plugin-permission-node@0.8.4
  - @backstage/catalog-client@1.7.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1

## 1.13.1-next.1

### Patch Changes

- 0801db6: Documentation for the `testUtils` named export
- Updated dependencies
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1

## 1.13.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.8.4-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1

## 1.13.0

### Minor Changes

- bd35cdb: The `analyze-location` endpoint is now protected by the `catalog.location.analyze` permission.
  The `validate-entity` endpoint is now protected by the `catalog.entity.validate` permission.
- 29e57c7: Add catalog service mocks under the `/testUtils` subpath export.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/catalog-client@1.7.0
  - @backstage/plugin-permission-node@0.8.3
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 1.12.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-client@1.7.0-next.1
  - @backstage/plugin-permission-node@0.8.3-next.2
  - @backstage/catalog-model@1.6.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-permission-common@0.8.1

## 1.12.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.7-next.0
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.3-next.1

## 1.12.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-permission-node@0.8.3-next.0
  - @backstage/catalog-client@1.6.6
  - @backstage/catalog-model@1.6.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-permission-common@0.8.1

## 1.12.5

### Patch Changes

- a629fb2: Added setAllowedLocationTypes while introducing a new extension point called CatalogLocationsExtensionPoint
- 7c5f3b0: Explicit declare if the service ref accepts `single` or `multiple` implementations.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.1
  - @backstage/catalog-model@1.6.0
  - @backstage/catalog-client@1.6.6
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26

## 1.12.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/catalog-client@1.6.6-next.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26-next.2
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/plugin-permission-node@0.8.1-next.3

## 1.12.5-next.2

### Patch Changes

- 7c5f3b0: Explicit declare if the service ref accepts `single` or `multiple` implementations.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/plugin-permission-node@0.8.1-next.2
  - @backstage/plugin-catalog-common@1.0.26-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.12.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1-next.0
  - @backstage/plugin-permission-node@0.8.1-next.1
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/plugin-catalog-common@1.0.26-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.12.5-next.0

### Patch Changes

- a629fb2: Added setAllowedLocationTypes while introducing a new extension point called CatalogLocationsExtensionPoint
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-permission-node@0.8.1-next.0

## 1.12.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-permission-node@0.8.0
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.12.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-permission-node@0.7.33-next.1

## 1.12.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/plugin-permission-node@0.7.32-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/plugin-permission-common@0.7.14

## 1.12.1

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-permission-node@0.7.30
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.12.1-next.2

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-permission-common@0.7.14-next.0
  - @backstage/plugin-permission-node@0.7.30-next.3
  - @backstage/plugin-catalog-common@1.0.24-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.12.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/plugin-permission-node@0.7.30-next.2
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.23
  - @backstage/plugin-permission-common@0.7.13

## 1.12.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-permission-node@0.7.30-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.23
  - @backstage/plugin-permission-common@0.7.13

## 1.12.0

### Minor Changes

- f2a2a83: Added `LocationAnalyzer` type, moved from `@backstage/plugin-catalog-backend`.
- f2a2a83: Breaking change to `/alpha` API where the `catalogAnalysisExtensionPoint` has been reworked. The `addLocationAnalyzer` method has been renamed to `addScmLocationAnalyzer`, and a new `setLocationAnalyzer` method has been added which allows the full `LocationAnalyzer` implementation to be overridden.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/catalog-client@1.6.5
  - @backstage/plugin-catalog-common@1.0.23
  - @backstage/plugin-permission-node@0.7.29

## 1.12.0-next.2

### Minor Changes

- f2a2a83: Added `LocationAnalyzer` type, moved from `@backstage/plugin-catalog-backend`.
- f2a2a83: Breaking change to `/alpha` API where the `catalogAnalysisExtensionPoint` has been reworked. The `addLocationAnalyzer` method has been renamed to `addScmLocationAnalyzer`, and a new `setLocationAnalyzer` method has been added which allows the full `LocationAnalyzer` implementation to be overridden.

## 1.11.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.7.29-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 1.11.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/catalog-client@1.6.5-next.0
  - @backstage/plugin-catalog-common@1.0.23-next.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-permission-node@0.7.29-next.0

## 1.11.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.7.28
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/catalog-client@1.6.4
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13

## 1.11.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/catalog-client@1.6.4-next.0
  - @backstage/plugin-permission-node@0.7.28-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13

## 1.11.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/catalog-client@1.6.3
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-permission-node@0.7.28-next.0

## 1.11.0

### Minor Changes

- f3e2e86: Added the ability to inject custom permissions from modules, on `CatalogBuilder` and `CatalogPermissionExtensionPoint`

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.3
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-permission-node@0.7.27
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13

## 1.10.0

### Minor Changes

- f3e2e86: Added the ability to inject custom permissions from modules, on `CatalogBuilder` and `CatalogPermissionExtensionPoint`

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.2
  - @backstage/plugin-permission-node@0.7.26
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13

## 1.9.0

### Minor Changes

- 9c7fb30: Added the ability to inject custom permissions from modules, on `CatalogBuilder` and `CatalogPermissionExtensionPoint`

## 1.8.0

### Minor Changes

- df12231: Allow setting EntityDataParser using CatalogModelExtensionPoint

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/catalog-client@1.6.1
  - @backstage/plugin-permission-node@0.7.25
  - @backstage/catalog-model@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22

## 1.8.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.1-next.1
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.2

## 1.8.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.1

## 1.8.0-next.0

### Minor Changes

- df12231: Allow setting EntityDataParser using CatalogModelExtensionPoint

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-permission-common@0.7.13-next.0
  - @backstage/plugin-permission-node@0.7.24-next.0
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.0

## 1.7.0

### Minor Changes

- d8a54d0: Adds support for supplying field validators to the new backend's catalog plugin. If you're using entity policies, you should use the new `transformLegacyPolicyToProcessor` function to install them as processors instead.

  ```ts
  import {
    catalogProcessingExtensionPoint,
    catalogModelExtensionPoint,
  } from '@backstage/plugin-catalog-node/alpha';
  import {myPolicy} from './my-policy';

  export const catalogModulePolicyProvider = createBackendModule({
    pluginId: 'catalog',
    moduleId: 'internal-policy-provider',
    register(reg) {
      reg.registerInit({
        deps: {
          modelExtensions: catalogModelExtensionPoint,
          processingExtensions: catalogProcessingExtensionPoint,
        },
        async init({ modelExtensions, processingExtensions }) {
          modelExtensions.setFieldValidators({
            ...
          });
          processingExtensions.addProcessors(transformLegacyPolicyToProcessor(myPolicy))
        },
      });
    },
  });
  ```

### Patch Changes

- 9b2eb3f: Add support for `onProcessingError` handler at the catalog plugin (new backend system).

  You can use `setOnProcessingErrorHandler` at the `catalogProcessingExtensionPoint`
  as replacement for

  ```ts
  catalogBuilder.subscribe({
    onProcessingError: hander,
  });
  ```

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/catalog-model@1.4.4
  - @backstage/catalog-client@1.6.0
  - @backstage/plugin-permission-node@0.7.21
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.21
  - @backstage/plugin-permission-common@0.7.12

## 1.6.2-next.3

### Patch Changes

- 9b2eb3f: Add support for `onProcessingError` handler at the catalog plugin (new backend system).

  You can use `setOnProcessingErrorHandler` at the `catalogProcessingExtensionPoint`
  as replacement for

  ```ts
  catalogBuilder.subscribe({
    onProcessingError: hander,
  });
  ```

- Updated dependencies
  - @backstage/plugin-permission-node@0.7.21-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-permission-common@0.7.12

## 1.6.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-permission-node@0.7.21-next.2
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-permission-common@0.7.12

## 1.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-permission-node@0.7.21-next.1

## 1.6.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.0-next.0
  - @backstage/plugin-permission-node@0.7.21-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.20
  - @backstage/plugin-permission-common@0.7.12

## 1.6.1

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/catalog-client@1.5.2
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-permission-node@0.7.20
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.20

## 1.6.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/plugin-permission-node@0.7.20-next.2

## 1.6.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.7.20-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-permission-common@0.7.11

## 1.6.1-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-permission-node@0.7.20-next.0

## 1.6.0

### Minor Changes

- a168507: Added `EntitiesSearchFilter` and `EntityFilter` from `@backstage/plugin-catalog-backend`, for reuse
- 7804597: Permission rules can now be added for the Catalog plugin through the `CatalogPermissionExtensionPoint` interface.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-permission-node@0.7.19
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.19

## 1.6.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.3

## 1.6.0-next.2

### Minor Changes

- a168507: Added `EntitiesSearchFilter` and `EntityFilter` from `@backstage/plugin-catalog-backend`, for reuse
- 7804597: Permission rules can now be added for the Catalog plugin through the `CatalogPermissionExtensionPoint` interface.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.2

## 1.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## 1.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## 1.5.0

### Minor Changes

- e5bf3749ad: Support adding location analyzers in new catalog analysis extension point and move `AnalyzeOptions` and `ScmLocationAnalyzer` types to `@backstage/plugin-catalog-node`

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## 1.5.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2

## 1.5.0-next.1

### Minor Changes

- e5bf3749ad: Support adding location analyzers in new catalog analysis extension point and move `AnalyzeOptions` and `ScmLocationAnalyzer` types to `@backstage/plugin-catalog-node`

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## 1.4.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## 1.4.7

### Patch Changes

- 7a2e2924c7: Added docs to `processingResult`
- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/catalog-client@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## 1.4.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/catalog-client@1.4.5-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17-next.0

## 1.4.6-next.1

### Patch Changes

- 7a2e2924c7: Added docs to `processingResult`
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.16

## 1.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.16

## 1.4.4

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/types@1.1.1
  - @backstage/backend-plugin-api@0.6.3

## 1.4.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.4-next.2
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/plugin-catalog-common@1.0.16-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-plugin-api@0.6.3-next.3

## 1.4.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1

## 1.4.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/catalog-client@1.4.4-next.0
  - @backstage/plugin-catalog-common@1.0.16-next.0
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 1.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 1.4.1

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 1.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2

## 1.4.1-next.1

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 1.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 1.4.0

### Minor Changes

- f06f0e46ba88: Support placeholder resolvers in the CatalogPlugin, also moves `PlaceholderResolver` and related types from `@backstage/plugin-catalog-backend` to `@backstage/plugin-catalog-node`.

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 1.4.0-next.0

### Minor Changes

- f06f0e46ba88: Support placeholder resolvers in the CatalogPlugin, also moves `PlaceholderResolver` and related types from `@backstage/plugin-catalog-backend` to `@backstage/plugin-catalog-node`.

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15-next.0

## 1.3.7

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.2
  - @backstage/types@1.1.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/plugin-catalog-common@1.0.14

## 1.3.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/catalog-client@1.4.2-next.2
  - @backstage/errors@1.2.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.14-next.1

## 1.3.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/catalog-client@1.4.2-next.1
  - @backstage/plugin-catalog-common@1.0.14-next.0
  - @backstage/types@1.0.2

## 1.3.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.2-next.0
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 1.3.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 1.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1

## 1.3.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 1.3.5

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 1.3.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/catalog-client@1.4.1-next.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.1

## 1.3.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.1-next.0
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.0

## 1.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.0

## 1.3.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.12

## 1.3.4

### Patch Changes

- e675f902980: Added `locationSpecToMetadataName` and `locationSpecToLocationEntity` as their new home, moved over from the backend package where they now are marked as deprecated.
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/catalog-client@1.4.0
  - @backstage/errors@1.1.5
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/types@1.0.2

## 1.3.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.2

## 1.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/catalog-client@1.4.0-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.12-next.1

## 1.3.4-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/catalog-client@1.4.0-next.0
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/plugin-catalog-common@1.0.12-next.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 1.3.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/catalog-model@1.2.0
  - @backstage/catalog-client@1.3.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.11

## 1.3.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/catalog-client@1.3.1-next.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.11-next.1

## 1.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.11-next.0

## 1.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/plugin-catalog-common@1.0.11-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0

## 1.3.1

### Patch Changes

- 483e907eaf: Internal updates of `createServiceFactory` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/catalog-model@1.1.5
  - @backstage/catalog-client@1.3.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10

## 1.3.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/catalog-client@1.3.0-next.2
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1

## 1.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1

## 1.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/catalog-client@1.3.0-next.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.0

## 1.3.0

### Minor Changes

- eacc8e2b55: Make it possible for entity providers to supply only entity refs, instead of full entities, in `delta` mutation deletions.

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/catalog-client@1.2.0
  - @backstage/errors@1.1.4
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/types@1.0.2
  - @backstage/catalog-model@1.1.4
  - @backstage/plugin-catalog-common@1.0.9

## 1.3.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.3

## 1.3.0-next.2

### Minor Changes

- eacc8e2b55: Make it possible for entity providers to supply only entity refs, instead of full entities, in `delta` mutation deletions.

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.2

## 1.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.2-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.1

## 1.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.2.0-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/errors@1.1.4-next.0
  - @backstage/plugin-catalog-common@1.0.9-next.0

## 1.2.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.3
  - @backstage/types@1.0.1
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/catalog-client@1.1.2
  - @backstage/errors@1.1.3
  - @backstage/plugin-catalog-common@1.0.8

## 1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/plugin-catalog-common@1.0.8-next.0

## 1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/plugin-catalog-common@1.0.8-next.0

## 1.2.0

### Minor Changes

- 404366c853: Deprecated the `LocationSpec` type. It got moved from this package to the `@backstage/plugin-catalog-common` so make sure imports are updated.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/plugin-catalog-common@1.0.7
  - @backstage/backend-plugin-api@0.1.3
  - @backstage/catalog-client@1.1.1
  - @backstage/errors@1.1.2
  - @backstage/types@1.0.0

## 1.2.0-next.2

### Minor Changes

- 404366c853: Deprecated the `LocationSpec` type. It got moved from this package to the `@backstage/plugin-catalog-common` so make sure imports are updated.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.0.7-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2
  - @backstage/catalog-client@1.1.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/types@1.0.0

## 1.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.1.1-next.1
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/types@1.0.0

## 1.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/backend-plugin-api@0.1.3-next.0
  - @backstage/catalog-client@1.1.1-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/types@1.0.0

## 1.1.0

### Minor Changes

- 9743bc788c: Added refresh function to the `EntityProviderConnection` to be able to schedule refreshes from entity providers.

### Patch Changes

- 7d7d947352: Adds experimental `catalogServiceRef` for obtaining a `CatalogClient` in the new backend system.
- 409ed984e8: Updated usage of experimental backend service APIs.
- 62788b2ee8: The experimental `CatalogProcessingExtensionPoint` now accepts multiple providers and processors at once.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2
  - @backstage/catalog-client@1.1.0
  - @backstage/catalog-model@1.1.1
  - @backstage/errors@1.1.1

## 1.1.0-next.2

### Minor Changes

- 9743bc788c: Added refresh function to the `EntityProviderConnection` to be able to schedule refreshes from entity providers.

### Patch Changes

- 409ed984e8: Updated usage of experimental backend service APIs.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/catalog-client@1.1.0-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/errors@1.1.1-next.0

## 1.0.2-next.1

### Patch Changes

- 7d7d947352: Adds experimental `catalogServiceRef` for obtaining a `CatalogClient` in the new backend system.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.1
  - @backstage/catalog-client@1.0.5-next.1

## 1.0.2-next.0

### Patch Changes

- 62788b2ee8: The experimental `CatalogProcessingExtensionPoint` now accepts multiple providers and processors at once.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.0

## 1.0.1

### Patch Changes

- 0599732ec0: Refactored experimental backend system with new type names.
- 56e1b4b89c: Fixed typos in alpha types.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.1

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.1-next.0

## 1.0.0

### Major Changes

- 9a6aba1d85: This package houses stable types from the `@backstage/plugin-catalog-backend` package and is intended for creation of catalog modules. Prefer importing from this package over the `@backstage/plugin-catalog-backend` package.

### Minor Changes

- 91c1d12123: Added alpha exports for the new experimental backend system.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.0
  - @backstage/catalog-model@1.1.0
  - @backstage/errors@1.1.0

## 1.0.0-next.0

### Major Changes

- 9a6aba1d85: This package houses stable types from the `@backstage/plugin-catalog-backend` package and is intended for creation of catalog modules. Prefer importing from this package over the `@backstage/plugin-catalog-backend` package.

### Minor Changes

- 91c1d12123: Added alpha exports for the new experimental backend system.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.0-next.0
  - @backstage/catalog-model@1.1.0-next.3
