---
id: url-reader
title: URL Reader
sidebar_label: URL Reader
# prettier-ignore
description: URL Reader is a backend core API responsible for reading files from external locations.
---

## Concept

Some of the core plugins of Backstage have to read files from an external
location. [Software Catalog](../features/software-catalog/index.md) has to read
the [`catalog-info.yaml`](../features/software-catalog/descriptor-format.md)
entity descriptor files to register and track an entity.
[Software Templates](../features/software-templates/index.md) have to download
the template skeleton files before creating a new component.
[TechDocs](../features/techdocs/README.md) has to download the markdown source
files before generating a documentation site.

Since, the requirement for reading files is so essential for Backstage plugins,
the
[`@backstage/backend-common`](https://github.com/backstage/backstage/tree/master/packages/backend-common)
package provides a dedicated API for reading from such URL based remote
locations like GitHub, GitLab, Bitbucket, Google Cloud Storage, etc. This is
commonly referred to as "URL Reader". It takes care of making authenticated
requests to the remote host so that private files can be read securely. If users
have [GitHub App based authentication](github-apps.md) set up, URL Reader even
refreshes the token, to avoid reaching the GitHub API rate limit.

As a result, plugin authors do not have to worry about any of these problems
when trying to read files.

## Interface

When the Backstage backend starts, a new instance of URL Reader is created. You
can see this in the index file of your Backstage backend
i.e.`packages/backend/src/index.ts`.
[Example](https://github.com/backstage/backstage/blob/ebbe91dbe79038a61d35cf6ed2d96e0e0d5a15f3/packages/backend/src/index.ts#L57)

```ts
// File: packages/backend/src/index.ts

import { URLReaders } from '@backstage/backend-common';

function makeCreateEnv(config: Config) {
  // ....
  const reader = UrlReaders.default({ logger, config });
  //
}
```

This instance contains all
[the default URL Reader providers](https://github.com/backstage/backstage/blob/master/packages/backend-common/src/reading/UrlReaders.ts)
in the backend-common package including GitHub, GitLab, Bitbucket, Azure, Google
GCS. As the need arises, more URL Readers are being written to support different
providers.

The generic interface of a URL Reader instance looks like this.

```ts
export type UrlReader = {
  /* Used to read a single file and return its content. */
  read(url: string): Promise<Buffer>;
  /**
   * A replacement for the read method that supports options and complex responses.
   *
   * Use this whenever it is available, as the read method will be deprecated and
   * eventually removed in the future.
   */
  readUrl?(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;

  /* Used to read a file tree and download as a directory. */
  readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
  /* Used to search a file in a tree. */
  search(url: string, options?: SearchOptions): Promise<SearchResponse>;
};
```

## Using a URL Reader inside a plugin

The `reader` instance is available in the backend plugin environment and passed
on to all the backend plugins. You can see an
[example](https://github.com/backstage/backstage/blob/b0be185369ebaad22255b7cdf18535d1d4ffd0e7/packages/backend/src/plugins/techdocs.ts#L31).
When any of the methods on this instance is called with a URL, URL Reader
extracts the host for that URL (e.g. `github.com`, `ghe.mycompany.com`, etc.).
Using the
[`@backstage/integration`](https://github.com/backstage/backstage/tree/master/packages/integration)
package, it looks inside the
[`integrations:`](https://github.com/backstage/backstage/blob/d5c83bb889b8142e343ebc4e4c0b90a02d1c1a3d/app-config.yaml#L134-L158)
config of the `app-config.yaml` to find out how to work with the host based on
the configs provided like authentication token, API base URL, etc.

Make sure your plugin-specific backend file at
`packages/backend/src/plugins/<PLUGIN>.ts` is forwarding the `reader` instance
passed on as the `PluginEnvironment` to the actual plugin's `createRouter`
function. See how this is done in
[Catalog](https://github.com/backstage/backstage/blob/d5c83bb889b8142e343ebc4e4c0b90a02d1c1a3d/packages/backend/src/plugins/catalog.ts#L25-L27)
and
[TechDocs](https://github.com/backstage/backstage/blob/d5c83bb889b8142e343ebc4e4c0b90a02d1c1a3d/packages/backend/src/plugins/techdocs.ts#L31-L36)
backend plugins.

Once the reader instance is available inside the plugin, one of its methods can
directly be used with a URL. Some example usages -

- [`read`](https://github.com/backstage/backstage/blob/d5c83bb889b8142e343ebc4e4c0b90a02d1c1a3d/plugins/catalog-backend/src/ingestion/processors/codeowners/read.ts#L24-L33) -
  Catalog using the `read` method to read the CODEOWNERS file in a repository.
- [`readTree`](https://github.com/backstage/backstage/blob/d5c83bb889b8142e343ebc4e4c0b90a02d1c1a3d/packages/techdocs-common/src/helpers.ts#L198-L220) -
  TechDocs using the `readTree` method to download markdown files in order to
  generate the documentation site.
- [`readTree`](https://github.com/backstage/backstage/blob/d5c83bb889b8142e343ebc4e4c0b90a02d1c1a3d/packages/techdocs-common/src/stages/prepare/url.ts#L33-L54) -
  TechDocs using `NotModifiedError` to maintain cache and speed up and limit the
  number of requests.
- [`search`](https://github.com/backstage/backstage/blob/d5c83bb889b8142e343ebc4e4c0b90a02d1c1a3d/plugins/catalog-backend/src/ingestion/processors/UrlReaderProcessor.ts#L88-L108) -
  Catalog using the `search` method to find files for a location URL containing
  a glob pattern.

## Writing a new URL Reader

If the available URL Readers are not sufficient for your use case and you want
to add a new URL Reader for any other provider, you are most welcome to
contribute one!

Feel free to use the
[GitHub URL Reader](https://github.com/backstage/backstage/blob/d5c83bb889b8142e343ebc4e4c0b90a02d1c1a3d/packages/backend-common/src/reading/GithubUrlReader.ts)
as a source of inspiration.

### 1. Add an integration

The provider for your new URL Reader can also be called an "integration" in
Backstage. The `integrations:` section of your Backstage `app-config.yaml`
config file is supposed to be the place where a Backstage integrator defines the
host URL for the integration, authentication details and other integration
related configurations.

The `@backstage/integration` package is where most of the integration specific
code lives, so that it is shareable across Backstage. Functions like "read the
integrations config and process it", "construct headers for authenticated
requests to the host" or "convert a plain file URL into its API URL for
downloading the file" would live in this package.

### 2. Create the URL Reader

Create a new class which implements the
[`UrlReader` type](https://github.com/backstage/backstage/blob/d5c83bb889b8142e343ebc4e4c0b90a02d1c1a3d/packages/backend-common/src/reading/types.ts#L21-L28)
inside `@backstage/backend-common`. Create and export a static `factory` method
which reads the integration config and returns a map of host URLs the new reader
should be used for. See the
[GitHub URL Reader](https://github.com/backstage/backstage/blob/d5c83bb889b8142e343ebc4e4c0b90a02d1c1a3d/packages/backend-common/src/reading/GithubUrlReader.ts#L50-L63)
for example.

### 3. Implement the methods

We want to make sure all URL Readers behave in the same way. Hence if possible,
all the methods of the `UrlReader` interface should be implemented. However it
is okay to start by implementing just one of them and create issues for the
remaining.

#### read

NOTE: Use `readUrl` instead of `read`.

`read` method expects a user-friendly URL, something which can be copied from
the browser naturally when a person is browsing the provider in their browser.

- ✅ Valid URL :
  `https://github.com/backstage/backstage/blob/master/ADOPTERS.md`
- ❌ Not a valid URL :
  `https://raw.githubusercontent.com/backstage/backstage/master/ADOPTERS.md`
- ❌ Not a valid URL : `https://github.com/backstage/backstage/ADOPTERS.md`

Upon receiving the URL, `read` converts the user-friendly URL into an API URL
which can be used to request the provider's API.

`read` then makes an authenticated request to the provider API and returns the
file's content.

#### readUrl

`readUrl` is a new interface that allows complex response objects and is
intended to replace the `read` method. This new method is currently optional to
implement which allows for a soft migration to `readUrl` instead of `read` in
the future.

#### readTree

`readTree` method also expects user-friendly URLs similar to `read` but the URL
should point to a tree (could be the root of a repository or even a
sub-directory).

- ✅ Valid URL : `https://github.com/backstage/backstage`
- ✅ Valid URL : `https://github.com/backstage/backstage/blob/master`
- ✅ Valid URL : `https://github.com/backstage/backstage/blob/master/docs`

Using the provider's API documentation, find out an API endpoint which can be
used to download either a zip or a tarball. You can download the entire tree
(e.g. a repository) and filter out in case the user is expecting only a
sub-tree. But some APIs are smart enough to accept a path and return only a
sub-tree in the downloaded archive.

#### search

`search` method expects a glob pattern of a URL and returns a list of files
matching the query.

- ✅ Valid URL :
  `https://github.com/backstage/backstage/blob/master/**/catalog-info.yaml`
- ✅ Valid URL : `https://github.com/backstage/backstage/blob/master/**/*.md`
- ✅ Valid URL :
  `https://github.com/backstage/backstage/blob/master/*/package.json`
- ✅ Valid URL : `https://github.com/backstage/backstage/blob/master/READM`

The core logic of `readTree` can be used here to extract all the files inside
the tree and return the files matching the pattern in the `url`.

### 4. Add to available URL Readers

There are two ways to make your new URL Reader available for use.

You can choose to make it open source, by updating the
[`default` factory](https://github.com/backstage/backstage/blob/d5c83bb889b8142e343ebc4e4c0b90a02d1c1a3d/packages/backend-common/src/reading/UrlReaders.ts#L62-L81)
method of URL Readers.

But for something internal which you don't want to make open source, you can
update your `packages/backend/src/index.ts` file and update how the `reader`
instance is created.

```ts
// File: packages/backend/src/index.ts
const reader = UrlReaders.default({
  logger: root,
  config,
  // This is where your internal URL Readers would go.
  factories: [myCustomReader.factory],
});
```

### 5. Caching

All of the methods above support an ETag based caching. If the method is called
without an `etag`, the response contains an ETag of the resource (should ideally
forward the ETag returned by the provider). If the method is called with an
`etag`, it first compares the ETag and returns a `NotModifiedError` in case the
resource has not been modified. This approach is very similar to the actual
[ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) and
[If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match)
HTTP headers.

### 6. Debugging

When debugging one of the URL Readers, you can straightforward use the
[`reader` instance created](https://github.com/backstage/backstage/blob/ebbe91dbe79038a61d35cf6ed2d96e0e0d5a15f3/packages/backend/src/index.ts#L57)
when the backend starts and call one of the methods with your debugging URL.

```ts
// File: packages/backend/src/index.ts

async function main() {
  // ...
  const createEnv = makeCreateEnv(config);

  const testReader = createEnv('test-url-reader').reader;
  const response = await testReader.readUrl(
    'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
  );
  console.log((await response.buffer()).toString());
  // ...
}
```

This will be run every time you restart the backend. Note that after any change
in the URL Reader code, you need to kill the backend and restart, since the
`reader` instance is memoized and does not update on hot module reloading. Also,
there are a lot of unit tests written for the URL Readers, which you can make
use of.
