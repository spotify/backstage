---
---
# OAuthRequestApi

The OAuthRequestApi type is defined at
[packages/core-api/src/apis/definitions/OAuthRequestApi.ts:99](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/OAuthRequestApi.ts#L99).

The following Utility API implements this type:
[oauthRequestApiRef](./README.md#oauthrequest)

## Members

### createAuthRequester()

A utility for showing login popups or similar things, and merging together
multiple requests for different scopes into one request that includes all
scopes.

The passed in options provide information about the login provider, and how to
handle auth requests.

The returned AuthRequester function is used to request login with new scopes.
These requests are merged together and forwarded to the auth handler, as soon as
a consumer of auth requests triggers an auth flow.

See AuthRequesterOptions, AuthRequester, and handleAuthRequests for more info.

<pre>
createAuthRequester&lt;AuthResponse&gt;(
    options: <a href="#authrequesteroptions">AuthRequesterOptions</a>&lt;AuthResponse&gt;,
  ): <a href="#authrequester">AuthRequester</a>&lt;AuthResponse&gt;
</pre>

### authRequest\$()

Observers pending auth requests. The returned observable will emit all current
active auth request, at most one for each created auth requester.

Each request has its own info about the login provider, forwarded from the auth
requester options.

Depending on user interaction, the request should either be rejected, or used to
trigger the auth handler. If the request is rejected, all pending AuthRequester
calls will fail with a "RejectedError". If a auth is triggered, and the auth
handler resolves successfully, then all currently pending AuthRequester calls
will resolve to the value returned by the onAuthRequest call.

<pre>
authRequest$(): <a href="#observable">Observable</a>&lt;<a href="#pendingauthrequest">PendingAuthRequest</a>[]&gt;
</pre>

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

### AuthProvider

Information about the auth provider that we're requesting a login towards.

This should be shown to the user so that they can be informed about what login
is being requested before a popup is shown.

```ts
export type AuthProvider = {
  /**
   * Title for the auth provider, for example "GitHub"
   */
  title: string;

  /**
   * Icon for the auth provider.
   */
  icon: IconComponent;
}
```

Defined at
[packages/core-api/src/apis/definitions/OAuthRequestApi.ts:27](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/OAuthRequestApi.ts#L27).

Referenced by: [AuthRequesterOptions](#authrequesteroptions),
[PendingAuthRequest](#pendingauthrequest).

### AuthRequester

Function used to trigger new auth requests for a set of scopes.

The returned promise will resolve to the same value returned by the
onAuthRequest in the AuthRequesterOptions. Or rejected, if the request is
rejected.

This function can be called multiple times before the promise resolves. All
calls will be merged into one request, and the scopes forwarded to the
onAuthRequest will be the union of all requested scopes.

<pre>
export type AuthRequester&lt;AuthResponse&gt; = (
  scopes: Set&lt;string&gt;,
) =&gt; Promise&lt;AuthResponse&gt;
</pre>

Defined at
[packages/core-api/src/apis/definitions/OAuthRequestApi.ts:66](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/OAuthRequestApi.ts#L66).

Referenced by: [createAuthRequester](#createauthrequester).

### AuthRequesterOptions

Describes how to handle auth requests. Both how to show them to the user, and
what to do when the user accesses the auth request.

```tsx
export type AuthRequesterOptions&lt;AuthResponse&gt; = {
  /**
   * Information about the auth provider, which will be forwarded to auth requests.
   */
  provider: <a href="#authprovider">AuthProvider</a>;

  /**
   * Implementation of the auth flow, which will be called synchronously when
   * trigger() is called on an auth requests.
   */
  onAuthRequest(scopes: Set&lt;string&gt;): Promise&lt;AuthResponse&gt;;
}
```

Defined at
[packages/core-api/src/apis/definitions/OAuthRequestApi.ts:43](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/OAuthRequestApi.ts#L43).

Referenced by: [createAuthRequester](#createauthrequester).

### Observable

Observable sequence of values and errors, see TC39.

https://github.com/tc39/proposal-observable

This is used as a common return type for observable values and can be created
using many different observable implementations, such as zen-observable or
RxJS 5.

```tsx
export type Observable&lt;T&gt; = {
  /**
   * Subscribes to this observable to start receiving new values.
   */
  subscribe(observer: <a href="#observer">Observer</a>&lt;T&gt;): <a href="#subscription">Subscription</a>;
  subscribe(
    onNext: (value: T) =&gt; void,
    onError?: (error: Error) =&gt; void,
    onComplete?: () =&gt; void,
  ): <a href="#subscription">Subscription</a>;
}
```

Defined at
[packages/core-api/src/types.ts:53](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/types.ts#L53).

Referenced by: [authRequest\$](#authrequest).

### Observer

This file contains non-react related core types used throughout Backstage.

Observer interface for consuming an Observer, see TC39.

```ts
export type Observer&lt;T&gt; = {
  next?(value: T): void;
  error?(error: Error): void;
  complete?(): void;
}
```

Defined at
[packages/core-api/src/types.ts:24](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/types.ts#L24).

Referenced by: [Observable](#observable).

### PendingAuthRequest

An pending auth request for a single auth provider. The request will remain in
this pending state until either reject() or trigger() is called.

Any new requests for the same provider are merged into the existing pending
request, meaning there will only ever be a single pending request for a given
provider.

```tsx
export type PendingAuthRequest = {
  /**
   * Information about the auth provider, as given in the AuthRequesterOptions
   */
  provider: <a href="#authprovider">AuthProvider</a>;

  /**
   * Rejects the request, causing all pending AuthRequester calls to fail with "RejectedError".
   */
  reject: () =&gt; void;

  /**
   * Trigger the auth request to continue the auth flow, by for example showing a popup.
   *
   * Synchronously calls onAuthRequest with all scope currently in the request.
   */
  trigger(): Promise&lt;void&gt;;
}
```

Defined at
[packages/core-api/src/apis/definitions/OAuthRequestApi.ts:77](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/OAuthRequestApi.ts#L77).

Referenced by: [authRequest\$](#authrequest).

### Subscription

Subscription returned when subscribing to an Observable, see TC39.

```ts
export type Subscription = {
  /**
   * Cancels the subscription
   */
  unsubscribe(): void;

  /**
   * Value indicating whether the subscription is closed.
   */
  readonly closed: Boolean;
}
```

Defined at
[packages/core-api/src/types.ts:33](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/types.ts#L33).

Referenced by: [Observable](#observable).
