# @backstage/plugin-techdocs

## 0.9.5

### Patch Changes

- aad98c544: Fixes multiple XSS and sanitization bypass vulnerabilities in TechDocs.
- Updated dependencies [e7c5e4b30]
- Updated dependencies [ebe802bc4]
- Updated dependencies [49d7ec169]
- Updated dependencies [1cf1d351f]
- Updated dependencies [deaba2e13]
- Updated dependencies [8e919a6f8]
  - @backstage/theme@0.2.8
  - @backstage/catalog-model@0.8.1
  - @backstage/integration@0.5.5
  - @backstage/core@0.7.12
  - @backstage/plugin-catalog-react@0.2.1

## 0.9.4

### Patch Changes

- 4ea9df9d3: Set admonition font size to 1rem in TechDocs to align with the rest of the document's font sizes.
  Fixes #5448 and #5541.
- bf805b467: Fixes #5529, a bug that prevented TechDocs from rendering pages containing malformed links.
- 203ce6f6f: TechDocs now respects the `download` attribute on anchor tags in generated
  markup, allowing documentation authors to bundle downloadable files with their
  documentation.
- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/integration@0.5.4
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0

## 0.9.3

### Patch Changes

- 65e6c4541: Remove circular dependencies
- a62cfe068: Bug fix on sidebar position when Tab-Bar is enabled
- 35e091604: Handle URLs with a `#hash` correctly when rewriting link URLs.
- Updated dependencies [f7f7783a3]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5da6a561d]
  - @backstage/catalog-model@0.7.10
  - @backstage/core@0.7.10
  - @backstage/integration@0.5.3

## 0.9.2

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/integration-react@0.1.2
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.9.1

### Patch Changes

- 2e05277e0: Fix navigation in a page using the table of contents.
- 4075c6367: Make git config optional for techdocs feedback links
- Updated dependencies [38ca05168]
- Updated dependencies [f65adcde7]
- Updated dependencies [81c54d1f2]
- Updated dependencies [80888659b]
- Updated dependencies [7b8272fb7]
- Updated dependencies [d8b81fd28]
  - @backstage/integration@0.5.2
  - @backstage/core@0.7.8
  - @backstage/plugin-catalog-react@0.1.5
  - @backstage/theme@0.2.7
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.9.0

### Minor Changes

- 21fddf452: Make `techdocsStorageApiRef` and `techdocsApiRef` use interfaces instead of the
  actual implementation classes.

  This renames the classes `TechDocsApi` to `TechDocsClient` and `TechDocsStorageApi`
  to `TechDocsStorageClient` and renames the interfaces `TechDocs` to `TechDocsApi`
  and `TechDocsStorage` to `TechDocsStorageApi` to comply the pattern elsewhere in
  the project. This also fixes the types returned by some methods on those
  interfaces.

### Patch Changes

- 6fbd7beca: Use `EntityRefLink` in header and use relations to reference the owner of the
  document.
- 15cbe6815: Fix TechDocs landing page table wrong copied link
- 39bdaa004: Add customization and exportable components for TechDocs landing page
- cb8c848a3: Disable color transitions on links to avoid issues in dark mode.
- 17915e29b: Rework state management to avoid rendering multiple while navigating between pages.
- Updated dependencies [9afcac5af]
- Updated dependencies [e0c9ed759]
- Updated dependencies [6eaecbd81]
  - @backstage/core@0.7.7

## 0.8.0

### Minor Changes

- ac6025f63: Add feedback link icon in Techdocs Reader that directs to GitLab or GitHub repo issue page with pre-filled title and source link.
  For link to appear, requires `repo_url` and `edit_uri` to be filled in mkdocs.yml, as per https://www.mkdocs.org/user-guide/configuration. An `edit_uri` will need to be specified for self-hosted GitLab/GitHub instances with a different host name.
  To identify issue URL format as GitHub or GitLab, the host name of source in `repo_url` is checked if it contains `gitlab` or `github`. Alternately this is determined by matching to `host` values from `integrations` in app-config.yaml.

### Patch Changes

- e292e393f: Add a test id to the shadow root element of the Reader to access it easily in e2e tests
- Updated dependencies [94da20976]
- Updated dependencies [d8cc7e67a]
- Updated dependencies [99fbef232]
- Updated dependencies [ab07d77f6]
- Updated dependencies [931b21a12]
- Updated dependencies [937ed39ce]
- Updated dependencies [9a9e7a42f]
- Updated dependencies [50ce875a0]
  - @backstage/core@0.7.6
  - @backstage/theme@0.2.6

## 0.7.2

### Patch Changes

- fef852ecd: Reworked the TechDocs plugin to support using the configured company name instead of
  'Backstage' in the page title.
- 18f7345a6: Add borders to TechDocs tables and increase font size. Fixes #5264 and #5276.
- Updated dependencies [bb5055aee]
- Updated dependencies [d0d1c2f7b]
- Updated dependencies [5d0740563]
- Updated dependencies [5cafcf452]
- Updated dependencies [86a95ba67]
- Updated dependencies [e27cb6c45]
  - @backstage/catalog-model@0.7.7
  - @backstage/core@0.7.5

## 0.7.1

### Patch Changes

- bebd1c4fe: Remove the `@backstage/techdocs-common` dependency to not pull in backend config schemas in the frontend.
- Updated dependencies [9f48b548c]
- Updated dependencies [8488a1a96]
  - @backstage/plugin-catalog-react@0.1.4
  - @backstage/catalog-model@0.7.5

## 0.7.0

### Minor Changes

- aaeb7ecf3: When newer documentation available but not built, show older documentation while async building newer
  TechDocs backend: /sync endpoint added to support above, returns immediate success if docs don't need a build, returns delayed success after build if needed
  TechDocs backend: /docs endpoint removed as frontend can directly request to techdocs.storageUrl or /static/docs
- 3139f83af: Add sticky sidebars and footer navigation links to TechDocs Reader

### Patch Changes

- ea9d977e7: Introduce workaround for admonition icons of MkDocs.
- 2aab54319: TechDocs: links at sidebar and bottom reset scroll position to top
- Updated dependencies [01ccef4c7]
- Updated dependencies [fcc3ada24]
- Updated dependencies [4618774ff]
- Updated dependencies [df59930b3]
  - @backstage/plugin-catalog-react@0.1.3
  - @backstage/core@0.7.3
  - @backstage/theme@0.2.5

## 0.6.2

### Patch Changes

- 83bfc98a3: On TechDocs page header, change the breadcrumbs link to be static and point to TechDocs homepage.
- e7baa0d2e: Separate techdocs-backend and frontend config schema declarations
- c8b54c370: Extended TechDocs HomePage with owned documents
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
- Updated dependencies [8686eb38c]
- Updated dependencies [424742dc1]
- Updated dependencies [4e0b5055a]
  - @backstage/config@0.1.4
  - @backstage/core@0.7.2
  - @backstage/plugin-catalog-react@0.1.2
  - @backstage/techdocs-common@0.4.5
  - @backstage/test-utils@0.1.9

## 0.6.1

### Patch Changes

- aa095e469: OpenStack Swift publisher added for tech-docs.
- 2089de76b: Make use of the new core `ItemCardGrid` and `ItemCardHeader` instead of the deprecated `ItemCard`.
- 868e4cdf2: - Adds a link to the owner entity
  - Corrects the link to the component which includes the namespace
- ca4a904f6: Add an optional configuration option for setting the url endpoint for AWS S3 publisher: `techdocs.publisher.awsS3.endpoint`
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [2ef5bc7ea]
- Updated dependencies [ff4d666ab]
- Updated dependencies [aa095e469]
- Updated dependencies [2089de76b]
- Updated dependencies [dc1fc92c8]
- Updated dependencies [bc46435f5]
- Updated dependencies [a501128db]
- Updated dependencies [ca4a904f6]
  - @backstage/techdocs-common@0.4.4
  - @backstage/catalog-model@0.7.4
  - @backstage/core@0.7.1
  - @backstage/theme@0.2.4

## 0.6.0

### Minor Changes

- 813c6a4f2: Add authorization header on techdocs api requests. Breaking change as clients now needs the Identity API.

### Patch Changes

- Updated dependencies [12d8f27a6]
- Updated dependencies [f43192207]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [9d455f69a]
- Updated dependencies [4c049a1a1]
- Updated dependencies [02816ecd7]
- Updated dependencies [61299519f]
  - @backstage/catalog-model@0.7.3
  - @backstage/techdocs-common@0.4.3
  - @backstage/core@0.7.0
  - @backstage/plugin-catalog-react@0.1.1

## 0.5.8

### Patch Changes

- f37992797: Got rid of some `attr` and cleaned up a bit in the TechDocs config schema.
- 2499f6cde: Add support for assuming role in AWS integrations
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [dc12852c9]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [88f1f1b60]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [5c2e2863f]
- Updated dependencies [3a58084b6]
- Updated dependencies [2499f6cde]
- Updated dependencies [a1f5e6545]
- Updated dependencies [1e4ddd71d]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3
  - @backstage/test-utils@0.1.8
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2
  - @backstage/techdocs-common@0.4.2
  - @backstage/config@0.1.3

## 0.5.7

### Patch Changes

- Updated dependencies [fd3f2a8c0]
- Updated dependencies [fb28da212]
- Updated dependencies [d34d26125]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [10a0124e0]
- Updated dependencies [07e226872]
- Updated dependencies [26e143e60]
- Updated dependencies [c6655413d]
- Updated dependencies [44414239f]
- Updated dependencies [b0a41c707]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core@0.6.2
  - @backstage/techdocs-common@0.4.1
  - @backstage/plugin-catalog-react@0.0.4

## 0.5.6

### Patch Changes

- f5e564cd6: Improve display of error messages
- 41af18227: Migrated to new composability API, exporting the plugin instance as `techdocsPlugin`, the top-level page as `TechdocsPage`, and the entity content as `EntityTechdocsContent`.
- 8f3443427: Enhance API calls to support trapping 500 errors from techdocs-backend
- Updated dependencies [77ad0003a]
- Updated dependencies [b51ee6ece]
- Updated dependencies [19d354c78]
- Updated dependencies [08142b256]
- Updated dependencies [08142b256]
- Updated dependencies [b51ee6ece]
  - @backstage/techdocs-common@0.4.0
  - @backstage/test-utils@0.1.7
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.5.5

### Patch Changes

- 5fa3bdb55: Add `href` in addition to `onClick` to `ItemCard`. Ensure that the height of a
  `ItemCard` with and without tags is equal.
- e44925723: `techdocs.requestUrl` and `techdocs.storageUrl` are now optional configs and the discovery API will be used to get the URL where techdocs plugin is hosted.
- 019fe39a0: Switch dependency from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
- Updated dependencies [c777df180]
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [e44925723]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [f0320190d]
- Updated dependencies [54c7d02f7]
- Updated dependencies [11cb5ef94]
  - @backstage/techdocs-common@0.3.7
  - @backstage/core@0.6.0
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.5.4

### Patch Changes

- a5e27d5c1: Create type for TechDocsMetadata (#3716)

  This change introduces a new type (TechDocsMetadata) in packages/techdocs-common. This type is then introduced in the endpoint response in techdocs-backend and in the api interface in techdocs (frontend).

- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [593632f07]
- Updated dependencies [33846acfc]
- Updated dependencies [a187b8ad0]
- Updated dependencies [f04db53d7]
- Updated dependencies [53c9c51f2]
- Updated dependencies [a5e27d5c1]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/plugin-catalog@0.2.12
  - @backstage/techdocs-common@0.3.5

## 0.5.3

### Patch Changes

- dbe4450c3: Google Cloud authentication in TechDocs has been improved.

  1. `techdocs.publisher.googleGcs.credentials` is now optional. If it is missing, `GOOGLE_APPLICATION_CREDENTIALS`
     environment variable (and some other methods) will be used to authenticate.
     Read more here https://cloud.google.com/docs/authentication/production

  2. `techdocs.publisher.googleGcs.projectId` is no longer used. You can remove it from your `app-config.yaml`.

- a6f9dca0d: Remove dependency on `@backstage/core-api`. No plugin should ever depend on that package; it's an internal concern whose important bits are re-exported by `@backstage/core` which is the public facing dependency to use.
- b3b9445df: AWS S3 authentication in TechDocs has been improved.

  1. `techdocs.publisher.awsS3.bucketName` is now the only required config. `techdocs.publisher.awsS3.credentials` and `techdocs.publisher.awsS3.region` are optional.

  2. If `techdocs.publisher.awsS3.credentials` and `techdocs.publisher.awsS3.region` are missing, the AWS environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_REGION` will be used. There are more better ways of setting up AWS authentication. Read the guide at https://backstage.io/docs/features/techdocs/using-cloud-storage

- e5d12f705: Use `history.pushState` for hash link navigation.
- Updated dependencies [68ad5af51]
- Updated dependencies [f3b064e1c]
- Updated dependencies [371f67ecd]
- Updated dependencies [f1e74777a]
- Updated dependencies [dbe4450c3]
- Updated dependencies [c00488983]
- Updated dependencies [265a7ab30]
- Updated dependencies [5826d0973]
- Updated dependencies [b3b9445df]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/techdocs-common@0.3.3
  - @backstage/catalog-model@0.6.1
  - @backstage/plugin-catalog@0.2.11
  - @backstage/core@0.4.4

## 0.5.2

### Patch Changes

- 359f9d2d8: Added configuration schema for the commonly used properties of techdocs and techdocs-backend plugins
- Updated dependencies [a08c32ced]
- Updated dependencies [7e0b8cac5]
- Updated dependencies [8804e8981]
- Updated dependencies [87c0c53c2]
- Updated dependencies [86c3c652a]
- Updated dependencies [27f2af935]
  - @backstage/core-api@0.2.8
  - @backstage/core@0.4.3
  - @backstage/plugin-catalog@0.2.9
  - @backstage/techdocs-common@0.3.1

## 0.5.1

### Patch Changes

- Updated dependencies [d681db2b5]
- Updated dependencies [1dc445e89]
- Updated dependencies [342270e4d]
- Updated dependencies [1dc445e89]
- Updated dependencies [a8573e53b]
  - @backstage/core-api@0.2.7
  - @backstage/core@0.4.2
  - @backstage/test-utils@0.1.6
  - @backstage/plugin-catalog@0.2.8
  - @backstage/techdocs-common@0.3.0

## 0.5.0

### Minor Changes

- dae4f3983: _Breaking changes_

  1. Added option to use Google Cloud Storage as a choice to store the static generated files for TechDocs.
     It can be configured using `techdocs.publisher.type` option in `app-config.yaml`.
     Step-by-step guide to configure GCS is available here https://backstage.io/docs/features/techdocs/using-cloud-storage
     Set `techdocs.publisher.type` to `'local'` if you want to continue using local filesystem to store TechDocs files.

  2. `techdocs.builder` is now required and can be set to `'local'` or `'external'`. (Set it to `'local'` for now, since CI/CD build
     workflow for TechDocs will be available soon (in few weeks)).
     If builder is set to 'local' and you open a TechDocs page, `techdocs-backend` will try to generate the docs, publish to storage and
     show the generated docs afterwords.
     If builder is set to `'external'`, `techdocs-backend` will only fetch the docs and will NOT try to generate and publish. In this case of `'external'`,
     we assume that docs are being built in the CI/CD pipeline of the repository.
     TechDocs will not assume a default value for `techdocs.builder`. It is better to explicitly define it in the `app-config.yaml`.

  3. When configuring TechDocs in your backend, there is a difference in how a new publisher is created.

  ```
  ---  const publisher = new LocalPublish(logger, discovery);
  +++  const publisher = Publisher.fromConfig(config, logger, discovery);
  ```

  Based on the config `techdocs.publisher.type`, the publisher could be either Local publisher or Google Cloud Storage publisher.

  4. `techdocs.storageUrl` is now a required config. Should be `http://localhost:7000/api/techdocs/static/docs` in most setups.

  5. Parts of `@backstage/plugin-techdocs-backend` have been moved to a new package `@backstage/techdocs-common` to generate docs. Also to publish docs
     to-and-fro between TechDocs and a storage (either local or external). However, a Backstage app does NOT need to import the `techdocs-common` package -
     app should only import `@backstage/plugin-techdocs` and `@backstage/plugin-techdocs-backend`.

  _Patch changes_

  1. See all of TechDocs config options and its documentation https://backstage.io/docs/features/techdocs/configuration

  2. Logic about serving static files and metadata retrieval have been abstracted away from the router in `techdocs-backend` to the instance of publisher.

  3. Removed Material UI Spinner from TechDocs header. Spinners cause unnecessary UX distraction.
     Case 1 (when docs are built and are to be served): Spinners appear for a split second before the name of site shows up. This unnecessarily distracts eyes because spinners increase the size of the Header. A dot (.) would do fine. Definitely more can be done.
     Case 2 (when docs are being generated): There is already a linear progress bar (which is recommended in Storybook).

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [dae4f3983]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [7dd2ef7d1]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/techdocs-common@0.2.0
  - @backstage/core@0.4.1
  - @backstage/core-api@0.2.6
  - @backstage/plugin-catalog@0.2.7

## 0.4.0

### Minor Changes

- 87a33d2fe: Removed modifyCss transformer and moved the css to injectCss transformer
  Fixed issue where some internal doc links would cause a reload of the page

### Patch Changes

- Updated dependencies [b6557c098]
- Updated dependencies [2527628e1]
- Updated dependencies [6011b7d3e]
- Updated dependencies [e1f4e24ef]
- Updated dependencies [1c69d4716]
- Updated dependencies [d8d5a17da]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core-api@0.2.5
  - @backstage/core@0.4.0
  - @backstage/plugin-catalog@0.2.6
  - @backstage/test-utils@0.1.5
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2

## 0.3.1

### Patch Changes

- da2ad65cb: Use type EntityName from catalog-model for entities
- Updated dependencies [b4488ddb0]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
- Updated dependencies [ebf37bbae]
  - @backstage/core-api@0.2.4
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-catalog@0.2.5
  - @backstage/test-utils@0.1.4

## 0.3.0

### Minor Changes

- 4b53294a6: - Use techdocs annotation to add repo_url if missing in mkdocs.yml. Having repo_url creates a Edit button on techdocs pages.
  - techdocs-backend: API endpoint `/metadata/mkdocs/*` renamed to `/metadata/techdocs/*`

### Patch Changes

- Updated dependencies [6f70ed7a9]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
- Updated dependencies [700a212b4]
  - @backstage/plugin-catalog@0.2.4
  - @backstage/catalog-model@0.3.1
  - @backstage/core-api@0.2.3

## 0.2.3

### Patch Changes

- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-catalog@0.2.3

## 0.2.2

### Patch Changes

- 1722cb53c: Added configuration schema
- Updated dependencies [1722cb53c]
- Updated dependencies [8b7737d0b]
  - @backstage/core@0.3.1
  - @backstage/plugin-catalog@0.2.2
  - @backstage/test-utils@0.1.3

## 0.2.1

### Patch Changes

- Updated dependencies [c5bab94ab]
- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
- Updated dependencies [2d0bd1be7]
  - @backstage/core-api@0.2.1
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1
  - @backstage/plugin-catalog@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI
- 8351ad79b: Add a message if techdocs takes long time to load

  Fixes #2416.

  The UI after the change should look like this:

  ![techdocs-progress-bar](https://user-images.githubusercontent.com/33940798/94189286-296ac980-fec8-11ea-9051-1b3db938d12f.gif)

### Patch Changes

- 782f3b354: add test case for Progress component
- 57b54c8ed: While techdocs fetches site name and metadata for the component, the page title was displayed as '[object Object] | Backstage'. This has now been fixed to display the component ID if site name is not present or being fetched.
- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [cbbd271c4]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [368fd8243]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [f0aa01bcc]
- Updated dependencies [0aecfded0]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [8b9c8196f]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [60d40892c]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [2ebcfac8d]
- Updated dependencies [fa56f4615]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [0b956f21b]
- Updated dependencies [26e69ab1a]
- Updated dependencies [97c2cb19b]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [cbab5bbf8]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/plugin-catalog@0.2.0
  - @backstage/core-api@0.2.0
  - @backstage/core@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
  - @backstage/test-utils@0.1.2
