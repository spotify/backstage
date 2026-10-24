# @backstage/plugin-catalog-backend-module-incremental-ingestion

## 0.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@4.0.3-next.0
  - @backstage/backend-defaults@0.18.2-next.0
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 0.9.0

### Minor Changes

- e003123: Added a `source_key` column and a `UNIQUE(source_key, entity_ref)` constraint to the `ingestion_mark_entities` table, enabling a single native upsert instead of a select-then-update-or-insert sequence per ingestion mark.
  This significantly reduces the number of database round trips during ingestion.

  As part of this change, the table's `ref` column is renamed to `entity_ref` to standardize its naming with the rest of the table's columns.
  This rename means the migration cannot be applied as part of a rolling, zero-downtime upgrade, which is fine since incremental ingestion providers are designed to run sequentially on a single Backstage backend instance.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@4.0.1
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/backend-defaults@0.18.1
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-catalog-common@1.2.1
  - @backstage/plugin-catalog-node@2.2.6
  - @backstage/plugin-events-node@0.4.27
  - @backstage/plugin-permission-common@0.9.12

## 0.9.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/backend-defaults@0.18.1-next.1
  - @backstage/plugin-catalog-backend@4.0.1-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1
  - @backstage/plugin-events-node@0.4.27-next.1

## 0.9.0-next.0

### Minor Changes

- e003123: Added a `source_key` column and a `UNIQUE(source_key, entity_ref)` constraint to the `ingestion_mark_entities` table, enabling a single native upsert instead of a select-then-update-or-insert sequence per ingestion mark.
  This significantly reduces the number of database round trips during ingestion.

  As part of this change, the table's `ref` column is renamed to `entity_ref` to standardize its naming with the rest of the table's columns.
  This rename means the migration cannot be applied as part of a rolling, zero-downtime upgrade, which is fine since incremental ingestion providers are designed to run sequentially on a single Backstage backend instance.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@4.0.1-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-defaults@0.18.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## 0.8.0

### Minor Changes

- 305e2f7: **BREAKING**: The incremental ingestion administrative routes now enforce separate read and manage permissions. Installations with custom permission policies must add decisions for the new permissions.

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.18.0
  - @backstage/plugin-catalog-common@1.2.0
  - @backstage/catalog-model@1.10.1
  - @backstage/plugin-catalog-backend@4.0.0
  - @backstage/config@1.3.9
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5
  - @backstage/plugin-events-node@0.4.26
  - @backstage/plugin-permission-common@0.9.11

## 0.8.0-next.1

### Minor Changes

- 305e2f7: **BREAKING**: The incremental ingestion administrative routes now enforce separate read and manage permissions. Installations with custom permission policies must add decisions for the new permissions.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.2.0-next.0
  - @backstage/plugin-catalog-backend@4.0.0-next.1
  - @backstage/config@1.3.9-next.0
  - @backstage/backend-defaults@0.17.9-next.1
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/plugin-permission-common@0.9.11-next.0

## 0.7.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.9-next.0
  - @backstage/plugin-catalog-backend@3.9.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0
  - @backstage/plugin-events-node@0.4.26-next.0

## 0.7.15

### Patch Changes

- 870acb3: Moved detailed documentation from the README to the Backstage docs site. The README now contains installation instructions and links to the full documentation.
- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-defaults@0.17.7
  - @backstage/plugin-catalog-backend@3.9.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/plugin-catalog-node@2.2.4
  - @backstage/plugin-events-node@0.4.25

## 0.7.15-next.2

### Patch Changes

- 870acb3: Moved detailed documentation from the README to the Backstage docs site. The README now contains installation instructions and links to the full documentation.

## 0.7.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.7-next.2
  - @backstage/plugin-catalog-backend@3.9.0-next.2
  - @backstage/backend-plugin-api@1.10.0-next.1

## 0.7.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.6-next.0
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-catalog-backend@3.8.2-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0
  - @backstage/plugin-events-node@0.4.25-next.0

## 0.7.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.5
  - @backstage/plugin-catalog-backend@3.8.1
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/plugin-catalog-node@2.2.3
  - @backstage/plugin-events-node@0.4.24

## 0.7.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.4-next.0
  - @backstage/plugin-catalog-backend@3.8.1-next.0
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0
  - @backstage/plugin-events-node@0.4.24-next.0

## 0.7.13

### Patch Changes

- e846874: Alter column type for `ingestions.last_error` to remove the 255-character restriction.
- Updated dependencies
  - @backstage/plugin-catalog-backend@3.8.0
  - @backstage/backend-defaults@0.17.3
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-catalog-node@2.2.2
  - @backstage/plugin-events-node@0.4.23

## 0.7.13-next.0

### Patch Changes

- e846874: Alter column type for `ingestions.last_error` to remove the 255-character restriction.
- Updated dependencies
  - @backstage/plugin-catalog-backend@3.8.0-next.0
  - @backstage/backend-defaults@0.17.2-next.0
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0
  - @backstage/plugin-events-node@0.4.23-next.0

## 0.7.12

### Patch Changes

- 32f0dfe: On PostgreSQL, `WHERE ref IN ($1, $2, ..., $N)` queries on the `ingestion_mark_entities` table now use `= ANY($1)` with a single array parameter instead. This reduces prepared statement bloat in the query plan cache when the number of entity refs varies between calls.
- 0c5e41f: Removed unused dependencies that had no imports in source code.
- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/backend-defaults@0.17.1
  - @backstage/plugin-catalog-backend@3.7.0
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/config@1.3.8
  - @backstage/plugin-events-node@0.4.22

## 0.7.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.1-next.1
  - @backstage/backend-defaults@0.17.1-next.2
  - @backstage/plugin-catalog-backend@3.7.0-next.2

## 0.7.12-next.1

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.1
  - @backstage/plugin-catalog-node@2.2.1-next.1
  - @backstage/backend-defaults@0.17.1-next.1
  - @backstage/plugin-catalog-backend@3.6.2-next.1

## 0.7.12-next.0

### Patch Changes

- 0c5e41f: Removed unused dependencies that had no imports in source code.
- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/backend-defaults@0.17.1-next.0
  - @backstage/plugin-catalog-backend@3.6.1-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/plugin-events-node@0.4.22-next.0
  - @backstage/types@1.2.2

## 0.7.11

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/backend-defaults@0.17.0
  - @backstage/errors@1.3.0
  - @backstage/plugin-catalog-backend@3.6.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/config@1.3.7
  - @backstage/plugin-events-node@0.4.21
  - @backstage/plugin-permission-common@0.9.8

## 0.7.11-next.2

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-catalog-backend@3.6.0-next.2
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/backend-defaults@0.16.1-next.2
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0
  - @backstage/plugin-events-node@0.4.21-next.2
  - @backstage/plugin-permission-common@0.9.8-next.0

## 0.7.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/backend-defaults@0.16.1-next.1
  - @backstage/plugin-catalog-backend@3.5.1-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1
  - @backstage/plugin-events-node@0.4.21-next.1

## 0.7.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.5.1-next.0
  - @backstage/backend-defaults@0.16.1-next.0
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/plugin-events-node@0.4.21-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-permission-common@0.9.7

## 0.7.10

### Patch Changes

- 5f1e7b8: Migrated metrics from direct `@opentelemetry/api` usage to the alpha `MetricsService`, providing plugin-scoped metric attribution. The `@opentelemetry/api` dependency has been removed.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/backend-defaults@0.16.0
  - @backstage/plugin-catalog-backend@3.5.0
  - @backstage/plugin-catalog-node@2.1.0
  - @backstage/plugin-permission-common@0.9.7
  - @backstage/catalog-model@1.7.7
  - @backstage/plugin-events-node@0.4.20

## 0.7.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/backend-defaults@0.16.0-next.2
  - @backstage/plugin-catalog-backend@3.5.0-next.2
  - @backstage/plugin-catalog-node@2.1.0-next.2
  - @backstage/plugin-events-node@0.4.20-next.1

## 0.7.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.5.0-next.1
  - @backstage/backend-defaults@0.16.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.1
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-events-node@0.4.20-next.0
  - @backstage/plugin-permission-common@0.9.6

## 0.7.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.15.3-next.0
  - @backstage/plugin-catalog-backend@3.5.0-next.0
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-events-node@0.4.20-next.0
  - @backstage/plugin-permission-common@0.9.6

## 0.7.9

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/plugin-catalog-backend@3.4.0
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/backend-defaults@0.15.2
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-events-node@0.4.19

## 0.7.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/plugin-catalog-backend@3.4.0-next.2
  - @backstage/backend-defaults@0.15.2-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-events-node@0.4.19-next.0

## 0.7.9-next.0

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/plugin-catalog-backend@3.4.0-next.0
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/backend-defaults@0.15.1-next.0
  - @backstage/plugin-permission-common@0.9.5-next.0
  - @backstage/plugin-events-node@0.4.19-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.7.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.15.0
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/plugin-permission-common@0.9.4
  - @backstage/plugin-catalog-backend@3.3.1

## 0.7.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.15.0-next.2
  - @backstage/plugin-catalog-backend@3.3.1-next.1

## 0.7.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.1-next.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-backend@3.3.1-next.0
  - @backstage/plugin-catalog-node@1.20.1
  - @backstage/plugin-events-node@0.4.18
  - @backstage/plugin-permission-common@0.9.3

## 0.7.7

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- fb029b6: Updated luxon types
- Updated dependencies
  - @backstage/backend-defaults@0.14.0
  - @backstage/plugin-catalog-backend@3.3.0
  - @backstage/plugin-events-node@0.4.18
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1

## 0.7.7-next.1

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- fb029b6: Updated luxon types
- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.1
  - @backstage/plugin-catalog-backend@3.2.1-next.1
  - @backstage/plugin-events-node@0.4.18-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.20.1-next.1
  - @backstage/plugin-permission-common@0.9.3

## 0.7.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.0
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-catalog-backend@3.2.1-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/plugin-events-node@0.4.18-next.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-permission-common@0.9.3

## 0.7.6

### Patch Changes

- 70745c5: Correctly handle entity removal computation when DB count query returns string
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-backend@3.2.0
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6

## 0.7.6-next.1

### Patch Changes

- 70745c5: Correctly handle entity removal computation when DB count query returns string
- Updated dependencies
  - @backstage/plugin-catalog-backend@3.2.0-next.1
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-defaults@0.13.1-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-permission-common@0.9.3-next.1
  - @backstage/plugin-events-node@0.4.17-next.1

## 0.7.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.1-next.0
  - @backstage/plugin-catalog-backend@3.1.3-next.0
  - @backstage/plugin-events-node@0.4.17-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.19.2-next.0
  - @backstage/plugin-permission-common@0.9.3-next.0

## 0.7.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.1.2
  - @backstage/backend-defaults@0.13.0
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-node@1.19.1
  - @backstage/plugin-events-node@0.4.16
  - @backstage/plugin-permission-common@0.9.2

## 0.7.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/backend-defaults@0.13.0-next.1
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-catalog-backend@3.1.1-next.1
  - @backstage/plugin-permission-common@0.9.2-next.0
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-events-node@0.4.16-next.0

## 0.7.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.1.1-next.0
  - @backstage/backend-defaults@0.13.0-next.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-events-node@0.4.15
  - @backstage/plugin-permission-common@0.9.1

## 0.7.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.1
  - @backstage/plugin-catalog-backend@3.1.0
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-events-node@0.4.15
  - @backstage/types@1.2.2
  - @backstage/backend-plugin-api@1.4.3

## 0.7.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.1-next.1
  - @backstage/plugin-catalog-backend@3.0.2-next.1
  - @backstage/plugin-catalog-node@1.19.0-next.1

## 0.7.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.0.2-next.0
  - @backstage/backend-defaults@0.12.1-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0
  - @backstage/plugin-events-node@0.4.15-next.0

## 0.7.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-catalog-backend@3.0.1
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## 0.7.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.2-next.0
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/plugin-catalog-backend@3.0.1-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/plugin-events-node@0.4.14-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.9.1

## 0.7.2

### Patch Changes

- 3507fcd: Just some more circular dep cleanup
- e2dd095: Fixed bug in `IncrementalIngestionEngine` by adding `burstLength` check when a burst completes
- Updated dependencies
  - @backstage/plugin-catalog-backend@3.0.0
  - @backstage/config@1.3.3
  - @backstage/plugin-permission-common@0.9.1
  - @backstage/catalog-model@1.7.5
  - @backstage/backend-defaults@0.11.1
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-node@1.17.2
  - @backstage/plugin-events-node@0.4.13

## 0.7.2-next.1

### Patch Changes

- 3507fcd: Just some more circular dep cleanup
- e2dd095: Fixed bug in `IncrementalIngestionEngine` by adding `burstLength` check when a burst completes
- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/plugin-permission-common@0.9.1-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/backend-defaults@0.11.1-next.1
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-catalog-backend@3.0.0-next.1
  - @backstage/plugin-catalog-node@1.17.2-next.0
  - @backstage/plugin-events-node@0.4.13-next.0

## 0.7.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.0.0-next.0
  - @backstage/backend-defaults@0.11.1-next.0
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/plugin-events-node@0.4.12
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.9.0

## 0.7.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.0
  - @backstage/plugin-catalog-backend@2.1.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.12
  - @backstage/plugin-permission-common@0.9.0

## 0.7.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.0-next.2
  - @backstage/plugin-catalog-backend@2.0.1-next.2
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/plugin-events-node@0.4.12-next.1
  - @backstage/plugin-permission-common@0.9.0

## 0.7.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@2.0.1-next.1
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/backend-defaults@0.10.1-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.12-next.1
  - @backstage/plugin-permission-common@0.9.0

## 0.7.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@2.0.1-next.0
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/backend-defaults@0.10.1-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0
  - @backstage/plugin-events-node@0.4.12-next.0

## 0.7.0

### Minor Changes

- 10f693c: **BREAKING** Removed support for the legacy backend, please [migrate to the new backend system](https://github.com/backstage/backstage/tree/v1.38.0/plugins/catalog-backend-module-incremental-ingestion#installation). Also, if you were importing from the `/alpha` export of this package, you should remove the `/alpha` part.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@2.0.0
  - @backstage/backend-defaults@0.10.0
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11

## 0.7.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.3
  - @backstage/plugin-catalog-backend@2.0.0-next.3
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.17.0-next.2
  - @backstage/plugin-events-node@0.4.11-next.2
  - @backstage/plugin-permission-common@0.9.0-next.0

## 0.7.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.2
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-backend@2.0.0-next.2
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-events-node@0.4.11-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0

## 0.7.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@2.0.0-next.1
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## 0.7.0-next.0

### Minor Changes

- 10f693c: **BREAKING** Removed support for the legacy backend, please [migrate to the new backend system](https://github.com/backstage/backstage/tree/v1.38.0/plugins/catalog-backend-module-incremental-ingestion#installation). Also, if you were importing from the `/alpha` export of this package, you should remove the `/alpha` part.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/backend-defaults@0.9.1-next.0
  - @backstage/plugin-catalog-backend@1.32.2-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-events-node@0.4.11-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.8.4

## 0.6.5

### Patch Changes

- 27d1031: fixed misleading example location annotations in docs
- Updated dependencies
  - @backstage/backend-defaults@0.9.0
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/plugin-catalog-backend@1.32.1
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.10
  - @backstage/plugin-permission-common@0.8.4

## 0.6.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.32.1-next.1
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/backend-defaults@0.9.0-next.2
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.9
  - @backstage/plugin-permission-common@0.8.4

## 0.6.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.0-next.1
  - @backstage/plugin-catalog-backend@1.32.1-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-events-node@0.4.9
  - @backstage/plugin-permission-common@0.8.4

## 0.6.5-next.0

### Patch Changes

- 27d1031: fixed misleading example location annotations in docs
- Updated dependencies
  - @backstage/backend-defaults@0.9.0-next.0
  - @backstage/plugin-catalog-backend@1.32.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-events-node@0.4.9
  - @backstage/plugin-permission-common@0.8.4

## 0.6.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.2
  - @backstage/plugin-catalog-backend@1.32.0
  - @backstage/plugin-events-node@0.4.9
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-permission-common@0.8.4

## 0.6.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.32.0-next.2
  - @backstage/backend-defaults@0.8.2-next.2
  - @backstage/plugin-events-node@0.4.9-next.2
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-permission-common@0.8.4

## 0.6.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.32.0-next.1
  - @backstage/backend-defaults@0.8.2-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-events-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.8.4

## 0.6.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.2-next.0
  - @backstage/plugin-catalog-backend@1.31.1-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.16.1-next.0
  - @backstage/plugin-events-node@0.4.9-next.0

## 0.6.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.0
  - @backstage/plugin-catalog-backend@1.31.0
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-catalog-node@1.16.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.8
  - @backstage/plugin-permission-common@0.8.4

## 0.6.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/plugin-catalog-backend@1.31.0-next.3
  - @backstage/backend-defaults@0.8.0-next.3
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.8.4

## 0.6.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/backend-defaults@0.8.0-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-backend@1.31.0-next.2
  - @backstage/plugin-catalog-node@1.16.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.1
  - @backstage/plugin-permission-common@0.8.4

## 0.6.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.31.0-next.1
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/backend-defaults@0.8.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.8-next.0
  - @backstage/plugin-permission-common@0.8.4

## 0.6.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.0-next.0
  - @backstage/plugin-catalog-backend@1.31.0-next.0
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.8-next.0
  - @backstage/plugin-permission-common@0.8.4

## 0.6.2

### Patch Changes

- ec547b8: Remove the error handler middleware, since that is now provided by the framework
- Updated dependencies
  - @backstage/backend-defaults@0.7.0
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-backend@1.30.0
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-node@1.15.1
  - @backstage/plugin-events-node@0.4.7
  - @backstage/plugin-permission-common@0.8.4

## 0.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-defaults@0.7.0-next.1
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-catalog-backend@1.30.0-next.1
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/plugin-events-node@0.4.7-next.1
  - @backstage/plugin-permission-common@0.8.4-next.0

## 0.6.2-next.0

### Patch Changes

- ec547b8: Remove the error handler middleware, since that is now provided by the framework
- Updated dependencies
  - @backstage/backend-defaults@0.7.0-next.0
  - @backstage/plugin-catalog-backend@1.30.0-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-node@1.15.1-next.0
  - @backstage/plugin-events-node@0.4.7-next.0
  - @backstage/plugin-permission-common@0.8.3

## 0.6.1

### Patch Changes

- dfc8b41: Updated dependency `@opentelemetry/api` to `^1.9.0`.
- cce9cae: Deprecate old-backend-system `IncrementalCatalogBuilder`
- fe87fbf: Add task metrics as two gauges that track the last start and end timestamps as epoch seconds.
- 5aa44d2: Wire up the events together in the new backend system
- d42ecb0: Remove backend-common package from incremental-ingestion plugin and update related code
- cbfc69e: Create a `dev/index.ts` entrypoint for `yarn start`
- 3ca5f70: Ensure that the scheduled worker task doesn't run at an unreasonably high frequency
- Updated dependencies
  - @backstage/backend-defaults@0.6.0
  - @backstage/plugin-catalog-backend@1.29.0
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/plugin-events-node@0.4.6
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/types@1.2.0
  - @backstage/plugin-permission-common@0.8.3

## 0.6.1-next.2

### Patch Changes

- dfc8b41: Updated dependency `@opentelemetry/api` to `^1.9.0`.
- d42ecb0: Remove backend-common package from incremental-ingestion plugin and update related code
- Updated dependencies
  - @backstage/backend-defaults@0.6.0-next.2
  - @backstage/plugin-catalog-backend@1.29.0-next.2
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/plugin-events-node@0.4.6-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-permission-common@0.8.3-next.0

## 0.6.1-next.1

### Patch Changes

- fe87fbf: Add task metrics as two gauges that track the last start and end timestamps as epoch seconds.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.29.0-next.1
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-events-node@0.4.6-next.1
  - @backstage/plugin-permission-common@0.8.2

## 0.6.1-next.0

### Patch Changes

- cce9cae: Deprecate old-backend-system `IncrementalCatalogBuilder`
- 5aa44d2: Wire up the events together in the new backend system
- cbfc69e: Create a `dev/index.ts` entrypoint for `yarn start`
- 3ca5f70: Ensure that the scheduled worker task doesn't run at an unreasonably high frequency
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-catalog-backend@1.28.1-next.0
  - @backstage/plugin-events-node@0.4.6-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-node@1.14.1-next.0
  - @backstage/plugin-permission-common@0.8.2

## 0.6.0

### Minor Changes

- 6cf91c5: Use `HumanDuration` for all duration needs in the public API, instead of `luxon` types. These are generally compatible, with a few caveats:

  - If you scheduled things to run quarterly (`quarter` or `quarters`), you can use `{ months: 3 }` instead.
  - If you used the singular nouns such as `year: 1`, use plurals instead (e.g. `years: 1`).

### Patch Changes

- c5e39e7: Internal refactor to use the deferred from the types package
- 4e58bc7: Upgrade to uuid v11 internally
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/plugin-events-node@0.4.5
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-backend@1.28.0
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5

## 0.6.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.3
  - @backstage/plugin-catalog-backend@1.28.0-next.3
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/plugin-permission-common@0.8.1

## 0.6.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.28.0-next.2
  - @backstage/plugin-events-node@0.4.5-next.2
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 0.6.0-next.1

### Minor Changes

- 6cf91c5: Use `HumanDuration` for all duration needs in the public API, instead of `luxon` types. These are generally compatible, with a few caveats:

  - If you scheduled things to run quarterly (`quarter` or `quarters`), you can use `{ months: 3 }` instead.
  - If you used the singular nouns such as `year: 1`, use plurals instead (e.g. `years: 1`).

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-backend@1.27.2-next.1
  - @backstage/plugin-catalog-node@1.14.0-next.1
  - @backstage/plugin-events-node@0.4.4-next.1
  - @backstage/plugin-permission-common@0.8.1

## 0.5.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.3-next.0
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-backend@1.27.2-next.0
  - @backstage/plugin-permission-common@0.8.1

## 0.5.5

### Patch Changes

- 4b60e0c: Remove extension points from `/alpha` export, they're available from the main package already
- 094eaa3: Remove references to in-repo backend-common
- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
- 2107965: Turn down the logging level on most "all is well" type log messages
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.27.0
  - @backstage/plugin-events-node@0.4.1
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## 0.5.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/plugin-catalog-backend@1.26.2-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-events-node@0.4.1-next.1
  - @backstage/plugin-permission-common@0.8.1

## 0.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.26.2-next.1
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/plugin-permission-common@0.8.1

## 0.5.4-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.26.1-next.0
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-permission-common@0.8.1

## 0.5.3

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- 4b28e39: Updated the README to include documentation for the new backend support
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-catalog-backend@1.26.0
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/plugin-events-node@0.4.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## 0.5.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/plugin-catalog-backend@1.26.0-next.2
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.12.7-next.2
  - @backstage/plugin-events-node@0.4.0-next.2
  - @backstage/plugin-permission-common@0.8.1

## 0.5.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/plugin-catalog-backend@1.25.3-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.12.7-next.1
  - @backstage/plugin-events-node@0.4.0-next.1
  - @backstage/plugin-permission-common@0.8.1

## 0.5.3-next.0

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- 4b28e39: Updated the README to include documentation for the new backend support
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-catalog-backend@1.25.3-next.0
  - @backstage/plugin-events-node@0.4.0-next.0
  - @backstage/plugin-catalog-node@1.12.7-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## 0.5.0

### Minor Changes

- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.

### Patch Changes

- 389f5a4: Update deprecated url-reader-related imports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-catalog-backend@1.25.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-catalog-node@1.12.5
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-events-node@0.3.9

## 0.4.28-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-backend@1.24.1-next.3
  - @backstage/plugin-catalog-node@1.12.5-next.3
  - @backstage/plugin-events-node@0.3.9-next.3
  - @backstage/plugin-permission-common@0.8.1-next.1

## 0.4.28-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-catalog-backend@1.24.1-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.2
  - @backstage/plugin-events-node@0.3.9-next.2
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1-next.0
  - @backstage/plugin-catalog-backend@1.24.1-next.1
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/plugin-catalog-node@1.12.5-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-events-node@0.3.9-next.1

## 0.4.28-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/plugin-catalog-backend@1.24.1-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-events-node@0.3.9-next.0
  - @backstage/plugin-permission-common@0.8.0

## 0.4.27

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-events-node@0.3.8
  - @backstage/plugin-catalog-backend@1.24.0
  - @backstage/plugin-catalog-node@1.12.4
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.24.0-next.1
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.12.4-next.1
  - @backstage/plugin-events-node@0.3.8-next.1
  - @backstage/plugin-permission-common@0.7.14

## 0.4.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/plugin-catalog-backend@1.23.2-next.0
  - @backstage/plugin-catalog-node@1.12.3-next.0
  - @backstage/plugin-events-node@0.3.7-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.14

## 0.4.24

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/plugin-catalog-backend@1.23.0
  - @backstage/plugin-catalog-node@1.12.1
  - @backstage/plugin-events-node@0.3.5
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.24-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-permission-common@0.7.14-next.0
  - @backstage/plugin-catalog-backend@1.23.0-next.3
  - @backstage/plugin-catalog-node@1.12.1-next.2
  - @backstage/plugin-events-node@0.3.5-next.2
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.24-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-catalog-backend@1.23.0-next.2
  - @backstage/plugin-catalog-node@1.12.1-next.1
  - @backstage/plugin-events-node@0.3.5-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13

## 0.4.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-catalog-backend@1.23.0-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0

## 0.4.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-catalog-backend@1.23.0-next.0
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13

## 0.4.23

### Patch Changes

- 8c1ab9e: Fix plugin/incremental-ingestion 'Maximum call stack size exceeded' error when ingest large entities.
- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0
  - @backstage/plugin-catalog-backend@1.22.0
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-events-node@0.3.4

## 0.4.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0-next.2
  - @backstage/plugin-catalog-backend@1.22.0-next.2
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-events-node@0.3.4-next.2

## 0.4.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-catalog-backend@1.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-events-node@0.3.4-next.1
  - @backstage/plugin-catalog-node@1.11.2-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.4.23-next.0

### Patch Changes

- 8c1ab9e: Fix plugin/incremental-ingestion 'Maximum call stack size exceeded' error when ingest large entities.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.22.0-next.0
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-catalog-node@1.11.2-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-events-node@0.3.4-next.0
  - @backstage/plugin-permission-common@0.7.13

## 0.4.22

### Patch Changes

- d5a1fe1: Replaced winston logger with `LoggerService`
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/plugin-catalog-backend@1.21.1
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/backend-tasks@0.5.22
  - @backstage/plugin-events-node@0.3.3
  - @backstage/plugin-catalog-node@1.11.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13

## 0.4.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-catalog-backend@1.21.1-next.1
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/plugin-events-node@0.3.3-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.11.1-next.1
  - @backstage/plugin-permission-common@0.7.13

## 0.4.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.21.1-next.0
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.11.1-next.0
  - @backstage/plugin-events-node@0.3.3-next.0
  - @backstage/plugin-permission-common@0.7.13

## 0.4.21

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.21.0
  - @backstage/plugin-catalog-node@1.11.0
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/backend-tasks@0.5.21
  - @backstage/plugin-events-node@0.3.2
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13

## 0.4.20

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.20.0
  - @backstage/plugin-catalog-node@1.10.0
  - @backstage/backend-common@0.21.5
  - @backstage/backend-tasks@0.5.20
  - @backstage/plugin-events-node@0.3.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13

## 0.4.19

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.19.0
  - @backstage/plugin-catalog-node@1.9.0

## 0.4.18

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-events-node@0.3.0
  - @backstage/plugin-catalog-backend@1.18.0
  - @backstage/backend-common@0.21.4
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-catalog-node@1.8.0
  - @backstage/backend-tasks@0.5.19
  - @backstage/catalog-model@1.4.5

## 0.4.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.18.0-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-catalog-node@1.8.0-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-events-node@0.3.0-next.2
  - @backstage/plugin-permission-common@0.7.13-next.1

## 0.4.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-catalog-backend@1.18.0-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## 0.4.17-next.0

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-events-node@0.3.0-next.0
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-catalog-backend@1.18.0-next.0
  - @backstage/plugin-permission-common@0.7.13-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0

## 0.4.14

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/plugin-catalog-backend@1.17.0
  - @backstage/backend-tasks@0.5.15
  - @backstage/catalog-model@1.4.4
  - @backstage/plugin-catalog-node@1.7.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.19
  - @backstage/plugin-permission-common@0.7.12

## 0.4.14-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-catalog-backend@1.17.0-next.3
  - @backstage/plugin-catalog-node@1.6.2-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.19-next.3
  - @backstage/plugin-permission-common@0.7.12

## 0.4.14-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-catalog-backend@1.17.0-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/plugin-events-node@0.2.19-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.12

## 0.4.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/plugin-catalog-backend@1.17.0-next.1
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.6.2-next.1
  - @backstage/plugin-events-node@0.2.19-next.1
  - @backstage/plugin-permission-common@0.7.12

## 0.4.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-catalog-backend@1.17.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.19-next.0
  - @backstage/plugin-permission-common@0.7.12

## 0.4.13

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-catalog-backend@1.16.1
  - @backstage/backend-tasks@0.5.14
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.18

## 0.4.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-catalog-backend@1.16.1-next.2
  - @backstage/plugin-catalog-node@1.6.1-next.2
  - @backstage/plugin-events-node@0.2.18-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.4.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/plugin-catalog-backend@1.16.1-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.6.1-next.1
  - @backstage/plugin-events-node@0.2.18-next.1
  - @backstage/plugin-permission-common@0.7.11

## 0.4.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-backend@1.16.1-next.0
  - @backstage/plugin-events-node@0.2.18-next.0
  - @backstage/plugin-permission-common@0.7.11

## 0.4.12

### Patch Changes

- 43b2eb8: Ensure that cursors always come back as JSON on sqlite too
- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-catalog-node@1.6.0
  - @backstage/plugin-catalog-backend@1.16.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.17

## 0.4.12-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-backend@1.16.0-next.3
  - @backstage/plugin-catalog-node@1.6.0-next.3
  - @backstage/plugin-events-node@0.2.17-next.3
  - @backstage/plugin-permission-common@0.7.10

## 0.4.12-next.2

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0-next.2
  - @backstage/plugin-catalog-backend@1.16.0-next.2
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.17-next.2
  - @backstage/plugin-permission-common@0.7.10

## 0.4.12-next.1

### Patch Changes

- 43b2eb8f70: Ensure that cursors always come back as JSON on sqlite too
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.1-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-events-node@0.2.17-next.1
  - @backstage/plugin-permission-common@0.7.10

## 0.4.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/plugin-catalog-backend@1.15.1-next.0
  - @backstage/plugin-catalog-node@1.5.1-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.17-next.0
  - @backstage/plugin-permission-common@0.7.10

## 0.4.11

### Patch Changes

- 013611b42e: `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.0
  - @backstage/plugin-catalog-node@1.5.0
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.16

## 0.4.11-next.2

### Patch Changes

- [#20570](https://github.com/backstage/backstage/pull/20570) [`013611b42e`](https://github.com/backstage/backstage/commit/013611b42ed457fefa9bb85fddf416cf5e0c1f76) Thanks [@freben](https://github.com/freben)! - `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-catalog-backend@1.15.0-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-catalog-node@1.5.0-next.2
  - @backstage/plugin-events-node@0.2.16-next.2

## 0.4.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.0-next.1
  - @backstage/plugin-catalog-node@1.5.0-next.1
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.16-next.1
  - @backstage/plugin-permission-common@0.7.9

## 0.4.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.0-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.4.8-next.0
  - @backstage/plugin-events-node@0.2.16-next.0
  - @backstage/plugin-permission-common@0.7.9

## 0.4.10

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-backend@1.14.0
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-events-node@0.2.15
  - @backstage/plugin-permission-common@0.7.9

## 0.4.10-next.2

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-catalog-backend@1.14.0-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-catalog-node@1.4.7-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/plugin-events-node@0.2.15-next.2
  - @backstage/plugin-permission-common@0.7.9-next.0

## 0.4.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/plugin-catalog-backend@1.14.0-next.1
  - @backstage/plugin-catalog-node@1.4.6-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/plugin-events-node@0.2.14-next.1
  - @backstage/plugin-permission-common@0.7.8

## 0.4.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.14.0-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/plugin-catalog-node@1.4.6-next.0
  - @backstage/plugin-events-node@0.2.14-next.0
  - @backstage/plugin-permission-common@0.7.8

## 0.4.6

### Patch Changes

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

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-catalog-node@1.4.4
  - @backstage/plugin-events-node@0.2.12

## 0.4.6-next.3

### Patch Changes

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

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.3
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/plugin-permission-common@0.7.8-next.2
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-catalog-node@1.4.4-next.3
  - @backstage/plugin-events-node@0.2.12-next.3

## 0.4.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-events-node@0.2.12-next.2

## 0.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.1
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-permission-common@0.7.8-next.0
  - @backstage/plugin-catalog-node@1.4.4-next.1
  - @backstage/plugin-events-node@0.2.12-next.1
  - @backstage/errors@1.2.1

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.2-next.0
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-node@1.4.3-next.0
  - @backstage/plugin-events-node@0.2.11-next.0
  - @backstage/plugin-permission-common@0.7.7

## 0.4.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- e2b6396a1274: Export new alpha `incrementalIngestionProvidersExtensionPoint` for registering incremental providers, rather than the providers being passed as options to the backend module.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/plugin-catalog-backend@1.12.0
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-catalog-node@1.4.1
  - @backstage/plugin-events-node@0.2.9
  - @backstage/backend-tasks@0.5.5
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-permission-common@0.7.7

## 0.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## 0.4.1-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-catalog-backend@1.12.0-next.1
  - @backstage/plugin-catalog-node@1.4.1-next.1
  - @backstage/plugin-events-node@0.2.9-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-permission-common@0.7.7

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.0-next.0
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-node@1.4.1-next.0
  - @backstage/plugin-events-node@0.2.9-next.0
  - @backstage/plugin-permission-common@0.7.7

## 0.4.0

### Minor Changes

- b1cc10696f2f: **BREAKING** Allow incremental event handlers to be async; Force event handler
  to indicate if it made a change. Instead of returning `null` or `undefined` from an event
  handler to indicate no-oop, instead return the value { type: "ignored" }.

  **before**

  ```javascript
  import { createDelta, shouldIgnore } from "./my-delta-creater";

  eventHandler: {
    onEvent(params) {
      if (shouldIgnore(params)) {
        return;
      }
      return createDelta(params);
    }
  }
  ```

  **after**

  ```javascript
  import { createDelta, shouldIgnore } from "./my-delta-creater";

  eventHandler: {
    async onEvent(params) {
      if (shouldIgnore(params) {
        return { type: "ignored" };
      }
      // code to create delta can now be async if needed
      return await createDelta(params);
    }
  }
  ```

### Patch Changes

- e1d615757f48: Update readme and instructions
- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/plugin-catalog-backend@1.11.0
  - @backstage/plugin-catalog-node@1.4.0
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/backend-tasks@0.5.4
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/plugin-events-node@0.2.8
  - @backstage/plugin-permission-common@0.7.7

## 0.4.0-next.1

### Minor Changes

- b1cc10696f2f: **BREAKING** Allow incremental event handlers to be async; Force event handler
  to indicate if it made a change. Instead of returning `null` or `undefined` from an event
  handler to indicate no-oop, instead return the value { type: "ignored" }.

  **before**

  ```javascript
  import { createDelta, shouldIgnore } from "./my-delta-creater";

  eventHandler: {
    onEvent(params) {
      if (shouldIgnore(params)) {
        return;
      }
      return createDelta(params);
    }
  }
  ```

  **after**

  ```javascript
  import { createDelta, shouldIgnore } from "./my-delta-creater";

  eventHandler: {
    async onEvent(params) {
      if (shouldIgnore(params) {
        return { type: "ignored" };
      }
      // code to create delta can now be async if needed
      return await createDelta(params);
    }
  }
  ```

### Patch Changes

- e1d615757f48: Update readme and instructions
- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1-next.0
  - @backstage/plugin-catalog-backend@1.11.0-next.0
  - @backstage/plugin-catalog-node@1.4.0-next.0
  - @backstage/plugin-events-node@0.2.8-next.0
  - @backstage/plugin-permission-common@0.7.7-next.0

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/plugin-catalog-backend@1.11.0-next.0
  - @backstage/plugin-catalog-node@1.4.0-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-events-node@0.2.8-next.0
  - @backstage/plugin-permission-common@0.7.7-next.0

## 0.3.3

### Patch Changes

- 53309661cb5c: Update installation guide to fix inconsistency in type names
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/plugin-catalog-backend@1.10.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-catalog-node@1.3.7
  - @backstage/config@1.0.8
  - @backstage/plugin-events-node@0.2.7
  - @backstage/plugin-permission-common@0.7.6

## 0.3.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/plugin-catalog-backend@1.10.0-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/plugin-catalog-node@1.3.7-next.2
  - @backstage/plugin-events-node@0.2.7-next.2
  - @backstage/plugin-permission-common@0.7.6-next.0

## 0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/plugin-catalog-backend@1.9.2-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.1
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/plugin-events-node@0.2.7-next.1
  - @backstage/config@1.0.7

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.9.2-next.0
  - @backstage/plugin-catalog-node@1.3.7-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/plugin-events-node@0.2.7-next.0
  - @backstage/plugin-permission-common@0.7.5

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.9.1
  - @backstage/backend-common@0.18.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-catalog-node@1.3.6
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-events-node@0.2.6
  - @backstage/plugin-permission-common@0.7.5

## 0.3.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.9.1-next.2
  - @backstage/config@1.0.7

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-catalog-backend@1.9.1-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-catalog-backend@1.9.1-next.0
  - @backstage/plugin-catalog-node@1.3.6-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-events-node@0.2.6-next.0
  - @backstage/plugin-permission-common@0.7.5

## 0.3.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/plugin-catalog-backend@1.9.0
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-catalog-node@1.3.5
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-events-node@0.2.5

## 0.3.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.9.0-next.3
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.5-next.3
  - @backstage/plugin-events-node@0.2.5-next.2
  - @backstage/plugin-permission-common@0.7.5-next.0

## 0.3.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.1-next.2
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.5-next.2
  - @backstage/plugin-events-node@0.2.5-next.2
  - @backstage/plugin-permission-common@0.7.5-next.0

## 0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-catalog-backend@1.8.1-next.1
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.5-next.1
  - @backstage/plugin-events-node@0.2.5-next.1

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.1-next.0
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.5-next.0
  - @backstage/plugin-events-node@0.2.5-next.0
  - @backstage/plugin-permission-common@0.7.4

## 0.3.0

### Minor Changes

- a811bd246c4: Added endpoint to get a list of known incremental entity providers

### Patch Changes

- 90469c02c8c: Renamed `incrementalIngestionEntityProviderCatalogModule` to `catalogModuleIncrementalIngestionEntityProvider` to match the [recommended naming patterns](https://backstage.io/docs/backend-system/architecture/naming-patterns).
- e675f902980: Make sure to not use deprecated exports from `@backstage/plugin-catalog-backend`
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- bf611cf019a: Fix missing `dependencies` in `package.json`
- 6e612b58577: Move `@backstage/backend-defaults` to `devDependencies`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.0
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.4
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/plugin-events-node@0.2.4
  - @backstage/plugin-permission-common@0.7.4
  - @backstage/config@1.0.7

## 0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-catalog-backend@1.8.0-next.2
  - @backstage/plugin-catalog-node@1.3.4-next.2
  - @backstage/plugin-events-node@0.2.4-next.2
  - @backstage/config@1.0.7-next.0

## 0.3.0-next.1

### Minor Changes

- a811bd246c4: Added endpoint to get a list of known incremental entity providers

### Patch Changes

- 6e612b58577: Move `@backstage/backend-defaults` to `devDependencies`
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/plugin-catalog-backend@1.8.0-next.1
  - @backstage/plugin-permission-common@0.7.4-next.0
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/plugin-catalog-node@1.3.4-next.1
  - @backstage/plugin-events-node@0.2.4-next.1

## 0.2.2-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- bf611cf019: Fix missing `dependencies` in `package.json`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.0-next.0
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-defaults@0.1.8-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.3.4-next.0
  - @backstage/plugin-events-node@0.2.4-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3

## 0.2.0

### Minor Changes

- 1ba120faa3: Added new mechanism to handle deltas in incremental providers

### Patch Changes

- c51efce2a0: Update docs to always use `yarn add --cwd` for app & backend
- 407dc01fc9: Removing extra imports for `run` script as `TestBackend` auto loads the default factories
- b7e36660d5: Return `EventSubscriber` from `addIncrementalEntityProvider` to hook up to `EventsBackend`
- 5b7cd5580d: Moving the backend-test-utils to devDependencies.
- 77c41b6924: Updated README to include newer API options for incremental entity providers
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/catalog-model@1.2.0
  - @backstage/plugin-events-node@0.2.3
  - @backstage/plugin-catalog-node@1.3.3
  - @backstage/backend-tasks@0.4.3
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3

## 0.2.0-next.2

### Patch Changes

- 407dc01fc9: Removing extra imports for `run` script as `TestBackend` auto loads the default factories
- 77c41b6924: Updated README to include newer API options for incremental entity providers
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-test-utils@0.1.34-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-catalog-backend@1.7.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/plugin-events-node@0.2.3-next.2
  - @backstage/plugin-catalog-node@1.3.3-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3

## 0.2.0-next.1

### Patch Changes

- b7e36660d5: Return `EventSubscriber` from `addIncrementalEntityProvider` to hook up to `EventsBackend`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2-next.1
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/backend-test-utils@0.1.34-next.1
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-catalog-node@1.3.3-next.1
  - @backstage/plugin-events-node@0.2.3-next.1
  - @backstage/plugin-permission-common@0.7.3

## 0.2.0-next.0

### Minor Changes

- 1ba120faa3: Added new mechanism to handle deltas in incremental providers

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-test-utils@0.1.34-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-catalog-backend@1.7.2-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0
  - @backstage/plugin-events-node@0.2.3-next.0

## 0.1.1

### Patch Changes

- ecbec4ec4c: Internal refactor to match new options pattern in the experimental backend system.
- 045b66ce02: Fixed issue with sometimes trying to commit an empty array of references
- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/backend-test-utils@0.1.32
  - @backstage/catalog-model@1.1.5
  - @backstage/backend-tasks@0.4.1
  - @backstage/plugin-catalog-node@1.3.1
  - @backstage/plugin-catalog-backend@1.7.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3

## 0.1.1-next.2

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-test-utils@0.1.32-next.2
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/plugin-catalog-backend@1.7.0-next.2
  - @backstage/plugin-catalog-node@1.3.1-next.2
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3-next.0

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-test-utils@0.1.32-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3-next.0

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/backend-test-utils@0.1.32-next.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/plugin-catalog-node@1.3.1-next.0
  - @backstage/plugin-permission-common@0.7.2

## 0.1.0

### Minor Changes

- 98c643a1a2: Introduces incremental entity providers, which are used for streaming very large data sources into the catalog.

### Patch Changes

- c507aee8a2: Ensured typescript type checks in migration files.
- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- de8a975911: Changed to use native `AbortController` and `AbortSignal` from Node.js, instead
  of the one from `node-abort-controller`. This is possible now that the minimum
  supported Node.js version of the project is 16.

  Note that their interfaces are very slightly different, but typically not in a
  way that matters to consumers. If you see any typescript errors as a direct
  result from this, they are compatible with each other in the ways that we
  interact with them, and should be possible to type-cast across without ill
  effects.

- 05a928e296: Updated usages of types from `@backstage/backend-plugin-api`.
- 61d4efe978: Make incremental providers more resilient to failures
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-catalog-node@1.3.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/plugin-permission-common@0.7.2
  - @backstage/backend-test-utils@0.1.31
  - @backstage/errors@1.1.4
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5

## 0.1.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.3
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/plugin-permission-common@0.7.2-next.2
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/backend-test-utils@0.1.31-next.4
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-catalog-node@1.3.0-next.3

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/backend-test-utils@0.1.31-next.3
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/plugin-permission-common@0.7.2-next.1

## 0.1.0-next.1

### Patch Changes

- c507aee8a2: Ensured typescript type checks in migration files.
- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- 61d4efe978: Make incremental providers more resilient to failures
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-test-utils@0.1.31-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1

## 0.1.0-next.0

### Minor Changes

- 98c643a1a2: Introduces incremental entity providers, which are used for streaming very large data sources into the catalog.

### Patch Changes

- de8a975911: Changed to use native `AbortController` and `AbortSignal` from Node.js, instead
  of the one from `node-abort-controller`. This is possible now that the minimum
  supported Node.js version of the project is 16.

  Note that their interfaces are very slightly different, but typically not in a
  way that matters to consumers. If you see any typescript errors as a direct
  result from this, they are compatible with each other in the ways that we
  interact with them, and should be possible to type-cast across without ill
  effects.

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-catalog-backend@1.6.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/backend-test-utils@0.1.31-next.1
  - @backstage/plugin-catalog-node@1.2.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1
