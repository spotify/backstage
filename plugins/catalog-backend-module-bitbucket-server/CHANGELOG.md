# @backstage/plugin-catalog-backend-module-bitbucket-server

## 0.5.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 0.5.16

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-catalog-common@1.2.1
  - @backstage/plugin-catalog-node@2.2.6
  - @backstage/plugin-events-node@0.4.27

## 0.5.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1
  - @backstage/plugin-events-node@0.4.27-next.1

## 0.5.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## 0.5.15

### Patch Changes

- 989db63: Aligned event-driven catalog updates with the repository filters configured for the Bitbucket Server provider.
- Updated dependencies
  - @backstage/integration@2.1.2
  - @backstage/plugin-catalog-common@1.2.0
  - @backstage/catalog-model@1.10.1
  - @backstage/config@1.3.9
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5
  - @backstage/plugin-events-node@0.4.26

## 0.5.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.2.0-next.0
  - @backstage/config@1.3.9-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/integration@2.1.2-next.1

## 0.5.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0
  - @backstage/plugin-events-node@0.4.26-next.0

## 0.5.14

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/integration@2.1.0
  - @backstage/plugin-catalog-node@2.2.4
  - @backstage/plugin-events-node@0.4.25

## 0.5.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.0-next.0

## 0.5.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0
  - @backstage/plugin-events-node@0.4.25-next.0

## 0.5.13

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/plugin-catalog-node@2.2.3
  - @backstage/plugin-events-node@0.4.24

## 0.5.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0
  - @backstage/plugin-events-node@0.4.24-next.0

## 0.5.12

### Patch Changes

- 9e2ff8c: Added a Bitbucket Server SCM event translation layer to the catalog backend module. The module now subscribes to Bitbucket Server webhook events and translates them into generic catalog SCM events, enabling instant catalog reprocessing when repositories are pushed to or renamed. The `analyzeBitbucketServerWebhookEvent` function is exported from the alpha entry point for custom integrations.
- Updated dependencies
  - @backstage/integration@2.0.3
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-catalog-node@2.2.2
  - @backstage/plugin-events-node@0.4.23

## 0.5.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.0.3-next.0
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0
  - @backstage/plugin-events-node@0.4.23-next.0

## 0.5.11

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/integration@2.0.2
  - @backstage/config@1.3.8
  - @backstage/plugin-catalog-common@1.1.10
  - @backstage/plugin-events-node@0.4.22

## 0.5.11-next.1

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.1
  - @backstage/plugin-catalog-node@2.2.1-next.1

## 0.5.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/integration@2.0.2-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/plugin-events-node@0.4.22-next.0
  - @backstage/plugin-catalog-common@1.1.10-next.0

## 0.5.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/integration@2.0.1
  - @backstage/config@1.3.7
  - @backstage/plugin-catalog-common@1.1.9
  - @backstage/plugin-events-node@0.4.21

## 0.5.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/integration@2.0.1-next.0
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0
  - @backstage/plugin-events-node@0.4.21-next.2
  - @backstage/plugin-catalog-common@1.1.9-next.0

## 0.5.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1
  - @backstage/plugin-events-node@0.4.21-next.1

## 0.5.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/plugin-events-node@0.4.21-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration@2.0.0
  - @backstage/plugin-catalog-common@1.1.8

## 0.5.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/integration@2.0.0
  - @backstage/plugin-catalog-node@2.1.0
  - @backstage/catalog-model@1.7.7
  - @backstage/plugin-events-node@0.4.20

## 0.5.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/integration@2.0.0-next.2
  - @backstage/plugin-catalog-node@2.1.0-next.2
  - @backstage/plugin-events-node@0.4.20-next.1

## 0.5.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.0.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.1
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-events-node@0.4.20-next.0

## 0.5.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.21.0-next.0
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-events-node@0.4.20-next.0

## 0.5.8

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- Updated dependencies
  - @backstage/integration@1.20.0
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-catalog-common@1.1.8
  - @backstage/plugin-events-node@0.4.19

## 0.5.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.20.0-next.2
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-events-node@0.4.19-next.0

## 0.5.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.20.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1

## 0.5.8-next.0

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/integration@1.19.3-next.0
  - @backstage/plugin-events-node@0.4.19-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.8-next.0

## 0.5.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/integration@1.19.2

## 0.5.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.19.2-next.0

## 0.5.6

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.19.0
  - @backstage/plugin-events-node@0.4.18
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1

## 0.5.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.18-next.1
  - @backstage/integration@1.18.3-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-catalog-node@1.20.1-next.1

## 0.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/integration@1.18.3-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/plugin-events-node@0.4.18-next.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.7

## 0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## 0.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-events-node@0.4.17-next.1

## 0.5.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.17-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/integration@1.18.2-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.7-next.0
  - @backstage/plugin-catalog-node@1.19.2-next.0

## 0.5.4

### Patch Changes

- 99fcf98: Removed unused dependencies
- Updated dependencies
  - @backstage/integration@1.18.1
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-common@1.1.6
  - @backstage/plugin-catalog-node@1.19.1
  - @backstage/plugin-events-node@0.4.16

## 0.5.4-next.2

### Patch Changes

- 99fcf98: Removed unused dependencies

## 0.5.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/integration@1.18.1-next.1
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-events-node@0.4.16-next.0
  - @backstage/plugin-catalog-common@1.1.6-next.0
  - @backstage/catalog-client@1.12.0

## 0.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.1-next.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/catalog-client@1.12.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-events-node@0.4.15

## 0.5.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/catalog-client@1.12.0
  - @backstage/plugin-events-node@0.4.15
  - @backstage/integration@1.18.0
  - @backstage/backend-plugin-api@1.4.3

## 0.5.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.12.0-next.0
  - @backstage/plugin-catalog-node@1.19.0-next.1
  - @backstage/integration@1.18.0-next.0

## 0.5.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.0-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0
  - @backstage/plugin-events-node@0.4.15-next.0

## 0.5.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## 0.5.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0-next.0
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/plugin-events-node@0.4.14-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.1
  - @backstage/plugin-catalog-common@1.1.5

## 0.5.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/catalog-model@1.7.5
  - @backstage/catalog-client@1.10.2
  - @backstage/integration@1.17.1
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.17.2
  - @backstage/plugin-events-node@0.4.13

## 0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/catalog-client@1.10.2-next.0
  - @backstage/integration@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-catalog-common@1.1.5-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0
  - @backstage/plugin-events-node@0.4.13-next.0

## 0.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.1-next.0
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/plugin-events-node@0.4.12
  - @backstage/catalog-client@1.10.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4

## 0.5.0

### Minor Changes

- eb8b3aa: Add validateLocationsExist option to avoid generating locations for catalog-info.yaml files that do not exist in the source repository.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-events-node@0.4.12

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-events-node@0.4.12-next.1

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0
  - @backstage/plugin-events-node@0.4.12-next.0

## 0.4.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/catalog-client@1.10.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4
  - @backstage/plugin-events-node@0.4.11

## 0.4.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0-next.3
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.2
  - @backstage/plugin-events-node@0.4.11-next.2

## 0.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.17.0-next.2
  - @backstage/config@1.3.2
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-events-node@0.4.11-next.1

## 0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-events-node@0.4.11-next.1

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.4-next.0
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-events-node@0.4.11-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.3

## 0.4.0

### Minor Changes

- 1daedce: Remove Throttle of Bitbucket Server API calls
- 7b3ed9b: Added the ability for the plugin to receive events coming from Bitbucket Server push webhooks. It then performs a delta mutation on the catalog.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/integration@1.16.3
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.10

## 0.4.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.3-next.0
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-events-node@0.4.9

## 0.4.0-next.0

### Minor Changes

- 7b3ed9b: Added the ability for the plugin to receive events coming from Bitbucket Server push webhooks. It then performs a delta mutation on the catalog.

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.3-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-events-node@0.4.9

## 0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.2
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-node@1.16.1

## 0.3.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.2-next.0
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-node@1.16.1-next.1

## 0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
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
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1

## 0.3.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1

## 0.3.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/plugin-catalog-node@1.16.0-next.2

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1

## 0.3.1

### Patch Changes

- 8c04d7a: Updated the `getFile` method in `BitbucketServerClient` to use `this.config.apiBaseUrl` directly for constructing the API request URL, removing the creation of an unnecessary `URL` object. The method now relies on REST API paths for accessing resources instead of direct access, ensuring better alignment with Bitbucket's API conventions.
- Updated dependencies
  - @backstage/integration@1.16.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-node@1.15.1

## 0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/integration@1.16.1-next.0

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/integration@1.16.0
  - @backstage/plugin-catalog-node@1.15.1-next.0

## 0.3.0

### Minor Changes

- 3f34ea9: Throttles Bitbucket Server API calls

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/integration@1.16.0
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1

## 0.3.0-next.2

### Minor Changes

- 3f34ea9: Throttles Bitbucket Server API calls

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/integration@1.16.0-next.1

## 0.2.5-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/integration@1.16.0-next.0

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/plugin-catalog-node@1.14.1-next.0

## 0.2.4

### Patch Changes

- 4e58bc7: Upgrade to uuid v11 internally
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5
  - @backstage/integration@1.15.2

## 0.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-catalog-node@1.14.0-next.1

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1

## 0.2.3

### Patch Changes

- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/integration@1.15.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.13.1-next.0

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.0
  - @backstage/plugin-catalog-node@1.13.1-next.0

## 0.2.2

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/integration@1.15.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/integration@1.15.0-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.12.7-next.2

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/plugin-catalog-node@1.12.7-next.1

## 0.2.2-next.0

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-catalog-node@1.12.7-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0

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
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.37-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.3

## 0.1.37-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.2
  - @backstage/integration@1.14.0-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.37-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.37-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.36

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/integration@1.13.0
  - @backstage/plugin-catalog-node@1.12.4
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.36-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-catalog-node@1.12.4-next.1

## 0.1.35-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-catalog-node@1.12.3-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.33

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/integration@1.12.0
  - @backstage/plugin-catalog-node@1.12.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.33-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.2
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.33-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-catalog-node@1.12.1-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.33-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.0

## 0.1.33-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.11.0

## 0.1.32

### Patch Changes

- 062ffb1: Allow skipping archived repositories (`skipArchivedRepos` flag) on Bitbucket.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/integration@1.11.0

## 0.1.32-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0-next.2
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/integration@1.11.0-next.0

## 0.1.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-catalog-node@1.11.2-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.32-next.0

### Patch Changes

- 062ffb1: Allow skipping archived repositories (`skipArchivedRepos` flag) on Bitbucket.
- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-catalog-node@1.11.2-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0

## 0.1.31

### Patch Changes

- d5a1fe1: Replaced winston logger with `LoggerService`
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/backend-tasks@0.5.22
  - @backstage/integration@1.10.0
  - @backstage/plugin-catalog-node@1.11.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0-next.0
  - @backstage/plugin-catalog-node@1.11.1-next.1

## 0.1.31-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.11.1-next.0

## 0.1.30

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.11.0
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/backend-tasks@0.5.21
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1

## 0.1.29

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.10.0
  - @backstage/backend-common@0.21.5
  - @backstage/backend-tasks@0.5.20
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1

## 0.1.28

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.9.0

## 0.1.27

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-catalog-node@1.8.0
  - @backstage/backend-tasks@0.5.19
  - @backstage/catalog-model@1.4.5

## 0.1.27-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.9.1-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-catalog-node@1.8.0-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0

## 0.1.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.1

## 0.1.26-next.0

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0

## 0.1.23

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/backend-tasks@0.5.15
  - @backstage/catalog-model@1.4.4
  - @backstage/integration@1.9.0
  - @backstage/plugin-catalog-node@1.7.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.23-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-catalog-node@1.6.2-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/integration@1.9.0-next.0

## 0.1.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.6.2-next.1

## 0.1.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0

## 0.1.22

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/backend-tasks@0.5.14
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0

## 0.1.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-catalog-node@1.6.1-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.1.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.6.1-next.1

## 0.1.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0

## 0.1.21

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

## 0.1.21-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-catalog-node@1.6.0-next.3

## 0.1.21-next.2

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

## 0.1.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.5.1-next.1

## 0.1.21-next.0

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

## 0.1.20

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

## 0.1.20-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-catalog-node@1.5.0-next.2

## 0.1.20-next.1

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

## 0.1.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/integration@1.7.1
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.4.8-next.0

## 0.1.19

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

## 0.1.19-next.2

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

## 0.1.18-next.1

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

## 0.1.18-next.0

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
  - @backstage/plugin-catalog-node@1.4.6-next.0

## 0.1.16

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
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.0
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-catalog-node@1.4.4

## 0.1.16-next.3

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
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-catalog-node@1.4.4-next.3

## 0.1.16-next.2

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

## 0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/integration@1.7.0-next.1
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-catalog-node@1.4.4-next.1
  - @backstage/errors@1.2.1

## 0.1.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/integration@1.7.0-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-node@1.4.3-next.0

## 0.1.13

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

## 0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## 0.1.13-next.1

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

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration@1.5.1
  - @backstage/plugin-catalog-node@1.4.1-next.0

## 0.1.12

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

## 0.1.12-next.0

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

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/integration@1.5.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-catalog-node@1.3.7
  - @backstage/config@1.0.8

## 0.1.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/integration@1.5.0-next.0
  - @backstage/plugin-catalog-node@1.3.7-next.2

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/integration@1.5.0-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.1
  - @backstage/config@1.0.7

## 0.1.11-next.0

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

## 0.1.10

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

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.1.10-next.0

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

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/integration@1.4.4
  - @backstage/plugin-catalog-node@1.3.5
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.1.9-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.3

## 0.1.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.2

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/integration@1.4.4-next.0
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.5-next.1

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.5-next.0

## 0.1.8

### Patch Changes

- 90469c02c8c: Renamed `bitbucketServerEntityProviderCatalogModule` to `catalogModuleBitbucketServerEntityProvider` to match the [recommended naming patterns](https://backstage.io/docs/backend-system/architecture/naming-patterns).
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

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-catalog-backend@1.8.0-next.2
  - @backstage/plugin-catalog-node@1.3.4-next.2
  - @backstage/config@1.0.7-next.0
  - @backstage/integration@1.4.3-next.0

## 0.1.8-next.1

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
  - @backstage/plugin-catalog-node@1.3.4-next.1

## 0.1.8-next.0

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

## 0.1.7

### Patch Changes

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

## 0.1.7-next.2

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

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2-next.1
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/plugin-catalog-node@1.3.3-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-catalog-backend@1.7.2-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.1.5

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

## 0.1.5-next.2

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

## 0.1.5-next.1

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

## 0.1.5-next.0

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
  - @backstage/plugin-catalog-node@1.3.1-next.0

## 0.1.4

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
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5

## 0.1.4-next.3

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
  - @backstage/plugin-catalog-node@1.3.0-next.3

## 0.1.4-next.2

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

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-catalog-backend@1.6.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/plugin-catalog-node@1.2.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1

## 0.1.4-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/integration@1.4.1-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/plugin-catalog-node@1.2.2-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0

## 0.1.3

### Patch Changes

- 68f7f5a857: `BitbucketServerEntityProvider`: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  https://backstage.io/docs/integrations/bitbucketServer/discovery

- cd48ed8370: Add `bitbucketServerEntityProviderCatalogModule` (new backend-plugin-api, alpha).
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-catalog-backend@1.5.1
  - @backstage/integration@1.4.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/catalog-model@1.1.3
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/plugin-catalog-node@1.2.1
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.1.3-next.1

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

## 0.1.3-next.0

### Patch Changes

- 68f7f5a857: `BitbucketServerEntityProvider`: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  https://backstage.io/docs/integrations/bitbucketServer/discovery

- cd48ed8370: Add `bitbucketServerEntityProviderCatalogModule` (new backend-plugin-api, alpha).
- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-catalog-backend@1.5.1-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/plugin-catalog-node@1.2.1-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-catalog-backend@1.5.0
  - @backstage/backend-tasks@0.3.6
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/integration@1.3.2

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.5.0-next.2
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/plugin-catalog-backend@1.4.1-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/plugin-catalog-backend@1.4.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0

## 0.1.1

### Patch Changes

- 148568b5c2: Switched to using node-fetch instead of cross-fetch as is standard for our backend packages
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

## 0.1.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/plugin-catalog-backend@1.4.0-next.3
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/backend-tasks@0.3.5-next.1

## 0.1.1-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/integration@1.3.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.2

## 0.1.1-next.1

### Patch Changes

- 148568b5c2: Switched to using node-fetch instead of cross-fetch as is standard for our backend packages
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.1

## 0.1.1-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/plugin-catalog-backend@1.3.2-next.0
  - @backstage/integration@1.3.1-next.0

## 0.1.0

### Minor Changes

- f7607f9d85: Add new plugin catalog-backend-module-bitbucket-server which adds the `BitbucketServerEntityProvider`.

  The entity provider is meant as a replacement for the `BitbucketDiscoveryProcessor` to be used with Bitbucket Server (Bitbucket Cloud already has a replacement).

  **Before:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addProcessor(
    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  ```

  ```yaml
  # app-config.yaml
  catalog:
    locations:
      - type: bitbucket-discovery
        target: 'https://bitbucket.mycompany.com/projects/*/repos/*/catalog-info.yaml
  ```

  **After:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    BitbucketServerEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
    }),
  );
  ```

  ```yaml
  # app-config.yaml
  catalog:
    providers:
      bitbucketServer:
        yourProviderId: # identifies your ingested dataset
          catalogPath: /catalog-info.yaml # default value
          filters: # optional
            projectKey: '.*' # optional; RegExp
            repoSlug: '.*' # optional; RegExp
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/integration@1.3.0
  - @backstage/backend-tasks@0.3.4
  - @backstage/plugin-catalog-backend@1.3.1

## 0.1.0-next.0

### Minor Changes

- f7607f9d85: Add new plugin catalog-backend-module-bitbucket-server which adds the `BitbucketServerEntityProvider`.

  The entity provider is meant as a replacement for the `BitbucketDiscoveryProcessor` to be used with Bitbucket Server (Bitbucket Cloud already has a replacement).

  **Before:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addProcessor(
    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  ```

  ```yaml
  # app-config.yaml
  catalog:
    locations:
      - type: bitbucket-discovery
        target: 'https://bitbucket.mycompany.com/projects/*/repos/*/catalog-info.yaml
  ```

  **After:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    BitbucketServerEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
    }),
  );
  ```

  ```yaml
  # app-config.yaml
  catalog:
    providers:
      bitbucketServer:
        yourProviderId: # identifies your ingested dataset
          catalogPath: /catalog-info.yaml # default value
          filters: # optional
            projectKey: '.*' # optional; RegExp
            repoSlug: '.*' # optional; RegExp
  ```

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.1-next.2
