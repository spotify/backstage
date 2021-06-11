# @backstage/catalog-client

## 0.3.12

### Patch Changes

- add62a455: Foundation for standard entity status values
- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0

## 0.3.11

### Patch Changes

- d1b1306d9: Allow `filter` parameter to be specified multiple times
- Updated dependencies [d8b81fd28]
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.3.10

### Patch Changes

- 442f34b87: Make sure the `CatalogClient` escapes URL parameters correctly.
- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
  - @backstage/catalog-model@0.7.7

## 0.3.9

### Patch Changes

- 676ede643: Added the `getOriginLocationByEntity` and `removeLocationById` methods to the catalog client
- b196a4569: Avoid using Headers as it is not supported in the backend
- Updated dependencies [8488a1a96]
  - @backstage/catalog-model@0.7.5

## 0.3.8

### Patch Changes

- 8686eb38c: Throw the new `ResponseError` from `@backstage/errors`
- Updated dependencies [0434853a5]
  - @backstage/config@0.1.4

## 0.3.7

### Patch Changes

- 0b42fff22: Make use of parseLocationReference/stringifyLocationReference
- Updated dependencies [0b42fff22]
  - @backstage/catalog-model@0.7.4

## 0.3.6

### Patch Changes

- 6ed2b47d6: Include Backstage identity token in requests to backend plugins.
- 72b96e880: Add the `presence` argument to the `CatalogApi` to be able to register optional locations.

## 0.3.5

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0

## 0.3.4

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0

## 0.3.3

### Patch Changes

- Updated dependencies [e3bd9fc2f]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0

## 0.3.2

### Patch Changes

- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/catalog-model@0.4.0

## 0.3.1

### Patch Changes

- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/catalog-model@0.3.0

## 0.3.0

### Minor Changes

- 717e43de1: Changed the getEntities interface to (1) nest parameters in an object, (2) support field selection, and (3) return an object with an items field for future extension
