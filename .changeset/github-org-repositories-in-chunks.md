---
'@backstage/plugin-catalog-backend-module-github': minor
---

Adds a new `queryLimits.repositoryChunkSize` configuration option for the GitHub repository provider, which allows fetching GitHub repositories in chunks (GraphQL client sessions). This helps fetch repositories in large organizations when the job fails with 502 errors (session timing out).

The `allowArchived` filter is now applied directly in the GraphQL query, which speeds up the job.

```yaml title="app-config.yaml"
catalog:
  providers:
    customProviderId:
      organization: 'new-org' # string
      catalogPath: '/custom/path/catalog-info.yaml' # string
      filters: # optional filters
        branch: 'develop' # optional string
        repository: '.*' # optional Regex
      pageSizes:
        repositories: 25
+     queryLimits:
+       repositoryChunkSize: 5000
```
