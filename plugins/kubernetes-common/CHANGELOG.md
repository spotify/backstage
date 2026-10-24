# @backstage/plugin-kubernetes-common

## 0.9.15-next.0

### Patch Changes

- ca14116: Moved `kubernetes-models` and `@kubernetes-models/apimachinery` to dev dependencies, since they are only used for types. Backends no longer install `kubernetes-models` through `@backstage/plugin-kubernetes-common`.

## 0.9.14

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-permission-common@0.9.12

## 0.9.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/catalog-model@1.10.2-next.0

## 0.9.13

### Patch Changes

- d9a57de: Add `KubernetesWatcher` interface for streaming Kubernetes resource changes via an async iterator. The watcher is separated from `KubernetesFetcher` because watching is a long-lived streaming connection that only works with server-side auth providers. Watch supports all event types (ADDED, MODIFIED, DELETED, BOOKMARK, ERROR) with errors yielded as data rather than thrown.
- Updated dependencies
  - @backstage/catalog-model@1.10.1
  - @backstage/plugin-permission-common@0.9.11

## 0.9.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.11-next.0

## 0.9.13-next.0

### Patch Changes

- d9a57de: Add `KubernetesWatcher` interface for streaming Kubernetes resource changes via an async iterator. The watcher is separated from `KubernetesFetcher` because watching is a long-lived streaming connection that only works with server-side auth providers. Watch supports all event types (ADDED, MODIFIED, DELETED, BOOKMARK, ERROR) with errors yielded as data rather than thrown.

## 0.9.12

### Patch Changes

- ab1cdbb: Removed a handful of internal imports that referenced the package by its own name. Value imports were switched to relative paths, and type-only imports to `import type`. These self-referential imports could trigger circular initialization errors in bundled ESM and when the package was loaded via `jest.requireActual` — most visibly `Cannot access '_AppRootElementBlueprintesm' before initialization` from `@backstage/frontend-plugin-api`. There are no user-facing API changes.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/plugin-permission-common@0.9.9

## 0.9.12-next.1

### Patch Changes

- ab1cdbb: Removed a handful of internal imports that referenced the package by its own name. Value imports were switched to relative paths, and type-only imports to `import type`. These self-referential imports could trigger circular initialization errors in bundled ESM and when the package was loaded via `jest.requireActual` — most visibly `Cannot access '_AppRootElementBlueprintesm' before initialization` from `@backstage/frontend-plugin-api`. There are no user-facing API changes.
- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.1
  - @backstage/plugin-permission-common@0.9.9-next.1

## 0.9.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/plugin-permission-common@0.9.9-next.0
  - @backstage/types@1.2.2

## 0.9.11

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-permission-common@0.9.8

## 0.9.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/plugin-permission-common@0.9.8-next.0

## 0.9.10

### Patch Changes

- ce3639c: Add PersistentVolume and PersistentVolumeClaims Rendering
- Updated dependencies
  - @backstage/plugin-permission-common@0.9.6

## 0.9.10-next.1

### Patch Changes

- ce3639c: Add PersistentVolume and PersistentVolumeClaims Rendering

## 0.9.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.5-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/types@1.2.2

## 0.9.9

### Patch Changes

- 8fa8d87: Add Kubernetes Plugin Secrets Accordion with masked secret datas

## 0.9.9-next.0

### Patch Changes

- 8fa8d87: Add Kubernetes Plugin Secrets Accordion with masked secret datas

## 0.9.8

### Patch Changes

- 1906d37: Updated dependency `@kubernetes/client-node` to `1.4.0`.
- Updated dependencies
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/catalog-model@1.7.6

## 0.9.8-next.1

### Patch Changes

- 1906d37: Updated dependency `@kubernetes/client-node` to `1.4.0`.

## 0.9.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/types@1.2.2
  - @backstage/plugin-permission-common@0.9.3-next.0

## 0.9.7

### Patch Changes

- bdd7f95: Make SERVICEACCOUNT_CA_PATH public so it can be imported by external modules.
- Updated dependencies
  - @backstage/plugin-permission-common@0.9.2

## 0.9.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.2-next.0

## 0.9.7-next.0

### Patch Changes

- bdd7f95: Make SERVICEACCOUNT_CA_PATH public so it can be imported by external modules.
- Updated dependencies
  - @backstage/catalog-model@1.7.5
  - @backstage/types@1.2.2
  - @backstage/plugin-permission-common@0.9.1

## 0.9.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.1
  - @backstage/catalog-model@1.7.5

## 0.9.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.1-next.0
  - @backstage/catalog-model@1.7.5-next.0

## 0.9.5

### Patch Changes

- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/types@1.2.1

## 0.9.5-next.0

### Patch Changes

- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1

## 0.9.4

### Patch Changes

- d517d13: Export `backstage.io/kubernetes-id` and `backstage.io/kubernetes-label-selector` annotations as constants
- Updated dependencies
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.8.4

## 0.9.4-next.0

### Patch Changes

- d517d13: Export `backstage.io/kubernetes-id` and `backstage.io/kubernetes-label-selector` annotations as constants

## 0.9.3

### Patch Changes

- ac0e1ac: Fixed the lack of `secrets` to fetch from the kubernetes api by adding option to specify additional Objects which are not part of Default Objects
- ca3da29: The `/clusters` endpoint is now protected by the `kubernetes.clusters.read` permission.
  The `/services/:serviceId` endpoint is now protected by the `kubernetes.resources.read` permission.
  The `/resources` endpoints are now protected by the `kubernetes.resources.read` permission.
- Updated dependencies
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.8.4

## 0.9.3-next.1

### Patch Changes

- ca3da29: The `/clusters` endpoint is now protected by the `kubernetes.clusters.read` permission.
  The `/services/:serviceId` endpoint is now protected by the `kubernetes.resources.read` permission.
  The `/resources` endpoints are now protected by the `kubernetes.resources.read` permission.
- Updated dependencies
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.8.4

## 0.9.3-next.0

### Patch Changes

- ac0e1ac: Fixed the lack of `secrets` to fetch from the kubernetes api by adding option to specify additional Objects which are not part of Default Objects
- Updated dependencies
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.8.4

## 0.9.2

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-permission-common@0.8.4

## 0.9.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/plugin-permission-common@0.8.4-next.0

## 0.9.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.2
  - @backstage/types@1.2.0
  - @backstage/plugin-permission-common@0.8.3

## 0.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-permission-common@0.8.3-next.0

## 0.9.0

### Minor Changes

- 71b8704: Bumping @kubernetes/client-node to 1.0.0-rc7 to mitigate CVEs related to the request and tough-cookie packages

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.0
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/catalog-model@1.7.1

## 0.9.0-next.0

### Minor Changes

- 71b8704: Bumping @kubernetes/client-node to 1.0.0-rc7 to mitigate CVEs related to the request and tough-cookie packages

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 0.8.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 0.8.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/catalog-model@1.6.0
  - @backstage/types@1.1.1

## 0.8.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1-next.1

## 0.8.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1

## 0.8.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1

## 0.8.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1

## 0.8.0

### Minor Changes

- 0177f75: Update kubernetes plugins to use autoscaling/v2

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1

## 0.8.0-next.1

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.14-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/types@1.1.1

## 0.8.0-next.0

### Minor Changes

- 0177f75: Update kubernetes plugins to use autoscaling/v2

## 0.7.6

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0

## 0.7.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13

## 0.7.5

### Patch Changes

- 4642cb7: Add support to fetch data for Daemon Sets and display an accordion in the same way as with Deployments
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/catalog-model@1.4.5
  - @backstage/types@1.1.1

## 0.7.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/types@1.1.1

## 0.7.5-next.0

### Patch Changes

- 4642cb7: Add support to fetch data for Daemon Sets and display an accordion in the same way as with Deployments
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/types@1.1.1

## 0.7.4

### Patch Changes

- a643af8: The `ClusterAttributes` type now includes the cluster title.
- daad576: Clusters configured with the `aws` authentication strategy can now customize the
  `x-k8s-aws-id` header value used to generate tokens. This value can be specified
  specified via the `kubernetes.io/x-k8s-aws-id` parameter (in
  `metadata.annotations` for clusters in the catalog, or the `authMetadata` block
  on clusters in the app-config). This is particularly helpful when a Backstage
  instance contains multiple AWS clusters with the same name in different regions
  -- using this new parameter, the clusters can be given different logical names
  to distinguish them but still use the same ID for the purposes of generating
  tokens.
- Updated dependencies
  - @backstage/catalog-model@1.4.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 0.7.4-next.2

### Patch Changes

- a643af8: The `ClusterAttributes` type now includes the cluster title.
- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 0.7.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 0.7.4-next.0

### Patch Changes

- daad576: Clusters configured with the `aws` authentication strategy can now customize the
  `x-k8s-aws-id` header value used to generate tokens. This value can be specified
  specified via the `kubernetes.io/x-k8s-aws-id` parameter (in
  `metadata.annotations` for clusters in the catalog, or the `authMetadata` block
  on clusters in the app-config). This is particularly helpful when a Backstage
  instance contains multiple AWS clusters with the same name in different regions
  -- using this new parameter, the clusters can be given different logical names
  to distinguish them but still use the same ID for the purposes of generating
  tokens.
- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 0.7.3

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1

## 0.7.3-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.11

## 0.7.2

### Patch Changes

- 706fc3a: Updated dependency `@kubernetes/client-node` to `0.20.0`.
- 5d79682: Remove unused dependency
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.7.2-next.1

### Patch Changes

- 5d796829bb: Remove unused dependency
- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.10

## 0.7.2-next.0

### Patch Changes

- 706fc3a7e1: Updated dependency `@kubernetes/client-node` to `0.20.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.10

## 0.7.1

### Patch Changes

- 62180df4ee: Allow storing dashboard parameters for kubernetes in catalog
- df40b067e1: Fixed the lack of `resourcequotas` as part of the Default Objects to fetch from the kubernetes api
- Updated dependencies
  - @backstage/core-plugin-api@1.8.0
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.7.1-next.1

### Patch Changes

- [#20321](https://github.com/backstage/backstage/pull/20321) [`62180df4ee`](https://github.com/backstage/backstage/commit/62180df4ee3cb2f75459ee245d5da9c7e2342375) Thanks [@szubster](https://github.com/szubster)! - Allow storing dashboard parameters for kubernetes in catalog

- [#20951](https://github.com/backstage/backstage/pull/20951) [`df40b067e1`](https://github.com/backstage/backstage/commit/df40b067e11a015666d18c11b2247c8d86a3fee9) Thanks [@Jenson3210](https://github.com/Jenson3210)! - Fixed the lack of `resourcequotas` as part of the Default Objects to fetch from the kubernetes api

## 0.7.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## 0.7.0

### Minor Changes

- 2d8151061c: Refactor Kubernetes plugins in line with ADR 11, no breaking changes yet

### Patch Changes

- 9101c0d1b6: Updated dependency `@kubernetes/client-node` to `0.19.0`.
- 5dac12e435: The kubernetes APIs invokes Authentication Strategies when Backstage-Kubernetes-Authorization-X-X headers are provided, this enable the possibility to invoke strategies that executes additional steps to get a kubernetes token like on pinniped or custom strategies
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## 0.7.0-next.1

### Patch Changes

- 5dac12e435: The kubernetes APIs invokes Authentication Strategies when Backstage-Kubernetes-Authorization-X-X headers are provided, this enable the possibility to invoke strategies that executes additional steps to get a kubernetes token like on pinniped or custom strategies
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0-next.1
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/errors@1.2.3-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9-next.0

## 0.7.0-next.0

### Minor Changes

- 2d8151061c: Refactor Kubernetes plugins in line with ADR 11, no breaking changes yet

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.8

## 0.6.6

### Patch Changes

- 0ad36158d980: Loosened the type of the `auth` field in the body of requests to the `retrieveObjectsByServiceId` endpoint. Now any JSON object is allowed, which should make it easier for integrators to write their own custom auth strategies for Kubernetes.
- ccf00accb408: Add AWS Annotations to Kubernetes Cluster Resource
- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- Updated dependencies
  - @backstage/catalog-model@1.4.2
  - @backstage/plugin-permission-common@0.7.8

## 0.6.6-next.2

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/plugin-permission-common@0.7.8-next.2

## 0.6.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1

## 0.6.6-next.0

### Patch Changes

- ccf00accb408: Add AWS Annotations to Kubernetes Cluster Resource
- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-permission-common@0.7.8-next.0

## 0.6.5

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.1
  - @backstage/plugin-permission-common@0.7.7

## 0.6.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/plugin-permission-common@0.7.7-next.0

## 0.6.4

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.0
  - @backstage/plugin-permission-common@0.7.6

## 0.6.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/plugin-permission-common@0.7.6-next.0

## 0.6.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/plugin-permission-common@0.7.6-next.0

## 0.6.3

### Patch Changes

- 05f1d74539d: AKS access tokens can now be sent over the wire to the Kubernetes backend.
- Updated dependencies
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-permission-common@0.7.5

## 0.6.3-next.0

### Patch Changes

- 05f1d74539d: AKS access tokens can now be sent over the wire to the Kubernetes backend.

## 0.6.2

### Patch Changes

- 804f6d16b0c: Introduced proxy permission types to be used with the kubernetes proxy endpoint's permission framework integration.
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/catalog-model@1.3.0

## 0.6.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/plugin-permission-common@0.7.5-next.0

## 0.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/catalog-model@1.2.1

## 0.6.2-next.0

### Patch Changes

- 804f6d16b0c: Introduced proxy permission types to be used with the kubernetes proxy endpoint's permission framework integration.
- Updated dependencies
  - @backstage/catalog-model@1.2.1
  - @backstage/plugin-permission-common@0.7.4

## 0.6.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.2.1

## 0.6.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.2.1-next.1

## 0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.2.1-next.0

## 0.6.0

### Minor Changes

- 1728c1ef01: **BREAKING**: Renamed misspelled `LimitRangeFetchReponse` to `LimitRangeFetchResponse`.

### Patch Changes

- 2518ef5b8a: New K8s catalog entity annotations added that will replace now deprecated k8s annotations in the catalog-model package. K8s annotation imports should now be made from plugin-kubernetes-common.
- 628e2bd89a: Updated dependency `@kubernetes/client-node` to `0.18.1`.
- Updated dependencies
  - @backstage/catalog-model@1.2.0

## 0.6.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.2.0-next.1

## 0.6.0-next.1

### Patch Changes

- 628e2bd89a: Updated dependency `@kubernetes/client-node` to `0.18.1`.
- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0

## 0.6.0-next.0

### Minor Changes

- 1728c1ef01: **BREAKING**: Renamed misspelled `LimitRangeFetchReponse` to `LimitRangeFetchResponse`.

### Patch Changes

- 2518ef5b8a: New K8s catalog entity annotations added that will replace now deprecated k8s annotations in the catalog-model package. K8s annotation imports should now be made from plugin-kubernetes-common.
- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0

## 0.5.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5

## 0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1

## 0.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0

## 0.5.0

### Minor Changes

- 2db8acffe7: Kubernetes plugin now gracefully surfaces transport-level errors (like DNS or timeout, or other socket errors) occurring while fetching data. This will be merged into any data that is fetched successfully, fixing a bug where the whole page would be empty if any fetch operation encountered such an error.

### Patch Changes

- 9ce7866ecd: Updated dependency `@kubernetes/client-node` to `0.18.0`.
- b585179770: Added Kubernetes proxy API route to backend Kubernetes plugin, allowing Backstage plugin developers to read/write new information from Kubernetes (if proper credentials are provided).
- Updated dependencies
  - @backstage/catalog-model@1.1.4

## 0.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.4-next.1

## 0.4.5-next.0

### Patch Changes

- b585179770: Added Kubernetes proxy API route to backend Kubernetes plugin, allowing Backstage plugin developers to read/write new information from Kubernetes (if proper credentials are provided).
- Updated dependencies
  - @backstage/catalog-model@1.1.4-next.0

## 0.4.4

### Patch Changes

- cfb30b700c: Pin `@kubernetes/client-node` version to `0.17.0`.
- cbf5d11fdf: The Kubernetes errors when fetching pod metrics are now captured and returned to the frontend.

  - **BREAKING** The method `fetchPodMetricsByNamespace` in the interface `KubernetesFetcher` is changed to `fetchPodMetricsByNamespaces`. It now accepts a set of namespace strings and returns `Promise<FetchResponseWrapper>`.
  - Add the `PodStatusFetchResponse` to the `FetchResponse` union type.
  - Add `NOT_FOUND` to the `KubernetesErrorTypes` union type, the HTTP error with status code 404 will be mapped to this error.

- Updated dependencies
  - @backstage/catalog-model@1.1.3

## 0.4.4-next.1

### Patch Changes

- cfb30b700c: Pin `@kubernetes/client-node` version to `0.17.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.3-next.0

## 0.4.4-next.0

### Patch Changes

- cbf5d11fdf: The Kubernetes errors when fetching pod metrics are now captured and returned to the frontend.

  - **BREAKING** The method `fetchPodMetricsByNamespace` in the interface `KubernetesFetcher` is changed to `fetchPodMetricsByNamespaces`. It now accepts a set of namespace strings and returns `Promise<FetchResponseWrapper>`.
  - Add the `PodStatusFetchResponse` to the `FetchResponse` union type.
  - Add `NOT_FOUND` to the `KubernetesErrorTypes` union type, the HTTP error with status code 404 will be mapped to this error.

- Updated dependencies
  - @backstage/catalog-model@1.1.3-next.0

## 0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2

## 0.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.2

## 0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.1

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0

## 0.4.2

### Patch Changes

- 0768d6dece: add new kubernetes backend endpoints to kubernetes backend client
- d669d89206: Minor API signatures cleanup
- Updated dependencies
  - @backstage/catalog-model@1.1.1

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.1-next.0

## 0.4.2-next.0

### Patch Changes

- d669d89206: Minor API signatures cleanup

## 0.4.1

### Patch Changes

- 0297da83c0: Added `DaemonSets` to the default kubernetes resources.

## 0.4.0

### Minor Changes

- 0791af993f: Refactor `KubernetesObjectsProvider` with new methods, `KubernetesServiceLocator` now takes an `Entity` instead of `serviceId`

### Patch Changes

- 60e5f9fe68: Fixed the lack of `limitranges` as part of the Default Objects to fetch from the kubernetes api
- eadb3a8d2e: Updated dependency `@kubernetes/client-node` to `^0.17.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0

## 0.4.0-next.2

### Patch Changes

- eadb3a8d2e: Updated dependency `@kubernetes/client-node` to `^0.17.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.3

## 0.4.0-next.1

### Patch Changes

- 60e5f9fe68: Fixed the lack of `limitranges` as part of the Default Objects to fetch from the kubernetes api
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2

## 0.4.0-next.0

### Minor Changes

- 0791af993f: Refactor `KubernetesObjectsProvider` with new methods, `KubernetesServiceLocator` now takes an `Entity` instead of `serviceId`

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0

## 0.3.0

### Minor Changes

- 4328737af6: Add support to fetch data for Stateful Sets

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.3

## 0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.3-next.0

## 0.3.0-next.0

### Minor Changes

- 4328737af6: Add support to fetch data for Stateful Sets

## 0.2.10

### Patch Changes

- 1ef98cfe48: add Azure Identity auth provider and AKS dashboard formatter
- 447e060872: Add support for 'oidc' as authProvider for kubernetes authentication
  and adds optional 'oidcTokenProvider' config value. This will allow
  users to authenticate to kubernetes cluster using id tokens obtained
  from the configured auth provider in their backstage instance.
- Updated dependencies
  - @backstage/catalog-model@1.0.2

## 0.2.10-next.1

### Patch Changes

- 447e060872: Add support for 'oidc' as authProvider for kubernetes authentication
  and adds optional 'oidcTokenProvider' config value. This will allow
  users to authenticate to kubernetes cluster using id tokens obtained
  from the configured auth provider in their backstage instance.

## 0.2.10-next.0

### Patch Changes

- 1ef98cfe48: add Azure Identity auth provider and AKS dashboard formatter
- Updated dependencies
  - @backstage/catalog-model@1.0.2-next.0

## 0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0

## 0.2.8

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.0

## 0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.13.0

## 0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.13.0-next.0

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.12.0

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.11.0

## 0.2.4

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/catalog-model@0.10.1

## 0.2.3

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/catalog-model@0.10.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.10

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.10-next.0

## 0.2.1

### Patch Changes

- 7ac0bd2c66: implement dashboard link formatter for GKE

## 0.2.0

### Minor Changes

- c010632f88: Add pod metrics lookup and display in pod table.

  ## Backwards incompatible changes

  If your Kubernetes distribution does not have the [metrics server](https://github.com/kubernetes-sigs/metrics-server) installed,
  you will need to set the `skipMetricsLookup` config flag to `false`.

  See the [configuration docs](https://backstage.io/docs/features/kubernetes/configuration) for more details.

## 0.1.7

### Patch Changes

- 59677fadb1: Improvements to API Reference documentation

## 0.1.6

### Patch Changes

- 37dc844728: Include CronJobs and Jobs as default objects returned by the kubernetes backend and add/update relevant types.

## 0.1.5

### Patch Changes

- 193a999a80: Fixed incorrect keyword, repository directory path and entrypoints in `package.json`.
- Updated dependencies
  - @backstage/catalog-model@0.9.4

## 0.1.4

### Patch Changes

- 7a0c334707: Provide access to the Kubernetes dashboard when viewing a specific resource
- Updated dependencies
  - @backstage/catalog-model@0.9.3

## 0.1.3

### Patch Changes

- 7f24f4088: chore(deps): bump `@kubernetes/client-node` from 0.14.3 to 0.15.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0

## 0.1.1

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0

## 0.1.0

### Minor Changes

- Adds types to be shared by the backend and the front end.
