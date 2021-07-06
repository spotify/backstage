# @backstage/cli

## 0.7.3

### Patch Changes

- a93e60fdc: Updated dependencies
- 55f49fcc7: Update dependencies
- ab5cc376f: Use new `isChildPath` export from `@backstage/cli-common`
- Updated dependencies
  - @backstage/cli-common@0.1.2

## 0.7.2

### Patch Changes

- 953a7e66f: updated plugin template to generate path equals plugin id for the root page
- 04248b8f9: chore: bump `msw` dependency in `create-plugin`
- e3d31b381: Make the `create-github-app` command disable webhooks by default.
- 8f100db75: chore: bump `@typescript-eslint/eslint-plugin` from 4.26.0 to 4.27.0
- 95e572305: chore: bump `del` from 5.1.0 to 6.0.0
- ece2b5dd1: chore: bump `@spotify/eslint-config-typescript` from 9.0.0 to 10.0.0
- 0ec31e596: chore: bump `@rollup/plugin-node-resolve` from 11.2.1 to 13.0.0
- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.

## 0.7.1

### Patch Changes

- 3108ff7bf: Make `yarn dev` in newly created backend plugins respect the `PLUGIN_PORT` environment variable.

  You can achieve the same in your created backend plugins by making sure to properly call the port and CORS methods on your service builder. Typically in a file named `src/service/standaloneServer.ts` inside your backend plugin package, replace the following:

  ```ts
  const service = createServiceBuilder(module)
    .enableCors({ origin: 'http://localhost:3000' })
    .addRouter('/my-plugin', router);
  ```

  With something like the following:

  ```ts
  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/my-plugin', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }
  ```

- Updated dependencies
  - @backstage/config-loader@0.6.4

## 0.7.0

### Minor Changes

- 9cd3c533c: Switch from `ts-jest` to `@sucrase/jest-plugin`, improving performance and aligning transpilation with bundling.

  In order to switch back to `ts-jest`, install `ts-jest@^26.4.3` as a dependency in the root of your repo and add the following in the root `package.json`:

  ```json
  "jest": {
    "globals": {
      "ts-jest": {
        "isolatedModules": true
      }
    },
    "transform": {
      "\\.esm\\.js$": "@backstage/cli/config/jestEsmTransform.js",
      "\\.(js|jsx|ts|tsx)$": "ts-jest",
      "\\.(bmp|gif|jpg|jpeg|png|frag|xml|svg)$": "@backstage/cli/config/jestFileTransform.js",
      "\\.(yaml)$": "yaml-jest"
    }
  }
  ```

  Note that this will override the default jest transforms included with the `@backstage/cli`.

  It is possible that some test code needs a small migration as a result of this change, which stems from a difference in how `sucrase` and `ts-jest` transform module re-exports.

  Consider the following code:

  ```ts
  import * as utils from './utils';

  jest.spyOn(utils, 'myUtility').mockReturnValue(3);
  ```

  If the `./utils` import for example refers to an index file that in turn re-exports from `./utils/myUtility`, you would have to change the code to the following to work around the fact that the exported object from `./utils` ends up not having configurable properties, thus breaking `jest.spyOn`.

  ```ts
  import * as utils from './utils/myUtility';

  jest.spyOn(utils, 'myUtility').mockReturnValue(3);
  ```

### Patch Changes

- 7f7443308: Updated dependencies
- 21e8ebef5: Fix error message formatting in the packaging process.

  error.errors can be undefined which will lead to a TypeError, swallowing the actual error message in the process.

  For instance, if you break your tsconfig.json with invalid syntax, backstage-cli will not be able to build anything and it will be very hard to find out why because the underlying error message is hidden behind a TypeError.

## 0.6.14

### Patch Changes

- ee4eb5b40: Adjust the Webpack `devtool` module filename template to correctly resolve via the source maps to the source files.
- 84160313e: Mark the `create-github-app` command as ready for use and reveal it in the command list.
- 7e7c71417: Exclude core packages from package dependency diff.
- e7c5e4b30: Update installation instructions in README.
- 2305ab8fc: chore(deps): bump `@spotify/eslint-config-react` from 9.0.0 to 10.0.0
- 054bcd029: Deprecated the `backend:build-image` command, pointing to the newer `backend:bundle` command.

## 0.6.13

### Patch Changes

- 1cd0cacd9: Add support for transforming yaml files in jest with 'yaml-jest'
- 7a7da5146: Bumped `eslint-config-prettier` to `8.x`.
- 3a181cff1: Bump webpack-node-externals from `2.5.2` to `3.0.0`.
- Updated dependencies [2cf98d279]
- Updated dependencies [438a512eb]
  - @backstage/config-loader@0.6.3

## 0.6.12

### Patch Changes

- 2bfec55a6: Update `fork-ts-checker-webpack-plugin`
- Updated dependencies [290405276]
  - @backstage/config-loader@0.6.2

## 0.6.11

### Patch Changes

- 2cd70e164: Add context for versions:bump on what version it was bumped to. Updated tests for the same.
- 3be844496: chore: bump `ts-node` versions to 9.1.1
- e3fc89df6: update plugins created to use react-use 17.2.4

## 0.6.10

### Patch Changes

- f65adcde7: Fix some transitive dependency warnings in yarn
- fc79a6dd3: Added lax option to backstage-cli app:build command
- d8b81fd28: Bump `json-schema` dependency from `0.2.5` to `0.3.0`.
- Updated dependencies [d8b81fd28]
  - @backstage/config-loader@0.6.1
  - @backstage/config@0.1.5

## 0.6.9

### Patch Changes

- 4e5c94249: Add `config:docs` command that opens up reference documentation for the local configuration schema in a browser.
- 1373f4f12: No longer add newly created plugins to `plugins.ts` in the app, as it is no longer needed.
- 479b29124: Added support for Datadog rum events

## 0.6.8

### Patch Changes

- 60ce64aa2: Disable hot reloading in CI environments.

## 0.6.7

### Patch Changes

- Updated dependencies [82c66b8cd]
  - @backstage/config-loader@0.6.0

## 0.6.6

### Patch Changes

- 598f5bcfb: Lock down the version of webpack-dev-server as it's causing some nasty bugs someplace
- 4d248725e: Make the backend plugin template use the correct latest version of `express-promise-router`

## 0.6.5

### Patch Changes

- 84972540b: Lint storybook files, i.e. `*.stories.*`, as if they were tests.
- Updated dependencies [0434853a5]
  - @backstage/config@0.1.4

## 0.6.4

### Patch Changes

- 5ab5864f6: Add support for most TypeScript 4.1 syntax.

## 0.6.3

### Patch Changes

- 507513fed: Bump `@svgr/webpack` from `5.4.x` to `5.5.x`.
- e37d2de99: Bump `@testing-library/react` in the plugin template from `^10.4.1` to `^11.2.5`. To apply this to an existing plugin, update the dependency in your `package.json`.
- 11c6208fe: Fixed an issue where the `backend:dev` command would get stuck executing the backend process multiple times, causing port conflict issues.
- d4f0a1406: New config command to export the configuration schema. When running backstage-cli with yarn, consider using `yarn --silent backstage-cli config:schema` to get a clean output on `stdout`.
- b93538acc: Fix for type declaration input being required for build even if types aren't being built.
- 8871e7523: Bump `ts-loader` dependency range from `^7.0.4` to `^8.0.17`.

## 0.6.2

### Patch Changes

- e780e119c: Add missing `file-loader` dependency which could cause issues with loading images and other assets.
- 6266ddd11: The `yarn backstage-cli app:diff` has been broken since a couple of months. The command to perform updates `yarn backstage-cli versions:bump` prints change logs which seems to be a good replacement for this command.
- Updated dependencies [a1f5e6545]
  - @backstage/config@0.1.3

## 0.6.1

### Patch Changes

- 257a753ff: Updated transform of `.esm.js` files to be able to handle dynamic imports.
- 9337f509d: Tweak error message in lockfile parsing to include more information.
- 532bc0ec0: Upgrading to lerna@4.0.0.

## 0.6.0

### Minor Changes

- 19fe61c27: We have updated the default `eslint` rules in the `@backstage/cli` package.

  ```diff
  -'@typescript-eslint/no-shadow': 'off',
  -'@typescript-eslint/no-redeclare': 'off',
  +'no-shadow': 'off',
  +'no-redeclare': 'off',
  +'@typescript-eslint/no-shadow': 'error',
  +'@typescript-eslint/no-redeclare': 'error',
  ```

  The rules are documented [here](https://eslint.org/docs/rules/no-shadow) and [here](https://eslint.org/docs/rules/no-redeclare).

  This involved a large number of small changes to the code base. When you compile your own code using the CLI, you may also be
  affected. We consider these rules important, and the primary recommendation is to try to update your code according to the
  documentation above. But those that prefer to not enable the rules, or need time to perform the updates, may update their
  local `.eslintrc.js` file(s) in the repo root and/or in individual plugins as they see fit:

  ```js
  module.exports = {
    // ... other declarations
    rules: {
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-redeclare': 'off',
    },
  };
  ```

  Because of the nature of this change, we're unable to provide a grace period for the update :(

### Patch Changes

- 398e1f83e: Update `create-plugin` template to use the new composability API, by switching to exporting a single routable extension component.
- e9aab60c7: Fixed module resolution of external libraries during backend development. Modules used to be resolved relative to the backend entrypoint, but are now resolved relative to each individual module.
- a08c4b0b0: Add check for outdated/duplicate packages to yarn start
- Updated dependencies [062df71db]
- Updated dependencies [e9aab60c7]
  - @backstage/config-loader@0.5.1

## 0.5.0

### Minor Changes

- 12a56cdfe: We've bumped the `@eslint-typescript` packages to the latest, which now add some additional rules that might cause lint failures.
  The main one which could become an issue is the [no-use-before-define](https://eslint.org/docs/rules/no-use-before-define) rule.

  Every plugin and app has the ability to override these rules if you want to ignore them for now.

  You can reset back to the default behaviour by using the following in your own `.eslint.js`

  ```js
  rules: {
    'no-use-before-define': 'off'
  }
  ```

  Because of the nature of this change, we're unable to provide a grace period for the update :(

### Patch Changes

- ef7957be4: Add `--lax` option to `config:print` and `config:check`, which causes all environment variables to be assumed to be set.
- Updated dependencies [ef7957be4]
- Updated dependencies [ef7957be4]
- Updated dependencies [ef7957be4]
  - @backstage/config-loader@0.5.0

## 0.4.7

### Patch Changes

- b604a9d41: Append `-credentials.yaml` to credentials file generated by `backstage-cli create-github-app` and display warning about sensitive contents.

## 0.4.6

### Patch Changes

- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- 08e9893d2: Handle no npm info
- 9cf71f8bf: Added experimental `create-github-app` command.

## 0.4.5

### Patch Changes

- 37a7d26c4: Use consistent file extensions for JS output when building packages.
- 818d45e94: Fix detection of external package child directories
- 0588be01f: Add `backend:bundle` command for bundling a backend package with dependencies into a deployment archive.
- b8abdda57: Add color to output from `versions:bump` in order to make it easier to spot changes. Also highlight possible breaking changes and link to changelogs.
- Updated dependencies [ad5c56fd9]
  - @backstage/config-loader@0.4.1

## 0.4.4

### Patch Changes

- d45efbc9b: Fix typo in .app.listen.port config schema

## 0.4.3

### Patch Changes

- 19554f6d6: Added GitHub Actions for Create React App, and allow better imports of files inside a module when they're exposed using `files` in `package.json`
- 7d72f9b09: Fix for `app.listen.host` configuration not properly overriding listening host.

## 0.4.2

### Patch Changes

- c36a01b4c: Re-enable symlink resolution during bundling, and switch to using a resolve plugin for external linked packages.

## 0.4.1

### Patch Changes

- 06dbe707b: Update experimental backend bundle command to only output archives to `dist/` instead of a full workspace mirror in `dist-workspace/`.
- 011708102: Fixes a big in the bundling logic that caused `node_modules` inside local monorepo packages to be transformed.
- 61897fb2c: Fix config schema for `.app.listen`
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/config@0.1.2

## 0.4.0

### Minor Changes

- 00670a96e: sort product panels and navigation menu by greatest cost
  update tsconfig.json to use ES2020 api

### Patch Changes

- b4488ddb0: Added a type alias for PositionError = GeolocationPositionError
- 4a655c89d: Bump versions of `esbuild` and `rollup-plugin-esbuild`
- 8a16e8af8: Support `.npmrc` when building with private NPM registries
- Updated dependencies [4e7091759]
- Updated dependencies [b4488ddb0]
  - @backstage/config-loader@0.4.0

## 0.3.2

### Patch Changes

- 294295453: Only load config that applies to the target package for frontend build and serve tasks. Also added `--package <name>` flag to scope the config schema used by the `config:print` and `config:check` commands.
- f538e2c56: Make versions:bump install new versions of dependencies that were within the specified range as well as install new versions of transitive @backstage dependencies.
- 8697dea5b: Bump Rollup
- b623cc275: Narrow down the version range of rollup-plugin-esbuild to avoid breaking change in newer version

## 0.3.1

### Patch Changes

- 29a0ccab2: The CLI now detects and transforms linked packages. You can link in external packages by adding them to both the `lerna.json` and `package.json` workspace paths.
- faf311c26: New lint rule to disallow <type> assertions and promote `as` assertions. - @typescript-eslint/consistent-type-assertions
- 31d8b6979: Add experimental backend:bundle command
- 991345969: Add new `versions:check` and `versions:bump` commands to simplify version management and avoid conflicts

## 0.3.0

### Minor Changes

- 1722cb53c: Added support for loading and validating configuration schemas, as well as declaring config visibility through schemas.

  The new `loadConfigSchema` function exported by `@backstage/config-loader` allows for the collection and merging of configuration schemas from all nearby dependencies of the project.

  A configuration schema is declared using the `https://backstage.io/schema/config-v1` JSON Schema meta schema, which is based on draft07. The only difference to the draft07 schema is the custom `visibility` keyword, which is used to indicate whether the given config value should be visible in the frontend or not. The possible values are `frontend`, `backend`, and `secret`, where `backend` is the default. A visibility of `secret` has the same scope at runtime, but it will be treated with more care in certain contexts, and defining both `frontend` and `secret` for the same value in two different schemas will result in an error during schema merging.

  Packages that wish to contribute configuration schema should declare it in a root `"configSchema"` field in `package.json`. The field can either contain an inlined JSON schema, or a relative path to a schema file. Schema files can be in either `.json` or `.d.ts` format.

  TypeScript configuration schema files should export a single `Config` type, for example:

  ```ts
  export interface Config {
    app: {
      /**
       * Frontend root URL
       * @visibility frontend
       */
      baseUrl: string;
    };
  }
  ```

### Patch Changes

- 1722cb53c: Added configuration schema
- 902340451: Support specifying listen host/port for frontend
- Updated dependencies [1722cb53c]
  - @backstage/config-loader@0.3.0

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI
- 1d0aec70f: Upgrade dependency `esbuild@0.7.7`
- 72f6cda35: Adds a new `BACKSTAGE_CLI_BUILD_PARELLEL` environment variable to control
  parallelism for some build steps.

  This is useful in CI to help avoid out of memory issues when using `terser`. The
  `BACKSTAGE_CLI_BUILD_PARELLEL` environment variable can be set to
  `true | false | [integer]` to override the default behaviour. See
  [terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin#parallel)
  for more details.

- 8c2b76e45: **BREAKING CHANGE**

  The existing loading of additional config files like `app-config.development.yaml` using APP_ENV or NODE_ENV has been removed.
  Instead, the CLI and backend process now accept one or more `--config` flags to load config files.

  Without passing any flags, `app-config.yaml` and, if it exists, `app-config.local.yaml` will be loaded.
  If passing any `--config <path>` flags, only those files will be loaded, **NOT** the default `app-config.yaml` one.

  The old behaviour of for example `APP_ENV=development` can be replicated using the following flags:

  ```bash
  --config ../../app-config.yaml --config ../../app-config.development.yaml
  ```

- 8afce088a: Use APP_ENV before NODE_ENV for determining what config to load

### Patch Changes

- 3472c8be7: Add codeowners processor

  - Include ESNext.Promise in TypeScript compilation

- a3840bed2: Upgrade dependency rollup-plugin-typescript2 to ^0.27.3
- cba4e4d97: Including source maps with all packages
- 9a3b3dbf1: Fixed duplicate help output, and print help on invalid command
- 7bbeb049f: Change loadBackendConfig to return the config directly
- Updated dependencies [8c2b76e45]
- Updated dependencies [ce5512bc0]
  - @backstage/config-loader@0.2.0
