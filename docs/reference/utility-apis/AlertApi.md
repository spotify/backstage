---
---
# AlertApi

The AlertApi type is defined at
[packages/core-api/src/apis/definitions/AlertApi.ts:29](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/AlertApi.ts#L29).

The following Utility API implements this type: [alertApiRef](./README.md#alert)

## Members

### post()

Post an alert for handling by the application.

```tsx
post(alert: <a href="#alertmessage">AlertMessage</a>): void
```

### alert\$()

Observe alerts posted by other parts of the application.

<pre>
alert$(): <a href="#observable">Observable</a>&lt;<a href="#alertmessage">AlertMessage</a>&gt;
</pre>

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

### AlertMessage

```tsx
export type AlertMessage = {
  message: string;
  // Severity will default to success since that is what material ui defaults the value to.
  severity?: 'success' | 'info' | 'warning' | 'error';
}
```

Defined at
[packages/core-api/src/apis/definitions/AlertApi.ts:19](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/AlertApi.ts#L19).

Referenced by: [post](#post), [alert\$](#alert).

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

Referenced by: [alert\$](#alert).

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
