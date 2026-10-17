---
id: linking-local-packages
title: Linking in Local Packages
description: How to link in other local packages into your Backstage monorepo
---

## Why?

If you are looking to make changes within the core Backstage repository and test
those changes within your Backstage application, you will need to link the two
together:

```text
~/backstage                // cloned from GitHub
~/my-backstage-application // generated using npx
```

For example, you might want to make modifications to `@backstage/core-plugin-api` and try them out in your company's
instance of Backstage.

## External workspace linking

:::info
Workspace linking is an experimental feature and may not work in all cases.
:::

The `backstage-cli package start` command that is used for local development of all packages supports a `--link` flag that can be used to link a single external workspace to the current workspace. It hooks into the module resolution and will override all imports of packages in the linked workspace to be imported from there instead. The only exception are the `react` and `react-dom` packages, which will always be resolved from the target package.

When linking an external workspace, make sure that dependencies are installed and up to date in both workspaces, and that the versions of `react` and `react-dom` are the same in both workspaces.

If you're within the `packages/app` folder inside your `my-backstage-application` workspace in the above example, you can link the `backstage` workspace using the following command:

```bash
yarn start --link ../../../backstage
```

The path provided to the `--link` option can be a relative or absolute path, and should point to the root of the external workspace.

With the `start` command up and running and serving the development version of your frontend app in the browser, you can now make changes to both workspaces and see the changes reflected in the browser.

You can also link backend packages using the exact same process, simply start your backend package with the same `--link <workspace-path>` option.

## Common Problems

### React errors

If you are encountering errors related to React, it is likely that the versions of React in the two workspaces are different. Make sure that the versions of `react` and `react-dom` are the same in both workspaces, or at least that they are in sync between the package that you're serving the app from and the external workspace.

## Generating temporary patches

:::info
This feature is experimental and only supports Yarn workspaces. It does not
work in pnpm projects. See [Package Managers](../package-managers.md).
:::

After making local changes to a package in an external workspace you might often want to merge and deploy these changes in your own project. You can use Yarn patches for this purpose, but it can be quite cumbersome to create these patches manually. To make this process easier, you can use `yarn backstage-repo-tools generate-patch` command from the `@backstage/repo-tools` package to generate a patch and resolution entries in the external workspace.

For example, if you've made changes to the `@backstage/backend-app-api` package in a local clone of the main `backstage` repository, you can generate a patch for your internal project as follows:

```bash title="Run in the cloned backstage repository"
yarn backstage-repo-tools generate-patch @backstage/backend-app-api --target ../our-developer-portal
```

This will generate a patch file in your `our-developer-portal` workspace. The patch will be based on the most recently released version of the source package, with the additional changes on top.

If you want to base the patch on a different version of the source package, you can specify the version using the `--base-version <version>` option, and if you want to only use the patch for a specific version query, you can specify that using the `--query <query>` option.
