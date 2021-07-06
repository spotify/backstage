# @backstage/plugin-catalog-react

## 0.2.5

### Patch Changes

- 35a3e4e4c: Fix repetitive error reporting in EntityTypePicker
- Updated dependencies
  - @backstage/core-app-api@0.1.4
  - @backstage/core-components@0.1.4
  - @backstage/integration@0.5.7
  - @backstage/catalog-client@0.3.15

## 0.2.4

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-app-api@0.1.3
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-client@0.3.14
  - @backstage/catalog-model@0.8.4

## 0.2.3

### Patch Changes

- 172c97324: Add `EntityLifecyclePicker` and `EntityOwnerPicker` UI components to allow filtering by `spec.lifecycle` and `spec.owner` on catalog-related pages.
- Updated dependencies
  - @backstage/catalog-model@0.8.3
  - @backstage/core@0.7.13

## 0.2.2

### Patch Changes

- 7028ee1ca: Expose `getEntitySourceLocation`, `getEntityMetadataViewUrl`, and
  `getEntityMetadataEditUrl` from `@backstage/plugin-catalog-react`.
- Updated dependencies [75b8537ce]
- Updated dependencies [27a9b503a]
- Updated dependencies [da8cba44f]
- Updated dependencies [70bc30c5b]
- Updated dependencies [eda9dbd5f]
  - @backstage/core-plugin-api@0.1.2
  - @backstage/catalog-model@0.8.2
  - @backstage/catalog-client@0.3.13
  - @backstage/integration@0.5.6

## 0.2.1

### Patch Changes

- deaba2e13: Sort `EntityTagPicker` entries.
- 8e919a6f8: Tweak the `EntityListProvider` to do single-cycle updates
- Updated dependencies [031ccd45f]
- Updated dependencies [e7c5e4b30]
- Updated dependencies [ebe802bc4]
- Updated dependencies [1cf1d351f]
  - @backstage/core-plugin-api@0.1.1
  - @backstage/catalog-model@0.8.1
  - @backstage/core@0.7.12

## 0.2.0

### Minor Changes

- 17c497b81: The default `CatalogPage` has been reworked to be more composable and make
  customization easier. This change only affects those who have replaced the
  default `CatalogPage` with a custom implementation; others can safely ignore the
  rest of this changelog.

  If you created a custom `CatalogPage` to **add or remove tabs** from the
  catalog, a custom page is no longer necessary. The fixed tabs have been replaced
  with a `spec.type` dropdown that shows all available `Component` types in the
  catalog.

  For other needs, customizing the `CatalogPage` should now be easier. The new
  [CatalogPage.tsx](https://github.com/backstage/backstage/blob/9a4baa74509b6452d7dc054d34cf079f9997166d/plugins/catalog/src/components/CatalogPage/CatalogPage.tsx)
  shows the default implementation. Overriding this with your own, similar
  `CatalogPage` component in your `App.tsx` routing allows you to adjust the
  layout, header, and which filters are available.

  See the documentation added on [Catalog
  Customization](https://backstage.io/docs/features/software-catalog/catalog-customization)
  for instructions.

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [704875e26]
  - @backstage/catalog-client@0.3.12
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11

## 0.1.6

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
  - @backstage/catalog-model@0.7.9

## 0.1.5

### Patch Changes

- 81c54d1f2: Fetch relations in batches in `useRelatedEntities`
- Updated dependencies [f65adcde7]
- Updated dependencies [80888659b]
- Updated dependencies [d8b81fd28]
- Updated dependencies [d1b1306d9]
  - @backstage/core@0.7.8
  - @backstage/catalog-model@0.7.8
  - @backstage/catalog-client@0.3.11

## 0.1.4

### Patch Changes

- 9f48b548c: Make it possible to specify entity type to `useEntity` when it's known
- Updated dependencies [676ede643]
- Updated dependencies [b196a4569]
- Updated dependencies [8488a1a96]
  - @backstage/catalog-client@0.3.9
  - @backstage/catalog-model@0.7.5

## 0.1.3

### Patch Changes

- 01ccef4c7: Introduce `useRouteRefParams` to `core-api` to retrieve typed route parameters.
- Updated dependencies [fcc3ada24]
- Updated dependencies [4618774ff]
- Updated dependencies [df59930b3]
  - @backstage/core@0.7.3

## 0.1.2

### Patch Changes

- 9ca0e4009: use local version of lowerCase and upperCase methods
- Updated dependencies [8686eb38c]
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
  - @backstage/catalog-client@0.3.8
  - @backstage/core@0.7.2

## 0.1.1

### Patch Changes

- 9d455f69a: Introduce parameters for namespace, kind, and name to `entityRouteRef`.
- 02816ecd7: Fixed EntityProvider setting 'loading' bool erroneously to true
- Updated dependencies [12d8f27a6]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [4c049a1a1]
  - @backstage/catalog-model@0.7.3
  - @backstage/core@0.7.0

## 0.1.0

### Minor Changes

- d0760ecdf: Moved common useStarredEntities hook to plugin-catalog-react

### Patch Changes

- 88f1f1b60: Truncate and show ellipsis with tooltip if content of
  `createMetadataDescriptionColumn` is too wide.
- 9615e68fb: Forward link styling of `EntityRefLink` and `EnriryRefLinks` into the underling
  `Link`.
- 5c2e2863f: Added the proper type parameters to entityRouteRef.
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [1407b34c6]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [3a58084b6]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3
  - @backstage/catalog-model@0.7.2

## 0.0.4

### Patch Changes

- d34d26125: Limit the props that are forwarded to the `Link` component in the `EntityRefLink`.
- 0af242b6d: Introduce new cards to `@backstage/plugin-catalog` that can be added to entity pages:

  - `EntityHasSystemsCard` to display systems of a domain.
  - `EntityHasComponentsCard` to display components of a system.
  - `EntityHasSubcomponentsCard` to display subcomponents of a subcomponent.
  - In addition, `EntityHasApisCard` to display APIs of a system is added to `@backstage/plugin-api-docs`.

  `@backstage/plugin-catalog-react` now provides an `EntityTable` to build own cards for entities.
  The styling of the tables and new cards was also applied to the existing `EntityConsumedApisCard`,
  `EntityConsumingComponentsCard`, `EntityProvidedApisCard`, and `EntityProvidingComponentsCard`.

- 10a0124e0: Expose `useRelatedEntities` from `@backstage/plugin-catalog-react` to retrieve
  entities references via relations from the API.
- Updated dependencies [fd3f2a8c0]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core@0.6.2

## 0.0.3

### Patch Changes

- 19d354c78: Make `EntityRefLink` a `React.forwardRef` in order to use it as root component in other components like `ListItem`.
- Updated dependencies [6ed2b47d6]
- Updated dependencies [72b96e880]
- Updated dependencies [b51ee6ece]
  - @backstage/catalog-client@0.3.6
  - @backstage/core@0.6.1

## 0.0.2

### Patch Changes

- 7fc89bae2: Display owner and system as entity page links in the tables of the `api-docs`
  plugin.

  Move `isOwnerOf` and `getEntityRelations` from `@backstage/plugin-catalog` to
  `@backstage/plugin-catalog-react` and export it from there to use it by other
  plugins.

- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
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
  - @backstage/catalog-model@0.7.1
