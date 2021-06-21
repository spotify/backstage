---
---
# StorageApi

The StorageApi type is defined at
[packages/core-api/src/apis/definitions/StorageApi.ts:31](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/StorageApi.ts#L31).

The following Utility API implements this type:
[storageApiRef](./README.md#storage)

## Members

### forBucket()

Create a bucket to store data in.

```tsx
forBucket(name: string): <a href="#storageapi">StorageApi</a>
```

### get()

Get the current value for persistent data, use observe\$ to be notified of
updates.

```tsx
get&lt;T&gt;(key: string): T | undefined
```

### remove()

Remove persistent data.

```tsx
remove(key: string): Promise&lt;void&gt;
```

### set()

Save persistent data, and emit messages to anyone that is using observe\$ for
this key

```tsx
set(key: string, data: any): Promise&lt;void&gt;
```

### observe\$()

Observe changes on a particular key in the bucket

```tsx
observe$&lt;T&gt;(key, string): <a href="#observable">Observable</a>&lt;<a href="#storagevaluechange">StorageValueChange</a>&lt;T&gt;&gt;
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

Referenced by: [observe\$](#observe), [StorageApi](#storageapi).

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

### StorageApi

```tsx
export interface StorageApi {
  /**
   * Create a bucket to store data in.
   * @param {String} name Namespace for the storage to be stored under,
   *                      will inherit previous namespaces too
   */
  forBucket(name: string): StorageApi;

  /**
   * Get the current value for persistent data, use observe$ to be notified of updates.
   *
   * @param {String} key Unique key associated with the data.
   * @return {Object} data The data that should is stored.
   */
  get&lt;T&gt;(key: string): T | undefined;

  /**
   * Remove persistent data.
   *
   * @param {String} key Unique key associated with the data.
   */
  remove(key: string): Promise&lt;void&gt;;

  /**
   * Save persistent data, and emit messages to anyone that is using observe$ for this key
   *
   * @param {String} key Unique key associated with the data.
   */
  set(key: string, data: any): Promise&lt;void&gt;;

  /**
   * Observe changes on a particular key in the bucket
   * @param {String} key Unique key associated with the data
   */
  observe$&lt;T&gt;(key: string): <a href="#observable">Observable</a>&lt;<a href="#storagevaluechange">StorageValueChange</a>&lt;T&gt;&gt;;
}
```

Defined at
[packages/core-api/src/apis/definitions/StorageApi.ts:31](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/StorageApi.ts#L31).

Referenced by: [forBucket](#forbucket).

### StorageValueChange

```tsx
export type StorageValueChange&lt;T = any&gt; = {
  key: string;
  newValue?: T;
}
```

Defined at
[packages/core-api/src/apis/definitions/StorageApi.ts:21](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/StorageApi.ts#L21).

Referenced by: [observe\$](#observe), [StorageApi](#storageapi).

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
