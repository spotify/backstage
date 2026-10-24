# @backstage/plugin-catalog-backend-module-azure

## 0.3.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 0.3.23

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/plugin-catalog-common@1.2.1
  - @backstage/plugin-catalog-node@2.2.6
  - @backstage/plugin-events-node@0.4.27

## 0.3.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1
  - @backstage/plugin-events-node@0.4.27-next.1

## 0.3.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## 0.3.22

### Patch Changes

- 8b3c83e: Improved handling of Azure Blob Storage blob names when creating catalog locations.
- Updated dependencies
  - @backstage/integration@2.1.2
  - @backstage/plugin-catalog-common@1.2.0
  - @backstage/config@1.3.9
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5
  - @backstage/plugin-events-node@0.4.26

## 0.3.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.2.0-next.0
  - @backstage/config@1.3.9-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/integration@2.1.2-next.1

## 0.3.22-next.0

### Patch Changes

- 8b3c83e: Improved handling of Azure Blob Storage blob names when creating catalog locations.
- Updated dependencies
  - @backstage/integration@2.1.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0
  - @backstage/plugin-events-node@0.4.26-next.0

## 0.3.20

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/integration@2.1.0
  - @backstage/plugin-catalog-node@2.2.4
  - @backstage/plugin-events-node@0.4.25

## 0.3.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.0-next.0

## 0.3.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0
  - @backstage/plugin-events-node@0.4.25-next.0

## 0.3.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/plugin-catalog-node@2.2.3
  - @backstage/plugin-events-node@0.4.24

## 0.3.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0
  - @backstage/plugin-events-node@0.4.24-next.0

## 0.3.18

### Patch Changes

- a07e6a3: Updated internal usage of `AzureBlobStorageIntegration` (previously misspelled as `AzureBlobStorageIntergation`) following the rename in `@backstage/integration`.
- Updated dependencies
  - @backstage/integration@2.0.3
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-catalog-node@2.2.2
  - @backstage/plugin-events-node@0.4.23

## 0.3.18-next.0

### Patch Changes

- a07e6a3: Updated internal usage of `AzureBlobStorageIntegration` (previously misspelled as `AzureBlobStorageIntergation`) following the rename in `@backstage/integration`.
- Updated dependencies
  - @backstage/integration@2.0.3-next.0
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0
  - @backstage/plugin-events-node@0.4.23-next.0

## 0.3.17

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/integration@2.0.2
  - @backstage/config@1.3.8
  - @backstage/plugin-catalog-common@1.1.10
  - @backstage/plugin-events-node@0.4.22

## 0.3.17-next.1

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.1-next.1

## 0.3.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/integration@2.0.2-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/plugin-events-node@0.4.22-next.0
  - @backstage/plugin-catalog-common@1.1.10-next.0

## 0.3.16

### Patch Changes

- 39d27ee: Add Azure DevOps SCM event translation layer for instant catalog reprocessing.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/integration@2.0.1
  - @backstage/config@1.3.7
  - @backstage/plugin-catalog-common@1.1.9
  - @backstage/plugin-events-node@0.4.21

## 0.3.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/integration@2.0.1-next.0
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/config@1.3.7-next.0
  - @backstage/plugin-events-node@0.4.21-next.2
  - @backstage/plugin-catalog-common@1.1.9-next.0

## 0.3.16-next.1

### Patch Changes

- 39d27ee: Add Azure DevOps SCM event translation layer for instant catalog reprocessing.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1
  - @backstage/plugin-events-node@0.4.21-next.1

## 0.3.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/config@1.3.6
  - @backstage/integration@2.0.0
  - @backstage/plugin-catalog-common@1.1.8

## 0.3.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/integration@2.0.0
  - @backstage/plugin-catalog-node@2.1.0

## 0.3.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/integration@2.0.0-next.2
  - @backstage/plugin-catalog-node@2.1.0-next.2

## 0.3.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.0.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.1
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.8

## 0.3.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.21.0-next.0
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.8

## 0.3.14

### Patch Changes

- cc6206e: Added support for `{org}.visualstudio.com` domains used by Azure DevOps
- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- 6c8a464: Added missing `branch` field to the `azureDevOps` provider config schema.
- Updated dependencies
  - @backstage/integration@1.20.0
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-catalog-common@1.1.8

## 0.3.14-next.2

### Patch Changes

- cc6206e: Added support for `{org}.visualstudio.com` domains used by Azure DevOps
- Updated dependencies
  - @backstage/integration@1.20.0-next.2
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1

## 0.3.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.20.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1

## 0.3.14-next.0

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/integration@1.19.3-next.0
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.8-next.0

## 0.3.13

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/integration@1.19.2

## 0.3.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.19.2-next.0

## 0.3.12

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.19.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1

## 0.3.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.3-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-catalog-node@1.20.1-next.1

## 0.3.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/integration@1.18.3-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.7

## 0.3.11

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.7

## 0.3.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1

## 0.3.11-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/config@1.3.6-next.0
  - @backstage/integration@1.18.2-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/plugin-catalog-common@1.1.7-next.0
  - @backstage/plugin-catalog-node@1.19.2-next.0

## 0.3.10

### Patch Changes

- 84443f1: Adds config definitions for Azure Blob Storage.
- 99fcf98: Removed unused dependencies
- Updated dependencies
  - @backstage/integration@1.18.1
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-common@1.1.6
  - @backstage/plugin-catalog-node@1.19.1

## 0.3.10-next.2

### Patch Changes

- 99fcf98: Removed unused dependencies

## 0.3.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/integration@1.18.1-next.1
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-catalog-common@1.1.6-next.0

## 0.3.10-next.0

### Patch Changes

- 84443f1: Adds config definitions for Azure Blob Storage.
- Updated dependencies
  - @backstage/integration@1.18.1-next.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/config@1.3.3
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.19.0

## 0.3.9

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/integration@1.18.0
  - @backstage/backend-plugin-api@1.4.3

## 0.3.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0-next.1
  - @backstage/integration@1.18.0-next.0

## 0.3.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.0-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0

## 0.3.8

### Patch Changes

- b3aa80e: `host` should be optional in `config` schema
- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## 0.3.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/config@1.3.3
  - @backstage/integration@1.17.1
  - @backstage/plugin-catalog-common@1.1.5

## 0.3.8-next.0

### Patch Changes

- b3aa80e: `host` should be optional in `config` schema

## 0.3.7

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/integration@1.17.1
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.17.2

## 0.3.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/integration@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-catalog-common@1.1.5-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0

## 0.3.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.1-next.0
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4

## 0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/config@1.3.2
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4

## 0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/config@1.3.2
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4

## 0.3.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0

## 0.3.5

### Patch Changes

- be82d83: visualstudio.com domains are now supported along with dev.azure.com
- Updated dependencies
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4

## 0.3.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0-next.3
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.2

## 0.3.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0-next.2
  - @backstage/config@1.3.2
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.1

## 0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0

## 0.3.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3

## 0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/integration@1.16.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3

## 0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.3-next.0
  - @backstage/plugin-catalog-common@1.1.3

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.3-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1

## 0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.2
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1

## 0.3.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.2-next.0
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1

## 0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.16.1-next.0

## 0.3.2

### Patch Changes

- eb80a1a: Minor doc string update
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-catalog-node@1.16.0
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.3.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.3.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.0-next.2

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/config@1.3.2
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.3.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.15.1

## 0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/config@1.3.2-next.0
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/plugin-catalog-common@1.1.3-next.0
  - @backstage/integration@1.16.1-next.0

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/config@1.3.1
  - @backstage/integration@1.16.0
  - @backstage/plugin-catalog-common@1.1.2
  - @backstage/plugin-catalog-node@1.15.1-next.0

## 0.3.0

### Minor Changes

- 277092a: Added the Azure Blob Storage as catalog entity provider to import all the desired entities from storage account provided in app-config.yaml

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/integration@1.16.0
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/config@1.3.1
  - @backstage/plugin-catalog-common@1.1.2

## 0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/config@1.3.1-next.0
  - @backstage/integration@1.16.0-next.1
  - @backstage/plugin-catalog-common@1.1.2-next.0

## 0.3.0-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/config@1.3.0
  - @backstage/integration@1.16.0-next.0
  - @backstage/plugin-catalog-common@1.1.1

## 0.3.0-next.0

### Minor Changes

- 277092a: Added the Azure Blob Storage as catalog entity provider to import all the desired entities from storage account provided in app-config.yaml

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/config@1.3.0
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-catalog-node@1.14.1-next.0

## 0.2.4

### Patch Changes

- 4e58bc7: Upgrade to uuid v11 internally
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/integration@1.15.2
  - @backstage/plugin-catalog-common@1.1.1

## 0.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.14.0-next.1

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-common@1.1.0

## 0.2.3

### Patch Changes

- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/integration@1.15.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.1-next.0

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.15.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.1-next.0

## 0.2.2

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/integration@1.15.0
  - @backstage/config@1.2.0

## 0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/integration@1.15.0-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.2

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/integration@1.14.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.1

## 0.2.2-next.0

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-catalog-node@1.12.7-next.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.14.0
  - @backstage/plugin-catalog-common@1.0.26

## 0.2.0

### Minor Changes

- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.

### Patch Changes

- 9342ac8: Removed unused dependency
- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-catalog-node@1.12.5
  - @backstage/integration@1.14.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.26

## 0.1.43-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/config@1.2.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-common@1.0.26-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.3

## 0.1.43-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.2
  - @backstage/plugin-catalog-common@1.0.26-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/config@1.2.0

## 0.1.43-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-common@1.0.26-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/config@1.2.0

## 0.1.43-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.25

## 0.1.42

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/integration@1.13.0
  - @backstage/plugin-catalog-node@1.12.4
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/config@1.2.0

## 0.1.42-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/config@1.2.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/plugin-catalog-node@1.12.4-next.1

## 0.1.41-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-catalog-node@1.12.3-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.24

## 0.1.39

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/integration@1.12.0
  - @backstage/plugin-catalog-node@1.12.1
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/config@1.2.0

## 0.1.39-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-catalog-common@1.0.24-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.2
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config@1.2.0

## 0.1.39-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-catalog-node@1.12.1-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.23

## 0.1.39-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.0

## 0.1.39-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.11.0
  - @backstage/plugin-catalog-common@1.0.23

## 0.1.38

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/integration@1.11.0
  - @backstage/plugin-catalog-common@1.0.23

## 0.1.38-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0-next.2
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/integration@1.11.0-next.0

## 0.1.38-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-catalog-node@1.11.2-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.38-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-catalog-common@1.0.23-next.0
  - @backstage/plugin-catalog-node@1.11.2-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.10.0

## 0.1.37

### Patch Changes

- d5a1fe1: Replaced winston logger with `LoggerService`
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/backend-tasks@0.5.22
  - @backstage/integration@1.10.0
  - @backstage/plugin-catalog-node@1.11.1
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.22

## 0.1.37-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/config@1.2.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-catalog-node@1.11.1-next.1

## 0.1.37-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-catalog-node@1.11.1-next.0

## 0.1.36

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.11.0
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/backend-tasks@0.5.21
  - @backstage/config@1.2.0
  - @backstage/integration@1.9.1
  - @backstage/plugin-catalog-common@1.0.22

## 0.1.35

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.10.0
  - @backstage/backend-common@0.21.5
  - @backstage/backend-tasks@0.5.20
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/integration@1.9.1
  - @backstage/plugin-catalog-common@1.0.22

## 0.1.34

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.9.0

## 0.1.33

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-catalog-node@1.8.0
  - @backstage/backend-tasks@0.5.19
  - @backstage/plugin-catalog-common@1.0.22

## 0.1.33-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.9.1-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-catalog-node@1.8.0-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-catalog-common@1.0.22-next.1

## 0.1.33-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## 0.1.32-next.0

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.0

## 0.1.29

### Patch Changes

- 534786a: Fixed issue where specifying a branch for discovery did not work
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/backend-tasks@0.5.15
  - @backstage/integration@1.9.0
  - @backstage/plugin-catalog-node@1.7.0
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.21

## 0.1.29-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-catalog-node@1.6.2-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0

## 0.1.29-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/config@1.1.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/plugin-catalog-common@1.0.21-next.0

## 0.1.29-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.1

## 0.1.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-catalog-common@1.0.20

## 0.1.28

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/backend-tasks@0.5.14
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-catalog-common@1.0.20

## 0.1.28-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-catalog-node@1.6.1-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.1.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-catalog-node@1.6.1-next.1

## 0.1.28-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-catalog-common@1.0.19

## 0.1.27

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-catalog-node@1.6.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/integration@1.8.0
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.19

## 0.1.27-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.6.0-next.3

## 0.1.27-next.2

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0-next.2
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## 0.1.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1

## 0.1.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/integration@1.8.0-next.0
  - @backstage/plugin-catalog-node@1.5.1-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## 0.1.26

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0
  - @backstage/integration@1.7.2
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## 0.1.26-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-catalog-node@1.5.0-next.2

## 0.1.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0-next.1
  - @backstage/integration@1.7.2-next.0
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## 0.1.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/integration@1.7.1
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-catalog-node@1.4.8-next.0

## 0.1.25

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## 0.1.25-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/integration@1.7.1-next.1
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-catalog-node@1.4.7-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17-next.0

## 0.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/plugin-catalog-node@1.4.6-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.16

## 0.1.24-next.0

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/integration@1.7.1-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-catalog-node@1.4.6-next.0

## 0.1.22

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

- 94f96508491d: Improve consistency of results from the `AzureDevOpsEntityProvider`.
- 5f1a92b9f19f: Use `DefaultAzureDevOpsCredentialsProvider` to retrieve credentials for Azure DevOps.
- 044b4f2fb1e3: Remove duplications from Azure search before committing the new locations to the catalog.
- Updated dependencies
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.0
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/types@1.1.1
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-catalog-node@1.4.4

## 0.1.22-next.3

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
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/integration@1.7.0-next.3
  - @backstage/plugin-catalog-common@1.0.16-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-catalog-node@1.4.4-next.3

## 0.1.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1

## 0.1.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/integration@1.7.0-next.1
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-catalog-node@1.4.4-next.1
  - @backstage/plugin-catalog-common@1.0.16-next.0
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.1.21-next.0

### Patch Changes

- 94f96508491d: Improve consistency of results from the `AzureDevOpsEntityProvider`.
- 5f1a92b9f19f: Use `DefaultAzureDevOpsCredentialsProvider` to retrieve credentials for Azure DevOps.
- 044b4f2fb1e3: Remove duplications from Azure search before committing the new locations to the catalog.
- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/integration@1.7.0-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.3-next.0

## 0.1.19

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-catalog-node@1.4.1
  - @backstage/integration@1.6.0
  - @backstage/backend-tasks@0.5.5
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 0.1.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## 0.1.19-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-catalog-node@1.4.1-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/integration@1.5.1
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 0.1.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration@1.5.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.1-next.0

## 0.1.18

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/plugin-catalog-node@1.4.0
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/backend-tasks@0.5.4
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 0.1.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/plugin-catalog-node@1.4.0-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1-next.0
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15-next.0

## 0.1.17

### Patch Changes

- c7f848bcea3c: Support authentication with a service principal or managed identity for Azure DevOps

  Azure DevOps recently released support, in public preview, for authenticating with a service principal or managed identity instead of a personal access token (PAT): https://devblogs.microsoft.com/devops/introducing-service-principal-and-managed-identity-support-on-azure-devops/. With this change the Azure integration now supports service principals and managed identities for Azure AD backed Azure DevOps organizations. Service principal and managed identity authentication is not supported on Azure DevOps Server (on-premises) organizations.

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/types@1.1.0
  - @backstage/integration@1.5.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-catalog-node@1.3.7
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.14

## 0.1.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/integration@1.5.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.14-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.2

## 0.1.17-next.1

### Patch Changes

- c7f848bcea3c: Support authentication with a service principal or managed identity for Azure DevOps

  Azure DevOps recently released support, in public preview, for authenticating with a service principal or managed identity instead of a personal access token (PAT): https://devblogs.microsoft.com/devops/introducing-service-principal-and-managed-identity-support-on-azure-devops/. With this change the Azure integration now supports service principals and managed identities for Azure AD backed Azure DevOps organizations. Service principal and managed identity authentication is not supported on Azure DevOps Server (on-premises) organizations.

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/integration@1.5.0-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.1
  - @backstage/plugin-catalog-common@1.0.14-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.3.7-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/integration@1.4.5
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/integration@1.4.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-catalog-node@1.3.6
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.1.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/integration@1.4.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-catalog-node@1.3.6-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 0.1.15

### Patch Changes

- 62a725e3a94: Use the `LocationSpec` type from the `catalog-common` package in place of the deprecated `LocationSpec` from the `catalog-node` package.
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/integration@1.4.4
  - @backstage/plugin-catalog-node@1.3.5
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 0.1.15-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.1
  - @backstage/plugin-catalog-node@1.3.5-next.3

## 0.1.15-next.2

### Patch Changes

- 62a725e3a94: Use the `LocationSpec` type from the `catalog-common` package in place of the deprecated `LocationSpec` from the `catalog-node` package.
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.2

## 0.1.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/integration@1.4.4-next.0
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.5-next.1

## 0.1.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.5-next.0

## 0.1.14

### Patch Changes

- 90469c02c8c: Renamed `azureDevOpsEntityProviderCatalogModule` to `catalogModuleAzureDevOpsEntityProvider` to match the [recommended naming patterns](https://backstage.io/docs/backend-system/architecture/naming-patterns).
- c17fa101825: Add branch filter support
  https://backstage.io/docs/integrations/azure/discovery
- e675f902980: Make sure to not use deprecated exports from `@backstage/plugin-catalog-backend`
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.4
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/integration@1.4.3
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-catalog-backend@1.8.0-next.2
  - @backstage/plugin-catalog-node@1.3.4-next.2
  - @backstage/config@1.0.7-next.0
  - @backstage/integration@1.4.3-next.0

## 0.1.14-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/integration@1.4.3-next.0
  - @backstage/plugin-catalog-backend@1.8.0-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.4-next.1

## 0.1.14-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
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

## 0.1.13

### Patch Changes

- 2890f47517: This will add the ability to use Azure DevOps with multi project with a single value which is a new feature as previously this had to be done manually for each project that you wanted to add.

  Right now you would have to fill in multiple values in the config to use multiple projects:

  ```
  yourFirstProviderId: # identifies your dataset / provider independent of config changes
      organization: myorg
      project: 'firstProject' # this will match the firstProject project
      repository: '*' # this will match all repos
      path: /catalog-info.yaml
  yourSecondProviderId: # identifies your dataset / provider independent of config changes
      organization: myorg
      project: 'secondProject' # this will match the secondProject project
      repository: '*' # this will match all repos
      path: /catalog-info.yaml
  ```

  With this change you can actually have all projects available where your PAT determines which you have access to, so that includes multiple projects:

  ```
  yourFirstProviderId: # identifies your dataset / provider independent of config changes
      organization: myorg
      project: '*' # this will match all projects where your PAT has access to
      repository: '*' # this will match all repos
      path: /catalog-info.yaml
  ```

- 85b04f659a: Internal refactor to not use deprecated `substr`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/catalog-model@1.2.0
  - @backstage/plugin-catalog-node@1.3.3
  - @backstage/backend-tasks@0.4.3
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-catalog-backend@1.7.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/plugin-catalog-node@1.3.3-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.1.13-next.1

### Patch Changes

- 2890f47517: This will add the ability to use Azure DevOps with multi project with a single value which is a new feature as previously this had to be done manually for each project that you wanted to add.

  Right now you would have to fill in multiple values in the config to use multiple projects:

  ```
  yourFirstProviderId: # identifies your dataset / provider independent of config changes
      organization: myorg
      project: 'firstProject' # this will match the firstProject project
      repository: '*' # this will match all repos
      path: /catalog-info.yaml
  yourSecondProviderId: # identifies your dataset / provider independent of config changes
      organization: myorg
      project: 'secondProject' # this will match the secondProject project
      repository: '*' # this will match all repos
      path: /catalog-info.yaml
  ```

  With this change you can actually have all projects available where your PAT determines which you have access to, so that includes multiple projects:

  ```
  yourFirstProviderId: # identifies your dataset / provider independent of config changes
      organization: myorg
      project: '*' # this will match all projects where your PAT has access to
      repository: '*' # this will match all repos
      path: /catalog-info.yaml
  ```

- 85b04f659a: Internal refactor to not use deprecated `substr`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2-next.1
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.3-next.1

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-catalog-backend@1.7.2-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.1.11

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/catalog-model@1.1.5
  - @backstage/backend-tasks@0.4.1
  - @backstage/plugin-catalog-node@1.3.1
  - @backstage/plugin-catalog-backend@1.7.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.1.11-next.2

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/plugin-catalog-backend@1.7.0-next.2
  - @backstage/plugin-catalog-node@1.3.1-next.2
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.1-next.0

## 0.1.10

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-catalog-node@1.3.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/errors@1.1.4
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5

## 0.1.10-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.3
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-node@1.3.0-next.3

## 0.1.10-next.2

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-catalog-backend@1.6.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/plugin-catalog-node@1.2.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1

## 0.1.10-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/integration@1.4.1-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/plugin-catalog-node@1.2.2-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0

## 0.1.9

### Patch Changes

- 87ff05892d: `AzureDevOpsEntityProvider`: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  https://backstage.io/docs/integrations/azure/discovery

- 0ca399b31b: Add `azureDevOpsEntityProviderCatalogModule` (new backend-plugin-api, alpha).
- 4c9f7847e4: Updated dependency `msw` to `^0.48.0` while moving it to be a dev dependency.
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-catalog-backend@1.5.1
  - @backstage/integration@1.4.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/catalog-model@1.1.3
  - @backstage/types@1.0.1
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/plugin-catalog-node@1.2.1
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/plugin-catalog-backend@1.5.1-next.1
  - @backstage/plugin-catalog-node@1.2.1-next.1
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/types@1.0.1-next.0

## 0.1.9-next.0

### Patch Changes

- 87ff05892d: `AzureDevOpsEntityProvider`: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  https://backstage.io/docs/integrations/azure/discovery

- 0ca399b31b: Add `azureDevOpsEntityProviderCatalogModule` (new backend-plugin-api, alpha).
- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-catalog-backend@1.5.1-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/plugin-catalog-node@1.2.1-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-catalog-backend@1.5.0
  - @backstage/backend-tasks@0.3.6
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/integration@1.3.2
  - @backstage/types@1.0.0

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.5.0-next.2
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/types@1.0.0

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-backend@1.4.1-next.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/plugin-catalog-backend@1.4.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/types@1.0.0

## 0.1.7

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/integration@1.3.1
  - @backstage/plugin-catalog-backend@1.4.0
  - @backstage/backend-tasks@0.3.5
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1

## 0.1.7-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/plugin-catalog-backend@1.4.0-next.3
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/backend-tasks@0.3.5-next.1

## 0.1.7-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/integration@1.3.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.2

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.1

## 0.1.7-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/plugin-catalog-backend@1.3.2-next.0
  - @backstage/integration@1.3.1-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/integration@1.3.0
  - @backstage/backend-tasks@0.3.4
  - @backstage/plugin-catalog-backend@1.3.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/integration@1.3.0-next.0
  - @backstage/backend-tasks@0.3.4-next.0
  - @backstage/plugin-catalog-backend@1.3.1-next.0

## 0.1.5

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0
  - @backstage/integration@1.2.2
  - @backstage/backend-tasks@0.3.3
  - @backstage/errors@1.1.0

## 0.1.5-next.2

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0-next.3
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/integration@1.2.2-next.3
  - @backstage/backend-tasks@0.3.3-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.1
  - @backstage/backend-tasks@0.3.3-next.1
  - @backstage/integration@1.2.2-next.1

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/integration@1.2.2-next.0
  - @backstage/backend-tasks@0.3.3-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.0

## 0.1.4

### Patch Changes

- b8884fd579: Add a new provider `AzureDevOpsEntityProvider` as replacement for `AzureDevOpsDiscoveryProcessor`.

  In order to migrate from the `AzureDevOpsDiscoveryProcessor` you need to apply
  the following changes:

  **Before:**

  ```yaml
  # app-config.yaml

  catalog:
    locations:
      - type: azure-discovery
        target: https://dev.azure.com/myorg/myproject/_git/service-*?path=/catalog-info.yaml
  ```

  ```ts
  /* packages/backend/src/plugins/catalog.ts */

  import { AzureDevOpsDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-azure';

  const builder = await CatalogBuilder.create(env);
  /** ... other processors ... */
  builder.addProcessor(new AzureDevOpsDiscoveryProcessor(env.reader));
  ```

  **After:**

  ```yaml
  # app-config.yaml

  catalog:
    providers:
      azureDevOps:
        anyProviderId:
          host: selfhostedazure.yourcompany.com # This is only really needed for on-premise user, defaults to dev.azure.com
          organization: myorg # For on-premise this would be your Collection
          project: myproject
          repository: service-*
          path: /catalog-info.yaml
  ```

  ```ts
  /* packages/backend/src/plugins/catalog.ts */

  import { AzureDevOpsEntityProvider } from '@backstage/plugin-catalog-backend-module-azure';

  const builder = await CatalogBuilder.create(env);
  /** ... other processors and/or providers ... */
  builder.addEntityProvider(
    AzureDevOpsEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
    }),
  );
  ```

  Visit [https://backstage.io/docs/integrations/azure/discovery](https://backstage.io/docs/integrations/azure/discovery) for more details and options on configuration.

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.2.0
  - @backstage/backend-tasks@0.3.2
  - @backstage/backend-common@0.14.0
  - @backstage/integration@1.2.1
  - @backstage/catalog-model@1.0.3

## 0.1.4-next.2

### Patch Changes

- b8884fd579: Add a new provider `AzureDevOpsEntityProvider` as replacement for `AzureDevOpsDiscoveryProcessor`.

  In order to migrate from the `AzureDevOpsDiscoveryProcessor` you need to apply
  the following changes:

  **Before:**

  ```yaml
  # app-config.yaml

  catalog:
    locations:
      - type: azure-discovery
        target: https://dev.azure.com/myorg/myproject/_git/service-*?path=/catalog-info.yaml
  ```

  ```ts
  /* packages/backend/src/plugins/catalog.ts */

  import { AzureDevOpsDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-azure';

  const builder = await CatalogBuilder.create(env);
  /** ... other processors ... */
  builder.addProcessor(new AzureDevOpsDiscoveryProcessor(env.reader));
  ```

  **After:**

  ```yaml
  # app-config.yaml

  catalog:
    providers:
      azureDevOps:
        anyProviderId:
          host: selfhostedazure.yourcompany.com # This is only really needed for on-premise user, defaults to dev.azure.com
          organization: myorg # For on-premise this would be your Collection
          project: myproject
          repository: service-*
          path: /catalog-info.yaml
  ```

  ```ts
  /* packages/backend/src/plugins/catalog.ts */

  import { AzureDevOpsEntityProvider } from '@backstage/plugin-catalog-backend-module-azure';

  const builder = await CatalogBuilder.create(env);
  /** ... other processors and/or providers ... */
  builder.addEntityProvider(
    AzureDevOpsEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
    }),
  );
  ```

  Visit [https://backstage.io/docs/integrations/azure/discovery](https://backstage.io/docs/integrations/azure/discovery) for more details and options on configuration.

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/integration@1.2.1-next.2
  - @backstage/backend-tasks@0.3.2-next.2
  - @backstage/plugin-catalog-backend@1.2.0-next.2

## 0.1.4-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/catalog-model@1.0.3-next.0

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/plugin-catalog-backend@1.2.0-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-catalog-backend@1.1.2
  - @backstage/integration@1.2.0
  - @backstage/config@1.0.1
  - @backstage/catalog-model@1.0.2

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-catalog-backend@1.1.2-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/integration@1.2.0-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/integration@1.2.0-next.0
  - @backstage/plugin-catalog-backend@1.1.2-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0
  - @backstage/integration@1.1.0
  - @backstage/catalog-model@1.0.1
  - @backstage/backend-common@0.13.2

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0-next.1
  - @backstage/integration@1.1.0-next.1
  - @backstage/backend-common@0.13.2-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-backend@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/integration@1.0.1-next.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.0.0
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0

## 0.1.0

### Minor Changes

- 66ba5d9023: Added package, moving out azure specific functionality from the catalog-backend

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-catalog-backend@0.24.0
  - @backstage/catalog-model@0.13.0

## 0.1.0-next.0

### Minor Changes

- 66ba5d9023: Added package, moving out azure specific functionality from the catalog-backend

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-catalog-backend@0.24.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
