# Scaffolder Backend

This is the backend for the default Backstage [software
templates](https://backstage.io/docs/features/software-templates/software-templates-index).
This provides the API for the frontend [scaffolder
plugin](https://github.com/backstage/backstage/tree/master/plugins/scaffolder),
as well as the built-in template actions, tasks and stages.

## Installation

This `@backstage/plugin-scaffolder-backend` package comes installed by default
in any Backstage application created with `npx @backstage/create-app`, so
installation is not usually required.

To check if you already have the package, look under
`packages/backend/package.json`, in the `dependencies` block, for
`@backstage/plugin-scaffolder-backend`. The instructions below walk through
restoring the plugin, if you previously removed it.

### Install the package

```bash
# From your Backstage root directory
cd packages/backend
yarn add @backstage/plugin-scaffolder-backend
```

### Adding the plugin to your `packages/backend`

You'll need to add the plugin to the router in your `backend` package. You can
do this by creating a file called `packages/backend/src/plugins/scaffolder.ts`
with contents matching [scaffolder.ts in the create-app
template](https://github.com/backstage/backstage/blob/master/packages/create-app/templates/default-app/packages/backend/src/plugins/scaffolder.ts).

With the `scaffolder.ts` router setup in place, add the router to
`packages/backend/src/index.ts`:

```diff
+import scaffolder from './plugins/scaffolder';

async function main() {
  ...
  const createEnv = makeCreateEnv(config);

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
+  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));

  const apiRouter = Router();
+  apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));
  ...
  apiRouter.use(notFoundHandler());

```

### Adding templates

At this point the scaffolder backend is installed in your backend package, but
you will not have any templates available to use. These need to be [added to the
software
catalog](https://backstage.io/docs/features/software-templates/adding-templates).

To get up and running and try out some templates quickly, you can or copy the
catalog locations from the [create-app
template](https://github.com/backstage/backstage/blob/master/packages/create-app/templates/default-app/app-config.yaml.hbs).
