---
id: structure-of-a-plugin
title: Structure of a Plugin
description: Details about structure of a plugin
---

Nice, you have a new plugin! We'll soon see how we can develop it into doing
great things. But first off, let's look at what we get out of the box.

## Folder structure

The new plugin should look something like:

```
new-plugin/
    dist/
    node_modules/
    src/
        components/
            ExampleComponent/
                ExampleComponent.test.tsx
                ExampleComponent.tsx
                index.ts
            ExampleFetchComponent/
                ExampleFetchComponent.test.tsx
                ExampleFetchComponent.tsx
                index.ts
        index.ts
        plugin.test.ts
        plugin.ts
        routes.ts
    jest.config.js
    jest.setup.ts
    package.json
    README.md
    tsconfig.json
```

You might note a thing or two. Yes, a plugin looks like a mini project on it's
own with a `package.json` and a `src` folder. And this is because we want
plugins to be separate packages. This makes it possible to ship plugins on npm
and it lets you work on a plugin in isolation, without loading all the other
plugins in a potentially big Backstage app.

The `index.ts` files are there to let us import from the folder path and not
specific files. It's a way to have control over the exports in one file per
folder.

## Base files

In the root folder you have some configuration for typescript and jest, the test
runner. You get a readme to populate with info about your plugin and a
package.json to declare the plugin dependencies, metadata and scripts.

## The plugin file

In the `src` folder we get to the interesting bits. Check out the `plugin.ts`:

```jsx
import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const examplePlugin = createPlugin({
  id: 'example',
  routes: {
    root: rootRouteRef,
  },
});

export const ExamplePage = examplePlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
```

This is where the plugin is created and where it creates and exports extensions
that can be imported and used the app. See reference docs for
[createPlugin](../reference/createPlugin.md) or introduction to the new
[Composability System](./composability.md).

## Components

The generated plugin includes two example components to showcase how we
structure our plugins. There are usually one or multiple page components and
next to them you can split up the UI in as many components as you feel like.

We have the `ExamplePage` to show an example Backstage page component. The
`ExampleFetchComponent` showcases the common task of making an async request to
a public API and plot the response data in a table using Material-UI components.

You may tweak these components, rename them and/or replace them completely.

## Connecting the plugin to the Backstage app

There are three things needed for a Backstage app to start making use of a
plugin.

1. Add plugin as dependency in `app/package.json`
2. Import and use one or more plugin extensions, for example in
   `app/src/App.tsx`.

Luckily these three steps happen automatically when you create a plugin with the
Backstage CLI.

## Talking to the outside world

If your plugin needs to communicate with services outside the Backstage
environment you will probably face challenges like CORS policies and/or
backend-side authorization. To smooth this process out you can use proxy -
either the one you already have (like Nginx, HAProxy, etc.) or the proxy-backend
plugin that we provide for the Backstage backend.
[Read more](https://github.com/backstage/backstage/blob/master/plugins/proxy-backend/README.md)

[Back to Getting Started](../README.md)
