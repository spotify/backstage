---
---
# SessionApi

The SessionApi type is defined at
[packages/core-api/src/apis/definitions/auth.ts:190](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L190).

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

### signIn()

Sign in with a minimum set of permissions.

```tsx
signIn(): Promise&lt;void&gt;
```

### signOut()

Sign out from the current session. This will reload the page.

```tsx
signOut(): Promise&lt;void&gt;
```

### sessionState\$()

Observe the current state of the auth session. Emits the current state on
subscription.

```tsx
sessionState$(): <a href="#observable">Observable</a>&lt;<a href="#sessionstate">SessionState</a>&gt;
```

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

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

Referenced by: [sessionState\$](#sessionstate).

### Observer

This file contains non-react related core types used throughout Backstage.

Observer interface for consuming an Observer, see TC39.

```tsx
export type Observer&lt;T&gt; = {
  next?(value: T): void;
  error?(error: Error): void;
  complete?(): void;
}
```

Defined at
[packages/core-api/src/types.ts:24](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/types.ts#L24).

Referenced by: [Observable](#observable).

### SessionState

Session state values passed to subscribers of the SessionApi.

```tsx
export enum SessionState {
  SignedIn = 'SignedIn',
  SignedOut = 'SignedOut',
}
```

Defined at
[packages/core-api/src/apis/definitions/auth.ts:182](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L182).

Referenced by: [sessionState\$](#sessionstate).

### Subscription

Subscription returned when subscribing to an Observable, see TC39.

```tsx
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
