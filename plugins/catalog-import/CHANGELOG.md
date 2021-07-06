# @backstage/plugin-catalog-import

## 0.5.11

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-client@0.3.14
  - @backstage/catalog-model@0.8.4
  - @backstage/integration-react@0.1.4
  - @backstage/plugin-catalog-react@0.2.4

## 0.5.10

### Patch Changes

- 873116e5d: Fix a react warning in `<EntityListComponent>`.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.2.3
  - @backstage/catalog-model@0.8.3
  - @backstage/core@0.7.13

## 0.5.9

### Patch Changes

- 70bc30c5b: Display preview result final step.
- Updated dependencies [27a9b503a]
- Updated dependencies [f4e3ac5ce]
- Updated dependencies [7028ee1ca]
- Updated dependencies [70bc30c5b]
- Updated dependencies [eda9dbd5f]
  - @backstage/catalog-model@0.8.2
  - @backstage/integration-react@0.1.3
  - @backstage/plugin-catalog-react@0.2.2
  - @backstage/catalog-client@0.3.13
  - @backstage/integration@0.5.6

## 0.5.8

### Patch Changes

- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/integration@0.5.4
  - @backstage/catalog-client@0.3.12
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0

## 0.5.7

### Patch Changes

- ca6e0ab69: Make UI errors friendlier when importing existing components
- Updated dependencies [f7f7783a3]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5da6a561d]
  - @backstage/catalog-model@0.7.10
  - @backstage/core@0.7.10
  - @backstage/integration@0.5.3

## 0.5.6

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/integration-react@0.1.2
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.5.5

### Patch Changes

- 38ca05168: The default `@octokit/rest` dependency was bumped to `"^18.5.3"`.
- 80888659b: Bump react-hook-form version to be the same for the entire project.
- 8aedbb4af: Fixes a typo and minor wording changes to the catalog import UI
- Updated dependencies [38ca05168]
- Updated dependencies [f65adcde7]
- Updated dependencies [81c54d1f2]
- Updated dependencies [80888659b]
- Updated dependencies [7b8272fb7]
- Updated dependencies [d8b81fd28]
- Updated dependencies [d1b1306d9]
  - @backstage/integration@0.5.2
  - @backstage/core@0.7.8
  - @backstage/plugin-catalog-react@0.1.5
  - @backstage/theme@0.2.7
  - @backstage/catalog-model@0.7.8
  - @backstage/catalog-client@0.3.11

## 0.5.4

### Patch Changes

- c614ede9a: Updated README to have up-to-date install instructions.
- Updated dependencies [9afcac5af]
- Updated dependencies [e0c9ed759]
- Updated dependencies [6eaecbd81]
  - @backstage/core@0.7.7

## 0.5.3

### Patch Changes

- 29a7e4be8: allow import from HTTP repositories
- Updated dependencies [94da20976]
- Updated dependencies [d8cc7e67a]
- Updated dependencies [99fbef232]
- Updated dependencies [ab07d77f6]
- Updated dependencies [931b21a12]
- Updated dependencies [937ed39ce]
- Updated dependencies [9a9e7a42f]
- Updated dependencies [50ce875a0]
  - @backstage/core@0.7.6
  - @backstage/theme@0.2.6

## 0.5.2

### Patch Changes

- f9c75f7a9: When importing components you will now have the ability to use non Unicode characters in the entity owner field
- Updated dependencies [1279a3325]
- Updated dependencies [4a4681b1b]
- Updated dependencies [97b60de98]
- Updated dependencies [b051e770c]
- Updated dependencies [98dd5da71]
  - @backstage/core@0.7.4
  - @backstage/catalog-model@0.7.6

## 0.5.1

### Patch Changes

- 676ede643: Added the `getOriginLocationByEntity` and `removeLocationById` methods to the catalog client
- Updated dependencies [676ede643]
- Updated dependencies [9f48b548c]
- Updated dependencies [b196a4569]
- Updated dependencies [8488a1a96]
  - @backstage/catalog-client@0.3.9
  - @backstage/plugin-catalog-react@0.1.4
  - @backstage/catalog-model@0.7.5

## 0.5.0

### Minor Changes

- 3385b374b: Use `scmIntegrationsApiRef` from the new `@backstage/integration-react`.

### Patch Changes

- 7d8c4c97c: Update the wording for unknown URLs in the import flow
- a0dacc184: Use title form field value for the commit message on catalog import PRs. Also allow customization of the pull requests title or body only. For example:

  ```tsx
  <Route
    path="/catalog-import"
    element={
      <CatalogImportPage
        pullRequest={{
          preparePullRequest: () => ({
            title: 'chore: add backstage catalog file [skip ci]',
          }),
        }}
      />
    }
  />
  ```

- 9ca0e4009: use local version of lowerCase and upperCase methods
- Updated dependencies [8686eb38c]
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
  - @backstage/catalog-client@0.3.8
  - @backstage/core@0.7.2
  - @backstage/plugin-catalog-react@0.1.2

## 0.4.3

### Patch Changes

- 05183f202: Bump react-hook-form version constraint to "^6.15.4"
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

## 0.4.2

### Patch Changes

- a8953a9c9: This updates the `catalog-import` plugin to omit the default metadata namespace
  field and also use the short form entity reference format for selected group owners.
- 968b588f7: Allows the CodeOwnersProcessor to set the owner automatically within the catalog-import plugin. This adds an additional checkbox that overrides the group selector and will omit the owner option in the generated catalog file yaml.
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

## 0.4.1

### Patch Changes

- f4c2bcf54: Use a more strict type for `variant` of cards.
- Updated dependencies [491f3a0ec]
- Updated dependencies [fd3f2a8c0]
- Updated dependencies [d34d26125]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [10a0124e0]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/integration@0.5.0
  - @backstage/core@0.6.2
  - @backstage/plugin-catalog-react@0.0.4

## 0.4.0

### Minor Changes

- 6ed2b47d6: Include Backstage identity token in requests to backend plugins.
- 68dd79d83: The plugin has been refactored and is now based on a configurable state machine of 'analyze', 'prepare', 'review' & 'finish'.
  Depending on the outcome of the 'analyze' stage, different flows are selected ('single-location', 'multiple-locations', 'no-location').
  Each flow can define it's own components that guide the user.

  During the refactoring, the `catalogRouteRef` property of the `CatalogImportPage` has been removed, so the `App.tsx` of the backstage apps need to be updated:

  ```diff
  // packages/app/src/App.tsx

       <Route
         path="/catalog-import"
  -      element={<CatalogImportPage catalogRouteRef={catalogRouteRef} />}
  +      element={<CatalogImportPage />}
       />
  ```

### Patch Changes

- 753bb4c40: Flatten the options of the `CatalogImportPage` from the `options` property to the `pullRequest` property.

  ```diff
  - <CatalogImportPage options={{ pullRequest: { disable: true } }} />
  + <CatalogImportPage pullRequest={{ disable: true }} />
  ```

- Updated dependencies [6ed2b47d6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [72b96e880]
- Updated dependencies [19d354c78]
- Updated dependencies [b51ee6ece]
  - @backstage/catalog-client@0.3.6
  - @backstage/integration@0.4.0
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.3.7

### Patch Changes

- ceef4dd89: Export _api_ (Client, API, ref) from the catalog import plugin.
- b712841d6: Migrated to new composability API, exporting the plugin instance as `catalogImportPlugin`, and the page as `CatalogImportPage`.
- 019fe39a0: Switch dependency from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
- Updated dependencies [12ece98cd]
- Updated dependencies [c4abcdb60]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [064c513e1]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [3149bfe63]
- Updated dependencies [54c7d02f7]
- Updated dependencies [2e62aea6f]
- Updated dependencies [11cb5ef94]
  - @backstage/core@0.6.0
  - @backstage/integration@0.3.2
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.3.6

### Patch Changes

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- Updated dependencies [6800da78d]
- Updated dependencies [9dd057662]
- Updated dependencies [0b1182346]
  - @backstage/integration@0.3.1
  - @backstage/plugin-catalog@0.2.14

## 0.3.5

### Patch Changes

- 2b514d532: Modifying import functionality to register existing catalog-info.yaml if one exists in given GitHub repository
- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [0b135e7e0]
- Updated dependencies [593632f07]
- Updated dependencies [33846acfc]
- Updated dependencies [fa8ba330a]
- Updated dependencies [a187b8ad0]
- Updated dependencies [ed6baab66]
- Updated dependencies [f04db53d7]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/integration@0.3.0
  - @backstage/plugin-catalog@0.2.12

## 0.3.4

### Patch Changes

- 34a01a171: Improve how URLs are analyzed for add/import
- bc40ccecf: Add more generic descriptions for the catalog-import form.
- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- be5ac7fde: Remove dependency to `@backstage/plugin-catalog-backend`.
- Updated dependencies [466354aaa]
- Updated dependencies [f3b064e1c]
- Updated dependencies [c00488983]
- Updated dependencies [265a7ab30]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/integration@0.2.0
  - @backstage/catalog-model@0.6.1
  - @backstage/plugin-catalog@0.2.11
  - @backstage/core@0.4.4

## 0.3.3

### Patch Changes

- edb7d0775: Create "url" type location when registering using the catalog-import plugin.
- Updated dependencies [99be3057c]
- Updated dependencies [49d2016a4]
- Updated dependencies [9c09a364f]
- Updated dependencies [73e75ea0a]
- Updated dependencies [036a84373]
- Updated dependencies [071711d70]
  - @backstage/plugin-catalog-backend@0.5.2
  - @backstage/plugin-catalog@0.2.10
  - @backstage/integration@0.1.5

## 0.3.2

### Patch Changes

- f3e75508d: Add description to Pull Request when registering a new component
- Updated dependencies [c6eeefa35]
- Updated dependencies [fb386b760]
- Updated dependencies [c911061b7]
- Updated dependencies [7c3ffc0cd]
- Updated dependencies [e7496dc3e]
- Updated dependencies [8ef71ed32]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [8dd0a906d]
- Updated dependencies [4eafdec4a]
- Updated dependencies [6b37c95bf]
- Updated dependencies [8c31c681c]
- Updated dependencies [7b98e7fee]
- Updated dependencies [178e09323]
- Updated dependencies [ac3560b42]
- Updated dependencies [0097057ed]
  - @backstage/plugin-catalog-backend@0.5.0
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1
  - @backstage/integration@0.1.4
  - @backstage/plugin-catalog@0.2.7

## 0.3.1

### Patch Changes

- 79418ddb6: Align plugin ID and fix variable typo
- d2938af4c: Add register existing component instructions
- Updated dependencies [6e8bb3ac0]
- Updated dependencies [2527628e1]
- Updated dependencies [e708679d7]
- Updated dependencies [047c018c9]
- Updated dependencies [6011b7d3e]
- Updated dependencies [1c69d4716]
- Updated dependencies [38d63fbe1]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/plugin-catalog-backend@0.4.0
  - @backstage/core@0.4.0
  - @backstage/plugin-catalog@0.2.6
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2

## 0.3.0

### Minor Changes

- a9fd599f7: Add Analyze location endpoint to catalog backend. Add catalog-import plugin and replace import-component with it. To start using Analyze location endpoint, you have add it to the `createRouter` function options in the `\backstage\packages\backend\src\plugins\catalog.ts` file:

  ```ts
  export default async function createPlugin(env: PluginEnvironment) {
    const builder = new CatalogBuilder(env);
    const {
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
    } = await builder.build();

    return await createRouter({
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
      logger: env.logger,
    });
  }
  ```

### Patch Changes

- Updated dependencies [b4488ddb0]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [e42402b47]
- Updated dependencies [bcc211a08]
- Updated dependencies [ebf37bbae]
  - @backstage/plugin-catalog-backend@0.3.0
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-catalog@0.2.5
