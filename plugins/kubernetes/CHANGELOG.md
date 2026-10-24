# @backstage/plugin-kubernetes

## 0.12.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.15-next.0
  - @backstage/plugin-kubernetes-react@0.6.2-next.0

## 0.12.24

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.18.2
  - @backstage/plugin-catalog-react@3.3.0
  - @backstage/core-components@0.18.15
  - @backstage/plugin-kubernetes-react@0.6.1
  - @backstage/catalog-model@1.10.2
  - @backstage/core-plugin-api@1.12.11
  - @backstage/plugin-kubernetes-common@0.9.14
  - @backstage/plugin-permission-react@0.5.6

## 0.12.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.18.2-next.1
  - @backstage/plugin-catalog-react@3.3.0-next.2
  - @backstage/core-components@0.18.15-next.3

## 0.12.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-kubernetes-react@0.6.1-next.0
  - @backstage/plugin-kubernetes-common@0.9.14-next.0

## 0.12.23

### Patch Changes

- 83f34f2: The Kubernetes entity content no longer loads its UI until the tab is opened, keeping it out of the initial bundle. Tab visibility is now an entity filter predicate that can be overridden through app config, and entities with an empty Kubernetes annotation now show the tab where previously it was hidden.
- Updated dependencies
  - @backstage/core-components@0.18.14
  - @backstage/catalog-model@1.10.1
  - @backstage/plugin-catalog-react@3.2.3
  - @backstage/plugin-kubernetes-react@0.6.0
  - @backstage/frontend-plugin-api@0.18.1
  - @backstage/plugin-kubernetes-common@0.9.13
  - @backstage/core-plugin-api@1.12.10
  - @backstage/plugin-permission-react@0.5.5

## 0.12.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.6.0-next.2
  - @backstage/plugin-catalog-react@3.2.3-next.2
  - @backstage/core-components@0.18.14-next.2
  - @backstage/core-plugin-api@1.12.10-next.1
  - @backstage/frontend-plugin-api@0.18.1-next.1
  - @backstage/plugin-permission-react@0.5.5-next.1
  - @backstage/plugin-kubernetes-common@0.9.13-next.1

## 0.12.23-next.1

### Patch Changes

- 83f34f2: The Kubernetes entity content no longer loads its UI until the tab is opened, keeping it out of the initial bundle. Tab visibility is now an entity filter predicate that can be overridden through app config, and entities with an empty Kubernetes annotation now show the tab where previously it was hidden.
- Updated dependencies
  - @backstage/core-components@0.18.14-next.1
  - @backstage/frontend-plugin-api@0.18.1-next.0
  - @backstage/plugin-kubernetes-react@0.5.24-next.1
  - @backstage/plugin-catalog-react@3.2.3-next.1
  - @backstage/core-plugin-api@1.12.10-next.0
  - @backstage/plugin-permission-react@0.5.5-next.0

## 0.12.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@3.2.2-next.0
  - @backstage/plugin-kubernetes-common@0.9.13-next.0
  - @backstage/core-components@0.18.14-next.0
  - @backstage/plugin-kubernetes-react@0.5.24-next.0

## 0.12.22

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/core-components@0.18.13
  - @backstage/plugin-kubernetes-react@0.5.23
  - @backstage/core-plugin-api@1.12.9
  - @backstage/plugin-catalog-react@3.2.1
  - @backstage/frontend-plugin-api@0.18.0
  - @backstage/plugin-permission-react@0.5.4

## 0.12.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@3.2.1-next.2
  - @backstage/frontend-plugin-api@0.18.0-next.0
  - @backstage/core-plugin-api@1.12.9-next.0
  - @backstage/core-components@0.18.13-next.2
  - @backstage/plugin-kubernetes-react@0.5.23-next.1
  - @backstage/plugin-permission-react@0.5.4-next.0

## 0.12.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.13-next.0
  - @backstage/plugin-kubernetes-react@0.5.23-next.0
  - @backstage/plugin-catalog-react@3.2.1-next.0

## 0.12.21

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.17.3
  - @backstage/plugin-catalog-react@3.2.0
  - @backstage/core-components@0.18.12
  - @backstage/plugin-kubernetes-react@0.5.22
  - @backstage/core-plugin-api@1.12.8
  - @backstage/plugin-permission-react@0.5.3

## 0.12.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@3.2.0-next.0
  - @backstage/frontend-plugin-api@0.17.3-next.0
  - @backstage/core-components@0.18.12-next.0
  - @backstage/core-plugin-api@1.12.8-next.0
  - @backstage/plugin-kubernetes-react@0.5.21-next.0
  - @backstage/plugin-permission-react@0.5.3-next.0

## 0.12.20

### Patch Changes

- 07bd0b4: Removed the default Kubernetes standalone page that was registered at `/kubernetes`. This page was added by mistake and is not intended to be part of the plugin.
- Updated dependencies
  - @backstage/plugin-catalog-react@3.1.0
  - @backstage/core-components@0.18.11
  - @backstage/frontend-plugin-api@0.17.2
  - @backstage/core-plugin-api@1.12.7
  - @backstage/plugin-kubernetes-react@0.5.20
  - @backstage/plugin-permission-react@0.5.2

## 0.12.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.17.2-next.0
  - @backstage/core-components@0.18.11-next.1
  - @backstage/core-plugin-api@1.12.7-next.0
  - @backstage/plugin-catalog-react@3.0.1-next.1
  - @backstage/plugin-kubernetes-react@0.5.20-next.1
  - @backstage/plugin-permission-react@0.5.2-next.0

## 0.12.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@3.0.1-next.0
  - @backstage/core-components@0.18.11-next.0
  - @backstage/plugin-kubernetes-react@0.5.20-next.0

## 0.12.19

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/core-components@0.18.10
  - @backstage/frontend-plugin-api@0.17.0
  - @backstage/core-plugin-api@1.12.6
  - @backstage/plugin-kubernetes-common@0.9.12
  - @backstage/plugin-catalog-react@3.0.0
  - @backstage/plugin-kubernetes-react@0.5.19
  - @backstage/plugin-permission-react@0.5.1

## 0.12.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.10-next.0
  - @backstage/plugin-catalog-react@2.1.5-next.0
  - @backstage/frontend-plugin-api@0.17.0-next.0
  - @backstage/plugin-kubernetes-react@0.5.19-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/core-plugin-api@1.12.6-next.0
  - @backstage/plugin-kubernetes-common@0.9.12-next.0
  - @backstage/plugin-permission-react@0.5.1-next.0

## 0.12.18

### Patch Changes

- d156cf4: Added `title` and `icon` to the new frontend system plugin definition.
- Updated dependencies
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-react@2.1.2
  - @backstage/frontend-plugin-api@0.16.0
  - @backstage/core-components@0.18.9
  - @backstage/plugin-permission-react@0.5.0
  - @backstage/core-plugin-api@1.12.5
  - @backstage/plugin-kubernetes-common@0.9.11
  - @backstage/plugin-kubernetes-react@0.5.18

## 0.12.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.9-next.1
  - @backstage/plugin-catalog-react@2.1.2-next.2
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/core-plugin-api@1.12.5-next.2
  - @backstage/frontend-plugin-api@0.16.0-next.2
  - @backstage/plugin-kubernetes-react@0.5.18-next.1
  - @backstage/plugin-kubernetes-common@0.9.11-next.0
  - @backstage/plugin-permission-react@0.4.42-next.1

## 0.12.18-next.1

### Patch Changes

- d156cf4: Added `title` and `icon` to the new frontend system plugin definition.
- Updated dependencies
  - @backstage/plugin-catalog-react@2.1.2-next.1
  - @backstage/frontend-plugin-api@0.16.0-next.1
  - @backstage/core-components@0.18.9-next.0
  - @backstage/core-plugin-api@1.12.5-next.1
  - @backstage/plugin-kubernetes-react@0.5.18-next.0

## 0.12.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@2.1.1-next.0
  - @backstage/core-components@0.18.9-next.0
  - @backstage/frontend-plugin-api@0.15.2-next.0
  - @backstage/plugin-kubernetes-react@0.5.18-next.0
  - @backstage/core-plugin-api@1.12.5-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/plugin-kubernetes-common@0.9.10
  - @backstage/plugin-permission-react@0.4.42-next.0

## 0.12.17

### Patch Changes

- 538c985: Updated installation documentation to use feature discovery as the default.
- 0be2541: Promoted the plugin's translation ref to the stable package entry point. It was previously only available through the alpha entry point.
- Updated dependencies
  - @backstage/plugin-catalog-react@2.1.0
  - @backstage/core-plugin-api@1.12.4
  - @backstage/core-components@0.18.8
  - @backstage/frontend-plugin-api@0.15.0
  - @backstage/plugin-permission-react@0.4.41
  - @backstage/plugin-kubernetes-react@0.5.17
  - @backstage/catalog-model@1.7.7

## 0.12.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.15.0-next.1
  - @backstage/core-plugin-api@1.12.4-next.1
  - @backstage/plugin-catalog-react@2.1.0-next.2
  - @backstage/core-components@0.18.8-next.1

## 0.12.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@2.1.0-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/core-components@0.18.8-next.0
  - @backstage/core-plugin-api@1.12.4-next.0
  - @backstage/frontend-plugin-api@0.14.2-next.0
  - @backstage/plugin-kubernetes-common@0.9.10
  - @backstage/plugin-kubernetes-react@0.5.17-next.0
  - @backstage/plugin-permission-react@0.4.41-next.0

## 0.12.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.14.2-next.0
  - @backstage/plugin-catalog-react@2.0.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/core-components@0.18.8-next.0
  - @backstage/core-plugin-api@1.12.4-next.0
  - @backstage/plugin-kubernetes-common@0.9.10
  - @backstage/plugin-kubernetes-react@0.5.17-next.0
  - @backstage/plugin-permission-react@0.4.41-next.0

## 0.12.16

### Patch Changes

- 7feb83b: Adjusted to use the new `@backstage/filter-predicates` types for predicate expressions.
- 491a06c: Add the ability to show icons for the tabs on the entity page (new frontend)
- 4183614: Updated usage of deprecated APIs in the new frontend system.
- a7e0d50: Updated `react-router-dom` peer dependency to `^6.30.2` and explicitly disabled v7 future flags to suppress deprecation warnings.
- Updated dependencies
  - @backstage/plugin-catalog-react@2.0.0
  - @backstage/core-components@0.18.7
  - @backstage/plugin-kubernetes-react@0.5.16
  - @backstage/plugin-kubernetes-common@0.9.10
  - @backstage/frontend-plugin-api@0.14.0
  - @backstage/core-plugin-api@1.12.3
  - @backstage/plugin-permission-react@0.4.40

## 0.12.16-next.2

### Patch Changes

- 7feb83b: Adjusted to use the new `@backstage/filter-predicates` types for predicate expressions.
- 491a06c: Add the ability to show icons for the tabs on the entity page (new frontend)
- 4183614: Updated usage of deprecated APIs in the new frontend system.
- a7e0d50: Prepare for React Router v7 migration by updating to v6.30.2 across all NFS packages and enabling v7 future flags. Convert routes from splat paths to parent/child structure with Outlet components.
- Updated dependencies
  - @backstage/plugin-catalog-react@2.0.0-next.2
  - @backstage/plugin-kubernetes-react@0.5.16-next.2
  - @backstage/frontend-plugin-api@0.14.0-next.2
  - @backstage/core-components@0.18.7-next.2
  - @backstage/core-plugin-api@1.12.3-next.1
  - @backstage/plugin-permission-react@0.4.40-next.1

## 0.12.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.22.0-next.1
  - @backstage/plugin-kubernetes-common@0.9.10-next.1
  - @backstage/plugin-kubernetes-react@0.5.16-next.1
  - @backstage/frontend-plugin-api@0.14.0-next.1
  - @backstage/core-components@0.18.7-next.1

## 0.12.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.21.6-next.0
  - @backstage/core-components@0.18.6-next.0
  - @backstage/plugin-kubernetes-react@0.5.16-next.0
  - @backstage/frontend-plugin-api@0.14.0-next.0
  - @backstage/core-plugin-api@1.12.2-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-kubernetes-common@0.9.10-next.0
  - @backstage/plugin-permission-react@0.4.40-next.0

## 0.12.15

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.3
  - @backstage/core-components@0.18.5
  - @backstage/plugin-catalog-react@1.21.5
  - @backstage/plugin-kubernetes-react@0.5.15

## 0.12.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.5-next.0
  - @backstage/plugin-catalog-react@1.21.5-next.1
  - @backstage/plugin-kubernetes-react@0.5.15-next.0

## 0.12.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.21.5-next.0
  - @backstage/frontend-plugin-api@0.13.2

## 0.12.14

### Patch Changes

- f15d5f1: add missing i18n support for kubernetes and kubernetes-react
- d02db50: Remove unnecessary use of `compatWrapper` and `convertLegacyRouteRef`(s) for the new frontend system.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.2
  - @backstage/plugin-kubernetes-react@0.5.14
  - @backstage/core-components@0.18.4
  - @backstage/plugin-catalog-react@1.21.4
  - @backstage/plugin-kubernetes-common@0.9.9
  - @backstage/core-plugin-api@1.12.1
  - @backstage/plugin-permission-react@0.4.39

## 0.12.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.5.14-next.1
  - @backstage/core-components@0.18.4-next.1
  - @backstage/plugin-catalog-react@1.21.4-next.1
  - @backstage/plugin-kubernetes-common@0.9.9-next.0

## 0.12.14-next.0

### Patch Changes

- f15d5f1: add missing i18n support for kubernetes and kubernetes-react
- d02db50: Remove unnecessary use of `compatWrapper` and `convertLegacyRouteRef`(s) for the new frontend system.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.2-next.0
  - @backstage/plugin-kubernetes-react@0.5.14-next.0
  - @backstage/core-plugin-api@1.12.1-next.0
  - @backstage/plugin-catalog-react@1.21.4-next.0
  - @backstage/core-components@0.18.4-next.0
  - @backstage/plugin-permission-react@0.4.39-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-kubernetes-common@0.9.8

## 0.12.13

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/plugin-kubernetes-common@0.9.8
  - @backstage/plugin-kubernetes-react@0.5.13
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/catalog-model@1.7.6

## 0.12.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.5.13-next.0
  - @backstage/plugin-permission-react@0.4.38-next.0
  - @backstage/plugin-catalog-react@1.21.3-next.0
  - @backstage/core-plugin-api@1.11.2-next.0
  - @backstage/core-components@0.18.3-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/frontend-plugin-api@0.12.2-next.0
  - @backstage/core-compat-api@0.5.4-next.0
  - @backstage/plugin-kubernetes-common@0.9.8-next.0

## 0.12.12

### Patch Changes

- 99fcf98: Removed unused dependencies
- Updated dependencies
  - @backstage/plugin-catalog-react@1.21.2
  - @backstage/plugin-kubernetes-react@0.5.12
  - @backstage/core-components@0.18.2
  - @backstage/plugin-kubernetes-common@0.9.7
  - @backstage/frontend-plugin-api@0.12.1
  - @backstage/core-compat-api@0.5.3
  - @backstage/core-plugin-api@1.11.1
  - @backstage/plugin-permission-react@0.4.37

## 0.12.12-next.2

### Patch Changes

- 99fcf98: Removed unused dependencies
- Updated dependencies
  - @backstage/core-components@0.18.2-next.3
  - @backstage/frontend-plugin-api@0.12.1-next.2

## 0.12.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2-next.1
  - @backstage/core-plugin-api@1.11.1-next.0
  - @backstage/plugin-permission-react@0.4.37-next.0
  - @backstage/core-compat-api@0.5.3-next.1
  - @backstage/plugin-catalog-react@1.21.2-next.1
  - @backstage/plugin-kubernetes-react@0.5.12-next.1
  - @backstage/frontend-plugin-api@0.12.1-next.1
  - @backstage/plugin-kubernetes-common@0.9.7-next.1

## 0.12.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.21.2-next.0
  - @backstage/core-components@0.18.2-next.0
  - @backstage/plugin-kubernetes-common@0.9.7-next.0
  - @backstage/core-compat-api@0.5.3-next.0
  - @backstage/frontend-plugin-api@0.12.1-next.0
  - @backstage/plugin-kubernetes-react@0.5.12-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/core-plugin-api@1.11.0
  - @backstage/plugin-permission-react@0.4.36

## 0.12.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.21.0
  - @backstage/frontend-plugin-api@0.12.0
  - @backstage/core-plugin-api@1.11.0
  - @backstage/core-components@0.18.0
  - @backstage/core-compat-api@0.5.2
  - @backstage/plugin-kubernetes-react@0.5.11

## 0.12.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.21.0-next.2
  - @backstage/core-components@0.17.6-next.1
  - @backstage/core-compat-api@0.5.2-next.2

## 0.12.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.20.2-next.1
  - @backstage/frontend-plugin-api@0.11.1-next.0
  - @backstage/core-components@0.17.6-next.0
  - @backstage/core-compat-api@0.5.2-next.1
  - @backstage/plugin-kubernetes-react@0.5.11-next.0

## 0.12.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-compat-api@0.5.2-next.0
  - @backstage/plugin-catalog-react@1.20.2-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/core-components@0.17.5
  - @backstage/core-plugin-api@1.10.9
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/plugin-kubernetes-common@0.9.6
  - @backstage/plugin-kubernetes-react@0.5.10
  - @backstage/plugin-permission-react@0.4.36

## 0.12.10

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- 3025cf5: Removed the kubernetes content padding to avoid double padding on k8s entity page
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/plugin-kubernetes-react@0.5.10

## 0.12.10-next.3

### Patch Changes

- 3025cf5: Removed the kubernetes content padding to avoid double padding on k8s entity page
- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0-next.2
  - @backstage/core-compat-api@0.5.0-next.3
  - @backstage/core-components@0.17.5-next.2

## 0.12.10-next.2

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0-next.1
  - @backstage/core-compat-api@0.5.0-next.2
  - @backstage/plugin-catalog-react@1.20.0-next.2
  - @backstage/core-components@0.17.5-next.1
  - @backstage/catalog-model@1.7.5
  - @backstage/core-plugin-api@1.10.9
  - @backstage/plugin-kubernetes-common@0.9.6
  - @backstage/plugin-kubernetes-react@0.5.10-next.0
  - @backstage/plugin-permission-react@0.4.36

## 0.12.10-next.1

### Patch Changes

- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- Updated dependencies
  - @backstage/core-compat-api@0.4.5-next.1
  - @backstage/plugin-catalog-react@1.20.0-next.1
  - @backstage/frontend-plugin-api@0.11.0-next.0
  - @backstage/core-components@0.17.5-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/core-plugin-api@1.10.9
  - @backstage/plugin-kubernetes-common@0.9.6
  - @backstage/plugin-kubernetes-react@0.5.10-next.0
  - @backstage/plugin-permission-react@0.4.36

## 0.12.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.19.2-next.0
  - @backstage/core-compat-api@0.4.5-next.0
  - @backstage/frontend-plugin-api@0.10.4

## 0.12.9

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.19.1
  - @backstage/catalog-model@1.7.5
  - @backstage/core-components@0.17.4
  - @backstage/core-plugin-api@1.10.9
  - @backstage/core-compat-api@0.4.4
  - @backstage/frontend-plugin-api@0.10.4
  - @backstage/plugin-kubernetes-common@0.9.6
  - @backstage/plugin-kubernetes-react@0.5.9
  - @backstage/plugin-permission-react@0.4.36

## 0.12.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/plugin-catalog-react@1.19.1-next.1
  - @backstage/core-components@0.17.4-next.1
  - @backstage/core-plugin-api@1.10.9-next.0
  - @backstage/plugin-permission-react@0.4.36-next.0
  - @backstage/plugin-kubernetes-common@0.9.6-next.0
  - @backstage/plugin-kubernetes-react@0.5.9-next.1
  - @backstage/core-compat-api@0.4.4-next.1
  - @backstage/frontend-plugin-api@0.10.4-next.1

## 0.12.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.19.1-next.0
  - @backstage/core-components@0.17.4-next.0
  - @backstage/catalog-model@1.7.4
  - @backstage/core-compat-api@0.4.4-next.0
  - @backstage/core-plugin-api@1.10.8
  - @backstage/frontend-plugin-api@0.10.4-next.0
  - @backstage/plugin-kubernetes-common@0.9.5
  - @backstage/plugin-kubernetes-react@0.5.9-next.0
  - @backstage/plugin-permission-react@0.4.35

## 0.12.8

### Patch Changes

- 18c64e9: Added the `info.packageJson` option to the plugin instance for the new frontend system.
- 3ea5d1b: chore(deps): Update deprecated xterm to new package under @xterm
- Updated dependencies
  - @backstage/core-components@0.17.3
  - @backstage/plugin-kubernetes-react@0.5.8
  - @backstage/core-plugin-api@1.10.8
  - @backstage/frontend-plugin-api@0.10.3
  - @backstage/plugin-catalog-react@1.19.0
  - @backstage/catalog-model@1.7.4
  - @backstage/core-compat-api@0.4.3
  - @backstage/plugin-kubernetes-common@0.9.5
  - @backstage/plugin-permission-react@0.4.35

## 0.12.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.3-next.0
  - @backstage/plugin-catalog-react@1.19.0-next.2
  - @backstage/frontend-plugin-api@0.10.3-next.1
  - @backstage/plugin-kubernetes-react@0.5.8-next.0
  - @backstage/catalog-model@1.7.4
  - @backstage/core-compat-api@0.4.3-next.2
  - @backstage/core-plugin-api@1.10.7
  - @backstage/plugin-kubernetes-common@0.9.5
  - @backstage/plugin-permission-react@0.4.34

## 0.12.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.18.1-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/core-compat-api@0.4.3-next.1
  - @backstage/core-components@0.17.2
  - @backstage/core-plugin-api@1.10.7
  - @backstage/frontend-plugin-api@0.10.3-next.0
  - @backstage/plugin-kubernetes-common@0.9.5
  - @backstage/plugin-kubernetes-react@0.5.7
  - @backstage/plugin-permission-react@0.4.34

## 0.12.8-next.0

### Patch Changes

- 18c64e9: Added the `info.packageJson` option to the plugin instance for the new frontend system.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.3-next.0
  - @backstage/core-compat-api@0.4.3-next.0
  - @backstage/plugin-catalog-react@1.18.1-next.0

## 0.12.7

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2
  - @backstage/plugin-kubernetes-react@0.5.7
  - @backstage/core-components@0.17.2
  - @backstage/catalog-model@1.7.4
  - @backstage/core-compat-api@0.4.2
  - @backstage/plugin-catalog-react@1.18.0
  - @backstage/plugin-kubernetes-common@0.9.5
  - @backstage/core-plugin-api@1.10.7
  - @backstage/plugin-permission-react@0.4.34

## 0.12.7-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-compat-api@0.4.2-next.3
  - @backstage/core-components@0.17.2-next.1
  - @backstage/core-plugin-api@1.10.7-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.3
  - @backstage/plugin-kubernetes-react@0.5.7-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/frontend-plugin-api@0.10.2-next.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/plugin-permission-react@0.4.34-next.1

## 0.12.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.7-next.0
  - @backstage/core-compat-api@0.4.2-next.2
  - @backstage/core-components@0.17.2-next.1
  - @backstage/frontend-plugin-api@0.10.2-next.1
  - @backstage/plugin-catalog-react@1.18.0-next.2
  - @backstage/plugin-kubernetes-react@0.5.7-next.1
  - @backstage/plugin-permission-react@0.4.34-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-kubernetes-common@0.9.5-next.0

## 0.12.7-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.5.7-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/plugin-permission-react@0.4.34-next.0

## 0.12.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-compat-api@0.4.2-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-components@0.17.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/frontend-plugin-api@0.10.1
  - @backstage/plugin-kubernetes-common@0.9.4
  - @backstage/plugin-kubernetes-react@0.5.6
  - @backstage/plugin-permission-react@0.4.33

## 0.12.6

### Patch Changes

- b877e46: Added New Frontend System filter for the Kubernetes tab to use `isKubernetesAvailable` to control its visibility
- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- Updated dependencies
  - @backstage/plugin-catalog-react@1.17.0
  - @backstage/frontend-plugin-api@0.10.1
  - @backstage/core-compat-api@0.4.1
  - @backstage/core-components@0.17.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/plugin-kubernetes-react@0.5.6
  - @backstage/plugin-permission-react@0.4.33
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-kubernetes-common@0.9.4

## 0.12.6-next.2

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.1-next.1
  - @backstage/core-compat-api@0.4.1-next.2
  - @backstage/core-components@0.17.1-next.1
  - @backstage/core-plugin-api@1.10.6-next.0
  - @backstage/plugin-kubernetes-react@0.5.6-next.1
  - @backstage/plugin-permission-react@0.4.33-next.0
  - @backstage/plugin-catalog-react@1.17.0-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-kubernetes-common@0.9.4

## 0.12.6-next.1

### Patch Changes

- b877e46: Added New Frontend System filter for the Kubernetes tab to use `isKubernetesAvailable` to control its visibility
- Updated dependencies
  - @backstage/core-components@0.17.1-next.0
  - @backstage/frontend-plugin-api@0.10.1-next.0
  - @backstage/plugin-catalog-react@1.16.1-next.1
  - @backstage/plugin-kubernetes-react@0.5.6-next.0
  - @backstage/core-compat-api@0.4.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.5
  - @backstage/plugin-kubernetes-common@0.9.4
  - @backstage/plugin-permission-react@0.4.32

## 0.12.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.16.1-next.0
  - @backstage/core-compat-api@0.4.1-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-components@0.17.0
  - @backstage/core-plugin-api@1.10.5
  - @backstage/frontend-plugin-api@0.10.0
  - @backstage/plugin-kubernetes-common@0.9.4
  - @backstage/plugin-kubernetes-react@0.5.5
  - @backstage/plugin-permission-react@0.4.32

## 0.12.5

### Patch Changes

- d517d13: refactor: use `KUBERNETES_ANNOTATION` and `KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION` annotations from `kubernetes-common`
- ba9649a: Set deployment as the default group of Kubernetes entity content. It is just an example and shouldn't cause any visual difference since entity page tabs with just one entity content appear as normal tabs.
- Updated dependencies
  - @backstage/core-components@0.17.0
  - @backstage/core-plugin-api@1.10.5
  - @backstage/frontend-plugin-api@0.10.0
  - @backstage/plugin-kubernetes-common@0.9.4
  - @backstage/plugin-catalog-react@1.16.0
  - @backstage/core-compat-api@0.4.0
  - @backstage/plugin-kubernetes-react@0.5.5
  - @backstage/plugin-permission-react@0.4.32
  - @backstage/catalog-model@1.7.3

## 0.12.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.0-next.2
  - @backstage/plugin-catalog-react@1.16.0-next.2
  - @backstage/core-compat-api@0.4.0-next.2
  - @backstage/core-components@0.16.5-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.4
  - @backstage/plugin-kubernetes-common@0.9.4-next.0
  - @backstage/plugin-kubernetes-react@0.5.5-next.2
  - @backstage/plugin-permission-react@0.4.31

## 0.12.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.5-next.0
  - @backstage/plugin-catalog-react@1.16.0-next.1
  - @backstage/core-compat-api@0.3.7-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.4
  - @backstage/frontend-plugin-api@0.9.6-next.1
  - @backstage/plugin-kubernetes-common@0.9.4-next.0
  - @backstage/plugin-kubernetes-react@0.5.5-next.1
  - @backstage/plugin-permission-react@0.4.31

## 0.12.5-next.0

### Patch Changes

- d517d13: refactor: use `KUBERNETES_ANNOTATION` and `KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION` annotations from `kubernetes-common`
- ba9649a: Set deployment as the default group of Kubernetes entity content. It is just an example and shouldn't cause any visual difference since entity page tabs with just one entity content appear as normal tabs.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.4-next.0
  - @backstage/plugin-catalog-react@1.16.0-next.0
  - @backstage/frontend-plugin-api@0.9.6-next.0
  - @backstage/plugin-kubernetes-react@0.5.5-next.0
  - @backstage/core-compat-api@0.3.7-next.0

## 0.12.4

### Patch Changes

- ca3da29: The `/clusters` endpoint is now protected by the `kubernetes.clusters.read` permission.
  The `/services/:serviceId` endpoint is now protected by the `kubernetes.resources.read` permission.
  The `/resources` endpoints are now protected by the `kubernetes.resources.read` permission.
- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.5.4
  - @backstage/core-components@0.16.4
  - @backstage/plugin-kubernetes-common@0.9.3
  - @backstage/plugin-catalog-react@1.15.2
  - @backstage/frontend-plugin-api@0.9.5
  - @backstage/core-compat-api@0.3.6
  - @backstage/core-plugin-api@1.10.4
  - @backstage/plugin-permission-react@0.4.31
  - @backstage/catalog-model@1.7.3

## 0.12.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.5-next.3
  - @backstage/core-compat-api@0.3.6-next.3
  - @backstage/catalog-model@1.7.3
  - @backstage/core-components@0.16.4-next.1
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/plugin-catalog-react@1.15.2-next.3
  - @backstage/plugin-kubernetes-common@0.9.3-next.1
  - @backstage/plugin-kubernetes-react@0.5.4-next.2
  - @backstage/plugin-permission-react@0.4.31-next.0

## 0.12.4-next.2

### Patch Changes

- ca3da29: The `/clusters` endpoint is now protected by the `kubernetes.clusters.read` permission.
  The `/services/:serviceId` endpoint is now protected by the `kubernetes.resources.read` permission.
  The `/resources` endpoints are now protected by the `kubernetes.resources.read` permission.
- Updated dependencies
  - @backstage/core-components@0.16.4-next.1
  - @backstage/plugin-kubernetes-common@0.9.3-next.1
  - @backstage/plugin-catalog-react@1.15.2-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/core-compat-api@0.3.6-next.2
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/frontend-plugin-api@0.9.5-next.2
  - @backstage/plugin-kubernetes-react@0.5.4-next.2
  - @backstage/plugin-permission-react@0.4.31-next.0

## 0.12.4-next.1

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.5.4-next.1
  - @backstage/core-components@0.16.4-next.0
  - @backstage/frontend-plugin-api@0.9.5-next.1
  - @backstage/core-compat-api@0.3.6-next.1
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/plugin-catalog-react@1.15.2-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-kubernetes-common@0.9.3-next.0

## 0.12.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.5.4-next.0
  - @backstage/plugin-kubernetes-common@0.9.3-next.0
  - @backstage/frontend-plugin-api@0.9.5-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-compat-api@0.3.6-next.0
  - @backstage/core-components@0.16.3
  - @backstage/core-plugin-api@1.10.3
  - @backstage/plugin-catalog-react@1.15.2-next.0

## 0.12.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.15.1
  - @backstage/frontend-plugin-api@0.9.4
  - @backstage/core-plugin-api@1.10.3
  - @backstage/core-components@0.16.3
  - @backstage/catalog-model@1.7.3
  - @backstage/core-compat-api@0.3.5
  - @backstage/plugin-kubernetes-common@0.9.2
  - @backstage/plugin-kubernetes-react@0.5.3

## 0.12.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.4-next.0
  - @backstage/core-plugin-api@1.10.3-next.0
  - @backstage/core-compat-api@0.3.5-next.0
  - @backstage/plugin-catalog-react@1.15.1-next.1
  - @backstage/core-components@0.16.3-next.0
  - @backstage/plugin-kubernetes-react@0.5.3-next.0
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/plugin-kubernetes-common@0.9.2-next.0

## 0.12.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.15.1-next.0
  - @backstage/core-compat-api@0.3.4

## 0.12.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.15.0
  - @backstage/core-compat-api@0.3.4
  - @backstage/frontend-plugin-api@0.9.3
  - @backstage/core-components@0.16.2
  - @backstage/catalog-model@1.7.2
  - @backstage/core-plugin-api@1.10.2
  - @backstage/plugin-kubernetes-common@0.9.1
  - @backstage/plugin-kubernetes-react@0.5.2

## 0.12.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-compat-api@0.3.4-next.2
  - @backstage/plugin-catalog-react@1.14.3-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/core-components@0.16.2-next.2
  - @backstage/core-plugin-api@1.10.2-next.0
  - @backstage/frontend-plugin-api@0.9.3-next.2
  - @backstage/plugin-kubernetes-common@0.9.1-next.0
  - @backstage/plugin-kubernetes-react@0.5.2-next.2

## 0.12.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.3-next.1
  - @backstage/core-components@0.16.2-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/core-compat-api@0.3.4-next.1
  - @backstage/core-plugin-api@1.10.1
  - @backstage/frontend-plugin-api@0.9.3-next.1
  - @backstage/plugin-kubernetes-common@0.9.0
  - @backstage/plugin-kubernetes-react@0.5.2-next.1

## 0.12.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.3-next.0
  - @backstage/frontend-plugin-api@0.9.3-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/core-compat-api@0.3.4-next.0
  - @backstage/core-components@0.16.2-next.0
  - @backstage/core-plugin-api@1.10.1
  - @backstage/plugin-kubernetes-common@0.9.0
  - @backstage/plugin-kubernetes-react@0.5.2-next.0

## 0.12.0

### Minor Changes

- 71b8704: Bumping @kubernetes/client-node to 1.0.0-rc7 to mitigate CVEs related to the request and tough-cookie packages

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.5.0
  - @backstage/plugin-catalog-react@1.14.1
  - @backstage/core-components@0.16.0
  - @backstage/plugin-kubernetes-common@0.9.0
  - @backstage/catalog-model@1.7.1
  - @backstage/core-compat-api@0.3.2
  - @backstage/core-plugin-api@1.10.1
  - @backstage/frontend-plugin-api@0.9.1

## 0.12.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.5.0-next.2
  - @backstage/core-components@0.16.0-next.2
  - @backstage/plugin-catalog-react@1.14.1-next.3
  - @backstage/core-compat-api@0.3.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/core-plugin-api@1.10.0
  - @backstage/frontend-plugin-api@0.9.1-next.2
  - @backstage/plugin-kubernetes-common@0.9.0-next.0

## 0.12.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.1-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/core-compat-api@0.3.2-next.1
  - @backstage/core-components@0.16.0-next.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/frontend-plugin-api@0.9.1-next.1
  - @backstage/plugin-kubernetes-common@0.9.0-next.0
  - @backstage/plugin-kubernetes-react@0.5.0-next.1

## 0.12.0-next.1

### Minor Changes

- 71b8704: Bumping @kubernetes/client-node to 1.0.0-rc7 to mitigate CVEs related to the request and tough-cookie packages

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.9.0-next.0
  - @backstage/plugin-kubernetes-react@0.5.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/core-compat-api@0.3.2-next.1
  - @backstage/core-components@0.16.0-next.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/frontend-plugin-api@0.9.1-next.1
  - @backstage/plugin-catalog-react@1.14.1-next.1

## 0.11.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/core-compat-api@0.3.2-next.0
  - @backstage/core-plugin-api@1.10.0
  - @backstage/frontend-plugin-api@0.9.1-next.0
  - @backstage/plugin-catalog-react@1.14.1-next.0
  - @backstage/plugin-kubernetes-common@0.8.3
  - @backstage/plugin-kubernetes-react@0.4.5-next.0

## 0.11.16

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- 605e0bb: Updated dependency `@kubernetes-models/base` to `^5.0.0`.
- 276cd3d: Updated dependency `@kubernetes-models/apimachinery` to `^2.0.0`.
- Updated dependencies
  - @backstage/core-components@0.15.1
  - @backstage/frontend-plugin-api@0.9.0
  - @backstage/core-compat-api@0.3.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/plugin-kubernetes-react@0.4.4
  - @backstage/plugin-catalog-react@1.14.0
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.11.16-next.2

### Patch Changes

- 276cd3d: Updated dependency `@kubernetes-models/apimachinery` to `^2.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/plugin-kubernetes-react@0.4.4-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.11.16-next.1

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- 605e0bb: Updated dependency `@kubernetes-models/base` to `^5.0.0`.
- Updated dependencies
  - @backstage/core-components@0.15.1-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.1
  - @backstage/core-compat-api@0.3.1-next.1
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/plugin-kubernetes-react@0.4.4-next.1
  - @backstage/plugin-catalog-react@1.14.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.11.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.0-next.0
  - @backstage/core-compat-api@0.3.1-next.0
  - @backstage/core-components@0.15.1-next.0
  - @backstage/core-plugin-api@1.10.0-next.0
  - @backstage/plugin-catalog-react@1.13.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-kubernetes-common@0.8.3
  - @backstage/plugin-kubernetes-react@0.4.4-next.0

## 0.11.14

### Patch Changes

- fec8b57: Updated exports to use the new type parameters for extensions and extension blueprints.
- bfc0f42: Make k8s entity content appear on components & resources only by default in new FE system
- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/core-components@0.15.0
  - @backstage/plugin-catalog-react@1.13.0
  - @backstage/frontend-plugin-api@0.8.0
  - @backstage/core-compat-api@0.3.0
  - @backstage/catalog-model@1.7.0
  - @backstage/core-plugin-api@1.9.4
  - @backstage/plugin-kubernetes-react@0.4.3
  - @backstage/plugin-kubernetes-common@0.8.3

## 0.11.14-next.2

### Patch Changes

- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/core-components@0.14.11-next.1
  - @backstage/plugin-catalog-react@1.13.0-next.2
  - @backstage/core-compat-api@0.3.0-next.2
  - @backstage/core-plugin-api@1.9.4-next.0
  - @backstage/frontend-plugin-api@0.8.0-next.2
  - @backstage/plugin-kubernetes-react@0.4.3-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/plugin-kubernetes-common@0.8.2

## 0.11.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.8.0-next.1
  - @backstage/core-compat-api@0.3.0-next.1
  - @backstage/core-components@0.14.11-next.0
  - @backstage/plugin-catalog-react@1.12.4-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/plugin-kubernetes-common@0.8.2
  - @backstage/plugin-kubernetes-react@0.4.3-next.0

## 0.11.14-next.0

### Patch Changes

- fec8b57: Updated exports to use the new type parameters for extensions and extension blueprints.
- bfc0f42: Make k8s entity content appear on components & resources only by default in new FE system
- Updated dependencies
  - @backstage/frontend-plugin-api@0.8.0-next.0
  - @backstage/core-compat-api@0.2.9-next.0
  - @backstage/plugin-catalog-react@1.12.4-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/core-components@0.14.10
  - @backstage/core-plugin-api@1.9.3
  - @backstage/plugin-kubernetes-common@0.8.2
  - @backstage/plugin-kubernetes-react@0.4.2

## 0.11.13

### Patch Changes

- e6c15cc: Adds support for Backstage's new frontend system, available via the `/alpha` sub-path export.
- fe1fbb2: Migrating usages of the deprecated `createExtension` `v1` format to the newer `v2` format, and old `create*Extension` extension creators to blueprints.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.7.0
  - @backstage/plugin-catalog-react@1.12.3
  - @backstage/plugin-kubernetes-react@0.4.2
  - @backstage/core-components@0.14.10
  - @backstage/core-compat-api@0.2.8
  - @backstage/catalog-model@1.6.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/plugin-kubernetes-common@0.8.2

## 0.11.13-next.3

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.7.0-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/core-compat-api@0.2.8-next.3
  - @backstage/plugin-catalog-react@1.12.3-next.3
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/plugin-kubernetes-common@0.8.2-next.2
  - @backstage/plugin-kubernetes-react@0.4.2-next.3

## 0.11.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.7.0-next.2
  - @backstage/core-compat-api@0.2.8-next.2
  - @backstage/plugin-catalog-react@1.12.3-next.2
  - @backstage/plugin-kubernetes-common@0.8.2-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/plugin-kubernetes-react@0.4.2-next.2

## 0.11.13-next.1

### Patch Changes

- e6c15cc: Adds support for Backstage's new frontend system, available via the `/alpha` sub-path export.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.12.3-next.1
  - @backstage/frontend-plugin-api@0.6.8-next.1
  - @backstage/core-compat-api@0.2.8-next.1
  - @backstage/plugin-kubernetes-common@0.8.2-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/plugin-kubernetes-react@0.4.2-next.1

## 0.11.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.12.3-next.0
  - @backstage/core-components@0.14.10-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/plugin-kubernetes-common@0.8.1
  - @backstage/plugin-kubernetes-react@0.4.2-next.0

## 0.11.12

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9
  - @backstage/plugin-catalog-react@1.12.2
  - @backstage/plugin-kubernetes-react@0.4.1
  - @backstage/plugin-kubernetes-common@0.8.1
  - @backstage/catalog-model@1.5.0
  - @backstage/core-plugin-api@1.9.3

## 0.11.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9-next.1
  - @backstage/plugin-kubernetes-react@0.4.1-next.1
  - @backstage/plugin-catalog-react@1.12.2-next.2

## 0.11.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.12.2-next.1
  - @backstage/core-components@0.14.9-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/plugin-kubernetes-react@0.4.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/plugin-kubernetes-common@0.8.0

## 0.11.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9-next.0
  - @backstage/plugin-catalog-react@1.12.2-next.0
  - @backstage/plugin-kubernetes-react@0.4.1-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/catalog-model@1.5.0
  - @backstage/plugin-kubernetes-common@0.8.0

## 0.11.11

### Patch Changes

- 4f92394: Migrate from identityApi to fetchApi in frontend plugins.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/core-components@0.14.8
  - @backstage/plugin-kubernetes-react@0.4.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/plugin-kubernetes-common@0.8.0
  - @backstage/plugin-catalog-react@1.12.1
  - @backstage/catalog-model@1.5.0

## 0.11.11-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/core-components@0.14.8-next.2
  - @backstage/plugin-kubernetes-common@0.8.0-next.1
  - @backstage/plugin-kubernetes-react@0.4.0-next.3
  - @backstage/plugin-catalog-react@1.12.1-next.2
  - @backstage/catalog-model@1.5.0
  - @backstage/core-plugin-api@1.9.3-next.0

## 0.11.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8-next.1
  - @backstage/core-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-react@1.12.1-next.1
  - @backstage/plugin-kubernetes-react@0.4.0-next.2
  - @backstage/catalog-model@1.5.0
  - @backstage/plugin-kubernetes-common@0.8.0-next.0

## 0.11.11-next.1

### Patch Changes

- 4f92394: Migrate from identityApi to fetchApi in frontend plugins.
- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.4.0-next.1
  - @backstage/plugin-kubernetes-common@0.8.0-next.0
  - @backstage/plugin-catalog-react@1.12.1-next.0

## 0.11.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/core-plugin-api@1.9.2
  - @backstage/plugin-catalog-react@1.12.1-next.0
  - @backstage/plugin-kubernetes-common@0.7.6
  - @backstage/plugin-kubernetes-react@0.3.6-next.0

## 0.11.10

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.7
  - @backstage/catalog-model@1.5.0
  - @backstage/plugin-catalog-react@1.12.0
  - @backstage/plugin-kubernetes-react@0.3.5
  - @backstage/plugin-kubernetes-common@0.7.6

## 0.11.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.12.0-next.2
  - @backstage/core-components@0.14.7-next.2

## 0.11.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.6-next.1
  - @backstage/plugin-kubernetes-react@0.3.5-next.1
  - @backstage/plugin-catalog-react@1.11.4-next.1

## 0.11.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/core-components@0.14.5-next.0
  - @backstage/plugin-catalog-react@1.11.4-next.0
  - @backstage/plugin-kubernetes-common@0.7.6-next.0
  - @backstage/plugin-kubernetes-react@0.3.5-next.0
  - @backstage/core-plugin-api@1.9.2

## 0.11.9

### Patch Changes

- abfbcfc: Updated dependency `@testing-library/react` to `^15.0.0`.
- cb1e3b0: Updated dependency `@testing-library/dom` to `^10.0.0`.
- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.3.4
  - @backstage/plugin-catalog-react@1.11.3
  - @backstage/core-components@0.14.4
  - @backstage/core-plugin-api@1.9.2
  - @backstage/catalog-model@1.4.5
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.11.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.3.4-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/core-components@0.14.4-next.0
  - @backstage/core-plugin-api@1.9.1
  - @backstage/plugin-catalog-react@1.11.3-next.1
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.11.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.4-next.0
  - @backstage/catalog-model@1.4.5
  - @backstage/core-plugin-api@1.9.1
  - @backstage/plugin-catalog-react@1.11.3-next.0
  - @backstage/plugin-kubernetes-common@0.7.5
  - @backstage/plugin-kubernetes-react@0.3.4-next.0

## 0.11.8

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.3
  - @backstage/plugin-kubernetes-react@0.3.3
  - @backstage/plugin-catalog-react@1.11.2
  - @backstage/core-plugin-api@1.9.1
  - @backstage/catalog-model@1.4.5
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.11.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.2
  - @backstage/plugin-kubernetes-react@0.3.2
  - @backstage/plugin-catalog-react@1.11.1
  - @backstage/core-plugin-api@1.9.1
  - @backstage/catalog-model@1.4.5
  - @backstage/plugin-kubernetes-common@0.7.5

## 0.11.6

### Patch Changes

- 0e1941b: Added an optional ESLint rule - no-top-level-material-ui-4-imports -in kubernetes plugin which has an auto fix function to migrate the imports and used it to migrate the Material UI imports for plugins/kubernetes.
- Updated dependencies
  - @backstage/core-components@0.14.1
  - @backstage/plugin-catalog-react@1.11.0
  - @backstage/plugin-kubernetes-common@0.7.5
  - @backstage/plugin-kubernetes-react@0.3.1
  - @backstage/catalog-model@1.4.5
  - @backstage/core-plugin-api@1.9.1

## 0.11.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.2
  - @backstage/plugin-catalog-react@1.11.0-next.2
  - @backstage/plugin-kubernetes-react@0.3.1-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## 0.11.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-kubernetes-react@0.3.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## 0.11.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.0
  - @backstage/plugin-catalog-react@1.10.1-next.0
  - @backstage/plugin-kubernetes-common@0.7.5-next.0
  - @backstage/plugin-kubernetes-react@0.3.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-plugin-api@1.9.1-next.0

## 0.11.5

### Patch Changes

- b01c86c: The `ErrorReporting` component's cluster column now displays cluster titles when
  specified.
- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.10.0
  - @backstage/plugin-kubernetes-react@0.3.0
  - @backstage/core-components@0.14.0
  - @backstage/plugin-kubernetes-common@0.7.4
  - @backstage/catalog-model@1.4.4
  - @backstage/core-plugin-api@1.9.0

## 0.11.5-next.3

### Patch Changes

- b01c86c: The `ErrorReporting` component's cluster column now displays cluster titles when
  specified.
- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.3.0-next.3
  - @backstage/plugin-kubernetes-common@0.7.4-next.2
  - @backstage/core-components@0.14.0-next.2
  - @backstage/plugin-catalog-react@1.10.0-next.3
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/core-plugin-api@1.9.0-next.1

## 0.11.5-next.2

### Patch Changes

- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- Updated dependencies
  - @backstage/core-components@0.14.0-next.1
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/plugin-catalog-react@1.10.0-next.2
  - @backstage/plugin-kubernetes-react@0.3.0-next.2
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/plugin-kubernetes-common@0.7.4-next.1

## 0.11.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.0-next.0
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/plugin-kubernetes-react@0.3.0-next.1
  - @backstage/core-plugin-api@1.8.3-next.0
  - @backstage/plugin-catalog-react@1.9.4-next.1
  - @backstage/plugin-kubernetes-common@0.7.4-next.1

## 0.11.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.9.4-next.0
  - @backstage/plugin-kubernetes-react@0.3.0-next.0
  - @backstage/plugin-kubernetes-common@0.7.4-next.0
  - @backstage/core-components@0.13.10
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.2

## 0.11.4

### Patch Changes

- d5d2c67: Add `authuser` search parameter to GKE cluster link formatter in k8s plugin

  Thanks to this, people with multiple simultaneously logged-in accounts in their GCP console will automatically view objects with the same email as the one signed in to the Google auth provider in Backstage.

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/core-components@0.13.10
  - @backstage/core-plugin-api@1.8.2
  - @backstage/plugin-kubernetes-react@0.2.1
  - @backstage/plugin-kubernetes-common@0.7.3
  - @backstage/plugin-catalog-react@1.9.3
  - @backstage/catalog-model@1.4.3

## 0.11.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.9.3-next.2

## 0.11.4-next.1

### Patch Changes

- d5d2c67: Add `authuser` search parameter to GKE cluster link formatter in k8s plugin

  Thanks to this, people with multiple simultaneously logged-in accounts in their GCP console will automatically view objects with the same email as the one signed in to the Google auth provider in Backstage.

- Updated dependencies
  - @backstage/core-plugin-api@1.8.2-next.0
  - @backstage/plugin-kubernetes-react@0.2.1-next.1
  - @backstage/core-components@0.13.10-next.1
  - @backstage/plugin-catalog-react@1.9.3-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-kubernetes-common@0.7.3-next.0

## 0.11.4-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/core-components@0.13.10-next.0
  - @backstage/plugin-kubernetes-common@0.7.3-next.0
  - @backstage/plugin-catalog-react@1.9.3-next.0
  - @backstage/plugin-kubernetes-react@0.2.1-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.1

## 0.11.3

### Patch Changes

- 899d71a: Change `formatClusterLink` to be an API and make it async for further customization possibilities.

  **BREAKING**
  If you have a custom k8s page and used `formatClusterLink` directly, you need to migrate to new `kubernetesClusterLinkFormatterApiRef`

- 706fc3a: Updated dependency `@kubernetes/client-node` to `0.20.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1
  - @backstage/plugin-catalog-react@1.9.2
  - @backstage/core-components@0.13.9
  - @backstage/theme@0.5.0
  - @backstage/plugin-kubernetes-react@0.2.0
  - @backstage/plugin-kubernetes-common@0.7.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.11.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-react@1.9.2-next.3
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/plugin-kubernetes-react@0.2.0-next.3

## 0.11.3-next.2

### Patch Changes

- 899d71a: Change `formatClusterLink` to be an API and make it async for further customization possibilities.

  **BREAKING**
  If you have a custom k8s page and used `formatClusterLink` directly, you need to migrate to new `kubernetesClusterLinkFormatterApiRef`

- Updated dependencies
  - @backstage/theme@0.5.0-next.1
  - @backstage/plugin-kubernetes-react@0.2.0-next.2
  - @backstage/plugin-catalog-react@1.9.2-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/core-components@0.13.9-next.2
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1

## 0.11.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/plugin-kubernetes-react@0.1.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1

## 0.11.3-next.0

### Patch Changes

- 706fc3a7e1: Updated dependency `@kubernetes/client-node` to `0.20.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-react@1.9.2-next.0
  - @backstage/core-components@0.13.9-next.0
  - @backstage/plugin-kubernetes-react@0.1.2-next.0
  - @backstage/plugin-kubernetes-common@0.7.2-next.0
  - @backstage/theme@0.5.0-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.11.1

### Patch Changes

- 6c2b872153: Add official support for React 18.
- fdb5e23602: Import `MissingAnnotationEmptyState` from `@backstage/plugin-catalog-react` to remove the cyclical dependency
- Updated dependencies
  - @backstage/plugin-catalog-react@1.9.0
  - @backstage/core-components@0.13.8
  - @backstage/plugin-kubernetes-common@0.7.1
  - @backstage/plugin-kubernetes-react@0.1.1
  - @backstage/core-plugin-api@1.8.0
  - @backstage/theme@0.4.4
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.11.1-next.2

### Patch Changes

- [#20842](https://github.com/backstage/backstage/pull/20842) [`fdb5e23602`](https://github.com/backstage/backstage/commit/fdb5e2360299c5faa30f4d4236fc548b94d37446) Thanks [@benjdlambert](https://github.com/benjdlambert)! - Import `MissingAnnotationEmptyState` from `@backstage/plugin-catalog-react` to remove the cyclical dependency

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.1-next.1
  - @backstage/core-components@0.13.8-next.2
  - @backstage/plugin-catalog-react@1.9.0-next.2
  - @backstage/plugin-kubernetes-react@0.1.1-next.2

## 0.11.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.1.1-next.1
  - @backstage/plugin-catalog-react@1.9.0-next.1
  - @backstage/core-components@0.13.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.1-next.0

## 0.11.1-next.0

### Patch Changes

- 6c2b872153: Add official support for React 18.
- Updated dependencies
  - @backstage/core-components@0.13.7-next.0
  - @backstage/plugin-catalog-react@1.9.0-next.0
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/plugin-kubernetes-react@0.1.1-next.0
  - @backstage/theme@0.4.4-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.1-next.0

## 0.11.0

### Minor Changes

- 2d8151061c: Refactor Kubernetes plugins in line with ADR 11, no breaking changes yet

### Patch Changes

- 9101c0d1b6: Updated dependency `@kubernetes/client-node` to `0.19.0`.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- b0aca1a798: Updated dependency `xterm-addon-attach` to `^0.9.0`.
  Updated dependency `xterm-addon-fit` to `^0.8.0`.
- 95518765ee: Add Kubernetes cluster plugin. Viewing Kubernetes clusters as an Admin from Backstage
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-kubernetes-react@0.1.0
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.11.0-next.2

### Patch Changes

- 95518765ee: Add Kubernetes cluster plugin. Viewing Kubernetes clusters as an Admin from Backstage
- Updated dependencies
  - @backstage/core-components@0.13.6-next.2
  - @backstage/core-plugin-api@1.7.0-next.1
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/plugin-catalog-react@1.8.5-next.2
  - @backstage/errors@1.2.3-next.0
  - @backstage/plugin-kubernetes-react@0.1.0-next.1
  - @backstage/theme@0.4.3-next.0
  - @backstage/plugin-kubernetes-common@0.7.0-next.1
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1

## 0.11.0-next.1

### Minor Changes

- 2d8151061c: Refactor Kubernetes plugins in line with ADR 11, no breaking changes yet

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.6-next.1
  - @backstage/plugin-kubernetes-common@0.7.0-next.0
  - @backstage/plugin-kubernetes-react@0.1.0-next.0
  - @backstage/plugin-catalog-react@1.8.5-next.1
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/theme@0.4.2
  - @backstage/types@1.1.1

## 0.10.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5-next.0
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/core-components@0.13.6-next.0
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/theme@0.4.2
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.6.6

## 0.10.3

### Patch Changes

- 0ad36158d980: Loosened the type of the `auth` field in the body of requests to the `retrieveObjectsByServiceId` endpoint. Now any JSON object is allowed, which should make it easier for integrators to write their own custom auth strategies for Kubernetes.
- 7032c214f3b4: Add pod exec terminal to Container Card
- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- 6ddeade58b4c: Avoid eager use of `TextEncoder` in order not to break tests.
- 6a5e04e20e6e: fix logs dialog min height
- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.6.6
  - @backstage/plugin-catalog-react@1.8.4
  - @backstage/core-components@0.13.5
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/core-plugin-api@1.6.0
  - @backstage/errors@1.2.2
  - @backstage/theme@0.4.2
  - @backstage/types@1.1.1

## 0.10.3-next.3

### Patch Changes

- 7032c214f3b4: Add pod exec terminal to Container Card
- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/core-components@0.13.5-next.3
  - @backstage/core-plugin-api@1.6.0-next.3
  - @backstage/errors@1.2.2-next.0
  - @backstage/plugin-catalog-react@1.8.4-next.3
  - @backstage/plugin-kubernetes-common@0.6.6-next.2
  - @backstage/theme@0.4.2-next.0

## 0.10.3-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-kubernetes-common@0.6.6-next.1

## 0.10.3-next.1

### Patch Changes

- 6a5e04e20e6e: fix logs dialog min height
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.6.6-next.0
  - @backstage/plugin-catalog-react@1.8.4-next.1
  - @backstage/core-components@0.13.5-next.1
  - @backstage/config@1.1.0-next.0
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/core-plugin-api@1.6.0-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## 0.10.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.0
  - @backstage/core-components@0.13.5-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-catalog-react@1.8.3-next.0
  - @backstage/plugin-kubernetes-common@0.6.5

## 0.10.0

### Minor Changes

- 4b6d41737aad: **BREAKING**: Fixed typos in exported module attributes. Many users may see no changes, but if you have customized the plugin output, you may have to rename the following:

  - Component attribute: `<ResourceUtilization totalFormated={} />` to `<ResourceUtilization totalFormatted={} />`
  - Interface attribute: `DetectedError.occuranceCount` to `DetectedError.occurrenceCount`.

### Patch Changes

- 562e34d2693f: Fix container memory limits
- Updated dependencies
  - @backstage/core-components@0.13.4
  - @backstage/plugin-catalog-react@1.8.1
  - @backstage/core-plugin-api@1.5.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-kubernetes-common@0.6.5

## 0.9.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## 0.9.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.4-next.0
  - @backstage/core-plugin-api@1.5.3
  - @backstage/plugin-catalog-react@1.8.1-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-kubernetes-common@0.6.5

## 0.9.3

### Patch Changes

- d62fc3fe85ba: Make pod drawer headings consistent
- cc27fa4a1aac: Changed Google cloud auth scope to read-only.
- Updated dependencies
  - @backstage/theme@0.4.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-react@1.8.0
  - @backstage/core-components@0.13.3
  - @backstage/core-plugin-api@1.5.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/plugin-kubernetes-common@0.6.5

## 0.9.3-next.2

### Patch Changes

- cc27fa4a1aac: Changed Google cloud auth scope to read-only.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.0-next.2
  - @backstage/theme@0.4.1-next.1
  - @backstage/core-plugin-api@1.5.3-next.1
  - @backstage/core-components@0.13.3-next.2
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1-next.0
  - @backstage/plugin-kubernetes-common@0.6.5-next.0

## 0.9.3-next.1

### Patch Changes

- d62fc3fe85ba: Make pod drawer headings consistent
- Updated dependencies
  - @backstage/theme@0.4.1-next.0
  - @backstage/core-components@0.13.3-next.1
  - @backstage/core-plugin-api@1.5.3-next.0
  - @backstage/plugin-catalog-react@1.7.1-next.1
  - @backstage/config@1.0.8

## 0.9.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/core-components@0.13.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/core-plugin-api@1.5.2
  - @backstage/theme@0.4.0
  - @backstage/plugin-catalog-react@1.7.1-next.0
  - @backstage/plugin-kubernetes-common@0.6.5-next.0

## 0.9.2

### Patch Changes

- dc3cddf51ab5: Fix cyclical dependency in built output
- 4e697e88f0e2: Add resource utilization to Pod Drawer
- 4b230b97660d: Add errors to PodDrawer
- 73cc0deee48a: Add proposed fix dialog for pod errors
- Updated dependencies
  - @backstage/core-plugin-api@1.5.2
  - @backstage/core-components@0.13.2
  - @backstage/theme@0.4.0
  - @backstage/plugin-catalog-react@1.7.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/config@1.0.8
  - @backstage/plugin-kubernetes-common@0.6.4

## 0.9.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.2-next.3
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/theme@0.4.0-next.1
  - @backstage/plugin-catalog-react@1.7.0-next.3
  - @backstage/plugin-kubernetes-common@0.6.4-next.1

## 0.9.2-next.2

### Patch Changes

- 73cc0deee48a: Add proposed fix dialog for pod errors
- Updated dependencies
  - @backstage/theme@0.4.0-next.1
  - @backstage/plugin-catalog-react@1.7.0-next.2
  - @backstage/core-components@0.13.2-next.2
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.2-next.0

## 0.9.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.0-next.0
  - @backstage/core-components@0.13.2-next.1
  - @backstage/plugin-catalog-react@1.7.0-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/plugin-kubernetes-common@0.6.4-next.0
  - @backstage/config@1.0.7
  - @backstage/theme@0.4.0-next.0

## 0.9.2-next.0

### Patch Changes

- dc3cddf51ab5: Fix cyclical dependency in built output
- 4b230b97660d: Add errors to PodDrawer
- Updated dependencies
  - @backstage/plugin-catalog-react@1.7.0-next.0
  - @backstage/theme@0.4.0-next.0
  - @backstage/config@1.0.7
  - @backstage/core-components@0.13.2-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/plugin-kubernetes-common@0.6.3

## 0.9.0

### Minor Changes

- 280ec10c18e: Added Pod logs components for Kubernetes plugin

  **BREAKING**: `kubernetesProxyApi` for custom plugins built with components from the Kubernetes plugin apis, `kubernetesProxyApi` should be added to the plugin's API list.

  ```
  ...
  export const kubernetesPlugin = createPlugin({
    id: 'kubernetes',
    apis: [
  ...
      createApiFactory({
          api: kubernetesProxyApiRef,
          deps: {
          kubernetesApi: kubernetesApiRef,
          },
          factory: ({ kubernetesApi }) =>
          new KubernetesProxyClient({
              kubernetesApi,
          }),
      }),
  ```

  **BREAKING**: `KubernetesDrawer` is now called `KubernetesStructuredMetadataTableDrawer` so that we can do more than just show `StructuredMetadataTable`

  `import { KubernetesDrawer } from "@backstage/plugin-kubernetes"`

  should now be:

  `import { KubernetesStructuredMetadataTableDrawer } from "@backstage/plugin-kubernetes"`

### Patch Changes

- c7bad1005ba: The Kubernetes plugin now requests AKS access tokens from Azure when retrieving
  objects from clusters configured with `authProvider: aks` and sets `auth.aks` in
  its request bodies appropriately.
- a160e02c3d7: Omit managed fields in the Kubernetes resource YAML display.
- Updated dependencies
  - @backstage/theme@0.3.0
  - @backstage/plugin-catalog-react@1.6.0
  - @backstage/core-components@0.13.1
  - @backstage/plugin-kubernetes-common@0.6.3
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.1
  - @backstage/errors@1.1.5

## 0.9.0-next.2

### Patch Changes

- c7bad1005ba: The Kubernetes plugin now requests AKS access tokens from Azure when retrieving
  objects from clusters configured with `authProvider: aks` and sets `auth.aks` in
  its request bodies appropriately.
- Updated dependencies
  - @backstage/theme@0.3.0-next.0
  - @backstage/core-components@0.13.1-next.1
  - @backstage/plugin-kubernetes-common@0.6.3-next.0
  - @backstage/plugin-catalog-react@1.6.0-next.2
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.1

## 0.9.0-next.1

### Minor Changes

- 280ec10c18e: Added Pod logs components for Kubernetes plugin

  **BREAKING**: `kubernetesProxyApi` for custom plugins built with components from the Kubernetes plugin apis, `kubernetesProxyApi` should be added to the plugin's API list.

  ```
  ...
  export const kubernetesPlugin = createPlugin({
    id: 'kubernetes',
    apis: [
  ...
      createApiFactory({
          api: kubernetesProxyApiRef,
          deps: {
          kubernetesApi: kubernetesApiRef,
          },
          factory: ({ kubernetesApi }) =>
          new KubernetesProxyClient({
              kubernetesApi,
          }),
      }),
  ```

  **BREAKING**: `KubernetesDrawer` is now called `KubernetesStructuredMetadataTableDrawer` so that we can do more than just show `StructuredMetadataTable`

  `import { KubernetesDrawer } from "@backstage/plugin-kubernetes"`

  should now be:

  `import { KubernetesStructuredMetadataTableDrawer } from "@backstage/plugin-kubernetes"`

### Patch Changes

- a160e02c3d7: Omit managed fields in the Kubernetes resource YAML display.
- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/config@1.0.7

## 0.8.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.6.0-next.0
  - @backstage/core-components@0.13.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/theme@0.2.19
  - @backstage/plugin-kubernetes-common@0.6.2

## 0.8.0

### Minor Changes

- 754be7c5106: refactor kubernetes error detection to make way for proposed solutions

  **BREAKING**: `DetectedError` now appears once per Kubernetes resource per error instead of for all resources which have that error, `namespace` and `name` fields are now in `sourceRef` object `message` is now a `string` instead of a `string[]`. `ErrorDetectableKind` has been removed.

### Patch Changes

- 8e00acb28db: Small tweaks to remove warnings in the console during development (mainly focusing on techdocs)
- e7fb0117485: fixes a bug where an empty authorization header was provided to the proxy endpoint when a cluster had a server-side auth provider
- c159ab64a60: `KubernetesBackendClient` now requires a `kubernetesAuthProvidersApi` value to be provided. `KubernetesApi` interface now has a proxy method requirement.
- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/core-components@0.13.0
  - @backstage/plugin-catalog-react@1.5.0
  - @backstage/theme@0.2.19
  - @backstage/core-plugin-api@1.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-kubernetes-common@0.6.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.8.0-next.3

### Minor Changes

- 754be7c5106: refactor kubernetes error detection to make way for proposed solutions

  **BREAKING**: `DetectedError` now appears once per Kubernetes resource per error instead of for all resources which have that error, `namespace` and `name` fields are now in `sourceRef` object `message` is now a `string` instead of a `string[]`. `ErrorDetectableKind` has been removed.

### Patch Changes

- e7fb0117485: fixes a bug where an empty authorization header was provided to the proxy endpoint when a cluster had a server-side auth provider
- c159ab64a60: `KubernetesBackendClient` now requires a `kubernetesAuthProvidersApi` value to be provided. `KubernetesApi` interface now has a proxy method requirement.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.5.0-next.3
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/core-components@0.13.0-next.3
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/errors@1.1.5
  - @backstage/theme@0.2.19-next.0
  - @backstage/plugin-kubernetes-common@0.6.2-next.2

## 0.7.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.6-next.2
  - @backstage/plugin-catalog-react@1.4.1-next.2
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/theme@0.2.19-next.0
  - @backstage/plugin-kubernetes-common@0.6.2-next.1

## 0.7.10-next.1

### Patch Changes

- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/core-components@0.12.6-next.1
  - @backstage/core-plugin-api@1.5.1-next.0
  - @backstage/plugin-catalog-react@1.4.1-next.1
  - @backstage/theme@0.2.19-next.0
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/plugin-kubernetes-common@0.6.2-next.1

## 0.7.10-next.0

### Patch Changes

- 8e00acb28db: Small tweaks to remove warnings in the console during development (mainly focusing on techdocs)
- Updated dependencies
  - @backstage/core-components@0.12.6-next.0
  - @backstage/plugin-catalog-react@1.4.1-next.0
  - @backstage/plugin-kubernetes-common@0.6.2-next.0
  - @backstage/core-plugin-api@1.5.0
  - @backstage/config@1.0.7
  - @backstage/catalog-model@1.2.1
  - @backstage/theme@0.2.18

## 0.7.9

### Patch Changes

- 8adeb19b37d: GitLab can now be used as an `oidcTokenProvider` for Kubernetes clusters
- c10384a9235: Switch to using `LinkButton` instead of the deprecated `Button`
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/core-components@0.12.5
  - @backstage/plugin-catalog-react@1.4.0
  - @backstage/core-plugin-api@1.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/theme@0.2.18
  - @backstage/plugin-kubernetes-common@0.6.1

## 0.7.9-next.2

### Patch Changes

- 8adeb19b37d: GitLab can now be used as an `oidcTokenProvider` for Kubernetes clusters
- Updated dependencies
  - @backstage/core-components@0.12.5-next.2
  - @backstage/plugin-catalog-react@1.4.0-next.2
  - @backstage/core-plugin-api@1.5.0-next.2
  - @backstage/config@1.0.7-next.0

## 0.7.9-next.1

### Patch Changes

- c10384a9235: Switch to using `LinkButton` instead of the deprecated `Button`
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/core-components@0.12.5-next.1
  - @backstage/core-plugin-api@1.4.1-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/theme@0.2.18-next.0
  - @backstage/plugin-catalog-react@1.4.0-next.1
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/plugin-kubernetes-common@0.6.1-next.1

## 0.7.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.4.0-next.0
  - @backstage/core-plugin-api@1.4.1-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/config@1.0.6
  - @backstage/core-components@0.12.5-next.0
  - @backstage/theme@0.2.17
  - @backstage/plugin-kubernetes-common@0.6.1-next.0

## 0.7.8

### Patch Changes

- 145a79a15b: Condenses kubernetes ui plugin to fit more onscreen and increase visibility
- 628e2bd89a: Updated dependency `@kubernetes/client-node` to `0.18.1`.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.6.0
  - @backstage/core-components@0.12.4
  - @backstage/catalog-model@1.2.0
  - @backstage/theme@0.2.17
  - @backstage/core-plugin-api@1.4.0
  - @backstage/plugin-catalog-react@1.3.0
  - @backstage/config@1.0.6

## 0.7.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/core-components@0.12.4-next.1
  - @backstage/config@1.0.6
  - @backstage/core-plugin-api@1.3.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.3.0-next.2
  - @backstage/plugin-kubernetes-common@0.6.0-next.2

## 0.7.8-next.1

### Patch Changes

- 145a79a15b: Condenses kubernetes ui plugin to fit more onscreen and increase visibility
- 628e2bd89a: Updated dependency `@kubernetes/client-node` to `0.18.1`.
- Updated dependencies
  - @backstage/core-components@0.12.4-next.0
  - @backstage/plugin-kubernetes-common@0.6.0-next.1
  - @backstage/plugin-catalog-react@1.3.0-next.1
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/core-plugin-api@1.3.0
  - @backstage/theme@0.2.16

## 0.7.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.6.0-next.0
  - @backstage/plugin-catalog-react@1.3.0-next.0
  - @backstage/catalog-model@1.1.6-next.0

## 0.7.7

### Patch Changes

- 27a5e90e97: Small updates to some paragraph components to ensure theme typography properties are inherited correctly.
- Updated dependencies
  - @backstage/catalog-model@1.1.5
  - @backstage/plugin-catalog-react@1.2.4
  - @backstage/core-components@0.12.3
  - @backstage/core-plugin-api@1.3.0
  - @backstage/config@1.0.6
  - @backstage/theme@0.2.16
  - @backstage/plugin-kubernetes-common@0.5.1

## 0.7.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.3.0-next.1
  - @backstage/plugin-catalog-react@1.2.4-next.2
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/core-components@0.12.3-next.2
  - @backstage/theme@0.2.16
  - @backstage/plugin-kubernetes-common@0.5.1-next.1

## 0.7.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-kubernetes-common@0.5.1-next.1

## 0.7.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/plugin-catalog-react@1.2.4-next.0
  - @backstage/core-components@0.12.3-next.0
  - @backstage/config@1.0.5
  - @backstage/core-plugin-api@1.2.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-kubernetes-common@0.5.1-next.0

## 0.7.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.2
  - @backstage/plugin-catalog-react@1.2.3

## 0.7.5

### Patch Changes

- 2db8acffe7: Kubernetes plugin now gracefully surfaces transport-level errors (like DNS or timeout, or other socket errors) occurring while fetching data. This will be merged into any data that is fetched successfully, fixing a bug where the whole page would be empty if any fetch operation encountered such an error.
- 365f887717: Removed rendering for ErrorEmptyState in ErrorReporting component, so nothing is rendered when there are no errors. Also removed Divider on Kubernetes page.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 9ce7866ecd: Updated dependency `@kubernetes/client-node` to `0.18.0`.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.5.0
  - @backstage/core-plugin-api@1.2.0
  - @backstage/core-components@0.12.1
  - @backstage/plugin-catalog-react@1.2.2
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5
  - @backstage/theme@0.2.16

## 0.7.5-next.4

### Patch Changes

- 365f887717: Removed rendering for ErrorEmptyState in ErrorReporting component, so nothing is rendered when there are no errors. Also removed Divider on Kubernetes page.
- Updated dependencies
  - @backstage/core-components@0.12.1-next.4
  - @backstage/plugin-catalog-react@1.2.2-next.4
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/theme@0.2.16
  - @backstage/plugin-kubernetes-common@0.4.5-next.1

## 0.7.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.1-next.3
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.2-next.3
  - @backstage/plugin-kubernetes-common@0.4.5-next.1

## 0.7.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/core-components@0.12.1-next.2
  - @backstage/plugin-catalog-react@1.2.2-next.2
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-kubernetes-common@0.4.5-next.1

## 0.7.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.1-next.1
  - @backstage/core-plugin-api@1.1.1-next.1
  - @backstage/plugin-catalog-react@1.2.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-kubernetes-common@0.4.5-next.1

## 0.7.5-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/core-components@0.12.1-next.0
  - @backstage/core-plugin-api@1.1.1-next.0
  - @backstage/plugin-catalog-react@1.2.2-next.0
  - @backstage/plugin-kubernetes-common@0.4.5-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/theme@0.2.16

## 0.7.4

### Patch Changes

- cfb30b700c: Pin `@kubernetes/client-node` version to `0.17.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.1
  - @backstage/core-components@0.12.0
  - @backstage/core-plugin-api@1.1.0
  - @backstage/catalog-model@1.1.3
  - @backstage/plugin-kubernetes-common@0.4.4
  - @backstage/config@1.0.4
  - @backstage/theme@0.2.16

## 0.7.4-next.1

### Patch Changes

- cfb30b700c: Pin `@kubernetes/client-node` version to `0.17.0`.
- Updated dependencies
  - @backstage/core-components@0.12.0-next.1
  - @backstage/plugin-kubernetes-common@0.4.4-next.1
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/core-plugin-api@1.1.0-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.1-next.1

## 0.7.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.1-next.0
  - @backstage/core-components@0.12.0-next.0
  - @backstage/core-plugin-api@1.1.0-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/plugin-kubernetes-common@0.4.4-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/theme@0.2.16

## 0.7.3

### Patch Changes

- 51af8361de: Add useCustomResources react hook for fetching Kubernetes Custom Resources
- 35a6cfe257: Fix infinite call bug in `useCustomResources` hook
- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/plugin-catalog-react@1.2.0
  - @backstage/core-components@0.11.2
  - @backstage/plugin-kubernetes-common@0.4.3
  - @backstage/core-plugin-api@1.0.7
  - @backstage/config@1.0.3
  - @backstage/theme@0.2.16

## 0.7.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.0-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/core-components@0.11.2-next.2
  - @backstage/core-plugin-api@1.0.7-next.2
  - @backstage/theme@0.2.16
  - @backstage/plugin-kubernetes-common@0.4.3-next.2

## 0.7.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.0-next.1
  - @backstage/core-components@0.11.2-next.1
  - @backstage/core-plugin-api@1.0.7-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-kubernetes-common@0.4.3-next.1

## 0.7.3-next.0

### Patch Changes

- 51af8361de: Add useCustomResources react hook for fetching Kubernetes Custom Resources
- 35a6cfe257: Fix infinite call bug in `useCustomResources` hook
- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/core-components@0.11.2-next.0
  - @backstage/plugin-catalog-react@1.1.5-next.0
  - @backstage/plugin-kubernetes-common@0.4.3-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/core-plugin-api@1.0.7-next.0
  - @backstage/theme@0.2.16

## 0.7.2

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- 7d47def9c4: Removed dependency on `@types/jest`.
- 0768d6dece: add new kubernetes backend endpoints to kubernetes backend client
- 19a27929fb: Reset error state on success
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- ef9ab322de: Minor API signatures cleanup
- Updated dependencies
  - @backstage/core-components@0.11.1
  - @backstage/core-plugin-api@1.0.6
  - @backstage/plugin-catalog-react@1.1.4
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/plugin-kubernetes-common@0.4.2

## 0.7.2-next.3

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- 19a27929fb: Reset error state on success
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.4-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/core-components@0.11.1-next.3
  - @backstage/core-plugin-api@1.0.6-next.3
  - @backstage/plugin-kubernetes-common@0.4.2-next.1

## 0.7.2-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/core-components@0.11.1-next.2
  - @backstage/core-plugin-api@1.0.6-next.2

## 0.7.2-next.1

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- Updated dependencies
  - @backstage/core-components@0.11.1-next.1
  - @backstage/core-plugin-api@1.0.6-next.1
  - @backstage/plugin-catalog-react@1.1.4-next.1
  - @backstage/plugin-kubernetes-common@0.4.2-next.0

## 0.7.2-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- ef9ab322de: Minor API signatures cleanup
- Updated dependencies
  - @backstage/core-plugin-api@1.0.6-next.0
  - @backstage/core-components@0.11.1-next.0
  - @backstage/plugin-catalog-react@1.1.4-next.0

## 0.7.1

### Patch Changes

- 860ed68343: Fixed bug in CronJobsAccordions component that causes an error when cronjobs use a kubernetes alias, such as `@hourly` or `@daily` instead of standard cron syntax.
- f563b86a5b: Adds namespace column to Kubernetes error reporting table
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.4.1
  - @backstage/core-components@0.11.0
  - @backstage/core-plugin-api@1.0.5
  - @backstage/plugin-catalog-react@1.1.3

## 0.7.1-next.2

### Patch Changes

- f563b86a5b: Adds namespace column to Kubernetes error reporting table
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.3-next.2
  - @backstage/core-components@0.11.0-next.2

## 0.7.1-next.1

### Patch Changes

- 860ed68343: Fixed bug in CronJobsAccordions component that causes an error when cronjobs use a kubernetes alias, such as `@hourly` or `@daily` instead of standard cron syntax.
- Updated dependencies
  - @backstage/core-components@0.10.1-next.1
  - @backstage/plugin-catalog-react@1.1.3-next.1

## 0.7.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.5-next.0
  - @backstage/plugin-catalog-react@1.1.3-next.0
  - @backstage/core-components@0.10.1-next.0

## 0.7.0

### Minor Changes

- f5c9730639: Add `localKubectlProxy` cluster locator method to make local development simpler to setup.

  Consolidated no-op server side auth decorators.
  The following Kubernetes auth decorators are now one class (`ServerSideKubernetesAuthProvider`):

  - `AwsKubernetesAuthProvider`
  - `AzureKubernetesAuthProvider`
  - `ServiceAccountKubernetesAuthProvider`

### Patch Changes

- 3ec294a186: expose detectErrors function publicly
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- eadb3a8d2e: Updated dependency `@kubernetes/client-node` to `^0.17.0`.
- Updated dependencies
  - @backstage/core-components@0.10.0
  - @backstage/catalog-model@1.1.0
  - @backstage/plugin-kubernetes-common@0.4.0
  - @backstage/core-plugin-api@1.0.4
  - @backstage/plugin-catalog-react@1.1.2
  - @backstage/theme@0.2.16

## 0.7.0-next.3

### Minor Changes

- f5c9730639: Add `localKubectlProxy` cluster locator method to make local development simpler to setup.

  Consolidated no-op server side auth decorators.
  The following Kubernetes auth decorators are now one class (`ServerSideKubernetesAuthProvider`):

  - `AwsKubernetesAuthProvider`
  - `AzureKubernetesAuthProvider`
  - `ServiceAccountKubernetesAuthProvider`

### Patch Changes

- 3ec294a186: expose detectErrors function publicly
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- eadb3a8d2e: Updated dependency `@kubernetes/client-node` to `^0.17.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.4-next.0
  - @backstage/core-components@0.10.0-next.3
  - @backstage/catalog-model@1.1.0-next.3
  - @backstage/plugin-catalog-react@1.1.2-next.3
  - @backstage/plugin-kubernetes-common@0.4.0-next.2

## 0.6.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/plugin-kubernetes-common@0.4.0-next.1
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## 0.6.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.6-next.1
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/theme@0.2.16-next.0
  - @backstage/plugin-catalog-react@1.1.2-next.1

## 0.6.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/core-components@0.9.6-next.0
  - @backstage/plugin-kubernetes-common@0.4.0-next.0
  - @backstage/plugin-catalog-react@1.1.2-next.0

## 0.6.6

### Patch Changes

- 4328737af6: Add support to fetch data for Stateful Sets and display an accordion in the same way as with Deployments
- b9b8bbc7d9: show request/limit CPU and Memory on the UI
- 5553f09e80: ability to configure refresh interval on Kubernetes tab
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- 81304e3e91: Fix for HPA matching when deploying same HPA in multiple namespaces
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1
  - @backstage/core-components@0.9.5
  - @backstage/plugin-kubernetes-common@0.3.0
  - @backstage/core-plugin-api@1.0.3
  - @backstage/catalog-model@1.0.3

## 0.6.6-next.2

### Patch Changes

- 5553f09e80: ability to configure refresh interval on Kubernetes tab
- Updated dependencies
  - @backstage/core-components@0.9.5-next.2

## 0.6.6-next.1

### Patch Changes

- b9b8bbc7d9: show request/limit CPU and Memory on the UI
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-catalog-react@1.1.1-next.1
  - @backstage/plugin-kubernetes-common@0.3.0-next.1

## 0.6.6-next.0

### Patch Changes

- 4328737af6: Add support to fetch data for Stateful Sets and display an accordion in the same way as with Deployments
- 81304e3e91: Fix for HPA matching when deploying same HPA in multiple namespaces
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1-next.0
  - @backstage/core-components@0.9.5-next.0
  - @backstage/plugin-kubernetes-common@0.3.0-next.0

## 0.6.5

### Patch Changes

- 1ef98cfe48: add Azure Identity auth provider and AKS dashboard formatter
- 447e060872: Add support for 'oidc' as authProvider for kubernetes authentication
  and adds optional 'oidcTokenProvider' config value. This will allow
  users to authenticate to kubernetes cluster using id tokens obtained
  from the configured auth provider in their backstage instance.
- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/plugin-kubernetes-common@0.2.10
  - @backstage/core-plugin-api@1.0.2
  - @backstage/plugin-catalog-react@1.1.0
  - @backstage/config@1.0.1
  - @backstage/catalog-model@1.0.2

## 0.6.5-next.3

### Patch Changes

- 447e060872: Add support for 'oidc' as authProvider for kubernetes authentication
  and adds optional 'oidcTokenProvider' config value. This will allow
  users to authenticate to kubernetes cluster using id tokens obtained
  from the configured auth provider in their backstage instance.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.2.10-next.1
  - @backstage/core-components@0.9.4-next.2

## 0.6.5-next.2

### Patch Changes

- 1ef98cfe48: add Azure Identity auth provider and AKS dashboard formatter
- Updated dependencies
  - @backstage/core-components@0.9.4-next.1
  - @backstage/plugin-kubernetes-common@0.2.10-next.0
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.2
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/core-plugin-api@1.0.2-next.1

## 0.6.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.1

## 0.6.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.0-next.0

## 0.6.4

### Patch Changes

- 82e2ae6ff6: build(deps): bump `cronstrue` from 1.125.0 to 2.2.0
- 7c7919777e: build(deps-dev): bump `@testing-library/react-hooks` from 7.0.2 to 8.0.0
- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 1023ee6353: export kubernetes components
- 230ad0826f: Bump to using `@types/node` v16
- f616d99f6f: Fix division by zero in currentToDeclaredResourceToPerc when pod resources weren't set
- Updated dependencies
  - @backstage/plugin-catalog-react@1.0.1
  - @backstage/catalog-model@1.0.1
  - @backstage/core-components@0.9.3
  - @backstage/core-plugin-api@1.0.1
  - @backstage/plugin-kubernetes-common@0.2.9

## 0.6.4-next.2

### Patch Changes

- 82e2ae6ff6: build(deps): bump `cronstrue` from 1.125.0 to 2.2.0
- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/core-components@0.9.3-next.2
  - @backstage/core-plugin-api@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.3

## 0.6.4-next.1

### Patch Changes

- 1023ee6353: export kubernetes components
- Updated dependencies
  - @backstage/plugin-catalog-react@1.0.1-next.1

## 0.6.4-next.0

### Patch Changes

- f616d99f6f: Fix division by zero in currentToDeclaredResourceToPerc when pod resources weren't set
- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.0
  - @backstage/core-components@0.9.3-next.0
  - @backstage/plugin-kubernetes-common@0.2.9-next.0

## 0.6.3

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/core-components@0.9.2
  - @backstage/core-plugin-api@1.0.0
  - @backstage/plugin-catalog-react@1.0.0
  - @backstage/catalog-model@1.0.0
  - @backstage/config@1.0.0
  - @backstage/plugin-kubernetes-common@0.2.8

## 0.6.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0
  - @backstage/core-components@0.9.1
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-kubernetes-common@0.2.7

## 0.6.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0-next.0
  - @backstage/core-components@0.9.1-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-kubernetes-common@0.2.7-next.0

## 0.6.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/core-components@0.9.0
  - @backstage/plugin-catalog-react@0.8.0
  - @backstage/core-plugin-api@0.8.0
  - @backstage/plugin-kubernetes-common@0.2.6

## 0.6.0

### Minor Changes

- 2262fe19c9: **BREAKING**: Removed support for passing in an explicit `entity` prop to entity page extensions, which has been deprecated for a long time. This is only a breaking change at the TypeScript level, as this property was already ignored.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.10
  - @backstage/plugin-catalog-react@0.7.0
  - @backstage/catalog-model@0.11.0
  - @backstage/core-plugin-api@0.7.0
  - @backstage/plugin-kubernetes-common@0.2.5

## 0.5.8

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/plugin-catalog-react@0.6.15
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/theme@0.2.15
  - @backstage/plugin-kubernetes-common@0.2.3

## 0.5.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8
  - @backstage/plugin-catalog-react@0.6.14

## 0.5.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8-next.0
  - @backstage/plugin-catalog-react@0.6.14-next.0

## 0.5.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7
  - @backstage/plugin-catalog-react@0.6.13

## 0.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.0
  - @backstage/plugin-catalog-react@0.6.13-next.0

## 0.5.5

### Patch Changes

- edbd626d0a: add a new auth provider to support use GOOGLE_APPLICATION_CREDENTIALS
- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- Updated dependencies
  - @backstage/core-components@0.8.5
  - @backstage/core-plugin-api@0.6.0
  - @backstage/plugin-catalog-react@0.6.12
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10
  - @backstage/plugin-kubernetes-common@0.2.2

## 0.5.5-next.0

### Patch Changes

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-catalog-react@0.6.12-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/plugin-kubernetes-common@0.2.2-next.0

## 0.5.4

### Patch Changes

- 7612e2856b: Clean up emptystate.svg image, removing wrong white artifact from the background
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/plugin-catalog-react@0.6.11
  - @backstage/catalog-model@0.9.9

## 0.5.3

### Patch Changes

- 7ac0bd2c66: implement dashboard link formatter for GKE
- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/plugin-catalog-react@0.6.10
  - @backstage/plugin-kubernetes-common@0.2.1
  - @backstage/core-components@0.8.3

## 0.5.2

### Patch Changes

- 610614a06d: Includes `KubernetesBackendClient` in the export to allow developers to use it externally.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-catalog-react@0.6.8
  - @backstage/core-components@0.8.2

## 0.5.1

### Patch Changes

- 6f0c850a86: Fixed styling bug for the CronJobsAccordions and updated Completed pods to display a green dot.
- Updated dependencies
  - @backstage/core-plugin-api@0.3.1
  - @backstage/core-components@0.8.1
  - @backstage/catalog-model@0.9.8
  - @backstage/plugin-catalog-react@0.6.7

## 0.5.0

### Minor Changes

- c010632f88: Add pod metrics lookup and display in pod table.

  ## Backwards incompatible changes

  If your Kubernetes distribution does not have the [metrics server](https://github.com/kubernetes-sigs/metrics-server) installed,
  you will need to set the `skipMetricsLookup` config flag to `true`.

  See the [configuration docs](https://backstage.io/docs/features/kubernetes/configuration) for more details.

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/plugin-kubernetes-common@0.2.0
  - @backstage/plugin-catalog-react@0.6.5

## 0.4.22

### Patch Changes

- 86ed770308: Added accordions to display information on Jobs and CronJobs in the kubernetes plugin. Updated the PodsTable with fewer default columns and the ability to pass in additional ones depending on the use case.
- Updated dependencies
  - @backstage/core-components@0.7.6
  - @backstage/theme@0.2.14
  - @backstage/core-plugin-api@0.2.2
  - @backstage/plugin-kubernetes-common@0.1.7

## 0.4.21

### Patch Changes

- 3739d3f773: Implement support for formatting OpenShift dashboard url links
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.1.6
  - @backstage/core-plugin-api@0.2.1
  - @backstage/core-components@0.7.5

## 0.4.20

### Patch Changes

- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- Updated dependencies
  - @backstage/catalog-model@0.9.7
  - @backstage/plugin-catalog-react@0.6.4
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0

## 0.4.19

### Patch Changes

- 9f3dd76bc7: fix: kubernetes plugin shall pass id token on get clusters request if possible
- Updated dependencies
  - @backstage/core-components@0.7.3
  - @backstage/theme@0.2.13
  - @backstage/core-plugin-api@0.1.13
  - @backstage/plugin-catalog-react@0.6.3

## 0.4.18

### Patch Changes

- 14df942bae: The Kubernetes plugin will now re-fetch the kubernetes objects every ten seconds (not current configurable), this allows users to track the progress of deployments without refreshing the browser.
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/theme@0.2.12
  - @backstage/core-components@0.7.2
  - @backstage/plugin-catalog-react@0.6.2
  - @backstage/catalog-model@0.9.6
  - @backstage/core-plugin-api@0.1.12

## 0.4.17

### Patch Changes

- 89bcf90b66: Refactor kubernetes fetcher to reduce boilerplate code
- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.0
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.4.16

### Patch Changes

- c148c8854b: Support Rancher URL's with an existing path component
- ca0559444c: Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.
- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/plugin-catalog-react@0.5.2
  - @backstage/catalog-model@0.9.4
  - @backstage/plugin-kubernetes-common@0.1.5

## 0.4.15

### Patch Changes

- e6aaf246c2: Enhanced deployment accordion to display the namespace of the deployment.
- 6ba06efe08: Exported `KubernetesApi`, `kubernetesApiRef`, and `KubernetesAuthProvidersApi`.
- 8d397ef27a: Added a check for the Kubernetes annotation on the entity
- 6c0bd7fb75: Add dashboard support for Rancher
- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0
  - @backstage/plugin-catalog-react@0.5.1

## 0.4.14

### Patch Changes

- 7a0c334707: Provide access to the Kubernetes dashboard when viewing a specific resource
- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/plugin-catalog-react@0.5.0
  - @backstage/catalog-model@0.9.3
  - @backstage/config@0.1.10
  - @backstage/plugin-kubernetes-common@0.1.4

## 0.4.13

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/plugin-catalog-react@0.4.6
  - @backstage/core-plugin-api@0.1.8

## 0.4.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.5
  - @backstage/core-components@0.4.0
  - @backstage/catalog-model@0.9.1

## 0.4.11

### Patch Changes

- 8bedb75ae: Update Luxon dependency to 2.x
- Updated dependencies
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6
  - @backstage/plugin-catalog-react@0.4.2

## 0.4.10

### Patch Changes

- 260c053b9: Fix All Material UI Warnings
- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/config@0.1.6
  - @backstage/core-plugin-api@0.1.5
  - @backstage/plugin-catalog-react@0.4.1

## 0.4.9

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- 7f24f4088: chore(deps): bump `@kubernetes/client-node` from 0.14.3 to 0.15.0
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/plugin-catalog-react@0.4.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/theme@0.2.9
  - @backstage/plugin-kubernetes-common@0.1.3

## 0.4.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.3.0

## 0.4.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.1.5
  - @backstage/catalog-model@0.9.0
  - @backstage/plugin-catalog-react@0.2.6
  - @backstage/plugin-kubernetes-common@0.1.2

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
