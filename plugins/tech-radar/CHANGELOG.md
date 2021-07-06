# @backstage/plugin-tech-radar

## 0.4.2

### Patch Changes

- 846168da2: Add optional id prop passing it to the load API
- Updated dependencies
  - @backstage/core-components@0.1.4

## 0.4.1

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3

## 0.4.0

### Minor Changes

- 90a505a77: Migrating the Tech Radar to support using `ApiRefs` to load custom data.

  If you had a `getData` function, you'll now need to encapsulate that logic in a class that can override the `techRadarApiRef`.

  ```ts
  // app/src/lib/MyClient.ts
  import {
    TechRadarApi,
    TechRadarLoaderResponse,
  } from '@backstage/plugin-tech-radar';

  class MyOwnClient implements TechRadarApi {
    async load(): Promise<TechRadarLoaderResponse> {
      // here's where you would put you logic to load the response that was previously passed into getData
    }
  }

  // app/src/apis.ts
  import { MyOwnClient } from './lib/MyClient';
  import { techRadarApiRef } from '@backstage/plugin-tech-radar';

  export const apis: AnyApiFactory[] = [
    /*
    ...
    */
    createApiFactory(techRadarApiRef, new MyOwnClient()),
  ];
  ```

### Patch Changes

- Updated dependencies [e7c5e4b30]
- Updated dependencies [1cf1d351f]
  - @backstage/theme@0.2.8
  - @backstage/core@0.7.12

## 0.3.11

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [889d89b6e]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9

## 0.3.10

### Patch Changes

- b2e2ec753: Update README for composability
- Updated dependencies [f65adcde7]
- Updated dependencies [80888659b]
- Updated dependencies [7b8272fb7]
  - @backstage/core@0.7.8
  - @backstage/theme@0.2.7

## 0.3.9

### Patch Changes

- 184b02bef: Add markdown support for tech radar entry description
- Updated dependencies [d0d1c2f7b]
- Updated dependencies [5cafcf452]
- Updated dependencies [86a95ba67]
- Updated dependencies [e27cb6c45]
  - @backstage/core@0.7.5

## 0.3.8

### Patch Changes

- 34e6bb409: Map description in API RadarEntry to Entry

  The description in the Entry was mapped to the latest timeline entry, which is a changelog. This
  change maps the description in the API to the entry. To maintain backwards compatibility it
  will set the description to the last timeline entry if no description exists at the entry level.

- b56815b40: Fixes issue where radar description dialog is not shown when the entry has an url external to the radar page
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
  - @backstage/core@0.7.2

## 0.3.7

### Patch Changes

- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [4c049a1a1]
  - @backstage/core@0.7.0

## 0.3.6

### Patch Changes

- 9f2b3a26e: Added a dialog box that will show up when a you click on link on the radar and display the description if provided.
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [1407b34c6]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [3a58084b6]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3

## 0.3.5

### Patch Changes

- 804502a5c: Migrated to new composability API, exporting the plugin instance as `techRadarPlugin` and the page as `TechRadarPage`.
- Updated dependencies [b51ee6ece]
  - @backstage/core@0.6.1

## 0.3.4

### Patch Changes

- 90c8f20b9: Fix mapping RadarEntry and Entry for moved and url attributes
  Fix clicking of links in the radar legend
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [54c7d02f7]
  - @backstage/core@0.6.0
  - @backstage/theme@0.2.3

## 0.3.3

### Patch Changes

- Updated dependencies [efd6ef753]
- Updated dependencies [a187b8ad0]
  - @backstage/core@0.5.0

## 0.3.2

### Patch Changes

- ab0892358: Remove test dependencies from production package list
- bc909178d: Updated example data in `README`.

## 0.3.1

### Patch Changes

- Updated dependencies [2527628e1]
- Updated dependencies [e1f4e24ef]
- Updated dependencies [1c69d4716]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/test-utils@0.1.5
  - @backstage/theme@0.2.2

## 0.3.0

### Minor Changes

- a906f20e7: Added tech radar blip history backend support and normalized the data structure

### Patch Changes

- 3f05616bf: Make the footer color of the tech-radar work in both light and dark theme.
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

- 782f3b354: add test case for Progress component
- 02c60b5f8: fix the horizontal scrolling issue in the RadarPage component
- Updated dependencies [819a70229]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/core@0.2.0
  - @backstage/theme@0.2.0
  - @backstage/test-utils@0.1.2
