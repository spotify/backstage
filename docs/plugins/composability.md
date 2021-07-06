---
id: composability
title: Composability System Migration
# prettier-ignore
description: Documentation and migration instructions for new composability APIs.
---

## Summary

This page describes the new composability system that was recently introduced in
Backstage, and it does so from the perspective of the existing patterns and
APIs. As the new system is solidified and existing code is ported, this page
will be removed and replaced with a more direct description of the composability
system. For now, the primary purpose of this documentation is to aid in the
migration of existing plugins, but it does cover the migration of apps as well.

The core principle of the new composability system is that plugins should have
clear boundaries and connections. It should isolate crashes within a plugin, but
allow navigation between them. It should allow for plugins to be loaded only
when needed, and enable plugins to provide extension points for other plugins to
build upon. The composability system is also built with an app-first mindset,
prioritizing simplicity and clarity in the app over that in the plugins and core
APIs.

The new composability system isn't a single new API surface. It is a collection
of patterns, primitives, new APIs, and old APIs used in new ways. At the core is
the new concept of extensions, which are exported by plugins for use in the app.
There is also a new primitive called component data, which assists in the
conversion to a more declarative app. The `RouteRef`s now have a clear purpose
as well, and can be used route to pages in a flexible way.

## New Concepts

This section is a brief look into all the new and updated concepts that were put
in place to support the new composability system.

### Component Data

Component data is a new composability primitive that is introduced as a way to
provide a new data dimension for React components. Data is attached to React
components using a key, and is then readable from any JSX elements created with
those components, using the same key, as illustrated by the following example:

```tsx
const MyComponent = () => <h1>This is my component</h1>;
attachComponentData(MyComponent, 'my.data', 5);

const element = <MyComponent />;
const myData = getComponentData(element, 'my.data');
// myData === 5
```

The purpose of component data is to provide a method for embedding data that can
be inspected before rendering elements. Element inspection is a pattern that is
quite common among React libraries, and used for example by `react-router` and
`material-ui` to discover properties of the child elements before rendering.
Although in those libraries only the element type and props are typically
inspected, while our component data adds more structured access and simplifies
evolution by allowing for multiple different versions of a piece of data to be
used and interpreted at once.

The initial use-case for component data is to support route and plugin discovery
through elements in the app. Through this we allow for the React element tree in
the app to be the source of truth, both for which plugins are used, as well as
all top-level plugin routes in the app. The use of component data is not limited
to these use-cases though, as it can be used as a primitive to create new
abstractions as well.

### Extensions

Extensions are what plugins export for use in an app. Most typically they are
React components, but in practice they can be any kind of JavaScript value. They
are created using `create*Extension` functions, and wrapped with
`plugin.provide()` in order to create the actual exported extension.

The extension type is a simple one:

```ts
export type Extension<T> = {
  expose(plugin: BackstagePlugin<any, any>): T;
};
```

The power of extensions comes from the ability of various actors to hook into
their usage. The creation and plugin wrapping is controlled by whoever owns the
creation function, the Backstage core is able to hook into the process of
exposing the extension outside the plugin, and in the end the app controls the
usage of the extension.

The Backstage core API currently provides two different types of extension
creators, `createComponentExtension`, and `createRoutableExtension`. Component
extensions are plain React component with no particular requirements, for
example a card for an entity overview page. The component will be exported more
or less as is, but is wrapped to provide things like an error boundary, lazy
loading, and a plugin context.

Routable extensions build on top of component extensions and are used for any
component that should be rendered at a specific route path, such as top-level
pages or entity page tab content. When creating a routable extension you need to
supply a `RouteRef` as `mountPoint`. The mount point will be the handle of the
component for the outside world, and is used by other components and plugins
that wish to link to the routable component.

As of now there are only two extension creation functions, but it is possible to
add more of them in the future, both in the core library and in plugins that
wish to provide an extension point for other plugins to build upon. Extensions
are also not tied to React, and can both be used to model generic JavaScript
concepts, as well as potentially bridge to rendering libraries and web
frameworks other than React.

### Extensions from a Plugin's Point of View

Extensions are one of the primary methods to traverse the plugin boundary, and
the way that plugins provide concrete content for use within an app. They
replace existing component export concepts such as `Router` or `*Card`s for
display on entity overview pages.

It is recommended to create the exported extensions either in the top-level
`plugin.ts` file, or in a dedicated `extensions.ts` (or `.tsx`) file. That file
should not contain the bulk of the implementation though, and in fact, if the
extension is a React component it is recommended to lazy-load the actual
component. Component extensions support lazy loading out of the box using the
`lazy` component declaration, for example:

```ts
export const EntityFooCard = plugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components/FooCard').then(m => m.FooCard),
    },
  }),
);
```

Routable extensions even enforce lazy loading, as it is the only way to provide
a component:

```ts
export const FooPage = plugin.provide(
  createRoutableExtension({
    component: () => import('./components/FooPage').then(m => m.FooPage),
    mountPoint: fooPageRouteRef,
  }),
);
```

### Using Extensions in an App

Right now all extensions are modelled as React components. The usage of these
extension is like regular usage of any React components, with one important
difference. Extensions must all be part of a single React element tree spanning
from the root `AppProvider`.

For example, the following app code does **NOT** work:

```tsx
const AppRoutes = () => (
  <Routes>
    <Route path="/foo" element={<FooPage />} />
    <Route path="/bar" element={<BarPage />} />
  </Routes>
);

const App = () => (
  <AppProvider>
    <AppRouter>
      <Root>
        <AppRoutes />
      </Root>
    </AppRouter>
  </AppProvider>
);
```

But in this case it is simple to fix! Simply be sure to not create any
intermediate components in the app, for example like this:

```tsx
const appRoutes = (
  <Routes>
    <Route path="/foo" element={<FooPage />} />
    <Route path="/bar" element={<BarPage />} />
  </Routes>
);

const App = () => (
  <AppProvider>
    <AppRouter>
      <Root>{appRoutes}</Root>
    </AppRouter>
  </AppProvider>
);
```

### New Routing System

A big piece of what is enabled by moving over to this new composability system
is to make `RouteRef`s useful. The `RouteRef`s no longer have their own path, in
fact the only required parameter is currently a `title`. Instead of assigning a
path to each `RouteRef` and possibly overriding these paths in the app, the
concrete `path` for each `RouteRef` is discovered based on the element tree in
the app. Let's consider the following example:

```tsx
const appRoutes = (
  <Routes>
    <Route path="/foo" element={<FooPage />} />
    <Route path="/bar" element={<BarPage />} />
  </Routes>
);
```

We'll assume that `FooPage` and `BarPage` are routable extensions, exported by
the `fooPlugin` and `barPlugin` respectively. Since the `FooPage` is a routable
extension it has a `RouteRef` assigned as its mount point, which we'll refer to
as `fooPageRouteRef`.

Given the above example, the `fooPageRouteRef` will be associated with the
`'/foo'` route. The path is no longer accessible via the `path` property of the
`RouteRef` though, as the routing structure is tied to the app's react tree. We
instead use the new `useRouteRef` hook if we want to create a concrete link to
the page. The `useRouteRef` hook takes a single `RouteRef` as its only
parameter, and returns a function that is called to create the URL. For example
like this:

```tsx
const MyComponent = () => {
  const fooRoute = useRouteRef(fooPageRouteRef);
  return <a href={fooRoute()}>Link to Foo</a>;
};
```

Now let's assume that we want to link from the `BarPage` to the `FooPage`.
Before the introduction of the new composability system, we would do this by
importing the `fooPageRouteRef` exported by the `fooPlugin`. This created an
unnecessary dependency on the plugin, and also provided little flexibility in
allowing the app to tie plugins together, with the links instead being dictated
by the plugins themselves. To solve this, we introduce `ExternalRouteRef`s. Much
like regular route references, they can be passed to `useRouteRef` to create
concrete URLs, but they can not be used as mount points in routable component
and instead have to be associated with a target route using route bindings in
the app.

We create a new `ExternalRouteRef` inside the `barPlugin`, using a neutral name
that describes its role in the plugin rather than a specific plugin page that it
might be linking to, allowing the app to decide the final target. If the
`BarPage` for example wants to link to an external page in the header, it might
declare an `ExternalRouteRef` similar to this:

```ts
const headerLinkRouteRef = createExternalRouteRef({ id: 'header-link' });
```

### Binding External Routes in the App

The association of external routes is controlled by the app. Each
`ExternalRouteRef` of a plugin should be bound to an actual `RouteRef`, usually
from another plugin. The binding process happens once at app startup, and is
then used through the lifetime of the app to help resolve concrete route paths.

Using the above example of the `BarPage` linking to the `FooPage`, we might do
something like this in the app:

```ts
createApp({
  bindRoutes({ bind }) {
    bind(barPlugin.externalRoutes, {
      headerLink: fooPlugin.routes.root,
    });
  },
});
```

Given the above binding, using `useRouteRef(headerLinkRouteRef)` within the
`barPlugin` will let us create a link to whatever path the `FooPage` is mounted
at.

Note that we are not importing and using the `RouteRef`s directly in the app,
and instead rely on the plugin instance to access routes of the plugins. This is
a new convention that was introduced to provide better namespacing and
discoverability of routes, as well as reduce the number of separate exports from
each plugin package. The route references would be supplied to `createPlugin`
like this:

```ts
// In foo-plugin
export const fooPlugin = createPlugin({
  routes: {
    root: fooPageRouteRef,
  },
  ...
})

// In bar-plugin
export const barPlugin = createPlugin({
  externalRoutes: {
    headerLink: headerLinkRouteRef,
  },
  ...
})
```

Also note that you almost always want to create the route references themselves
in a different file than the one that creates the plugin instance, for example a
top-level `routes.ts`. This is to avoid circular imports when you use the route
references from other parts of the same plugin.

### Optional External Routes

When creating an `ExternalRouteRef` it is possible to mark it as optional:

```ts
const headerLinkRouteRef = createExternalRouteRef({
  id: 'header-link',
  optional: true,
});
```

An external route that is marked as optional is not required to be bound in the
app, allowing it to be used as a switch for whether a particular link should be
displayed or action should be taken.

When calling `useRouteRef` with an optional external route, its return signature
is changed to `RouteFunc | undefined`, allowing for logic like this:

```tsx
const MyComponent = () => {
  const headerLink = useRouteRef(headerLinkRouteRef);

  return (
    <header>
      My Header
      {headerLink && <a href={headerLink()}>External Link</a>}
    </header>
  );
};
```

### Parameterized Routes

A new addition to `RouteRef`s is the possibility of adding named and typed
parameters. Parameters are declared at creation, and will enforce presence of
the parameters in the path in the app, and require them as a parameter when
using `useRouteRef`.

The following is an example of creation and usage of a parameterized route:

```tsx
// Creation of a parameterized route
const myRouteRef = createRouteRef({
  title: 'My Named Route',
  params: ['name']
})

// In the app, where MyPage is a routable extension with myRouteRef set as mountPoint
<Route path='/my-page/:name' element={<MyPage />}/>

// Usage within a component
const myRoute = useRouteRef(myRouteRef)
return (
  <div>
    <a href={myRoute({name: 'a'})}>A</a>
    <a href={myRoute({name: 'b'})}>B</a>
  </div>
)
```

It is currently not possible to have parameterized `ExternalRouteRef`s, or to
bind an external route to a parameterized route, although this may be added in
the future if needed.

### Subroutes

The last kind of route refs that can be created are `SubRouteRef`s, which can be
used to create a route ref with a fixed path relative to an absolute `RouteRef`.
They are useful if you have a page that internally is mounted at a sub route of
a routable extension component, and you want other plugins to be able to route
to that page.

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
  },
});

export const MyPage = myPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/MyPage').then(m => m.MyPage),
    mountPoint: rootRouteRef,
  }),
);

// components/MyPage.tsx
const MyPage = () => (
  <Routes>
    {/* myPlugin.routes.root will take the user to this page */}
    <Route path="/" element={<IndexPage />} />

    {/* myPlugin.routes.details will take the user to this page */}
    <Route path="/details" element={<DetailsPage />} />
  </Routes>
);
```

### New Catalog Components

The established pattern for selecting what plugins should be available on each
catalog page is to use custom components in the app, with logic embedded in the
render function. Typically this takes form as a component that either receives
the entity via props or uses the `useEntity` hook to retrieve the selected
entity. A `switch` or `if` / `else if` chain is then used to select what
children should be rendered based on information in the entity.

This pattern will no longer work with the new composability system, and in
general is very difficult to build any form of declarative model around, as it
depends on runtime execution. To help replace existing code, a new
`EntitySwitch` component has been added to the `@backstage/catalog` plugin,
which grabs the selected entity from a context, and selects at most one element
to render using a list of `EntitySwitch.Case` children.

For example, if you want all entities of kind `"Template"` to be rendered with a
`MyTemplate` component, and all other entities to be rendered with a `MyOther`
component, you would do the following:

```tsx
<EntitySwitch>
  <EntitySwitch.Case if={isKind('template')}>
    <MyTemplate />
  </EntitySwitch.Case>

  <EntitySwitch.Case>
    <MyTemplate />
  </EntitySwitch.Case>
</EntitySwitch>

// Shorter form if desired:
<EntitySwitch>
  <EntitySwitch.Case if={isKind('template')} children={<MyTemplate />}/>
  <EntitySwitch.Case children={<MyTemplate />}/>
</EntitySwitch>
```

The `EntitySwitch` component will render the children of the first
`EntitySwitch.Case` that returns `true` when the selected entity is passed to
the function of the `if` prop. If none of the cases match, no children will be
rendered, and if a case doesn't specify an `if` filter function, it will always
match. The `if` property is simply a function of the type
`(entity: Entity) => boolean`, for example, `isKind` can be implemented like
this:

```ts
function isKind(kind: string) {
  return (entity: Entity) => entity.kind.toLowerCase() === kind.toLowerCase();
}
```

The `@backstage/catalog` plugin provides a couple of built-in conditions,
`isKind`, `isComponentType`, and `isNamespace`.

In addition to the `EntitySwitch` component, the catalog plugin also exports a
new `EntityLayout` component. It is a tweaked version and replacement for the
`EntityPageLayout` component, and is introduced more in depth in the app
migration section below.

## Porting Existing Plugins

There are a couple of high-level steps to porting an existing plugin to the new
composability system:

- Remove usage of `router.addRoute` or `router.registerRoute` within
  `createPlugin`, and export the page components as routable extensions instead.
- Switch any `Router` export to instead be a routable extension.
- Change any plain component exports, such as catalog overview cards, to be
  component extensions.
- Stop exporting `RouteRef`s and instead pass them to `createPlugin`.
- Stop accepting `RouteRef`s as props or importing them from other plugins,
  instead create an `ExternalRouteRef` as a replacement, and pass it to
  `createPlugin.`
- Rename any other exported symbols according to the naming pattern table below.

Note that removing the existing exports and configuration is a breaking change
in any plugin. If backwards compatibility is needed the existing code be
deprecated while making the new additions, to then be removed at a later point.

### Naming Patterns

Many export naming patterns have been changed to avoid import aliases and to
clarify intent. Refer to the following table to formulate the new name:

| Description          | Existing Pattern           | New Pattern     | Examples                                       |
| -------------------- | -------------------------- | --------------- | ---------------------------------------------- |
| Top-level Pages      | Router                     | \*Page          | CatalogIndexPage, SettingsPage, LighthousePage |
| Entity Tab Content   | Router                     | Entity\*Content | EntityJenkinsContent, EntityKubernetesContent  |
| Entity Overview Card | \*Card                     | Entity\*Card    | EntitySentryCard, EntityPagerDutyCard          |
| Entity Conditional   | isPluginApplicableToEntity | is\*Available   | isPagerDutyAvailable, isJenkinsAvailable       |
| Plugin Instance      | plugin                     | \*Plugin        | jenkinsPlugin, catalogPlugin                   |

## Porting Existing Apps

The first step of porting any app is to replace the root `Routes` component with
`FlatRoutes` from `@backstage/core-app-api`. As opposed to the `Routes`
component, `FlatRoutes` only considers the first level of `Route` components in
its children, and provides any additional children to the outlet of the route.
It also removes the need to append `"/*"` to paths, as it is added
automatically.

```diff
const AppRoutes = () => (
-  <Routes>
+  <FlatRoutes>
    ...
-    <Route path="/docs/*" element={<DocsRouter />} />
+    <Route path="/docs" element={<DocsRouter />} />
    ...
-  </Routes>
+  </FlatRoutes>
);
```

The next step should be to switch from using `EntityPageLayout` to
`EntityLayout`, as this can also be done without waiting for plugins to be
ported. You should also replace the top-level `Router` from the catalog plugin
with the separate `CatalogIndexPage` and `CatalogEntityPage` extensions that
have been added to the catalog:

```diff
-<Route
-  path={`${catalogRouteRef.path}/*`}
-  element={<CatalogRouter EntityPage={EntityPage} />}
-/>
+<Route path="/catalog" element={<CatalogIndexPage />} />
+<Route
+  path="/catalog/:namespace/:kind/:name"
+  element={<CatalogEntityPage />}
+>
+  <EntityPage />
+</Route>
```

At that point you should flatten out the element tree as much as possible in the
app, removing any intermediate components. At the top level this should usually
be straightforward, but when reaching the catalog entity pages you may need to
wait for some plugins to be migrated. This is because it is no longer possible
to pass in the selected entity through component props, and it should be picked
up from context inside the plugin instead. See the sections below for how to
carry out migrations of some common entity page patterns.

Once the app element tree doesn't contain any intermediate components, and all
plugin imports have been switched to extensions rather than plain components,
the app has been fully ported.

### Switching from EntityPageLayout to EntityLayout

The existing `EntityPageLayout` is replaced by the new `EntityLayout` component,
which has a slightly different pattern for expressing the contents and paths.

Porting from the old to the new API is just a matter of moving some things
around. For example, given the following existing code:

```tsx
<EntityPageLayout>
  <EntityPageLayout.Content
    path="/"
    title="Overview"
    element={<ComponentOverviewContent entity={entity} />}
  />
  <EntityPageLayout.Content
    path="/sentry"
    title="Sentry"
    element={<SentryRouter entity={entity} />}
  />
  <EntityPageLayout.Content
    path="/kubernetes/*"
    title="Kubernetes"
    element={<KubernetesRouter entity={entity} />}
  />
</EntityPageLayout>
```

It would be ported to this:

```tsx
<EntityLayout>
  <EntityLayout.Route path="/" title="Overview">
    <ComponentOverviewContent entity={entity} />
  </EntityLayout.Route>

  <EntityLayout.Route path="/sentry" title="Sentry">
    <SentryRouter entity={entity} />
  </EntityLayout.Route>

  <EntityLayout.Route path="/kubernetes" title="Kubernetes">
    <KubernetesRouter entity={entity} />
  </EntityLayout.Route>
</EntityLayout>
```

In addition to the renaming, the `element` prop has been moved to `children`.
Also note that the `/*` suffix has been removed from the `"/kubernetes"` path,
as it's now added automatically.

Usage of the `EntityLayout` component is required to be able to properly
discover routes, and so it is required to apply this change before you can start
using routable entity content extensions from plugins.

### Porting Entity Pages

The established pattern in the app is to use custom components in order to
select what plugin components to render for a given entity. The new
`EntitySwitch` component introduced above is what is intended to replace this
pattern, now that the entire app needs to be rendered as a single element tree.
For example, given the following existing code:

```tsx
export const EntityPage = () => {
  const { entity } = useEntity();

  switch (entity?.kind?.toLowerCase()) {
    case 'component':
      return <ComponentEntityPage entity={entity} />;
    case 'api':
      return <ApiEntityPage entity={entity} />;
    case 'group':
      return <GroupEntityPage entity={entity} />;
    case 'user':
      return <UserEntityPage entity={entity} />;
    default:
      return <DefaultEntityPage entity={entity} />;
  }
};
```

It would be migrated to this:

```tsx
export const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isKind('component')} children={componentPage} />
    <EntitySwitch.Case if={isKind('api')} children={apiPage} />
    <EntitySwitch.Case if={isKind('group')} children={groupPage} />
    <EntitySwitch.Case if={isKind('user')} children={userPage} />
    <EntitySwitch.Case children={defaultPage} />
  </EntitySwitch>
);
```

Note that for example `<ComponentEntityPage ... />` has been changed to simply
`componentPage`, that is because just like the `EntityPage` component, the
`ComponentEntityPage` also needs to be ported to be an element rather a
component in a similar way.
