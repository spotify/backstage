---
'@backstage/create-app': patch
---

TechDocs Backend may now (optionally) leverage a cache store to improve
performance when reading content from a cloud storage provider.

To apply this change to an existing app, pass the cache manager from the plugin
environment to the `createRouter` function in your backend:

```diff
// packages/backend/src/plugins/techdocs.ts

export default async function createPlugin({
  logger,
  config,
  discovery,
  reader,
+  cache,
}: PluginEnvironment): Promise<Router> {

  // ...

  return await createRouter({
    preparers,
    generators,
    publisher,
    logger,
    config,
    discovery,
+    cache,
  });
```

If your `PluginEnvironment` does not include a cache manager, be sure you've
applied [the cache management change][cm-change] to your backend as well.

[Additional configuration][td-rec-arch] is required if you wish to enable
caching in TechDocs.

[cm-change]: https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md#patch-changes-6
[td-rec-arch]: https://backstage.io/docs/features/techdocs/architecture#recommended-deployment
