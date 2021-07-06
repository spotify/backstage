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
 * Returns a string with the elapsed time since the start of an operation,
 * with some human friendly precision, e.g. "133ms" or "14.5s".
 *
 * @param startTimestamp The timestamp (from process.hrtime()) at the start ot
 *                       the operation
 */
export function durationText(startTimestamp: [number, number]): string {
  const delta = process.hrtime(startTimestamp);
  const seconds = delta[0] + delta[1] / 1e9;
  if (seconds > 1) {
    return `${seconds.toFixed(1)}s`;
  }
  return `${(seconds * 1000).toFixed(0)}ms`;
}
