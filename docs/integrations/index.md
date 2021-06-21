---
id: index
title: Integrations
sidebar_label: Overview
# prettier-ignore: ""
description: Configuring Backstage to read or publish data with external providers using integrations
---

Integrations allow Backstage to read or publish data using external providers
such as GitHub, GitLab, Bitbucket, LDAP, or cloud providers.

## Configuration

Integrations are configured at the root level of `app-config.yaml` since
integrations are used by many Backstage core features and other plugins.

Each key under `integrations` is a separate configuration for a single external
provider. Providers each have different configuration; here's an example of
configuration to use both GitHub and Bitbucket:

```yaml
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}
  bitbucket:
    - host: bitbucket.org
      username: ${BITBUCKET_USERNAME}
      appPassword: ${BITBUCKET_APP_PASSWORD}
```

See documentation for each type of integration for full details on
configuration.
