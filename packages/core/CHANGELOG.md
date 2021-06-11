# @backstage/core

## 0.7.12

### Patch Changes

- 1cf1d351f: Export `CheckboxTree` as we have a storybook for it
- Updated dependencies [e7c5e4b30]
- Updated dependencies [0160678b1]
  - @backstage/theme@0.2.8
  - @backstage/core-api@0.2.21

## 0.7.11

### Patch Changes

- cc592248b: SignInPage: Show login page while pop-up is being displayed when `auto` prop is set.
- Updated dependencies [d597a50c6]
  - @backstage/core-api@0.2.20

## 0.7.10

### Patch Changes

- 65e6c4541: Remove circular dependencies
- 5da6a561d: Fix a bug where users are asked to log-in on every page refresh. This is specific to people with only one sign-in provider in their SignInPage component.
- Updated dependencies [61c3f927c]
- Updated dependencies [65e6c4541]
  - @backstage/core-api@0.2.19

## 0.7.9

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 889d89b6e: Fix state persisted in the URL make search input in the table toolbar lose their
  focus.
- 3f988cb63: Add count of older messages when multiple messages exist in AlertDisplay
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [675a569a9]
  - @backstage/core-api@0.2.18

## 0.7.8

### Patch Changes

- f65adcde7: Fix some transitive dependency warnings in yarn
- 80888659b: Bump react-hook-form version to be the same for the entire project.
- Updated dependencies [7b8272fb7]
- Updated dependencies [d8b81fd28]
  - @backstage/theme@0.2.7
  - @backstage/config@0.1.5

## 0.7.7

### Patch Changes

- 9afcac5af: Allow passing NavLinkProps to SidebarItem component to use in NavLink
- e0c9ed759: Add `if` prop to `EntityLayout.Route` to conditionally render tabs
- 6eaecbd81: Improve owner example value in `MissingAnnotationEmptyState`.

## 0.7.6

### Patch Changes

- 94da20976: Sort the table filter options by name.
- d8cc7e67a: Exposing Material UI extension point for tabs to be able to add additional information to them
- 99fbef232: Adding Headings for Accessibility on the Scaffolder Plugin
- ab07d77f6: Add support for discovering plugins through the app element tree, removing the need to register them explicitly.
- 937ed39ce: Exported SignInProviderConfig to strongly type SignInPage providers
- 9a9e7a42f: Adding close button on support menu
- 50ce875a0: Fixed a potentially confusing error being thrown about misuse of routable extensions where the error was actually something different.
- Updated dependencies [ab07d77f6]
- Updated dependencies [931b21a12]
- Updated dependencies [50ce875a0]
  - @backstage/core-api@0.2.17
  - @backstage/theme@0.2.6

## 0.7.5

### Patch Changes

- d0d1c2f7b: Pass `inverse` prop to Gauge from GaugeCard
- 5cafcf452: add debounce time attribute for apis-docs for search, giving more time to the users when they are typing.
- 86a95ba67: exposes undocumented `PageTheme`
- e27cb6c45: Don't use a drag & drop cursor when clicking on disabled `IconLinkVertical`.

## 0.7.4

### Patch Changes

- 1279a3325: Introduce a `load-chunk` step in the `BootErrorPage` to show make chunk loading
  errors visible to the user.
- 4a4681b1b: Improved error messaging for routable extension errors, making it easier to identify the component and mount point that caused the error.
- b051e770c: Fixed a bug with `useRouteRef` where navigating from routes beneath a mount point would often fail.
- 98dd5da71: Add support for multiple links to post-scaffold task summary page
- Updated dependencies [1279a3325]
- Updated dependencies [4a4681b1b]
- Updated dependencies [b051e770c]
  - @backstage/core-api@0.2.16

## 0.7.3

### Patch Changes

- fcc3ada24: Reuse ResponseErrorList for non ResponseErrors
- 4618774ff: Changed color for Add Item, Support & Choose buttons with low contrast/readability in dark mode
- df59930b3: Fix PropTypes error with OverflowTooltip component
- Updated dependencies [76deafd31]
- Updated dependencies [01ccef4c7]
- Updated dependencies [4618774ff]
  - @backstage/core-api@0.2.15
  - @backstage/theme@0.2.5

## 0.7.2

### Patch Changes

- 8686eb38c: Add a `ResponseErrorPanel` to render `ResponseError` from `@backstage/errors`
- 9ca0e4009: use local version of lowerCase and upperCase methods
- 34ff49b0f: Allow extension components to also return `null` in addition to a `JSX.Element`.
- Updated dependencies [a51dc0006]
- Updated dependencies [e7f9b9435]
- Updated dependencies [0434853a5]
- Updated dependencies [34ff49b0f]
- Updated dependencies [d88dd219e]
- Updated dependencies [c8b54c370]
  - @backstage/core-api@0.2.14
  - @backstage/config@0.1.4

## 0.7.1

### Patch Changes

- ff4d666ab: Add support for passing a fetch function instead of data to Table `data` prop.
- 2089de76b: Deprecated `ItemCard`. Added `ItemCardGrid` and `ItemCardHeader` instead, that can be used to compose functionality around regular Material-UI `Card` components instead.
- dc1fc92c8: Add support for non external URI's in the Link component to `to` prop. For example `<Link to="slack://channel?team=T0000&id=C0000">Slack</Link>
- Updated dependencies [13524b80b]
- Updated dependencies [e74b07578]
- Updated dependencies [6fb4258a8]
- Updated dependencies [2089de76b]
- Updated dependencies [395885905]
  - @backstage/core-api@0.2.13
  - @backstage/theme@0.2.4

## 0.7.0

### Minor Changes

- 4c049a1a1: - Adds onClick and other props to IconLinkVertical;

  - Allows TriggerButton component to render when pager duty key is missing;
  - Refactors TriggerButton and PagerDutyCard not to have shared state;
  - Removes the `action` prop of the IconLinkVertical component while adding `onClick`.

    Instead of having an action including a button with onClick, now the whole component can be clickable making it easier to implement and having a better UX.

    Before:

    ```ts
    const myLink: IconLinkVerticalProps = {
      label: 'Click me',
      action: <Button onClick={myAction} />,
      icon: <MyIcon onClick={myAction} />,
    };
    ```

    After:

    ```ts
    const myLink: IconLinkVerticalProps = {
      label: 'Click me',
      onClick: myAction,
      icon: <MyIcon />,
    };
    ```

### Patch Changes

- 40c0fdbaa: Added support for optional external route references. By setting `optional: true` when creating an `ExternalRouteRef` it is no longer a requirement to bind the route in the app. If the app isn't bound `useRouteRef` will return `undefined`.
- 2a271d89e: Internal refactor of how component data is access to avoid polluting components and make it possible to bridge across versions.
- bece09057: Improve rendering of multiple support item links in the `SupportButton`
- 169f48deb: Added the color prop to TrendLine from the Sparklines props types to be able to have custom colors.
- 8a1566719: Added a new useSupportConfig hook that reads a new `app.support` config key. Also updated the SupportButton and ErrorPage components to use the new config.
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
  - @backstage/core-api@0.2.12

## 0.6.3

### Patch Changes

- 3a58084b6: The `FlatRoutes` components now renders the not found page of the app if no routes are matched.
- e799e74d4: Fix `OverflowTooltip` cutting off the bottom of letters like "g" and "y".
- 1407b34c6: More informative error message for missing ApiContext.
- 9615e68fb: Forward link styling of `EntityRefLink` and `EnriryRefLinks` into the underling
  `Link`.
- 49f9b7346: Deprecate `type` of `ItemCard` and introduce new `subtitle` which allows passing
  react nodes.
- 3a58084b6: Created separate `AppContext` type to be returned from `useApp` rather than the `BackstageApp` itself. The `AppContext` type includes but deprecates `getPlugins`, `getProvider`, `getRouter`, and `getRoutes`. In addition, the `AppContext` adds a new `getComponents` method which providers access to the app components.
- 2c1f2a7c2: Introduced generic OverflowTooltip component for cases where longer text needs to be truncated with ellipsis and show hover tooltip with full text. This is particularly useful in the cases where longer description text is rendered in table. e.g. CatalogTable and ApiExplorerTable.
- Updated dependencies [3a58084b6]
- Updated dependencies [1407b34c6]
- Updated dependencies [b6c4f485d]
- Updated dependencies [3a58084b6]
- Updated dependencies [a1f5e6545]
  - @backstage/core-api@0.2.11
  - @backstage/config@0.1.3

## 0.6.2

### Patch Changes

- fd3f2a8c0: Export `createExternalRouteRef`, as well as give it an `id` for easier debugging, and fix parameter requirements when used with `useRouteRef`.
- f4c2bcf54: Use a more strict type for `variant` of cards.
- 07e226872: Export Select component
- f62e7abe5: Make sure that SidebarItems are also active when on sub route.
- 96f378d10: Add support for custom empty state of `Table` components.

  You can now optionally pass `emptyContent` to `Table` that is displayed
  if the table has now rows.

- 688b73110: Add Breadcrumbs component
- Updated dependencies [f10950bd2]
- Updated dependencies [fd3f2a8c0]
  - @backstage/core-api@0.2.10

## 0.6.1

### Patch Changes

- b51ee6ece: Fixed type inference of `createRouteRef`.

## 0.6.0

### Minor Changes

- 21e624ba9: Closes #3556
  The scroll bar of collapsed sidebar is now hidden without full screen.

  ![image](https://user-images.githubusercontent.com/46953622/105390193-0bfd0080-5c19-11eb-8e86-2161bbe6e8d9.png)

### Patch Changes

- 12ece98cd: Add className to the SidebarItem
- d82246867: Update `WarningPanel` component to use accordion-style expansion
- 5fa3bdb55: Add `href` in addition to `onClick` to `ItemCard`. Ensure that the height of a
  `ItemCard` with and without tags is equal.
- da9f53c60: Add a `prop` union for `SignInPage` that allows it to be used for just a single provider, with inline errors, and optionally with automatic sign-in.
- 32c95605f: Fix check that determines whether popup was closed or the messaging was misconfigured.
- 54c7d02f7: Introduce `TabbedLayout` for creating tabs that are routed.

  ```typescript
  <TabbedLayout>
    <TabbedLayout.Route path="/example" title="Example tab">
      <div>This is rendered under /example/anything-here route</div>
    </TabbedLayout.Route>
  </TabbedLayout>
  ```

- Updated dependencies [c810082ae]
  - @backstage/theme@0.2.3

## 0.5.0

### Minor Changes

- efd6ef753: Removed `InfoCard` variant `height100`, originally deprecated in [#2826](https://github.com/backstage/backstage/pull/2826).

  If your component still relies on this variant, simply replace it with `gridItem`.

- a187b8ad0: Removed deprecated `router.registerRoute` method in `createPlugin`.

  Deprecated `router.addRoute` method in `createPlugin`.

  Replace usage of the above two components with a routable extension.

  For example, given the following:

  ```ts
  import { createPlugin } from '@backstage/core';
  import { MyPage } from './components/MyPage';
  import { rootRoute } from './routes';

  export const plugin = createPlugin({
    id: 'my-plugin',
    register({ router }) {
      router.addRoute(rootRoute, MyPage);
    },
  });
  ```

  Migrate to

  ```ts
  import { createPlugin, createRoutableExtension } from '@backstage/core';
  import { rootRoute } from './routes';

  export const plugin = createPlugin({
    id: 'my-plugin',
    routes: {
      root: rootRoute,
    },
  });

  export const MyPage = plugin.provide(
    createRoutableExtension({
      component: () => import('./components/MyPage').then(m => m.MyPage),
      mountPoint: rootRoute,
    }),
  );
  ```

  And then use `MyPage` like this in the app:

  ```tsx
  <FlatRoutes>
  ...
    <Route path='/my-path' element={<MyPage />}>
  ...
  </FlatRoutes>
  ```

## 0.4.4

### Patch Changes

- 265a7ab30: Fix issue where `SidebarItem` with `onClick` and without `to` renders an inaccessible div. It now renders a button.

## 0.4.3

### Patch Changes

- a08c32ced: Add `FlatRoutes` component to replace the top-level `Routes` component from `react-router` within apps, removing the need for manually appending `/*` to paths or sorting routes.
- Updated dependencies [a08c32ced]
- Updated dependencies [86c3c652a]
- Updated dependencies [27f2af935]
  - @backstage/core-api@0.2.8

## 0.4.2

### Patch Changes

- 1dc445e89: Update to use new plugin extension API
- 342270e4d: Create AboutCard in core and use it in pagerduty and catalog plugin
- Updated dependencies [d681db2b5]
- Updated dependencies [1dc445e89]
  - @backstage/core-api@0.2.7

## 0.4.1

### Patch Changes

- 8ef71ed32: Add a `<Avatar>` component to `@backstage/core`.
- Updated dependencies [7dd2ef7d1]
  - @backstage/core-api@0.2.6

## 0.4.0

### Minor Changes

- ff243ce96: Introducing a new optional property within `app-config.yaml` called `auth.environment` to have configurable environment value for `auth.providers`

  **Default Value:** 'development'

  **Optional Values:** 'production' | 'development'

  **Migration-steps:**

  - To override the default value, one could simply introduce the new property `environment` within the `auth` section of the `config.yaml`
  - re-run the build to reflect the changed configs

### Patch Changes

- 2527628e1: Link `component` prop now accepts any element type.
- 1c69d4716: Fix React warning of descendant paragraph tag
- 04f26f88d: Export the `defaultConfigLoader` implementation
- Updated dependencies [b6557c098]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [d8d5a17da]
- Updated dependencies [1665ae8bb]
- Updated dependencies [e3bd9fc2f]
  - @backstage/core-api@0.2.5
  - @backstage/config@0.1.2
  - @backstage/theme@0.2.2

## 0.3.2

### Patch Changes

- 475fc0aaa: Clear sidebar search field once a search is executed

## 0.3.1

### Patch Changes

- 1722cb53c: Added configuration schema

## 0.3.0

### Minor Changes

- 199237d2f: New DependencyGraph component added to core package.

### Patch Changes

- 7b37d65fd: Adds the MarkdownContent component to render and display Markdown content with the default
  [GFM](https://github.github.com/gfm/) (GitHub Flavored Markdown) dialect.

  ```
  <MarkdownContent content={markdownGithubFlavored} />
  ```

  To render the Markdown content with plain [CommonMark](https://commonmark.org/), set the dialect to `common-mark`

  ```
  <MarkdownContent content={markdown} dialect='common-mark />
  ```

- 4aca74e08: Extend default config loader to read config from the window object.

  Config will be read from `window.__APP_CONFIG__` which should be an object.

- e8f69ba93: - The BottomLink is now able to handle with internal routes.
  - @backstage/core Link component detect whether it's an external link or not, and render accordingly
- 0c0798f08: Extend the table to share its current filter state. The filter state can be used together with the new `useQueryParamState` hook to store the current filter state to the browser history and restore it after navigating to other routes.
- 0c0798f08: Make the selected state of Select and CheckboxTree controllable from outside.
- 6627b626f: Fix divider prop not respected on InfoCard
- Updated dependencies [c5bab94ab]
- Updated dependencies [4577e377b]
  - @backstage/core-api@0.2.1
  - @backstage/theme@0.2.1

## 0.2.0

### Minor Changes

- 819a70229: Add SAML login to backstage

  ![](https://user-images.githubusercontent.com/872486/92251660-bb9e3400-eeff-11ea-86fe-1f2a0262cd31.png)

  ![](https://user-images.githubusercontent.com/872486/93851658-1a76f200-fce3-11ea-990b-26ca1a327a15.png)

- 482b6313d: Fix dense in Structured Metadata Table
- 1c60f716e: Added EmptyState component
- b79017fd3: Updated the `GithubAuth.create` method to configure the default scope of the GitHub Auth Api. As a result the
  default scope is configurable when overwriting the Core Api in the app.

  ```
  GithubAuth.create({
    discoveryApi,
    oauthRequestApi,
    defaultScopes: ['read:user', 'repo'],
  }),
  ```

- 6d97d2d6f: The InfoCard variant `'height100'` is deprecated. Use variant `'gridItem'` instead.

  When the InfoCard is displayed as a grid item within a grid, you may want items to have the same height for all items.
  Set to the `'gridItem'` variant to display the InfoCard with full height suitable for Grid:
  `<InfoCard variant="gridItem">...</InfoCard>`

  Changed the InfoCards in '@backstage/plugin-github-actions', '@backstage/plugin-jenkins', '@backstage/plugin-lighthouse'
  to pass an optional variant to the corresponding card of the plugin.

  As a result the overview content of the EntityPage shows cards with full height suitable for Grid.

### Patch Changes

- ae5983387: Fix banner position and color

  This PR closes: #2245

  The "fixed" props added to control the position of the banner. When it is set to true the banner will be shown in bottom of that page and the width will be based on the content of the message.

  ![](https://user-images.githubusercontent.com/15106494/93765685-999df480-fc15-11ea-8fa5-11cac5836cf1.png)

  ![](https://user-images.githubusercontent.com/15106494/93765697-9e62a880-fc15-11ea-92af-b6a7fee4bb21.png)

- 144c66d50: Fixed banner component position in DismissableBanner component
- 93a3fa3ae: Add forwardRef to the SidebarItem
- 782f3b354: add test case for Progress component
- 2713f28f4: fix the warning of all the core components test cases
- 406015b0d: Update ItemCard headers to pass color contrast standards.
- 82759d3e4: rename stories folder top Chip
- ac8d5d5c7: update the test cases of CodeSnippet component
- ebca83d48: add test cases for Status components
- aca79334f: update ItemCard component and it's story
- c0d5242a0: Proper render boolean values on StructuredMetadataTable component
- 3beb5c9fc: make ErrorPage responsive + fix the test case
- 754e31db5: give aria-label attribute to Status Ok, Warning and Error
- 1611c6dbc: fix the responsive of page story
- Updated dependencies [819a70229]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [cbbd271c4]
- Updated dependencies [b79017fd3]
- Updated dependencies [26e69ab1a]
- Updated dependencies [cbab5bbf8]
  - @backstage/core-api@0.2.0
  - @backstage/theme@0.2.0
