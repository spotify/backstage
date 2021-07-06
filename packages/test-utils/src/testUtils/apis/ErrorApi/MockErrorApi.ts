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

import { ErrorApi, ErrorContext, Observable } from '@backstage/core-plugin-api';

type Options = {
  collect?: boolean;
};

type ErrorWithContext = {
  error: Error;
  context?: ErrorContext;
};

type Waiter = {
  pattern: RegExp;
  resolve: (err: ErrorWithContext) => void;
};

const nullObservable = {
  subscribe: () => ({ unsubscribe: () => {}, closed: true }),

  [Symbol.observable]() {
    return this;
  },
};

export class MockErrorApi implements ErrorApi {
  private readonly errors = new Array<ErrorWithContext>();
  private readonly waiters = new Set<Waiter>();

  constructor(private readonly options: Options = {}) {}

  post(error: Error, context?: ErrorContext) {
    if (this.options.collect) {
      this.errors.push({ error, context });

      for (const waiter of this.waiters) {
        if (waiter.pattern.test(error.message)) {
          this.waiters.delete(waiter);
          waiter.resolve({ error, context });
        }
      }

      return;
    }

    throw new Error(`MockErrorApi received unexpected error, ${error}`);
  }

  error$(): Observable<{ error: Error; context?: ErrorContext }> {
    return nullObservable;
  }

  getErrors(): ErrorWithContext[] {
    return this.errors;
  }

  waitForError(
    pattern: RegExp,
    timeoutMs: number = 2000,
  ): Promise<ErrorWithContext> {
    return new Promise<ErrorWithContext>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Timed out waiting for error'));
      }, timeoutMs);

      this.waiters.add({ resolve, pattern });
    });
  }
}
