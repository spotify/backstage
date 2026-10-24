# @backstage/plugin-catalog-backend

## 4.0.3-next.0

### Patch Changes

- 7d765b6: Improved repository validation for catalog entity placeholders. Placeholder-driven reads, including `$openapi` and `$asyncapi` document references, are now restricted to the entity's own repository on SCM hosts; cross-repository references are rejected.
- 2a9f08b: Match URL locations in catalog rules in canonical form.

  URL locations are now matched against catalog rules in a canonical form of the URL, so that rule decisions agree with how the location target is resolved when its content is fetched. URL patterns that relied on percent-encoded characters being matched as written, or on default ports being kept, no longer match and should be updated.

- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 4.0.2

### Patch Changes

- Bumped version to account for a patch release.

## 4.0.1

### Patch Changes

- 589dcef: Fixed an issue where successfully processed entities could remain unavailable if stitch scheduling was interrupted.
- a08e746: Improved large entity provider mutations by yielding to the event loop while preparing database changes.
- aa6e7c6: Reduce repeated work for entities that fail stitching by gradually increasing retry delays with jitter. Failed entities remain eligible for recovery, and new stitching requests reset their failure count.
- d7cc6e5: Reject non-positive stitching polling intervals and lease durations at startup to prevent continuous polling and immediate lease expiry. Configuration errors identify the setting that needs correction.
- 727d53f: Improve responsiveness to other requests while reading large sets of entities with field selection, without reducing page sizes.

  Like full-entity responses, projected list responses may now be streamed without a `Content-Length` or automatically generated `ETag` header.

- 11f608b: Entity and location queries with a primitive value at the root of the filter predicate are now rejected with an "Invalid query" error, rather than "Query must be an object".
- e783f4b: Fixed catalog processing error messages to report stable processor names in minified builds.
- 7c376ff: Improved the performance and planner stability of orphan entity cleanup on large PostgreSQL catalogs. Orphan deletion and updates to related entities are now atomic, so a failed cleanup does not leave related entities waiting indefinitely for updated relations. Cleanup also preserves entities when a new reference is committed while it waits to delete them.
- a69d971: Improved the reliability of deferred stitching. Pending stitching work is no longer lost when entities are deleted and re-added, and updated instances prevent timed-out stitching attempts from overwriting or removing work taken over by another updated instance. During rolling upgrades from older versions, instances may still perform redundant stitching. On MySQL, protection against overlapping writes remains best-effort.
- 476f042: Fixed entities disappearing from filtered and sorted catalog queries after a database error during stitching. The final entity and its search index rows are now written together, so a failure part way through is rolled back and retried in full. Previously the entity could be left with a search index that no longer matched it, and because the entity itself looked up to date, every later stitch attempt skipped it. Such an entity stayed readable by direct lookup while missing from list queries that filter or sort, until it was next edited.

  PostgreSQL and MySQL deadlocks trigger prompt, bounded retries of the entire write transaction, skipping the write if newer stitching work has superseded it. If retries are exhausted, queued work remains available for recovery after the stitching timeout.

- Updated dependencies
  - @backstage/integration@2.1.3
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/catalog-client@1.16.3
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/filter-predicates@0.2.0
  - @backstage/backend-openapi-utils@0.7.3
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-catalog-common@1.2.1
  - @backstage/plugin-catalog-node@2.2.6
  - @backstage/plugin-events-node@0.4.27
  - @backstage/plugin-permission-common@0.9.12
  - @backstage/plugin-permission-node@0.11.5

## 4.0.1-next.3

### Patch Changes

- aa6e7c6: Reduce repeated work for entities that fail stitching by gradually increasing retry delays with jitter. Failed entities remain eligible for recovery, and new stitching requests reset their failure count.
- d7cc6e5: Reject non-positive stitching polling intervals and lease durations at startup to prevent continuous polling and immediate lease expiry. Configuration errors identify the setting that needs correction.
- 7c376ff: Improved the performance and planner stability of orphan entity cleanup on large PostgreSQL catalogs. Orphan deletion and updates to related entities are now atomic, so a failed cleanup does not leave related entities waiting indefinitely for updated relations. Cleanup also preserves entities when a new reference is committed while it waits to delete them.
- Updated dependencies
  - @backstage/catalog-client@1.16.3-next.1
  - @backstage/backend-plugin-api@1.11.0-next.2

## 4.0.1-next.2

### Patch Changes

- 589dcef: Fixed an issue where successfully processed entities could remain unavailable if stitch scheduling was interrupted.
- a69d971: Improved the reliability of deferred stitching. Pending stitching work is no longer lost when entities are deleted and re-added, and updated instances prevent timed-out stitching attempts from overwriting or removing work taken over by another updated instance. During rolling upgrades from older versions, instances may still perform redundant stitching. On MySQL, protection against overlapping writes remains best-effort.
- 476f042: Fixed entities disappearing from filtered and sorted catalog queries after a database error during stitching. The final entity and its search index rows are now written together, so a failure part way through is rolled back and retried in full. Previously the entity could be left with a search index that no longer matched it, and because the entity itself looked up to date, every later stitch attempt skipped it. Such an entity stayed readable by direct lookup while missing from list queries that filter or sort, until it was next edited.

  PostgreSQL and MySQL deadlocks trigger prompt, bounded retries of the entire write transaction, skipping the write if newer stitching work has superseded it. If retries are exhausted, queued work remains available for recovery after the stitching timeout.

- Updated dependencies
  - @backstage/integration@2.1.3-next.1
  - @backstage/backend-openapi-utils@0.7.3-next.2

## 4.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/backend-openapi-utils@0.7.3-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1
  - @backstage/plugin-events-node@0.4.27-next.1
  - @backstage/plugin-permission-node@0.11.5-next.1

## 4.0.1-next.0

### Patch Changes

- a08e746: Improved large entity provider mutations by yielding to the event loop while preparing database changes.
- 727d53f: Improve responsiveness to other requests while reading large sets of entities with field selection, without reducing page sizes.

  Like full-entity responses, projected list responses may now be streamed without a `Content-Length` or automatically generated `ETag` header.

- e783f4b: Fixed catalog processing error messages to report stable processor names in minified builds.
- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/filter-predicates@0.1.6-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/backend-openapi-utils@0.7.3-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## 4.0.0

### Major Changes

- b0d8a53: **BREAKING**: Removed the deprecated `CodeOwnersProcessor` and `AnnotateScmSlugEntityProcessor` exports. To retain their behavior, install and register the corresponding community backend module:

  - `CodeOwnersProcessor`: [`@backstage-community/plugin-catalog-backend-module-codeowners`](https://github.com/backstage/community-plugins/tree/main/workspaces/catalog/plugins/catalog-backend-module-codeowners)
  - `AnnotateScmSlugEntityProcessor`: [`@backstage-community/plugin-catalog-backend-module-annotate-scm-slug`](https://github.com/backstage/community-plugins/tree/main/workspaces/catalog/plugins/catalog-backend-module-annotate-scm-slug)

  Add the module to your backend with `backend.add(import('<module-package>'))` and remove the custom registration of the old processor. For explicit processor configuration, follow the replacement module's documentation.

- b0d8a53: **BREAKING**: Removed the deprecated `catalog.stitchingStrategy.mode` configuration setting and its startup warnings. Remove this key from your configuration, whether it is set to `immediate` or `deferred`. Stitching continues to run asynchronously via the worker queue. The `catalog.stitchingStrategy.pollingInterval` and `catalog.stitchingStrategy.stitchTimeout` settings remain supported and should be kept if you use them.
- d2cf99f: **BREAKING**: Removed the deprecated `catalog.enableRelationsCompatibility` config option and its associated compatibility layer. Entity relations are now always returned in the standard format with only `targetRef`. If you were relying on the `target` field in relations, update your code to use `targetRef` instead.

### Patch Changes

- 736d84e: Use locale-insensitive Unicode casing for consistent string handling across environments.
- f5119cc: Improved PostgreSQL catalog query planning by correcting entity cardinality statistics for the search table.
- 72c16f5: Use stable PostgreSQL array parameters for `$in` filter predicates.
- 78656f8: Fixed catalog model relations to inherit the source entity namespace when no default namespace is configured, as documented. Explicit namespaces in entity references and explicitly configured default namespaces continue to take precedence.
- 7761a50: Improved path validation for catalog entity placeholders.
- 49b41f6: Fixed a bug where catalog entities could fail to process when catalog model sources are enabled and the catalog mixes `backstage.io/v1alpha1` and `backstage.io/v1beta1` for the same kind.
- 4b922b3: The `catalog:query-catalog-entities` action now accepts `limit` and `offset` when they are passed as strings, coercing them to numbers before validation. Previously the action failed with a validation error when a client sent these pagination arguments as strings, which is common for MCP/LLM clients.
- fda0ef1: Correct catalog property permission matching.
- ff327e0: Apply catalog location analysis permissions consistently when using a custom location analyzer.
- 05e2005: Fixed PostgreSQL catalog migrations sometimes failing during search index deduplication when using a database connection pool.
- 7629e5e: Use stable PostgreSQL array parameters for batched refresh state lookups and updates.
- c26a19b: Improved catalog database performance stability for large PostgreSQL installations with frequent entity updates.
- e363ae2: Allowed location type restrictions are now applied consistently during catalog processing.
- Updated dependencies
  - @backstage/integration@2.1.2
  - @backstage/plugin-catalog-common@1.2.0
  - @backstage/backend-openapi-utils@0.7.2
  - @backstage/catalog-client@1.16.2
  - @backstage/catalog-model@1.10.1
  - @backstage/filter-predicates@0.1.5
  - @backstage/config@1.3.9
  - @backstage/plugin-permission-node@0.11.4
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5
  - @backstage/plugin-events-node@0.4.26
  - @backstage/plugin-permission-common@0.9.11

## 4.0.0-next.1

### Major Changes

- d2cf99f: **BREAKING**: Removed the deprecated `catalog.enableRelationsCompatibility` config option and its associated compatibility layer. Entity relations are now always returned in the standard format with only `targetRef`. If you were relying on the `target` field in relations, update your code to use `targetRef` instead.

### Patch Changes

- f5119cc: Improved PostgreSQL catalog query planning by correcting entity cardinality statistics for the search table.
- 72c16f5: Use stable PostgreSQL array parameters for `$in` filter predicates.
- 7629e5e: Use stable PostgreSQL array parameters for batched refresh state lookups and updates.
- Updated dependencies
  - @backstage/plugin-catalog-common@1.2.0-next.0
  - @backstage/config@1.3.9-next.0
  - @backstage/catalog-client@1.16.2-next.1
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/filter-predicates@0.1.5-next.1
  - @backstage/integration@2.1.2-next.1
  - @backstage/plugin-permission-common@0.9.11-next.0
  - @backstage/plugin-permission-node@0.11.4-next.1

## 3.9.2-next.0

### Patch Changes

- 7761a50: Improved path validation for catalog entity placeholders.
- fda0ef1: Correct catalog property permission matching.
- e363ae2: Allowed location type restrictions are now applied consistently during catalog processing.
- Updated dependencies
  - @backstage/integration@2.1.2-next.0
  - @backstage/backend-openapi-utils@0.7.2-next.0
  - @backstage/filter-predicates@0.1.5-next.0
  - @backstage/plugin-permission-node@0.11.4-next.0
  - @backstage/catalog-client@1.16.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0
  - @backstage/plugin-events-node@0.4.26-next.0

## 3.9.0

### Minor Changes

- c7c0ec3: Added a `refresh-catalog-entity` action so agents and MCP clients can re-queue a single entity for processing after creating or updating it — useful for reading back fresh data immediately after a scaffolder run without waiting for the next scheduled processing loop.

### Patch Changes

- aa318d0: Migrated internal query filter handling from `EntityFilter` to `FilterPredicate`, simplifying the filter parsing and query application pipeline.
- 10f0713: Replaced the delete-all and reinsert pattern for the `relations` table with a diff-based sync that only touches rows that actually changed. In steady state (the common case), zero writes occur, eliminating write churn, dead tuples, and WAL traffic from the processing path. Stitching is now also skipped for relation neighbors that did not change.
- ee40136: Fixed a missing promise return in a database migration rollback function.
- eb6dff2: Fixed an issue where PostgreSQL deadlock errors during entity provider mutations were silently swallowed, causing entities to be dropped until the next full refresh. Transactions are now automatically retried on deadlock with exponential back-off.
- dd562f0: Fixed a potential MySQL deadlock during concurrent entity processing by retrying the `updateProcessedEntity` transaction on deadlock errors.
- b031a48: Fixed an issue where SCM `location.moved` events would generate new locations in the database for files that were not actively tracked.
- b7650ad: Simplified internal router setup by removing unnecessary conditional guards around route registrations.
- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/integration@2.1.0
  - @backstage/plugin-permission-common@0.9.10
  - @backstage/plugin-permission-node@0.11.3
  - @backstage/backend-openapi-utils@0.7.1
  - @backstage/plugin-catalog-node@2.2.4
  - @backstage/plugin-events-node@0.4.25

## 3.9.0-next.2

### Minor Changes

- c7c0ec3: Added a `refresh-catalog-entity` action so agents and MCP clients can re-queue a single entity for processing after creating or updating it — useful for reading back fresh data immediately after a scaffolder run without waiting for the next scheduled processing loop.

### Patch Changes

- aa318d0: Migrated internal query filter handling from `EntityFilter` to `FilterPredicate`, simplifying the filter parsing and query application pipeline.
- 10f0713: Replaced the delete-all and reinsert pattern for the `relations` table with a diff-based sync that only touches rows that actually changed. In steady state (the common case), zero writes occur, eliminating write churn, dead tuples, and WAL traffic from the processing path. Stitching is now also skipped for relation neighbors that did not change.
- eb6dff2: Fixed an issue where PostgreSQL deadlock errors during entity provider mutations were silently swallowed, causing entities to be dropped until the next full refresh. Transactions are now automatically retried on deadlock with exponential back-off.
- dd562f0: Fixed a potential MySQL deadlock during concurrent entity processing by retrying the `updateProcessedEntity` transaction on deadlock errors.
- b031a48: Fixed an issue where SCM `location.moved` events would generate new locations in the database for files that were not actively tracked.
- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.1

## 3.8.2-next.1

### Patch Changes

- ee40136: Fixed a missing promise return in a database migration rollback function.
- b7650ad: Simplified internal router setup by removing unnecessary conditional guards around route registrations.
- Updated dependencies
  - @backstage/integration@2.1.0-next.0

## 3.8.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-permission-node@0.11.3-next.0
  - @backstage/backend-openapi-utils@0.7.1-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0
  - @backstage/plugin-events-node@0.4.25-next.0

## 3.8.1

### Patch Changes

- 28c1c1c: Synced zod-validation-error versions between packages
- Updated dependencies
  - @backstage/backend-openapi-utils@0.7.0
  - @backstage/filter-predicates@0.1.4
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/catalog-client@1.16.1
  - @backstage/plugin-catalog-node@2.2.3
  - @backstage/plugin-events-node@0.4.24
  - @backstage/plugin-permission-node@0.11.2

## 3.8.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.7.0-next.1
  - @backstage/backend-plugin-api@1.9.3-next.1

## 3.8.1-next.0

### Patch Changes

- 28c1c1c: Synced zod-validation-error versions between packages
- Updated dependencies
  - @backstage/filter-predicates@0.1.4-next.0
  - @backstage/plugin-permission-node@0.11.2-next.0
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0
  - @backstage/plugin-events-node@0.4.24-next.0
  - @backstage/catalog-client@1.16.1-next.0
  - @backstage/backend-openapi-utils@0.6.11-next.0

## 3.8.0

### Minor Changes

- 8f20cc2: `/entities/by-query` now accepts a `totalItems` parameter (`'include'` or `'exclude'`, default `'include'`) that controls whether the response's `totalItems` count is computed. Pass `'exclude'` to skip the count entirely when the caller doesn't need it — useful for cursor-paginated user interfaces that only display the count cosmetically. The accepted values list is forward-compatible: future modes (e.g. approximate counts) can be added without breaking existing callers.

  The internal `QueryEntitiesInitialRequest.skipTotalItems` option has been replaced by `totalItems: 'include' | 'exclude'`. Note that `skipTotalItems` was never exposed as a REST API parameter, so this is only a TypeScript-level change affecting direct callers of `EntitiesCatalog.queryEntities`.

  Sort field keys are now lowercased before comparing against `search.key`, fixing silent mismatches for camelCase field names. The `NULLS LAST` ordering clause has been removed since NULL sort values are already excluded by the `WHERE` clause.

- dc7678c: Removed the immediate mode stitching strategy. All stitching now uses the deferred mode, which processes entities asynchronously via a worker queue. If your configuration includes `catalog.stitchingStrategy.mode: 'immediate'`, it will be ignored with a deprecation warning. The `pollingInterval` and `stitchTimeout` settings continue to work as before.

### Patch Changes

- 9698738: Dropped the legacy `search_entity_id_idx` index which is now redundant with the covering unique index on `(entity_id, key, value)`. The old index caused the query planner to choose an inefficient scan pattern for catalog list queries with multiple sort fields, leading to severely degraded performance on large catalogs.
- ccfa4f1: Optimized `entitiesBatch` on PostgreSQL to use `= ANY(array)` instead of `WHERE IN ($1, $2, ...)`. This produces a single stable query plan regardless of batch size, instead of up to 200 different plans that pollute the query plan cache. On PostgreSQL, batching is no longer needed so all entity refs are fetched in a single query.
- 750b310: `HAS_LABEL` and `HAS_ANNOTATION` permission rules are now case insensitive.
- 24775dc: Added a migration that tunes PostgreSQL automatic vacuum thresholds on the `search`, `final_entities`, `relations`, and `refresh_state_references` tables, and fixes column statistics for `entity_id` in the `search` table. This prevents the query planner from falling back to sequential scans when table maintenance falls behind, keeping catalog queries fast on large installations.
- 39c5fbb: Added extended multi-column statistics on `(key, value)` in the `search` table (PostgreSQL only). This tells the query planner about the correlation between the `key` and `value` columns, fixing severe row count estimation errors on compound filter queries. Without this, the planner could choose to materialize and sort thousands of rows instead of using the LIMIT short-circuit index scan — causing 10-40x slower catalog list views when multiple filters are active.
- 4829e89: Split the `queryEntities` list and count into separate queries instead of a multi-reference CTE. When the `filtered` CTE was referenced twice (once for the count, once for the data), PostgreSQL refused to inline it, forcing full materialization of the filtered set before applying `LIMIT`. By running the count as a standalone query, the list CTE is only referenced once, allowing the planner to short-circuit on `LIMIT` and return the first page in milliseconds instead of waiting for the full filtered set to materialize.

  The standalone count query also fixes a pre-existing bug where `totalItems` was inflated for entities with multi-valued sort fields (e.g. tags). The old CTE-based count counted search rows, so an entity with 3 tags would be counted 3 times. The new count uses `EXISTS` to count distinct entities, aligning `totalItems` with the number of entities actually reachable through cursor pagination.

- 774d698: Fixed a race condition in the stitch queue and entity processing claim logic where `SELECT FOR UPDATE SKIP LOCKED` row locks were released before the subsequent timestamp bump, allowing multiple workers to claim the same rows. Both the select and update now run inside a single transaction for MySQL and PostgreSQL.
- 0b8b677: Improved stitch queue semantics to prevent overlapping stitches for the same entity. New stitch requests that arrive while a stitch is in progress now only update the ticket (not the timestamp), so the in-progress worker is not interrupted. When the worker completes and detects a pending re-stitch, the queue entry becomes immediately eligible for pickup instead of waiting for the timeout period.
- Updated dependencies
  - @backstage/catalog-client@1.16.0
  - @backstage/integration@2.0.3
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/backend-openapi-utils@0.6.10
  - @backstage/plugin-catalog-node@2.2.2
  - @backstage/plugin-events-node@0.4.23
  - @backstage/plugin-permission-node@0.11.1

## 3.8.0-next.1

### Patch Changes

- 9698738: Dropped the legacy `search_entity_id_idx` index which is now redundant with the covering unique index on `(entity_id, key, value)`. The old index caused the query planner to choose an inefficient scan pattern for catalog list queries with multiple sort fields, leading to severely degraded performance on large catalogs.
- ccfa4f1: Optimized `entitiesBatch` on PostgreSQL to use `= ANY(array)` instead of `WHERE IN ($1, $2, ...)`. This produces a single stable query plan regardless of batch size, instead of up to 200 different plans that pollute the query plan cache. On PostgreSQL, batching is no longer needed so all entity refs are fetched in a single query.
- 24775dc: Added a migration that tunes PostgreSQL automatic vacuum thresholds on the `search`, `final_entities`, `relations`, and `refresh_state_references` tables, and fixes column statistics for `entity_id` in the `search` table. This prevents the query planner from falling back to sequential scans when table maintenance falls behind, keeping catalog queries fast on large installations.

## 3.8.0-next.0

### Minor Changes

- 8f20cc2: `/entities/by-query` now accepts a `totalItems` parameter (`'include'` or `'exclude'`, default `'include'`) that controls whether the response's `totalItems` count is computed. Pass `'exclude'` to skip the count entirely when the caller doesn't need it — useful for cursor-paginated user interfaces that only display the count cosmetically. The accepted values list is forward-compatible: future modes (e.g. approximate counts) can be added without breaking existing callers.

  The internal `QueryEntitiesInitialRequest.skipTotalItems` option has been replaced by `totalItems: 'include' | 'exclude'`. Note that `skipTotalItems` was never exposed as a REST API parameter, so this is only a TypeScript-level change affecting direct callers of `EntitiesCatalog.queryEntities`.

  Sort field keys are now lowercased before comparing against `search.key`, fixing silent mismatches for camelCase field names. The `NULLS LAST` ordering clause has been removed since NULL sort values are already excluded by the `WHERE` clause.

- dc7678c: Removed the immediate mode stitching strategy. All stitching now uses the deferred mode, which processes entities asynchronously via a worker queue. If your configuration includes `catalog.stitchingStrategy.mode: 'immediate'`, it will be ignored with a deprecation warning. The `pollingInterval` and `stitchTimeout` settings continue to work as before.

### Patch Changes

- 39c5fbb: Added extended multi-column statistics on `(key, value)` in the `search` table (PostgreSQL only). This tells the query planner about the correlation between the `key` and `value` columns, fixing severe row count estimation errors on compound filter queries. Without this, the planner could choose to materialize and sort thousands of rows instead of using the LIMIT short-circuit index scan — causing 10-40x slower catalog list views when multiple filters are active.
- 4829e89: Split the `queryEntities` list and count into separate queries instead of a multi-reference CTE. When the `filtered` CTE was referenced twice (once for the count, once for the data), PostgreSQL refused to inline it, forcing full materialization of the filtered set before applying `LIMIT`. By running the count as a standalone query, the list CTE is only referenced once, allowing the planner to short-circuit on `LIMIT` and return the first page in milliseconds instead of waiting for the full filtered set to materialize.

  The standalone count query also fixes a pre-existing bug where `totalItems` was inflated for entities with multi-valued sort fields (e.g. tags). The old CTE-based count counted search rows, so an entity with 3 tags would be counted 3 times. The new count uses `EXISTS` to count distinct entities, aligning `totalItems` with the number of entities actually reachable through cursor pagination.

- 774d698: Fixed a race condition in the stitch queue and entity processing claim logic where `SELECT FOR UPDATE SKIP LOCKED` row locks were released before the subsequent timestamp bump, allowing multiple workers to claim the same rows. Both the select and update now run inside a single transaction for MySQL and PostgreSQL.
- 0b8b677: Improved stitch queue semantics to prevent overlapping stitches for the same entity. New stitch requests that arrive while a stitch is in progress now only update the ticket (not the timestamp), so the in-progress worker is not interrupted. When the worker completes and detects a pending re-stitch, the queue entry becomes immediately eligible for pickup instead of waiting for the timeout period.
- Updated dependencies
  - @backstage/catalog-client@1.16.0-next.0
  - @backstage/integration@2.0.3-next.0
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/plugin-permission-node@0.11.1-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0
  - @backstage/plugin-events-node@0.4.23-next.0
  - @backstage/backend-openapi-utils@0.6.10-next.0

## 3.7.0

### Minor Changes

- c2de113: **BREAKING**: When paginating entities with an order field via `/entities/by-query`, entities that lack the order field are now excluded from both the result set and the `totalItems` count. Previously these entities appeared at the end of the sorted result via `NULLS LAST`, but cursor-based pagination could not actually reach them past the first page — the count over-reported the number of navigable entities. The new behavior aligns the count with what is actually returned.

  This also removes the `DISTINCT` deduplication from the sort-field CTE, which is a prerequisite for the planner to use the `(key, value, entity_id)` index in sort order and short-circuit on `LIMIT`. Installations with duplicate search rows should land the search-table deduplication migration before adopting this change.

### Patch Changes

- 3f5e7ec: Added `catalog.actions.experimentalCatalogLayersDescriptions.enabled` config option. When enabled, the `query-catalog-entities` action description references `get-catalog-model-description` for field information instead of embedding a static model description.
- ccbad9d: Improved the performance of the `catalog_entities_count` metric.

  The legacy Prometheus and OpenTelemetry observable gauges previously each ran their own copy of the per-kind count query against the `search` table on every metrics scrape. On large catalogs this could pile up faster than the queries completed, contending for buffers and stalling the database.

  The two callbacks now share a single query result with a short in-process TTL cache, and the underlying query reads from `final_entities` instead of `search`, avoiding the bitmap heap scans that dominated the previous form. The emitted labels and values are unchanged.

- 17a9550: Deprecated immediate mode stitching (`catalog.stitchingStrategy.mode: 'immediate'`). A warning is now logged on startup when immediate mode is configured. Immediate mode will be removed in the next Backstage release. Migrate to deferred mode (the default) by removing the `stitchingStrategy` configuration or setting `mode: 'deferred'`.
- add5d1a: Restructured the entity listing endpoint so that, when a sort field is specified, the search-by-key index drives the query rather than being side-joined onto `final_entities`. This lets PostgreSQL walk the `(key, value, entity_id)` index in already-sorted order and short-circuit on `LIMIT`, reducing typical broad-filter paginated list times from seconds to milliseconds. Entities that lack the sort field still appear at the end of sorted results (NULLS LAST semantics preserved), ordered by `entity_id`.
- 387ea7d: Simplified the entity facets aggregation from `COUNT(DISTINCT entity_id)` to `COUNT(*)`. The unique constraint on `(entity_id, key, value)` guarantees each entity appears at most once per search row group, making the `DISTINCT` unnecessary. This allows the database to use a simpler aggregation plan.
- 3f55b73: Improved the performance of the entity facets endpoint when filters are applied. The filtered entity set is now combined with the search table through an inner join rather than a `WHERE entity_id IN (subquery)`. Results are unchanged; on large catalogs the query planner is able to choose dramatically cheaper plans, with measured improvements ranging from roughly 1.2× on already-fast cases to 7× or more on high-cardinality facets.
- b33f845: Fixed several database migration `down` functions that were not properly reversible, causing the SQL report to show warnings:

  - `20241003170511_alter_target_in_locations.js`: both `up` and `down` now include `.notNullable()` when altering the `locations.target` column, preventing the `NOT NULL` constraint from being accidentally dropped when widening the column type from `varchar(255)` to `text`.
  - `20220116144621_remove_legacy.js`: the `down` function now properly recreates the three dropped legacy tables (`entities`, `entities_search`, `entities_relations`) with correct columns and indices.
  - `20210302150147_refresh_state.js`: the `down` function now drops dependent tables in the correct order (avoiding a FK constraint violation) and fixes a typo where the table was referred to as `references` instead of `refresh_state_references`.
  - `20201005122705_add_entity_full_name.js`: the `down` function now drops the `full_name` column from `entities` (not `entities_search`), and restores the `entities_unique_name` index with the correct column order `(kind, name, namespace)`.
  - `20200702153613_entities.js`: the `down` function now uses `table.integer('generation')` instead of `table.string('generation')`, restoring the correct column type.

- cde3643: Added missing description to the `type` parameter on the `unregister-entity` MCP action.
- cf195de: Fixed a performance regression in the `/entity-facets` endpoint when filters or permission conditions are applied, by routing the EXISTS-based filter through `final_entities` instead of correlating against the much larger `search` table.
- 07ec25d: Moved `generateStableHash` out of shared utility file to avoid pulling `node:crypto` into browser bundles
- bc32c13: Added a missing index on `relations.target_entity_ref`. Several query paths (orphan deletion, entity ancestry, eager pruning) join or filter on this column, but no index existed — causing full sequential scans of the relations table on every invocation. On a production catalog with ~3.5M relation rows, individual lookups were taking ~122ms (full table scan) instead of <1ms (index scan).
- 744fa1f: Removed duplicated entries that appeared in both `dependencies` and `devDependencies`.
- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- 7445f0f: Added a migration that removes duplicate rows from the `search` table, creates covering indices for improved query performance, and adds a `UNIQUE` constraint on `(entity_id, key, value)`.

  This is a long-running migration on large catalogs. On PostgreSQL with millions of search rows, the index creation may take 5-15 minutes per index. During this time, other pods running the previous version will continue to serve traffic normally — the index creation does not block reads or writes. However, if a Kubernetes liveness probe kills the pod before the index build completes, the build is lost and the next startup will start over. On large tables this can repeat indefinitely.

  **For large installations**, it is recommended to run the following SQL commands against your PostgreSQL database **before deploying** this version. Each index build takes a few minutes but does not block reads or writes. If these have already completed, the migration will detect the existing indices and skip all work — startup will be instant.

  ```sql
  -- Step 1: Remove duplicate search rows
  WITH cte AS (
    SELECT ctid, row_number() OVER (PARTITION BY entity_id, key, value) AS rn
    FROM search
  )
  DELETE FROM search USING cte WHERE search.ctid = cte.ctid AND cte.rn > 1;

  -- Step 2: Create new indices (run each separately)
  CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS
    search_entity_key_value_idx ON search (entity_id, key, value);
  CREATE INDEX CONCURRENTLY IF NOT EXISTS
    search_key_value_entity_idx ON search (key, value, entity_id);
  CREATE INDEX CONCURRENTLY IF NOT EXISTS
    search_facets_covering_idx ON search (key, original_value, entity_id)
    WHERE original_value IS NOT NULL;

  -- Step 3: Drop old indices that are no longer needed
  DROP INDEX CONCURRENTLY IF EXISTS search_key_value_idx;
  DROP INDEX CONCURRENTLY IF EXISTS search_key_original_value_idx;
  ```

  Also fixed `buildEntitySearch` to remove duplicate output for entities with duplicate array values, and added `ON CONFLICT DO UPDATE` to `syncSearchRows` so that concurrent stitching races are handled gracefully.

- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/filter-predicates@0.1.3
  - @backstage/integration@2.0.2
  - @backstage/plugin-permission-node@0.11.0
  - @backstage/plugin-permission-common@0.9.9
  - @backstage/backend-openapi-utils@0.6.9
  - @backstage/catalog-client@1.15.1
  - @backstage/config@1.3.8
  - @backstage/plugin-catalog-common@1.1.10
  - @backstage/plugin-events-node@0.4.22

## 3.7.0-next.2

### Minor Changes

- c2de113: **BREAKING**: When paginating entities with an order field via `/entities/by-query`, entities that lack the order field are now excluded from both the result set and the `totalItems` count. Previously these entities appeared at the end of the sorted result via `NULLS LAST`, but cursor-based pagination could not actually reach them past the first page — the count over-reported the number of navigable entities. The new behavior aligns the count with what is actually returned.

  This also removes the `DISTINCT` deduplication from the sort-field CTE, which is a prerequisite for the planner to use the `(key, value, entity_id)` index in sort order and short-circuit on `LIMIT`. Installations with duplicate search rows should land the search-table deduplication migration before adopting this change.

### Patch Changes

- ccbad9d: Improved the performance of the `catalog_entities_count` metric.

  The legacy Prometheus and OpenTelemetry observable gauges previously each ran their own copy of the per-kind count query against the `search` table on every metrics scrape. On large catalogs this could pile up faster than the queries completed, contending for buffers and stalling the database.

  The two callbacks now share a single query result with a short in-process TTL cache, and the underlying query reads from `final_entities` instead of `search`, avoiding the bitmap heap scans that dominated the previous form. The emitted labels and values are unchanged.

- add5d1a: Restructured the entity listing endpoint so that, when a sort field is specified, the search-by-key index drives the query rather than being side-joined onto `final_entities`. This lets PostgreSQL walk the `(key, value, entity_id)` index in already-sorted order and short-circuit on `LIMIT`, reducing typical broad-filter paginated list times from seconds to milliseconds. Entities that lack the sort field still appear at the end of sorted results (NULLS LAST semantics preserved), ordered by `entity_id`.
- 387ea7d: Simplified the entity facets aggregation from `COUNT(DISTINCT entity_id)` to `COUNT(*)`. The unique constraint on `(entity_id, key, value)` guarantees each entity appears at most once per search row group, making the `DISTINCT` unnecessary. This allows the database to use a simpler aggregation plan.
- 3f55b73: Improved the performance of the entity facets endpoint when filters are applied. The filtered entity set is now combined with the search table through an inner join rather than a `WHERE entity_id IN (subquery)`. Results are unchanged; on large catalogs the query planner is able to choose dramatically cheaper plans, with measured improvements ranging from roughly 1.2× on already-fast cases to 7× or more on high-cardinality facets.
- cde3643: Added missing description to the `type` parameter on the `unregister-entity` MCP action.
- 7445f0f: Added a migration that removes duplicate rows from the `search` table, creates covering indices for improved query performance, and adds a `UNIQUE` constraint on `(entity_id, key, value)`.

  This is a long-running migration on large catalogs. On PostgreSQL with millions of search rows, the index creation may take 5-15 minutes per index. During this time, other pods running the previous version will continue to serve traffic normally — the index creation does not block reads or writes. However, if a Kubernetes liveness probe kills the pod before the index build completes, the build is lost and the next startup will start over. On large tables this can repeat indefinitely.

  **For large installations**, it is recommended to run the following SQL commands against your PostgreSQL database **before deploying** this version. Each index build takes a few minutes but does not block reads or writes. If these have already completed, the migration will detect the existing indices and skip all work — startup will be instant.

  ```sql
  -- Step 1: Remove duplicate search rows
  WITH cte AS (
    SELECT ctid, row_number() OVER (PARTITION BY entity_id, key, value) AS rn
    FROM search
  )
  DELETE FROM search USING cte WHERE search.ctid = cte.ctid AND cte.rn > 1;

  -- Step 2: Create new indices (run each separately)
  CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS
    search_entity_key_value_idx ON search (entity_id, key, value);
  CREATE INDEX CONCURRENTLY IF NOT EXISTS
    search_key_value_entity_idx ON search (key, value, entity_id);
  CREATE INDEX CONCURRENTLY IF NOT EXISTS
    search_facets_covering_idx ON search (key, original_value, entity_id)
    WHERE original_value IS NOT NULL;

  -- Step 3: Drop old indices that are no longer needed
  DROP INDEX CONCURRENTLY IF EXISTS search_key_value_idx;
  DROP INDEX CONCURRENTLY IF EXISTS search_key_original_value_idx;
  ```

  Also fixed `buildEntitySearch` to remove duplicate output for entities with duplicate array values, and added `ON CONFLICT DO UPDATE` to `syncSearchRows` so that concurrent stitching races are handled gracefully.

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.1-next.1

## 3.6.2-next.1

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.1
  - @backstage/plugin-catalog-node@2.2.1-next.1
  - @backstage/plugin-permission-common@0.9.9-next.1

## 3.6.1-next.0

### Patch Changes

- b33f845: Fixed several database migration `down` functions that were not properly reversible, causing the SQL report to show warnings:

  - `20241003170511_alter_target_in_locations.js`: both `up` and `down` now include `.notNullable()` when altering the `locations.target` column, preventing the `NOT NULL` constraint from being accidentally dropped when widening the column type from `varchar(255)` to `text`.
  - `20220116144621_remove_legacy.js`: the `down` function now properly recreates the three dropped legacy tables (`entities`, `entities_search`, `entities_relations`) with correct columns and indices.
  - `20210302150147_refresh_state.js`: the `down` function now drops dependent tables in the correct order (avoiding a FK constraint violation) and fixes a typo where the table was referred to as `references` instead of `refresh_state_references`.
  - `20201005122705_add_entity_full_name.js`: the `down` function now drops the `full_name` column from `entities` (not `entities_search`), and restores the `entities_unique_name` index with the correct column order `(kind, name, namespace)`.
  - `20200702153613_entities.js`: the `down` function now uses `table.integer('generation')` instead of `table.string('generation')`, restoring the correct column type.

- cf195de: Fixed a performance regression in the `/entity-facets` endpoint when filters or permission conditions are applied, by routing the EXISTS-based filter through `final_entities` instead of correlating against the much larger `search` table.
- 744fa1f: Removed duplicated entries that appeared in both `dependencies` and `devDependencies`.
- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/integration@2.0.2-next.0
  - @backstage/backend-openapi-utils@0.6.9-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-client@1.15.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/filter-predicates@0.1.3-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/plugin-events-node@0.4.22-next.0
  - @backstage/plugin-permission-common@0.9.9-next.0
  - @backstage/plugin-permission-node@0.10.13-next.0
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.10-next.0

## 3.6.0

### Minor Changes

- d16311f: Added a `location_entity_ref` column to the `locations` database table that stores the full entity ref of the corresponding `kind: Location` catalog entity for each registered location row. The value is pre-computed and persisted so that it no longer needs to be recomputed from the location's type and target on every read.
- e5fcfcb: Added `ModelProcessor` that validates catalog entities against the compiled catalog model schemas, and integrated it into the `CatalogBuilder` and `CatalogPlugin`. This processor is only activated if you explicitly add catalog model sources to your backend; there is no functional change for regular catalog usage.
- c384fff: Location responses now include an `entityRef` field with the stable entity reference for each location. The `entityRef` field is also filterable via `POST /locations/by-query`. Added `PUT /locations/:id` endpoint for updating the type and target of an existing location.

### Patch Changes

- 2e5c5f8: Bumped `glob` dependency from v7/v8/v11 to v13 to address security vulnerabilities in older versions. Bumped `rollup` from v4.27 to v4.59+ to fix a high severity path traversal vulnerability (GHSA-mw96-cpmx-2vgc).
- 7e63730: Removed deprecated `PermissionAuthorizer` support and the `createPermissionIntegrationRouter` fallback path from `CatalogBuilder`. The `permissionsRegistry` service is now required, and `permissions` is always a `PermissionsService`.
- 056e18e: Removed the internal `addPermissions` and `addPermissionRules` methods from `CatalogBuilder`, and removed the `catalogPermissionExtensionPoint` wiring from `CatalogPlugin`. Custom permission rules and permissions should be registered via `coreServices.permissionsRegistry` directly.
- 6884814: Improved catalog entity filter query performance by switching from `IN (subquery)` to `EXISTS (correlated subquery)` patterns. This enables PostgreSQL semi-join optimizations and fixes `NOT IN` NULL-semantics pitfalls by using `NOT EXISTS` instead.
- 9da73bf: Reduced search table write churn during stitching by syncing only changed rows instead of doing a full delete and re-insert. On Postgres this uses a single writable CTE, on MySQL a temporary table merge with deadlock retry, and on SQLite the previous bulk replace.
- 482ceed: Migrated from `assertError` to `toError` for error handling.
- 375b546: Fixed a deadlock in the catalog processing loop that occurred when running multiple replicas. The `getProcessableEntities` method used `SELECT ... FOR UPDATE SKIP LOCKED` to prevent concurrent processors from claiming the same rows, but the call was not wrapped in a transaction, so the row locks were released before the subsequent `UPDATE` executed. This allowed multiple replicas to select and update overlapping rows, causing PostgreSQL deadlock errors (code 40P01).
- 79453c0: Updated dependency `wait-for-expect` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/filter-predicates@0.1.2
  - @backstage/catalog-client@1.15.0
  - @backstage/backend-openapi-utils@0.6.8
  - @backstage/integration@2.0.1
  - @backstage/plugin-permission-node@0.10.12
  - @backstage/config@1.3.7
  - @backstage/plugin-catalog-common@1.1.9
  - @backstage/plugin-events-node@0.4.21
  - @backstage/plugin-permission-common@0.9.8

## 3.6.0-next.2

### Minor Changes

- d16311f: Added a `location_entity_ref` column to the `locations` database table that stores the full entity ref of the corresponding `kind: Location` catalog entity for each registered location row. The value is pre-computed and persisted so that it no longer needs to be recomputed from the location's type and target on every read.

### Patch Changes

- 7e63730: Removed deprecated `PermissionAuthorizer` support and the `createPermissionIntegrationRouter` fallback path from `CatalogBuilder`. The `permissionsRegistry` service is now required, and `permissions` is always a `PermissionsService`.
- 056e18e: Removed the internal `addPermissions` and `addPermissionRules` methods from `CatalogBuilder`, and removed the `catalogPermissionExtensionPoint` wiring from `CatalogPlugin`. Custom permission rules and permissions should be registered via `coreServices.permissionsRegistry` directly.
- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/integration@2.0.1-next.0
  - @backstage/backend-openapi-utils@0.6.8-next.2
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-client@1.14.1-next.0
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0
  - @backstage/filter-predicates@0.1.2-next.0
  - @backstage/plugin-events-node@0.4.21-next.2
  - @backstage/plugin-permission-common@0.9.8-next.0
  - @backstage/plugin-permission-node@0.10.12-next.2
  - @backstage/plugin-catalog-common@1.1.9-next.0

## 3.5.1-next.1

### Patch Changes

- 2e5c5f8: Bumped `glob` dependency from v7/v8/v11 to v13 to address security vulnerabilities in older versions. Bumped `rollup` from v4.27 to v4.59+ to fix a high severity path traversal vulnerability (GHSA-mw96-cpmx-2vgc).
- 6884814: Improved catalog entity filter query performance by switching from `IN (subquery)` to `EXISTS (correlated subquery)` patterns. This enables PostgreSQL semi-join optimizations and fixes `NOT IN` NULL-semantics pitfalls by using `NOT EXISTS` instead.
- 9da73bf: Reduced search table write churn during stitching by syncing only changed rows instead of doing a full delete and re-insert. On Postgres this uses a single writable CTE, on MySQL a temporary table merge with deadlock retry, and on SQLite the previous bulk replace.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/backend-openapi-utils@0.6.8-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1
  - @backstage/plugin-events-node@0.4.21-next.1
  - @backstage/plugin-permission-node@0.10.12-next.1

## 3.5.1-next.0

### Patch Changes

- 375b546: Fixed a deadlock in the catalog processing loop that occurred when running multiple replicas. The `getProcessableEntities` method used `SELECT ... FOR UPDATE SKIP LOCKED` to prevent concurrent processors from claiming the same rows, but the call was not wrapped in a transaction, so the row locks were released before the subsequent `UPDATE` executed. This allowed multiple replicas to select and update overlapping rows, causing PostgreSQL deadlock errors (code 40P01).
- 79453c0: Updated dependency `wait-for-expect` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-permission-node@0.10.12-next.0
  - @backstage/backend-openapi-utils@0.6.8-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/plugin-events-node@0.4.21-next.0
  - @backstage/catalog-client@1.14.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/filter-predicates@0.1.1
  - @backstage/integration@2.0.0
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-permission-common@0.9.7

## 3.5.0

### Minor Changes

- a6b2819: Added `query-catalog-entities` action to the catalog backend actions registry. Supports predicate-based filtering with `$all`, `$any`, `$not`, `$exists`, `$in`, `$contains`, and `$hasPrefix` operators.
- 972f686: Added support for predicate-based filtering on the `/entities/by-refs` endpoint via the `query` field in the request body. Supports `$all`, `$any`, `$not`, `$exists`, `$in`, `$contains`, and `$hasPrefix` operators.
- 5d95e8e: Add an `onConflict` option to location creation that can refresh an existing location instead of throwing a conflict error.
- 56c908e: Added support for predicate-based filtering on the `/entity-facets` endpoint via a new `POST` method. Supports `$all`, `$any`, `$not`, `$exists`, `$in`, `$contains`, and `$hasPrefix` operators.
- 0fbcf23: Migrated OpenAPI schemas to 3.1.
- bf71677: Added opentelemetry metrics for SCM events:

  - `catalog.events.scm.messages` with attribute `eventType`: Counter for the number of SCM events actually received by the catalog backend. The `eventType` is currently either `location` or `repository`.

- 51e23eb: Added predicate-based entity filtering via POST /entities/by-query endpoint.

  Supports `$all`, `$any`, `$not`, `$exists`, `$in`, `$hasPrefix`, and (partially) `$contains` operators for expressive entity queries. Integrated into the existing `queryEntities` flow with full cursor-based pagination, permission enforcement, and `totalItems` support.

  The catalog client's `queryEntities()` method automatically routes to the POST endpoint when a `query` predicate is provided.

### Patch Changes

- a91bd1b: Improved catalog entity deletion so parent invalidation and deferred relation restitch scheduling are coordinated more safely.
- 6738cf0: build(deps): bump `minimatch` from 9.0.5 to 10.2.1
- 7416e8b: Moved stitch queue concerns out of `refresh_state` and `final_entities` into a dedicated `stitch_queue` table with `entity_ref` as the primary key. The `stitch_ticket` is used for optimistic concurrency control. When a stitch completes successfully and the ticket hasn't changed, the corresponding row is deleted from the queue. The migration handles existing data and is fully reversible.
- fbf382f: Minor internal optimisation
- 1ee5b28: Migrates existing catalog metrics to use the alpha MetricsService. This release is a 1:1 migration with no breaking changes.
- 72747b4: Deprecated two processors as they have been moved to the Community Plugins repo with their own backend modules:

  - `AnnotateScmSlugEntityProcessor`: Use `@backstage-community/plugin-catalog-backend-module-annotate-scm-slug` instead
  - `CodeOwnersProcessor`: Use `@backstage-community/plugin-catalog-backend-module-codeowners` instead

- 3644b72: Make the `search` foreign key catalog migration non-blocking on large tables by using batch deletes and PostgreSQL `NOT VALID`/`VALIDATE` to reduce lock duration
- a49a40d: Updated dependency `zod` to `^3.25.76 || ^4.0.0` & migrated to `/v3` or `/v4` imports.
- 3181973: Changed the `search` table foreign key to point to `final_entities` instead of `refresh_state`
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/catalog-client@1.14.0
  - @backstage/integration@2.0.0
  - @backstage/plugin-catalog-node@2.1.0
  - @backstage/filter-predicates@0.1.1
  - @backstage/plugin-permission-common@0.9.7
  - @backstage/plugin-permission-node@0.10.11
  - @backstage/catalog-model@1.7.7
  - @backstage/backend-openapi-utils@0.6.7
  - @backstage/plugin-events-node@0.4.20

## 3.5.0-next.2

### Minor Changes

- 5d95e8e: Add an `onConflict` option to location creation that can refresh an existing location instead of throwing a conflict error.

### Patch Changes

- 7416e8b: Moved stitch queue concerns out of `refresh_state` and `final_entities` into a dedicated `stitch_queue` table with `entity_ref` as the primary key. The `stitch_ticket` is used for optimistic concurrency control. When a stitch completes successfully and the ticket hasn't changed, the corresponding row is deleted from the queue. The migration handles existing data and is fully reversible.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/catalog-client@1.14.0-next.2
  - @backstage/integration@2.0.0-next.2
  - @backstage/backend-openapi-utils@0.6.7-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.2
  - @backstage/plugin-events-node@0.4.20-next.1
  - @backstage/plugin-permission-node@0.10.11-next.1

## 3.5.0-next.1

### Minor Changes

- a6b2819: Added `query-catalog-entities` action to the catalog backend actions registry. Supports predicate-based filtering with `$all`, `$any`, `$not`, `$exists`, `$in`, `$contains`, and `$hasPrefix` operators.
- 972f686: Added support for predicate-based filtering on the `/entities/by-refs` endpoint via the `query` field in the request body. Supports `$all`, `$any`, `$not`, `$exists`, `$in`, `$contains`, and `$hasPrefix` operators.
- 56c908e: Added support for predicate-based filtering on the `/entity-facets` endpoint via a new `POST` method. Supports `$all`, `$any`, `$not`, `$exists`, `$in`, `$contains`, and `$hasPrefix` operators.
- 0fbcf23: Migrated OpenAPI schemas to 3.1.
- 51e23eb: Added predicate-based entity filtering via POST /entities/by-query endpoint.

  Supports `$all`, `$any`, `$not`, `$exists`, `$in`, `$hasPrefix`, and (partially) `$contains` operators for expressive entity queries. Integrated into the existing `queryEntities` flow with full cursor-based pagination, permission enforcement, and `totalItems` support.

  The catalog client's `queryEntities()` method automatically routes to the POST endpoint when a `query` predicate is provided.

### Patch Changes

- 72747b4: Deprecated two processors as they have been moved to the Community Plugins repo with their own backend modules:

  - `AnnotateScmSlugEntityProcessor`: Use `@backstage-community/plugin-catalog-backend-module-annotate-scm-slug` instead
  - `CodeOwnersProcessor`: Use `@backstage-community/plugin-catalog-backend-module-codeowners` instead

- Updated dependencies
  - @backstage/catalog-client@1.14.0-next.1
  - @backstage/integration@2.0.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.1
  - @backstage/backend-openapi-utils@0.6.7-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/filter-predicates@0.1.0
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-events-node@0.4.20-next.0
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-permission-node@0.10.11-next.0

## 3.5.0-next.0

### Minor Changes

- bf71677: Added opentelemetry metrics for SCM events:

  - `catalog.events.scm.messages` with attribute `eventType`: Counter for the number of SCM events actually received by the catalog backend. The `eventType` is currently either `location` or `repository`.

### Patch Changes

- 6738cf0: build(deps): bump `minimatch` from 9.0.5 to 10.2.1
- fbf382f: Minor internal optimisation
- 1ee5b28: Migrates existing catalog metrics to use the alpha MetricsService. This release is a 1:1 migration with no breaking changes.
- 3181973: Changed the `search` table foreign key to point to `final_entities` instead of `refresh_state`
- Updated dependencies
  - @backstage/integration@1.21.0-next.0
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-client@1.13.1-next.0
  - @backstage/backend-openapi-utils@0.6.7-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/filter-predicates@0.1.0
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-events-node@0.4.20-next.0
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-permission-node@0.10.11-next.0

## 3.4.0

### Minor Changes

- f1d29b4: Failures to connect catalog providers are now attributed to the module that provided the failing provider. This means that such failures will be reported as module startup failures rather than a failure to start the catalog plugin, and will therefore respect `onPluginModuleBootFailure` configuration instead.
- 34cc520: Implemented handling of events from the newly introduced alpha
  `catalogScmEventsServiceRef` service, in the builtin entity providers. This
  allows entities to get refreshed, and locations updated or removed, as a
  response to incoming events. In its first iteration, only the GitHub module
  implements such event handling however.

  This is not yet enabled by default, but this fact may change in a future
  release. To try it out, ensure that you have the latest catalog GitHub module
  installed, and set the following in your app-config:

  ```yaml
  catalog:
    scmEvents: true
  ```

  Or if you want to pick and choose from the various features:

  ```yaml
  catalog:
    scmEvents:
      # refresh (reprocess) upon events?
      refresh: true
      # automatically unregister locations based on events? (files deleted, repos archived, etc)
      unregister: true
      # automatically move locations based on events? (repo transferred, file renamed, etc)
      move: true
  ```

- b4e8249: Implemented the `POST /locations/by-query` endpoint which allows paginated, filtered location queries

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- 7455dae: Use node prefix on native imports
- 5e3ef57: Added `peerModules` metadata declaring recommended modules for cross-plugin integrations.
- 08a5813: Fixed O(n²) performance bottleneck in `buildEntitySearch` `traverse()` by replacing `Array.some()` linear scan with a `Set` for O(1) duplicate path key detection.
- 1e669cc: Migrate audit events reference docs to http://backstage.io/docs.
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/integration@1.20.0
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/backend-openapi-utils@0.6.6
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/catalog-client@1.13.0
  - @backstage/filter-predicates@0.1.0
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-permission-node@0.10.10
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-events-node@0.4.19

## 3.4.0-next.2

### Patch Changes

- 08a5813: Fixed O(n²) performance bottleneck in `buildEntitySearch` `traverse()` by replacing `Array.some()` linear scan with a `Set` for O(1) duplicate path key detection.
- Updated dependencies
  - @backstage/integration@1.20.0-next.2
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/catalog-client@1.12.2-next.0
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-events-node@0.4.19-next.0
  - @backstage/plugin-permission-node@0.10.10-next.0

## 3.4.0-next.1

### Patch Changes

- 5e3ef57: Added `peerModules` metadata declaring recommended modules for cross-plugin integrations.
- Updated dependencies
  - @backstage/integration@1.20.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1

## 3.4.0-next.0

### Minor Changes

- f1d29b4: Failures to connect catalog providers are now attributed to the module that provided the failing provider. This means that such failures will be reported as module startup failures rather than a failure to start the catalog plugin, and will therefore respect `onPluginModuleBootFailure` configuration instead.

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- 7455dae: Use node prefix on native imports
- 1e669cc: Migrate audit events reference docs to http://backstage.io/docs.
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-openapi-utils@0.6.6-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/integration@1.19.3-next.0
  - @backstage/plugin-permission-common@0.9.5-next.0
  - @backstage/plugin-permission-node@0.10.9-next.0
  - @backstage/plugin-events-node@0.4.19-next.0
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8-next.0

## 3.3.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/integration@1.19.2
  - @backstage/backend-openapi-utils@0.6.5
  - @backstage/plugin-permission-common@0.9.4
  - @backstage/plugin-permission-node@0.10.8

## 3.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.19.2-next.0

## 3.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.5-next.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration@1.19.0
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-catalog-node@1.20.1
  - @backstage/plugin-events-node@0.4.18
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-permission-node@0.10.7

## 3.3.0

### Minor Changes

- dce1824: Added `ActionsRegistry` actions for `register-entity` and `unregister-entity`

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- 8101ec1: Fixed default refresh service to go through the whole ancestry of the entity.
- Updated dependencies
  - @backstage/integration@1.19.0
  - @backstage/backend-openapi-utils@0.6.4
  - @backstage/plugin-events-node@0.4.18
  - @backstage/plugin-permission-node@0.10.7
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1

## 3.2.1-next.1

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.4-next.1
  - @backstage/plugin-events-node@0.4.18-next.1
  - @backstage/plugin-permission-node@0.10.7-next.1
  - @backstage/integration@1.18.3-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-catalog-node@1.20.1-next.1
  - @backstage/plugin-permission-common@0.9.3

## 3.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/integration@1.18.3-next.0
  - @backstage/plugin-permission-node@0.10.7-next.0
  - @backstage/backend-openapi-utils@0.6.4-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/plugin-events-node@0.4.18-next.0
  - @backstage/config@1.3.6
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-permission-common@0.9.3

## 3.2.0

### Minor Changes

- 2d229b2: Enable YAML merge keys in yamlPlaceholderResolver
- 9d3ec06: Make YAML merge (<<:) support configurable in the Backstage Catalog instead of always being enabled
- 8c26af4: Enable YAML merge keys in yamlPlaceholderResolver

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/backend-openapi-utils@0.6.3
  - @backstage/catalog-client@1.12.1
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-permission-node@0.10.6

## 3.2.0-next.1

### Minor Changes

- 2d229b2: Enable YAML merge keys in yamlPlaceholderResolver
- 9d3ec06: Make YAML merge (<<:) support configurable in the Backstage Catalog instead of always being enabled
- 8c26af4: Enable YAML merge keys in yamlPlaceholderResolver

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-permission-common@0.9.3-next.1
  - @backstage/backend-openapi-utils@0.6.3-next.1
  - @backstage/plugin-events-node@0.4.17-next.1
  - @backstage/plugin-permission-node@0.10.6-next.1

## 3.1.3-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-events-node@0.4.17-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/integration@1.18.2-next.0
  - @backstage/plugin-permission-node@0.10.6-next.0
  - @backstage/backend-openapi-utils@0.6.3-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/catalog-client@1.12.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.7-next.0
  - @backstage/plugin-catalog-node@1.19.2-next.0
  - @backstage/plugin-permission-common@0.9.3-next.0

## 3.1.2

### Patch Changes

- 9890488: Internal refactor to remove remnants of the old backend system
- 6493c98: Log before provider-orphaning eviction happens
- 2aaf01a: Fix for duplicate search results in entity-facets API call
- e489661: Moved catalog processor and provider disabling and priorities under own config objects.

  This is due to issue with some existing providers, such as GitHub, using array syntax for the provider configuration.

  The new config format is not backwards compatible, so users will need to update their config files. The new format
  is as follows:

  ```yaml
  catalog:
    providerOptions:
      providerA:
        disabled: false
      providerB:
        disabled: true
    processorOptions:
      processorA:
        disabled: false
        priority: 10
      processorB:
        disabled: true
  ```

- 77516c5: Added new `catalog:validate-entity` action to actions registry.

  This action can be used to validate entities against the software catalog.
  This is useful for validating `catalog-info.yaml` file changes locally using the
  Backstage MCP server.

- Updated dependencies
  - @backstage/integration@1.18.1
  - @backstage/config@1.3.5
  - @backstage/backend-openapi-utils@0.6.2
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-common@1.1.6
  - @backstage/plugin-catalog-node@1.19.1
  - @backstage/plugin-events-node@0.4.16
  - @backstage/plugin-permission-common@0.9.2
  - @backstage/plugin-permission-node@0.10.5

## 3.1.2-next.2

### Patch Changes

- 6493c98: Log before provider-orphaning eviction happens
- 77516c5: Added new `catalog:validate-entity` action to actions registry.

  This action can be used to validate entities against the software catalog.
  This is useful for validating `catalog-info.yaml` file changes locally using the
  Backstage MCP server.

## 3.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/integration@1.18.1-next.1
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-permission-common@0.9.2-next.0
  - @backstage/plugin-permission-node@0.10.5-next.0
  - @backstage/backend-openapi-utils@0.6.2-next.0
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-events-node@0.4.16-next.0
  - @backstage/plugin-catalog-common@1.1.6-next.0
  - @backstage/catalog-client@1.12.0

## 3.1.1-next.0

### Patch Changes

- 9890488: Internal refactor to remove remnants of the old backend system
- 2aaf01a: Fix for duplicate search results in entity-facets API call
- e489661: Moved catalog processor and provider disabling and priorities under own config objects.

  This is due to issue with some existing providers, such as GitHub, using array syntax for the provider configuration.

  The new config format is not backwards compatible, so users will need to update their config files. The new format
  is as follows:

  ```yaml
  catalog:
    providerOptions:
      providerA:
        disabled: false
      providerB:
        disabled: true
    processorOptions:
      processorA:
        disabled: false
        priority: 10
      processorB:
        disabled: true
  ```

- Updated dependencies
  - @backstage/integration@1.18.1-next.0
  - @backstage/plugin-permission-node@0.10.4
  - @backstage/backend-openapi-utils@0.6.1
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/catalog-client@1.12.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-events-node@0.4.15
  - @backstage/plugin-permission-common@0.9.1

## 3.1.0

### Minor Changes

- 9b40a55: Add support for specifying an entity `spec.type` in `catalog.rules` and `catalog.locations.rules` within the catalog configuration.

  For example, this enables allowing all `Template` entities with the type `website`:

  ```diff
    catalog:
      rules:
        - allow:
            - Component
            - API
            - Resource
            - System
            - Domain
            - Location
  +     - allow:
  +         - kind: Template
  +           spec.type: website
          locations:
            - type: url
              pattern: https://github.com/org/*\/blob/master/*.yaml
  ```

### Patch Changes

- 37b4eaf: The 'get-catalog-entity' action now throws a ConflictError instead of generic Error if multiple entities are found, so MCP call doesn't fail with 500.
- 2bbd24f: Order catalog processors by priority.

  This change enables the ordering of catalog processors by their priority,
  allowing for more control over the catalog processing sequence.
  The default priority is set to 20, and processors can be assigned a custom
  priority to influence their execution order. Lower number indicates higher priority.
  The priority can be set by implementing the `getPriority` method in the processor class
  or by adding a `catalog.processors.<processorName>.priority` configuration
  in the `app-config.yaml` file. The configuration takes precedence over the method.

- e934a27: Updating `catalog:get-catalog-entity` action to be `readOnly` and non destructive
- 0efcc97: Updated generated schemas
- 2204f5b: Prevent deadlock in catalog deferred stitching
- 58874c4: Add support to disable catalog providers and processors via configuration
- a4c82ad: Only run provider orphan cleanup if the engine is started in the first place
- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/catalog-client@1.12.0
  - @backstage/plugin-events-node@0.4.15
  - @backstage/integration@1.18.0
  - @backstage/types@1.2.2
  - @backstage/backend-openapi-utils@0.6.1
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/plugin-permission-node@0.10.4

## 3.0.2-next.1

### Patch Changes

- 2204f5b: Prevent deadlock in catalog deferred stitching
- Updated dependencies
  - @backstage/catalog-client@1.12.0-next.0
  - @backstage/plugin-catalog-node@1.19.0-next.1
  - @backstage/integration@1.18.0-next.0

## 3.0.2-next.0

### Patch Changes

- 37b4eaf: The 'get-catalog-entity' action now throws a ConflictError instead of generic Error if multiple entities are found, so MCP call doesn't fail with 500.
- a4c82ad: Only run provider orphan cleanup if the engine is started in the first place
- Updated dependencies
  - @backstage/integration@1.18.0-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-permission-node@0.10.4-next.0
  - @backstage/backend-openapi-utils@0.6.1-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0
  - @backstage/plugin-events-node@0.4.15-next.0

## 3.0.1

### Patch Changes

- 1752be6: Attempt to circumvent event listener memory leak in compression middleware
- 9658703: Sort built-in relation fields for more stable entity hash in the processing engine
- 9dd213c: Make the processing hash calculation not care about the order of the processors.

  This change does not affect the behavior of the catalog, but it will make the processing
  hash calculation more robust against changes in the order of processors. This should lead to
  more stable processing hashes, which in turn should lead to fewer unnecessary reprocessing
  of entities.

  After deploying this fix, you may see a period of increased processing and stitching, but
  this should stabilize over time as the processing hashes become more consistent.

- fa6fa60: Fixed getLocationByEntity to use `original_value` instead of `value` when querying search table
- 3a7dad9: Updated `better-sqlite3` to v12
- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.0
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## 3.0.1-next.1

### Patch Changes

- 1752be6: Attempt to circumvent event listener memory leak in compression middleware
- 9dd213c: Make the processing hash calculation not care about the order of the processors.

  This change does not affect the behavior of the catalog, but it will make the processing
  hash calculation more robust against changes in the order of processors. This should lead to
  more stable processing hashes, which in turn should lead to fewer unnecessary reprocessing
  of entities.

  After deploying this fix, you may see a period of increased processing and stitching, but
  this should stabilize over time as the processing hashes become more consistent.

- fa6fa60: Fixed getLocationByEntity to use `original_value` instead of `value` when querying search table
- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.0-next.1

## 3.0.1-next.0

### Patch Changes

- 3a7dad9: Updated `better-sqlite3` to v12
- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.0-next.0
  - @backstage/catalog-client@1.11.0-next.0
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/plugin-permission-node@0.10.3-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/plugin-events-node@0.4.14-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.1
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-permission-common@0.9.1

## 3.0.0

### Major Changes

- 5127ebe: **BREAKING**: The default `catalog.stitchingStrategy` has been switched to `{ mode: 'deferred' }`.
- d675d96: **BREAKING**: The relations compatibility mode is no longer enabled by default, and the `disableRelationsCompatiblity` flag has been removed. To re-enable relations compatibility, the new `enableRelationsCompatibility` flag can be used instead.
- 2339363: **BREAKING:** The experimental `catalog.useUrlReadersSearch` configuration flag (introduced in v1.36) has been removed.

  The `UrlReaderProcessor` now always uses the `search` method of `UrlReaders`. Built-in `UrlReaderService` implementations have been updated accordingly.
  If you use custom `UrlReaderService` implementations, you need to adapt their `search` method to correctly handle both specific URLs and potential
  search patterns (see changes on built-in readers [in the original PR](https://github.com/backstage/backstage/pull/28379/files#diff-68b0452f173ee54bdd40f7b5e047a9cb8bb59200425622c212c217b76dac1d1b)).

  Previous behavior was to call the `search` method only if the parsed Git URL's filename contained a wildcard and use `readUrl` otherwise. Each `UrlReaderService` must implement this logic in the `search` method instead.

  This allows each `UrlReaderService` implementation to check whether it's a search URL (that contains a wildcard pattern) or not using logic that is specific to each provider.

- 687bfc8: **BREAKING**: The default `catalog.orphanStrategy` has been switched to `'delete'`.
- 5de7a9d: **BREAKING**: The default `catalog.orphanProviderStrategy` has been switched to `'delete'`.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/plugin-permission-common@0.9.1
  - @backstage/plugin-permission-node@0.10.2
  - @backstage/catalog-model@1.7.5
  - @backstage/catalog-client@1.10.2
  - @backstage/integration@1.17.1
  - @backstage/backend-openapi-utils@0.5.5
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.17.2
  - @backstage/plugin-events-node@0.4.13

## 3.0.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/plugin-permission-common@0.9.1-next.0
  - @backstage/plugin-permission-node@0.10.2-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/catalog-client@1.10.2-next.0
  - @backstage/integration@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-catalog-common@1.1.5-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0
  - @backstage/backend-openapi-utils@0.5.5-next.0
  - @backstage/plugin-events-node@0.4.13-next.0

## 3.0.0-next.0

### Major Changes

- 2339363: **BREAKING:** The experimental `catalog.useUrlReadersSearch` configuration flag (introduced in v1.36) has been removed.

  The `UrlReaderProcessor` now always uses the `search` method of `UrlReaders`. Built-in `UrlReaderService` implementations have been updated accordingly.
  If you use custom `UrlReaderService` implementations, you need to adapt their `search` method to correctly handle both specific URLs and potential
  search patterns (see changes on built-in readers [in the original PR](https://github.com/backstage/backstage/pull/28379/files#diff-68b0452f173ee54bdd40f7b5e047a9cb8bb59200425622c212c217b76dac1d1b)).

  Previous behavior was to call the `search` method only if the parsed Git URL's filename contained a wildcard and use `readUrl` otherwise. Each `UrlReaderService` must implement this logic in the `search` method instead.

  This allows each `UrlReaderService` implementation to check whether it's a search URL (that contains a wildcard pattern) or not using logic that is specific to each provider.

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.1-next.0
  - @backstage/plugin-permission-node@0.10.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/plugin-events-node@0.4.12
  - @backstage/backend-openapi-utils@0.5.4
  - @backstage/catalog-client@1.10.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-permission-common@0.9.0

## 2.1.0

### Minor Changes

- 2e7adf0: Implement the action `get-catalog-entity` with the `ActionsRegistry`

### Patch Changes

- 2cac8b0: You can now specify an optional value when applying the `HAS_LABEL` permission rule, similar to the `HAS_ANNOTATION` permission rule.
- c83cd8b: Fixed some circular or otherwise unclear imports
- 4654a78: Update `refresh_state_references.id` to be a big int
- Updated dependencies
  - @backstage/catalog-client@1.10.1
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/backend-openapi-utils@0.5.4
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-events-node@0.4.12
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.1

## 2.0.1-next.2

### Patch Changes

- 2cac8b0: You can now specify an optional value when applying the `HAS_LABEL` permission rule, similar to the `HAS_ANNOTATION` permission rule.
- Updated dependencies
  - @backstage/backend-openapi-utils@0.5.4-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/plugin-events-node@0.4.12-next.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.1-next.1

## 2.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/backend-openapi-utils@0.5.4-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-events-node@0.4.12-next.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.1-next.1

## 2.0.1-next.0

### Patch Changes

- 4654a78: Update `refresh_state_references.id` to be a big int
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0
  - @backstage/plugin-events-node@0.4.12-next.0
  - @backstage/plugin-permission-node@0.10.1-next.0
  - @backstage/backend-openapi-utils@0.5.4-next.0

## 2.0.0

### Major Changes

- 90ab044: **BREAKING**: Removed all deprecated exports, and removed support for the old backend system.

  It also removes the `CodeOwnersProcessor` from the default set of processors, because it is expensive to run and has vague semantics. You need to update your backend to add it to the `catalogProcessingExtensionPoint` if you wish to continue using it.

  The following removed exports are available from `@backstage/plugin-catalog-node`:

  - `locationSpecToMetadataName`
  - `locationSpecToLocationEntity`
  - `processingResult`
  - `EntitiesSearchFilter`
  - `EntityFilter`
  - `DeferredEntity`
  - `EntityRelationSpec`
  - `CatalogProcessor`
  - `CatalogProcessorParser`
  - `CatalogProcessorCache`
  - `CatalogProcessorEmit`
  - `CatalogProcessorLocationResult`
  - `CatalogProcessorEntityResult`
  - `CatalogProcessorRelationResult`
  - `CatalogProcessorErrorResult`
  - `CatalogProcessorRefreshKeysResult`
  - `CatalogProcessorResult`
  - `EntityProvider`
  - `EntityProviderConnection`
  - `EntityProviderMutation`
  - `AnalyzeOptions`
  - `LocationAnalyzer`
  - `ScmLocationAnalyzer`
  - `PlaceholderResolver`
  - `PlaceholderResolverParams`
  - `PlaceholderResolverRead`
  - `PlaceholderResolverResolveUrl`
  - `parseEntityYaml`

  The following removed exports are available from `@backstage/plugin-catalog-common`:

  - `LocationSpec`
  - `AnalyzeLocationRequest`
  - `AnalyzeLocationResponse`
  - `AnalyzeLocationExistingEntity`
  - `AnalyzeLocationGenerateEntity`
  - `AnalyzeLocationEntityField`

  The following removed exports are instead implemented in the new backend system by `@backstage/plugin-search-backend-module-catalog`:

  - `defaultCatalogCollatorEntityTransformer`
  - `CatalogCollatorEntityTransformer`
  - `DefaultCatalogCollator`

  The following exports are removed without a direct replacement:

  - `DefaultCatalogCollatorFactory`
  - `DefaultCatalogCollatorFactoryOptions`
  - `LocationEntityProcessor`
  - `LocationEntityProcessorOptions`
  - `CatalogBuilder`
  - `CatalogEnvironment`
  - `CatalogPermissionRuleInput`
  - `CatalogProcessingEngine`
  - `createRandomProcessingInterval`
  - `ProcessingIntervalFunction`

### Minor Changes

- 6c9b88e: **BREAKING ALPHA**: You can no longer import the catalog plugin from the `/alpha` export; please use the regular root default export instead.
- d88b922: Adds the ability to disable the default entity processors using a new boolean app config item `catalog.disableDefaultProcessors`.

### Patch Changes

- 0e710fc: This patch addresses an issue identified in Backstage when configured with a MySQL database. If an entity of type location
  (e..all.yaml) has more than 70 referenced entities, clicking "Refresh" does not update the referenced entities as expected. This occurs because the TEXT type in MySQL has a limit of 65,535 bytes, which is insufficient to store all the referenced entities, causing the refresh operation to fail.
- 8e0f15f: "Added a note clarifying that `entity-fetch` audit events are not visible by default in the logs and are only displayed when the log severity level is adjusted."
- Updated dependencies
  - @backstage/integration@1.17.0
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.0
  - @backstage/catalog-client@1.10.0
  - @backstage/backend-openapi-utils@0.5.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-events-node@0.4.11

## 2.0.0-next.3

### Patch Changes

- 8e0f15f: "Added a note clarifying that `entity-fetch` audit events are not visible by default in the logs and are only displayed when the log severity level is adjusted."
- Updated dependencies
  - @backstage/integration@1.17.0-next.3
  - @backstage/backend-openapi-utils@0.5.3-next.2
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.2
  - @backstage/plugin-events-node@0.4.11-next.2
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.2

## 2.0.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0-next.2
  - @backstage/backend-openapi-utils@0.5.3-next.1
  - @backstage/config@1.3.2
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-events-node@0.4.11-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0

## 2.0.0-next.1

### Major Changes

- 90ab044: **BREAKING**: Removed all deprecated exports, and removed support for the old backend system.

  It also removes the `CodeOwnersProcessor` from the default set of processors, because it is expensive to run and has vague semantics. You need to update your backend to add it to the `catalogProcessingExtensionPoint` if you wish to continue using it.

  The following removed exports are available from `@backstage/plugin-catalog-node`:

  - `locationSpecToMetadataName`
  - `locationSpecToLocationEntity`
  - `processingResult`
  - `EntitiesSearchFilter`
  - `EntityFilter`
  - `DeferredEntity`
  - `EntityRelationSpec`
  - `CatalogProcessor`
  - `CatalogProcessorParser`
  - `CatalogProcessorCache`
  - `CatalogProcessorEmit`
  - `CatalogProcessorLocationResult`
  - `CatalogProcessorEntityResult`
  - `CatalogProcessorRelationResult`
  - `CatalogProcessorErrorResult`
  - `CatalogProcessorRefreshKeysResult`
  - `CatalogProcessorResult`
  - `EntityProvider`
  - `EntityProviderConnection`
  - `EntityProviderMutation`
  - `AnalyzeOptions`
  - `LocationAnalyzer`
  - `ScmLocationAnalyzer`
  - `PlaceholderResolver`
  - `PlaceholderResolverParams`
  - `PlaceholderResolverRead`
  - `PlaceholderResolverResolveUrl`
  - `parseEntityYaml`

  The following removed exports are available from `@backstage/plugin-catalog-common`:

  - `LocationSpec`
  - `AnalyzeLocationRequest`
  - `AnalyzeLocationResponse`
  - `AnalyzeLocationExistingEntity`
  - `AnalyzeLocationGenerateEntity`
  - `AnalyzeLocationEntityField`

  The following removed exports are instead implemented in the new backend system by `@backstage/plugin-search-backend-module-catalog`:

  - `defaultCatalogCollatorEntityTransformer`
  - `CatalogCollatorEntityTransformer`
  - `DefaultCatalogCollator`

  The following exports are removed without a direct replacement:

  - `DefaultCatalogCollatorFactory`
  - `DefaultCatalogCollatorFactoryOptions`
  - `LocationEntityProcessor`
  - `LocationEntityProcessorOptions`
  - `CatalogBuilder`
  - `CatalogEnvironment`
  - `CatalogPermissionRuleInput`
  - `CatalogProcessingEngine`
  - `createRandomProcessingInterval`
  - `ProcessingIntervalFunction`

### Minor Changes

- 6c9b88e: **BREAKING ALPHA**: You can no longer import the catalog plugin from the `/alpha` export; please use the regular root default export instead.
- d88b922: Adds the ability to disable the default entity processors using a new boolean app config item `catalog.disableDefaultProcessors`.

### Patch Changes

- 0e710fc: This patch addresses an issue identified in Backstage when configured with a MySQL database. If an entity of type location
  (e..all.yaml) has more than 70 referenced entities, clicking "Refresh" does not update the referenced entities as expected. This occurs because the TEXT type in MySQL has a limit of 65,535 bytes, which is insufficient to store all the referenced entities, causing the refresh operation to fail.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/backend-openapi-utils@0.5.3-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-events-node@0.4.11-next.1

## 1.32.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.4-next.0
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-events-node@0.4.11-next.0
  - @backstage/plugin-permission-node@0.9.2-next.0
  - @backstage/plugin-search-backend-module-catalog@0.3.4-next.0
  - @backstage/backend-openapi-utils@0.5.3-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-common@1.2.17

## 1.32.1

### Patch Changes

- 7cc4995: Fix for duplicate results in `queryEntities` when providing an `orderField` parameter
- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/integration@1.16.3
  - @backstage/plugin-permission-node@0.9.1
  - @backstage/plugin-search-backend-module-catalog@0.3.3
  - @backstage/backend-openapi-utils@0.5.2
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.10
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-common@1.2.17

## 1.32.1-next.1

### Patch Changes

- 7cc4995: Fix for duplicate results in `queryEntities` when providing an `orderField` parameter
- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/plugin-search-backend-module-catalog@0.3.3-next.0
  - @backstage/backend-openapi-utils@0.5.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.3-next.0
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.9
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.9.0
  - @backstage/plugin-search-common@1.2.17

## 1.32.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.3-next.0
  - @backstage/plugin-permission-node@0.9.0
  - @backstage/backend-openapi-utils@0.5.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-events-node@0.4.9
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-backend-module-catalog@0.3.2
  - @backstage/plugin-search-common@1.2.17

## 1.32.0

### Minor Changes

- ca9c51b: Added opt-in ability to evict entities from the catalog whose provider is no longer configured. See [Catalog configuration documentation](https://backstage.io/docs/features/software-catalog/configuration#clean-up-entities-from-orphaned-entity-providers)

### Patch Changes

- 4306303: Added a fix in `@backstage/plugin-catalog-backend` to prevent duplicate path keys in entity search if only casing is different.
- 5243aa4: Fixed an issue occurred when authorizing permissions using custom rules passed via the `PermissionsRegistryService`.
- fbc1666: Correctly use the `catalog.useUrlReadersSearch` config.
- 75cadc1: Minor internal tweak to `refreshByRefreshKeys`
- Updated dependencies
  - @backstage/integration@1.16.2
  - @backstage/plugin-permission-node@0.9.0
  - @backstage/plugin-events-node@0.4.9
  - @backstage/backend-openapi-utils@0.5.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-backend-module-catalog@0.3.2
  - @backstage/plugin-search-common@1.2.17

## 1.32.0-next.2

### Patch Changes

- 4306303: Added a fix in `@backstage/plugin-catalog-backend` to prevent duplicate path keys in entity search if only casing is different.
- 5243aa4: Fixed an issue occurred when authorizing permissions using custom rules passed via the `PermissionsRegistryService`.
- Updated dependencies
  - @backstage/integration@1.16.2-next.0
  - @backstage/plugin-events-node@0.4.9-next.2
  - @backstage/backend-openapi-utils@0.5.1-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.9-next.1
  - @backstage/plugin-search-backend-module-catalog@0.3.2-next.1
  - @backstage/plugin-search-common@1.2.17

## 1.32.0-next.1

### Minor Changes

- ca9c51b: Added opt-in ability to evict entities from the catalog whose provider is no longer configured. See [Catalog configuration documentation](https://backstage.io/docs/features/software-catalog/configuration#clean-up-entities-from-orphaned-entity-providers)

### Patch Changes

- fbc1666: Correctly use the `catalog.useUrlReadersSearch` config.
- 75cadc1: Minor internal tweak to `refreshByRefreshKeys`
- Updated dependencies
  - @backstage/backend-openapi-utils@0.5.1-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-events-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.9-next.1
  - @backstage/plugin-search-backend-module-catalog@0.3.2-next.1
  - @backstage/plugin-search-common@1.2.17

## 1.31.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.8.9-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.16.1-next.0
  - @backstage/plugin-events-node@0.4.9-next.0
  - @backstage/plugin-search-backend-module-catalog@0.3.2-next.0
  - @backstage/backend-openapi-utils@0.5.1-next.0

## 1.31.0

### Minor Changes

- 9b9737c: Added support for emitting entities with an explicit location key during processing.
- 8805f93: The catalog backend now supports the new `PermissionsRegistryService`, which can be used to add custom permission rules.
- 5aebc13: The `UrlReaderProccessor` accepts a new config flag `catalog.useUrlReadersSearch` to always call the `search` method of `UrlReaders`.

  This flag currently defaults to `false`, but adopters are encouraged to enable it as this behavior will be the default in a future release.

  Previous behavior was to call the `search` method only if the parsed Git URL's filename contained a wildcard and use `readUrl` otherwise. `UrlReaderService` must implement this logic in the `search` method instead.

  This allows each `UrlReaderService` implementation to check whether it's a search URL (that contains a wildcard pattern) or not using logic that is specific to each provider.

- a4aa244: This change integrates the `auditor` service into the Catalog plugin.

### Patch Changes

- c9139e1: Ignore benign database conflict errors during stitching, now logged with debug level instead.
- f178b12: Cleanup `refresh_state_references` for entity processors and providers that are no longer in control of a `refresh_state` row for entity
- cd372e4: Improved performance when applying conditional decisions to entities within the permission framework.
- 4ae6884: Fixed an bug in the entity processing caching that would prevent entities that were emitted during processing to be restored after being overridden.
- ef73f97: Updated permission integration to use new permission resource ref.
- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-catalog-node@1.16.0
  - @backstage/plugin-search-backend-module-catalog@0.3.1
  - @backstage/backend-openapi-utils@0.5.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.8
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-common@1.2.17

## 1.31.0-next.3

### Minor Changes

- 5aebc13: The `UrlReaderProccessor` accepts a new config flag `catalog.useUrlReadersSearch` to always call the `search` method of `UrlReaders`.

  This flag currently defaults to `false`, but adopters are encouraged to enable it as this behavior will be the default in a future release.

  Previous behavior was to call the `search` method only if the parsed Git URL's filename contained a wildcard and use `readUrl` otherwise. `UrlReaderService` must implement this logic in the `search` method instead.

  This allows each `UrlReaderService` implementation to check whether it's a search URL (that contains a wildcard pattern) or not using logic that is specific to each provider.

### Patch Changes

- ef73f97: Updated permission integration to use new permission resource ref.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/plugin-permission-node@0.8.8-next.2
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/plugin-search-backend-module-catalog@0.3.1-next.3
  - @backstage/plugin-events-node@0.4.8-next.2
  - @backstage/backend-openapi-utils@0.5.0-next.3
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-common@1.2.17

## 1.31.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/plugin-search-backend-module-catalog@0.3.1-next.2
  - @backstage/backend-openapi-utils@0.5.0-next.2
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.8-next.1
  - @backstage/plugin-search-common@1.2.17

## 1.31.0-next.1

### Minor Changes

- 9b9737c: Added support for emitting entities with an explicit location key during processing.

### Patch Changes

- 4ae6884: Fixed an bug in the entity processing caching that would prevent entities that were emitted during processing to be restored after being overridden.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/backend-openapi-utils@0.5.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.8-next.0
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.8-next.0
  - @backstage/plugin-search-backend-module-catalog@0.3.1-next.1
  - @backstage/plugin-search-common@1.2.17

## 1.31.0-next.0

### Minor Changes

- 8805f93: The catalog backend now supports the new `PermissionsRegistryService`, which can be used to add custom permission rules.
- a4aa244: This change integrates the `auditor` service into the Catalog plugin.

### Patch Changes

- c9139e1: Ignore benign database conflict errors during stitching, now logged with debug level instead.
- f178b12: Cleanup `refresh_state_references` for entity processors and providers that are no longer in control of a `refresh_state` row for entity
- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8-next.0
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/plugin-search-backend-module-catalog@0.3.1-next.0
  - @backstage/backend-openapi-utils@0.4.2-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.8-next.0
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-common@1.2.17

## 1.30.0

### Patch Changes

- d9d62ef: Remove some internal usages of the backend-common package
- 8379bf4: Remove usages of `PluginDatabaseManager` and `PluginEndpointDiscovery` and replace with their equivalent service types
- be0aae7: Improved concurrency of the `entities` endpoint when using the streamed query mode behind the `catalog.disableRelationsCompatibility` flag.
- dd515e3: Internalize the deprecated collator types since they were removed from the collator itself during new-backend-system migration.
- 3d475a0: Updated condition in `resolveCodeOwner` to fix a bug where `normalizeCodeOwner` could potentially be called with an invalid argument causing an error in `CodeOwnersProcessor`
- Updated dependencies
  - @backstage/plugin-search-backend-module-catalog@0.3.0
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-node@0.8.7
  - @backstage/integration@1.16.1
  - @backstage/backend-openapi-utils@0.4.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.15.1
  - @backstage/plugin-events-node@0.4.7
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-search-common@1.2.17

## 1.30.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-openapi-utils@0.4.1-next.1
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/plugin-events-node@0.4.7-next.1
  - @backstage/plugin-permission-common@0.8.4-next.0
  - @backstage/plugin-permission-node@0.8.7-next.1
  - @backstage/plugin-search-backend-module-catalog@0.3.0-next.1
  - @backstage/catalog-client@1.9.1-next.0
  - @backstage/plugin-catalog-common@1.1.3-next.0
  - @backstage/integration@1.16.1-next.0

## 1.30.0-next.0

### Minor Changes

- dd515e3: Removed the long-deprecated `DefaultCatalogCollatorFactory` and `DefaultCatalogCollatorFactoryOptions` exports, which now no longer exist in the search plugin's offerings. If you were using these, you want to migrate to [the new backend system](https://backstage.io/docs/backend-system/) and use the [catalog collator](https://backstage.io/docs/features/search/collators#catalog) directly.

### Patch Changes

- d9d62ef: Remove some internal usages of the backend-common package
- 8379bf4: Remove usages of `PluginDatabaseManager` and `PluginEndpointDiscovery` and replace with their equivalent service types
- be0aae7: Improved concurrency of the `entities` endpoint when using the streamed query mode behind the `catalog.disableRelationsCompatibility` flag.
- 3d475a0: Updated condition in `resolveCodeOwner` to fix a bug where `normalizeCodeOwner` could potentially be called with an invalid argument causing an error in `CodeOwnersProcessor`
- Updated dependencies
  - @backstage/plugin-search-backend-module-catalog@0.3.0-next.0
  - @backstage/plugin-permission-node@0.8.7-next.0
  - @backstage/backend-openapi-utils@0.4.1-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-client@1.9.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/integration@1.16.0
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.2
  - @backstage/plugin-catalog-node@1.15.1-next.0
  - @backstage/plugin-events-node@0.4.7-next.0
  - @backstage/plugin-permission-common@0.8.3

## 1.29.0

### Minor Changes

- 02bd2cb: Added a new `catalog.disableRelationsCompatibility` configuration option that avoids JSON deserialization and serialization if possible when reading entities. This significantly reduces the memory usage of the catalog, and slightly increases performance, but it removes the backwards compatibility processing that ensures that both `entity.relation[].target` and `entity.relation[].targetRef` are present in returned entities.
- c1307b4: Implement `/entities` in terms of `queryEntities` to not run into memory and performance problems on large catalogs
- 384e494: Internal updates to generated code.
- 1d0bc11: Fetch all facets in a single database query

### Patch Changes

- dfc8b41: Updated dependency `@opentelemetry/api` to `^1.9.0`.
- 8013c9c: Perform the by-query count inlined with the main query
- feba9ee: Internal refactor of filter parsing logic.
- 1fdb48e: Use a faster count method on pg when computing some metrics
- e4aab10: Fix a bug where sometimes the `by-query` endpoint could return nulls for entities that were not yet stitched.
- f159b25: Compute deltas more efficiently, which generally leads to less wasted processing cycles
- 0c33465: Implement `/entities/by-name/:kind/:namespace/:name` using `getEntitiesByRefs`
- 56511ba: Be more aggressive in dequeueing entities for stitching
- 71152e3: Correctly report stitching queue length
- 5c9cc05: Use native fetch instead of node-fetch
- d93390d: When parsing filters, do not make redundant `anyOf` and `allOf` nodes when there's only a single entry within them
- 3ab57c6: Support changing location keys on existing entities, in delta mutations
- 24ecea8: Avoid extra ordering in by-query when the user doesn't ask for it
- 2924ffe: Compute some metrics using search table facet aggregations instead of reading the full refresh state
- Updated dependencies
  - @backstage/integration@1.16.0
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-search-backend-module-catalog@0.2.6
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/plugin-events-node@0.4.6
  - @backstage/catalog-client@1.9.0
  - @backstage/plugin-permission-node@0.8.6
  - @backstage/backend-openapi-utils@0.4.0
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.2
  - @backstage/plugin-permission-common@0.8.3

## 1.29.0-next.2

### Minor Changes

- c1307b4: Implement `/entities` in terms of `queryEntities` to not run into memory and performance problems on large catalogs

### Patch Changes

- dfc8b41: Updated dependency `@opentelemetry/api` to `^1.9.0`.
- 8013c9c: Perform the by-query count inlined with the main query
- feba9ee: Use a join based strategy for filtering, when having small page sizes
- 1fdb48e: Use a faster count method on pg when computing some metrics
- 0c33465: Implement `/entities/by-name/:kind/:namespace/:name` using `getEntitiesByRefs`
- d93390d: When parsing filters, do not make redundant `anyOf` and `allOf` nodes when there's only a single entry within them
- 24ecea8: Avoid extra ordering in by-query when the user doesn't ask for it
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-permission-node@0.8.6-next.2
  - @backstage/backend-openapi-utils@0.4.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/plugin-events-node@0.4.6-next.2
  - @backstage/plugin-search-backend-module-catalog@0.2.6-next.2
  - @backstage/catalog-client@1.9.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/integration@1.16.0-next.1
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.2-next.0
  - @backstage/plugin-permission-common@0.8.3-next.0

## 1.29.0-next.1

### Minor Changes

- 384e494: Internal updates to generated code.
- 1d0bc11: Fetch all facets in a single database query

### Patch Changes

- e4aab10: Fix a bug where sometimes the `by-query` endpoint could return nulls for entities that were not yet stitched.
- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/catalog-client@1.9.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/plugin-permission-node@0.8.6-next.1
  - @backstage/plugin-search-backend-module-catalog@0.2.6-next.1
  - @backstage/backend-openapi-utils@0.3.1-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/integration@1.16.0-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-events-node@0.4.6-next.1
  - @backstage/plugin-permission-common@0.8.2

## 1.28.1-next.0

### Patch Changes

- f159b25: Compute deltas more efficiently, which generally leads to less wasted processing cycles
- 56511ba: Be more aggressive in dequeueing entities for stitching
- 71152e3: Correctly report stitching queue length
- 3ab57c6: Support changing location keys on existing entities, in delta mutations
- 2924ffe: Compute some metrics using search table facet aggregations instead of reading the full refresh state
- Updated dependencies
  - @backstage/integration@1.16.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-search-backend-module-catalog@0.2.6-next.0
  - @backstage/plugin-events-node@0.4.6-next.0
  - @backstage/catalog-client@1.8.1-next.0
  - @backstage/backend-openapi-utils@0.3.1-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-catalog-node@1.14.1-next.0
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/plugin-permission-node@0.8.6-next.0

## 1.28.0

### Minor Changes

- 39fd704: Internal update to use the new generated server types from `backstage-cli package schema openapi generate --server`.
- 76857da: Added `entity_ref` column to `final_entities` in order to move `refresh_state` away from the read path
- 34d4360: Drop redundant indices from the database.

  The following redundant indices are removed in this version:

  - `final_entities_entity_id_idx` - overlaps with `final_entities_pkey`
  - `refresh_state_entity_id_idx` - overlaps with `refresh_state_pkey`
  - `refresh_state_entity_ref_idx` - overlaps with `refresh_state_entity_ref_uniq`
  - `search_key_idx` and `search_value_idx` - these were replaced by the composite index `search_key_value_idx` in #22594

  No negative end user impact is expected, but rather that performance should increase due to less index churn.

### Patch Changes

- d52d7f9: Support ISO and ms string forms of durations in config too
- b89834b: Fixed an issue where entities would not be marked for restitching if only the target of a relationship changed.
- 1bf02cc: Fixed bug when searching an entity by `spec.profile.displayName` in the catalog on the frontend. Text filter fields were not applied correctly to the database query resulting in empty results.
- 4e58bc7: Upgrade to uuid v11 internally
- 5efde17: Internal refactor to slightly speed up the processing loop
- Updated dependencies
  - @backstage/catalog-client@1.8.0
  - @backstage/config@1.3.0
  - @backstage/plugin-events-node@0.4.5
  - @backstage/types@1.2.0
  - @backstage/plugin-search-backend-module-catalog@0.2.5
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/backend-openapi-utils@0.3.0
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5
  - @backstage/integration@1.15.2
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-permission-node@0.8.5

## 1.28.0-next.3

### Minor Changes

- 76857da: Added `entity_ref` column to `final_entities` in order to move `refresh_state` away from the read path
- 34d4360: Drop redundant indices from the database.

  The following redundant indices are removed in this version:

  - `final_entities_entity_id_idx` - overlaps with `final_entities_pkey`
  - `refresh_state_entity_id_idx` - overlaps with `refresh_state_pkey`
  - `refresh_state_entity_ref_idx` - overlaps with `refresh_state_entity_ref_uniq`
  - `search_key_idx` and `search_value_idx` - these were replaced by the composite index `search_key_value_idx` in #22594

  No negative end user impact is expected, but rather that performance should increase due to less index churn.

### Patch Changes

- b89834b: Fixed an issue where entities would not be marked for restitching if only the target of a relationship changed.
- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.3
  - @backstage/backend-openapi-utils@0.3.0-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.2
  - @backstage/plugin-search-backend-module-catalog@0.2.5-next.3

## 1.28.0-next.2

### Minor Changes

- 39fd704: Internal update to use the new generated server types from `backstage-cli package schema openapi generate --server`.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/backend-openapi-utils@0.3.0-next.2
  - @backstage/plugin-events-node@0.4.5-next.2
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/plugin-search-backend-module-catalog@0.2.5-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.2

## 1.27.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.2.1-next.1
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.14.0-next.1
  - @backstage/plugin-events-node@0.4.4-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.1
  - @backstage/plugin-search-backend-module-catalog@0.2.5-next.1

## 1.27.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.3-next.0
  - @backstage/plugin-search-backend-module-catalog@0.2.5-next.0
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/backend-openapi-utils@0.2.1-next.0
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.0

## 1.27.0

### Minor Changes

- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- 83a8830: Added migration `20241003170511_alter_target_in_locations.js` to change the target column in the `locations` table to TEXT type.
  Added a hash for the key column in the `refresh_keys` table.
- 62747f8: Fixed a bug where the concurrency limiter for URL reading was not honored
- c1f9764: Add configuration parameters for deferred stitcher
- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- d1cf90a: Adds the ability to disable catalog processing `catalog.processingInterval: false` in `app-config`
- f1cab41: Update catalog search table in transaction
- 8206f49: Fix a bug where etags were expiring too soon in the URL reader
- Updated dependencies
  - @backstage/plugin-search-backend-module-catalog@0.2.3
  - @backstage/plugin-permission-node@0.8.4
  - @backstage/plugin-events-node@0.4.1
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/integration@1.15.1
  - @backstage/backend-openapi-utils@0.2.0
  - @backstage/catalog-client@1.7.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1

## 1.26.2-next.2

### Patch Changes

- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- f1cab41: Update catalog search table in transaction
- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-openapi-utils@0.2.0-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-events-node@0.4.1-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1
  - @backstage/plugin-search-backend-module-catalog@0.2.3-next.2

## 1.26.2-next.1

### Patch Changes

- 62747f8: Fixed a bug where the concurrency limiter for URL reading was not honored
- 8206f49: Fix a bug where etags were expiring too soon in the URL reader
- Updated dependencies
  - @backstage/integration@1.15.1-next.0
  - @backstage/backend-openapi-utils@0.1.19-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.0
  - @backstage/plugin-search-backend-module-catalog@0.2.3-next.1

## 1.26.1-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-search-backend-module-catalog@0.2.3-next.0
  - @backstage/plugin-permission-node@0.8.4-next.0
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/backend-openapi-utils@0.1.19-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-permission-common@0.8.1

## 1.26.0

### Minor Changes

- 74acf06: Add `dependencyOf` prop to catalog model for Component kind to enable building relationship graphs with both directions using `dependsOn` and `dependencyOf`.
- 78475c3: Allow offset mode paging in entity list provider
- bd35cdb: The `analyze-location` endpoint is now protected by the `catalog.location.analyze` permission.
  The `validate-entity` endpoint is now protected by the `catalog.entity.validate` permission.

### Patch Changes

- 1882cfe: Moved `getEntities` ordering to utilize database instead of having it inside catalog client

  Please note that the latest version of `@backstage/catalog-client` will not order the entities in the same way as before. This is because the ordering is now done in the database query instead of in the client. If you rely on the ordering of the entities, you may need to update your backend plugin or code to handle this change.

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- 53cce86: Fixed an issue with the by-query call, where ordering by a field that does not exist on all entities led to not all results being returned
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/catalog-client@1.7.0
  - @backstage/plugin-search-backend-module-catalog@0.2.2
  - @backstage/plugin-permission-node@0.8.3
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/integration@1.15.0
  - @backstage/backend-openapi-utils@0.1.18
  - @backstage/plugin-events-node@0.4.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 1.26.0-next.2

### Minor Changes

- 78475c3: Allow offset mode paging in entity list provider

### Patch Changes

- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-client@1.7.0-next.1
  - @backstage/integration@1.15.0-next.0
  - @backstage/backend-openapi-utils@0.1.18-next.2
  - @backstage/plugin-permission-node@0.8.3-next.2
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.2
  - @backstage/plugin-events-node@0.4.0-next.2
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-backend-module-catalog@0.2.2-next.2

## 1.25.3-next.1

### Patch Changes

- 1882cfe: Moved `getEntities` ordering to utilize database instead of having it inside catalog client

  Please note that the latest version of `@backstage/catalog-client` will not order the entities in the same way as before. This is because the ordering is now done in the database query instead of in the client. If you rely on the ordering of the entities, you may need to update your backend plugin or code to handle this change.

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/catalog-client@1.6.7-next.0
  - @backstage/backend-openapi-utils@0.1.18-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.1
  - @backstage/plugin-events-node@0.4.0-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.3-next.1
  - @backstage/plugin-search-backend-module-catalog@0.2.2-next.1

## 1.25.3-next.0

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- 53cce86: Fixed an issue with the by-query call, where ordering by a field that does not exist on all entities led to not all results being returned
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-search-backend-module-catalog@0.2.2-next.0
  - @backstage/plugin-permission-node@0.8.3-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-events-node@0.4.0-next.0
  - @backstage/backend-openapi-utils@0.1.18-next.0
  - @backstage/plugin-catalog-node@1.12.7-next.0
  - @backstage/catalog-client@1.6.6
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-permission-common@0.8.1

## 1.25.0

### Minor Changes

- 163ba08: Deprecated `RouterOptions`, `CatalogBuilder`, and `CatalogEnvironment`. Please make sure to upgrade to the new backend system.
- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.

### Patch Changes

- 776eb56: `ProcessorOutputCollector` returns an error when receiving deferred entities that have an invalid `metadata.annotations` format.

  This allows to return an error on an actual validation issue instead of reporting that the location annotations are missing afterwards, which is misleading for the users.

- 389f5a4: Update deprecated url-reader-related imports.
- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- a629fb2: Added setAllowedLocationTypes while introducing a new extension point called CatalogLocationsExtensionPoint
- 51240ee: Preserve default `allowedLocationTypes` when `setAllowedLocationTypes()` of `CatalogLocationsExtensionPoint` is not called.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.1
  - @backstage/plugin-search-backend-module-catalog@0.2.0
  - @backstage/plugin-catalog-node@1.12.5
  - @backstage/integration@1.14.0
  - @backstage/catalog-model@1.6.0
  - @backstage/backend-openapi-utils@0.1.16
  - @backstage/catalog-client@1.6.6
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-events-node@0.3.9

## 1.24.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/backend-openapi-utils@0.1.16-next.3
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/catalog-client@1.6.6-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.3
  - @backstage/plugin-events-node@0.3.9-next.3
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/plugin-permission-node@0.8.1-next.3
  - @backstage/plugin-search-backend-module-catalog@0.1.29-next.3

## 1.24.1-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-permission-node@0.8.1-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.2
  - @backstage/backend-openapi-utils@0.1.16-next.2
  - @backstage/plugin-events-node@0.3.9-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.29-next.2
  - @backstage/plugin-catalog-common@1.0.26-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.24.1-next.1

### Patch Changes

- 51240ee: Preserve default `allowedLocationTypes` when `setAllowedLocationTypes()` of `CatalogLocationsExtensionPoint` is not called.
- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1-next.0
  - @backstage/plugin-permission-node@0.8.1-next.1
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-common@1.0.26-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.29-next.1
  - @backstage/backend-openapi-utils@0.1.16-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.9-next.1

## 1.24.1-next.0

### Patch Changes

- a629fb2: Added setAllowedLocationTypes while introducing a new extension point called CatalogLocationsExtensionPoint
- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-openapi-utils@0.1.16-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/plugin-events-node@0.3.9-next.0
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-permission-node@0.8.1-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.29-next.0

## 1.24.0

### Minor Changes

- b9ed1bb: bumped better-sqlite3 from ^9.0.0 to ^11.0.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-permission-node@0.8.0
  - @backstage/integration@1.13.0
  - @backstage/plugin-events-node@0.3.8
  - @backstage/backend-openapi-utils@0.1.15
  - @backstage/plugin-catalog-node@1.12.4
  - @backstage/plugin-search-backend-module-catalog@0.1.28
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.24.0-next.1

### Minor Changes

- b9ed1bb: bumped better-sqlite3 from ^9.0.0 to ^11.0.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-openapi-utils@0.1.15-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.13.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/plugin-catalog-node@1.12.4-next.1
  - @backstage/plugin-events-node@0.3.8-next.1
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-permission-node@0.7.33-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.28-next.1

## 1.23.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/backend-openapi-utils@0.1.14-next.0
  - @backstage/plugin-catalog-node@1.12.3-next.0
  - @backstage/plugin-events-node@0.3.7-next.0
  - @backstage/plugin-permission-node@0.7.32-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.27-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/plugin-permission-common@0.7.14

## 1.23.0

### Minor Changes

- c7528b0: Pass through `EventsService` too in the new backend system

### Patch Changes

- 8869b8e: Updated local development setup.
- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- d779e3b: Added a regex test to check commit hash. If url is from git commit branch ignore the edit url.
- 6c5cab1: Fix bug in `getLocationByEntity`
- 0f55f5c: Ensure name and title are both indexed by the DefaultCatalogCollator
- 1779188: Start using the `isDatabaseConflictError` helper from the `@backstage/backend-plugin-api` package in order to avoid dependency with the soon to deprecate `@backstage/backend-common` package.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/integration@1.12.0
  - @backstage/plugin-search-backend-module-catalog@0.1.25
  - @backstage/plugin-catalog-node@1.12.1
  - @backstage/plugin-events-node@0.3.5
  - @backstage/plugin-permission-node@0.7.30
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/backend-openapi-utils@0.1.12
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.23.0-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.25-next.3
  - @backstage/plugin-permission-common@0.7.14-next.0
  - @backstage/plugin-permission-node@0.7.30-next.3
  - @backstage/plugin-catalog-common@1.0.24-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.2
  - @backstage/plugin-events-node@0.3.5-next.2
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/backend-openapi-utils@0.1.12-next.2
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.23.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/plugin-permission-node@0.7.30-next.2
  - @backstage/backend-openapi-utils@0.1.12-next.1
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-catalog-node@1.12.1-next.1
  - @backstage/plugin-events-node@0.3.5-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.25-next.2
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.23
  - @backstage/plugin-permission-common@0.7.13

## 1.23.0-next.1

### Patch Changes

- d779e3b: Added a regex test to check commit hash. If url is from git commit branch ignore the edit url.
- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/plugin-permission-node@0.7.30-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.25-next.1

## 1.23.0-next.0

### Minor Changes

- c7528b0: Pass through `EventsService` too in the new backend system

### Patch Changes

- 8869b8e: Updated local development setup.
- 1779188: Start using the `isDatabaseConflictError` helper from the `@backstage/backend-plugin-api` package in order to avoid dependency with the soon to deprecate `@backstage/backend-common` package.
- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.25-next.0
  - @backstage/plugin-permission-node@0.7.30-next.0
  - @backstage/backend-openapi-utils@0.1.12-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.11.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.23
  - @backstage/plugin-permission-common@0.7.13

## 1.22.0

### Minor Changes

- f2a2a83: Deprecated the `LocationAnalyzer` type, which has been moved to `@backstage/plugin-catalog-node`.
- f2a2a83: The `/alpha` plugin export has had its implementation of the `catalogAnalysisExtensionPoint` updated to reflect the new API.
- 8d14475: Emit well known relationships for the Domain entity kind.

### Patch Changes

- 131e5cb: Fix broken links in README.
- c6cb568: Add lifecycle monitoring for the catalog processing
- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- 8479a0b: Fixed bug in stitching queue gauge that included entities that are scheduled in the future.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0
  - @backstage/plugin-search-backend-module-catalog@0.1.24
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-events-node@0.3.4
  - @backstage/integration@1.11.0
  - @backstage/backend-openapi-utils@0.1.11
  - @backstage/catalog-client@1.6.5
  - @backstage/plugin-catalog-common@1.0.23
  - @backstage/plugin-permission-node@0.7.29

## 1.22.0-next.2

### Minor Changes

- f2a2a83: Deprecated the `LocationAnalyzer` type, which has been moved to `@backstage/plugin-catalog-node`.
- f2a2a83: The `/alpha` plugin export has had its implementation of the `catalogAnalysisExtensionPoint` updated to reflect the new API.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.24-next.2
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-events-node@0.3.4-next.2
  - @backstage/integration@1.11.0-next.0

## 1.22.0-next.1

### Patch Changes

- 8479a0b: Fixed bug in stitching queue gauge that included entities that are scheduled in the future.
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-events-node@0.3.4-next.1
  - @backstage/plugin-permission-node@0.7.29-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.24-next.1
  - @backstage/plugin-catalog-node@1.11.2-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1
  - @backstage/backend-openapi-utils@0.1.11-next.1

## 1.22.0-next.0

### Minor Changes

- 8d14475: Emit well known relationships for the Domain entity kind.

### Patch Changes

- c6cb568: Add lifecycle monitoring for the catalog processing
- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.23-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/catalog-client@1.6.5-next.0
  - @backstage/plugin-catalog-common@1.0.23-next.0
  - @backstage/plugin-catalog-node@1.11.2-next.0
  - @backstage/backend-openapi-utils@0.1.11-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.4-next.0
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-permission-node@0.7.29-next.0

## 1.21.1

### Patch Changes

- cfdc5e7: Fixes an issue where `/analyze-location` would incorrectly throw a 500 error on an invalid url.
- d5a1fe1: Replaced winston logger with `LoggerService`
- c52f7ac: Make entity collection errors a little quieter in the logs.

  Instead of logging a warning line when an entity has an error
  during processing, it will now instead emit an event on the event
  broker.

  This only removes a single log line, however it is possible to
  add the log line back if it is required by subscribing to the
  `CATALOG_ERRORS_TOPIC` as shown below.

  ```typescript
  env.eventBroker.subscribe({
    supportsEventTopics(): string[] {
      return [CATALOG_ERRORS_TOPIC];
    },

    async onEvent(
      params: EventParams<{
        entity: string;
        location?: string;
        errors: Array<Error>;
      }>,
    ): Promise<void> {
      const { entity, location, errors } = params.eventPayload;
      for (const error of errors) {
        env.logger.warn(error.message, {
          entity,
          location,
        });
      }
    },
  });
  ```

- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/plugin-permission-node@0.7.28
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/backend-tasks@0.5.22
  - @backstage/catalog-client@1.6.4
  - @backstage/integration@1.10.0
  - @backstage/plugin-events-node@0.3.3
  - @backstage/plugin-search-backend-module-catalog@0.1.22
  - @backstage/plugin-catalog-node@1.11.1
  - @backstage/backend-openapi-utils@0.1.10
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13

## 1.21.1-next.1

### Patch Changes

- c52f7ac: Make entity collection errors a little quieter in the logs.

  Instead of logging a warning line when an entity has an error
  during processing, it will now instead emit an event on the event
  broker.

  This only removes a single log line, however it is possible to
  add the log line back if it is required by subscribing to the
  `CATALOG_ERRORS_TOPIC` as shown below.

  ```typescript
  env.eventBroker.subscribe({
    supportsEventTopics(): string[] {
      return [CATALOG_ERRORS_TOPIC];
    },

    async onEvent(
      params: EventParams<{
        entity: string;
        location?: string;
        errors: Array<Error>;
      }>,
    ): Promise<void> {
      const { entity, location, errors } = params.eventPayload;
      for (const error of errors) {
        env.logger.warn(error.message, {
          entity,
          location,
        });
      }
    },
  });
  ```

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/catalog-client@1.6.4-next.0
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/plugin-events-node@0.3.3-next.1
  - @backstage/plugin-permission-node@0.7.28-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.22-next.1
  - @backstage/backend-openapi-utils@0.1.10-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-catalog-node@1.11.1-next.1
  - @backstage/plugin-permission-common@0.7.13

## 1.21.1-next.0

### Patch Changes

- cfdc5e7: Fixes an issue where `/analyze-location` would incorrectly throw a 500 error on an invalid url.
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/backend-openapi-utils@0.1.10-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/catalog-client@1.6.3
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-catalog-node@1.11.1-next.0
  - @backstage/plugin-events-node@0.3.3-next.0
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-permission-node@0.7.28-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.22-next.0

## 1.21.0

### Minor Changes

- f3e2e86: Added the ability to inject custom permissions from modules, on `CatalogBuilder` and `CatalogPermissionExtensionPoint`

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.11.0
  - @backstage/catalog-client@1.6.3
  - @backstage/backend-common@0.21.6
  - @backstage/plugin-search-backend-module-catalog@0.1.21
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-permission-node@0.7.27
  - @backstage/backend-tasks@0.5.21
  - @backstage/plugin-events-node@0.3.2
  - @backstage/backend-openapi-utils@0.1.9
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13

## 1.20.0

### Minor Changes

- f3e2e86: Added the ability to inject custom permissions from modules, on `CatalogBuilder` and `CatalogPermissionExtensionPoint`

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.10.0
  - @backstage/catalog-client@1.6.2
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-search-backend-module-catalog@0.1.20
  - @backstage/backend-tasks@0.5.20
  - @backstage/plugin-events-node@0.3.1
  - @backstage/plugin-permission-node@0.7.26
  - @backstage/backend-openapi-utils@0.1.8
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-permission-common@0.7.13

## 1.19.0

### Minor Changes

- 9c7fb30: Added the ability to inject custom permissions from modules, on `CatalogBuilder` and `CatalogPermissionExtensionPoint`

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.9.0
  - @backstage/plugin-search-backend-module-catalog@0.1.19

## 1.18.0

### Minor Changes

- df12231: Allow setting EntityDataParser using CatalogModelExtensionPoint
- 15ba00f: Migrated to support new auth services. The `CatalogBuilder.create` method now accepts a `discovery` option, which is recommended to forward from the plugin environment, as it will otherwise fall back to use the `HostDiscovery` implementation.

### Patch Changes

- 2bd1410: Removed unused dependencies
- 999224f: Bump dependency `minimatch` to v9
- 6f830bb: Allow passing optional filter to `getEntitiesByRefs`
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- b65788b: Move @backstage/repo-tools to dev dependencies
- 280edeb: Add index for original value in search table for faster entity facet response
- dad018f: Do not fail on stitching when the entity contains `null` values associated to deeply nested or long keys.
- Updated dependencies
  - @backstage/plugin-events-node@0.3.0
  - @backstage/backend-common@0.21.4
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-search-backend-module-catalog@0.1.18
  - @backstage/plugin-catalog-node@1.8.0
  - @backstage/catalog-client@1.6.1
  - @backstage/backend-openapi-utils@0.1.7
  - @backstage/backend-tasks@0.5.19
  - @backstage/plugin-permission-node@0.7.25
  - @backstage/catalog-model@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22

## 1.18.0-next.2

### Patch Changes

- 2bd1410: Removed unused dependencies
- 6f830bb: Allow passing optional filter to `getEntitiesByRefs`
- b65788b: Move @backstage/repo-tools to dev dependencies
- dad018f: Do not fail on stitching when the entity contains `null` values associated to deeply nested or long keys.
- Updated dependencies
  - @backstage/integration@1.9.1-next.2
  - @backstage/catalog-client@1.6.1-next.1
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-catalog-node@1.8.0-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.18-next.2
  - @backstage/backend-openapi-utils@0.1.7-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-events-node@0.3.0-next.2
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.2

## 1.18.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/repo-tools@0.7.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.18-next.1
  - @backstage/backend-openapi-utils@0.1.7-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## 1.18.0-next.0

### Minor Changes

- df12231: Allow setting EntityDataParser using CatalogModelExtensionPoint
- 15ba00f: Migrated to support new auth services. The `CatalogBuilder.create` method now accepts a `discovery` option, which is recommended to forward from the plugin environment, as it will otherwise fall back to use the `HostDiscovery` implementation.

### Patch Changes

- 999224f: Bump dependency `minimatch` to v9
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- 280edeb: Add index for original value in search table for faster entity facet response
- Updated dependencies
  - @backstage/plugin-events-node@0.3.0-next.0
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/repo-tools@0.6.3-next.0
  - @backstage/plugin-permission-common@0.7.13-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.17-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.0
  - @backstage/backend-openapi-utils@0.1.6-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/plugin-permission-node@0.7.24-next.0
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.0

## 1.17.0

### Minor Changes

- 43dad25: Add API to get location by entity
- 126c2f9: Updates the OpenAPI spec to use plugin as `info.title` instead of package name.
- 04907c3: Updates the OpenAPI specification title to plugin ID instead of package name.
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

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 89b674c: Minor performance improvement for `queryEntities` when the limit is 0.
- 81e19b1: Replace uses of deprecated types with replacements internally.
- efa8160: Rollback the change for wildcard discovery, this fixes a bug with the `AzureUrlReader` not working with wildcard paths
- d208a93: Fixed a bug where `fullTextFilter` wasn't preserved correctly in the cursor.
- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- 1cae748: Updated dependency `git-url-parse` to `^14.0.0`.
- 0a395b3: Upgraded `prom-client` to version 15
- 9b2eb3f: Add support for `onProcessingError` handler at the catalog plugin (new backend system).

  You can use `setOnProcessingErrorHandler` at the `catalogProcessingExtensionPoint`
  as replacement for

  ```ts
  catalogBuilder.subscribe({
    onProcessingError: hander,
  });
  ```

- Updated dependencies
  - @backstage/repo-tools@0.6.0
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/plugin-search-backend-module-catalog@0.1.14
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/backend-tasks@0.5.15
  - @backstage/catalog-model@1.4.4
  - @backstage/backend-openapi-utils@0.1.3
  - @backstage/integration@1.9.0
  - @backstage/catalog-client@1.6.0
  - @backstage/plugin-catalog-node@1.7.0
  - @backstage/plugin-permission-node@0.7.21
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.21
  - @backstage/plugin-events-node@0.2.19
  - @backstage/plugin-permission-common@0.7.12

## 1.17.0-next.3

### Patch Changes

- 1cae748: Updated dependency `git-url-parse` to `^14.0.0`.
- 9b2eb3f: Add support for `onProcessingError` handler at the catalog plugin (new backend system).

  You can use `setOnProcessingErrorHandler` at the `catalogProcessingExtensionPoint`
  as replacement for

  ```ts
  catalogBuilder.subscribe({
    onProcessingError: hander,
  });
  ```

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/repo-tools@0.6.0-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-catalog-node@1.6.2-next.3
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/plugin-permission-node@0.7.21-next.3
  - @backstage/plugin-search-backend-module-catalog@0.1.14-next.3
  - @backstage/backend-openapi-utils@0.1.3-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-events-node@0.2.19-next.3
  - @backstage/plugin-permission-common@0.7.12

## 1.17.0-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/repo-tools@0.6.0-next.2
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.14-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/plugin-permission-node@0.7.21-next.2
  - @backstage/backend-openapi-utils@0.1.3-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/plugin-events-node@0.2.19-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/integration@1.9.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-permission-common@0.7.12

## 1.17.0-next.1

### Minor Changes

- 43dad25: Add API to get location by entity

### Patch Changes

- 89b674c: Minor performance improvement for `queryEntities` when the limit is 0.
- efa8160: Rollback the change for wildcard discovery, this fixes a bug with the `AzureUrlReader` not working with wildcard paths
- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/backend-openapi-utils@0.1.3-next.1
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.4-next.1
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.1
  - @backstage/plugin-events-node@0.2.19-next.1
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-permission-node@0.7.21-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.14-next.1

## 1.17.0-next.0

### Minor Changes

- 126c2f9: Updates the OpenAPI spec to use plugin as `info.title` instead of package name.
- 04907c3: Updates the OpenAPI specification title to plugin ID instead of package name.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-openapi-utils@0.1.3-next.0
  - @backstage/catalog-client@1.6.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/plugin-permission-node@0.7.21-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.14-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.20
  - @backstage/plugin-events-node@0.2.19-next.0
  - @backstage/plugin-permission-common@0.7.12

## 1.16.1

### Patch Changes

- c3249d6: Parse the URL using a different method rather than `git-url-parse` to support wildcards for URLs which are not VCS providers
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/catalog-client@1.5.2
  - @backstage/plugin-search-backend-module-catalog@0.1.13
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/backend-openapi-utils@0.1.2
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-permission-node@0.7.20
  - @backstage/backend-tasks@0.5.14
  - @backstage/plugin-auth-node@0.4.3
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.20
  - @backstage/plugin-events-node@0.2.18

## 1.16.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/backend-openapi-utils@0.1.2-next.2
  - @backstage/plugin-auth-node@0.4.3-next.2
  - @backstage/plugin-catalog-node@1.6.1-next.2
  - @backstage/plugin-events-node@0.2.18-next.2
  - @backstage/plugin-permission-node@0.7.20-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.13-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 1.16.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/plugin-permission-node@0.7.20-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.13-next.1
  - @backstage/backend-openapi-utils@0.1.2-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-catalog-node@1.6.1-next.1
  - @backstage/plugin-events-node@0.2.18-next.1
  - @backstage/plugin-permission-common@0.7.11

## 1.16.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.13-next.0
  - @backstage/backend-openapi-utils@0.1.2-next.0
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.0
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-events-node@0.2.18-next.0
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-permission-node@0.7.20-next.0

## 1.16.0

### Minor Changes

- 7804597: Permission rules can now be added for the Catalog plugin through the `CatalogPermissionExtensionPoint` interface.

### Patch Changes

- 3834067: Update the OpenAPI spec to support the use of `openapi-generator`.
- 50ee804: Wrap single `pipelineLoop` of TaskPipeline in a span for better traces
- 7123c58: Updated dependency `@types/glob` to `^8.0.0`.
- 0cbb03b: Fixing regular expression ReDoS with zod packages. Upgrading to latest. ref: https://security.snyk.io/vuln/SNYK-JS-ZOD-5925617
- a168507: Deprecated `EntitiesSearchFilter` and `EntityFilter`, which can now be imported from `@backstage/plugin-catalog-node` instead
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-catalog-node@1.6.0
  - @backstage/catalog-client@1.5.0
  - @backstage/backend-openapi-utils@0.1.1
  - @backstage/backend-tasks@0.5.13
  - @backstage/integration@1.8.0
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-permission-node@0.7.19
  - @backstage/plugin-search-backend-module-catalog@0.1.12
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-events-node@0.2.17

## 1.16.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-openapi-utils@0.1.1-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.3
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.6.0-next.3
  - @backstage/plugin-events-node@0.2.17-next.3
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.3
  - @backstage/plugin-search-backend-module-catalog@0.1.12-next.3

## 1.16.0-next.2

### Minor Changes

- 7804597: Permission rules can now be added for the Catalog plugin through the `CatalogPermissionExtensionPoint` interface.

### Patch Changes

- 50ee804: Wrap single `pipelineLoop` of TaskPipeline in a span for better traces
- a168507: Deprecated `EntitiesSearchFilter` and `EntityFilter`, which can now be imported from `@backstage/plugin-catalog-node` instead
- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0-next.2
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.12-next.2
  - @backstage/backend-openapi-utils@0.1.1-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-events-node@0.2.17-next.2
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.2

## 1.15.1-next.1

### Patch Changes

- 38340678c3: Update the OpenAPI spec to support the use of `openapi-generator`.
- 7123c58b3d: Updated dependency `@types/glob` to `^8.0.0`.
- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-openapi-utils@0.1.1-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-events-node@0.2.17-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.12-next.1

## 1.15.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-openapi-utils@0.1.1-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/integration@1.8.0-next.0
  - @backstage/plugin-auth-node@0.4.2-next.0
  - @backstage/plugin-catalog-node@1.5.1-next.0
  - @backstage/plugin-permission-node@0.7.19-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.12-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-events-node@0.2.17-next.0
  - @backstage/plugin-permission-common@0.7.10

## 1.15.0

### Minor Changes

- e5bf3749ad: Support adding location analyzers in new catalog analysis extension point and move `AnalyzeOptions` and `ScmLocationAnalyzer` types to `@backstage/plugin-catalog-node`
- 8d756968f9: Introduce a new optional config parameter `catalog.stitchingStrategy.mode`,
  which can have the values `'immediate'` (default) and `'deferred'`. The default
  is for stitching to work as it did before this change, which means that it
  happens "in-band" (blocking) immediately when each processing task finishes.
  When set to `'deferred'`, stitching is instead deferred to happen on a separate
  asynchronous worker queue just like processing.

  Deferred stitching should make performance smoother when ingesting large amounts
  of entities, and reduce p99 processing times and repeated over-stitching of
  hot spot entities when fan-out/fan-in in terms of relations is very large. It
  does however also come with some performance cost due to the queuing with how
  much wall-clock time some types of task take.

### Patch Changes

- 6694b369a3: Update the OpenAPI spec with more complete error responses and request bodies using Optic. Also, updates the test cases to use the new `supertest` pass through from `@backstage/backend-openapi-utils`.
- 013611b42e: `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0
  - @backstage/integration@1.7.2
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/catalog-client@1.4.6
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/backend-openapi-utils@0.1.0
  - @backstage/plugin-search-backend-module-catalog@0.1.11
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-events-node@0.2.16
  - @backstage/plugin-permission-node@0.7.18

## 1.15.0-next.2

### Patch Changes

- [#20570](https://github.com/backstage/backstage/pull/20570) [`013611b42e`](https://github.com/backstage/backstage/commit/013611b42ed457fefa9bb85fddf416cf5e0c1f76) Thanks [@freben](https://github.com/freben)! - `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/backend-openapi-utils@0.1.0-next.2
  - @backstage/plugin-auth-node@0.4.1-next.2
  - @backstage/plugin-catalog-node@1.5.0-next.2
  - @backstage/plugin-events-node@0.2.16-next.2
  - @backstage/plugin-permission-node@0.7.18-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.11-next.2

## 1.15.0-next.1

### Minor Changes

- e5bf3749ad: Support adding location analyzers in new catalog analysis extension point and move `AnalyzeOptions` and `ScmLocationAnalyzer` types to `@backstage/plugin-catalog-node`

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0-next.1
  - @backstage/integration@1.7.2-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.11-next.1
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/plugin-auth-node@0.4.1-next.1
  - @backstage/plugin-permission-node@0.7.18-next.1
  - @backstage/backend-openapi-utils@0.1.0-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-events-node@0.2.16-next.1
  - @backstage/plugin-permission-common@0.7.9

## 1.15.0-next.0

### Minor Changes

- 8d756968f9: Introduce a new optional config parameter `catalog.stitchingStrategy.mode`,
  which can have the values `'immediate'` (default) and `'deferred'`. The default
  is for stitching to work as it did before this change, which means that it
  happens "in-band" (blocking) immediately when each processing task finishes.
  When set to `'deferred'`, stitching is instead deferred to happen on a separate
  asynchronous worker queue just like processing.

  Deferred stitching should make performance smoother when ingesting large amounts
  of entities, and reduce p99 processing times and repeated over-stitching of
  hot spot entities when fan-out/fan-in in terms of relations is very large. It
  does however also come with some performance cost due to the queuing with how
  much wall-clock time some types of task take.

### Patch Changes

- 6694b369a3: Update the OpenAPI spec with more complete error responses and request bodies using Optic. Also, updates the test cases to use the new `supertest` pass through from `@backstage/backend-openapi-utils`.
- Updated dependencies
  - @backstage/backend-openapi-utils@0.1.0-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/integration@1.7.1
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1-next.0
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-catalog-node@1.4.8-next.0
  - @backstage/plugin-events-node@0.2.16-next.0
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-permission-node@0.7.18-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.11-next.0

## 1.14.0

### Minor Changes

- 78af9433c8: Instrumenting some missing metrics with `OpenTelemetry`

### Patch Changes

- 7a2e2924c7: Marked the `LocationEntityProcessor` as deprecated, as it is no longer used internally since way back and can even be harmful at this point.
- 0b55f773a7: Removed some unused dependencies
- 348e8c1cdb: Fixes a bug where eagerly deleted entities did not properly trigger re-stitching of entities that they had relations to.
- b97e9790f0: Internal refactors, laying the foundation for later introducing deferred stitching (see #18062).
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-openapi-utils@0.0.5
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-module-catalog@0.1.10
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-events-node@0.2.15
  - @backstage/plugin-permission-common@0.7.9

## 1.14.0-next.2

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-auth-node@0.4.0-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/integration@1.7.1-next.1
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-openapi-utils@0.0.5-next.0
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-catalog-node@1.4.7-next.2
  - @backstage/plugin-permission-node@0.7.17-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.10-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/catalog-client@1.4.5-next.0
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17-next.0
  - @backstage/plugin-events-node@0.2.15-next.2
  - @backstage/plugin-permission-common@0.7.9-next.0

## 1.14.0-next.1

### Patch Changes

- 7a2e2924c7: Marked the `LocationEntityProcessor` as deprecated, as it is no longer used internally since way back and can even be harmful at this point.
- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/plugin-catalog-node@1.4.6-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.9-next.1
  - @backstage/plugin-auth-node@0.3.2-next.1
  - @backstage/plugin-permission-node@0.7.16-next.1
  - @backstage/config@1.1.0
  - @backstage/backend-openapi-utils@0.0.4
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-events-node@0.2.14-next.1
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-scaffolder-common@1.4.1
  - @backstage/plugin-search-common@1.2.6

## 1.14.0-next.0

### Minor Changes

- 78af9433c8: Instrumenting some missing metrics with `OpenTelemetry`

### Patch Changes

- 348e8c1cdb: Fixes a bug where eagerly deleted entities did not properly trigger re-stitching of entities that they had relations to.
- b97e9790f0: Internal refactors, laying the foundation for later introducing deferred stitching (see #18062).
- Updated dependencies
  - @backstage/integration@1.7.1-next.0
  - @backstage/plugin-auth-node@0.3.2-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-openapi-utils@0.0.4
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-catalog-node@1.4.6-next.0
  - @backstage/plugin-events-node@0.2.14-next.0
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-permission-node@0.7.16-next.0
  - @backstage/plugin-scaffolder-common@1.4.1
  - @backstage/plugin-search-backend-module-catalog@0.1.9-next.0
  - @backstage/plugin-search-common@1.2.6

## 1.13.0

### Minor Changes

- 62f448edb0b5: Allow configuring the processing interval in your app-config, under the `catalog.processingInterval` key.
- 09cfc3cf467d: set azure annotation `dev.azure.com/project-repo` in `AnnotateScmSlugEntityProcessor` to find the project and repo information for the repos that contains `dev.azure.com` in the url

### Patch Changes

- 149361e81622: Fix to the `limit` parameter on entity queries.
- 1fd2109739c1: Changed the processing loop task pipeline implementation from recursive to iterative
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

- 0f8a97777489: Update OpenAPI schema to relax the encoding validation of all request parameters.
- 0198aa596fd9: Fixed a link to the frontend Backstage plugin that had pointed to itself.
- 2d32d8a611e3: Fixed validation of the `fullTextFilterFields` query parameter.
- acffa17027b6: Added some examples to the catalog OpenAPI definition
- 45947d3b2759: Fixes an issue where `order` was not a recognized parameter for the `/entities` endpoint.
- 41d1b2d628ea: Fix OpenAPI schema for the facets endpoint
- 618257f3e413: Fix issue with `catalogFileName` not being a required property for `/analyze-location`
- cfc3ca6ce060: Changes needed to support MySQL
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/plugin-search-backend-module-catalog@0.1.7
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/plugin-auth-node@0.3.0
  - @backstage/config@1.1.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.0
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-scaffolder-common@1.4.1
  - @backstage/plugin-search-common@1.2.6
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.7.14
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-catalog-node@1.4.4
  - @backstage/backend-openapi-utils@0.0.4
  - @backstage/plugin-events-node@0.2.12

## 1.13.0-next.3

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
  - @backstage/plugin-search-backend-module-catalog@0.1.7-next.3
  - @backstage/catalog-client@1.4.4-next.2
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/integration@1.7.0-next.3
  - @backstage/plugin-catalog-common@1.0.16-next.2
  - @backstage/plugin-permission-common@0.7.8-next.2
  - @backstage/plugin-scaffolder-common@1.4.1-next.2
  - @backstage/plugin-search-common@1.2.6-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/plugin-permission-node@0.7.14-next.3
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-openapi-utils@0.0.4-next.0
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-auth-node@0.3.0-next.3
  - @backstage/plugin-catalog-node@1.4.4-next.3
  - @backstage/plugin-events-node@0.2.12-next.3

## 1.13.0-next.2

### Patch Changes

- acffa17027b6: Added some examples to the catalog OpenAPI definition
- 45947d3b2759: Fixes an issue where `order` was not a recognized parameter for the `/entities` endpoint.
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.7-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/backend-openapi-utils@0.0.3
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-events-node@0.2.12-next.2
  - @backstage/plugin-scaffolder-common@1.4.1-next.1
  - @backstage/plugin-search-common@1.2.6-next.1

## 1.13.0-next.1

### Minor Changes

- 62f448edb0b5: Allow configuring the processing interval in your app-config, under the `catalog.processingInterval` key.

### Patch Changes

- 1fd2109739c1: Changed the processing loop task pipeline implementation from recursive to iterative
- 0f8a97777489: Update OpenAPI schema to relax the encoding validation of all request parameters.
- 2d32d8a611e3: Fixed validation of the `fullTextFilterFields` query parameter.
- 618257f3e413: Fix issue with `catalogFileName` not being a required property for `/analyze-location`
- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/integration@1.7.0-next.1
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-auth-node@0.3.0-next.1
  - @backstage/plugin-permission-common@0.7.8-next.0
  - @backstage/plugin-permission-node@0.7.14-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.7-next.1
  - @backstage/plugin-catalog-node@1.4.4-next.1
  - @backstage/plugin-events-node@0.2.12-next.1
  - @backstage/catalog-client@1.4.4-next.0
  - @backstage/plugin-catalog-common@1.0.16-next.0
  - @backstage/plugin-scaffolder-common@1.4.1-next.0
  - @backstage/backend-openapi-utils@0.0.3
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-search-common@1.2.6-next.0

## 1.12.2-next.0

### Patch Changes

- 149361e81622: Fix to the `limit` parameter on entity queries.
- 0198aa596fd9: Fixed a link to the frontend Backstage plugin that had pointed to itself.
- 41d1b2d628ea: Fix OpenAPI schema for the facets endpoint
- cfc3ca6ce060: Changes needed to support MySQL
- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.0
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/integration@1.7.0-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-openapi-utils@0.0.3
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.3-next.0
  - @backstage/plugin-events-node@0.2.11-next.0
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-node@0.7.13-next.0
  - @backstage/plugin-scaffolder-common@1.4.0
  - @backstage/plugin-search-backend-module-catalog@0.1.6-next.0
  - @backstage/plugin-search-common@1.2.5

## 1.12.0

### Minor Changes

- b8cccd8ee858: Support configuring applicable kinds for `AnnotateScmSlugEntityProcessor`
- f32252cdf631: Added OpenTelemetry spans for catalog processing
- ebeb77586975: Now performs request validation based on OpenAPI schema through `@backstage/backend-openapi-utils`. Error responses for invalid input, like `"a"` instead of a number, may have changed.

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- b8d6b22acd57: Internal refactor for load test
- Updated dependencies
  - @backstage/plugin-search-backend-module-catalog@0.1.4
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/backend-openapi-utils@0.0.3
  - @backstage/plugin-catalog-node@1.4.1
  - @backstage/plugin-events-node@0.2.9
  - @backstage/plugin-auth-node@0.2.17
  - @backstage/integration@1.6.0
  - @backstage/backend-tasks@0.5.5
  - @backstage/plugin-scaffolder-common@1.4.0
  - @backstage/plugin-permission-node@0.7.11
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-search-common@1.2.5

## 1.12.0-next.2

### Minor Changes

- b8cccd8ee858: Support configuring applicable kinds for `AnnotateScmSlugEntityProcessor`

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-module-catalog@0.1.4-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-events-node@0.2.9-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## 1.12.0-next.1

### Minor Changes

- f32252cdf631: Added OpenTelemetry spans for catalog processing

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- Updated dependencies
  - @backstage/plugin-search-backend-module-catalog@0.1.4-next.1
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/backend-openapi-utils@0.0.3-next.1
  - @backstage/plugin-catalog-node@1.4.1-next.1
  - @backstage/plugin-events-node@0.2.9-next.1
  - @backstage/plugin-auth-node@0.2.17-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/plugin-permission-node@0.7.11-next.1
  - @backstage/integration@1.5.1
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-scaffolder-common@1.3.2
  - @backstage/plugin-search-common@1.2.5

## 1.12.0-next.0

### Minor Changes

- ebeb77586975: Now performs request validation based on OpenAPI schema through `@backstage/backend-openapi-utils`. Error responses for invalid input, like `"a"` instead of a number, may have changed.

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.0.3-next.0
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration@1.5.1
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.17-next.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.1-next.0
  - @backstage/plugin-events-node@0.2.9-next.0
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-node@0.7.11-next.0
  - @backstage/plugin-scaffolder-common@1.3.2
  - @backstage/plugin-search-backend-module-catalog@0.1.4-next.0
  - @backstage/plugin-search-common@1.2.5

## 1.11.0

### Minor Changes

- f06f0e46ba88: Support placeholder resolvers in the CatalogPlugin, also moves `PlaceholderResolver` and related types from `@backstage/plugin-catalog-backend` to `@backstage/plugin-catalog-node`.

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/plugin-catalog-node@1.4.0
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/backend-tasks@0.5.4
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-events-node@0.2.8
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-node@0.7.10
  - @backstage/plugin-scaffolder-common@1.3.2
  - @backstage/plugin-search-backend-module-catalog@0.1.3
  - @backstage/plugin-search-common@1.2.5

## 1.11.0-next.0

### Minor Changes

- f06f0e46ba88: Support placeholder resolvers in the CatalogPlugin, also moves `PlaceholderResolver` and related types from `@backstage/plugin-catalog-backend` to `@backstage/plugin-catalog-node`.

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/plugin-catalog-node@1.4.0-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1-next.0
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16-next.0
  - @backstage/plugin-catalog-common@1.0.15-next.0
  - @backstage/plugin-events-node@0.2.8-next.0
  - @backstage/plugin-permission-common@0.7.7-next.0
  - @backstage/plugin-permission-node@0.7.10-next.0
  - @backstage/plugin-scaffolder-common@1.3.2-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.3-next.0
  - @backstage/plugin-search-common@1.2.5-next.0

## 1.10.0

### Minor Changes

- 44c7ad6b8e11: Adds an optional `EventBroker` that is used for sending an event when there are conflicts, with details of the conflict so that it can be handled elsewhere.

### Patch Changes

- 77e04a2d55be: Replace getBearerToken with library function of same
- ee411e7c2623: Update OpenAPI specs to be in line with linting standards.
- b8374d5d93b6: Add a base plate for performance testing of the catalog
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/catalog-client@1.4.2
  - @backstage/types@1.1.0
  - @backstage/integration@1.5.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-auth-node@0.2.15
  - @backstage/plugin-catalog-node@1.3.7
  - @backstage/plugin-permission-node@0.7.9
  - @backstage/plugin-search-backend-module-catalog@0.1.2
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.14
  - @backstage/plugin-events-node@0.2.7
  - @backstage/plugin-permission-common@0.7.6
  - @backstage/plugin-scaffolder-common@1.3.1
  - @backstage/plugin-search-common@1.2.4

## 1.10.0-next.2

### Minor Changes

- 44c7ad6b8e11: Adds an optional `EventBroker` that is used for sending an event when there are conflicts, with details of the conflict so that it can be handled elsewhere.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/catalog-client@1.4.2-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/integration@1.5.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.2
  - @backstage/plugin-catalog-common@1.0.14-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.2
  - @backstage/plugin-events-node@0.2.7-next.2
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/plugin-permission-node@0.7.9-next.2
  - @backstage/plugin-scaffolder-common@1.3.1-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.2-next.2
  - @backstage/plugin-search-common@1.2.4-next.0

## 1.9.2-next.1

### Patch Changes

- 77e04a2d55be: Replace getBearerToken with library function of same
- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/integration@1.5.0-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-auth-node@0.2.15-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.1
  - @backstage/plugin-permission-node@0.7.9-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.2-next.1
  - @backstage/catalog-client@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/plugin-catalog-common@1.0.14-next.0
  - @backstage/plugin-scaffolder-common@1.3.1-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-search-common@1.2.4-next.0

## 1.9.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.2-next.0
  - @backstage/plugin-catalog-node@1.3.7-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.2-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/integration@1.4.5
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-permission-node@0.7.9-next.0
  - @backstage/plugin-scaffolder-common@1.3.0
  - @backstage/plugin-search-common@1.2.3

## 1.9.1

### Patch Changes

- ce8d203235b: Ensure that entity cache state is only written to the database when actually changed
- 485a6c5f7b5: Internal refactoring for performance in the service handlers
- 3587a968dcd: Fixed a bug in the `queryEntities` endpoint that was causing filtered entities to be included in cursor requests.
- ce335df9d1c: Improve the query for orphan pruning
- 27956d78671: Adjusted the OpenAPI schema file name according to the new structure
- 51064e6e5ee: Change orphan cleanup task to only log a message if it deleted entities.
- 12a345317ab: Remove unnecessary join in the entity facets endpoint, exclude nulls
- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/integration@1.4.5
  - @backstage/plugin-scaffolder-common@1.3.0
  - @backstage/plugin-permission-node@0.7.8
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-catalog-node@1.3.6
  - @backstage/plugin-search-backend-module-catalog@0.1.1
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-search-common@1.2.3

## 1.9.1-next.2

### Patch Changes

- ce8d203235b: Ensure that entity cache state is only written to the database when actually changed
- 485a6c5f7b5: Internal refactoring for performance in the service handlers
- 3587a968dcd: Fixed a bug in the `queryEntities` endpoint that was causing filtered entities to be included in cursor requests.
- 12a345317ab: Remove unnecessary join in the entity facets endpoint, exclude nulls
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.3.0-next.0
  - @backstage/config@1.0.7

## 1.9.1-next.1

### Patch Changes

- 27956d78671: Adjusted the OpenAPI schema file name according to the new structure
- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.1-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 1.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/integration@1.4.5-next.0
  - @backstage/plugin-permission-node@0.7.8-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-catalog-node@1.3.6-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.1-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-scaffolder-common@1.2.7
  - @backstage/plugin-search-common@1.2.3

## 1.9.0

### Minor Changes

- 329b63f4dab: The catalog now has a new, optional `catalog.orphanStrategy` app-config parameter, which can have the string values `'keep'` (default) or `'delete'`.

  If set to `'keep'` or left unset, the old behavior is maintained of keeping orphaned entities around until manually deleted.

  If set to `'delete'`, the catalog will attempt to automatically clean out orphaned entities without manual intervention. Note that there are no guarantees that this process is instantaneous, so there may be some delay before orphaned items disappear.

  For context, the [Life of an Entity](https://backstage.io/docs/features/software-catalog/life-of-an-entity/#orphaning) article goes into some more details on how the nature of orphaning works.

  To enable the new behavior, you will need to pass the plugin task scheduler to your catalog backend builder. If your code already looks like this, you don't need to change it:

  ```ts
  // in packages/backend/src/plugins/catalog.ts
  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const builder = await CatalogBuilder.create(env);
  ```

  But if you pass things into the catalog builder one by one, you'll need to add the new field:

  ```diff
   // in packages/backend/src/plugins/catalog.ts
     const builder = await CatalogBuilder.create({
       // ... other dependencies
  +    scheduler: env.scheduler,
     });
  ```

  Finally adjust your app-config:

  ```yaml
  catalog:
    orphanStrategy: delete
  ```

- 92a4590fc3a: Add monorepo support to CodeOwnersProccesor.

### Patch Changes

- 62a725e3a94: Use the `LocationSpec` type from the `catalog-common` package in place of the deprecated `LocationSpec` from the `catalog-node` package.
- be5aca50114: Updates and moves OpenAPI spec to `src/schema/openapi.yaml` and uses `ApiRouter` type from `@backstage/backend-openapi-utils` to handle automatic types from the OpenAPI spec file.
- c9a0fdcd2c8: Fix deprecated types.
- 899ebfd8e02: Add full text search support to the `by-query` endpoint.
- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- c4b846359c0: Allow replacement of the BuiltinKindsEntityProcessor which enables customization of schema validation and connections emitted.
- c36b89f2af3: Fixed bug in the `DefaultCatalogProcessingEngine` where entities that contained multiple different types of relations for the same source entity would not properly trigger stitching for that source entity.
- 01ae205352e: Collator factories instantiated in new backend system modules and now marked as deprecated. Will be continued to be exported publicly until the new backend system is fully rolled out.
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/plugin-scaffolder-common@1.2.7
  - @backstage/catalog-client@1.4.1
  - @backstage/plugin-permission-node@0.7.7
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-search-backend-module-catalog@0.1.0
  - @backstage/integration@1.4.4
  - @backstage/plugin-catalog-node@1.3.5
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-search-common@1.2.3

## 1.9.0-next.3

### Minor Changes

- 92a4590fc3a: Add monorepo support to CodeOwnersProccesor.

### Patch Changes

- be5aca50114: Updates and moves OpenAPI spec to `src/schema/openapi.yaml` and uses `ApiRouter` type from `@backstage/backend-openapi-utils` to handle automatic types from the OpenAPI spec file.
- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/catalog-client@1.4.1-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.1
  - @backstage/plugin-catalog-node@1.3.5-next.3
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-permission-node@0.7.7-next.2
  - @backstage/plugin-scaffolder-common@1.2.7-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.0-next.2
  - @backstage/plugin-search-common@1.2.3-next.0

## 1.8.1-next.2

### Patch Changes

- 62a725e3a94: Use the `LocationSpec` type from the `catalog-common` package in place of the deprecated `LocationSpec` from the `catalog-node` package.
- c36b89f2af3: Fixed bug in the `DefaultCatalogProcessingEngine` where entities that contained multiple different types of relations for the same source entity would not properly trigger stitching for that source entity.
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/catalog-client@1.4.1-next.0
  - @backstage/plugin-permission-node@0.7.7-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.2
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-scaffolder-common@1.2.7-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.0-next.1
  - @backstage/plugin-search-common@1.2.3-next.0

## 1.8.1-next.1

### Patch Changes

- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- c4b846359c0: Allow replacement of the BuiltinKindsEntityProcessor which enables customization of schema validation and connections emitted.
- 01ae205352e: Collator factories instantiated in new backend system modules and now marked as deprecated. Will be continued to be exported publicly until the new backend system is fully rolled out.
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.2.7-next.1
  - @backstage/plugin-permission-node@0.7.7-next.1
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-search-backend-module-catalog@0.1.0-next.0
  - @backstage/integration@1.4.4-next.0
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.1
  - @backstage/plugin-search-common@1.2.3-next.0

## 1.8.1-next.0

### Patch Changes

- c9a0fdcd2c8: Fix deprecated types.
- 899ebfd8e02: Add full text search support to the `by-query` endpoint.
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.2.7-next.0
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/plugin-catalog-node@1.3.5-next.0
  - @backstage/plugin-permission-common@0.7.4
  - @backstage/plugin-permission-node@0.7.7-next.0
  - @backstage/plugin-search-common@1.2.2

## 1.8.0

### Minor Changes

- 7f4ea3d3602: Add /entities/by-query endpoint returning paginated entities.

  The endpoint supports cursor base pagination and server side sorting of the entities

### Patch Changes

- e675f902980: Add deprecations for symbols that were moved to `@backstage/plugin-catalog-node` a long time ago:

  - `CatalogProcessor`
  - `CatalogProcessorCache`
  - `CatalogProcessorEmit`
  - `CatalogProcessorEntityResult`
  - `CatalogProcessorErrorResult`
  - `CatalogProcessorLocationResult`
  - `CatalogProcessorParser`
  - `CatalogProcessorRefreshKeysResult`
  - `CatalogProcessorRelationResult`
  - `CatalogProcessorResult`
  - `DeferredEntity`
  - `EntityProvider`
  - `EntityProviderConnection`
  - `EntityProviderMutation`
  - `EntityRelationSpec`
  - `processingResult`

  Also moved over and deprecated the following symbols:

  - `locationSpecToLocationEntity`
  - `locationSpecToMetadataName`

- ac8929f2f31: Fix export of `defaultCatalogCollatorEntityTransformer`.
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- f093ce83d58: Fix a bug where the batch fetch by ref endpoint did not work in conjunction with filtering (e.g. if authorization was enabled).
- Updated dependencies
  - @backstage/catalog-client@1.4.0
  - @backstage/plugin-permission-node@0.7.6
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.4
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/integration@1.4.3
  - @backstage/plugin-permission-common@0.7.4
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.6
  - @backstage/plugin-search-common@1.2.2

## 1.8.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-permission-node@0.7.6-next.2
  - @backstage/plugin-catalog-node@1.3.4-next.2
  - @backstage/config@1.0.7-next.0
  - @backstage/integration@1.4.3-next.0

## 1.8.0-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- f093ce83d58: Fix a bug where the batch fetch by ref endpoint did not work in conjunction with filtering (e.g. if authorization was enabled).
- Updated dependencies
  - @backstage/plugin-permission-node@0.7.6-next.1
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/catalog-client@1.4.0-next.1
  - @backstage/integration@1.4.3-next.0
  - @backstage/plugin-permission-common@0.7.4-next.0
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.12-next.1
  - @backstage/plugin-catalog-node@1.3.4-next.1
  - @backstage/plugin-scaffolder-common@1.2.6-next.1
  - @backstage/plugin-search-common@1.2.2-next.0

## 1.8.0-next.0

### Minor Changes

- 7f4ea3d360: Add /entities/by-query endpoint returning paginated entities.

  The endpoint supports cursor base pagination and server side sorting of the entities

### Patch Changes

- ac8929f2f3: Fix export of `defaultCatalogCollatorEntityTransformer`.
- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/catalog-client@1.4.0-next.0
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/plugin-catalog-common@1.0.12-next.0
  - @backstage/plugin-catalog-node@1.3.4-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-permission-node@0.7.6-next.0
  - @backstage/plugin-scaffolder-common@1.2.6-next.0
  - @backstage/plugin-search-common@1.2.1

## 1.7.2

### Patch Changes

- 071354eb7d: Add additional validation as security precations for output entities.
- b977c2e69f: Minor improvements to the descriptions provided with permission rules schemas
- 2380506364: The process of adding or modifying fields in the software-catalog search index has been simplified. For more details, see [how to customize fields in the Software Catalog index](https://backstage.io/docs/features/search/how-to-guides#how-to-customize-fields-in-the-software-catalog-index).
- 9573651919: The previous migration that adds the `search.original_value` column may leave some of the entities not updated. Add a migration script to trigger a reprocessing of the entities.
- 9f71a2fd20: Location rule target patterns now also match hidden files, i.e. path components with a leading dot.
- e716946103: Updated usage of the lifecycle service.
- 1aec041c34: Fixed an issue where entities sometimes were not properly deleted during a full mutation.
- 0ff03319be: Updated usage of `createBackendPlugin`.
- fc73f6aae5: Switched the order of reprocessing statements retroactively in migrations. This only improves the experience for those who at a later time perform a large upgrade of an old Backstage installation.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/catalog-model@1.2.0
  - @backstage/plugin-catalog-node@1.3.3
  - @backstage/catalog-client@1.3.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.11
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-permission-node@0.7.5
  - @backstage/plugin-scaffolder-common@1.2.5
  - @backstage/plugin-search-common@1.2.1

## 1.7.2-next.2

### Patch Changes

- e716946103: Updated usage of the lifecycle service.
- 0ff03319be: Updated usage of `createBackendPlugin`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/plugin-catalog-node@1.3.3-next.2
  - @backstage/plugin-permission-node@0.7.5-next.2
  - @backstage/catalog-client@1.3.1-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.11-next.1
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-scaffolder-common@1.2.5-next.1
  - @backstage/plugin-search-common@1.2.1

## 1.7.2-next.1

### Patch Changes

- 2380506364: The process of adding or modifying fields in the software-catalog search index has been simplified. For more details, see [how to customize fields in the Software Catalog index](https://backstage.io/docs/features/search/how-to-guides#how-to-customize-fields-in-the-software-catalog-index).
- 9573651919: The previous migration that adds the `search.original_value` column may leave some of the entities not updated. Add a migration script to trigger a reprocessing of the entities.
- fc73f6aae5: Switched the order of reprocessing statements retroactively in migrations. This only improves the experience for those who at a later time perform a large upgrade of an old Backstage installation.
- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.11-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.1
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-permission-node@0.7.5-next.1
  - @backstage/plugin-scaffolder-common@1.2.5-next.0
  - @backstage/plugin-search-common@1.2.1

## 1.7.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/plugin-catalog-common@1.0.11-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.0
  - @backstage/plugin-scaffolder-common@1.2.5-next.0
  - @backstage/plugin-permission-node@0.7.5-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0

## 1.7.0

### Minor Changes

- f75bf76330: Implemented server side ordering in the entities endpoint

### Patch Changes

- e23f13a573: Enable the `by-refs` endpoint to receive `fields` through the POST body as well as through query parameters.
- f23eef3aa2: Updated dependency `better-sqlite3` to `^8.0.0`.
- d136793ff0: Fixed an issue where internal references in the catalog would stick around for longer than expected, causing entities to not be deleted or orphaned as expected.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/catalog-model@1.1.5
  - @backstage/plugin-scaffolder-common@1.2.4
  - @backstage/catalog-client@1.3.0
  - @backstage/plugin-catalog-node@1.3.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-permission-node@0.7.3
  - @backstage/plugin-search-common@1.2.1

## 1.7.0-next.2

### Patch Changes

- e23f13a573: Enable the `by-refs` endpoint to receive `fields` through the POST body as well as through query parameters.
- f23eef3aa2: Updated dependency `better-sqlite3` to `^8.0.0`.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/catalog-client@1.3.0-next.2
  - @backstage/plugin-catalog-node@1.3.1-next.2
  - @backstage/plugin-permission-node@0.7.3-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-scaffolder-common@1.2.4-next.1
  - @backstage/plugin-search-common@1.2.1-next.0

## 1.7.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-permission-node@0.7.3-next.0
  - @backstage/plugin-scaffolder-common@1.2.4-next.1
  - @backstage/plugin-search-common@1.2.1-next.0

## 1.7.0-next.0

### Minor Changes

- f75bf76330: Implemented server side ordering in the entities endpoint

### Patch Changes

- d136793ff0: Fixed an issue where internal references in the catalog would stick around for longer than expected, causing entities to not be deleted or orphaned as expected.
- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/plugin-scaffolder-common@1.2.4-next.0
  - @backstage/catalog-client@1.3.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.0
  - @backstage/plugin-catalog-node@1.3.1-next.0
  - @backstage/plugin-permission-common@0.7.2
  - @backstage/plugin-permission-node@0.7.2
  - @backstage/plugin-search-common@1.2.0

## 1.6.0

### Minor Changes

- 16891a212c: Added new `POST /entities/by-refs` endpoint, which allows you to efficiently
  batch-fetch entities by their entity ref. This can be useful e.g. in graphql
  resolvers or similar contexts where you need to fetch many entities at the same
  time.
- 273ba3a77f: Deprecated Prometheus metrics in favour of OpenTelemtry metrics.
- c395abb5b2: The catalog no longer stops after the first processor `validateEntityKind`
  method returns `true` when validating entity kind shapes. Instead, it continues
  through all registered processors that have this method, and requires that _at
  least one_ of them returned true.

  The old behavior of stopping early made it harder to extend existing core kinds
  with additional fields, since the `BuiltinKindsEntityProcessor` is always
  present at the top of the processing chain and ensures that your additional
  validation code would never be run.

  This is technically a breaking change, although it should not affect anybody
  under normal circumstances, except if you had problematic validation code that
  you were unaware that it was not being run. That code may now start to exhibit
  those problems.

  If you need to disable this new behavior, `CatalogBuilder` as used in your
  `packages/backend/src/plugins/catalog.ts` file now has a
  `useLegacySingleProcessorValidation()` method to go back to the old behavior.

  ```diff
   const builder = await CatalogBuilder.create(env);
  +builder.useLegacySingleProcessorValidation();
  ```

- 3072ebfdd7: The search table also holds the original entity value now and the facets endpoint fetches the filtered entity data from the search table.

### Patch Changes

- ba13ff663c: Added a new `catalog.rules[].location` configuration that makes it possible to configure catalog rules to only apply to specific locations, either via exact match or a glob pattern.
- d8593ce0e6: Do not use deprecated `LocationSpec` from the `@backstage/plugin-catalog-node` package
- c507aee8a2: Ensured typescript type checks in migration files.
- 2a8e3cc0b5: Optimize `Stitcher` process to be more memory efficient
- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- eacc8e2b55: Make it possible for entity providers to supply only entity refs, instead of full entities, in `delta` mutation deletions.
- b05dcd5530: Move the `zod` dependency to a version that does not collide with other libraries
- 5b3e2afa45: Fixed deprecated use of `substr` into `substring`.
- 71147d5c16: Internal code reorganization.
- 93870e4df1: Track the last time the final entity changed with new timestamp "last updated at" data in final entities database, which gets updated with the time when final entity is updated.
- 20a5161f04: Adds MySQL support for the catalog-backend
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- e982f77fe3: Registered shutdown hook in experimental catalog plugin.
- b3fac9c107: Ignore attempts at emitting the current entity as a child of itself.
- Updated dependencies
  - @backstage/catalog-client@1.2.0
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-catalog-node@1.3.0
  - @backstage/plugin-permission-common@0.7.2
  - @backstage/plugin-permission-node@0.7.2
  - @backstage/errors@1.1.4
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/plugin-search-common@1.2.0
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5
  - @backstage/plugin-catalog-common@1.0.9
  - @backstage/plugin-scaffolder-common@1.2.3

## 1.6.0-next.3

### Patch Changes

- ba13ff663c: Added a new `catalog.rules[].location` configuration that makes it possible to configure catalog rules to only apply to specific locations, either via exact match or a glob pattern.
- b05dcd5530: Move the `zod` dependency to a version that does not collide with other libraries
- 71147d5c16: Internal code reorganization.
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.2-next.2
  - @backstage/plugin-permission-node@0.7.2-next.3
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.3
  - @backstage/plugin-catalog-node@1.3.0-next.3
  - @backstage/plugin-scaffolder-common@1.2.3-next.1
  - @backstage/plugin-search-common@1.2.0-next.3

## 1.6.0-next.2

### Minor Changes

- 3072ebfdd7: The search table also holds the original entity value now and the facets endpoint fetches the filtered entity data from the search table.

### Patch Changes

- c507aee8a2: Ensured typescript type checks in migration files.
- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- eacc8e2b55: Make it possible for entity providers to supply only entity refs, instead of full entities, in `delta` mutation deletions.
- 20a5161f04: Adds MySQL support for the catalog-backend
- Updated dependencies
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/plugin-search-common@1.2.0-next.2
  - @backstage/plugin-permission-node@0.7.2-next.2
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.2
  - @backstage/plugin-permission-common@0.7.2-next.1
  - @backstage/plugin-scaffolder-common@1.2.3-next.1

## 1.6.0-next.1

### Minor Changes

- c395abb5b2: The catalog no longer stops after the first processor `validateEntityKind`
  method returns `true` when validating entity kind shapes. Instead, it continues
  through all registered processors that have this method, and requires that _at
  least one_ of them returned true.

  The old behavior of stopping early made it harder to extend existing core kinds
  with additional fields, since the `BuiltinKindsEntityProcessor` is always
  present at the top of the processing chain and ensures that your additional
  validation code would never be run.

  This is technically a breaking change, although it should not affect anybody
  under normal circumstances, except if you had problematic validation code that
  you were unaware that it was not being run. That code may now start to exhibit
  those problems.

  If you need to disable this new behavior, `CatalogBuilder` as used in your
  `packages/backend/src/plugins/catalog.ts` file now has a
  `useLegacySingleProcessorValidation()` method to go back to the old behavior.

  ```diff
   const builder = await CatalogBuilder.create(env);
  +builder.useLegacySingleProcessorValidation();
  ```

### Patch Changes

- 2a8e3cc0b5: Optimize `Stitcher` process to be more memory efficient
- 5b3e2afa45: Fixed deprecated use of `substr` into `substring`.
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/plugin-catalog-node@1.2.2-next.1
  - @backstage/plugin-permission-node@0.7.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1
  - @backstage/plugin-scaffolder-common@1.2.3-next.1
  - @backstage/plugin-search-common@1.1.2-next.1

## 1.6.0-next.0

### Minor Changes

- 16891a212c: Added new `POST /entities/by-refs` endpoint, which allows you to efficiently
  batch-fetch entities by their entity ref. This can be useful e.g. in graphql
  resolvers or similar contexts where you need to fetch many entities at the same
  time.

### Patch Changes

- d8593ce0e6: Do not use deprecated `LocationSpec` from the `@backstage/plugin-catalog-node` package
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- e982f77fe3: Registered shutdown hook in experimental catalog plugin.
- Updated dependencies
  - @backstage/catalog-client@1.2.0-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/integration@1.4.1-next.0
  - @backstage/plugin-permission-common@0.7.2-next.0
  - @backstage/plugin-permission-node@0.7.2-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/plugin-catalog-node@1.2.2-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0
  - @backstage/plugin-catalog-common@1.0.9-next.0
  - @backstage/plugin-scaffolder-common@1.2.3-next.0
  - @backstage/plugin-search-common@1.1.2-next.0

## 1.5.1

### Patch Changes

- c1a4addda3: Improve processing error logging.

  Adds `location` and `owner` to the logging meta if they are available.

- a7607b5413: Replace usage of deprecataed `UrlReader.read` with `UrlReader.readUrl`.
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/integration@1.4.0
  - @backstage/catalog-model@1.1.3
  - @backstage/plugin-permission-common@0.7.1
  - @backstage/types@1.0.1
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/plugin-catalog-node@1.2.1
  - @backstage/plugin-permission-node@0.7.1
  - @backstage/catalog-client@1.1.2
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3
  - @backstage/plugin-catalog-common@1.0.8
  - @backstage/plugin-scaffolder-common@1.2.2
  - @backstage/plugin-search-common@1.1.1

## 1.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/plugin-catalog-node@1.2.1-next.1
  - @backstage/plugin-permission-node@0.7.1-next.1
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/plugin-catalog-common@1.0.8-next.0
  - @backstage/plugin-permission-common@0.7.1-next.0
  - @backstage/plugin-scaffolder-common@1.2.2-next.0
  - @backstage/plugin-search-common@1.1.1-next.0

## 1.5.1-next.0

### Patch Changes

- a7607b5413: Replace usage of deprecataed `UrlReader.read` with `UrlReader.readUrl`.
- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/plugin-permission-common@0.7.1-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/plugin-catalog-node@1.2.1-next.0
  - @backstage/plugin-permission-node@0.7.1-next.0
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/plugin-catalog-common@1.0.8-next.0
  - @backstage/plugin-scaffolder-common@1.2.2-next.0
  - @backstage/plugin-search-common@1.1.1-next.0

## 1.5.0

### Minor Changes

- b2e6cb6acf: Added a new method `addLocationAnalyzers` to the `CatalogBuilder`. With this you can add location analyzers to your catalog. These analyzers will be used by the /analyze-location endpoint to decide if the provided URL contains any catalog-info.yaml files already or not.

  Moved the following types from this package to `@backstage/plugin-catalog-backend`.

  - AnalyzeLocationResponse
  - AnalyzeLocationRequest
  - AnalyzeLocationExistingEntity
  - AnalyzeLocationGenerateEntity
  - AnalyzeLocationEntityField

- eb25f7e12d: The exported permission rules and the API of `createCatalogConditionalDecision` have changed to reflect the breaking changes made to the `PermissionRule` type. Note that all involved types are exported from `@backstage/plugin-catalog-backend/alpha`

### Patch Changes

- 8cb6e10105: Fixed a bug where entities provided without a location key would always replace existing entities, rather than updating them.
- 2d3a5f09ab: Use `response.json` rather than `response.send` where appropriate, as outlined in `SECURITY.md`
- 63296ebcd4: Allow Placeholder value to be any value, not only string.
- 74022e0163: Make sure to stitch entities correctly after deletion, to ensure that their relations are updated.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.2.0
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-catalog-common@1.0.7
  - @backstage/plugin-permission-node@0.7.0
  - @backstage/backend-plugin-api@0.1.3
  - @backstage/plugin-permission-common@0.7.0
  - @backstage/catalog-client@1.1.1
  - @backstage/plugin-search-common@1.1.0
  - @backstage/plugin-scaffolder-common@1.2.1
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/integration@1.3.2
  - @backstage/types@1.0.0

## 1.5.0-next.2

### Minor Changes

- b2e6cb6acf: Added a new method `addLocationAnalyzers` to the `CatalogBuilder`. With this you can add location analyzers to your catalog. These analyzers will be used by the /analyze-location endpoint to decide if the provided URL contains any catalog-info.yaml files already or not.

  Moved the following types from this package to `@backstage/plugin-catalog-backend`.

  - AnalyzeLocationResponse
  - AnalyzeLocationRequest
  - AnalyzeLocationExistingEntity
  - AnalyzeLocationGenerateEntity
  - AnalyzeLocationEntityField

- eb25f7e12d: The exported permission rules and the API of `createCatalogConditionalDecision` have changed to reflect the breaking changes made to the `PermissionRule` type. Note that all involved types are exported from `@backstage/plugin-catalog-backend/alpha`

### Patch Changes

- 2d3a5f09ab: Use `response.json` rather than `response.send` where appropriate, as outlined in `SECURITY.md`
- Updated dependencies
  - @backstage/plugin-catalog-node@1.2.0-next.2
  - @backstage/plugin-catalog-common@1.0.7-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-permission-common@0.7.0-next.2
  - @backstage/plugin-permission-node@0.7.0-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2
  - @backstage/plugin-search-common@1.1.0-next.2
  - @backstage/catalog-client@1.1.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/types@1.0.0
  - @backstage/plugin-scaffolder-common@1.2.1-next.2

## 1.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.1.1-next.1
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/plugin-search-common@1.1.0-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-common@1.0.7-next.1
  - @backstage/plugin-catalog-node@1.1.1-next.1
  - @backstage/plugin-permission-common@0.6.5-next.1
  - @backstage/plugin-permission-node@0.6.6-next.1
  - @backstage/plugin-scaffolder-common@1.2.1-next.1

## 1.4.1-next.0

### Patch Changes

- 8cb6e10105: Fixed a bug where entities provided without a location key would always replace existing entities, rather than updating them.
- 63296ebcd4: Allow Placeholder value to be any value, not only string.
- 74022e0163: Make sure to stitch entities correctly after deletion, to ensure that their relations are updated.
- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/backend-plugin-api@0.1.3-next.0
  - @backstage/catalog-client@1.1.1-next.0
  - @backstage/plugin-catalog-node@1.1.1-next.0
  - @backstage/plugin-scaffolder-common@1.2.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/plugin-permission-node@0.6.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-common@1.0.7-next.0
  - @backstage/plugin-permission-common@0.6.5-next.0
  - @backstage/plugin-search-common@1.0.2-next.0

## 1.4.0

### Minor Changes

- dd395335bc: Allow unknown typed location from being registered via the location service by configuration settings
- 651c9d6800: The search index now does retain fields that have a very long value, but in the form of just a null. This makes it possible to at least filter for their existence.
- 6e63bc43f2: Added the `refresh` function to the Connection of the entity providers.

### Patch Changes

- eadf56bbbf: Bump `git-url-parse` version to `^13.0.0`
- 07dda0b746: Add optional value to `hasAnnotation` permission rule
- 243533ecdc: Added support to mysql on some raw queries
- ce77e78c93: Fixes a bug to be able to utilize refresh keys after the entity is loaded from cache
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 679f7c5e95: Include entity ref into error message when catalog policies fail
- 06e2b077a1: Limit the length of error messages that get written to the database and logs - to prevent performance issues
- 62788b2ee8: The experimental `CatalogProcessingExtensionPoint` now accepts multiple providers and processors at once.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-permission-node@0.6.5
  - @backstage/plugin-catalog-node@1.1.0
  - @backstage/integration@1.3.1
  - @backstage/catalog-client@1.1.0
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1
  - @backstage/plugin-permission-common@0.6.4
  - @backstage/plugin-scaffolder-common@1.2.0
  - @backstage/plugin-catalog-common@1.0.6
  - @backstage/plugin-search-common@1.0.1

## 1.4.0-next.3

### Minor Changes

- 6e63bc43f2: Added the `refresh` function to the Connection of the entity providers.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.1.0-next.2
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/catalog-client@1.1.0-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/plugin-permission-common@0.6.4-next.2
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/plugin-scaffolder-common@1.2.0-next.1
  - @backstage/plugin-permission-node@0.6.5-next.3

## 1.4.0-next.2

### Patch Changes

- eadf56bbbf: Bump `git-url-parse` version to `^13.0.0`
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- 06e2b077a1: Limit the length of error messages that get written to the database and logs - to prevent performance issues
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.1
  - @backstage/plugin-catalog-node@1.0.2-next.1
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/integration@1.3.1-next.1
  - @backstage/catalog-client@1.0.5-next.1
  - @backstage/plugin-permission-common@0.6.4-next.1
  - @backstage/plugin-permission-node@0.6.5-next.2

## 1.4.0-next.1

### Minor Changes

- dd395335bc: Allow unknown typed location from being registered via the location service by configuration settings
- 651c9d6800: The search index now does retain fields that have a very long value, but in the form of just a null. This makes it possible to at least filter for their existence.

### Patch Changes

- ce77e78c93: Fixes a bug to be able to utilize refresh keys after the entity is loaded from cache
- 679f7c5e95: Include entity ref into error message when catalog policies fail
- Updated dependencies
  - @backstage/plugin-permission-node@0.6.5-next.1
  - @backstage/backend-common@0.15.1-next.1

## 1.3.2-next.0

### Patch Changes

- 243533ecdc: Added support to mysql on some raw queries
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 62788b2ee8: The experimental `CatalogProcessingExtensionPoint` now accepts multiple providers and processors at once.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-plugin-api@0.1.2-next.0
  - @backstage/catalog-client@1.0.5-next.0
  - @backstage/integration@1.3.1-next.0
  - @backstage/plugin-permission-common@0.6.4-next.0
  - @backstage/plugin-permission-node@0.6.5-next.0
  - @backstage/plugin-scaffolder-common@1.2.0-next.0
  - @backstage/plugin-catalog-node@1.0.2-next.0
  - @backstage/plugin-catalog-common@1.0.6-next.0
  - @backstage/plugin-search-common@1.0.1-next.0

## 1.3.1

### Patch Changes

- 56e1b4b89c: Fixed typos in alpha types.
- e3d3018531: Fix issue for conditional decisions based on properties stored as arrays, like tags.

  Before this change, having a permission policy returning conditional decisions based on metadata like tags, such like `createCatalogConditionalDecision(permission, catalogConditions.hasMetadata('tags', 'java'),)`, was producing wrong results. The issue occurred when authorizing entities already loaded from the database, for example when authorizing `catalogEntityDeletePermission`.

- 059ae348b4: Use the non-deprecated form of table.unique in knex
- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/backend-plugin-api@0.1.1
  - @backstage/plugin-catalog-node@1.0.1
  - @backstage/integration@1.3.0
  - @backstage/plugin-catalog-common@1.0.5
  - @backstage/plugin-permission-node@0.6.4

## 1.3.1-next.2

### Patch Changes

- 059ae348b4: Use the non-deprecated form of table.unique in knex

## 1.3.1-next.1

### Patch Changes

- e3d3018531: Fix issue for conditional decisions based on properties stored as arrays, like tags.

  Before this change, having a permission policy returning conditional decisions based on metadata like tags, such like `createCatalogConditionalDecision(permission, catalogConditions.hasMetadata('tags', 'java'),)`, was producing wrong results. The issue occurred when authorizing entities already loaded from the database, for example when authorizing `catalogEntityDeletePermission`.

- Updated dependencies
  - @backstage/plugin-catalog-common@1.0.5-next.0
  - @backstage/backend-common@0.15.0-next.1
  - @backstage/integration@1.3.0-next.1

## 1.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/integration@1.3.0-next.0
  - @backstage/backend-plugin-api@0.1.1-next.0
  - @backstage/plugin-catalog-node@1.0.1-next.0
  - @backstage/plugin-permission-node@0.6.4-next.0

## 1.3.0

### Minor Changes

- 1dd6c22cc8: Added an option to be able to trigger refreshes on entities based on a prestored arbitrary key.

  The UrlReaderProcessor, FileReaderProcessor got updated to store the absolute URL of the catalog file as a refresh key. In the format of `<type>:<target>`
  The PlaceholderProcessor got updated to store the resolverValues as refreshKeys for the entities.

  The custom resolvers will need to be updated to pass in a `CatalogProcessorEmit` function as parameter and they should be updated to emit their refresh processingResults. You can see the updated resolvers in the `PlaceholderProcessor.ts`

  ```ts
    // yamlPlaceholderResolver
    ...
    const { content, url } = await readTextLocation(params);

    params.emit(processingResult.refresh(`url:${url}`));
    ...
  ```

- 91c1d12123: Export experimental `catalogPlugin` for the new backend system. This export is not considered stable and should not be used in production.

### Patch Changes

- 1e02fe46d6: Fixed bug where catalog metrics weren't being tracked.
- 5f6b847c15: Fix Error Code in Register Component DryRun
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 72622d9143: Updated dependency `yaml` to `^2.0.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- fa0533e604: CatalogBuilder supports now subscription to processing engine errors.

  ```ts
  subscribe(options: {
    onProcessingError: (event: { unprocessedEntity: Entity, error: Error }) => Promise<void> | void;
  });
  ```

  If you want to get notified on errors while processing the entities, you call CatalogBuilder.subscribe
  to get notifications with the parameters defined as above.

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- f1dcc6f3c6: Use entity type predicates from catalog-model
- 9a6aba1d85: Many symbol declarations have been moved to `@backstage/plugin-catalog-node`. This has no affect on users of this package as they are all re-exported. Modules that build on top of the catalog backend plugin should switch all of their imports to the `@backstage/plugin-catalog-node` package and remove the dependency on `@backstage/plugin-catalog-backend`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.0
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0
  - @backstage/plugin-search-common@1.0.0
  - @backstage/plugin-catalog-node@1.0.0
  - @backstage/integration@1.2.2
  - @backstage/catalog-client@1.0.4
  - @backstage/plugin-permission-common@0.6.3
  - @backstage/plugin-permission-node@0.6.3
  - @backstage/errors@1.1.0
  - @backstage/plugin-catalog-common@1.0.4
  - @backstage/plugin-scaffolder-common@1.1.2

## 1.3.0-next.3

### Minor Changes

- 1dd6c22cc8: Added an option to be able to trigger refreshes on entities based on a prestored arbitrary key.

  The UrlReaderProcessor, FileReaderProcessor got updated to store the absolute URL of the catalog file as a refresh key. In the format of `<type>:<target>`
  The PlaceholderProcessor got updated to store the resolverValues as refreshKeys for the entities.

  The custom resolvers will need to be updated to pass in a `CatalogProcessorEmit` function as parameter and they should be updated to emit their refresh processingResults. You can see the updated resolvers in the `PlaceholderProcessor.ts`

  ```ts
    // yamlPlaceholderResolver
    ...
    const { content, url } = await readTextLocation(params);

    params.emit(processingResult.refresh(`url:${url}`));
    ...
  ```

- 91c1d12123: Export experimental `catalogPlugin` for the new backend system. This export is not considered stable and should not be used in production.

### Patch Changes

- 1e02fe46d6: Fixed bug where catalog metrics weren't being tracked.
- 5f6b847c15: Fix Error Code in Register Component DryRun
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 72622d9143: Updated dependency `yaml` to `^2.0.0`.
- fa0533e604: CatalogBuilder supports now subscription to processing engine errors.

  ```ts
  subscribe(options: {
    onProcessingError: (event: { unprocessedEntity: Entity, error: Error }) => Promise<void> | void;
  });
  ```

  If you want to get notified on errors while processing the entities, you call CatalogBuilder.subscribe
  to get notifications with the parameters defined as above.

- 9a6aba1d85: Many symbol declarations have been moved to `@backstage/plugin-catalog-node`. This has no affect on users of this package as they are all re-exported. Modules that build on top of the catalog backend plugin should switch all of their imports to the `@backstage/plugin-catalog-node` package and remove the dependency on `@backstage/plugin-catalog-backend`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.0-next.0
  - @backstage/plugin-catalog-node@1.0.0-next.0
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/catalog-client@1.0.4-next.2
  - @backstage/integration@1.2.2-next.3
  - @backstage/plugin-permission-common@0.6.3-next.1
  - @backstage/plugin-permission-node@0.6.3-next.2
  - @backstage/catalog-model@1.1.0-next.3

## 1.2.1-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
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

## 1.2.1-next.1

### Patch Changes

- f1dcc6f3c6: Use entity type predicates from catalog-model
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/catalog-client@1.0.4-next.1
  - @backstage/integration@1.2.2-next.1
  - @backstage/plugin-catalog-common@1.0.4-next.0
  - @backstage/plugin-permission-common@0.6.3-next.0
  - @backstage/plugin-permission-node@0.6.3-next.1
  - @backstage/plugin-search-common@0.3.6-next.0

## 1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/integration@1.2.2-next.0
  - @backstage/plugin-permission-node@0.6.3-next.0
  - @backstage/catalog-client@1.0.4-next.0
  - @backstage/plugin-scaffolder-common@1.1.2-next.0

## 1.2.0

### Minor Changes

- b594679ae3: Allow array as non-spread arguments at the `CatalogBuilder`.

  ```typescript
  builder.addEntityProvider(...getArrayOfProviders());
  ```

  can be simplified to

  ```typescript
  builder.addEntityProvider(getArrayOfProviders());
  ```

### Patch Changes

- 8838b13038: Disallow anything but `'url'` locations from being registered via the location service.
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.5
  - @backstage/plugin-permission-node@0.6.2
  - @backstage/plugin-catalog-common@1.0.3
  - @backstage/backend-common@0.14.0
  - @backstage/integration@1.2.1
  - @backstage/catalog-client@1.0.3
  - @backstage/plugin-permission-common@0.6.2
  - @backstage/catalog-model@1.0.3
  - @backstage/plugin-scaffolder-common@1.1.1

## 1.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@0.3.5-next.1
  - @backstage/plugin-catalog-common@1.0.3-next.1
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/integration@1.2.1-next.2
  - @backstage/plugin-permission-node@0.6.2-next.2

## 1.2.0-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/catalog-client@1.0.3-next.0
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-permission-common@0.6.2-next.0
  - @backstage/plugin-permission-node@0.6.2-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-catalog-common@1.0.3-next.0
  - @backstage/plugin-search-common@0.3.5-next.0
  - @backstage/plugin-scaffolder-common@1.1.1-next.0

## 1.2.0-next.0

### Minor Changes

- b594679ae3: Allow array as non-spread arguments at the `CatalogBuilder`.

  ```typescript
  builder.addEntityProvider(...getArrayOfProviders());
  ```

  can be simplified to

  ```typescript
  builder.addEntityProvider(getArrayOfProviders());
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/plugin-permission-node@0.6.2-next.0

## 1.1.2

### Patch Changes

- 16a40ac4c0: Fix wrong return type of the `isGroupEntity` function.
- 55e09b29dd: Fixing broken types for `knex` when checking returned rows
- 1ccbe081cc: Minor internal tweak to support TypeScript 4.6
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- 2909746147: Updated parseEntityTransformParams to handle keys with '.' in them. This will allow for querying of entities based off annotations such as 'backstage.io/orgin-location' or other entity field keys that have '.' in them.
- 8cc75993a6: Fixed issue in `PermissionEvaluator` instance check that would cause unexpected "invalid union" errors.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/integration@1.2.0
  - @backstage/plugin-scaffolder-common@1.1.0
  - @backstage/config@1.0.1
  - @backstage/plugin-search-common@0.3.4
  - @backstage/catalog-client@1.0.2
  - @backstage/catalog-model@1.0.2
  - @backstage/plugin-catalog-common@1.0.2
  - @backstage/plugin-permission-common@0.6.1
  - @backstage/plugin-permission-node@0.6.1

## 1.1.2-next.2

### Patch Changes

- 16a40ac4c0: Fix wrong return type of the `isGroupEntity` function.
- 2909746147: Updated parseEntityTransformParams to handle keys with '.' in them. This will allow for querying of entities based off annotations such as 'backstage.io/orgin-location' or other entity field keys that have '.' in them.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-scaffolder-common@1.1.0-next.0
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.4-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/integration@1.2.0-next.1
  - @backstage/plugin-permission-common@0.6.1-next.0
  - @backstage/plugin-permission-node@0.6.1-next.1
  - @backstage/catalog-client@1.0.2-next.0
  - @backstage/plugin-catalog-common@1.0.2-next.0

## 1.1.2-next.1

### Patch Changes

- 1ccbe081cc: Minor internal tweak to support TypeScript 4.6
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.1

## 1.1.2-next.0

### Patch Changes

- 55e09b29dd: Fixing broken types for `knex` when checking returned rows
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- 8cc75993a6: Fixed issue in `PermissionEvaluator` instance check that would cause unexpected "invalid union" errors.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/integration@1.2.0-next.0
  - @backstage/plugin-permission-node@0.6.1-next.0

## 1.1.0

### Minor Changes

- 8012ac46a0: **BREAKING (alpha api):** Replace `createCatalogPolicyDecision` export with `createCatalogConditionalDecision`, which accepts a permission parameter of type `ResourcePermission<'catalog-entity'>` along with conditions. The permission passed is expected to be the handled permission in `PermissionPolicy#handle`, whose type must first be narrowed using methods like `isPermission` and `isResourcePermission`:

  ```typescript
  class TestPermissionPolicy implements PermissionPolicy {
    async handle(
      request: PolicyQuery<Permission>,
      _user?: BackstageIdentityResponse,
    ): Promise<PolicyDecision> {
      if (
        // Narrow type of `request.permission` to `ResourcePermission<'catalog-entity'>
        isResourcePermission(request.permission, RESOURCE_TYPE_CATALOG_ENTITY)
      ) {
        return createCatalogConditionalDecision(
          request.permission,
          catalogConditions.isEntityOwner(
            _user?.identity.ownershipEntityRefs ?? [],
          ),
        );
      }

      return {
        result: AuthorizeResult.ALLOW,
      };
  ```

- 8012ac46a0: **BREAKING:** Mark CatalogBuilder#addPermissionRules as @alpha.
- fb02d2d94d: export `locationSpecToLocationEntity`
- bf82edf4c9: Added `/validate-entity` endpoint

### Patch Changes

- ada4446733: Specify type of `visibilityPermission` property on collators and collator factories.
- 1691c6c5c2: Clarify that config locations that emit User and Group kinds now need to declare so in the `catalog.locations.[].rules`
- 8592cacfd3: Fixed an issue where sometimes entities would have stale relations "stuck" and
  not getting removed as expected, after the other end of the relation had stopped
  referring to them.
- 23646e51a5: Use new `PermissionEvaluator#authorizeConditional` method when retrieving permission conditions.
- 9fe24b0fc8: Adjust the error messages when entities fail validation, to clearly state what entity that failed it
- 48405ed232: Added `spec.profile.displayName` to search index for Group kinds
- 95408dbe99: Enable internal batching of very large deletions, to not run into SQL binding limits
- 8012ac46a0: Handle changes to @alpha permission-related types.

  - All exported permission rules and conditions now have a `resourceType`.
  - `createCatalogConditionalDecision` now expects supplied conditions to have the appropriate `resourceType`.
  - `createCatalogPermissionRule` now expects `resourceType` as part of the supplied rule object.
  - Introduce new `CatalogPermissionRule` convenience type.

- ffec894ed0: add gitlab to AnnotateScmSlugEntityProcessor
- Updated dependencies
  - @backstage/integration@1.1.0
  - @backstage/plugin-permission-common@0.6.0
  - @backstage/plugin-permission-node@0.6.0
  - @backstage/catalog-model@1.0.1
  - @backstage/plugin-search-common@0.3.3
  - @backstage/backend-common@0.13.2
  - @backstage/plugin-catalog-common@1.0.1
  - @backstage/catalog-client@1.0.1
  - @backstage/plugin-scaffolder-common@1.0.1

## 1.1.0-next.3

### Patch Changes

- 23646e51a5: Use new `PermissionEvaluator#authorizeConditional` method when retrieving permission conditions.
- 48405ed232: Added `spec.profile.displayName` to search index for Group kinds
- Updated dependencies
  - @backstage/plugin-permission-common@0.6.0-next.1
  - @backstage/plugin-permission-node@0.6.0-next.2
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/integration@1.1.0-next.2

## 1.1.0-next.2

### Minor Changes

- bf82edf4c9: Added `/validate-entity` endpoint

### Patch Changes

- 8592cacfd3: Fixed an issue where sometimes entities would have stale relations "stuck" and
  not getting removed as expected, after the other end of the relation had stopped
  referring to them.
- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.1

## 1.1.0-next.1

### Minor Changes

- 8012ac46a0: **BREAKING (alpha api):** Replace `createCatalogPolicyDecision` export with `createCatalogConditionalDecision`, which accepts a permission parameter of type `ResourcePermission<'catalog-entity'>` along with conditions. The permission passed is expected to be the handled permission in `PermissionPolicy#handle`, whose type must first be narrowed using methods like `isPermission` and `isResourcePermission`:

  ```typescript
  class TestPermissionPolicy implements PermissionPolicy {
    async handle(
      request: PolicyQuery<Permission>,
      _user?: BackstageIdentityResponse,
    ): Promise<PolicyDecision> {
      if (
        // Narrow type of `request.permission` to `ResourcePermission<'catalog-entity'>
        isResourcePermission(request.permission, RESOURCE_TYPE_CATALOG_ENTITY)
      ) {
        return createCatalogConditionalDecision(
          request.permission,
          catalogConditions.isEntityOwner(
            _user?.identity.ownershipEntityRefs ?? [],
          ),
        );
      }

      return {
        result: AuthorizeResult.ALLOW,
      };
  ```

- 8012ac46a0: **BREAKING:** Mark CatalogBuilder#addPermissionRules as @alpha.
- fb02d2d94d: export `locationSpecToLocationEntity`

### Patch Changes

- ada4446733: Specify type of `visibilityPermission` property on collators and collator factories.
- 1691c6c5c2: Clarify that config locations that emit User and Group kinds now need to declare so in the `catalog.locations.[].rules`
- 8012ac46a0: Handle changes to @alpha permission-related types.

  - All exported permission rules and conditions now have a `resourceType`.
  - `createCatalogConditionalDecision` now expects supplied conditions to have the appropriate `resourceType`.
  - `createCatalogPermissionRule` now expects `resourceType` as part of the supplied rule object.
  - Introduce new `CatalogPermissionRule` convenience type.

- Updated dependencies
  - @backstage/integration@1.1.0-next.1
  - @backstage/plugin-permission-common@0.6.0-next.0
  - @backstage/plugin-permission-node@0.6.0-next.1
  - @backstage/plugin-catalog-common@1.0.1-next.1
  - @backstage/backend-common@0.13.2-next.1
  - @backstage/plugin-search-common@0.3.3-next.1

## 1.0.1-next.0

### Patch Changes

- 9fe24b0fc8: Adjust the error messages when entities fail validation, to clearly state what entity that failed it
- 95408dbe99: Enable internal batching of very large deletions, to not run into SQL binding limits
- ffec894ed0: add gitlab to AnnotateScmSlugEntityProcessor
- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.3-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/integration@1.0.1-next.0
  - @backstage/catalog-client@1.0.1-next.0
  - @backstage/plugin-scaffolder-common@1.0.1-next.0
  - @backstage/plugin-permission-node@0.5.6-next.0
  - @backstage/plugin-catalog-common@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Minor Changes

- 6145ca7189: **BREAKING**: A number of types and classes have been removed, without a prior deprecation period. These were all very internal, essentially unused by the vast majority of users, and their being exposed was leading to excessive breaking of public interfaces for little-to-zero benefit. So for the 1.0 release of the catalog, the following interface changes have been made (but should have no effect on most users):

  - The return type of `CatalogBuilder.build()` now only has the fields `processingEngine` and `router` which is what most users actually consume; the other three fields (`entitiesCatalog`, `locationAnalyzer`, `locationService`) that see very little use have been removed. If you were relying on the presence of either of these in any way, please [open an issue](https://github.com/backstage/backstage/issues/new/choose) that describes your use case, and we'll see how we could fill the gap.

  - The function `createRouter` is removed; use `CatalogBuilder` as follows instead:

    ```ts
    const builder = await CatalogBuilder.create(env);
    // add things as needed, e.g builder.addProcessor(new ScaffolderEntitiesProcessor());
    const { processingEngine, router } = await builder.build();
    await processingEngine.start();
    return router;
    ```

  - The following types were removed:

    - `CatalogProcessingOrchestrator`
    - `CatalogRule`
    - `CatalogRulesEnforcer`
    - `EntityAncestryResponse`
    - `EntityFacetsRequest`
    - `EntityFacetsResponse`
    - `EntityPagination`
    - `EntityProcessingRequest`
    - `EntityProcessingResult`
    - `EntitiesCatalog`
    - `EntitiesRequest`
    - `EntitiesResponse`
    - `LocationService`
    - `LocationInput`
    - `LocationStore`
    - `PageInfo`
    - `RefreshOptions`
    - `RefreshService`
    - `RouterOptions`

  - The following classes were removed:

    - `DefaultCatalogProcessingOrchestrator`
    - `DefaultCatalogRulesEnforcer`

- 02ad19d189: **BREAKING**: Removed the deprecated `metadata.generation` field entirely. It is no longer present in TS types, nor in the REST API output. Entities that have not yet been re-stitched may still have the field present for some time, but it will get phased out gradually by your catalog instance.
- 7250b6993d: **BREAKING**: Removed the previously deprecated `results` export. Please use `processingResult` instead.
- 077e7c132f: **BREAKING**: Removed the following deprecated symbols:

  - `catalogBuilder.setRefreshInterval`, use `catalogBuilder.setProcessingInterval` instead.
  - `catalogBuilder.setRefreshIntervalSeconds`, use `catalogBuilder.setProcessingIntervalSeconds` instead.
  - `createRandomRefreshInterval`, use `createRandomProcessingInterval` instead.
  - `RefreshIntervalFunction`, use `ProcessingIntervalFunction` instead.

- 74375be2c6: **BREAKING**: Removed the export of the `RecursivePartial` utility type. If you relied on this type it can be redefined like this:

  ```ts
  type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
      ? RecursivePartial<U>[]
      : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
  };
  ```

- ced3016f2a: **BREAKING**: The deprecated `CatalogEntityDocument` export has been removed, it can be imported from `@backstage/plugin-catalog-common` instead.
- 0163c41be2: **BREAKING**: Removed the deprecated `presence` field from `LocationInput`.
- d3e9ec43b7: **BREAKING**: Removed the `target` property from `EntityRelation`. This field has been replaced by `targetRef`.
  This means that `target: { name: 'team-a', kind: 'group', namespace: 'default' }` is now replaced with `targetRef: 'group:default/team-a'` in entity relations.

  The entities API endpoint still return the old `target` field for to ease transitions, however the future removal of this field will be considered non breaking.

### Patch Changes

- 89c7e47967: Minor README update
- 26fb159a30: Pass in auth token to ancestry endpoint
- efc73db10c: Use `better-sqlite3` instead of `@vscode/sqlite3`
- f24ef7864e: Minor typo fixes
- e949d68059: Made sure to move the catalog-related github and ldap config into their right places
- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/plugin-scaffolder-common@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/catalog-client@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-common@1.0.0
  - @backstage/plugin-permission-common@0.5.3
  - @backstage/plugin-permission-node@0.5.5
  - @backstage/plugin-search-common@0.3.2

## 0.24.0

### Minor Changes

- 66ba5d9023: **BREAKING**: Removed `GithubDiscoveryProcessor`, `GithubMultiOrgReaderProcessor`, `GitHubOrgEntityProvider`, `GithubOrgReaderProcessor`, and `GithubMultiOrgConfig` which now instead should be imported from `@backstage/plugin-catalog-backend-module-github`. NOTE THAT the `GithubDiscoveryProcessor` and `GithubOrgReaderProcessor` were part of the default set of processors in the catalog backend, and if you are a user of discovery or location based org ingestion on GitLab, you MUST now add them manually in the catalog initialization code of your backend.

  ```diff
  // In packages/backend/src/plugins/catalog.ts
  +import {
  +  GithubDiscoveryProcessor,
  +  GithubOrgReaderProcessor,
  +} from '@backstage/plugin-catalog-backend-module-github';
  +import {
  +  ScmIntegrations,
  +  DefaultGithubCredentialsProvider
  +} from '@backstage/integration';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  const integrations = ScmIntegrations.fromConfig(config);
  +  const githubCredentialsProvider =
  +    DefaultGithubCredentialsProvider.fromIntegrations(integrations);
  +  builder.addProcessor(
  +    GithubDiscoveryProcessor.fromConfig(config, {
  +      logger,
  +      githubCredentialsProvider,
  +    }),
  +    GithubOrgReaderProcessor.fromConfig(config, {
  +      logger,
  +      githubCredentialsProvider,
  +    }),
  +  );
  ```

  **BREAKING**: Removed `GitLabDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-gitlab`. NOTE THAT this processor was part of the default set of processors in the catalog backend, and if you are a user of discovery on GitLab, you MUST now add it manually in the catalog initialization code of your backend.

  ```diff
  // In packages/backend/src/plugins/catalog.ts
  +import { GitLabDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-gitlab';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  builder.addProcessor(
  +    GitLabDiscoveryProcessor.fromConfig(env.config, { logger: env.logger })
  +  );
  ```

  **BREAKING**: Removed `BitbucketDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-bitbucket`. NOTE THAT this processor was part of the default set of processors in the catalog backend, and if you are a user of discovery on Bitbucket, you MUST now add it manually in the catalog initialization code of your backend.

  ```diff
  // In packages/backend/src/plugins/catalog.ts
  +import { BitbucketDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-bitbucket';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  builder.addProcessor(
  +    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger })
  +  );
  ```

  **BREAKING**: Removed `AzureDevOpsDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-azure`. This processor was not part of the set of default processors. If you were using it, you should already have a reference to it in your backend code and only need to update the import.

  **BREAKING**: Removed the formerly deprecated type `BitbucketRepositoryParser`, which is instead reintroduced in `@backstage/plugin-catalog-backend-module-bitbucket`.

- f115a7f8fd: **BREAKING**: Removed `AwsS3DiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-aws`.
- 55150919ed: - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 616f02ade2: support Bitbucket Cloud's code search to discover catalog files (multiple per repo, Location entities for existing files only)
- e421d77536: **BREAKING**:

  - Removed the previously deprecated `runPeriodically` export. Please use the `@backstage/backend-tasks` package instead, or copy [the actual implementation](https://github.com/backstage/backstage/blob/02875d4d56708c60f86f6b0a5b3da82e24988354/plugins/catalog-backend/src/util/runPeriodically.ts#L29) into your own code if you explicitly do not want coordination of task runs across your worker nodes.
  - Removed the previously deprecated `CatalogProcessorLocationResult.optional` field. Please set the corresponding `LocationSpec.presence` field to `'optional'` instead.
  - Related to the previous point, the `processingResult.location` function no longer has a second boolean `optional` argument. Please set the corresponding `LocationSpec.presence` field to `'optional'` instead.
  - Removed the previously deprecated `StaticLocationProcessor`. It has not been in use for some time; its functionality is covered by `ConfigLocationEntityProvider` instead.

- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- c1168bb440: Fixed display of the location in the log message that is printed when entity envelope validation fails.
- b1aacbf96a: Applied the fix for the `/alpha` entry point resolution that was part of the `v0.70.1` release of Backstage.
- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-scaffolder-common@0.3.0
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-catalog-common@0.2.2
  - @backstage/plugin-search-common@0.3.1
  - @backstage/catalog-client@0.9.0
  - @backstage/plugin-permission-node@0.5.4

## 0.24.0-next.0

### Minor Changes

- 66ba5d9023: **BREAKING**: Removed `GitLabDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-gitlab`. NOTE THAT this processor was part of the default set of processors in the catalog backend, and if you are a user of discovery on GitLab, you MUST now add it manually in the catalog initialization code of your backend.

  ```diff
  // In packages/backend/src/plugins/catalog.ts
  +import { GitLabDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-gitlab';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  builder.addProcessor(
  +    GitLabDiscoveryProcessor.fromConfig(env.config, { logger: env.logger })
  +  );
  ```

  **BREAKING**: Removed `AzureDevOpsDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-azure`. This processor was not part of the set of default processors. If you were using it, you should already have a reference to it in your backend code and only need to update the import.

- f115a7f8fd: **BREAKING**: Removed `AwsS3DiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-aws`.
- 55150919ed: - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 616f02ade2: support Bitbucket Cloud's code search to discover catalog files (multiple per repo, Location entities for existing files only)
- e421d77536: **BREAKING**:

  - Removed the previously deprecated `runPeriodically` export. Please use the `@backstage/backend-tasks` package instead, or copy [the actual implementation](https://github.com/backstage/backstage/blob/02875d4d56708c60f86f6b0a5b3da82e24988354/plugins/catalog-backend/src/util/runPeriodically.ts#L29) into your own code if you explicitly do not want coordination of task runs across your worker nodes.
  - Removed the previously deprecated `CatalogProcessorLocationResult.optional` field. Please set the corresponding `LocationSpec.presence` field to `'optional'` instead.
  - Related to the previous point, the `processingResult.location` function no longer has a second boolean `optional` argument. Please set the corresponding `LocationSpec.presence` field to `'optional'` instead.
  - Removed the previously deprecated `StaticLocationProcessor`. It has not been in use for some time; its functionality is covered by `ConfigLocationEntityProvider` instead.

- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- c1168bb440: Fixed display of the location in the log message that is printed when entity envelope validation fails.
- b1aacbf96a: Applied the fix for the `/alpha` entry point resolution that was part of the `v0.70.1` release of Backstage.
- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-scaffolder-common@0.3.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-catalog-common@0.2.2-next.0
  - @backstage/plugin-search-common@0.3.1-next.0
  - @backstage/catalog-client@0.9.0-next.0
  - @backstage/plugin-permission-node@0.5.4-next.0

## 0.23.1

### Patch Changes

- Marked `GithubMultiOrgReaderProcessor` as stable, as it was moved to `/alpha` by mistake.
- Fixed runtime resolution of the `/alpha` entry point.
- Updated dependencies
  - @backstage/backend-common@0.12.1
  - @backstage/catalog-model@0.12.1
  - @backstage/plugin-catalog-common@0.2.1

## 0.23.0

### Minor Changes

- 0c9cf2822d: **Breaking**: Mark permission-related exports as alpha. This means that the exports below should now be imported from `@backstage/plugin-catalog-backend/alpha` instead of `@backstage/plugin-catalog-backend`.

  - `catalogConditions`
  - `createCatalogPolicyDecision`
  - `permissionRules`
  - `createCatalogPermissionRule`

- 862e416239: **Breaking**: Removed `entityRef` from `CatalogProcessorRelationResult`. The field is not used by the catalog and relation information is already available inside the `reation` property.
- c85292b768: **Breaking**: Removed optional `handleError()` from `CatalogProcessor`. This optional method is never called by the catalog processing engine and can therefore be removed.

### Patch Changes

- 83a83381b0: **DEPRECATED**: The `results` export, and instead adding `processingResult` with the same shape and purpose.
- 83a83381b0: Internal restructuring to collect the various provider files in a `modules` folder while waiting to be externalized
- fc6d31b5c3: Deprecated the `BitbucketRepositoryParser` type.
- 022507c860: A `DefaultCatalogCollatorFactory`, which works with the new stream-based
  search indexing subsystem, is now available. The `DefaultCatalogCollator` will
  continue to be available for those unable to upgrade to the stream-based
  `@backstage/plugin-search-backend-node` (and related packages), however it is now
  marked as deprecated and will be removed in a future version.

  To upgrade this plugin and the search indexing subsystem in one go, check
  [this upgrade guide](https://backstage.io/docs/features/search/how-to-guides#how-to-migrate-from-search-alpha-to-beta)
  for necessary changes to your search backend plugin configuration.

- ab7b6cb7b1: **DEPRECATION**: Moved the `CatalogEntityDocument` to `@backstage/plugin-catalog-common` and deprecated the export from `@backstage/plugin-catalog-backend`.

  A new `type` field has also been added to `CatalogEntityDocument` as a replacement for `componentType`, which is now deprecated. Both fields are still present and should be set to the same value in order to avoid issues with indexing.

  Any search customizations need to be updated to use this new `type` field instead, including any custom frontend filters, custom frontend result components, custom search decorators, or non-default Catalog collator implementations.

- cb09096607: Tweaked the wording of the "does not have a location" errors to include the actual missing annotation name, to help users better in fixing their inputs.
- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- b753d22a56: **DEPRECATION**: Deprecated the `RefreshIntervalFunction` and `createRandomRefreshInterval` in favour of the `ProcessingIntervalFunction` and `createRandomProcessingInterval` type and method respectively. Please migrate to use the new names.

  **DEPRECATION**: Deprecated the `setRefreshInterval` and `setRefreshIntervalSeconds` methods on the `CatalogBuilder` for the new `setProcessingInterval` and `setProcessingIntervalSeconds` methods. Please migrate to use the new names.

- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-catalog-common@0.2.0
  - @backstage/integration@0.8.0
  - @backstage/plugin-permission-common@0.5.2
  - @backstage/plugin-permission-node@0.5.3
  - @backstage/search-common@0.3.0
  - @backstage/plugin-scaffolder-common@0.2.3

## 0.22.0

### Minor Changes

- 209fd128e6: The `CodeOwnersProcessor` no longer supports the deprecated SCM-specific location types like `'github/api'`. This is a breaking change but it is unlikely to have an impact, as these location types haven't been supported by the rest of the catalog for a long time.
- 9876e7f172: **BREAKING**: Removed unused `durationText` utility.
- 25e97e7242: **BREAKING**: Removed `AwsOrganizationCloudAccountProcessor` from the default
  set of builtin processors, and instead moved it into its own module
  `@backstage/plugin-catalog-backend-module-aws`.

  If you were using this processor, through making use of the location type
  `aws-cloud-accounts` and/or using the configuration key
  `catalog.processors.awsOrganization`, you will from now on have to add the
  processor manually to your catalog.

  First, add the `@backstage/plugin-catalog-backend-module-aws` dependency to your
  `packages/backend` package.

  Then, in `packages/backend/src/plugins/catalog.ts`:

  ```diff
  +import { AwsOrganizationCloudAccountProcessor } from '@backstage/plugin-catalog-backend-module-aws';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  builder.addProcessor(
  +    AwsOrganizationCloudAccountProcessor.fromConfig(
  +      env.config,
  +      { logger: env.logger }
  +    )
  +  );
     // ...
  ```

- e9cf0dd03e: Made the `GitLabDiscoveryProcessor.updateLastActivity` method private, as it was accidentally exposed. It has also been fixed to properly operate in its own cache namespace to avoid collisions with other processors.
- df61ca71dd: Updated all processors to implement `getProcessorName`.

  **BREAKING**: The `CatalogProcessor` interface now require that the `CatalogProcessor` class implements `getProcessorName()`.
  The processor name has previously defaulted processor class name. It's therefore _recommended_ to keep your return the same name as the class name if you did not implement this method previously.

  For example:

  ```ts
  class CustomProcessor implements CatalogProcessor {
    getProcessorName() {
      // Use the same name as the class name if this method was not previously implemented.
      return 'CustomProcessor';
    }
  }
  ```

### Patch Changes

- 919cf2f836: The catalog API now returns entity relations that have three fields: The old
  `type` and `target` fields, as well as a new `targetRef` field. The last one is
  the stringified form of the second one.

  **DEPRECATION**: The `target` field is hereby deprecated, both as seen from the
  catalog API as well as from the `@backstage/catalog-model` package. Both
  `target` and `targetRef` will be produced for some time, but eventually,
  `target` will be removed entirely. Please update your readers to stop consuming
  the `relations.[].target` field from the catalog API as soon as possible.

- 957cb4cb20: Deprecated the `runPeriodically` function which is no longer in use.
- 01e124ea60: Added an `/entity-facets` endpoint, which lets you query the distribution of
  possible values for fields of entities.

  This can be useful for example when populating a dropdown in the user interface,
  such as listing all tag values that are actually being used right now in your
  catalog instance, along with putting the most common ones at the top.

- 082c32f948: Deprecated the second parameter of `results.location()` that determines whether an emitted location is optional. In cases where this is currently being set to `false`, the parameter can simply be dropped, as that is the default. Usage where this was being set to `true` should be migrated to set the `presence` option of the emitted location to `optional`. For example:

  ```ts
  results.location(
    {
      type: 'url',
      target: 'http://example.com/foo',
    },
    true,
  );

  // migrated to

  results.location({
    type: 'url',
    target: 'http://example.com/foo',
    presence: 'optional',
  });
  ```

- ed09ad8093: Added `LocationSpec`, which was moved over from `@backstage/catalog-model`.

  Added `LocationInput`, which replaced `LocationSpec` where it was used in the `LocationService` and `LocationStore` interfaces. The `LocationInput` type deprecates the `presence` field, which was not being used in those contexts.

- 6d994fd9da: Cleanup catalog-backend API report.
- 7010349c9a: Added `EntityRelationSpec`, which was moved over from `@backstage/catalog-model`.
- 6e1cbc12a6: Updated according to the new `getEntityFacets` catalog API method
- 420f8d710f: Removed the `processors.githubOrg` config section which is unused and has been replaced by the integrations config.
- b1296f1f57: Deprecated `StaticLocationProcessor` which is unused and replaced by `ConfigLocationEntityProvider`.
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/plugin-scaffolder-common@0.2.2
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/plugin-permission-node@0.5.2
  - @backstage/integration@0.7.5

## 0.21.5

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
  - @backstage/types@0.1.3
  - @backstage/plugin-catalog-common@0.1.4
  - @backstage/plugin-permission-common@0.5.1
  - @backstage/plugin-permission-node@0.5.1
  - @backstage/plugin-scaffolder-common@0.2.1

## 0.21.4

### Patch Changes

- 379da9fb1d: The following processors now properly accept an `ScmIntegrationRegistry` (an
  interface) instead of an `ScmIntegrations` (which is a concrete class).

  - `AzureDevOpsDiscoveryProcessor`
  - `CodeOwnersProcessor`
  - `GitLabDiscoveryProcessor`
  - `GithubDiscoveryProcessor`
  - `GithubMultiOrgReaderProcessor`
  - `GithubOrgReaderProcessor`

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 538ca90790: Use updated type names from `@backstage/catalog-client`
- ca1d6c1788: Support "dependencyOf" relation in Resource entities
- 244d24ebc4: Import `Location` from the `@backstage/catalog-client` package.
- e483dd6c72: Update internal `Location` validation.
- 216725b434: Updated to use new names for `parseLocationRef` and `stringifyLocationRef`
- e72d371296: Use `TemplateEntityV1beta2` from `@backstage/plugin-scaffolder-common` instead
  of `@backstage/catalog-model`.
- 27eccab216: Replaces use of deprecated catalog-model constants.
- 7aeb491394: Replace use of deprecated `ENTITY_DEFAULT_NAMESPACE` constant with `DEFAULT_NAMESPACE`.
- b590e9b58d: Optimized entity provider mutations with large numbers of new additions, such as big initial startup commits
- Updated dependencies
  - @backstage/plugin-scaffolder-common@0.2.0
  - @backstage/backend-common@0.10.8
  - @backstage/catalog-client@0.7.0
  - @backstage/errors@0.2.1
  - @backstage/integration@0.7.3
  - @backstage/plugin-permission-common@0.5.0
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/search-common@0.2.3
  - @backstage/types@0.1.2
  - @backstage/plugin-catalog-common@0.1.3
  - @backstage/plugin-permission-node@0.5.0

## 0.21.3

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/backend-common@0.10.7
  - @backstage/plugin-permission-node@0.4.3

## 0.21.3-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/plugin-permission-node@0.4.3-next.0

## 0.21.2

### Patch Changes

- fac5f112b4: chore(deps): bump `prom-client` from 13.2.0 to 14.0.1
- 5bbffa60be: Pass authorization token to location service inside location api routes
- Updated dependencies
  - @backstage/plugin-catalog-common@0.1.2
  - @backstage/backend-common@0.10.6
  - @backstage/plugin-permission-node@0.4.2

## 0.21.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@0.1.2-next.0
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/plugin-permission-node@0.4.2-next.1

## 0.21.2-next.0

### Patch Changes

- fac5f112b4: chore(deps): bump `prom-client` from 13.2.0 to 14.0.1
- 5bbffa60be: Pass authorization token to location service inside location api routes
- Updated dependencies
  - @backstage/plugin-permission-node@0.4.2-next.0

## 0.21.1

### Patch Changes

- 4f5bde47e9: Add support for permissions to the DefaultCatalogCollator.
- Updated dependencies
  - @backstage/search-common@0.2.2
  - @backstage/backend-common@0.10.5
  - @backstage/plugin-permission-node@0.4.1

## 0.21.0

### Minor Changes

- 9f2a8dc423: **BREAKING**: Removed all remnants of the old catalog engine implementation.

  The old implementation has been deprecated for over half a year. To ensure that
  you are not using the old implementation, check that your
  `packages/backend/src/plugins/catalog.ts` creates the catalog builder using
  `CatalogBuilder.create`. If you instead call `new CatalogBuilder`, you are on
  the old implementation and will experience breakage if you upgrade to this
  version. If you are still on the old version, see [the relevant change log entry](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/CHANGELOG.md#patch-changes-27)
  for migration instructions.

  The minimal `packages/backend/src/plugins/catalog.ts` file is now:

  ```ts
  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const builder = await CatalogBuilder.create(env);
    builder.addProcessor(new ScaffolderEntitiesProcessor());
    const { processingEngine, router } = await builder.build();
    await processingEngine.start();
    return router;
  }
  ```

  The following classes and interfaces have been removed:

  - The `CatalogBuilder` constructor (see above; use `CatalogBuilder.create`
    instead)
  - `AddLocationResult`
  - `CommonDatabase`
  - `CreateDatabaseOptions`
  - `createNextRouter` (use `createRouter` instead - or preferably, use the
    `router` field returned for you by `catalogBuilder.build()`)
  - `Database`
  - `DatabaseEntitiesCatalog` (use `EntitiesCatalog` instead)
  - `DatabaseLocationsCatalog` (use `LocationService` instead)
  - `DatabaseLocationUpdateLogEvent`
  - `DatabaseLocationUpdateLogStatus`
  - `DatabaseManager`
  - `DbEntitiesRequest`
  - `DbEntitiesResponse`
  - `DbEntityRequest`
  - `DbEntityResponse`
  - `DbLocationsRow`
  - `DbLocationsRowWithStatus`
  - `DbPageInfo`
  - `EntitiesCatalog.batchAddOrUpdateEntities` (was only used by the legacy
    engine)
  - `EntityUpsertRequest`
  - `EntityUpsertResponse`
  - `HigherOrderOperation`
  - `HigherOrderOperations`
  - `LocationReader`
  - `LocationReaders`
  - `LocationResponse`
  - `LocationsCatalog`
  - `LocationUpdateLogEvent`
  - `LocationUpdateStatus`
  - `NextCatalogBuilder` (use `CatalogBuilder.create` instead)
  - `NextRouterOptions` (use `RouterOptions` instead)
  - `ReadLocationEntity`
  - `ReadLocationError`
  - `ReadLocationResult`
  - `Transaction`

  The `RouterOptions` interface has been un-deprecated, and has instead found use
  for passing into `createRouter`. Its shape has been significantly changed to
  accommodate the new router.

### Patch Changes

- e15ce5c16e: Integrate authorization into the delete entities endpoint
- dce98a92f7: Now when entities are deleted, the parent entity state is updated such that it will "heal" accidental deletes on the next refresh round.
- 02687954ca: Fixed a typo and made a little clarification to a warning message
- 48248e2db5: Integrate permissions into entity ancestry endpoint in catalog-backend
- 68edbbeafd: Fix bug with resource loading in permission integration
- 7e38acaa9e: Integrate permissions into catalog-backend location endpoints
- 6680853e0c: Export conditional permission policy helpers from catalog-backend
- 2b27e49eb1: Internal update to match status field changes in `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/integration@0.7.2
  - @backstage/plugin-permission-common@0.4.0
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/plugin-permission-node@0.4.0
  - @backstage/plugin-catalog-common@0.1.1
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5

## 0.21.0-next.0

### Minor Changes

- 9f2a8dc423: **BREAKING**: Removed all remnants of the old catalog engine implementation.

  The old implementation has been deprecated for over half a year. To ensure that
  you are not using the old implementation, check that your
  `packages/backend/src/plugins/catalog.ts` creates the catalog builder using
  `CatalogBuilder.create`. If you instead call `new CatalogBuilder`, you are on
  the old implementation and will experience breakage if you upgrade to this
  version. If you are still on the old version, see [the relevant change log entry](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/CHANGELOG.md#patch-changes-27)
  for migration instructions.

  The minimal `packages/backend/src/plugins/catalog.ts` file is now:

  ```ts
  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const builder = await CatalogBuilder.create(env);
    builder.addProcessor(new ScaffolderEntitiesProcessor());
    const { processingEngine, router } = await builder.build();
    await processingEngine.start();
    return router;
  }
  ```

  The following classes and interfaces have been removed:

  - The `CatalogBuilder` constructor (see above; use `CatalogBuilder.create`
    instead)
  - `AddLocationResult`
  - `CommonDatabase`
  - `CreateDatabaseOptions`
  - `createNextRouter` (use `createRouter` instead - or preferably, use the
    `router` field returned for you by `catalogBuilder.build()`)
  - `Database`
  - `DatabaseEntitiesCatalog` (use `EntitiesCatalog` instead)
  - `DatabaseLocationsCatalog` (use `LocationService` instead)
  - `DatabaseLocationUpdateLogEvent`
  - `DatabaseLocationUpdateLogStatus`
  - `DatabaseManager`
  - `DbEntitiesRequest`
  - `DbEntitiesResponse`
  - `DbEntityRequest`
  - `DbEntityResponse`
  - `DbLocationsRow`
  - `DbLocationsRowWithStatus`
  - `DbPageInfo`
  - `EntitiesCatalog.batchAddOrUpdateEntities` (was only used by the legacy
    engine)
  - `EntityUpsertRequest`
  - `EntityUpsertResponse`
  - `HigherOrderOperation`
  - `HigherOrderOperations`
  - `LocationReader`
  - `LocationReaders`
  - `LocationResponse`
  - `LocationsCatalog`
  - `LocationUpdateLogEvent`
  - `LocationUpdateStatus`
  - `NextCatalogBuilder` (use `CatalogBuilder.create` instead)
  - `NextRouterOptions` (use `RouterOptions` instead)
  - `ReadLocationEntity`
  - `ReadLocationError`
  - `ReadLocationResult`
  - `Transaction`

  The `RouterOptions` interface has been un-deprecated, and has instead found use
  for passing into `createRouter`. Its shape has been significantly changed to
  accommodate the new router.

### Patch Changes

- e15ce5c16e: Integrate authorization into the delete entities endpoint
- dce98a92f7: Now when entities are deleted, the parent entity state is updated such that it will "heal" accidental deletes on the next refresh round.
- 02687954ca: Fixed a typo and made a little clarification to a warning message
- 48248e2db5: Integrate permissions into entity ancestry endpoint in catalog-backend
- 68edbbeafd: Fix bug with resource loading in permission integration
- 2b27e49eb1: Internal update to match status field changes in `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/plugin-permission-common@0.4.0-next.0
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-permission-node@0.4.0-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/plugin-catalog-common@0.1.1-next.0
  - @backstage/catalog-client@0.5.5-next.0
  - @backstage/integration@0.7.2-next.0

## 0.20.0

### Minor Changes

- cd529c4094: In order to integrate the permissions system with the refresh endpoint in catalog-backend, a new AuthorizedRefreshService was created as a thin wrapper around the existing refresh service which performs authorization and handles the case when authorization is denied. In order to instantiate AuthorizedRefreshService, a permission client is required, which was added as a new field to `CatalogEnvironment`.

  The new `permissions` field in `CatalogEnvironment` should already receive the permission client from the `PluginEnvrionment`, so there should be no changes required to the catalog backend setup. See [the create-app changelog](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md) for more details.

### Patch Changes

- 0ae759dad4: Add catalog permission rules.
- 3b4d8caff6: Allow a custom GithubCredentialsProvider to be passed to the GitHub processors.
- 6fd70f8bc8: Provide support for Bitbucket servers with custom BaseURLs.
- 5333451def: Cleaned up API exports
- 730d01ab1a: Add apply-conditions endpoint for evaluating conditional permissions in catalog backend.
- 0a6c68582a: Add authorization to catalog-backend entities GET endpoints
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/integration@0.7.1
  - @backstage/backend-common@0.10.3
  - @backstage/plugin-permission-node@0.3.0
  - @backstage/errors@0.2.0
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9
  - @backstage/plugin-permission-common@0.3.1

## 0.19.4

### Patch Changes

- 7d4b4e937c: Uptake changes to the GitHub Credentials Provider interface.
- 3a63491c5f: Filter out projects with missing `default_branch` from GitLab Discovery.
- Updated dependencies
  - @backstage/backend-common@0.10.1
  - @backstage/integration@0.7.0

## 0.19.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/catalog-client@0.5.3

## 0.19.2

### Patch Changes

- 3368f27aef: Fixed the handling of optional locations so that the catalog no longer logs `NotFoundError`s for missing optional locations.
- Updated dependencies
  - @backstage/backend-common@0.9.14
  - @backstage/catalog-model@0.9.8

## 0.19.1

### Patch Changes

- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- 6bccc7d794: The `pagedRequest` method in the GitLab ingestion client is now public for re-use and may be used to make other calls to the GitLab API. Developers can now pass in a type into the GitLab `paginated` and `pagedRequest` functions as generics instead of forcing `any` (defaults to `any` to maintain compatibility). The `GitLabClient` now provides a `isSelfManaged` convenience method.
- 0e4daaa753: Reject catalog entities that have duplicate fields that vary only in casing.
- 98a9c35f0c: Honor database migration configuration
- Updated dependencies
  - @backstage/backend-common@0.9.13

## 0.19.0

### Minor Changes

- 905dd952ac: **BREAKING** `DefaultCatalogCollator` has a new required option `tokenManager`. See the create-app changelog for how to create a `tokenManager` and add it to the `PluginEnvironment`. It can then be passed to the collator in `createPlugin`:

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
      collator: DefaultCatalogCollator.fromConfig(config, {
        discovery,
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

## 0.18.0

### Minor Changes

- 7f82ce9f51: **BREAKING** EntitiesSearchFilter fields have changed.

  EntitiesSearchFilter now has only two fields: `key` and `value`. The `matchValueIn` and `matchValueExists` fields are no longer are supported. Previous filters written using the `matchValueIn` and `matchValueExists` fields can be rewritten as follows:

  Filtering by existence of key only:

  ```diff
    filter: {
      {
        key: 'abc',
  -     matchValueExists: true,
      },
    }
  ```

  Filtering by key and values:

  ```diff
    filter: {
      {
        key: 'abc',
  -     matchValueExists: true,
  -     matchValueIn: ['xyz'],
  +     values: ['xyz'],
      },
    }
  ```

  Negation of filters can now be achieved through a `not` object:

  ```
  filter: {
    not: {
      key: 'abc',
      values: ['xyz'],
    },
  }
  ```

### Patch Changes

- 740f958290: Providing an empty values array in an EntityFilter will now return no matches.
- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- eddb82ab7c: Index User entities by displayName to be able to search by full name. Added displayName (if present) to the 'text' field in the indexed document.
- 563b039f0b: Added Azure DevOps discovery processor
- 8866b62f3d: Detect a duplicate entities when adding locations through dry run
- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/backend-common@0.9.11

## 0.17.4

### Patch Changes

- 5d2a7303bd: This fixes a bug where locations couldn't be added unless the processing engine is started.
  It's now possible to run the catalog backend without starting the processing engine and still allowing locations registrations.

  This is done by refactor the `EntityProvider.connect` to happen outside the engine.

- 06934f2f52: Adjust entity query construction to ensure sub-queries are always isolated from one another.
- b90fc74d70: adds getDefaultProcessor method to CatalogBuilder
- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10

## 0.17.3

### Patch Changes

- 86bef79ad1: Allow singleton and flexibly nested EntityFilters
- Updated dependencies
  - @backstage/backend-common@0.9.9
  - @backstage/catalog-client@0.5.1

## 0.17.2

### Patch Changes

- b9ce1ce2c1: Allow custom LocationAnalyzer in NextCatalogBuilder
- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/backend-common@0.9.8
  - @backstage/catalog-model@0.9.6
  - @backstage/search-common@0.2.1

## 0.17.1

### Patch Changes

- 3adaf88db2: Take CatalogParser in account when processing file locations.
- 1f62d1cbe9: Minor rearrangement of `Stitcher` to clarify the scope of one stitch round
- 3ba87f514e: Add a `GitHubOrgEntityProvider` that can be used instead of the `GithubOrgReaderProcessor`.
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- 177401b571: Use entity title (if defined) as title of documents indexed by `DefaultCatalogCollator`
- Updated dependencies
  - @backstage/backend-common@0.9.7
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.17.0

### Minor Changes

- 9fb9256e50: This continues the deprecation of classes used by the legacy catalog engine. New deprecations can be viewed in this [PR](https://github.com/backstage/backstage/pull/7500) or in the API reference documentation.

  The `batchAddOrUpdateEntities` method of the `EntitiesCatalog` interface has been marked as optional and is being deprecated. It is still implemented and required to be implemented by the legacy catalog classes, but was never implemented in the new catalog.

  This change is only relevant if you are consuming the `EntitiesCatalog` interface directly, in which case you will get a type error that you need to resolve. It can otherwise be ignored.

### Patch Changes

- 3b59bb915e: Fixes a bug in the catalog where entities were not being marked as orphaned.
- 55ff928d50: This change refactors the internal package structure to remove the `next` catalog folder that was used during the implementation and testing phase of the new catalog engine. The implementation is now the default and is therefore restructured to no longer be packaged under `next/`. This refactor does not change catalog imports from other parts of the project.
- Updated dependencies
  - @backstage/integration@0.6.8

## 0.16.0

### Minor Changes

- 2c5bab2f82: Errors emitted from processors are now considered a failure during entity processing and will prevent entities from being updated. The impact of this change is that when errors are emitted while for example reading a location, then ingestion effectively stops there. If you emit a number of entities along with just one error, then the error will be persisted on the current entity but the emitted entities will _not_ be stored. This fixes [a bug](https://github.com/backstage/backstage/issues/6973) where entities would get marked as orphaned rather than put in an error state when the catalog failed to read a location.

  In previous versions of the catalog, an emitted error was treated as a less severe problem than an exception thrown by the processor. We are now ensuring that the behavior is consistent for these two cases. Even though both thrown and emitted errors are treated the same, emitted errors stay around as they allow you to highlight multiple errors related to an entity at once. An emitted error will also only prevent the writing of the processing result, while a thrown error will skip the rest of the processing steps.

### Patch Changes

- 957e4b3351: Updated dependencies
- f66c38148a: Avoid duplicate logging of entity processing errors.
- 426d5031a6: A number of classes and types, that were part of the old catalog engine implementation, are now formally marked as deprecated. They will be removed entirely from the code base in a future release.

  After upgrading to this version, it is recommended that you take a look inside your `packages/backend/src/plugins/catalog.ts` file (using a code editor), to see if you are using any functionality that it marks as deprecated. If you do, please migrate away from it at your earliest convenience.

  Migrating to using the new engine implementation is typically a matter of calling `CatalogBuilder.create({ ... })` instead of `new CatalogBuilder({ ... })`.

  If you are seeing deprecation warnings for `createRouter`, you can either use the `router` field from the return value from updated catalog builder, or temporarily call `createNextRouter`. The latter will however also be deprecated at a later time.

- 7b78dd17e6: Replace slash stripping regexp with trimEnd to remove CodeQL warning
- Updated dependencies
  - @backstage/catalog-model@0.9.4
  - @backstage/backend-common@0.9.6
  - @backstage/catalog-client@0.5.0
  - @backstage/integration@0.6.7

## 0.15.0

### Minor Changes

- 1572d02b63: Introduced a new `CatalogProcessorCache` that is available to catalog processors. It allows arbitrary values to be saved that will then be visible during the next run. The cache is scoped to each individual processor and entity, but is shared across processing steps in a single processor.

  The cache is available as a new argument to each of the processing steps, except for `validateEntityKind` and `handleError`.

  This also introduces an optional `getProcessorName` to the `CatalogProcessor` interface, which is used to provide a stable identifier for the processor. While it is currently optional it will move to be required in the future.

  The breaking part of this change is the modification of the `state` field in the `EntityProcessingRequest` and `EntityProcessingResult` types. This is unlikely to have any impact as the `state` field was previously unused, but could require some minor updates.

- c1836728e0: Add `/entities/by-name/:kind/:namespace/:name/ancestry` to get the "processing parents" lineage of an entity.

  This involves a breaking change of adding the method `entityAncestry` to `EntitiesCatalog`.

### Patch Changes

- 3d10360c82: When issuing a `full` update from an entity provider, entities with updates are now properly persisted.
- 9ea4565b00: Fixed a bug where internal references within the catalog were broken when new entities where added through entity providers, such as registering a new location or adding one in configuration. These broken references then caused some entities to be incorrectly marked as orphaned and prevented refresh from working properly.
- Updated dependencies
  - @backstage/backend-common@0.9.5
  - @backstage/integration@0.6.6

## 0.14.0

### Minor Changes

- d6f90e934d: #### Enforcing catalog rules

  Apply the catalog rules enforcer, based on origin location.

  This is a breaking change, in the sense that this was not properly checked in earlier versions of the new catalog engine. You may see ingestion of certain entities start to be rejected after this update, if the following conditions apply to you:

  - You are using the configuration key `catalog.rules.[].allow`, and
  - Your registered locations point (directly or transitively) to entities whose kinds are not listed in `catalog.rules.[].allow`

  and/or

  - You are using the configuration key `catalog.locations.[].rules.[].allow`
  - The config locations point (directly or transitively) to entities whose kinds are not listed neither `catalog.rules.[].allow`, nor in the corresponding `.rules.[].allow` of that config location

  This is an example of what the configuration might look like:

  ```yaml
  catalog:
    # These do not list Template as a valid kind; users are therefore unable to
    # manually register entities of the Template kind
    rules:
      - allow:
          - Component
          - API
          - Resource
          - Group
          - User
          - System
          - Domain
          - Location
    locations:
      # This lists Template as valid only for that specific config location
      - type: file
        target: ../../plugins/scaffolder-backend/sample-templates/all-templates.yaml
        rules:
          - allow: [Template]
  ```

  If you are not using any of those `rules` section, you should not be affected by this change.

  If you do use any of those `rules` sections, make sure that they are complete and list all of the kinds that are in active use in your Backstage installation.

  #### Other

  Also, the class `CatalogRulesEnforcer` was renamed to `DefaultCatalogRulesEnforcer`, implementing the type `CatalogRulesEnforcer`.

- 501ce92f9c: Bitbucket Cloud Discovery support
- 89fd81a1ab: Add API endpoint for requesting a catalog refresh at `/refresh`, which is activated if a `RefreshService` is passed to `createRouter`.

  The new method is used to trigger a refresh of an entity in an as localized was as possible, usually by refreshing the parent location.

### Patch Changes

- 9ef2987a83: Update `createLocation` to optionally return `exists` to signal that the location already exists, this is only returned for dry runs.
- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/integration@0.6.5
  - @backstage/catalog-client@0.4.0
  - @backstage/catalog-model@0.9.3
  - @backstage/backend-common@0.9.4
  - @backstage/config@0.1.10

## 0.13.8

### Patch Changes

- fab79adde1: Add AWS S3 Discovery Processor. Add readTree() to AwsS3UrlReader. Add ReadableArrayResponse type that implements ReadTreeResponse to use in AwsS3UrlReader's readTree()
- a41ac6b952: Fill in most missing type exports.
- 96fef17a18: Upgrade git-parse-url to v11.6.0
- Updated dependencies
  - @backstage/backend-common@0.9.3
  - @backstage/integration@0.6.4

## 0.13.7

### Patch Changes

- ce17a1693: Allow the catalog search collator to filter the entities that it indexes
- dbb952787: Use `ScmIntegrationRegistry#resolveUrl` in the placeholder processors instead of a custom implementation.

  If you manually instantiate the `PlaceholderProcessor` (you most probably don't), add the new required constructor parameter:

  ```diff
  + import { ScmIntegrations } from '@backstage/integration';
    // ...
  + const integrations = ScmIntegrations.fromConfig(config);
    // ...
    new PlaceholderProcessor({
      resolvers: placeholderResolvers,
      reader,
  +   integrations,
    });
  ```

  All custom `PlaceholderResolver` can use the new `resolveUrl` parameter to resolve relative URLs.

- 1797c5ce5: This change drops support for deprecated location types which have all been replaced by the `url` type.
  There has been a deprecation warning in place since the beginning of this year so most should already be migrated and received information at this point.

  The now removed location types are:

  ```
  github
  github/api
  bitbucket/api
  gitlab/api
  azure/api
  ```

- Updated dependencies
  - @backstage/catalog-client@0.3.19
  - @backstage/catalog-model@0.9.2
  - @backstage/errors@0.1.2
  - @backstage/config@0.1.9
  - @backstage/backend-common@0.9.2

## 0.13.6

### Patch Changes

- 4d62dc15b: GitHub discovery processor passes over repositories that do not have a default branch
- 977b1dfbe: Adds optional namespacing for users in the GitHub Multi Org Plugin
- Updated dependencies
  - @backstage/integration@0.6.3
  - @backstage/search-common@0.2.0
  - @backstage/plugin-search-backend-node@0.4.2
  - @backstage/catalog-model@0.9.1
  - @backstage/backend-common@0.9.1

## 0.13.5

### Patch Changes

- 8b39242c4: GitHub discovery processor adds support for discovering the default GitHub branch
- 96785dce3: Added GitLabDiscoveryProcessor, which allows catalog discovery from a GitLab instance
- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/integration@0.6.2
  - @backstage/config@0.1.8

## 0.13.4

### Patch Changes

- 7ab55167d: Properly handle Date objects being returned for timestamps in the database driver

## 0.13.3

### Patch Changes

- 61aa6526f: Avoid duplicate work by comparing previous processing rounds with the next
- fe960ad0f: Updates the `DefaultProcessingDatabase` to accept a refresh interval function instead of a fixed refresh interval in seconds which used to default to 100s. The catalog now ships with a default refresh interval function that schedules entities for refresh every 100-150 seconds, this should
  help to smooth out bursts that occur when a lot of entities are scheduled for refresh at the same second.

  Custom `RefreshIntervalFunction` can be implemented and passed to the CatalogBuilder using `.setInterval(fn)`

- 54b441abe: Export the entity provider related types for external use.
- 03bb05af6: Enabled live reload of locations configured in `catalog.locations`.
- 2766b2aa5: Add experimental Prometheus metrics instrumentation to the catalog
- Updated dependencies
  - @backstage/backend-common@0.8.10
  - @backstage/config@0.1.7
  - @backstage/integration@0.6.1

## 0.13.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/backend-common@0.8.9

## 0.13.1

### Patch Changes

- 11c370af2: Support filtering entities via property existence. For example you can now query with `/entities?filter=metadata.annotations.blah` to fetch all entities that has the particular property defined.
- Updated dependencies
  - @backstage/catalog-client@0.3.18

## 0.13.0

### Minor Changes

- 8bfc0571c: Add a default catalog value for BitBucketDiscoveryProcessor. This allows to have a target like so: `https://bitbucket.mycompany.com/projects/backstage/repos/service-*`
  which will be expanded to `https://bitbucket.mycompany.com/projects/backstage/repos/service-a/catalog-info.yaml` given that repository 'service-a' exists.

  ## Migration

  If you are using a custom [Bitbucket parser](https://backstage.io/docs/integrations/bitbucket/discovery#custom-repository-processing) and your `bitbucket-discovery` target (e.g. in your app-config.yaml) omits the catalog path in any of the following ways:

  - `https://bitbucket.mycompany.com/projects/backstage/repos/service-*`
  - `https://bitbucket.mycompany.com/projects/backstage/repos/*`
  - `https://bitbucket.mycompany.com/projects/backstage/repos/*/`

  then you will be affected by this change.
  The 'target' input to your parser before this commit would be '/', and after this commit it will be '/catalog-info.yaml', and as such needs to be handled to maintain the same functionality.

### Patch Changes

- 8b048934b: The codeowners processor extracts the username of the primary owner and uses this as the owner field.
  Given the kind isn't specified this is assumed to be a group and so the link to the owner in the about card
  doesn't work. This change specifies the kind where the entity is a user. e.g:

  `@iain-b` -> `user:iain-b`

- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6
  - @backstage/plugin-search-backend-node@0.4.0

## 0.12.0

### Minor Changes

- 60e830222: Support for `Template` kinds with version `backstage.io/v1alpha1` has now been removed. This means that the old method of running templates with `Preparers`, `Templaters` and `Publishers` has also been removed. If you had any logic in these abstractions, they should now be moved to `actions` instead, and you can find out more about those in the [documentation](https://backstage.io/docs/features/software-templates/writing-custom-actions)

  If you need any help migrating existing templates, there's a [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1alpha1-to-v1beta2). Reach out to us on Discord in the #support channel if you're having problems.

  The `scaffolder-backend` now no longer requires these `Preparers`, `Templaters`, and `Publishers` to be passed in, now all it needs is the `containerRunner`.

  Please update your `packages/backend/src/plugins/scaffolder.ts` like the following

  ```diff
  - import {
  -  DockerContainerRunner,
  -  SingleHostDiscovery,
  - } from '@backstage/backend-common';
  + import { DockerContainerRunner } from '@backstage/backend-common';
    import { CatalogClient } from '@backstage/catalog-client';
  - import {
  -   CookieCutter,
  -   CreateReactAppTemplater,
  -   createRouter,
  -   Preparers,
  -   Publishers,
  -   Templaters,
  - } from '@backstage/plugin-scaffolder-backend';
  + import { createRouter } from '@backstage/plugin-scaffolder-backend';
    import Docker from 'dockerode';
    import { Router } from 'express';
    import type { PluginEnvironment } from '../types';

    export default async function createPlugin({
      config,
      database,
      reader,
  +   discovery,
    }: PluginEnvironment): Promise<Router> {
      const dockerClient = new Docker();
      const containerRunner = new DockerContainerRunner({ dockerClient });

  -   const cookiecutterTemplater = new CookieCutter({ containerRunner });
  -   const craTemplater = new CreateReactAppTemplater({ containerRunner });
  -   const templaters = new Templaters();

  -   templaters.register('cookiecutter', cookiecutterTemplater);
  -   templaters.register('cra', craTemplater);
  -
  -   const preparers = await Preparers.fromConfig(config, { logger });
  -   const publishers = await Publishers.fromConfig(config, { logger });

  -   const discovery = SingleHostDiscovery.fromConfig(config);
      const catalogClient = new CatalogClient({ discoveryApi: discovery });

      return await createRouter({
  -     preparers,
  -     templaters,
  -     publishers,
  +     containerRunner,
        logger,
        config,
        database,

  ```

### Patch Changes

- f7134c368: bump sqlite3 to 5.0.1
- 6841e0113: fix minor version of git-url-parse as 11.5.x introduced a bug for Bitbucket Server
- 2d41b6993: Make use of the new `readUrl` method on `UrlReader` from `@backstage/backend-common`.
- Updated dependencies
  - @backstage/integration@0.5.8
  - @backstage/catalog-model@0.9.0
  - @backstage/backend-common@0.8.5
  - @backstage/plugin-search-backend-node@0.3.0
  - @backstage/catalog-client@0.3.16

## 0.11.0

### Minor Changes

- 45af985df: Handle entity name conflicts in a deterministic way and avoid crashes due to naming conflicts at startup.

  This is a breaking change for the database and entity provider interfaces of the new catalog. The interfaces with breaking changes are `EntityProvider` and `ProcessingDatabase`, and while it's unlikely that these interfaces have much usage yet, a migration guide is provided below.

  The breaking change to the `EntityProvider` interface lies within the items passed in the `EntityProviderMutation` type. Rather than passing along entities directly, they are now wrapped up in a `DeferredEntity` type, which is a tuple of an `entity` and a `locationKey`. The `entity` houses the entity as it was passed on before, while the `locationKey` is a new concept that is used for conflict resolution within the catalog.

  The `locationKey` is an opaque string that should be unique for each location that an entity could be located at, and undefined if the entity does not have a fixed location. In practice it should be set to the serialized location reference if the entity is stored in Git, for example `https://github.com/backstage/backstage/blob/master/catalog-info.yaml`. A conflict between two entity definitions happen when they have the same entity reference, i.e. kind, namespace, and name. In the event of a conflict the location key will be used according to the following rules to resolve the conflict:

  - If the entity is already present in the database but does not have a location key set, the new entity wins and will override the existing one.
  - If the entity is already present in the database the new entity will only win if the location keys of the existing and new entity are the same.
  - If the entity is not already present, insert the entity into the database along with the provided location key.

  The breaking change to the `ProcessingDatabase` is similar to the one for the entity provider, as it reflects the switch from `Entity` to `DeferredEntity` in the `ReplaceUnprocessedEntitiesOptions`. In addition, the `addUnprocessedEntities` method has been removed from the `ProcessingDatabase` interface, and the `RefreshStateItem` and `UpdateProcessedEntityOptions` types have received a new optional `locationKey` property.

- 8e533f92c: Move `LdapOrgReaderProcessor` from `@backstage/plugin-catalog-backend`
  to `@backstage/plugin-catalog-backend-module-ldap`.

  The `LdapOrgReaderProcessor` isn't registered by default anymore, if
  you want to continue using it you have to register it manually at the catalog
  builder:

  1. Add dependency to `@backstage/plugin-catalog-backend-module-ldap` to the `package.json` of your backend.
  2. Add the processor to the catalog builder:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addProcessor(
    LdapOrgReaderProcessor.fromConfig(config, {
      logger,
    }),
  );
  ```

  For more configuration details, see the [README of the `@backstage/plugin-catalog-backend-module-ldap` package](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-ldap/README.md).

### Patch Changes

- 22a60518c: Support ingesting multiple GitHub organizations via a new `GithubMultiOrgReaderProcessor`.

  This new processor handles namespacing created groups according to the org of the associated GitHub team to prevent potential name clashes between organizations. Be aware that this processor is considered alpha and may not be compatible with future org structures in the catalog.

  NOTE: This processor only fully supports auth via GitHub Apps

  To install this processor, import and add it as follows:

  ```typescript
  // Typically in packages/backend/src/plugins/catalog.ts
  import { GithubMultiOrgReaderProcessor } from '@backstage/plugin-catalog-backend';
  // ...
  export default async function createPlugin(env: PluginEnvironment) {
    const builder = new CatalogBuilder(env);
    builder.addProcessor(
      GithubMultiOrgReaderProcessor.fromConfig(env.config, {
        logger: env.logger,
      }),
    );
    // ...
  }
  ```

  Configure in your `app-config.yaml` by pointing to your GitHub instance and optionally list which GitHub organizations you wish to import. You can also configure what namespace you want to set for teams from each org. If unspecified, the org name will be used as the namespace. If no organizations are listed, by default this processor will import from all organizations accessible by all configured GitHub Apps:

  ```yaml
  catalog:
    locations:
      - type: github-multi-org
        target: https://github.myorg.com
        rules:
          - allow: [User, Group]

    processors:
      githubMultiOrg:
        orgs:
          - name: fooOrg
            groupNamespace: foo
          - name: barOrg
            groupNamespace: bar
          - name: awesomeOrg
          - name: anotherOrg
  ```

- d408af872: Only return the selected fields from the new catalog.
- aa2b15d9d: Ensure that emitted relations are deduplicated
- Updated dependencies
  - @backstage/backend-common@0.8.4
  - @backstage/integration@0.5.7
  - @backstage/catalog-client@0.3.15

## 0.10.4

### Patch Changes

- 127048f92: Move `MicrosoftGraphOrgReaderProcessor` from `@backstage/plugin-catalog-backend`
  to `@backstage/plugin-catalog-backend-module-msgraph`.

  The `MicrosoftGraphOrgReaderProcessor` isn't registered by default anymore, if
  you want to continue using it you have to register it manually at the catalog
  builder:

  1. Add dependency to `@backstage/plugin-catalog-backend-module-msgraph` to the `package.json` of your backend.
  2. Add the processor to the catalog builder:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addProcessor(
    MicrosoftGraphOrgReaderProcessor.fromConfig(config, {
      logger,
    }),
  );
  ```

  For more configuration details, see the [README of the `@backstage/plugin-catalog-backend-module-msgraph` package](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/README.md).

- 71416fb64: Moved installation instructions from the main [backstage.io](https://backstage.io) documentation to the package README file. These instructions are not generally needed, since the plugin comes installed by default with `npx @backstage/create-app`.
- Updated dependencies
  - @backstage/catalog-client@0.3.14
  - @backstage/plugin-search-backend-node@0.2.2
  - @backstage/catalog-model@0.8.4

## 0.10.3

### Patch Changes

- b45e29410: This release enables the new catalog processing engine which is a major milestone for the catalog!

  This update makes processing more scalable across multiple instances, adds support for deletions and ui flagging of entities that are no longer referenced by a location.

  **Changes Required** to `catalog.ts`

  ```diff
  -import { useHotCleanup } from '@backstage/backend-common';
   import {
     CatalogBuilder,
  -  createRouter,
  -  runPeriodically
  +  createRouter
   } from '@backstage/plugin-catalog-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';

   export default async function createPlugin(env: PluginEnvironment): Promise<Router> {
  -  const builder = new CatalogBuilder(env);
  +  const builder = await CatalogBuilder.create(env);
     const {
       entitiesCatalog,
       locationsCatalog,
  -    higherOrderOperation,
  +    locationService,
  +    processingEngine,
       locationAnalyzer,
     } = await builder.build();

  -  useHotCleanup(
  -    module,
  -    runPeriodically(() => higherOrderOperation.refreshAllLocations(), 100000),
  -  );
  +  await processingEngine.start();

     return await createRouter({
       entitiesCatalog,
       locationsCatalog,
  -    higherOrderOperation,
  +    locationService,
       locationAnalyzer,
       logger: env.logger,
       config: env.config,
  ```

  As this is a major internal change we have taken some precaution by still allowing the old catalog to be enabled by keeping your `catalog.ts` in it's current state.
  If you encounter any issues and have to revert to the previous catalog engine make sure to raise an issue immediately as the old catalog engine is deprecated and will be removed in a future release.

- 72fbf4372: Switches the default catalog processing engine to use a batched streaming task execution strategy for higher parallelism.
- 18ab535c8: Rely on `SELECT ... FOR UPDATE SKIP LOCKED` where available in order to speed up processing item acquisition and reduce work duplication.
- db17fd734: Make refresh interval configurable for the `NextCatalogBuilder` using `.setRefreshIntervalSeconds()`.

  Change `DefaultProcessingDatabase` constructor to accept an options object instead of individual arguments.

- cb09e445e: Implement `NextCatalogBuilder.addEntityProvider`
- 3108ff7bf: Make `yarn dev` respect the `PLUGIN_PORT` environment variable.
- Updated dependencies
  - @backstage/plugin-search-backend-node@0.2.1
  - @backstage/backend-common@0.8.3
  - @backstage/catalog-model@0.8.3

## 0.10.2

### Patch Changes

- 9c63be545: Restructure the next catalog types and files a bit
- Updated dependencies [92963779b]
- Updated dependencies [27a9b503a]
- Updated dependencies [70bc30c5b]
- Updated dependencies [db1c8f93b]
- Updated dependencies [5aff84759]
- Updated dependencies [eda9dbd5f]
  - @backstage/backend-common@0.8.2
  - @backstage/catalog-model@0.8.2
  - @backstage/catalog-client@0.3.13
  - @backstage/search-common@0.1.2
  - @backstage/plugin-search-backend-node@0.2.0
  - @backstage/integration@0.5.6

## 0.10.1

### Patch Changes

- e7a5a3474: Only validate the envelope for emitted entities, and defer full validation to when they get processed later on.
- 63a432e9c: Skip deletion of bootstrap location when running the new catalog.
- f46a9e82d: Move dependency to `@microsoft/microsoft-graph-types` from `@backstage/plugin-catalog`
  to `@backstage/plugin-catalog-backend`.
- Updated dependencies [ebe802bc4]
- Updated dependencies [49d7ec169]
  - @backstage/catalog-model@0.8.1
  - @backstage/integration@0.5.5

## 0.10.0

### Minor Changes

- 0fd4ea443: Updates the `GithubCredentialsProvider` to return the token type, it can either be `token` or `app` depending on the authentication method.

  Update the `GithubOrgReaderProcessor` NOT to query for email addresses if GitHub Apps is used for authentication, this is due to inconsistencies in the GitHub API when using server to server communications and installation tokens. See [this community discussion](https://github.community/t/api-v4-unable-to-retrieve-email-resource-not-accessible-by-integration/13831/4) for more info.

  **Removes** deprecated GithubOrgReaderProcessor provider configuration(`catalog.processors.githubOrg`). If you're using the deprecated config section make sure to migrate to [integrations](https://backstage.io/docs/integrations/github/locations) instead.

### Patch Changes

- add62a455: Foundation for standard entity status values
- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/integration@0.5.4
  - @backstage/catalog-client@0.3.12
  - @backstage/catalog-model@0.8.0

## 0.9.1

### Patch Changes

- 50a5348b7: Fix error handling in `LdapOrgReaderProcessor`, and support complex paging options
- 1b8e28aed: Resolve the `target` for glob `file` locations correctly
- dcd5a93a9: Correctly add `<source>/project-slug` annotation for new catalog-info.yaml PRs based on SCM integration.
- f7f7783a3: Add Owner field in template card and new data distribution
  Add spec.owner as optional field into TemplateV1Alpha and TemplateV1Beta Schema
  Add relations ownedBy and ownerOf into Template entity
  Template documentation updated
- 62579ced6: Skip adding entries to the `entities_search` table if their `key` exceeds a length limit.
- Updated dependencies [f7f7783a3]
- Updated dependencies [c7dad9218]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5001de908]
  - @backstage/catalog-model@0.7.10
  - @backstage/backend-common@0.8.1
  - @backstage/integration@0.5.3

## 0.9.0

### Minor Changes

- 9a207f052: Port `GithubOrgReaderProcessor` to support configuration via
  [`integrations`](https://backstage.io/docs/integrations/github/locations) in
  addition to [`catalog.processors.githubOrg.providers`](https://backstage.io/docs/integrations/github/org#configuration).
  The `integrations` package supports authentication with both personal access
  tokens and GitHub apps.

  This deprecates the `catalog.processors.githubOrg.providers` configuration.
  A [`integrations` configuration](https://backstage.io/docs/integrations/github/locations)
  for the same host takes precedence over the provider configuration.
  You might need to add additional scopes for the credentials.

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9

## 0.8.2

### Patch Changes

- b219821a0: Expose `BitbucketRepositoryParser` introduced in [#5295](https://github.com/backstage/backstage/pull/5295)
- 227439a72: Add support for non-organization accounts in GitHub Discovery
- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/integration@0.5.2
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.8.1

### Patch Changes

- a99e0bc42: Entity lifecycle and owner are now indexed by the `DefaultCatalogCollator`. A `locationTemplate` may now optionally be provided to its constructor to reflect a custom catalog entity path in the Backstage frontend.
- Updated dependencies [e1e757569]
  - @backstage/plugin-search-backend-node@0.1.4

## 0.8.0

### Minor Changes

- 5fe62f124: Fix the schema / code mismatch in LDAP `set` config

### Patch Changes

- 09b5fcf2e: GithubDiscoveryProcessor now excludes archived repositories so they won't be added to Backstage.
- c2306f898: Externalize repository processing for BitbucketDiscoveryProcessor.

  Add an extension point where you can customize how a matched Bitbucket repository should
  be processed. This can for example be used if you want to generate the catalog-info.yaml
  automatically based on other files in a repository, while taking advantage of the
  build-in repository crawling functionality.

  `BitbucketDiscoveryProcessor.fromConfig` now takes an optional parameter `options.parser` where
  you can customize the logic for each repository found. The default parser has the same
  behaviour as before, where it emits an optional location for the matched repository
  and lets the other processors take care of further processing.

  ```typescript
  const customRepositoryParser: BitbucketRepositoryParser =
    async function* customRepositoryParser({ client, repository }) {
      // Custom logic for interpret the matching repository.
      // See defaultRepositoryParser for an example
    };

  const processor = BitbucketDiscoveryProcessor.fromConfig(env.config, {
    parser: customRepositoryParser,
    logger: env.logger,
  });
  ```

- Updated dependencies [94da20976]
- Updated dependencies [b9b2b4b76]
- Updated dependencies [d8cc7e67a]
- Updated dependencies [99fbef232]
- Updated dependencies [ab07d77f6]
- Updated dependencies [d367f63b5]
- Updated dependencies [937ed39ce]
- Updated dependencies [b42531cfe]
- Updated dependencies [9a9e7a42f]
- Updated dependencies [50ce875a0]
  - @backstage/core@0.7.6
  - @backstage/plugin-search-backend-node@0.1.3
  - @backstage/backend-common@0.6.3

## 0.7.1

### Patch Changes

- 017192ee8: Add support for configure an LDAP query filter on multiple lines.
- 5d0740563: Implemented missing support for the dependsOn/dependencyOf relationships
  between `Component` and `Resource` catalog model objects.

  Added support for generating the relevant relationships to the
  `BuiltinKindsEntityProcessor`, and added simple support for fetching
  relationships between `Components` and `Resources` for rendering in the
  system diagram. All catalog-model changes backwards compatible.

- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
  - @backstage/catalog-model@0.7.7

## 0.7.0

### Minor Changes

- 676ede643: DELETE on an entity now just deletes the entity, rather than removing all related entities and the location
- f1b2c1d2c: Add `readonly` mode to catalog backend

  This change adds a `catalog.readonly` field in `app-config.yaml` that can be used to configure the catalog in readonly mode which effectively disables the possibility of adding new components to the catalog after startup.

  When in `readonly` mode only locations configured in `catalog.locations` are loaded and served.
  By default `readonly` is disabled which represents the current functionality where locations can be added at run-time.

  This change requires the config API in the router which requires a change to `createRouter`.

  ```diff
     return await createRouter({
       entitiesCatalog,
       locationsCatalog,
       higherOrderOperation,
       locationAnalyzer,
       logger: env.logger,
  +    config: env.config,
     });
  ```

### Patch Changes

- 29e1789e1: Make sure that Group `spec.members` is taken into account when filling out an org hierarchy
- 8488a1a96: Added support for the "members" field of the Group entity, allowing specification of
  direct members from the Group side of the relationship. Added support to the
  `BuiltinKindsEntityProcessor` to generate the appropriate relationships.
- 6b2d54fd6: Fix mapping between users and groups for Microsoft Active Directories when using the LdapOrgProcessor
- 44590510d: Add Bitbucket Server discovery processor.
- Updated dependencies [8488a1a96]
- Updated dependencies [37e3a69f5]
  - @backstage/catalog-model@0.7.5
  - @backstage/backend-common@0.6.1

## 0.6.7

### Patch Changes

- f47e11427: Log how many repositories were actually matching in `GithubDiscoveryProcessor`
- c862b3f36: Introduce pagination in the /entities catalog endpoint.

  Pagination is requested using query parameters. Currently supported parameters, all optional, are:

  - `limit` - an integer number of entities to return, at most
  - `offset` - an integer number of entities to skip over at the start
  - `after` - an opaque string cursor as returned by a previous paginated request

  Example request:

  `GET /entities?limit=100`

  Example response:

  ```
  200 OK
  Content-Type: application/json; charset=utf-8
  Link: </entities?limit=100&after=eyJsaW1pdCI6Miwib2Zmc2V0IjoyfQ%3D%3D>; rel="next"
  <more headers>

  [{"metadata":{...
  ```

  Note the Link header. It contains the URL (path and query part, relative to the catalog root) to use for requesting the next page.
  It uses the `after` cursor to point out the end of the previous page. If the Link header is not present, there is no more data to read.

  The current implementation is naive and encodes offset/limit in the cursor implementation, so it is not robust in the face of overlapping
  changes to the catalog. This can be improved separately in the future without having to change the calling patterns.

- Updated dependencies [4d248725e]
  - @backstage/plugin-search-backend-node@0.1.2

## 0.6.6

### Patch Changes

- 010aed784: Add `AnnotateScmSlugEntityProcessor` that automatically adds the
  `github.com/project-slug` annotation for components coming from GitHub.

  The processor is optional and not automatically registered in the catalog
  builder. To add it to your instance, add it to your `CatalogBuilder` using
  `addProcessor()`:

  ```typescript
  const builder = new CatalogBuilder(env);
  builder.addProcessor(AnnotateScmSlugEntityProcessor.fromConfig(env.config));
  ```

- 4bc98a5b9: Refactor CodeOwnersProcessor to use ScmIntegrations
- d2f4efc5d: Add location to thrown exception when parsing YAML
- 8686eb38c: Use errors from `@backstage/errors`
- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.6.5

### Patch Changes

- 9ef5a126d: Allow CodeOwnersProcessor to set `spec.owner` for `System`, `Resource`, and `Domain` entity kinds.
- 0b42fff22: Make use of parseLocationReference/stringifyLocationReference
- 2ef5bc7ea: Implement proper AWS Credentials precedence with assume-role and explicit credentials
- 761698831: Bump to the latest version of the Knex library.
- 93c62c755: Move logic for generating URLs for the view, edit and source links of catalog
  entities from the catalog frontend into the backend. This is done using the
  existing support for the `backstage.io/view-url`, `backstage.io/edit-url` and
  `backstage.io/source-location` annotations that are now filled by the
  `AnnotateLocationEntityProcessor`. If these annotations are missing or empty,
  the UI disables the related controls.
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

## 0.6.4

### Patch Changes

- ecdd407b1: GithubDiscoveryProcessor outputs locations as optional to avoid outputting errors for missing locations (see https://github.com/backstage/backstage/issues/4730).
- 12d8f27a6: Add version `backstage.io/v1beta2` schema for Template entities.
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5

## 0.6.3

### Patch Changes

- 2499f6cde: Add support for assuming role in AWS integrations
- Updated dependencies [bad21a085]
- Updated dependencies [a1f5e6545]
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.6.2

### Patch Changes

- Updated dependencies [16fb1d03a]
- Updated dependencies [491f3a0ec]
- Updated dependencies [491f3a0ec]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
  - @backstage/backend-common@0.5.4
  - @backstage/integration@0.5.0

## 0.6.1

### Patch Changes

- 77ad0003a: Revert AWS SDK version to v2
- d2441aee3: use child logger, if provided, to log single location refresh
- fb53eb7cb: Don't respond to a request twice if an entity has not been found.
- f3fbfb452: add indices on columns referring locations(id)
- 84364b35c: Added an option to scan GitHub for repositories using a new location type `github-discovery`.
  Example:

  ```yaml
  type: 'github-discovery',
  target:
     'https://github.com/backstage/techdocs-*/blob/master/catalog.yaml'
  ```

  You can use wildcards (`*`) as well. This will add `location` entities for each matching repository.
  Currently though, you must specify the exact path of the `catalog.yaml` file in the repository.

- 82b2c11b6: Refactored route response handling to use more explicit types and throw errors.
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [5a5163519]
  - @backstage/backend-common@0.5.3
  - @backstage/integration@0.4.0

## 0.6.0

### Minor Changes

- 3149bfe63: Make use of the `resolveUrl` facility of the `integration` package.

  Also rename the `LocationRefProcessor` to `LocationEntityProcessor`, to match the file name. This constitutes an interface change since the class is exported, but it is unlikely to be consumed outside of the package since it sits comfortably with the other default processors inside the catalog builder.

### Patch Changes

- 24e47ef1e: Throw `NotAllowedError` when registering locations with entities of disallowed kinds
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

## 0.5.5

### Patch Changes

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- a91aa6bf2: Support supplying a custom catalog descriptor file parser
- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1

## 0.5.4

### Patch Changes

- def2307f3: Adds a `backstage.io/managed-by-origin-location` annotation to all entities. It links to the
  location that was registered to the catalog and which emitted this entity. It has a different
  semantic than the existing `backstage.io/managed-by-location` annotation, which tells the direct
  parent location that created this entity.

  Consider this example: The Backstage operator adds a location of type `github-org` in the
  `app-config.yaml`. This setting will be added to a `bootstrap:boostrap` location. The processor
  discovers the entities in the following branch
  `Location bootstrap:bootstrap -> Location github-org:… -> User xyz`. The user `xyz` will be:

  ```yaml
  apiVersion: backstage.io/v1alpha1
  kind: User
  metadata:
    name: xyz
    annotations:
      # This entity was added by the 'github-org:…' location
      backstage.io/managed-by-location: github-org:…
      # The entity was added because the 'bootstrap:boostrap' was added to the catalog
      backstage.io/managed-by-origin-location: bootstrap:bootstrap
      # ...
  spec:
    # ...
  ```

- 318a6af9f: Change AWS Account type from Component to Resource
- ac7be581a: Refuse to remove the bootstrap location
- ad838c02f: Reduce log noise on locations refresh
- f9ba00a1c: Update the @azure/msal-node dependency to 1.0.0-beta.3.
- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0

## 0.5.3

### Patch Changes

- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- ade6b3bdf: AWS SDK version bump for Catalog Backend.
- abbee6fff: Implement System, Domain and Resource entity kinds.
- 147fadcb9: Add subcomponentOf to Component kind to represent subsystems of larger components.
- Updated dependencies [f3b064e1c]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.5.2

### Patch Changes

- 99be3057c: Fixed a bug where the catalog would read back all entities when adding a location that already exists.
- 49d2016a4: Change `location_update_log` columns from `nvarchar(255)` to `text`
- 73e75ea0a: Add processor for ingesting AWS accounts from AWS Organizations
- 071711d70: Remove `sqlite3` as a dependency. You may need to add `sqlite3` as a dependency of your backend if you were relying on this indirect dependency.
- Updated dependencies [5ecd50f8a]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/backend-common@0.4.2

## 0.5.1

### Patch Changes

- 5de26b9a6: Start warning about usage of deprecated location types, such as `github`
- 30d6c78fb: Added configuration schema for the commonly used properties
- 5084e5039: Updated the config schema

## 0.5.0

### Minor Changes

- 6b37c95bf: Write relations directly as part of batch add / update of entities.

  Slight change of the `CommonDatabase` contract:

  ## `addEntity` removed

  This method was unused by the core, and rendered unnecessary when `addEntities`
  exists.

  If you were a user of `addEntity`, please call `addEntities` instead, with an
  array of one element.

  ## `DbEntityRequest` has a new field `relations`

  This is the structure that is passed to `addEntities` and `updateEntity`. It
  used to be the case that you needed to call `setRelations` separately, but now
  this instead happens directly when you call `addEntities` or `updateEntity`.

  If you were using `addEntities` or `updateEntity` directly, please adapt your
  code to add the `relations` array to each request. If you were calling
  `setRelations` separately next to these methods, you no longer need to do so,
  after adding the relations to the `DbEntityRequest`s.

- ac3560b42: Remove `implementsApis` from `Component` entities. Deprecation happened in [#3449](https://github.com/backstage/backstage/pull/3449).
  Use `providesApis` instead.

### Patch Changes

- c6eeefa35: Add support for GitHub Enterprise in GitHubOrgReaderProcessor so you can properly ingest users of a GHE organization.
- fb386b760: Break the refresh loop into several smaller transactions
- 7c3ffc0cd: Support `profile` of groups including `displayName`, `email`, and `picture` in
  `LdapOrgReaderProcessor`. The source fields for them can be configured in the
  `ldapOrg` provider.
- e7496dc3e: Break out GithubOrgReaderProcessor config into its own file for consistency with the other org processors.
- 8dd0a906d: Support `profile` of groups including `displayName` and `picture` in
  `GithubOrgReaderProcessor`. Fixes the import of `description` for groups.
- 8c31c681c: Batch the writing of statuses after refreshes. This reduced the runtime on sqlite from 16s to 0.2s, and on pg from 60s to 1s on my machine, for the huge LDAP set.
- 7b98e7fee: Add index to foreign key columns. Postgres (and others) do not do this on the "source" side of a foreign key relation, which was what led to the slowness on large datasets. The full LDAP dataset ingestion now takes two minutes, which is not optimal yet but still a huge improvement over before when it basically never finished :)
- 0097057ed: Support `profile` of groups including `displayName` and `email` in
  `MicrosoftGraphOrgReaderProcessor`. Importing `picture` doesn't work yet, as
  the Microsoft Graph API does not expose them correctly.
- Updated dependencies [c911061b7]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/backend-common@0.4.1

## 0.4.0

### Minor Changes

- 83b6e0c1f: Remove the deprecated fields `ancestors` and `descendants` from the `Group` entity.

  See https://github.com/backstage/backstage/issues/3049 and the PRs linked from it for details.

### Patch Changes

- 6e8bb3ac0: leave unknown placeholder-lookalikes untouched in the catalog processing loop
- e708679d7: refreshAllLocations uses a child logger of the HigherOrderOperation with a meta `component` : `catalog-all-locations-refresh`
- 047c018c9: Batch the fetching of relations
- 38d63fbe1: Fix string template literal
- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0

## 0.3.0

### Minor Changes

- a9fd599f7: Add Analyze location endpoint to catalog backend. Add catalog-import plugin and replace import-component with it. To start using Analyze location endpoint, you have add it to the `createRouter` function options in the `\backstage\packages\backend\src\plugins\catalog.ts` file:

  ```ts
  export default async function createPlugin(env: PluginEnvironment) {
    const builder = new CatalogBuilder(env);
    const {
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
    } = await builder.build();

    return await createRouter({
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
      logger: env.logger,
    });
  }
  ```

### Patch Changes

- b4488ddb0: Added a type alias for PositionError = GeolocationPositionError
- 08835a61d: Add support for relative targets and implicit types in Location entities.
- e42402b47: Gracefully handle missing codeowners.

  The CodeOwnersProcessor now also takes a logger as a parameter.

- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0

## 0.2.3

### Patch Changes

- 1ec19a3f4: Ignore empty YAML documents. Having a YAML file like this is now ingested without an error:

  ```yaml
  apiVersion: backstage.io/v1alpha1
  kind: Component
  metadata:
    name: web
  spec:
    type: website
  ---
  ```

  This behaves now the same way as Kubernetes handles multiple documents in a single YAML file.

- ab94c9542: Add `providesApis` and `consumesApis` to the component entity spec.
- 2daf18e80: Start emitting all known relation types from the core entity kinds, based on their spec data.
- Updated dependencies [3aa7efb3f]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2
  - @backstage/catalog-model@0.3.1

## 0.2.2

### Patch Changes

- 0c2121240: Add support for reading groups and users from the Microsoft Graph API.
- 1185919f3: Marked the `Group` entity fields `ancestors` and `descendants` for deprecation on Dec 6th, 2020. See https://github.com/backstage/backstage/issues/3049 for details.

  Code that consumes these fields should remove those usages as soon as possible. There is no current or planned replacement for these fields.

  The BuiltinKindsEntityProcessor has been updated to inject these fields as empty arrays if they are missing. Therefore, if you are on a catalog instance that uses the updated version of this code, you can start removing the fields from your source catalog-info.yaml data as well, without breaking validation.

  After Dec 6th, the fields will be removed from types and classes of the Backstage repository. At the first release after that, they will not be present in released packages either.

  If your catalog-info.yaml files still contain these fields after the deletion, they will still be valid and your ingestion will not break, but they won't be visible in the types for consuming code.

- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1

## 0.2.1

### Patch Changes

- f531d307c: An entity A, that exists in the catalog, can no longer be overwritten by registering a different location that also tries to supply an entity with the same kind+namespace+name. Writes of that new entity will instead be rejected with a log message similar to `Rejecting write of entity Component:default/artist-lookup from file:/Users/freben/dev/github/backstage/packages/catalog-model/examples/components/artist-lookup-component.yaml because entity existed from github:https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/components/artist-lookup-component.yaml`
- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.2.0

### Minor Changes

- e0be86b6f: Entirely case insensitive read path of entities
- 12b5fe940: Add ApiDefinitionAtLocationProcessor that allows to load a API definition from another location
- 57d555eb2: This feature works the same as \$secret does in config - it allows programmatic substitution of values into a document.

  This is particularly useful e.g. for API type entities where you do not want to repeat your entire API spec document inside the catalog-info.yaml file. For those cases, you can instead do something like

  ```
  apiVersion: backstage.io/v1alpha1
  kind: API
  metadata:
    name: my-federated-service
  spec:
    type: graphql
    definition:
      $text: ./schema.graphql
  ```

  The textual content of that file will be injected as the value of definition, during each refresh loop. Both relative and absolute paths are supported, as well as any HTTP/HTTPS URL pointing to a service that returns the relevant data.

  The initial version supports injection of text file data, and structured data from JSON and YAML files. You can add any handler of your own in addition to these.

- 61db1ddc6: Allow node v14 and add to master build matrix

  - Upgrade sqlite3@^5.0.0 in @backstage/plugin-catalog-backend
  - Add Node 14 to engines in @backstage/create-app

- 81cb94379: Simplify the read function in processors
- a768a07fb: Add the ability to import users from GitHub Organization into the catalog.

  The token needs to have the scopes `user:email`, `read:user`, and `read:org`.

- ce1f55398: Use the new `UrlReader` in `PlaceholderProcessor`.
  This allows to use the placeholder processor to include API definitions in API entities.
  Previously it was only possible to do this if the definition comes from the same location type as the entity itself.
- e6b00e3af: Remove the backstage.io/definition-at-location annotation.
  The annotation was superseded by the placeholder processor.

  ```yaml
  apiVersion: backstage.io/v1alpha1
  kind: API
  metadata:
    name: spotify
    description: The Spotify web API
    tags:
      - spotify
      - rest
    annotations:
      # Don't use this annotation, but the placeholder $text instead (see below).
      backstage.io/definition-at-location: 'url:https://raw.githubusercontent.com/APIs-guru/openapi-directory/master/APIs/spotify.com/v1/swagger.yaml'
  spec:
    type: openapi
    lifecycle: production
    owner: spotify@example.com
    definition:
      $text: https://raw.githubusercontent.com/APIs-guru/openapi-directory/master/APIs/spotify.com/v1/swagger.yaml
  ```

- 99710b102: The way that wiring together a catalog happens, has changed drastically. Now
  there is a new class `CatalogBuilder` that does almost all of the heavy lifting
  of how to augment/replace pieces of catalog functionality, such as adding
  support for custom entities or adding additional processors.

  As the builder was added, a lot of the static methods and builders for default
  setups have been removed from classes deep in the hierarchy. Instead, the
  builder contains the knowledge of what the defaults are.

- 002860e7a: Filters passed to the `/entities` endpoint of the catalog has changed format.

  The old way was to pass things on the form `?a=b&c=d`; the new way is to pass
  things on the form `?filter=a=b,c=d`. See discussion in
  [#2910](https://github.com/backstage/backstage/issues/2910) for details.

  The comma separated items within a single filter have an AND between them. If
  multiple such filters are passed, they have an OR between those item groups.

- 5adfc005e: Changes the various kind policies into a new type `KindValidator`.

  Adds `CatalogProcessor#validateEntityKind` that makes use of the above
  validators. This moves entity schema validity checking away from entity
  policies and into processors, centralizing the extension points into the
  processor chain.

- 948052cbb: Add ability to dry run adding a new location to the catalog API.

  The location is now added in a transaction and afterwards rolled back.
  This allows users to dry run this operation to see if there entity has issues.
  This is probably done by automated tools in the CI/CD pipeline.

- 4036ff59d: - The `CatalogProcessor` API was updated to have `preProcessEntity` and
  `postProcessEntity` methods, instead of just one `processEntity`. This makes
  it easier to make processors that have several stages in one, and to make
  different processors more position independent in the list of processors.
  - The `EntityPolicy` is now given directly to the `LocationReaders`, instead of
    being enforced inside a policy. We have decided to separate out the act of
    validating an entity to be outside of the processing flow, to make it
    possible to apply more liberally and to evolve it as a separate concept.
  - Because of the above, the `EntityPolicyProcessor` has been removed.
- 512d70973: Use the new `UrlReader` in the `CodeOwnersProcessor`.
- 2f62e1804: Removed the parseData step from catalog processors. Locations readers should emit full entities instead.
- 36a71d278: Removed support for deprecated `catalog.providers` config that have been moved to `integrations`
- a5cb46bac: Renamed the `LocationProcessor` class to `CatalogProcessor`.

  Likewise, renamed `LocationProcessorResult`, `LocationProcessorLocationResult`,
  `LocationProcessorDataResult`, `LocationProcessorEntityResult`,
  `LocationProcessorErrorResult`, and `LocationProcessorEmit` to their `Catalog*`
  counterparts.

- 49d70ccab: Remove the `read` argument of `LocationProcessor.processEntity`.
  Instead, pass the `UrlReader` into the constructor of your `LocationProcessor`.
- 440a17b39: The catalog backend UrlReaderProcessor now uses a UrlReader from @backstage/backend-common, which must now be supplied to the constructor.

### Patch Changes

- 3472c8be7: Add codeowners processor

  - Add `codeowners-utils@^1.0.2` as a dependency
  - Add `core-js@^3.6.5` as a dependency
  - Added new CodeOwnersProcessor

- 33454c0f2: Fix `CatalogBuilder#addProcessor`.
- 183e2a30d: Add support for `fields` sub-selection of just parts of an entity when listing
  entities in the catalog backend.

  Example: `.../entities?fields=metadata.name,spec.type` will return partial
  entity objects with only those exact fields present and the rest cut out.
  Fields do not have to be simple scalars - you can for example do
  `fields=metadata`.

- 8bdf0bcf5: Fix CodeOwnersProcessor to handle non team users
- 4c4eab81b: The CodeOwnersProcessor now handles 'url' locations
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
