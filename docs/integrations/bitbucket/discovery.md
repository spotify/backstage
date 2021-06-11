---
id: discovery
title: Bitbucket Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in Bitbucket
---

The Bitbucket integration has a special discovery processor for discovering
catalog entities located in Bitbucket. The processor will crawl your Bitbucket
account and register entities matching the configured path. This can be useful
as an alternative to static locations or manually adding things to the catalog.

> Note: The Bitbucket Discovery Processor currently only supports a self-hosted
> Bitbucket Server, and not the hosted Bitbucket Cloud product.

To use the discovery processor, you'll need a Bitbucket integration
[set up](locations.md) with a `BITBUCKET_TOKEN` and a `BITBUCKET_API_BASE_URL`.
Then you can add a location target to the catalog configuration:

```yaml
catalog:
  locations:
    - type: bitbucket-discovery
      target: https://bitbucket.mycompany.com/projects/my-project/repos/service-*/catalog-info.yaml
```

Note the `bitbucket-discovery` type, as this is not a regular `url` processor.

The target is composed of four parts:

- The base instance URL, `https://bitbucket.mycompany.com` in this case
- The project key to scan, which accepts \* wildcard tokens. This can simply be
  `*` to scan repositories from all projects. This example only scans for
  repositories in the `my-project` project.
- The repository blob to scan, which accepts \* wildcard tokens. This can simply
  be `*` to scan all repositories in the project. This example only looks for
  repositories prefixed with `service-`.
- The path within each repository to find the catalog YAML file. This will
  usually be `/catalog-info.yaml` or a similar variation for catalog files
  stored in the root directory of each repository.

## Custom repository processing

The Bitbucket Discovery Processor will by default emit a location for each
matching repository for further processing by other processors. However, it is
possible to override this functionality and take full control of how each
matching repository is processed.

`BitbucketDiscoveryProcessor.fromConfig` takes an optional parameter
`options.parser` where you can set your own parser to be used for each matched
repository.

```typescript
const customRepositoryParser: BitbucketRepositoryParser = async function* customRepositoryParser({
  client,
  repository,
}) {
  // Custom logic for interpret the matching repository.
  // See defaultRepositoryParser for an example
};

const processor = BitbucketDiscoveryProcessor.fromConfig(env.config, {
  parser: customRepositoryParser,
  logger: env.logger,
});
```
