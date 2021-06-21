---
---
# IdentityApi

The IdentityApi type is defined at
[packages/core-api/src/apis/definitions/IdentityApi.ts:22](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/IdentityApi.ts#L22).

The following Utility API implements this type:
[identityApiRef](./README.md#identity)

## Members

### getUserId()

The ID of the signed in user. This ID is not meant to be presented to the user,
but used as an opaque string to pass on to backends or use in frontend logic.

TODO: The intention of the user ID is to be able to tie the user to an identity
that is known by the catalog and/or identity backend. It should for example be
possible to fetch all owned components using this ID.

<pre>
getUserId(): string
</pre>

### getProfile()

The profile of the signed in user.

<pre>
getProfile(): <a href="#profileinfo">ProfileInfo</a>
</pre>

### getIdToken()

An OpenID Connect ID Token which proves the identity of the signed in user.

The ID token will be undefined if the signed in user does not have a verified
identity, such as a demo user or mocked user for e2e tests.

<pre>
getIdToken(): Promise&lt;string | undefined&gt;
</pre>

### signOut()

Sign out the current user

<pre>
signOut(): Promise&lt;void&gt;
</pre>

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

### ProfileInfo

Profile information of the user.

```ts
export type ProfileInfo = {
  /**
   * Email ID.
   */
  email?: string;

  /**
   * Display name that can be presented to the user.
   */
  displayName?: string;

  /**
   * URL to an avatar image of the user.
   */
  picture?: string;
}
```

Defined at
[packages/core-api/src/apis/definitions/auth.ts:162](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L162).

Referenced by: [getProfile](#getprofile).
