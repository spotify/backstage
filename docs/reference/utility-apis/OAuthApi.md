---
---
# OAuthApi

The OAuthApi type is defined at
[packages/core-api/src/apis/definitions/auth.ts:67](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L67).

The following Utility APIs implement this type:

- [githubAuthApiRef](./README.md#githubauth)

- [gitlabAuthApiRef](./README.md#gitlabauth)

- [googleAuthApiRef](./README.md#googleauth)

- [microsoftAuthApiRef](./README.md#microsoftauth)

- [oauth2ApiRef](./README.md#oauth2)

- [oidcAuthApiRef](./README.md#oidcauth)

- [oktaAuthApiRef](./README.md#oktaauth)

- [oneloginAuthApiRef](./README.md#oneloginauth)

## Members

### getAccessToken()

Requests an OAuth 2 Access Token, optionally with a set of scopes. The access
token allows you to make requests on behalf of the user, and the copes may grant
you broader access, depending on the auth provider.

Each auth provider has separate handling of scope, so you need to look at the
documentation for each one to know what scope you need to request.

This method is cheap and should be called each time an access token is used. Do
not for example store the access token in React component state, as that could
cause the token to expire. Instead fetch a new access token for each request.

Be sure to include all required scopes when requesting an access token. When
testing your implementation it is best to log out the Backstage session and then
visit your plugin page directly, as you might already have some required scopes
in your existing session. Not requesting the correct scopes can lead to 403 or
other authorization errors, which can be tricky to debug.

If the user has not yet granted access to the provider and the set of requested
scopes, the user will be prompted to log in. The returned promise will not
resolve until the user has successfully logged in. The returned promise can be
rejected, but only if the user rejects the login request.

<pre>
getAccessToken(
    scope?: <a href="#oauthscope">OAuthScope</a>,
    options?: <a href="#authrequestoptions">AuthRequestOptions</a>,
  ): Promise&lt;string&gt;
</pre>

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

### AuthRequestOptions

```ts
export type AuthRequestOptions = {
  /**
   * If this is set to true, the user will not be prompted to log in,
   * and an empty response will be returned if there is no existing session.
   *
   * This can be used to perform a check whether the user is logged in, or if you don't
   * want to force a user to be logged in, but provide functionality if they already are.
   *
   * @default false
   */
  optional?: boolean;

  /**
   * If this is set to true, the request will bypass the regular oauth login modal
   * and open the login popup directly.
   *
   * The method must be called synchronously from a user action for this to work in all browsers.
   *
   * @default false
   */
  instantPopup?: boolean;
}
```

Defined at
[packages/core-api/src/apis/definitions/auth.ts:40](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L40).

Referenced by: [getAccessToken](#getaccesstoken).

### OAuthScope

This file contains declarations for common interfaces of auth-related APIs. The
declarations should be used to signal which type of authentication and
authorization methods each separate auth provider supports.

For example, a Google OAuth provider that supports OAuth 2 and OpenID Connect,
would be declared as follows:

const googleAuthApiRef = createApiRef<OAuthApi & OpenIDConnectApi>({ ... })

An array of scopes, or a scope string formatted according to the auth provider,
which is typically a space separated list.

See the documentation for each auth provider for the list of scopes supported by
each provider.

<pre>
export type OAuthScope = string | string[]
</pre>

Defined at
[packages/core-api/src/apis/definitions/auth.ts:38](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L38).

Referenced by: [getAccessToken](#getaccesstoken).
