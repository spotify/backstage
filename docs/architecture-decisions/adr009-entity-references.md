---
id: adrs-adr009
title: "ADR009: Entity References"
description: Architecture Decision Record (ADR) log on Entity References
---
## Background

While the spec for the catalog file format is well described in
[ADR002](./adr002-default-catalog-file-format.md), guidance was not provided as
to how one is expected to express references to other entities in the catalog.
There was also some confusion on how to reference entities in URLs in the
Backstage frontend.

Following discussion in
[Issue 1947](https://github.com/backstage/backstage/issues/1947), a decision was
made.

## Entity References in YAML files

The textual format, as written by humans, to reference entities by name is on
the following form, where square brackets denote optionality:

```

[<kind>:][<namespace>/]<name>

```

That is, it is composed of between one and three parts in this specific order,
without any additional encoding, with those exact separator characters.
Optionality of `kind` and `namespace` are contextual, and they may or may not
have default contextual fallback values.

When that format is insufficient or when machine made interchange formats wish
to express such relations in a more expressive form, a nested structure on the
following form can be used:

```yaml

kind: <kind>
namespace: <namespace>
name: <name>

```

Of these, only `name` is always required. Optionality of `kind` and `namespace`
are contextual, and they may or may not have default contextual fallback values.
All other possible key values in this structure are reserved for future use.

A system or user wanting to express a full entity name that is always valid,
shall supply the entire triplet whether using the string form or the compound
form.

A full description of the format can be found
[in the documentation](https://backstage.io/docs/features/software-catalog/references).

## Entity References in URLs

Where entities are referenced by name in the Backstage frontend, the URL
containing the reference shall take the following form:

```

:namespace/:kind/:name

```

All three parts are required under all circumstances. The default value for the
`namespace` in the catalog is the string `"default"`, if the entity does not
specify one explicitly in `metadata.namespace`.

This means that we do not encourage the string form of entity references to be
used as a single URL segment, due to the use of URL-unsafe characters leading to
possible risk, confusion, and uglier URLs.
