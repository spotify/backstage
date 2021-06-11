# @backstage/core-api

## 0.2.21

### Patch Changes

- 0160678b1: Made the `RouteRef*` types compatible with the ones exported from `@backstage/core-plugin-api`.
- Updated dependencies [031ccd45f]
- Updated dependencies [e7c5e4b30]
  - @backstage/core-plugin-api@0.1.1
  - @backstage/theme@0.2.8

## 0.2.20

### Patch Changes

- d597a50c6: Add a global type definition for `Symbol.observable`, fix type checking in projects that didn't already have it defined.

## 0.2.19

### Patch Changes

- 61c3f927c: Updated the `Observable` type to provide interoperability with `Symbol.observable`, making it compatible with at least `zen-observable` and `RxJS 7`.

  In cases where this change breaks tests that mocked the `Observable` type, the following addition to the mock should fix the breakage:

  ```ts
    [Symbol.observable]() {
      return this;
    },
  ```

- 65e6c4541: Remove circular dependencies

## 0.2.18

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 675a569a9: chore: bump `react-use` dependency in all packages

## 0.2.17

### Patch Changes

- ab07d77f6: Add support for discovering plugins through the app element tree, removing the need to register them explicitly.
- 50ce875a0: Fixed a potentially confusing error being thrown about misuse of routable extensions where the error was actually something different.
- Updated dependencies [931b21a12]
  - @backstage/theme@0.2.6

## 0.2.16

### Patch Changes

- 1279a3325: Introduce a `load-chunk` step in the `BootErrorPage` to show make chunk loading
  errors visible to the user.
- 4a4681b1b: Improved error messaging for routable extension errors, making it easier to identify the component and mount point that caused the error.
- b051e770c: Fixed a bug with `useRouteRef` where navigating from routes beneath a mount point would often fail.

## 0.2.15

### Patch Changes

- 76deafd31: Changed the signature of `createRoutableExtension` to include null
- 01ccef4c7: Introduce `useRouteRefParams` to `core-api` to retrieve typed route parameters.
- Updated dependencies [4618774ff]
  - @backstage/theme@0.2.5

## 0.2.14

### Patch Changes

- a51dc0006: Export `SubRouteRef` type, and allow `SubRouteRef`s to be assigned to `plugin.routes`.
- e7f9b9435: Allow elements to be used multiple times in the app element tree.
- 34ff49b0f: Allow extension components to also return `null` in addition to a `JSX.Element`.
- d88dd219e: Internal refactor to allow for future package splits. As part of this `ApiRef`s are now identified by their ID rather than their reference.
- c8b54c370: Added new Docs Icon to Core Icons
- Updated dependencies [0434853a5]
  - @backstage/config@0.1.4

## 0.2.13

### Patch Changes

- 13524b80b: Fully deprecate `title` option of `RouteRef`s and introduce `id` instead.
- e74b07578: Fixed a bug where FlatRoutes didn't handle React Fragments properly.
- 6fb4258a8: Add `SubRouteRef`s, which can be used to create a route ref with a fixed path relative to an absolute `RouteRef`. They are useful if you for example have a page that is mounted at a sub route of a routable extension component, and you want other plugins to be able to route to that page.

  For example:

  ```tsx
  // routes.ts
  const rootRouteRef = createRouteRef({ id: 'root' });
  const detailsRouteRef = createSubRouteRef({
    id: 'root-sub',
    parent: rootRouteRef,
    path: '/details',
  });

  // plugin.ts
  export const myPlugin = createPlugin({
    routes: {
      root: rootRouteRef,
      details: detailsRouteRef,
    }
  })

  export const MyPage = plugin.provide(createRoutableExtension({
    component: () => import('./components/MyPage').then(m => m.MyPage),
    mountPoint: rootRouteRef,
  }))

  // components/MyPage.tsx
  const MyPage = () => (
    <Routes>
      {/* myPlugin.routes.root will take the user to this page */}
      <Route path='/' element={<IndexPage />}>

      {/* myPlugin.routes.details will take the user to this page */}
      <Route path='/details' element={<DetailsPage />}>
    </Routes>
  )
  ```

- 395885905: Wait for `configApi` to be ready before using `featureFlagsApi`
- Updated dependencies [2089de76b]
  - @backstage/theme@0.2.4

## 0.2.12

### Patch Changes

- 40c0fdbaa: Added support for optional external route references. By setting `optional: true` when creating an `ExternalRouteRef` it is no longer a requirement to bind the route in the app. If the app isn't bound `useRouteRef` will return `undefined`.
- 2a271d89e: Internal refactor of how component data is access to avoid polluting components and make it possible to bridge across versions.

## 0.2.11

### Patch Changes

- 3a58084b6: The `FlatRoutes` components now renders the not found page of the app if no routes are matched.
- 1407b34c6: More informative error message for missing ApiContext.
- b6c4f485d: Fix error when querying Backstage Identity with SAML authentication
- 3a58084b6: Created separate `AppContext` type to be returned from `useApp` rather than the `BackstageApp` itself. The `AppContext` type includes but deprecates `getPlugins`, `getProvider`, `getRouter`, and `getRoutes`. In addition, the `AppContext` adds a new `getComponents` method which providers access to the app components.
- Updated dependencies [a1f5e6545]
  - @backstage/config@0.1.3

## 0.2.10

### Patch Changes

- f10950bd2: Minor refactoring of BackstageApp.getSystemIcons to support custom registered
  icons. Custom Icons can be added using:

  ```tsx
  import AlarmIcon from '@material-ui/icons/Alarm';
  import MyPersonIcon from './MyPerson';

  const app = createApp({
    icons: {
      user: MyPersonIcon // override system icon
      alert: AlarmIcon, // Custom icon
    },
  });
  ```

- fd3f2a8c0: Export `createExternalRouteRef`, as well as give it an `id` for easier debugging, and fix parameter requirements when used with `useRouteRef`.

## 0.2.9

### Patch Changes

- ab0892358: Remove test dependencies from production package list

## 0.2.8

### Patch Changes

- a08c32ced: Add `FlatRoutes` component to replace the top-level `Routes` component from `react-router` within apps, removing the need for manually appending `/*` to paths or sorting routes.
- 86c3c652a: Deprecate `RouteRef` path parameter and member, and remove deprecated `routeRef.createSubRouteRef`.
- 27f2af935: Delay auth loginPopup close to avoid race condition with callers of authFlowHelpers.

## 0.2.7

### Patch Changes

- d681db2b5: Fix for GitHub and SAML auth not properly updating session state when already logged in.
- 1dc445e89: Introduce new plugin extension API
- Updated dependencies [1dc445e89]
  - @backstage/test-utils@0.1.6

## 0.2.6

### Patch Changes

- 7dd2ef7d1: Use auth provider ID to create unique session storage keys for GitHub and SAML Auth.

## 0.2.5

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

- d8d5a17da: Deprecated the `ConcreteRoute`, `MutableRouteRef`, `AbsoluteRouteRef` types and added a new `RouteRef` type as replacement.

  Deprecated and disabled the `createSubRoute` method of `AbsoluteRouteRef`.

  Add an as of yet unused `params` option to `createRouteRef`.

- Updated dependencies [e3bd9fc2f]
- Updated dependencies [e1f4e24ef]
- Updated dependencies [1665ae8bb]
- Updated dependencies [e3bd9fc2f]
  - @backstage/config@0.1.2
  - @backstage/test-utils@0.1.5
  - @backstage/theme@0.2.2

## 0.2.4

### Patch Changes

- b4488ddb0: Added a type alias for PositionError = GeolocationPositionError
  - @backstage/test-utils@0.1.4

## 0.2.3

### Patch Changes

- 700a212b4: bug fix: issue 3223 - detect mismatching origin and indicate it in the message at auth failure

## 0.2.2

### Patch Changes

- 9b9e86f8a: export oidc provider

## 0.2.1

### Patch Changes

- c5bab94ab: Updated the AuthApi `.create` methods to configure the default scope of the corresponding Auth Api. As a result the
  default scope is configurable when overwriting the Core Api in the app.

  ```
  GithubAuth.create({
    discoveryApi,
    oauthRequestApi,
    defaultScopes: ['read:user', 'repo'],
  }),
  ```

  Replaced redundant CreateOptions of each Auth Api with the OAuthApiCreateOptions type.

  ```
  export type OAuthApiCreateOptions = AuthApiCreateOptions & {
    oauthRequestApi: OAuthRequestApi;
    defaultScopes?: string[];
  };

  export type AuthApiCreateOptions = {
    discoveryApi: DiscoveryApi;
    environment?: string;
    provider?: AuthProvider & { id: string };
  };
  ```

- Updated dependencies [4577e377b]
  - @backstage/theme@0.2.1

## 0.2.0

### Minor Changes

- 819a70229: Add SAML login to backstage

  ![](https://user-images.githubusercontent.com/872486/92251660-bb9e3400-eeff-11ea-86fe-1f2a0262cd31.png)

  ![](https://user-images.githubusercontent.com/872486/93851658-1a76f200-fce3-11ea-990b-26ca1a327a15.png)

- b79017fd3: Updated the `GithubAuth.create` method to configure the default scope of the GitHub Auth Api. As a result the
  default scope is configurable when overwriting the Core Api in the app.

  ```
  GithubAuth.create({
    discoveryApi,
    oauthRequestApi,
    defaultScopes: ['read:user', 'repo'],
  }),
  ```

- cbab5bbf8: Refactored the FeatureFlagsApi to make it easier to re-implement. Existing usage of particularly getUserFlags can be replaced with isActive() or save().

### Patch Changes

- cbbd271c4: Add initial RouteRefRegistry

  Starting out some work to bring routing back and working as part of the work towards finalizing #1536

  This is some of the groundwork of an experiment we're working on to enable routing via RouteRefs, while letting the app itself look something like this:

  ```jsx
  const App = () => (
    <BackstageRoutes>
      <Navigate key="/" to="/catalog" />
      <CatalogRoute path="/catalog">
        {' '}
        // catalogRouteRef
        <EntityPage type="service">
          <OverviewContent path="/">
            <WidgetA />
            <WidgetB />
          </OverviewContent>
          <CICDSwitcher path="/ci-cd" />
          <StatusRoute path="/api-status" /> // statusRouteRef
          <ApiDocsRoute path="/api" />
          <DocsRoute path="/docs" />
        </EntityPage>
        <EntityPage type="website">
          <OverviewContent path="/">
            <WidgetA />
            <WidgetB />
          </OverviewContent>
          <CICDSwitcher path="/ci-cd" />
          <SentryRoute path="/sentry" /> // sentryRouteRef
          <DocsRoute path="/docs" />
        </EntityPage>
        <EntityPage>
          <OverviewContent path="/">
            <WidgetA />
            <WidgetB />
          </OverviewContent>
          <DocsRoute path="/docs" />
        </EntityPage>
      </CatalogRoute>
      <DocsRoute path="/docs" />
      <TechRadarRoute path="/tech-radar" width={1500} height={800} />
      <GraphiQLRoute path="/graphiql" />
      <LighthouseRoute path="/lighthouse" />
    </BackstageRoutes>
  );
  ```

  As part of inverting the composition of the app, route refs and routing in general was somewhat broken, intentionally. Right now it's not really possible to easily route to different parts of the app from a plugin, or even different parts of the plugin that are not within the same router.

  The core part of the experiment is to construct a map of ApiRef[] -> path overrides. Each key in the map is the list of route refs to traversed to reach a leaf in the routing tree, and the value is the path override at that point. For example, the above tree would add entries like [techDocsRouteRef] -> '/docs', and [entityRouteRef, apiDocsRouteRef] -> '/api'. By mapping out the entire app in this structure, the idea is that we can navigate to any point in the app using RouteRefs.

  The RouteRefRegistry is an implementation of such a map, and the idea is to add it in master to make it a bit easier to experiment and iterate. This is not an exposed API at this point.

  We've explored a couple of alternatives for how to enable routing, but it's boiled down to either a solution centred around the route map mentioned above, or treating all routes as static and globally unique, with no room for flexibility, customization or conflicts between different plugins. We're starting out pursuing this options 😁. We also expect that a the app-wide routing table will make things like dynamic loading a lot cleaner, as there would be a much more clear handoff between the main chunk and dynamic chunks.

- 26e69ab1a: Remove cost insights example client from demo app and export from plugin
  Create cost insights dev plugin using example client
  Make PluginConfig and dependent types public
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
  - @backstage/theme@0.2.0
  - @backstage/test-utils@0.1.2
