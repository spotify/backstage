---
id: locations
title: Bitbucket Locations
sidebar_label: Locations
# prettier-ignore: ""
description: Integrating source code stored in Bitbucket into the Backstage catalog
---

The Bitbucket integration supports loading catalog entities from bitbucket.org
or a self-hosted Bitbucket. Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

```yaml
integrations:
  bitbucket:
    - host: bitbucket.org
      token: ${BITBUCKET_TOKEN}
```

> Note: A public Bitbucket provider is added automatically at startup for
> convenience, so you only need to list it if you want to supply a
> [token](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html).

Directly under the `bitbucket` key is a list of provider configurations, where
you can list the Bitbucket providers you want to fetch data from. Each entry is
a structure with up to four elements:

- `host`: The host of the Bitbucket instance, e.g. `bitbucket.company.com`.
- `token` (optional): An personal access token as expected by Bitbucket. Either
  an access token **or** a username + appPassword may be supplied.
- `username`: The Bitbucket username to use in API requests. If neither a
  username nor token are supplied, anonymous access will be used.
- `appPassword` (optional): The password for the Bitbucket user. Only needed
  when using `username` instead of `token`.
- `apiBaseUrl` (optional): The URL of the Bitbucket API. For self-hosted
  installations, it is commonly at `https://<host>/rest/api/1.0`. For
  bitbucket.org, this configuration is not needed as it can be inferred.

> Note: If you are using Bitbucket server you MUST set the username as well as
> the token or appPassword.
