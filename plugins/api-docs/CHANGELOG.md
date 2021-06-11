# @backstage/plugin-api-docs

## 0.4.15

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0

## 0.4.14

### Patch Changes

- 65e6c4541: Remove circular dependencies
- Updated dependencies [f7f7783a3]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5da6a561d]
  - @backstage/catalog-model@0.7.10
  - @backstage/core@0.7.10

## 0.4.13

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 889d89b6e: Fix state persisted in the URL make search input in the table toolbar lose their
  focus.
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

## 0.4.12

### Patch Changes

- 1ce80ff02: Resolve issues with AsyncAPI rendering by updating `@asyncapi/react-component`
  to `0.23.0`. The theming of the component is adjusted to the latest styling
  changes.
- c614ede9a: Updated README to have up-to-date install instructions.
- 07a7806c3: Added fields filtering in get API entities to avoid the requesting of unused data
- Updated dependencies [9afcac5af]
- Updated dependencies [e0c9ed759]
- Updated dependencies [6eaecbd81]
  - @backstage/core@0.7.7

## 0.4.11

### Patch Changes

- 12390778e: chore(deps): bump @asyncapi/react-component from 0.19.2 to 0.22.3
- 5cafcf452: add debounce time attribute for apis-docs for search, giving more time to the users when they are typing.
- Updated dependencies [bb5055aee]
- Updated dependencies [d0d1c2f7b]
- Updated dependencies [5d0740563]
- Updated dependencies [5cafcf452]
- Updated dependencies [86a95ba67]
- Updated dependencies [e27cb6c45]
  - @backstage/catalog-model@0.7.7
  - @backstage/core@0.7.5

## 0.4.10

### Patch Changes

- ee5529268: Include the GraphiQL stylesheet
- 60bddefce: Export `apiDocsConfigRef` from `api-docs` plugin to allow extending it with
  custom API rendering.
- 9f48b548c: Make it possible to specify entity type to `useEntity` when it's known
- Updated dependencies [9f48b548c]
- Updated dependencies [8488a1a96]
  - @backstage/plugin-catalog-react@0.1.4
  - @backstage/catalog-model@0.7.5

## 0.4.9

### Patch Changes

- 9ca0e4009: use local version of lowerCase and upperCase methods
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
  - @backstage/core@0.7.2
  - @backstage/plugin-catalog-react@0.1.2

## 0.4.8

### Patch Changes

- 32a003973: Update messaging when no entities are in a table.
- 2386de1d3: Add organization name to the API Explorer page title
- f71589800: The api-docs plugin has been migrated to use an [external route reference](https://backstage.io/docs/plugins/composability#binding-external-routes-in-the-app) to dynamically link to the create component page. This means you need to migrate the api docs plugin to use the new extension components, as well as bind the external route.

  To bind the external route from the api docs plugin to the scaffolder template index page, make sure you have the appropriate imports and add the following to the `createApp` call:

  ```ts
  import { apiDocsPlugin } from '@backstage/plugin-api-docs';
  import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

  const app = createApp({
    // ...
    bindRoutes({ bind }) {
      bind(apiDocsPlugin.externalRoutes, {
        createComponent: scaffolderPlugin.routes.root,
      });
    },
  });
  ```

  If you choose to not bind the routes, the button to create new APIs is not displayed.

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

## 0.4.7

### Patch Changes

- d6593abe6: Remove domain column from `HasSystemsCard` and system from `HasComponentsCard`,
  `HasSubcomponentsCard`, and `HasApisCard`.
- 437bac549: Make the description column in the catalog table and api-docs table use up as
  much space as possible before hiding overflowing text.
- 5469a9761: Changes made in CatalogTable and ApiExplorerTable for using the OverflowTooltip component for truncating large description and showing tooltip on hover-over.
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

## 0.4.6

### Patch Changes

- 0af242b6d: Introduce new cards to `@backstage/plugin-catalog` that can be added to entity pages:

  - `EntityHasSystemsCard` to display systems of a domain.
  - `EntityHasComponentsCard` to display components of a system.
  - `EntityHasSubcomponentsCard` to display subcomponents of a subcomponent.
  - In addition, `EntityHasApisCard` to display APIs of a system is added to `@backstage/plugin-api-docs`.

  `@backstage/plugin-catalog-react` now provides an `EntityTable` to build own cards for entities.
  The styling of the tables and new cards was also applied to the existing `EntityConsumedApisCard`,
  `EntityConsumingComponentsCard`, `EntityProvidedApisCard`, and `EntityProvidingComponentsCard`.

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

## 0.4.5

### Patch Changes

- f5e564cd6: Improve display of error messages
- Updated dependencies [19d354c78]
- Updated dependencies [b51ee6ece]
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.4.4

### Patch Changes

- 7fc89bae2: Display owner and system as entity page links in the tables of the `api-docs`
  plugin.

  Move `isOwnerOf` and `getEntityRelations` from `@backstage/plugin-catalog` to
  `@backstage/plugin-catalog-react` and export it from there to use it by other
  plugins.

- bc5082a00: Migrate to new composability API, exporting the plugin as `apiDocsPlugin`, index page as `ApiExplorerPage`, and entity page cards as `EntityApiDefinitionCard`, `EntityConsumedApisCard`, `EntityConsumingComponentsCard`, `EntityProvidedApisCard`, and `EntityProvidingComponentsCard`.
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

## 0.4.3

### Patch Changes

- 8855f61f6: Update `@asyncapi/react-component` to 0.18.2
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

## 0.4.2

### Patch Changes

- 9161531b2: Link register API to catalog-import plugin
- Updated dependencies [a08c32ced]
- Updated dependencies [7e0b8cac5]
- Updated dependencies [87c0c53c2]
  - @backstage/core@0.4.3
  - @backstage/plugin-catalog@0.2.9

## 0.4.1

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1
  - @backstage/plugin-catalog@0.2.7

## 0.4.0

### Minor Changes

- 246799c7f: Stop exposing a custom router from the `api-docs` plugin. Instead, use the
  widgets exported by the plugin to compose your custom entity pages.

  Instead of displaying the API definitions directly in the API tab of the
  component, it now contains tables linking to the API entities. This also adds
  new widgets to display relationships (bot provides & consumes relationships)
  between components and APIs.

  See the changelog of `create-app` for a migration guide.

### Patch Changes

- Updated dependencies [2527628e1]
- Updated dependencies [6011b7d3e]
- Updated dependencies [1c69d4716]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/plugin-catalog@0.2.6
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2

## 0.3.1

### Patch Changes

- 7eb8bfe4a: Update swagger-ui-react to 3.37.2
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
- Updated dependencies [ebf37bbae]
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-catalog@0.2.5

## 0.3.0

### Minor Changes

- f3bb55ee3: APIs now have real entity pages that are customizable in the app.
  Therefore the old entity page from this plugin is removed.
  See the `packages/app` on how to create and customize the API entity page.

### Patch Changes

- 6f70ed7a9: Replace usage of implementsApis with relations
- Updated dependencies [6f70ed7a9]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
  - @backstage/plugin-catalog@0.2.4
  - @backstage/catalog-model@0.3.1

## 0.2.2

### Patch Changes

- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-catalog@0.2.3

## 0.2.1

### Patch Changes

- 0c0798f08: Persist table state of the API Explorer to the browser history. This allows to navigate between pages and come back to the previous filter state.
- 84b654d5d: Use dense table style and outlined chips in the API Explorer.
- 803527bd3: Upgrade @kyma-project/asyncapi-react to 0.14.2
- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
- Updated dependencies [2d0bd1be7]
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1
  - @backstage/plugin-catalog@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI
- 339668995: There were some missing features and markdown was not rendered properly, but this is fixed now.

  Details:

  - [`asyncapi/asyncapi-react#149`](https://github.com/asyncapi/asyncapi-react/pull/149) - fix: improve markdown rendering of nested fields
  - [`asyncapi/asyncapi-react#150`](https://github.com/asyncapi/asyncapi-react/pull/150) - feat: display the description of channels and operations
  - [`asyncapi/asyncapi-react#153`](https://github.com/asyncapi/asyncapi-react/pull/153) - fix: let the list of `enums` break into multiple lines

### Patch Changes

- a73979d45: Resolve some dark mode styling issues in asyncAPI specs
- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [368fd8243]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [f0aa01bcc]
- Updated dependencies [0aecfded0]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [8b9c8196f]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [60d40892c]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [2ebcfac8d]
- Updated dependencies [fa56f4615]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [0b956f21b]
- Updated dependencies [97c2cb19b]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/plugin-catalog@0.2.0
  - @backstage/core@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
