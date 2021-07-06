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

type BucketData = { [key in string]: string };

export class StorageBucket implements Storage {
  private static noPropAccessProxyHandler: ProxyHandler<StorageBucket> = {
    get(target, prop) {
      if (prop in target) {
        return target[prop as any];
      }
      throw new Error(
        'Direct property access is not allowed for StorageBuckets',
      );
    },
    set() {
      throw new Error(
        'Direct property access is not allowed for StorageBuckets',
      );
    },
  };

  static forStorage(storage: Storage, bucket: string) {
    const storageBucket = new StorageBucket(storage, bucket);
    return new Proxy(storageBucket, StorageBucket.noPropAccessProxyHandler);
  }

  static forLocalStorage(bucket: string): StorageBucket {
    return StorageBucket.forStorage(localStorage, bucket);
  }

  private constructor(
    private readonly storage: Storage,
    private readonly bucket: string,
  ) {}

  [name: string]: any;

  get length(): number {
    throw new Error('Method not implemented.');
  }

  clear(): void {
    this.storage.removeItem(this.bucket);
  }

  getItem(key: string): string | null {
    return this.read()?.[key] ?? null;
  }

  key(): never {
    throw new Error('Method not implemented.');
  }

  removeItem(key: string): void {
    const data = this.read();
    if (!data) {
      return;
    }

    if (key in data) {
      delete data[key];
      this.write(data);
    }
  }

  setItem(key: string, value: string): void {
    const data = this.read() ?? {};
    data[key] = value;
    this.write(data);
  }

  private read(): BucketData | undefined {
    const bucketValue = this.storage.getItem(this.bucket);
    if (!bucketValue) {
      return undefined;
    }

    try {
      return JSON.parse(bucketValue);
    } catch {
      return undefined;
    }
  }

  private write(data: BucketData) {
    this.storage.setItem(this.bucket, JSON.stringify(data));
  }
}
