# @backstage/plugin-kafka-backend

## 0.2.7

### Patch Changes

- 8ab897e01: Properly return a 404 when an unknown cluster is given
- Updated dependencies
  - @backstage/backend-common@0.8.4

## 0.2.6

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0

## 0.2.5

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9

## 0.2.4

### Patch Changes

- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.2.3

### Patch Changes

- f03a52f5b: Add support for SASL authentication & SSL boolean config.
- Updated dependencies [8488a1a96]
- Updated dependencies [37e3a69f5]
  - @backstage/catalog-model@0.7.5
  - @backstage/backend-common@0.6.1

## 0.2.2

### Patch Changes

- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.2.1

### Patch Changes

- 4fbc9df79: Fixed `config.d.ts` not being included in the published package.
- f43192207: remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5

## 0.2.0

### Minor Changes

- 234e7d985: Added support for multiple Kafka clusters and multiple consumers per component.
  Note that this introduces several breaking changes.

  1. Configuration in `app-config.yaml` has changed to support the ability to configure multiple clusters. This means you are required to update the configs in the following way:

  ```diff
  kafka:
     clientId: backstage
  -  brokers:
  -    - localhost:9092
  +  clusters:
  +    - name: prod
  +      brokers:
  +        - localhost:9092
  ```

  2. Configuration of services has changed as well to support multiple clusters:

  ```diff
    annotations:
  -    kafka.apache.org/consumer-groups: consumer
  +    kafka.apache.org/consumer-groups: prod/consumer
  ```

  3. Kafka Backend API has changed, so querying offsets of a consumer group is now done with the following query path:
     `/consumers/${clusterId}/${consumerGroup}/offsets`

### Patch Changes

- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1

## 0.1.1

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0
