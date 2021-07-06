---
id: defining
title: Defining Configuration for your Plugin
description: Documentation on Defining Configuration for your Plugin
---

Configuration in Backstage is organized via a configuration schema, which in
turn is defined using a superset of
[JSON Schema Draft-07](https://json-schema.org/specification-links.html#draft-7).
Each plugin or package within a Backstage app can contribute to the schema,
which during validation is stitched together into a single schema.

## Schema Collection and Definition

Schemas are collected from all packages and dependencies in each repo that are a
part of the Backstage ecosystem, including transitive dependencies. The current
definition of "part of the ecosystem" is that a package has at least one
dependency in the `@backstage` namespace, but this is subject to change.

Each package is searched for a schema at a single point of entry, a top-level
`"configSchema"` field in `package.json`. The field can either contain an
inlined JSON schema, or a relative path to a schema file. Supported schema file
formats are `.json` or `.d.ts`.

> When defining a schema file, be sure to include the file in your
> `package.json` > `"files"` field as well!

TypeScript configuration schema files should export a single `Config` type, for
example:

```ts
export interface Config {
  app: {
    /**
     * Frontend root URL
     * @visibility frontend
     */
    baseUrl: string;

    // Use @items.<name> to assign annotations to primitive array items
    /** @items.visibility frontend */
    myItems: string[];
  };
}
```

Separate `.json` schema files can use a top-level
`"$schema": "https://backstage.io/schema/config-v1"` declaration in order to
receive schema validation and autocompletion. For example:

```json
{
  "$schema": "https://backstage.io/schema/config-v1",
  "type": "object",
  "properties": {
    "app": {
      "type": "object",
      "properties": {
        "baseUrl": {
          "type": "string",
          "description": "Frontend root URL",
          "visibility": "frontend"
        }
      },
      "required": ["baseUrl"]
    },
    "required": ["app"]
  }
}
```

## Visibility

The `https://backstage.io/schema/config-v1` meta schema is a superset of JSON
Schema Draft 07. The single addition is a custom `visibility` keyword, which is
used to indicate whether the given config value should be visible in the
frontend or not. The possible values are `frontend`, `backend`, and `secret`,
where `backend` is the default. A visibility of `secret` has the same scope at
runtime, but it will be treated with more care in certain contexts, and defining
both `frontend` and `secret` for the same value in two different schemas will
result in an error during schema merging.

The visibility only applies to the direct parent of where the keyword is placed
in the schema. For example, if you set the visibility to `frontend` for a subset
of the schema with `type: "object"`, but none of the descendants, only an empty
object will be available in the frontend. The full ancestry does not need to
have correctly defined visibilities however, so it is enough to only for example
declare the visibility of a leaf node of `type: "string"`.

| `visibility` |                                                                    |
| ------------ | ------------------------------------------------------------------ |
| `frontend`   | Visible in frontend and backend                                    |
| `backend`    | (Default) Only in backend                                          |
| `secret`     | Only in backend and may be excluded from logs for security reasons |

You can set visibility with an `@visibility` comment in the `Config` Typescript
interface.

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

## Validation

Schemas can be validated using the `backstage-cli config:check` command. If you
want to validate anything else than the default `app-config.yaml`, be sure to
pass in all of the configuration files as `--config <path>` options as well.

To validate and examine the frontend configuration, use the
`backstage-cli config:print --frontend` command. Just like for validation you
may need to pass in all files using one or multiple `--config <path>` options.

## Guidelines

> Make limited use of static configuration. The first question to ask is whether
> a particular option actually needs to be static configuration, or if it might
> just as well be a TypeScript API. In general, options that you want to be able
> to change for different deployment environments should be static
> configuration, while it should otherwise be avoided.

When defining configuration for your plugin, keep keys camelCased and stick to
existing casing conventions such as `baseUrl` rather than `baseURL`.

It is also usually best to prefer objects over arrays, as it makes it possible
to override individual values using separate files or environment variables.

Avoid creating new top-level fields as much as possible. Either place your
configuration within an existing known top-level block, or create a single new
one using e.g. the name of the product that the plugin integrates.
