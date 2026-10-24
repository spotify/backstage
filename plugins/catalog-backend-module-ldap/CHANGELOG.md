# @backstage/plugin-catalog-backend-module-ldap

## 0.12.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 0.12.10

### Patch Changes

- 916e5b2: Improved the performance of LDAP organization ingestion, especially for large directories, without changing the resulting catalog entities.
- 1a20364: Improved large LDAP organization refreshes by yielding to the event loop while resolving relations.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-catalog-common@1.2.1
  - @backstage/plugin-catalog-node@2.2.6

## 0.12.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1

## 0.12.10-next.0

### Patch Changes

- 916e5b2: Improved the performance of LDAP organization ingestion, especially for large directories, without changing the resulting catalog entities.
- 1a20364: Improved large LDAP organization refreshes by yielding to the event loop while resolving relations.
- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## 0.12.9

### Patch Changes

- 736d84e: Use locale-insensitive Unicode casing for consistent string handling across environments.
- Updated dependencies
  - @backstage/plugin-catalog-common@1.2.0
  - @backstage/catalog-model@1.10.1
  - @backstage/config@1.3.9
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5

## 0.12.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.2.0-next.0
  - @backstage/config@1.3.9-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1

## 0.12.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0

## 0.12.8

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/plugin-catalog-node@2.2.4

## 0.12.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0

## 0.12.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/plugin-catalog-node@2.2.3

## 0.12.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0

## 0.12.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-catalog-node@2.2.2

## 0.12.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0

## 0.12.5

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/config@1.3.8
  - @backstage/plugin-catalog-common@1.1.10

## 0.12.5-next.1

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.1
  - @backstage/plugin-catalog-node@2.2.1-next.1

## 0.12.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.10-next.0

## 0.12.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/config@1.3.7
  - @backstage/plugin-catalog-common@1.1.9

## 0.12.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0
  - @backstage/plugin-catalog-common@1.1.9-next.0

## 0.12.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1

## 0.12.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8

## 0.12.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/plugin-catalog-node@2.1.0
  - @backstage/catalog-model@1.7.7

## 0.12.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.2

## 0.12.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8

## 0.12.2

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-catalog-common@1.1.8

## 0.12.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1

## 0.12.2-next.0

### Patch Changes

- cfd8103: Updated imports to use stable catalog extension points from `@backstage/plugin-catalog-node` instead of the deprecated alpha exports.
- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.8-next.0

## 0.12.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1

## 0.12.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-catalog-node@1.20.1-next.1

## 0.12.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.7

## 0.12.0

### Minor Changes

- 980f240: Moved from `ldapjs` dependency to `ldapts`

  ### Breaking Changes

  **Type Migration**

  Custom transformers must now accept `Entry` from `ldapts` instead of `SearchEntry`
  from `ldapjs` The Entry type provides direct property access without need for
  `.object()` or `.raw()` methods.

  If you have custom user or group transformers, update the signature from:

  ```typescript
  (vendor: LdapVendor, config: UserConfig, entry: SearchEntry) =>
    Promise<UserEntity | undefined>;
  ```

  to

  ```typescript
  (vendor: LdapVendor, config: UserConfig, entry: Entry) =>
    Promise<UserEntity | undefined>;
  ```

  **Search Options**

  Updated LDAP search configuration `typesOnly: false` → `attributeValues: true`
  This inverts the boolean logic: `ldapjs` used negative form while `ldapts` uses
  positive form. Both achieve the same result: retrieving attribute values rather
  than just attribute names.

  Update LDAP search options in configuration from

  ```yaml
  options:
    typesOnly: false
  ```

  to

  ```yaml
  options:
    attributeValues: true
  ```

  **API Changes** Removed `LdapClient.searchStreaming()` method. Users should
  migrate to `LdapClient.search()` instead

  If you're using `searchStreaming` directly:

  ```typescript
  // Before
  await client.searchStreaming(dn, options, async entry => {
    // process each entry
  });

  // After
  const entries = await client.search(dn, options);
  for (const entry of entries) {
    // process each entry
  }
  ```

  > **_NOTE:_**: Both methods have always loaded all entries into memory. The
  > `searchStreaming` method was only needed internally to handle `ldapjs`'s
  > event-based API.

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## 0.12.0-next.1

### Minor Changes

- 980f240: Moved from `ldapjs` dependency to `ldapts`

  ### Breaking Changes

  **Type Migration**

  Custom transformers must now accept `Entry` from ldapts instead of `SearchEntry`
  from ldapjs The Entry type provides direct property access without need for
  `.object()` or `.raw()` methods.

  If you have custom user or group transformers, update the signature from:

  ```typescript
  (vendor: LdapVendor, config: UserConfig, entry: SearchEntry) =>
    Promise<UserEntity | undefined>;
  ```

  to

  ```typescript
  (vendor: LdapVendor, config: UserConfig, entry: Entry) =>
    Promise<UserEntity | undefined>;
  ```

  **Search Options**

  Updated LDAP search configuration `typesOnly: false` → `attributeValues: true`
  This inverts the boolean logic: ldapjs used negative form while ldapts uses
  positive form. Both achieve the same result: retrieving attribute values rather
  than just attribute names.

  Update LDAP search options in configuration from

  ```yaml
  options:
    typesOnly: false
  ```

  to

  ```yaml
  options:
    attributeValues: true
  ```

  **API Changes** Removed `LdapClient.searchStreaming()` method. Users should
  migrate to `LdapClient.search()` instead

  If you're using `searchStreaming` directly:

  ```typescript
  // Before
  await client.searchStreaming(dn, options, async entry => {
    // process each entry
  });

  // After
  const entries = await client.search(dn, options);
  for (const entry of entries) {
    // process each entry
  }
  ```

  > **_NOTE:_**: Both methods have always loaded all entries into memory. The
  > searchStreaming method was only needed internally to handle ldapjs's
  > event-based API.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1

## 0.11.11-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-common@1.1.7-next.0
  - @backstage/plugin-catalog-node@1.19.2-next.0

## 0.11.10

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-common@1.1.6
  - @backstage/plugin-catalog-node@1.19.1

## 0.11.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-catalog-common@1.1.6-next.0

## 0.11.9

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/types@1.2.2
  - @backstage/backend-plugin-api@1.4.3

## 0.11.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0-next.1

## 0.11.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0

## 0.11.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## 0.11.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.5

## 0.11.7

### Patch Changes

- 3507fcd: Just some more circular dep cleanup
- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/catalog-model@1.7.5
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-common@1.1.5
  - @backstage/plugin-catalog-node@1.17.2

## 0.11.7-next.0

### Patch Changes

- 3507fcd: Just some more circular dep cleanup
- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-catalog-common@1.1.5-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0

## 0.11.6

### Patch Changes

- 087d51d: Export LDAP vendor types and instances for testing custom transformers
- f07b0ad: Added the ability to configure disabling one side of the relations tree with LDAP.

  Groups have a `member` attribute and users have a `memberOf` attribute, however these can drift out of sync in some LDAP installations, leaving weird states in the Catalog as we collate these results together and deduplicate them.

  You can chose to optionally disable one side of these relationships, or even both by setting the respective mapping to `null` in your `app-config.yaml` for your groups and/or users:

  ```yaml
  catalog:
    providers:
      ldapOrg:
        default:
          target: ldaps://ds.example.net
          bind:
            dn: uid=ldap-reader-user,ou=people,ou=example,dc=example,dc=net
            secret: ${LDAP_SECRET}
          users:
            - dn: ou=people,ou=example,dc=example,dc=net
              options:
                filter: (uid=*)
              map:
                # this ensures that outgoing memberships from users is ignored
                memberOf: null
          groups:
            - dn: ou=access,ou=groups,ou=example,dc=example,dc=net
              options:
                filter: (&(objectClass=some-group-class)(!(groupType=email)))
              map:
                description: l
              set:
                metadata.customField: 'hello'
              map:
                # this ensures that outgoing memberships from groups is ignored
                members: null
  ```

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4

## 0.11.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4

## 0.11.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0

## 0.11.5

### Patch Changes

- e253d1d: Improves error reporting for missing metadata.name in LDAP catalog provider.
- Updated dependencies
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4

## 0.11.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.2

## 0.11.5-next.2

### Patch Changes

- e253d1d: Improves error reporting for missing metadata.name in LDAP catalog provider.
- Updated dependencies
  - @backstage/config@1.3.2
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.1

## 0.11.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0

## 0.11.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.11.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.11.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.11.3

### Patch Changes

- e43f41b: Fix `config.d.ts` for `ldapOrg` being incorrect. The documentation says a single
  object or an array are accepted, but the definition only allows an object.
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1

## 0.11.3-next.2

### Patch Changes

- e43f41b: Fix `config.d.ts` for `ldapOrg` being incorrect. The documentation says a single
  object or an array are accepted, but the definition only allows an object.
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1

## 0.11.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.1-next.1

## 0.11.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.16.1-next.0

## 0.11.2

### Patch Changes

- eb80a1a: Minor doc string update
- 636744a: Make `ldapOrg` config key optional
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-catalog-node@1.16.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.11.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.11.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.16.0-next.2

## 0.11.2-next.1

### Patch Changes

- 636744a: Make `ldapOrg` config key optional
- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.11.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.3

## 0.11.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.3
  - @backstage/plugin-catalog-node@1.15.1

## 0.11.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/plugin-catalog-common@1.1.3-next.0

## 0.11.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.2
  - @backstage/plugin-catalog-node@1.15.1-next.0

## 0.11.0

### Minor Changes

- 732700a: Updated fix for ldap entity mapping which doesn't require extra config setting of dnCaseSensitive
- 95ac4a2: Add new ldap vendor config 'LLDAP'

### Patch Changes

- 5f04976: Fixed a bug that caused missing code in published packages.
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.2

## 0.11.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.2-next.0

## 0.11.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.1

## 0.11.0-next.0

### Minor Changes

- 732700a: Updated fix for ldap entity mapping which doesn't require extra config setting of dnCaseSensitive
- 95ac4a2: Add new ldap vendor config 'LLDAP'

### Patch Changes

- 5f04976: Fixed a bug that caused missing code in published packages.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-common@1.1.1
  - @backstage/plugin-catalog-node@1.14.1-next.0

## 0.10.0

### Minor Changes

- 415aeb3: Add Support for Google LDAP Vendor

### Patch Changes

- 884a86c: Added a `dnCaseSensitive` flag to support LDAP servers with mixed-case attributes.
- 4e58bc7: Upgrade to uuid v11 internally
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5
  - @backstage/plugin-catalog-common@1.1.1

## 0.10.0-next.2

### Minor Changes

- 415aeb3: Add Support for Google LDAP Vendor

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0

## 0.9.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.14.0-next.1

## 0.9.2-next.0

### Patch Changes

- 884a86c: Added a `dnCaseSensitive` flag to support LDAP servers with mixed-case attributes.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0

## 0.9.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0

## 0.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0

## 0.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.1-next.0

## 0.9.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- b50e4a8: Add support for optional configuration of `dnAttributeName` and `uuidAttributeName` in LDAP vendor
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.9.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.2

## 0.9.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.1

## 0.9.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-catalog-node@1.12.7-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26

## 0.8.0

### Minor Changes

- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-catalog-node@1.12.5
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26

## 0.7.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.26-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.3

## 0.7.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.2
  - @backstage/plugin-catalog-common@1.0.26-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.7.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/plugin-catalog-common@1.0.26-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.7.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.5-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.25

## 0.7.0

### Minor Changes

- cb32ca7: **BREAKING**: `readLdapOrg` and the `LdapProviderConfig` type now always accept arrays of user and group configs, not just single items.

  Added support for single ldap catalog provider to provide list and undefined user and group bindings next to standard single one.

### Patch Changes

- 083eaf9: Fix bug where ISO durations could no longer be used for schedules
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-tasks@0.5.27
  - @backstage/plugin-catalog-node@1.12.4
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.7.0-next.1

### Minor Changes

- cb32ca7: **BREAKING**: `readLdapOrg` and the `LdapProviderConfig` type now always accept arrays of user and group configs, not just single items.

  Added support for single ldap catalog provider to provide list and undefined user and group bindings next to standard single one.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/plugin-catalog-node@1.12.4-next.1

## 0.6.2-next.0

### Patch Changes

- 083eaf9: Fix bug where ISO durations could no longer be used for schedules
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/plugin-catalog-node@1.12.3-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.24

## 0.6.0

### Minor Changes

- debcc8c: Migrate LDAP catalog module to the new backend system.

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/plugin-catalog-node@1.12.1
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.6.0-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-catalog-common@1.0.24-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.2
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.6.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-catalog-node@1.12.1-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.23

## 0.6.0-next.1

### Minor Changes

- debcc8c: Migrate LDAP catalog module to the new backend system.

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.0

## 0.5.35-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.23

## 0.5.34

### Patch Changes

- 7699967: Remove dependency to Winston Logger and use Backstage LoggerService instead
- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-catalog-common@1.0.23

## 0.5.34-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0-next.2

## 0.5.34-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-catalog-node@1.11.2-next.1

## 0.5.34-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/plugin-catalog-common@1.0.23-next.0
  - @backstage/plugin-catalog-node@1.11.2-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.33

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.22
  - @backstage/plugin-catalog-node@1.11.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22

## 0.5.33-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-catalog-node@1.11.1-next.1

## 0.5.33-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-catalog-node@1.11.1-next.0

## 0.5.32

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.11.0
  - @backstage/backend-tasks@0.5.21
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22

## 0.5.31

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.10.0
  - @backstage/backend-tasks@0.5.20
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22

## 0.5.30

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.9.0

## 0.5.29

### Patch Changes

- 4b4bbf7: Add TLS support to ingest GSuite LDAP data
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.8.0
  - @backstage/backend-tasks@0.5.19
  - @backstage/catalog-model@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22

## 0.5.29-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.8.0-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.1

## 0.5.29-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## 0.5.28-next.0

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.0

## 0.5.25

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.15
  - @backstage/catalog-model@1.4.4
  - @backstage/plugin-catalog-node@1.7.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.21

## 0.5.25-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-catalog-node@1.6.2-next.3
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0

## 0.5.25-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0

## 0.5.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.1

## 0.5.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.20

## 0.5.24

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/backend-tasks@0.5.14
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.20

## 0.5.24-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.1-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.5.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-catalog-node@1.6.1-next.1

## 0.5.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.19

## 0.5.23

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.19

## 0.5.23-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.6.0-next.3

## 0.5.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## 0.5.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1

## 0.5.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/plugin-catalog-node@1.5.1-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## 0.5.22

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0
  - @backstage/backend-tasks@0.5.12
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## 0.5.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-catalog-node@1.5.0-next.2

## 0.5.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## 0.5.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-catalog-node@1.4.8-next.0

## 0.5.21

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## 0.5.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-catalog-node@1.4.7-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17-next.0

## 0.5.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/plugin-catalog-node@1.4.6-next.1
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.16

## 0.5.20-next.0

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/config@1.1.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-catalog-node@1.4.6-next.0

## 0.5.18

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.8
  - @backstage/config@1.1.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.4.4

## 0.5.18-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/plugin-catalog-common@1.0.16-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-catalog-node@1.4.4-next.3

## 0.5.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1

## 0.5.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-catalog-node@1.4.4-next.1
  - @backstage/plugin-catalog-common@1.0.16-next.0
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.5.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.3-next.0

## 0.5.15

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.4.1
  - @backstage/backend-tasks@0.5.5
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 0.5.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## 0.5.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.4.1-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 0.5.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.1-next.0

## 0.5.14

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-node@1.4.0
  - @backstage/backend-tasks@0.5.4
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15

## 0.5.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.4.0-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15-next.0

## 0.5.13

### Patch Changes

- Updated dependencies
  - @backstage/types@1.1.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-catalog-node@1.3.7
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.14

## 0.5.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.14-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.2

## 0.5.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.0-next.0
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.1
  - @backstage/plugin-catalog-common@1.0.14-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.5.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.3.7-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 0.5.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-catalog-node@1.3.6
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 0.5.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/config@1.0.7

## 0.5.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-catalog-node@1.3.6-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 0.5.11

### Patch Changes

- c9a0fdcd2c8: Fix deprecated types.
- Updated dependencies
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-catalog-node@1.3.5
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 0.5.11-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.1
  - @backstage/plugin-catalog-node@1.3.5-next.3

## 0.5.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.2

## 0.5.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.1

## 0.5.11-next.0

### Patch Changes

- c9a0fdcd2c8: Fix deprecated types.
- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/plugin-catalog-node@1.3.5-next.0

## 0.5.10

### Patch Changes

- e675f902980: Make sure to not use deprecated exports from `@backstage/plugin-catalog-backend`
- Updated dependencies
  - @backstage/backend-tasks@0.5.0
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.4
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.5.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/plugin-catalog-backend@1.8.0-next.2
  - @backstage/config@1.0.7-next.0

## 0.5.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/plugin-catalog-backend@1.8.0-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2

## 0.5.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.0-next.0
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.5.9

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2
  - @backstage/catalog-model@1.2.0
  - @backstage/backend-tasks@0.4.3
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.5.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.5.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.5.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/plugin-catalog-backend@1.7.2-next.0
  - @backstage/backend-tasks@0.4.3-next.0

## 0.5.7

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- Updated dependencies
  - @backstage/catalog-model@1.1.5
  - @backstage/backend-tasks@0.4.1
  - @backstage/plugin-catalog-backend@1.7.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.5.7-next.2

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- Updated dependencies
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/plugin-catalog-backend@1.7.0-next.2
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.5.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.5.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.5.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5

## 0.5.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.3
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/types@1.0.2-next.1

## 0.5.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/types@1.0.2-next.1

## 0.5.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1

## 0.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0

## 0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.5.1
  - @backstage/backend-tasks@0.3.7
  - @backstage/catalog-model@1.1.3
  - @backstage/types@1.0.1
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/plugin-catalog-backend@1.5.1-next.1
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/types@1.0.1-next.0

## 0.5.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.5.1-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.5.4

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/plugin-catalog-backend@1.5.0
  - @backstage/backend-tasks@0.3.6
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/types@1.0.0

## 0.5.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.5.0-next.2
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/types@1.0.0

## 0.5.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-backend@1.4.1-next.1

## 0.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/plugin-catalog-backend@1.4.1-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/types@1.0.0

## 0.5.3

### Patch Changes

- 7fa54c3c77: Added ae-dir LDAP vendor to correctly extract DN.
- c54fcea9af: Now the `searchStream` method in LDAP client awaits the callbacks
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.4.0
  - @backstage/backend-tasks@0.3.5
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1

## 0.5.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/plugin-catalog-backend@1.4.0-next.3
  - @backstage/backend-tasks@0.3.5-next.1

## 0.5.3-next.1

### Patch Changes

- 7fa54c3c77: Added ae-dir LDAP vendor to correctly extract DN.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.4.0-next.1

## 0.5.3-next.0

### Patch Changes

- c54fcea9af: Now the `searchStream` method in LDAP client awaits the callbacks
- Updated dependencies
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/plugin-catalog-backend@1.3.2-next.0

## 0.5.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.4
  - @backstage/plugin-catalog-backend@1.3.1

## 0.5.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.4-next.0
  - @backstage/plugin-catalog-backend@1.3.1-next.0

## 0.5.1

### Patch Changes

- ddfd566606: Fix mapping between users and groups for FreeIPA when using the LdapOrgProcessor
- fbfbff6bf7: Add possibility to resolve relations by RDN, in addition to UUID and DN
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0
  - @backstage/catalog-model@1.1.0
  - @backstage/backend-tasks@0.3.3
  - @backstage/errors@1.1.0

## 0.5.1-next.2

### Patch Changes

- ddfd566606: Fix mapping between users and groups for FreeIPA when using the LdapOrgProcessor
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0-next.3
  - @backstage/backend-tasks@0.3.3-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 0.5.1-next.1

### Patch Changes

- fbfbff6bf7: Add possibility to resolve relations by RDN, in addition to UUID and DN
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.1
  - @backstage/backend-tasks@0.3.3-next.1

## 0.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/backend-tasks@0.3.3-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.0

## 0.5.0

### Minor Changes

- 1f83f0bc84: Added the possibility to pass TLS configuration to ldap connection

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.2.0
  - @backstage/backend-tasks@0.3.2
  - @backstage/catalog-model@1.0.3

## 0.5.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/catalog-model@1.0.3-next.0

## 0.5.0-next.0

### Minor Changes

- 1f83f0bc84: Added the possibility to pass TLS configuration to ldap connection

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.0
  - @backstage/plugin-catalog-backend@1.2.0-next.0

## 0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.2
  - @backstage/backend-tasks@0.3.1
  - @backstage/config@1.0.1
  - @backstage/catalog-model@1.0.2

## 0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.2-next.2
  - @backstage/backend-tasks@0.3.1-next.1
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.2-next.0
  - @backstage/backend-tasks@0.3.1-next.0

## 0.4.2

### Patch Changes

- ebc0aef2c6: Changed relationship creation in LDAP data processor to leverage entityRefs instead of metadata.name
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0
  - @backstage/backend-tasks@0.3.0
  - @backstage/catalog-model@1.0.1

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0-next.1
  - @backstage/backend-tasks@0.3.0-next.1

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-backend@1.0.1-next.0
  - @backstage/backend-tasks@0.2.2-next.0

## 0.4.1

### Patch Changes

- 132189e466: Updated the code to handle User kind `spec.memberOf` now being optional.
- a6c367d937: Add config support for LDAP search options.
- 74375be2c6: Updated to no longer rely on the `RecursivePartial` export from `@backstage/plugin-catalog-backend`.
- e949d68059: Made sure to move the catalog-related github and ldap config into their right places
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.0.0
  - @backstage/backend-tasks@0.2.1
  - @backstage/catalog-model@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0

## 0.4.0

### Minor Changes

- 9461f73643: **BREAKING**: Added a `schedule` field to `LdapOrgEntityProvider.fromConfig`, which is required. If you want to retain the old behavior of scheduling the provider manually, you can set it to the string value `'manual'`. But you may want to leverage the ability to instead pass in the recurring task schedule information directly. This will allow you to simplify your backend setup code to not need an intermediate variable and separate scheduling code at the bottom.

  All things said, a typical setup might now look as follows:

  ```diff
   // packages/backend/src/plugins/catalog.ts
  +import { Duration } from 'luxon';
  +import { LdapOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-ldap';
   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  // The target parameter below needs to match the ldap.providers.target
  +  // value specified in your app-config.
  +  builder.addEntityProvider(
  +    LdapOrgEntityProvider.fromConfig(env.config, {
  +      id: 'our-ldap-master',
  +      target: 'ldaps://ds.example.net',
  +      logger: env.logger,
  +      schedule: env.scheduler.createScheduledTaskRunner({
  +        frequency: Duration.fromObject({ minutes: 60 }),
  +        timeout: Duration.fromObject({ minutes: 15 }),
  +      }),
  +    }),
  +  );
  ```

### Patch Changes

- f751e84572: Ignore search referrals instead of throwing an error.
- Updated dependencies
  - @backstage/backend-tasks@0.2.0
  - @backstage/plugin-catalog-backend@0.24.0
  - @backstage/catalog-model@0.13.0

## 0.4.0-next.0

### Minor Changes

- 9461f73643: **BREAKING**: Added a `schedule` field to `LdapOrgEntityProvider.fromConfig`, which is required. If you want to retain the old behavior of scheduling the provider manually, you can set it to the string value `'manual'`. But you may want to leverage the ability to instead pass in the recurring task schedule information directly. This will allow you to simplify your backend setup code to not need an intermediate variable and separate scheduling code at the bottom.

  All things said, a typical setup might now look as follows:

  ```diff
   // packages/backend/src/plugins/catalog.ts
  +import { Duration } from 'luxon';
  +import { LdapOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-ldap';
   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  // The target parameter below needs to match the ldap.providers.target
  +  // value specified in your app-config.
  +  builder.addEntityProvider(
  +    LdapOrgEntityProvider.fromConfig(env.config, {
  +      id: 'our-ldap-master',
  +      target: 'ldaps://ds.example.net',
  +      logger: env.logger,
  +      schedule: env.scheduler.createScheduledTaskRunner({
  +        frequency: Duration.fromObject({ minutes: 60 }),
  +        timeout: Duration.fromObject({ minutes: 15 }),
  +      }),
  +    }),
  +  );
  ```

### Patch Changes

- f751e84572: Ignore search referrals instead of throwing an error.
- Updated dependencies
  - @backstage/backend-tasks@0.2.0-next.0
  - @backstage/plugin-catalog-backend@0.24.0-next.0
  - @backstage/catalog-model@0.13.0-next.0

## 0.3.15

### Patch Changes

- 83a83381b0: Use the new `processingResult` export from the catalog backend
- 66aa05c23c: Fixed bug in Catalog LDAP module to acknowledge page events to continue receiving entries if pagePause=true
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/plugin-catalog-backend@0.23.0

## 0.3.14

### Patch Changes

- ed09ad8093: Updated usage of the `LocationSpec` type from `@backstage/catalog-model`, which is deprecated.
- 25e97e7242: Minor wording update
- df61ca71dd: Implemented required `getProcessorName` method for catalog processor.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.22.0
  - @backstage/catalog-model@0.11.0

## 0.3.13

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 244d24ebc4: Import `Location` from the `@backstage/catalog-client` package.
- 27eccab216: Replaces use of deprecated catalog-model constants.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.4
  - @backstage/errors@0.2.1
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2

## 0.3.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.3

## 0.3.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.3-next.0

## 0.3.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.2

## 0.3.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.2-next.0

## 0.3.10

### Patch Changes

- 3368dc6b62: Make sure to clone objects sent to `ldapjs` since the library modifies them
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.0
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10

## 0.3.10-next.0

### Patch Changes

- 3368dc6b62: Make sure to clone objects sent to `ldapjs` since the library modifies them
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.0-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/catalog-model@0.9.10-next.0

## 0.3.9

### Patch Changes

- 2b19fd2e94: Make sure to avoid accidental data sharing / mutation of `set` values
- 722681b1b1: Clean up API report
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/plugin-catalog-backend@0.20.0
  - @backstage/errors@0.2.0
  - @backstage/catalog-model@0.9.9

## 0.3.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.19.0

## 0.3.7

### Patch Changes

- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/plugin-catalog-backend@0.18.0

## 0.3.6

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.2
  - @backstage/config@0.1.11
  - @backstage/errors@0.1.4
  - @backstage/catalog-model@0.9.6

## 0.3.5

### Patch Changes

- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.1
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.0

## 0.3.3

### Patch Changes

- a31afc5b62: Replace slash stripping regexp with trimEnd to remove CodeQL warning
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.16.0
  - @backstage/catalog-model@0.9.4

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.15.0

## 0.3.1

### Patch Changes

- 8b016ce67b: Alters LDAP processor to handle one SearchEntry at a time
- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.14.0
  - @backstage/catalog-model@0.9.3
  - @backstage/config@0.1.10

## 0.3.0

### Minor Changes

- 54b441abe: Introduce `LdapOrgEntityProvider` as an alternative to `LdapOrgReaderProcessor`. This also changes the `LdapClient` interface to require a logger.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.3
  - @backstage/config@0.1.7

## 0.2.2

### Patch Changes

- 2a2a2749b: chore(deps): bump `@types/ldapjs` from 1.0.10 to 2.2.0
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.1

## 0.2.1

### Patch Changes

- afe3e4b54: Expose missing types used by the custom transformers
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.0

## 0.2.0

### Minor Changes

- b055ef88a: Add extension points to the `LdapOrgReaderProcessor` to make it possible to do more advanced modifications
  of the ingested users and groups.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0
  - @backstage/plugin-catalog-backend@0.12.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.11.0
