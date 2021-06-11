---
id: commands
title: Commands
description: Descriptions of all commands available in the CLI.
---

This page lists all commands provided by the Backstage CLI, what they're for,
and where to use them.

The documentation for each command begins with specifying its scope, this
indicates where the command should be used by selecting from the following list:

- `app` - A frontend app package, such as `packages/app`.
- `backend` - A backend package, such as `packages/backend`.
- `frontend-plugin` - A frontend plugin package.
- `backend-plugin` - A backend plugin package.
- `root` - The monorepo root.
- `any` - Any kind of package, but not the repo root.

## help

This command displays a help summary or detailed help screens for each command.
Below is a cleaned up output of `yarn backstage-cli --help`.

```text
app:build                Build an app for a production release
app:serve                Serve an app for local development

backend:build            Build a backend plugin
backend:bundle           Bundle the backend into a deployment archive
backend:build-image      Bundles the package into a docker image
backend:dev              Start local development server with HMR for the backend

plugin:build             Build a plugin
plugin:diff              Diff an existing plugin with the creation template
plugin:serve             Serves the dev/ folder of a plugin

build                    Build a package for publishing
build-workspace          Builds a temporary dist workspace from the provided packages
lint                     Lint a package
test                     Run tests, forwarding args to Jest, defaulting to watch mode
clean                    Delete cache directories

create-plugin            Creates a new plugin in the current repository
remove-plugin            Removes plugin in the current repository

config:docs              Browse the configuration reference documentation
config:print             Print the app configuration for the current package
config:check             Validate that the given configuration loads and matches schema
config:schema            Dump the app configuration schema

versions:bump            Bump Backstage packages to the latest versions
versions:check           Check Backstage package versioning

prepack                  Prepares a package for packaging before publishing
postpack                 Restores the changes made by the prepack command

create-github-app        Create new GitHub App in your organization (experimental)

help [command]           display help for command
```

## app:build

Scope: `app`

Builds a bundle of static content from the app, which can then be served via any
static web server such as `nginx`, or via the
[`app-backend`](https://www.npmjs.com/package/@backstage/plugin-app-backend)
plugin directly from a Backstage backend instance.

The command also reads and injects static configuration into the bundle. It is
important to note that when deploying using your own static content hosting
solution, this will be the final configuration used in the frontend unless you
for example hook in configuration loading from the backend. When using the
`nginx` based Dockerfile in this repo along with its included run script,
`APP_CONFIG_` environment variables will be injected into the frontend, and when
serving using the `app-backend` plugin, the configuration is completely injected
from the backend and the configuration at the time of calling this command will
not be used.

Note that even when injecting configuration at runtime, it is not possible to
change the base path of the app. For example, if you at build time have
`app.baseUrl` set to `http://dev-app.com/my-app`, you can change that to
`https://prod-app.com/my-app`, but not to `https://prod-app.com`, as that would
change the path.

During the build, the following variables are set:

```java
process.env.NODE_ENV = 'production';
process.env.BUILD_INFO = {
  cliVersion: '0.4.0', // The version of the CLI package
  gitVersion: 'v0.4.0-86-ge54815618', // output of `git describe --always`
  packageVersion: '1.0.5', // The version of the app package itself
  timestamp: 1678900000000, // Date.now() when the build started
  commit: 'e548156182a973ed4b459e18533afc22c85ffff8', // output of `git rev-parse HEAD`
};
```

Some CI environments do not properly report correct resource limits, potentially
leading to errors such as `ENOMEM` during compilation. If you run into this
issue you can limit the parallelization of the build process by setting the
environment variable `BACKSTAGE_CLI_BUILD_PARALLEL`, which is forwarded to the
[`terser-webpack-plugin`](https://github.com/webpack-contrib/terser-webpack-plugin#parallel).
You can set it to `false` or `1` to completely disable parallelization, but
usually a low value such as `2` is enough.

```text
Usage: backstage-cli app:build

Options:
  --stats          Write bundle stats to output directory
  --lax            Do not require environment variables to be set
  --config &lt;path&gt;  Config files to load instead of app-config.yaml (default: [])
  -h, --help       display help for command
```

## app:serve

Scope: `app`

Serve an app for local development. This starts up a local development server,
using a bundling configuration that is quite similar to that of the `app:build`
command, but with development features such as React Hot Module Replacement,
faster sourcemaps, no minification, etc.

The static configuration is injected into the frontend, but it does not support
watching, meaning that changes in for example `app-config.yaml` are not
reflected until the serve process is restarted.

During the build, the following variables are set:

```java
process.env.NODE_ENV = 'development';
process.env.BUILD_INFO = { /* See app:build */ };
```

The server listening configuration is controlled through the static
configuration. The `app.baseUrl` determines the listening host and port, as well
as whether HTTPS is used or not. It is also possible to override the listening
host and port if needed by setting `app.listen.host` and `app.listen.port`.

```text
Usage: backstage-cli app:serve [options]

Options:
  --check          Enable type checking and linting
  --config &lt;path&gt;  Config files to load instead of app-config.yaml (default: [])
  -h, --help       display help for command
```

## backend:build

Scope: `backend-plugin`

This builds a backend package for publishing and use in production. The build
output is written to `dist/`. Be sure to list any additional file that the
package depends on at runtime in the `"files"` field inside `package.json`, a
common example being the `migrations` directory.

```text
Usage: backstage-cli backend:build [options]

Options:
  -h, --help  display help for command
```

## backend:bundle

Scope: `backend`

Bundle the backend and all of its local dependencies into a deployment archive.
The archive is written to `dist/bundle.tar.gz`, and contains the packaged
version of all dependencies of the target package, along with the target package
itself. The layout of the packages in the archive is the same as the directory
layout in the target monorepo, and the bundle also contains the root
`package.json` and `yarn.lock`.

To use the bundle, extract it into a target directory, run
`yarn install --production`, and then start the target backend package using for
example `node package/backend`.

The `dist/bundle.tar.gz` is accompanied by a `dist/skeleton.tar.gz`, which has
the same layout, but only contains `package.json` files and `yarn.lock`. This
can be used to run a `yarn install` in environments that will benefit from the
caching that this enables, such as Docker image builds. To use the skeleton
archive, simply extract it first, run install, and then extract the main bundle.

The following is an example of a `Dockerfile` that can be used to package the
output of `backstage-cli backend:bundle` into an image:

```Dockerfile
FROM node:14-buster-slim
WORKDIR /app

COPY yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"

COPY packages/backend/dist/bundle.tar.gz app-config.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

CMD ["node", "packages/backend"]
```

```text
Usage: backstage-cli backend:bundle [options]

Bundle the backend into a deployment archive

Options:
  --build-dependencies  Build all local package dependencies before bundling the backend
  -h, --help            display help for command
```

## backend:build-image

Scope: `backend`

Builds a Docker image of the backend package, forwarding all unknown options to
`docker image build`. For example:

```bash
yarn backstage-cli backend:build-image --build --tag my-backend-image
```

The image is built using the backend package along with all of its local package
dependencies. It expects to find a `Dockerfile` at the root of the backend
package, which will be used during the build.

The Dockerfile is **NOT** executed within the package or repo itself. Because
the packages in the repo itself are configured for development instead of
production use, the final Docker build happens in a separate temporary
directory, to which the backend package and dependencies have been copied. Only
files listed within the `"files"` field within each package's `package.json` are
copied over, along with the root `package.json`, `yarn.lock`, and any
`app-config.*.yaml` files.

During the build a `skeleton.tar` file is created and put at the repo root. This
file contains the `package.json` of each included package, which together with
the root `package.json` and `yarn.lock` can be used to run a cached
`yarn install` before the full production builds of all the packages are copied
over, providing a significant speedup if Docker build layer caching available.

This command is experimental and we hope to be able to replace it with one that
is less integrated directly with Docker, and also supports multi-stage Docker
builds. It is possible to replicate most of what this command does by manually
building each package, and then use the `build-workspace` to create the
temporary workspace, and finally copy over any additional files to the workspace
and execute the Docker build within it.

```text
Usage: backstage-cli backend:build-image [options]

Options:
  --build                 Build packages before packing them into the image
  --backstage-cli-help    display help for command
```

## backend:dev

Scope: `backend`, `backend-plugin`

Starts a backend package in development mode, with watch mode enabled for all
local dependencies.

```text
Usage: backstage-cli backend:dev [options]

Options:
  --check          Enable type checking and linting
  --inspect        Enable debugger
  --config &lt;path&gt;  Config files to load instead of app-config.yaml (default: [])
  -h, --help       display help for command
```

## create-plugin

Scope: `root`

Creates a new plugin within the repository. This command is typically wrapped up
in the root `package.json` to be executed with `yarn create-plugin`, using
options that are appropriate for the organization that owns the app repo. A
recommended scope for internal packages is `@internal`.

```text
Usage: backstage-cli create-plugin [options]

Options:
  --backend             Create plugin with the backend dependencies as default
  --scope &lt;scope&gt;       npm scope
  --npm-registry &lt;URL&gt;  npm registry URL
  --no-private          Public npm package
  -h, --help            display help for command
```

## remove-plugin

Scope: `root`

A utility to remove a plugin from a repo, essentially undoing everything that
was done by `create-plugin`.

This is primarily intended as a utility for manual tests and end to end testing
scripts.

```text
Usage: backstage-cli remove-plugin [options]

Options:
  -h, --help  display help for command
```

## plugin:build

Scope: `frontend-plugin`

Build a frontend plugin for publishing to a package registry. There is no need
to run this command during development or even in CI unless the package is being
published. The `app:bundle` command does not use the output for this command
when bundling local package dependencies.

The output is written to a `dist/` folder. It also outputs type declarations for
the plugin, and therefore requires `yarn tsc` to have been run first. The input
type declarations are expected to be found within `dist-types/` at the root of
the monorepo.

```text
Usage: backstage-cli plugin:build [options]

Options:
  -h, --help  display help for command
```

## plugin:serve

Scope: `frontend-plugin`

Serves a frontend plugin by itself for isolated development. The serve task
itself is essentially identical to `app:serve`, but the entrypoint is instead
set to the `dev/` folder within the plugin.

The `dev/` folder typically contains a small wrapper script that hooks up any
necessary mock APIs or other things that are needed for the plugin to function.
The `@backstage/dev-utils` package provides utilities to that end.

```text
Usage: backstage-cli plugin:serve [options]

Options:
  --check          Enable type checking and linting
  --config &lt;path&gt;  Config files to load instead of app-config.yaml (default: [])
  -h, --help       display help for command
```

## plugin:diff

Scope: `frontend-plugin`

Compares a frontend plugin to the `create-plugin` template, making sure that it
hasn't diverged from the template and recommending updates when it has. A good
practice is to run this command after updating the version of the CLI in a
project.

```text
Usage: backstage-cli plugin:diff [options]

Options:
  --check     Fail if changes are required
  --yes       Apply all changes
  -h, --help  display help for command
```

## build

Scope: `any`

Build a single package for publishing, just like the `plugin:build` and
`backend:build` commands. This command is intended for standalone packages that
aren't plugins, and for example support building of isomorphic packages for
usage in both the frontend and backend.

For frontend packages you'll want to include `esm` output, and for backend
packages `cjs`. Whether to include `types` depends on if you need type
declarations for the package, and also requires `yarn tsc` to have been run
first.

```text
Usage: backstage-cli build [options]

Options:
  --outputs &lt;formats&gt;  List of formats to output [types,cjs,esm]
  -h, --help           display help for command
```

## lint

Scope: `any`

Lint a package. In addition to the default `eslint` behavior, this command will
include TypeScript files, treat warnings as errors, and default to linting the
entire directory if no specific files are listed.

```text
Usage: backstage-cli lint [options]

Options:
  --format &lt;format&gt;  Lint report output format (default: "eslint-formatter-friendly")
  --fix              Attempt to automatically fix violations
  -h, --help         display help for command
```

## test

Scope: `any`

Run tests, forwarding all unknown options to Jest, and defaulting to watch mode.
When executing the tests, `process.env.NODE_ENV` will be set to `"test"`.

This command uses a default Jest configuration that is included in the CLI,
which is set up with similar goals for speed, scale, and working within a
monorepo. The configuration sets the `src` as the root directory, enforces the
`.test.` infix for tests, and uses `src/setupTests.ts` as the test setup
location.

If needed, the configuration can be extended using a `"jest"` field in
`package.json`, both within the target package and the monorepo root, with
configuration in the target package taking precedence. Refer to the
[Jest configuration documentation](https://jestjs.io/docs/en/configuration) for
a full list of configuration options.

In addition to the Jest configuration there's an optional `transformModules`
option, which is an array of module names to include in transformations.
Normally modules inside `node_modules` are not transformed, but there are cases
were published packages are not transpiled far enough to be usable by Jest, in
which case you need to enable transform of them.

Another way to override the Jest configuration is to place a `jest.config.js` or
`jest.config.ts` file in the package root. As opposed to the `package.json` way
of overriding config, this completely removes the base config, and so you need
to set it up from scratch.

```text
Usage: backstage-cli test [options]

Options:
  --backstage-cli-help    display help for command
```

## config:docs

Scope: `root`

This commands opens up the reference documentation of your apps local
configuration schema in the browser. This is useful to get an overview of what
configuration values are available to use, a description of what they do and
their format, and where they get sent.

```text
Usage: backstage-cli config:docs [options]

Browse the configuration reference documentation

Options:
  --package <name>  Only include the schema that applies to the given package
  -h, --help        display help for command
```

## config:print

Scope: `root`

Print the static configuration, defaulting to reading `app-config.yaml` in the
repo root, using schema collected from all local packages in the repo.

For example, to validate that a given configuration value is visible in the
frontend when building the `my-app` package, you can use the following:

```bash
yarn backstage-cli config:print --frontend --package my-app
```

```text
Usage: backstage-cli config:print [options]

Options:
  --package &lt;name&gt;   Only load config schema that applies to the given package
  --lax              Do not require environment variables to be set
  --frontend         Print only the frontend configuration
  --with-secrets     Include secrets in the printed configuration
  --format &lt;format&gt;  Format to print the configuration in, either json or yaml [yaml]
  --config &lt;path&gt;    Config files to load instead of app-config.yaml (default: [])
  -h, --help         display help for command
```

## config:check

Scope: `root`

Validate that static configuration loads and matches schema, defaulting to
reading `app-config.yaml` in the repo root and using schema collected from all
local packages in the repo.

```text
Usage: backstage-cli config:check [options]

Options:
  --package &lt;name&gt;  Only load config schema that applies to the given package
  --lax                   Do not require environment variables to be set
  --config &lt;path&gt;   Config files to load instead of app-config.yaml (default: [])
  -h, --help        display help for command
```

## config:schema

Scope: `root`

Dump the configuration schema that was collected from all local packages in the
repo.

Note: when run by `yarn`, supply the yarn option `--silent` if you are using the
output in a command line pipe to avoid non schema output in the pipeline.

```text
Usage: backstage-cli config:schema [options]

Print configuration schema

Options:
  --package &lt;name&gt;   Only output config schema that applies to the given package
  --format &lt;format&gt;  Format to print the schema in, either json or yaml [yaml]
  -h, --help         display help for command
```

## versions:bump

Scope: `root`

Bump all `@backstage` packages to the latest versions. This checks for updates
in the package registry, and will update entries both in `yarn.lock` and
`package.json` files when necessary.

```text
Usage: backstage-cli versions:bump [options]

Options:
  -h, --help  display help for command
```

## versions:check

Scope: `root`

Validate `@backstage` dependencies within the repo, making sure that there are
no duplicates of packages that might lead to breakages. For example,
`@backstage/core` must not be loaded in twice, so having two different versions
of it installed will cause this command to exit with an error.

By supplying the `--fix` flag the command will attempt to fix any conflict that
can be resolved by editing `yarn.lock`, but will not attempt to search for
remote updates or modify any `package.json` files.

```text
Usage: backstage-cli versions:check [options]

Options:
  --fix       Fix any auto-fixable versioning problems
  -h, --help  display help for command
```

## prepack

Scope: `any`

This command should be added as `scripts.prepack` in all packages. It enables
packaging- and publish-time overrides for fields inside `packages.json`.

The checked in version of all packages in a Backstage monorepo are tailored for
local development, and as such `main` and similar fields inside `package.json`
point to development source, i.e. `src/index.ts`. Using this when publishing
would lead to a broken package, since `src/` is not included in the published
package and we instead need to point to files in the `dist/` directory. This
command allows for those fields to be rewritten when needed, and does so by
copying all fields within `publishConfig` to the top-level of each
`package.json`, skipping `access`, `registry`, and `tag`.

The need for this command may be removed in the future, as this exact method of
overriding fields for publishing is already supported by some package managers.

```text
Usage: backstage-cli prepack [options]

Options:
  -h, --help  display help for command
```

## postpack

Scope: `any`

This should be added as `scripts.postpack` in all packages. It restores
`package.json` to what it looked like before calling the `prepack` command.

```text
Usage: backstage-cli postpack [options]

Options:
  -h, --help  display help for command
```

## clean

Scope: `any`

Remove cache and output directories.

```text
Usage: backstage-cli clean [options]

Options:
  -h, --help  display help for command
```

## build-workspace

Scope: `any`, `root`

Builds a mirror of the workspace using the packaged production version of each
package. This essentially calls `yarn pack` in each included package and unpacks
the resulting archive in the target `workspace-dir`.

```text
Usage: backstage-cli build-workspace [options] &lt;workspace-dir&gt;
```

## create-github-app

Scope: `root`

Creates a GitHub App in your GitHub organization. This is an alternative to
token-based [GitHub integration](../integrations/github/locations.md). See
[GitHub Apps for Backstage Authentication](../plugins/github-apps.md).

Launches a browser to create the App through GitHub and saves the result as a
YAML file that can be referenced in the GitHub integration configuration.

```text
Usage: backstage-cli create-github-app &lt;github-org&gt;
```
