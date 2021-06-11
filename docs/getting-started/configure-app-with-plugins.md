---
id: configure-app-with-plugins
title: Configuring App with plugins
description: Documentation on How Configuring App with plugins
---

Backstage plugins customize the app for your needs. There is a
[plugin marketplace](https://backstage.io/plugins) with plugins for many common
infrastructure needs - CI/CD, monitoring, auditing, and more.

## Adding existing plugins to your app

The following steps assume that you have
[created a Backstage app](./create-an-app.md) and want to add an existing plugin
to it. We are using the
[CircleCI](https://github.com/backstage/backstage/blob/master/plugins/circleci/README.md)
plugin in this example.

1. Add the plugin's npm package to the repo:

```bash
yarn workspace app add @backstage/plugin-circleci
```

Note the plugin is added to the `app` package, rather than the root
package.json. Backstage Apps are set up as monorepos with
[yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). Since
CircleCI is a frontend UI plugin, it goes in `app` rather than `backend`.

2. Add the `EntityCircleCIContent` extension to the entity pages in the app:

```diff
 // packages/app/src/components/catalog/EntityPage.tsx
+import {
+  EntityCircleCIContent,
+  isCircleCIAvailable,
+} from '@backstage/plugin-circleci';

...
 const cicdContent = (
   <EntitySwitch>
     ...
+     <EntitySwitch.Case if={isCircleCIAvailable}>
+       <EntityCircleCIContent />
+     </EntitySwitch.Case>;
   </EntitySwitch>
 );
```

This is just one example, but each Backstage instance may integrate content or
cards to suit their needs on different pages, tabs, etc. Note that stand-alone
plugins that are not "attached" to the Software Catalog would be added outside
the `EntityPage`.

4. [Optional] Add proxy config:

```yaml
// app-config.yaml
proxy:
  '/circleci/api':
    target: https://circleci.com/api/v1.1
    headers:
      Circle-Token: ${CIRCLECI_AUTH_TOKEN}
```

### Adding a plugin page to the Sidebar

In a standard Backstage app created with
[@backstage/create-app](./create-an-app.md), the sidebar is managed inside
`packages/app/src/components/Root/Root.tsx`. The file exports the entire
`Sidebar` element of your app, which you can extend with additional entries by
adding new `SidebarItem` elements.

For example, if you install the `api-docs` plugin, a matching `SidebarItem`
could be something like this:

```tsx
// Import icon from MUI
import ExtensionIcon from '@material-ui/icons/Extension';

// ... inside the AppSidebar component
<SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />;
```

You can also use your own SVGs directly as icon components. Just make sure they
are sized according to the Material UI's
[SvgIcon](https://material-ui.com/api/svg-icon/) default of 24x24px, and set the
extension to `.icon.svg`. For example:

```ts
import InternalToolIcon from './internal-tool.icon.svg';
```
