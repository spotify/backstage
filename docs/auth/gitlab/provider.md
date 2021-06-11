---
id: provider
title: GitLab Authentication Provider
sidebar_label: GitLab
description: Adding GitLab OAuth as an authentication provider in Backstage
---

The Backstage `core-api` package comes with a GitLab authentication provider
that can authenticate users using GitLab OAuth.

## Create an OAuth App on GitLab

To support GitLab authentication, you must create an Application from the
[GitLab settings](https://gitlab.com/-/profile/applications). The `Redirect URI`
should point to your Backstage backend auth handler.

Settings for local development:

- Name: Backstage (or your custom app name)
- Redirect URI: `http://localhost:7000/api/auth/gitlab/handler/frame`
- Scopes: read_user

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    gitlab:
      development:
        clientId: ${AUTH_GITLAB_CLIENT_ID}
        clientSecret: ${AUTH_GITLAB_CLIENT_SECRET}
        ## uncomment if using self-hosted GitLab
        # audience: https://gitlab.company.com
```

The GitLab provider is a structure with three configuration keys:

- `clientId`: The Application ID that you generated on GitLab, e.g.
  `4928c033ab3d592845c044a653bc20583baf84f2e67b954c6fdb32a532ab76c9`
- `clientSecret`: The Application secret
- `audience` (optional): The base URL for the self-hosted GitLab instance, e.g.
  `https://gitlab.company.com`

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `gitlabAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#adding-the-provider-to-the-sign-in-page).
