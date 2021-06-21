---
---
# BackstageIdentityApi

The BackstageIdentityApi type is defined at
[packages/core-api/src/apis/definitions/auth.ts:134](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L134).

The following Utility APIs implement this type:

- [auth0AuthApiRef](./README.md#auth0auth)

- [githubAuthApiRef](./README.md#githubauth)

- [gitlabAuthApiRef](./README.md#gitlabauth)

- [googleAuthApiRef](./README.md#googleauth)

- [microsoftAuthApiRef](./README.md#microsoftauth)

- [oauth2ApiRef](./README.md#oauth2)

- [oidcAuthApiRef](./README.md#oidcauth)

- [oktaAuthApiRef](./README.md#oktaauth)

- [oneloginAuthApiRef](./README.md#oneloginauth)

- [samlAuthApiRef](./README.md#samlauth)

## Members

### getBackstageIdentity()

Get the user's identity within Backstage. This should normally not be called
directly, use the @IdentityApi instead.

If the optional flag is not set, a session is guaranteed to be returned, while
if the optional flag is set, the session may be undefined. See
@AuthRequestOptions for more details.

<pre>
getBackstageIdentity(
    options?: <a href="#authrequestoptions">AuthRequestOptions</a>,
  ): Promise&lt;<a href="#backstageidentity">BackstageIdentity</a> | undefined&gt;
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

Referenced by: [getBackstageIdentity](#getbackstageidentity).

### BackstageIdentity

```ts
export type BackstageIdentity = {
  /**
   * The backstage user ID.
   */
  id: string;

  /**
   * An ID token that can be used to authenticate the user within Backstage.
   */
  idToken: string;
}
```

Defined at
[packages/core-api/src/apis/definitions/auth.ts:147](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L147).

Referenced by: [getBackstageIdentity](#getbackstageidentity).
