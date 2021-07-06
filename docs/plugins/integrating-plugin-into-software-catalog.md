---
id: integrating-plugin-into-software-catalog
title: Integrate into the Software Catalog
description: How to integrate a plugin into software catalog
---

> This is an advanced use case and currently is an experimental feature. Expect
> API to change over time

## Steps

1. [Create a plugin](#create-a-plugin)
1. [Export a router with relative routes](#export-a-router)
1. [Import and use router in the APP](#import-and-use-router-in-the-app)

### Create a plugin

Follow the [same process](create-a-plugin.md) as for standalone plugin. You
should have a separate package in a folder, which represents your plugin.

Example:

```
$ yarn create-plugin
> ? Enter an ID for the plugin [required] my-plugin
> ? Enter the owner(s) of the plugin. If specified, this will be added to CODEOWNERS for the plugin path. [optional]

Creating the plugin...
```

### Export a router

Now in the plugin you have a `Router.tsx` file in the `src` folder. By default
it contains only one example route. Create a routing structure needed for your
plugin, keeping in mind that the whole set of routes defined here are going to
be mounted under some different route in the App.

Example:

`my-plugin` consists of 2 different views - `/me` and `/about`. I envision
people integrating it into plugin catalog as a tab named "MyPlugin". Then, my
`Routes.tsx` for the plugin is going to look like:

```tsx
<Routes>
  <Route path="/me" element={<MePage />} />
  <Route path="/about" element={<AboutPage />} />
</Routes>
```

(where MePage and AboutPage are 2 components defined in your plugin and imported
accordingly inside `Router.tsx`)

> Pay attention, if your `MePage` references the `AboutPage` it needs to do it
> through link to `about`, not `/about`. This allows react-router v6 to enable
> its relative routing mechanism. Read more -
> https://reacttraining.com/blog/react-router-v6-pre/#relative-route-path-and-link-to

### Import and use router in the APP

In the `app/src/components/catalog/EntityPage.tsx` (app === your folder,
containing Backstage app) import your created Router:

```tsx
import { Router as MyPluginRouter } from '@backstage/plugin-my-plugin;
```

Now, you need to mount `MyPluginRouter` onto some route, for example if you had:

```tsx
const DefaultEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<OverviewPage entity={entity} />}
    />
  </EntityPageLayout>
);
```

after you add your code it becomes:

```tsx
const DefaultEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<OverviewPage entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/my-plugin"
      title="My Plugin"
      element={<MyPluginRouter entity={entity} />}
    />
  </EntityPageLayout>
);
```

All of magic happens thanks to the `EntityPageLayout` component, which comes as
an export from `@backstage/plugin-catalog` package.

```tsx
type EntityPageLayoutContentProps = {
  /**
   * Going to be transformed into react-router v6
   * path under the hood. Read more at https://reacttraining.com/blog/react-router-v6-pre
   */
  path: string;
  /**
   * Gets transformed into the title for the tab
   */
  title: string;
  /**
   * Element that is rendered when the location
   * matches the path provided
   */
  element: JSX.Element;
};
```

> You can either pass the entity from App to the plugin's router as a prop or
> use `useEntity` hook from `@backstage/plugin-catalog` directly inside your
> plugin.
