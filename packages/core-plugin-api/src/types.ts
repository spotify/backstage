/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains non-react related core types used throughout Backstage.
 */

/**
 * Observer interface for consuming an Observer, see TC39.
 */
export type Observer<T> = {
  next?(value: T): void;
  error?(error: Error): void;
  complete?(): void;
};

/**
 * Subscription returned when subscribing to an Observable, see TC39.
 */
export type Subscription = {
  /**
   * Cancels the subscription
   */
  unsubscribe(): void;

  /**
   * Value indicating whether the subscription is closed.
   */
  readonly closed: boolean;
};

// Declares the global well-known Symbol.observable
// We get the actual runtime polyfill from zen-observable
declare global {
  interface SymbolConstructor {
    readonly observable: symbol;
  }
}

/**
 * Observable sequence of values and errors, see TC39.
 *
 * https://github.com/tc39/proposal-observable
 *
 * This is used as a common return type for observable values and can be created
 * using many different observable implementations, such as zen-observable or RxJS 5.
 */
export type Observable<T> = {
  [Symbol.observable](): Observable<T>;

  /**
   * Subscribes to this observable to start receiving new values.
   */
  subscribe(observer: Observer<T>): Subscription;
  subscribe(
    onNext?: (value: T) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void,
  ): Subscription;
};
