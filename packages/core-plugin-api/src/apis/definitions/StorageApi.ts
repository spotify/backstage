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

import { ApiRef, createApiRef } from '../system';
import { Observable } from '../../types';

export type StorageValueChange<T = any> = {
  key: string;
  newValue?: T;
};

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
  get<T>(key: string): T | undefined;

  /**
   * Remove persistent data.
   *
   * @param {String} key Unique key associated with the data.
   */
  remove(key: string): Promise<void>;

  /**
   * Save persistent data, and emit messages to anyone that is using observe$ for this key
   *
   * @param {String} key Unique key associated with the data.
   */
  set(key: string, data: any): Promise<void>;

  /**
   * Observe changes on a particular key in the bucket
   * @param {String} key Unique key associated with the data
   */
  observe$<T>(key: string): Observable<StorageValueChange<T>>;
}

export const storageApiRef: ApiRef<StorageApi> = createApiRef({
  id: 'core.storage',
});
