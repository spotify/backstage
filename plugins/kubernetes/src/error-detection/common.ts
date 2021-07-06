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
  DetectedError,
  ErrorDetectable,
  ErrorDetectableKind,
  ErrorMapper,
} from './types';

// Run through the each error mapper for each object
// returning a deduplicated (mostly) result
export const detectErrorsInObjects = <T extends ErrorDetectable>(
  objects: T[],
  kind: ErrorDetectableKind,
  clusterName: string,
  errorMappers: ErrorMapper<T>[],
): DetectedError[] => {
  // Build up a map of errors
  // key: the joined message produced by an error
  // value: the error
  const errors = new Map<string, DetectedError>();

  for (const object of objects) {
    for (const errorMapper of errorMappers) {
      if (errorMapper.errorExists(object)) {
        const message = errorMapper.messageAccessor(object);

        // TODO This is not perfect as errors with uuid/hashes/date/times will not be caught by this
        const dedupKey = message.join('');

        const value = errors.get(dedupKey);

        const name = object.metadata?.name ?? 'unknown';

        if (value !== undefined) {
          // This gets translated into the Chip "+5 others"
          // in the ErrorReporting component
          // but we need to keep the names so we can easily
          // find which objects owns the error later
          value.names.push(name);
          errors.set(dedupKey, value);
        } else {
          errors.set(dedupKey, {
            cluster: clusterName,
            kind: kind,
            names: [name],
            message: message,
            severity: errorMapper.severity,
          });
        }
      }
    }
  }

  return Array.from(errors.values());
};
