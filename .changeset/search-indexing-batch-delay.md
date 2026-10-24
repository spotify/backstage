---
'@backstage/plugin-search-backend-node': patch
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Search indexing can now be paced with an optional delay between batches, which lowers the peak CPU usage of collation in resource-constrained deployments. Set `search.elasticsearch.batchDelay`, in milliseconds, to enable it. It defaults to no delay, so existing behavior is unchanged.
