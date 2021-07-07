---
'@backstage/techdocs-common': patch
---

Support relative `url` targets for the `backstage.io/techdocs-ref` annotations.

This allows a content author to use annotations such as `backstage.io/techdocs-ref: url:.` or `backstage.io/techdocs-ref: url:./my-subfolder`.
Note that this only works if the entity was loaded from a `url` location.
The base folder is determined by the `backstage.io/source-location` or `backstage.io/managed-by-location` annotations.
