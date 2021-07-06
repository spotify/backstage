---
id: using-auth
title: Using authentication and identity
description: How to use authentication and identity in Backstage
---

The Auth APIs in Backstage identify the user, and provide a way for plugins to
request access to 3rd party services on behalf of the user (OAuth). This
documentation focuses on the implementation of that solution and how to extend
it.

### Accessing Third Party Services

The main pattern for talking to third party services in Backstage is
user-to-server requests, where short-lived OAuth Access Tokens are requested by
plugins to authenticate calls to external services. These calls can be made
either directly to the services or through a backend plugin or service.

By relying on user-to-server calls we keep the coupling between the frontend and
backend low, and provide a much lower barrier for plugins to make use of third
party services. This is in comparison to for example a session-based system,
where access tokens are stored server-side. Such a solution would require a much
deeper coupling between the auth backend plugin, its session storage, and other
backend plugins or separate services. A goal of Backstage is to make it as easy
as possible to create new plugins, and an auth solution based on user-to-server
OAuth helps in that regard.

The method with which frontend plugins request access to third party services is
through [Utility APIs](../api/utility-apis.md) for each service provider. For a
full list of providers, see the
[Utility API References](../reference/utility-apis/README.md).

### Identity - WIP

> NOTE: Identity management and the `SignInPage` in Backstage is NOT a method
> for blocking access for unauthorized users, that either requires additional
> backend implementation or a separate service like Google's Identity-Aware
> Proxy. The identity system only serves to provide a personalized experience
> and access to a Backstage Identity Token, which can be passed to backend
> plugins.

Identity management is still work in progress, but there are already a couple of
pieces in place that can be used.

#### Identity for Plugin Developers

As a plugin developer, there are two main touchpoints for identities: the
`IdentityApi` exported by `@backstage/core-plugin-api` via the `identityApiRef`,
and a not yet existing middleware exported by `@backstage/backend-common`.

The `IdentityApi` gives access to the signed-in user's identity in the frontend.
It provides access to the user's ID, lightweight profile information, and an ID
token used to make authenticated calls within Backstage.

The middleware that will be provided by `@backstage/backend-common` allows
verification of Backstage ID tokens, and optionally loading additional
information about the user. The progress is tracked in
https://github.com/backstage/backstage/issues/1435.

#### Identity for App Developers

If you're setting up your own Backstage app, or want to add a new identity
provider, there are three touchpoints: the frontend auth APIs in
`@backstage/core-app-api` and `@backstage/core-plugin-api`, the backend auth
providers in `auth-backend`, and the `SignInPage` component configured in the
Backstage app via `createApp`.

The frontend APIs and backend providers are tightly coupled together for each
auth provider, and together they implement an e2e auth flow. Only some auth
providers also act as identity providers though. For example, at the moment of
writing, the Google Auth provider is able to act as a Backstage identity
provider, but the GitHub one can not. For an auth provider to also act as an
identity provider, it needs to implement the `BackstageIdentityApi` in the
frontend, and in the backend it needs to return a `BackstageIdentity` structure.

It is up to each provider to implement the mapping between a provider identity
and the corresponding Backstage identity. That is currently still work in
progress, and as a stop-gap for example the Google provider returns the local
part of the user's email as the user ID.

The final piece of the puzzle is the `SignInPage` component that can be
configured as part of the app. Without a sign-in page, Backstage will fall back
to a `guest` identity for all users, without any ID token. To enable sign-in, a
`SignInPage` needs to be configured, which in turn has to supply a user to the
app. The `@backstage/core-components` package provides a basic sign-in page that
allows both the user and the app developer to choose between a couple of
different sign-in methods, or to designate a single provider that may also be
logged in to automatically.

## Further Reading

More details are provided in dedicated sections of the documentation.

- [OAuth](./oauth.md): Description of the generic OAuth flow implemented by the
  [auth-backend](https://github.com/backstage/backstage/tree/master/plugins/auth-backend).
- [Glossary](./glossary.md): Glossary of some common terms related to the auth
  flows.
