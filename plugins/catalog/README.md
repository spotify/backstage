# Backstage Catalog Frontend

This is the React frontend for the default Backstage [software
catalog](http://backstage.io/docs/features/software-catalog/software-catalog-overview).
This package supplies interfaces related to listing catalog entities or showing
more information about them on entity pages.

## Installation

This `@backstage/plugin-catalog` package comes installed by default in any
Backstage application created with `npx @backstage/create-app`, so installation
is not usually required.

To check if you already have the package, look under
`packages/app/package.json`, in the `dependencies` block, for
`@backstage/plugin-catalog`. The instructions below walk through restoring the
plugin, if you previously removed it.

### Install the package

```bash
# From your Backstage root directory
cd packages/app
yarn add @backstage/plugin-catalog
```

### Add the plugin to your `packages/app`

Add the two pages that the catalog plugin provides to your app. You can choose
any name for these routes, but we recommend the following:

```diff
// packages/app/src/App.tsx
import {
  CatalogIndexPage,
  CatalogEntityPage,
} from '@backstage/plugin-catalog';
import { entityPage } from './components/catalog/EntityPage';

<FlatRoutes>
+  <Route path="/catalog" element={<CatalogIndexPage />} />
+  <Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}>
+  {/*
+    This is the root of the custom entity pages for your app, refer to the example app
+    in the main repo or the output of @backstage/create-app for an example
+  */}
+    {entityPage}
+  </Route>
  ...
</FlatRoutes>
```

The catalog plugin also has one external route that needs to be bound for it to
function: the `createComponent` route which should link to the page where the
user can create components. In a typical setup the create component route will
be linked to the scaffolder plugin's template index page:

```diff
// packages/app/src/App.tsx
+import { catalogPlugin } from '@backstage/plugin-catalog';
+import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

const app = createApp({
  // ...
  bindRoutes({ bind }) {
+    bind(catalogPlugin.externalRoutes, {
+      createComponent: scaffolderPlugin.routes.root,
+    });
  },
});
```

You may also want to add a link to the catalog index page to your application
sidebar:

```diff
// packages/app/src/components/Root/Root.tsx
+import HomeIcon from '@material-ui/icons/Home';

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
+      <SidebarItem icon={HomeIcon} to="/catalog" text="Home" />
      ...
    </Sidebar>
```

## Development

This frontend plugin can be started in a standalone mode from directly in this
package with `yarn start`. However, it will have limited functionality and that
process is most convenient when developing the catalog frontend plugin itself.

To evaluate the catalog and have a greater amount of functionality available,
run the entire Backstage example application from the root folder:

```bash
yarn dev
```

This will launch both frontend and backend in the same window, populated with
some example entities.

## Links

- [catalog-backend](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend)
  provides the backend API for this frontend.
