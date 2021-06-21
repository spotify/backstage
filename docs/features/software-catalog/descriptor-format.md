---
id: descriptor-format
title: Descriptor Format of Catalog Entities
sidebar_label: YAML File Format
# prettier-ignore: ""
description: Documentation on Descriptor Format of Catalog Entities which describes the default data shape and semantics of catalog entities
---

This section describes the default data shape and semantics of catalog entities.

This both applies to objects given to and returned from the software catalog
API, as well as to the descriptor files that the software catalog can ingest
natively. In the API request/response cycle, a JSON representation is used,
while the descriptor files are on YAML format to be more easily maintainable by
humans. However, the structure and semantics are the same in both cases.

Although it's possible to name catalog entity descriptor files however you wish,
we recommend that you name them `catalog-info.yaml`.

## Contents

- [Overall Shape Of An Entity](#overall-shape-of-an-entity)
- [Common to All Kinds: The Envelope](#common-to-all-kinds-the-envelope)
- [Common to All Kinds: The Metadata](#common-to-all-kinds-the-metadata)
- [Common to All Kinds: Relations](#common-to-all-kinds-relations)
- [Common to All Kinds: Status](#common-to-all-kinds-status)
- [Kind: Component](#kind-component)
- [Kind: Template](#kind-template)
- [Kind: API](#kind-api)
- [Kind: Group](#kind-group)
- [Kind: User](#kind-user)
- [Kind: Resource](#kind-resource)
- [Kind: System](#kind-system)
- [Kind: Domain](#kind-domain)
- [Kind: Location](#kind-location)

## Overall Shape Of An Entity

The following is an example of a descriptor file for a Component entity:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-web
  description: The place to be, for great artists
  labels:
    example.com/custom: custom_label_value
  annotations:
    example.com/service-discovery: artistweb
    circleci.com/project-slug: github/example-org/artist-website
  tags:
    - java
  links:
    - url: https://admin.example-org.com
      title: Admin Dashboard
      icon: dashboard
spec:
  type: website
  lifecycle: production
  owner: artist-relations-team
  system: public-websites
```

This is the same entity as returned in JSON from the software catalog API:

```js
{
  "apiVersion": "backstage.io/v1alpha1",
  "kind": "Component",
  "metadata": {
    "annotations": {
      "backstage.io/managed-by-location": "file:/tmp/catalog-info.yaml",
      "example.com/service-discovery": "artistweb",
      "circleci.com/project-slug": "github/example-org/artist-website"
    },
    "description": "The place to be, for great artists",
    "etag": "ZjU2MWRkZWUtMmMxZS00YTZiLWFmMWMtOTE1NGNiZDdlYzNk",
    "generation": 1,
    "labels": {
      "example.com/custom": "custom_label_value"
    },
    "links": [{
      "url": "https://admin.example-org.com",
      "title": "Admin Dashboard",
      "icon": "dashboard"
    }],
    "tags": ["java"],
    "name": "artist-web",
    "uid": "2152f463-549d-4d8d-a94d-ce2b7676c6e2"
  },
  "spec": {
    "lifecycle": "production",
    "owner": "artist-relations-team",
    "type": "website",
    "system": "public-websites"
  }
}
```

The root fields `apiVersion`, `kind`, `metadata`, and `spec` are part of the
_envelope_, defining the overall structure of all kinds of entity. Likewise,
some metadata fields like `name`, `labels`, and `annotations` are of special
significance and have reserved purposes and distinct shapes.

See below for details about these fields.

## Substitutions In The Descriptor Format

The descriptor format supports substitutions using `$text`, `$json`, and
`$yaml`.

Placeholders like `$json: https://example.com/entity.json` are substituted by
the content of the referenced file. Files can be referenced from any configured
integration similar to locations by passing an absolute URL. It's also possible
to reference relative files like `./referenced.yaml` from the same location.
Relative references are handled relative to the folder of the
`catalog-info.yaml` that contains the placeholder. There are three different
types of placeholders:

- `$text`: Interprets the contents of the referenced file as plain text and
  embeds it as a string.
- `$json`: Interprets the contents of the referenced file as JSON and embeds the
  parsed structure.
- `$yaml`: Interprets the contents of the referenced file as YAML and embeds the
  parsed structure.

For example, this can be used to load the definition of an API entity from a web
server and embed it as a string in the field `spec.definition`:

```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: petstore
  description: The Petstore API
spec:
  type: openapi
  lifecycle: production
  owner: petstore@example.com
  definition:
    $text: https://petstore.swagger.io/v2/swagger.json
```

Note that to be able to read from targets that are outside of the normal
integration points such as `github.com`, you'll need to explicitly allow it by
adding an entry in the `backend.reading.allow` list. For example:

```yml
backend:
  baseUrl: ...
  reading:
    allow:
      - host: example.com
      - host: '*.examples.org'
```

## Common to All Kinds: The Envelope

The root envelope object has the following structure.

### `apiVersion` and `kind` [required]

The `kind` is the high level entity type being described.
[ADR005](../../architecture-decisions/adr005-catalog-core-entities.md) describes
a number of core kinds that plugins can know of and understand, but an
organization using Backstage is free to also add entities of other kinds to the
catalog.

The perhaps most central kind of entity, that the catalog focuses on in the
initial phase, is `Component` ([see below](#kind-component)).

The `apiVersion` is the version of specification format for that particular
entity that the specification is made against. The version is used for being
able to evolve the format, and the tuple of `apiVersion` and `kind` should be
enough for a parser to know how to interpret the contents of the rest of the
data.

Backstage specific entities have an `apiVersion` that is prefixed with
`backstage.io/`, to distinguish them from other types of object that share the
same type of structure. This may be relevant when co-hosting these
specifications with e.g. Kubernetes object manifests, or when an organization
adds their own specific kinds of entity to the catalog.

Early versions of the catalog will be using alpha/beta versions, e.g.
`backstage.io/v1alpha1`, to signal that the format may still change. After that,
we will be using `backstage.io/v1` and up.

### `metadata` [required]

A structure that contains metadata about the entity, i.e. things that aren't
directly part of the entity specification itself. See below for more details
about this structure.

### `spec` [varies]

The actual specification data that describes the entity.

The precise structure of the `spec` depends on the `apiVersion` and `kind`
combination, and some kinds may not even have a `spec` at all. See further down
in this document for the specification structure of specific kinds.

## Common to All Kinds: The Metadata

The `metadata` root field has a number of reserved fields with specific meaning,
described below.

In addition to these, you may add any number of other fields directly under
`metadata`, but be aware that general plugins and tools may not be able to
understand their semantics. See [Extending the model](extending-the-model.md)
for more information.

### `name` [required]

The name of the entity. This name is both meant for human eyes to recognize the
entity, and for machines and other components to reference the entity (e.g. in
URLs or from other entity specification files).

Names must be unique per kind, within a given namespace (if specified), at any
point in time. This uniqueness constraint is case insensitive. Names may be
reused at a later time, after an entity is deleted from the registry.

Names are required to follow a certain format. Entities that do not follow those
rules will not be accepted for registration in the catalog. The ruleset is
configurable to fit your organization's needs, but the default behavior is as
follows.

- Strings of length at least 1, and at most 63
- Must consist of sequences of `[a-z0-9A-Z]` possibly separated by one of
  `[-_.]`

Example: `visits-tracking-service`, `CircleciBuildsDumpV2_avro_gcs`

### `namespace` [optional]

The ID of a namespace that the entity belongs to. This is a string that follows
the same format restrictions as `name` above.

This field is optional, and currently has no special semantics apart from
bounding the name uniqueness constraint if specified. It is reserved for future
use and may get broader semantic implication later. For now, it is recommended
to not specify a namespace unless you have specific need to do so. This means
the entity belongs to the `"default"` namespace.

Namespaces may also be part of the catalog, and are `v1` / `Namespace` entities,
i.e. not Backstage specific but the same as in Kubernetes.

### `description` [optional]

A human readable description of the entity, to be shown in Backstage. Should be
kept short and informative, suitable to give an overview of the entity's purpose
at a glance. More detailed explanations and documentation should be placed
elsewhere.

### `labels` [optional]

Labels are optional key/value pairs of that are attached to the entity, and
their use is identical to
[Kubernetes object labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/).

Their main purpose is for references to other entities, and for information that
is in one way or another classifying for the current entity. They are often used
as values in queries or filters.

Both the key and the value are strings, subject to the following restrictions.

Keys have an optional prefix followed by a slash, and then the name part which
is required. The prefix, if present, must be a valid lowercase domain name, at
most 253 characters in total. The name part must be sequences of `[a-zA-Z0-9]`
separated by any of `[-_.]`, at most 63 characters in total.

The `backstage.io/` prefix is reserved for use by Backstage core components.

Values are strings that follow the same restrictions as `name` above.

### `annotations` [optional]

An object with arbitrary non-identifying metadata attached to the entity,
identical in use to
[Kubernetes object annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/).

Their purpose is mainly, but not limited, to reference into external systems.
This could for example be a reference to the git ref the entity was ingested
from, to monitoring and logging systems, to PagerDuty schedules, etc. Users may
add these to descriptor YAML files, but in addition to this automated systems
may also add annotations, either during ingestion into the catalog, or at a
later time.

Both the key and the value are strings, subject to the following restrictions.

Keys have an optional prefix followed by a slash, and then the name part which
is required. The prefix must be a valid lowercase domain name if specified, at
most 253 characters in total. The name part must be sequences of `[a-zA-Z0-9]`
separated by any of `[-_.]`, at most 63 characters in total.

The `backstage.io/` prefix is reserved for use by Backstage core components.

Values can be of any length, but are limited to being strings.

There is a list of [well-known annotations](well-known-annotations.md), but
anybody is free to add more annotations as they see fit.

### `tags` [optional]

A list of single-valued strings, for example to classify catalog entities in
various ways. This is different to the labels in metadata, as labels are
key-value pairs.

The values are user defined, for example the programming language used for the
component, like `java` or `go`.

This field is optional, and currently has no special semantics.

Each tag must be sequences of `[a-z0-9]` separated by `-`, at most 63 characters
in total.

### `links` [optional]

A list of external hyperlinks related to the entity. Links can provide
additional contextual information that may be located outside of Backstage
itself. For example, an admin dashboard or external CMS page.

Users may add links to descriptor YAML files to provide additional reference
information to external content & resources. Links are not intended to drive any
additional functionality within Backstage, which is best left to `annotations`
and `labels`. It is recommended to use links only when an equivalent well-known
`annotation` does not cover a similar use case.

Fields of a link are:

| Field   | Type   | Description                                                                          |
| ------- | ------ | ------------------------------------------------------------------------------------ |
| `url`   | String | [Required] A `url` in a standard `uri` format (e.g. `https://example.com/some/page`) |
| `title` | String | [Optional] A user friendly display name for the link.                                |
| `icon`  | String | [Optional] A key representing a visual icon to be displayed in the UI.               |

_NOTE_: The `icon` field value is meant to be a semantic key that will map to a
specific icon that may be provided by an icon library (e.g. `material-ui`
icons). These keys should be a sequence of `[a-z0-9A-Z]`, possibly separated by
one of `[-_.]`. Backstage may support some basic icons out of the box, but the
Backstage integrator will ultimately be left to provide the appropriate icon
component mappings. A generic fallback icon would be provided if a mapping
cannot be resolved.

## Common to All Kinds: Relations

The `relations` root field is a read-only list of relations, between the current
entity and other entities, described in the
[well-known relations section](well-known-relations.md). Relations are commonly
two-way, so that there's a pair of relation types each describing one direction
of the relation.

A relation as part of a single entity that's read out of the API may look as
follows.

```js
{
  // ...
  "relations": [
    {
      "target": {
        "kind": "group",
        "namespace": "default",
        "name": "dev.infra"
      },
      "type": "ownedBy"
    }
  ],
  "spec": {
    "owner": "dev.infra",
    // ...
  }
}
```

The fields of a relation are:

| Field      | Type   | Description                                                                      |
| ---------- | ------ | -------------------------------------------------------------------------------- |
| `target`   | Object | A complete [compound reference](references.md) to the other end of the relation. |
| `type`     | String | The type of relation FROM a source entity TO the target entity.                  |
| `metadata` | Object | Reserved for future use.                                                         |

Entity descriptor YAML files are not supposed to contain this field. Instead,
catalog processors analyze the entity descriptor data and its surroundings, and
deduce relations that are then attached onto the entity as read from the
catalog.

Where relations are produced, they are to be considered the authoritative source
for that piece of data. In the example above, a plugin would do better to
consume the relation rather than `spec.owner` for deducing the owner of the
entity, because it may even be the case that the owner isn't taken from the YAML
at all - it could be taken from a CODEOWNERS file nearby instead for example.
Also, the `spec.owner` is on a shortened form and may have semantics associated
with it (such as the default kind being `Group` if not specified).

See the [well-known relations section](well-known-relations.md) for a list of
well-known / common relations and their semantics.

## Common to All Kinds: Status

The `status` root object is a read-only set of statuses, pertaining to the
current state or health of the entity, described in the
[well-known statuses section](well-known-statuses.md).

Currently, the only defined field is the `items` array. Each of its items
contains a specific data structure that describes some aspect of the state of
the entity, as seen from the point of view of some specific system. Different
systems may contribute to this array, under their own respective `type` keys.

The current main use case for this field is for the ingestion processes of the
catalog itself to convey information about errors and warnings back to the user.

A status field as part of a single entity that's read out of the API may look as
follows.

```js
{
  // ...
  "status": {
    "items": [
      {
        "type": "backstage.io/catalog-processing",
        "level": "error",
        "message": "NotFoundError: File not found",
        "error": {
          "name": "NotFoundError",
          "message": "File not found",
          "stack": "..."
        }
      }
    ]
  },
  "spec": {
    // ...
  }
}
```

The fields of a status item are:

| Field     | Type   | Description                                                                                      |
| --------- | ------ | ------------------------------------------------------------------------------------------------ |
| `type`    | String | The type of status as a unique key per source. Each type may appear more than once in the array. |
| `level`   | String | The level / severity of the status item: 'info', 'warning, or 'error'.                           |
| `message` | String | A brief message describing the status, intended for human consumption.                           |
| `error`   | Object | An optional serialized error object related to the status.                                       |

The `type` is an arbitrary string, but we recommend that types that are not
strictly private within the organization be namespaced to avoid collisions.
Types emitted by Backstage core processes will for example be prefixed with
`backstage.io/` as in the example above.

Entity descriptor YAML files are not supposed to contain a `status` root key.
Instead, catalog processors analyze the entity descriptor data and its
surroundings, and deduce status entries that are then attached onto the entity
as read from the catalog.

See the [well-known statuses section](well-known-statuses.md) for a list of
well-known / common status types.

## Kind: Component

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `Component`             |

A Component describes a software component. It is typically intimately linked to
the source code that constitutes the component, and should be what a developer
may regard a "unit of software", usually with a distinct deployable or linkable
artifact.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-web
  description: The place to be, for great artists
spec:
  type: website
  lifecycle: production
  owner: artist-relations-team
  system: artist-engagement-portal
  providesApis:
    - artist-api
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `Component`, respectively.

### `spec.type` [required]

The type of component as a string, e.g. `website`. This field is required.

The software catalog accepts any type value, but an organization should take
great care to establish a proper taxonomy for these. Tools including Backstage
itself may read this field and behave differently depending on its value. For
example, a website type component may present tooling in the Backstage interface
that is specific to just websites.

The current set of well-known and common values for this field is:

- `service` - a backend service, typically exposing an API
- `website` - a website
- `library` - a software library, such as an npm module or a Java library

### `spec.lifecycle` [required]

The lifecycle state of the component, e.g. `production`. This field is required.

The software catalog accepts any lifecycle value, but an organization should
take great care to establish a proper taxonomy for these.

The current set of well-known and common values for this field is:

- `experimental` - an experiment or early, non-production component, signaling
  that users may not prefer to consume it over other more established
  components, or that there are low or no reliability guarantees
- `production` - an established, owned, maintained component
- `deprecated` - a component that is at the end of its lifecycle, and may
  disappear at a later point in time

### `spec.owner` [required]

An [entity reference](#string-references) to the owner of the component, e.g.
`artist-relations-team`. This field is required.

In Backstage, the owner of a component is the singular entity (commonly a team)
that bears ultimate responsibility for the component, and has the authority and
capability to develop and maintain it. They will be the point of contact if
something goes wrong, or if features are to be requested. The main purpose of
this field is for display purposes in Backstage, so that people looking at
catalog items can get an understanding of to whom this component belongs. It is
not to be used by automated processes to for example assign authorization in
runtime systems. There may be others that also develop or otherwise touch the
component, but there will always be one ultimate owner.

| [`kind`](#apiversion-and-kind-required)                | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                              |
| ------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------- |
| [`Group`](#kind-group) (default), [`User`](#kind-user) | Same as this entity, typically `default`   | [`ownerOf`, and reverse `ownedBy`](well-known-relations.md#ownedby-and-ownerof) |

### `spec.system` [optional]

An [entity reference](#string-references) to the system that the component
belongs to, e.g. `artist-engagement-portal`. This field is optional.

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                            |
| --------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- |
| [`System`](#kind-system) (default)      | Same as this entity, typically `default`   | [`partOf`, and reverse `hasPart`](well-known-relations.md#partof-and-haspart) |

### `spec.subcomponentOf` [optional]

An [entity reference](#string-references) to another component of which the
component is a part, e.g. `spotify-ios-app`. This field is optional.

| [`kind`](#apiversion-and-kind-required)  | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                            |
| ---------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- |
| [`Component`](#kind-component) (default) | Same as this entity, typically `default`   | [`partOf`, and reverse `hasPart`](well-known-relations.md#partof-and-haspart) |

### `spec.providesApis` [optional]

An array of [entity references](#string-references) to the APIs that are
provided by the component, e.g. `artist-api`. This field is optional.

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                                                  |
| --------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| [`API`](#kind-api) (default)            | Same as this entity, typically `default`   | [`providesApi`, and reverse `apiProvidedBy`](well-known-relations.md#providesapi-and-apiprovidedby) |

### `spec.consumesApis` [optional]

An array of [entity references](#string-references) to the APIs that are
consumed by the component, e.g. `artist-api`. This field is optional.

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                                                  |
| --------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| [`API`](#kind-api) (default)            | Same as this entity, typically `default`   | [`consumesApi`, and reverse `apiConsumedBy`](well-known-relations.md#consumesapi-and-apiconsumedby) |

### `spec.dependsOn` [optional]

An array of [entity references](#string-references) to the components and
resources that the component depends on, e.g. `artists-db`. This field is
optional.

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                                            |
| --------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [`Component`](#kind-component)          | Same as this entity, typically `default`   | [`dependsOn`, and reverse `dependencyOf`](well-known-relations.md#dependson-and-dependencyof) |
| [`Resource`](#kind-resource)            | Same as this entity, typically `default`   | [`dependsOn`, and reverse `dependencyOf`](well-known-relations.md#dependson-and-dependencyof) |

## Kind: Template

The following describes the following entity kind:

| Field        | Value                  |
| ------------ | ---------------------- |
| `apiVersion` | `backstage.io/v1beta2` |
| `kind`       | `Template`             |

If you're looking for docs on `v1alpha1` you can find them
[here](../software-templates/legacy.md)

A template definition describes both the parameters that are rendered in the
frontend part of the scaffolding wizard, and the steps that are executed when
scaffolding that component.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1beta2
kind: Template
# some metadata about the template itself
metadata:
  name: v1beta2-demo
  title: Test Action template
  description: scaffolder v1beta2 template demo
spec:
  owner: backstage/techdocs-core
  type: service

  # these are the steps which are rendered in the frontend with the form input
  parameters:
    - title: Fill in some steps
      required:
        - name
      properties:
        name:
          title: Name
          type: string
          description: Unique name of the component
          ui:autofocus: true
          ui:options:
            rows: 5
    - title: Choose a location
      required:
        - repoUrl
      properties:
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - github.com

  # here's the steps that are executed in series in the scaffolder backend
  steps:
    - id: fetch-base
      name: Fetch Base
      action: fetch:cookiecutter
      input:
        url: ./template
        values:
          name: '{{ parameters.name }}'

    - id: fetch-docs
      name: Fetch Docs
      action: fetch:plain
      input:
        targetPath: ./community
        url: https://github.com/backstage/community/tree/main/backstage-community-sessions

    - id: publish
      name: Publish
      action: publish:github
      input:
        allowedHosts: ['github.com']
        description: 'This is {{ parameters.name }}'
        repoUrl: '{{ parameters.repoUrl }}'

    - id: register
      name: Register
      action: catalog:register
      input:
        repoContentsUrl: '{{ steps.publish.output.repoContentsUrl }}'
        catalogInfoPath: '/catalog-info.yaml'
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1beta2` and `Template`, respectively.

### `metadata.title` [required]

The nice display name for the template as a string, e.g. `React SSR Template`.
This field is required as is used to reference the template to the user instead
of the `metadata.name` field.

### `metadata.tags` [optional]

A list of strings that can be associated with the template, e.g.
`['recommended', 'react']`.

This list will also be used in the frontend to display to the user so you can
potentially search and group templates by these tags.

### `spec.type` [required]

The type of component created by the template, e.g. `website`. This is used for
filtering templates, and should ideally match the Component
[spec.type](#spectype-required) created by the template.

### `spec.parameters` [required]

You can find out more about the `parameters` key
[here](../software-templates/writing-templates.md)

### `spec.steps` [optional]

You can find out more about the `steps` key
[here](../software-templates/writing-templates.md)

### `spec.owner` [optional]

An [entity reference](#string-references) to the owner of the template, e.g.
`artist-relations-team`. This field is required.

In Backstage, the owner of a Template is the singular entity (commonly a team)
that bears ultimate responsibility for the Template, and has the authority and
capability to develop and maintain it. They will be the point of contact if
something goes wrong, or if features are to be requested. The main purpose of
this field is for display purposes in Backstage, so that people looking at
catalog items can get an understanding of to whom this Template belongs. It is
not to be used by automated processes to for example assign authorization in
runtime systems. There may be others that also develop or otherwise touch the
Template, but there will always be one ultimate owner.

| [`kind`](#apiversion-and-kind-required)                | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                              |
| ------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------- |
| [`Group`](#kind-group) (default), [`User`](#kind-user) | Same as this entity, typically `default`   | [`ownerOf`, and reverse `ownedBy`](well-known-relations.md#ownedby-and-ownerof) |

## Kind: API

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `API`                   |

An API describes an interface that can be exposed by a component. The API can be
defined in different formats, like [OpenAPI](https://swagger.io/specification/),
[AsyncAPI](https://www.asyncapi.com/docs/specifications/latest/),
[GraphQL](https://graphql.org/learn/schema/),
[gRPC](https://developers.google.com/protocol-buffers), or other formats.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: artist-api
  description: Retrieve artist details
spec:
  type: openapi
  lifecycle: production
  owner: artist-relations-team
  system: artist-engagement-portal
  definition: |
    openapi: "3.0.0"
    info:
      version: 1.0.0
      title: Artist API
      license:
        name: MIT
    servers:
      - url: http://artist.spotify.net/v1
    paths:
      /artists:
        get:
          summary: List all artists
    ...
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `API`, respectively.

### `spec.type` [required]

The type of the API definition as a string, e.g. `openapi`. This field is
required.

The software catalog accepts any type value, but an organization should take
great care to establish a proper taxonomy for these. Tools including Backstage
itself may read this field and behave differently depending on its value. For
example, an OpenAPI type API may be displayed using an OpenAPI viewer tooling in
the Backstage interface.

The current set of well-known and common values for this field is:

- `openapi` - An API definition in YAML or JSON format based on the
  [OpenAPI](https://swagger.io/specification/) version 2 or version 3 spec.
- `asyncapi` - An API definition based on the
  [AsyncAPI](https://www.asyncapi.com/docs/specifications/latest/) spec.
- `graphql` - An API definition based on
  [GraphQL schemas](https://spec.graphql.org/) for consuming
  [GraphQL](https://graphql.org/) based APIs.
- `grpc` - An API definition based on
  [Protocol Buffers](https://developers.google.com/protocol-buffers) to use with
  [gRPC](https://grpc.io/).

### `spec.lifecycle` [required]

The lifecycle state of the API, e.g. `production`. This field is required.

The software catalog accepts any lifecycle value, but an organization should
take great care to establish a proper taxonomy for these.

The current set of well-known and common values for this field is:

- `experimental` - an experiment or early, non-production API, signaling that
  users may not prefer to consume it over other more established APIs, or that
  there are low or no reliability guarantees
- `production` - an established, owned, maintained API
- `deprecated` - an API that is at the end of its lifecycle, and may disappear
  at a later point in time

### `spec.owner` [required]

An [entity reference](#string-references) to the owner of the component, e.g.
`artist-relations-team`. This field is required.

In Backstage, the owner of an API is the singular entity (commonly a team) that
bears ultimate responsibility for the API, and has the authority and capability
to develop and maintain it. They will be the point of contact if something goes
wrong, or if features are to be requested. The main purpose of this field is for
display purposes in Backstage, so that people looking at catalog items can get
an understanding of to whom this API belongs. It is not to be used by automated
processes to for example assign authorization in runtime systems. There may be
others that also develop or otherwise touch the API, but there will always be
one ultimate owner.

| [`kind`](#apiversion-and-kind-required)                | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                              |
| ------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------- |
| [`Group`](#kind-group) (default), [`User`](#kind-user) | Same as this entity, typically `default`   | [`ownerOf`, and reverse `ownedBy`](well-known-relations.md#ownedby-and-ownerof) |

### `spec.system` [optional]

An [entity reference](#string-references) to the system that the API belongs to,
e.g. `artist-engagement-portal`. This field is optional.

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                            |
| --------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- |
| [`System`](#kind-system) (default)      | Same as this entity, typically `default`   | [`partOf`, and reverse `hasPart`](well-known-relations.md#partof-and-haspart) |

### `spec.definition` [required]

The definition of the API, based on the format defined by `spec.type`. This
field is required.

## Kind: Group

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `Group`                 |

A group describes an organizational entity, such as for example a team, a
business unit, or a loose collection of people in an interest group. Members of
these groups are modeled in the catalog as kind [`User`](#kind-user).

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Group
metadata:
  name: infrastructure
  description: The infra business unit
spec:
  type: business-unit
  profile:
    displayName: Infrastructure
    email: infrastructure@example.com
    picture: https://example.com/groups/bu-infrastructure.jpeg
  parent: ops
  children: [backstage, other]
  members: [jdoe]
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `Group`, respectively.

### `spec.type` [required]

The type of group as a string, e.g. `team`. There is currently no enforced set
of values for this field, so it is left up to the adopting organization to
choose a nomenclature that matches their org hierarchy.

Some common values for this field could be:

- `team`
- `business-unit`
- `product-area`
- `root` - as a common virtual root of the hierarchy, if desired

### `spec.profile` [optional]

Optional profile information about the group, mainly for display purposes. All
fields of this structure are also optional. The email would be a group email of
some form, that the group may wish to be used for contacting them. The picture
is expected to be a URL pointing to an image that's representative of the group,
and that a browser could fetch and render on a group page or similar.

### `spec.parent` [optional]

The immediate parent group in the hierarchy, if any. Not all groups must have a
parent; the catalog supports multi-root hierarchies. Groups may however not have
more than one parent.

This field is an
[entity reference](https://backstage.io/docs/features/software-catalog/references).

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                                |
| --------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------- |
| [`Group`](#kind-group) (default)        | Same as this entity, typically `default`   | [`childOf`, and reverse `parentOf`](well-known-relations.md#parentof-and-childof) |

### `spec.children` [required]

The immediate child groups of this group in the hierarchy (whose `parent` field
points to this group). The list must be present, but may be empty if there are
no child groups. The items are not guaranteed to be ordered in any particular
way.

The entries of this array are
[entity references](https://backstage.io/docs/features/software-catalog/references).

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                                    |
| --------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| [`Group`](#kind-group) (default)        | Same as this entity, typically `default`   | [`hasMember`, and reverse `memberOf`](well-known-relations.md#memberof-and-hasmember) |

### `spec.members` [optional]

The users that are direct members of this group. The items are not guaranteed to
be ordered in any particular way.

The entries of this array are
[entity references](https://backstage.io/docs/features/software-catalog/references).

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                                    |
| --------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| [`User`](#kind-user) (default)          | Same as this entity, typically `default`   | [`hasMember`, and reverse `memberOf`](well-known-relations.md#memberof-and-hasmember) |

## Kind: User

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `User`                  |

A user describes a person, such as an employee, a contractor, or similar. Users
belong to [`Group`](#kind-group) entities in the catalog.

These catalog user entries are connected to the way that authentication within
the Backstage ecosystem works. See the [auth](https://backstage.io/docs/auth)
section of the docs for a discussion of these concepts.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  name: jdoe
spec:
  profile:
    displayName: Jenny Doe
    email: jenny-doe@example.com
    picture: https://example.com/staff/jenny-with-party-hat.jpeg
  memberOf: [team-b, employees]
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `User`, respectively.

### `spec.profile` [optional]

Optional profile information about the user, mainly for display purposes. All
fields of this structure are also optional. The email would be a primary email
of some form, that the user may wish to be used for contacting them. The picture
is expected to be a URL pointing to an image that's representative of the user,
and that a browser could fetch and render on a profile page or similar.

### `spec.memberOf` [required]

The list of groups that the user is a direct member of (i.e., no transitive
memberships are listed here). The list must be present, but may be empty if the
user is not member of any groups. The items are not guaranteed to be ordered in
any particular way.

The entries of this array are
[entity references](https://backstage.io/docs/features/software-catalog/references).

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                                    |
| --------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| [`Group`](#kind-group) (default)        | Same as this entity, typically `default`   | [`memberOf`, and reverse `hasMember`](well-known-relations.md#memberof-and-hasmember) |

## Kind: Resource

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `Resource`              |

A resource describes the infrastructure a system needs to operate, like BigTable
databases, Pub/Sub topics, S3 buckets or CDNs. Modelling them together with
components and systems allows to visualize resource footprint, and create
tooling around them.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Resource
metadata:
  name: artists-db
  description: Stores artist details
spec:
  type: database
  owner: artist-relations-team
  system: artist-engagement-portal
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `Resource`, respectively.

### `spec.owner` [required]

An [entity reference](#string-references) to the owner of the resource, e.g.
`artist-relations-team`. This field is required.

In Backstage, the owner of a resource is the singular entity (commonly a team)
that bears ultimate responsibility for the resource, and has the authority and
capability to develop and maintain it. They will be the point of contact if
something goes wrong, or if features are to be requested. The main purpose of
this field is for display purposes in Backstage, so that people looking at
catalog items can get an understanding of to whom this resource belongs. It is
not to be used by automated processes to for example assign authorization in
runtime systems. There may be others that also manage or otherwise touch the
resource, but there will always be one ultimate owner.

| [`kind`](#apiversion-and-kind-required)                | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                              |
| ------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------- |
| [`Group`](#kind-group) (default), [`User`](#kind-user) | Same as this entity, typically `default`   | [`ownerOf`, and reverse `ownedBy`](well-known-relations.md#ownedby-and-ownerof) |

### `spec.type` [required]

The type of resource as a string, e.g. `database`. This field is required. There
is currently no enforced set of values for this field, so it is left up to the
adopting organization to choose a nomenclature that matches the resources used
in their tech stack.

Some common values for this field could be:

- `database`
- `s3-bucket`
- `cluster`

### `spec.system` [optional]

An [entity reference](#string-references) to the system that the resource
belongs to, e.g. `artist-engagement-portal`. This field is optional.

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                            |
| --------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- |
| [`System`](#kind-system) (default)      | Same as this entity, typically `default`   | [`partOf`, and reverse `hasPart`](well-known-relations.md#partof-and-haspart) |

### `spec.dependsOn` [optional]

An array of [entity references](#string-references) to the components and
resources that the resource depends on, e.g. `artist-lookup`. This field is
optional.

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                                            |
| --------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [`Component`](#kind-component)          | Same as this entity, typically `default`   | [`dependsOn`, and reverse `dependencyOf`](well-known-relations.md#dependson-and-dependencyof) |
| [`Resource`](#kind-resource)            | Same as this entity, typically `default`   | [`dependsOn`, and reverse `dependencyOf`](well-known-relations.md#dependson-and-dependencyof) |

## Kind: System

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `System`                |

A system is a collection of resources and components. The system may expose or
consume one or several APIs. It is viewed as abstraction level that provides
potential consumers insights into exposed features without needing a too
detailed view into the details of all components. This also gives the owning
team the possibility to decide about published artifacts and APIs.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: System
metadata:
  name: artist-engagement-portal
  description: Handy tools to keep artists in the loop
spec:
  owner: artist-relations-team
  domain: artists
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `System`, respectively.

### `spec.owner` [required]

An [entity reference](#string-references) to the owner of the system, e.g.
`artist-relations-team`. This field is required.

In Backstage, the owner of a system is the singular entity (commonly a team)
that bears ultimate responsibility for the system, and has the authority and
capability to develop and maintain it. They will be the point of contact if
something goes wrong, or if features are to be requested. The main purpose of
this field is for display purposes in Backstage, so that people looking at
catalog items can get an understanding of to whom this system belongs. It is not
to be used by automated processes to for example assign authorization in runtime
systems. There may be others that also develop or otherwise touch the system,
but there will always be one ultimate owner.

| [`kind`](#apiversion-and-kind-required)                | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                              |
| ------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------- |
| [`Group`](#kind-group) (default), [`User`](#kind-user) | Same as this entity, typically `default`   | [`ownerOf`, and reverse `ownedBy`](well-known-relations.md#ownedby-and-ownerof) |

### `spec.domain` [optional]

An [entity reference](#string-references) to the domain that the system belongs
to, e.g. `artists`. This field is optional.

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                            |
| --------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- |
| [`Domain`](#kind-domain) (default)      | Same as this entity, typically `default`   | [`partOf`, and reverse `hasPart`](well-known-relations.md#partof-and-haspart) |

## Kind: Domain

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `Domain`                |

A Domain groups a collection of systems that share terminology, domain models,
business purpose, or documentation, i.e. form a bounded context.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Domain
metadata:
  name: artists
  description: Everything about artists
spec:
  owner: artist-relations-team
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `Domain`, respectively.

### `spec.owner` [required]

An [entity reference](#string-references) to the owner of the domain, e.g.
`artist-relations-team`. This field is required.

In Backstage, the owner of a domain is the singular entity (commonly a team)
that bears ultimate responsibility for the domain, and has the authority and
capability to develop and maintain it. They will be the point of contact if
something goes wrong, or if features are to be requested. The main purpose of
this field is for display purposes in Backstage, so that people looking at
catalog items can get an understanding of to whom this domain belongs. It is not
to be used by automated processes to for example assign authorization in runtime
systems. There may be others that also develop or otherwise touch the domain,
but there will always be one ultimate owner.

| [`kind`](#apiversion-and-kind-required)                | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                              |
| ------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------- |
| [`Group`](#kind-group) (default), [`User`](#kind-user) | Same as this entity, typically `default`   | [`ownerOf`, and reverse `ownedBy`](well-known-relations.md#ownedby-and-ownerof) |

## Kind: Location

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `Location`              |

A location is a marker that references other places to look for catalog data.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Location
metadata:
  name: org-data
spec:
  type: url
  targets:
    - http://github.com/myorg/myproject/org-data-dump/catalog-info-staff.yaml
    - http://github.com/myorg/myproject/org-data-dump/catalog-info-consultants.yaml
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `Location`, respectively.

### `spec.type` [optional]

The single location type, that's common to the targets specified in the spec. If
it is left out, it is inherited from the location type that originally read the
entity data. For example, if you have a `url` type location, that when read
results in a `Location` kind entity with no `spec.type`, then the referenced
targets in the entity will implicitly also be of `url` type. This is useful
because you can define a hierarchy of things in a directory structure using
relative target paths (see below), and it will work out no matter if it's
consumed locally on disk from a `file` location, or as uploaded on a VCS.

### `spec.target` [optional]

A single target as a string. Can be either an absolute path/URL (depending on
the type), or a relative path such as `./details/catalog-info.yaml` which is
resolved relative to the location of this Location entity itself.

### `spec.targets` [optional]

A list of targets as strings. They can all be either absolute paths/URLs
(depending on the type), or relative paths such as `./details/catalog-info.yaml`
which are resolved relative to the location of this Location entity itself.
