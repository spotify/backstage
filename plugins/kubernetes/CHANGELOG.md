# @backstage/plugin-kubernetes

## 0.4.6

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-model@0.8.4
  - @backstage/plugin-catalog-react@0.2.4

## 0.4.5

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0
  - @backstage/plugin-kubernetes-common@0.1.1

## 0.4.4

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- ea21d46f0: Export types
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.4.3

### Patch Changes

- f53fba29f: Adds @backstage/plugin-kubernetes-common library to share types between kubernetes frontend and backend.
- Updated dependencies [f65adcde7]
- Updated dependencies [81c54d1f2]
- Updated dependencies [80888659b]
- Updated dependencies [7b8272fb7]
- Updated dependencies [d8b81fd28]
  - @backstage/core@0.7.8
  - @backstage/plugin-catalog-react@0.1.5
  - @backstage/theme@0.2.7
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.4.2

### Patch Changes

- a2a3c7803: Bump `@kubernetes/client-node` from `^0.13.2` to `^0.14.0`.
- Updated dependencies [a2a3c7803]
- Updated dependencies [01ccef4c7]
- Updated dependencies [fcc3ada24]
- Updated dependencies [4618774ff]
- Updated dependencies [df59930b3]
  - @backstage/plugin-kubernetes-backend@0.3.2
  - @backstage/plugin-catalog-react@0.1.3
  - @backstage/core@0.7.3
  - @backstage/theme@0.2.5

## 0.4.1

### Patch Changes

- 1df417bd3: Add tests for kubernetes custom hook
- 9ca0e4009: use local version of lowerCase and upperCase methods
- 1f98a6ff8: Filter out k8s cluster with no resources or errors
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
- Updated dependencies [1f98a6ff8]
  - @backstage/config@0.1.4
  - @backstage/core@0.7.2
  - @backstage/plugin-catalog-react@0.1.2
  - @backstage/plugin-kubernetes-backend@0.3.1

## 0.4.0

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

- 763926bc1: Adds a new method `getClusters` to grab cluster configuration in the frontend
- Updated dependencies [5d7834baf]
- Updated dependencies [0b42fff22]
- Updated dependencies [ff4d666ab]
- Updated dependencies [9581ff0b4]
- Updated dependencies [2089de76b]
- Updated dependencies [dc1fc92c8]
- Updated dependencies [8de9963f0]
- Updated dependencies [e2c1b3fb6]
  - @backstage/plugin-kubernetes-backend@0.3.0
  - @backstage/catalog-model@0.7.4
  - @backstage/core@0.7.1
  - @backstage/theme@0.2.4

## 0.3.12

### Patch Changes

- ba21797ca: k8s plugin now surfaces k8s components with only label selector query annotation.
  Previously backstage.io/kubernetes-label-selector catalog entity annotation would only work if you also included backstage.io/kubernetes-id.
  But backstage.io/kubernetes-id value was ignored
- 42c8ebb79: Support AWS auth provider on kubernetes FE plugin
- Updated dependencies [12d8f27a6]
- Updated dependencies [f43192207]
- Updated dependencies [e3adec2bd]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [9d455f69a]
- Updated dependencies [4c049a1a1]
- Updated dependencies [02816ecd7]
  - @backstage/catalog-model@0.7.3
  - @backstage/plugin-kubernetes-backend@0.2.8
  - @backstage/core@0.7.0
  - @backstage/plugin-catalog-react@0.1.1

## 0.3.11

### Patch Changes

- Updated dependencies [a70af22a2]
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [88f1f1b60]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [5c2e2863f]
- Updated dependencies [3a58084b6]
- Updated dependencies [a1f5e6545]
- Updated dependencies [2c1f2a7c2]
  - @backstage/plugin-kubernetes-backend@0.2.7
  - @backstage/core@0.6.3
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.3.10

### Patch Changes

- Updated dependencies [fd3f2a8c0]
- Updated dependencies [d34d26125]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [10a0124e0]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core@0.6.2
  - @backstage/plugin-catalog-react@0.0.4

## 0.3.9

### Patch Changes

- 6ed2b47d6: Include Backstage identity token in requests to backend plugins.
- 64b9efac2: Migrate to new composability API, exporting the plugin instance as `kubernetesPlugin` and entity content as `EntityKubernetesContent`.
- Updated dependencies [19d354c78]
- Updated dependencies [b51ee6ece]
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.3.8

### Patch Changes

- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [54c7d02f7]
- Updated dependencies [11cb5ef94]
  - @backstage/core@0.6.0
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.3.7

### Patch Changes

- 681111228: Add AWS auth provider for Kubernetes
- a6e3b9596: Improve error reporting for plugin misconfiguration.
- Updated dependencies [681111228]
  - @backstage/plugin-kubernetes-backend@0.2.6

## 0.3.6

### Patch Changes

- d014185db: Show Kubernetes Service manifests.
  Show Kubernetes Ingress manifests.
- Updated dependencies [def2307f3]
- Updated dependencies [d54857099]
- Updated dependencies [efd6ef753]
- Updated dependencies [a187b8ad0]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/plugin-kubernetes-backend@0.2.5
  - @backstage/core@0.5.0

## 0.3.5

### Patch Changes

- 1fea88fd0: Fixed an issue where assets weren't properly bundled in the published package.

## 0.3.4

### Patch Changes

- 5a9a7e7c2: Revamped Kubernetes UI and added error reporting/detection
- 3e7c09c84: Minor updates to display of errors
- Updated dependencies [5a9a7e7c2]
- Updated dependencies [f3b064e1c]
- Updated dependencies [265a7ab30]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/plugin-kubernetes-backend@0.2.4
  - @backstage/catalog-model@0.6.1
  - @backstage/core@0.4.4

## 0.3.3

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1
  - @backstage/plugin-kubernetes-backend@0.2.3

## 0.3.2

### Patch Changes

- Updated dependencies [2527628e1]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [1c69d4716]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
- Updated dependencies [e3bd9fc2f]
  - @backstage/core@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2
  - @backstage/plugin-kubernetes-backend@0.2.2

## 0.3.1

### Patch Changes

- bcc211a08: k8s-plugin: refactor approach to use annotation based label-selector
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-kubernetes-backend@0.2.1

## 0.3.0

### Minor Changes

- 1166fcc36: add kubernetes selector to component model

### Patch Changes

- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-kubernetes-backend@0.2.0

## 0.2.1

### Patch Changes

- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI

### Patch Changes

- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [fa56f4615]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/core@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
  - @backstage/plugin-kubernetes-backend@0.1.2
