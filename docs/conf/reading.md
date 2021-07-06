---
id: reading
title: Reading Backstage Configuration
description: Documentation on Reading Backstage Configuration
---

## Config API

There's a common configuration API for by both frontend and backend plugins. An
API reference can be found [here](../reference/utility-apis/Config.md).

The configuration API is tailored towards failing fast in case of missing or bad
config. That's because configuration errors can always be considered programming
mistakes, and will fail deterministically.

### Type Safety

The methods for reading primitive values are typed, and validate that type at
runtime. For example `getNumber()` requires the underlying value to be a number,
and there will be no attempt to coerce other types into the desired one. If
`getNumber()` receives a string value, it will throw an error, explaining where
the bad config came from, and what the desired and actual types where.

### Reading Nested Configuration

The backing configuration data is a nested JSON structure, meaning there will be
object, within objects, arrays within objects, and so on. There are a couple of
different ways to access nested values when reading configuration, but the
primary one is to use dot-separated paths.

For example, given the following configuration:

```yaml
app:
  baseUrl: http://localhost:3000
```

We can access the `baseUrl` using `config.getString('app.baseUrl')`. Because of
this syntax, configuration keys are not allowed to contain dots. In fact,
configuration keys are validated using the following RegEx:
`/^[a-z][a-z0-9]*(?:[-_][a-z][a-z0-9]*)*$/i`.

Another option of accessing the `baseUrl` value is to create a sub-view of the
configuration, `config.getConfig('app').getString('baseUrl')`. When reading out
single values the dot-path pattern is preferred, but creating sub-views can be
useful for when you want to pass on parts of configuration to be read out by a
separate function. For example, given something like

```yaml
my-plugin:
  items:
    a:
      title: Item A
      path: /a
    b:
      title: Item B
      path: /b
```

You can get the list of all items using the `.keys()` method, and then pass on
each sub-view to be handled individually.

```ts
for (const itemKey of config.keys('my-plugin.items')) {
  const itemConfig = config.getConfig(`my-plugin.items`).getConfig(key);
  const item = createItemFromConfig(itemConfig);
}
```

Another option for iterating through configuration keys is to call
`config.get('my-plugin.items')`, which simply returns the JSON structure for
that position without any validation. This can be handy to use sometimes,
especially if you're passing on config to an external library. There's a clear
benefit to the sub-view approach though, which is that the user will receive
much more detailed and relevant error messages. For example, if
`itemConfig.getString('title')` fails in the above example because a boolean was
supplied, the user will receive an error message with the full path, e.g.
`my-plugin.items.b.title`, as well as the name of the config file with the bad
value.

Note that no matter what method is used for reading out nested config, the same
merging rules apply. You will always get the same value for any way of accessing
nested config:

```ts
// Equivalent as long as a.b.c exists and is a string
config.getString('a.b.c');
config.getConfig('a.b').getString('c');
config.get('a').b.c;
```

### Required vs Optional Configuration

Reading configuration can be divided into two categories: required, and
optional. When reading optional configuration you use the optional methods such
as `getOptionalString`. These methods will simply return `undefined` if
configuration values are missing, allowing the called to fall back to default
values. The optional methods still validate types however, so receiving a string
in a call to `config.getOptionalNumber` will still throw an error.

A good pattern for reading optional configuration values is to use the `??`
operator. For example:

```ts
const title = config.getOptionalString('my-plugin.title') ?? 'My Plugin';
```

To read required configuration, simply use the methods without `Optional`, for
example `getString`. These will throw an error if there is no value available.

## Accessing ConfigApi in Frontend Plugins

The [ConfigApi](../reference/utility-apis/Config.md) in the frontend is a
[UtilityApi](../api/utility-apis.md). It's accessible as usual via the
`configApiRef` exported from `@backstage/core-plugin-api`.

Depending on the config api in another API is slightly different though, as the
`ConfigApi` implementation is supplied via the App itself and not instantiated
like other APIs. See
[packages/app/src/apis.ts](https://github.com/backstage/backstage/blob/244eef851f5aa19f91c7c9b5c12d5df95cf482ca/packages/app/src/apis.ts#L66)
for an example of how this wiring is done.

For standalone plugin setups in `dev/index.ts`, register a factory with a
statically mocked implementation of the config API. Use the `ConfigReader` from
`@backstage/config` to create an instance and register it for the `configApiRef`
from `@backstage/core-plugin-api`.

## Accessing ConfigApi in Backend Plugins

In backend plugins the configuration is passed in via options from the main
backend package. See for example
[packages/backend/src/plugins/auth.ts](https://github.com/backstage/backstage/blob/244eef851f5aa19f91c7c9b5c12d5df95cf482ca/packages/backend/src/plugins/auth.ts#L23).
