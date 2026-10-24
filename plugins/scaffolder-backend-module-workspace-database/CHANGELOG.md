# @backstage/plugin-scaffolder-backend-module-workspace-database

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.9-next.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/plugin-scaffolder-node@0.13.8

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-scaffolder-node@0.13.8-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## 0.1.0

### Minor Changes

- e95b649: Added task recovery feature with new `scaffolder.taskRecovery` config section. When enabled, tasks that crash or timeout are automatically recovered and resume from the last completed step, task secrets are retained until the task reaches a terminal state so recovery can continue, and completed step outputs are persisted. Enabling recovery applies to all scaffolder tasks, so actions used by those tasks should be idempotent or use checkpoints. When recovery is disabled (the default), the previous behavior is unchanged: secrets are cleared as soon as a task is claimed and retries re-run every step. The new config consolidates previous experimental flags (`EXPERIMENTAL_recoverTasks`, `EXPERIMENTAL_workspaceSerialization`, `EXPERIMENTAL_recoverTasksTimeout`) which remain supported as fallbacks. The legacy workspace provider setting continues to select a provider only when `EXPERIMENTAL_workspaceSerialization` is `true`.

  Workspace serialization for task recovery now requires installing a separate workspace provider module, including when you use the legacy configuration. For development, use `@backstage/plugin-scaffolder-backend-module-workspace-database` (50 MB limit, not recommended for production). On first startup, that module migrates existing database workspace snapshots from the legacy task storage. For production, use `@backstage/plugin-scaffolder-backend-module-gcp` or a similar external storage provider. The scaffolder rejects a configured provider that has not been installed and registered.

  Enabling crash recovery does not keep completed task event streams open; normal task completion remains terminal for event-stream clients.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.7
  - @backstage/backend-plugin-api@1.10.1

## 0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.7-next.1
  - @backstage/backend-plugin-api@1.10.1-next.0

## 0.1.0-next.0

### Minor Changes

- e95b649: Added task recovery feature with new `scaffolder.taskRecovery` config section. When enabled, tasks that crash or timeout are automatically recovered and resume from the last completed step, task secrets are retained until the task reaches a terminal state so recovery can continue, and completed step outputs are persisted. Enabling recovery applies to all scaffolder tasks, so actions used by those tasks should be idempotent or use checkpoints. When recovery is disabled (the default), the previous behavior is unchanged: secrets are cleared as soon as a task is claimed and retries re-run every step. The new config consolidates previous experimental flags (`EXPERIMENTAL_recoverTasks`, `EXPERIMENTAL_workspaceSerialization`, `EXPERIMENTAL_recoverTasksTimeout`) which remain supported as fallbacks. The legacy workspace provider setting continues to select a provider only when `EXPERIMENTAL_workspaceSerialization` is `true`.

  Workspace serialization for task recovery now requires installing a separate workspace provider module, including when you use the legacy configuration. For development, use `@backstage/plugin-scaffolder-backend-module-workspace-database` (50 MB limit, not recommended for production). On first startup, that module migrates existing database workspace snapshots from the legacy task storage. For production, use `@backstage/plugin-scaffolder-backend-module-gcp` or a similar external storage provider. The scaffolder rejects a configured provider that has not been installed and registered.

  Enabling crash recovery does not keep completed task event streams open; normal task completion remains terminal for event-stream clients.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.7-next.0
