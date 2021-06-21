---
---
# ErrorApi

The ErrorApi type is defined at
[packages/core-api/src/apis/definitions/ErrorApi.ts:53](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/ErrorApi.ts#L53).

The following Utility API implements this type: [errorApiRef](./README.md#error)

## Members

### post()

Post an error for handling by the application.

<pre>
post(error: <a href="#error">Error</a>, context?: <a href="#errorcontext">ErrorContext</a>): void
</pre>

### error\$()

Observe errors posted by other parts of the application.

```tsx
error$(): <a href="#observable">Observable</a>&lt;{ error: <a href="#error">Error</a>; context?: <a href="#errorcontext">ErrorContext</a> }&gt;
```

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

### Error

Mirrors the JavaScript Error class, for the purpose of providing documentation
and optional fields.

```ts
type Error = {
  name: string;
  message: string;
  stack?: string;
}
```

Defined at
[packages/core-api/src/apis/definitions/ErrorApi.ts:24](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/ErrorApi.ts#L24).

Referenced by: [post](#post), [error\$](#error).

### ErrorContext

Provides additional information about an error that was posted to the
application.

```tsx
export type ErrorContext = {
  // If set to true, this error should not be displayed to the user. Defaults to false.
  hidden?: boolean;
}
```

Defined at
[packages/core-api/src/apis/definitions/ErrorApi.ts:33](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/ErrorApi.ts#L33).

Referenced by: [post](#post), [error\$](#error).

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

Referenced by: [error\$](#error).

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
