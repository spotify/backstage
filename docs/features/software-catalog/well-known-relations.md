---
id: well-known-relations
title: Well-known Relations between Catalog Entities
sidebar_label: Well-known Relations
# prettier-ignore: ""
description: Documentation that lists a number of well known Relations, that have defined semantics. They can be attached to catalog entities and consumed by plugins as needed.
---

This section lists a number of well known
[entity relation types](descriptor-format.md#common-to-all-kinds-relations),
that have defined semantics. They can be attached to catalog entities and
consumed by plugins as needed.

If you are looking to extend the set of relations, see
[Extending the model](extending-the-model.md).

## Relations

This is a (non-exhaustive) list of relations that are known to be in active use.

Each relation has a _source_ (implicitly: the entity that holds the relation), a
_target_ (the entity to which the source has a relation), and a _type_ that
tells what relation the source has with the target. The relation is directional;
there are commonly pairs of relation types and the entity at the other end will
have the opposite relation in the opposite direction (e.g. when querying for
`A`, you will see `A.ownedBy.B`, and when querying `B`, you will see
`B.ownerOf.A`).

### `ownedBy` and `ownerOf`

An ownership relation where the owner is usually an organizational entity
([User](descriptor-format.md#kind-user) or
[Group](descriptor-format.md#kind-group)), and the other entity can be anything.

In Backstage, the owner of an entity is the singular entity (commonly a team)
that bears ultimate responsibility for the entity, and has the authority and
capability to develop and maintain it. They will be the point of contact if
something goes wrong, or if features are to be requested. The main purpose of
this relation is for display purposes in Backstage, so that people looking at
catalog entities can get an understanding of to whom this entity belongs. It is
not to be used by automated processes to for example assign authorization in
runtime systems. There may be others that also develop or otherwise touch the
entity, but there will always be one ultimate owner.

This relation is commonly generated based on `spec.owner` of the owned entity,
where present.

### `providesApi` and `apiProvidedBy`

A relation with an [API](descriptor-format.md#kind-api) entity, typically from a
[Component](descriptor-format.md#kind-component).

These relations express that a component exposes an API - meaning that it hosts
callable endpoints from which you can consume that API.

This relation is commonly generated based on `spec.providesApis` of the
component or system in question.

### `consumesApi` and `apiConsumedBy`

A relation with an [API](descriptor-format.md#kind-api) entity, typically from a
[Component](descriptor-format.md#kind-component).

These relations express that a component consumes an API - meaning that it
depends on endpoints of the API.

This relation is commonly generated based on `spec.consumesApis` of the
component or system in question.

### `dependsOn` and `dependencyOf`

A relation denoting a dependency on another entity.

This relation is a general expression of being in need of that other entity for
an entity to function. It can for example be used to express that a website
component needs a library component as part of its build, or that a service
component uses a persistent storage resource.

### `parentOf` and `childOf`

A parent/child relation to build up a tree, used for example to describe the
organizational structure between [Groups](descriptor-format.md#kind-group).

This relation is commonly based on `spec.parent` and/or `spec.children`.

### `memberOf` and `hasMember`

A membership relation, typically for [Users](descriptor-format.md#kind-user) in
[Groups](descriptor-format.md#kind-group).

This relation is commonly based on `spec.memberOf`.

### `partOf` and `hasPart`

A relation with a [Domain](descriptor-format.md#kind-domain),
[System](descriptor-format.md#kind-system) or
[Component](descriptor-format.md#kind-component) entity, typically from a
[Component](descriptor-format.md#kind-component),
[API](descriptor-format.md#kind-api), or
[System](descriptor-format.md#kind-system).

These relations express that a component belongs to a larger component; a
component, API or resource belongs to a system; or that a system is grouped
under a domain.

This relation is commonly based on `spec.system` or `spec.domain`.
