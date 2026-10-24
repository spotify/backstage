/*
 * Copyright 2026 The Backstage Authors
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
  errorId,
  FieldErrorProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';
import { Text } from '@backstage/ui';

export default function FieldErrorTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ errors = [], idSchema }: FieldErrorProps<T, S, F>) {
  if (errors.length === 0) {
    return null;
  }

  const id = errorId<T>(idSchema);

  return (
    <div id={id} role="alert" aria-live="polite">
      {errors.map((error, i) => (
        <Text key={i} as="div" variant="body-small" color="danger">
          {error}
        </Text>
      ))}
    </div>
  );
}
