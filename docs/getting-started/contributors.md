---
id: contributors
title: Contributors
# prettier-ignore
description: Documentation on how to get set up for doing development on the Backstage repository
---

This section describes how to get set up for doing development on the Backstage
repository.

## Cloning the Repository

Ok. So you're gonna want some code right? Go ahead and fork the repository into
your own GitHub account and clone that code to your local machine or you can
grab the one for the origin like so:

```bash
git clone git@github.com:backstage/backstage --depth 1
```

If you cloned a fork, you can add the upstream dependency like so:

```bash
git remote add upstream git@github.com:backstage/backstage
git pull upstream master
```

After you have cloned the Backstage repository, you should run the following
commands once to set things up for development:

```bash
$ yarn install  # fetch dependency packages - may take a while

$ yarn tsc      # does a first run of type generation and checks
```

## Serving the Example App

Open a terminal window and start the web app by using the following command from
the project root. Make sure you have run the above mentioned commands first.

```bash
$ yarn dev
```

This is going to start two things, the frontend (:3000) and the backend (:7000).

This should open a local instance of Backstage in your browser, otherwise open
one of the URLs printed in the terminal.

By default, Backstage will start on port 3000, however you can override this by
setting an environment variable `PORT` on your local machine. e.g.
`export PORT=8080` then running `yarn start`. Or `PORT=8080 yarn start`.

Once successfully started, you should see the following message in your terminal
window:

```sh
$ concurrently "yarn start" "yarn start-backend"
$ yarn workspace example-app start
$ yarn workspace example-backend start
$ backstage-cli app:serve
$ backstage-cli backend:dev
[0] Loaded config from app-config.yaml
[1] Build succeeded
[0] ℹ ｢wds｣: Project is running at http://localhost:3000/
[0] ℹ ｢wds｣: webpack output is served from /
[0] ℹ ｢wds｣: Content not from webpack is served from $BACKSTAGE_DIR/packages/app/public
[0] ℹ ｢wds｣: 404s will fallback to /index.html
[0] ℹ ｢wdm｣: wait until bundle finished: /
[1] 2021-02-12T20:58:17.614Z backstage info Loaded config from app-config.yaml
```

You'll see how you get both logs for the frontend `webpack-dev-server` which
serves the react app ([0]) and the backend ([1]);

Visit http://localhost:3000 and you should see the bleeding edge of Backstage
ready for contributions!

## Editor

The Backstage development environment does not require any specific editor, but
it is intended to be used with one that has built-in linting and type-checking.
The development server does not include any checks by default, but they can be
enabled using the `--check` flag. Note that using the flag may consume more
system resources and slow things down.

## Package Scripts

There are many commands to be found in the root
[package.json](https://github.com/backstage/backstage/blob/master/package.json),
here are some useful ones:

```python
yarn start # Start serving the example app, use --check to include type checks and linting

yarn storybook # Start local storybook, useful for working on components in @backstage/core-components

yarn workspace @backstage/plugin-welcome start # Serve welcome plugin only, also supports --check

yarn tsc # Run typecheck, use --watch for watch mode
yarn tsc:full # Run full type checking, for example without skipLibCheck, use in CI

yarn build # Build published versions of packages, depends on tsc

yarn lint # lint packages that have changed since later commit on origin/master
yarn lint:all # lint all packages
yarn lint:type-deps # verify that @types/* dependencies are placed correctly in packages

yarn test # test packages that have changed since later commit on origin/master
yarn test:all # test all packages

yarn clean # Remove all output folders and @backstage/cli cache

yarn diff # Make sure all plugins are up to date with the latest plugin template

yarn create-plugin # Create a new plugin
```

> See
> [package.json](https://github.com/backstage/backstage/blob/master/package.json)
> for other yarn commands/options.

## Local configuration

Backstage allows you to specify the configuration used while running the
application on your computer. Local configuration is read from
`app-config.local.yaml`. This file is ignored by Git, which means that you can
safely use it to reference secrets like GitHub tokens without worrying about
these secrets, inadvertently ending up in the Git repository. You do not need to
copy everything from the default config to the local config.
`app-config.local.yaml` will be merged with `app-config.yaml` and overwrite the
default app configs.

> NOTE: If you want to add your own configuration values to access in the
> frontend you also need to mark those values as visible using configuration
> schema, either in the app or in your own plugin. For more information, see
> [Defining Configuration](../conf/defining.md).

You can learn more about the local configuration in
[Static Configuration in Backstage](../conf/) section.
