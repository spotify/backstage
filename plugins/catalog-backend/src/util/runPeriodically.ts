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
 * Runs a function repeatedly, with a fixed wait between invocations.
 *
 * Supports async functions, and silently ignores exceptions and rejections.
 *
 * @param fn The function to run. May return a Promise.
 * @param delayMs The delay between a completed function invocation and the
 *                next.
 * @returns A function that, when called, stops the invocation loop.
 */
export function runPeriodically(fn: () => any, delayMs: number): () => void {
  let cancel: () => void;
  let cancelled = false;
  const cancellationPromise = new Promise<void>(resolve => {
    cancel = () => {
      resolve();
      cancelled = true;
    };
  });

  const startRefresh = async () => {
    while (!cancelled) {
      try {
        await fn();
      } catch {
        // ignore intentionally
      }

      await Promise.race([
        new Promise(resolve => setTimeout(resolve, delayMs)),
        cancellationPromise,
      ]);
    }
  };
  startRefresh();

  return cancel!;
}
