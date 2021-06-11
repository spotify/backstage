# @backstage/plugin-catalog-backend

## 0.10.1

### Patch Changes

- e7a5a3474: Only validate the envelope for emitted entities, and defer full validation to when they get processed later on.
- 63a432e9c: Skip deletion of bootstrap location when running the new catalog.
- f46a9e82d: Move dependency to `@microsoft/microsoft-graph-types` from `@backstage/plugin-catalog`
  to `@backstage/plugin-catalog-backend`.
- Updated dependencies [ebe802bc4]
- Updated dependencies [49d7ec169]
  - @backstage/catalog-model@0.8.1
  - @backstage/integration@0.5.5

## 0.10.0

### Minor Changes

- 0fd4ea443: Updates the `GithubCredentialsProvider` to return the token type, it can either be `token` or `app` depending on the authentication method.

  Update the `GithubOrgReaderProcessor` NOT to query for email addresses if GitHub Apps is used for authentication, this is due to inconsistencies in the GitHub API when using server to server communications and installation tokens. https://github.community/t/api-v4-unable-to-retrieve-email-resource-not-accessible-by-integration/13831/4 for more info.

  **Removes** deprecated GithubOrgReaderProcessor provider configuration(`catalog.processors.githubOrg`). If you're using the deprecated config section make sure to migrate to [integrations](https://backstage.io/docs/integrations/github/locations) instead.

### Patch Changes

- add62a455: Foundation for standard entity status values
- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/integration@0.5.4
  - @backstage/catalog-client@0.3.12
  - @backstage/catalog-model@0.8.0

## 0.9.1

### Patch Changes

- 50a5348b7: Fix error handling in `LdapOrgReaderProcessor`, and support complex paging options
- 1b8e28aed: Resolve the `target` for glob `file` locations correctly
- dcd5a93a9: Correctly add `<source>/project-slug` annotation for new catalog-info.yaml PRs based on SCM integration.
- f7f7783a3: Add Owner field in template card and new data distribution
  Add spec.owner as optional field into TemplateV1Alpha and TemplateV1Beta Schema
  Add relations ownedBy and ownerOf into Template entity
  Template documentation updated
- 62579ced6: Skip adding entries to the `entities_search` table if their `key` exceeds a length limit.
- Updated dependencies [f7f7783a3]
- Updated dependencies [c7dad9218]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5001de908]
  - @backstage/catalog-model@0.7.10
  - @backstage/backend-common@0.8.1
  - @backstage/integration@0.5.3

## 0.9.0

### Minor Changes

- 9a207f052: Port `GithubOrgReaderProcessor` to support configuration via
  [`integrations`](https://backstage.io/docs/integrations/github/locations) in
  addition to [`catalog.processors.githubOrg.providers`](https://backstage.io/docs/integrations/github/org#configuration).
  The `integrations` package supports authentication with both personal access
  tokens and GitHub apps.

  This deprecates the `catalog.processors.githubOrg.providers` configuration.
  A [`integrations` configuration](https://backstage.io/docs/integrations/github/locations)
  for the same host takes precedence over the provider configuration.
  You might need to add additional scopes for the credentials.

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9

## 0.8.2

### Patch Changes

- b219821a0: Expose `BitbucketRepositoryParser` introduced in [#5295](https://github.com/backstage/backstage/pull/5295)
- 227439a72: Add support for non-organization accounts in GitHub Discovery
- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/integration@0.5.2
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.8.1

### Patch Changes

- a99e0bc42: Entity lifecycle and owner are now indexed by the `DefaultCatalogCollator`. A `locationTemplate` may now optionally be provided to its constructor to reflect a custom catalog entity path in the Backstage frontend.
- Updated dependencies [e1e757569]
  - @backstage/plugin-search-backend-node@0.1.4

## 0.8.0

### Minor Changes

- 5fe62f124: Fix the schema / code mismatch in LDAP `set` config

### Patch Changes

- 09b5fcf2e: GithubDiscoveryProcessor now excludes archived repositories so they won't be added to Backstage.
- c2306f898: Externalize repository processing for BitbucketDiscoveryProcessor.

  Add an extension point where you can customize how a matched Bitbucket repository should
  be processed. This can for example be used if you want to generate the catalog-info.yaml
  automatically based on other files in a repository, while taking advantage of the
  build-in repository crawling functionality.

  `BitbucketDiscoveryProcessor.fromConfig` now takes an optional parameter `options.parser` where
  you can customize the logic for each repository found. The default parser has the same
  behaviour as before, where it emits an optional location for the matched repository
  and lets the other processors take care of further processing.

  ```typescript
  const customRepositoryParser: BitbucketRepositoryParser = async function* customRepositoryParser({
    client,
    repository,
  }) {
    // Custom logic for interpret the matching repository.
    // See defaultRepositoryParser for an example
  };

  const processor = BitbucketDiscoveryProcessor.fromConfig(env.config, {
    parser: customRepositoryParser,
    logger: env.logger,
  });
  ```

- Updated dependencies [94da20976]
- Updated dependencies [b9b2b4b76]
- Updated dependencies [d8cc7e67a]
- Updated dependencies [99fbef232]
- Updated dependencies [ab07d77f6]
- Updated dependencies [d367f63b5]
- Updated dependencies [937ed39ce]
- Updated dependencies [b42531cfe]
- Updated dependencies [9a9e7a42f]
- Updated dependencies [50ce875a0]
  - @backstage/core@0.7.6
  - @backstage/plugin-search-backend-node@0.1.3
  - @backstage/backend-common@0.6.3

## 0.7.1

### Patch Changes

- 017192ee8: Add support for configure an LDAP query filter on multiple lines.
- 5d0740563: Implemented missing support for the dependsOn/dependencyOf relationships
  between `Component` and `Resource` catalog model objects.

  Added support for generating the relevant relationships to the
  `BuiltinKindsEntityProcessor`, and added simple support for fetching
  relationships between `Components` and `Resources` for rendering in the
  system diagram. All catalog-model changes backwards compatible.

- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
  - @backstage/catalog-model@0.7.7

## 0.7.0

### Minor Changes

- 676ede643: DELETE on an entity now just deletes the entity, rather than removing all related entities and the location
- f1b2c1d2c: Add `readonly` mode to catalog backend

  This change adds a `catalog.readonly` field in `app-config.yaml` that can be used to configure the catalog in readonly mode which effectively disables the possibility of adding new components to the catalog after startup.

  When in `readonly` mode only locations configured in `catalog.locations` are loaded and served.
  By default `readonly` is disabled which represents the current functionality where locations can be added at run-time.

  This change requires the config API in the router which requires a change to `createRouter`.

  ```diff
     return await createRouter({
       entitiesCatalog,
       locationsCatalog,
       higherOrderOperation,
       locationAnalyzer,
       logger: env.logger,
  +    config: env.config,
     });
  ```

### Patch Changes

- 29e1789e1: Make sure that Group `spec.members` is taken into account when filling out an org hierarchy
- 8488a1a96: Added support for the "members" field of the Group entity, allowing specification of
  direct members from the Group side of the relationship. Added support to the
  `BuiltinKindsEntityProcessor` to generate the appropriate relationships.
- 6b2d54fd6: Fix mapping between users and groups for Microsoft Active Directories when using the LdapOrgProcessor
- 44590510d: Add Bitbucket Server discovery processor.
- Updated dependencies [8488a1a96]
- Updated dependencies [37e3a69f5]
  - @backstage/catalog-model@0.7.5
  - @backstage/backend-common@0.6.1

## 0.6.7

### Patch Changes

- f47e11427: Log how many repositories were actually matching in `GithubDiscoveryProcessor`
- c862b3f36: Introduce pagination in the /entities catalog endpoint.

  Pagination is requested using query parameters. Currently supported parameters, all optional, are:

  - `limit` - an integer number of entities to return, at most
  - `offset` - an integer number of entities to skip over at the start
  - `after` - an opaque string cursor as returned by a previous paginated request

  Example request:

  `GET /entities?limit=100`

  Example response:

  ```
  200 OK
  Content-Type: application/json; charset=utf-8
  Link: </entities?limit=100&after=eyJsaW1pdCI6Miwib2Zmc2V0IjoyfQ%3D%3D>; rel="next"
  <more headers>

  [{"metadata":{...
  ```

  Note the Link header. It contains the URL (path and query part, relative to the catalog root) to use for requesting the next page.
  It uses the `after` cursor to point out the end of the previous page. If the Link header is not present, there is no more data to read.

  The current implementation is naive and encodes offset/limit in the cursor implementation, so it is not robust in the face of overlapping
  changes to the catalog. This can be improved separately in the future without having to change the calling patterns.

- Updated dependencies [4d248725e]
  - @backstage/plugin-search-backend-node@0.1.2

## 0.6.6

### Patch Changes

- 010aed784: Add `AnnotateScmSlugEntityProcessor` that automatically adds the
  `github.com/project-slug` annotation for components coming from GitHub.

  The processor is optional and not automatically registered in the catalog
  builder. To add it to your instance, add it to your `CatalogBuilder` using
  `addProcessor()`:

  ```typescript
  const builder = new CatalogBuilder(env);
  builder.addProcessor(AnnotateScmSlugEntityProcessor.fromConfig(env.config));
  ```

- 4bc98a5b9: Refactor CodeOwnersProcessor to use ScmIntegrations
- d2f4efc5d: Add location to thrown exception when parsing YAML
- 8686eb38c: Use errors from `@backstage/errors`
- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.6.5

### Patch Changes

- 9ef5a126d: Allow CodeOwnersProcessor to set `spec.owner` for `System`, `Resource`, and `Domain` entity kinds.
- 0b42fff22: Make use of parseLocationReference/stringifyLocationReference
- 2ef5bc7ea: Implement proper AWS Credentials precedence with assume-role and explicit credentials
- 761698831: Bump to the latest version of the Knex library.
- 93c62c755: Move logic for generating URLs for the view, edit and source links of catalog
  entities from the catalog frontend into the backend. This is done using the
  existing support for the `backstage.io/view-url`, `backstage.io/edit-url` and
  `backstage.io/source-location` annotations that are now filled by the
  `AnnotateLocationEntityProcessor`. If these annotations are missing or empty,
  the UI disables the related controls.
- Updated dependencies [277644e09]
- Updated dependencies [52f613030]
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [905cbfc96]
- Updated dependencies [761698831]
- Updated dependencies [d4e77ec5f]
  - @backstage/integration@0.5.1
  - @backstage/backend-common@0.5.6
  - @backstage/catalog-model@0.7.4

## 0.6.4

### Patch Changes

- ecdd407b1: GithubDiscoveryProcessor outputs locations as optional to avoid outputting errors for missing locations (see https://github.com/backstage/backstage/issues/4730).
- 12d8f27a6: Add version `backstage.io/v1beta2` schema for Template entities.
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5

## 0.6.3

### Patch Changes

- 2499f6cde: Add support for assuming role in AWS integrations
- Updated dependencies [bad21a085]
- Updated dependencies [a1f5e6545]
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.6.2

### Patch Changes

- Updated dependencies [16fb1d03a]
- Updated dependencies [491f3a0ec]
- Updated dependencies [491f3a0ec]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
  - @backstage/backend-common@0.5.4
  - @backstage/integration@0.5.0

## 0.6.1

### Patch Changes

- 77ad0003a: Revert AWS SDK version to v2
- d2441aee3: use child logger, if provided, to log single location refresh
- fb53eb7cb: Don't respond to a request twice if an entity has not been found.
- f3fbfb452: add indices on columns referring locations(id)
- 84364b35c: Added an option to scan GitHub for repositories using a new location type `github-discovery`.
  Example:

  ```yaml
  type: 'github-discovery',
  target:
     'https://github.com/backstage/techdocs-*/blob/master/catalog.yaml'
  ```

  You can use wildcards (`*`) as well. This will add `location` entities for each matching repository.
  Currently though, you must specify the exact path of the `catalog.yaml` file in the repository.

- 82b2c11b6: Refactored route response handling to use more explicit types and throw errors.
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [5a5163519]
  - @backstage/backend-common@0.5.3
  - @backstage/integration@0.4.0

## 0.6.0

### Minor Changes

- 3149bfe63: Make use of the `resolveUrl` facility of the `integration` package.

  Also rename the `LocationRefProcessor` to `LocationEntityProcessor`, to match the file name. This constitutes an interface change since the class is exported, but it is unlikely to be consumed outside of the package since it sits comfortably with the other default processors inside the catalog builder.

### Patch Changes

- 24e47ef1e: Throw `NotAllowedError` when registering locations with entities of disallowed kinds
- Updated dependencies [c4abcdb60]
- Updated dependencies [2430ee7c2]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [064c513e1]
- Updated dependencies [7881f2117]
- Updated dependencies [3149bfe63]
- Updated dependencies [2e62aea6f]
- Updated dependencies [11cb5ef94]
  - @backstage/integration@0.3.2
  - @backstage/backend-common@0.5.2
  - @backstage/catalog-model@0.7.1

## 0.5.5

### Patch Changes

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- a91aa6bf2: Support supplying a custom catalog descriptor file parser
- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1

## 0.5.4

### Patch Changes

- def2307f3: Adds a `backstage.io/managed-by-origin-location` annotation to all entities. It links to the
  location that was registered to the catalog and which emitted this entity. It has a different
  semantic than the existing `backstage.io/managed-by-location` annotation, which tells the direct
  parent location that created this entity.

  Consider this example: The Backstage operator adds a location of type `github-org` in the
  `app-config.yaml`. This setting will be added to a `bootstrap:boostrap` location. The processor
  discovers the entities in the following branch
  `Location bootstrap:bootstrap -> Location github-org:… -> User xyz`. The user `xyz` will be:

  ```yaml
  apiVersion: backstage.io/v1alpha1
  kind: User
  metadata:
    name: xyz
    annotations:
      # This entity was added by the 'github-org:…' location
      backstage.io/managed-by-location: github-org:…
      # The entity was added because the 'bootstrap:boostrap' was added to the catalog
      backstage.io/managed-by-origin-location: bootstrap:bootstrap
      # ...
  spec:
    # ...
  ```

- 318a6af9f: Change AWS Account type from Component to Resource
- ac7be581a: Refuse to remove the bootstrap location
- ad838c02f: Reduce log noise on locations refresh
- f9ba00a1c: Update the @azure/msal-node dependency to 1.0.0-beta.3.
- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0

## 0.5.3

### Patch Changes

- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- ade6b3bdf: AWS SDK version bump for Catalog Backend.
- abbee6fff: Implement System, Domain and Resource entity kinds.
- 147fadcb9: Add subcomponentOf to Component kind to represent subsystems of larger components.
- Updated dependencies [f3b064e1c]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.5.2

### Patch Changes

- 99be3057c: Fixed a bug where the catalog would read back all entities when adding a location that already exists.
- 49d2016a4: Change `location_update_log` columns from `nvarchar(255)` to `text`
- 73e75ea0a: Add processor for ingesting AWS accounts from AWS Organizations
- 071711d70: Remove `sqlite3` as a dependency. You may need to add `sqlite3` as a dependency of your backend if you were relying on this indirect dependency.
- Updated dependencies [5ecd50f8a]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/backend-common@0.4.2

## 0.5.1

### Patch Changes

- 5de26b9a6: Start warning about usage of deprecated location types, such as `github`
- 30d6c78fb: Added configuration schema for the commonly used properties
- 5084e5039: Updated the config schema

## 0.5.0

### Minor Changes

- 6b37c95bf: Write relations directly as part of batch add / update of entities.

  Slight change of the `CommonDatabase` contract:

  ## `addEntity` removed

  This method was unused by the core, and rendered unnecessary when `addEntities`
  exists.

  If you were a user of `addEntity`, please call `addEntities` instead, with an
  array of one element.

  ## `DbEntityRequest` has a new field `relations`

  This is the structure that is passed to `addEntities` and `updateEntity`. It
  used to be the case that you needed to call `setRelations` separately, but now
  this instead happens directly when you call `addEntities` or `updateEntity`.

  If you were using `addEntities` or `updateEntity` directly, please adapt your
  code to add the `relations` array to each request. If you were calling
  `setRelations` separately next to these methods, you no longer need to do so,
  after adding the relations to the `DbEntityRequest`s.

- ac3560b42: Remove `implementsApis` from `Component` entities. Deprecation happened in [#3449](https://github.com/backstage/backstage/pull/3449).
  Use `providesApis` instead.

### Patch Changes

- c6eeefa35: Add support for GitHub Enterprise in GitHubOrgReaderProcessor so you can properly ingest users of a GHE organization.
- fb386b760: Break the refresh loop into several smaller transactions
- 7c3ffc0cd: Support `profile` of groups including `displayName`, `email`, and `picture` in
  `LdapOrgReaderProcessor`. The source fields for them can be configured in the
  `ldapOrg` provider.
- e7496dc3e: Break out GithubOrgReaderProcessor config into its own file for consistency with the other org processors.
- 8dd0a906d: Support `profile` of groups including `displayName` and `picture` in
  `GithubOrgReaderProcessor`. Fixes the import of `description` for groups.
- 8c31c681c: Batch the writing of statuses after refreshes. This reduced the runtime on sqlite from 16s to 0.2s, and on pg from 60s to 1s on my machine, for the huge LDAP set.
- 7b98e7fee: Add index to foreign key columns. Postgres (and others) do not do this on the "source" side of a foreign key relation, which was what led to the slowness on large datasets. The full LDAP dataset ingestion now takes two minutes, which is not optimal yet but still a huge improvement over before when it basically never finished :)
- 0097057ed: Support `profile` of groups including `displayName` and `email` in
  `MicrosoftGraphOrgReaderProcessor`. Importing `picture` doesn't work yet, as
  the Microsoft Graph API does not expose them correctly.
- Updated dependencies [c911061b7]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/backend-common@0.4.1

## 0.4.0

### Minor Changes

- 83b6e0c1f: Remove the deprecated fields `ancestors` and `descendants` from the `Group` entity.

  See https://github.com/backstage/backstage/issues/3049 and the PRs linked from it for details.

### Patch Changes

- 6e8bb3ac0: leave unknown placeholder-lookalikes untouched in the catalog processing loop
- e708679d7: refreshAllLocations uses a child logger of the HigherOrderOperation with a meta `component` : `catalog-all-locations-refresh`
- 047c018c9: Batch the fetching of relations
- 38d63fbe1: Fix string template literal
- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0

## 0.3.0

### Minor Changes

- a9fd599f7: Add Analyze location endpoint to catalog backend. Add catalog-import plugin and replace import-component with it. To start using Analyze location endpoint, you have add it to the `createRouter` function options in the `\backstage\packages\backend\src\plugins\catalog.ts` file:

  ```ts
  export default async function createPlugin(env: PluginEnvironment) {
    const builder = new CatalogBuilder(env);
    const {
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
    } = await builder.build();

    return await createRouter({
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
      logger: env.logger,
    });
  }
  ```

### Patch Changes

- b4488ddb0: Added a type alias for PositionError = GeolocationPositionError
- 08835a61d: Add support for relative targets and implicit types in Location entities.
- e42402b47: Gracefully handle missing codeowners.

  The CodeOwnersProcessor now also takes a logger as a parameter.

- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0

## 0.2.3

### Patch Changes

- 1ec19a3f4: Ignore empty YAML documents. Having a YAML file like this is now ingested without an error:

  ```yaml
  apiVersion: backstage.io/v1alpha1
  kind: Component
  metadata:
    name: web
  spec:
    type: website
  ---

  ```

  This behaves now the same way as Kubernetes handles multiple documents in a single YAML file.

- ab94c9542: Add `providesApis` and `consumesApis` to the component entity spec.
- 2daf18e80: Start emitting all known relation types from the core entity kinds, based on their spec data.
- Updated dependencies [3aa7efb3f]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2
  - @backstage/catalog-model@0.3.1

## 0.2.2

### Patch Changes

- 0c2121240: Add support for reading groups and users from the Microsoft Graph API.
- 1185919f3: Marked the `Group` entity fields `ancestors` and `descendants` for deprecation on Dec 6th, 2020. See https://github.com/backstage/backstage/issues/3049 for details.

  Code that consumes these fields should remove those usages as soon as possible. There is no current or planned replacement for these fields.

  The BuiltinKindsEntityProcessor has been updated to inject these fields as empty arrays if they are missing. Therefore, if you are on a catalog instance that uses the updated version of this code, you can start removing the fields from your source catalog-info.yaml data as well, without breaking validation.

  After Dec 6th, the fields will be removed from types and classes of the Backstage repository. At the first release after that, they will not be present in released packages either.

  If your catalog-info.yaml files still contain these fields after the deletion, they will still be valid and your ingestion will not break, but they won't be visible in the types for consuming code.

- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1

## 0.2.1

### Patch Changes

- f531d307c: An entity A, that exists in the catalog, can no longer be overwritten by registering a different location that also tries to supply an entity with the same kind+namespace+name. Writes of that new entity will instead be rejected with a log message similar to `Rejecting write of entity Component:default/artist-lookup from file:/Users/freben/dev/github/backstage/packages/catalog-model/examples/components/artist-lookup-component.yaml because entity existed from github:https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/components/artist-lookup-component.yaml`
- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.2.0

### Minor Changes

- e0be86b6f: Entirely case insensitive read path of entities
- 12b5fe940: Add ApiDefinitionAtLocationProcessor that allows to load a API definition from another location
- 57d555eb2: This feature works the same as \$secret does in config - it allows programmatic substitution of values into a document.

  This is particularly useful e.g. for API type entities where you do not want to repeat your entire API spec document inside the catalog-info.yaml file. For those cases, you can instead do something like

  ```
  apiVersion: backstage.io/v1alpha1
  kind: API
  metadata:
    name: my-federated-service
  spec:
    type: graphql
    definition:
      $text: ./schema.graphql
  ```

  The textual content of that file will be injected as the value of definition, during each refresh loop. Both relative and absolute paths are supported, as well as any HTTP/HTTPS URL pointing to a service that returns the relevant data.

  The initial version supports injection of text file data, and structured data from JSON and YAML files. You can add any handler of your own in addition to these.

- 61db1ddc6: Allow node v14 and add to master build matrix

  - Upgrade sqlite3@^5.0.0 in @backstage/plugin-catalog-backend
  - Add Node 14 to engines in @backstage/create-app

- 81cb94379: Simplify the read function in processors
- a768a07fb: Add the ability to import users from GitHub Organization into the catalog.

  The token needs to have the scopes `user:email`, `read:user`, and `read:org`.

- ce1f55398: Use the new `UrlReader` in `PlaceholderProcessor`.
  This allows to use the placeholder processor to include API definitions in API entities.
  Previously it was only possible to do this if the definition comes from the same location type as the entity itself.
- e6b00e3af: Remove the backstage.io/definition-at-location annotation.
  The annotation was superseded by the placeholder processor.

  ```yaml
  apiVersion: backstage.io/v1alpha1
  kind: API
  metadata:
    name: spotify
    description: The Spotify web API
    tags:
      - spotify
      - rest
    annotations:
      # Don't use this annotation, but the placeholder $text instead (see below).
      backstage.io/definition-at-location: 'url:https://raw.githubusercontent.com/APIs-guru/openapi-directory/master/APIs/spotify.com/v1/swagger.yaml'
  spec:
    type: openapi
    lifecycle: production
    owner: spotify@example.com
    definition:
      $text: https://raw.githubusercontent.com/APIs-guru/openapi-directory/master/APIs/spotify.com/v1/swagger.yaml
  ```

- 99710b102: The way that wiring together a catalog happens, has changed drastically. Now
  there is a new class `CatalogBuilder` that does almost all of the heavy lifting
  of how to augment/replace pieces of catalog functionality, such as adding
  support for custom entities or adding additional processors.

  As the builder was added, a lot of the static methods and builders for default
  setups have been removed from classes deep in the hierarchy. Instead, the
  builder contains the knowledge of what the defaults are.

- 002860e7a: Filters passed to the `/entities` endpoint of the catalog has changed format.

  The old way was to pass things on the form `?a=b&c=d`; the new way is to pass
  things on the form `?filter=a=b,c=d`. See discussion in
  [#2910](https://github.com/backstage/backstage/issues/2910) for details.

  The comma separated items within a single filter have an AND between them. If
  multiple such filters are passed, they have an OR between those item groups.

- 5adfc005e: Changes the various kind policies into a new type `KindValidator`.

  Adds `CatalogProcessor#validateEntityKind` that makes use of the above
  validators. This moves entity schema validity checking away from entity
  policies and into processors, centralizing the extension points into the
  processor chain.

- 948052cbb: Add ability to dry run adding a new location to the catalog API.

  The location is now added in a transaction and afterwards rolled back.
  This allows users to dry run this operation to see if there entity has issues.
  This is probably done by automated tools in the CI/CD pipeline.

- 4036ff59d: - The `CatalogProcessor` API was updated to have `preProcessEntity` and
  `postProcessEntity` methods, instead of just one `processEntity`. This makes
  it easier to make processors that have several stages in one, and to make
  different processors more position independent in the list of processors.
  - The `EntityPolicy` is now given directly to the `LocationReaders`, instead of
    being enforced inside a policy. We have decided to separate out the act of
    validating an entity to be outside of the processing flow, to make it
    possible to apply more liberally and to evolve it as a separate concept.
  - Because of the above, the `EntityPolicyProcessor` has been removed.
- 512d70973: Use the new `UrlReader` in the `CodeOwnersProcessor`.
- 2f62e1804: Removed the parseData step from catalog processors. Locations readers should emit full entities instead.
- 36a71d278: Removed support for deprecated `catalog.providers` config that have been moved to `integrations`
- a5cb46bac: Renamed the `LocationProcessor` class to `CatalogProcessor`.

  Likewise, renamed `LocationProcessorResult`, `LocationProcessorLocationResult`,
  `LocationProcessorDataResult`, `LocationProcessorEntityResult`,
  `LocationProcessorErrorResult`, and `LocationProcessorEmit` to their `Catalog*`
  counterparts.

- 49d70ccab: Remove the `read` argument of `LocationProcessor.processEntity`.
  Instead, pass the `UrlReader` into the constructor of your `LocationProcessor`.
- 440a17b39: The catalog backend UrlReaderProcessor now uses a UrlReader from @backstage/backend-common, which must now be supplied to the constructor.

### Patch Changes

- 3472c8be7: Add codeowners processor

  - Add `codeowners-utils@^1.0.2` as a dependency
  - Add `core-js@^3.6.5` as a dependency
  - Added new CodeOwnersProcessor

- 33454c0f2: Fix `CatalogBuilder#addProcessor`.
- 183e2a30d: Add support for `fields` sub-selection of just parts of an entity when listing
  entities in the catalog backend.

  Example: `.../entities?fields=metadata.name,spec.type` will return partial
  entity objects with only those exact fields present and the rest cut out.
  Fields do not have to be simple scalars - you can for example do
  `fields=metadata`.

- 8bdf0bcf5: Fix CodeOwnersProcessor to handle non team users
- 4c4eab81b: The CodeOwnersProcessor now handles 'url' locations
- Updated dependencies [3a4236570]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [a768a07fb]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [5adfc005e]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [fa56f4615]
- Updated dependencies [8afce088a]
- Updated dependencies [b3d57961c]
- Updated dependencies [7bbeb049f]
  - @backstage/catalog-model@0.2.0
  - @backstage/backend-common@0.2.0
