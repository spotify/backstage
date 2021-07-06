---
id: locations
title: Azure DevOps Locations
sidebar_label: Locations
# prettier-ignore
description: Integrating source code stored in Azure DevOps into the Backstage catalog
---

The Azure DevOps integration supports loading catalog entities from Azure
DevOps. Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

```yaml
integrations:
  azure:
    - host: dev.azure.com
      token: ${AZURE_TOKEN}
```

> Note: An Azure DevOps provider is added automatically at startup for
> convenience, so you only need to list it if you want to supply a
> [token](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate).

The configuration is a structure with two elements:

- `host`: The DevOps host; only `dev.azure.com` is supported.
- `token` (optional): A personal access token as expected by Azure DevOps.
