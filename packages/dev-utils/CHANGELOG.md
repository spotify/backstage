# @backstage/dev-utils

## 0.2.0

### Minor Changes

- 76db86c45: Removed support for deprecated registered plugin routes. All routes now need to be added using `addPage` instead.

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-app-api@0.1.3
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-model@0.8.4
  - @backstage/integration-react@0.1.4
  - @backstage/test-utils@0.1.14
  - @backstage/plugin-catalog-react@0.2.4

## 0.1.17

### Patch Changes

- e7c5e4b30: Update installation instructions in README.
- Updated dependencies [7af9cef07]
- Updated dependencies [e7c5e4b30]
- Updated dependencies [ebe802bc4]
- Updated dependencies [1cf1d351f]
- Updated dependencies [deaba2e13]
- Updated dependencies [8e919a6f8]
  - @backstage/test-utils@0.1.13
  - @backstage/theme@0.2.8
  - @backstage/catalog-model@0.8.1
  - @backstage/core@0.7.12
  - @backstage/plugin-catalog-react@0.2.1

## 0.1.16

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0

## 0.1.15

### Patch Changes

- 5e7b36e74: Fix a bug where an instance of the SCM integrations API wasn't being provided properly to the dev app.
- Updated dependencies [f7f7783a3]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5da6a561d]
- Updated dependencies [61c3f927c]
  - @backstage/catalog-model@0.7.10
  - @backstage/core@0.7.10
  - @backstage/test-utils@0.1.12

## 0.1.14

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/integration-react@0.1.2
  - @backstage/test-utils@0.1.11
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.1.13

### Patch Changes

- Updated dependencies [12d8f27a6]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [9d455f69a]
- Updated dependencies [4c049a1a1]
- Updated dependencies [02816ecd7]
  - @backstage/catalog-model@0.7.3
  - @backstage/core@0.7.0
  - @backstage/plugin-catalog-react@0.1.1

## 0.1.12

### Patch Changes

- 5aa4ceea6: Make sure to provide dummy routes for all external routes of plugins given to DevApp
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [dc12852c9]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [88f1f1b60]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [5c2e2863f]
- Updated dependencies [3a58084b6]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3
  - @backstage/test-utils@0.1.8
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2

## 0.1.11

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

## 0.1.10

### Patch Changes

- Updated dependencies [b51ee6ece]
- Updated dependencies [19d354c78]
- Updated dependencies [b51ee6ece]
  - @backstage/test-utils@0.1.7
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.1.9

### Patch Changes

- 720149854: Added `path` option to `addPage` that can be used to set a specific path for the page rather than a generated one. Also omit sidebar item altogether if `title` option is not set.
- 019fe39a0: Switch dependency from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
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
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.1.8

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [593632f07]
- Updated dependencies [33846acfc]
- Updated dependencies [a187b8ad0]
- Updated dependencies [f04db53d7]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/plugin-catalog@0.2.12

## 0.1.7

### Patch Changes

- 696b8ce74: Add new `addPage` method for use with extensions, as well as an `EntityGridItem` to easily create different test cases for entity overview cards.
- Updated dependencies [a08c32ced]
- Updated dependencies [7e0b8cac5]
- Updated dependencies [87c0c53c2]
  - @backstage/core@0.4.3
  - @backstage/plugin-catalog@0.2.9

## 0.1.6

### Patch Changes

- b6557c098: Update ApiFactory type to correctly infer API type and disallow mismatched implementations.

  This fixes for example the following code:

  ```ts
  interface MyApi {
    myMethod(): void
  }

  const myApiRef = createApiRef<MyApi>({...});

  createApiFactory({
    api: myApiRef,
    deps: {},
    // This should've caused an error, since the empty object does not fully implement MyApi
    factory: () => ({}),
  })
  ```

- e1f4e24ef: Fix @backstage/cli not being a devDependency
- Updated dependencies [2527628e1]
- Updated dependencies [e1f4e24ef]
- Updated dependencies [1c69d4716]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/test-utils@0.1.5
  - @backstage/theme@0.2.2

## 0.1.5

### Patch Changes

- Updated dependencies [b4488ddb0]
- Updated dependencies [4a655c89d]
- Updated dependencies [8a16e8af8]
- Updated dependencies [00670a96e]
  - @backstage/cli@0.4.0
  - @backstage/test-utils@0.1.4

## 0.1.4

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [902340451]
  - @backstage/cli@0.3.0
  - @backstage/core@0.3.1
  - @backstage/test-utils@0.1.3

## 0.1.3

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

## 0.1.2

### Patch Changes

- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [3472c8be7]
- Updated dependencies [1d0aec70f]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a3840bed2]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [72f6cda35]
- Updated dependencies [8c2b76e45]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [cba4e4d97]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [8afce088a]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [9a3b3dbf1]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
- Updated dependencies [7bbeb049f]
  - @backstage/cli@0.2.0
  - @backstage/core@0.2.0
  - @backstage/theme@0.2.0
  - @backstage/test-utils@0.1.2
