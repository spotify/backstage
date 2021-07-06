---
id: plugin-development
title: Plugin Development
description: Documentation on Plugin Development
---

Backstage plugins provide features to a Backstage App.

Each plugin is treated as a self-contained web app and can include almost any
type of content. Plugins all use a common set of platform APIs and reusable UI
components. Plugins can fetch data from external sources using the regular
browser APIs or by depending on external modules to do the work.

## Developing guidelines

- Consider writing plugins in `TypeScript`.
- Plan the directory structure of your plugin so that it becomes easy to manage.
- Prefer using the [Backstage components](https://backstage.io/storybook),
  otherwise go with [Material-UI](https://material-ui.com/).
- Check out the shared Backstage APIs before building a new one.

## Plugin concepts / API

### Routing

Each plugin can export routable extensions, which are then imported into the app
and mounted at a path.

First you will need a `RouteRef` instance to serve as the mount point of your
extensions. This can be used within your own plugin to create a link to the
extension page using `useRouteRef`, as well as for other plugins to link to your
extension.

It is best to place these in a separate top-level `src/routes.ts` file, in order
to avoid import cycles, for example like this:

```tsx
/* src/routes.ts */
import { createRouteRef } from '@backstage/core-plugin-api';

// Note: This route ref is for internal use only, don't export it from the plugin
export const rootRouteRef = createRouteRef({
  title: 'Example Page',
});
```

Now that we have a `RouteRef`, we import it into `src/plugin.ts`, create our
plugin instance with `createPlugin`, as well as create and wrap our routable
extension using `createRoutableExtension` from `@backstage/core-plugin-api`:

```tsx
/* src/plugin.ts */
import { createPlugin, createRouteRef } from '@backstage/core-plugin-api';
import ExampleComponent from './components/ExampleComponent';

// Create a plugin instance and export this from your plugin package
export const examplePlugin = createPlugin({
  id: 'example',
  routes: {
    root: rootRouteRef, // This is where the route ref should be exported for usage in the app
  },
});

// This creates a routable extension, which are typically full pages of content.
// Each extension should also be exported from your plugin package.
export const ExamplePage = examplePlugin.provide(
  createRoutableExtension({
    // The component needs to be lazy-loaded. It's what will actually be rendered in the end.
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    // This binds the extension to this route ref, which allows for routing within and across plugin extensions
    mountPoint: rootRouteRef,
  }),
);
```

This extension can then be imported and used in the app as follow, typically
placed within the top-level `<FlatRoutes>`:

```tsx
<Route route="/any-path" element={<ExamplePage />} />
```
