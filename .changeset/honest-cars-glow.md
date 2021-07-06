---
'@backstage/backend-common': patch
---

Added a `readUrl` method to the `UrlReader` interface that allows for complex response objects and is intended to replace the `read` method. This new method is currently optional to implement which allows for a soft migration to `readUrl` instead of `read` in the future.

The main use case for `readUrl` returning an object instead of solely a read buffer is to allow for additional metadata such as ETag, which is a requirement for more efficient catalog processing.

The `GithubUrlReader` and `GitlabUrlReader` readers fully implement `readUrl`. The other existing readers implement the new method but do not propagate or return ETags.

While the `readUrl` method is not yet required, it will be in the future, and we already log deprecation warnings when custom `UrlReader` implementations that do not implement `readUrl` are used. We therefore recommend that any existing custom implementations are migrated to implement `readUrl`.

The old `read` and the new `readUrl` methods can easily be implemented using one another, but we recommend moving the chunk of the implementation to the new `readUrl` method as `read` is being removed, for example this:

```ts
class CustomUrlReader implements UrlReader {
  read(url: string): Promise<Buffer> {
    const res = await fetch(url);

    if (!res.ok) {
      // error handling ...
    }

    return Buffer.from(await res.text());
  }
}
```

Can be migrated to something like this:

```ts
class CustomUrlReader implements UrlReader {
  read(url: string): Promise<Buffer> {
    const res = await this.readUrl(url);
    return res.buffer();
  }

  async readUrl(
    url: string,
    _options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    const res = await fetch(url);

    if (!res.ok) {
      // error handling ...
    }

    const buffer = Buffer.from(await res.text());
    return { buffer: async () => buffer };
  }
}
```

While there is no usage of the ETag capability yet in the main Backstage packages, you can already add it to your custom implementations. To do so, refer to the documentation of the `readUrl` method and surrounding types, and the existing implementation in `packages/backend-common/src/reading/GithubUrlReader.ts`.
