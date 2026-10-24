# @backstage/plugin-scaffolder-backend

## 4.2.2-next.0

### Patch Changes

- 62eaba9: Fixed custom task permission rules registered by backend modules being ignored when authorizing task access and filtering task lists.
- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.7-next.0
  - @backstage/plugin-scaffolder-node@0.13.9-next.0

## 4.2.1

### Patch Changes

- 6e08d65: Fixes a regression where scaffolder step values consisting of a singular template statement block (ex. `if: "{% if parameters.foo == 'bar' %}true{% else %}false{% endif %}"`), were rendered as the strings `"true"` and `"false"` instead of their boolean values. This caused steps with `if` conditions to always run.

  Step values with a single statement block that renders nothing, such as `{% if false %}x{% endif %}`, are once again left out of the action input instead of being passed as an empty string.

  Updated `nunjitsu` to `^0.6.2`.

- Updated dependencies
  - @backstage/integration@2.1.3
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/backend-openapi-utils@0.7.3
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-catalog-node@2.2.6
  - @backstage/plugin-events-node@0.4.27
  - @backstage/plugin-permission-common@0.9.12
  - @backstage/plugin-permission-node@0.11.5
  - @backstage/plugin-scaffolder-common@2.3.1
  - @backstage/plugin-scaffolder-node@0.13.8

## 4.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/backend-openapi-utils@0.7.3-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1
  - @backstage/plugin-events-node@0.4.27-next.1
  - @backstage/plugin-permission-node@0.11.5-next.1
  - @backstage/plugin-scaffolder-node@0.13.8-next.1

## 4.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-common@2.3.1-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/backend-openapi-utils@0.7.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## 4.2.0

### Minor Changes

- 09f42dd: export workspace:template\* actions by default
- 1a705ca: Applied `templateDryRunPermission` to inline Software Template dry runs and the corresponding backend action. Permission policies that deny unknown permissions must explicitly allow `scaffolder.template.dry-run` to retain existing dry-run access.
- e95b649: Added task recovery feature with new `scaffolder.taskRecovery` config section. When enabled, tasks that crash or timeout are automatically recovered and resume from the last completed step, task secrets are retained until the task reaches a terminal state so recovery can continue, and completed step outputs are persisted. Enabling recovery applies to all scaffolder tasks, so actions used by those tasks should be idempotent or use checkpoints. When recovery is disabled (the default), the previous behavior is unchanged: secrets are cleared as soon as a task is claimed and retries re-run every step. The new config consolidates previous experimental flags (`EXPERIMENTAL_recoverTasks`, `EXPERIMENTAL_workspaceSerialization`, `EXPERIMENTAL_recoverTasksTimeout`) which remain supported as fallbacks. The legacy workspace provider setting continues to select a provider only when `EXPERIMENTAL_workspaceSerialization` is `true`.

  Workspace serialization for task recovery now requires installing a separate workspace provider module, including when you use the legacy configuration. For development, use `@backstage/plugin-scaffolder-backend-module-workspace-database` (50 MB limit, not recommended for production). On first startup, that module migrates existing database workspace snapshots from the legacy task storage. For production, use `@backstage/plugin-scaffolder-backend-module-gcp` or a similar external storage provider. The scaffolder rejects a configured provider that has not been installed and registered.

  Enabling crash recovery does not keep completed task event streams open; normal task completion remains terminal for event-stream clients.

- bbba6b5: Added the `scaffolder.requireScmUserCredentials` configuration option to require user-provided credentials for supported SCM mutation and fetch actions.

### Patch Changes

- 736d84e: Use locale-insensitive Unicode casing for consistent string handling across environments.
- 7fba55a: Removed user entity references from scaffolder task count metrics to avoid exposing user identities and creating high-cardinality metric labels.
- b1256aa: Respect task read permission decisions when listing scaffolder tasks.
- 15fa029: Restrict task list ordering to supported fields.
- be0a75a: Exclude internal task data from task responses.
- 2bf1392: Software template inline conditionals without an `else` branch now render an empty string when their condition is false, matching Nunjucks behavior.
- 3bb3710: Improved task worker resilience by backing off repeated database claim failures, containing unexpected task execution errors, and preventing new work from being claimed during graceful shutdown.
- beaa3db: Reject Scaffolder steps where `each` resolves to a primitive value instead of an array or object.
- f389dd2: Improve denied scaffolder action error handling.
- 2eebeb7: Ensure task failure details use the configured log redactions.
- 84ebbb9: Fixed log redaction for transformed secret values used to iterate Scaffolder steps.
- b4172dd: Restrict task retries to terminal states.
- c1a30ef: Restored support for intrinsic string, number, array, `Map`, and `Set` methods in software templates.
- ee9c48d: Fixed matching of action input values in scaffolder permission policies.
- 79f0b91: Fixed the scaffolder task worker silently giving up after a transient failure. A single error while picking up a task, such as a dropped database connection, would stop the backend from running any further software templates for the rest of its lifetime. New tasks stayed queued indefinitely with no error shown to the user and no failing health check, and the only way to recover was to restart the backend. Picking up tasks is now retried instead.
- Updated dependencies
  - @backstage/integration@2.1.2
  - @backstage/plugin-scaffolder-common@2.3.0
  - @backstage/backend-openapi-utils@0.7.2
  - @backstage/catalog-model@1.10.1
  - @backstage/config@1.3.9
  - @backstage/plugin-scaffolder-node@0.13.7
  - @backstage/plugin-permission-node@0.11.4
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5
  - @backstage/plugin-events-node@0.4.26
  - @backstage/plugin-permission-common@0.9.11

## 4.2.0-next.2

### Patch Changes

- 3bb3710: Improved task worker resilience by backing off repeated database claim failures, containing unexpected task execution errors, and preventing new work from being claimed during graceful shutdown.
- Updated dependencies
  - @backstage/config@1.3.9-next.0
  - @backstage/plugin-scaffolder-node@0.13.7-next.2
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/integration@2.1.2-next.1
  - @backstage/plugin-permission-common@0.9.11-next.0
  - @backstage/plugin-permission-node@0.11.4-next.1
  - @backstage/plugin-scaffolder-common@2.3.0-next.2

## 4.2.0-next.1

### Minor Changes

- bbba6b5: Added the `scaffolder.requireScmUserCredentials` configuration option to require user-provided credentials for supported SCM mutation and fetch actions.

### Patch Changes

- 7fba55a: Removed user entity references from scaffolder task count metrics to avoid exposing user identities and creating high-cardinality metric labels.
- b1256aa: Respect task read permission decisions when listing scaffolder tasks.
- 15fa029: Restrict task list ordering to supported fields.
- be0a75a: Exclude internal task data from task responses.
- f389dd2: Improve denied scaffolder action error handling.
- 2eebeb7: Ensure task failure details use the configured log redactions.
- 84ebbb9: Fixed log redaction for transformed secret values used to iterate Scaffolder steps.
- b4172dd: Restrict task retries to terminal states.
- ee9c48d: Fixed matching of action input values in scaffolder permission policies.
- 79f0b91: Fixed the scaffolder task worker silently giving up after a transient failure. A single error while picking up a task, such as a dropped database connection, would stop the backend from running any further software templates for the rest of its lifetime. New tasks stayed queued indefinitely with no error shown to the user and no failing health check, and the only way to recover was to restart the backend. Picking up tasks is now retried instead.
- Updated dependencies
  - @backstage/plugin-scaffolder-common@2.3.0-next.1
  - @backstage/integration@2.1.2-next.0
  - @backstage/backend-openapi-utils@0.7.2-next.0
  - @backstage/plugin-permission-node@0.11.4-next.0
  - @backstage/plugin-scaffolder-node@0.13.7-next.1
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0
  - @backstage/plugin-events-node@0.4.26-next.0

## 4.1.0-next.0

### Minor Changes

- 1a705ca: Applied `templateDryRunPermission` to inline Software Template dry runs and the corresponding backend action. Permission policies that deny unknown permissions must explicitly allow `scaffolder.template.dry-run` to retain existing dry-run access.
- e95b649: Added task recovery feature with new `scaffolder.taskRecovery` config section. When enabled, tasks that crash or timeout are automatically recovered and resume from the last completed step, task secrets are retained until the task reaches a terminal state so recovery can continue, and completed step outputs are persisted. Enabling recovery applies to all scaffolder tasks, so actions used by those tasks should be idempotent or use checkpoints. When recovery is disabled (the default), the previous behavior is unchanged: secrets are cleared as soon as a task is claimed and retries re-run every step. The new config consolidates previous experimental flags (`EXPERIMENTAL_recoverTasks`, `EXPERIMENTAL_workspaceSerialization`, `EXPERIMENTAL_recoverTasksTimeout`) which remain supported as fallbacks. The legacy workspace provider setting continues to select a provider only when `EXPERIMENTAL_workspaceSerialization` is `true`.

  Workspace serialization for task recovery now requires installing a separate workspace provider module, including when you use the legacy configuration. For development, use `@backstage/plugin-scaffolder-backend-module-workspace-database` (50 MB limit, not recommended for production). On first startup, that module migrates existing database workspace snapshots from the legacy task storage. For production, use `@backstage/plugin-scaffolder-backend-module-gcp` or a similar external storage provider. The scaffolder rejects a configured provider that has not been installed and registered.

  Enabling crash recovery does not keep completed task event streams open; normal task completion remains terminal for event-stream clients.

### Patch Changes

- 2bf1392: Software template inline conditionals without an `else` branch now render an empty string when their condition is false, matching Nunjucks behavior.
- beaa3db: Reject Scaffolder steps where `each` resolves to a primitive value instead of an array or object.
- c1a30ef: Restored support for intrinsic string, number, array, `Map`, and `Set` methods in software templates.
- Updated dependencies
  - @backstage/plugin-scaffolder-common@2.3.0-next.0
  - @backstage/plugin-scaffolder-node@0.13.7-next.0

## 4.0.3

### Patch Changes

- 4bbc088: Fixed the stale task janitor not being set up by passing the scheduler service to the router.
- 943687f: Removed the native addon requirement from scaffolder template rendering. Templates now run through a TypeScript interpreter, and the backend no longer needs the `--no-node-snapshot` Node.js option.
- 7ca434e: Scaffolder tasks now wait for recovery checkpoint state to be persisted before continuing, preventing later execution from racing ahead of stored recovery state. Restored checkpoints also preserve falsy values without re-running their callbacks.
- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/plugin-scaffolder-node@0.13.6
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/integration@2.1.0
  - @backstage/plugin-permission-common@0.9.10
  - @backstage/plugin-permission-node@0.11.3
  - @backstage/plugin-scaffolder-common@2.2.2
  - @backstage/backend-openapi-utils@0.7.1
  - @backstage/plugin-catalog-node@2.2.4
  - @backstage/plugin-events-node@0.4.25

## 4.0.3-next.2

### Patch Changes

- 943687f: Removed the native addon requirement from scaffolder template rendering. Templates now run through a TypeScript interpreter, and the backend no longer needs the `--no-node-snapshot` Node.js option.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.6-next.2
  - @backstage/backend-plugin-api@1.10.0-next.1

## 4.0.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.0-next.0
  - @backstage/plugin-scaffolder-common@2.2.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.6-next.1

## 4.0.3-next.0

### Patch Changes

- 4bbc088: Fixed the stale task janitor not being set up by passing the scheduler service to the router.
- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-permission-node@0.11.3-next.0
  - @backstage/backend-openapi-utils@0.7.1-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0
  - @backstage/plugin-events-node@0.4.25-next.0
  - @backstage/plugin-scaffolder-node@0.13.6-next.0

## 4.0.2

### Patch Changes

- 55902bb: Fixed `DatabaseTaskStore.list` returning `totalTasks` as a string on PostgreSQL. knex returns a `COUNT(*)` aggregate as a string on PostgreSQL (the column is a bigint) while better-sqlite3 returns a number, so the count is now coerced with `Number(...)` and guarded with `Number.isSafeInteger(...)`. This in turn fixes the `list-scaffolder-tasks` action, whose output schema declares `totalTasks: z.number()` and previously failed validation in production with `Invalid output ... totalTasks: Expected number, received string`.
- Updated dependencies
  - @backstage/backend-openapi-utils@0.7.0
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/plugin-catalog-node@2.2.3
  - @backstage/plugin-events-node@0.4.24
  - @backstage/plugin-permission-node@0.11.2
  - @backstage/plugin-scaffolder-node@0.13.5

## 4.0.2-next.1

### Patch Changes

- 55902bb: Fixed `DatabaseTaskStore.list` returning `totalTasks` as a string on PostgreSQL. knex returns a `COUNT(*)` aggregate as a string on PostgreSQL (the column is a bigint) while better-sqlite3 returns a number, so the count is now coerced with `Number(...)` and guarded with `Number.isSafeInteger(...)`. This in turn fixes the `list-scaffolder-tasks` action, whose output schema declares `totalTasks: z.number()` and previously failed validation in production with `Invalid output ... totalTasks: Expected number, received string`.
- Updated dependencies
  - @backstage/backend-openapi-utils@0.7.0-next.1
  - @backstage/backend-plugin-api@1.9.3-next.1

## 4.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.11.2-next.0
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0
  - @backstage/plugin-events-node@0.4.24-next.0
  - @backstage/plugin-scaffolder-node@0.13.5-next.0
  - @backstage/backend-openapi-utils@0.6.11-next.0

## 4.0.1

### Patch Changes

- 063fc34: Restored user-supplied task secrets in scaffolder dry-run executions. The previous security fix that stripped secrets from dry-run also removed task secrets passed in the dry-run request body, which broke integration test setups that rely on user-supplied secrets. Environment secrets (server-configured) remain stripped during dry-run; only task secrets supplied by the caller are now forwarded to actions.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.4
  - @backstage/integration@2.0.3
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-scaffolder-common@2.2.1
  - @backstage/backend-openapi-utils@0.6.10
  - @backstage/plugin-catalog-node@2.2.2
  - @backstage/plugin-events-node@0.4.23
  - @backstage/plugin-permission-node@0.11.1

## 4.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.0.3-next.0
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/plugin-scaffolder-common@2.2.1-next.0
  - @backstage/plugin-scaffolder-node@0.13.4-next.0
  - @backstage/plugin-permission-node@0.11.1-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0
  - @backstage/plugin-events-node@0.4.23-next.0
  - @backstage/backend-openapi-utils@0.6.10-next.0

## 4.0.0

### Minor Changes

- 77bee9f: Updated the `list-scaffolder-tasks` action to support the new "status" filter parameter, allowing the action to return tasks matching a specific status.
- 07e08be: Added `always()` and `failure()` status check functions for scaffolder steps. These functions can be used in the if field of a step to control execution after failures. `always()` ensures a step runs regardless of previous step outcomes, while `failure()` runs a step only when a previous step has failed.
- 8006acf: The template parameter schema response now exposes a `formDecorators` field
  instead of `EXPERIMENTAL_formDecorators`. Templates that still declare
  `spec.EXPERIMENTAL_formDecorators` are read transparently and surfaced under
  the new field.

### Patch Changes

- c78b3b6: Add explicit memory management to SecureTemplater usage
- 1ecc3ca: Fixed spelling mistakes in internal code
- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/integration@2.0.2
  - @backstage/plugin-scaffolder-node@0.13.3
  - @backstage/plugin-permission-node@0.11.0
  - @backstage/plugin-permission-common@0.9.9
  - @backstage/plugin-scaffolder-common@2.2.0
  - @backstage/backend-openapi-utils@0.6.9
  - @backstage/config@1.3.8
  - @backstage/plugin-events-node@0.4.22

## 4.0.0-next.2

### Major Changes

- c78b3b6: Add explicit memory management to SecureTemplater usage

### Minor Changes

- 8006acf: The template parameter schema response now exposes a `formDecorators` field
  instead of `EXPERIMENTAL_formDecorators`. Templates that still declare
  `spec.EXPERIMENTAL_formDecorators` are read transparently and surfaced under
  the new field.

### Patch Changes

- 1ecc3ca: Fixed spelling mistakes in internal code
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.1-next.1
  - @backstage/plugin-scaffolder-common@2.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.13.3-next.2

## 3.5.0-next.1

### Minor Changes

- 77bee9f: Updated the `list-scaffolder-tasks` action to support the new "status" filter parameter, allowing the action to return tasks matching a specific status.
- 07e08be: Added `always()` and `failure()` status check functions for scaffolder steps. These functions can be used in the if field of a step to control execution after failures. `always()` ensures a step runs regardless of previous step outcomes, while `failure()` runs a step only when a previous step has failed.

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.1
  - @backstage/plugin-catalog-node@2.2.1-next.1
  - @backstage/plugin-scaffolder-node@0.13.3-next.1
  - @backstage/plugin-permission-common@0.9.9-next.1

## 3.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/integration@2.0.2-next.0
  - @backstage/backend-openapi-utils@0.6.9-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/plugin-events-node@0.4.22-next.0
  - @backstage/plugin-permission-common@0.9.9-next.0
  - @backstage/plugin-permission-node@0.10.13-next.0
  - @backstage/plugin-scaffolder-common@2.1.1-next.0
  - @backstage/plugin-scaffolder-node@0.13.3-next.0
  - @backstage/types@1.2.2

## 3.4.0

### Minor Changes

- 309b712: Added a new `execute-template` actions registry action that executes a scaffolder template with provided input values and returns a task ID for tracking progress.
- 5af48e7: Migrated permission registration to use the `PermissionsRegistryService` instead of the deprecated `createPermissionIntegrationRouter`. This fixes an issue where scaffolder permissions were not visible to RBAC plugins because the `actionsRegistryServiceRef` dependency caused an empty permissions metadata router to shadow the scaffolder's actual permission metadata. The old `createPermissionIntegrationRouter` path is retained as a fallback for standalone `createRouter` usage.

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- 961e274: Migrated OpenTelemetry metrics to use the `MetricsService` from `@backstage/backend-plugin-api/alpha` instead of the raw `@opentelemetry/api` meter.
- 8a42f77: Fix handling of `after=0` in task events endpoint
- 4559806: Removed unnecessary empty `examples` array from actions bridged via the actions registry.
- 79453c0: Updated dependency `wait-for-expect` to `^4.0.0`.
- 3ef6078: Added support for conditional `if` filtering on output `links` and `text` items. Items where the `if` condition evaluates to false are now excluded from the task output.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/plugin-scaffolder-common@2.1.0
  - @backstage/plugin-scaffolder-node@0.13.2
  - @backstage/backend-openapi-utils@0.6.8
  - @backstage/integration@2.0.1
  - @backstage/plugin-permission-node@0.10.12
  - @backstage/config@1.3.7
  - @backstage/plugin-events-node@0.4.21
  - @backstage/plugin-permission-common@0.9.8

## 3.4.0-next.2

### Minor Changes

- 5af48e7: Migrated permission registration to use the `PermissionsRegistryService` instead of the deprecated `createPermissionIntegrationRouter`. This fixes an issue where scaffolder permissions were not visible to RBAC plugins because the `actionsRegistryServiceRef` dependency caused an empty permissions metadata router to shadow the scaffolder's actual permission metadata. The old `createPermissionIntegrationRouter` path is retained as a fallback for standalone `createRouter` usage.

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- 961e274: Migrated OpenTelemetry metrics to use the `MetricsService` from `@backstage/backend-plugin-api/alpha` instead of the raw `@opentelemetry/api` meter.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/plugin-scaffolder-node@0.13.2-next.2
  - @backstage/integration@2.0.1-next.0
  - @backstage/backend-openapi-utils@0.6.8-next.2
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0
  - @backstage/plugin-events-node@0.4.21-next.2
  - @backstage/plugin-permission-common@0.9.8-next.0
  - @backstage/plugin-permission-node@0.10.12-next.2
  - @backstage/plugin-scaffolder-common@2.0.1-next.0

## 3.3.0-next.1

### Minor Changes

- 309b712: Added a new `execute-template` actions registry action that executes a scaffolder template with provided input values and returns a task ID for tracking progress.

### Patch Changes

- 4559806: Removed unnecessary empty `examples` array from actions bridged via the actions registry.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/backend-openapi-utils@0.6.8-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1
  - @backstage/plugin-events-node@0.4.21-next.1
  - @backstage/plugin-permission-node@0.10.12-next.1
  - @backstage/plugin-scaffolder-node@0.13.1-next.1

## 3.2.1-next.0

### Patch Changes

- 79453c0: Updated dependency `wait-for-expect` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-permission-node@0.10.12-next.0
  - @backstage/backend-openapi-utils@0.6.8-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/plugin-events-node@0.4.21-next.0
  - @backstage/plugin-scaffolder-node@0.13.1-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration@2.0.0
  - @backstage/types@1.2.2
  - @backstage/plugin-permission-common@0.9.7
  - @backstage/plugin-scaffolder-common@2.0.0

## 3.2.0

### Minor Changes

- c9b11eb: Added a new `list-scaffolder-tasks` action that allows querying scaffolder tasks with optional ownership filtering and pagination support
- 1b42218: Adds a new `get-scaffolder-task-logs` action to `@backstage/plugin-scaffolder-backend` that retrieves log events for a given scaffolder task, with optional support for retrieving only new events after a given event ID.
- 0fbcf23: Migrated OpenAPI schemas to 3.1.
- 7695dd2: Added a new `list-scaffolder-actions` action that returns all installed scaffolder actions with their schemas and examples
- e8736ea: Added secrets schema validation for task creation, retry, and dry-run endpoints. When a template defines `spec.secrets.schema`, the API validates provided secrets against the schema and returns a `400` error if validation fails.

### Patch Changes

- e27bd4e: Removed `@backstage/plugin-scaffolder-backend-module-bitbucket` from `package.json` as the package itself has been deprecated and the code deleted.
- 4f5ed06: Fixed a security vulnerability where server-configured environment secrets were exposed through the scaffolder dry-run endpoint.
- 30ff981: Fixed a security vulnerability where secrets could bypass log redaction when transformed through Nunjucks filters in scaffolder templates.
- 4e39e63: Removed unused dependencies
- a49a40d: Updated dependency `zod` to `^3.25.76 || ^4.0.0` & migrated to `/v3` or `/v4` imports.
- ccc20cf: create scaffolder MCP action to dry run a provided scaffolder template
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/plugin-scaffolder-node@0.13.0
  - @backstage/integration@2.0.0
  - @backstage/plugin-catalog-node@2.1.0
  - @backstage/plugin-scaffolder-common@2.0.0
  - @backstage/plugin-permission-common@0.9.7
  - @backstage/plugin-permission-node@0.10.11
  - @backstage/catalog-model@1.7.7
  - @backstage/backend-openapi-utils@0.6.7
  - @backstage/plugin-events-node@0.4.20

## 3.2.0-next.2

### Minor Changes

- e8736ea: Added secrets schema validation for task creation, retry, and dry-run endpoints. When a template defines `spec.secrets.schema`, the API validates provided secrets against the schema and returns a `400` error if validation fails.

### Patch Changes

- 30ff981: Fixed a security vulnerability where secrets could bypass log redaction when transformed through Nunjucks filters in scaffolder templates.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/integration@2.0.0-next.2
  - @backstage/plugin-scaffolder-common@2.0.0-next.2
  - @backstage/backend-openapi-utils@0.6.7-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.2
  - @backstage/plugin-events-node@0.4.20-next.1
  - @backstage/plugin-permission-node@0.10.11-next.1
  - @backstage/plugin-scaffolder-node@0.13.0-next.2

## 3.2.0-next.1

### Minor Changes

- c9b11eb: Added a new `list-scaffolder-tasks` action that allows querying scaffolder tasks with optional ownership filtering and pagination support
- 0fbcf23: Migrated OpenAPI schemas to 3.1.
- 7695dd2: Added a new `list-scaffolder-actions` action that returns all installed scaffolder actions with their schemas and examples

### Patch Changes

- e27bd4e: Removed `@backstage/plugin-scaffolder-backend-module-bitbucket` from `package.json` as the package itself has been deprecated and the code deleted.
- ccc20cf: create scaffolder MCP action to dry run a provided scaffolder template
- Updated dependencies
  - @backstage/integration@2.0.0-next.1
  - @backstage/plugin-scaffolder-common@2.0.0-next.1
  - @backstage/plugin-scaffolder-node@0.13.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.1
  - @backstage/backend-openapi-utils@0.6.7-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-events-node@0.4.20-next.0
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-permission-node@0.10.11-next.0

## 3.1.4-next.0

### Patch Changes

- 4e39e63: Removed unused dependencies
- Updated dependencies
  - @backstage/integration@1.21.0-next.0
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/backend-openapi-utils@0.6.7-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-events-node@0.4.20-next.0
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-permission-node@0.10.11-next.0
  - @backstage/plugin-scaffolder-common@1.7.7-next.0
  - @backstage/plugin-scaffolder-node@0.12.6-next.0

## 3.1.3

### Patch Changes

- 7455dae: Use node prefix on native imports
- 4fc7bf0: Removed unused dependency
- 0ce78b0: Support `if` conditions inside `each` loops for scaffolder steps
- 5e3ef57: Added `peerModules` metadata declaring recommended modules for cross-plugin integrations.
- 8148621: Moved `@backstage/backend-defaults` from `dependencies` to `devDependencies`.
- 1e669cc: Migrate audit events reference docs to http://backstage.io/docs.
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.11.3
  - @backstage/integration@1.20.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.17
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.3.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.19
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.18
  - @backstage/plugin-scaffolder-backend-module-github@0.9.6
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.18
  - @backstage/backend-openapi-utils@0.6.6
  - @backstage/plugin-bitbucket-cloud-common@0.3.7
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-scaffolder-node@0.12.5
  - @backstage/plugin-auth-node@0.6.13
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-permission-node@0.10.10
  - @backstage/plugin-events-node@0.4.19
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.18
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.18
  - @backstage/plugin-scaffolder-common@1.7.6

## 3.1.3-next.2

### Patch Changes

- 8148621: Moved `@backstage/backend-defaults` from `dependencies` to `devDependencies`.
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.11.3-next.2
  - @backstage/integration@1.20.0-next.2
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-auth-node@0.6.13-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.17-next.1
  - @backstage/plugin-events-node@0.4.19-next.0
  - @backstage/plugin-permission-node@0.10.10-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.19-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.3.3-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.18-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.18-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.18-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.9.6-next.2
  - @backstage/plugin-scaffolder-node@0.12.5-next.1

## 3.1.3-next.1

### Patch Changes

- 5e3ef57: Added `peerModules` metadata declaring recommended modules for cross-plugin integrations.
- Updated dependencies
  - @backstage/integration@1.20.0-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.11.3-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/backend-defaults@0.15.2-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.3.7-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.18-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.19-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.3.3-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.18-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.18-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.18-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.9.6-next.1
  - @backstage/plugin-scaffolder-common@1.7.6-next.1
  - @backstage/plugin-scaffolder-node@0.12.5-next.1

## 3.1.2-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports
- 4fc7bf0: Removed unused dependency
- 1e669cc: Migrate audit events reference docs to http://backstage.io/docs.
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.17-next.0
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.3.2-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.19-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.18-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.9.5-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.11.2-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.18-next.0
  - @backstage/backend-openapi-utils@0.6.6-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.3.7-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/backend-defaults@0.15.1-next.0
  - @backstage/plugin-scaffolder-node@0.12.4-next.0
  - @backstage/integration@1.19.3-next.0
  - @backstage/plugin-auth-node@0.6.12-next.0
  - @backstage/plugin-permission-common@0.9.5-next.0
  - @backstage/plugin-permission-node@0.10.9-next.0
  - @backstage/plugin-events-node@0.4.19-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.18-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.18-next.0
  - @backstage/plugin-scaffolder-common@1.7.6-next.0

## 3.1.1

### Patch Changes

- 5012852: Remove unused abort controller in debug:wait action
- c641c14: Wrap some of the action logic with `resolveSafeChildPath` and improve symlink handling when fetching remote and local files
- 27f9061: REwrite]
- 872eb91: Upgrade `zod-to-json-schema` to latest version
- Updated dependencies
  - @backstage/backend-defaults@0.15.0
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/plugin-scaffolder-node@0.12.3
  - @backstage/integration@1.19.2
  - @backstage/backend-openapi-utils@0.6.5
  - @backstage/plugin-scaffolder-backend-module-github@0.9.4
  - @backstage/plugin-auth-node@0.6.11
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.17
  - @backstage/plugin-permission-common@0.9.4
  - @backstage/plugin-permission-node@0.10.8
  - @backstage/plugin-bitbucket-cloud-common@0.3.6
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.16
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.18
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.3.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.17
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.17
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.17
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.11.1
  - @backstage/plugin-scaffolder-common@1.7.5

## 3.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.15.0-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.9.4-next.1
  - @backstage/plugin-auth-node@0.6.10
  - @backstage/plugin-permission-node@0.10.7

## 3.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.1-next.1
  - @backstage/integration@1.19.2-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.3.6-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.17-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.18-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.3.1-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.17-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.17-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.17-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.9.4-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.11.1-next.0
  - @backstage/plugin-scaffolder-common@1.7.5-next.0
  - @backstage/plugin-scaffolder-node@0.12.3-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.16-next.0

## 3.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.5-next.0
  - @backstage/backend-defaults@0.14.1-next.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration@1.19.0
  - @backstage/types@1.2.2
  - @backstage/plugin-auth-node@0.6.10
  - @backstage/plugin-bitbucket-cloud-common@0.3.5
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.15
  - @backstage/plugin-catalog-node@1.20.1
  - @backstage/plugin-events-node@0.4.18
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-permission-node@0.10.7
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.16
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.17
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.3.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.16
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.16
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.16
  - @backstage/plugin-scaffolder-backend-module-github@0.9.3
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.11.0
  - @backstage/plugin-scaffolder-common@1.7.4
  - @backstage/plugin-scaffolder-node@0.12.2

## 3.1.0

### Minor Changes

- a4cd405: Add `defaultEnvironment` config to scaffolder to enable more flexible and custom templates. Now it's possible enable access to default parameters and secrets in templates, improving security and reducing complexity.

### Patch Changes

- be5972b: Fixed a bug where config was not passed to NunjucksWorkflowRunner, causing defaultEnvironment to be undefined
- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- 2bae83a: Updated `isolated-vm` to `6.0.1`
- 25b560e: Internal change to support new versions of the `logform` library
- 8f4aded: Fixing OpenAPI definition
- 1226647: Updated dependency `esbuild` to `^0.27.0`.
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.11.0
  - @backstage/integration@1.19.0
  - @backstage/plugin-auth-node@0.6.10
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.3.0
  - @backstage/plugin-bitbucket-cloud-common@0.3.5
  - @backstage/backend-defaults@0.14.0
  - @backstage/backend-openapi-utils@0.6.4
  - @backstage/plugin-events-node@0.4.18
  - @backstage/plugin-permission-node@0.10.7
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-scaffolder-backend-module-github@0.9.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.16
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.17
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.15
  - @backstage/plugin-catalog-node@1.20.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.16
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.16
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.16
  - @backstage/plugin-scaffolder-common@1.7.4
  - @backstage/plugin-scaffolder-node@0.12.2

## 3.1.0-next.1

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- 2bae83a: Updated `isolated-vm` to `6.0.1`
- 25b560e: Internal change to support new versions of the `logform` library
- 1226647: Updated dependency `esbuild` to `^0.27.0`.
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.11.0-next.1
  - @backstage/backend-defaults@0.14.0-next.1
  - @backstage/backend-openapi-utils@0.6.4-next.1
  - @backstage/plugin-auth-node@0.6.10-next.1
  - @backstage/plugin-events-node@0.4.18-next.1
  - @backstage/plugin-permission-node@0.10.7-next.1
  - @backstage/integration@1.18.3-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.16-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-bitbucket-cloud-common@0.3.5-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.15-next.1
  - @backstage/plugin-catalog-node@1.20.1-next.1
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.16-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.17-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.16-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.16-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.16-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.9.3-next.1
  - @backstage/plugin-scaffolder-common@1.7.4-next.0
  - @backstage/plugin-scaffolder-node@0.12.2-next.1

## 3.1.0-next.0

### Minor Changes

- a4cd405: Add `defaultEnvironment` config to scaffolder to enable more flexible and custom templates. Now it's possible enable access to default parameters and secrets in templates, improving security and reducing complexity.

### Patch Changes

- 8f4aded: Fixing OpenAPI definition
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.10-next.0
  - @backstage/backend-defaults@0.14.0-next.0
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/integration@1.18.3-next.0
  - @backstage/plugin-permission-node@0.10.7-next.0
  - @backstage/backend-openapi-utils@0.6.4-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.15-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/plugin-events-node@0.4.18-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.16-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.17-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.16-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.16-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.16-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.16-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.9.3-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.10.1-next.0
  - @backstage/plugin-scaffolder-node@0.12.2-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.3.5-next.0
  - @backstage/plugin-scaffolder-common@1.7.4-next.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-permission-common@0.9.3

## 3.0.1

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.15
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.16
  - @backstage/plugin-bitbucket-cloud-common@0.3.4
  - @backstage/integration@1.18.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.10.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-events-node@0.4.17
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-scaffolder-node@0.12.1
  - @backstage/backend-openapi-utils@0.6.3
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.14
  - @backstage/plugin-permission-node@0.10.6
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.15
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.15
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.15
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.15
  - @backstage/plugin-scaffolder-backend-module-github@0.9.2
  - @backstage/plugin-scaffolder-common@1.7.3

## 3.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-defaults@0.13.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.10.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-permission-common@0.9.3-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.14-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.9.2-next.1
  - @backstage/backend-openapi-utils@0.6.3-next.1
  - @backstage/plugin-auth-node@0.6.9-next.1
  - @backstage/plugin-events-node@0.4.17-next.1
  - @backstage/plugin-permission-node@0.10.6-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.15-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.16-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.15-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.15-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.15-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.15-next.1
  - @backstage/plugin-scaffolder-node@0.12.1-next.1

## 3.0.1-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1-next.0
  - @backstage/plugin-events-node@0.4.17-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.3.4-next.0
  - @backstage/plugin-auth-node@0.6.9-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/integration@1.18.2-next.0
  - @backstage/plugin-scaffolder-node@0.12.1-next.0
  - @backstage/plugin-permission-node@0.10.6-next.0
  - @backstage/backend-openapi-utils@0.6.3-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.14-next.0
  - @backstage/plugin-catalog-node@1.19.2-next.0
  - @backstage/plugin-permission-common@0.9.3-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.15-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.16-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.15-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.15-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.15-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.15-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.9.2-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.7-next.0
  - @backstage/plugin-scaffolder-common@1.7.3-next.0

## 3.0.0

### Major Changes

- 9b81a90: **BREAKING** - Removing the deprecated types and interfaces, there's no replacement for these types, and hopefully not currently used as they offer no value with the plugin being on the new backend system and no way to consume them.

  Affected types: `CreateWorkerOptions`, `CurrentClaimedTask`, `DatabaseTaskStore`, `DatabaseTaskStoreOptions`, `TaskManager`, `TaskStore`, `TaskStoreCreateTaskOptions`, `TaskStoreCreateTaskResult`, `TaskStoreEmitOptions`, `TaskStoreListEventsOptions`, `TaskStoreRecoverTaskOptions`, `TaskStoreShutDownTaskOptions`, `TaskWorker` and `TemplateActionRegistry`.

### Patch Changes

- f222a2e: Fixed distributed actions not being visible in the scaffolder template actions.

  Depending on the plugin startup order, some of the distributed actions were not being registered correctly,
  causing them to be invisible in the scaffolder template actions list.

- Updated dependencies
  - @backstage/backend-defaults@0.13.0
  - @backstage/integration@1.18.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.14
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.14
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.15
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.14
  - @backstage/plugin-scaffolder-backend-module-github@0.9.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.6
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.14
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.14
  - @backstage/plugin-scaffolder-node@0.12.0
  - @backstage/config@1.3.5
  - @backstage/plugin-bitbucket-cloud-common@0.3.3
  - @backstage/backend-openapi-utils@0.6.2
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-auth-node@0.6.8
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.13
  - @backstage/plugin-catalog-node@1.19.1
  - @backstage/plugin-events-node@0.4.16
  - @backstage/plugin-permission-common@0.9.2
  - @backstage/plugin-permission-node@0.10.5
  - @backstage/plugin-scaffolder-common@1.7.2

## 3.0.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/backend-defaults@0.13.0-next.1
  - @backstage/integration@1.18.1-next.1
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-auth-node@0.6.8-next.0
  - @backstage/plugin-permission-common@0.9.2-next.0
  - @backstage/plugin-permission-node@0.10.5-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.14-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.15-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.14-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.14-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.14-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.14-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.9.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.6-next.1
  - @backstage/plugin-scaffolder-node@0.12.0-next.1
  - @backstage/backend-openapi-utils@0.6.2-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.13-next.1
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-events-node@0.4.16-next.0
  - @backstage/plugin-scaffolder-common@1.7.2-next.1

## 3.0.0-next.0

### Major Changes

- 9b81a90: **BREAKING** - Removing the deprecated types and interfaces, there's no replacement for these types, and hopefully not currently used as they offer no value with the plugin being on the new backend system and no way to consume them.

  Affected types: `CreateWorkerOptions`, `CurrentClaimedTask`, `DatabaseTaskStore`, `DatabaseTaskStoreOptions`, `TaskManager`, `TaskStore`, `TaskStoreCreateTaskOptions`, `TaskStoreCreateTaskResult`, `TaskStoreEmitOptions`, `TaskStoreListEventsOptions`, `TaskStoreRecoverTaskOptions`, `TaskStoreShutDownTaskOptions`, `TaskWorker` and `TemplateActionRegistry`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0-next.0
  - @backstage/integration@1.18.1-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.14-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.14-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.15-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.14-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.9.1-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.6-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.14-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.14-next.0
  - @backstage/plugin-scaffolder-node@0.12.0-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.3.3-next.0
  - @backstage/plugin-auth-node@0.6.7
  - @backstage/plugin-permission-node@0.10.4
  - @backstage/plugin-scaffolder-common@1.7.2-next.0
  - @backstage/backend-openapi-utils@0.6.1
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.13-next.0
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-events-node@0.4.15
  - @backstage/plugin-permission-common@0.9.1

## 2.2.1

### Patch Changes

- a57185f: Added support for executing actions from the `ActionsRegistry` in the `scaffolder-backend`
- c3405db: Fixed a regression that prevented uploads greater than 100KB. Uploads up to 10MB are supported again.
- Updated dependencies
  - @backstage/backend-defaults@0.12.1
  - @backstage/plugin-scaffolder-backend-module-github@0.9.0
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-auth-node@0.6.7
  - @backstage/plugin-events-node@0.4.15
  - @backstage/integration@1.18.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.5
  - @backstage/types@1.2.2
  - @backstage/backend-openapi-utils@0.6.1
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/plugin-bitbucket-cloud-common@0.3.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.12
  - @backstage/plugin-permission-node@0.10.4
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.13
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.14
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.13
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.13
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.13
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.13
  - @backstage/plugin-scaffolder-common@1.7.1
  - @backstage/plugin-scaffolder-node@0.11.1

## 2.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.1-next.1
  - @backstage/plugin-auth-node@0.6.7-next.1
  - @backstage/plugin-catalog-node@1.19.0-next.1
  - @backstage/integration@1.18.0-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.12-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.8.3-next.1

## 2.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.0-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.5-next.0
  - @backstage/plugin-auth-node@0.6.7-next.0
  - @backstage/backend-defaults@0.12.1-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.3.2-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.13-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.14-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.13-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.13-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.13-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.13-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.8.3-next.0
  - @backstage/plugin-scaffolder-common@1.7.1-next.0
  - @backstage/plugin-scaffolder-node@0.11.1-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-permission-node@0.10.4-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.12-next.0
  - @backstage/backend-openapi-utils@0.6.1-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0
  - @backstage/plugin-events-node@0.4.15-next.0

## 2.2.0

### Minor Changes

- c08cbc4: Move Scaffolder API to OpenAPI
- 2032660: Fixed fs:readdir action example
- 11dc90f: Implement max length for scaffolder auditor audit logging with default of 256
- 812485c: Add step info to scaffolder action context to access the step id and name.

### Patch Changes

- caee2eb: Fixed WinstonLogger throwing when redactions were null or undefined
- 4ae87f5: add `getResources` method to `permissionIntegrationRouter` for frontend task permission checks
- b817c1d: Stop logging of `SPLAT` twice in logs
- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.0
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-scaffolder-common@1.7.0
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.4
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-scaffolder-backend-module-github@0.8.2
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.11
  - @backstage/plugin-events-node@0.4.14
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.12
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.13
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.12
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.12
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.12
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.12

## 2.2.0-next.1

### Minor Changes

- 2032660: Fixed fs:readdir action example
- 11dc90f: Implement max length for scaffolder auditor audit logging with default of 256

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.0-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.4-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.8.2-next.1

## 2.2.0-next.0

### Minor Changes

- c08cbc4: Move Scaffolder API to OpenAPI
- 812485c: Add step info to scaffolder action context to access the step id and name.

### Patch Changes

- caee2eb: Fixed WinstonLogger throwing when redactions were null or undefined
- Updated dependencies
  - @backstage/backend-defaults@0.11.2-next.0
  - @backstage/backend-openapi-utils@0.6.0-next.0
  - @backstage/plugin-scaffolder-common@1.7.0-next.0
  - @backstage/plugin-scaffolder-node@0.11.0-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.4-next.0
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/plugin-auth-node@0.6.6-next.0
  - @backstage/plugin-permission-node@0.10.3-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.11-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.12-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.13-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.12-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.12-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.12-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.12-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.8.2-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/plugin-events-node@0.4.14-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.1
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.3.1
  - @backstage/plugin-permission-common@0.9.1

## 2.1.0

### Minor Changes

- c1ce316: BREAKING `/alpha`: Converted `scaffolder.task.read` and `scaffolder.task.cancel` into Resource Permissions.

  BREAKING `/alpha`: Added a new scaffolder rule `isTaskOwner` for `scaffolder.task.read` and `scaffolder.task.cancel` to allow for conditional permission policies such as restricting access to tasks and task events based on task creators.

  BREAKING `/alpha`: Retrying a task now requires both `scaffolder.task.read` and `scaffolder.task.create` permissions, replacing the previous requirement of `scaffolder.task.read` and `scaffolder.task.cancel`.

### Patch Changes

- 424610a: Scaffolder audit Log now includes taskId and createdBy
- dbde180: An internal refactor which adds additional types to experimental checkpoints
- fc70b43: Replaced deprecated uses of `@backstage/backend-common` with the equivalents in `@backstage/backend-defaults` and `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/plugin-permission-common@0.9.1
  - @backstage/plugin-permission-node@0.10.2
  - @backstage/catalog-model@1.7.5
  - @backstage/backend-defaults@0.11.1
  - @backstage/plugin-scaffolder-node@0.10.0
  - @backstage/integration@1.17.1
  - @backstage/plugin-scaffolder-backend-module-github@0.8.1
  - @backstage/plugin-scaffolder-common@1.6.0
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-auth-node@0.6.5
  - @backstage/plugin-bitbucket-cloud-common@0.3.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.10
  - @backstage/plugin-catalog-node@1.17.2
  - @backstage/plugin-events-node@0.4.13
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.11
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.12
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.11
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.11
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.11
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.11
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.3

## 2.1.0-next.2

### Minor Changes

- c1ce316: BREAKING `/alpha`: Converted `scaffolder.task.read` and `scaffolder.task.cancel` into Resource Permissions.

  BREAKING `/alpha`: Added a new scaffolder rule `isTaskOwner` for `scaffolder.task.read` and `scaffolder.task.cancel` to allow for conditional permission policies such as restricting access to tasks and task events based on task creators.

  BREAKING `/alpha`: Retrying a task now requires both `scaffolder.task.read` and `scaffolder.task.create` permissions, replacing the previous requirement of `scaffolder.task.read` and `scaffolder.task.cancel`.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.6.0-next.1
  - @backstage/plugin-scaffolder-node@0.10.0-next.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.10-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.11-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.12-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.11-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.11-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.11-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.11-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.8.1-next.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.3-next.2

## 2.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/plugin-permission-common@0.9.1-next.0
  - @backstage/plugin-permission-node@0.10.2-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/backend-defaults@0.11.1-next.1
  - @backstage/integration@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-auth-node@0.6.5-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.11-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.12-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.11-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.11-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.11-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.11-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.8.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.3-next.1
  - @backstage/plugin-scaffolder-node@0.9.1-next.1
  - @backstage/plugin-catalog-node@1.17.2-next.0
  - @backstage/plugin-scaffolder-common@1.5.12-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.10-next.0
  - @backstage/plugin-events-node@0.4.13-next.0

## 2.0.1-next.0

### Patch Changes

- dbde180: An internal refactor which adds additional types to experimental checkpoints
- fc70b43: Replaced deprecated uses of `@backstage/backend-common` with the equivalents in `@backstage/backend-defaults` and `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/backend-defaults@0.11.1-next.0
  - @backstage/plugin-scaffolder-node@0.9.1-next.0
  - @backstage/integration@1.17.1-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.8.1-next.0
  - @backstage/plugin-auth-node@0.6.4
  - @backstage/plugin-permission-node@0.10.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.9
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/plugin-events-node@0.4.12
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.12-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.11-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.11-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.11-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.11-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.3-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.11-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.3.1-next.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-scaffolder-common@1.5.11

## 2.0.0

### Major Changes

- 33394db: **BREAKING CHANGES**

  Removal of deprecated re-exports from module packages.

  The following functions have been re-exported from the `scaffolder-backend` plugin for quite some time, and now it's time to clean them up. They've been moved as follows:

  - `createPublishAzureAction` should be imported from `@backstage/plugin-scaffolder-backend-module-azure` instead.

  - `createPublishBitbucketCloudAction` should be imported from `@backstage/plugin-scaffolder-backend-module-bitbucket-cloud` instead.

  - `createPublishBitbucketServerAction` and `createPublishBitbucketServerPullRequestAction` can be imported from `@backstage/plugin-scaffolder-backend-module-bitbucket-server` instead.

  - `createPublishBitbucketAction` should be imported from `@backstage/plugin-scaffolder-backend-module-bitbucket` instead.

  - `createPublishGerritAction` and `createPublishGerritReviewAction` can be imported from `@backstage/plugin-scaffolder-backend-module-gerrit` instead.

  - `createGithubActionsDispatchAction`, `createGithubDeployKeyAction`, `createGithubEnvironmentAction`, `createGithubIssuesLabelAction`, `CreateGithubPullRequestActionOptions`, `createGithubRepoCreateAction`, `createGithubRepoPushAction`, `createGithubWebhookAction`, and `createPublishGithubAction` can be imported from `@backstage/plugin-scaffolder-backend-module-github` instead.

  - `createPublishGitlabAction` should be imported from `@backstage/plugin-scaffolder-backend-module-gitlab` instead.

  - `ActionContext`. `createTemplateAction`, `executeShellCommand`, `ExecuteShellCommandOptions`, `fetchContents`, `TaskSecrets`, and `TemplateAction` should be imported from `@backstage/plugin-scaffolder-node` instead.

  - `ScaffolderEntitiesProcessor` should be imported from `@backstage/plugin-catalog-backend-module-scaffolder-entity-model` instead.

- a8fcf04: **BREAKING ALPHA**: The `/alpha` export no longer exports the plugin. Please use `import('@backstage/plugin-scaffolder-backend')` instead as this has been removed.

  **BREAKING CHANGES**: The old `createRouter` function which was used in the old backend system has been removed along with the `RouterOptions` type.

- 73b94d7: **BREAKING CHANGES**

  The following functions have been re-exported from the `scaffolder-backend` plugin for quite some time, and now it's time to clean them up. They've been moved as follows:

  - `SerializedTask`, `SerializedTaskEvent`, `TaskBroker`, `TaskBrokerDispatchOptions`, `TaskBrokerDispatchResult`, `TaskCompletionState`, `TaskContext`, `TaskEventType`, `TaskStatus`, `TemplateFilter`, and `TemplateGlobal` should be imported from `@backstage/plugin-scaffolder-node` instead.

  - The deprecated `copyWithoutRender` option has been removed from `fetch:template` action. You should rename the option to `copyWithoutTemplating` instead.

- 5863b04: **BREAKING CHANGES**

  - The `createBuiltinActions` method has been removed, as this should no longer be needed with the new backend system route, and was only useful when passing the default list of actions again in the old backend system. You should be able to rely on the default behaviour of the new backend system which is to merge the actions.

  - The `createCatalogRegisterAction` and `createFetchCatalogEntityAction` actions no longer require an `AuthService`, and now accepts a `CatalogService` instead of `CatalogClient`.

  Unless you're providing your own override action to the default, this should be a non-breaking change.

  You can migrate using the following if you're getting typescript errors:

  ```ts
  import { catalogServiceRef } from '@backstage/plugin-catalog-node';
  import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

  export const myModule = createBackendModule({
    pluginId: 'scaffolder',
    moduleId: 'test',
    register({ registerInit }) {
      registerInit({
        deps: {
          scaffolder: scaffolderActionsExtensionPoint,
          catalog: catalogServiceRef,
        },
        async init({ scaffolder, catalog }) {
          scaffolder.addActions(
            createCatalogRegisterAction({
              catalog,
            }),
            createFetchCatalogEntityAction({
              catalog,
              integrations,
            }),
          );
        },
      });
    },
  });
  ```

### Minor Changes

- 73b94d7: **DEPRECATIONS**

  The following types and implementations have been deprecated, either because they're no longer relevant, or because upcoming changes to the `scaffolder-backend` after `2.0.0` will influence the changes to these API surfaces.

  - `CreateWorkerOptions`
  - `DatabaseTaskStore`
  - `DatabaseTaskStoreOptions`
  - `TaskManager`
  - `TaskStoreCreateTaskOptions`
  - `TaskStoreCreateTaskResult`
  - `TaskStoreEmitOptions`
  - `TaskStoreListEventsOptions`
  - `TaskStoreRecoverTaskOptions`
  - `TaskStoreShutDownTaskOptions`

  There is no current path off deprecation, these types are going to be removed and rethought with a better way to define workers in the new backend system.

### Patch Changes

- 89a941d: Migrating to latest action format
- 023629e: Enable usage of secrets within 'each' step of software templates. For example, you can now structure your `each` step like this:

  ```
  each:
    [
      { name: "Service1", token: "${{ secrets.token1 }}" },
      { name: "Service2", token: "${{ secrets.token2 }}" },
    ]
  ```

- e92e481: Add tests for Scaffolder
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.10
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.10
  - @backstage/plugin-scaffolder-backend-module-github@0.8.0
  - @backstage/backend-defaults@0.11.0
  - @backstage/plugin-scaffolder-node@0.9.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.10
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.10
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/plugin-auth-node@0.6.4
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.10
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.11
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.3.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.9
  - @backstage/plugin-events-node@0.4.12
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.1
  - @backstage/plugin-scaffolder-common@1.5.11

## 2.0.0-next.2

### Major Changes

- 5863b04: **BREAKING CHANGES**

  - The `createBuiltinActions` method has been removed, as this should no longer be needed with the new backend system route, and was only useful when passing the default list of actions again in the old backend system. You should be able to rely on the default behaviour of the new backend system which is to merge the actions.

  - The `createCatalogRegisterAction` and `createFetchCatalogEntityAction` actions no longer require an `AuthService`, and now accepts a `CatalogService` instead of `CatalogClient`.

  Unless you're providing your own override action to the default, this should be a non-breaking change.

  You can migrate using the following if you're getting typescript errors:

  ```ts
  import { catalogServiceRef } from '@backstage/plugin-catalog-node';
  import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

  export const myModule = createBackendModule({
    pluginId: 'scaffolder',
    moduleId: 'test',
    register({ registerInit }) {
      registerInit({
        deps: {
          scaffolder: scaffolderActionsExtensionPoint,
          catalog: catalogServiceRef,
        },
        async init({ scaffolder, catalog }) {
          scaffolder.addActions(
            createCatalogRegisterAction({
              catalog,
            }),
            createFetchCatalogEntityAction({
              catalog,
              integrations,
            }),
          );
        },
      });
    },
  });
  ```

### Patch Changes

- 89a941d: Migrating to latest action format
- 023629e: Enable usage of secrets within 'each' step of software templates. For example, you can now structure your `each` step like this:

  ```
  each:
    [
      { name: "Service1", token: "${{ secrets.token1 }}" },
      { name: "Service2", token: "${{ secrets.token2 }}" },
    ]
  ```

- e92e481: Add tests for Scaffolder
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.2-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.8.0-next.2
  - @backstage/backend-defaults@0.11.0-next.2
  - @backstage/plugin-scaffolder-node@0.9.0-next.2
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.4-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.3.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.9-next.1
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/plugin-events-node@0.4.12-next.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.1-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.10-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.11-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.10-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.10-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.10-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.10-next.2
  - @backstage/plugin-scaffolder-common@1.5.11

## 2.0.0-next.1

### Major Changes

- 33394db: **BREAKING CHANGES**

  Removal of deprecated re-exports from module packages.

  The following functions have been re-exported from the `scaffolder-backend` plugin for quite some time, and now it's time to clean them up. They've been moved as follows:

  - `createPublishAzureAction` should be imported from `@backstage/plugin-scaffolder-backend-module-azure` instead.

  - `createPublishBitbucketCloudAction` should be imported from `@backstage/plugin-scaffolder-backend-module-bitbucket-cloud` instead.

  - `createPublishBitbucketServerAction` and `createPublishBitbucketServerPullRequestAction` can be imported from `@backstage/plugin-scaffolder-backend-module-bitbucket-server` instead.

  - `createPublishBitbucketAction` should be imported from `@backstage/plugin-scaffolder-backend-module-bitbucket` instead.

  - `createPublishGerritAction` and `createPublishGerritReviewAction` can be imported from `@backstage/plugin-scaffolder-backend-module-gerrit` instead.

  - `createGithubActionsDispatchAction`, `createGithubDeployKeyAction`, `createGithubEnvironmentAction`, `createGithubIssuesLabelAction`, `CreateGithubPullRequestActionOptions`, `createGithubRepoCreateAction`, `createGithubRepoPushAction`, `createGithubWebhookAction`, and `createPublishGithubAction` can be imported from `@backstage/plugin-scaffolder-backend-module-github` instead.

  - `createPublishGitlabAction` should be imported from `@backstage/plugin-scaffolder-backend-module-gitlab` instead.

  - `ActionContext`. `createTemplateAction`, `executeShellCommand`, `ExecuteShellCommandOptions`, `fetchContents`, `TaskSecrets`, and `TemplateAction` should be imported from `@backstage/plugin-scaffolder-node` instead.

  - `ScaffolderEntitiesProcessor` should be imported from `@backstage/plugin-catalog-backend-module-scaffolder-entity-model` instead.

- a8fcf04: **BREAKING ALPHA**: The `/alpha` export no longer exports the plugin. Please use `import('@backstage/plugin-scaffolder-backend')` instead as this has been removed.

  **BREAKING CHANGES**: The old `createRouter` function which was used in the old backend system has been removed along with the `RouterOptions` type.

- 73b94d7: **BREAKING CHANGES**

  The following functions have been re-exported from the `scaffolder-backend` plugin for quite some time, and now it's time to clean them up. They've been moved as follows:

  - `SerializedTask`, `SerializedTaskEvent`, `TaskBroker`, `TaskBrokerDispatchOptions`, `TaskBrokerDispatchResult`, `TaskCompletionState`, `TaskContext`, `TaskEventType`, `TaskStatus`, `TemplateFilter`, and `TemplateGlobal` should be imported from `@backstage/plugin-scaffolder-node` instead.

  - The deprecated `copyWithoutRender` option has been removed from `fetch:template` action. You should rename the option to `copyWithoutTemplating` instead.

### Minor Changes

- 73b94d7: **DEPRECATIONS**

  The following types and implementations have been deprecated, either because they're no longer relevant, or because upcoming changes to the `scaffolder-backend` after `2.0.0` will influence the changes to these API surfaces.

  - `CreateWorkerOptions`
  - `DatabaseTaskStore`
  - `DatabaseTaskStoreOptions`
  - `TaskManager`
  - `TaskStoreCreateTaskOptions`
  - `TaskStoreCreateTaskResult`
  - `TaskStoreEmitOptions`
  - `TaskStoreListEventsOptions`
  - `TaskStoreRecoverTaskOptions`
  - `TaskStoreShutDownTaskOptions`

  There is no current path off deprecation, these types are going to be removed and rethought with a better way to define workers in the new backend system.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.10-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.10-next.1
  - @backstage/plugin-scaffolder-node@0.8.3-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.10-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.10-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.10-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.11-next.1
  - @backstage/plugin-auth-node@0.6.4-next.1
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.7.2-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.2-next.1
  - @backstage/backend-defaults@0.10.1-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.3.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.9-next.1
  - @backstage/plugin-events-node@0.4.12-next.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.1-next.1
  - @backstage/plugin-scaffolder-common@1.5.11

## 1.33.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.10-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.10-next.0
  - @backstage/plugin-scaffolder-node@0.8.3-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.2-next.0
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/backend-defaults@0.10.1-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.11-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.10-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.10-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.10-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.7.2-next.0
  - @backstage/plugin-auth-node@0.6.4-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.9-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0
  - @backstage/plugin-events-node@0.4.12-next.0
  - @backstage/plugin-permission-node@0.10.1-next.0

## 1.33.0

### Minor Changes

- 587cb05: Added `workspace:template` and `workspace:template:file` actions to complement respective `fetch:*` actions

### Patch Changes

- eb39388: Fixed bug in fs:delete that prevented wildcard patterns from matching paths starting with "."
- 36ae651: Fixing a bug where the name for `templatingExtensions` was incorrectly set to `templateExtensions`
- 72d019d: Removed various typos
- ec42f8e: Generating new tokens on each Scaffolder Task Retry
- Updated dependencies
  - @backstage/integration@1.17.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.1
  - @backstage/plugin-bitbucket-cloud-common@0.3.0
  - @backstage/plugin-scaffolder-backend-module-github@0.7.1
  - @backstage/backend-defaults@0.10.0
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/plugin-auth-node@0.6.3
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.0
  - @backstage/plugin-scaffolder-node@0.8.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.9
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.9
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.10
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.9
  - @backstage/catalog-client@1.10.0
  - @backstage/config@1.3.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.9
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.9
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.8
  - @backstage/plugin-events-node@0.4.11
  - @backstage/plugin-scaffolder-common@1.5.11

## 1.33.0-next.3

### Patch Changes

- ec42f8e: Generating new tokens on each Scaffolder Task Retry
- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.3
  - @backstage/integration@1.17.0-next.3
  - @backstage/plugin-scaffolder-node@0.8.2-next.3
  - @backstage/plugin-auth-node@0.6.3-next.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.1-next.3
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.3.0-next.3
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.8-next.2
  - @backstage/plugin-catalog-node@1.17.0-next.2
  - @backstage/plugin-events-node@0.4.11-next.2
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.9-next.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.10-next.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.9-next.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.9-next.3
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.9-next.3
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.9-next.3
  - @backstage/plugin-scaffolder-backend-module-github@0.7.1-next.3
  - @backstage/plugin-scaffolder-common@1.5.11-next.0

## 1.33.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0-next.2
  - @backstage/backend-defaults@0.10.0-next.2
  - @backstage/config@1.3.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.1-next.2
  - @backstage/plugin-bitbucket-cloud-common@0.3.0-next.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.9-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.10-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.9-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.9-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.9-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.9-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.7.1-next.2
  - @backstage/plugin-scaffolder-node@0.8.2-next.2
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.8-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-events-node@0.4.11-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-scaffolder-common@1.5.11-next.0

## 1.33.0-next.1

### Minor Changes

- 587cb05: Added `workspace:template` and `workspace:template:file` actions to complement respective `fetch:*` actions

### Patch Changes

- eb39388: Fixed bug in fs:delete that prevented wildcard patterns from matching paths starting with "."
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.9-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.9-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.10-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.9-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.7.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.1-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.8-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.3.0-next.1
  - @backstage/plugin-events-node@0.4.11-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.9-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.9-next.1
  - @backstage/plugin-scaffolder-common@1.5.11-next.0

## 1.32.2-next.0

### Patch Changes

- 36ae651: Fixing a bug where the name for `templatingExtensions` was incorrectly set to `templateExtensions`
- Updated dependencies
  - @backstage/integration@1.16.4-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.1-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.3.0-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.7.1-next.0
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/backend-defaults@0.9.1-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.9-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.10-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.9-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.9-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.9-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.9-next.0
  - @backstage/plugin-scaffolder-node@0.8.2-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-auth-node@0.6.3-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.8-next.0
  - @backstage/plugin-events-node@0.4.11-next.0
  - @backstage/plugin-permission-node@0.9.2-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-scaffolder-common@1.5.10

## 1.32.0

### Minor Changes

- 75e4db4: add template-extensions scaffolder service endpoint

### Patch Changes

- 8685cab: Added `template` and `step` labels for scaffolder histogram metrics: `scaffolder_task_duration` and `scaffolder_step_duration`
- 497d47a: Document the internal built-in filters, and ensure that the types are validated when using `createTemplateFilter` and `createTemplateGlobalFunction` from the `zod` schema.
- Updated dependencies
  - @backstage/backend-defaults@0.9.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.0
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.8
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.9
  - @backstage/plugin-scaffolder-backend-module-github@0.7.0
  - @backstage/plugin-scaffolder-node@0.8.1
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.8
  - @backstage/integration@1.16.3
  - @backstage/plugin-auth-node@0.6.2
  - @backstage/plugin-permission-node@0.9.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.7
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.29
  - @backstage/plugin-events-node@0.4.10
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.8
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.8
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.8
  - @backstage/plugin-scaffolder-common@1.5.10

## 1.32.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/backend-defaults@0.9.0-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.6.2-next.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.7-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.3-next.0
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.29-next.0
  - @backstage/plugin-events-node@0.4.9
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.9.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.8-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.9-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.8-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.8-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.8-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.8-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.8.2-next.1
  - @backstage/plugin-scaffolder-common@1.5.10
  - @backstage/plugin-scaffolder-node@0.8.1-next.1

## 1.32.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.8.2-next.1
  - @backstage/integration@1.16.3-next.0
  - @backstage/backend-defaults@0.9.0-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.29-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.8-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.9-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.8-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.8-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.8-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.8-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.6.2-next.1
  - @backstage/plugin-scaffolder-node@0.8.1-next.1
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-permission-node@0.9.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.6
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-events-node@0.4.9
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-scaffolder-common@1.5.10

## 1.32.0-next.0

### Minor Changes

- 75e4db4: add template-extensions scaffolder service endpoint

### Patch Changes

- 497d47a: Document the internal built-in filters, and ensure that the types are validated when using `createTemplateFilter` and `createTemplateGlobalFunction` from the `zod` schema.
- Updated dependencies
  - @backstage/backend-defaults@0.9.0-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.8-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.9-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.6.2-next.0
  - @backstage/plugin-scaffolder-node@0.8.1-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.8-next.0
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-permission-node@0.9.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.2
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.28
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.6
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-events-node@0.4.9
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.8-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.8-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.8-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.8.2-next.0
  - @backstage/plugin-scaffolder-common@1.5.10

## 1.31.0

### Minor Changes

- 36677bb: Support new `createTemplateAction` type, and convert `catalog:fetch` action to new way of defining actions.
- 2b1e50d: use CreatedTemplate[Filter|Global*] as canonical template extensions in scaffolder plugin

### Patch Changes

- e0b226b: build(deps): bump `esbuild` from 0.24.2 to 0.25.0
- 09cf038: Got rid of most `@backstage/backend-common` usages
- 4f8b5b6: Allow signing git commits using configured private PGP key in scaffolder
- 59dcf37: Fixed bug in fs:delete causing no files to be deleted on windows machines
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.8.1
  - @backstage/integration@1.16.2
  - @backstage/backend-defaults@0.8.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.7
  - @backstage/plugin-scaffolder-backend-module-github@0.6.1
  - @backstage/plugin-scaffolder-node@0.8.0
  - @backstage/plugin-permission-node@0.9.0
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-scaffolder-common@1.5.10
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.7
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.8
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.7
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.7
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.7
  - @backstage/plugin-events-node@0.4.9
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.28
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.6
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-permission-common@0.8.4

## 1.31.0-next.2

### Minor Changes

- 36677bb: Support new `createTemplateAction` type, and convert `catalog:fetch` action to new way of defining actions.
- 2b1e50d: use CreatedTemplate[Filter|Global*] as canonical template extensions in scaffolder plugin

### Patch Changes

- e0b226b: build(deps): bump `esbuild` from 0.24.2 to 0.25.0
- 4f8b5b6: Allow signing git commits using configured private PGP key in scaffolder
- 59dcf37: Fixed bug in fs:delete causing no files to be deleted on windows machines
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.8.1-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.7-next.2
  - @backstage/plugin-scaffolder-node@0.8.0-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.6.1-next.2
  - @backstage/backend-defaults@0.8.2-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.7-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.8-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.7-next.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.7-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.7-next.2
  - @backstage/integration@1.16.2-next.0
  - @backstage/plugin-events-node@0.4.9-next.2
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.28-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.6-next.1
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.9-next.1
  - @backstage/plugin-scaffolder-common@1.5.10-next.0

## 1.30.1-next.1

### Patch Changes

- 09cf038: Got rid of most `@backstage/backend-common` usages
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.8.1-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.6.1-next.1
  - @backstage/plugin-scaffolder-common@1.5.10-next.0
  - @backstage/plugin-scaffolder-node@0.7.1-next.1
  - @backstage/backend-defaults@0.8.2-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.27
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.6-next.1
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-events-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.9-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.7-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.8-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.7-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.7-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.7-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.7-next.1

## 1.30.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.2-next.0
  - @backstage/plugin-permission-node@0.8.9-next.0
  - @backstage/plugin-auth-node@0.6.1-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.16.1-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.6-next.0
  - @backstage/plugin-events-node@0.4.9-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.8-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.7-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.7-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.7-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.7-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.6.1-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.8.1-next.0
  - @backstage/plugin-scaffolder-node@0.7.1-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.7-next.0

## 1.30.0

### Minor Changes

- dc8dd4b: Added new `createTemplateFilter`, `createTemplateGlobalFunction`, `createTemplateGlobalValue` for template extensions.
- a4aa244: This change integrates the `auditor` service into the Scaffolder plugin.
- 3d6ef79: Support file globbing in fs:delete
- 91f3313: Added experimental flag for scaffolder to wait for running tasks to complete on shutdown

  Enabling the `EXPERIMENTAL_gracefulShutdown` flag in the scaffolder config will make the
  scaffolder block the shutdown process until all running tasks have completed. This is useful
  when there is a need to ensure that all tasks have completed before the scaffolder is shut down.

  Please note, that the `TaskWorker` `stop` method is now asynchronous and awaited for the
  tasks to complete when the experimental flag is enabled.

### Patch Changes

- 37ab712: Fixed an issue where invalid expressions or non-object values in `step.each` caused an error.
- 1e935f0: Added conditional rendering of `oneOf` output schemas on the Installed Actions page for scaffolder actions
- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.8.0
  - @backstage/backend-defaults@0.8.0
  - @backstage/plugin-scaffolder-backend-module-github@0.6.0
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-catalog-node@1.16.0
  - @backstage/plugin-auth-node@0.6.0
  - @backstage/plugin-scaffolder-node@0.7.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.27
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.5
  - @backstage/plugin-events-node@0.4.8
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.6
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.7
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.6
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.6
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.6
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.6
  - @backstage/plugin-scaffolder-common@1.5.9

## 1.30.0-next.3

### Minor Changes

- dc8dd4b: Added new `createTemplateFilter`, `createTemplateGlobalFunction`, `createTemplateGlobalValue` for template extensions.
- 3d6ef79: Support file globbing in fs:delete

### Patch Changes

- 1e935f0: Added conditional rendering of `oneOf` output schemas on the Installed Actions page for scaffolder actions
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-github@0.6.0-next.2
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/plugin-permission-node@0.8.8-next.2
  - @backstage/plugin-scaffolder-node@0.7.0-next.2
  - @backstage/backend-defaults@0.8.0-next.3
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.5-next.3
  - @backstage/plugin-auth-node@0.6.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.7-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.6-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.6-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.6-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.6-next.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.8.0-next.3
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.6-next.2
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.27
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-scaffolder-common@1.5.9

## 1.30.0-next.2

### Minor Changes

- 91f3313: Added experimental flag for scaffolder to wait for running tasks to complete on shutdown

  Enabling the `EXPERIMENTAL_gracefulShutdown` flag in the scaffolder config will make the
  scaffolder block the shutdown process until all running tasks have completed. This is useful
  when there is a need to ensure that all tasks have completed before the scaffolder is shut down.

  Please note, that the `TaskWorker` `stop` method is now asynchronous and awaited for the
  tasks to complete when the experimental flag is enabled.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.8.0-next.2
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/plugin-auth-node@0.6.0-next.1
  - @backstage/backend-defaults@0.8.0-next.2
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.27
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.5-next.2
  - @backstage/plugin-catalog-node@1.16.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.8-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.6-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.7-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.6-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.6-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.6-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.6-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.5.6-next.1
  - @backstage/plugin-scaffolder-common@1.5.9
  - @backstage/plugin-scaffolder-node@0.7.0-next.1

## 1.30.0-next.1

### Patch Changes

- 37ab712: Fixed an issue where invalid expressions or non-object values in `step.each` caused an error.
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.8.0-next.1
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/backend-defaults@0.8.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.5.7-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.27
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.5-next.1
  - @backstage/plugin-events-node@0.4.8-next.0
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.8-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.6-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.7-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.6-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.6-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.6-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.6-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.5.6-next.0
  - @backstage/plugin-scaffolder-common@1.5.9
  - @backstage/plugin-scaffolder-node@0.7.0-next.0

## 1.30.0-next.0

### Minor Changes

- a4aa244: This change integrates the `auditor` service into the Scaffolder plugin.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8-next.0
  - @backstage/backend-defaults@0.8.0-next.0
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/plugin-scaffolder-node@0.7.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.5.7-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.27
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.5-next.0
  - @backstage/plugin-events-node@0.4.8-next.0
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.6-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.7-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.6-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.6-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.6-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.6-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.5.6-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.7.2-next.0
  - @backstage/plugin-scaffolder-common@1.5.9

## 1.29.0

### Minor Changes

- 5d9e5c8: Added the ability to use `${{ context.task.id }}` in nunjucks templating, as well as `ctx.task.id` in actions to get the current task ID.

### Patch Changes

- 8379bf4: Remove usages of `PluginDatabaseManager` and `PluginEndpointDiscovery` and replace with their equivalent service types
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-github@0.5.5
  - @backstage/backend-defaults@0.7.0
  - @backstage/plugin-scaffolder-node@0.6.3
  - @backstage/types@1.2.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.7.1
  - @backstage/plugin-permission-node@0.8.7
  - @backstage/plugin-auth-node@0.5.6
  - @backstage/integration@1.16.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-bitbucket-cloud-common@0.2.27
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.4
  - @backstage/plugin-catalog-node@1.15.1
  - @backstage/plugin-events-node@0.4.7
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.5
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.6
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.5
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.5
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.5
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.5
  - @backstage/plugin-scaffolder-common@1.5.9

## 1.29.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-defaults@0.7.0-next.1
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.1
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/plugin-events-node@0.4.7-next.1
  - @backstage/plugin-permission-common@0.8.4-next.0
  - @backstage/plugin-scaffolder-common@1.5.9-next.0
  - @backstage/plugin-scaffolder-node@0.6.3-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.7.1-next.1
  - @backstage/plugin-permission-node@0.8.7-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.4-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.5-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.6-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.5-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.5-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.5-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.5-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.5.5-next.2
  - @backstage/catalog-client@1.9.1-next.0
  - @backstage/integration@1.16.1-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.27-next.0

## 1.29.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-github@0.5.5-next.1

## 1.29.0-next.0

### Minor Changes

- 5d9e5c8: Added the ability to use `${{ context.task.id }}` in nunjucks templating, as well as `ctx.task.id` in actions to get the current task ID.

### Patch Changes

- 8379bf4: Remove usages of `PluginDatabaseManager` and `PluginEndpointDiscovery` and replace with their equivalent service types
- Updated dependencies
  - @backstage/backend-defaults@0.7.0-next.0
  - @backstage/plugin-scaffolder-node@0.6.3-next.0
  - @backstage/plugin-permission-node@0.8.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-client@1.9.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/integration@1.16.0
  - @backstage/types@1.2.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.26
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.4-next.0
  - @backstage/plugin-catalog-node@1.15.1-next.0
  - @backstage/plugin-events-node@0.4.7-next.0
  - @backstage/plugin-permission-common@0.8.3
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.5-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.6-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.5-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.5-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.5-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.5-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.5.5-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.7.1-next.0
  - @backstage/plugin-scaffolder-common@1.5.8

## 1.28.0

### Minor Changes

- c05a343: Emit scaffolder events using the optional `EventsService`

### Patch Changes

- dfc8b41: Updated dependency `@opentelemetry/api` to `^1.9.0`.
- 3c62a50: Experimental support for `formDecorators` to enable secret collection and mutations to the parameters for scaffolder tasks
- 6c326cf: The --no-node-snapshot check needs to be done against process.execArgv instead of process.argv
- e913fdf: Add github backend module to create-app and improve error messages
- 8f59dc5: Add fs:readdir to scaffolder startup
- 0851834: Resolved an issue where the `templateManagementPermission` was not being exposed through the `/permissions/metadata` endpoint.
- Updated dependencies
  - @backstage/backend-defaults@0.6.0
  - @backstage/plugin-scaffolder-backend-module-github@0.5.4
  - @backstage/integration@1.16.0
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/plugin-scaffolder-common@1.5.8
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/plugin-events-node@0.4.6
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.7.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.4
  - @backstage/plugin-scaffolder-node@0.6.2
  - @backstage/catalog-client@1.9.0
  - @backstage/plugin-permission-node@0.8.6
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.5
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.4
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.4
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.4
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/types@1.2.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.26
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.3
  - @backstage/plugin-permission-common@0.8.3
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.4

## 1.28.0-next.2

### Patch Changes

- dfc8b41: Updated dependency `@opentelemetry/api` to `^1.9.0`.
- 6c326cf: The --no-node-snapshot check needs to be done against process.execArgv instead of process.argv
- e913fdf: Add github backend module to create-app and improve error messages
- 0851834: Resolved an issue where the `templateManagementPermission` was not being exposed through the `/permissions/metadata` endpoint.
- Updated dependencies
  - @backstage/backend-defaults@0.6.0-next.2
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.5.4-next.2
  - @backstage/plugin-permission-node@0.8.6-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-auth-node@0.5.5-next.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.3-next.2
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/plugin-events-node@0.4.6-next.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.4-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.5-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.4-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.4-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.4-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.4-next.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.7.0-next.2
  - @backstage/plugin-scaffolder-node@0.6.2-next.2
  - @backstage/catalog-client@1.9.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/integration@1.16.0-next.1
  - @backstage/types@1.2.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.26-next.1
  - @backstage/plugin-permission-common@0.8.3-next.0
  - @backstage/plugin-scaffolder-common@1.5.8-next.1

## 1.28.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/backend-defaults@0.6.0-next.1
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/catalog-client@1.9.0-next.1
  - @backstage/plugin-scaffolder-node@0.6.2-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.4-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.4-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.5-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.4-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.4-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/plugin-permission-node@0.8.6-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.3-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.5.4-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.4-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.7.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/integration@1.16.0-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.26-next.0
  - @backstage/plugin-events-node@0.4.6-next.1
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/plugin-scaffolder-common@1.5.8-next.0

## 1.28.0-next.0

### Minor Changes

- c05a343: Emit scaffolder events using the optional `EventsService`

### Patch Changes

- 3c62a50: Experimental support for `formDecorators` to enable secret collection and mutations to the parameters for scaffolder tasks
- 8f59dc5: Add fs:readdir to scaffolder startup
- Updated dependencies
  - @backstage/backend-defaults@0.6.0-next.0
  - @backstage/integration@1.16.0-next.0
  - @backstage/plugin-scaffolder-common@1.5.8-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-events-node@0.4.6-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.7.0-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.3-next.0
  - @backstage/plugin-scaffolder-node@0.6.1-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.4-next.0
  - @backstage/catalog-client@1.8.1-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.26-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.3-next.0
  - @backstage/plugin-catalog-node@1.14.1-next.0
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/plugin-permission-node@0.8.6-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.3-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.3-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.3-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.3-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.5.3-next.0

## 1.27.0

### Minor Changes

- 0587633: Bumped the `isolated-vm` dependency from v4 to v5, which drops support for Node.js v16.
- e61d5ef: BREAKING EXPERIMENTAL: The `checkpoint` method now takes an object instead of previous arguments.

  ```ts
  await ctx.checkpoint({ key: 'repo.create', fn: () => ockokit.repo.create({...})})
  ```

  You can also now return `void` from the checkpoint if the method returns `void` inside the `checkpoint` handler.

### Patch Changes

- 6aa5b98: Fix tasks listing with postgres
- 59137ff: Fix issue with token not being available because it's now non-enumerable
- c5e39e7: Internal refactor to use the deferred from the types package
- e4f5d95: Align with type declaration of template filter/global function by supporting undefined as return value.
- d52d7f9: Support ISO and ms string forms of durations in config too
- 7ab3371: Modified `createDryRunner` and corresponding route to include `templateMetaData` inside the `templateInfo`. This allows custom action writers to access things like `templateInfo.entity.metadata.name` via the action context while executing templates using the dry run framework.
- 4e58bc7: Upgrade to uuid v11 internally
- 2dae341: Add new `fs:readdir` action to list current content of the workspace
- 97ba58f: Add example template for notification sending
- Updated dependencies
  - @backstage/catalog-client@1.8.0
  - @backstage/config@1.3.0
  - @backstage/backend-defaults@0.5.3
  - @backstage/types@1.2.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.6.1
  - @backstage/plugin-scaffolder-common@1.5.7
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/plugin-bitbucket-cloud-common@0.2.25
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.2
  - @backstage/plugin-scaffolder-node@0.6.0
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5
  - @backstage/integration@1.15.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.2
  - @backstage/plugin-permission-node@0.8.5
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.2
  - @backstage/plugin-scaffolder-backend-module-github@0.5.2

## 1.27.0-next.3

### Patch Changes

- 7ab3371: Modified `createDryRunner` and corresponding route to include `templateMetaData` inside the `templateInfo`. This allows custom action writers to access things like `templateInfo.entity.metadata.name` via the action context while executing templates using the dry run framework.
- 2dae341: Add new `fs:readdir` action to list current content of the workspace
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.5.7-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.25-next.0
  - @backstage/backend-defaults@0.5.3-next.3
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.2-next.3
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.2-next.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.2-next.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.2-next.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.2-next.3
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.2-next.3
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.2-next.3
  - @backstage/plugin-scaffolder-backend-module-github@0.5.2-next.3
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.6.1-next.3
  - @backstage/plugin-scaffolder-node@0.5.1-next.3

## 1.27.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/backend-defaults@0.5.3-next.2
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/types@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.24
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.2-next.2
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.2-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.2-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.2-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.2-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.2-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.2-next.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.6.1-next.2
  - @backstage/plugin-scaffolder-common@1.5.6
  - @backstage/plugin-scaffolder-node@0.5.1-next.2

## 1.27.0-next.1

### Minor Changes

- 0587633: Bumped the `isolated-vm` dependency from v4 to v5, which drops support for Node.js v16.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.2-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.2-next.1
  - @backstage/backend-defaults@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.4-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.24
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.2-next.1
  - @backstage/plugin-catalog-node@1.14.0-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.2-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.2-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.2-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.2-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.5.2-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.6.1-next.1
  - @backstage/plugin-scaffolder-common@1.5.6
  - @backstage/plugin-scaffolder-node@0.5.1-next.1

## 1.26.3-next.0

### Patch Changes

- 6aa5b98: Fix tasks listing with postgres
- 59137ff: Fix issue with token not being available because it's now non-enumerable
- e4f5d95: Align with type declaration of template filter/global function by supporting undefined as return value.
- 97ba58f: Add example template for notification sending
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/backend-defaults@0.5.3-next.0
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/types@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.24
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.2-next.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.2-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.2-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.2-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.2-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.2-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.2-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.5.2-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.6.1-next.0
  - @backstage/plugin-scaffolder-common@1.5.6
  - @backstage/plugin-scaffolder-node@0.5.1-next.0

## 1.26.0

### Minor Changes

- 3ec4e6d: Added pagination support for listing of tasks and the ability to filter on several users and task statuses.
- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.

### Patch Changes

- 734c2d4: Add `fetch:template:file` scaffolder action to download a single file and template the contents. Example usage:

  ```yaml
  - id: fetch-file
    name: Fetch File
    action: fetch:template:file
    input:
      url: https://github.com/backstage/software-templates/blob/main/scaffolder-templates/create-react-app/skeleton/catalog-info.yaml
      targetPath: './target/catalog-info.yaml'
      values:
        component_id: My Component
        owner: Test
  ```

- f1f0076: handle step.if: false
- 2f90932: Include step name and step id to checkpoint key
- 094eaa3: Remove references to in-repo backend-common
- 8f0898b: Updated dependency `esbuild` to `^0.24.0`.
- 11e0752: Make it possible to manually retry the scaffolder template from the step it failed
- Updated dependencies
  - @backstage/backend-defaults@0.5.1
  - @backstage/plugin-scaffolder-backend-module-github@0.5.1
  - @backstage/plugin-scaffolder-node@0.5.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.6.0
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.1
  - @backstage/plugin-permission-node@0.8.4
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.1
  - @backstage/catalog-client@1.7.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.24
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.1
  - @backstage/plugin-scaffolder-common@1.5.6

## 1.26.0-next.2

### Patch Changes

- f1f0076: handle step.if: false
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-github@0.5.1-next.2
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.1-next.2
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.6.0-next.2
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.1-next.2
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.24-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.1-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.1-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.1-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.1-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.1-next.2
  - @backstage/plugin-scaffolder-common@1.5.6

## 1.26.0-next.1

### Patch Changes

- 2f90932: Include step name and step id to checkpoint key
- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.1
  - @backstage/integration@1.15.1-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.24-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.1-next.0
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.1-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.1-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.1-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.5.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.5.1-next.1
  - @backstage/plugin-scaffolder-common@1.5.6
  - @backstage/plugin-scaffolder-node@0.5.0-next.1

## 1.26.0-next.0

### Minor Changes

- 3ec4e6d: Added pagination support for listing of tasks and the ability to filter on several users and task statuses.

### Patch Changes

- 734c2d4: Add `fetch:template:file` scaffolder action to download a single file and template the contents. Example usage:

  ```yaml
  - id: fetch-file
    name: Fetch File
    action: fetch:template:file
    input:
      url: https://github.com/backstage/software-templates/blob/main/scaffolder-templates/create-react-app/skeleton/catalog-info.yaml
      targetPath: './target/catalog-info.yaml'
      values:
        component_id: My Component
        owner: Test
  ```

- 094eaa3: Remove references to in-repo backend-common
- 11e0752: Make it possible to manually retry the scaffolder template from the step it failed
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.5.0-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.5.1-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.5.1-next.0
  - @backstage/backend-defaults@0.5.1-next.0
  - @backstage/plugin-permission-node@0.8.4-next.0
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.0
  - @backstage/types@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.23
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.1-next.0
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.1-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.1-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.1-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.1-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.1-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.1-next.0
  - @backstage/plugin-scaffolder-common@1.5.6

## 1.25.0

### Minor Changes

- df9ae9e: Added scaffolder action publish:bitbucketCloud:pull-request
- 62898bd: `createRouter` and its related types has been marked as deprecared. This backend should instead be initialized using the new backend system.

### Patch Changes

- f0c6b25: Allow listing file contents with `debug:log` scaffolder action
- c160951: Found the issue during testing the clean up of the workspace for the database implementation.
- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- f865103: Updated dependency `esbuild` to `^0.23.0`.
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- 7976081: Added support for all request parameters in the Github create/update environment API in the Github environment create scaffolder action.

  Disable MultiEntityPicker when `maxItems` limit is reached defined in `JSONSchema`

- Updated dependencies
  - @backstage/backend-defaults@0.5.0
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.5.0
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.0
  - @backstage/catalog-client@1.7.0
  - @backstage/plugin-permission-node@0.8.3
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/plugin-scaffolder-backend-module-github@0.5.0
  - @backstage/integration@1.15.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.23
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-scaffolder-common@1.5.6
  - @backstage/plugin-scaffolder-node@0.4.11

## 1.25.0-next.2

### Minor Changes

- df9ae9e: Added scaffolder action publish:bitbucketCloud:pull-request

### Patch Changes

- f0c6b25: Allow listing file contents with `debug:log` scaffolder action
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-defaults@0.5.0-next.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.5.0-next.2
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-client@1.7.0-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.5.0-next.2
  - @backstage/integration@1.15.0-next.0
  - @backstage/plugin-permission-node@0.8.3-next.2
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.23-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.0-next.2
  - @backstage/plugin-catalog-node@1.12.7-next.2
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.0-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.0-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.0-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.0-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.0-next.2
  - @backstage/plugin-scaffolder-common@1.5.5
  - @backstage/plugin-scaffolder-node@0.4.11-next.2

## 1.25.0-next.1

### Patch Changes

- f865103: Updated dependency `esbuild` to `^0.23.0`.
- Updated dependencies
  - @backstage/backend-defaults@0.5.0-next.1
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/catalog-client@1.6.7-next.0
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/types@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.22
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.0-next.1
  - @backstage/plugin-catalog-node@1.12.7-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.3-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.0-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.0-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.0-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.0-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.0-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.0-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.5.0-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.5.0-next.1
  - @backstage/plugin-scaffolder-common@1.5.5
  - @backstage/plugin-scaffolder-node@0.4.11-next.1

## 1.25.0-next.0

### Minor Changes

- 62898bd: `createRouter` and its related types has been marked as deprecared. This backend should instead be initialized using the new backend system.

### Patch Changes

- c160951: Found the issue during testing the clean up of the workspace for the database implementation.
- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-defaults@0.5.0-next.0
  - @backstage/plugin-permission-node@0.8.3-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.0-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.0-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.0-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.0-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.0-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.0-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.0-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.5.0-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.5.0-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/plugin-catalog-node@1.12.7-next.0
  - @backstage/plugin-scaffolder-node@0.4.11-next.0
  - @backstage/catalog-client@1.6.6
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/types@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.22
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-scaffolder-common@1.5.5

## 1.24.0

### Minor Changes

- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.
- dcd6a79: Added OpenTelemetry support to Scaffolder metrics

### Patch Changes

- 389f5a4: Update deprecated url-reader-related imports.
- c544f81: Add support for status filtering in scaffolder tasks endpoint
- b63d378: Update internal imports
- ef87e06: Fix scaffolder action `catalog:write` to write to directories that don't already exist
- Updated dependencies
  - @backstage/backend-defaults@0.4.2
  - @backstage/plugin-scaffolder-backend-module-github@0.4.1
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-scaffolder-node@0.4.9
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.13
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.13
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.13
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.15
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.13
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.15
  - @backstage/plugin-permission-node@0.8.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.5
  - @backstage/plugin-catalog-node@1.12.5
  - @backstage/integration@1.14.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.22
  - @backstage/catalog-model@1.6.0
  - @backstage/catalog-client@1.6.6
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.21
  - @backstage/plugin-scaffolder-common@1.5.5

## 1.23.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.13-next.3
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.15-next.3
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.5-next.3
  - @backstage/plugin-scaffolder-backend-module-github@0.4.1-next.3
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.13-next.3
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/catalog-client@1.6.6-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.0-next.3
  - @backstage/plugin-bitbucket-cloud-common@0.2.22-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.21-next.3
  - @backstage/plugin-catalog-node@1.12.5-next.3
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/plugin-permission-node@0.8.1-next.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.13-next.3
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.15-next.3
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.13-next.3
  - @backstage/plugin-scaffolder-common@1.5.5-next.2
  - @backstage/plugin-scaffolder-node@0.4.9-next.3

## 1.23.1-next.2

### Patch Changes

- c544f81: Add support for status filtering in scaffolder tasks endpoint
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-scaffolder-node@0.4.9-next.2
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.13-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.13-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.13-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.15-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.13-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/plugin-permission-node@0.8.1-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.2
  - @backstage/plugin-bitbucket-cloud-common@0.2.22-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.21-next.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.15-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.4.1-next.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.5-next.2
  - @backstage/plugin-scaffolder-common@1.5.5-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.23.1-next.1

### Patch Changes

- ef87e06: Fix scaffolder action `catalog:write` to write to directories that don't already exist
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-github@0.4.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.13-next.1
  - @backstage/plugin-permission-common@0.8.1-next.0
  - @backstage/plugin-permission-node@0.8.1-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.13-next.1
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.1
  - @backstage/plugin-scaffolder-common@1.5.5-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.13-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.22-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.21-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.15-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.13-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.15-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.5-next.1
  - @backstage/plugin-scaffolder-node@0.4.9-next.1

## 1.23.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.5-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.22-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.21-next.0
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-permission-node@0.8.1-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.15-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.13-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.13-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.13-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.15-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.13-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.4.1-next.0
  - @backstage/plugin-scaffolder-common@1.5.4
  - @backstage/plugin-scaffolder-node@0.4.9-next.0

## 1.23.0

### Minor Changes

- b5deed0: Add support for `autocomplete` extension point to provide additional `autocomplete` handlers
- 0b52438: Serialization of the scaffolder workspace into GCP bucket

### Patch Changes

- b9451dd: Updated `catalog:write` scaffolder action to show correct file path location in log message
- ff1bb4c: Added a documentation how to use checkpoints
- da90cce: Updated dependency `esbuild` to `^0.21.0`.
- 62d1fe3: Fix user entity not being fetched for scaffolder dry runner
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/plugin-scaffolder-backend-module-github@0.4.0
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-permission-node@0.8.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.4
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.12
  - @backstage/integration@1.13.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.14
  - @backstage/plugin-scaffolder-node@0.4.8
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.12
  - @backstage/plugin-bitbucket-cloud-common@0.2.21
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.20
  - @backstage/plugin-catalog-node@1.12.4
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.12
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.14
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.12
  - @backstage/plugin-scaffolder-common@1.5.4
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.23.0-next.2

### Patch Changes

- ff1bb4c: Added a documentation how to use checkpoints

## 1.23.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-github@0.4.0-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.4-next.1
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.13.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.17-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.21-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.20-next.1
  - @backstage/plugin-catalog-node@1.12.4-next.1
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-permission-node@0.7.33-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.14-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.12-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.12-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.12-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.14-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.12-next.1
  - @backstage/plugin-scaffolder-common@1.5.3
  - @backstage/plugin-scaffolder-node@0.4.8-next.1

## 1.23.0-next.0

### Minor Changes

- b5deed0: Add support for `autocomplete` extension point to provide additional `autocomplete` handlers
- 0b52438: Serialization of the scaffolder workspace into GCP bucket

### Patch Changes

- da90cce: Updated dependency `esbuild` to `^0.21.0`.
- 62d1fe3: Fix user entity not being fetched for scaffolder dry runner
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.3-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.11-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.13-next.0
  - @backstage/plugin-scaffolder-node@0.4.7-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.11-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.21-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.4.0-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.19-next.0
  - @backstage/plugin-catalog-node@1.12.3-next.0
  - @backstage/plugin-permission-node@0.7.32-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.11-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.13-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.11-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-scaffolder-common@1.5.3

## 1.22.9

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- 5c65785: Fixing issues with log redaction in the scaffolder logs
- d44a20a: Added additional plugin metadata to `package.json`.
- 7d30d95: Fixing issue with log meta fields possibly being circular refs
- d617103: Updating the logger redaction message to something less dramatic
- f4c8486: Increase max wait time in debug:wait action to 10 minutes
- bcec60f: added the following new permissions to the scaffolder backend endpoints:

  - `scaffolder.task.create`
  - `scaffolder.task.cancel`
  - `scaffolder.task.read`

- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/plugin-scaffolder-backend-module-github@0.3.0
  - @backstage/integration@1.12.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.17
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.9
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.9
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.9
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.11
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.11
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.9
  - @backstage/plugin-catalog-node@1.12.1
  - @backstage/plugin-permission-node@0.7.30
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-scaffolder-common@1.5.3
  - @backstage/plugin-scaffolder-node@0.4.5
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.22.8-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- f4c8486: Increase max wait time in debug:wait action to 10 minutes
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.17-next.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.9-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.9-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.9-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.11-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.3.0-next.3
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.1-next.3
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.11-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.9-next.3
  - @backstage/plugin-permission-common@0.7.14-next.0
  - @backstage/plugin-scaffolder-common@1.5.3-next.1
  - @backstage/plugin-permission-node@0.7.30-next.3
  - @backstage/plugin-scaffolder-node@0.4.5-next.3
  - @backstage/plugin-catalog-node@1.12.1-next.2
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.22.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.1-next.2
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/plugin-permission-node@0.7.30-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.3.0-next.2
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.17-next.2
  - @backstage/plugin-catalog-node@1.12.1-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.11-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.9-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.9-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.9-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.11-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.9-next.2
  - @backstage/plugin-scaffolder-node@0.4.5-next.2
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-scaffolder-common@1.5.3-next.0

## 1.22.8-next.1

### Patch Changes

- bcec60f: added the following new permissions to the scaffolder backend endpoints:

  - `scaffolder.task.create`
  - `scaffolder.task.cancel`
  - `scaffolder.task.read`

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/plugin-permission-node@0.7.30-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.9-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.1-next.1
  - @backstage/plugin-scaffolder-common@1.5.3-next.0
  - @backstage/plugin-auth-node@0.4.14-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.17-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.9-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.9-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.9-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.11-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.2.9-next.1
  - @backstage/plugin-scaffolder-node@0.4.5-next.1

## 1.22.8-next.0

### Patch Changes

- 7d30d95: Fixing issue with log meta fields possibly being circular refs
- d617103: Updating the logger redaction message to something less dramatic
- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.2.9-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/plugin-permission-node@0.7.30-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.1-next.0
  - @backstage/plugin-scaffolder-node@0.4.5-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.11-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.9-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.9-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.9-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.11-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.9-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.17-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.11.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-scaffolder-common@1.5.2

## 1.22.6

### Patch Changes

- 131e5cb: Fix broken links in README.
- 025641b: Fix issue with the log format not being respected when logging from actions
- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- e4b50ab: Scaffolder workspace serialization
- 025641b: Redact `meta` fields too with the logger
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.5.2
  - @backstage/plugin-catalog-node@1.12.0
  - @backstage/plugin-scaffolder-backend-module-github@0.2.8
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.8
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.0
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-scaffolder-node@0.4.4
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.8
  - @backstage/plugin-auth-node@0.4.13
  - @backstage/integration@1.11.0
  - @backstage/catalog-client@1.6.5
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.16
  - @backstage/plugin-permission-node@0.7.29
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.10
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.8
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.8
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.10

## 1.22.6-next.2

### Patch Changes

- e4b50ab: Scaffolder workspace serialization
- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0-next.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.4.0-next.2
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-scaffolder-node@0.4.4-next.2
  - @backstage/integration@1.11.0-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.16-next.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.10-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.8-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.8-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.8-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.10-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.8-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.2.8-next.2

## 1.22.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.5.2-next.1
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.16-next.1
  - @backstage/plugin-scaffolder-node@0.4.4-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/plugin-permission-node@0.7.29-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.2.8-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.3.4-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.10-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.8-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.8-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.8-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.10-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.8-next.1
  - @backstage/plugin-catalog-node@1.11.2-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 1.22.5-next.0

### Patch Changes

- 025641b: Fix issue with the log format not being respected when logging from actions
- 025641b: Redact `meta` fields too with the logger
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-github@0.2.8-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.8-next.0
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.3.4-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.8-next.0
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/catalog-client@1.6.5-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.16-next.0
  - @backstage/plugin-catalog-node@1.11.2-next.0
  - @backstage/plugin-scaffolder-common@1.5.2-next.0
  - @backstage/plugin-scaffolder-node@0.4.4-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-permission-node@0.7.29-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.10-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.8-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.8-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.10-next.0

## 1.22.4

### Patch Changes

- f34a9b1: The `catalog:write` action now automatically adds a `backstage.io/template-source` annotation, indicating which Scaffolder template was used to create the entity.
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/plugin-permission-node@0.7.28
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.7
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.3.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-scaffolder-backend-module-github@0.2.7
  - @backstage/backend-tasks@0.5.22
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.9
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/catalog-client@1.6.4
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.7
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.9
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.7
  - @backstage/integration@1.10.0
  - @backstage/plugin-scaffolder-node@0.4.3
  - @backstage/plugin-catalog-node@1.11.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.15
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-scaffolder-common@1.5.1

## 1.22.4-next.1

### Patch Changes

- f34a9b1: The `catalog:write` action now automatically adds a `backstage.io/template-source` annotation, indicating which Scaffolder template was used to create the entity.
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/catalog-client@1.6.4-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.7-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.7-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.2.7-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.3.3-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.9-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.7-next.1
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/plugin-permission-node@0.7.28-next.1
  - @backstage/plugin-scaffolder-node@0.4.3-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.15-next.1
  - @backstage/plugin-catalog-node@1.11.1-next.1
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.9-next.1
  - @backstage/plugin-scaffolder-common@1.5.1

## 1.22.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.7-next.0
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/catalog-client@1.6.3
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.12-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.15-next.0
  - @backstage/plugin-catalog-node@1.11.1-next.0
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-permission-node@0.7.28-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.9-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.7-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.9-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.7-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.2.7-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.3.3-next.0
  - @backstage/plugin-scaffolder-common@1.5.1
  - @backstage/plugin-scaffolder-node@0.4.3-next.0

## 1.22.3

### Patch Changes

- c74c2de: Fixed an issue causing actions to fail when retrieving auth credentials
- Updated dependencies
  - @backstage/plugin-catalog-node@1.11.0
  - @backstage/catalog-client@1.6.3
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-common@0.21.6
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.14
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.3.2
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-permission-node@0.7.27
  - @backstage/backend-tasks@0.5.21
  - @backstage/plugin-scaffolder-backend-module-github@0.2.6
  - @backstage/plugin-scaffolder-node@0.4.2
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.8
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.6
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.6
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.6
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.8
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.6
  - @backstage/plugin-scaffolder-common@1.5.1

## 1.22.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.10.0
  - @backstage/catalog-client@1.6.2
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.13
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.3.1
  - @backstage/backend-tasks@0.5.20
  - @backstage/plugin-permission-node@0.7.26
  - @backstage/plugin-scaffolder-backend-module-github@0.2.5
  - @backstage/plugin-scaffolder-node@0.4.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.7
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.5
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.5
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.5
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.7
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.5
  - @backstage/plugin-scaffolder-common@1.5.1

## 1.22.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.9.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.12

## 1.22.0

### Minor Changes

- e9663a9: Move away from using `ctx.logStream`
- aa543c9: Migrate plugin to use the new auth services, add an optional service discovery to the router options and change the permissions type to be `PermissionsService`.
- e9663a9: Enable the redaction of secrets using the redacting logger and the secrets from the `TaskSpec`
- c6b132e: Introducing checkpoints for scaffolder task action idempotency

### Patch Changes

- 984abfa: Fixing the lost of the initial state after a task recovery.
- 703ebc9: Fix support for unauthenticated requests to create scaffolder tasks
- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- bbd1fe1: Made "checkpoint" on scaffolder action context non-optional
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.6
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.4
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.4
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.4
  - @backstage/backend-common@0.21.4
  - @backstage/integration@1.9.1
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.6
  - @backstage/plugin-scaffolder-backend-module-github@0.2.4
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.3.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.4
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-catalog-node@1.8.0
  - @backstage/catalog-client@1.6.1
  - @backstage/backend-tasks@0.5.19
  - @backstage/plugin-permission-node@0.7.25
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.11
  - @backstage/catalog-model@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-common@1.5.1

## 1.22.0-next.2

### Minor Changes

- e9663a9: Move away from using `ctx.logStream`
- e9663a9: Enable the redaction of secrets using the redacting logger and the secrets from the `TaskSpec`

### Patch Changes

- 703ebc9: Fix support for unauthenticated requests to create scaffolder tasks
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.6-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.4-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.4-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.4-next.2
  - @backstage/integration@1.9.1-next.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.3.0-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.4-next.2
  - @backstage/catalog-client@1.6.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.6-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.2.4-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/plugin-catalog-node@1.8.0-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.11-next.2
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.2
  - @backstage/plugin-scaffolder-common@1.5.1-next.1

## 1.22.0-next.1

### Minor Changes

- aa543c9: Migrate plugin to use the new auth services, add an optional service discovery to the router options and change the permissions type to be `PermissionsService`.

### Patch Changes

- bbd1fe1: Made "checkpoint" on scaffolder action context non-optional
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.2.4-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.6-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.4-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.4-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.4-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.6-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.4-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.17-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.11-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-scaffolder-common@1.5.1-next.1

## 1.22.0-next.0

### Minor Changes

- c6b132e: Introducing checkpoints for scaffolder task action idempotency

### Patch Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-scaffolder-node@0.3.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.3-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.3-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.3-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.5-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.2.3-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.16-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.5-next.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.3-next.0
  - @backstage/plugin-permission-common@0.7.13-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/plugin-permission-node@0.7.24-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.10-next.0
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-common@1.5.1-next.0

## 1.21.0

### Minor Changes

- 458bf21: Created a gitea module for the scaffolder. This module provides a new action "publish:gitea" able to create a gitea repository owned by an organization. See: https://gitea.com/api/swagger#/organization/createOrgRepo
- 11b9a08: Introduced the first version of recoverable tasks.
- 78c100b: Support providing an overriding token for `fetch:template`, `fetch:plain` and `fetch:file` when interacting with upstream integrations
- e9a5228: The built-in module list has been trimmed down when using the new Backend System. Provider specific modules should now be installed with `backend.add` to provide additional actions to the scaffolder. These modules are as follows:

  - `@backstage/plugin-scaffolder-backend-module-github`
  - `@backstage/plugin-scaffolder-backend-module-gitlab`
  - `@backstage/plugin-scaffolder-backend-module-bitbucket`
  - `@backstage/plugin-scaffolder-backend-module-gitea`
  - `@backstage/plugin-scaffolder-backend-module-gerrit`
  - `@backstage/plugin-scaffolder-backend-module-confluence-to-markdown`
  - `@backstage/plugin-scaffolder-backend-module-cookiecutter`
  - `@backstage/plugin-scaffolder-backend-module-rails`
  - `@backstage/plugin-scaffolder-backend-module-sentry`
  - `@backstage/plugin-scaffolder-backend-module-yeoman`

### Patch Changes

- 5eb6882: New scaffolder module `@backstage/plugin-scaffolder-backend-module-bitbucket-server`.

  Extracted from `@backstage/plugin-scaffolder-backend-module-bitbucket`
  and replaces its actions related to Bitbucket Server.

  - `publish:bitbucketServer`
  - `publish:bitbucketServer:pull-request`

- 09f8b31: Simple typo fix in the fetch:template action example on the word 'skeleton'.
- c25a500: Fix some deprecations and misplaced `await` usage.
- f6792c6: Move the `NODE_OPTIONS` messaging for `--no-node-snapshot` to the `SecureTemplater` in order to get better messaging at runtime
- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- 52ae6b9: Updated dependency `esbuild` to `^0.20.0`.
- 5eb6882: New scaffolder module `@backstage/plugin-scaffolder-backend-module-bitbucket-cloud`.

  Extracted from `@backstage/plugin-scaffolder-backend-module-bitbucket`
  and replaces its actions related to Bitbucket Cloud.

  - `publish:bitbucketCloud`
  - `bitbucket:pipelines:run`

- 0a395b3: Upgraded `prom-client` to version 15
- e1c479d: When using node 20+ the `scaffolder-backend` will now throw an error at startup if the `--no-node-snapshot` option was
  not provided to node.
- e0e5afe: Add option to configure nunjucks with the `trimBlocks` and `lstripBlocks` options in the fetch:template action
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-scaffolder-backend-module-github@0.2.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.0
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.13
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.2
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/backend-tasks@0.5.15
  - @backstage/catalog-model@1.4.4
  - @backstage/integration@1.9.0
  - @backstage/catalog-client@1.6.0
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.0
  - @backstage/plugin-scaffolder-node@0.3.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.7
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.0
  - @backstage/plugin-scaffolder-common@1.5.0
  - @backstage/plugin-catalog-node@1.7.0
  - @backstage/plugin-permission-node@0.7.21
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 1.21.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.13-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.7-next.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.0-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.0-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.0-next.3
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.2-next.3
  - @backstage/plugin-scaffolder-backend-module-github@0.2.0-next.3
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.2-next.3
  - @backstage/plugin-catalog-node@1.6.2-next.3
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/plugin-permission-node@0.7.21-next.3
  - @backstage/plugin-scaffolder-node@0.3.0-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-scaffolder-common@1.5.0-next.1

## 1.21.0-next.2

### Patch Changes

- 5eb6882: New scaffolder module `@backstage/plugin-scaffolder-backend-module-bitbucket-server`.

  Extracted from `@backstage/plugin-scaffolder-backend-module-bitbucket`
  and replaces its actions related to Bitbucket Server.

  - `publish:bitbucketServer`
  - `publish:bitbucketServer:pull-request`

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 52ae6b9: Updated dependency `esbuild` to `^0.20.0`.
- 5eb6882: New scaffolder module `@backstage/plugin-scaffolder-backend-module-bitbucket-cloud`.

  Extracted from `@backstage/plugin-scaffolder-backend-module-bitbucket`
  and replaces its actions related to Bitbucket Cloud.

  - `publish:bitbucketCloud`
  - `bitbucket:pipelines:run`

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.0-next.0
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.0-next.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.13-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.0-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.2-next.2
  - @backstage/plugin-permission-node@0.7.21-next.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.2-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.2.0-next.2
  - @backstage/plugin-scaffolder-node@0.3.0-next.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.7-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/integration@1.9.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-scaffolder-common@1.5.0-next.1

## 1.21.0-next.1

### Minor Changes

- 78c100b: Support providing an overriding token for `fetch:template`, `fetch:plain` and `fetch:file` when interacting with upstream integrations

### Patch Changes

- 09f8b31: Simple typo fix in the fetch:template action example on the word 'skeleton'.
- f6792c6: Move the `NODE_OPTIONS` messaging for `--no-node-snapshot` to the `SecureTemplater` in order to get better messaging at runtime
- e1c479d: When using node 20+ the `scaffolder-backend` will now throw an error at startup if the `--no-node-snapshot` option was
  not provided to node.
- e0e5afe: Add option to configure nunjucks with the `trimBlocks` and `lstripBlocks` options in the fetch:template action
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-github@0.2.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/plugin-scaffolder-node@0.3.0-next.1
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.4-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.7-next.1
  - @backstage/plugin-catalog-node@1.6.2-next.1
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-permission-node@0.7.21-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.2-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.1.2-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.2-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.13-next.1
  - @backstage/plugin-scaffolder-common@1.5.0-next.1

## 1.21.0-next.0

### Minor Changes

- 11b9a08: Introduced the first version of recoverable tasks.
- e9a5228: The built-in module list has been trimmed down when using the new Backend System. Provider specific modules should now be installed with `backend.add` to provide additional actions to the scaffolder. These modules are as follows:

  - `@backstage/plugin-scaffolder-backend-module-github`
  - `@backstage/plugin-scaffolder-backend-module-gitlab`
  - `@backstage/plugin-scaffolder-backend-module-bitbucket`
  - `@backstage/plugin-scaffolder-backend-module-gitea`
  - `@backstage/plugin-scaffolder-backend-module-gerrit`
  - `@backstage/plugin-scaffolder-backend-module-confluence-to-markdown`
  - `@backstage/plugin-scaffolder-backend-module-cookiecutter`
  - `@backstage/plugin-scaffolder-backend-module-rails`
  - `@backstage/plugin-scaffolder-backend-module-sentry`
  - `@backstage/plugin-scaffolder-backend-module-yeoman`

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.1.2-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.2-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.1.2-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.13-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.2-next.0
  - @backstage/catalog-client@1.6.0-next.0
  - @backstage/plugin-scaffolder-node@0.3.0-next.0
  - @backstage/plugin-scaffolder-common@1.5.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.7-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/plugin-permission-node@0.7.21-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 1.20.0

### Minor Changes

- a694f71: The Scaffolder builtin actions now contains an action for running pipelines from Bitbucket Cloud Rest API
- 7c522c5: Add `gitlab:repo:push` scaffolder action to push files to arbitrary branch without creating a Merge Request

### Patch Changes

- e9ab1c4: Fixed an issue where not passing a `value` to any of the action's permission conditions caused an error.
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/plugin-scaffolder-backend-module-github@0.1.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.12
  - @backstage/plugin-scaffolder-common@1.4.5
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.1.1
  - @backstage/catalog-client@1.5.2
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.6
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-permission-node@0.7.20
  - @backstage/backend-tasks@0.5.14
  - @backstage/plugin-auth-node@0.4.3
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.1
  - @backstage/plugin-scaffolder-node@0.2.10
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/types@1.1.1

## 1.19.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-auth-node@0.4.3-next.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.6-next.2
  - @backstage/plugin-catalog-node@1.6.1-next.2
  - @backstage/plugin-permission-node@0.7.20-next.2
  - @backstage/plugin-scaffolder-node@0.2.10-next.2
  - @backstage/backend-tasks@0.5.14-next.2
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.1-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.1.1-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.1-next.2
  - @backstage/plugin-scaffolder-backend-module-github@0.1.1-next.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.12-next.2

## 1.19.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.12-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/plugin-permission-node@0.7.20-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.1-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.1.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.1-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.1.1-next.1
  - @backstage/plugin-scaffolder-node@0.2.10-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.6-next.1
  - @backstage/plugin-catalog-node@1.6.1-next.1
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-scaffolder-common@1.4.4

## 1.19.3-next.0

### Patch Changes

- e9ab1c4: Fixed an issue where not passing a `value` to any of the action's permission conditions caused an error.
- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.1.1-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.1-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.6-next.0
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.0
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-permission-node@0.7.20-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.1.1-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.1-next.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.12-next.0
  - @backstage/plugin-scaffolder-common@1.4.4
  - @backstage/plugin-scaffolder-node@0.2.10-next.0

## 1.19.2

### Patch Changes

- 219d7f0: Refactor some methods to `-node` instead and use the new external modules
- aff34fc: Fix issue with Circular JSON dependencies in templating
- 48667b4: Fix creating env secret in github:environment:create action
- 0cbb03b: Fixing regular expression ReDoS with zod packages. Upgrading to latest. ref: https://security.snyk.io/vuln/SNYK-JS-ZOD-5925617
- 28949ea: Add a new action for creating github-autolink references for a repository: `github:autolinks:create`
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-scaffolder-backend-module-github@0.1.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.11
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.0
  - @backstage/plugin-catalog-node@1.6.0
  - @backstage/catalog-client@1.5.0
  - @backstage/plugin-scaffolder-node@0.2.9
  - @backstage/backend-tasks@0.5.13
  - @backstage/integration@1.8.0
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.1.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.0
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-permission-node@0.7.19
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.5
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-common@1.4.4

## 1.19.2-next.3

### Patch Changes

- 219d7f0: Refactor some methods to `-node` instead and use the new external modules
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.11-next.3
  - @backstage/plugin-scaffolder-node@0.2.9-next.3
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.1.0-next.0
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.0-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.1.0-next.0
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.0-next.0
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.3
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.5-next.3
  - @backstage/plugin-catalog-node@1.6.0-next.3
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.3
  - @backstage/plugin-scaffolder-common@1.4.3

## 1.19.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0-next.2
  - @backstage/plugin-catalog-backend@1.16.0-next.2
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.5-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.2
  - @backstage/plugin-scaffolder-common@1.4.3
  - @backstage/plugin-scaffolder-node@0.2.9-next.2

## 1.19.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.1-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.5-next.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1
  - @backstage/plugin-scaffolder-common@1.4.3
  - @backstage/plugin-scaffolder-node@0.2.9-next.1

## 1.19.2-next.0

### Patch Changes

- aff34fcf23: Fix issue with Circular JSON dependencies in templating
- 48667b4d3a: Fix creating env secret in github:environment:create action
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/integration@1.8.0-next.0
  - @backstage/plugin-auth-node@0.4.2-next.0
  - @backstage/plugin-catalog-backend@1.15.1-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.5-next.0
  - @backstage/plugin-catalog-node@1.5.1-next.0
  - @backstage/plugin-permission-node@0.7.19-next.0
  - @backstage/plugin-scaffolder-node@0.2.9-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-scaffolder-common@1.4.3

## 1.19.0

### Minor Changes

- f3ab9cfcb7: Made shut down stale tasks configurable.

  There are two properties exposed:

  - `scaffolder.processingInterval` - sets the processing interval for staled tasks.
  - `scaffolder.taskTimeoutJanitorFrequency` - sets the task's heartbeat timeout, when to consider a task to be staled.

- 7d5a921114: Allow using `globby`'s negative matching with `copyWithoutTemplating`/`copyWithoutRender`. This allows including an entire subdirectory while excluding a single file so that it will still be templated instead of needing to list every other file and ensure the list is updated when new files are added.
- 5e4127c18e: Allow setting `update: true` in `publish:github:pull-request` scaffolder action

### Patch Changes

- 0920fd02ac: Add examples for `github:environment:create` scaffolder action & improve related tests
- ae30a9ae8c: Added description for publish:gerrit scaffolder actions
- 013611b42e: `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.
- 23f72b2cba: Refactoring the runner to generate minimally informative task log per iteration and properly validate iterated actions.
- 8613ba3928: Switched to using `"exports"` field for `/alpha` subpath export.
- 99d4936f6c: Add examples for `github:webhook` scaffolder action & improve related tests
- 2be3922eb8: Add examples for `github:deployKey:create` scaffolder action & improve related tests
- 76d07da66a: Make it possible to define control buttons text (Back, Create, Review) per template
- f8727ad228: Add examples for `publish:github:pull-request` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.0
  - @backstage/plugin-catalog-node@1.5.0
  - @backstage/plugin-scaffolder-common@1.4.3
  - @backstage/integration@1.7.2
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/catalog-client@1.4.6
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-scaffolder-node@0.2.8
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.4
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-permission-node@0.7.18

## 1.19.0-next.2

### Patch Changes

- [#20531](https://github.com/backstage/backstage/pull/20531) [`ae30a9ae8c`](https://github.com/backstage/backstage/commit/ae30a9ae8cbedc6df69c0656bf7044d1c869db40) Thanks [@andym0457](https://github.com/andym0457)! - Added description for publish:gerrit scaffolder actions

- [#20570](https://github.com/backstage/backstage/pull/20570) [`013611b42e`](https://github.com/backstage/backstage/commit/013611b42ed457fefa9bb85fddf416cf5e0c1f76) Thanks [@freben](https://github.com/freben)! - `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-catalog-backend@1.15.0-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-auth-node@0.4.1-next.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.4-next.2
  - @backstage/plugin-catalog-node@1.5.0-next.2
  - @backstage/plugin-permission-node@0.7.18-next.2
  - @backstage/plugin-scaffolder-node@0.2.8-next.2

## 1.19.0-next.1

### Patch Changes

- 2be3922eb8: Add examples for `github:deployKey:create` scaffolder action & improve related tests
- 76d07da66a: Make it possible to define control buttons text (Back, Create, Review) per template
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.0-next.1
  - @backstage/plugin-catalog-node@1.5.0-next.1
  - @backstage/integration@1.7.2-next.0
  - @backstage/plugin-scaffolder-common@1.4.3-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.4-next.1
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/plugin-scaffolder-node@0.2.8-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/plugin-auth-node@0.4.1-next.1
  - @backstage/plugin-permission-node@0.7.18-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-permission-common@0.7.9

## 1.19.0-next.0

### Minor Changes

- 5e4127c18e: Allow setting `update: true` in `publish:github:pull-request` scaffolder action

### Patch Changes

- 0920fd02ac: Add examples for `github:environment:create` scaffolder action & improve related tests
- 8613ba3928: Switched to using `"exports"` field for `/alpha` subpath export.
- 99d4936f6c: Add examples for `github:webhook` scaffolder action & improve related tests
- f8727ad228: Add examples for `publish:github:pull-request` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.4.3-next.0
  - @backstage/plugin-catalog-backend@1.15.0-next.0
  - @backstage/plugin-scaffolder-node@0.2.8-next.0
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
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.4-next.0
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-catalog-node@1.4.8-next.0
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-permission-node@0.7.18-next.0

## 1.18.0

### Minor Changes

- dea0aafda7: Updated `publish:gitlab` action properties to support additional Gitlab project settings:

  - general project settings provided by gitlab project create API (new `settings` property)
  - branch level settings to create additional branches and make them protected (new `branches` property)
  - project level environment variables settings (new `projectVariables` property)

  Marked existed properties `repoVisibility` and `topics` as deprecated, as they are covered by `settings` property.

- f41099bb31: Display meaningful error to the output if Gitlab namespace not found inside `publish:gitlab`.

### Patch Changes

- 7dd82cc07e: Add examples for `github:issues:label` scaffolder action & improve related tests
- 733ddf7130: Add examples for `publish:Azure` scaffolder action.
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-backend@1.14.0
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.3
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-scaffolder-common@1.4.2

## 1.18.0-next.2

### Minor Changes

- dea0aafda7: Updated `publish:gitlab` action properties to support additional Gitlab project settings:

  - general project settings provided by gitlab project create API (new `settings` property)
  - branch level settings to create additional branches and make them protected (new `branches` property)
  - project level environment variables settings (new `projectVariables` property)

  Marked existed properties `repoVisibility` and `topics` as deprecated, as they are covered by `settings` property.

### Patch Changes

- 7dd82cc07e: Add examples for `github:issues:label` scaffolder action & improve related tests
- 733ddf7130: Add examples for `publish:Azure` scaffolder action.
- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-auth-node@0.4.0-next.2
  - @backstage/plugin-catalog-backend@1.14.0-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/integration@1.7.1-next.1
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.3-next.2
  - @backstage/plugin-catalog-node@1.4.7-next.2
  - @backstage/plugin-permission-node@0.7.17-next.2
  - @backstage/plugin-scaffolder-node@0.2.6-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/catalog-client@1.4.5-next.0
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17-next.0
  - @backstage/plugin-permission-common@0.7.9-next.0
  - @backstage/plugin-scaffolder-common@1.4.2-next.0

## 1.18.0-next.1

### Minor Changes

- f41099bb31: Display meaningful error to the output if Gitlab namespace not found inside `publish:gitlab`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/plugin-catalog-backend@1.14.0-next.1
  - @backstage/plugin-catalog-node@1.4.6-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.2-next.1
  - @backstage/plugin-auth-node@0.3.2-next.1
  - @backstage/plugin-permission-node@0.7.16-next.1
  - @backstage/plugin-scaffolder-node@0.2.5-next.1
  - @backstage/config@1.1.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-scaffolder-common@1.4.1

## 1.17.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.1-next.0
  - @backstage/plugin-catalog-backend@1.14.0-next.0
  - @backstage/plugin-auth-node@0.3.2-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/plugin-scaffolder-node@0.2.5-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.2-next.0
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-catalog-node@1.4.6-next.0
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-permission-node@0.7.16-next.0
  - @backstage/plugin-scaffolder-common@1.4.1

## 1.17.0

### Minor Changes

- b5f239b50bcf: Improved the `parseEntityRef` Scaffolder filter by introducing the ability for users to provide default kind and/or namespace values. The filter now takes
  2 arguments, similarly to the original [parseEntityRef](https://github.com/backstage/backstage/blob/v1.17.2/packages/catalog-model/src/entity/ref.ts#L77).
- d5313ede3529: **DEPRECATION**: Deprecated `ScaffolderEntitiesProcessor`, which should now instead be imported from `@backstage/plugin-catalog-backend-module-scaffolder-entity-model`.

  `catalogModuleTemplateKind` was also moved to that package and renamed to `catalogModuleScaffolderEntityModel`, without any deprecation since it was an alpha export.

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

- a4989552d828: Add examples for `publish:github` and `publish:gitlab` scaffolder actions.
- ded27b83ead2: Add examples for `publish:bitbucket` scaffolder actions.
- 5f1a92b9f19f: Use `DefaultAzureDevOpsCredentialsProvider` to retrieve credentials for Azure DevOps.
- fb57a4694fc6: Fixed the plugin and module ID of the alpha `catalogModuleTemplateKind` export.
- f3c0b95e3ef1: Add examples for `github:actions:dispatch` scaffolder actions.
- cfc3ca6ce060: Changes needed to support MySQL
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0
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
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.7.14
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.0
  - @backstage/plugin-catalog-node@1.4.4
  - @backstage/plugin-scaffolder-node@0.2.3

## 1.17.0-next.3

### Minor Changes

- b5f239b50bcf: Improved the `parseEntityRef` Scaffolder filter by introducing the ability for users to provide default kind and/or namespace values. The filter now takes
  2 arguments, similarly to the original [parseEntityRef](https://github.com/backstage/backstage/blob/v1.17.2/packages/catalog-model/src/entity/ref.ts#L77).
- d5313ede3529: **DEPRECATION**: Deprecated `ScaffolderEntitiesProcessor`, which should now instead be imported from `@backstage/plugin-catalog-backend-module-scaffolder-entity-model`.

  `catalogModuleTemplateKind` was also moved to that package and renamed to `catalogModuleScaffolderEntityModel`, without any deprecation since it was an alpha export.

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
  - @backstage/catalog-client@1.4.4-next.2
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/integration@1.7.0-next.3
  - @backstage/plugin-catalog-common@1.0.16-next.2
  - @backstage/plugin-permission-common@0.7.8-next.2
  - @backstage/plugin-scaffolder-common@1.4.1-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/plugin-permission-node@0.7.14-next.3
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.0-next.0
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-auth-node@0.3.0-next.3
  - @backstage/plugin-catalog-node@1.4.4-next.3
  - @backstage/plugin-scaffolder-node@0.2.3-next.3

## 1.16.6-next.2

### Patch Changes

- ded27b83ead2: Add examples for `publish:bitbucket` scaffolder actions.
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-scaffolder-common@1.4.1-next.1

## 1.16.6-next.1

### Patch Changes

- f3c0b95e3ef1: Add examples for `github:actions:dispatch` scaffolder actions.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.1
  - @backstage/config@1.1.0-next.0
  - @backstage/integration@1.7.0-next.1
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-auth-node@0.3.0-next.1
  - @backstage/plugin-permission-common@0.7.8-next.0
  - @backstage/plugin-permission-node@0.7.14-next.1
  - @backstage/plugin-scaffolder-node@0.2.3-next.1
  - @backstage/plugin-catalog-node@1.4.4-next.1
  - @backstage/catalog-client@1.4.4-next.0
  - @backstage/plugin-catalog-common@1.0.16-next.0
  - @backstage/plugin-scaffolder-common@1.4.1-next.0
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 1.16.3-next.0

### Patch Changes

- a4989552d828: Add examples for `publish:github` and `publish:gitlab` scaffolder actions.
- 5f1a92b9f19f: Use `DefaultAzureDevOpsCredentialsProvider` to retrieve credentials for Azure DevOps.
- fb57a4694fc6: Fixed the plugin and module ID of the alpha `catalogModuleTemplateKind` export.
- cfc3ca6ce060: Changes needed to support MySQL
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.2-next.0
  - @backstage/plugin-auth-node@0.3.0-next.0
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/integration@1.7.0-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.3-next.0
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-node@0.7.13-next.0
  - @backstage/plugin-scaffolder-common@1.4.0
  - @backstage/plugin-scaffolder-node@0.2.2-next.0

## 1.16.0

### Minor Changes

- e514aac3eac0: Introduce `each` property on action steps, allowing them to be ran repeatedly.

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 349611126ae2: Removed the options from the alpha `scaffolderPlugin` export. To extend the scaffolder plugin you instead now use the available extension points, `scaffolderActionsExtensionPoint`, `scaffolderTaskBrokerExtensionPoint`, and `scaffolderTemplatingExtensionPoint`.
- 33c76caef72a: Added examples for the `fs:delete` and `fs:rename` actions
- e07a4914f621: Deprecated the following type exports, which have been moved to `@backstage/plugin-scaffolder-node` instead:

  - `TemplateFilter`
  - `TemplateGlobal`
  - `TaskStatus`
  - `TaskCompletionState`
  - `SerializedTask`
  - `TaskEventType`
  - `SerializedTaskEvent`
  - `TaskBrokerDispatchResult`
  - `TaskBrokerDispatchOptions`
  - `TaskContext`
  - `TaskBroker`

- 0b1d775be05b: Adds examples to a few scaffolder actions.
- 88bc6e27a213: The `concurrentTasksLimit` option can now be configured via static configuration as well. Setting it to 0 will now also disable the task worker.
- 0f873325068d: Add examples for `github:repo:create` and `github:repo:push` scaffolder actions.
- 5c28ebc79fd6: Updated dependency `esbuild` to `^0.19.0`.
- d3b31a791eb1: Deprecated `executeShellCommand`, `RunCommandOptions`, and `fetchContents` from `@backstage/plugin-scaffolder-backend`, since they are useful for Scaffolder modules (who should not be importing from the plugin package itself). You should now import these from `@backstage/plugin-scaffolder-backend-node` instead. `RunCommandOptions` was renamed in the Node package as `ExecuteShellCommandOptions`, for consistency.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/plugin-catalog-backend@1.12.0
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-scaffolder-node@0.2.0
  - @backstage/plugin-catalog-node@1.4.1
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

## 1.15.2-next.2

### Patch Changes

- 33c76caef72a: Added examples for the fs:delete and fs:rename actions
- 0b1d775be05b: Adds examples to a few scaffolder actions.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/plugin-scaffolder-node@0.1.6-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## 1.15.2-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- d3b31a791eb1: Deprecated `executeShellCommand`, `RunCommandOptions`, and `fetchContents` from `@backstage/plugin-scaffolder-backend`, since they are useful for Scaffolder modules (who should not be importing from the plugin package itself). You should now import these from `@backstage/plugin-scaffolder-backend-node` instead. `RunCommandOptions` was renamed in the Node package as `ExecuteShellCommandOptions`, for consistency.
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-catalog-backend@1.12.0-next.1
  - @backstage/plugin-scaffolder-node@0.1.6-next.1
  - @backstage/plugin-catalog-node@1.4.1-next.1
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

## 1.15.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.0-next.0
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
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-node@0.7.11-next.0
  - @backstage/plugin-scaffolder-common@1.3.2
  - @backstage/plugin-scaffolder-node@0.1.6-next.0

## 1.15.1

### Patch Changes

- 600be804927d: Indicate the name of the option that is being deprecated in task deprecation warning.
- ff45cb559e49: Updated dependency `esbuild` to `^0.18.0`.
- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/plugin-catalog-backend@1.11.0
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
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-node@0.7.10
  - @backstage/plugin-scaffolder-common@1.3.2
  - @backstage/plugin-scaffolder-node@0.1.5

## 1.15.1-next.1

### Patch Changes

- 600be804927d: Indicate the name of the option that is being deprecated in task deprecation warning.
- ff45cb559e49: Updated dependency `esbuild` to `^0.18.0`.
- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1-next.0
  - @backstage/integration@1.5.1-next.0
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16-next.0
  - @backstage/plugin-catalog-backend@1.11.0-next.0
  - @backstage/plugin-catalog-common@1.0.15-next.0
  - @backstage/plugin-catalog-node@1.4.0-next.0
  - @backstage/plugin-permission-common@0.7.7-next.0
  - @backstage/plugin-permission-node@0.7.10-next.0
  - @backstage/plugin-scaffolder-common@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.1.5-next.0

## 1.15.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/plugin-catalog-backend@1.11.0-next.0
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
  - @backstage/plugin-permission-common@0.7.7-next.0
  - @backstage/plugin-permission-node@0.7.10-next.0
  - @backstage/plugin-scaffolder-common@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.1.5-next.0

## 1.15.0

### Minor Changes

- 84b0e47373db: Add `TargetBranchName` variable and output for the `publish:gitlab:merge-request` and `publish:github:pull-request` s'cascaffolder actions.
- 6a694ce98e32: Add a scaffolder action that pull-requests for bitbucket server
- 1948845861b0: Added `github:deployKey:create` and `github:environment:create` scaffolder actions. You will need to add `read/write` permissions to your GITHUB_TOKEN and/or Github Backstage App for Repository `Administration` (for deploy key functionality) and `Environments` (for Environment functionality)
- df8411779da1: Add support for Repository Variables and Secrets to the `publish:github` and `github:repo:create` scaffolder actions. You will need to add `read/write` permissions to your GITHUB_TOKEN and/or Github Backstage App for Repository `Secrets` and `Variables`

  Upgrade octokit introduces some breaking changes.

### Patch Changes

- cc936b529676: Fix handling of `optional` property in `catalog:register` scaffolder action
- b269da39ac2d: Clearer error messages for action `publish:gitlab:merge-request`
- 11e0f625583f: Fix wrong gitlabUrl format in repoUrl input description
- a2c70cdda202: Switch out the sandbox, from `vm2` to `isolated-vm`.

  This is a native dependency, which means that it will need to be compiled with the same version of node on the same OS. This could cause some issues when running in Docker for instance, as you will need to make sure that the dependency is installed and compiled inside the docker container that it will run on.

  This could mean adding in some dependencies to the container like `build-essential` to make sure that this compiles correctly.

  If you're having issues installing this dependency, there's some [install instructions](https://github.com/laverdet/isolated-vm#requirements) over on `isolated-vm`'s repo.

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/catalog-client@1.4.2
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-backend@1.10.0
  - @backstage/integration@1.5.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-auth-node@0.2.15
  - @backstage/plugin-catalog-node@1.3.7
  - @backstage/plugin-permission-node@0.7.9
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.14
  - @backstage/plugin-permission-common@0.7.6
  - @backstage/plugin-scaffolder-common@1.3.1
  - @backstage/plugin-scaffolder-node@0.1.4

## 1.15.0-next.3

### Minor Changes

- 84b0e47373db: Add `TargetBranchName` variable and output for the `publish:gitlab:merge-request` and `publish:github:pull-request` s'cascaffolder actions.
- 6a694ce98e32: Add a scaffolder action that pull-requests for bitbucket server
- 1948845861b0: Added `github:deployKey:create` and `github:environment:create` scaffolder actions. You will need to add `read/write` permissions to your GITHUB_TOKEN and/or Github Backstage App for Repository `Administration` (for deploy key functionality) and `Environments` (for Environment functionality)

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/plugin-catalog-backend@1.10.0-next.2
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
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/plugin-permission-node@0.7.9-next.2
  - @backstage/plugin-scaffolder-common@1.3.1-next.1
  - @backstage/plugin-scaffolder-node@0.1.4-next.2

## 1.15.0-next.2

### Patch Changes

- 11e0f625583f: Fix wrong gitlabUrl format in repoUrl input description
- Updated dependencies
  - @backstage/config@1.0.7

## 1.15.0-next.1

### Minor Changes

- df8411779da1: Add support for Repository Variables and Secrets to the `publish:github` and `github:repo:create` scaffolder actions. You will need to add `read/write` permissions to your GITHUB_TOKEN and/or Github Backstage App for Repository `Secrets` and `Variables`

  Upgrade octokit introduces some breaking changes.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/plugin-catalog-backend@1.9.2-next.1
  - @backstage/integration@1.5.0-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-auth-node@0.2.15-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.1
  - @backstage/plugin-permission-node@0.7.9-next.1
  - @backstage/catalog-client@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/plugin-scaffolder-node@0.1.4-next.1
  - @backstage/plugin-catalog-common@1.0.14-next.0
  - @backstage/plugin-scaffolder-common@1.3.1-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 1.14.1-next.0

### Patch Changes

- cc936b529676: Fix handling of `optional` property in `catalog:register` scaffolder action
- b269da39ac2d: Clearer error messages for action `publish:gitlab:merge-request`
- Updated dependencies
  - @backstage/catalog-client@1.4.2-next.0
  - @backstage/plugin-catalog-backend@1.9.2-next.0
  - @backstage/plugin-catalog-node@1.3.7-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/integration@1.4.5
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.0
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-permission-node@0.7.9-next.0
  - @backstage/plugin-scaffolder-common@1.3.0
  - @backstage/plugin-scaffolder-node@0.1.4-next.0

## 1.14.0

### Minor Changes

- 67115f532b8: Expose both types of scaffolder permissions and rules through the metadata endpoint.

  The metadata endpoint now correctly exposes both types of scaffolder permissions and rules (for both the template and action resource types) through the metadata endpoint.

- a73b3c0b097: Add ability to use `defaultNamespace` and `defaultKind` for scaffolder action `catalog:fetch`

### Patch Changes

- 1a48b84901c: Bump minimum required version of `vm2` to be 3.9.18
- d20c87966a4: Bump minimum required version of `vm2` to be 3.9.17
- 6d954de4b06: Update typing for `RouterOptions::actions` and `ScaffolderActionsExtensionPoint::addActions` to allow any kind of action being assigned to it.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.9.1
  - @backstage/backend-common@0.18.5
  - @backstage/integration@1.4.5
  - @backstage/plugin-scaffolder-common@1.3.0
  - @backstage/plugin-permission-node@0.7.8
  - @backstage/plugin-scaffolder-node@0.1.3
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-auth-node@0.2.14
  - @backstage/plugin-catalog-node@1.3.6
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-permission-common@0.7.5

## 1.13.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.9.1-next.2
  - @backstage/plugin-scaffolder-common@1.3.0-next.0
  - @backstage/plugin-scaffolder-node@0.1.3-next.2
  - @backstage/config@1.0.7

## 1.13.2-next.1

### Patch Changes

- 6d954de4b06: Update typing for `RouterOptions::actions` and `ScaffolderActionsExtensionPoint::addActions` to allow any kind of action being assigned to it.
- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-catalog-backend@1.9.1-next.1
  - @backstage/plugin-scaffolder-node@0.1.3-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 1.13.2-next.0

### Patch Changes

- d20c87966a4: Bump minimum required version of `vm2` to be 3.9.17
- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/integration@1.4.5-next.0
  - @backstage/plugin-permission-node@0.7.8-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-auth-node@0.2.14-next.0
  - @backstage/plugin-catalog-backend@1.9.1-next.0
  - @backstage/plugin-catalog-node@1.3.6-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-scaffolder-common@1.2.7
  - @backstage/plugin-scaffolder-node@0.1.3-next.0

## 1.13.0

### Minor Changes

- 2b15cb4aa0a: The non-PR/MR Git Actions now return the commit hash of the commit pushed as a new output called `commitHash`, isomorphic-git is now on version 1.23.0
- 30ffdae70f9: Added `fetch:plain:file` action to fetch a single file, this action is also added to the list of built-in actions.
- 65e989f4018: Added the possibility to authorize parameters and steps of a template

  The scaffolder plugin is now integrated with the permission framework.
  It is possible to toggle parameters or actions within templates by marking each section with specific `tags`, inside a `backstage:permissions` property under each parameter or action. Each parameter or action can then be permissioned by using a conditional decision containing the `scaffolderTemplateRules.hasTag` rule.

- 3b68b09fc2d: Renamed permissionApi router option to permissions
- bcae5aaf25c: Added the possibility to authorize actions

  It is now possible to decide who should be able to execute certain actions or who should be able to pass specific input to specified actions.

  Some of the existing utility functions for creating conditional decisions have been renamed:

  - `createScaffolderConditionalDecision` has been renamed to `createScaffolderActionConditionalDecision`
  - `scaffolderConditions` has been renamed to `scaffolderTemplateConditions`

- d7c8c222e25: Allow for a commit message to differ from the PR title when publishing a GitHub pull request.
- 95ea9f69b6f: Provide some more default filters out of the box and refactoring how the filters are applied to the `SecureTemplater`.

  - `parseEntityRef` will take an string entity triplet and return a parsed object.
  - `pick` will allow you to reference a specific property in the piped object.

  So you can now combine things like this: `${{ parameters.entity | parseEntityRef | pick('name') }}` to get the name of a specific entity, or `${{ parameters.repoUrl | parseRepoUrl | pick('owner') }}` to get the owner of a repo.

### Patch Changes

- e23abb37ec1: Rename output parameter `mergeRequestURL` of `publish:gitlab:merge-request` action to `mergeRequestUrl`.
- e27ddc36dad: Added a possibility to cancel the running task (executing of a scaffolder template)
- a7eb36c6e38: Improve type-check for scaffolder output parameters
- c9a0fdcd2c8: Fix deprecated types.
- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- 9c26e6d8ed3: Updated the alpha `scaffolderPlugin` to not require options.
- f37a95adcd8: Stripped entity types and namespace before passing to GitHub API
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/plugin-catalog-backend@1.9.0
  - @backstage/plugin-scaffolder-common@1.2.7
  - @backstage/plugin-scaffolder-node@0.1.2
  - @backstage/catalog-client@1.4.1
  - @backstage/plugin-permission-node@0.7.7
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/integration@1.4.4
  - @backstage/plugin-auth-node@0.2.13
  - @backstage/plugin-catalog-node@1.3.5
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 1.13.0-next.3

### Minor Changes

- d7c8c222e25: Allow for a commit message to differ from the PR title when publishing a GitHub pull request.

### Patch Changes

- f37a95adcd8: Stripped entity types and namespace before passing to GitHub API
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.9.0-next.3
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-client@1.4.1-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.2
  - @backstage/plugin-catalog-common@1.0.13-next.1
  - @backstage/plugin-catalog-node@1.3.5-next.3
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-permission-node@0.7.7-next.2
  - @backstage/plugin-scaffolder-common@1.2.7-next.2
  - @backstage/plugin-scaffolder-node@0.1.2-next.3

## 1.13.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.1-next.2
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/catalog-client@1.4.1-next.0
  - @backstage/plugin-permission-node@0.7.7-next.2
  - @backstage/plugin-scaffolder-node@0.1.2-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.2
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.2
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-scaffolder-common@1.2.7-next.1

## 1.13.0-next.1

### Minor Changes

- 30ffdae70f9: Added `fetch:plain:file` action to fetch a single file, this action is also added to the list of built-in actions.
- 65e989f4018: Added the possibility to authorize parameters and steps of a template

  The scaffolder plugin is now integrated with the permission framework.
  It is possible to toggle parameters or actions within templates by marking each section with specific `tags`, inside a `backstage:permissions` property under each parameter or action. Each parameter or action can then be permissioned by using a conditional decision containing the `scaffolderTemplateRules.hasTag` rule.

- 95ea9f69b6f: Provide some more default filters out of the box and refactoring how the filters are applied to the `SecureTemplater`.

  - `parseEntityRef` will take an string entity triplet and return a parsed object.
  - `pick` will allow you to reference a specific property in the piped object.

  So you can now combine things like this: `${{ parameters.entity | parseEntityRef | pick('name') }}` to get the name of a specific entity, or `${{ parameters.repoUrl | parseRepoUrl | pick('owner') }}` to get the owner of a repo.

### Patch Changes

- a7eb36c6e38: Improve type-check for scaffolder output parameters
- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.2.7-next.1
  - @backstage/plugin-scaffolder-node@0.1.2-next.1
  - @backstage/plugin-permission-node@0.7.7-next.1
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-catalog-backend@1.8.1-next.1
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/integration@1.4.4-next.0
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.1
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.1

## 1.12.1-next.0

### Patch Changes

- e23abb37ec1: Rename output parameter `mergeRequestURL` of `publish:gitlab:merge-request` action to `mergeRequestUrl`.
- e27ddc36dad: Added a possibility to cancel the running task (executing of a scaffolder template)
- c9a0fdcd2c8: Fix deprecated types.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.0
  - @backstage/plugin-scaffolder-common@1.2.7-next.0
  - @backstage/plugin-catalog-backend@1.8.1-next.0
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.0
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/plugin-catalog-node@1.3.5-next.0

## 1.12.0

### Minor Changes

- 7d724d8ef56: Added the ability to be able to define an actions `input` and `output` schema using `zod` instead of hand writing types and `jsonschema`

### Patch Changes

- 860de10fa67: Make identity valid if subject of token is a backstage server-2-server auth token
- 65454876fb2: Minor API report tweaks
- c6c78b4acbe: throw error from catalog:fetch scaffolder action when entity is null and optional is false
- 9968f455921: catalog write action should allow any shape of object
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 7af12854970: Extended scaffolder action `catalog:fetch` to fetch multiple catalog entities by entity references.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.0
  - @backstage/catalog-client@1.4.0
  - @backstage/plugin-auth-node@0.2.12
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.4
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/integration@1.4.3
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.6
  - @backstage/plugin-scaffolder-node@0.1.1

## 1.12.0-next.2

### Patch Changes

- 860de10fa67: Make identity valid if subject of token is a backstage server-2-server auth token
- 65454876fb2: Minor API report tweaks
- 9968f455921: catalog write action should allow any shape of object
- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12-next.2
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-catalog-backend@1.8.0-next.2
  - @backstage/plugin-catalog-node@1.3.4-next.2
  - @backstage/plugin-scaffolder-node@0.1.1-next.2
  - @backstage/config@1.0.7-next.0
  - @backstage/integration@1.4.3-next.0

## 1.12.0-next.1

### Minor Changes

- 7d724d8ef56: Added the ability to be able to define an actions `input` and `output` schema using `zod` instead of hand writing types and `jsonschema`

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/catalog-client@1.4.0-next.1
  - @backstage/integration@1.4.3-next.0
  - @backstage/plugin-auth-node@0.2.12-next.1
  - @backstage/plugin-catalog-backend@1.8.0-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.4-next.1
  - @backstage/plugin-scaffolder-common@1.2.6-next.1
  - @backstage/plugin-scaffolder-node@0.1.1-next.1

## 1.11.1-next.0

### Patch Changes

- c6c78b4acb: throw error from catalog:fetch scaffolder action when entity is null and optional is false
- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/catalog-client@1.4.0-next.0
  - @backstage/plugin-catalog-backend@1.8.0-next.0
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.3.4-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.12-next.0
  - @backstage/plugin-scaffolder-common@1.2.6-next.0
  - @backstage/plugin-scaffolder-node@0.1.1-next.0

## 1.11.0

### Minor Changes

- 0b2952ee4b: Added the option to overwrite files in the `targetPath` of the `template:fetch` action
- 127154930f: Renamed the export `scaffolderCatalogModule` to `catalogModuleTemplateKind` in order to follow the new recommended naming patterns of backend system items. This is technically a breaking change but in an alpha export, so take care to change your imports if you have already migrated to the new backend system.

### Patch Changes

- 0ff03319be: Updated usage of `createBackendPlugin`.
- ad3edc402d: **Deprecations**: The following are deprecated and should instead be imported from the new package `@backstage/plugin-scaffolder-node`:

  - `ActionContext`
  - `createTemplateAction`
  - `TaskSecrets`
  - `TemplateAction`

- 6c70919f1a: Provide better error messaging when GitHub fails due to missing team definitions
- 66cf22fdc4: Updated dependency `esbuild` to `^0.17.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/plugin-scaffolder-node@0.1.0
  - @backstage/catalog-model@1.2.0
  - @backstage/plugin-catalog-node@1.3.3
  - @backstage/backend-tasks@0.4.3
  - @backstage/catalog-client@1.3.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11
  - @backstage/plugin-scaffolder-common@1.2.5

## 1.11.0-next.2

### Patch Changes

- 0ff03319be: Updated usage of `createBackendPlugin`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-catalog-backend@1.7.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/plugin-catalog-node@1.3.3-next.2
  - @backstage/plugin-scaffolder-node@0.1.0-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/plugin-auth-node@0.2.11-next.2
  - @backstage/catalog-client@1.3.1-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.5-next.1

## 1.11.0-next.1

### Minor Changes

- 127154930f: Renamed the export `scaffolderCatalogModule` to `catalogModuleTemplateKind` in order to follow the new recommended naming patterns of backend system items. This is technically a breaking change but in an alpha export, so take care to change your imports if you have already migrated to the new backend system.

### Patch Changes

- 66cf22fdc4: Updated dependency `esbuild` to `^0.17.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2-next.1
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11-next.1
  - @backstage/plugin-catalog-node@1.3.3-next.1
  - @backstage/plugin-scaffolder-common@1.2.5-next.0
  - @backstage/plugin-scaffolder-node@0.1.0-next.1

## 1.11.0-next.0

### Minor Changes

- 0b2952ee4b: Added the option to overwrite files in the `targetPath` of the `template:fetch` action

### Patch Changes

- ad3edc402d: **Deprecations**: The following are deprecated and should instead be imported from the new package `@backstage/plugin-scaffolder-node`:

  - `ActionContext`
  - `createTemplateAction`
  - `TaskSecrets`
  - `TemplateAction`

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.0-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/plugin-catalog-backend@1.7.2-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.0
  - @backstage/plugin-scaffolder-common@1.2.5-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/plugin-auth-node@0.2.11-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0

## 1.10.0

### Minor Changes

- a6808b67a7: Implement `Required approving review count`, `Restrictions`, and `Required commit signing` support for `publish:github` action
- 04a2048fb8: Allow custom repository roles to be configured on github repos
- c0ad7341f7: Add Scaffolder action `catalog:fetch` to get entity by entity reference from catalog
- b44eb68bcb: This change adds changes to provide examples alongside scaffolder task actions.

  The `createTemplateAction` function now takes a list of examples e.g.

  ```typescript
  const actionExamples = [
    {
      description: 'Example 1',
      example: yaml.stringify({
        steps: [
          {
            action: 'test:action',
            id: 'test',
            input: {
              input1: 'value',
            },
          },
        ],
      }),
    },
  ];

  export function createTestAction() {
    return createTemplateAction({
        id: 'test:action',
        examples: [
            {
                description: 'Example 1',
                examples: actionExamples
            }
        ],
        ...,
    });
  ```

  These examples can be retrieved later from the api.

  ```bash
  curl http://localhost:7007/api/scaffolder/v2/actions
  ```

  ```json
  [
    {
      "id": "test:action",
      "examples": [
        {
          "description": "Example 1",
          "example": "steps:\n  - action: test:action\n    id: test\n    input:\n      input1: value\n"
        }
      ],
      "schema": {
        "input": {
          "type": "object",
          "properties": {
            "input1": {
              "title": "Input 1",
              "type": "string"
            }
          }
        }
      }
    }
  ]
  ```

- 72d6b9f4e2: Added ability to override the commit message and author details for the `publish:bitbucketServer` action.
- a69664faee: Add Github repository support for squash merge commit title and message options

### Patch Changes

- 2fadff2a25: Change scaffolder task actions to include markdown to demonstrate the new `ActionsPage` markdown feature.
- ecbec4ec4c: Internal refactor to match new options pattern in the experimental backend system.
- e4c0240445: Added `catalogFilter` field to OwnerPicker and EntityPicker components to support filtering options by any field(s) of an entity.

  The `allowedKinds` field has been deprecated. Use `catalogFilter` instead. This field allows users to specify a filter on the shape of [EntityFilterQuery](https://github.com/backstage/backstage/blob/774c42003782121d3d6b2aa5f2865d53370c160e/packages/catalog-client/src/types/api.ts#L74), which can be passed into the CatalogClient. See examples below:

  - Get all entities of kind `Group`

    ```yaml
    owner:
      title: Owner
      type: string
      description: Owner of the component
      ui:field: OwnerPicker
      ui:options:
        catalogFilter:
          - kind: Group
    ```

  - Get entities of kind `Group` and spec.type `team`
    ```yaml
    owner:
      title: Owner
      type: string
      description: Owner of the component
      ui:field: OwnerPicker
      ui:options:
        catalogFilter:
          - kind: Group
            spec.type: team
    ```

- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/catalog-model@1.1.5
  - @backstage/plugin-scaffolder-common@1.2.4
  - @backstage/catalog-client@1.3.0
  - @backstage/backend-tasks@0.4.1
  - @backstage/plugin-catalog-node@1.3.1
  - @backstage/plugin-catalog-backend@1.7.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.9

## 1.10.0-next.2

### Patch Changes

- 2fadff2a25: Change scaffolder task actions to include markdown to demonstrate the new `ActionsPage` markdown feature.
- b44eb68bcb: This patch adds changes to provide examples alongside scaffolder task actions.

  The `createTemplateAction` function now takes a list of examples e.g.

  ```typescript
  const actionExamples = [
    {
      description: 'Example 1',
      example: yaml.stringify({
        steps: [
          {
            action: 'test:action',
            id: 'test',
            input: {
              input1: 'value',
            },
          },
        ],
      }),
    },
  ];

  export function createTestAction() {
    return createTemplateAction({
        id: 'test:action',
        examples: [
            {
                description: 'Example 1',
                examples: actionExamples
            }
        ],
        ...,
    });
  ```

  These examples can be retrieved later from the api.

  ```bash
  curl http://localhost:7007/api/scaffolder/v2/actions
  ```

  ```json
  [
    {
      "id": "test:action",
      "examples": [
        {
          "description": "Example 1",
          "example": "steps:\n  - action: test:action\n    id: test\n    input:\n      input1: value\n"
        }
      ],
      "schema": {
        "input": {
          "type": "object",
          "properties": {
            "input1": {
              "title": "Input 1",
              "type": "string"
            }
          }
        }
      }
    }
  ]
  ```

- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/catalog-client@1.3.0-next.2
  - @backstage/plugin-catalog-backend@1.7.0-next.2
  - @backstage/plugin-catalog-node@1.3.1-next.2
  - @backstage/plugin-auth-node@0.2.9-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.4-next.1

## 1.10.0-next.1

### Minor Changes

- 04a2048fb8: Allow custom repository roles to be configured on github repos
- a69664faee: Add Github repository support for squash merge commit title and message options

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.9-next.0
  - @backstage/plugin-scaffolder-common@1.2.4-next.1

## 1.9.1-next.0

### Patch Changes

- e4c0240445: Added `catalogFilter` field to OwnerPicker and EntityPicker components to support filtering options by any field(s) of an entity.

  The `allowedKinds` field has been deprecated. Use `catalogFilter` instead. This field allows users to specify a filter on the shape of [EntityFilterQuery](https://github.com/backstage/backstage/blob/774c42003782121d3d6b2aa5f2865d53370c160e/packages/catalog-client/src/types/api.ts#L74), which can be passed into the CatalogClient. See examples below:

  - Get all entities of kind `Group`

    ```yaml
    owner:
      title: Owner
      type: string
      description: Owner of the component
      ui:field: OwnerPicker
      ui:options:
        catalogFilter:
          - kind: Group
    ```

  - Get entities of kind `Group` and spec.type `team`
    ```yaml
    owner:
      title: Owner
      type: string
      description: Owner of the component
      ui:field: OwnerPicker
      ui:options:
        catalogFilter:
          - kind: Group
            spec.type: team
    ```

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/plugin-scaffolder-common@1.2.4-next.0
  - @backstage/catalog-client@1.3.0-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.8
  - @backstage/plugin-catalog-node@1.3.1-next.0

## 1.9.0

### Minor Changes

- a20a0ea698: Added `requiredConversationResolution` template option to `github:repo:create`, `github:repo:push` and `publish:github`
- b32005e98a: Deprecated the `taskWorkers` option in RouterOptions in favor of `concurrentTasksLimit` which sets the limit of concurrent tasks in a single TaskWorker

  TaskWorker can now run multiple (defaults to 10) tasks concurrently using the `concurrentTasksLimit` option available in both `RouterOptions` and `CreateWorkerOptions`.

  To use the option to create a TaskWorker:

  ```diff
  const worker = await TaskWorker.create({
      taskBroker,
      actionRegistry,
      integrations,
      logger,
      workingDirectory,
      additionalTemplateFilters,
  +   concurrentTasksLimit: 10 // (1 to Infinity)
  });
  ```

- fc51bd8aa0: Add support for disabling Github repository wiki, issues and projects
- 0053d07bee: Update the `github:publish` action to allow passing wether to dismiss stale reviews on the protected default branch.

### Patch Changes

- cb716004ef: Internal refactor to improve tests
- 935b66a646: Change step output template examples to use square bracket syntax.
- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- b05dcd5530: Move the `zod` dependency to a version that does not collide with other libraries
- 26404430bc: Use Json types from @backstage/types
- b07ccffad0: Backend now returns 'ui:options' value from template metadata, it can be used by all your custom scaffolder components.
- 309f2daca4: Updated dependency `esbuild` to `^0.16.0`.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 19356df560: Updated dependency `zen-observable` to `^0.9.0`.
- c3fa90e184: Updated dependency `zen-observable` to `^0.10.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0
  - @backstage/catalog-client@1.2.0
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-catalog-node@1.3.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/errors@1.1.4
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/integration@1.4.1
  - @backstage/plugin-auth-node@0.2.8
  - @backstage/types@1.0.2
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5
  - @backstage/plugin-scaffolder-common@1.2.3

## 1.9.0-next.3

### Minor Changes

- 0053d07bee: Update the `github:publish` action to allow passing wether to dismiss stale reviews on the protected default branch.

### Patch Changes

- 935b66a646: Change step output template examples to use square bracket syntax.
- b05dcd5530: Move the `zod` dependency to a version that does not collide with other libraries
- 309f2daca4: Updated dependency `esbuild` to `^0.16.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.3
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-auth-node@0.2.8-next.3
  - @backstage/plugin-catalog-node@1.3.0-next.3
  - @backstage/plugin-scaffolder-common@1.2.3-next.1

## 1.9.0-next.2

### Minor Changes

- b32005e98a: Deprecated the `taskWorkers` option in RouterOptions in favor of `concurrentTasksLimit` which sets the limit of concurrent tasks in a single TaskWorker

  TaskWorker can now run multiple (defaults to 10) tasks concurrently using the `concurrentTasksLimit` option available in both `RouterOptions` and `CreateWorkerOptions`.

  To use the option to create a TaskWorker:

  ```diff
  const worker = await TaskWorker.create({
      taskBroker,
      actionRegistry,
      integrations,
      logger,
      workingDirectory,
      additionalTemplateFilters,
  +   concurrentTasksLimit: 10 // (1 to Infinity)
  });
  ```

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/plugin-auth-node@0.2.8-next.2
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-scaffolder-common@1.2.3-next.1

## 1.8.1-next.1

### Patch Changes

- c3fa90e184: Updated dependency `zen-observable` to `^0.10.0`.
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-catalog-backend@1.6.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/plugin-auth-node@0.2.8-next.1
  - @backstage/plugin-catalog-node@1.2.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-scaffolder-common@1.2.3-next.1

## 1.8.1-next.0

### Patch Changes

- cb716004ef: Internal refactor to improve tests
- 26404430bc: Use Json types from @backstage/types
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 19356df560: Updated dependency `zen-observable` to `^0.9.0`.
- Updated dependencies
  - @backstage/catalog-client@1.2.0-next.0
  - @backstage/plugin-catalog-backend@1.6.0-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/integration@1.4.1-next.0
  - @backstage/plugin-auth-node@0.2.8-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/plugin-catalog-node@1.2.2-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0
  - @backstage/plugin-scaffolder-common@1.2.3-next.0

## 1.8.0

### Minor Changes

- ea14eb62a2: Added a set of default Prometheus metrics around scaffolding. See below for a list of metrics and an explanation of their labels:

  - `scaffolder_task_count`: Tracks successful task runs.

    Labels:

    - `template`: The entity ref of the scaffolded template
    - `user`: The entity ref of the user that invoked the template run
    - `result`: A string describing whether the task ran successfully, failed, or was skipped

  - `scaffolder_task_duration`: a histogram which tracks the duration of a task run

    Labels:

    - `template`: The entity ref of the scaffolded template
    - `result`: A boolean describing whether the task ran successfully

  - `scaffolder_step_count`: a count that tracks each step run

    Labels:

    - `template`: The entity ref of the scaffolded template
    - `step`: The name of the step that was run
    - `result`: A string describing whether the task ran successfully, failed, or was skipped

  - `scaffolder_step_duration`: a histogram which tracks the duration of each step run

    Labels:

    - `template`: The entity ref of the scaffolded template
    - `step`: The name of the step that was run
    - `result`: A string describing whether the task ran successfully, failed, or was skipped

  You can find a guide for running Prometheus metrics here: https://github.com/backstage/backstage/blob/384b7bac2e/contrib/docs/tutorials/prometheus-metrics.md

- 5921b5ce49: - The GitLab Project ID for the `publish:gitlab:merge-request` action is now passed through the query parameter `project` in the `repoUrl`. It still allows people to not use the `projectid` and use the `repoUrl` with the `owner` and `repo` query parameters instead. This makes it easier to publish to repositories instead of writing the full path to the project.
- 5025d2e8b6: Adds the ability to pass (an optional) array of strings that will be applied to the newly scaffolded repository as topic labels.

### Patch Changes

- 7573b65232: Internal refactor of imports to avoid circular dependencies
- 969a8444ea: Updated dependency `esbuild` to `^0.15.0`.
- 9ff4ff3745: Implement "Branch protection rules" support for "publish:github" action
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-catalog-backend@1.5.1
  - @backstage/integration@1.4.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/catalog-model@1.1.3
  - @backstage/plugin-auth-node@0.2.7
  - @backstage/types@1.0.1
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/plugin-catalog-node@1.2.1
  - @backstage/catalog-client@1.1.2
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3
  - @backstage/plugin-scaffolder-common@1.2.2

## 1.8.0-next.2

### Minor Changes

- 5025d2e8b6: Adds the ability to pass (an optional) array of strings that will be applied to the newly scaffolded repository as topic labels.

### Patch Changes

- 969a8444ea: Updated dependency `esbuild` to `^0.15.0`.
- 9ff4ff3745: Implement "Branch protection rules" support for "publish:github" action
- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/plugin-auth-node@0.2.7-next.1
  - @backstage/plugin-catalog-backend@1.5.1-next.1
  - @backstage/plugin-catalog-node@1.2.1-next.1
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/plugin-scaffolder-common@1.2.2-next.0

## 1.8.0-next.1

### Minor Changes

- 5921b5ce49: - The GitLab Project ID for the `publish:gitlab:merge-request` action is now passed through the query parameter `project` in the `repoUrl`. It still allows people to not use the `projectid` and use the `repoUrl` with the `owner` and `repo` query parameters instead. This makes it easier to publish to repositories instead of writing the full path to the project.

## 1.8.0-next.0

### Minor Changes

- ea14eb62a2: Added a set of default Prometheus metrics around scaffolding. See below for a list of metrics and an explanation of their labels:

  - `scaffolder_task_count`: Tracks successful task runs.

    Labels:

    - `template`: The entity ref of the scaffolded template
    - `user`: The entity ref of the user that invoked the template run
    - `result`: A string describing whether the task ran successfully, failed, or was skipped

  - `scaffolder_task_duration`: a histogram which tracks the duration of a task run

    Labels:

    - `template`: The entity ref of the scaffolded template
    - `result`: A boolean describing whether the task ran successfully

  - `scaffolder_step_count`: a count that tracks each step run

    Labels:

    - `template`: The entity ref of the scaffolded template
    - `step`: The name of the step that was run
    - `result`: A string describing whether the task ran successfully, failed, or was skipped

  - `scaffolder_step_duration`: a histogram which tracks the duration of each step run

    Labels:

    - `template`: The entity ref of the scaffolded template
    - `step`: The name of the step that was run
    - `result`: A string describing whether the task ran successfully, failed, or was skipped

  You can find a guide for running Prometheus metrics here: https://github.com/backstage/backstage/blob/384b7bac2e/contrib/docs/tutorials/prometheus-metrics.md

### Patch Changes

- 7573b65232: Internal refactor of imports to avoid circular dependencies
- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-catalog-backend@1.5.1-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/plugin-auth-node@0.2.7-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/plugin-catalog-node@1.2.1-next.0
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/plugin-scaffolder-common@1.2.2-next.0

## 1.7.0

### Minor Changes

- 253453fa14: Added a new property called `additionalTemplateGlobals` which allows you to add global functions to the scaffolder nunjucks templates.
- 17ff77154c: Update the `github:publish` action to allow passing whether pull
  requests must be up to date with the default branch before merging.
- 304305dd20: Add `allowAutoMerge` option for `publish:github` action
- 694bfe2d61: Add functionality to shutdown scaffolder tasks if they are stale
- a8e9848479: Added optional `sourcePath` parameter to `publish:gitlab:merge-request` action, `targetPath` is now optional and falls back to current workspace path.

### Patch Changes

- 489621f613: Switching off duplicated timestamp in case of logging via task logger in a custom action
- 4880d43e25: Fixed setting default branch for Bitbucket Server
- b681275e69: Ignore .git directories in Template Editor, increase upload limit for dry-runs to 10MB.
- a35a27df70: Updated the `moduleId` of the experimental module export.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.2.0
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-catalog-backend@1.5.0
  - @backstage/plugin-auth-node@0.2.6
  - @backstage/backend-tasks@0.3.6
  - @backstage/backend-plugin-api@0.1.3
  - @backstage/catalog-client@1.1.1
  - @backstage/plugin-scaffolder-common@1.2.1
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/integration@1.3.2
  - @backstage/types@1.0.0

## 1.7.0-next.2

### Minor Changes

- 17ff77154c: Update the `github:publish` action to allow passing whether pull
  requests must be up to date with the default branch before merging.
- a8e9848479: Added optional `sourcePath` parameter to `publish:gitlab:merge-request` action, `targetPath` is now optional and falls back to current workspace path.

### Patch Changes

- 4880d43e25: Fixed setting default branch for Bitbucket Server
- Updated dependencies
  - @backstage/plugin-catalog-node@1.2.0-next.2
  - @backstage/plugin-catalog-backend@1.5.0-next.2
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2
  - @backstage/plugin-auth-node@0.2.6-next.2
  - @backstage/catalog-client@1.1.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/types@1.0.0
  - @backstage/plugin-scaffolder-common@1.2.1-next.2

## 1.7.0-next.1

### Patch Changes

- 489621f613: Switching off duplicated timestamp in case of logging via task logger in a custom action
- a35a27df70: Updated the `moduleId` of the experimental module export.
- Updated dependencies
  - @backstage/catalog-client@1.1.1-next.1
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/types@1.0.0
  - @backstage/plugin-auth-node@0.2.6-next.1
  - @backstage/plugin-catalog-backend@1.4.1-next.1
  - @backstage/plugin-catalog-node@1.1.1-next.1
  - @backstage/plugin-scaffolder-common@1.2.1-next.1

## 1.7.0-next.0

### Minor Changes

- 253453fa14: Added a new property called `additionalTemplateGlobals` which allows you to add global functions to the scaffolder nunjucks templates.
- 304305dd20: Add `allowAutoMerge` option for `publish:github` action
- 694bfe2d61: Add functionality to shutdown scaffolder tasks if they are stale

### Patch Changes

- b681275e69: Ignore .git directories in Template Editor, increase upload limit for dry-runs to 10MB.
- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/backend-plugin-api@0.1.3-next.0
  - @backstage/plugin-catalog-backend@1.4.1-next.0
  - @backstage/catalog-client@1.1.1-next.0
  - @backstage/plugin-catalog-node@1.1.1-next.0
  - @backstage/plugin-scaffolder-common@1.2.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/plugin-auth-node@0.2.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/types@1.0.0

## 1.6.0

### Minor Changes

- ea2eee9e6a: Add the option for a homepage when using the `github:publish` action
- 8872cc735d: Fixed a bug in plugin-scaffolder-backend where it ignores the skip migration database options.

  To use this new implementation you need to create the instance of `DatabaseTaskStore` using the `PluginDatabaseManager` instead of `Knex`;

  ```
  import { DatabaseManager, getRootLogger, loadBackendConfig } from '@backstage/backend-common';
  import { DatabaseTaskStore } from '@backstage/plugin-scaffolder-backend';

  const config = await loadBackendConfig({ argv: process.argv, logger: getRootLogger() });
  const databaseManager = DatabaseManager.fromConfig(config, { migrations: { skip: true } });
  const databaseTaskStore = await DatabaseTaskStore.create(databaseManager);
  ```

- 7db9613671: Added `projectId` for gitlab projects to be displayed in the `gitlab:publish` output
- d1f7ba58e3: Added `repositoryId` output when create a repository in Azure
- 1ff817b3f0: add entity metadata to the template info type

### Patch Changes

- eadf56bbbf: Bump `git-url-parse` version to `^13.0.0`
- de8ee4afe3: Provide information about the user into scaffolder template action's context
- 096631e571: Added support for handling broken symlinks within the scaffolder backend. This is intended for templates that may hold a symlink that is invalid at build time but valid within the destination repo.
- 0d8d650e32: Applied the fix from version 1.5.1 of this package, which is part of the v1.5.1 release of Backstage.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 2df9955f4a: Removed the depreacated `publish:file` action, use the template editor to test templates instead.
- 0ecc9a6784: Properly set `ctx.isDryRun` when running actions in dry run mode. Also always log action inputs for debugging purposes when running in dry run mode.
- 6b9f6c0a4d: Added alpha `scaffolderPlugin` to be used with experimental backend system.
- 83c037cd46: Disable octokit throttling in publish:github:pull-request
- 2cbd533426: Uptake the `IdentityApi` change to use `getIdentity` instead of `authenticate` for retrieving the logged in users identity.
- ef9ab322de: Minor API signatures cleanup
- 50467bc15b: The number of task workers used to execute templates now default to 3, rather than 1.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-auth-node@0.2.5
  - @backstage/plugin-catalog-node@1.1.0
  - @backstage/integration@1.3.1
  - @backstage/plugin-catalog-backend@1.4.0
  - @backstage/catalog-client@1.1.0
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1
  - @backstage/plugin-scaffolder-common@1.2.0

## 1.6.0-next.3

### Patch Changes

- 50467bc15b: The number of task workers used to execute templates now default to 3, rather than 1.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.1.0-next.2
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/catalog-client@1.1.0-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/plugin-catalog-backend@1.4.0-next.3
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/plugin-scaffolder-common@1.2.0-next.1
  - @backstage/plugin-auth-node@0.2.5-next.3

## 1.6.0-next.2

### Minor Changes

- d1f7ba58e3: Added `repositoryId` output when create a repository in Azure

### Patch Changes

- eadf56bbbf: Bump `git-url-parse` version to `^13.0.0`
- 096631e571: Added support for handling broken symlinks within the scaffolder backend. This is intended for templates that may hold a symlink that is invalid at build time but valid within the destination repo.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- 6b9f6c0a4d: Added alpha `scaffolderPlugin` to be used with experimental backend system.
- 83c037cd46: Disable octokit throttling in publish:github:pull-request
- 2cbd533426: Uptake the `IdentityApi` change to use `getIdentity` instead of `authenticate` for retrieving the logged in users identity.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.1
  - @backstage/plugin-catalog-node@1.0.2-next.1
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/integration@1.3.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.2
  - @backstage/plugin-auth-node@0.2.5-next.2
  - @backstage/catalog-client@1.0.5-next.1

## 1.6.0-next.1

### Minor Changes

- 7db9613671: Added `projectId` for gitlab projects to be displayed in the `gitlab:publish` output

### Patch Changes

- 0d8d650e32: Applied the fix from version 1.5.1 of this package, which is part of the v1.5.1 release of Backstage.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.1

## 1.6.0-next.0

### Minor Changes

- ea2eee9e6a: Add the option for a homepage when using the `github:publish` action
- 8872cc735d: Fixed a bug in plugin-scaffolder-backend where it ignores the skip migration database options.

  To use this new implementation you need to create the instance of `DatabaseTaskStore` using the `PluginDatabaseManager` instead of `Knex`;

  ```
  import { DatabaseManager, getRootLogger, loadBackendConfig } from '@backstage/backend-common';
  import { DatabaseTaskStore } from '@backstage/plugin-scaffolder-backend';

  const config = await loadBackendConfig({ argv: process.argv, logger: getRootLogger() });
  const databaseManager = DatabaseManager.fromConfig(config, { migrations: { skip: true } });
  const databaseTaskStore = await DatabaseTaskStore.create(databaseManager);
  ```

- 1ff817b3f0: add entity metadata to the template info type

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 2df9955f4a: Removed the depreacated `publish:file` action, use the template editor to test templates instead.
- ef9ab322de: Minor API signatures cleanup
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/plugin-catalog-backend@1.3.2-next.0
  - @backstage/backend-plugin-api@0.1.2-next.0
  - @backstage/catalog-client@1.0.5-next.0
  - @backstage/integration@1.3.1-next.0
  - @backstage/plugin-scaffolder-common@1.2.0-next.0
  - @backstage/plugin-catalog-node@1.0.2-next.0

## 1.5.1

### Patch Changes

- Fix minimum required version for `vm2`

## 1.5.0

### Minor Changes

- c4b452e16a: Starting the implementation of the Wizard page for the `next` scaffolder plugin
- 593dea6710: Add support for Basic Auth for Bitbucket Server.
- 3b7930b3e5: Add support for Bearer Authorization header / token-based auth at Git commands.
- 3f1316f1c5: User Bearer Authorization header at Git commands with token-based auth at Bitbucket Server.
- eeff5046ae: Updated `publish:gitlab:merge-request` action to allow commit updates and deletes
- 692d5d3405: Added `reviewers` and `teamReviewers` parameters to `publish:github:pull-request` action to add reviewers on the pull request created by the action

### Patch Changes

- fc8a5f797b: Add a `publish:gerrit:review` scaffolder action
- c971afbf21: The `publish:file` action has been deprecated in favor of testing templates using the template editor instead. Note that this action is not and was never been installed by default.
- b10b6c4aa4: Fix issue on Windows where templated files where not properly skipped as intended.
- 56e1b4b89c: Fixed typos in alpha types.
- dad0f65494: Fail gracefully if an invalid `Authorization` header is passed to `POST /v2/tasks`
- 014b3b7776: Add missing `res.end()` in scaffolder backend `EventStream` usage
- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/backend-plugin-api@0.1.1
  - @backstage/plugin-catalog-node@1.0.1
  - @backstage/integration@1.3.0
  - @backstage/plugin-catalog-backend@1.3.1

## 1.5.0-next.2

### Minor Changes

- 692d5d3405: Added `reviewers` and `teamReviewers` parameters to `publish:github:pull-request` action to add reviewers on the pull request created by the action

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.1-next.2

## 1.5.0-next.1

### Minor Changes

- c4b452e16a: Starting the implementation of the Wizard page for the `next` scaffolder plugin

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.1
  - @backstage/integration@1.3.0-next.1
  - @backstage/plugin-catalog-backend@1.3.1-next.1

## 1.5.0-next.0

### Minor Changes

- 593dea6710: Add support for Basic Auth for Bitbucket Server.
- 3b7930b3e5: Add support for Bearer Authorization header / token-based auth at Git commands.
- 3f1316f1c5: User Bearer Authorization header at Git commands with token-based auth at Bitbucket Server.
- eeff5046ae: Updated `publish:gitlab:merge-request` action to allow commit updates and deletes

### Patch Changes

- fc8a5f797b: Add a `publish:gerrit:review` scaffolder action
- 014b3b7776: Add missing `res.end()` in scaffolder backend `EventStream` usage
- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/integration@1.3.0-next.0
  - @backstage/backend-plugin-api@0.1.1-next.0
  - @backstage/plugin-catalog-backend@1.3.1-next.0
  - @backstage/plugin-catalog-node@1.0.1-next.0

## 1.4.0

### Minor Changes

- e1a08d872c: Added optional assignee parameter for Gitlab Merge Request action
- dab9bcf2e7: Add `protectEnforceAdmins` as an option to GitHub publish actions
- 4baf8a4ece: Update GitLab Merge Request Action to allow source branch to be deleted
- 91c1d12123: Export experimental `scaffolderCatalogExtension` for the new backend system. This export is not considered stable and should not be used in production.
- d10ccc2ed1: Introduced audit log message when a new scaffolder task is created
- 2db07887cb: Added two new scaffolder actions: `github:repo:create` and `github:repo:push`

### Patch Changes

- ff316b86d8: Add `copyWithoutTemplating` to the fetch template action input. `copyWithoutTemplating` also accepts an array of glob patterns. Contents of matched files or directories are copied without being processed, but paths are subject to rendering.

  Deprecate `copyWithoutRender` in favor of `copyWithoutTemplating`.

- 801d606909: Improve error messaging when passing in malformed auth
- 089d846962: Fix issues with optional directories and files
- ea6dcb84a4: Don't resolve symlinks, treat them as binary files and copy them as-is
- af02f54483: new setUserAsOwner flag for publish:gitlab action

  The field default is `false`. When true it will use the token configured in the gitlab integration for the matching host, to try and set the user logged in via `repoUrlPicker` `requestUserCredentials` OAuth flow as owner of the repository created in GitLab.

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 72622d9143: Updated dependency `yaml` to `^2.0.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- 511f49ee43: Updated dependency `octokit` to `^2.0.0`.
- 735853353b: Updated dependency `@octokit/webhooks` to `^10.0.0`.
- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- 945a27fa6a: Add sourcePath option to publish:gerrit action
- 1764296a68: Allow to create Gerrit project using default owner
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.0
  - @backstage/plugin-catalog-backend@1.3.0
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0
  - @backstage/plugin-catalog-node@1.0.0
  - @backstage/integration@1.2.2
  - @backstage/catalog-client@1.0.4
  - @backstage/errors@1.1.0
  - @backstage/plugin-scaffolder-common@1.1.2

## 1.4.0-next.3

### Minor Changes

- 91c1d12123: Export experimental `scaffolderCatalogExtension` for the new backend system. This export is not considered stable and should not be used in production.

### Patch Changes

- ea6dcb84a4: Don't resolve symlinks, treat them as binary files and copy them as-is
- af02f54483: new setUserAsOwner flag for publish:gitlab action

  The field default is `false`. When true it will use the token configured in the gitlab integration for the matching host, to try and set the user logged in via `repoUrlPicker` `requestUserCredentials` OAuth flow as owner of the repository created in GitLab.

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 72622d9143: Updated dependency `yaml` to `^2.0.0`.
- 511f49ee43: Updated dependency `octokit` to `^2.0.0`.
- 735853353b: Updated dependency `@octokit/webhooks` to `^10.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.0-next.0
  - @backstage/plugin-catalog-backend@1.3.0-next.3
  - @backstage/plugin-catalog-node@1.0.0-next.0
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/catalog-client@1.0.4-next.2
  - @backstage/integration@1.2.2-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 1.4.0-next.2

### Minor Changes

- 4baf8a4ece: Update GitLab Merge Request Action to allow source branch to be deleted
- 2db07887cb: Added two new scaffolder actions: `github:repo:create` and `github:repo:push`

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
  - @backstage/plugin-catalog-backend@1.2.1-next.2
  - @backstage/integration@1.2.2-next.2

## 1.4.0-next.1

### Patch Changes

- 801d606909: Improve error messaging when passing in malformed auth
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.1
  - @backstage/catalog-client@1.0.4-next.1
  - @backstage/integration@1.2.2-next.1

## 1.4.0-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/integration@1.2.2-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.0
  - @backstage/catalog-client@1.0.4-next.0
  - @backstage/plugin-scaffolder-common@1.1.2-next.0

## 1.3.0

### Minor Changes

- 35a26131b3: **DEPRECATION**: The `projectid` input parameters to the `publish:gitlab:merge-request`, it's no longer required as it can be decoded from the `repoUrl` input parameter.
  **DEPRECATION**: The `projectid` output of the action in favour of `projectPath`
- 72dfcbc8bf: A new scaffolder action has been added: `gerrit:publish`
- ce0d8d7eb1: Fixed a bug in `publish:github` action that didn't permit to add users as collaborators.
  This fix required changing the way parameters are passed to the action.
  In order to add a team as collaborator, now you must use the `team` field instead of `username`.
  In order to add a user as collaborator, you must use the `user` field.

  It's still possible to use the field `username` but is deprecated in favor of `team`.

  ```yaml
  - id: publish
    name: Publish
    action: publish:github
    input:
      repoUrl: ...
      collaborators:
        - access: ...
          team: my_team
        - access: ...
          user: my_username
  ```

- 582003a059: - Added an optional `list` method on the `TaskBroker` and `TaskStore` interface to list tasks by an optional `userEntityRef`
  - Implemented a `list` method on the `DatabaseTaskStore` class to list tasks by an optional `userEntityRef`
  - Added a route under `/v2/tasks` to list tasks by a `userEntityRef` using the `createdBy` query parameter
- c042c5eaff: Add an option to not protect the default branch.
- f93af969cd: Added the ability to support running of templates that are not in the `default` namespace
- 3500c13a33: Added a new `/v2/dry-run` endpoint that allows for a synchronous dry run of a provided template. A `supportsDryRun` option has been added to `createTemplateAction`, which signals whether the action should be executed during dry runs. When enabled, the action context will have the new `isDryRun` property set to signal if the action is being executed during a dry run.

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- 6901f6be4a: Adds more of an explanation when the `publish:github` scaffolder action fails to create a repository.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.2.0
  - @backstage/backend-common@0.14.0
  - @backstage/integration@1.2.1
  - @backstage/catalog-client@1.0.3
  - @backstage/catalog-model@1.0.3
  - @backstage/plugin-scaffolder-common@1.1.1

## 1.3.0-next.2

### Minor Changes

- ce0d8d7eb1: Fixed a bug in `publish:github` action that didn't permit to add users as collaborators.
  This fix required changing the way parameters are passed to the action.
  In order to add a team as collaborator, now you must use the `team` field instead of `username`.
  In order to add a user as collaborator, you must use the `user` field.

  It's still possible to use the field `username` but is deprecated in favor of `team`.

  ```yaml
  - id: publish
    name: Publish
    action: publish:github
    input:
      repoUrl: ...
      collaborators:
        - access: ...
          team: my_team
        - access: ...
          user: my_username
  ```

- 582003a059: - Added an optional `list` method on the `TaskBroker` and `TaskStore` interface to list tasks by an optional `userEntityRef`
  - Implemented a `list` method on the `DatabaseTaskStore` class to list tasks by an optional `userEntityRef`
  - Added a route under `/v2/tasks` to list tasks by a `userEntityRef` using the `createdBy` query parameter

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/integration@1.2.1-next.2
  - @backstage/plugin-catalog-backend@1.2.0-next.2

## 1.3.0-next.1

### Minor Changes

- c042c5eaff: Add an option to not protect the default branch.

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/catalog-client@1.0.3-next.0
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-scaffolder-common@1.1.1-next.0

## 1.3.0-next.0

### Minor Changes

- 72dfcbc8bf: A new scaffolder action has been added: `gerrit:publish`

### Patch Changes

- 6901f6be4a: Adds more of an explanation when the `publish:github` scaffolder action fails to create a repository.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/plugin-catalog-backend@1.2.0-next.0

## 1.2.0

### Minor Changes

- 9818112d12: Update the `github:publish` action to allow passing required status check
  contexts before merging to the main branch.
- f8baf7df44: Added the ability to reference the user in the `template.yaml` manifest
- 8d5a2238a9: Split `publish:bitbucket` into `publish:bitbucketCloud` and `publish:bitbucketServer`.

  In order to migrate from the deprecated action, you need to replace the use of action
  `publish:bitbucket` in your templates with the use of either `publish:bitbucketCloud`
  or `publish:bitbucketServer` - depending on which destination SCM provider you use.

  Additionally, these actions will not utilize `integrations.bitbucket` anymore,
  but `integrations.bitbucketCloud` or `integrations.bitbucketServer` respectively.
  You may or may not have migrated to these already.

  As described in a previous changeset, using these two replacement integrations configs
  will not compromise use cases which still rely on `integrations.bitbucket` as this was
  set up in a backwards compatible way.

  Additionally, please mind that the option `enableLFS` is only available (and always was)
  for Bitbucket Server use cases and therefore, is not even part of the schema for
  `publish:bitbucketCloud` anymore.

### Patch Changes

- 0fc65cbf89: Override default commit message and author details in GitHub, Azure, bitbucket
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-catalog-backend@1.1.2
  - @backstage/integration@1.2.0
  - @backstage/plugin-scaffolder-common@1.1.0
  - @backstage/config@1.0.1
  - @backstage/catalog-client@1.0.2
  - @backstage/catalog-model@1.0.2

## 1.2.0-next.1

### Minor Changes

- f8baf7df44: Added the ability to reference the user in the `template.yaml` manifest

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-catalog-backend@1.1.2-next.2
  - @backstage/plugin-scaffolder-common@1.1.0-next.0
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/integration@1.2.0-next.1
  - @backstage/catalog-client@1.0.2-next.0

## 1.2.0-next.0

### Minor Changes

- 9818112d12: Update the `github:publish` action to allow passing required status check
  contexts before merging to the main branch.
- 8d5a2238a9: Split `publish:bitbucket` into `publish:bitbucketCloud` and `publish:bitbucketServer`.

  In order to migrate from the deprecated action, you need to replace the use of action
  `publish:bitbucket` in your templates with the use of either `publish:bitbucketCloud`
  or `publish:bitbucketServer` - depending on which destination SCM provider you use.

  Additionally, these actions will not utilize `integrations.bitbucket` anymore,
  but `integrations.bitbucketCloud` or `integrations.bitbucketServer` respectively.
  You may or may not have migrated to these already.

  As described in a previous changeset, using these two replacement integrations configs
  will not compromise use cases which still rely on `integrations.bitbucket` as this was
  set up in a backwards compatible way.

  Additionally, please mind that the option `enableLFS` is only available (and always was)
  for Bitbucket Server use cases and therefore, is not even part of the schema for
  `publish:bitbucketCloud` anymore.

### Patch Changes

- 0fc65cbf89: Override default commit message and author details in GitHub, Azure, bitbucket
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/integration@1.2.0-next.0
  - @backstage/plugin-catalog-backend@1.1.2-next.0

## 1.1.0

### Minor Changes

- 2a7d52ca2c: Override default commit message and author details in GitLab action
- f5f921dafb: Add new `draft` option to the `publish:github:pull-request` action.

### Patch Changes

- 64d9a031a8: build(deps): bump `isbinaryfile` from 4.0.8 to 5.0.0
- 2f3d3a1eae: build(deps): bump `@gitbeaker/core` from 34.6.0 to 35.6.0
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0
  - @backstage/integration@1.1.0
  - @backstage/catalog-model@1.0.1
  - @backstage/backend-common@0.13.2
  - @backstage/catalog-client@1.0.1
  - @backstage/plugin-scaffolder-common@1.0.1

## 1.1.0-next.2

### Patch Changes

- 64d9a031a8: build(deps): bump `isbinaryfile` from 4.0.8 to 5.0.0
- 2f3d3a1eae: build(deps): bump `@gitbeaker/core` from 34.6.0 to 35.6.0
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0-next.2
  - @backstage/catalog-model@1.0.1-next.1

## 1.1.0-next.1

### Minor Changes

- 2a7d52ca2c: Override default commit message and author details in GitLab action
- f5f921dafb: Add new `draft` option to the `publish:github:pull-request` action.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0-next.1
  - @backstage/integration@1.1.0-next.1
  - @backstage/backend-common@0.13.2-next.1

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-backend@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/integration@1.0.1-next.0
  - @backstage/catalog-client@1.0.1-next.0
  - @backstage/plugin-scaffolder-common@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- 765639f98c: Added new `github:issues:label` action to apply labels to issues, and also output `pullRequestNumber` from `publish:github:pull-request`.
- efc73db10c: Use `better-sqlite3` instead of `@vscode/sqlite3`
- c8475ab3bb: Adding some documentation for exported things
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.0.0
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/plugin-scaffolder-common@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/catalog-client@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0

## 0.18.0

### Minor Changes

- 310e905998: The following deprecations are now breaking and have been removed:

  - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

  - **BREAKING**: Removed the deprecated `TemplateMetadata`. Please use `TemplateInfo` instead.

  - **BREAKING**: Removed the deprecated `context.baseUrl`. It's now available on `context.templateInfo.baseUrl`.

  - **BREAKING**: Removed the deprecated `DispatchResult`, use `TaskBrokerDispatchResult` instead.

  - **BREAKING**: Removed the deprecated `runCommand`, use `executeShellCommond` instead.

  - **BREAKING**: Removed the deprecated `Status` in favour of `TaskStatus` instead.

  - **BREAKING**: Removed the deprecated `TaskState` in favour of `CurrentClaimedTask` instead.

- f9c7bdd899: **BREAKING**:

  - Removed the `createFetchCookiecutterAction` export, please use the `@backstage/plugin-scaffolder-backend-module-cookiecutter` package explicitly (see [its README](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend-module-cookiecutter) for installation instructions).
  - Removed the `containerRunner` argument from the types `RouterOptions` (as used by `createRouter`) and `CreateBuiltInActionsOptions` (as used by `createBuiltinActions`).

- 5afbd16d43: **BREAKING**: Removed the previously deprecated `OctokitProvider` class.

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- 8122e27717: Updating documentation for supporting `apiVersion: scaffolder.backstage.io/v1beta3`
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- 458d16869c: Allow passing more repo configuration for `publish:github` action
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-catalog-backend@0.24.0
  - @backstage/plugin-scaffolder-common@0.3.0
  - @backstage/catalog-model@0.13.0
  - @backstage/catalog-client@0.9.0

## 0.18.0-next.0

### Minor Changes

- 310e905998: The following deprecations are now breaking and have been removed:

  - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

  - **BREAKING**: Removed the deprecated `TemplateMetadata`. Please use `TemplateInfo` instead.

  - **BREAKING**: Removed the deprecated `context.baseUrl`. It's now available on `context.templateInfo.baseUrl`.

  - **BREAKING**: Removed the deprecated `DispatchResult`, use `TaskBrokerDispatchResult` instead.

  - **BREAKING**: Removed the deprecated `runCommand`, use `executeShellCommond` instead.

  - **BREAKING**: Removed the deprecated `Status` in favour of `TaskStatus` instead.

  - **BREAKING**: Removed the deprecated `TaskState` in favour of `CurrentClaimedTask` instead.

- f9c7bdd899: **BREAKING**:

  - Removed the `createFetchCookiecutterAction` export, please use the `@backstage/plugin-scaffolder-backend-module-cookiecutter` package explicitly (see [its README](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend-module-cookiecutter) for installation instructions).
  - Removed the `containerRunner` argument from the types `RouterOptions` (as used by `createRouter`) and `CreateBuiltInActionsOptions` (as used by `createBuiltinActions`).

- 5afbd16d43: **BREAKING**: Removed the previously deprecated `OctokitProvider` class.

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- 8122e27717: Updating documentation for supporting `apiVersion: scaffolder.backstage.io/v1beta3`
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- 458d16869c: Allow passing more repo configuration for `publish:github` action
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-catalog-backend@0.24.0-next.0
  - @backstage/plugin-scaffolder-common@0.3.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/catalog-client@0.9.0-next.0

## 0.17.3

### Patch Changes

- 5c7f2343ea: Applied fix from version 0.17.2 of this package, which is part of the v0.69.2 release of Backstage.
- 899f196af5: Use `getEntityByRef` instead of `getEntityByName` in the catalog client
- 34af86517c: ensure `apiBaseUrl` being set for Bitbucket integrations, replace hardcoded defaults
- d6deb5e440: Set timeout for scaffolder octokit client
- 83a83381b0: Use the new `processingResult` export from the catalog backend
- 7372f29473: Cleanup API report
- c7f6424a26: Applied fix from `v0.17.1` of this package which is part of the `v0.69.1` release of Backstage.
- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- 8119a9e011: Fix the support for custom defaultBranch values for Bitbucket Cloud at the `publish:bitbucket` scaffolder action.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/plugin-catalog-backend@0.23.0
  - @backstage/backend-common@0.12.0
  - @backstage/integration@0.8.0
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.3
  - @backstage/plugin-scaffolder-common@0.2.3

## 0.17.2

### Patch Changes

- bug: `repoUrl` does not have a protocol in `publish:github:pull-request`

## 0.17.1

### Patch Changes

- bug: fixing `repoUrl` resolution for `publish:github:pull-request` action

## 0.17.0

### Minor Changes

- 91c6faeb7b: - **BREAKING** - the `/v2/tasks` endpoint now takes `templateRef` instead of `templateName` in the POST body. This should be a valid stringified `entityRef`.
- 7f193ff019: - **BREAKING** - `DatabaseTaskStore()` constructor is now removed. Please use the `DatabaseTaskStore.create()` method instead.

  - **BREAKING** - `TaskStore.createTask()` method now only takes one argument of type `TaskStoreCreateTaskOptions` which encapsulates the `spec` and `secrets`

  ```diff
  - TaskStore.createTask(spec, secrets)
  + TaskStore.createTask({ spec, secrets})
  ```

  - **BREAKING** - `TaskBroker.dispatch()` method now only takes one argument of type `TaskBrokerDispatchOptions` which encapsulates the `spec` and `secrets`

  ```diff
  - TaskBroker.dispatch(spec, secrets)
  + TaskBroker.dispatch({ spec, secrets})
  ```

- 9d9b2bab47: - **BREAKING** - Removed the re-export of types `TaskSpec` `TaskSpecV1Beta2` and `TaskSpecV1Beta3` these should now be import from `@backstage/plugin-scaffolder-common` directly.
  - **BREAKING** - Removed the `observe` method from the `TaskBroker` interface, this has now been replaced with an `Observable` implementation under `event# @backstage/plugin-scaffolder-backend.

### Patch Changes

- 9d9b2bab47: - **DEPRECATED** - Deprecated the `runCommand` export in favour of `executeShellCommand`. Please migrate to using the new method.
  - Added a type parameter to `TaskStoreEmitOptions` to type the `body` property
- 65a7939c6c: - **DEPRECATED** - `TaskState` has been deprecated in favour of `CurrentClaimedTask`
  - Narrowed the types from `JSONValue` to `JSONObject` as the usage is and should always be `JSONObject` for `complete` and `emitLog` `metadata` in `TaskContext`
- 67a7c02d26: Remove usages of `EntityRef` and `parseEntityName` from `@backstage/catalog-model`
- ed09ad8093: Updated usage of the `LocationSpec` type from `@backstage/catalog-model`, which is deprecated.
- 6981ac4ad2: - **DEPRECATED** - The `containerRunner` option passed to `createBuiltinActions` has now been deprecated.

  - **DEPRECATED** - The `createFetchCookiecutterAction` export has also been deprecated and will soon disappear from this plugin.

  The `fetch:cookiecutter` action will soon be removed from the default list of actions that are provided out of the box from the scaffolder plugin. It will still be supported, and maintained by the community, so you can install the package (`@backstage/plugin-scaffolder-backend-module-cookiecutter`) and pass it in as a custom action. Or you can migrate your templates to use [`fetch:template`](https://backstage.io/docs/features/software-templates/builtin-actions#migrating-from-fetchcookiecutter-to-fetchtemplate) with the `cookiecutterCompat` option.

- b1744f1153: - **DEPRECATED** - `OctokitProvider` has been deprecated and will be removed in upcoming versions
  This helper doesn't make sense to be export from the `plugin-scaffolder-backend` and possibly will be moved into the `integrations` package at a later date.
  All implementations have been moved over to a private implementation called `getOctokitOptions` which is then passed to the `Octokit` constructor. If you're using this API you should consider duplicating the logic that lives in `getOctokitOptions` and move away from the deprecated export.
- 0f37cdef19: Migrated over from the deprecated `spec.metadata` to `spec.templateInfo` for the `name` and the `baseUrl` of the template.
- 7f193ff019: - **DEPRECATED** - `Status` has been deprecated in favour of `TaskStatus`
  - **DEPRECATED** - `CompletedTaskState` has been deprecated in favour of `TaskCompletionState`
  - **DEPRECATED** - `DispatchResult` has been deprecated in favour of `TaskBrokerDispatchResult`
- df61ca71dd: Implemented required `getProcessorName` method for catalog processor.
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/plugin-catalog-backend@0.22.0
  - @backstage/plugin-scaffolder-common@0.2.2
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.2
  - @backstage/integration@0.7.5

## 0.16.1

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-client@0.7.1
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/integration@0.7.4
  - @backstage/types@0.1.3
  - @backstage/plugin-catalog-backend@0.21.5
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.1
  - @backstage/plugin-scaffolder-common@0.2.1

## 0.16.0

### Minor Changes

- 661594bf43: **BREAKING**: Updated `TemplateAction` and related types to have its type parameter extend `JsonObject` instead of `InputBase`. The `createTemplateAction` has also been updated to pass through the `TInput` type parameter to the return type, meaning the `TemplateAction` retains its type. This can lead to breakages during type checking especially within tests.
- 8db2b671c6: **BREAKING**: `ctx.token` is now `ctx.secrets.backstageToken` in Actions. Please update any of your Actions that might call out to Backstage API's with this token.
- 5a1594330e: **BREAKING** - Removed the `CatalogEntityClient` export. This is no longer provider by this package,
  but you can implement one pretty simply yourself using the `CatalogApi` and applying filters to fetch templates.
- 7d3471db94: Remove the previously deprecated `scaffolder.provider` config for all providers.
  This config is no longer used anywhere, and adopters should use [`integrations` config](https://backstage.io/docs/integrations) instead.

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- 3e59f90b51: Fix error handling of the `runCommand` helper to return `Error`
  instance.
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 216725b434: Updated to use new names for `parseLocationRef` and `stringifyLocationRef`
- e72d371296: Use `TemplateEntityV1beta2` from `@backstage/plugin-scaffolder-common` instead
  of `@backstage/catalog-model`.
- 1433045c08: Removed unused `helmet` dependency.
- 27eccab216: Replaces use of deprecated catalog-model constants.
- Updated dependencies
  - @backstage/plugin-scaffolder-common@0.2.0
  - @backstage/plugin-catalog-backend@0.21.4
  - @backstage/backend-common@0.10.8
  - @backstage/catalog-client@0.7.0
  - @backstage/errors@0.2.1
  - @backstage/integration@0.7.3
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.0

## 0.15.24

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- 2bd5f24043: fix for the `gitlab:publish` action to use the `oauthToken` key when creating a
  `Gitlab` client. This only happens if `ctx.input.token` is provided else the key `token` will be used.
- 898a56578c: Bump `vm2` to version 3.9.6
- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/backend-common@0.10.7
  - @backstage/plugin-catalog-backend@0.21.3
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.11

## 0.15.24-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- 2bd5f24043: fix for the `gitlab:publish` action to use the `oauthToken` key when creating a
  `Gitlab` client. This only happens if `ctx.input.token` is provided else the key `token` will be used.
- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/plugin-catalog-backend@0.21.3-next.0
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.11-next.0

## 0.15.23

### Patch Changes

- 2e0dbb0e50: Migrate from deprecated package @octokit/rest to octokit
- c95df1631e: Added support for templating secrets into actions input, and also added an extra `token` input argument to all publishers to provide a token that would override the `integrations.config`.
  You can find more information over at [Writing Templates](https://backstage.io/docs/features/software-templates/writing-templates#using-the-users-oauth-token)
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.2
  - @backstage/backend-common@0.10.6
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.10

## 0.15.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/plugin-catalog-backend@0.21.2-next.1
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.10-next.1

## 0.15.23-next.0

### Patch Changes

- 2e0dbb0e50: Migrate from deprecated package @octokit/rest to octokit
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.2-next.0
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.10-next.0

## 0.15.22

### Patch Changes

- b09dd8f43b: chore(deps): bump `@gitbeaker/node` from 34.6.0 to 35.1.0
- ac2f1eeec0: This change is for adding the option of inputs on the `github:actions:dispatch` Backstage Action. This will allow users to pass data from Backstage to the GitHub Action.
- 0d5e846a78: Expose a new option to provide additional template filters via `@backstage/scaffolder-backend`'s `createRouter()` function.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.1
  - @backstage/backend-common@0.10.5

## 0.15.21

### Patch Changes

- b05d303226: Added the ability to support supplying secrets when creating tasks in the `scaffolder-backend`.

  **deprecation**: Deprecated `ctx.token` from actions in the `scaffolder-backend`. Please move to using `ctx.secrets.backstageToken` instead.

  **deprecation**: Deprecated `task.token` in `TaskSpec` in the `scaffolder-backend`. Please move to using `task.secrets.backstageToken` instead.

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.0
  - @backstage/integration@0.7.2
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.9
  - @backstage/plugin-scaffolder-common@0.1.3

## 0.15.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.0-next.0
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/catalog-client@0.5.5-next.0
  - @backstage/integration@0.7.2-next.0
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.9-next.0
  - @backstage/plugin-scaffolder-common@0.1.3-next.0

## 0.15.20

### Patch Changes

- 9fbd3b90ae: fix: Register plugin to prioritise Component kind for entityRef
- 451ef0aa07: Fix token pass-through for software templates using beta 3 version
- 5333451def: Cleaned up API exports
- 3b4d8caff6: Allow a GitHubCredentialsProvider to be passed to the GitHub scaffolder tasks actions.
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/integration@0.7.1
  - @backstage/backend-common@0.10.3
  - @backstage/plugin-catalog-backend@0.20.0
  - @backstage/errors@0.2.0
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.8

## 0.15.19

### Patch Changes

- 7d4b4e937c: Uptake changes to the GitHub Credentials Provider interface.
- d078377f67: Support navigating back to pre-filled templates to update inputs of scaffolder tasks for resubmission
- 5f8ceba1b1: Support custom file name for `catalog:write` action
- Updated dependencies
  - @backstage/backend-common@0.10.1
  - @backstage/plugin-catalog-backend@0.19.4
  - @backstage/plugin-scaffolder-common@0.1.2
  - @backstage/integration@0.7.0
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.7

## 0.15.18

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/catalog-client@0.5.3
  - @backstage/plugin-catalog-backend@0.19.3
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.6

## 0.15.17

### Patch Changes

- eec0750d8d: Makes cookiecutter a default, but optional action based on if a containerRunner argument is passed in to createRouter or createBuiltinActions
- ed52f74ab3: Adding changes to create GitLab Merge Request using custom action
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.19.2
  - @backstage/backend-common@0.9.14
  - @backstage/catalog-model@0.9.8

## 0.15.16

### Patch Changes

- 2a3fb13718: Bump esbuild to ^0.14.1
- Updated dependencies
  - @backstage/backend-common@0.9.13
  - @backstage/plugin-catalog-backend@0.19.1

## 0.15.15

### Patch Changes

- 0398ea25d3: Removed unused scaffolder visibility configuration; this has been moved to publish actions. Deprecated scaffolder provider configuration keys; these should use the integrations configuration instead.
- b055a6addc: Align on usage of `cross-fetch` vs `node-fetch` in frontend vs backend packages, and remove some unnecessary imports of either one of them
- c6b44d80ad: Add options to spawn in runCommand helper
- Updated dependencies
  - @backstage/integration@0.6.10
  - @backstage/plugin-catalog-backend@0.19.0
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.5
  - @backstage/backend-common@0.9.12

## 0.15.14

### Patch Changes

- a096e4c4d7: Switched to executing scaffolder templating in a secure context for any template based on nunjucks, as it is [not secure by default](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
- f9352ab606: Removed all usages of `path.resolve` in order to ensure that template paths are resolved in a safe way.
- e634a47ce5: Fix bug where there was error log lines written when failing to `JSON.parse` things that were not `JSON` values.
- 42ebbc18c0: Bump gitbeaker to the latest version
- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/plugin-catalog-backend@0.18.0
  - @backstage/backend-common@0.9.11

## 0.15.13

### Patch Changes

- 26eb174ce8: Skip empty file names when scaffolding with nunjucks
- ecdcbd08ee: Expose template metadata to custom action handler in Scaffolder.
- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10
  - @backstage/plugin-catalog-backend@0.17.4

## 0.15.12

### Patch Changes

- 9990df8a1f: Expose some classes and interfaces public so TaskWorkers can run externally from the scaffolder API.
- b45a34fb15: Adds a new endpoint for consuming logs from the Scaffolder that uses long polling instead of Server Sent Events.

  This is useful if Backstage is accessed from an environment that doesn't support SSE correctly, which happens in combination with certain enterprise HTTP Proxy servers.

  It is intended to switch the endpoint globally for the whole instance.
  If you want to use it, you can provide a reconfigured API to the `scaffolderApiRef`:

  ```tsx
  // packages/app/src/apis.ts

  // ...
  import {
    scaffolderApiRef,
    ScaffolderClient,
  } from '@backstage/plugin-scaffolder';

  export const apis: AnyApiFactory[] = [
    // ...

    createApiFactory({
      api: scaffolderApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
        scmIntegrationsApi: scmIntegrationsApiRef,
      },
      factory: ({ discoveryApi, identityApi, scmIntegrationsApi }) =>
        new ScaffolderClient({
          discoveryApi,
          identityApi,
          scmIntegrationsApi,
          // use long polling instead of an eventsource
          useLongPollingLogs: true,
        }),
    }),
  ];
  ```

- a794c341ca: Fix a bug where only file mode 775 is considered an executable
- Updated dependencies
  - @backstage/backend-common@0.9.9
  - @backstage/catalog-client@0.5.1
  - @backstage/plugin-catalog-backend@0.17.3
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.4

## 0.15.11

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- 41c49884d2: Start using the new `@backstage/types` package. Initially, this means using the `Observable` and `Json*` types from there. The types also remain in their old places but deprecated, and will be removed in a future release.
- e55a5dea09: Fixed bug where the mode of an executable file was ignored
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.2
  - @backstage/config@0.1.11
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/backend-common@0.9.8
  - @backstage/catalog-model@0.9.6
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.3
  - @backstage/plugin-scaffolder-common@0.1.1

## 0.15.10

### Patch Changes

- b149e94290: Allow `catalog:register` action to register optional locations
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.1
  - @backstage/backend-common@0.9.7
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.15.9

### Patch Changes

- 0f99f1170e: Make sure `sourcePath` of `publish:github:pull-request` can only be used to
  retrieve files from the workspace.

## 0.15.8

### Patch Changes

- 42c618abf6: Use `resolveSafeChildPath` in the `fetchContents` function to forbid reading files outside the base directory when a template is registered from a `file:` location.
- 18083d1821: Introduce the new `scaffolder.backstage.io/v1beta3` template kind with nunjucks support 🥋
- Updated dependencies
  - @backstage/integration@0.6.8
  - @backstage/plugin-catalog-backend@0.17.0

## 0.15.7

### Patch Changes

- ca3086a7ad: Fixed a bug where the `catalog:register` action would not return any entity when running towards recent versions of the catalog.
- Updated dependencies
  - @backstage/catalog-model@0.9.4
  - @backstage/backend-common@0.9.6
  - @backstage/catalog-client@0.5.0
  - @backstage/integration@0.6.7

## 0.15.6

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.5
  - @backstage/catalog-client@0.4.0
  - @backstage/catalog-model@0.9.3
  - @backstage/backend-common@0.9.4
  - @backstage/config@0.1.10

## 0.15.5

### Patch Changes

- 618143c3c7: Action needed: If you are using the templates located at https://github.com/backstage/backstage/tree/master/ in your Backstage app directly using the URL via the `app-config.yaml`, you should copy over the templates inside your org and import from there. The templates have now been moved to https://github.com/backstage/software-templates. See https://github.com/backstage/backstage/issues/6415 for explanation.
- cfade02127: Change hardcoded branch `master` to \$defaultBranch in GitLab provider
- 96fef17a18: Upgrade git-parse-url to v11.6.0
- Updated dependencies
  - @backstage/backend-common@0.9.3
  - @backstage/integration@0.6.4

## 0.15.4

### Patch Changes

- 04aad2dab: Fix issue #7021 scaffolder action fetch:template preserves templates file permissions
- 21ccd4997: GitHub Webhook action in Scaffolder Backend has been improved to validate event names against Octokit Webhook event names list.
- Updated dependencies
  - @backstage/catalog-client@0.3.19
  - @backstage/catalog-model@0.9.2
  - @backstage/errors@0.1.2
  - @backstage/config@0.1.9
  - @backstage/backend-common@0.9.2

## 0.15.3

### Patch Changes

- 3f9dd1759: GitHub create repository webhook action: `github:webhook` for Backstage plugin Scaffolder has been added.
- 774b08a5c: GitHubWebhook Action can be created with a default webhook secret. This allows getting secret from environment variable as an alternative to get it from context.
- 536f4d844: Updated dependencies
- 0b92a1e74: refactor: extract common Octokit related code and use it in actions: `publish:github`, `github:actions:dispatch`, `github:webhook`.
- Updated dependencies
  - @backstage/integration@0.6.3
  - @backstage/catalog-model@0.9.1
  - @backstage/backend-common@0.9.1

## 0.15.2

### Patch Changes

- b438caf63: Add partial templating to `fetch:template` action.

  If an `templateFileExtension` input is given, only files with that extension get their content processed. If `templateFileExtension` is `true`, the `.njk` extension is used. The `templateFileExtension` input is incompatible with both `cookiecutterCompat` and `copyWithoutRender`.

  All other files get copied.

  All output paths are subject to applying templating logic.

- 1ce9b9571: Use more efficient approach to staging files in git during scaffolder actions
- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/integration@0.6.2
  - @backstage/config@0.1.8
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.2

## 0.15.1

### Patch Changes

- d622cfad1: GitHub branch protection option 'Require review from Code Owners' can be enabled by adding `requireCodeOwnersReview: true` in context input.

## 0.15.0

### Minor Changes

- e30646aeb: Add Bitbucket workspace and project fields to RepoUrlPicker to support Bitbucket cloud and server

### Patch Changes

- 8bedb75ae: Update Luxon dependency to 2.x
- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/backend-common@0.8.9
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.1

## 0.14.2

### Patch Changes

- 6cf48c609: Add the `scaffolder.defaultCommitMessage`, which defaults to `Initial commit`, so it can be customized.
- 48ea3d25b: The recommended value for a `backstage.io/techdocs-ref` annotation is now
  `dir:.`, indicating "documentation source files are located in the same
  directory relative to the catalog entity." Note that `url:<location>` values
  are still supported.
- Updated dependencies
  - @backstage/backend-common@0.8.8
  - @backstage/config@0.1.6
  - @backstage/integration@0.5.9

## 0.14.1

### Patch Changes

- c73f53bc2: Add new built-in action ci:github-actions-dispatch
- 7cea90592: - Move out the `cookiecutter` templating to its own module that is depended on by the `scaffolder-backend` plugin. No breaking change yet, but we will drop first class support for `cookiecutter` in the future and it will become an opt-in feature.
- eb740ee24: Moved sample software templates to the [backstage/software-templates](https://github.com/backstage/software-templates) repository. If you previously referenced the sample templates straight from `scaffolder-backend` plugin in the main [backstage/backstage](https://github.com/backstage/backstage) repository in your `app-config.yaml`, these references will need to be updated.

  See https://github.com/backstage/software-templates

- Updated dependencies
  - @backstage/catalog-client@0.3.17
  - @backstage/backend-common@0.8.7

## 0.14.0

### Minor Changes

- 96fc27698: Updated inputs for the `publish:github:pull-request` action.

  Now requires a `repoUrl` instead of separate `owner` and `repo` inputs. This aligns with the output of the `RepoUrlPicker` ui field used by the pull-request sample template.

### Patch Changes

- e75506fe7: Unsubscribe from broker after response is flushed
- ea1d956ef: Updating fs-extra to 10.0.0 to handle broken symbolic links correctly
- 31de5f27f: Add new `fetch:template` action which handles the same responsibilities as `fetch:cookiecutter` without the external dependency on `cookiecutter`. For information on migrating from `fetch:cookiecutter` to `fetch:template`, see the [migration guide](https://backstage.io/docs/features/software-templates/builtin-actions#migrating-from-fetch-cookiecutter-to-fetch-template) in the docs.
- 84d329e2a: Scaffolder: Added an 'eq' handlebars helper for use in software template YAML files. This can be used to execute a step depending on the value of an input, e.g.:

  ```yaml
  steps:
    id: 'conditional-step'
    action: 'custom-action'
    if: '{{ eq parameters.myvalue "custom" }}',
  ```

- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6

## 0.13.0

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

- 7cad18e2f: Adding `config: Config` as a required argument to `createBuiltinActions` and downstream methods in order to support configuration of the default git author used for Scaffolder commits.

  The affected methods are:

  - `createBuiltinActions`
  - `createPublishGithubAction`
  - `createPublishGitlabAction`
  - `createPublishBitbucketAction`
  - `createPublishAzureAction`

  Call sites to these methods will need to be migrated to include the new `config` argument. See `createRouter` in `plugins/scaffolder-backend/src/service/router.ts` for an example of adding this new argument.

  To configure the default git author, use the `defaultAuthor` key under `scaffolder` in `app-config.yaml`:

  ```yaml
  scaffolder:
    defaultAuthor:
      name: Example
      email: example@example.com
  ```

### Patch Changes

- dad481793: add default branch property for publish GitLab, Bitbucket and Azure actions
- 62c2f10f7: Added filesystem remove/rename built-in actions
- 6841e0113: fix minor version of git-url-parse as 11.5.x introduced a bug for Bitbucket Server
- 11e66e804: bump azure-devops-node to 10.2.2
- 7a3ad92b5: Export the `fetchContents` from scaffolder-backend
- c2db794f5: add defaultBranch property for publish GitHub action
- 253136fba: removing mandatory of protection for the default branch, that could be handled by the GitHub automation in async manner, thus throwing floating errors
- Updated dependencies
  - @backstage/integration@0.5.8
  - @backstage/catalog-model@0.9.0
  - @backstage/backend-common@0.8.5
  - @backstage/catalog-client@0.3.16

## 0.12.4

### Patch Changes

- 1627daac2: Fix `catalog:write` on windows systems
- ab5cc376f: Use new utilities from `@backstage/backend-common` for safely resolving child paths
- Updated dependencies
  - @backstage/backend-common@0.8.4
  - @backstage/integration@0.5.7
  - @backstage/catalog-client@0.3.15

## 0.12.3

### Patch Changes

- a7f5fe7d7: created an action to write a catalog-info file
- 71416fb64: Moved installation instructions from the main [backstage.io](https://backstage.io) documentation to the package README file. These instructions are not generally needed, since the plugin comes installed by default with `npx @backstage/create-app`.
- c18a3c2ae: Correctly recognize whether the cookiecutter command exists
- Updated dependencies
  - @backstage/catalog-client@0.3.14
  - @backstage/catalog-model@0.8.4

## 0.12.2

### Patch Changes

- b49222176: Keep the empty string as empty string in `input` rather than replacing with `undefined` to make empty values ok for `cookiecutter`

## 0.12.1

### Patch Changes

- 55a834f3c: Use the correct parameter to create a public repository in Bitbucket Server for the v2 templates
- 745351190: Describe `publish:github` scaffolder action fields

  This change adds a description to the fields with examples of what to input. The
  `collaborators` description is also expanded a bit to make it more clear that
  these are additional compared to access and owner.

- 090dfe65d: Adds support to enable LFS for hosted Bitbucket
- 878c1851d: Add a `topics` input to `publish:github` action that can be used to set topics on the repository upon creation.
- 4ca322826: Migrate from the `command-exists-promise` dependency to `command-exists`.
- df3ac03cf: Use the correct parameter to create a public repository in Bitbucket Server.
- Updated dependencies
  - @backstage/backend-common@0.8.3
  - @backstage/catalog-model@0.8.3

## 0.12.0

### Minor Changes

- 66c6bfebd: Scaffolding a repository in Bitbucket will now use the apiBaseUrl if it is provided instead of only the host parameter

### Patch Changes

- 27a9b503a: Introduce conditional steps in scaffolder templates.

  A step can now include an `if` property that only executes a step if the
  condition is truthy. The condition can include handlebar templates.

  ```yaml
  - id: register
      if: '{{ not parameters.dryRun }}'
      name: Register
      action: catalog:register
      input:
      repoContentsUrl: '{{ steps.publish.output.repoContentsUrl }}'
      catalogInfoPath: '/catalog-info.yaml'
  ```

  Also introduces a `not` helper in handlebar templates that allows to negate
  boolean expressions.

- 55a253de2: Migrating old `backstage.io/v1alpha1` templates to `backstage.io/v1beta2`

  Deprecating the `create-react-app` Template. We're planning on removing the `create-react-app` templater, as it's been a little tricky to support and takes 15mins to run in a container. We've currently cached a copy of the output for `create-react-app` and ship that under our sample templates folder. If you want to continue using it, we suggest copying the template out of there and putting it in your own repository as it will be removed in upcoming releases.

  We also recommend removing this entry from your `app-config.yaml` if it exists:

  ```diff
  -    - type: url
  -      target: https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/sample-templates/create-react-app/template.yaml
  -      rules:
  -        - allow: [Template]
  ```

- f26e6008f: Add `debug:log` action for debugging.
- 4f8cf50fe: Update gitbeaker past the broken version without a dist folder
- Updated dependencies [92963779b]
- Updated dependencies [27a9b503a]
- Updated dependencies [70bc30c5b]
- Updated dependencies [eda9dbd5f]
  - @backstage/backend-common@0.8.2
  - @backstage/catalog-model@0.8.2
  - @backstage/catalog-client@0.3.13
  - @backstage/integration@0.5.6

## 0.11.5

### Patch Changes

- 6fe1567a7: This adds a configuration option to the scaffolder plugin router, so we can allow for multiple `TaskWorkers`. Currently with only one `TaskWorker` you are limited to scaffolding one thing at a time. Set the `taskWorkers?: number` option in your scaffolder router to get more than 1 `TaskWorker`
- Updated dependencies [ebe802bc4]
- Updated dependencies [49d7ec169]
  - @backstage/catalog-model@0.8.1
  - @backstage/integration@0.5.5

## 0.11.4

### Patch Changes

- 260aaa684: Bump `@gitbeaker` dependencies to `29.x`.
- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/integration@0.5.4
  - @backstage/catalog-client@0.3.12
  - @backstage/catalog-model@0.8.0

## 0.11.3

### Patch Changes

- 021eb366a: Instead of failing, warn when you need to pay for GitHub Pro.

## 0.11.2

### Patch Changes

- f7f7783a3: Add Owner field in template card and new data distribution
  Add spec.owner as optional field into TemplateV1Alpha and TemplateV1Beta Schema
  Add relations ownedBy and ownerOf into Template entity
  Template documentation updated
- 65e6c4541: Remove circular dependencies
- 81d7b9c6f: Added deprecation warnings for `v1alpha1` templates
- 9962faa2b: Add branch protection for default branches of scaffolded GitHub repositories
- Updated dependencies [f7f7783a3]
- Updated dependencies [c7dad9218]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5001de908]
  - @backstage/catalog-model@0.7.10
  - @backstage/backend-common@0.8.1
  - @backstage/integration@0.5.3

## 0.11.1

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 82ca1ac22: The apiBaseUrl setting for Bitbucket Server integrations will now be used when it is set. Otherwise, it will default back to the host setting.
- fd39d4662: Move `jest-when` to the dev dependencies
- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9

## 0.11.0

### Minor Changes

- e0bfd3d44: Migrate the plugin to use the `ContainerRunner` interface instead of `runDockerContainer(…)`.
  It also provides the `ContainerRunner` to the individual templaters instead of to the `createRouter` function.

  To apply this change to an existing backend application, add the following to `src/plugins/scaffolder.ts`:

  ```diff
  - import { SingleHostDiscovery } from '@backstage/backend-common';
  + import {
  +   DockerContainerRunner,
  +   SingleHostDiscovery,
  + } from '@backstage/backend-common';

    export default async function createPlugin({
      logger,
      config,
      database,
      reader,
    }: PluginEnvironment): Promise<Router> {
  +   const dockerClient = new Docker();
  +   const containerRunner = new DockerContainerRunner({ dockerClient });

  +   const cookiecutterTemplater = new CookieCutter({ containerRunner });
  -   const cookiecutterTemplater = new CookieCutter();
  +   const craTemplater = new CreateReactAppTemplater({ containerRunner });
  -   const craTemplater = new CreateReactAppTemplater();
      const templaters = new Templaters();

      templaters.register('cookiecutter', cookiecutterTemplater);
      templaters.register('cra', craTemplater);

      const preparers = await Preparers.fromConfig(config, { logger });
      const publishers = await Publishers.fromConfig(config, { logger });

  -   const dockerClient = new Docker();

      const discovery = SingleHostDiscovery.fromConfig(config);
      const catalogClient = new CatalogClient({ discoveryApi: discovery });

      return await createRouter({
        preparers,
        templaters,
        publishers,
        logger,
        config,
  -     dockerClient,
        database,
        catalogClient,
        reader,
      });
    }
  ```

### Patch Changes

- 38ca05168: The default `@octokit/rest` dependency was bumped to `"^18.5.3"`.
- 69eefb5ae: Fix GithubPR built-in action `credentialsProvider.getCredentials` URL.
  Adding Documentation for GitHub PR built-in action.
- 75c8cec39: bump `jsonschema` from 1.2.7 to 1.4.0
- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
- Updated dependencies [d1b1306d9]
  - @backstage/backend-common@0.7.0
  - @backstage/integration@0.5.2
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5
  - @backstage/catalog-client@0.3.11

## 0.10.1

### Patch Changes

- a1783f306: Added the `nebula-preview` preview to `Octokit` for repository visibility.

## 0.10.0

### Minor Changes

- 49574a8a3: Fix some `spleling`.

  The `scaffolder-backend` has a configuration schema change that may be breaking
  in rare circumstances. Due to a typo in the schema, the
  `scaffolder.github.visibility`, `scaffolder.gitlab.visibility`, and
  `scaffolder.bitbucket.visibility` did not get proper validation that the value
  is one of the supported strings (`public`, `internal` (not available for
  Bitbucket), and `private`). If you had a value that was not one of these three,
  you may have to adjust your config.

### Patch Changes

- 84c54474d: Forward user token to scaffolder task for subsequent api requests
- Updated dependencies [d367f63b5]
- Updated dependencies [b42531cfe]
  - @backstage/backend-common@0.6.3

## 0.9.6

### Patch Changes

- d8ffec739: Add built-in publish action for creating GitHub pull requests.
- 7abec4dbc: Fix for the `file://` protocol check in the `FilePreparer` being too strict, breaking Windows.
- d840d30bc: Bitbucket server needs username to be set as well as the token or appPassword for the publishing process to work.

  ```yaml
  integrations:
    bitbucket:
      - host: bitbucket.mycompany.com
        apiBaseUrl: https://bitbucket.mycompany.com/rest/api/1.0
        token: token
        username: username
  ```

- b25846562: Enable the JSON parsing of the response from templated variables in the `v2beta1` syntax. Previously if template parameters json strings they were left as strings, they are now parsed as JSON objects.

  Before:

  ```yaml
  - id: test
    name: test-action
    action: custom:run
    input:
      input: '{"hello":"ben"}'
  ```

  Now:

  ```yaml
  - id: test
    name: test-action
    action: custom:run
    input:
      input:
        hello: ben
  ```

  Also added the `parseRepoUrl` and `json` helpers to the parameters syntax. You can now use these helpers to parse work with some `json` or `repoUrl` strings in templates.

  ```yaml
  - id: test
    name: test-action
    action: cookiecutter:fetch
    input:
      destination: '{{ parseRepoUrl parameters.repoUrl }}'
  ```

  Will produce a parsed version of the `repoUrl` of type `{ repo: string, owner: string, host: string }` that you can use in your actions. Specifically `cookiecutter` with `{{ cookiecutter.destination.owner }}` like the `plugins/scaffolder-backend/sample-templates/v1beta2-demo/template.yaml` example.

- a376e3ee8: Adds a collaborator field to GitHub publish action for multiple users and access levels
- 423a514c3: Fix execution of the GitHub Pull Request publish action on Windows.
- 0b7fd7a9d: Fix bug in pull request sample template.
- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
- Updated dependencies [442f34b87]
  - @backstage/catalog-model@0.7.7
  - @backstage/catalog-client@0.3.10

## 0.9.5

### Patch Changes

- 802b41b65: Allow custom directory to be specified for GitHub publish action
- Updated dependencies [97b60de98]
- Updated dependencies [98dd5da71]
- Updated dependencies [b779b5fee]
  - @backstage/catalog-model@0.7.6
  - @backstage/backend-common@0.6.2

## 0.9.4

### Patch Changes

- 2ab6f3ff0: Add OwnerPicker component to scaffolder for specifying a component's owner from users and groups in the catalog.
- 164cc4c53: Fix a bug with GitHub Apps support not parsing the URL correctly
- Updated dependencies [676ede643]
- Updated dependencies [b196a4569]
- Updated dependencies [8488a1a96]
- Updated dependencies [37e3a69f5]
  - @backstage/catalog-client@0.3.9
  - @backstage/catalog-model@0.7.5
  - @backstage/backend-common@0.6.1

## 0.9.3

### Patch Changes

- 9f2e51e89: Fixes bug in the `github:publish` action causing repositories to be set as private even if the visibility is set to internal
- 91e87c055: Add inputs for action `fetch:cookiecutter`: copyWithoutRender, extensions, imageName
- 113d3d59e: Added a `publish:file` action to use for local development. The action is not installed by default.

## 0.9.2

### Patch Changes

- 8b4f7e42a: Forward authorization on scaffolder backend requests
- 8686eb38c: Use errors from `@backstage/errors`
- Updated dependencies [8686eb38c]
- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/catalog-client@0.3.8
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.9.1

### Patch Changes

- d7245b733: Remove runDockerContainer, and start using the utility function provided by @backstage/backend-common
- 0b42fff22: Make use of parseLocationReference/stringifyLocationReference
- c532c1682: Fixes task failures caused by undefined step input
- 761698831: Bump to the latest version of the Knex library.
- f98f212e4: Introduce scaffolder actions page which lists all available actions along with documentation about their input/output.

  Allow for actions to be extended with a description.

  The list actions page is by default available at `/create/actions`.

- 2e57922de: Update GitHub publisher to display a more helpful error message when repository access update fails.
- Updated dependencies [277644e09]
- Updated dependencies [52f613030]
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [905cbfc96]
- Updated dependencies [761698831]
- Updated dependencies [d4e77ec5f]
  - @backstage/integration@0.5.1
  - @backstage/backend-common@0.5.6
  - @backstage/catalog-model@0.7.4
  - @backstage/catalog-client@0.3.7

## 0.9.0

### Minor Changes

- 8106c9528: The scaffolder has been updated to support the new `v1beta2` template schema which allows for custom template actions!

  See documentation for more information how to create and register new template actions.

  **Breaking changes**

  The backend scaffolder plugin now needs a `UrlReader` which can be pulled from the PluginEnvironment.

  The following change is required in `backend/src/plugins/scaffolder.ts`

  ```diff
   export default async function createPlugin({
     logger,
     config,
     database,
  +  reader,
   }: PluginEnvironment): Promise<Router> {

    // omitted code

    return await createRouter({
      preparers,
      templaters,
      publishers,
      logger,
      config,
      dockerClient,
      database,
      catalogClient,
  +   reader,
    });
  ```

- 96ccc8f69: Removed support for deprecated publisher auth configuration within the `scaffolder` configuration block, such as `scaffolder.github.token`. Access should instead be configured through `integrations` configuration.

  For example, replace the following configuration in `app-config.yaml`

  ```yaml
  scaffolder:
    github:
      token: my-token
  ```

  with

  ```yaml
  integrations:
    github:
      - host: github.com
        token: my-token
  ```

### Patch Changes

- 12d8f27a6: Move logic for constructing the template form to the backend, using a new `./parameter-schema` endpoint that returns the form schema for a given template.
- 12d8f27a6: Add version `backstage.io/v1beta2` schema for Template entities.
- f31b76b44: Consider both authentication methods for both `onprem` and `cloud` BitBucket
- f43192207: remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
- d0ed25196: Fixed file path resolution for templates with a file location
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5

## 0.8.0

### Minor Changes

- a5f42cf66: # Stateless scaffolding

  The scaffolder has been redesigned to be horizontally scalable and to persistently store task state and execution logs in the database.

  Each scaffolder task is given a unique task ID which is persisted in the database.
  Tasks are then picked up by a `TaskWorker` which performs the scaffolding steps.
  Execution logs are also persisted in the database meaning you can now refresh the scaffolder task status page without losing information.

  The task status page is now dynamically created based on the step information stored in the database.
  This allows for custom steps to be displayed once the next version of the scaffolder template schema is available.

  The task page is updated to display links to both the git repository and to the newly created catalog entity.

  Component registration has moved from the frontend into a separate registration step executed by the `TaskWorker`. This requires that a `CatalogClient` is passed to the scaffolder backend instead of the old `CatalogEntityClient`.

  Make sure to update `plugins/scaffolder.ts`

  ```diff
   import {
     CookieCutter,
     createRouter,
     Preparers,
     Publishers,
     CreateReactAppTemplater,
     Templaters,
  -  CatalogEntityClient,
   } from '@backstage/plugin-scaffolder-backend';

  +import { CatalogClient } from '@backstage/catalog-client';

   const discovery = SingleHostDiscovery.fromConfig(config);
  -const entityClient = new CatalogEntityClient({ discovery });
  +const catalogClient = new CatalogClient({ discoveryApi: discovery })

   return await createRouter({
     preparers,
     templaters,
     publishers,
     logger,
     config,
     dockerClient,
  -  entityClient,
     database,
  +  catalogClient,
   });
  ```

  As well as adding the `@backstage/catalog-client` packages as a dependency of your backend package.

### Patch Changes

- Updated dependencies [bad21a085]
- Updated dependencies [a1f5e6545]
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.7.1

### Patch Changes

- edbc27bfd: Added githubApp authentication to the scaffolder-backend plugin
- fb28da212: Switched to using `'x-access-token'` for authenticating Git over HTTPS towards GitHub.
- 0ada34a0f: Minor typo in migration
- 29c8bcc53: Fixed the `prepare` step for when using local templates that were added to the catalog using the `file:` target configuration.
  No more `EPERM: operation not permitted` error messages.
- a341a8716: Fix parsing of the path to default to empty string not undefined if git-url-parse throws something we don't expect. Fixes the error `The "path" argument must be of type string.` when preparing.
- Updated dependencies [16fb1d03a]
- Updated dependencies [491f3a0ec]
- Updated dependencies [491f3a0ec]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
  - @backstage/backend-common@0.5.4
  - @backstage/integration@0.5.0

## 0.7.0

### Minor Changes

- 615103a63: Introduced `v2` Scaffolder REST API, which uses an implementation that is database backed, making the scaffolder instances stateless. The `createRouter` function now requires a `PluginDatabaseManager` instance to be passed in, commonly available as `database` in the plugin environment in the backend.

  This API should be considered unstable until used by the scaffolder frontend.

### Patch Changes

- 6ed2b47d6: Include Backstage identity token in requests to backend plugins.
- ffffea8e6: Minor updates to reflect the changes in `@backstage/integration` that made the fields `apiBaseUrl` and `apiUrl` mandatory.
- Updated dependencies [6ed2b47d6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [72b96e880]
- Updated dependencies [5a5163519]
  - @backstage/catalog-client@0.3.6
  - @backstage/backend-common@0.5.3
  - @backstage/integration@0.4.0

## 0.6.0

### Minor Changes

- cdea0baf1: The scaffolder is updated to generate a unique workspace directory inside the temp folder. This directory is cleaned up by the job processor after each run.

  The prepare/template/publish steps have been refactored to operate on known directories, `template/` and `result/`, inside the temporary workspace path.

  Updated preparers to accept the template url instead of the entire template. This is done primarily to allow for backwards compatibility between v1 and v2 scaffolder templates.

  Fixes broken GitHub actions templating in the Create React App template.

  #### For those with **custom** preparers, templates, or publishers

  The preparer interface has changed, the prepare method now only takes a single argument, and doesn't return anything. As part of this change the preparers were refactored to accept a URL pointing to the target directory, rather than computing that from the template entity.

  The `workingDirectory` option was also removed, and replaced with a `workspacePath` option. The difference between the two is that `workingDirectory` was a place for the preparer to create temporary directories, while the `workspacePath` is the specific folder were the entire templating process for a single template job takes place. Instead of returning a path to the folder were the prepared contents were placed, the contents are put at the `<workspacePath>/template` path.

  ```diff
  type PreparerOptions = {
  -  workingDirectory?: string;
  +  /**
  +   * Full URL to the directory containg template data
  +   */
  +  url: string;
  +  /**
  +   * The workspace path that will eventually be the root of the new repo
  +   */
  +  workspacePath: string;
    logger: Logger;
  };

  -prepare(template: TemplateEntityV1alpha1, opts?: PreparerOptions): Promise<string>
  +prepare(opts: PreparerOptions): Promise<void>;
  ```

  Instead of returning a path to the folder were the templaters contents were placed, the contents are put at the `<workspacePath>/result` path. All templaters now also expect the source template to be present in the `template` directory within the `workspacePath`.

  ```diff
  export type TemplaterRunOptions = {
  -  directory: string;
  +  workspacePath: string;
    values: TemplaterValues;
    logStream?: Writable;
    dockerClient: Docker;
  };

  -public async run(options: TemplaterRunOptions): Promise<TemplaterRunResult>
  +public async run(options: TemplaterRunOptions): Promise<void>
  ```

  Just like the preparer and templaters, the publishers have also switched to using `workspacePath`. The root of the new repo is expected to be located at `<workspacePath>/result`.

  ```diff
  export type PublisherOptions = {
    values: TemplaterValues;
  -  directory: string;
  +  workspacePath: string;
    logger: Logger;
  };
  ```

### Patch Changes

- a26668913: Attempt to fix windows test errors in master
- 529d16d27: # Repo visibility for GitLab and BitBucket repos

  **NOTE: This changes default repo visibility from `private` to `public` for GitLab and BitBucket** which
  is consistent with the GitHub default. If you were counting on `private` visibility, you'll need to update
  your scaffolder config to use `private`.

  This adds repo visibility feature parity with GitHub for GitLab and BitBucket.

  To configure the repo visibility, set scaffolder._type_.visibility as in this example:

  ```yaml
  scaffolder:
    github:
      visibility: private # 'public' or 'internal' or 'private' (default is 'public')
    gitlab:
      visibility: public # 'public' or 'internal' or 'private' (default is 'public')
    bitbucket:
      visibility: public # 'public' or 'private' (default is 'public')
  ```

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

## 0.5.2

### Patch Changes

- 26a3a6cf0: Honor the branch ref in the url when cloning.

  This fixes a bug in the scaffolder prepare stage where a non-default branch
  was specified in the scaffolder URL but the default branch was cloned.
  For example, even though the `other` branch is specified in this example, the
  `master` branch was actually cloned:

  ```yaml
  catalog:
    locations:
      - type: url
        target: https://github.com/backstage/backstage/blob/other/plugins/scaffolder-backend/sample-templates/docs-template/template.yaml
  ```

  This also fixes a 404 in the prepare stage for GitLab URLs.

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [6800da78d]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1
  - @backstage/integration@0.3.1

## 0.5.1

### Patch Changes

- 0ea002378: Fixing issues with templating and full URL's as `storePath`'s

## 0.5.0

### Minor Changes

- ed6baab66: - Deprecating the `scaffolder.${provider}.token` auth duplication and favoring `integrations.${provider}` instead. If you receive deprecation warnings your config should change like the following:

  ```yaml
  scaffolder:
    github:
      token:
        $env: GITHUB_TOKEN
      visibility: public
  ```

  To something that looks like this:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
  scaffolder:
    github:
      visibility: public
  ```

  You can also configure multiple different hosts under the `integration` config like the following:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
      - host: ghe.mycompany.com
        token:
          $env: GITHUB_ENTERPRISE_TOKEN
  ```

  This of course is the case for all the providers respectively.

  - Adding support for cross provider scaffolding, you can now create repositories in for example Bitbucket using a template residing in GitHub.

  - Fix GitLab scaffolding so that it returns a `catalogInfoUrl` which automatically imports the project into the catalog.

  - The `Store Path` field on the `scaffolder` frontend has now changed so that you require the full URL to the desired destination repository.

  `backstage/new-repository` would become `https://github.com/backstage/new-repository` if provider was GitHub for example.

### Patch Changes

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

## 0.4.1

### Patch Changes

- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- cc068c0d6: Bump the gitbeaker dependencies to 28.x.

  To update your own installation, go through the `package.json` files of all of
  your packages, and ensure that all dependencies on `@gitbeaker/node` or
  `@gitbeaker/core` are at version `^28.0.2`. Then run `yarn install` at the root
  of your repo.

- 711ba55a2: Export all preparers and publishers properly
- Updated dependencies [466354aaa]
- Updated dependencies [f3b064e1c]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/integration@0.2.0
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.4.0

### Minor Changes

- 5eb8c9b9e: Fix GitLab scaffolder publisher

### Patch Changes

- 7e3451700: bug(scaffolder): Ignore the .git folder when adding dot-files to the index

## 0.3.7

### Patch Changes

- 37a5244ef: Add scaffolding support for Bitbucket Cloud and Server.
- 00042e73c: Moving the Git actions to isomorphic-git instead of the node binding version of nodegit
- 9efbc5585: Add config schema for Bitbucket scaffolder
- Updated dependencies [5ecd50f8a]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/backend-common@0.4.2
  - @backstage/integration@0.1.5

## 0.3.6

### Patch Changes

- 19554f6d6: Added GitHub Actions for Create React App, and allow better imports of files inside a module when they're exposed using `files` in `package.json`
- 33a82a713: GitLab preparer uses the right token (primarily the same one as the publisher, falling back to the integrations token)
- aed8f7f12: Clearer error message when preparer or publisher type can't be determined.

## 0.3.5

### Patch Changes

- 94c65a9d4: Added configuration schema for the commonly used properties
- Updated dependencies [c911061b7]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/backend-common@0.4.1

## 0.3.4

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

## 0.3.3

### Patch Changes

- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0

## 0.3.2

### Patch Changes

- ef2831dde: Move constructing the catalog-info.yaml URL for scaffolded components to the publishers
- 5a1d8dca3: Fix React entity YAML filename to new standard
- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1

## 0.3.1

### Patch Changes

- d33f5157c: Extracted pushToRemote function for reuse between publishers
- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.3.0

### Minor Changes

- 59166e5ec: `createRouter` of scaffolder backend will now require additional option as `entityClient` which could be generated by `CatalogEntityClient` in `plugin-scaffolder-backend` package. Here is example to generate `entityClient`.

  ```js
  import { CatalogEntityClient } from '@backstage/plugin-scaffolder-backend';
  import { SingleHostDiscovery } from '@backstage/backend-common';

  const discovery = SingleHostDiscovery.fromConfig(config);
  const entityClient = new CatalogEntityClient({ discovery });
  ```

  - Scaffolder's API `/v1/jobs` will accept `templateName` instead of `template` Entity.

### Patch Changes

- Updated dependencies [33b7300eb]
  - @backstage/backend-common@0.2.1

## 0.2.0

### Minor Changes

- 3e254503d: Add Azure DevOps support to the scaffolder backend

  This adds support for Azure DevOps to the scaffolder (preparer & publisher). I thought I should get this in there now since #2426 has been merged. I had a previous PR with only the preparer but I closed that in favor of this one.

  I stayed with the 'azure/api' structure but I guess we should try and go the same way as with GitHub here #2501

### Patch Changes

- 0c370c979: Update SSR template to pass CI
- 991a950e0: Added .fromConfig static factories for Preparers and Publishers + read integrations config to support url location types
- c926765a2: Allow templates to be located on non-default branch
- 6840a68df: Add authentication token to Scaffolder GitHub Preparer
- 1c8c43756: The new `scaffolder.github.baseUrl` config property allows to specify a custom base url for GitHub Enterprise instances
- 5e4551e3a: Added support for configuring the working directory of the Scaffolder:

  ```yaml
  backend:
    workingDirectory: /some-dir # Use this to configure a working directory for the scaffolder, defaults to the OS temp-dir
  ```

- e3d063ffa: Introduce PreparerOptions for PreparerBase
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
