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

import { KeyStore, AnyJWK, StoredKey } from './types';
import { DateTime } from 'luxon';

export class MemoryKeyStore implements KeyStore {
  private readonly keys = new Map<string, { createdAt: Date; key: string }>();

  async addKey(key: AnyJWK): Promise<void> {
    this.keys.set(key.kid, {
      createdAt: DateTime.utc().toJSDate(),
      key: JSON.stringify(key),
    });
  }

  async removeKeys(kids: string[]): Promise<void> {
    for (const kid of kids) {
      this.keys.delete(kid);
    }
  }

  async listKeys(): Promise<{ items: StoredKey[] }> {
    return {
      items: Array.from(this.keys).map(([, { createdAt, key: keyStr }]) => ({
        createdAt,
        key: JSON.parse(keyStr),
      })),
    };
  }
}
