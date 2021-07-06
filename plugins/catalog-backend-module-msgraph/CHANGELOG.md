# @backstage/plugin-catalog-backend-module-msgraph

## 0.2.0

### Minor Changes

- 115473c08: Handle error gracefully if failure occurs while loading photos using Microsoft Graph API.

  This includes a breaking change: you now have to pass the `options` object to `readMicrosoftGraphUsers` and `readMicrosoftGraphOrg`.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.11.0

## 0.1.1

### Patch Changes

- 127048f92: Move `MicrosoftGraphOrgReaderProcessor` from `@backstage/plugin-catalog-backend`
  to `@backstage/plugin-catalog-backend-module-msgraph`.

  The `MicrosoftGraphOrgReaderProcessor` isn't registered by default anymore, if
  you want to continue using it you have to register it manually at the catalog
  builder:

  1. Add dependency to `@backstage/plugin-catalog-backend-module-msgraph` to the `package.json` of your backend.
  2. Add the processor to the catalog builder:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addProcessor(
    MicrosoftGraphOrgReaderProcessor.fromConfig(config, {
      logger,
    }),
  );
  ```

  For more configuration details, see the [README of the `@backstage/plugin-catalog-backend-module-msgraph` package](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/README.md).

- 127048f92: Allow customizations of `MicrosoftGraphOrgReaderProcessor` by passing an
  optional `groupTransformer`, `userTransformer`, and `organizationTransformer`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.10.4
  - @backstage/catalog-model@0.8.4
