---
id: discovery
title: GitHub Discovery
sidebar_label: Discovery
# prettier-ignore: ""
description: Automatically discovering catalog entities from repositories in a GitHub organization
---

The GitHub integration has a special discovery processor for discovering catalog
entities within a GitHub organization. The processor will crawl the GitHub
organization and register entities matching the configured path. This can be
useful as an alternative to static locations or manually adding things to the
catalog.

To use the discovery processor, you'll need a GitHub integration
[set up](locations.md) with a `GITHUB_TOKEN`. Then you can add a location target
to the catalog configuration:

```yaml
catalog:
  locations:
    - type: github-discovery
      target: https://github.com/myorg/service-*/blob/main/catalog-info.yaml
```

Note the `github-discovery` type, as this is not a regular `url` processor.

The target is composed of three parts:

- The base organization URL, `https://github.com/myorg` in this case
- The repository blob to scan, which accepts \* wildcard tokens. This can simply
  be `*` to scan all repositories in the organization. This example only looks
  for repositories prefixed with `service-`.
- The path within each repository to find the catalog YAML file. This will
  usually be `/blob/main/catalog-info.yaml`, `/blob/master/catalog-info.yaml` or
  a similar variation for catalog files stored in the root directory of each
  repository.

## GitHub API Rate Limits

GitHub
[rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)
API requests to 5,000 per hour (or more for Enterprise accounts). The default
Backstage catalog backend refreshes data every 100 seconds, which issues an API
request for each discovered location.

This means if you have more than ~140 catalog entities, you may get throttled by
rate limiting. This will soon be resolved once catalog refreshes make use of
ETags; to work around this in the meantime, you can change the refresh rate of
the catalog in your `packages/backend/src/plugins/catalog.ts` file, or configure
Backstage to use the [github-apps plugin](../../plugins/github-apps.md).

This is true for any method of adding GitHub entities to the catalog, but
especially easy to hit with automatic discovery.
