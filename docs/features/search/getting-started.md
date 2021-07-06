---
id: getting-started
title: Getting Started with Search
description: How to set up and install Backstage Search
---

# Getting Started

Search functions as a plugin to Backstage, so you will need to use Backstage to
use Search.

If you haven't setup Backstage already, start
[here](../../getting-started/index.md).

> If you used `npx @backstage/create-app`, and you have a search page defined in
> `packages/app/src/components/search`, skip to
> [`Customizing Search`](#customizing-search) below.

## Adding Search to the Frontend

```bash
# From your Backstage root directory
cd packages/app
yarn add @backstage/plugin-search
```

Create a new `packages/app/src/components/search/SearchPage.tsx` file in your
Backstage app with the following contents:

```tsx
import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { Grid, List, Card, CardContent } from '@material-ui/core';
import {
  SearchBar,
  SearchResult,
  DefaultResultListItem,
  SearchFilter,
} from '@backstage/plugin-search';
import { CatalogResultListItem } from '@backstage/plugin-catalog';

export const searchPage = (
  <Page themeId="home">
    <Header title="Search" />
    <Content>
      <Grid container direction="row">
        <Grid item xs={12}>
          <SearchBar />
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <SearchFilter.Select
                name="kind"
                values={['Component', 'Template']}
              />
            </CardContent>
            <CardContent>
              <SearchFilter.Checkbox
                name="lifecycle"
                values={['experimental', 'production']}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <SearchResult>
            {({ results }) => (
              <List>
                {results.map(result => {
                  switch (result.type) {
                    case 'software-catalog':
                      return (
                        <CatalogResultListItem
                          key={result.document.location}
                          result={result.document}
                        />
                      );
                    default:
                      return (
                        <DefaultResultListItem
                          key={result.document.location}
                          result={result.document}
                        />
                      );
                  }
                })}
              </List>
            )}
          </SearchResult>
        </Grid>
      </Grid>
    </Content>
  </Page>
);
```

Bind the above Search Page to the `/search` route in your
`packages/app/src/App.tsx` file, like this:

```tsx
import { SearchPage } from '@backstage/plugin-search';
import { searchPage } from './components/search/SearchPage';

const routes = (
  <FlatRoutes>
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
  </FlatRoutes>
);
```

## Adding Search to the Backend

Add the following plugins into your backend app:

```bash
# From your Backstage root directory
cd packages/backend
yarn add @backstage/plugin-search-backend @backstage/plugin-search-backend-node
```

Create a `packages/backend/src/plugins/search.ts` file containing the following
code:

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
  const searchEngine = new LunrSearchEngine({ logger });
  const indexBuilder = new IndexBuilder({ logger, searchEngine });

  indexBuilder.addCollator({
    type: 'software-catalog',
    defaultRefreshIntervalSeconds: 600,
    collator: new DefaultCatalogCollator({ discovery }),
  });

  const { scheduler } = await indexBuilder.build();

  scheduler.start();
  useHotCleanup(module, () => scheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    logger,
  });
}
```

Make the following modifications to your `packages/backend/src/index.ts` file:

Import the `plugins/search` file you created above:

```typescript
import search from './plugins/search';
```

Set up an environment for search:

```typescript
const searchEnv = useHotMemoize(module, () => createEnv('search'));
```

Register the search service with the router:

```typescript
apiRouter.use('/search', await search(searchEnv));
```

## Customizing Search

### Frontend

The Search Plugin exposes several default filter types as static properties,
including `<SearchFilter.Select />` and `<SearchFilter.Checkbox />`. These allow
you to provide values relevant to your Backstage instance that, when selected,
get passed to the backend.

```tsx {2-5,8-11}
<CardContent>
  <SearchFilter.Select
    name="kind"
    values={['Component', 'Template']}
  />
</CardContent>
<CardContent>
  <SearchFilter.Checkbox
    name="lifecycle"
    values={['production', 'experimental']}
  />
</CardContent>
```

If you have advanced filter needs, you can specify your own filter component
like this (although new core filter contributions are welcome):

```tsx
import { useSearch, SearchFilter } from '@backstage/plugin-search';

const MyCustomFilter = () => {
  // Note: filters contain filter data from other filter components. Be sure
  // not to clobber other filters' data!
  const { filters, setFilters } = useSearch();

  return (/* ... */);
};

// Which could be rendered like this:
<SearchFilter component={MyCustomFilter} />
```

It's good practice for search results to highlight information that was used to
return it in the first place! The code below highlights how you might specify a
custom result item component, using the `<CatalogResultListItem />` component as
an example:

```tsx {7-13}
<SearchResult>
  {({ results }) => (
    <List>
      {results.map(result => {
        // result.type is the index type defined by the collator.
        switch (result.type) {
          case 'software-catalog':
            return (
              <CatalogResultListItem
                key={result.document.location}
                result={result.document}
              />
            );
          // ...
        }
      })}
    </List>
  )}
</SearchResult>
```

### Backend

Backstage Search isn't a search engine itself, rather, it provides an interface
between your Backstage instance and a
[Search Engine](./concepts.md#search-engines) of your choice. Currently, we only
support one, an in-memory search Engine called Lunr. It can be instantiated like
this:

```typescript
const searchEngine = new LunrSearchEngine({ logger });
const indexBuilder = new IndexBuilder({ logger, searchEngine });
```

Backstage Search can be used to power search of anything! Plugins like the
Catalog offer default [collators](./concepts.md#collators) which are responsible
for providing documents [to be indexed](./concepts.md#documents-and-indices).
You can register any number of collators with the `IndexBuilder` like this:

```typescript
const indexBuilder = new IndexBuilder({ logger, searchEngine });

indexBuilder.addCollator({
  type: 'software-catalog',
  defaultRefreshIntervalSeconds: 600,
  collator: new DefaultCatalogCollator({ discovery }),
});

indexBuilder.addCollator({
  type: 'my-custom-stuff',
  defaultRefreshIntervalSeconds: 3600,
  collator: new MyCustomCollator(),
});
```

Backstage Search builds and maintains its index
[on a schedule](./concepts.md#the-scheduler). You can change how often the
indexes are rebuilt for a given type of document. You may want to do this if
your documents are updated more or less frequently. You can do so by modifying
its `defaultRefreshIntervalSeconds` value, like this:

```typescript {3}
indexBuilder.addCollator({
  type: 'software-catalog',
  defaultRefreshIntervalSeconds: 600,
  collator: new DefaultCatalogCollator({ discovery }),
});
```
