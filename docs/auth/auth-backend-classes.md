---
id: auth-backend-classes
title: Auth backend classes
description: Documentation on Auth backend classes
---

## How Does Authentication Work?

The Backstage application can use various external authentication providers for
authentication. An external provider is wrapped using an
`AuthProviderRouteHandlers` interface for handling authentication. This
interface consists of four methods. Each of these methods is hosted at an
endpoint (by default) `/api/auth/[provider]/method`, where `method` performs a
certain operation as follows:

```
  /auth/[provider]/start -> Initiate a login from the web page
  /auth/[provider]/handler/frame -> Handle a finished authentication operation
  /auth/[provider]/refresh -> Refresh the validity of a login
  /auth/[provider]/logout -> Log out a logged-in user
```

The flow is as follows:

1. A user attempts to sign in.
2. A popup window is opened, pointing to the `auth` endpoint. That endpoint does
   initial preparations and then re-directs the user to an external
   authenticator, still inside the popup.
3. The authenticator validates the user and returns the result of the validation
   (success OR failure), to the wrapper's endpoint (`handler/frame`).
4. The `handler/frame` rendered b´webpage will issue the appropriate response to
   the webpage that opened the popup window, and the popup is closed.
5. The user signs out by clicking on a UI interface and the webpage makes a
   request to logout the user.

There are currently two different classes for two authentication mechanisms that
implement this interface: an `OAuthAdapter` for [OAuth](https://oauth.net/2/)
based mechanisms and a `SAMLAuthProvider` for
[SAML](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html).

If you do not have an `OAuth2` or `SAML` based authentication provider, look in
the section [below](#implementing-your-own-auth-wrapper).

### OAuth Mechanisms

For more information on how these methods are used and for which purpose, refer
to the [OAuth documentation](oauth.md).

Currently OAuth is assumed to be the de facto authentication mechanism for
Backstage based applications.

Backstage comes with a "batteries-included" set of supported commonly used OAuth
providers: Okta, GitHub, Google, GitLab, and a generic OAuth2 provider. For a
list of available providers, look at the available wrappers in
`backstage/plugins/auth-backend/src/providers/`.

All of these use the **authorization flow** of OAuth2 to implement
authentication.

If your authentication provider is any of the above mentioned providers, you can
configure them by setting the right variables in `app-config.yaml` under the
`auth` section.

### SAML

The SAML Provider is currently under development. Additional validation and
profile handling is still required before use in production.

To configure the SAML Auth provider, look at the configuration parameters
supported by
[Passport-SAML](https://github.com/node-saml/passport-saml#config-parameter-details)
under the `auth.providers.saml` key

For security reasons, validate that the response from the IdP is indeed signed
by also providing the `cert` configuration.

### Configuration

Each authentication provider (except SAML) needs six parameters: an OAuth client
ID, a client secret, an authorization endpoint, a token endpoint, an optional
list of scopes (as a string separated by spaces) that may be required by the
OAuth2 Server to enable end-user sign-on, and an app origin. The app origin is
the URL at which the frontend of the application is hosted, and it is read from
the `app.baseUrl` config. This is required because the application opens a popup
window to perform the authentication, and once the flow is completed, the popup
window sends a `postMessage` to the frontend application to indicate the result
of the operation. Also this URL is used to verify that authentication requests
are coming from only this endpoint.

These values are configured via the `app-config.yaml` present in the root of
your app folder.

```
auth:
  providers:
    google:
      development:
        clientId: ${AUTH_GOOGLE_CLIENT_ID}
        clientSecret: ${AUTH_GOOGLE_CLIENT_SECRET}
    github:
      development:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
        enterpriseInstanceUrl: ${AUTH_GITHUB_ENTERPRISE_INSTANCE_URL}
    gitlab:
      development:
        clientId: ${AUTH_GITLAB_CLIENT_ID}
    oauth2:
      development:
        clientId: ${AUTH_OAUTH2_CLIENT_ID}
        clientSecret: ${AUTH_OAUTH2_CLIENT_SECRET}
        authorizationUrl: ${AUTH_OAUTH2_AUTH_URL}
        tokenUrl: ${AUTH_OAUTH2_TOKEN_URL}
        scope: ${AUTH_OAUTH2_SCOPE}
    saml:
      entryPoint: ${AUTH_SAML_ENTRY_POINT}
      issuer: ${AUTH_SAML_ISSUER}
    ...
```

## Implementing Your Own Auth Wrapper

The core interface of any auth wrapper is the `AuthProviderRouteHandlers`
interface. This interface has four methods corresponding to the API described in
the initial section. Any auth wrapper will have to implement this interface.

When initiating a login, a pop-up window is created by the frontend, to allow
the user to initiate a login. This login request is done to the `/start`
endpoint which is handled by the `start` method.

The `start` method re-directs to the external auth provider who authenticates
the request and re-directs the request to the `/frame/handler` endpoint, which
is handled by the `frameHandler` method.

The `frameHandler` returns an HTML response, containing a script that does a
`postMessage` to the frontend's window, containing the result of the request.
The `WebMessageResponse` type is the message sent by the `postMessage` to the
frontend.

A `postMessageResponse` utility function wraps the logic of generating a
`postMessage` response that ensures that CORS is successfully handled. This
function takes an `express.Response`, a `WebMessageResponse` and the URL of the
frontend (`appOrigin`) as parameters and return an HTML page with the script and
the message.

### OAuth Wrapping Interfaces.

Each OAuth external provider is supported by a corresponding
[Passport](https://github.com/jaredhanson/passport) strategy. For a generic
OAuth2 provider, passport has a `passport-oauth2` strategy. The strategy class
handles the implementation details of working with each provider.

Each strategy is wrapped by an `OAuthHandlers` interface.

This interface cannot be directly used as an Express HTTP request handler. To do
so, `OAuthHandlers` are wrapped in an `OAuthAdapter`, which implements the
`AuthProviderRouterHandlers` interface.

#### Env

The concept of an `env` is core to the way the auth backend works. It uses an
`env` query parameter to identify the environment in which the application is
running (`development`, `staging`, `production`, etc). Each runtime can
simultaneously support multiple environments at the same time and the right
handler for each request is identified and dispatched to, based on the `env`
parameter.

`OAuthEnvironmentHandler` is a utility wrapper for an `OAuthHandlers` that
implements the `AuthProviderRouteHandlers` interface while supporting multiple
`env`s.

To instantiate OAuth providers (the same but for different environments), use
`OAuthEnvironmentHandler.mapConfig`. It's a helper to iterate over a
configuration object that is a map of environments to configurations. See one of
the existing OAuth providers for an example of how it is used.

Given the following configuration:

```yaml
development:
  clientId: abc
  clientSecret: secret
production:
  clientId: xyz
  clientSecret: supersecret
```

The `OAuthEnvironmentHandler.mapConfig(config, envConfig => ...)` call will
split the config by the top level `development` and `production` keys, and pass
on each block as `envConfig`.

For convenience, the `AuthProviderFactory` is a factory function that has to be
implemented which can then generate a `AuthProviderRouteHandlers` for a given
provider.

All of the supported providers provide an `AuthProviderFactory` that returns an
`OAuthEnvironmentHandler`, capable of handling authentication for multiple
environments.

### OAuth2 Provider

The `oauth2` provider abstracts a generic **OAuth2 + OIDC** based authentication
provider. What this means is that after the application has been given
permission by the user, the `authorization code` will be exchanged for an
`access_token`, a `refresh_token` and an `id_token`. This `id_token` is used to
obtain an email id of the user, which is then used for creating the session.
