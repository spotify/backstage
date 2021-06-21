---
---
# OpenIdConnectApi

The OpenIdConnectApi type is defined at
[packages/core-api/src/apis/definitions/auth.ts:99](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L99).

The following Utility APIs implement this type:

- [auth0AuthApiRef](./README.md#auth0auth)

- [googleAuthApiRef](./README.md#googleauth)

- [microsoftAuthApiRef](./README.md#microsoftauth)

- [oauth2ApiRef](./README.md#oauth2)

- [oidcAuthApiRef](./README.md#oidcauth)

- [oktaAuthApiRef](./README.md#oktaauth)

- [oneloginAuthApiRef](./README.md#oneloginauth)

## Members

### getIdToken()

Requests an OpenID Connect ID Token.

This method is cheap and should be called each time an ID token is used. Do not
for example store the id token in React component state, as that could cause the
token to expire. Instead fetch a new id token for each request.

If the user has not yet logged in to Google inside Backstage, the user will be
prompted to log in. The returned promise will not resolve until the user has
successfully logged in. The returned promise can be rejected, but only if the
user rejects the login request.

```tsx
getIdToken(options?: <a href="#authrequestoptions">AuthRequestOptions</a>): Promise&lt;string&gt;
```

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

Referenced by: [getIdToken](#getidtoken).
