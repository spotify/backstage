# @backstage/config-loader

## 0.6.4

### Patch Changes

- f00493739: Removed workaround for breaking change in typescript 4.3 and bump `typescript-json-schema` instead. This should again allow the usage of `@items.visibility <value>` to set the visibility of array items.

## 0.6.3

### Patch Changes

- 2cf98d279: Resolve the path to app-config.yaml from the current working directory. This will allow use of `yarn link` or running the CLI in other directories and improve the experience for local backstage development.
- 438a512eb: Fixed configuration schema parsing when using TypeScript `4.3`.

## 0.6.2

### Patch Changes

- 290405276: Updated dependencies

## 0.6.1

### Patch Changes

- d8b81fd28: Bump `json-schema` dependency from `0.2.5` to `0.3.0`.
- Updated dependencies [d8b81fd28]
  - @backstage/config@0.1.5

## 0.6.0

### Minor Changes

- 82c66b8cd: Fix bug where `${...}` was not being escaped to `${...}`

  Add support for environment variable substitution in `$include`, `$file` and
  `$env` transform values.

  - This change allows for including dynamic paths, such as environment specific
    secrets by using the same environment variable substitution (`${..}`) already
    supported outside of the various include transforms.
  - If you are currently using the syntax `${...}` in your include transform values,
    you will need to escape the substitution by using `${...}` instead to maintain
    the same behavior.

## 0.5.1

### Patch Changes

- 062df71db: Bump `config-loader` to `ajv` 7, to enable v7 feature use elsewhere
- e9aab60c7: Each piece of the configuration schema is now validated upfront, in order to produce more informative errors.

## 0.5.0

### Minor Changes

- ef7957be4: Removed support for the deprecated `$data` placeholder.
- ef7957be4: Enable further processing of configuration files included using the `$include` placeholder. Meaning that for example for example `$env` includes will be processed as usual in included files.

### Patch Changes

- ef7957be4: Added support for environment variable substitutions in string configuration values using a `${VAR}` placeholder. All environment variables must be available, or the entire expression will be evaluated to `undefined`. To escape a substitution, use `${...}`, which will end up as `${...}`.

  For example:

  ```yaml
  app:
    baseUrl: https://${BASE_HOST}
  ```

## 0.4.1

### Patch Changes

- ad5c56fd9: Deprecate `$data` and replace it with `$include` which allows for any type of json value to be read from external files. In addition, `$include` can be used without a path, which causes the value at the root of the file to be loaded.

  Most usages of `$data` can be directly replaced with `$include`, except if the referenced value is not a string, in which case the value needs to be changed. For example:

  ```yaml
  # app-config.yaml
  foo:
    $data: foo.yaml#myValue # replacing with $include will turn the value into a number
    $data: bar.yaml#myValue # replacing with $include is safe

  # foo.yaml
  myValue: 0xf00

  # bar.yaml
  myValue: bar
  ```

## 0.4.0

### Minor Changes

- 4e7091759: Fix typo of "visibility" in config schema reference

  If you have defined a config element named `visiblity`, you
  will need to fix the spelling to `visibility`. For more info,
  see https://backstage.io/docs/conf/defining#visibility.

### Patch Changes

- b4488ddb0: Added a type alias for PositionError = GeolocationPositionError

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

## 0.2.0

### Minor Changes

- 8c2b76e45: **BREAKING CHANGE**

  The existing loading of additional config files like `app-config.development.yaml` using APP_ENV or NODE_ENV has been removed.
  Instead, the CLI and backend process now accept one or more `--config` flags to load config files.

  Without passing any flags, `app-config.yaml` and, if it exists, `app-config.local.yaml` will be loaded.
  If passing any `--config <path>` flags, only those files will be loaded, **NOT** the default `app-config.yaml` one.

  The old behaviour of for example `APP_ENV=development` can be replicated using the following flags:

  ```bash
  --config ../../app-config.yaml --config ../../app-config.development.yaml
  ```

- ce5512bc0: Added support for new shorthand when defining secrets, where `$env: ENV` can be used instead of `$secret: { env: ENV }` etc.
