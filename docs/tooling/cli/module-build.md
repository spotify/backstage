---
id: module-build
title: Build Module
description: CLI commands for building, starting, and packaging Backstage packages.
---

The build module (`@backstage/cli-module-build`) handles building, starting,
and packaging Backstage packages, both individually and across the repo.

For details on the build system itself, see the
[Build System](./02-build-system.md) documentation.

## repo start

Start a set of packages in the project for local development. If no explicit
packages are listed via arguments or options, packages will instead be selected
based on their [package role](./02-build-system.md#package-roles). If a single
set of frontend and/or backend packages are found, they will be started. If
there are multiple matches the directories `packages/app` and
`packages/backend` will be preferred. If no matches are found the command will
fall back to expecting a single plugin frontend and/or backend package to start
instead.

Any `--config` options in the `start` script in `package.json` of the selected
packages will be picked up and used, unless a `--config` option is provided to
this command, in which case it will be used instead.

Any `--require` option in the `start` script in `package.json` of the selected
backend package will be picked up and used.

```text
Usage: backstage-cli repo start [options] [packageNameOrPath...]

Starts packages in the repo for local development

Arguments:
  packageNameOrPath     Run the specified packages instead of the defaults.

Options:
  --plugin <pluginId>   Start the dev entry-point for any matching plugin package in the repo (default: [])
  --config <path>       Config files to load instead of app-config.yaml (default: [])
  --inspect [host]      Enable debugger in Node.js environments. Applies to backend package only
  --inspect-brk [host]  Enable debugger in Node.js environments, breaking before code starts. Applies to backend package only
  --require <path>      Add a --require argument to the node process. Applies to backend package only
  --link <path>         Link an external workspace for module resolution
```

## repo build

Builds all packages in the project, excluding bundled packages by default, that
is, ones with the role `'frontend'` or `'backend'`.

```text
Usage: backstage-cli repo build [options]

Build packages in the project, excluding bundled app and backend packages.

Options:
  --all          Build all packages, including bundled app and backend packages.
  --since <ref>  Only build packages and their dev dependents that changed since the specified ref
```

## repo clean

Remove cache and output directories across all packages in the project.

```text
Usage: backstage-cli repo clean [options]

Delete cache and output directories
```

## package start

Starts the package for local development. See the frontend and backend
development parts in the build system
[bundling](./02-build-system.md#bundling) section for more details.

```text
Usage: backstage-cli package start [options]

Start a package for local development

Options:
  --config <path>     Config files to load instead of app-config.yaml (default: [])
  --role <name>       Run the command with an explicit package role
  --check             Enable type checking and linting if available
  --require <path>    Add a --require argument to the node process
  --link <path>       Link an external workspace for module resolution
  --entrypoint <path> Entry directory path (uses index file) or entry file path (without extension). Defaults to "dev"
  --inspect [host]    Enable the Node.js inspector, optionally at a specific host:port
  --inspect-brk [host] Enable the Node.js inspector and break before user code starts
```

## package build

Build an individual package based on its role. See the build system
[building](./02-build-system.md#building) and
[bundling](./02-build-system.md#bundling) sections for more details.

```text
Usage: backstage-cli package build [options]

Build a package for production deployment or publishing

Options:
  --role <name>              Run the command with an explicit package role
  --minify                   Minify the generated code. Does not apply to app package (app is minified by default).
  --skip-build-dependencies  Skip the automatic building of local dependencies. Applies to backend packages only.
  --stats                    If bundle stats are available, write them to the output directory. Applies to app packages only.
  --config <path>            Config files to load instead of app-config.yaml. Applies to app packages only. (default: [])
  --module-federation        Build a package as a module federation remote. Applies to frontend plugin packages only.
```

## package bundle

:::caution[Experimental]
This command is experimental and may receive breaking changes in future releases
without a deprecation period. It is hidden from the main `--help` output.
:::

Bundle a plugin for dynamic loading. This creates a self-contained plugin
package that can be deployed independently and loaded dynamically by a Backstage
application. Supports both backend and frontend plugins.

Unlike regular builds, the bundle command:

- Creates a fully self-contained plugin deliverable

- Produces module federation assets (frontend) or includes plugin dependencies
  in the plugin's private `node_modules`, building and packing (with
  `yarn pack`) the local `workspace:^` dependencies first (backend).
- Generates a config schema from plugin-related packages only.
- Validates that the plugin exports valid dynamic loading entry points (backend
  only)

### Usage

```bash
# Bundle the current package (output: ./bundle/)
yarn backstage-cli package bundle

# Bundle to a specific directory (output: ../dynamic-plugins/<mangled-package-name>/)
yarn backstage-cli package bundle --output-destination ../dynamic-plugins

# Override the bundle subdirectory name
yarn backstage-cli package bundle --output-name my-plugin-bundle

# Clean output before bundling
yarn backstage-cli package bundle --clean

# Skip building for the plugin and its local dependencies
yarn backstage-cli package bundle --no-build

# Skip dependency installation and entrypoint validation
yarn backstage-cli package bundle --no-install

# Stream detailed output from build, pack, and install steps
yarn backstage-cli package bundle --verbose

# Use a pre-built dist workspace for batch bundling.
# First, create the workspace with:
#   backstage-cli build-workspace <output-dir> [packages...] --alwaysPack
# Then pass <output-dir> as --pre-packed-dir:
yarn backstage-cli package bundle --pre-packed-dir ../dist-workspace
```

### Options

```text
Usage: backstage-cli package bundle [options]

Bundle a plugin for dynamic loading

Options:
  --output-destination <dir>  Directory in which the bundle subdirectory is created.
                              Defaults to the current package directory.
  --output-name <name>        Name of the bundle subdirectory. Defaults to "bundle" when
                              output stays in the package directory, or to the mangled
                              package name (e.g. myorg-plugin-foo) when
                              --output-destination is specified.
  --clean                     Clean the output directory before bundling
  --no-build                  Skip building packages (assumes they are already built)
  --no-install                Skip dependency installation and entrypoint validation.
  --verbose                   Stream detailed output from internal steps (build, pack,
                              install) to the console. Without this flag, output is
                              captured to per-step log files and only shown on error.
  --pre-packed-dir <dir>      Path to a pre-built dist workspace (from
                              build-workspace --alwaysPack). Skips local dependency
                              packing and uses pre-packed packages directly. For frontend
                              plugins, this also enables yarn.lock generation for SBOM.
```

### Output contract

The bundle output is a directory that can be deployed as a standalone unit.
Consumers of the bundle (such as `@backstage/backend-dynamic-feature-service`
or `@backstage/frontend-dynamic-feature-loader`) can rely on the following
guarantees:

**All bundles:**

- A `package.json` at the bundle root with entry points configured for dynamic
  loading. The `backstage.role` and `files` fields are preserved from the source
  package.
- A `dist/` directory containing the built plugin code.
- A `dist/.config-schema.json` file (when any config schemas apply) containing
  gathered schemas from the plugin, its local workspace dependencies, and
  third-party dependencies. Schemas from unrelated Backstage packages are
  excluded.
- No `scripts` or `devDependencies` in `package.json`.

**Backend plugins** (`backend-plugin`, `backend-plugin-module`):

- A `node_modules/` directory with all production dependencies (including local
  workspace dependencies), pinned to their exact versions from the source
  lockfile.
- `bundleDependencies` is set to `true` in `package.json`.

**Frontend plugins** (`frontend-plugin`, `frontend-plugin-module`):

- `main` points to `dist/remoteEntry.js` (the Module Federation remote entry).
- `types` points to `dist/@mf-types/index.d.ts` when type declarations are
  available.
- No embedded `node_modules/` directory.

### Environment variables

The bundle command supports the same environment variables as the Backstage yarn
plugin for resolving `backstage:^` version specifiers:

- `BACKSTAGE_MANIFEST_FILE`: Path to a local manifest file (for offline usage)
- `BACKSTAGE_VERSIONS_BASE_URL`: Custom base URL for fetching release manifests

### Supported package roles

The bundle command supports packages with the following roles:

- `backend-plugin`
- `backend-plugin-module`
- `frontend-plugin`
- `frontend-plugin-module`

## package clean

Remove cache directories.

```text
Usage: backstage-cli package clean [options]

Delete cache directories
```

## package prepack

This command should be added as `scripts.prepack` in all packages. It enables
packaging- and publish-time overrides for fields inside `package.json`. For
more details, see the build system
[publishing](./02-build-system.md#publishing) section.

```text
Usage: backstage-cli package prepack [options]

Prepares a package for packaging before publishing
```

## package postpack

This should be added as `scripts.postpack` in all packages. It restores
`package.json` to what it looked like before calling the `prepack` command.

```text
Usage: backstage-cli package postpack [options]

Restores the changes made by the prepack command
```

## build-workspace

Builds a mirror of the workspace using the packaged production version of each
package. This essentially calls the pack command of the package manager, such as
`yarn pack`, in each included package and unpacks the resulting archive in the
target `workspace-dir`.

```text
Usage: backstage-cli build-workspace [options] <workspace-dir> [packages...]

Options:
  --alwaysPack  Force workspace output to be a result of running the pack
                command of the package manager on each package (warning: very
                slow)
```

When `--alwaysPack` is used, the output directory can be passed to
`backstage-cli package bundle --pre-packed-dir` to speed up batch bundling of
multiple plugins from the same monorepo.
