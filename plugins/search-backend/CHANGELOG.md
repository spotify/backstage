# @backstage/plugin-search-backend

## 0.2.1

### Patch Changes

- 3108ff7bf: Make `yarn dev` respect the `PLUGIN_PORT` environment variable.
- Updated dependencies
  - @backstage/plugin-search-backend-node@0.2.1
  - @backstage/backend-common@0.8.3

## 0.2.0

### Minor Changes

- 5aff84759: This release represents a move out of a pre-alpha phase of the Backstage Search
  plugin, into an alpha phase. With this release, you gain more control over the
  layout of your search page on the frontend, as well as the ability to extend
  search on the backend to encompass everything Backstage users may want to find.

  If you are updating to version `v0.4.0` of `@backstage/plugin-search` from a
  prior release, you will need to make modifications to your app backend.

  First, navigate to your backend package and install the two related search
  backend packages:

  ```sh
  cd packages/backend
  yarn add @backstage/plugin-search-backend @backstage/plugin-search-backend-node
  ```

  Wire up these new packages into your app backend by first creating a new
  `search.ts` file at `src/plugins/search.ts` with contents like the following:

  ```typescript
  import { useHotCleanup } from '@backstage/backend-common';
  import { createRouter } from '@backstage/plugin-search-backend';
  import {
    IndexBuilder,
    LunrSearchEngine,
  } from '@backstage/plugin-search-backend-node';
  import { PluginEnvironment } from '../types';
  import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';

  export default async function createPlugin({
    logger,
    discovery,
  }: PluginEnvironment) {
    // Initialize a connection to a search engine.
    const searchEngine = new LunrSearchEngine({ logger });
    const indexBuilder = new IndexBuilder({ logger, searchEngine });

    // Collators are responsible for gathering documents known to plugins. This
    // particular collator gathers entities from the software catalog.
    indexBuilder.addCollator({
      defaultRefreshIntervalSeconds: 600,
      collator: new DefaultCatalogCollator({ discovery }),
    });

    // The scheduler controls when documents are gathered from collators and sent
    // to the search engine for indexing.
    const { scheduler } = await indexBuilder.build();

    // A 3 second delay gives the backend server a chance to initialize before
    // any collators are executed, which may attempt requests against the API.
    setTimeout(() => scheduler.start(), 3000);
    useHotCleanup(module, () => scheduler.stop());

    return await createRouter({
      engine: indexBuilder.getSearchEngine(),
      logger,
    });
  }
  ```

  Then, ensure the search plugin you configured above is initialized by modifying
  your backend's `index.ts` file in the following ways:

  ```diff
  +import search from './plugins/search';
  // ...
  +const searchEnv = useHotMemoize(module, () => createEnv('search'));
  // ...
  +apiRouter.use('/search', await search(searchEnv));
  // ...
  ```

### Patch Changes

- Updated dependencies [92963779b]
- Updated dependencies [db1c8f93b]
- Updated dependencies [5aff84759]
- Updated dependencies [eda9dbd5f]
  - @backstage/backend-common@0.8.2
  - @backstage/search-common@0.1.2
  - @backstage/plugin-search-backend-node@0.2.0

## 0.1.5

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [f9fb4a205]
  - @backstage/backend-common@0.8.0

## 0.1.4

### Patch Changes

- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
  - @backstage/backend-common@0.7.0

## 0.1.3

### Patch Changes

- b9b2b4b76: Lunr Search Engine support
- Updated dependencies [b9b2b4b76]
- Updated dependencies [d367f63b5]
- Updated dependencies [b42531cfe]
  - @backstage/plugin-search-backend-node@0.1.3
  - @backstage/backend-common@0.6.3

## 0.1.2

### Patch Changes

- 4d248725e: Bump to use the in-repo latest `backend-common`, and the correct version of `express-promise-router`
