# @backstage/plugin-kubernetes-react

## 0.6.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.15-next.0

## 0.6.1

### Patch Changes

- 76ac6ed: Updated dependency `js-yaml` to `^5.0.0`.
- Updated dependencies
  - @backstage/errors@1.3.2
  - @backstage/core-components@0.18.15
  - @backstage/catalog-model@1.10.2
  - @backstage/core-plugin-api@1.12.11
  - @backstage/plugin-kubernetes-common@0.9.14

## 0.6.1-next.1

### Patch Changes

- 76ac6ed: Updated dependency `js-yaml` to `^5.0.0`.
- Updated dependencies
  - @backstage/core-components@0.18.15-next.2

## 0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-kubernetes-common@0.9.14-next.0

## 0.6.0

### Minor Changes

- cfba1bc: **BREAKING PRODUCERS:** The `FixDialog`, `ContainerCard`, and `PodLogs` components no longer accept an implicit `children` prop. This aligns them with ADR006. If you were passing children to these components, remove them as they were never rendered.

### Patch Changes

- 736d84e: Use locale-insensitive Unicode casing for consistent string handling across environments.
- c0ebaa7: chore(deps): bump `js-yaml` from 4.3.1 to 4.3.2
- 83f34f2: The pod exec terminal now loads `@xterm/xterm` and its stylesheet when a terminal is opened, instead of including them in the initial bundle.
- Updated dependencies
  - @backstage/core-components@0.18.14
  - @backstage/catalog-model@1.10.1
  - @backstage/plugin-kubernetes-common@0.9.13
  - @backstage/core-plugin-api@1.12.10

## 0.6.0-next.2

### Minor Changes

- cfba1bc: **BREAKING PRODUCERS:** The `FixDialog`, `ContainerCard`, and `PodLogs` components no longer accept an implicit `children` prop. This aligns them with ADR006. If you were passing children to these components, remove them as they were never rendered.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.14-next.2
  - @backstage/core-plugin-api@1.12.10-next.1
  - @backstage/plugin-kubernetes-common@0.9.13-next.1

## 0.5.24-next.1

### Patch Changes

- 83f34f2: The pod exec terminal now loads `@xterm/xterm` and its stylesheet when a terminal is opened, instead of including them in the initial bundle.
- Updated dependencies
  - @backstage/core-components@0.18.14-next.1
  - @backstage/core-plugin-api@1.12.10-next.0

## 0.5.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.13-next.0
  - @backstage/core-components@0.18.14-next.0

## 0.5.23

### Patch Changes

- 226817d: chore(deps): bump `js-yaml` from 4.2.0 to 4.3.0
- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/core-components@0.18.13
  - @backstage/core-plugin-api@1.12.9

## 0.5.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.12.9-next.0
  - @backstage/core-components@0.18.13-next.2

## 0.5.23-next.0

### Patch Changes

- 226817d: chore(deps): bump `js-yaml` from 4.2.0 to 4.3.0
- Updated dependencies
  - @backstage/core-components@0.18.13-next.0

## 0.5.22

### Patch Changes

- 120e7c3: chore(deps): bump `js-yaml` from 4.1.1 to 4.2.0
- 2ed90cd: Fixed the published configuration schema so that it no longer references a file that is excluded from the package. This previously caused configuration schema extraction to fail in apps that depend on this plugin.
- Updated dependencies
  - @backstage/core-components@0.18.12
  - @backstage/core-plugin-api@1.12.8

## 0.5.22-next.1

### Patch Changes

- 2ed90cd: Fixed the published configuration schema so that it no longer references a file that is excluded from the package. This previously caused configuration schema extraction to fail in apps that depend on this plugin.

## 0.5.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.12-next.0
  - @backstage/core-plugin-api@1.12.8-next.0

## 0.5.20

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.11
  - @backstage/core-plugin-api@1.12.7

## 0.5.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.11-next.1
  - @backstage/core-plugin-api@1.12.7-next.0

## 0.5.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.11-next.0

## 0.5.19

### Patch Changes

- e68cb8a: Added optional clustersCacheTtlMs option to KubernetesBackendClient that caches getClusters() responses for the specified duration, avoiding repeated /clusters requests when multiple proxy calls resolve cluster auth in quick succession.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/core-components@0.18.10
  - @backstage/errors@1.3.1
  - @backstage/core-plugin-api@1.12.6
  - @backstage/plugin-kubernetes-common@0.9.12

## 0.5.19-next.1

### Patch Changes

- e68cb8a: Added optional clustersCacheTtlMs option to KubernetesBackendClient that caches getClusters() responses for the specified duration, avoiding repeated /clusters requests when multiple proxy calls resolve cluster auth in quick succession.

## 0.5.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.10-next.0
  - @backstage/errors@1.3.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/core-plugin-api@1.12.6-next.0
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.12-next.0

## 0.5.18

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0
  - @backstage/catalog-model@1.8.0
  - @backstage/core-components@0.18.9
  - @backstage/core-plugin-api@1.12.5
  - @backstage/plugin-kubernetes-common@0.9.11

## 0.5.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/core-components@0.18.9-next.1
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/core-plugin-api@1.12.5-next.2
  - @backstage/plugin-kubernetes-common@0.9.11-next.0

## 0.5.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.9-next.0
  - @backstage/core-plugin-api@1.12.5-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.10

## 0.5.17

### Patch Changes

- 0be2541: Promoted the plugin's translation ref to the stable package entry point. It was previously only available through the alpha entry point.
- Updated dependencies
  - @backstage/core-plugin-api@1.12.4
  - @backstage/core-components@0.18.8
  - @backstage/catalog-model@1.7.7

## 0.5.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.6
  - @backstage/core-components@0.18.8-next.0
  - @backstage/core-plugin-api@1.12.4-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.10

## 0.5.16

### Patch Changes

- 7455dae: Use node prefix on native imports
- ce3639c: Add PersistentVolume and PersistentVolumeClaims Rendering
- d56542c: Updated dependency `@xterm/addon-attach` to `^0.12.0`.
  Updated dependency `@xterm/addon-fit` to `^0.11.0`.
- a7e0d50: Updated `react-router-dom` peer dependency to `^6.30.2` and explicitly disabled v7 future flags to suppress deprecation warnings.
- Updated dependencies
  - @backstage/core-components@0.18.7
  - @backstage/plugin-kubernetes-common@0.9.10
  - @backstage/core-plugin-api@1.12.3

## 0.5.16-next.2

### Patch Changes

- d56542c: Updated dependency `@xterm/addon-attach` to `^0.12.0`.
  Updated dependency `@xterm/addon-fit` to `^0.11.0`.
- a7e0d50: Prepare for React Router v7 migration by updating to v6.30.2 across all NFS packages and enabling v7 future flags. Convert routes from splat paths to parent/child structure with Outlet components.
- Updated dependencies
  - @backstage/core-components@0.18.7-next.2
  - @backstage/core-plugin-api@1.12.3-next.1

## 0.5.16-next.1

### Patch Changes

- ce3639c: Add PersistentVolume and PersistentVolumeClaims Rendering
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.10-next.1
  - @backstage/core-components@0.18.7-next.1

## 0.5.16-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/core-components@0.18.6-next.0
  - @backstage/core-plugin-api@1.12.2-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.10-next.0

## 0.5.15

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.5

## 0.5.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.5-next.0

## 0.5.14

### Patch Changes

- f966a85: Enabled a pod terminal at GKE
- 8fa8d87: Add Kubernetes Plugin Secrets Accordion with masked secret datas
- f15d5f1: add missing i18n support for kubernetes and kubernetes-react
- Updated dependencies
  - @backstage/core-components@0.18.4
  - @backstage/plugin-kubernetes-common@0.9.9
  - @backstage/core-plugin-api@1.12.1

## 0.5.14-next.1

### Patch Changes

- f966a85: Enabled a pod terminal at GKE
- 8fa8d87: Add Kubernetes Plugin Secrets Accordion with masked secret datas
- Updated dependencies
  - @backstage/core-components@0.18.4-next.1
  - @backstage/plugin-kubernetes-common@0.9.9-next.0

## 0.5.14-next.0

### Patch Changes

- f15d5f1: add missing i18n support for kubernetes and kubernetes-react
- Updated dependencies
  - @backstage/core-plugin-api@1.12.1-next.0
  - @backstage/core-components@0.18.4-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.8

## 0.5.13

### Patch Changes

- 1906d37: Updated dependency `@kubernetes/client-node` to `1.4.0`.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/core-components@0.18.3
  - @backstage/plugin-kubernetes-common@0.9.8
  - @backstage/core-plugin-api@1.12.0
  - @backstage/catalog-model@1.7.6

## 0.5.13-next.1

### Patch Changes

- 1906d37: Updated dependency `@kubernetes/client-node` to `1.4.0`.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.8-next.1
  - @backstage/core-components@0.18.3-next.2

## 0.5.13-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/core-plugin-api@1.11.2-next.0
  - @backstage/core-components@0.18.3-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-kubernetes-common@0.9.8-next.0

## 0.5.12

### Patch Changes

- ac405f2: The configmaps added to be rendered
- f7a4144: Fixes calculation of CPU utilization in the PodTable
- Updated dependencies
  - @backstage/core-components@0.18.2
  - @backstage/plugin-kubernetes-common@0.9.7
  - @backstage/core-plugin-api@1.11.1

## 0.5.12-next.2

### Patch Changes

- ac405f2: The configmaps added to be rendered
- f7a4144: Fixes calculation of CPU utilization in the PodTable
- Updated dependencies
  - @backstage/core-components@0.18.2-next.2

## 0.5.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2-next.1
  - @backstage/core-plugin-api@1.11.1-next.0
  - @backstage/plugin-kubernetes-common@0.9.7-next.1

## 0.5.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2-next.0
  - @backstage/plugin-kubernetes-common@0.9.7-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/core-plugin-api@1.11.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.5.11

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.11.0
  - @backstage/core-components@0.18.0
  - @backstage/types@1.2.2

## 0.5.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.6-next.0

## 0.5.10

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5

## 0.5.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/core-plugin-api@1.10.9
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.6

## 0.5.9

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.5
  - @backstage/core-components@0.17.4
  - @backstage/core-plugin-api@1.10.9
  - @backstage/plugin-kubernetes-common@0.9.6

## 0.5.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/core-components@0.17.4-next.1
  - @backstage/core-plugin-api@1.10.9-next.0
  - @backstage/plugin-kubernetes-common@0.9.6-next.0

## 0.5.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.4-next.0
  - @backstage/catalog-model@1.7.4
  - @backstage/core-plugin-api@1.10.8
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.5

## 0.5.8

### Patch Changes

- 3ea5d1b: chore(deps): Update deprecated xterm to new package under @xterm
- Updated dependencies
  - @backstage/core-components@0.17.3
  - @backstage/core-plugin-api@1.10.8
  - @backstage/catalog-model@1.7.4
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.5

## 0.5.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.3-next.0
  - @backstage/catalog-model@1.7.4
  - @backstage/core-plugin-api@1.10.7
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.5

## 0.5.7

### Patch Changes

- 599c89e: Add headlamp formatter
- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/core-components@0.17.2
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-kubernetes-common@0.9.5
  - @backstage/core-plugin-api@1.10.7
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.5.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.7-next.0
  - @backstage/core-components@0.17.2-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0

## 0.5.7-next.0

### Patch Changes

- 599c89e: Add headlamp formatter
- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.5.6

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- Updated dependencies
  - @backstage/core-components@0.17.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.4

## 0.5.6-next.1

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- Updated dependencies
  - @backstage/core-components@0.17.1-next.1
  - @backstage/core-plugin-api@1.10.6-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.4

## 0.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.1-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.5
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.4

## 0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.0
  - @backstage/core-plugin-api@1.10.5
  - @backstage/plugin-kubernetes-common@0.9.4
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.5.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.5-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.4
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.4-next.0

## 0.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.5-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.4
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.4-next.0

## 0.5.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.4-next.0

## 0.5.4

### Patch Changes

- f35a754: Fixed bug in string-to-integer conversion to properly handle decimal values with BigInt.
- d80b08f: Improved rendering of Kubernetes resources' metadata.
- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/core-components@0.16.4
  - @backstage/plugin-kubernetes-common@0.9.3
  - @backstage/core-plugin-api@1.10.4
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.5.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.4-next.1
  - @backstage/plugin-kubernetes-common@0.9.3-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.5.4-next.1

### Patch Changes

- d80b08f: Improved rendering of Kubernetes resources' metadata.
- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/core-components@0.16.4-next.0
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-kubernetes-common@0.9.3-next.0

## 0.5.4-next.0

### Patch Changes

- f35a754: Fixed bug in string-to-integer conversion to properly handle decimal values with BigInt.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.3-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-components@0.16.3
  - @backstage/core-plugin-api@1.10.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.5.3

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.3
  - @backstage/types@1.2.1
  - @backstage/core-components@0.16.3
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/plugin-kubernetes-common@0.9.2

## 0.5.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.3-next.0
  - @backstage/types@1.2.1-next.0
  - @backstage/core-components@0.16.3-next.0
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-kubernetes-common@0.9.2-next.0

## 0.5.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.2
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2
  - @backstage/core-plugin-api@1.10.2
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.1

## 0.5.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.6-next.0
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/core-components@0.16.2-next.2
  - @backstage/core-plugin-api@1.10.2-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.1-next.0

## 0.5.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.2-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/core-plugin-api@1.10.1
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.0

## 0.5.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.1
  - @backstage/core-components@0.16.2-next.0
  - @backstage/core-plugin-api@1.10.1
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-kubernetes-common@0.9.0

## 0.5.0

### Minor Changes

- 71b8704: Bumping @kubernetes/client-node to 1.0.0-rc7 to mitigate CVEs related to the request and tough-cookie packages

### Patch Changes

- 0b729da: add the pod delete feature to the kubernetes react plugin
- Updated dependencies
  - @backstage/types@1.2.0
  - @backstage/core-components@0.16.0
  - @backstage/plugin-kubernetes-common@0.9.0
  - @backstage/catalog-model@1.7.1
  - @backstage/core-plugin-api@1.10.1
  - @backstage/errors@1.2.5

## 0.5.0-next.2

### Patch Changes

- 0b729da: add the pod delete feature to the kubernetes react plugin
- Updated dependencies
  - @backstage/core-components@0.16.0-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/core-plugin-api@1.10.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.9.0-next.0

## 0.5.0-next.1

### Minor Changes

- 71b8704: Bumping @kubernetes/client-node to 1.0.0-rc7 to mitigate CVEs related to the request and tough-cookie packages

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/core-components@0.16.0-next.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/core-plugin-api@1.10.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.4.4

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- 605e0bb: Updated dependency `@kubernetes-models/base` to `^5.0.0`.
- 276cd3d: Updated dependency `@kubernetes-models/apimachinery` to `^2.0.0`.
- Updated dependencies
  - @backstage/core-components@0.15.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.4.4-next.2

### Patch Changes

- 276cd3d: Updated dependency `@kubernetes-models/apimachinery` to `^2.0.0`.
- Updated dependencies
  - @backstage/catalog-model@1.7.0
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.4.4-next.1

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- 605e0bb: Updated dependency `@kubernetes-models/base` to `^5.0.0`.
- Updated dependencies
  - @backstage/core-components@0.15.1-next.1
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.4.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.0
  - @backstage/core-plugin-api@1.10.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.4.3

### Patch Changes

- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/core-components@0.15.0
  - @backstage/catalog-model@1.7.0
  - @backstage/core-plugin-api@1.9.4
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.4.3-next.1

### Patch Changes

- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/core-components@0.14.11-next.1
  - @backstage/core-plugin-api@1.9.4-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.2

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.11-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.2

## 0.4.2

### Patch Changes

- 954a593: `Liveness Probe` added in ContainerCard Component of PodDrawer
- Updated dependencies
  - @backstage/core-components@0.14.10
  - @backstage/catalog-model@1.6.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.2

## 0.4.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.2-next.2

## 0.4.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.8.2-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.8.2-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.10-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.1

## 0.4.1

### Patch Changes

- e3cb6ab: Add a namespace label to RolloutDrawer
- 2414d86: Fix the `HTML` markup of the `FixDialog` component, `ul` and `li` are not allowed inside a `p` tag.
- Updated dependencies
  - @backstage/core-components@0.14.9
  - @backstage/plugin-kubernetes-common@0.8.1
  - @backstage/catalog-model@1.5.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.1-next.1

### Patch Changes

- e3cb6ab: Add a namespace label to RolloutDrawer
- Updated dependencies
  - @backstage/core-components@0.14.9-next.1

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.0

## 0.4.0

### Minor Changes

- 4f92394: Migrate from identityApi to fetchApi in frontend plugins.
- 0177f75: Update kubernetes plugins to use autoscaling/v2

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/core-components@0.14.8
  - @backstage/core-plugin-api@1.9.3
  - @backstage/plugin-kubernetes-common@0.8.0
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.0-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/core-components@0.14.8-next.2
  - @backstage/plugin-kubernetes-common@0.8.0-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/core-plugin-api@1.9.3-next.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8-next.1
  - @backstage/core-plugin-api@1.9.3-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.0-next.0

## 0.4.0-next.1

### Minor Changes

- 4f92394: Migrate from identityApi to fetchApi in frontend plugins.
- 0177f75: Update kubernetes plugins to use autoscaling/v2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.8.0-next.0

## 0.3.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/core-plugin-api@1.9.2
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.6

## 0.3.5

### Patch Changes

- 3102a99: add the namespace label to CronJobDrawer & IngressDrawer.
- Updated dependencies
  - @backstage/core-components@0.14.7
  - @backstage/catalog-model@1.5.0
  - @backstage/plugin-kubernetes-common@0.7.6

## 0.3.5-next.1

### Patch Changes

- 3102a99: add the namespace label to CronJobDrawer & IngressDrawer.
- Updated dependencies
  - @backstage/core-components@0.14.6-next.1

## 0.3.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/core-components@0.14.5-next.0
  - @backstage/plugin-kubernetes-common@0.7.6-next.0
  - @backstage/core-plugin-api@1.9.2
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.4

### Patch Changes

- e6d474f: Fixed ResourceUtilization component for POD Memory Limits
- 58800ba: Added the `no-top-level-material-ui-4-imports` ESLint rule to aid with the migration to Material UI v5
- abfbcfc: Updated dependency `@testing-library/react` to `^15.0.0`.
- Updated dependencies
  - @backstage/core-components@0.14.4
  - @backstage/core-plugin-api@1.9.2
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.3.4-next.1

### Patch Changes

- e6d474f: Fixed ResourceUtilization component for POD Memory Limits
- Updated dependencies
  - @backstage/catalog-model@1.4.5
  - @backstage/core-components@0.14.4-next.0
  - @backstage/core-plugin-api@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.4-next.0
  - @backstage/catalog-model@1.4.5
  - @backstage/core-plugin-api@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.3.3

### Patch Changes

- e8f026a: Use ESM exports of react-use library
- Updated dependencies
  - @backstage/core-components@0.14.3
  - @backstage/core-plugin-api@1.9.1
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.3.2

### Patch Changes

- e8f026a: Use ESM exports of react-use library
- Updated dependencies
  - @backstage/core-components@0.14.2
  - @backstage/core-plugin-api@1.9.1
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.3.1

### Patch Changes

- 4642cb7: Add support to fetch data for Daemon Sets and display an accordion in the same way as with Deployments
- Updated dependencies
  - @backstage/core-components@0.14.1
  - @backstage/errors@1.2.4
  - @backstage/plugin-kubernetes-common@0.7.5
  - @backstage/catalog-model@1.4.5
  - @backstage/core-plugin-api@1.9.1
  - @backstage/types@1.1.1

## 0.3.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## 0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## 0.3.1-next.0

### Patch Changes

- 4642cb7: Add support to fetch data for Daemon Sets and display an accordion in the same way as with Deployments
- Updated dependencies
  - @backstage/errors@1.2.4-next.0
  - @backstage/core-components@0.14.1-next.0
  - @backstage/plugin-kubernetes-common@0.7.5-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-plugin-api@1.9.1-next.0
  - @backstage/types@1.1.1

## 0.3.0

### Minor Changes

- 0dfc185: **BREAKING** The `PodScope`, `PodAndErrors`, and `PodExecTerminalProps` types no
  longer have a `clusterName` field; instead they now have the field `cluster`
  which contains the full `ClusterAttributes`.
- 0d526c8: **BREAKING** The pod exec terminal is now disabled by default since there are several scenarios where it is known not to work. It can be re-enabled at your own risk by setting the config parameter `kubernetes.podExecTerminal.enabled` to `true`.

### Patch Changes

- 5bf0c17: Pod dialogs display cluster title when specified.
- 74770c8: The `ErrorPanel` component will display the `title` field (when specified) for
  clusters with errors.
- 536f67d: Fix broken XtermJS CSS import
- b01c86c: The `ErrorReporting` component's cluster column now displays cluster titles when
  specified.
- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- 8472188: Added or fixed the `repository` field in `package.json`.
- 2b305eb: The `Cluster` component now renders the cluster's title, if specified.
- 3c184af: Extracted common dialog component.
- db1054b: Fixed a bug where the logs dialog and any other functionality depending on the proxy endpoint would fail for clusters configured with the OIDC auth provider.
- Updated dependencies
  - @backstage/core-components@0.14.0
  - @backstage/plugin-kubernetes-common@0.7.4
  - @backstage/catalog-model@1.4.4
  - @backstage/core-plugin-api@1.9.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.3.0-next.3

### Minor Changes

- 0dfc185: **BREAKING** The `PodScope`, `PodAndErrors`, and `PodExecTerminalProps` types no
  longer have a `clusterName` field; instead they now have the field `cluster`
  which contains the full `ClusterAttributes`.

### Patch Changes

- 5bf0c17: Pod dialogs display cluster title when specified.
- 74770c8: The `ErrorPanel` component will display the `title` field (when specified) for
  clusters with errors.
- b01c86c: The `ErrorReporting` component's cluster column now displays cluster titles when
  specified.
- 8472188: Added or fixed the `repository` field in `package.json`.
- 2b305eb: The `Cluster` component now renders the cluster's title, if specified.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.4-next.2
  - @backstage/core-components@0.14.0-next.2
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.3.0-next.2

### Patch Changes

- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- Updated dependencies
  - @backstage/core-components@0.14.0-next.1
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.4-next.1

## 0.3.0-next.1

### Patch Changes

- 3c184af: Extracted common dialog component.
- Updated dependencies
  - @backstage/core-components@0.14.0-next.0
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/core-plugin-api@1.8.3-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.4-next.1

## 0.3.0-next.0

### Minor Changes

- 0d526c8: **BREAKING** The pod exec terminal is now disabled by default since there are several scenarios where it is known not to work. It can be re-enabled at your own risk by setting the config parameter `kubernetes.podExecTerminal.enabled` to `true`.

### Patch Changes

- 536f67d: Fix broken XtermJS CSS import
- db1054b: Fixed a bug where the logs dialog and any other functionality depending on the proxy endpoint would fail for clusters configured with the OIDC auth provider.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.4-next.0
  - @backstage/core-components@0.13.10
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.2
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.1

### Patch Changes

- d5d2c67: Add `authuser` search parameter to GKE cluster link formatter in k8s plugin

  Thanks to this, people with multiple simultaneously logged-in accounts in their GCP console will automatically view objects with the same email as the one signed in to the Google auth provider in Backstage.

- Updated dependencies
  - @backstage/core-components@0.13.10
  - @backstage/core-plugin-api@1.8.2
  - @backstage/plugin-kubernetes-common@0.7.3
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.1-next.1

### Patch Changes

- d5d2c67: Add `authuser` search parameter to GKE cluster link formatter in k8s plugin

  Thanks to this, people with multiple simultaneously logged-in accounts in their GCP console will automatically view objects with the same email as the one signed in to the Google auth provider in Backstage.

- Updated dependencies
  - @backstage/core-plugin-api@1.8.2-next.0
  - @backstage/core-components@0.13.10-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.3-next.0

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.10-next.0
  - @backstage/plugin-kubernetes-common@0.7.3-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.0

### Minor Changes

- 899d71a: Change `formatClusterLink` to be an API and make it async for further customization possibilities.

  **BREAKING**
  If you have a custom k8s page and used `formatClusterLink` directly, you need to migrate to new `kubernetesClusterLinkFormatterApiRef`

### Patch Changes

- b5ae2e5: Add ID property to the table displaying kubernetes pods to avoid closing the info sidebar when the data reloads and needs to rerender.
- 706fc3a: Updated dependency `@kubernetes/client-node` to `0.20.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1
  - @backstage/core-components@0.13.9
  - @backstage/plugin-kubernetes-common@0.7.2
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1

## 0.2.0-next.2

### Minor Changes

- 899d71a: Change `formatClusterLink` to be an API and make it async for further customization possibilities.

  **BREAKING**
  If you have a custom k8s page and used `formatClusterLink` directly, you need to migrate to new `kubernetesClusterLinkFormatterApiRef`

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/core-components@0.13.9-next.2
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.1.2-next.0

### Patch Changes

- b5ae2e5a62: Add ID property to the table displaying kubernetes pods to avoid closing the info sidebar when the data reloads and needs to rerender.
- 706fc3a7e1: Updated dependency `@kubernetes/client-node` to `0.20.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.0
  - @backstage/core-components@0.13.9-next.0
  - @backstage/plugin-kubernetes-common@0.7.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.1.1

### Patch Changes

- 0f4cad6da0: Internal refactor to avoid a null pointer problem
- 6c2b872153: Add official support for React 18.
- b52f576f48: Make sure types exported by other `kubernetes` plugins in the past are exported again after the creation
  of the react package.

  Some types have been moved to this new package but the export was missing, so they were not available anymore for developers.

- Updated dependencies
  - @backstage/core-components@0.13.8
  - @backstage/plugin-kubernetes-common@0.7.1
  - @backstage/core-plugin-api@1.8.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.1-next.1
  - @backstage/core-components@0.13.8-next.2

## 0.1.1-next.1

### Patch Changes

- 0f4cad6da0: Internal refactor to avoid a null pointer problem
- b52f576f48: Make sure types exported by other `kubernetes` plugins in the past are exported again after the creation
  of the react package.

  Some types have been moved to this new package but the export was missing, so they were not available anymore for developers.

- Updated dependencies
  - @backstage/core-components@0.13.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.1-next.0

## 0.1.1-next.0

### Patch Changes

- 6c2b872153: Add official support for React 18.
- Updated dependencies
  - @backstage/core-components@0.13.7-next.0
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.1-next.0

## 0.1.0

### Minor Changes

- 2d8151061c: Refactor Kubernetes plugins in line with ADR 11, no breaking changes yet

### Patch Changes

- 4262e12921: Handle mixed decimals and bigint when calculating k8s resource usage
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- 95518765ee: Add Kubernetes cluster plugin. Viewing Kubernetes clusters as an Admin from Backstage
- 5dac12e435: The kubernetes APIs invokes Authentication Strategies when Backstage-Kubernetes-Authorization-X-X headers are provided, this enable the possibility to invoke strategies that executes additional steps to get a kubernetes token like on pinniped or custom strategies
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/types@1.1.1

## 0.1.0-next.1

### Patch Changes

- 95518765ee: Add Kubernetes cluster plugin. Viewing Kubernetes clusters as an Admin from Backstage
- 5dac12e435: The kubernetes APIs invokes Authentication Strategies when Backstage-Kubernetes-Authorization-X-X headers are provided, this enable the possibility to invoke strategies that executes additional steps to get a kubernetes token like on pinniped or custom strategies
- Updated dependencies
  - @backstage/core-components@0.13.6-next.2
  - @backstage/core-plugin-api@1.7.0-next.1
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/errors@1.2.3-next.0
  - @backstage/plugin-kubernetes-common@0.7.0-next.1
  - @backstage/types@1.1.1

## 0.1.0-next.0

### Minor Changes

- 2d8151061c: Refactor Kubernetes plugins in line with ADR 11, no breaking changes yet

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.6-next.1
  - @backstage/plugin-kubernetes-common@0.7.0-next.0
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
