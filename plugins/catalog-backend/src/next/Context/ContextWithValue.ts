/*
 * Copyright 2021 Spotify AB
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

import { Context, ContextKey } from './types';

/**
 * A Context implementation that holds a single value, optionally extending an existing context.
 */
export class ContextWithValue implements Context {
  static create(parent: Context, key: ContextKey<unknown>, value: unknown) {
    return new ContextWithValue(parent, key, value);
  }

  private constructor(
    private readonly parent: Context,
    private readonly key: ContextKey<unknown>,
    private readonly value: unknown,
  ) {}

  getContextValue<T>(key: ContextKey<T>): T {
    if (this.key === key) {
      return this.value as T;
    }
    return this.parent.getContextValue(key);
  }
}
