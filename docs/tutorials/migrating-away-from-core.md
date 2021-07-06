---
id: migrating-away-from-core
title: Migrating away from @backstage/core
description: Guide on how to migrate to the new Backstage core libraries.
---

The `@backstage/core` package has been split into three separate packages,
`@backstage/core-app-api`, `@backstage/core-plugin-api`, and
`@backstage/core-components`. For more information about the reasoning behind
this change and the naming of the packages, see the
[original RFC](https://github.com/backstage/backstage/issues/4872) and
[initial PR](https://github.com/backstage/backstage/pull/5825).

The main purpose of the split is to make plugins more decoupled from the app,
and open up for the possibility of combining plugins using many different
versions of the core libraries. This should significantly reduce the maintenance
burden on plugin authors, as well as reduce the impact of breaking changes in
the core APIs.

## Migration

At a high level the migration is done by simply replacing usages of
`@backstage/core` with one or more of the three new core libraries. There are a
few breaking changes in the new packages that are listed below, but for most
plugins the migration is a simple replacement. In order to make the migration as
smooth as possible we provide a collection of tools to automate the majority of
the migration effort.

Below is a list of steps that should get most projects completely migrated, the
order of the steps is a recommendation but not required, so don't worry if you
need to go back to previous steps to fix things.

### Step 1 - Run codemod

The first step is to run
[`@backstage/codemods`](https://www.npmjs.com/package/@backstage/codemods)
across your project. This will automatically convert all module imports in your
source code to use one of the three new core packages instead. For example, the
following change might occur:

```diff
-import { useApi, configApiRef, InfoCard } from '@backstage/core';
+import { useApi, configApiRef } from '@backstage/core-plugin-api';
+import { InfoCard } from '@backstage/core-components';
```

In a typical app created with `@backstage/create-app`, you would run the
following:

```shell
npx @backstage/codemods apply core-imports packages plugins
```

The last two arguments, `packages` and `plugins`, are the folders that the
codemod should be applied to. Add or remove folders as needed for your project.

The codemod might fail for some files because of the missing `IconKey` type in
any of the new packages. This is one of the few breaking changes. To fix, remove
any `IconKey` imports and replace usages of it with the `string` type, see the
breaking changes section below for details. Once usages of `IconKey` type have
been removed, you can re-run the codemod for those files.

Note that while the codemod tries to stick to using the existing formatting in
your project, it doesn't always manage to do that. If you're using `prettier` to
format the code in your project, it's best to run `prettier --write` on any
files that were changed by the codemod.

### Step 2 - Update dependencies

The next step is to update dependencies in your `package.json` files. Any
package that currently depends on `@backstage/core` will need to have it
replaced by one or more of the new packages. The app package should have all
three packages added to `dependencies`, while for plugins and additional non-app
packages, the `@backstage/core-plugin-api` and `@backstage/core-components`
packages should be added to the set of regular `dependencies`, and
`@backstage/core-app-api` should be added to `devDependencies` for usage in
tests.

A tool that can help out with step is the `plugin:diff` command from the
`@backstage/cli`, it will compare your plugin to the base plugin template and
suggest changes where the plugin deviates. A quick way to get this step done if
you have up-to-date project is to run the following in the project root:

```bash
# The --yes flag causes all suggested changes to be accepted automatically
yarn diff --yes
```

If you do not have the `diff` command set up in `package.json`, you can also
manually execute the following in each plugin folder:

```bash
yarn backstage-cli plugin:diff --yes
```

### Step 3 - Manual review

At this point your app is either completely or very close to being migrated. Run
type checks with `yarn tsc` to check if you hit any of the breaking changes
below or if there are any other things to fix. It can also be worthwhile
searching for occurrences of `@backstage/core` in the codebase, as that might
find usages in for example `jest` mock calls, which aren't handled by the
codemod.

As a final step you'll want to boot up the app and take it through any regular
verification step that you have set up for your project. Don't hesitate to open
a GitHub issue, PR, or reach out on Discord if you hit any snags, or if there
are any additional steps or hints that you think should be added to this guide!

## Breaking Changes

The following is a list of breaking changes between `@backstage/core` and the
three new core packages. Not that this list may not be exhaustive depending on
when you migrate your app, as new releases of the new core packages may bring
further changes.

### Removed `IconKey` type

The `IconKey` type used to be a string union of all known keys used for the app
icons available through `useApp().getSystemIcon(key)`. The type has been removed
since the set of allowed icon keys is no longer constrained, and there is
instead only a guarantee that the app provides a minimum set of icons, but can
provide any icons it wants beyond that. Migration is done by simply replacing
old usages by the `string` type.

### Constrained `IconComponent` type

The `IconComponent` type used to allow all of the props from the MUI `SvgIcon`.
This encouraged some bad patterns in open source plugins such as applying colors
to the icons, which in turn hurt the ability to replace the icons with custom
ones. The `IconComponent` type, which is now exported from
`@backstage/core-plugin-api`, now only accepts a `fontSize` prop used to set the
size of the icon. The type is compatible with the MUI `SvgIcon`, but there may
be situations where an icon needs an explicit cast to `IconComponent` in order
to narrow the type.
