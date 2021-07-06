/*
 * Copyright 2021 The Backstage Authors
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

import { JsonObject } from '@backstage/config';
import {
  deserializeError as deserializeErrorInternal,
  serializeError as serializeErrorInternal,
} from 'serialize-error';

/**
 * The serialized form of an Error.
 */
export type SerializedError = JsonObject & {
  /** The name of the exception that was thrown */
  name: string;
  /** The message of the exception that was thrown */
  message: string;
  /** A stringified stack trace; may not be present */
  stack?: string;
  /** A custom code (not necessarily the same as an HTTP response code); may not be present */
  code?: string;
};

/**
 * Serializes an error object to a JSON friendly form.
 *
 * @param error The error
 * @param options.includeStackTraces: Include stack trace in the output (default false)
 */
export function serializeError(
  error: Error,
  options?: { includeStack?: boolean },
): SerializedError {
  const serialized = serializeErrorInternal(error);
  const result: SerializedError = {
    name: 'Unknown',
    message: '<no reason given>',
    ...serialized,
  };

  if (!options?.includeStack) {
    delete result.stack;
  }

  return result;
}

/**
 * Deserializes a serialized error object back to an Error.
 */
export function deserializeError<T extends Error = Error>(
  data: SerializedError,
): T {
  const result = deserializeErrorInternal(data) as T;
  if (!data.stack) {
    result.stack = undefined;
  }
  return result;
}
