# @backstage/plugin-kubernetes-backend

## 0.3.8

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/plugin-kubernetes-common@0.1.1

## 0.3.7

### Patch Changes

- f9f9d633d: Add possibility to configure TLS verification for `gke` type clusters
- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9

## 0.3.6

### Patch Changes

- f53fba29f: Adds @backstage/plugin-kubernetes-common library to share types between kubernetes frontend and backend.
- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.3.5

### Patch Changes

- c42cd1daa: Kubernetes client TLS verification is now configurable and defaults to true
- Updated dependencies [d367f63b5]
- Updated dependencies [b42531cfe]
  - @backstage/backend-common@0.6.3

## 0.3.4

### Patch Changes

- 7fd46f26d: Use `string` TypeScript type instead of `String`.
- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
  - @backstage/catalog-model@0.7.7

## 0.3.3

### Patch Changes

- 1ac6a5233: updated entity name to be set through annotations or fallback
- 60e463c8d: Load credentials properly for AWS Kubernetes Auth Translator
- Updated dependencies [8488a1a96]
- Updated dependencies [37e3a69f5]
  - @backstage/catalog-model@0.7.5
  - @backstage/backend-common@0.6.1

## 0.3.2

### Patch Changes

- a2a3c7803: Bump `@kubernetes/client-node` from `^0.13.2` to `^0.14.0`.

## 0.3.1

### Patch Changes

- 1f98a6ff8: Filter out k8s cluster with no resources or errors
- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.3.0

### Minor Changes

- 9581ff0b4: Restructure configuration; Add GKE cluster locator

  Config migration

  1. `kubernetes.clusters` is now at `kubernetes.clusterLocatorMethods[].clusters` when the `clusterLocatorMethod` is of `type: 'config''`
  2. `kubernetes.serviceLocatorMethod` is now an object. `multiTenant` is the only valid `type` currently

  Old config example:

  ```yaml
  kubernetes:
    serviceLocatorMethod: 'multiTenant'
    clusterLocatorMethods:
      - 'config'
    clusters:
      - url: http://127.0.0.1:9999
        name: minikube
        authProvider: 'serviceAccount'
        serviceAccountToken:
          $env: K8S_MINIKUBE_TOKEN
      - url: http://127.0.0.2:9999
        name: aws-cluster-1
        authProvider: 'aws'
  ```

  New config example:

  ```yaml
  kubernetes:
    serviceLocatorMethod:
      type: 'multiTenant'
    clusterLocatorMethods:
      - type: 'config'
        clusters:
          - url: http://127.0.0.1:9999
            name: minikube
            authProvider: 'serviceAccount'
            serviceAccountToken:
              $env: K8S_MINIKUBE_TOKEN
          - url: http://127.0.0.2:9999
            name: aws-cluster-1
            authProvider: 'aws'
  ```

- e2c1b3fb6: Add initial CRD support framework

### Patch Changes

- 5d7834baf: Use AWS SDK V2 instead of V3 for Kubernetes authentication
- 8de9963f0: Remove Kubernetes client caching
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [761698831]
  - @backstage/backend-common@0.5.6
  - @backstage/catalog-model@0.7.4

## 0.2.8

### Patch Changes

- f43192207: remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
- e3adec2bd: Allow apps to pass in a KubernetesClustersSupplier
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5

## 0.2.7

### Patch Changes

- a70af22a2: update kubernetes plugin backend function to use classes
- Updated dependencies [bad21a085]
- Updated dependencies [a1f5e6545]
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.2.6

### Patch Changes

- 681111228: Add AWS auth provider for Kubernetes
- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1

## 0.2.5

### Patch Changes

- d54857099: Support HTTP 400 Bad Request from Kubernetes API
- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0

## 0.2.4

### Patch Changes

- 5a9a7e7c2: Revamped Kubernetes UI and added error reporting/detection
- Updated dependencies [f3b064e1c]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.2.3

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/backend-common@0.4.1

## 0.2.2

### Patch Changes

- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0

## 0.2.1

### Patch Changes

- bcc211a08: k8s-plugin: refactor approach to use annotation based label-selector
- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0

## 0.2.0

### Minor Changes

- 1166fcc36: add kubernetes selector to component model

### Patch Changes

- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1

## 0.1.3

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [8afce088a]
- Updated dependencies [7bbeb049f]
  - @backstage/backend-common@0.2.0
