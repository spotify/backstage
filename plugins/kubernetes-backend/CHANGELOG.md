# @backstage/plugin-kubernetes-backend

## 0.21.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.15-next.0
  - @backstage/plugin-kubernetes-node@0.4.10-next.0
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 0.21.12

### Patch Changes

- 66f8cf8: Replace deprecated `createPermissionIntegrationRouter` API call with `permissionsRegistry`
- b3292fc: Declare the existing per-cluster `assumeRole` and `externalId` options in the configuration schema so schema-generated configuration forms can expose AWS IAM role authentication settings. External IDs are marked as secrets.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/catalog-client@1.16.3
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/catalog-model@1.10.2
  - @backstage/integration-aws-node@0.2.3
  - @backstage/plugin-catalog-node@2.2.6
  - @backstage/plugin-kubernetes-common@0.9.14
  - @backstage/plugin-kubernetes-node@0.4.9
  - @backstage/plugin-permission-common@0.9.12

## 0.21.12-next.2

### Patch Changes

- b3292fc: Declare the existing per-cluster `assumeRole` and `externalId` options in the configuration schema so schema-generated configuration forms can expose AWS IAM role authentication settings. External IDs are marked as secrets.

## 0.21.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1
  - @backstage/plugin-kubernetes-node@0.4.9-next.1
  - @backstage/plugin-permission-node@0.11.5-next.1

## 0.21.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/integration-aws-node@0.2.3-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-kubernetes-common@0.9.14-next.0
  - @backstage/plugin-kubernetes-node@0.4.9-next.0

## 0.21.11

### Patch Changes

- 736d84e: Use locale-insensitive Unicode casing for consistent string handling across environments.
- 1d7b704: Reject unsupported service account authentication in catalog-provided cluster definitions.
- b11c9b4: Improved entity resolution on the deprecated services endpoint.
- 5268d63: Migrated tests from MSW v1 to MSW v2.
- ad8f2a8: Added actions to get kubernetes clusters and entity resources
- 28bdf75: Improved handling of Kubernetes resource response data.
- 97a7e8e: The catalog cluster locator now validates Kubernetes API server URLs to block SSRF targets (non-public addresses, cloud metadata endpoints, and non-HTTPS URLs by default). Operators may list trusted hostnames in `dangerouslyAllowClusterUrls` on the catalog locator method to permit HTTP or non-public addresses for those hosts only (for example local minikube). Catalog entities cannot use the `serviceAccount` auth provider, cannot enable TLS verification skipping unless `dangerouslyAllowSkipTLSVerify` is set on the locator method, and only permitted annotations are passed through as auth metadata. Kubernetes API fetches no longer follow HTTP redirects automatically.
- d9a57de: Add `KubernetesWatcher` interface for streaming Kubernetes resource changes via an async iterator. The watcher is separated from `KubernetesFetcher` because watching is a long-lived streaming connection that only works with server-side auth providers. Watch supports all event types (ADDED, MODIFIED, DELETED, BOOKMARK, ERROR) with errors yielded as data rather than thrown.
- Updated dependencies
  - @backstage/catalog-client@1.16.2
  - @backstage/catalog-model@1.10.1
  - @backstage/config@1.3.9
  - @backstage/plugin-kubernetes-node@0.4.8
  - @backstage/plugin-kubernetes-common@0.9.13
  - @backstage/plugin-permission-node@0.11.4
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/integration-aws-node@0.2.2
  - @backstage/plugin-catalog-node@2.2.5
  - @backstage/plugin-permission-common@0.9.11

## 0.21.11-next.2

### Patch Changes

- 5268d63: Migrated tests from MSW v1 to MSW v2.
- 97a7e8e: The catalog cluster locator now validates Kubernetes API server URLs to block SSRF targets (non-public addresses, cloud metadata endpoints, and non-HTTPS URLs by default). Operators may list trusted hostnames in `dangerouslyAllowClusterUrls` on the catalog locator method to permit HTTP or non-public addresses for those hosts only (for example local minikube). Catalog entities cannot use the `serviceAccount` auth provider, cannot enable TLS verification skipping unless `dangerouslyAllowSkipTLSVerify` is set on the locator method, and only permitted annotations are passed through as auth metadata. Kubernetes API fetches no longer follow HTTP redirects automatically.
- Updated dependencies
  - @backstage/config@1.3.9-next.0
  - @backstage/plugin-kubernetes-node@0.4.8-next.2
  - @backstage/catalog-client@1.16.2-next.1
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/integration-aws-node@0.2.2-next.0
  - @backstage/plugin-permission-common@0.9.11-next.0
  - @backstage/plugin-permission-node@0.11.4-next.1
  - @backstage/plugin-kubernetes-common@0.9.13-next.1

## 0.21.11-next.1

### Patch Changes

- 1d7b704: Reject unsupported service account authentication in catalog-provided cluster definitions.
- 28bdf75: Improved handling of Kubernetes resource response data.
- Updated dependencies
  - @backstage/plugin-kubernetes-node@0.4.8-next.1
  - @backstage/plugin-permission-node@0.11.4-next.0
  - @backstage/catalog-client@1.16.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0

## 0.21.10-next.0

### Patch Changes

- b11c9b4: Improved entity resolution on the deprecated services endpoint.
- d9a57de: Add `KubernetesWatcher` interface for streaming Kubernetes resource changes via an async iterator. The watcher is separated from `KubernetesFetcher` because watching is a long-lived streaming connection that only works with server-side auth providers. Watch supports all event types (ADDED, MODIFIED, DELETED, BOOKMARK, ERROR) with errors yielded as data rather than thrown.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.13-next.0
  - @backstage/plugin-kubernetes-node@0.4.8-next.0

## 0.21.7

### Patch Changes

- 684c9b9: Fixed `AwsIamStrategy` to resolve account-specific AWS credentials when an assume role ARN is configured, enabling support for `webIdentityTokenFile` and `accountDefaults` in environments without default AWS credentials.
- c6af8ac: Added audit logging for kubernetes-backend routes. The plugin now emits auditor events for cluster list, cluster proxy, entity workload queries, custom resource queries, and the deprecated services endpoint. Administrators can filter audit logs by `eventId` values `cluster-fetch` and `resource-fetch`, and by `queryType` in event metadata.

  `KubernetesProxyOptions` accepts an optional `auditor` for adopters that construct the proxy directly. When omitted, proxy requests are handled as before without audit events.

- bac00a5: The Kubernetes API proxy now refreshes cached middleware when cluster details change, after a configurable TTL, or when the cache reaches its size limit. At startup, the backend logs a warning for each cluster configured with `skipTLSVerify: true`. Invalid cache configuration values fall back to defaults. Optional configuration is available under `kubernetes.proxy.middlewareCache`.
- f0834bd: Added a `kubernetes.clusterLocatorContinueOnError` configuration option. When set to `true`, a failing cluster locator no longer causes the entire cluster list request to fail — errors are logged and clusters from the remaining successful locators are still returned. The default is `false`, preserving the existing behavior.
- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/integration-aws-node@0.2.1
  - @backstage/plugin-permission-common@0.9.10
  - @backstage/plugin-permission-node@0.11.3
  - @backstage/plugin-catalog-node@2.2.4
  - @backstage/plugin-kubernetes-node@0.4.7

## 0.22.0-next.1

### Minor Changes

- c6af8ac: Added audit logging for kubernetes-backend routes. The plugin now emits auditor events for cluster list, cluster proxy, entity workload queries, custom resource queries, and the deprecated services endpoint. Administrators can filter audit logs by `eventId` values `cluster-fetch` and `resource-fetch`, and by `queryType` in event metadata.

  **BREAKING**: `KubernetesProxyOptions` now requires `AuditorService`.

## 0.21.7-next.0

### Patch Changes

- 684c9b9: Fixed `AwsIamStrategy` to resolve account-specific AWS credentials when an assume role ARN is configured, enabling support for `webIdentityTokenFile` and `accountDefaults` in environments without default AWS credentials.
- f0834bd: Added a `kubernetes.clusterLocatorContinueOnError` configuration option. When set to `true`, a failing cluster locator no longer causes the entire cluster list request to fail — errors are logged and clusters from the remaining successful locators are still returned. The default is `false`, preserving the existing behavior.
- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-kubernetes-node@0.4.7-next.0
  - @backstage/plugin-permission-node@0.11.3-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0

## 0.21.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/catalog-client@1.16.1
  - @backstage/plugin-catalog-node@2.2.3
  - @backstage/plugin-kubernetes-node@0.4.6
  - @backstage/plugin-permission-node@0.11.2

## 0.21.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-node@0.4.6-next.0
  - @backstage/plugin-permission-node@0.11.2-next.0
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0
  - @backstage/catalog-client@1.16.1-next.0

## 0.21.5

### Patch Changes

- 998664c: chore(deps): Bump `ws` from 8.20.0 to 8.20.1
- c4f935b: pool HTTPS agents per cluster in KubernetesFetcher
- Updated dependencies
  - @backstage/catalog-client@1.16.0
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-catalog-node@2.2.2
  - @backstage/plugin-kubernetes-node@0.4.5
  - @backstage/plugin-permission-node@0.11.1

## 0.21.5-next.0

### Patch Changes

- 998664c: chore(deps): Bump `ws` from 8.20.0 to 8.20.1
- c4f935b: pool HTTPS agents per cluster in KubernetesFetcher
- Updated dependencies
  - @backstage/catalog-client@1.16.0-next.0
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/plugin-kubernetes-node@0.4.5-next.0
  - @backstage/plugin-permission-node@0.11.1-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0

## 0.21.4

### Patch Changes

- 1ecc3ca: Fixed spelling mistakes in internal code
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/errors@1.3.1
  - @backstage/integration-aws-node@0.2.0
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/plugin-kubernetes-common@0.9.12
  - @backstage/plugin-kubernetes-node@0.4.4
  - @backstage/plugin-permission-node@0.11.0
  - @backstage/plugin-permission-common@0.9.9
  - @backstage/catalog-client@1.15.1
  - @backstage/config@1.3.8

## 0.21.4-next.1

### Patch Changes

- 1ecc3ca: Fixed spelling mistakes in internal code
- Updated dependencies
  - @backstage/integration-aws-node@0.2.0-next.1
  - @backstage/backend-plugin-api@1.9.1-next.1

## 0.21.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/plugin-kubernetes-node@0.4.4-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-client@1.15.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/integration-aws-node@0.1.22-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/plugin-permission-common@0.9.9-next.0
  - @backstage/plugin-permission-node@0.10.13-next.0
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.12-next.0

## 0.21.3

### Patch Changes

- ed6b53c: Removed bare catch-and-rethrow blocks that served no purpose.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/catalog-client@1.15.0
  - @backstage/plugin-kubernetes-node@0.4.3
  - @backstage/plugin-permission-node@0.10.12
  - @backstage/config@1.3.7
  - @backstage/integration-aws-node@0.1.21
  - @backstage/plugin-kubernetes-common@0.9.11
  - @backstage/plugin-permission-common@0.9.8

## 0.21.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-client@1.14.1-next.0
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0
  - @backstage/integration-aws-node@0.1.21-next.0
  - @backstage/plugin-permission-common@0.9.8-next.0
  - @backstage/plugin-permission-node@0.10.12-next.2
  - @backstage/plugin-kubernetes-common@0.9.11-next.0
  - @backstage/plugin-kubernetes-node@0.4.3-next.2

## 0.21.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1
  - @backstage/plugin-kubernetes-node@0.4.3-next.1
  - @backstage/plugin-permission-node@0.10.12-next.1

## 0.21.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-kubernetes-node@0.4.3-next.0
  - @backstage/plugin-permission-node@0.10.12-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/catalog-client@1.14.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.20
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.10
  - @backstage/plugin-permission-common@0.9.7

## 0.21.2

### Patch Changes

- 6b6b5de: Added `endpointType` config option to the GKE cluster locator, allowing use of DNS-based control plane endpoints instead of public IP endpoints. Set `endpointType: 'dns'` to use GKE DNS endpoints (e.g. `gke-<uid>.<region>.gke.goog`) which provide proper TLS certificates and IAM-based access control.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/catalog-client@1.14.0
  - @backstage/plugin-catalog-node@2.1.0
  - @backstage/plugin-permission-common@0.9.7
  - @backstage/plugin-permission-node@0.10.11
  - @backstage/catalog-model@1.7.7
  - @backstage/plugin-kubernetes-node@0.4.2

## 0.21.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/catalog-client@1.14.0-next.2
  - @backstage/plugin-catalog-node@2.1.0-next.2
  - @backstage/plugin-kubernetes-node@0.4.2-next.1
  - @backstage/plugin-permission-node@0.10.11-next.1

## 0.21.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.14.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.1
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.20
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.10
  - @backstage/plugin-kubernetes-node@0.4.2-next.0
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-permission-node@0.10.11-next.0

## 0.21.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-client@1.13.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.20
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.10
  - @backstage/plugin-kubernetes-node@0.4.2-next.0
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-permission-node@0.10.11-next.0

## 0.21.1

### Patch Changes

- 7455dae: Use node prefix on native imports
- ce3639c: Add PersistentVolume and PersistentVolumeClaims Rendering
- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/integration-aws-node@0.1.20
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-kubernetes-node@0.4.1
  - @backstage/plugin-kubernetes-common@0.9.10
  - @backstage/catalog-client@1.13.0
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-permission-node@0.10.10

## 0.21.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/catalog-client@1.12.2-next.0
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-kubernetes-node@0.4.1-next.1
  - @backstage/plugin-permission-node@0.10.10-next.0

## 0.21.1-next.1

### Patch Changes

- ce3639c: Add PersistentVolume and PersistentVolumeClaims Rendering
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.10-next.1
  - @backstage/plugin-kubernetes-node@0.4.1-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1

## 0.21.1-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/integration-aws-node@0.1.20-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/plugin-kubernetes-node@0.4.1-next.0
  - @backstage/plugin-permission-common@0.9.5-next.0
  - @backstage/plugin-permission-node@0.10.9-next.0
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.10-next.0

## 0.21.0

### Minor Changes

- 7f9846f: Add possibility to extends Kubernetes REST API. Add fetcher to parameters for custom objects provider

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- fb029b6: Updated luxon types
- e9589d9: Replace `@aws-sdk/signature-v4` with `@smithy/signature-v4`,
  as stated in the [package documentation](https://www.npmjs.com/package/@aws-sdk/signature-v4?activeTab=readme)
- 8fa8d87: Add Kubernetes Plugin Secrets Accordion with masked secret datas
- Updated dependencies
  - @backstage/plugin-permission-node@0.10.7
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-kubernetes-node@0.4.0
  - @backstage/plugin-kubernetes-common@0.9.9
  - @backstage/plugin-catalog-node@1.20.1

## 0.21.0-next.2

### Minor Changes

- 7f9846f: Add possibility to extends Kubernetes REST API. Add fetcher to parameters for custom objects provider

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- fb029b6: Updated luxon types
- Updated dependencies
  - @backstage/plugin-permission-node@0.10.7-next.1
  - @backstage/plugin-kubernetes-node@0.4.0-next.2
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.19
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.20.1-next.1
  - @backstage/plugin-kubernetes-common@0.9.9-next.0
  - @backstage/plugin-permission-common@0.9.3

## 0.20.5-next.1

### Patch Changes

- 8fa8d87: Add Kubernetes Plugin Secrets Accordion with masked secret datas
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.9-next.0
  - @backstage/plugin-kubernetes-node@0.3.7-next.1

## 0.20.5-next.0

### Patch Changes

- e9589d9: Replace `@aws-sdk/signature-v4` with `@smithy/signature-v4`,
  as stated in the [package documentation](https://www.npmjs.com/package/@aws-sdk/signature-v4?activeTab=readme)
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-permission-node@0.10.7-next.0
  - @backstage/plugin-kubernetes-node@0.3.7-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/config@1.3.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.8
  - @backstage/plugin-permission-common@0.9.3

## 0.20.4

### Patch Changes

- 71c22f3: Removed/moved unused dependencies
- 1906d37: Updated dependency `@kubernetes/client-node` to `1.4.0`.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-kubernetes-common@0.9.8
  - @backstage/plugin-kubernetes-node@0.3.6
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/catalog-client@1.12.1
  - @backstage/plugin-permission-node@0.10.6

## 0.20.4-next.2

### Patch Changes

- 1906d37: Updated dependency `@kubernetes/client-node` to `1.4.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.2
  - @backstage/plugin-kubernetes-common@0.9.8-next.1
  - @backstage/plugin-kubernetes-node@0.3.6-next.2

## 0.20.4-next.1

### Patch Changes

- 71c22f3: Removed/moved unused dependencies
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-permission-common@0.9.3-next.1
  - @backstage/plugin-kubernetes-node@0.3.6-next.1
  - @backstage/plugin-permission-node@0.10.6-next.1

## 0.20.4-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.9-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/integration-aws-node@0.1.19-next.0
  - @backstage/plugin-kubernetes-node@0.3.6-next.0
  - @backstage/plugin-permission-node@0.10.6-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/catalog-client@1.12.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.19.2-next.0
  - @backstage/plugin-kubernetes-common@0.9.8-next.0
  - @backstage/plugin-permission-common@0.9.3-next.0

## 0.20.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.7
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/integration-aws-node@0.1.18
  - @backstage/plugin-auth-node@0.6.8
  - @backstage/plugin-catalog-node@1.19.1
  - @backstage/plugin-kubernetes-node@0.3.5
  - @backstage/plugin-permission-common@0.9.2
  - @backstage/plugin-permission-node@0.10.5

## 0.20.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/integration-aws-node@0.1.18-next.0
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-auth-node@0.6.8-next.0
  - @backstage/plugin-permission-common@0.9.2-next.0
  - @backstage/plugin-permission-node@0.10.5-next.0
  - @backstage/plugin-kubernetes-node@0.3.5-next.1
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-kubernetes-common@0.9.7-next.1
  - @backstage/catalog-client@1.12.0

## 0.20.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.7-next.0
  - @backstage/plugin-auth-node@0.6.7
  - @backstage/plugin-kubernetes-node@0.3.5-next.0
  - @backstage/plugin-permission-node@0.10.4
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/catalog-client@1.12.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.17
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-permission-common@0.9.1

## 0.20.2

### Patch Changes

- dd7b6d2: Fix a bug where `getDefault` in the `kubernetesFetcherExtensionPoint` had the wrong `this` value
- 80cf8c9: Fix issue with default objects not being loaded properly
- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-auth-node@0.6.7
  - @backstage/catalog-client@1.12.0
  - @backstage/types@1.2.2
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/plugin-kubernetes-node@0.3.4
  - @backstage/plugin-permission-node@0.10.4

## 0.20.2-next.2

### Patch Changes

- dd7b6d2: Fix a bug where `getDefault` in the `kubernetesFetcherExtensionPoint` had the wrong `this` value
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.7-next.1
  - @backstage/catalog-client@1.12.0-next.0
  - @backstage/plugin-catalog-node@1.19.0-next.1
  - @backstage/integration-aws-node@0.1.17

## 0.20.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.7-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-permission-node@0.10.4-next.0
  - @backstage/plugin-kubernetes-node@0.3.4-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0

## 0.20.2-next.0

### Patch Changes

- 80cf8c9: Fix issue with default objects not being loaded properly
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/catalog-client@1.11.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.17
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-kubernetes-common@0.9.6
  - @backstage/plugin-kubernetes-node@0.3.3
  - @backstage/plugin-permission-common@0.9.1
  - @backstage/plugin-permission-node@0.10.3

## 0.20.0

### Minor Changes

- 759568d: **BREAKING CHANGE**: Removed support for the legacy backend system. This means that the deprecated `createRouter` and `KubernetesBuilder` and related types have been removed. Please refer to the [relevant documentation](https://backstage.io/docs/features/kubernetes/installation/#adding-kubernetes-backend-plugin) to configure the Kubernetes plugin.

  **BREAKING CHANGE**: The deprecated types `AuthenticationStrategy`, `AuthMetadata`, `ClusterDetails`, `CustomResource`, `CustomResourcesByEntity`, `FetchResponseWrapper`, `KubernetesBuilder`, `KubernetesBuilderReturn`, `KubernetesClustersSupplier`, `KubernetesCredential`, `KubernetesEnvironment`, `KubernetesFetcher`, `KubernetesObjectsProvider`, `KubernetesObjectTypes`, `KubernetesServiceLocator`,`ObjectFetchParams`, `ObjectToFetch`,`RouterOptions` and `ServiceLocatorRequestContext` should all now be imported from `@backstage/plugin-kubernetes-node`.

### Patch Changes

- 00ebaeb: Remove usage of the deprecated `loggerToWinstonLogger` from `@backstage/backend-common`.
- 79e342e: Added support for providing a factory to the extension points
- 5f424c6: Added support for Google Service account credentials config to use in GoogleServiceAccountStrategy
- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-kubernetes-node@0.3.3
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2

## 0.20.0-next.1

### Minor Changes

- 759568d: **BREAKING CHANGE**: Removed support for the legacy backend system. This means that the deprecated `createRouter` and `KubernetesBuilder` and related types have been removed. Please refer to the [relevant documentation](https://backstage.io/docs/features/kubernetes/installation/#adding-kubernetes-backend-plugin) to configure the Kubernetes plugin.

  **BREAKING CHANGE**: The deprecated types `AuthenticationStrategy`, `AuthMetadata`, `ClusterDetails`, `CustomResource`, `CustomResourcesByEntity`, `FetchResponseWrapper`, `KubernetesBuilder`, `KubernetesBuilderReturn`, `KubernetesClustersSupplier`, `KubernetesCredential`, `KubernetesEnvironment`, `KubernetesFetcher`, `KubernetesObjectsProvider`, `KubernetesObjectTypes`, `KubernetesServiceLocator`,`ObjectFetchParams`, `ObjectToFetch`,`RouterOptions` and `ServiceLocatorRequestContext` should all now be imported from `@backstage/plugin-kubernetes-node`.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-node@0.3.3-next.0

## 0.19.9-next.0

### Patch Changes

- 00ebaeb: Remove usage of the deprecated `loggerToWinstonLogger` from `@backstage/backend-common`.
- Updated dependencies
  - @backstage/catalog-client@1.11.0-next.0
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/plugin-kubernetes-node@0.3.3-next.0
  - @backstage/plugin-auth-node@0.6.6-next.0
  - @backstage/plugin-permission-node@0.10.3-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.17
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.6
  - @backstage/plugin-permission-common@0.9.1

## 0.19.8

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/plugin-permission-common@0.9.1
  - @backstage/plugin-kubernetes-node@0.3.2
  - @backstage/plugin-permission-node@0.10.2
  - @backstage/catalog-model@1.7.5
  - @backstage/catalog-client@1.10.2
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/integration-aws-node@0.1.17
  - @backstage/plugin-auth-node@0.6.5
  - @backstage/plugin-catalog-node@1.17.2
  - @backstage/plugin-kubernetes-common@0.9.6

## 0.19.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/plugin-permission-common@0.9.1-next.0
  - @backstage/plugin-kubernetes-node@0.3.2-next.0
  - @backstage/plugin-permission-node@0.10.2-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/catalog-client@1.10.2-next.0
  - @backstage/integration-aws-node@0.1.17-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-auth-node@0.6.5-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0
  - @backstage/plugin-kubernetes-common@0.9.6-next.0

## 0.19.7

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/plugin-auth-node@0.6.4
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.16
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.5
  - @backstage/plugin-kubernetes-node@0.3.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.1

## 0.19.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/plugin-auth-node@0.6.4-next.1
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.16
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.5
  - @backstage/plugin-kubernetes-node@0.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.1-next.1

## 0.19.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-auth-node@0.6.4-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0
  - @backstage/plugin-kubernetes-node@0.3.1-next.0
  - @backstage/plugin-permission-node@0.10.1-next.0

## 0.19.6

### Patch Changes

- f6f692c: Changed logging of cluster details to debug to minimise log clutter.
- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-kubernetes-node@0.3.0
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/plugin-auth-node@0.6.3
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/plugin-permission-common@0.9.0
  - @backstage/plugin-permission-node@0.10.0
  - @backstage/plugin-kubernetes-common@0.9.5
  - @backstage/integration-aws-node@0.1.16
  - @backstage/catalog-client@1.10.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.19.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.2
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.16-next.0
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.17.0-next.2
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/plugin-kubernetes-node@0.3.0-next.2
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.2

## 0.19.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration-aws-node@0.1.16-next.0
  - @backstage/config@1.3.2
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/plugin-kubernetes-node@0.3.0-next.1
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/plugin-permission-common@0.9.0-next.0

## 0.19.6-next.1

### Patch Changes

- f6f692c: Changed logging of cluster details to debug to minimise log clutter.
- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-kubernetes-node@0.3.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1

## 0.19.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-auth-node@0.6.3-next.0
  - @backstage/plugin-kubernetes-node@0.2.6-next.0
  - @backstage/plugin-permission-node@0.9.2-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.4
  - @backstage/plugin-permission-common@0.8.4

## 0.19.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/plugin-auth-node@0.6.2
  - @backstage/plugin-kubernetes-node@0.2.5
  - @backstage/plugin-permission-node@0.9.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.4
  - @backstage/plugin-permission-common@0.8.4

## 0.19.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-kubernetes-common@0.9.4
  - @backstage/plugin-kubernetes-node@0.2.4
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.9.0

## 0.19.4

### Patch Changes

- d517d13: refactor: use `KUBERNETES_ANNOTATION` and `KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION` annotations from `kubernetes-common`
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.4
  - @backstage/plugin-permission-node@0.9.0
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-kubernetes-node@0.2.4
  - @backstage/plugin-permission-common@0.8.4

## 0.19.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-kubernetes-common@0.9.4-next.0
  - @backstage/plugin-kubernetes-node@0.2.4-next.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.9-next.1

## 0.19.4-next.0

### Patch Changes

- d517d13: refactor: use `KUBERNETES_ANNOTATION` and `KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION` annotations from `kubernetes-common`
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.4-next.0
  - @backstage/plugin-permission-node@0.8.9-next.0
  - @backstage/plugin-auth-node@0.6.1-next.0
  - @backstage/plugin-kubernetes-node@0.2.4-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.16.1-next.0

## 0.19.3

### Patch Changes

- ac0e1ac: Fixed the lack of `secrets` to fetch from the kubernetes api by adding option to specify additional Objects which are not part of Default Objects
- ca3da29: The `/clusters` endpoint is now protected by the `kubernetes.clusters.read` permission.
  The `/services/:serviceId` endpoint is now protected by the `kubernetes.resources.read` permission.
  The `/resources` endpoints are now protected by the `kubernetes.resources.read` permission.
- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-catalog-node@1.16.0
  - @backstage/plugin-kubernetes-common@0.9.3
  - @backstage/plugin-kubernetes-node@0.2.3
  - @backstage/plugin-auth-node@0.6.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.8.4

## 0.19.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/plugin-permission-node@0.8.8-next.2
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/plugin-auth-node@0.6.0-next.2
  - @backstage/plugin-kubernetes-node@0.2.3-next.2
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.3-next.1
  - @backstage/plugin-permission-common@0.8.4

## 0.19.3-next.2

### Patch Changes

- ca3da29: The `/clusters` endpoint is now protected by the `kubernetes.clusters.read` permission.
  The `/services/:serviceId` endpoint is now protected by the `kubernetes.resources.read` permission.
  The `/resources` endpoints are now protected by the `kubernetes.resources.read` permission.
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/plugin-auth-node@0.6.0-next.1
  - @backstage/plugin-kubernetes-common@0.9.3-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.0-next.2
  - @backstage/plugin-kubernetes-node@0.2.3-next.1
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.8-next.1

## 0.19.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/plugin-kubernetes-node@0.2.3-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.5.7-next.0
  - @backstage/plugin-kubernetes-common@0.9.3-next.0
  - @backstage/plugin-permission-common@0.8.4
  - @backstage/plugin-permission-node@0.8.8-next.0

## 0.19.3-next.0

### Patch Changes

- ac0e1ac: Fixed the lack of `secrets` to fetch from the kubernetes api by adding option to specify additional Objects which are not part of Default Objects
- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8-next.0
  - @backstage/plugin-kubernetes-common@0.9.3-next.0
  - @backstage/plugin-kubernetes-node@0.2.3-next.0
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.5.7-next.0
  - @backstage/plugin-permission-common@0.8.4

## 0.19.2

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-node@0.8.7
  - @backstage/plugin-auth-node@0.5.6
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-catalog-node@1.15.1
  - @backstage/plugin-kubernetes-common@0.9.2
  - @backstage/plugin-kubernetes-node@0.2.2
  - @backstage/plugin-permission-common@0.8.4

## 0.19.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.1
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/plugin-kubernetes-common@0.9.2-next.0
  - @backstage/plugin-kubernetes-node@0.2.2-next.1
  - @backstage/plugin-permission-common@0.8.4-next.0
  - @backstage/integration-aws-node@0.1.15-next.0
  - @backstage/plugin-permission-node@0.8.7-next.1
  - @backstage/catalog-client@1.9.1-next.0

## 0.19.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.8.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-client@1.9.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/integration-aws-node@0.1.14
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-node@1.15.1-next.0
  - @backstage/plugin-kubernetes-common@0.9.1
  - @backstage/plugin-kubernetes-node@0.2.2-next.0
  - @backstage/plugin-permission-common@0.8.3

## 0.19.1

### Patch Changes

- cbfc69e: Create a `dev/index.ts` entrypoint for `yarn start`
- 928db6a: Support fetch pod metrics with custom resources
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/catalog-client@1.9.0
  - @backstage/plugin-permission-node@0.8.6
  - @backstage/errors@1.2.6
  - @backstage/plugin-kubernetes-node@0.2.1
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/integration-aws-node@0.1.14
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.1
  - @backstage/plugin-permission-common@0.8.3

## 0.19.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-permission-node@0.8.6-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-kubernetes-node@0.2.1-next.2
  - @backstage/plugin-auth-node@0.5.5-next.2
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/catalog-client@1.9.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/integration-aws-node@0.1.14-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.1-next.0
  - @backstage/plugin-permission-common@0.8.3-next.0

## 0.19.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/catalog-client@1.9.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/plugin-permission-node@0.8.6-next.1
  - @backstage/plugin-kubernetes-node@0.2.1-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/integration-aws-node@0.1.13
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.0
  - @backstage/plugin-permission-common@0.8.2

## 0.19.1-next.0

### Patch Changes

- cbfc69e: Create a `dev/index.ts` entrypoint for `yarn start`
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/catalog-client@1.8.1-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/integration-aws-node@0.1.13
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-node@1.14.1-next.0
  - @backstage/plugin-kubernetes-common@0.9.0
  - @backstage/plugin-kubernetes-node@0.2.1-next.0
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/plugin-permission-node@0.8.6-next.0

## 0.19.0

### Minor Changes

- 71b8704: Bumping @kubernetes/client-node to 1.0.0-rc7 to mitigate CVEs related to the request and tough-cookie packages

### Patch Changes

- bee9664: Adapted the config.d.ts for custom k8s cluster authProvider implementations
- Updated dependencies
  - @backstage/catalog-client@1.8.0
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0
  - @backstage/integration-aws-node@0.1.13
  - @backstage/plugin-kubernetes-common@0.9.0
  - @backstage/plugin-kubernetes-node@0.2.0
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5
  - @backstage/plugin-permission-node@0.8.5

## 0.19.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/integration-aws-node@0.1.13-next.0
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/plugin-kubernetes-common@0.9.0-next.0
  - @backstage/plugin-kubernetes-node@0.2.0-next.2
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.2

## 0.19.0-next.2

### Patch Changes

- bee9664: Adapted the config.d.ts for custom k8s cluster authProvider implementations
- Updated dependencies
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.9.0-next.0
  - @backstage/plugin-kubernetes-node@0.2.0-next.2
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.2

## 0.19.0-next.1

### Minor Changes

- 71b8704: Bumping @kubernetes/client-node to 1.0.0-rc7 to mitigate CVEs related to the request and tough-cookie packages

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.0-next.0
  - @backstage/plugin-kubernetes-node@0.2.0-next.1
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.4-next.1
  - @backstage/plugin-catalog-node@1.14.0-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.1

## 0.18.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3
  - @backstage/plugin-kubernetes-node@0.1.21-next.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.5-next.0

## 0.18.7

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/plugin-kubernetes-node@0.1.20
  - @backstage/plugin-permission-node@0.8.4
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/catalog-client@1.7.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3
  - @backstage/plugin-permission-common@0.8.1

## 0.18.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3
  - @backstage/plugin-kubernetes-node@0.1.20-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1

## 0.18.7-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-kubernetes-node@0.1.20-next.0
  - @backstage/plugin-permission-node@0.8.4-next.0
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-kubernetes-common@0.8.3
  - @backstage/plugin-permission-common@0.8.1

## 0.18.6

### Patch Changes

- a0f1f0d: Bump the `ws` library
- f55f8bf: The `KubernetesBuilder` and its related types has been marked as deprecared. This backend should instead be initialized using the new backend system.
- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- ca96b66: Skip start without proper config
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/catalog-model@1.7.0
  - @backstage/catalog-client@1.7.0
  - @backstage/plugin-permission-node@0.8.3
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/plugin-kubernetes-node@0.1.19
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3
  - @backstage/plugin-permission-common@0.8.1

## 0.18.6-next.2

### Patch Changes

- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-client@1.7.0-next.1
  - @backstage/plugin-kubernetes-node@0.1.19-next.2
  - @backstage/plugin-permission-node@0.8.3-next.2
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.12.7-next.2
  - @backstage/plugin-kubernetes-common@0.8.2
  - @backstage/plugin-permission-common@0.8.1

## 0.18.6-next.1

### Patch Changes

- ca96b66: Skip start without proper config
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/catalog-client@1.6.7-next.0
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.12.7-next.1
  - @backstage/plugin-kubernetes-common@0.8.2
  - @backstage/plugin-kubernetes-node@0.1.19-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.3-next.1

## 0.18.6-next.0

### Patch Changes

- f55f8bf: The `KubernetesBuilder` and its related types has been marked as deprecared. This backend should instead be initialized using the new backend system.
- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-permission-node@0.8.3-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-kubernetes-node@0.1.19-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/plugin-catalog-node@1.12.7-next.0
  - @backstage/catalog-client@1.6.6
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.2
  - @backstage/plugin-permission-common@0.8.1

## 0.18.4

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- b63d378: Update internal imports
- 8c1aa06: Add `kubernetes.clusterLocatorMethods[].clusters[].customResources` to the configuration schema.
  This was already documented and supported by the plugin.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-kubernetes-node@0.1.17
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/plugin-permission-node@0.8.1
  - @backstage/plugin-catalog-node@1.12.5
  - @backstage/catalog-model@1.6.0
  - @backstage/catalog-client@1.6.6
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.2

## 0.18.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/catalog-client@1.6.6-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.0-next.3
  - @backstage/plugin-catalog-node@1.12.5-next.3
  - @backstage/plugin-kubernetes-common@0.8.2-next.2
  - @backstage/plugin-kubernetes-node@0.1.17-next.3
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/plugin-permission-node@0.8.1-next.3

## 0.18.4-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- 8c1aa06: Add `kubernetes.clusterLocatorMethods[].clusters[].customResources` to the configuration schema.
  This was already documented and supported by the plugin.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-kubernetes-node@0.1.17-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/plugin-permission-node@0.8.1-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.2
  - @backstage/plugin-kubernetes-common@0.8.2-next.1
  - @backstage/integration-aws-node@0.1.12
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.18.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1-next.0
  - @backstage/plugin-permission-node@0.8.1-next.1
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-catalog-node@1.12.5-next.1
  - @backstage/plugin-kubernetes-common@0.8.2-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.1
  - @backstage/plugin-kubernetes-node@0.1.17-next.1

## 0.18.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.0
  - @backstage/plugin-kubernetes-common@0.8.1
  - @backstage/plugin-kubernetes-node@0.1.17-next.0
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-permission-node@0.8.1-next.0

## 0.18.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-permission-node@0.8.0
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/plugin-catalog-node@1.12.4
  - @backstage/plugin-kubernetes-node@0.1.16
  - @backstage/plugin-kubernetes-common@0.8.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.18.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.17-next.1
  - @backstage/plugin-catalog-node@1.12.4-next.1
  - @backstage/plugin-kubernetes-common@0.8.0
  - @backstage/plugin-kubernetes-node@0.1.16-next.1
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-permission-node@0.7.33-next.1

## 0.18.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/plugin-catalog-node@1.12.3-next.0
  - @backstage/plugin-kubernetes-node@0.1.15-next.0
  - @backstage/plugin-permission-node@0.7.32-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.0
  - @backstage/plugin-permission-common@0.7.14

## 0.18.0

### Minor Changes

- 0177f75: Update kubernetes plugins to use autoscaling/v2

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/plugin-catalog-node@1.12.1
  - @backstage/plugin-permission-node@0.7.30
  - @backstage/plugin-kubernetes-common@0.8.0
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-kubernetes-node@0.1.13
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.18.0-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/plugin-kubernetes-common@0.8.0-next.1
  - @backstage/plugin-permission-common@0.7.14-next.0
  - @backstage/plugin-kubernetes-node@0.1.13-next.3
  - @backstage/plugin-permission-node@0.7.30-next.3
  - @backstage/plugin-catalog-node@1.12.1-next.2
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.18.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-permission-node@0.7.30-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/plugin-catalog-node@1.12.1-next.1
  - @backstage/plugin-kubernetes-node@0.1.13-next.2
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.0-next.0
  - @backstage/plugin-permission-common@0.7.13

## 0.18.0-next.1

### Minor Changes

- 0177f75: Update kubernetes plugins to use autoscaling/v2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/plugin-permission-node@0.7.30-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-kubernetes-common@0.8.0-next.0
  - @backstage/plugin-auth-node@0.4.14-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/plugin-kubernetes-node@0.1.13-next.1

## 0.17.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-kubernetes-node@0.1.13-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/plugin-permission-node@0.7.30-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.6
  - @backstage/plugin-permission-common@0.7.13

## 0.17.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-auth-node@0.4.13
  - @backstage/catalog-client@1.6.5
  - @backstage/plugin-kubernetes-common@0.7.6
  - @backstage/plugin-kubernetes-node@0.1.12
  - @backstage/plugin-permission-node@0.7.29

## 0.17.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0-next.2
  - @backstage/backend-common@0.22.0-next.2

## 0.17.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-kubernetes-node@0.1.12-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/plugin-permission-node@0.7.29-next.1
  - @backstage/plugin-catalog-node@1.11.2-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.17.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-kubernetes-node@0.1.12-next.0
  - @backstage/catalog-client@1.6.5-next.0
  - @backstage/plugin-catalog-node@1.11.2-next.0
  - @backstage/plugin-kubernetes-common@0.7.6-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-permission-node@0.7.29-next.0

## 0.17.0

### Minor Changes

- 6c19c14: **BREAKING**: `KubernetesProxy` now requires the `DiscoveryService` to be passed to the constuctor
- 5dd8177: **BREAKING** Winston logger has been replaced with `LoggerService`

### Patch Changes

- f5cec55: Fixing issue where `BackstageCredentials` were not properly forwarded for all calls
- dd269e9: Fixed a bug where the proxy handler did not properly handle a missing header
- 9d89aed: Fixed a crash reading `credentials` from `undefined`.
- e5a2ccc: Updated dependency `@types/http-proxy-middleware` to `^1.0.0`.
- Updated dependencies
  - @backstage/plugin-kubernetes-node@0.1.11
  - @backstage/backend-common@0.21.7
  - @backstage/plugin-permission-node@0.7.28
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/catalog-client@1.6.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-catalog-node@1.11.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5
  - @backstage/plugin-permission-common@0.7.13

## 0.17.0-next.1

### Minor Changes

- 6c19c14: **BREAKING**: `KubernetesProxy` now requires the `DiscoveryService` to be passed to the constuctor

### Patch Changes

- f5cec55: Fixing issue where `BackstageCredentials` were not properly forwarded for all calls
- Updated dependencies
  - @backstage/plugin-kubernetes-node@0.1.11-next.1
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/catalog-client@1.6.4-next.0
  - @backstage/plugin-permission-node@0.7.28-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.11.1-next.1
  - @backstage/plugin-kubernetes-common@0.7.5
  - @backstage/plugin-permission-common@0.7.13

## 0.16.4-next.0

### Patch Changes

- 9d89aed: Fixed a crash reading `credentials` from `undefined`.
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/plugin-kubernetes-node@0.1.11-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/catalog-client@1.6.3
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.12-next.0
  - @backstage/plugin-catalog-node@1.11.1-next.0
  - @backstage/plugin-kubernetes-common@0.7.5
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-permission-node@0.7.28-next.0

## 0.16.3

### Patch Changes

- 9b1abac: Added a new service locator `CatalogRelationServiceLocator` that only returns clusters an entity lists in `relations.dependsOn`.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.11.0
  - @backstage/catalog-client@1.6.3
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-common@0.21.6
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-kubernetes-node@0.1.10
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-permission-node@0.7.27
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5
  - @backstage/plugin-permission-common@0.7.13

## 0.16.2

### Patch Changes

- 9b1abac: Added a new service locator `CatalogRelationServiceLocator` that only returns clusters an entity lists in `relations.dependsOn`.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.10.0
  - @backstage/catalog-client@1.6.2
  - @backstage/backend-common@0.21.5
  - @backstage/integration-aws-node@0.1.11
  - @backstage/plugin-kubernetes-node@0.1.9
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/plugin-permission-node@0.7.26
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5
  - @backstage/plugin-permission-common@0.7.13

## 0.16.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.9.0
  - @backstage/plugin-kubernetes-node@0.1.8

## 0.16.0

### Minor Changes

- e1e540c: **BREAKING**: The `KubernetesBuilder.createBuilder` method now requires the `discovery` service to be forwarded from the plugin environment. This is part of the migration to support new auth services.

### Patch Changes

- b9a0888: Fixed a bug in the proxy endpoint. Now when the `serviceAccount` strategy is used and no `serviceAccountToken` has been provided, the proxy endpoint assumes backstage is running on Kubernetes and gets the URL and CA from the Pod instance.
- 69d0217: Pass user credentials when calling catalog get entities api.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-catalog-node@1.8.0
  - @backstage/plugin-kubernetes-node@0.1.8
  - @backstage/catalog-client@1.6.1
  - @backstage/plugin-permission-node@0.7.25
  - @backstage/plugin-kubernetes-common@0.7.5
  - @backstage/catalog-model@1.4.5
  - @backstage/integration-aws-node@0.1.10
  - @backstage/types@1.1.1

## 0.16.0-next.2

### Patch Changes

- b9a0888: Fixed a bug in the proxy endpoint. Now when the `serviceAccount` strategy is used and no `serviceAccountToken` has been provided, the proxy endpoint assumes backstage is running on Kubernetes and gets the URL and CA from the Pod instance.
- Updated dependencies
  - @backstage/catalog-client@1.6.1-next.1
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-kubernetes-node@0.1.8-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/plugin-catalog-node@1.8.0-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/integration-aws-node@0.1.10-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.2

## 0.16.0-next.1

### Patch Changes

- 69d0217: Pass user credentials when calling catalog get entities api.
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-kubernetes-node@0.1.8-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration-aws-node@0.1.10-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## 0.16.0-next.0

### Minor Changes

- e1e540c: **BREAKING**: The `KubernetesBuilder.createBuilder` method now requires the `discovery` service to be forwarded from the plugin environment. This is part of the migration to support new auth services.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-permission-common@0.7.13-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.0
  - @backstage/plugin-permission-node@0.7.24-next.0
  - @backstage/plugin-kubernetes-common@0.7.5-next.0
  - @backstage/plugin-kubernetes-node@0.1.7-next.0
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration-aws-node@0.1.10-next.0
  - @backstage/types@1.1.1

## 0.15.0

### Minor Changes

- 666eff5: **BREAKING** The backend will fail to start if two clusters in the app-config
  have the same name. The requirement for unique names has been declared in the
  docs for some time, but is now enforced.

### Patch Changes

- 7233f57: Fixed an issue where a misleading error message would be logged when an
  unsupported service locator method was specified.
- afe9473: The `/clusters` API now surfaces cluster titles.
- a775596: Enabled a way to include custom auth metadata info on the clusters endpoint. If you want to implement a Kubernetes auth strategy which requires surfacing custom auth metadata to the frontend, use the new presentAuthMetadata method on the AuthenticationStrategy interface.
- 7278d80: The purpose of this patch is to add a new login method which is `googleServiceAccount` configuring the kubernetes properties in the app-config.yaml file with authProvider key
- 2a50cbf: adds a x-goog-api-client header to existing API requests in this plugin to clearly identify API requests from this GKE plugin. headers are formatted as follows where `libVersion` represents the current dotted version number of the Backstage GKE plugin and `libName` represent the current Google API used at backstage.
- 3b3d549: Responses from the `/api/kubernetes/services/:serviceId` endpoint now include the cluster title.
- a2e7fc6: Organized imports in plugin.ts
- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- daad576: Clusters configured with the `aws` authentication strategy can now customize the
  `x-k8s-aws-id` header value used to generate tokens. This value can be specified
  specified via the `kubernetes.io/x-k8s-aws-id` parameter (in
  `metadata.annotations` for clusters in the catalog, or the `authMetadata` block
  on clusters in the app-config). This is particularly helpful when a Backstage
  instance contains multiple AWS clusters with the same name in different regions
  -- using this new parameter, the clusters can be given different logical names
  to distinguish them but still use the same ID for the purposes of generating
  tokens.
- f180cba: Enabling authentication to kubernetes clusters with mTLS x509 client certs
- 7f6ff25: Custom per-cluster auth metadata (mainly for use with custom `AuthenticationStrategy` implementations) can now be specified in the `authMetadata` property of clusters in the app-config.
- 6009d2a: Clusters in the catalog can now specify a human-readable title via `metadata.title`.
- 7ee5b30: Clusters in the app-config can now specify a `title` property for human readability.
- 1c3cb3b: Backstage will log a warning whenever duplicate cluster names are detected --
  even if clusters sharing the same name come from separate locators.
- ceda378: On LocalKubectlProxyClusterLocator, when resolving localhost, IPv4 address is placed before IPv6 address, ignoring the order from the DNS resolver. This change is necessary since by default kubectl proxy listen on IPv4
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/plugin-kubernetes-common@0.7.4
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/catalog-model@1.4.4
  - @backstage/integration-aws-node@0.1.9
  - @backstage/plugin-kubernetes-node@0.1.4
  - @backstage/catalog-client@1.6.0
  - @backstage/plugin-catalog-node@1.7.0
  - @backstage/plugin-permission-node@0.7.21
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 0.15.0-next.3

### Patch Changes

- afe9473: The `/clusters` API now surfaces cluster titles.
- 2a50cbf: adds a x-goog-api-client header to existing API requests in this plugin to clearly identify API requests from this GKE plugin. headers are formatted as follows where `libVersion` represents the current dotted version number of the Backstage GKE plugin and `libName` represent the current Google API used at backstage.
- 3b3d549: Responses from the `/api/kubernetes/services/:serviceId` endpoint now include the cluster title.
- a2e7fc6: Organized imports in plugin.ts
- 6009d2a: Clusters in the catalog can now specify a human-readable title via `metadata.title`.
- 7ee5b30: Clusters in the app-config can now specify a `title` property for human readability.
- ceda378: On LocalKubectlProxyClusterLocator, when resolving localhost, IPv4 address is placed before IPv6 address, ignoring the order from the DNS resolver. This change is necessary since by default kubectl proxy listen on IPv4
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/plugin-kubernetes-common@0.7.4-next.2
  - @backstage/integration-aws-node@0.1.9-next.0
  - @backstage/plugin-kubernetes-node@0.1.4-next.3
  - @backstage/plugin-catalog-node@1.6.2-next.3
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/plugin-permission-node@0.7.21-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 0.15.0-next.2

### Minor Changes

- 666eff5: **BREAKING** The backend will fail to start if two clusters in the app-config
  have the same name. The requirement for unique names has been declared in the
  docs for some time, but is now enforced.

### Patch Changes

- 1c3cb3b: Backstage will log a warning whenever duplicate cluster names are detected --
  even if clusters sharing the same name come from separate locators.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/plugin-kubernetes-node@0.1.4-next.2
  - @backstage/plugin-permission-node@0.7.21-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/config@1.1.1
  - @backstage/integration-aws-node@0.1.8
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.4-next.1
  - @backstage/plugin-permission-common@0.7.12

## 0.14.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/plugin-kubernetes-node@0.1.4-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.4-next.1
  - @backstage/plugin-catalog-node@1.6.2-next.1
  - @backstage/plugin-kubernetes-common@0.7.4-next.1
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-permission-node@0.7.21-next.1

## 0.14.2-next.0

### Patch Changes

- 7233f57: Fixed an issue where a misleading error message would be logged when an
  unsupported service locator method was specified.
- a775596: Enabled a way to include custom auth metadata info on the clusters endpoint. If you want to implement a Kubernetes auth strategy which requires surfacing custom auth metadata to the frontend, use the new presentAuthMetadata method on the AuthenticationStrategy interface.
- 7278d80: The purpose of this patch is to add a new login method which is `googleServiceAccount` configuring the kubernetes properties in the app-config.yaml file with authProvider key
- daad576: Clusters configured with the `aws` authentication strategy can now customize the
  `x-k8s-aws-id` header value used to generate tokens. This value can be specified
  specified via the `kubernetes.io/x-k8s-aws-id` parameter (in
  `metadata.annotations` for clusters in the catalog, or the `authMetadata` block
  on clusters in the app-config). This is particularly helpful when a Backstage
  instance contains multiple AWS clusters with the same name in different regions
  -- using this new parameter, the clusters can be given different logical names
  to distinguish them but still use the same ID for the purposes of generating
  tokens.
- f180cba: Enabling authentication to kubernetes clusters with mTLS x509 client certs
- 7f6ff25: Custom per-cluster auth metadata (mainly for use with custom `AuthenticationStrategy` implementations) can now be specified in the `authMetadata` property of clusters in the app-config.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-kubernetes-node@0.1.4-next.0
  - @backstage/catalog-client@1.6.0-next.0
  - @backstage/plugin-kubernetes-common@0.7.4-next.0
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/plugin-permission-node@0.7.21-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 0.14.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/catalog-client@1.5.2
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-kubernetes-common@0.7.3
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-permission-node@0.7.20
  - @backstage/plugin-auth-node@0.4.3
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-node@0.1.3

## 0.14.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-auth-node@0.4.3-next.2
  - @backstage/plugin-catalog-node@1.6.1-next.2
  - @backstage/plugin-kubernetes-node@0.1.3-next.2
  - @backstage/plugin-permission-node@0.7.20-next.2

## 0.14.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration-aws-node@0.1.8
  - @backstage/config@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/plugin-permission-node@0.7.20-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.6.1-next.1
  - @backstage/plugin-kubernetes-common@0.7.3-next.0
  - @backstage/plugin-kubernetes-node@0.1.3-next.1
  - @backstage/plugin-permission-common@0.7.11

## 0.14.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/plugin-kubernetes-common@0.7.3-next.0
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.0
  - @backstage/plugin-kubernetes-node@0.1.3-next.0
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-permission-node@0.7.20-next.0

## 0.14.0

### Minor Changes

- 52050ad: You can now select `single` kubernetes cluster that the entity is part-of from all your defined kubernetes clusters, by passing `backstage.io/kubernetes-cluster` annotation with the defined cluster name.

  If you do not specify the annotation by `default it fetches all` defined kubernetes cluster.

  To apply

  catalog-info.yaml

  ```diff
  annotations:
    'backstage.io/kubernetes-id': dice-roller
    'backstage.io/kubernetes-namespace': dice-space
  + 'backstage.io/kubernetes-cluster': dice-cluster
    'backstage.io/kubernetes-label-selector': 'app=my-app,component=front-end'
  ```

### Patch Changes

- 6010564: The `kubernetes-node` plugin has been modified to house a new extension points for Kubernetes backend plugin;
  `KubernetesClusterSupplierExtensionPoint` is introduced .
  `kubernetesAuthStrategyExtensionPoint` is introduced .
  `kubernetesFetcherExtensionPoint` is introduced .
  `kubernetesServiceLocatorExtensionPoint` is introduced .

  The `kubernetes-backend` plugin was modified to use this new extension point.

- 706fc3a: Updated dependency `@kubernetes/client-node` to `0.20.0`.
- ae94d3c: Updated dependency `@aws-crypto/sha256-js` to `^5.0.0`.
- 99fb541: Updated dependency `@azure/identity` to `^4.0.0`.
- 42c1aee: Updated dependency `@google-cloud/container` to `^5.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-catalog-node@1.6.0
  - @backstage/catalog-client@1.5.0
  - @backstage/plugin-kubernetes-node@0.1.2
  - @backstage/plugin-kubernetes-common@0.7.2
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-permission-node@0.7.19
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/types@1.1.1

## 0.14.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.3
  - @backstage/plugin-catalog-node@1.6.0-next.3
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/plugin-kubernetes-node@0.1.2-next.3
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.3

## 0.14.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0-next.2
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/plugin-kubernetes-node@0.1.2-next.2
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.2

## 0.14.0-next.1

### Patch Changes

- ae94d3ce6f: Updated dependency `@aws-crypto/sha256-js` to `^5.0.0`.
- 99fb54183b: Updated dependency `@azure/identity` to `^4.0.0`.
- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-kubernetes-node@0.1.2-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1

## 0.14.0-next.0

### Minor Changes

- 52050ada6e: You can now select `single` kubernetes cluster that the entity is part-of from all your defined kubernetes clusters, by passing `backstage.io/kubernetes-cluster` annotation with the defined cluster name.

  If you do not specify the annotation by `default it fetches all` defined kubernetes cluster.

  To apply

  catalog-info.yaml

  ```diff
  annotations:
    'backstage.io/kubernetes-id': dice-roller
    'backstage.io/kubernetes-namespace': dice-space
  + 'backstage.io/kubernetes-cluster': dice-cluster
    'backstage.io/kubernetes-label-selector': 'app=my-app,component=front-end'
  ```

### Patch Changes

- 706fc3a7e1: Updated dependency `@kubernetes/client-node` to `0.20.0`.
- 42c1aee741: Updated dependency `@google-cloud/container` to `^5.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/plugin-kubernetes-common@0.7.2-next.0
  - @backstage/plugin-auth-node@0.4.2-next.0
  - @backstage/plugin-catalog-node@1.5.1-next.0
  - @backstage/plugin-permission-node@0.7.19-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-node@0.1.2-next.0
  - @backstage/plugin-permission-common@0.7.10

## 0.13.1

### Patch Changes

- 62180df4ee: Allow storing dashboard parameters for kubernetes in catalog
- df40b067e1: Fixed the lack of `resourcequotas` as part of the Default Objects to fetch from the kubernetes api
- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0
  - @backstage/plugin-kubernetes-common@0.7.1
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/integration-aws-node@0.1.8
  - @backstage/catalog-client@1.4.6
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1
  - @backstage/plugin-kubernetes-node@0.1.1
  - @backstage/plugin-permission-node@0.7.18

## 0.13.1-next.2

### Patch Changes

- [#20321](https://github.com/backstage/backstage/pull/20321) [`62180df4ee`](https://github.com/backstage/backstage/commit/62180df4ee3cb2f75459ee245d5da9c7e2342375) Thanks [@szubster](https://github.com/szubster)! - Allow storing dashboard parameters for kubernetes in catalog

- [#20951](https://github.com/backstage/backstage/pull/20951) [`df40b067e1`](https://github.com/backstage/backstage/commit/df40b067e11a015666d18c11b2247c8d86a3fee9) Thanks [@Jenson3210](https://github.com/Jenson3210)! - Fixed the lack of `resourcequotas` as part of the Default Objects to fetch from the kubernetes api

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.1-next.1
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-kubernetes-node@0.1.1-next.2
  - @backstage/plugin-auth-node@0.4.1-next.2
  - @backstage/plugin-catalog-node@1.5.0-next.2
  - @backstage/plugin-permission-node@0.7.18-next.2

## 0.13.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0-next.1
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/plugin-auth-node@0.4.1-next.1
  - @backstage/plugin-permission-node@0.7.18-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.7
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.1-next.0
  - @backstage/plugin-kubernetes-node@0.1.1-next.1
  - @backstage/plugin-permission-common@0.7.9

## 0.13.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/integration-aws-node@0.1.7
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1-next.0
  - @backstage/plugin-catalog-node@1.4.8-next.0
  - @backstage/plugin-kubernetes-common@0.7.1-next.0
  - @backstage/plugin-kubernetes-node@0.1.1-next.0
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-permission-node@0.7.18-next.0

## 0.13.0

### Minor Changes

- ae943c3bb1: **BREAKING** Allow passing undefined `labelSelector` to `KubernetesFetcher`

  `KubernetesFetch` no longer auto-adds `labelSelector` when empty string was passed.
  This is only applicable if you have custom ObjectProvider implementation, as build-in `KubernetesFanOutHandler` already does this

### Patch Changes

- cbb0e3c3f4: A new plugin has been introduced to house the extension points for Kubernetes backend plugin; at the moment only the `KubernetesObjectsProviderExtensionPoint` is present. The `kubernetes-backend` plugin was modified to use this new extension point.
- 9101c0d1b6: Updated dependency `@kubernetes/client-node` to `0.19.0`.
- 95518765ee: Add Kubernetes cluster plugin. Viewing Kubernetes clusters as an Admin from Backstage
- 5dac12e435: The kubernetes APIs invokes Authentication Strategies when Backstage-Kubernetes-Authorization-X-X headers are provided, this enable the possibility to invoke strategies that executes additional steps to get a kubernetes token like on pinniped or custom strategies
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-kubernetes-node@0.1.0
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/integration-aws-node@0.1.7
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## 0.12.3-next.2

### Patch Changes

- cbb0e3c3f4: A new plugin has been introduced to house the extension points for Kubernetes backend plugin; at the moment only the `KubernetesObjectsProviderExtensionPoint` is present. The `kubernetes-backend` plugin was modified to use this new extension point.
- 95518765ee: Add Kubernetes cluster plugin. Viewing Kubernetes clusters as an Admin from Backstage
- 5dac12e435: The kubernetes APIs invokes Authentication Strategies when Backstage-Kubernetes-Authorization-X-X headers are provided, this enable the possibility to invoke strategies that executes additional steps to get a kubernetes token like on pinniped or custom strategies
- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-auth-node@0.4.0-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/errors@1.2.3-next.0
  - @backstage/plugin-kubernetes-node@0.1.0-next.0
  - @backstage/plugin-kubernetes-common@0.7.0-next.1
  - @backstage/plugin-catalog-node@1.4.7-next.2
  - @backstage/plugin-permission-node@0.7.17-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/catalog-client@1.4.5-next.0
  - @backstage/config@1.1.1-next.0
  - @backstage/integration-aws-node@0.1.7-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9-next.0

## 0.12.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.4.6-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/plugin-kubernetes-common@0.7.0-next.0
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/plugin-auth-node@0.3.2-next.1
  - @backstage/plugin-permission-node@0.7.16-next.1
  - @backstage/config@1.1.0
  - @backstage/integration-aws-node@0.1.6
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.8

## 0.12.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.2-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/integration-aws-node@0.1.6
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.4.6-next.0
  - @backstage/plugin-kubernetes-common@0.6.6
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-permission-node@0.7.16-next.0

## 0.12.0

### Minor Changes

- 0ad36158d980: Integrators can now bring their own auth strategies through the use of the `addAuthStrategy` method on `KubernetesBuilder`.

  **BREAKING** the `ClusterDetails` interface has been refactored to add an `authMetadata` field, and the`authProvider`, `serviceAccountToken`, `assumeRole`, and `externalID` fields have all been removed -- they appear within `authMetadata` using the same keys as those read by the `catalog` cluster locator. This means that if you are using a custom cluster supplier, your code will need to be updated -- as an example, instead of returning a `ClusterDetails` like `{authProvider: 'aws'}`, you will need to return one like `{authMetadata: {['kubernetes.io/auth-provider']: 'aws'}`.

  **BREAKING** on the slight chance you were using the `setAuthTranslatorMap` method on `KubernetesBuilder`, it has been removed along with the entire `KubernetesAuthTranslator` interface. This notion has been replaced with the more focused concept of an `AuthenticationStrategy`. Converting a translator to a strategy should not be especially difficult.

### Patch Changes

- ccf00accb408: Add AWS Annotations to Kubernetes Cluster Resource
- 72390ab2670d: Handle Proxy WS upgrade manually for WS handshakes
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

- 024b2b66a332: Fixed a bug where requests to the proxy endpoint would fail for clusters with `caFile` configured
- a8a614ba0d07: Minor `package.json` update.
- 47ea122590f5: fix "undefined" kind for custom resources
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.6.6
  - @backstage/backend-common@0.19.5
  - @backstage/plugin-auth-node@0.3.0
  - @backstage/config@1.1.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.7.14
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-catalog-node@1.4.4
  - @backstage/integration-aws-node@0.1.6

## 0.11.6-next.3

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

- a8a614ba0d07: Minor `package.json` update.
- Updated dependencies
  - @backstage/catalog-client@1.4.4-next.2
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/plugin-kubernetes-common@0.6.6-next.2
  - @backstage/plugin-permission-common@0.7.8-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/plugin-permission-node@0.7.14-next.3
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/integration-aws-node@0.1.6-next.2
  - @backstage/plugin-auth-node@0.3.0-next.3
  - @backstage/plugin-catalog-node@1.4.4-next.3

## 0.11.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/integration-aws-node@0.1.6-next.1
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-kubernetes-common@0.6.6-next.1

## 0.11.6-next.1

### Patch Changes

- ccf00accb408: Add AWS Annotations to Kubernetes Cluster Resource
- 47ea122590f5: fix "undefined" kind for custom resources
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.6.6-next.0
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/integration-aws-node@0.1.6-next.0
  - @backstage/plugin-auth-node@0.3.0-next.1
  - @backstage/plugin-permission-common@0.7.8-next.0
  - @backstage/plugin-permission-node@0.7.14-next.1
  - @backstage/plugin-catalog-node@1.4.4-next.1
  - @backstage/catalog-client@1.4.4-next.0
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.11.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.0
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration-aws-node@0.1.5
  - @backstage/plugin-catalog-node@1.4.3-next.0
  - @backstage/plugin-kubernetes-common@0.6.5
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-node@0.7.13-next.0

## 0.11.3

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- bbf4e9c894b5: Fixed a bug where the proxy was not rewriting WebSocket request paths properly.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-catalog-node@1.4.1
  - @backstage/plugin-auth-node@0.2.17
  - @backstage/plugin-permission-node@0.7.11
  - @backstage/integration-aws-node@0.1.5
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-kubernetes-common@0.6.5
  - @backstage/plugin-permission-common@0.7.7

## 0.11.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## 0.11.3-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- bbf4e9c894b5: Fixed a bug where the proxy was not rewriting WebSocket request paths properly.
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-catalog-node@1.4.1-next.1
  - @backstage/plugin-auth-node@0.2.17-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/plugin-permission-node@0.7.11-next.1
  - @backstage/integration-aws-node@0.1.5
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-kubernetes-common@0.6.5
  - @backstage/plugin-permission-common@0.7.7

## 0.11.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration-aws-node@0.1.5
  - @backstage/plugin-auth-node@0.2.17-next.0
  - @backstage/plugin-catalog-node@1.4.1-next.0
  - @backstage/plugin-kubernetes-common@0.6.5
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-node@0.7.11-next.0

## 0.11.2

### Patch Changes

- 4db037c20148: Replace reference to deprecated import
- c2e530653539: Add WebSocket support to `kubernetes-backend` proxy.
- be6395601d1f: Proxy endpoint supports cluster URLs with subpath
- 47154c8ddba6: Fixed a bug where the proxy endpoint would error when used in combination with
  a local kubectl proxy process and a token-based auth strategy on-cluster.
- faac6b7425b2: Update readme with a valid link to k8s documentation
- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/plugin-catalog-node@1.4.0
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/integration-aws-node@0.1.5
  - @backstage/plugin-auth-node@0.2.16
  - @backstage/plugin-kubernetes-common@0.6.5
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-node@0.7.10

## 0.11.2-next.2

### Patch Changes

- be6395601d1f: Proxy endpoint supports cluster URLs with subpath
- 47154c8ddba6: Fixed a bug where the proxy endpoint would error when used in combination with
  a local kubectl proxy process and a token-based auth strategy on-cluster.
- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1-next.0
  - @backstage/integration-aws-node@0.1.5-next.0
  - @backstage/plugin-auth-node@0.2.16-next.0
  - @backstage/plugin-catalog-node@1.4.0-next.0
  - @backstage/plugin-kubernetes-common@0.6.5-next.0
  - @backstage/plugin-permission-common@0.7.7-next.0
  - @backstage/plugin-permission-node@0.7.10-next.0

## 0.11.2-next.1

### Patch Changes

- 4db037c20148: Replace reference to deprecated import
- c2e530653539: Add WebSocket support to `kubernetes-backend` proxy.
- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/integration-aws-node@0.1.5-next.0

## 0.11.2-next.0

### Patch Changes

- faac6b7425b2: Update readme with a valid link to k8s documentation
- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/plugin-catalog-node@1.4.0-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/integration-aws-node@0.1.5-next.0
  - @backstage/plugin-auth-node@0.2.16-next.0
  - @backstage/plugin-kubernetes-common@0.6.5-next.0
  - @backstage/plugin-permission-common@0.7.7-next.0
  - @backstage/plugin-permission-node@0.7.10-next.0

## 0.11.1

### Patch Changes

- b43e030911f2: Upgrade `@azure/identity` to support using Workload Identity to authenticate against Azure.
- 91f39df52d60: K8s proxy HEADER_KUBERNETES_CLUSTER is now optional in single-cluster setups.
- 4249f4214f9f: Fixed bug in KubernetesProxy where Host header was not propagated, leading to certificate issues
- 5f2c38c70f5b: Fix SNYK-JS-FASTXMLPARSER-5668858 (`fast-xml-parser`) by upgrading aws-sdk to at least the current latest version.
- eac59a3d0b11: Add ability for `configClusterLocator` to load cluster specific custom resources defined in your `app.config`.
- 5e4879d80f4d: Fixed wrong `pluginID` in the `kubernetes` alpha backend support, that made the `kubernetes` plugin fail with the new experimental backend.
- 73cc0deee48a: Add proposed fix dialog for pod errors
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/catalog-client@1.4.2
  - @backstage/integration-aws-node@0.1.4
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/plugin-auth-node@0.2.15
  - @backstage/plugin-catalog-node@1.3.7
  - @backstage/plugin-permission-node@0.7.9
  - @backstage/config@1.0.8
  - @backstage/plugin-kubernetes-common@0.6.4
  - @backstage/plugin-permission-common@0.7.6

## 0.11.1-next.3

### Patch Changes

- 91f39df52d60: K8s proxy HEADER_KUBERNETES_CLUSTER is now optional in single-cluster setups.
- 5f2c38c70f5b: Fix SNYK-JS-FASTXMLPARSER-5668858 (`fast-xml-parser`) by upgrading aws-sdk to at least the current latest version.
- eac59a3d0b11: Add ability for `configClusterLocator` to load cluster specific custom resources defined in your `app.config`.
- Updated dependencies
  - @backstage/integration-aws-node@0.1.4-next.1
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/catalog-client@1.4.2-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/plugin-auth-node@0.2.15-next.2
  - @backstage/plugin-catalog-node@1.3.7-next.2
  - @backstage/plugin-kubernetes-common@0.6.4-next.1
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/plugin-permission-node@0.7.9-next.2

## 0.11.1-next.2

### Patch Changes

- 4249f4214f9f: Fixed bug in KubernetesProxy where Host header was not propagated, leading to certificate issues
- 5e4879d80f4d: Fixed wrong `pluginID` in the `kubernetes` alpha backend support, that made the `kubernetes` plugin fail with the new experimental backend.
- 73cc0deee48a: Add proposed fix dialog for pod errors
- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/integration-aws-node@0.1.4-next.0

## 0.11.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/plugin-auth-node@0.2.15-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.1
  - @backstage/plugin-permission-node@0.7.9-next.1
  - @backstage/catalog-client@1.4.2-next.1
  - @backstage/integration-aws-node@0.1.4-next.0
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/plugin-kubernetes-common@0.6.4-next.0
  - @backstage/config@1.0.7

## 0.11.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.2-next.0
  - @backstage/plugin-catalog-node@1.3.7-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/integration-aws-node@0.1.3
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/plugin-auth-node@0.2.15-next.0
  - @backstage/plugin-kubernetes-common@0.6.3
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-permission-node@0.7.9-next.0

## 0.11.0

### Minor Changes

- f4114f02d49: Allow fetching pod metrics limited by a `labelSelector`.

  This is used by the Kubernetes tab on a components' page and leads to much smaller responses being received from Kubernetes, especially with larger Kubernetes clusters.

- 890988341e9: Update `aws-sdk` client from v2 to v3.

  **BREAKING**: The `AwsIamKubernetesAuthTranslator` class no longer exposes the following methods `awsGetCredentials`, `getBearerToken`, `getCredentials` and `validCredentials`. There is no replacement for these methods.

### Patch Changes

- 05f1d74539d: Kubernetes clusters now support `authProvider: aks`. When configured this way,
  the `retrieveObjectsByServiceId` action will use the `auth.aks` value in the
  request body as a bearer token to authenticate with Kubernetes.
- 3659c71c5d9: Standardize `@aws-sdk` v3 versions
- a341129b754: Fixed a bug in the Kubernetes proxy endpoint where requests to clusters configured with client-side auth providers would always fail with a 500 status.
- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/integration-aws-node@0.1.3
  - @backstage/plugin-permission-node@0.7.8
  - @backstage/plugin-kubernetes-common@0.6.3
  - @backstage/plugin-auth-node@0.2.14
  - @backstage/plugin-catalog-node@1.3.6
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-permission-common@0.7.5

## 0.11.0-next.2

### Patch Changes

- 05f1d74539d: Kubernetes clusters now support `authProvider: aks`. When configured this way,
  the `retrieveObjectsByServiceId` action will use the `auth.aks` value in the
  request body as a bearer token to authenticate with Kubernetes.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.6.3-next.0
  - @backstage/config@1.0.7
  - @backstage/integration-aws-node@0.1.2

## 0.11.0-next.1

### Minor Changes

- f4114f02d49: Allow fetching pod metrics limited by a `labelSelector`.

  This is used by the Kubernetes tab on a components' page and leads to much smaller responses being received from Kubernetes, especially with larger Kubernetes clusters.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/integration-aws-node@0.1.2

## 0.11.0-next.0

### Minor Changes

- 890988341e9: Update `aws-sdk` client from v2 to v3.

  **BREAKING**: The `AwsIamKubernetesAuthTranslator` class no longer exposes the following methods `awsGetCredentials`, `getBearerToken`, `getCredentials` and `validCredentials`. There is no replacement for these methods.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/plugin-permission-node@0.7.8-next.0
  - @backstage/plugin-auth-node@0.2.14-next.0
  - @backstage/plugin-catalog-node@1.3.6-next.0
  - @backstage/integration-aws-node@0.1.2
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-kubernetes-common@0.6.2
  - @backstage/plugin-permission-common@0.7.5

## 0.10.0

### Minor Changes

- e6c7c850129: Plugins that instantiate the `KubernetesProxy` must now provide a parameter of the type `KubernetesProxyOptions` which includes providing a `KubernetesAuthTranslator`. The `KubernetesBuilder` now builds its own `KubernetesAuthTranslatorMap` that it provides to the `KubernetesProxy`. The `DispatchingKubernetesAuthTranslator` expects a `KubernetesTranslatorMap` to be provided as a parameter. The `KubernetesBuilder` now has a method called `setAuthTranslatorMap` which allows integrators to bring their own `KubernetesAuthTranslator's` to the `KubernetesPlugin`.
- 804f6d16b0c: **BREAKING**: `KubernetesBuilder.create` now requires a `permissions` field of type `PermissionEvaluator`. The kubernetes `/proxy` endpoint now requires two tokens: the `Backstage-Kubernetes-Authorization` header should contain a bearer token for the target cluster, and the `Authorization` header should contain a backstage identity token. The kubernetes `/proxy` endpoint now requires a `Backstage-Kubernetes-Cluster` header replacing the previously required `X-Kubernetes-Cluster` header.
- 88fbb3d075a: Add support for the new plugin system to the Kubernetes plugin

### Patch Changes

- 56a28b559e5: Updated kubernetes config schema to match available options
- 75d4985f5e8: Fixes bug whereby backstage crashes when bad credentials are provided to the kubernetes plugin.
- 83d250badc6: Fix parsing error when kubernetes api is returning badly structured data.
- 76e8f08fa24: fix localKubectlProxy auth provider fetching
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/catalog-client@1.4.1
  - @backstage/plugin-permission-node@0.7.7
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-kubernetes-common@0.6.2
  - @backstage/plugin-auth-node@0.2.13
  - @backstage/plugin-catalog-node@1.3.5
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.10.0-next.3

### Patch Changes

- 56a28b559e5: Updated kubernetes config schema to match available options
- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/catalog-client@1.4.1-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-auth-node@0.2.13-next.2
  - @backstage/plugin-catalog-node@1.3.5-next.3
  - @backstage/plugin-kubernetes-common@0.6.2-next.2
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-permission-node@0.7.7-next.2

## 0.10.0-next.2

### Minor Changes

- e6c7c850129: Plugins that instantiate the `KubernetesProxy` must now provide a parameter of the type `KubernetesProxyOptions` which includes providing a `KubernetesAuthTranslator`. The `KubernetesBuilder` now builds its own `KubernetesAuthTranslatorMap` that it provides to the `KubernetesProxy`. The `DispatchingKubernetesAuthTranslator` expects a `KubernetesTranslatorMap` to be provided as a parameter. The `KubernetesBuilder` now has a method called `setAuthTranslatorMap` which allows integrators to bring their own `KubernetesAuthTranslator's` to the `KubernetesPlugin`.

### Patch Changes

- 76e8f08fa24: fix localKubectlProxy auth provider fetching
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/catalog-client@1.4.1-next.0
  - @backstage/plugin-permission-node@0.7.7-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-auth-node@0.2.13-next.2
  - @backstage/plugin-catalog-node@1.3.5-next.2
  - @backstage/plugin-kubernetes-common@0.6.2-next.1
  - @backstage/plugin-permission-common@0.7.5-next.0

## 0.10.0-next.1

### Minor Changes

- 88fbb3d075a: Add support for the new plugin system to the Kubernetes plugin

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-node@0.7.7-next.1
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-auth-node@0.2.13-next.1
  - @backstage/plugin-catalog-node@1.3.5-next.1
  - @backstage/plugin-kubernetes-common@0.6.2-next.1

## 0.10.0-next.0

### Minor Changes

- 804f6d16b0c: **BREAKING**: `KubernetesBuilder.create` now requires a `permissions` field of type `PermissionEvaluator`. The kubernetes `/proxy` endpoint now requires two tokens: the `Backstage-Kubernetes-Authorization` header should contain a bearer token for the target cluster, and the `Authorization` header should contain a backstage identity token. The kubernetes `/proxy` endpoint now requires a `Backstage-Kubernetes-Cluster` header replacing the previously required `X-Kubernetes-Cluster` header.

### Patch Changes

- 75d4985f5e8: Fixes bug whereby backstage crashes when bad credentials are provided to the kubernetes plugin.
- 83d250badc6: Fix parsing error when kubernetes api is returning badly structured data.
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/plugin-kubernetes-common@0.6.2-next.0
  - @backstage/config@1.0.7
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/plugin-auth-node@0.2.13-next.0
  - @backstage/plugin-permission-common@0.7.4
  - @backstage/plugin-permission-node@0.7.7-next.0

## 0.9.4

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/catalog-client@1.4.0
  - @backstage/plugin-auth-node@0.2.12
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/plugin-kubernetes-common@0.6.1

## 0.9.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/config@1.0.7-next.0

## 0.9.4-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/catalog-client@1.4.0-next.1
  - @backstage/plugin-auth-node@0.2.12-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/plugin-kubernetes-common@0.6.1-next.1

## 0.9.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.0-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.12-next.0
  - @backstage/plugin-kubernetes-common@0.6.1-next.0

## 0.9.3

### Patch Changes

- 2518ef5b8a: Adding new Cluster detail fields to catalogClusterLocator. Replace deprecated imports with k8s annotations from plugin-kubernetes-common.
- 7ff81f7692: Kubernetes proxy endpoint now accepts content types that are not json
- 5b7cd5580d: Moving the backend-test-utils to devDependencies.
- 628e2bd89a: Updated dependency `@kubernetes/client-node` to `0.18.1`.
- a53d06afe5: The name of the header used to specify a cluster to the proxy endpoint is now visible in the API reference.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.6.0
  - @backstage/backend-common@0.18.2
  - @backstage/catalog-model@1.2.0
  - @backstage/catalog-client@1.3.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.11

## 0.9.3-next.2

### Patch Changes

- 7ff81f7692: Kubernetes proxy endpoint now accepts content types that are not json
- Updated dependencies
  - @backstage/backend-test-utils@0.1.34-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/plugin-auth-node@0.2.11-next.2
  - @backstage/catalog-client@1.3.1-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-kubernetes-common@0.6.0-next.2

## 0.9.3-next.1

### Patch Changes

- 628e2bd89a: Updated dependency `@kubernetes/client-node` to `0.18.1`.
- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/plugin-kubernetes-common@0.6.0-next.1
  - @backstage/backend-test-utils@0.1.34-next.1
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.11-next.1

## 0.9.3-next.0

### Patch Changes

- 2518ef5b8a: Adding new Cluster detail fields to catalogClusterLocator. Replace deprecated imports with k8s annotations from plugin-kubernetes-common.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.6.0-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-test-utils@0.1.34-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/plugin-auth-node@0.2.11-next.0

## 0.9.1

### Patch Changes

- 083bf1b9fa: fixes a bug affecting clusters that have a base path in the URL. The base path was being replaced with the resource path instead of being appended
- c6f29bfcdc: Added the missing auth provider googleServiceAccount in config schema.
- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/backend-test-utils@0.1.32
  - @backstage/catalog-model@1.1.5
  - @backstage/catalog-client@1.3.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9
  - @backstage/plugin-kubernetes-common@0.5.1

## 0.9.1-next.2

### Patch Changes

- c6f29bfcdc: Added the missing auth provider googleServiceAccount in config schema.
- Updated dependencies
  - @backstage/backend-test-utils@0.1.32-next.2
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/catalog-client@1.3.0-next.2
  - @backstage/plugin-auth-node@0.2.9-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-kubernetes-common@0.5.1-next.1

## 0.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.32-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9-next.0
  - @backstage/plugin-kubernetes-common@0.5.1-next.1

## 0.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/catalog-client@1.3.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-test-utils@0.1.32-next.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.8
  - @backstage/plugin-kubernetes-common@0.5.1-next.0

## 0.9.0

### Minor Changes

- 2db8acffe7: Kubernetes plugin now gracefully surfaces transport-level errors (like DNS or timeout, or other socket errors) occurring while fetching data. This will be merged into any data that is fetched successfully, fixing a bug where the whole page would be empty if any fetch operation encountered such an error.

### Patch Changes

- 22e20b3a59: Clusters declared in the app-config can now have their CA configured via a local filesystem path using the `caFile` property.
- 9ce7866ecd: Updated dependency `@kubernetes/client-node` to `0.18.0`.
- b585179770: Added Kubernetes proxy API route to backend Kubernetes plugin, allowing Backstage plugin developers to read/write new information from Kubernetes (if proper credentials are provided).
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.5.0
  - @backstage/catalog-client@1.2.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-test-utils@0.1.31
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.8
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5

## 0.8.1-next.4

### Patch Changes

- 22e20b3a59: Clusters declared in the app-config can now have their CA configured via a local filesystem path using the `caFile` property.
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-test-utils@0.1.31-next.4
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-auth-node@0.2.8-next.3
  - @backstage/plugin-kubernetes-common@0.4.5-next.1

## 0.8.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-test-utils@0.1.31-next.3
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-auth-node@0.2.8-next.2
  - @backstage/plugin-kubernetes-common@0.4.5-next.1

## 0.8.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-test-utils@0.1.31-next.2
  - @backstage/plugin-auth-node@0.2.8-next.2
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-kubernetes-common@0.4.5-next.1

## 0.8.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/backend-test-utils@0.1.31-next.1
  - @backstage/plugin-auth-node@0.2.8-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-kubernetes-common@0.4.5-next.1

## 0.8.1-next.0

### Patch Changes

- b585179770: Added Kubernetes proxy API route to backend Kubernetes plugin, allowing Backstage plugin developers to read/write new information from Kubernetes (if proper credentials are provided).
- Updated dependencies
  - @backstage/catalog-client@1.2.0-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/backend-test-utils@0.1.31-next.0
  - @backstage/plugin-auth-node@0.2.8-next.0
  - @backstage/plugin-kubernetes-common@0.4.5-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0

## 0.8.0

### Minor Changes

- cbf5d11fdf: The Kubernetes errors when fetching pod metrics are now captured and returned to the frontend.

  - **BREAKING** The method `fetchPodMetricsByNamespace` in the interface `KubernetesFetcher` is changed to `fetchPodMetricsByNamespaces`. It now accepts a set of namespace strings and returns `Promise<FetchResponseWrapper>`.
  - Add the `PodStatusFetchResponse` to the `FetchResponse` union type.
  - Add `NOT_FOUND` to the `KubernetesErrorTypes` union type, the HTTP error with status code 404 will be mapped to this error.

### Patch Changes

- cfb30b700c: Pin `@kubernetes/client-node` version to `0.17.0`.
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/catalog-model@1.1.3
  - @backstage/plugin-auth-node@0.2.7
  - @backstage/plugin-kubernetes-common@0.4.4
  - @backstage/catalog-client@1.1.2
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.8.0-next.1

### Patch Changes

- cfb30b700c: Pin `@kubernetes/client-node` version to `0.17.0`.
- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/plugin-kubernetes-common@0.4.4-next.1
  - @backstage/plugin-auth-node@0.2.7-next.1
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.8.0-next.0

### Minor Changes

- cbf5d11fdf: The Kubernetes errors when fetching pod metrics are now captured and returned to the frontend.

  - **BREAKING** The method `fetchPodMetricsByNamespace` in the interface `KubernetesFetcher` is changed to `fetchPodMetricsByNamespaces`. It now accepts a set of namespace strings and returns `Promise<FetchResponseWrapper>`.
  - Add the `PodStatusFetchResponse` to the `FetchResponse` union type.
  - Add `NOT_FOUND` to the `KubernetesErrorTypes` union type, the HTTP error with status code 404 will be mapped to this error.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/plugin-auth-node@0.2.7-next.0
  - @backstage/plugin-kubernetes-common@0.4.4-next.0
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.7.3

### Patch Changes

- de676888bc: Added missing cluster locator configuration schema entries, for the catalog and local proxy types
- d4a8c683be: kubernetes service locator now take request context parameters
- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-auth-node@0.2.6
  - @backstage/catalog-client@1.1.1
  - @backstage/plugin-kubernetes-common@0.4.3
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2

## 0.7.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-auth-node@0.2.6-next.2
  - @backstage/catalog-client@1.1.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/plugin-kubernetes-common@0.4.3-next.2

## 0.7.3-next.1

### Patch Changes

- d4a8c683be: kubernetes service locator now take request context parameters
- Updated dependencies
  - @backstage/catalog-client@1.1.1-next.1
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/plugin-auth-node@0.2.6-next.1
  - @backstage/plugin-kubernetes-common@0.4.3-next.1

## 0.7.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/catalog-client@1.1.1-next.0
  - @backstage/plugin-kubernetes-common@0.4.3-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/plugin-auth-node@0.2.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0

## 0.7.2

### Patch Changes

- 8902c2e39d: chore: Exporting KubernetesClientProvider and everything in kubernetes-auth-translator as requested in issue #10457
- a57d29d572: Adds skipMetricsLookup to the kubernetes-backend schema
- 0768d6dece: add new kubernetes backend endpoints to kubernetes backend client
- 60b85d8ade: Updated dependency `helmet` to `^6.0.0`.

  Please note that these policies are no longer applied by default:

  helmet.contentSecurityPolicy no longer sets block-all-mixed-content directive by default
  helmet.expectCt is no longer set by default. It can, however, be explicitly enabled. It will be removed in Helmet 7.

- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-auth-node@0.2.5
  - @backstage/catalog-client@1.1.0
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1
  - @backstage/plugin-kubernetes-common@0.4.2

## 0.7.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.1.0-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/plugin-kubernetes-common@0.4.2-next.1
  - @backstage/plugin-auth-node@0.2.5-next.3

## 0.7.2-next.2

### Patch Changes

- 8902c2e39d: chore: Exporting KubernetesClientProvider and everything in kubernetes-auth-translator as requested in issue #10457
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/plugin-auth-node@0.2.5-next.2
  - @backstage/catalog-client@1.0.5-next.1

## 0.7.2-next.1

### Patch Changes

- 60b85d8ade: Updated dependency `helmet` to `^6.0.0`.

  Please note that these policies are no longer applied by default:

  helmet.contentSecurityPolicy no longer sets block-all-mixed-content directive by default
  helmet.expectCt is no longer set by default. It can, however, be explicitly enabled. It will be removed in Helmet 7.

- Updated dependencies
  - @backstage/plugin-auth-node@0.2.5-next.1
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/plugin-kubernetes-common@0.4.2-next.0

## 0.7.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/catalog-client@1.0.5-next.0
  - @backstage/plugin-auth-node@0.2.5-next.0

## 0.7.1

### Patch Changes

- 0297da83c0: Added `DaemonSets` to the default kubernetes resources.
- 0cd87cf30d: Added a new `customResources` field to the ClusterDetails interface, in order to specify (override) custom resources per cluster
- 29f782eb37: Updated dependency `@types/luxon` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/plugin-kubernetes-common@0.4.1
  - @backstage/plugin-auth-node@0.2.4

## 0.7.1-next.1

### Patch Changes

- 0cd87cf30d: Added a new `customResources` field to the ClusterDetails interface, in order to specify (override) custom resources per cluster

## 0.7.1-next.0

### Patch Changes

- 29f782eb37: Updated dependency `@types/luxon` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/plugin-auth-node@0.2.4-next.0

## 0.7.0

### Minor Changes

- f5c9730639: Add `localKubectlProxy` cluster locator method to make local development simpler to setup.

  Consolidated no-op server side auth decorators.
  The following Kubernetes auth decorators are now one class (`ServerSideKubernetesAuthProvider`):

  - `AwsKubernetesAuthProvider`
  - `AzureKubernetesAuthProvider`
  - `ServiceAccountKubernetesAuthProvider`

- 1454bf98e7: Add new endpoints to Kubernetes backend plugin

  BREAKING: Kubernetes backend plugin now depends on CatalogApi

  ```typescript
  // Import CatalogClient
  import { CatalogClient } from '@backstage/catalog-client';
  // Create new CatalogClient
  const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
  const { router } = await KubernetesBuilder.createBuilder({
    logger: env.logger,
    config: env.config,
    // Inject it into createBuilder params
    catalogApi,
  }).build();
  ```

- 0791af993f: Refactor `KubernetesObjectsProvider` with new methods, `KubernetesServiceLocator` now takes an `Entity` instead of `serviceId`

### Patch Changes

- 60e5f9fe68: Fixed the lack of `limitranges` as part of the Default Objects to fetch from the kubernetes api
- 746ec700ea: Add support for Kubernetes clusters in the catalog.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- eadb3a8d2e: Updated dependency `@kubernetes/client-node` to `^0.17.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0
  - @backstage/plugin-kubernetes-common@0.4.0
  - @backstage/catalog-client@1.0.4
  - @backstage/plugin-auth-node@0.2.3
  - @backstage/errors@1.1.0

## 0.7.0-next.3

### Minor Changes

- f5c9730639: Add `localKubectlProxy` cluster locator method to make local development simpler to setup.

  Consolidated no-op server side auth decorators.
  The following Kubernetes auth decorators are now one class (`ServerSideKubernetesAuthProvider`):

  - `AwsKubernetesAuthProvider`
  - `AzureKubernetesAuthProvider`
  - `ServiceAccountKubernetesAuthProvider`

- 1454bf98e7: Add new endpoints to Kubernetes backend plugin

  BREAKING: Kubernetes backend plugin now depends on CatalogApi

  ```typescript
  // Create new CatalogClient
  const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
  const { router } = await KubernetesBuilder.createBuilder({
    logger: env.logger,
    config: env.config,
    // Inject it into createBuilder params
    catalogApi,
  }).build();
  ```

### Patch Changes

- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- eadb3a8d2e: Updated dependency `@kubernetes/client-node` to `^0.17.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/catalog-client@1.0.4-next.2
  - @backstage/plugin-auth-node@0.2.3-next.2
  - @backstage/catalog-model@1.1.0-next.3
  - @backstage/plugin-kubernetes-common@0.4.0-next.2

## 0.7.0-next.2

### Patch Changes

- 60e5f9fe68: Fixed the lack of `limitranges` as part of the Default Objects to fetch from the kubernetes api
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.4.0-next.1
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2

## 0.7.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0

## 0.7.0-next.0

### Minor Changes

- 0791af993f: Refactor `KubernetesObjectsProvider` with new methods, `KubernetesServiceLocator` now takes an `Entity` instead of `serviceId`

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/plugin-kubernetes-common@0.4.0-next.0

## 0.6.0

### Minor Changes

- 4328737af6: Add support to fetch data for Stateful Sets from Kubernetes

### Patch Changes

- 0c70cd8e1d: cache and refresh Azure tokens to avoid excessive calls to Azure Identity
- 2aedf64ad3: Updated dependency `@google-cloud/container` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.0
  - @backstage/plugin-kubernetes-common@0.3.0
  - @backstage/catalog-model@1.0.3

## 0.6.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2

## 0.6.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-kubernetes-common@0.3.0-next.1

## 0.6.0-next.0

### Minor Changes

- 4328737af6: Add support to fetch data for Stateful Sets from Kubernetes

### Patch Changes

- 0c70cd8e1d: cache and refresh Azure tokens to avoid excessive calls to Azure Identity
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/plugin-kubernetes-common@0.3.0-next.0

## 0.5.1

### Patch Changes

- 1ef98cfe48: add Azure Identity auth provider and AKS dashboard formatter
- b9f7ffb162: Add filtering to GKE cluster locator
- 447e060872: Add support for 'oidc' as authProvider for kubernetes authentication
  and adds optional 'oidcTokenProvider' config value. This will allow
  users to authenticate to kubernetes cluster using id tokens obtained
  from the configured auth provider in their backstage instance.
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-kubernetes-common@0.2.10
  - @backstage/config@1.0.1
  - @backstage/catalog-model@1.0.2

## 0.5.1-next.2

### Patch Changes

- 447e060872: Add support for 'oidc' as authProvider for kubernetes authentication
  and adds optional 'oidcTokenProvider' config value. This will allow
  users to authenticate to kubernetes cluster using id tokens obtained
  from the configured auth provider in their backstage instance.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.2.10-next.1

## 0.5.1-next.1

### Patch Changes

- 1ef98cfe48: add Azure Identity auth provider and AKS dashboard formatter
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-kubernetes-common@0.2.10-next.0
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0

## 0.5.1-next.0

### Patch Changes

- b9f7ffb162: Add filtering to GKE cluster locator
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0

## 0.5.0

### Minor Changes

- 3d45427666: **BREAKING** Custom cluster suppliers need to cache their getClusters result

  To allow custom `KubernetesClustersSupplier` instances to refresh the list of clusters
  the `getClusters` method is now called whenever the list of clusters is needed.

  Existing `KubernetesClustersSupplier` implementations will need to ensure that `getClusters`
  can be called frequently and should return a cached result from `getClusters` instead.

  For example, here's a simple example of a custom supplier in `packages/backend/src/plugins/kubernetes.ts`:

  ```diff
  -import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
  +import {
  +  ClusterDetails,
  +  KubernetesBuilder,
  +  KubernetesClustersSupplier,
  +} from '@backstage/plugin-kubernetes-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';
  +import { Duration } from 'luxon';
  +
  +export class CustomClustersSupplier implements KubernetesClustersSupplier {
  +  constructor(private clusterDetails: ClusterDetails[] = []) {}
  +
  +  static create(refreshInterval: Duration) {
  +    const clusterSupplier = new CustomClustersSupplier();
  +    // setup refresh, e.g. using a copy of https://github.com/backstage/backstage/blob/master/plugins/search-backend-node/src/runPeriodically.ts
  +    runPeriodically(
  +      () => clusterSupplier.refreshClusters(),
  +      refreshInterval.toMillis(),
  +    );
  +    return clusterSupplier;
  +  }
  +
  +  async refreshClusters(): Promise<void> {
  +    this.clusterDetails = []; // fetch from somewhere
  +  }
  +
  +  async getClusters(): Promise<ClusterDetails[]> {
  +    return this.clusterDetails;
  +  }
  +}

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
  -  const { router } = await KubernetesBuilder.createBuilder({
  +  const builder = await KubernetesBuilder.createBuilder({
       logger: env.logger,
       config: env.config,
  -  }).build();
  +  });
  +  builder.setClusterSupplier(
  +    CustomClustersSupplier.create(Duration.fromObject({ minutes: 60 })),
  +  );
  +  const { router } = await builder.build();
  ```

### Patch Changes

- 753a20c89e: Add kubernetes namespace annotation `backstage.io/kubernetes-namespace` to allow namespaced Kubernetes resources fetches
- Updated dependencies
  - @backstage/catalog-model@1.0.1
  - @backstage/backend-common@0.13.2
  - @backstage/plugin-kubernetes-common@0.2.9

## 0.5.0-next.1

### Minor Changes

- 3d45427666: **BREAKING** Custom cluster suppliers need to cache their getClusters result

  To allow custom `KubernetesClustersSupplier` instances to refresh the list of clusters
  the `getClusters` method is now called whenever the list of clusters is needed.

  Existing `KubernetesClustersSupplier` implementations will need to ensure that `getClusters`
  can be called frequently and should return a cached result from `getClusters` instead.

  For example, here's a simple example of a custom supplier in `packages/backend/src/plugins/kubernetes.ts`:

  ```diff
  -import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
  +import {
  +  ClusterDetails,
  +  KubernetesBuilder,
  +  KubernetesClustersSupplier,
  +} from '@backstage/plugin-kubernetes-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';
  +import { Duration } from 'luxon';
  +
  +export class CustomClustersSupplier implements KubernetesClustersSupplier {
  +  constructor(private clusterDetails: ClusterDetails[] = []) {}
  +
  +  static create(refreshInterval: Duration) {
  +    const clusterSupplier = new CustomClustersSupplier();
  +    // setup refresh, e.g. using a copy of https://github.com/backstage/backstage/blob/master/plugins/search-backend-node/src/runPeriodically.ts
  +    runPeriodically(
  +      () => clusterSupplier.refreshClusters(),
  +      refreshInterval.toMillis(),
  +    );
  +    return clusterSupplier;
  +  }
  +
  +  async refreshClusters(): Promise<void> {
  +    this.clusterDetails = []; // fetch from somewhere
  +  }
  +
  +  async getClusters(): Promise<ClusterDetails[]> {
  +    return this.clusterDetails;
  +  }
  +}

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
  -  const { router } = await KubernetesBuilder.createBuilder({
  +  const builder = await KubernetesBuilder.createBuilder({
       logger: env.logger,
       config: env.config,
  -  }).build();
  +  });
  +  builder.setClusterSupplier(
  +    CustomClustersSupplier.create(Duration.fromObject({ minutes: 60 })),
  +  );
  +  const { router } = await builder.build();
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.2

## 0.4.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/plugin-kubernetes-common@0.2.9-next.0

## 0.4.13

### Patch Changes

- dab7f8dbd3: build(deps): bump `@google-cloud/container` from 2.3.0 to 3.0.0
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/plugin-kubernetes-common@0.2.8

## 0.4.12

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 35e58d57aa: refactor kubernetes fetcher
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-kubernetes-common@0.2.7

## 0.4.12-next.0

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-kubernetes-common@0.2.7-next.0

## 0.4.11

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-kubernetes-common@0.2.6

## 0.4.10

### Patch Changes

- 64acf65c03: Allow missing kubernetes config in development env
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/catalog-model@0.11.0
  - @backstage/plugin-kubernetes-common@0.2.5

## 0.4.9

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/plugin-kubernetes-common@0.2.4

## 0.4.8

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 0107c9aa08: chore(deps): bump `helmet` from 4.4.1 to 5.0.2
- fb09a59a3f: Fixed a potential issue in AWS token encoding, where they might not always be properly converted to URL-safe base64.
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/errors@0.2.1
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/plugin-kubernetes-common@0.2.3

## 0.4.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.4.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.4.5

### Patch Changes

- 8fc0d122e8: If serviceAccountToken not provided, use default config file from cluster
- Updated dependencies
  - @backstage/backend-common@0.10.5

## 0.4.4

### Patch Changes

- edbd626d0a: add a new auth provider to support use GOOGLE_APPLICATION_CREDENTIALS
- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10
  - @backstage/plugin-kubernetes-common@0.2.2

## 0.4.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/plugin-kubernetes-common@0.2.2-next.0

## 0.4.3

### Patch Changes

- a67ec8527f: Exclude the AWS session token from credential validation, because it's not necessary in this context.
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/errors@0.2.0
  - @backstage/catalog-model@0.9.9

## 0.4.2

### Patch Changes

- 7ac0bd2c66: implement dashboard link formatter for GKE
- Updated dependencies
  - @backstage/backend-common@0.10.2
  - @backstage/plugin-kubernetes-common@0.2.1

## 0.4.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0

## 0.4.0

### Minor Changes

- c010632f88: Add pod metrics lookup and display in pod table.

  ## Backwards incompatible changes

  If your Kubernetes distribution does not have the [metrics server](https://github.com/kubernetes-sigs/metrics-server) installed,
  you will need to set the `skipMetricsLookup` config flag to `false`.

  See the [configuration docs](https://backstage.io/docs/features/kubernetes/configuration) for more details.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.2.0
  - @backstage/backend-common@0.9.13

## 0.3.20

### Patch Changes

- 65ddccb5e8: Added apiVersionOverrides config to allow for specifying api versions to use for kubernetes objects
- f6087fc8f8: Query CronJobs from Kubernetes with apiGroup BatchV1beta1
- Updated dependencies
  - @backstage/backend-common@0.9.12
  - @backstage/plugin-kubernetes-common@0.1.7

## 0.3.19

### Patch Changes

- 37dc844728: Include CronJobs and Jobs as default objects returned by the kubernetes backend and add/update relevant types.
- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/plugin-kubernetes-common@0.1.6
  - @backstage/backend-common@0.9.11

## 0.3.18

### Patch Changes

- b61c50a12f: Fix Kubernetes plugin custom objects lookup regression
- c57b075d18: add caData support for kubernetes client config
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/backend-common@0.9.7
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.3.17

### Patch Changes

- 89bcf90b66: Refactor kubernetes fetcher to reduce boilerplate code
- a982e166c5: Enable customization of services used by the kubernetes backend plugin

  The createRouter function has been deprecated in favor of a KubernetesBuilder object.
  Here's how you should upgrade your projects when configuring the Kubernetes backend plugin.
  in your `packages/backend/src/plugins/kubernetes.ts` file for instance:

  ```typescript
  import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin({
    logger,
    config,
  }: PluginEnvironment) {
    const { router } = await KubernetesBuilder.createBuilder({
      logger,
      config,
    }).build();
    return router;
  }
  ```

## 0.3.16

### Patch Changes

- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- 7a0c334707: Provide access to the Kubernetes dashboard when viewing a specific resource
- Updated dependencies
  - @backstage/catalog-model@0.9.3
  - @backstage/backend-common@0.9.4
  - @backstage/config@0.1.10
  - @backstage/plugin-kubernetes-common@0.1.4

## 0.3.15

### Patch Changes

- 22fc579fe: Fixes bug reading ExternalId from k8s backend config
- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/config@0.1.8

## 0.3.14

### Patch Changes

- bbcd92afa: Adds ability to send an ExternalId with the assume role request to AWS
- Updated dependencies
  - @backstage/backend-common@0.8.9

## 0.3.13

### Patch Changes

- a0a8d3571: Add configuration option to the kubernetes object types. Config option is under `kubernetes.objectTypes`. Defaults to ['pods', 'services', 'configmaps', 'deployments', 'replicasets', 'horizontalpodautoscalers', 'ingresses']
- Updated dependencies
  - @backstage/backend-common@0.8.8
  - @backstage/config@0.1.6

## 0.3.12

### Patch Changes

- 7f24f4088: chore(deps): bump `@kubernetes/client-node` from 0.14.3 to 0.15.0
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.1.3

## 0.3.11

### Patch Changes

- 5bd57f8f5: Support assume role on kubernetes api configuration for AWS.
- Updated dependencies
  - @backstage/backend-common@0.8.7

## 0.3.10

### Patch Changes

- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6

## 0.3.9

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0
  - @backstage/backend-common@0.8.5
  - @backstage/plugin-kubernetes-common@0.1.2

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
