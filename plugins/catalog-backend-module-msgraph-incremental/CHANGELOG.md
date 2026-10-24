# @backstage/plugin-catalog-backend-module-msgraph-incremental

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.9.1-next.0
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.8-next.0
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/config@1.3.10
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.9.0
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.7
  - @backstage/plugin-catalog-node@2.2.6

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.9.0-next.1
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.7-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.9.0-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.7-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.1
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.6
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.8.0
  - @backstage/config@1.3.9
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.8.0-next.1
  - @backstage/config@1.3.9-next.0
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.6-next.1
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.6-next.0
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.7.16-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.7.15
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.5
  - @backstage/plugin-catalog-node@2.2.4

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.7.15-next.0
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.5-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.4
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.7.14
  - @backstage/plugin-catalog-node@2.2.3

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.7.14-next.0
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.4-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.3
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.7.13
  - @backstage/plugin-catalog-node@2.2.2

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.1-next.0
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.7.13-next.0
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0

## 0.1.0

### Minor Changes

- 2bd0450: **BREAKING**: Disabled user accounts are now filtered out by default. The provider automatically applies an `accountEnabled eq true` filter, combining it with any custom `user.filter` you provide. If you previously included `accountEnabled eq true` in your user filter, it is safe to remove it, but leaving it in will not cause any issues.
- f1279ea: Introduces a cursor-based incremental ingestion provider for Microsoft Graph that processes users and groups one page at a time. Unlike `MicrosoftGraphOrgEntityProvider`, this module never holds the full dataset in memory — each burst processes a single page (up to 999 users or 100 groups). The `@odata.nextLink` cursor is persisted so a pod restart resumes from the last completed page rather than starting over.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.7.12
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.0
  - @backstage/config@1.3.8

## 0.1.0-next.0

### Minor Changes

- f1279ea: Introduces a cursor-based incremental ingestion provider for Microsoft Graph that processes users and groups one page at a time. Unlike `MicrosoftGraphOrgEntityProvider`, this module never holds the full dataset in memory — each burst processes a single page (up to 999 users or 100 groups). The `@odata.nextLink` cursor is persisted so a pod restart resumes from the last completed page rather than starting over.
