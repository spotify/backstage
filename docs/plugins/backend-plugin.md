---
id: backend-plugin
title: Backend plugins
description: Creating and Developing Backend plugins
---

This page describes the process of creating and managing backend plugins in your
Backstage repository.

## Creating a Backend Plugin

A new, bare-bones backend plugin package can be created by issuing the following
command in your Backstage repository root:

```sh
yarn create-plugin --backend
```

Please also see the `--help` flag for the `create-plugin` command for some
further options that are available, notably the `--scope` and `--no-private`
flags that control naming and publishing of the newly created package. Your repo
root `package.json` will probably also have some default values already set up
for these.

You will be asked to supply a name for the plugin. This is an identifier that
will be part of the NPM package name, so make it short and containing only
lowercase characters separated by dashes, for example `carmen`, if it's a
package that adds an integration with a system named Carmen, for example. The
full NPM package name would then be something like
`@internal/plugin-carmen-backend`, depending on the other flags passed to the
`create-plugin` command, and your settings for the `create-plugin` command in
your root `package.json`.

Creating the plugin will take a little while, so be patient. It will helpfully
run the initial installation and build commands, so that your package is ready
to be hacked on! It will be located in a new folder in your `plugins` directory,
in this example `plugins/carmen-backend`.

For simple development purposes, a backend plugin can actually be started in a
standalone mode. You can do a first-light test of your service:

```sh
cd plugins/carmen-backend
yarn start
```

This will think for a bit, and then say `Listening on :7000`. In a different
terminal window, now run

```sh
curl localhost:7000/carmen/health
```

This should return `{"status":"ok"}`. Success! Press `Ctrl + c` to kill it
again.

## Developing your Backend Plugin

A freshly created backend plugin does basically nothing, in terms of the overall
app. It has a small set of basic dependencies and exposes an Express router in
`src/service/router.ts`. This is where you will start adding routes and
connecting those to actual underlying functionality. But nothing in your
Backstage application / backend exposes it.

To actually attach and run the plugin router, you will make some modifications
to your backend.

```sh
# From the Backstage root directory
cd packages/backend
yarn add @internal/plugin-carmen-backend@^0.1.1 # Change this to match the plugin's package.json
```

Create a new file named `packages/backend/src/plugins/carmen.ts`, and add the
following to it

```ts
import { createRouter } from '@internal/plugin-carmen-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin(env: PluginEnvironment) {
  // Here is where you will add all of the required initialization code that
  // your backend plugin needs to be able to start!

  // The env contains a lot of goodies, but our router currently only
  // needs a logger
  return await createRouter({
    logger: env.logger,
  });
}
```

And finally, wire this into the overall backend router. Edit
`packages/backend/src/index.ts`:

```ts
import carmen from './plugins/carmen';
// ...
async function main() {
  // ...
  const carmenEnv = useHotMemoize(module, () => createEnv('carmen'));
  apiRouter.use('/carmen', await carmen(carmenEnv));
```

After you start the backend (e.g. using `yarn start-backend` from the repo
root), you should be able to fetch data from it.

```sh
# Note the extra /api here
curl localhost:7000/api/carmen/health
```

This should return `{"status":"ok"}` like before. Success!

## Making Use of a Database

The Backstage backend comes with a builtin facility for SQL database access.
Most plugins that have persistence needs will choose to make use of this
facility, so that Backstage operators can manage database needs uniformly.

As part of the environment object that is passed to your `createPlugin`
function, there is a `database` field. You can use that to get a
[Knex](http://knexjs.org/) connection object.

```ts
// in packages/backend/src/plugins/carmen.ts
export default async function createPlugin(env: PluginEnvironment) {
  const db: Knex<any, unknown[]> = await env.database.getClient();

  // You will then pass this client into your actual plugin implementation
  // code, maybe similar to the following:
  const model = new CarmenDatabaseModel(db);
  return await createRouter({
    model: model,
    logger: env.logger,
  });
}
```

You may note that the `getClient` call has no parameters. This is because all
plugin database needs are configured under the `backend.database` config key of
your `app-config.yaml`. The framework may even make sure behind the scenes that
the logical database is created automatically if it doesn't exist, based on
rules that the Backstage operator decides on.

The framework does not handle database schema migrations for you, however. The
builtin plugins in the main repo have chosen to use the Knex library to manage
schema migrations as well, but you can do so in any manner that you see fit.

See the [Knex library documentation](http://knexjs.org/) for examples and
details on how to write schema migrations and perform SQL queries against your
database..
