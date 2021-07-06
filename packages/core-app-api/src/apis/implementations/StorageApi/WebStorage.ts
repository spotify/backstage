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
import {
  StorageApi,
  StorageValueChange,
  ErrorApi,
  Observable,
} from '@backstage/core-plugin-api';
import ObservableImpl from 'zen-observable';

const buckets = new Map<string, WebStorage>();

export type CreateStorageApiOptions = {
  errorApi: ErrorApi;
  namespace?: string;
};

export class WebStorage implements StorageApi {
  constructor(
    private readonly namespace: string,
    private readonly errorApi: ErrorApi,
  ) {}

  static create(options: CreateStorageApiOptions): WebStorage {
    return new WebStorage(options.namespace ?? '', options.errorApi);
  }

  get<T>(key: string): T | undefined {
    try {
      const storage = JSON.parse(localStorage.getItem(this.getKeyName(key))!);
      return storage ?? undefined;
    } catch (e) {
      this.errorApi.post(
        new Error(`Error when parsing JSON config from storage for: ${key}`),
      );
    }

    return undefined;
  }

  forBucket(name: string): WebStorage {
    const bucketPath = `${this.namespace}/${name}`;
    if (!buckets.has(bucketPath)) {
      buckets.set(bucketPath, new WebStorage(bucketPath, this.errorApi));
    }
    return buckets.get(bucketPath)!;
  }

  async set<T>(key: string, data: T): Promise<void> {
    localStorage.setItem(this.getKeyName(key), JSON.stringify(data, null, 2));
    this.notifyChanges({ key, newValue: data });
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(this.getKeyName(key));
    this.notifyChanges({ key, newValue: undefined });
  }

  observe$<T>(key: string): Observable<StorageValueChange<T>> {
    return this.observable.filter(({ key: messageKey }) => messageKey === key);
  }

  private getKeyName(key: string) {
    return `${this.namespace}/${encodeURIComponent(key)}`;
  }

  private notifyChanges<T>(message: StorageValueChange<T>) {
    for (const subscription of this.subscribers) {
      subscription.next(message);
    }
  }

  private subscribers = new Set<
    ZenObservable.SubscriptionObserver<StorageValueChange>
  >();

  private readonly observable = new ObservableImpl<StorageValueChange>(
    subscriber => {
      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    },
  );
}
