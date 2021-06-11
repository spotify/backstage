---
id: configuration
title: Catalog Configuration
description: Documentation on Software Catalog Configuration
---

## Processors

The catalog has a concept of _processors_ to perform catalog ingestion tasks,
such as reading raw entity data from a remote source, parsing it, transforming
it, and validating it. These processors are configured under the
`catalog.processors` configuration key.

### Static Location Configuration

The simplest configuration for the catalog, as shown in the default
`@backstage/create-app` template, is to declaratively add locations pointing to
YAML files with [static configuration](../../conf/index.md).

Locations are added to the catalog under the `catalog.locations` key:

```yaml
catalog:
  locations:
    - type: url
      target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/artist-lookup-component.yaml
```

The `url` type locations are handled by a standard processor included with the
catalog (`UrlReaderProcessor`), so no processor configuration is needed. This
processor _does however_ need an [integration](../../integrations/index.md) to
understand how to retrieve a given URL. For the example above, you would need to
configure the [GitHub integration](../../integrations/github/locations.md) to
read files from github.com.

The locations added through static configuration cannot be removed through the
catalog locations API. To remove these locations, you must remove them from the
configuration.

Syntax errors or other types of errors present in `catalog-info.yaml` files will
be logged for investigation. Errors do not cause processing to abort.

When multiple `catalog-info.yaml` files with the same `metadata.name` property
are discovered, one will be processed and all others will be skipped. This
action is logged for further investigation.

### Integration Processors

Integrations may simply provide a mechanism to handle `url` location type for an
external provider, or they may also include additional processors out of the
box, such as the GitHub [discovery](../../integrations/github/discovery.md)
processor that scans a GitHub organization for
[entity descriptor files](descriptor-format.md).

Check the [integrations](../../integrations/index.md) documentation to see what
is offered by each integration.

### Custom Processors

To ingest entities from an existing system already tracking software, you can
also write a _custom processor_ to convert between the existing system and
Backstage's descriptor format. This is documented in
[External Integrations](external-integrations.md).

## Catalog Rules

By default the catalog will only allow ingestion of entities with the kind
`Component`, `API` and `Location`. In order to allow entities of other kinds to
be added, you need to add rules to the catalog. Rules are added either in a
separate `catalog.rules` key, or added to statically configured locations.

For example, given the following configuration:

```yaml
catalog:
  rules:
    - allow: [Component, API, Location, Template]

  locations:
    - type: url
      target: https://github.com/org/example/blob/master/org-data.yaml
      rules:
        - allow: [Group]
```

We are able to add entities of kind `Component`, `API`, `Location`, or
`Template` from any location, and `Group` entities from the `org-data.yaml`,
which will also be read as statically configured location.

Note that if the `catalog.rules` key is present it will replace the default
value, meaning that you need to add rules for the default kinds if you want
those to still be allowed.

The following configuration will reject any kind of entities from being added to
the catalog:

```yaml
catalog:
  rules: []
```

## Readonly mode

Processors provides a good way to automate ingestion of entities when combined
with [Static Location Configuration](#static-location-configuration) or a
discovery processor like
[GitHub Discovery](../../integrations/github/discovery.md). To enforce usage of
processors to locate entities we can configure the catalog into `readonly` mode.
This configuration disables the mutating backend catalog APIs and disallows
users from registering new entities at run-time.

```yaml
catalog:
  readonly: true
```

> **Note that any plugin relying on the catalog API for creating, updating and
> deleting entities will not work in this mode.**

A common use case for this configuration is when organizations have a remote
source that should be mirrored into Backstage. To make Backstage a mirror of
this remote source, users cannot also register new entities with e.g. the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.
