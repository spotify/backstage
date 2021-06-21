---
id: org
title: LDAP Organizational Data
sidebar_label: Org Data
# prettier-ignore: ""
description: Setting up ingestion of organizational data from LDAP
---

The Backstage catalog can be set up to ingest organizational data - users and
groups - directly from an LDAP compatible service. The result is a hierarchy of
[`User`](../../features/software-catalog/descriptor-format.md#kind-user) and
[`Group`](../../features/software-catalog/descriptor-format.md#kind-group) kind
entities that mirror your org setup.

## Installation

The processor that performs the import, `LdapOrgReaderProcessor`, comes
installed with the default setup of Backstage.

If you replace the set of processors in your installation using that facility of
the catalog builder class, you can import and add it as follows.

```ts
// Typically in packages/backend/src/plugins/catalog.ts
import { LdapOrgReaderProcessor } from '@backstage/plugin-catalog-backend';

builder.replaceProcessors(
  LdapOrgReaderProcessor.fromConfig(config, { logger }),
  // ...
);
```

## Configuration

The following configuration is a small example of how a setup could look for
importing groups and users from a corporate LDAP server.

```yaml
catalog:
  locations:
    - type: ldap-org
      target: ldaps://ds.example.net
  processors:
    ldapOrg:
      providers:
        - target: ldaps://ds.example.net
          bind:
            dn: uid=ldap-reader-user,ou=people,ou=example,dc=example,dc=net
            secret: ${LDAP_SECRET}
          users:
            dn: ou=people,ou=example,dc=example,dc=net
            options:
              filter: (uid=*)
            map:
              description: l
            set:
              metadata.customField: 'hello'
          groups:
            dn: ou=access,ou=groups,ou=example,dc=example,dc=net
            options:
              filter: (&(objectClass=some-group-class)(!(groupType=email)))
            map:
              description: l
            set:
              metadata.customField: 'hello'
```

Locations point out the specific org(s) you want to import. The `type` of these
locations must be `ldap-org`, and the `target` must point to the exact URL
(starting with `ldap://` or `ldaps://`) of the targeted LDAP server. You can
have several such location entries if you want, but typically you will have just
one.

The processor itself is configured in the other block, under
`catalog.processors.ldapOrg`. There may be many providers, each targeting a
specific `target` which is supposed to be on the same form as the location
`target`.

These config blocks have a lot of options in them, so we will describe each
"root" key within the block separately.

### target

This is the URL of the targeted server, typically on the form
`ldaps://ds.example.net` for SSL enabled servers or `ldap://ds.example.net`
without SSL.

### bind

The bind block specifies how the plugin should bind (essentially, to
authenticate) towards the server. It has the following fields.

```yaml
dn: uid=ldap-reader-user,ou=people,ou=example,dc=example,dc=net
secret: ${LDAP_SECRET}
```

The `dn` is the full LDAP Distinguished Name for the user that the plugin
authenticates itself as. At this point, only regular user based authentication
is supported.

The `secret` is the password of the same user. In this example, it is given in
the form of an environment variable `LDAP_SECRET`, that has to be set when the
backend starts.

### users

The `users` block defines the settings that govern the reading and
interpretation of users. Its fields are explained in separate sections below.

#### users.dn

The DN under which users are stored, e.g.
`ou=people,ou=example,dc=example,dc=net`.

#### users.options

The search options to use when sending the query to the server, when reading all
users. All of the options are shown below, with their default values, but they
are all optional.

```yaml
options:
  # One of 'base', 'one', or 'sub'.
  scope: one
  # The filter is the one that you commonly will want to specify explicitly. It
  # is a string on the standard LDAP query format. Use it to select out the set
  # of users that are of actual interest to ingest. For example, you may want
  # to filter out disabled users.
  filter: (uid=*)
  # The attribute selectors for each item, as passed to the LDAP server.
  attributes: ['*', '+']
  # This field is either 'false' to disable paging when reading from the
  # server, or an object on the form '{ pageSize: 100, pagePause: true }' that
  # specifies the details of how the paging shall work.
  paged: false
```

#### users.set

This optional piece lets you specify a number of JSON paths (on a.b.c form) and
hard coded values to set on those paths. This can be useful for example if you
want to hard code a namespace or similar on the generated entities.

```yaml
set:
  # Just an example; the key and value can be anything
  metadata.namespace: 'ldap'
```

#### users.map

Mappings from well known entity fields, to LDAP attribute names. This is where
you are able to define how to interpret the attributes of each LDAP result item,
and to move them into the corresponding entity fields. All of the options are
shown below, with their default values, but they are all optional.

If you leave out an optional mapping, it will still be copied using that default
value. For example, even if you do not put in the field `displayName` in your
config, the processor will still copy the attribute `cn` into the entity field
`spec.profile.displayName`.

```yaml
map:
  # The name of the attribute that holds the relative
  # distinguished name of each entry.
  rdn: uid
  # The name of the attribute that shall be used for the value of
  # the metadata.name field of the entity.
  name: uid
  # The name of the attribute that shall be used for the value of
  # the metadata.description field of the entity.
  description: description
  # The name of the attribute that shall be used for the value of
  # the spec.profile.displayName field of the entity.
  displayName: cn
  # The name of the attribute that shall be used for the value of
  # the spec.profile.email field of the entity.
  email: mail
  # The name of the attribute that shall be used for the value of
  # the spec.profile.picture field of the entity.
  picture: <nothing, left out>
  # The name of the attribute that shall be used for the values of
  # the spec.memberOf field of the entity.
  memberOf: memberOf
```

### groups

The `groups` block defines the settings that govern the reading and
interpretation of groups. Its fields are explained in separate sections below.

#### groups.dn

The DN under which groups are stored, e.g.
`ou=people,ou=example,dc=example,dc=net`.

#### groups.options

The search options to use when sending the query to the server, when reading all
groups. All of the options are shown below, with their default values, but they
are all optional.

```yaml
options:
  # One of 'base', 'one', or 'sub'.
  scope: one
  # The filter is the one that you commonly will want to specify explicitly. It
  # is a string on the standard LDAP query format. Use it to select out the set
  # of groups that are of actual interest to ingest. For example, you may want
  # to filter out disabled groups.
  filter: (&(objectClass=some-group-class)(!(groupType=email)))
  # The attribute selectors for each item, as passed to the LDAP server.
  attributes: ['*', '+']
  # This field is either 'false' to disable paging when reading from the
  # server, or an object on the form '{ pageSize: 100, pagePause: true }' that
  # specifies the details of how the paging shall work.
  paged: false
```

#### groups.set

This optional piece lets you specify a number of JSON paths (on a.b.c form) and
hard coded values to set on those paths. This can be useful for example if you
want to hard code a namespace or similar on the generated entities.

```yaml
set:
  # Just an example; the key and value can be anything
  metadata.namespace: 'ldap'
```

#### groups.map

Mappings from well known entity fields, to LDAP attribute names. This is where
you are able to define how to interpret the attributes of each LDAP result item,
and to move them into the corresponding entity fields. All of the options are
shown below, with their default values, but they are all optional.

If you leave out an optional mapping, it will still be copied using that default
value. For example, even if you do not put in the field `displayName` in your
config, the processor will still copy the attribute `cn` into the entity field
`spec.profile.displayName`. If the target field is optional, such as the display
name, the importer will accept missing attributes and just leave the target
field unset. If the target field is mandatory, such as the name of the entity,
validation will fail if the source attribute is missing.

```yaml
map:
  # The name of the attribute that holds the relative
  # distinguished name of each entry. This value is copied into a
  # well known annotation to be able to query by it later.
  rdn: cn
  # The name of the attribute that shall be used for the value of
  # the metadata.name field of the entity.
  name: cn
  # The name of the attribute that shall be used for the value of
  # the metadata.description field of the entity.
  description: description
  # The name of the attribute that shall be used for the value of
  # the spec.type field of the entity.
  type: groupType
  # The name of the attribute that shall be used for the value of
  # the spec.profile.displayName field of the entity.
  displayName: cn
  # The name of the attribute that shall be used for the value of
  # the spec.profile.email field of the entity.
  email: <nothing, left out>
  # The name of the attribute that shall be used for the value of
  # the spec.profile.picture field of the entity.
  picture: <nothing, left out>
  # The name of the attribute that shall be used for the values of
  # the spec.parent field of the entity.
  memberOf: memberOf
  # The name of the attribute that shall be used for the values of
  # the spec.children field of the entity.
  members: member
```
