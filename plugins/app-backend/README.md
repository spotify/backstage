# App backend plugin

This backend plugin can be installed to serve static content of a Backstage app.

## Installation

Add both this package and your local frontend app package as dependencies to your backend, for example

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-app-backend app
```

By adding the app package as a dependency we ensure that it is built as part of the backend, and that it can be resolved at runtime.

The app package is resolved from the location of `@backstage/backend-plugin-api`. If your package manager doesn't hoist workspace packages, for example pnpm with `hoistWorkspacePackages: false`, add the app package to the `dependencies` of the root `package.json` as well. This links it into the root `node_modules`, where it can be found. Use `dependencies` rather than `devDependencies`, so that production installs keep it.

```json title="package.json"
{
  "dependencies": {
    "app": "workspace:*"
  }
}
```

Now add the plugin to your app, creating it for example like this:

### New Backend

```ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-app-backend'));
backend.start();
```

### Old Backend

```ts
const router = await createRouter({
  logger: env.logger,
  appPackageName: 'example-app',
});
```

And registering it like this:

```ts
createServiceBuilder(module)
  ...
  .addRouter('', router);
```

Be sure to register the app router last, as it serves content for HTML5-mode navigation, i.e. falling back to serving `index.html` for any route that can't be found.

## Public entry point configuration

To restrict configuration exposed to unauthenticated users, see
[Restricting public configuration](https://backstage.io/docs/conf/writing/#restricting-public-configuration).
