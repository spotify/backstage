---
id: writing
title: Writing Backstage Configuration Files
description: Documentation on Writing Backstage Configuration Files
---

## File Format

Configuration is stored in YAML format in `app-config.yaml` files. This
configuration is shared between the frontend and backend and it looks something
like this:

```yaml
app:
  title: Backstage Example App
  baseUrl: http://localhost:3000

backend:
  listen: 0.0.0.0:7000
  baseUrl: http://localhost:7000

organization:
  name: CNCF

proxy:
  /my/api:
    target: https://example.com/api/
    changeOrigin: true
    pathRewrite:
      ^/proxy/my/api/: /
```

Configuration files are typically checked in and stored in the repo that houses
the rest of the Backstage application.

The particular configuration that is available to each Backstage app depends on
what plugins and packages are installed. To view the configuration reference for
your own project, including what configuration keys available and whether they
are needed by the frontend, use the following command:

```sh
yarn backstage-cli config:docs
```

## Environment Variable Overrides

Individual configuration values can be overridden using environment variables
prefixed with `APP_CONFIG_`. Everything following that prefix in the environment
variable name will be used as the config key, with `_` replaced by `.`. For
example, to override the `app.baseUrl` value, set the `APP_CONFIG_app_baseUrl`
environment variable to the desired value.

The value of the environment variable is parsed as JSON, but it will fall back
to being interpreted as a string if it fails to parse. Note that if you for
example want to pass on the string `"false"`, you need to wrap it in double
quotes, e.g. `export APP_CONFIG_example='"false"'`.

While it may be tempting to use environment variable overrides for supplying a
lot of configuration values, we recommend using them sparingly. Try to stick to
using configuration files, and only use environment variables for things like
reusing deployment artifacts across staging and production environments.

Note that environment variables work for frontend configuration too. They are
picked up by the serve tasks of `@backstage/cli` for local development, and are
injected by the entrypoint of the nginx container serving the frontend in a
production build.

## Configuration Files

It is possible to have multiple configuration files, both to support different
environments, but also to define configuration that is local to specific
packages. The configuration files to load are selected using a `--config <path>`
flag, and it is possible to load any number of files. Paths are relative to the
working directory of the executed process, for example `package/backend`. This
means that to select a config file in the repo root when running the backend,
you would use `--config ../../my-config.yaml`.

If no `config` flags are specified, the default behavior is to load
`app-config.yaml` and, if it exists, `app-config.local.yaml` from the repo root.
In the provided project setup, `app-config.local.yaml` is `.gitignore`'d, making
it a good place to add config overrides and secrets for local development.

Note that if any config flags are provided, the default `app-config.yaml` files
are NOT loaded. To include them you need to explicitly include them with a flag,
for example:

```shell
yarn start --config ../../app-config.yaml --config ../../app-config.staging.yaml
```

All loaded configuration files are merged together using the following rules:

- Configurations have different priority, higher priority means you replace
  values from configurations with lower priority.
- Primitive values are completely replaced, as are arrays and all of their
  contents.
- Objects are merged together deeply, meaning that if any of the included
  configs contain a value for a given path, it will be found.

The priority of the configurations is determined by the following rules, in
order:

- Configuration from the `APP_CONFIG_` environment variables has the highest
  priority, followed by files.
- Files loaded with config flags are ordered by priority, where the last flag
  has the highest priority.
- If no config flags are provided, `app-config.local.yaml` has higher priority
  than `app-config.yaml`.

## Includes and Dynamic Data

Includes are supported via special data loading keys that are prefixed with `$`,
which in turn provide a number of different ways to read in data. To load in an
external configuration value, supply an object with one of the special include
keys, for example `$env` or `$file`. A full list of supported include keys can
be found below. For example, the following will read the config key
`backend.mySecretKey` from the environment variable `MY_SECRET_KEY`:

```yaml
backend:
  mySecretKey:
    $env: MY_SECRET_KEY
```

With the above configuration, calling `config.getString('backend.mySecretKey')`
will return the value of the environment variable `MY_SECRET_KEY` when the
backend started up. All includes are loaded at startup, so changing the contents
of files or environment variables will not be reflected at runtime.

Below is a list of the currently supported methods for loading includes.

### Env Includes

This reads a string value from an environment variable. For example, the
following configuration loads the string value from the `MY_SECRET` environment
variable.

```yaml
$env: MY_SECRET
```

Note however, that it's often more convenient to use
[environment variable substitution](#environment-variable-substitution) instead.

### File Includes

This reads a string value from the entire contents of a text file. The file path
is relative to the source config file. For example, the following reads the
contents of `my-secret.txt` relative to the config file itself:

```yaml
$file: ./my-secret.txt
```

### Including Files

The `$include` keyword can be used to load configuration values from an external
file. It's able to load and parse data from `.json`, `.yml`, and `.yaml` files.
It's also possible to include a url fragment (`#`) to point to a value at the
given path in the file, using a dot-separated list of keys.

For example, the following would read `my-secret-key` from `my-secrets.json`:

```yaml
$include: ./my-secrets.json#deployment.key
```

Example `my-secrets.json` file:

```json
{
  "deployment": {
    "key": "my-secret-key"
  }
}
```

## Environment Variable Substitution

Configuration files support environment variable substitution via a `${MY_VAR}`
syntax. For example:

```yaml
app:
  baseUrl: https://${HOST}
```

Note that all environment variables must be available, or the entire
configuration value will evaluate to `undefined`.

The substitution syntax can be escaped using `$${...}`, which will be resolved
as `${...}`.

## Combining Includes and Environment Variable Substitution

The Includes and Environment Variable Substitutions can be combined to do
something like read a secrets configuration for a specific environment. For
example:

```yaml
integrations:
  github:
    - host: github.com
      apps:
        - $include: secrets.${BACKSTAGE_ENVIRONMENT}.yaml
```

Example `secrets.prod.yaml`:

```yaml
appId: 1
webhookUrl: https://smee.io/foo
clientId: someGithubAppClientId
clientSecret: someGithubAppClientSecret
webhookSecret: someWebhookSecret
privateKey: |
  -----BEGIN RSA PRIVATE KEY-----
  SomeRsaPrivateKey
  -----END RSA PRIVATE KEY-----
```
