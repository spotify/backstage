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

import { Observable } from '@backstage/core-plugin-api';
import ObservableImpl from 'zen-observable';

// TODO(Rugvip): These are stopgap and probably incomplete implementations of subjects.
// If we add a more complete Observables library they should be replaced.

/**
 * A basic implementation of ReactiveX publish subjects.
 *
 * A subject is a convenient way to create an observable when you want
 * to fan out a single value to all subscribers.
 *
 * See http://reactivex.io/documentation/subject.html
 */
export class PublishSubject<T>
  implements Observable<T>, ZenObservable.SubscriptionObserver<T> {
  private isClosed = false;
  private terminatingError?: Error;

  private readonly observable = new ObservableImpl<T>(subscriber => {
    if (this.isClosed) {
      if (this.terminatingError) {
        subscriber.error(this.terminatingError);
      } else {
        subscriber.complete();
      }
      return () => {};
    }

    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  });

  private readonly subscribers = new Set<
    ZenObservable.SubscriptionObserver<T>
  >();

  [Symbol.observable]() {
    return this;
  }

  get closed() {
    return this.isClosed;
  }

  next(value: T) {
    if (this.isClosed) {
      throw new Error('PublishSubject is closed');
    }
    this.subscribers.forEach(subscriber => subscriber.next(value));
  }

  error(error: Error) {
    if (this.isClosed) {
      throw new Error('PublishSubject is closed');
    }
    this.isClosed = true;
    this.terminatingError = error;
    this.subscribers.forEach(subscriber => subscriber.error(error));
  }

  complete() {
    if (this.isClosed) {
      throw new Error('PublishSubject is closed');
    }
    this.isClosed = true;
    this.subscribers.forEach(subscriber => subscriber.complete());
  }

  subscribe(observer: ZenObservable.Observer<T>): ZenObservable.Subscription;
  subscribe(
    onNext: (value: T) => void,
    onError?: (error: any) => void,
    onComplete?: () => void,
  ): ZenObservable.Subscription;
  subscribe(
    onNext: ZenObservable.Observer<T> | ((value: T) => void),
    onError?: (error: any) => void,
    onComplete?: () => void,
  ): ZenObservable.Subscription {
    const observer =
      typeof onNext === 'function'
        ? {
            next: onNext,
            error: onError,
            complete: onComplete,
          }
        : onNext;

    return this.observable.subscribe(observer);
  }
}

/**
 * A basic implementation of ReactiveX behavior subjects.
 *
 * A subject is a convenient way to create an observable when you want
 * to fan out a single value to all subscribers.
 *
 * The BehaviorSubject will emit the most recently emitted value or error
 * whenever a new observer subscribes to the subject.
 *
 * See http://reactivex.io/documentation/subject.html
 */
export class BehaviorSubject<T>
  implements Observable<T>, ZenObservable.SubscriptionObserver<T> {
  private isClosed = false;
  private currentValue: T;
  private terminatingError?: Error;

  constructor(value: T) {
    this.currentValue = value;
  }

  private readonly observable = new ObservableImpl<T>(subscriber => {
    if (this.isClosed) {
      if (this.terminatingError) {
        subscriber.error(this.terminatingError);
      } else {
        subscriber.complete();
      }
      return () => {};
    }

    subscriber.next(this.currentValue);

    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  });

  private readonly subscribers = new Set<
    ZenObservable.SubscriptionObserver<T>
  >();

  [Symbol.observable]() {
    return this;
  }

  get closed() {
    return this.isClosed;
  }

  next(value: T) {
    if (this.isClosed) {
      throw new Error('BehaviorSubject is closed');
    }
    this.currentValue = value;
    this.subscribers.forEach(subscriber => subscriber.next(value));
  }

  error(error: Error) {
    if (this.isClosed) {
      throw new Error('BehaviorSubject is closed');
    }
    this.isClosed = true;
    this.terminatingError = error;
    this.subscribers.forEach(subscriber => subscriber.error(error));
  }

  complete() {
    if (this.isClosed) {
      throw new Error('BehaviorSubject is closed');
    }
    this.isClosed = true;
    this.subscribers.forEach(subscriber => subscriber.complete());
  }

  subscribe(observer: ZenObservable.Observer<T>): ZenObservable.Subscription;
  subscribe(
    onNext: (value: T) => void,
    onError?: (error: any) => void,
    onComplete?: () => void,
  ): ZenObservable.Subscription;
  subscribe(
    onNext: ZenObservable.Observer<T> | ((value: T) => void),
    onError?: (error: any) => void,
    onComplete?: () => void,
  ): ZenObservable.Subscription {
    const observer =
      typeof onNext === 'function'
        ? {
            next: onNext,
            error: onError,
            complete: onComplete,
          }
        : onNext;

    return this.observable.subscribe(observer);
  }
}
