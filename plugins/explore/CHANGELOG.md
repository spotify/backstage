# @backstage/plugin-explore

## 0.3.6

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0

## 0.3.5

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 0b033d07b: Add "Organization" tab with a diagram
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/plugin-explore-react@0.0.5
  - @backstage/catalog-model@0.7.9

## 0.3.4

### Patch Changes

- c614ede9a: Updated README to have up-to-date install instructions.
- Updated dependencies [9afcac5af]
- Updated dependencies [e0c9ed759]
- Updated dependencies [6eaecbd81]
  - @backstage/core@0.7.7

## 0.3.3

### Patch Changes

- 676ede643: Added the `getOriginLocationByEntity` and `removeLocationById` methods to the catalog client
- Updated dependencies [9f48b548c]
- Updated dependencies [8488a1a96]
  - @backstage/plugin-catalog-react@0.1.4
  - @backstage/catalog-model@0.7.5

## 0.3.2

### Patch Changes

- 9ca0e4009: use local version of lowerCase and upperCase methods
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
  - @backstage/core@0.7.2
  - @backstage/plugin-catalog-react@0.1.2

## 0.3.1

### Patch Changes

- c9b5c1eca: Standardize the tool cards in explore some more
- 2089de76b: Make use of the new core `ItemCardGrid` and `ItemCardHeader` instead of the deprecated `ItemCard`.
- Updated dependencies [0b42fff22]
- Updated dependencies [ff4d666ab]
- Updated dependencies [2089de76b]
- Updated dependencies [c9b5c1eca]
- Updated dependencies [dc1fc92c8]
  - @backstage/catalog-model@0.7.4
  - @backstage/core@0.7.1
  - @backstage/theme@0.2.4
  - @backstage/plugin-explore-react@0.0.4

## 0.3.0

### Minor Changes

- cfc83cac1: Introduce external route for linking to the entity page from the explore plugin.

  To use the explore plugin you have to bind the external route in your app:

  ```typescript
  const app = createApp({
    ...
    bindRoutes({ bind }) {
      ...
      bind(explorePlugin.externalRoutes, {
        catalogEntity: catalogPlugin.routes.catalogEntity,
      });
    },
  });
  ```

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
  - @backstage/plugin-explore-react@0.0.3

## 0.2.7

### Patch Changes

- 347137ccf: Display the owner of a domain on the domain card.
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
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2

## 0.2.6

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

## 0.2.5

### Patch Changes

- 0fe8ff5be: Catch catalog errors and display to user
- Updated dependencies [19d354c78]
- Updated dependencies [b51ee6ece]
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.2.4

### Patch Changes

- 54c7d02f7: Introduce `TabbedLayout` for creating tabs that are routed.

  ```typescript
  <TabbedLayout>
    <TabbedLayout.Route path="/example" title="Example tab">
      <div>This is rendered under /example/anything-here route</div>
    </TabbedLayout.Route>
  </TabbedLayout>
  ```

- 806929fe2: Rework the explore plugin to allow the user to explore things in the ecosystem,
  including tools and domains.
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
  - @backstage/plugin-explore-react@0.0.2

## 0.2.3

### Patch Changes

- Updated dependencies [efd6ef753]
- Updated dependencies [a187b8ad0]
  - @backstage/core@0.5.0

## 0.2.2

### Patch Changes

- Updated dependencies [2527628e1]
- Updated dependencies [1c69d4716]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/theme@0.2.2

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
- cab473771: This PR adds Spotify's Cost Insights Tool. Cost Insights explains costs from cloud services in an understandable way, using software terms familiar to your engineers. This tool helps you and your team make trade-offs between cost optimization efforts and your other priorities.

  Cost Insights features:

  Daily cost graph by team or billing account
  Cost comparison against configurable business metrics
  Insights panels for configurable cloud products your company uses
  Cost alerts and recommendations
  Selectable time periods for month over month, or quarter over quarter cost comparison
  Conversion of cost growth into average engineer cost (configurable) to help optimization trade-off decisions

  ![plugin-cost-insights](https://user-images.githubusercontent.com/3030003/94430416-e166d380-0161-11eb-891c-9ce10187683e.gif)

  This PR adds the Cost Insights frontend React plugin with a defined CostInsightsApi. We include an example client with static data in the expected format. This API should talk with a cloud billing backend that aggregates billing data from your cloud provider.

  Fixes #688 💵

### Patch Changes

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
